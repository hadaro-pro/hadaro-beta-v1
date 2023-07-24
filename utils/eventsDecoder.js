import Web3 from "web3";
const web3 = new Web3(
  Web3.givenProvider || "ws://some.local-or-remote.node:8546"
);

export const nftImageAggregating = (image) => {
  let imageToDisplay;
  if (image?.includes(".")) {
    imageToDisplay = image;
  } else {
    imageToDisplay = "https://ipfs.moralis.io:2053/ipfs/" + image;
  }

  if (image?.includes("https://") || image?.includes("data:image/")) {
    imageToDisplay = image;
  } else {
    let splicer = image?.slice(7);
    imageToDisplay = "https://gateway.ipfscdn.io/ipfs/" + splicer;
  }

  return imageToDisplay;
};

export const parseStandards = (value) => {
  if (value === "ERC721") {
    return "0";
  }
  if (value === "ERC1155") {
    return "1";
  }
};

export const parsePaymentToken = (value) => {
  if (value === "1") return "WETH";
  if (value === "2") return "DAI";
  if (value === "3") return "USDC";
  if (value === "4") return "USDT";
};
export const decodeLendingTxnData = (dataSource, topicsObj) => {
  const { topic1, topic2, topic3 } = topicsObj;

  const res = web3.eth.abi.decodeLog(
    [
      {
        indexed: false,
        internalType: "bool",
        name: "is721",
        type: "bool",
      },
      {
        indexed: true,
        internalType: "address",
        name: "lenderAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "nftAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "lendingID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "maxRentDuration",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "bytes4",
        name: "dailyRentPrice",
        type: "bytes4",
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "lendAmount",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "enum IResolver.PaymentToken",
        name: "paymentToken",
        type: "uint8",
      },
    ],
    dataSource,
    [topic1, topic2, topic3]
  );

  return res;
};

export const decodeRentingTxnData = (dataSource, topicsObj) => {
  const { topic1, topic2, topic3 } = topicsObj;

  const res = web3.eth.abi.decodeLog(
    [
      {
        indexed: true,
        internalType: "address",
        name: "renterAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "lendingID",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "rentingID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "rentAmount",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "rentDuration",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "rentedAt",
        type: "uint32",
      },
    ],
    dataSource,
    [topic1, topic2, topic3]
  );

  return res;
};

export const decodeStopLendingTxnData = (dataSource, topicsObj) => {
  const { topic1 } = topicsObj;

  const res = web3.eth.abi.decodeLog(
    [
      {
        indexed: true,
        internalType: "uint256",
        name: "lendingID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "stoppedAt",
        type: "uint32",
      },
    ],
    dataSource,
    [topic1]
  );

  return res;
};

export const decodeClaimRentTxnData = (dataSource, topicsObj) => {
  const { topic1 } = topicsObj;

  const res = web3.eth.abi.decodeLog(
    [
      {
        indexed: true,
        internalType: "uint256",
        name: "rentingID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "collectedAt",
        type: "uint32",
      },
    ],
    dataSource,
    [topic1]
  );

  return res;
};

export const decodeStopRentTxnData = (dataSource, topicsObj) => {
  const { topic1 } = topicsObj;

  const res = web3.eth.abi.decodeLog(
    [
      {
        indexed: true,
        internalType: "uint256",
        name: "rentingID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "stoppedAt",
        type: "uint32",
      },
    ],
    dataSource,
    [topic1]
  );

  return res;
};
