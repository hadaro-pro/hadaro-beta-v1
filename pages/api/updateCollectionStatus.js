import { client } from "../../utils/client";

export default async function handler(req, res) {
  const { iden, status } = req.body;

  client
    .patch(iden) // Document ID to patch
    .set({ status: status }) // Shallow merge
    .commit() // Perform the patch and return a promise
    .then((updatedDoc) => {
      return res.status(200).json({
        status: "success",
        msg: updatedDoc,
      });
    })
    .catch((err) => {
      res.send(err);
    });
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
