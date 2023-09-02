import bcrypt from "bcrypt";
import Web3 from "web3";
import { client } from "../../../../utils/client";
import {
  getCollectionByCollectionAddr,
  allRentingNftsByColAddressQuery,
  singleRentingNftByColAddressQuery,
} from "../../../../utils/queries";
import {
  parsePaymentToken,
  parseStandards,
} from "../../../../utils/eventsDecoder";
import { unpackPrice } from "@renft/sdk";

export default async function handler(req, res) {
  try{
  const { collectionAddress, renterAddress } = req.query;
  // console.log(renterAddress)
  const query = getCollectionByCollectionAddr(collectionAddress);

  const dataFromDB = await client.fetch(query);

  if (!req.headers["accept"] || req.headers["accept"] !== "application/json")
    res.send({
      error:
        "The request did not come with the Accept: application/json header. Please specify the header to receive JSON data in the response.",
    });

  if (!dataFromDB[0].apiKey)
    res.send({
      error: "No API Key associated with this collection!",
    });

  const compare = bcrypt.compareSync(
    req.headers["hadaro-api-key"],
    dataFromDB[0].apiKey
  );

  if (!compare)
    res.send({
      error: "Invalid API Key!",
    });

    if(!renterAddress) {
      const query2 = allRentingNftsByColAddressQuery(collectionAddress);

      const dataFromDB2 = await client.fetch(query2);
      // console.log(dataFromDB2);
    
      let arrayToSend = [];
    
      dataFromDB2.forEach((item) => {
        const objToSend = {
          renter_address: item.renterAddress,
          lender_address: item.lenderAddress,
          chain: item.chain,
          status: item.status,
          lending_id: item.lendingID,
          renting_id: item.rentingID,
          time_of_rent: item.timeOfRent,
          days_for_rent: item.noOfRentDays,
          claimed_rent_status: item.isRentClaimed,
          token_id: item.tokenID,
          token_standard: parseStandards(item.nftStandard),
          rental_price: unpackPrice(item.price),
          item_payment_token: parsePaymentToken(item.paymentToken),
        };
        arrayToSend.push(objToSend);
      });
    
      res.send({ message: "success", data: arrayToSend });
    } else {
      const query3 = singleRentingNftByColAddressQuery(collectionAddress, renterAddress);

      const dataFromDB3 = await client.fetch(query3);
      // console.log(dataFromDB3);

      if(dataFromDB3.length === 0) res.send({error: 'renter address does not exist!'})
        const item = dataFromDB3[0]
        let newObj = []
        if (dataFromDB3.length > 1) {
          dataFromDB3.forEach((item) => {
            const objToSend = {
              renter_address: item.renterAddress,
              lender_address: item.lenderAddress,
              chain: item.chain,
              status: item.status,
              lending_id: item.lendingID,
              renting_id: item.rentingID,
              time_of_rent: item.timeOfRent,
              days_for_rent: item.noOfRentDays,
              claimed_rent_status: item.isRentClaimed,
              token_id: item.tokenID,
              token_standard: parseStandards(item.nftStandard),
              rental_price: unpackPrice(item.price),
              item_payment_token: parsePaymentToken(item.paymentToken),
            }
            newObj.push(objToSend)
          })
          res.send({ message: "success", data: newObj });
        } else {
          const objToSend = {
            renter_address: item.renterAddress,
            lender_address: item.lenderAddress,
            chain: item.chain,
            status: item.status,
            lending_id: item.lendingID,
            renting_id: item.rentingID,
            time_of_rent: item.timeOfRent,
            days_for_rent: item.noOfRentDays,
            claimed_rent_status: item.isRentClaimed,
            token_id: item.tokenID,
            token_standard: parseStandards(item.nftStandard),
            rental_price: unpackPrice(item.price),
            item_payment_token: parsePaymentToken(item.paymentToken),
          }
        res.send({ message: "success", data: objToSend });
        }
    }
  } catch(err) {
    res.send(err)
  }
}
