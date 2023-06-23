import { useState, useEffect } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import nftAbi from "../constants/BasicNft.json"
import Image from "next/image"
import { Card, useNotification,Loading ,NFTCard} from "@web3uikit/core"
import { ethers } from "ethers"
import UpdateListingModal from "./UpdateListingModal"
import { useRouter } from 'next/router';
import { useAppContext } from '../context/context'
const truncateStr = (fullStr, strLen) => {
    if (fullStr.length <= strLen) return fullStr

    const separator = "..."
    const seperatorLength = separator.length
    const charsToShow = strLen - seperatorLength
    const frontChars = Math.ceil(charsToShow / 2)
    const backChars = Math.floor(charsToShow / 2)
    return (
        fullStr.substring(0, frontChars) +
        separator +
        fullStr.substring(fullStr.length - backChars)
    )
}

export default function NFTBox({ price, nftAddress, tokenId, marketplaceAddress, seller }) {
    const { isWeb3Enabled, account } = useMoralis()
    const [imageURI, setImageURI] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [pricee, setPricee] = useState(price)
    const [tokenDescription, setTokenDescription] = useState("")
    const [showModal, setShowModal] = useState(false)
    const hideModal = () => setShowModal(false)
    const dispatch = useNotification()
    const [err,setErr] = useState("")
    const router = useRouter();
    const {setIimageURI,setTtokenName,setTtokenDescription,setNftAdddress,setSeller,setPrice,setTtokenId,setMarketplaceAddress } =
    useAppContext()
    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            tokenId: tokenId,
        },
    })

    // const { runContractFunction: buyItem } = useWeb3Contract({
    //     abi: nftMarketplaceAbi,
    //     contractAddress: marketplaceAddress,
    //     functionName: "buyItem",
    //     msgValue: price,
    //     params: {
    //         nftAddress: nftAddress,
    //         tokenId: tokenId,
    //     },
    // })

    async function updateUI() {
        const tokenURI = await getTokenURI()
        // console.log(`The TokenURI is ${tokenURI}`)
        // We are going to cheat a little here...
        if (tokenURI) {
            // IPFS Gateway: A server that will return IPFS files from a "normal" URL.
            const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            const tokenURIResponse = await (await fetch(requestURL)).json()
            const imageURI = tokenURIResponse.image
            const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            setImageURI(imageURIURL)
            setTokenName(tokenURIResponse.name)
            setTokenDescription(tokenURIResponse.description)
            // We could render the Image on our sever, and just call our sever.
            // For testnets & mainnet -> use moralis server hooks
            // Have the world adopt IPFS
            // Build our own IPFS gateway
        }
        // get the tokenURI
        // using the image tag from the tokenURI, get the image
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
        if(err)
        {
            dispatch({
                type: "error",
                message: err,
                title: "Error",
                position: "topR",
            })
            setErr("") 
        }
    }, [isWeb3Enabled,err])

    const isOwnedByUser = seller === account || seller === undefined
    const formattedSellerAddress = isOwnedByUser ? "you" : truncateStr(seller || "", 15)

    const handleCardClick = () => {
        isOwnedByUser
            ? setShowModal(true)
            :
              (  
                setIimageURI(imageURI),
                setTtokenName(tokenName),
                setTtokenDescription(tokenDescription),
                setNftAdddress(nftAddress),
                setSeller(seller),
                setPrice(pricee),
                setTtokenId(tokenId),
                setMarketplaceAddress(marketplaceAddress),
                router.push({
                    pathname: '/purchase',
                  
                }))
            
    }

    // const handleBuyItemSuccess = () => {
    //     dispatch({
    //         type: "success",
    //         message: "Item bought!",
    //         title: "Item Bought",
    //         position: "topR",
    //     })
       

    // }

    return (
        <div className="p-2  " >
            <div>
                {imageURI ? (
                    <div>
                        <UpdateListingModal
                            isVisible={showModal}
                            tokenId={tokenId}
                            marketplaceAddress={marketplaceAddress}
                            nftAddress={nftAddress}
                            onClose={hideModal}
                            setPricee={setPricee}
                        />
                       <Card
                            title={tokenName}
                            onClick={handleCardClick}
                        >
                            <div className="p-2">
                                <div className="flex flex-col items-end gap-2">
                                    <div>#{tokenId}</div>
                                    <div className="italic text-sm">
                                        Owned by {formattedSellerAddress}
                                    </div>
                                    <div className="m-auto w-30">
                                    <Image
                                        loader={() => imageURI}
                                        src={imageURI}
                                        height="200"
                                        width="200"
                                        
                                    />
                                    </div>
                                    
                                    <div className="font-bold">
                                        {ethers.utils.formatUnits(pricee, "ether")} ETH
                                    </div>
                                </div>
                            </div>
                        </Card> 
                    </div>
                ) : (
                    <div
  style={{
    backgroundColor: '#ECECFE',
    borderRadius: '8px',
    padding: '20px'
  }}
>
  <Loading
    size={40}
    spinnerColor="#2E7DAF"
  />
</div>
                )}
            </div>
        </div>
    )
}