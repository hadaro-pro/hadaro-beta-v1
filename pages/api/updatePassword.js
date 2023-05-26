import bcrypt from "bcrypt";
import { client } from "../../utils/client";

const saltRounds = process.env.NEXT_PUBLIC_SALT_ROUNDS;

export default async function handler(req, res) {
  const { id, password } = req.body;

  const hashedPass = bcrypt.hashSync(password, Number(saltRounds));

  client
    .patch(id) // Document ID to patch
    .set({ password: hashedPass }) // Shallow merge
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
