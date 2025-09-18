import React from "react";
import ProductCard from "../ProductCard";
import { useAppContext } from "@/context/AppContext";

const HomeProducts = () => {
  const { products, router } = useAppContext();

  return (
    <div className="w-full py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Popular Products
          </h2>
          <p className="text-muted-foreground text-lg">
            Discover our most trusted electrical solutions
          </p>
        </div>
        
<div className="flex justify-center mb-12">
  <div className="w-[70%] grid grid-cols-2 md:grid-cols-4 gap-6 place-items-center">
    {products.slice(0, 4).map((product, index) => (
      <div key={index} className="w-full">
        <ProductCard product={product} />
      </div>
    ))}
  </div>
</div>

        
        <div className="text-center">
          <button 
            onClick={() => { router.push('/all-products') }} 
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 hover:border-primary/40 rounded-full font-medium transition-all duration-200 hover:shadow-lg"
          >
            See All Products
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeProducts;
