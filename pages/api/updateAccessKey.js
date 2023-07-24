import bcrypt from "bcrypt";
import { client } from "../../utils/client";

const saltRounds = process.env.NEXT_PUBLIC_SALT_ROUNDS;

export default async function handler(req, res) {
  const { id, createdKey } = req.body;

  const hashedPass = bcrypt.hashSync(createdKey, Number(saltRounds));

  client
    .patch(id) // Document ID to patch
    .set({ apiKey: hashedPass, apiKeyCreationDate: Date.now() }) // Shallow merge
    .commit() // Perform the patch and return a promise
    .then((updatedDoc) => {
      // console.log(updatedDoc)
      // res.send(updatedDoc);
      return res.send({
        status: "success",
        msg: updatedDoc,
      });
    })
    .catch((err) => {
      res.send(err);
    });
}
