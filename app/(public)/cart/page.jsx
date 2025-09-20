'use client'
import React, { useState } from "react";
import OrderSummary from "@/components/OrderSummary";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";

// shadcn/ui components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft, 
  Package,
  ShoppingBag,
  Heart
} from "lucide-react";

const Cart = () => {
  const { products, router, cartItems, addToCart, updateCartQuantity, getCartCount, currency } = useAppContext();
  const [removingItems, setRemovingItems] = useState(new Set());

  const handleRemoveItem = async (itemId) => {
    setRemovingItems(prev => new Set([...prev, itemId]));
    setTimeout(() => {
      updateCartQuantity(itemId, 0);
      setRemovingItems(prev => {
        const newSet = new Set([...prev]);
        newSet.delete(itemId);
        return newSet;
      });
    }, 300);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
    } else {
      updateCartQuantity(itemId, newQuantity);
    }
  };

  const cartProducts = Object.keys(cartItems)
    .map(itemId => {
      const product = products.find(product => product._id === itemId);
      return product && cartItems[itemId] > 0 ? { ...product, quantity: cartItems[itemId] } : null;
    })
    .filter(Boolean);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    exit: {
      x: -100,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  if (cartProducts.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen bg-background pt-20 px-6 md:px-16 lg:px-32"
      >
        <div className="max-w-2xl mx-auto text-center py-20">
          <Card>
            <CardContent className="p-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <ShoppingCart className="w-10 h-10 text-muted-foreground" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-3">Your Cart is Empty</h2>
              <p className="text-muted-foreground mb-8">
                Looks like you haven't added any products to your cart yet
              </p>
              <Button 
                onClick={() => router.push('/all-products')}
                size="lg"
                className="w-full sm:w-auto"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background pt-20"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-32 py-8">
        
        {/* Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <ShoppingCart className="w-8 h-8 text-primary" />
              Shopping Cart
            </h1>
            <p className="text-muted-foreground mt-1">
              {getCartCount()} {getCartCount() === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => router.push('/all-products')}
            className="w-fit"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Cart Items */}
          <div className="flex-1 space-y-4">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <AnimatePresence mode="popLayout">
                {cartProducts.map((product) => (
                  <motion.div
                    key={product._id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    whileHover={{ 
                      scale: 1.01,
                      transition: { type: "spring", stiffness: 400, damping: 25 }
                    }}
                    className={removingItems.has(product._id) ? "pointer-events-none" : ""}
                  >
                    <Card className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex gap-6">
                          
                          {/* Product Image */}
                          <motion.div 
                            className="relative w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0"
                            whileHover={{ scale: 1.05 }}
                          >
                            <Image
                              src={product.images?.[0]}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                            {product.price !== product.offerPrice && (
                              <Badge className="absolute top-1 left-1 bg-destructive text-xs">
                                {Math.round(((product.price - product.offerPrice) / product.price) * 100)}% OFF
                              </Badge>
                            )}
                          </motion.div>
                          
                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-lg line-clamp-2">
                                  {product.name}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {product.brand} • {product.category}
                                </p>
                              </div>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveItem(product._id)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10 ml-2"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            
                            {/* Price and Quantity */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                              
                              {/* Price */}
                              <div className="flex items-baseline gap-2">
                                <span className="text-xl font-bold text-primary">
                                  {currency}{product.offerPrice?.toLocaleString()}
                                </span>
                                {product.price !== product.offerPrice && (
                                  <span className="text-sm text-muted-foreground line-through">
                                    {currency}{product.price?.toLocaleString()}
                                  </span>
                                )}
                              </div>
                              
                              {/* Quantity Controls */}
                              <div className="flex items-center gap-3">
                                <div className="flex items-center border rounded-lg">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleQuantityChange(product._id, product.quantity - 1)}
                                    className="h-8 w-8 p-0 hover:bg-muted"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                  
                                  <Input
                                    type="number"
                                    value={product.quantity}
                                    onChange={(e) => handleQuantityChange(product._id, parseInt(e.target.value) || 1)}
                                    className="w-16 h-8 text-center border-0 focus-visible:ring-0"
                                    min="1"
                                  />
                                  
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => addToCart(product._id)}
                                    className="h-8 w-8 p-0 hover:bg-muted"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                </div>
                                
                                <div className="text-right min-w-0">
                                  <p className="font-semibold">
                                    {currency}{(product.offerPrice * product.quantity).toLocaleString()}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Subtotal
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Button 
                variant="outline" 
                onClick={() => router.push('/all-products')}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => {
                  Object.keys(cartItems).forEach(itemId => {
                    updateCartQuantity(itemId, 0);
                  });
                }}
                className="flex-1 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Cart
              </Button>
            </motion.div>
          </div>

          {/* Original OrderSummary Component */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <OrderSummary />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Cart;
