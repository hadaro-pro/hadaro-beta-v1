import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  unpackPrice,
  Sylvester,
  NFTStandard,
  packPrice,
  SYLVESTER_ADDRESS,
} from "@renft/sdk";
import {
  useAccount,
  useConnect,
  useSigner,
  useProvider,
  erc721ABI,
} from "wagmi";
import { createClient } from 'urql'
import { SYLVESTER_SUBGRAPH_URL } from "../../creds";
import axios from "axios";
import { message, Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import ArtCard from "../ArtCard/ArtCard";
import styles from "./collectioncomp.module.scss";

const featuredData = [
  {
    image: "/images/ART01.png",
    title: "Hadara #1",
    collection: "",
    creator: "SalvadorDali",
    bidPrice: 4.98 + " " + "ETH",
  },
  {
    image: "/images/ART02.png",
    title: "Hadara #2",
    collection: "",
    creator: "SalvadorDali",
    bidPrice: 4.98 + " " + "ETH",
  },
  {
    image: "/images/ART03.png",
    title: "Hadara #3",
    collection: "",
    creator: "SalvadorDali",
    bidPrice: 4.98 + " " + "ETH",
  },
  {
    image: "/images/ART04.png",
    title: "Hadara #4",
    collection: "",
    creator: "SalvadorDali",
    bidPrice: 4.98 + " " + "ETH",
  },
  {
    image: "/images/ART05.png",
    title: "Hadara #5",
    collection: "",
    creator: "SalvadorDali",
    bidPrice: 4.98 + " " + "ETH",
  },
  {
    image: "/images/ART06.png",
    title: "Hadara #6",
    collection: "",
    creator: "SalvadorDali",
    bidPrice: 4.98 + " " + "ETH",
  },
  {
    image: "/images/ART07.png",
    title: "Hadara #7",
    collection: "",
    creator: "SalvadorDali",
    bidPrice: 4.98 + " " + "ETH",
  },
  {
    image: "/images/ART08.png",
    title: "Hadara #8",
    collection: "",
    creator: "SalvadorDali",
    bidPrice: 4.98 + " " + "ETH",
  },
  {
    image: "/images/ART09.png",
    title: "Hadara #9",
    collection: "",
    creator: "SalvadorDali",
    bidPrice: 4.98 + " " + "ETH",
  },
  {
    image: "/images/ART10.png",
    title: "Hadara #10",
    collection: "",
    creator: "SalvadorDali",
    bidPrice: 4.98 + " " + "ETH",
  },
  {
    image: "/images/ART11.png",
    title: "Hadara #11",
    collection: "",
    creator: "SalvadorDali",
    bidPrice: 4.98 + " " + "ETH",
  },
  {
    image: "/images/ART12.png",
    title: "Hadara #12",
    collection: "",
    creator: "SalvadorDali",
    bidPrice: 4.98 + " " + "ETH",
  },
  {
    image: "/images/ART13.png",
    title: "Hadara #13",
    collection: "",
    creator: "SalvadorDali",
    bidPrice: 4.98 + " " + "ETH",
  },
  {
    image: "/images/ART14.png",
    title: "Hadara #14",
    collection: "",
    creator: "SalvadorDali",
    bidPrice: 4.98 + " " + "ETH",
  },
  {
    image: "/images/ART15.png",
    title: "Hadara #15",
    collection: "",
    creator: "SalvadorDali",
    bidPrice: 4.98 + " " + "ETH",
  },
  {
    image: "/images/ART16.png",
    title: "Hadara #16",
    collection: "",
    creator: "SalvadorDali",
    bidPrice: 4.98 + " " + "ETH",
  },
];

const CollectionItemsComp = ({ itemsToDisplay, loadingItems, openFooter }) => {
  const { address, connector, isConnected } = useAccount();
  const { data: signer } = useSigner();

  const collateralFreeContract = new Sylvester(signer);

  const getLendingIdForNft = async (tokenAddr, tokenID) => {

   

    try {
      const queryNft = `
      query LendingsQuery {
          lendings (where: {nftAddress: "${tokenAddr}", tokenID: "${tokenID}"}) {
            id
            tokenID
          }
        }`;

      const urqlClient = createClient({
        url: SYLVESTER_SUBGRAPH_URL
      })
        
    const response = await urqlClient.query(queryNft).toPromise()

    const result = response.data

    // console.log(result)

    return result



     
    } catch(e) {
      console.log(e)
    } 

  


  
  };

  // console.log('kk', itemsToDisplay)

  const collectionDetails = useSelector((state) => state.collectionDetails);

  const { collectionInfo } = collectionDetails;

  const { colName, colSymbol, iden } = collectionInfo;

  const [toDisplayData, setToDisplayData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showRentMenu, setShowRentMenu] = useState(false);
  const [miniText, setMiniText] = useState(true);
  const [rentalPeriod, setRentalPeriod] = useState("");
  const [error, setError] = useState(null);
  const [displayAmount, setDisplayAmount] = useState(null);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    // setIsModalOpen(false);
    setShowRentMenu(false);
    // openFooter(false);
  };

  const addEllipsis = (value) => {
    const firstPart = value.slice(0, 4);
    const lastPart = value.slice(-3);

    return firstPart + "..." + lastPart;
  };

  const displayNftDetails = (index) => {
    const collection = itemsToDisplay[index];

    setToDisplayData(collection);
    //  console.log('collet: ', toDisplayData)
    setShowRentMenu(true);
    // openFooter(true);
    window.scrollTo(0, 100);
  };

  const setNftStandard = (value) => {
    if (value === "ERC721") {
      return 0;
    }
    if (value === "ERC1155") {
      return 1;
    }
  };

  // console.log("rental pd ", rentalPeriod);

  const showTotalAmount = (value) => {
    console.log("cyle ", value);
    const numFormat = Number(value);
    const unpackedPrice = unpackPrice(toDisplayData?.price) * 10000;
    console.log(numFormat);
    if (isNaN(numFormat) == true) {
      // message.error('you entered a non-number value')
      setError("you entered a non-number value");
      setDisplayAmount(null);
    } else if (numFormat > toDisplayData?.maxDuration) {
      // message.error('wrong stuff, too high')
      setError("max rental days exceeded");
      setDisplayAmount(null);
    } else {
      setError(null);
      setDisplayAmount(unpackedPrice * numFormat);
    }
    setRentalPeriod(numFormat);
  };

  const handleCompleteRent = async() => {
    // if(isConnected) {
    //   message.success('ride on')
    // } else {
    //   message.error('Oops!, connect your wallet to continue')
    // }

   

    if (rentalPeriod === "") {
      message.info('set a rental period then proceed to renting')
    } else {



    const nftStandard = setNftStandard(toDisplayData?.nftStandard);
    const nftAddress = toDisplayData?.nftAddress;
    const tokenID = toDisplayData?.tokenID;
    // const lendingID = "1"; // this information is pulled from the subgraph
    const rentDuration = rentalPeriod; // in days
    const rentAmount = 1;

    const resp = await getLendingIdForNft(nftAddress, tokenID)

   

    const lendingID = resp.lendings[0].id

    console.log('head', lendingID)

    const finalObj = {
      nftStandard,
      nftAddress,
      tokenID,
      rentDuration,
      rentAmount,
      lendingID
    }

    // const txn =   await collateralFreeContract.rent(
    //   [nftStandard],
    //   [nftAddress],
    //   [tokenID],
    //   [lendingID],
    //   [rentDuration],
    //   [rentAmount]
    // );



    // const receipt = await txn.wait()


    // console.log(receipt);


    message.success("rent success!");
    console.log(finalObj)

  }


  };




  // const fetchCollectionNfts = async() => {
  //   try {

  //     const contractAddr = iden
  //     const response = await axios.get(`/api/fetchAllNftsInCollection`, {contractAddr})

  //     console.log('resti: ', response.data)

  //   } catch(err) {
  //     console.error(err)
  //   }
  // }

  // useEffect(() => {
  //   fetchCollectionNfts()
  // }, [])

  // chain
  // :
  // "0x1"
  // lenderAddress
  // :
  // "0x0b8ad9582c257aC029e335788017dCB1dE5FBE21"
  // maxDuration
  // :
  // 15
  // metadataDesc
  // :
  // "Thousands of Wizards and Dragons compete in a tower in the metaverse. A tempting prize of $GP awaits, with deadly high stakes. All the metadata and images are generated and stored 100% on-chain. No IPFS. NO API. Just the Ethereum blockchain."
  // metadataImage
  // :
  // nftStandard
  // :
  // ERC721
  // "data:image/svg+xml;base64,PHN2ZyBpZD0id25kTkZUIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGltYWdlIHg9IjQiIHk9IjQiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgaW1hZ2UtcmVuZGVyaW5nPSJwaXhlbGF0ZWQiIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIiB4bGluazpocmVmPSJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUNBQUFBQWdDQVlBQUFCemVucjBBQUFCV1VsRVFWUjQydTFYc1EzQ1FBek1BalRVVUxOQkNrb2FoTVFBTElBWUlTV01nSmlFSlJBck1BRXRGWFdRSXk2Nk9QNVBRdkpCb0x4a2dSTEhkL2E5blh3VURldFgxMmc4U2RsNkJ6L01GdWt0ampPVC83MlJ5TUYzY2NGNklWRUFqNVdGSmdGd3NkVjBYaUlnMTNBL0NBa0pDbUNBc0dGUGlFOHdBcHloWmNFcjRBTm5Fc0VJU0ltckNNRG5Qd2w4UlFKWGhyN3NPeHZSQ0twSExvQ2s1ZEIydU1ZanVwVWNPVGlQM0RjSjF5ak93ZFV6alVsWW1uSkdYQTBHMW41Nno5UUdmNXlUOUpKc1MxTk9nMWpsMW5LSlNTeUo2U1hCenZ2bE9uMWVqOWt2YnpBTFZPOFJKaVBHc1RncGs0QTRpRE1NckVGQXY0VHVwMDJKRUh6d25NVGdtQ0RoclFMWWdnQkFvTGRWQlgwUEVrQk9ybWJ0VFFpMnJoWnp5Y0NiMGx2MkpnUEl5dHlTd1BYR2JEMSs2MlN2TzZEMVdPYWVyd3V1TzZLVGNld2lZRWtRNUV2NVV3bUNIRVNxQmxId2cwclY5OEJ3Wm15NlhzTFVDSnlTTlRkMkFBQUFBRWxGVGtTdVFtQ0MiLz48aW1hZ2UgeD0iNCIgeT0iNCIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBpbWFnZS1yZW5kZXJpbmc9InBpeGVsYXRlZCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQiIHhsaW5rOmhyZWY9ImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQ0FBQUFBZ0NBWUFBQUJ6ZW5yMEFBQUFsRWxFUVZSWWhXTmtJQlB3Q3NuOFI5YjUrZDBUc3N3aVdSUE00bWZGdjFERXBYclp5SElJU1lwQmxuODZMTUR3WmNNckZFdGhqdUVKRUdQZ3MvMUFraU5ZU0hFQURLRDdWcW9YRWlxZkFrZzNpNGtjQjN4NnZBbnNhMUNJZ0RDSURSS2pDNEJaK3YrcXp2Ly9YODlCOEZXZC96QnhVdDB3NExsZ0ZJeUNVVEFLUnNFb0dBV2pZQlNNZ2xFd0NnWVdNREF3QUFBOTFrRVN6ck1lUkFBQUFBQkpSVTVFcmtKZ2dnPT0iLz48aW1hZ2UgeD0iNCIgeT0iNCIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBpbWFnZS1yZW5kZXJpbmc9InBpeGVsYXRlZCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQiIHhsaW5rOmhyZWY9ImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQ0FBQUFBZ0NBWUFBQUJ6ZW5yMEFBQUFYa2xFUVZSNDJtTmdHQVdqWUJTTWdsRXdDa2JCS0JnRm8yQVVqSUxCQm5pRlpQNkRNRjNOaFVtQzhQOS9mOEdZbW81QU54ZkZNZWlTWDQ5UG9Ka0RRR1pqZUJKZGt0WlJnTldUeUpLSmhXbzBjd0RNYkp5ZXBGY0lES3BjQndDc21uSFhlOWlzclFBQUFBQkpSVTVFcmtKZ2dnPT0iLz48aW1hZ2UgeD0iNCIgeT0iNCIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBpbWFnZS1yZW5kZXJpbmc9InBpeGVsYXRlZCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQiIHhsaW5rOmhyZWY9ImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQ0FBQUFBZ0NBWUFBQUJ6ZW5yMEFBQUFQRWxFUVZSNDJtTmdHQVdqWUJTTWdsRXdGSUh3enRmL0hSVGUvSWZ4UVd5UUdOMGNvR0EwN1Q4eFlxTmdGSXlDVVRBS1JzRW9HQVdqWUVnQUFOT3VEZEU1ZzhMb0FBQUFBRWxGVGtTdVFtQ0MiLz48aW1hZ2UgeD0iNCIgeT0iNCIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBpbWFnZS1yZW5kZXJpbmc9InBpeGVsYXRlZCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQiIHhsaW5rOmhyZWY9ImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQ0FBQUFBZ0NBWUFBQUJ6ZW5yMEFBQUFQVWxFUVZSNDJtTmdHQVdqWUJTTWdsRXdDa2JCVUFMYWw3NzlwNFlhbWptQzVwYkR3S2IvbUJaaEU2TzVJNUR4YUFJZEJhTmdGSXlDVVRCa0FRQ3JFU0d0U3dRK0dRQUFBQUJKUlU1RXJrSmdnZz09Ii8+PGltYWdlIHg9IjQiIHk9IjQiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgaW1hZ2UtcmVuZGVyaW5nPSJwaXhlbGF0ZWQiIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIiB4bGluazpocmVmPSJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUNBQUFBQWdDQVlBQUFCemVucjBBQUFBU2tsRVFWUjQydTNRd1FrQUlBaUZZVmR3dHZab3ZKWXpNT3prb1VOMEVJTC9BOUhiZXlnQ0FBQWVhVGVQYWRQM0xnMlAwSHpyc05vU3VVQ0U1MTN6L2tOWWFZSGJVZ0FBZkdFQmg3UW5uNXZDN2JNQUFBQUFTVVZPUks1Q1lJST0iLz48aW1hZ2UgeD0iNCIgeT0iNCIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBpbWFnZS1yZW5kZXJpbmc9InBpeGVsYXRlZCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQiIHhsaW5rOmhyZWY9ImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQ0FBQUFBZ0NBWUFBQUJ6ZW5yMEFBQUFhMGxFUVZSNDJtTmdHQVdqWUJTTUFqb0RYaUdaL3lBOFlKYXZpVEFaZGNEQU9BQm0rZU5TZzRGekFNanlBamVuZ1EyQmtSdi9vS0FmY0FjTVdQekR3SUE1NFAyRzh2OGdER01QaUFPT2xxZitSM2JJZ0RsaVFMUGhnRmsrb0FVUXpQZWpMYUZSTUFvR0xRQUEzN1piVVJwdEN2MEFBQUFBU1VWT1JLNUNZSUk9Ii8+PC9zdmc+"
  // metadataName
  // :
  // "Wizard #30916"
  // nftAddress
  // :
  // "0x999e88075692bCeE3dBC07e7E64cD32f39A1D3ab"
  // paymentToken
  // :
  // "WETH"
  // price
  // :
  // "0x0000000A"
  // tokenID
  // :
  // "30916"
  // transactionType
  // :
  // "lending"
  // _id
  // :
  // "dicTh3M3fwU0B9kvr7T1EG"

  return (
    <div className={styles.mainContainer}>
      <div className={styles.caption}>
        <h1>
          {" "}
          {colName} {`(${colSymbol})`}{" "}
        </h1>
      </div>
      {showRentMenu ? (
        <div className={styles.overlay}>
      <div className={styles.showRentMenu}>
          <div className={styles.closeMenu}>
            <CloseOutlined
              className={styles.closeIcon}
              onClick={handleCancel}
            />
          </div>
          <div className={styles.infoContainer}>
            <div className={styles.infoImage}>
              <img
                src={toDisplayData?.metadataImage}
                alt={toDisplayData?.metadataName}
              />
            </div>
            <div className={styles.infoDesc}>
              <div className={styles.infoDescLender}>
                <small className={styles.gray}>Lender</small>
                <small> {addEllipsis(toDisplayData?.lenderAddress)} </small>
              </div>
              <div className={styles.infoDescName}>
                <div className={styles.infoDescMetaNames}>
                  <h3> {colName} </h3>
                  <h2> {toDisplayData?.metadataName} </h2>
                </div>
                <div className={styles.miniInfo}>
                  <small> {toDisplayData?.nftStandard} </small>
                  <small> {addEllipsis(toDisplayData?.nftAddress)} </small>
                </div>
                <div className={styles.miniDesc}>
                  {miniText ? (
                    <p className={styles.miniText}>
                      {toDisplayData?.metadataDesc
                        .split(" ")
                        .splice(0, 15)
                        .join(" ")}
                      <span
                        className={styles.ctaForMore}
                        onClick={() => setMiniText(false)}
                      >
                        more
                      </span>{" "}
                    </p>
                  ) : (
                    <p>
                      {toDisplayData?.metadataDesc}
                      <span onClick={() => setMiniText(true)}>less</span>{" "}
                    </p>
                  )}
                </div>
              </div>
              <div className={styles.formFillPart}>
                <h3>
                  {" "}
                  Max Duration in Days{" "}
                  <span> {toDisplayData?.maxDuration} </span>{" "}
                </h3>

                <div className={styles.formFillPartInput}>
                  <input
                    type="text"
                    placeholder="Set Rental Period"
                    onChange={(e) => {
                      showTotalAmount(e.target.value);
                    }}
                  />
                  {error !== null && (
                    <p className={styles.formErorPart}> {error} </p>
                  )}
                </div>
                <div className={styles.dailyPricePart}>
                  <h3>Daily Price </h3>{" "}
                  <h1>
                    {unpackPrice(toDisplayData?.price) * 10000}{" "}
                    {toDisplayData?.paymentToken}{" "}
                  </h1>
                </div>
                <div className={styles.finalAmountPart}>
                  <p>Amount: </p>
                  <div className={styles.finalAmountContainer}>
                    <h1>{displayAmount === null ? 0 : displayAmount} </h1>{" "}
                    <h2>{toDisplayData?.paymentToken} </h2>
                  </div>
                </div>
              </div>

              <div className={styles.submitBtn}>
                <button onClick={handleCompleteRent}>Complete Rent</button>
              </div>
            </div>
          </div>
        </div>
        </div>
      ) : (
        <div className={styles.mainPart}>
          <h2>COLLECTION ITEMS</h2>
          {loadingItems ? (
            <div className={styles.loadingPart}>
              <h1>{"Loading Items...."}</h1>
            </div>
          ) : (
            <div className={styles.artPart}>
              {itemsToDisplay?.map((item, index) => (
                <div key={index}>
                  <ArtCard
                    image={item.metadataImage}
                    title={item.metadataName}
                    collectionName={colName}
                    bidPrice={`${unpackPrice(item.price) * 10000}`}
                    paymentToken={item.paymentToken}
                    status={item.transactionType}
                    identity={item._id}
                    description={item.metadataDesc}
                    position={index}
                    openRentModal={displayNftDetails}
                    openFinalModal={showModal}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CollectionItemsComp;

// {
//   showRentMenu && (
//     <div className={styles.showRentMenu}>
//        <div className={styles.closeMenu}>
//    <CloseOutlined
//       className={styles.closeIcon}
//       onClick={handleCancel}
//  />
//   </div>
//       <h1>xvdfsf</h1>
//     </div>
//   )
// //  <Modal
// //   open={isModalOpen}
// //   footer={null}
// //   onCancel={handleCancel}
// //   className={styles.modalContainer}
// // >
// //   <div className={styles.closeMenu}>
// //     <CloseOutlined
// //       className={styles.closeIcon}
// //       onClick={handleCancel}
// //     />
// //   </div>
// //   {/* <div className={styles.modalContent}>
// //  <div className={styles.modalContentImage}>
// //   <img src={`${image}`}  alt="alart" />
// //  </div>
// //  <div>
// //   details part
// //  </div>
// //   </div> */}
// // </Modal>
// }
