"use client"
import React from "react";
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon} from "@/assets/assets";
import Link from "next/link"
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";



const Navbar = () => {

  const { isSeller, router , user } = useAppContext();
  const { openSignIn } = useClerk();

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
       <div className="flex items-center">
          <Link 
            href="/" 
            className="relative flex items-center group transition-transform duration-200 hover:scale-105"
            aria-label="Power Electronics Home"
          >
            <div className="relative w-12 h-12 sm:w-14 sm:h-14">
              <Image 
                src="/favicon.png" 
                alt="Power Electronics Logo" 
                width={56} 
                height={56} 
                className="rounded-lg  = transition-shadow duration-200"
                priority
              />
            </div>
            <div className="ml-3 hidden sm:block">
              <h1 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-200">
                Power Electronics
              </h1>
              <p className="text-xs text-muted-foreground">
                Your Trusted Power Solutions Partner
              </p>
            </div>
          </Link>
        </div>
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-gray-900 transition">
          Home
        </Link>
        <Link href="/all-products" className="hover:text-gray-900 transition">
          Shop
        </Link>
        <Link href="/" className="hover:text-gray-900 transition">
          About Us
        </Link>
        <Link href="/contact-us" className="hover:text-gray-900 transition">
          Contact
        </Link>

        {isSeller && <button onClick={() => router.push('/seller')} className="text-xs border px-4 py-1.5 rounded-full">Seller Dashboard</button>}

      </div>

      <ul className="hidden md:flex items-center gap-4 ">
        <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
        {user ? <>
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action label = 'Home' labelIcon = {<HomeIcon />} onClick={() => router.push('/')} />
              <UserButton.Action label = 'Product' labelIcon = {<BoxIcon />} onClick={() => router.push('/all-products')} />
              <UserButton.Action label = 'Cart' labelIcon = {<CartIcon />} onClick={() => router.push('/cart')} />
              <UserButton.Action label = 'Orders' labelIcon = {<BagIcon/>} onClick={() => router.push('/my-orders')} />
            </UserButton.MenuItems>
          </UserButton>
         </> :<button onClick={openSignIn} className="flex items-center gap-2 hover:text-gray-900 transition">
          <Image src={assets.user_icon} alt="user icon" />
          Account
        </button>}
      </ul>

      <div className="flex items-center md:hidden gap-3">
        {isSeller && <button onClick={() => router.push('/seller')} className="text-xs border px-4 py-1.5 rounded-full">Seller Dashboard</button>}
        {user ? <>
          <UserButton>

            <UserButton.MenuItems>
              <UserButton.Action label = 'Home' labelIcon = {<HomeIcon />} onClick={() => router.push('/')} />
  
              <UserButton.Action label = 'Product' labelIcon = {<BoxIcon />} onClick={() => router.push('/all-products')} />
              <UserButton.Action label = 'Cart' labelIcon = {<CartIcon />} onClick={() => router.push('/cart')} />
              <UserButton.Action label = 'Orders' labelIcon = {<BagIcon/>} onClick={() => router.push('/my-orders')} /> 
            </UserButton.MenuItems>
          </UserButton>
         </> :<button onClick={openSignIn} className="flex items-center gap-2 hover:text-gray-900 transition">
          <Image src={assets.user_icon} alt="user icon" />
          Account
        </button>}
      </div>
    </nav>
  );
};

export default Navbar;