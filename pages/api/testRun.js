import axios from "axios"

export default async function handler(req, res) {

  const config = {
    headers: {
      Accept: "application/json",
      "HADARO-API-Key": 'hUWanC1DIeykzyhXXuzE',
    },
  }; 
 
  const collectionAddress = '0x63dea3a99ade19ed72eec7dfd735296237ca5e76'

  const lenderAddr = '0x0b8ad9582c257ac029e335788017dcb1de5fbe21'

  const renterAddr = '0x5f5232f44f207f7e2ef68a6598465ee05e917a91'

 const resp = await axios.get(`https://hadaro.io/api/v1/rentings/${collectionAddress}?renterAddress=${renterAddr}`, config)

 res.send(resp.data) 
} 