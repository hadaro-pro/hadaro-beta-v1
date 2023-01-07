import { client } from "../../utils/client"
import { allCollectionsQuery } from "../../utils/queries"




export default async function handler(req, res) {
   
    
  try {
     
      const query =  allCollectionsQuery()


      const data = await client.fetch(query)
      
      return res.status(200).json(data)
    //  return res.send(response.data)
  } catch(err) {
      res.send(err)
  }
} 