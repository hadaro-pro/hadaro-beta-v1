import { client } from "../../utils/client";

export default async function handler(req, res) {
  const { iden, image } = req.body;

  client
    .patch(iden) // Document ID to patch
    .set({ collectionImage: image }) // Shallow merge
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


