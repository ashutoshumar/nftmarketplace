
import { Button } from '@web3uikit/core';
import { ConnectButton } from '@web3uikit/web3'
import Link from "next/link"
import { useState } from 'react';
export default function Header() {
    const [toggleMenu, setToggleMenu] = useState(false);
    return (
       <div>
        <nav className="p-5 border-b-2 flex flex-row justify-between items-center">
            <h1 className="py-4 px-4 font-bold text-3xl">NFT Marketplace</h1>
            
        <section className="MOBILE-MENU flex  lg:hidden">
        <div
            className="HAMBURGER-ICON space-y-2"
            onClick={() => setToggleMenu(!toggleMenu)} 
          >
            <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
            <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
            <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
          </div>

         
              </section>
      
                  <div className="hidden  lg:flex lg:flex-row items-center">
                      <Link href="/">
                          <a className="mr-4 p-6">Home</a>
                      </Link>
                      <Link href="/sell-nft">
                          <a className="mr-4 p-6">Sell NFT</a>
                      </Link>
                      <Link href="/withdraw">
                          <a className="mr-4 p-6">Withdraw</a>
                      </Link>
                  
                  <ConnectButton moralisAuth={false} /> 
              
                  </div>
                
              </nav>

              <div
          className={`fixed z-40 w-full  bg-gray-100 overflow-hidden flex flex-col gap-12  origin-top duration-700 ${
            !toggleMenu ? "h-0" : "h-full"
          }`}
        >
          <div className="px-8">
            <div className="flex flex-col gap-8 font-bold tracking-wider">
                <div className='absolute right-0'>
                 <ConnectButton moralisAuth={false} /> 
                </div>
            <Link href="/">
                    <a className="">Home</a>
                </Link>
                <Link href="/sell-nft">
                    <a className="">Sell NFT</a>
                </Link>
                <Link href="/withdraw">
                    <a className="">Withdraw</a>
                </Link>
                
            </div>
          </div>
        </div>
              </div>
    )
}



{/*
 <nav className="p-5 border-b-2 flex flex-row justify-between items-center">
        <div >
          <div >
            {/* Primary menu and logo 
            <div className="flex items-center gap-16 my-12">
              {/* logo 
              <div>
                <a
                  href="/"
                  className="flex gap-1 font-bold text-gray-700 items-center "
                >
                  <span>NFT Marketplace</span>
                </a>
              </div>
              {/* primary 
              <div className="hidden  lg:flex lg:flex-row items-center">
                        <Link href="/">
                            <a className="mr-4 p-6">Home</a>
                        </Link>
                        <Link href="/sell-nft">
                            <a className="mr-4 p-6">Sell NFT</a>
                        </Link>
                        <Link href="/withdraw">
                            <a className="mr-4 p-6">Withdraw</a>
                        </Link>
                        <ConnectButton moralisAuth={false} />
                    </div>
            </div>
            {/* secondary 
            <div className="flex gap-6">
              <div className="hidden xs:flex items-center gap-10">
               
                <div>
                <ConnectButton moralisAuth={false} />
                </div>
              </div>
              {/* Mobile navigation toggle 
              <div className="lg:hidden flex items-center">
                <button onClick={() => setToggleMenu(!toggleMenu)}>
                <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
                    <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
                    <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* mobile navigation 
        <div
          className={`fixed z-40 w-full  bg-gray-100 overflow-hidden flex flex-col lg:hidden gap-12  origin-top duration-700 ${
            !toggleMenu ? "h-0" : "h-full"
          }`}
        >
          <div className="px-8">
            <div className="flex flex-col gap-8 font-bold tracking-wider">
              <a href="#" className="border-l-4 border-gray-600">
                Features
              </a>
              <a href="#">Pricing</a>
              <a href="#">Download</a>
              <a href="#">Classic</a>
            </div>
          </div>
        </div>
        </nav> */}

{/*
 
*/}