import { useState, useEffect } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import nftAbi from "../constants/BasicNft.json"
import Image from "next/image"
import { Card, useNotification,Loading ,Button} from "@web3uikit/core"
import { ethers } from "ethers"
import UpdateListingModal from "../components/UpdateListingModal"
import { useRouter } from 'next/router';
import { useAppContext } from '../context/context'
import { useQuery } from "@apollo/client"
import GET_ACTIVE_ITEMS from "../constants/subgraphQueries"
export default function Purchase() {
    const {imageURI,tokenDescription, price, nftAddress, tokenId, tokenName, seller,marketplaceAddress ,setIsUpdated}= useAppContext()
    console.log(price,nftAddress)
    const { isWeb3Enabled, account,chainId } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "11155111"
    const dispatch = useNotification()
    const [isDisabled,setIsDisabled]=useState(false)
    const [payment,setPayment]=useState(false)
    const [err,setErr] = useState("")
    let ethValue = 0
    if(price)
    ethValue = ethers.utils.formatEther(price);
    const router = useRouter();
  
    const { runContractFunction: buyItem } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "buyItem",
        msgValue: price,
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
        },
    })

   
    useEffect(() => {
       
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

    

    const handleCardClick = () => {
         buyItem({
                onError: (error) => {
                    if(error && error.error)
                    setErr(error.error.message)
                    else
                    setErr("Something wrong went")
               },
                  onSuccess: () => handleBuyItemSuccess(),
              })
    }

    const handleBuyItemSuccess = () => {
        setIsUpdated(true)
       
        dispatch({
            type: "success",
            message: "Item bought! wait for few second",
            title: "Item Bought",
            position: "topR",
        })
        // router.push('/');

        setInterval(() => {
            setPayment(true)
          }, 10000);

    }

    return (
        <>
        {
            payment ?
            (<div class=" h-screen">
            <div class="bg-white p-6  md:mx-auto">
              <svg viewBox="0 0 24 24" class="text-green-600 w-16 h-16 mx-auto my-6">
                  <path fill="currentColor"
                      d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z">
                  </path>
              </svg>
              <div class="text-center">
                  <h3 class="md:text-2xl text-base text-gray-900 font-semibold text-center">Payment Done!</h3>
                  <p class="text-gray-600 my-2">Thank you for completing your secure online payment.</p>
                  <p> Have a great day!  </p>
                  <div class="py-10 text-center">
                      <a href="/" class="px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3">
                          GO To Home 
                     </a>
                  </div>
              </div>
          </div>
        </div>):
        (
            <div className=" p-4 m-5" >
             {isWeb3Enabled && chainString==="11155111"? (  <div className=" mx-4 my-4 p-4 flex  flex-wrap items-center justify-around">
              {imageURI ? (
                  // <div
                  // className="flex flex-col border-6 rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700  md:flex-row">
                      <div className="inline-block  p-5 mx-auto">

                 <Card
                      >
                          
                                  <div className="flex  flex-wrap items-center justify-center ">
                                  <Image
                                      loader={() => imageURI}
                                      src={imageURI}
                                      height="200"
                                      width="200"
                                      
                                  />
                                 
                                  <div class="flex flex-col justify-start  ">
                    <h5
                      className="mb-2 text-xl font-medium ">
                     {tokenName}
                   
                    </h5>
                    <p className="text-base ">
                      TokenId   #{tokenId}
                    </p>
                    <div className="italic text-sm">
                       Address  {nftAddress}
                      </div>
                    <div className="italic text-sm">
                                      Owned by {seller}
                                  </div>
                   
                    <p className="text-base ">
                      Price {ethValue} eth
                    </p>
                   <div className="absolute right-2 "> 
                    <Button
                   onClick={() => {
                      setIsDisabled(true)
                     
                      handleCardClick()
                  }}
                  text="Buy"
                  type="button"
                  theme="primary"
                  disabled={isDisabled}
              />
              </div> 
                       </div> 
                       </div>  
                      </Card> 
                      {/* </div> */}
           
                  {/* </div> */}
                </div>
              ) : (
                  <div className="p-5">
                  <Card
                  title="Please Select Nfts To Purchase"
                  >
                      
                           
                    
                  </Card> 
                  </div>

              )}
          </div>): (
                  <>
                  <h1 className="py-4 px-4 font-bold text-2xl">Web3 Currently Not Enabled</h1>
                  <h1 className="py-4 px-4 font-bold text-base">Please Connect To Your Sepolia Account</h1>
                  </>
              )}
      </div>
        )







        }
        
        
        
        
        
        
        </>
      
    )
}