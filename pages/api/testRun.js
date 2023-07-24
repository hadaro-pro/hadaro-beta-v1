import axios from "axios"

export default async function handler(req, res) {

  const config = {
    headers: {
      Accept: "application/json",
      "HADARO-API-Key": 'uK3Iy6S5RVUVkvMXi55u',
    },
  }; 
 
  const collectionAddress = '0x63dea3a99ade19ed72eec7dfd735296237ca5e76'
  const lenderAddr = '0x0b8ad9582c257ac029e335788017dcb1de5fbe21'

 const resp = await axios.get(`http://localhost:3000/api/v1/lendings/${collectionAddress}?lenderAddress=${lenderAddr}`, config)

 res.send(resp.data) 
}
