import { client } from "../../utils/client";
import { allRentedNftsByAddressQuery } from "../../utils/queries";

export default async function handler(req, res) {
  const { addr } = req.body;

  try {
    // console.log(address)
    const query = allRentedNftsByAddressQuery(addr);

    const data = await client.fetch(query);

    return res.status(200).json(data);
    //  return res.send(response.data)
  } catch (err) {
    res.send(err);
  }
}
