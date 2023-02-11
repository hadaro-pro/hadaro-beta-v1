import { client } from "../../utils/client"





export default async function handler(req, res) {
  const { iden } = req.body
  client
  .delete(iden)
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
