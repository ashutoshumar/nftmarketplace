
import { useMoralis } from "react-moralis"
import NFTBox from "../components/NFTBox.js"
import networkMapping from "../constants/networkMapping.json"
import GET_ACTIVE_ITEMS from "../constants/subgraphQueries"
import { useQuery } from "@apollo/client"
import { useEffect, useState } from "react"
import { useAppContext } from '../context/context'
export default function Home() {
    const { chainId, isWeb3Enabled } = useMoralis()
    const chainString = "11155111"
    const marketplaceAddress =  networkMapping[chainString]?networkMapping[chainString].NftMarketplace[0] : null
   
     const { loading, error, data:listedNfts,refetch } = useQuery(GET_ACTIVE_ITEMS,{
        fetchPolicy:"network-only"
      })
    
    
    const {isUpdated,setIsUpdated  }= useAppContext()
    useEffect(() => {
       
       if(isUpdated)
       {
        refetch()
        console.log(loading)
        console.log(listedNfts)
        setIsUpdated(false)
       }
       
    }, [isUpdated,listedNfts])
   
    return (
        <div className="container mx-auto">
          
         
          {isWeb3Enabled && chainString==="11155111" ? (
                 
                    loading || !listedNfts ? (
                        
                        <h1 className="py-4 px-4 font-bold text-2xl">Loading...</h1>
                    ) : (
                        <>
                            <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1> 
             <div className="">
                             
        <div className='container  grid justify-items-center lg:grid-cols-4 lg:gap-8 md:grid-cols-3 md:gap-8 sm:grid-cols-2 sm:gap-2  '>
                      {  listedNfts.activeItems.map((nft) => {
                            const { price, nftAddress, tokenId, seller } = nft
                            return marketplaceAddress ? (
                                <NFTBox
                                    price={price}
                                    nftAddress={nftAddress}
                                    tokenId={tokenId}
                                    marketplaceAddress={marketplaceAddress}
                                    seller={seller}
                                    key={`${nftAddress}${tokenId}`}
                                />
                            ) : (
                                <div>Network error, please switch to a Supported network. </div>
                            )
                        })}
                        </div>
                        </div>
                         </>
                    )
                ) : (
                    <>
                    <h1 className="py-4 px-4 font-bold text-2xl">Web3 Currently Not Enabled</h1>
                    <h1 className="py-4 px-4 font-bold text-base">Please Connect To Your Sepolia Account</h1>
                    </>
                )}
            
        </div>
    )
}
