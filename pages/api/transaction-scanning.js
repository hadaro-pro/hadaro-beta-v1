import Moralis from "moralis";
import axios from "axios";
import { client } from "../../utils/client";
import { etherscanApiKey, moralisApiKey } from "../../creds";
import {
  decodeLendingTxnData,
  parseStandards,
  nftImageAggregating,
  decodeRentingTxnData,
  decodeStopLendingTxnData,
  decodeClaimRentTxnData,
  decodeStopRentTxnData,
} from "../../utils/eventsDecoder";
import Web3 from "web3";
import {
  nftByLendingIDQuery,
  nftByOnlyLendingIDQuery,
  nftByRentingIDQuery,
  getItemCollectionCountQuery,
} from "../../utils/queries";
import moment from "moment";
// import {
//   getColandDecreaseItemCount,
//   getColandIncreaseItemCount,
// } from "../../utils/helpers";
const cron = require("node-cron");
const web3 = new Web3(
  Web3.givenProvider || "ws://some.local-or-remote.node:8546"
);

cron.schedule("*/3 * * * *", async function () {
  console.log("running a task every 3 minute");
  await getData();
  console.log("process ended till next turn");
});

const chain = "0x5";

const getData = async () => {
  await Moralis.start({ apiKey: moralisApiKey });

  const config = {
    headers: {
      accept: "application/json",
      "X-API-Key": moralisApiKey,
    },
  };

  // const requestUrl_currentBlock = `https://api-goerli.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=${etherscanApiKey}`;

  //   const response_currentBlock = await axios.get(requestUrl_currentBlock);

  // console.log(web3.utils.hexToNumber(response_currentBlock.data.result))

  const unix_timeStamp = moment(Date.now()).subtract(5, "minutes").unix();

  console.log(unix_timeStamp);

  const requestUrl_blockNo = `https://api-goerli.etherscan.io/api?module=block&action=getblocknobytime&timestamp=${unix_timeStamp}&closest=before&apikey=${etherscanApiKey}`;

  const response_blockNo = await axios.get(requestUrl_blockNo);

  const estimatedBlock = response_blockNo.data.result;

  console.log(estimatedBlock);

  const addr = "0x79D7037704883a5B4404Ee25404242a30D92E60e";
  const chain = "0x5";

  if (estimatedBlock === "Error! No closest block found") {
    console.log("no work to do");
  } else {
    const requestUrl_Logs = `https://api-goerli.etherscan.io/api?module=logs&action=getLogs&address=${addr}&fromBlock=${estimatedBlock}&page=1&offset=1000&apikey=${etherscanApiKey}`;

    // console.log("xvroyte", requestUrl_Logs);

    // // &fromBlock=12878196

    const response_Logs = await axios.get(requestUrl_Logs);

    console.log(response_Logs.data.result.length);

    if (response_Logs.data.result.length === 0) {
      console.log("no transactions found this time");
    } else {
      // console.log(response_Logs.data.result);

      const currTime = moment(Date.now()).unix();

      for (let index = 0; index < response_Logs.data.result.length; index++) {
        const timeStamp = web3.utils.hexToNumber(
          response_Logs.data.result[index].timeStamp
        );
        // console.log(response_Logs.data.result[index]);
        if (currTime >= timeStamp + 2 * 60) {
          console.log(`txn with index of ${index} will be processed`);
          await parseLendingLogs(
            response_Logs.data.result[index],
            response_Logs.data.result[index - 1]
          );
        } else {
          console.log(`txn with index of ${index} is not mature yet`);
        }
      }
    }
  }

  // const currentIndex = 14;
  // const currentItem = response_Logs.data.result[currentIndex];

  // await parseLendingLogs(
  //   response_Logs.data.result[currentIndex],
  //   response_Logs.data.result[currentIndex - 1]
  // );
};

