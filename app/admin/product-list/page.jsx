'use client'
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

// shadcn/ui components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Icons
import { 
  Eye,
  Edit,
  Trash2,
  Loader2,
  Package,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Grid3X3,
  List,
  ArrowUpDown,
  Download
} from "lucide-react";

const ProductList = () => {
  const { router, getToken, user } = useAppContext();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("table");

  const fetchSellerProduct = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get('/api/product/seller-list', { 
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (data.success) {
        setProducts(data.products);
        setFilteredProducts(data.products);
        setLoading(false);
      } else {
        toast.error(data.message);
        setLoading(false);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Search functionality
  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const deleteProduct = async (productId, productName) => {
    setDeleteLoading(productId);

    try {
      const token = await getToken();
      const response = await fetch(`/api/product/delete/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setProducts(prevProducts => 
          prevProducts.filter(product => product._id !== productId)
        );
      } else {
        toast.error(data.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const editProduct = (productId) => {
    router.push(`/admin/edit-product/${productId}`);
  };

  const getStockBadge = (availability) => {
    const variants = {
      'in_stock': { variant: 'default', label: 'In Stock', color: 'bg-green-100 text-green-800' },
      'out_of_stock': { variant: 'destructive', label: 'Out of Stock', color: 'bg-red-100 text-red-800' },
      'pre_order': { variant: 'secondary', label: 'Pre Order', color: 'bg-yellow-100 text-yellow-800' },
      'discontinued': { variant: 'outline', label: 'Discontinued', color: 'bg-gray-100 text-gray-800' }
    };
    return variants[availability] || variants['in_stock'];
  };

  useEffect(() => {
    if (user) {
      fetchSellerProduct();
    }
  }, [user]);

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
        damping: 12
      }
    }
  };

  const tableRowVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
    exit: {
      x: 20,
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  if (loading) {
    return (
      <div className="flex-1 min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-background">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full p-6 space-y-6"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Product Management</CardTitle>
                    <CardDescription>
                      Manage your product inventory and listings
                    </CardDescription>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-sm">
                    {filteredProducts.length} Products
                  </Badge>
                  <Button onClick={() => router.push('/admin')} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Product
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products by name, brand, or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="w-4 h-4" />
                    Filter
                  </Button>
                  
                  <Separator orientation="vertical" className="h-6" />
                  
                  <div className="flex items-center border rounded-lg p-1">
                    <Button
                      variant={viewMode === "table" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("table")}
                      className="h-8 w-8 p-0"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="h-8 w-8 p-0"
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Products Display */}
        <motion.div variants={itemVariants}>
          {filteredProducts.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Product</TableHead>
                      <TableHead className="hidden md:table-cell">Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="hidden lg:table-cell">Stock Status</TableHead>
                      <TableHead className="hidden xl:table-cell">Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {filteredProducts.map((product, index) => {
                        const stockInfo = getStockBadge(product.availability);
                        
                        return (
                          <motion.tr
                            key={product._id}
                            variants={tableRowVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            layout
                            className="group hover:bg-muted/50 transition-colors"
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <motion.div 
                                  className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0"
                                  whileHover={{ scale: 1.05 }}
                                  transition={{ type: "spring", stiffness: 300 }}
                                >
                                  <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                  />
                                </motion.div>
                                <div className="min-w-0 flex-1">
                                  <motion.p 
                                    className="font-medium text-sm line-clamp-1 cursor-pointer hover:text-primary transition-colors"
                                    onClick={() => router.push(`/product/${product._id}`)}
                                    whileHover={{ x: 2 }}
                                  >
                                    {product.name}
                                  </motion.p>
                                  <p className="text-xs text-muted-foreground line-clamp-1">
                                    {product.brand} • {product.model}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            
                            <TableCell className="hidden md:table-cell">
                              <Badge variant="outline" className="text-xs">
                                {product.category}
                              </Badge>
                            </TableCell>
                            
                            <TableCell>
                              <div className="space-y-1">
                                <p className="font-semibold text-sm">
                                  ₹{product.offerPrice?.toLocaleString()}
                                </p>
                                {product.price !== product.offerPrice && (
                                  <p className="text-xs text-muted-foreground line-through">
                                    ₹{product.price?.toLocaleString()}
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            
                            <TableCell className="hidden lg:table-cell">
                              <Badge 
                                variant={stockInfo.variant}
                                className={`text-xs ${stockInfo.color}`}
                              >
                                {stockInfo.label}
                              </Badge>
                            </TableCell>
                            
                            <TableCell className="hidden xl:table-cell text-xs text-muted-foreground">
                              {new Date(product.createdAt || product.date).toLocaleDateString()}
                            </TableCell>
                            
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                {/* View Button */}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => router.push(`/product/${product._id}`)}
                                  className="h-8 w-8 p-0"
                                  title="View Product"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>

                                {/* Edit Button */}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => editProduct(product._id)}
                                  className="h-8 w-8 p-0"
                                  title="Edit Product"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>

                                {/* Delete Button */}
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                      title="Delete Product"
                                      disabled={deleteLoading === product._id}
                                    >
                                      {deleteLoading === product._id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <Trash2 className="w-4 h-4" />
                                      )}
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete "{product.name}"? This action cannot be undone and will permanently remove the product and all its images.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => deleteProduct(product._id, product.name)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Delete Product
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>

                                {/* More Actions Dropdown */}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => router.push(`/product/${product._id}`)}>
                                      <Eye className="w-4 h-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => editProduct(product._id)}>
                                      <Edit className="w-4 h-4 mr-2" />
                                      Edit Product
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Delete Product
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col items-center justify-center space-y-4"
                >
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <Package className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">
                      {searchQuery ? 'No products found' : 'No products yet'}
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      {searchQuery 
                        ? `No products match "${searchQuery}". Try adjusting your search terms.`
                        : 'Get started by adding your first product to your inventory.'
                      }
                    </p>
                  </div>
                  {!searchQuery && (
                    <Button onClick={() => router.push('/admin')} className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Your First Product
                    </Button>
                  )}
                  {searchQuery && (
                    <Button variant="outline" onClick={() => setSearchQuery('')} className="gap-2">
                      Clear Search
                    </Button>
                  )}
                </motion.div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Stats Card */}
        {filteredProducts.length > 0 && (
          <motion.div variants={itemVariants}>
            <div className="grid items-center  grid-cols-3 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {filteredProducts.filter(p => p.availability === 'in_stock').length}
                  </div>
                  <div className="text-xs text-muted-foreground">In Stock</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {filteredProducts.filter(p => p.availability === 'out_of_stock').length}
                  </div>
                  <div className="text-xs text-muted-foreground">Out of Stock</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {new Set(filteredProducts.map(p => p.category)).size}
                  </div>
                  <div className="text-xs text-muted-foreground">Categories</div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ProductList;
