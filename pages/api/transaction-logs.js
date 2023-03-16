import Moralis from "moralis";
import axios from "axios";
import { moralisApiKey } from "../../creds";

export default async function handler(req, res) {
  // await Moralis.start({ apiKey: moralisApiKey })

  const config = {
    headers: {
      accept: "application/json",
      "X-API-Key": moralisApiKey,
    },
  };

  try {
    const { transactionHash, chain } = req.query;

    //     const response = await Moralis.EvmApi.transaction.getTransaction({
    //       transactionHash: contractaddr,
    //       chain: chain
    //     })

    const response = await axios.get(
      `https://deep-index.moralis.io/api/v2/transaction/${transactionHash}/verbose?chain=${chain}`,
      config
    );

    return res.send(response.data);
  } catch (err) {
    res.send(err);
  }
}

// import axios from 'axios';
// const fetchQuotes = async () => {
// 	const config = {
// 		headers: {
// 			'x-rapidapi-host': 'famous-quotes4.p.rapidapi.com',
// 			'x-rapidapi-key': API_KEY
// 		}
// 	};
// 	const res = await axios.get(
// 		`https://famous-quotes4.p.rapidapi.com/random`,
// 		config
// 	);
// 	return res.data;
// };

// const options = {
//   method: "GET",
//   headers: {
//     accept: "application/json",
//     "X-API-Key": moralisApiKey,
//   },
// };

// fetch(
//   "https://deep-index.moralis.io/api/v2/transaction/0x012b9b98e21664117ec0b499d726a39f492ac8bd402cca8bebcbd163b9f75760/verbose?chain=eth",
//   options
// )
//   .then((response) => res.send(response.data))
//   .then((response) => console.log(response))
//   .catch((err) => console.error(err));
