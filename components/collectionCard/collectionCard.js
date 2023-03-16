import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

import styles from "./collectionCard.module.scss";

const CollectionCard = ({ posterImage, collectionTitle, status, colAddr }) => {
  // console.log(posterImage)

  const [img, setImg] = useState(null);

  // const nftImageAggregating = (image) => {

  //   if (image?.includes(".")) {
  //      setImg(image);
  //   } else if(!image?.includes(".")) {
  //    setImg("https://ipfs.moralis.io:2053/ipfs/" + image);
  //   } else if (image?.includes("https://") || image?.includes("data:image/")) {
  //   setImg(image);
  //   } else if (!image?.includes("https://") ||
  //   !image?.includes("data:image/")) {
  //     let splicer = image?.slice(7);
  //     setImg("https://gateway.ipfscdn.io/ipfs/" + splicer);
  //   } else {
  //     setImg(null)
  //   }
  // };

  // const getFirstNftImage = async(address) => {
  //   try{

  //     const response = await axios.post(`/api/fetchSingleImage`, {address} )

  //     console.log('cser', response.data)
  //   } catch (e) {
  //     console.error(e)
  //   }
  // }

  // useEffect(() => {
  // // nftImageAggregating(posterImage)
  // }, [])

  const imagqw =
    "data:image/svg+xml;base64,PHN2ZyBpZD0id25kTkZUIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGltYWdlIHg9IjQiIHk9IjQiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgaW1hZ2UtcmVuZGVyaW5nPSJwaXhlbGF0ZWQiIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIiB4bGluazpocmVmPSJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUNBQUFBQWdDQVlBQUFCemVucjBBQUFCV1VsRVFWUjQydTFYc1EzQ1FBek1BalRVVUxOQkNrb2FoTVFBTElBWUlTV01nSmlFSlJBck1BRXRGWFdRSXk2Nk9QNVBRdkpCb0x4a2dSTEhkL2E5blh3VURldFgxMmc4U2RsNkJ6L01GdWt0ampPVC83MlJ5TUYzY2NGNklWRUFqNVdGSmdGd3NkVjBYaUlnMTNBL0NBa0pDbUNBc0dGUGlFOHdBcHloWmNFcjRBTm5Fc0VJU0ltckNNRG5Qd2w4UlFKWGhyN3NPeHZSQ0twSExvQ2s1ZEIydU1ZanVwVWNPVGlQM0RjSjF5ak93ZFV6alVsWW1uSkdYQTBHMW41Nno5UUdmNXlUOUpKc1MxTk9nMWpsMW5LSlNTeUo2U1hCenZ2bE9uMWVqOWt2YnpBTFZPOFJKaVBHc1RncGs0QTRpRE1NckVGQXY0VHVwMDJKRUh6d25NVGdtQ0RoclFMWWdnQkFvTGRWQlgwUEVrQk9ybWJ0VFFpMnJoWnp5Y0NiMGx2MkpnUEl5dHlTd1BYR2JEMSs2MlN2TzZEMVdPYWVyd3V1TzZLVGNld2lZRWtRNUV2NVV3bUNIRVNxQmxId2cwclY5OEJ3Wm15NlhzTFVDSnlTTlRkMkFBQUFBRWxGVGtTdVFtQ0MiLz48aW1hZ2UgeD0iNCIgeT0iNCIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBpbWFnZS1yZW5kZXJpbmc9InBpeGVsYXRlZCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQiIHhsaW5rOmhyZWY9ImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQ0FBQUFBZ0NBWUFBQUJ6ZW5yMEFBQUFsRWxFUVZSWWhXTmtJQlB3Q3NuOFI5YjUrZDBUc3N3aVdSUE00bWZGdjFERXBYclp5SElJU1lwQmxuODZMTUR3WmNNckZFdGhqdUVKRUdQZ3MvMUFraU5ZU0hFQURLRDdWcW9YRWlxZkFrZzNpNGtjQjN4NnZBbnNhMUNJZ0RDSURSS2pDNEJaK3YrcXp2Ly9YODlCOEZXZC96QnhVdDB3NExsZ0ZJeUNVVEFLUnNFb0dBV2pZQlNNZ2xFd0NnWVdNREF3QUFBOTFrRVN6ck1lUkFBQUFBQkpSVTVFcmtKZ2dnPT0iLz48aW1hZ2UgeD0iNCIgeT0iNCIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBpbWFnZS1yZW5kZXJpbmc9InBpeGVsYXRlZCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQiIHhsaW5rOmhyZWY9ImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQ0FBQUFBZ0NBWUFBQUJ6ZW5yMEFBQUFYa2xFUVZSNDJtTmdHQVdqWUJTTWdsRXdDa2JCS0JnRm8yQVVqSUxCQm5pRlpQNkRNRjNOaFVtQzhQOS9mOEdZbW81QU54ZkZNZWlTWDQ5UG9Ka0RRR1pqZUJKZGt0WlJnTldUeUpLSmhXbzBjd0RNYkp5ZXBGY0lES3BjQndDc21uSFhlOWlzclFBQUFBQkpSVTVFcmtKZ2dnPT0iLz48aW1hZ2UgeD0iNCIgeT0iNCIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBpbWFnZS1yZW5kZXJpbmc9InBpeGVsYXRlZCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQiIHhsaW5rOmhyZWY9ImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQ0FBQUFBZ0NBWUFBQUJ6ZW5yMEFBQUFQRWxFUVZSNDJtTmdHQVdqWUJTTWdsRXdGSUh3enRmL0hSVGUvSWZ4UVd5UUdOMGNvR0EwN1Q4eFlxTmdGSXlDVVRBS1JzRW9HQVdqWUVnQUFOT3VEZEU1ZzhMb0FBQUFBRWxGVGtTdVFtQ0MiLz48aW1hZ2UgeD0iNCIgeT0iNCIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBpbWFnZS1yZW5kZXJpbmc9InBpeGVsYXRlZCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQiIHhsaW5rOmhyZWY9ImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQ0FBQUFBZ0NBWUFBQUJ6ZW5yMEFBQUFQVWxFUVZSNDJtTmdHQVdqWUJTTWdsRXdDa2JCVUFMYWw3NzlwNFlhbWptQzVwYkR3S2IvbUJaaEU2TzVJNUR4YUFJZEJhTmdGSXlDVVRCa0FRQ3JFU0d0U3dRK0dRQUFBQUJKUlU1RXJrSmdnZz09Ii8+PGltYWdlIHg9IjQiIHk9IjQiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgaW1hZ2UtcmVuZGVyaW5nPSJwaXhlbGF0ZWQiIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIiB4bGluazpocmVmPSJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUNBQUFBQWdDQVlBQUFCemVucjBBQUFBU2tsRVFWUjQydTNRd1FrQUlBaUZZVmR3dHZab3ZKWXpNT3prb1VOMEVJTC9BOUhiZXlnQ0FBQWVhVGVQYWRQM0xnMlAwSHpyc05vU3VVQ0U1MTN6L2tOWWFZSGJVZ0FBZkdFQmg3UW5uNXZDN2JNQUFBQUFTVVZPUks1Q1lJST0iLz48aW1hZ2UgeD0iNCIgeT0iNCIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBpbWFnZS1yZW5kZXJpbmc9InBpeGVsYXRlZCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQiIHhsaW5rOmhyZWY9ImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQ0FBQUFBZ0NBWUFBQUJ6ZW5yMEFBQUFhMGxFUVZSNDJtTmdHQVdqWUJTTUFqb0RYaUdaL3lBOFlKYXZpVEFaZGNEQU9BQm0rZU5TZzRGekFNanlBamVuZ1EyQmtSdi9vS0FmY0FjTVdQekR3SUE1NFAyRzh2OGdER01QaUFPT2xxZitSM2JJZ0RsaVFMUGhnRmsrb0FVUXpQZWpMYUZSTUFvR0xRQUEzN1piVVJwdEN2MEFBQUFBU1VWT1JLNUNZSUk9Ii8+PC9zdmc+";

  return (
    <div className={styles.mainContainer}>
      <div className={styles.imageContainer}>
        <img
          src={
            posterImage === (null || undefined)
              ? "/images/no-image-placeholder.png"
              : posterImage
          }
        />
      </div>
      <div className={styles.titleContainer}>
        <h3>
          {" "}
          {collectionTitle}{" "}
          {status === "verified" && (
            <span>
              <img src="/images/verify.png" alt="verified" />
            </span>
          )}{" "}
        </h3>
      </div>
    </div>
  );
};

export default CollectionCard;
