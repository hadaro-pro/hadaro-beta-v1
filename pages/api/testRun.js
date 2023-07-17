import axios from "axios"

export default async function handler(req, res) {

  const config = {
    headers: {
      Accept: "application/json",
      "HADARO-API-Key": 'uK3Iy6S5RVUVkvMXi55u',
    },
  }; 
 
  const collectionAddress = '0x63dea3a99ade19ed72eec7dfd735296237ca5e76'
  const renterAddr = '0x95283724Aa7Ea5D0748A71D6555ac4BfDbfbA0DC'

 const resp = await axios.get(`http://localhost:3000/api/v1/lendings/${collectionAddress}?lenderAddress=${renterAddr}`, config)

 res.send(resp.data) 
}
