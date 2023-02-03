import { client } from "../../utils/client";

export default async function handler(req, res) {
  try {
    // const query =  allNftDataQuery()
    // const data = await client.fetch(query)

    const document = req.body;

   const result =  await client.create(document);

    return res.status(200).json({
      msg: "success",
      data: result
    });
  } catch (err) {
    res.send(err);
  }
}