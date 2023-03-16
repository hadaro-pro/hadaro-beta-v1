import { client } from "../../utils/client";
import { statusOfCollectionsQuery } from "../../utils/queries";

export default async function handler(req, res) {
  try {
    const { status } = req.body;

    // console.log('xv: ',  status)

    const query = statusOfCollectionsQuery(status);

    const data = await client.fetch(query);

    return res.status(200).json(data);
    //  return res.send(response.data)
  } catch (err) {
    res.send(err);
  }
}
