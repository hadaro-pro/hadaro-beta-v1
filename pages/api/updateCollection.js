import { client } from "../../utils/client"





export default async function handler(req, res) {
   
    
  try {
     
     const { collectionId } = req.params
     const document = req.body


  const rest = await  client
  .patch(`'${collectionId}'`)
  // Ensure that the `reviews` arrays exists before attempting to add items to it
  .setIfMissing({collectit: []})
  // Add the items after the last item in the array (append)
  .insert('after', 'collectit[-1]', [{title: 'Great bike!', stars: 5}])
  .commit({
    // Adds a `_key` attribute to array items, unique within the array, to
    // ensure it can be addressed uniquely in a real-time collaboration context
    autoGenerateArrayKeys: true,
  })


  // const resu = await client
  //   .patch(collectionId)
  //   .setIfMissing({collectionNfts: []})
  //   .append('collectionNfts', [document])
  //   .commit({autoGenerateArrayKeys: true})
    
     
      
      return res.json(rest)
  } catch(err) {
      res.send(err)
  }
} 

 

// client
//   .patch('bike-123')
//   // Ensure that the `reviews` arrays exists before attempting to add items to it
//   .setIfMissing({reviews: []})
//   // Add the items after the last item in the array (append)
//   .insert('after', 'reviews[-1]', [{title: 'Great bike!', stars: 5}])
//   .commit({
//     // Adds a `_key` attribute to array items, unique within the array, to
//     // ensure it can be addressed uniquely in a real-time collaboration context
//     autoGenerateArrayKeys: true,
//   })

// Appending/prepending elements to an array
// The operations of appending and prepending to an array are so common that they have been given their own methods for better readability:

// client
//   .patch('bike-123')
//   .setIfMissing({reviews: []})
//   .append('reviews', [{title: 'Great bike!', stars: 5}])
//   .commit({autoGenerateArrayKeys: true})