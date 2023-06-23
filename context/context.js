import { createContext, useState, useEffect, useContext } from 'react'
export const appContext = createContext()
import { useQuery } from "@apollo/client"
import GET_ACTIVE_ITEMS from "../constants/subgraphQueries"
export const AppProvider = ({ children }) => {
   
     const [isUpdated,setIsUpdated]=useState(false)
     const [loadiing ,setLoading]=useState()
     const [listedNfts,setListedNfts]=useState()
    const [imageURI, setIimageURI] = useState("")
    const [tokenName, setTtokenName] = useState("")
    const [tokenDescription, setTtokenDescription] = useState("")
    const [nftAddress,setNftAdddress]=useState("")
    const [seller,setSeller]=useState("")
    const [price,setPrice]=useState()
    const [tokenId,setTtokenId]=useState()
    const [marketplaceAddress,setMarketplaceAddress]=useState("")
    
      const { loading, error, data} = useQuery(GET_ACTIVE_ITEMS)
      useEffect(() => {
       
        if(!loading)
        {
           setListedNfts(data)
          setLoading(loading)
        }
    },[loading])
     
    //setListedNfts(data)
   // setLoading(loading)
    return (
      <appContext.Provider
        value={{
          imageURI,setIimageURI,
          tokenName,setTtokenName,
          tokenDescription,setTtokenDescription,
          nftAddress,setNftAdddress,
          seller,setSeller,
          price,setPrice,
          tokenId,setTtokenId,
          marketplaceAddress,setMarketplaceAddress,
           loadiing,listedNfts,setLoading,setListedNfts,
           isUpdated,setIsUpdated
        }}
      >
        {children}
      </appContext.Provider>
    )
  }

export const useAppContext = () => {
    return useContext(appContext)
  }