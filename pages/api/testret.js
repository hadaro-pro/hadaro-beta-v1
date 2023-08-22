import { client } from "../../utils/client";
import { testQuery } from "../../utils/queries";

export default async function handler(req, res) {
  

  const {no} = req.query

  try {
    const query = testQuery(no);

    const data = await client.fetch(query);

    return res.status(200).json(data);
    //  return res.send(response.data)
  } catch (err) {
    res.send(err);
  }
}
