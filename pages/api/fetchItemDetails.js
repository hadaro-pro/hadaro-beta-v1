import { client } from "../../utils/client";
import { getItemDetailsQuery } from "../../utils/queries";

export default async function handler(req, res) {
  try {
    const { id } = req.body;

    // console.log('xv: ',  id)

    const query = getItemDetailsQuery(id);

    const data = await client.fetch(query);

    return res.status(200).json(data);
    //  return res.send(response.data)
  } catch (err) {
    res.send(err);
  }
}
