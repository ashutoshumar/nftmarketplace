import { Modal, Input, useNotification } from "@web3uikit/core"
import { useState,useEffect } from "react"
import { useWeb3Contract } from "react-moralis"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import { ethers } from "ethers"
import { useAppContext } from '../context/context'
import { useQuery } from "@apollo/client"
import GET_ACTIVE_ITEMS from "../constants/subgraphQueries"
export default function UpdateListingModal({
    nftAddress,
    tokenId,
    isVisible,
    marketplaceAddress,
    onClose,
    setPricee
}) {
    const dispatch = useNotification()
    const {setLoading,setListedNfts ,setIsUpdated}= useAppContext()
    const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState(0)
    const [err,setErr]=useState("")
    // const { loading, error, data,refetch} = useQuery(GET_ACTIVE_ITEMS)
      
    const handleUpdateListingSuccess = () => {
        setIsUpdated(true)
        //  console.log(loading)
        //  console.log(data)
        // setLoading(loading)
        // setListedNfts(data)
        dispatch({
            type: "success",
            message: "listing updated",
            title: "Listing updated",
            position: "topR",
        })
        setPricee(ethers.utils.parseEther(priceToUpdateListingWith || "0"))
        onClose && onClose()
        setPriceToUpdateListingWith("0")
    }

    const { runContractFunction: updateListing } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "updateListing",
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
            newPrice: ethers.utils.parseEther(priceToUpdateListingWith || "0"),
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
    }, [ err])

    return (
        <Modal
            isVisible={isVisible}
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            onOk={() => {
                updateListing({
                    onError: (error) =>{
                        if(error && error.error)
                        setErr(error.error.message)
                        else
                        console.log(error)

                        onClose && onClose()
                   },
                    onSuccess: () => handleUpdateListingSuccess(),
                })
            }}
        >
            <Input
                label="Update listing price in L1 Currency (ETH)"
                name="New listing price"
                type="number"
                onChange={(event) => {
                    setPriceToUpdateListingWith(event.target.value)
                }}
            />
        </Modal>
    )
}