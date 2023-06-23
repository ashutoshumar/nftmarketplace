
import { NotificationProvider } from "@web3uikit/core";
import "../styles/globals.css"
import { MoralisProvider } from "react-moralis"
import Header from "../components/Header"
import Head from "next/head"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
import { AppProvider } from '../context/context.js'
const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: process.env.NEXT_PUBLIC_SUBGRAPH_URL,
})

function MyApp({ Component, pageProps }) {
    return (
        <div>
            <Head>
                <title>NFT Marketplace</title>
                <meta name="description" content="NFT Marketplace" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
             <MoralisProvider initializeOnMount={false}> 
                <ApolloProvider client={client}>
                    <NotificationProvider>
                    <AppProvider>
                        <Header />
                        <Component {...pageProps} />
                        </AppProvider>
                    </NotificationProvider>
                </ApolloProvider>
             </MoralisProvider> 
        </div>
    )
}

export default MyApp