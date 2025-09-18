'use client'
import { useAppContext } from "@/context/AppContext";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// shadcn/ui components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

// Icons
import { 
  Search, 
  Grid3X3, 
  List, 
  SlidersHorizontal,
  X,
  Filter,
  Package,
  Star,
  Heart,
  ShoppingCart,
  Eye,
  Plus
} from "lucide-react";

const AllProducts = () => {
  const { products, addToCart, router } = useAppContext();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [isSearchVisible, setIsSearchVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle scroll behavior for sticky search bar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsSearchVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 150) {
        setIsSearchVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Get unique categories and brands
  const categories = useMemo(() => {
    const cats = ["All", ...new Set(products.map(p => p.category))];
    return cats;
  }, [products]);

  const brands = useMemo(() => {
    const brandList = ["All", ...new Set(products.map(p => p.brand).filter(brand => brand && brand.trim() !== ""))];
    return brandList;
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Brand filter
    if (selectedBrand !== "All") {
      filtered = filtered.filter(product => product.brand === selectedBrand);
    }

    // Price filter
    filtered = filtered.filter(product => 
      product.offerPrice >= priceRange[0] && product.offerPrice <= priceRange[1]
    );

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.offerPrice - b.offerPrice);
        break;
      case "price-high":
        filtered.sort((a, b) => b.offerPrice - a.offerPrice);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
      default:
        filtered.sort((a, b) => b.date - a.date);
        break;
    }

    return filtered;
  }, [products, searchQuery, selectedCategory, selectedBrand, priceRange, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedBrand("All");
    setPriceRange([0, 100000]);
    setSortBy("newest");
  };

  // Navigate to product page
  const handleProductClick = (productId) => {
    router.push(`/product/${productId}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
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
        damping: 12
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      
      {/* Sticky Search Bar */}
      <motion.div 
        initial={{ y: 0, opacity: 1 }}
        animate={{ 
          y: isSearchVisible ? 0 : -100, 
          opacity: isSearchVisible ? 1 : 0 
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-16 lg:top-20 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products, brands, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 h-11 rounded-full"
            />
            <AnimatePresence>
              {searchQuery && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchQuery("")}
                    className="h-7 w-7 p-0 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Filter Controls */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto">
            
            {/* Left Controls */}
            <div className="flex items-center gap-2 min-w-0">
              
              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[120px] h-9">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort Filter */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[100px] h-9">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price ↑</SelectItem>
                  <SelectItem value="price-high">Price ↓</SelectItem>
                  <SelectItem value="name">A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              
              {/* More Filters - Mobile Sheet */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 px-3">
                    <Filter className="w-4 h-4" />
                    <span className="hidden sm:inline ml-2">Filters</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filter Products</SheetTitle>
                    <SheetDescription>
                      Refine your search results
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="mt-6 space-y-6">
                    {/* Brand Filter */}
                    <div className="space-y-3">
                      <Label>Brand</Label>
                      <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Brands" />
                        </SelectTrigger>
                        <SelectContent>
                          {brands.map(brand => (
                            <SelectItem key={brand} value={brand}>
                              {brand}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Price Range */}
                    <div className="space-y-3">
                      <Label>Price Range (₹)</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="min-price" className="text-xs">Min</Label>
                          <Input
                            id="min-price"
                            type="number"
                            placeholder="0"
                            value={priceRange[0]}
                            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                          />
                        </div>
                        <div>
                          <Label htmlFor="max-price" className="text-xs">Max</Label>
                          <Input
                            id="max-price"
                            type="number"
                            placeholder="100000"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Clear Filters */}
                    <Button variant="outline" onClick={clearFilters} className="w-full">
                      Clear All Filters
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              {/* View Toggle */}
              <div className="flex items-center border rounded-lg p-0.5">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 w-8 p-0"
                >
                  <Grid3X3 className="w-3 h-3" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 w-8 p-0"
                >
                  <List className="w-3 h-3" />
                </Button>
              </div>

              {/* Clear Filters Quick Button */}
              <AnimatePresence>
                {(searchQuery || selectedCategory !== "All" || selectedBrand !== "All") && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="h-9 text-xs"
                    >
                      Clear
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="pt-40 lg:pt-44">
        <div className="max-w-7xl mx-auto mt-10 px-4">

          {/* Results Summary */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6"
          >
            <div className="flex items-center gap-3">
              <p className="text-muted-foreground">
                <span className="font-bold text-foreground text-lg">{filteredProducts.length}</span> products found
              </p>
              
              {/* Active Filters */}
              <div className="flex items-center gap-1 overflow-x-auto">
                {searchQuery && (
                  <Badge variant="secondary" className="text-xs">
                    "{searchQuery.length > 10 ? `${searchQuery.slice(0, 10)}...` : searchQuery}"
                  </Badge>
                )}
                {selectedCategory !== "All" && (
                  <Badge variant="outline" className="text-xs">
                    {selectedCategory.length > 8 ? `${selectedCategory.slice(0, 8)}...` : selectedCategory}
                  </Badge>
                )}
                {selectedBrand !== "All" && (
                  <Badge variant="outline" className="text-xs">
                    {selectedBrand.length > 8 ? `${selectedBrand.slice(0, 8)}...` : selectedBrand}
                  </Badge>
                )}
              </div>
            </div>
          </motion.div>

          {/* Products Grid */}
          <AnimatePresence mode="wait">
            {filteredProducts.length > 0 ? (
              <motion.div 
                key="products"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={`pb-16 ${
                  viewMode === "grid" 
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" 
                    : "space-y-4"
                }`}
              >
                {filteredProducts.map((product, index) => (
                  <motion.div 
                    key={product._id || index} 
                    variants={itemVariants}
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    layout
                  >
                    {viewMode === "grid" ? (
                      <ProductGridCard 
                        product={product} 
                        onProductClick={handleProductClick}
                      />
                    ) : (
                      <ProductListCard 
                        product={product} 
                        onProductClick={handleProductClick}
                      />
                    )}
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="no-products"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-20"
              >
                <Card className="max-w-md mx-auto">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No products found</h3>
                    <p className="text-muted-foreground mb-6">
                      Try adjusting your search or filters
                    </p>
                    <Button onClick={clearFilters}>
                      Clear All Filters
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// Product Grid Card Component (unchanged - keeping rating for grid view)
const ProductGridCard = ({ product, onProductClick }) => {
  const { addToCart, router } = useAppContext();
  
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
      <div onClick={() => onProductClick(product._id)}>
        {/* Product Image */}
        <div className="relative aspect-square bg-muted overflow-hidden">
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <Heart className="w-4 h-4" />
          </Button>
          {product.price !== product.offerPrice && (
            <Badge className="absolute top-2 left-2 bg-destructive">
              {Math.round(((product.price - product.offerPrice) / product.price) * 100)}% OFF
            </Badge>
          )}
          
          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button variant="secondary" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Quick View
            </Button>
          </div>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-sm line-clamp-2 mb-1">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground mb-2">
            {product.brand || "Unknown"} • {product.category}
          </p>
          
          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            {[...Array(4)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            ))}
            <Star className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground ml-1">(4.2)</span>
          </div>
          
          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="font-bold text-lg">
              ₹{product.offerPrice?.toLocaleString()}
            </span>
            {product.price !== product.offerPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{product.price?.toLocaleString()}
              </span>
            )}
          </div>
        </CardContent>
      </div>
      
      {/* Actions - Outside clickable area */}
      <CardFooter className="p-4 pt-0">
        <div className="grid grid-cols-2 gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product._id);
            }}
            className="text-xs"
          >
            <ShoppingCart className="w-3 h-3 mr-1" />
            Add
          </Button>
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product._id);
              router.push('/cart');
            }}
            className="text-xs"
          >
            Buy Now
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

// Enhanced Product List Card Component with buttons on right side, no rating, and favorite button
const ProductListCard = ({ product, onProductClick }) => {
  const { addToCart, router } = useAppContext();
  const [isFavorite, setIsFavorite] = useState(false);
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-8">
        <div className="flex gap-8">
          {/* Product Image - Clickable */}
          <div 
            className="w-32 h-32 flex-shrink-0 relative bg-muted rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform"
            onClick={() => onProductClick(product._id)}
          >
            <img
              src={product.images?.[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.price !== product.offerPrice && (
              <Badge className="absolute -top-1 -right-1 bg-destructive text-xs">
                {Math.round(((product.price - product.offerPrice) / product.price) * 100)}% OFF
              </Badge>
            )}
          </div>
          
          {/* Product Details */}
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1 min-w-0 mr-8">
                {/* Clickable Title */}
                <h3 
                  className="font-semibold text-xl line-clamp-2 mb-3 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => onProductClick(product._id)}
                >
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {product.brand || "Unknown"} • {product.category}
                </p>
                
                {/* Add to Favorites Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFavorite(!isFavorite);
                  }}
                  className={`w-fit px-3 h-9 ${isFavorite ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                  {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </Button>
              </div>
              
              {/* Price and Actions Section - Right Side */}
              <div className="flex flex-col items-end gap-8 min-w-fit">
                {/* Price Section */}
                <div className="text-right">
                  <div className="font-bold text-3xl mb-2">
                    ₹{product.offerPrice?.toLocaleString()}
                  </div>
                  {product.price !== product.offerPrice && (
                    <div className="text-base text-muted-foreground line-through mb-1">
                      ₹{product.price?.toLocaleString()}
                    </div>
                  )}
                  <div className="text-sm text-green-600 font-medium">
                    You save ₹{(product.price - product.offerPrice)?.toLocaleString()}
                  </div>
                </div>
                
                {/* Action Buttons - Right Side with increased margin from top */}
                <div className="flex flex-col gap-4 mt-8">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product._id);
                    }}
                    className="w-44 h-12"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    size="lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product._id);
                      router.push('/cart');
                    }}
                    className="w-44 h-12"
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
            
            <p 
              className="text-base text-muted-foreground mb-6 line-clamp-3 cursor-pointer leading-relaxed"
              onClick={() => onProductClick(product._id)}
            >
              {product.description || "No description available for this product."}
            </p>
            
            {/* Additional product info - Bottom */}
            <div className="mt-auto pt-6 border-t">
              <div className="flex items-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>7 Days Return</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Warranty Included</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AllProducts;
