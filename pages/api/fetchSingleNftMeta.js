import Moralis from "moralis";
import { moralisApiKey } from "../../creds";

export default async function handler(req, res) {
  await Moralis.start({ apiKey: moralisApiKey });

  try {
    const { tokenAddr, tokenID, chain } = req.query;

    const response = await Moralis.EvmApi.nft.getNFTMetadata({
      address: tokenAddr,
      chain: chain,
      tokenId: tokenID,
    });

    return res.send(response);
  } catch (err) {
    res.send(err);
  }
}
