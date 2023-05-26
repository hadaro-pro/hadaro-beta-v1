import bcrypt from "bcrypt";

export default async function handler(req, res) {
  const { fetchedPassword, password } = req.body;

  const compare = bcrypt.compareSync(password, fetchedPassword);

  return res.status(200).json({
    status: "success",
    msg: compare,
  });
}
