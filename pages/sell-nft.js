
import { Input, useNotification, Button ,Modal} from "@web3uikit/core"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { ethers } from "ethers"
import nftAbi from "../constants/BasicNft.json"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import networkMapping from "../constants/networkMapping.json"
import { useEffect, useState } from "react"

export default function Home() {
    const { chainId, account, isWeb3Enabled } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "11155111"
    const [err,setErr]=useState("")
    const [nftAddress,setNftAdddress]=useState("")
    const [tokenId,setTokenId]=useState()
    const [priceInEth,setPriceInEth]=useState()
    const marketplaceAddress =networkMapping[chainString]? networkMapping[chainString].NftMarketplace[0]:null
    const [isDisabled,setIsDisabled]=useState(false)
    const dispatch = useNotification()
    const [isVisible,setIsVisible]=useState(false)
    const [payment,setPayment]=useState(false)
    const { runContractFunction } = useWeb3Contract()

    async function approveAndList() {
       
        console.log("Approving...")
        // const nftAddress = data.data[0].inputResult
        // const tokenId = data.data[1].inputResult
        // const price = ethers.utils.parseUnits(data.data[2].inputResult?data.data[2].inputResult:"0", "ether").toString()
        if(priceInEth && tokenId && nftAddress)
        {
            const price = ethers.utils.parseUnits(priceInEth, "ether").toString()
            console.log(nftAddress,tokenId,price)
            const approveOptions = {
                abi: nftAbi,
                contractAddress: nftAddress,
                functionName: "approve",
                params: {
                    to: marketplaceAddress,
                    tokenId: tokenId,
                },
            }
    
            await runContractFunction({
                params: approveOptions,
                onSuccess: (tx) => handleApproveSuccess(tx, nftAddress, tokenId, price),
                onError: (error) => {
                     if(error && error.error)
                     setErr(error.error.message)
                     else
                     setErr("Something wrong went")
                },
            })
        }
         else{
            setErr("Missing Required Field")
         }
    }

    async function handleApproveSuccess(tx, nftAddress, tokenId, price) {
        console.log("Ok! Now time to list")
        await tx.wait()
        const listOptions = {
            abi: nftMarketplaceAbi,
            contractAddress: marketplaceAddress,
            functionName: "listItem",
            params: {
                nftAddress: nftAddress,
                tokenId: tokenId,
                price: price,
            },
        }

        await runContractFunction({
            params: listOptions,
            onSuccess: () => handleListSuccess(),
            onError: (error) => {
                if(error && error.error)
                setErr(error.error.message)
                else
                setErr("Something wrong went")
           },
        })
    }

    async function handleListSuccess() {
        dispatch({
            type: "success",
            message: "NFT Is Listed For Selling Wait For Few Second",
            title: "NFT listed",
            position: "topR",
        })
        setIsDisabled(false)
        setIsVisible(false)
       
        setInterval(() => {
            setPayment(true)
          }, 10000);
    }

   

  

    useEffect(() => {
       
        if(err)
        {
            dispatch({
                type: "error",
                message: err,
                title: "Error",
                position: "topR",
            })
           
            setIsDisabled(false)
            setIsVisible(false)
            
            setErr("") 
        }
    }, [ account, isWeb3Enabled, chainId,err])

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
                  <h3 class="md:text-2xl text-base text-gray-900 font-semibold text-center">Listing Done!</h3>
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
            <div className="mx-5 my-5">
             {isWeb3Enabled && chainString==="11155111"? (   <section className=" px-5 py-5">
   
    <div
      className=" flex  flex-wrap items-center justify-center ">
     
        <img
          src="https://img.freepik.com/premium-photo/cool-neon-party-donkey-headphones-sunglasses-generative-ai_108146-4072.jpg?size=626&ext=jpg&ga=GA1.2.505221811.1685358505&semt=sph"
          class=" px-4 py-4 w-100 h-80 m-auto"
          
          alt="Sample image" /> 
     

      
      <div className="m-auto flex-col flex-warp  ">
    <Modal
            isVisible={isVisible}
            customFooter={<p id="Custom-Footer"></p>}
            // onCancel={setIsVisible(false)}
    //   onCloseButtonPressed={function noRefCheck(){}}
    //   onOk={function noRefCheck(){}}
     
            title="Payment"
        >
             <p
        style={{
          fontWeight: 600,
          marginRight: '1em',
          textAlign: 'center'
        }}
      >
        Your Transection Is Being Confirmed It will Take Some Time
      </p>
        </Modal>
        <>
            <div className="px-4 py-4    mx-2 my-2">
        <Input
                label="NFT Address"
                name="NFT Address"
                type="text"
                onChange={(event) => {
                    setNftAdddress(event.target.value)
                
                }}
            /> 
        </div>
        <div className="px-4 py-4  mx-2 my-2">
     <Input
            label="Token ID"
            name="Token ID"
            type="number"
            onChange={(event) => {
                setTokenId(event.target.value)
            
            }}
           />
           </div>
           <div className="px-4 py-4   mx-2 my-2 "> <Input
        label="Price (in ETH)"
        name="Price (in ETH)"
        type="number"
        onChange={(event) => {
            setPriceInEth(event.target.value)
        }}
    />
    </div>
    <div className="px-4 py-2   mx-2 my-2 ">
  
             <Button
                    onClick={() => {
                        setIsDisabled(true)
                        setIsVisible(true)
                        approveAndList()
                    }}
                    text="Submit"
                    type="button"
                    theme="primary"
                    disabled={isDisabled}
                /> 
                 </div>  
        </>
    
      
        
      </div>
    </div>
  
</section>
           ): (
            <>
                    <h1 className="py-4 px-4 font-bold text-2xl">Web3 Currently Not Enabled</h1>
                    <h1 className="py-4 px-4 font-bold text-base">Please Connect To Your Sepolia Account</h1>
                    </>
        )}
          
        </div>
        )}
        
        
        
        
        </>
       
    )
}