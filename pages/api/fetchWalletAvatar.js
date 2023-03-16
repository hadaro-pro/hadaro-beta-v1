import { client } from "../../utils/client";
import { walletAvatarQuery } from "../../utils/queries";

export default async function handler(req, res) {
  try {
    const { walletAddr } = req.body;

    // console.log('xv: ',  walletAddr)

    const query = walletAvatarQuery(walletAddr);

    const data = await client.fetch(query);

    return res.status(200).json(data);
    //  return res.send(response.data)
  } catch (err) {
    res.send(err);
  }
}
