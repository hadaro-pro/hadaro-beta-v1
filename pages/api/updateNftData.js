import { client } from "../../utils/client";

export default async function handler(req, res) {
  const {
    identity,
    type,
    noOfRentDays,
    timeOfRent,
    status,
    renterAddress,
    rentTxnHash,
    rentClaimedStatus,
  } = req.body;

  client
    .patch(identity) // Document ID to patch
    .set({
      transactionType: type,
      noOfRentDays: noOfRentDays,
      timeOfRent: timeOfRent,
      status: status,
      renterAddress: renterAddress,
      rentTransactionHash: rentTxnHash,
      isRentClaimed: rentClaimedStatus,
    }) // Shallow merge
    .commit() // Perform the patch and return a promise
    .then((updatedDoc) => {
      return res.status(200).json({
        status: "success",
        msg: updatedDoc,
      });
    })
    .catch((err) => {
      res.send(err);
    });
}
