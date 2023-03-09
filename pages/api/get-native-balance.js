import Moralis from 'moralis'
import { moralisApiKey } from '../../creds'





export default async function handler(req, res) {
    await Moralis.start({ apiKey: moralisApiKey })

    const {  walletaddr, chain  } = req.query

    try {
      
        const response = await Moralis.EvmApi.balance.getNativeBalance({
          address: walletaddr,
          chain: chain
        })

        const nativeBalance = response.data

       return res.send(nativeBalance)
    } catch(err) {
        res.send(err)
    }
} 
