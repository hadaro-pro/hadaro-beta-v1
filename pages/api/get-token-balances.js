import Moralis from 'moralis'
import { moralisApiKey } from '../../creds'





export default async function handler(req, res) {
    await Moralis.start({ apiKey: moralisApiKey })

    try {
        const {  walletaddr, chain  } = req.query
        const response = await Moralis.EvmApi.token.getWalletTokenBalances({
          address: walletaddr,
          chain: chain
        })

       return res.send(response.data)
    } catch(err) {
        res.send(err)
    }
} 
