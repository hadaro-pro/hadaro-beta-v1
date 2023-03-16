import { client } from "../../utils/client";
import {
  allCollectionsQuery,
  allTestCollectionsQuery,
} from "../../utils/queries";

export default async function handler(req, res) {
  try {
    // const query =  allCollectionsQuery()

    const query = allTestCollectionsQuery();

    const data = await client.fetch(query);

    return res.status(200).json(data);
    //  return res.send(response.data)
  } catch (err) {
    res.send(err);
  }
}
