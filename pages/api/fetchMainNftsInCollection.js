import { client } from "../../utils/client";
import { allMainNftsByCollectionQuery } from "../../utils/queries";

export default async function handler(req, res) {
  try {
    const { contractAddr } = req.body;

    //  console.log(contractAddr)

    const query = allMainNftsByCollectionQuery(contractAddr);

    const data = await client.fetch(query);

    return res.status(200).json(data);
    //  return res.send(response.data)
  } catch (err) {
    res.send(err);
  }
}
