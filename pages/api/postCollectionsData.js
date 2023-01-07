import { client } from "../../utils/client"





export default async function handler(req, res) {
   
    
  try {
     
     
     const collection = req.body

    await client.create(collection)


  //   client
  // .delete('drafts.wizards--dragons-game')
  // .then(() => {
  //   console.log('record deleted')
  // })
  // .catch((err) => {
  //   console.error('Delete failed: ', err.message)
  // })
     
      
      return res.status(200).json({
        msg: 'success'
      })
  } catch(err) {
      res.send(err)
  }
} 