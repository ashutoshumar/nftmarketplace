import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import { ethers } from "ethers"
import networkMapping from "../constants/networkMapping.json"
import { useEffect, useState } from "react"
import {  useNotification, Button } from "@web3uikit/core"
import { useMoralis, useWeb3Contract } from "react-moralis"
export default function Withdraw() 
{
    const [disabled,setDisabled]=useState(false)
    const dispatch = useNotification()
    const { chainId, account, isWeb3Enabled } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "11155111"
    const [err,setErr]=useState("")
    const marketplaceAddress = networkMapping[chainString]?networkMapping[chainString].NftMarketplace[0]:null
    const [proceeds, setProceeds] = useState("0")
    const [payment,setPayment]=useState(false)

    const { runContractFunction } = useWeb3Contract()
    const handleWithdrawSuccess = () => {
        dispatch({
            type: "success",
            message: "Withdrawing proceeds",
            position: "topR",
        })
        setProceeds("0")
        setDisabled(false)
        setPayment(true)
    }
    async function setupUI() {
        const returnedProceeds = await runContractFunction({
            params: {
                abi: nftMarketplaceAbi,
                contractAddress: marketplaceAddress,
                functionName: "getProceeds",
                params: {
                    seller: account,
                },
            },
            onError: (error) => {
                if(error && error.error)
                setErr(error.error.message)
                else
                {setErr("Something wrong went")
                 console.log(error)}
           },
        })
        if (returnedProceeds) {
            setProceeds(returnedProceeds.toString())
        }
    }
    useEffect(() => {
        if(chainString==="11155111" && account)
        setupUI()
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
    }, [proceeds, account, isWeb3Enabled, chainId,err])
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
                  <h3 class="md:text-2xl text-base text-gray-900 font-semibold text-center">Withdraw Done!</h3>
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
            <div>

    
            {isWeb3Enabled && chainString==="11155111" ? (     <div className="mx-5 my-5">
                         <h1 className="py-4 px-4 font-bold text-3xl">Withdraw {ethers.utils.formatUnits(proceeds, "ether")}ETH proceeds</h1>
                           
                        {proceeds != "0" ? (
                         <div className="py-4 px-4">
            
                            <Button
                                onClick={() => {
                                  setDisabled(true)
                                    runContractFunction({
                                        params: {
                                            abi: nftMarketplaceAbi,
                                            contractAddress: marketplaceAddress,
                                            functionName: "withdrawProceeds",
                                            params: {},
                                        },
                                        onError: (error) => setErr("Transection Failed"),
                                        onSuccess: () => handleWithdrawSuccess(),
                                    })
                                }}
                                text="Withdraw"
                                type="button"
                                theme="primary"
                                disabled={disabled}
                            />
                            </div>
                        ) : (
                            <h1 className="py-4 px-4  text-2xl">No proceeds detected</h1>
                          
                        )} 
                         </div> ): (
                         <>
                         <h1 className="py-4 px-4 font-bold text-2xl">Web3 Currently Not Enabled</h1>
                         <h1 className="py-4 px-4 font-bold text-base">Please Connect To Your Sepolia Account</h1>
                         </>
                    )}
                    </div>)
}


      </>
    )
}