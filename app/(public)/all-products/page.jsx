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
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { ArrowRight } from "lucide-react";

// Icons
import { 
  Search, 
  Grid3X3, 
  List, 
  X,
  Filter,
  Package,
  Star,
  Heart,
  ShoppingCart,
  Eye,
  Plus,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal
} from "lucide-react";




const AllProducts = () => {
  const { products, addToCart, router, pagination, fetchProductData } = useAppContext();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Sync pagination from context
  useEffect(() => {
    fetchProductData(currentPage, itemsPerPage);
  }, [currentPage]);

  // Handle filter changes (reset to page 1)
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedBrand, searchQuery, sortBy]);

  // Get unique categories and brands for the sidebar
  const categories = useMemo(() => ["All", ...new Set(products.map(p => p.category))], [products]);
  const brands = useMemo(() => ["All", ...new Set(products.map(p => p.brand).filter(b => b))], [products]);

  // Client-side filtering (for smooth UX, though pagination is backend)
  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (searchQuery) {
      filtered = filtered.filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand?.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (selectedCategory !== "All") filtered = filtered.filter(p => p.category === selectedCategory);
    if (selectedBrand !== "All") filtered = filtered.filter(p => p.brand === selectedBrand);
    filtered = filtered.filter(p => p.offerPrice >= priceRange[0] && p.offerPrice <= priceRange[1]);
    
    // Sorting
    return [...filtered].sort((a, b) => {
      if (sortBy === "price-low") return a.offerPrice - b.offerPrice;
      if (sortBy === "price-high") return b.offerPrice - a.offerPrice;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [products, searchQuery, selectedCategory, selectedBrand, priceRange, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedBrand("All");
    setPriceRange([0, 200000]);
    setSortBy("newest");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#030712] text-gray-900 dark:text-foreground selection:bg-primary/30">
      
      {/* Top Marketplace Search Bar */}
      <div className="fixed top-[64px] lg:top-[80px] left-0 right-0 z-50 bg-white dark:bg-[#030712] border-b border-gray-200 dark:border-white/5 transition-all duration-300">
        <div className="max-w-[1440px] mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-slate-500" />
              <Input
                placeholder="Search for systems, components, or manufacturers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-12 h-11 bg-gray-100 dark:bg-[#0f172a]/50 border border-gray-300 dark:border-white/10 rounded-md focus:ring-1 focus:ring-primary/20 text-sm text-gray-900 dark:text-foreground placeholder:text-gray-500 dark:placeholder:text-slate-400"
              />
              {searchQuery && (
                <X 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" 
                  onClick={() => setSearchQuery("")}
                />
              )}
            </div>
            
            <div className="hidden md:flex items-center gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] h-10 rounded-md border-border bg-secondary/10">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Latest Arrivals</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name: A-Z</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex bg-secondary/20 p-1 rounded-md border border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={`h-8 w-8 p-0 ${viewMode === "grid" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={`h-8 w-8 p-0 ${viewMode === "list" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 py-8 pt-[120px] lg:pt-[140px]">
        <div className="flex gap-8">
          
          {/* Left Sidebar - Filters (Marketplace Style) */}
          <aside className="hidden lg:block w-72 shrink-0 space-y-8 sticky top-[170px] self-start h-[calc(100vh-220px)] overflow-y-auto no-scrollbar pr-4">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 dark:text-foreground">Filters</h2>
                {(searchQuery || selectedCategory !== "All" || selectedBrand !== "All") && (
                  <button onClick={clearFilters} className="text-[10px] text-amber-600 dark:text-primary hover:underline font-bold uppercase">Clear All</button>
                )}
              </div>
              <Separator className="mb-6 opacity-50" />
              
              <div className="space-y-6">
                {/* Category Group */}
                <div className="space-y-3">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-muted-foreground">Category</h3>
                  <div className="space-y-2">
                    {categories.map(cat => (
                      <div key={cat} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`cat-${cat}`} 
                          checked={selectedCategory === cat} 
                          onCheckedChange={() => setSelectedCategory(cat)}
                          className="rounded-sm"
                        />
                        <Label htmlFor={`cat-${cat}`} className="text-xs font-medium cursor-pointer text-gray-700 dark:text-foreground hover:text-primary dark:hover:text-primary transition-colors">{cat}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Manufacturer Group */}
                <div className="space-y-3">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-muted-foreground">Manufacturers</h3>
                  <div className="space-y-2">
                    {brands.map(brand => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`brand-${brand}`} 
                          checked={selectedBrand === brand} 
                          onCheckedChange={() => setSelectedBrand(brand)}
                          className="rounded-sm"
                        />
                        <Label htmlFor={`brand-${brand}`} className="text-xs font-medium cursor-pointer text-gray-700 dark:text-foreground hover:text-primary dark:hover:text-primary transition-colors">{brand}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range Slider */}
                <div className="space-y-4">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-muted-foreground">Price Range (₹)</h3>
                  <div className="px-2">
                    <Slider
                      defaultValue={[0, 200000]}
                      max={200000}
                      step={1000}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="my-6"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="bg-gray-100 dark:bg-secondary/20 border border-gray-300 dark:border-border px-3 py-1.5 rounded-md text-[11px] font-mono flex-1 text-center text-gray-900 dark:text-foreground">₹{priceRange[0].toLocaleString()}</div>
                    <div className="text-gray-600 dark:text-muted-foreground text-[10px]">to</div>
                    <div className="bg-gray-100 dark:bg-secondary/20 border border-gray-300 dark:border-border px-3 py-1.5 rounded-md text-[11px] font-mono flex-1 text-center text-gray-900 dark:text-foreground">₹{priceRange[1].toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-border/50">
              <div className="bg-primary/5 border border-primary/20 p-4 rounded-md">
                <h4 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">Technical Support</h4>
                <p className="text-[10px] text-muted-foreground leading-relaxed uppercase tracking-widest">
                  Connect with our systems engineering team for custom infrastructure design.
                </p>
              </div>
            </div>
          </aside>

          {/* Main Product Display Area */}
          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs text-gray-700 dark:text-muted-foreground uppercase tracking-widest font-medium">
                Showing <span className="text-gray-900 dark:text-foreground font-bold">{filteredProducts.length}</span> results 
                {pagination.totalProducts > 0 && (
                  <span> of <span className="text-gray-900 dark:text-foreground font-bold">{pagination.totalProducts}</span> total units</span>
                )}
              </p>
              
              {/* Mobile Filter Trigger */}
              <div className="lg:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 px-4 rounded-md border-border bg-secondary/10">
                      <SlidersHorizontal className="w-3.5 h-3.5 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-72 bg-background p-6">
                    <SheetHeader className="mb-8">
                      <SheetTitle className="text-sm font-bold uppercase tracking-widest">Filters</SheetTitle>
                    </SheetHeader>
                    <div className="space-y-8">
                       <div className="space-y-4">
                        <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Category</h3>
                        {categories.map(cat => (
                           <div key={cat} className="flex items-center space-x-2">
                             <Checkbox id={`m-cat-${cat}`} checked={selectedCategory === cat} onCheckedChange={() => setSelectedCategory(cat)} />
                             <Label htmlFor={`m-cat-${cat}`}>{cat}</Label>
                           </div>
                        ))}
                       </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {filteredProducts.length > 0 ? (
                <motion.div
                  key={viewMode}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className={viewMode === "grid" 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" 
                    : "flex flex-col gap-4"
                  }
                >
                  {filteredProducts.map((product) => (
                    viewMode === "grid" 
                      ? <ProductGridCard key={product._id} product={product} onProductClick={(id) => router.push(`/product/${id}`)} />
                      : <ProductListCard key={product._id} product={product} onProductClick={(id) => router.push(`/product/${id}`)} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-32 text-center"
                >
                  <div className="w-20 h-20 bg-gray-200 dark:bg-secondary/20 rounded-full flex items-center justify-center mb-6">
                    <Package className="w-10 h-10 text-gray-400 dark:text-muted-foreground/30" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 uppercase tracking-tight text-gray-900 dark:text-foreground">No Units Found</h3>
                  <p className="text-gray-700 dark:text-muted-foreground text-sm max-w-xs uppercase tracking-widest font-light">
                    Adjust your system parameters to find the matching industrial specification.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="mt-16 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="rounded-md border-border h-10 w-10 p-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <div className="flex items-center gap-1">
                  {[...Array(pagination.totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className={`h-10 w-10 p-0 rounded-md text-[11px] font-bold ${currentPage === pageNum ? "bg-primary text-primary-foreground" : "border-border hover:bg-secondary/20"}`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === pagination.totalPages}
                  onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                  className="rounded-md border-border h-10 w-10 p-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};


// Product Grid Card Component
const ProductGridCard = ({ product, onProductClick }) => {
  const { addToCart, router } = useAppContext();
  
  // Mock rating for marketplace look
  const rating = 4.5;
  const reviews = Math.floor(Math.random() * 200) + 50;

  return (
    <Card className="group bg-white dark:bg-card border border-gray-200 dark:border-border hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden flex flex-col h-full">
      <div className="relative aspect-square bg-gray-100 dark:bg-secondary/10 overflow-hidden group-hover:bg-gray-200 dark:group-hover:bg-secondary/20 transition-colors cursor-pointer" onClick={() => onProductClick(product._id)}>
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
        />
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 rounded-full bg-background/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => { e.stopPropagation(); /* Add to Wishlist */ }}
        >
          <Heart className="w-4 h-4" />
        </Button>
      </div>

      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="mb-2">
           <span className="text-[10px] font-bold text-amber-600 dark:text-primary uppercase tracking-tighter">{product.brand || "Industrial Spec"}</span>
        </div>
        <h3 
          className="font-bold text-sm line-clamp-2 mb-2 text-gray-900 dark:text-foreground hover:text-primary dark:hover:text-primary transition-colors cursor-pointer flex-1"
          onClick={() => onProductClick(product._id)}
        >
          {product.name}
        </h3>
        
        {/* Rating Row */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "fill-gray-300 dark:fill-muted text-gray-300 dark:text-muted"}`} />
            ))}
          </div>
          <span className="text-[10px] text-gray-600 dark:text-muted-foreground">({reviews})</span>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-gray-900 dark:text-foreground">₹{product.offerPrice?.toLocaleString()}</span>
            {product.price !== product.offerPrice && (
              <span className="text-xs text-gray-600 dark:text-muted-foreground line-through">₹{product.price?.toLocaleString()}</span>
            )}
          </div>
          {product.price !== product.offerPrice && (
            <span className="text-[10px] font-bold text-green-600 dark:text-green-600">
              Save ₹{(product.price - product.offerPrice).toLocaleString()}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product._id);
          }}
          className="w-full rounded-md bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs h-10"
        >
          <ShoppingCart className="w-3.5 h-3.5 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

// Enhanced Product List Card Component
const ProductListCard = ({ product, onProductClick }) => {
  const { addToCart, router } = useAppContext();
  const rating = 4.5;
  const reviews = Math.floor(Math.random() * 200) + 50;

  return (
    <Card className="group bg-white dark:bg-card border border-gray-200 dark:border-border hover:shadow-md transition-all duration-300 rounded-lg overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
          {/* Product Image */}
          <div 
            className="w-full sm:w-48 h-48 flex-shrink-0 bg-gray-100 dark:bg-secondary/10 rounded-md overflow-hidden p-4 sm:p-6 cursor-pointer"
            onClick={() => onProductClick(product._id)}
          >
            <img
              src={product.images?.[0]}
              alt={product.name}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform"
            />
          </div>
          
          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-4 lg:gap-8 mb-2">
              <div className="flex-1">
                <span className="text-[10px] font-bold text-amber-600 dark:text-primary uppercase mb-2 block">{product.brand}</span>
                <h3 
                  className="text-lg sm:text-xl font-bold mb-2 text-gray-900 dark:text-foreground hover:text-primary dark:hover:text-primary transition-colors cursor-pointer line-clamp-2"
                  onClick={() => onProductClick(product._id)}
                >
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "fill-gray-300 dark:fill-muted text-gray-300 dark:text-muted"}`} />
                    ))}
                  </div>
                  <span className="text-xs text-gray-600 dark:text-muted-foreground">{reviews} reviews</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-muted-foreground line-clamp-3 mb-4 lg:mb-6">
                  {product.description || "High-performance technical component designed for professional industrial infrastructure and system reliability."}
                </p>
              </div>
              
              <div className="w-full lg:w-auto flex flex-row lg:flex-col justify-between lg:justify-start items-end gap-4">
                <div className="flex flex-col items-end gap-1">
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-foreground">₹{product.offerPrice?.toLocaleString()}</span>
                  {product.price > product.offerPrice && (
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-muted-foreground line-through">₹{product.price?.toLocaleString()}</span>
                  )}
                  {product.price > product.offerPrice && (
                    <span className="text-[10px] sm:text-xs font-bold text-green-600 dark:text-green-600">
                      -{Math.round(((product.price - product.offerPrice) / product.price) * 100)}% Off
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2 w-32 sm:w-40">
                  <Button 
                    onClick={() => { addToCart(product._id); router.push('/cart'); }}
                    className="w-full rounded-md font-bold h-9 sm:h-10 text-xs sm:text-sm"
                  >
                    Buy Now
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => addToCart(product._id)}
                    className="w-full rounded-md border-border font-bold h-9 sm:h-10 text-xs sm:text-sm"
                  >
                    Add to Cart
                  </Button>
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
