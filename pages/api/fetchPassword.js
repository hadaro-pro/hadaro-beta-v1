import { client } from "../../utils/client";
import { siteDataQuery } from "../../utils/queries";

export default async function handler(req, res) {
  try {
    const query = siteDataQuery();

    const data = await client.fetch(query);

    return res.status(200).json(data);
    //  return res.send(response.data)
  } catch (err) {
    res.send(err);
  }
}
