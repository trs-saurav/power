import React from 'react'
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ShoppingCart, 
  Eye,
  Zap,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const { currency, router } = useAppContext();

  const handleProductClick = () => {
    router.push('/product/' + product._id);
    scrollTo(0, 0);
  };

  // Calculate discount percentage if originalPrice exists
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.offerPrice) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group w-full max-w-sm"
    >
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-card/80 backdrop-blur-sm">
        <div className="relative">
          {/* Product Image Container */}
          <div 
            onClick={handleProductClick}
            className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10 cursor-pointer"
          >
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Quick Actions */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full bg-background/90 backdrop-blur-sm hover:bg-blue-50 hover:text-blue-500 transition-colors duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  handleProductClick();
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              {discountPercentage > 0 && (
                <Badge className="bg-red-500 hover:bg-red-600 text-white font-medium px-2 py-1">
                  -{discountPercentage}%
                </Badge>
              )}
              {product.featured && (
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium px-2 py-1">
                  <Zap className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
          </div>

          <CardContent className="p-4 space-y-3">
            {/* Product Name */}
            <div 
              onClick={handleProductClick}
              className="cursor-pointer"
            >
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2 leading-tight">
                {product.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price Section */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-foreground">
                  {currency}{product.offerPrice}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {currency}{product.originalPrice}
                  </span>
                )}
              </div>
              
              {/* Trending indicator */}
              <div className="flex items-center gap-1 text-emerald-600">
                <TrendingUp className="h-3 w-3" />
                <span className="text-xs font-medium">Hot</span>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-3">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleProductClick();
                }}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 hover:shadow-lg"
                size="sm"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Buy Now
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
