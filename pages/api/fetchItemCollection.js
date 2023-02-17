import { client } from "../../utils/client"
import { getItemCollectionCountQuery } from "../../utils/queries"




export default async function handler(req, res) {
   
    
  try {

    

    const { collectionAddr } = req.body

    // console.log('xv: ',  collectionAddr)
     
      const query =  getItemCollectionCountQuery(collectionAddr)


      const data = await client.fetch(query)
      
      return res.status(200).json(data)
    //  return res.send(response.data)
  } catch(err) {
      res.send(err)
  }
} 