const parseLendingLogs = async (item, prev) => {
  try {
    await Moralis.start({ apiKey: moralisApiKey });

    const config = {
      headers: {
        accept: "application/json",
        "X-API-Key": moralisApiKey,
      },
    };

    const mainEvent = item;

    const dataToDecode = mainEvent?.data;

    const topicsToLog = {
      topic1: mainEvent.topics[1],
      topic2: mainEvent.topics[2],
      topic3: mainEvent.topics[3],
    };

    const gottenStats = decodeLendingTxnData(dataToDecode, topicsToLog);

    const query = nftByOnlyLendingIDQuery(gottenStats.lendingID);

    const dataFromDB = await client.fetch(query);

    // console.log('length of gotten data', dataFromDB.length)

    if (dataFromDB.length === 0) {
      const metaDataResponse = await axios.get(
        `https://deep-index.moralis.io/api/v2/nft/${gottenStats.nftAddress}/${gottenStats.tokenID}?chain=${chain}&format=decimal`,
        config
      );

      const nftStandard = parseStandards(metaDataResponse?.data?.contract_type);

      const parseMetadata = JSON.parse(metaDataResponse?.data?.metadata);

      const objToSaveToDB = {
        nftAddress: gottenStats.nftAddress.toLowerCase(),
        tokenID: gottenStats.tokenID,
        chain: chain,
        lenderAddress: gottenStats.lenderAddress,
        price: gottenStats.dailyRentPrice,
        paymentToken: gottenStats.paymentToken,
        maxDuration: Number(gottenStats.maxRentDuration),
        transactionType: "lending",
        status: "available",
        lendTransactionHash: mainEvent.transactionHash,
        metadataName: parseMetadata.name,
        metadataDesc: parseMetadata.description,
        metadataImage: nftImageAggregating(parseMetadata.image),
        nftStandard: nftStandard,
        lendingID: gottenStats.lendingID,
        entryDate: moment(Date.now()).unix(),
        entryBlock: web3.utils.hexToNumber(item.blockNumber),
        lendAmount: gottenStats.lendAmount,
      };

      const document = {
        // for test
        _type: "testBlockNftData",
        ...objToSaveToDB,
      };

      const sendToDB = await client.create(document);

      if (sendToDB) {
        console.log("added new item to DB");

        const query = getItemCollectionCountQuery(document.nftAddress);

        const dataFromDB = await client.fetch(query);
        // console.log("collection data", dataFromDB);

        const filterDrafts = dataFromDB.filter(
          (item) =>
            item.collectionAddress.toLowerCase() ===
              document.nftAddress.toLowerCase() && !item._id?.includes("drafts")
        );
        const itemId = filterDrafts[0]?._id;

        const itemCount = filterDrafts[0]?.itemCount;
        // console.log('item count: ', itemCount)
        // console.log('item id: ', itemId)

        let finalValue;

        if (itemCount === null) {
          finalValue = 0;
        } else {
          finalValue = Number(itemCount);
        }

        const valueToSend = String(finalValue + 1);
        console.log("final: ", valueToSend);

        const count = valueToSend;

        //Error! No closest block found

        client
          .patch(itemId) // Document ID to patch
          .set({ itemCount: count }) // Shallow merge
          .commit() // Perform the patch and return a promise
          .then((updatedDoc) => {
            // console.log("update col count success", updatedDoc);
          })
          .catch((err) => {
            console.log(err);
          });
      }

      // console.log(sendToDB);
    } else {
      console("nothing to show here");
    }
    // console.log(document);
  } catch (err) {
    console.log("error for lending");
    await parseRentingLogs(item, prev);
  }
};

