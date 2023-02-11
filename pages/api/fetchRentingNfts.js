import { client } from "../../utils/client"
import { firstNftByCollectionQuery } from "../../utils/queries"




export default async function handler(req, res) {
   
     const {address} = req.body  

  try {
      
    // console.log(address)  
      const query =  allRentedNftsByAddressQuery(address)
      
      const data = await client.fetch(query)
      
      return res.status(200).json(data)
    //  return res.send(response.data)
  } catch(err) {
      res.send(err)
  }
} 