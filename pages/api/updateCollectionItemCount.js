import { client } from "../../utils/client"





export default async function handler(req, res) {



  
  const { itemId, count } = req.body


  client
.patch(itemId) // Document ID to patch
.set({"itemCount": count}) // Shallow merge
.commit() // Perform the patch and return a promise
.then((updatedDoc) => {
  return  res.status(200).json({
    status: 'success',
    msg: updatedDoc
  })
})
.catch((err) => {
 res.send(err)
})
} 

 

