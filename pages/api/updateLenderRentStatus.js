import { client } from "../../utils/client";

export default async function handler(req, res) {
  const { identity, renterAddr, rentClaimedStatus, itemStatus, itemTxnType } =
    req.body;

  client
    .patch(identity) // Document ID to patch
    .set({
      renterAddress: renterAddr,
      isRentClaimed: rentClaimedStatus,
      status: itemStatus,
      transactionType: itemTxnType,
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
