'use client'
import React from "react";
import HomeProducts from "@/components/Home/HomeProducts";
import CirLogo from "@/components/Home/CirLogo";
import StatsShowcase from "@/components/Home/ExPro";
import HeroSection from "@/components/Home/Hero";

const Home = () => {
  return (
    <>


        <HeroSection/>
        <CirLogo/>
        <StatsShowcase />
        <HomeProducts />
 
    </>
  );
};

export default Home;