const parseRentingLogs = async (item, prev) => {
  try {
    const mainEvent = item;

    const dataToDecode = mainEvent?.data;

    const topicsToLog = {
      topic1: mainEvent.topics[1],
      topic2: mainEvent.topics[2],
      topic3: mainEvent.topics[3],
    };

    // // &fromBlock=12878196
    const gottenStats = decodeRentingTxnData(dataToDecode, topicsToLog);

    const query = nftByLendingIDQuery(gottenStats.lendingID);

    const dataFromDB = await client.fetch(query);

    if (dataFromDB.length !== 0) {
      // update details
      // console.log(dataFromDB[0]?._id);
      const identity = dataFromDB[0]?._id;
      client
        .patch(identity) // Document ID to patch
        .set({
          renterAddress: gottenStats.renterAddress,
          rentTransactionHash: mainEvent.transactionHash,
          rentingID: gottenStats.rentingID,
          rentAmount: gottenStats.rentAmount,
          noOfRentDays: Number(gottenStats.rentDuration),
          timeOfRent: Number(gottenStats.rentedAt),
          isRentClaimed: "not yet",
          status: "in rent",
          transactionType: "lending renting",
        }) // Shallow merge
        .commit() // Perform the patch and return a promise
        .then((updatedDoc) => {
          console.log("rent update successful");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("nothing happens");
    }
    // console.log(dataFromDB);
  } catch (err) {
    console.log("something went wrong for renting");
    await parseStopLendingLogs(item, prev);
  }
};

const parseStopLendingLogs = async (item, prev) => {
  try {
    const mainEvent = item;

    const dataToDecode = mainEvent?.data;

    const topicsToLog = {
      topic1: mainEvent.topics[1],
    };
    const gottenStats = decodeStopLendingTxnData(dataToDecode, topicsToLog);

    // console.log("stop lending parts", gottenStats);
    const query1 = nftByLendingIDQuery(gottenStats.lendingID);
    const dataFromDB_lending = await client.fetch(query1);

    if (dataFromDB_lending.length !== 0) {
      // update details
      // console.log(dataFromDB_lending[0]?._id);
      const identity = dataFromDB_lending[0]?._id;
      const colAddr = dataFromDB_lending[0]?.nftAddress;
      client
        .patch(identity) // Document ID to patch
        .set({
          stopLendTime: Number(gottenStats.stoppedAt),
          status: "non-available",
          transactionType: "previousListed for lending",
        }) // Shallow merge
        .commit() // Perform the patch and return a promise
        .then((updatedDoc) => {
          console.log("stop lend update successful");
        })
        .catch((err) => {
          console.log(err);
        });

      const query = getItemCollectionCountQuery(colAddr);

      const dataFromDB = await client.fetch(query);
      console.log("collection data", dataFromDB);

      const filterDrafts = dataFromDB.filter(
        (item) =>
          item.collectionAddress.toLowerCase() === colAddr.toLowerCase() &&
          !item._id?.includes("drafts")
      );
      const itemId = filterDrafts[0]?._id;

      const itemCount = filterDrafts[0]?.itemCount;
      // console.log('item count: ', itemCount)
      // console.log('item id: ', itemId)

      let finalValue;

      if (itemCount === null) {
        finalValue = 0;
      } else {
        finalValue = Number(itemCount);
      }

      const valueToSend = String(finalValue - 1);
      // console.log('final: ', valueToSend)

      if (valueToSend === "-1") {
        const count = "0";

        client
          .patch(itemId) // Document ID to patch
          .set({ itemCount: count }) // Shallow merge
          .commit() // Perform the patch and return a promise
          .then((updatedDoc) => {
            console.log("col update success");
          })
          .catch((err) => {
            console.log(err);
          });
        // console.log('res0: ', patchItem.data)
      } else {
        const count = valueToSend;
        client
          .patch(itemId) // Document ID to patch
          .set({ itemCount: count }) // Shallow merge
          .commit() // Perform the patch and return a promise
          .then((updatedDoc) => {
            console.log("col update success");
          })
          .catch((err) => {
            console.log(err);
          });

        // console.log('res1: ', patchItem.data)
      }
    } else if (item?.transactionHash === prev?.transactionHash) {
      // abi parses lendingID as rentingID because of similar structure is stopLend, claimRent, and stopRent
      const query2 = nftByRentingIDQuery(gottenStats.lendingID);
      const dataFromDB_renting = await client.fetch(query2);

      const identity = dataFromDB_renting[0]?._id;
      const rentTime = dataFromDB_renting[0]?.timeOfRent;
      const rentDays = dataFromDB_renting[0]?.noOfRentDays;
      // console.log("rent time", rentTime);
      // console.log("rent days", rentDays);
      const now = moment(Date.now()).unix();
      if (now >= rentTime + rentDays * 24 * 60 * 60) {
        console.log("claim rent");
        await parseClaimRentLogs(item, identity);
      } else if (now < rentTime + rentDays * 24 * 60 * 60) {
        console.log("stop rent");
        await parseStopRentLogs(item, identity);
      }
    } else {
      console.log("nothing to see here");
    }

    // console.log("curr", item?.transactionHash);
    // console.log("prev", prev?.transactionHash);
  } catch (err) {
    console.log("something went wrong for stop lending");
  }
};

const parseClaimRentLogs = async (item, iden) => {
  try {
    const mainEvent = item;

    const dataToDecode = mainEvent?.data;

    const topicsToLog = {
      topic1: mainEvent.topics[1],
    };
    const gottenStats = decodeClaimRentTxnData(dataToDecode, topicsToLog);

    // console.log(gottenStats);
    if (gottenStats.collectedAt) {
      console.log("claimed rent duties");
      client
        .patch(iden) // Document ID to patch
        .set({
          claimRentTime: Number(gottenStats.collectedAt),
          stopLendTime: Number(gottenStats.collectedAt),
          isRentClaimed: "already claimed",
          status: "non-available",
          transactionType: "previousListed for lending",
        }) // Shallow merge
        .commit() // Perform the patch and return a promise
        .then((updatedDoc) => {
          console.log("claim rent update successful");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  } catch (err) {
    console.log("something went wrong for claim rent");
  }
};

const parseStopRentLogs = async (item, iden) => {
  try {
    const mainEvent = item;

    const dataToDecode = mainEvent?.data;

    const topicsToLog = {
      topic1: mainEvent.topics[1],
    };
    const gottenStats = decodeStopRentTxnData(dataToDecode, topicsToLog);

    // console.log(gottenStats);
    if (gottenStats.stoppedAt) {
      console.log("stopped rent duties");
      client
        .patch(iden) // Document ID to patch
        .set({
          stopRentTime: Number(gottenStats.stoppedAt),
          stopLendTime: Number(gottenStats.stoppedAt),
          status: "non-available",
          transactionType: "previousListed for lending",
        }) // Shallow merge
        .commit() // Perform the patch and return a promise
        .then((updatedDoc) => {
          console.log("stop rent update successful");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  } catch (err) {
    console.log("something went wrong for stop renting");
  }
};

// getData();

const formattedExpiry = moment(Number(1687531435 * 1000))
  .add(0, "days")
  .format();

const formattedTime = new Date(formattedExpiry).getTime();

export default async function handler(req, res) {
  res.send({ message: moment(Date.now()).unix() });
  // await Moralis.start({ apiKey: moralisApiKey });

  // const config = {
  //   headers: {
  //     accept: "application/json",
  //     "X-API-Key": moralisApiKey,
  //   },
  // };

  // try {
  //   // const { transactionHash, chain } = req.query;
  //   // const transactionHash = "0x9d4aead4430de8eca29985e03d1e7ac9208aec4e703e7972b3e82004d6967764"

  //   const addr = "0x79D7037704883a5B4404Ee25404242a30D92E60e";
  //   const chain = "0x5";

  //   const requestUrl = `https://api-goerli.etherscan.io/api?module=logs&action=getLogs&address=${addr}&page=1&offset=1000&apikey=${etherscanApiKey}`;

  //   const response = await axios.get(requestUrl);

  //   const mainEvent1 = response.data.result[0];
  //   const mainEvent2 = response.data.result[2];

  //   // const dataToDecode = mainEvent?.data;

  //   // const topicsToLog = {
  //   //   topic1: mainEvent.topics[1],
  //   //   topic2: mainEvent.topics[2],
  //   //   topic3: mainEvent.topics[3],
  //   // };

  //   // // &fromBlock=12878196
  //   // const gottenStats = decodeLendingTxnData(dataToDecode, topicsToLog);

  //   // const metaDataResponse = await axios.get(
  //   //   `https://deep-index.moralis.io/api/v2/nft/${gottenStats.nftAddress}/${gottenStats.tokenID}?chain=${chain}&format=decimal`,
  //   //   config
  //   // );

  //   // const nftStandard = parseStandards(metaDataResponse.data.contract_type);

  //   // const parseMetadata = JSON.parse(metaDataResponse.data.metadata);

  //   // const objToSaveToDB = {
  //   //   nftAddress: gottenStats.nftAddress,
  //   //   tokenID: gottenStats.tokenID,
  //   //   chain: chain,
  //   //   lenderAddress: gottenStats.lenderAddress,
  //   //   price: gottenStats.dailyRentPrice,
  //   //   paymentToken: gottenStats.paymentToken,
  //   //   maxDuration: gottenStats.maxRentDuration,
  //   //   transactionType: "lending",
  //   //   status: "available",
  //   //   lendTransactionHash: mainEvent.transactionHash,
  //   //   metadataName: parseMetadata.name,
  //   //   metadataDesc: parseMetadata.description,
  //   //   metadataImage: nftImageAggregating(parseMetadata.image),
  //   //   nftStandard: nftStandard,
  //   //   lendingID: gottenStats.lendingID
  //   // };
  //   // console.log(gottenStats)
  //   res.send({mainEvent1, mainEvent2});
  // } catch (err) {
  //   res.send({
  //     message: "error",
  //     data: err,
  //   });
  // }
}

// for lending (occurs once) (newly checked)
// nftAddress+, tokenID+, chain+, lenderAddress+, price+, paymentToken+, maxDuration+, transactionType+,  status+, metadataName+, metadataDesc+, metadataImage+, nftStandard+, lendTransactionHash+

// store nftAddress, lenderAddress, renterAddress, tokenID, chain, price, paymentToken, maxDuration, transactionType, status, metadataImage, metadataDesc, metadataName, nftStandard, nftCollectionName, noOfRentDays, timeOfRent, isRentClaimed, lendTransactionHash, rentTransactionHash

// for lending (occurs once) (newly checked)
// nftAddress+, tokenID+, chain+, lenderAddress+, price+, paymentToken+, maxDuration+, transactionType+,  status+, metadataName, metadataDesc, metadataImage, nftStandard, lendTransactionHash+

// for rent (occurs once) (newly checked)
// status++, transactionType++, noOfRentDays++, timeOfRent++, renterAddress++, rentTransactionHash++, isRentClaimed++, rentingID++, rentAmount++

// for claim rent (occurs twice) 1st stoplend, 2nd rent claimed (newly checked)
// renterAddress, status, transactionType, isRentClaimed

// for stop lend  (occurs once) (newly checked)
//  transactionType++, status++, stopLendTime++

// for stop rent (occurs twice) 1st stop lend  2nd stop rent (newly checked)
// transactionType++, status++, timeOfRent++
//
//
//
//
//
