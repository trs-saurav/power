'use client'
import React, { useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";
import { motion } from "framer-motion";

// shadcn/ui components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Icons
import { 
  Upload, 
  Package, 
  DollarSign, 
  Shield, 
  Weight, 
  Cpu, 
  CheckCircle,
  Loader2,
  Plus,
  X,
  ImageIcon
} from "lucide-react";

const AddProduct = () => {
  const { getToken } = useAppContext();

  const [files, setFiles] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Battery');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  
  // New required fields
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [warrantyPeriod, setWarrantyPeriod] = useState('');
  const [warrantyType, setWarrantyType] = useState('manufacturer');
  
  // New optional fields
  const [capacityValue, setCapacityValue] = useState('');
  const [capacityUnit, setCapacityUnit] = useState('');
  const [availability, setAvailability] = useState('in_stock');
  const [weightValue, setWeightValue] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();

    // Original fields
    formData.append('name', name);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('price', price);
    formData.append('offerPrice', offerPrice);
    
    // New required fields
    formData.append('brand', brand);
    formData.append('model', model);
    formData.append('warrantyPeriod', warrantyPeriod);
    formData.append('warrantyType', warrantyType);
    
    // New optional fields (only append if not empty)
    if (capacityValue) formData.append('capacityValue', capacityValue);
    if (capacityUnit) formData.append('capacityUnit', capacityUnit);
    if (availability) formData.append('availability', availability);
    if (weightValue) formData.append('weightValue', weightValue);
    if (weightUnit) formData.append('weightUnit', weightUnit);

    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    try {
      const token = await getToken();
      const { data } = await axios.post('/api/product/add', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (data.success) {
        toast.success(data.message)
        // Reset all fields
        setFiles([])
        setName('')
        setDescription('')
        setCategory('Battery')
        setPrice('')
        setOfferPrice('')
        setBrand('')
        setModel('')
        setWarrantyPeriod('')
        setWarrantyType('manufacturer')
        setCapacityValue('')
        setCapacityUnit('')
        setAvailability('in_stock')
        setWeightValue('')
        setWeightUnit('kg')
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false);
    }
  }

  const removeImage = (index) => {
    const updatedFiles = [...files];
    updatedFiles[index] = null;
    setFiles(updatedFiles);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-background ">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container mx-auto px-4 py-8 max-w-6xl"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Package className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Add New Product</h1>
          </div>
          <p className="text-muted-foreground text-lg">Create and manage your product catalog</p>
        </motion.div>

        <motion.form onSubmit={handleSubmit} variants={itemVariants} className="space-y-8">
          
          {/* Image Upload Section */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Product Images
                </CardTitle>
                <CardDescription>
                  Upload up to 4 images for your product
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, index) => (
                    <motion.div 
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="relative group"
                    >
                      <Card className="aspect-square border-2 border-dashed hover:border-primary transition-colors">
                        <CardContent className="p-0 h-full">
                          <label 
                            htmlFor={`image${index}`}
                            className="block w-full h-full cursor-pointer relative"
                          >
                            <input 
                              onChange={(e) => {
                                const updatedFiles = [...files];
                                updatedFiles[index] = e.target.files[0];
                                setFiles(updatedFiles);
                              }} 
                              type="file" 
                              id={`image${index}`} 
                              accept="image/*"
                              className="hidden" 
                            />
                            
                            {files[index] ? (
                              <div className="w-full h-full relative">
                                <Image
                                  src={URL.createObjectURL(files[index])}
                                  alt={`Product ${index + 1}`}
                                  fill
                                  className="object-cover rounded-lg"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    removeImage(index);
                                  }}
                                  className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center h-full text-muted-foreground hover:text-primary transition-colors">
                                <ImageIcon className="w-8 h-8 mb-2" />
                                <span className="text-sm font-medium">Add Image</span>
                              </div>
                            )}
                          </label>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Basic Info Section */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Enter the main details about your product
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
                      placeholder="Enter product name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="brand">
                      Brand <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="brand"
                      placeholder="Enter brand name"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
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
                      placeholder="Enter model name/number"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Battery">Battery</SelectItem>
                        <SelectItem value="Earphone">Earphone</SelectItem>
                        <SelectItem value="Headphone">Headphone</SelectItem>
                        <SelectItem value="Watch">Watch</SelectItem>
                        <SelectItem value="Smartphone">Smartphone</SelectItem>
                        <SelectItem value="Laptop">Laptop</SelectItem>
                        <SelectItem value="Camera">Camera</SelectItem>
                        <SelectItem value="Accessories">Accessories</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Product Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your product features and specifications"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pricing Section */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Pricing & Availability
                </CardTitle>
                <CardDescription>
                  Set pricing and stock availability
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
                        placeholder="0"
                        className="pl-8"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
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
                        placeholder="0"
                        className="pl-8"
                        value={offerPrice}
                        onChange={(e) => setOfferPrice(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="availability">Availability</Label>
                    <Select value={availability} onValueChange={setAvailability}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select availability" />
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

          {/* Warranty Section */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Warranty Information
                </CardTitle>
                <CardDescription>
                  Specify warranty details for the product
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
                      placeholder="12"
                      value={warrantyPeriod}
                      onChange={(e) => setWarrantyPeriod(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="warrantyType">
                      Warranty Type <span className="text-destructive">*</span>
                    </Label>
                    <Select value={warrantyType} onValueChange={setWarrantyType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select warranty type" />
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

          {/* Specifications Section */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="w-5 h-5" />
                  Specifications
                </CardTitle>
                <CardDescription>
                  Add optional technical specifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Capacity Section */}
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
                          placeholder="256"
                          value={capacityValue}
                          onChange={(e) => setCapacityValue(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="capacityUnit">Unit</Label>
                        <Input
                          id="capacityUnit"
                          placeholder="GB, MB, etc."
                          value={capacityUnit}
                          onChange={(e) => setCapacityUnit(e.target.value)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Weight Section */}
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
                          placeholder="0.5"
                          value={weightValue}
                          onChange={(e) => setWeightValue(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="weightUnit">Unit</Label>
                        <Select value={weightUnit} onValueChange={setWeightUnit}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select unit" />
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

          {/* Submit Button */}
          <motion.div 
            variants={itemVariants}
            className="flex justify-center pt-8"
          >
            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="px-12 py-6 text-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Adding Product...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Add Product
                </>
              )}
            </Button>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default AddProduct;
