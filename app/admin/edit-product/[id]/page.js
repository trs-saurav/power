'use client'
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// shadcn/ui components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

// Icons
import { 
  Save, 
  Loader2, 
  ArrowLeft, 
  Upload, 
  X, 
  Package, 
  DollarSign, 
  Shield, 
  Weight, 
  Cpu,
  ImageIcon,
  AlertCircle,
  CheckCircle
} from "lucide-react";

const EditProduct = () => {
  const params = useParams();
  const router = useRouter();
  const { getToken } = useAppContext();
  const productId = params.id;

  // Loading states
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Battery',
    price: '',
    offerPrice: '',
    brand: '',
    model: '',
    warrantyPeriod: '',
    warrantyType: 'manufacturer',
    capacityValue: '',
    capacityUnit: '',
    availability: 'in_stock',
    weightValue: '',
    weightUnit: 'kg'
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);

  // Fetch product data
  const fetchProduct = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`/api/product/edit/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        const product = data.product;
        setFormData({
          name: product.name || '',
          description: product.description || '',
          category: product.category || 'Battery',
          price: product.price?.toString() || '',
          offerPrice: product.offerPrice?.toString() || '',
          brand: product.brand || '',
          model: product.model || '',
          warrantyPeriod: product.warrantyPeriod?.toString() || '',
          warrantyType: product.warrantyType || 'manufacturer',
          capacityValue: product.capacityValue?.toString() || '',
          capacityUnit: product.capacityUnit || '',
          availability: product.availability || 'in_stock',
          weightValue: product.weightValue?.toString() || '',
          weightUnit: product.weightUnit || 'kg'
        });
        setExistingImages(product.images || []);
      } else {
        toast.error(data.message || 'Failed to fetch product');
        router.push('/admin/product-list');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load product');
      router.push('/admin/product-list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Handle form changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle new image upload
  const handleNewImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + existingImages.length + newImages.length > 4) {
      toast.error('Maximum 4 images allowed');
      return;
    }
    setNewImages(prev => [...prev, ...files]);
  };

  // Remove existing image
  const removeExistingImage = (index) => {
    const imageToRemove = existingImages[index];
    setRemovedImages(prev => [...prev, imageToRemove]);
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  // Remove new image
  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const token = await getToken();
      const formDataToSend = new FormData();

      // Add text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value);
      });

      // Add new images
      newImages.forEach(image => {
        formDataToSend.append('newImages', image);
      });

      // Add removed images list
      if (removedImages.length > 0) {
        formDataToSend.append('removedImages', JSON.stringify(removedImages));
      }

      // Add existing images list
      formDataToSend.append('existingImages', JSON.stringify(existingImages));

      const response = await fetch(`/api/product/edit/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Product updated successfully!');
        router.push('/admin/product-list');
      } else {
        toast.error(data.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update product');
    } finally {
      setUpdating(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container mx-auto px-4 py-8 max-w-6xl"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold">Edit Product</h1>
            </div>
            <p className="text-muted-foreground">Update your product information and settings</p>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="w-fit"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to List
          </Button>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Product Images */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Product Images
                </CardTitle>
                <CardDescription>
                  Update product images (Maximum 4 images)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {/* Existing Images */}
                  <AnimatePresence>
                    {existingImages.map((image, index) => (
                      <motion.div
                        key={`existing-${index}`}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative group"
                      >
                        <Card className="aspect-square overflow-hidden">
                          <CardContent className="p-0 h-full">
                            <Image
                              src={image}
                              alt={`Product ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeExistingImage(index)}
                              className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </CardContent>
                        </Card>
                        <Badge variant="secondary" className="absolute bottom-2 left-2 text-xs">
                          Current
                        </Badge>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* New Images */}
                  <AnimatePresence>
                    {newImages.map((image, index) => (
                      <motion.div
                        key={`new-${index}`}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative group"
                      >
                        <Card className="aspect-square overflow-hidden">
                          <CardContent className="p-0 h-full">
                            <Image
                              src={URL.createObjectURL(image)}
                              alt={`New ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeNewImage(index)}
                              className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </CardContent>
                        </Card>
                        <Badge variant="default" className="absolute bottom-2 left-2 text-xs">
                          New
                        </Badge>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Add New Image */}
                  {(existingImages.length + newImages.length) < 4 && (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Card className="aspect-square border-2 border-dashed hover:border-primary transition-colors">
                        <CardContent className="p-0 h-full">
                          <label className="flex flex-col items-center justify-center h-full cursor-pointer text-muted-foreground hover:text-primary transition-colors">
                            <Upload className="w-8 h-8 mb-2" />
                            <span className="text-sm font-medium">Add Image</span>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={handleNewImageUpload}
                              className="hidden"
                            />
                          </label>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </div>

                {removedImages.length > 0 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {removedImages.length} image(s) will be removed when you save changes.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Basic Information */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Update the main details about your product
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Product Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="brand">
                      Brand <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => handleInputChange('brand', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="model">
                      Model <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) => handleInputChange('model', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BATTERY">BATTERY</SelectItem>
                                                <SelectItem value="UPS">UPS</SelectItem>
                                                <SelectItem value="STABILIZER">STABILIZER</SelectItem>
                                         <SelectItem value="SOLAR">SOLAR</SelectItem>
                                                <SelectItem value="CCTV">CCTV</SelectItem>
                                                <SelectItem value="OTHERS">OTHERS</SelectItem>
                                                <SelectItem value="Camera">Camera</SelectItem>
                                                <SelectItem value="Accessories">Accessories</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pricing & Availability */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Pricing & Availability
                </CardTitle>
                <CardDescription>
                  Update pricing and stock availability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="price">
                      Regular Price <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                      <Input
                        id="price"
                        type="number"
                        className="pl-8"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="offerPrice">
                      Offer Price <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                      <Input
                        id="offerPrice"
                        type="number"
                        className="pl-8"
                        value={formData.offerPrice}
                        onChange={(e) => handleInputChange('offerPrice', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="availability">Availability</Label>
                    <Select value={formData.availability} onValueChange={(value) => handleInputChange('availability', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in_stock">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            In Stock
                          </div>
                        </SelectItem>
                        <SelectItem value="out_of_stock">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            Out of Stock
                          </div>
                        </SelectItem>
                        <SelectItem value="pre_order">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            Pre Order
                          </div>
                        </SelectItem>
                        <SelectItem value="discontinued">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                            Discontinued
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Warranty Information */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Warranty Information
                </CardTitle>
                <CardDescription>
                  Update warranty details for the product
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="warrantyPeriod">
                      Warranty Period (months) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="warrantyPeriod"
                      type="number"
                      value={formData.warrantyPeriod}
                      onChange={(e) => handleInputChange('warrantyPeriod', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="warrantyType">
                      Warranty Type <span className="text-destructive">*</span>
                    </Label>
                    <Select value={formData.warrantyType} onValueChange={(value) => handleInputChange('warrantyType', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manufacturer">Manufacturer</SelectItem>
                        <SelectItem value="seller">Seller</SelectItem>
                        <SelectItem value="extended">Extended</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Specifications */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="w-5 h-5" />
                  Specifications
                </CardTitle>
                <CardDescription>
                  Update optional technical specifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Capacity */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Cpu className="w-4 h-4" />
                        Capacity
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label htmlFor="capacityValue">Value</Label>
                        <Input
                          id="capacityValue"
                          type="number"
                          value={formData.capacityValue}
                          onChange={(e) => handleInputChange('capacityValue', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="capacityUnit">Unit</Label>
                        <Input
                          id="capacityUnit"
                          placeholder="GB, MB, etc."
                          value={formData.capacityUnit}
                          onChange={(e) => handleInputChange('capacityUnit', e.target.value)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Weight */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Weight className="w-4 h-4" />
                        Weight
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label htmlFor="weightValue">Value</Label>
                        <Input
                          id="weightValue"
                          type="number"
                          step="0.01"
                          value={formData.weightValue}
                          onChange={(e) => handleInputChange('weightValue', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="weightUnit">Unit</Label>
                        <Select value={formData.weightUnit} onValueChange={(value) => handleInputChange('weightUnit', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kg">kg</SelectItem>
                            <SelectItem value="g">g</SelectItem>
                            <SelectItem value="lb">lb</SelectItem>
                            <SelectItem value="oz">oz</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 pt-8"
          >
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
              disabled={updating}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              disabled={updating}
              className="flex-1"
            >
              {updating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating Product...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Product
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditProduct;
