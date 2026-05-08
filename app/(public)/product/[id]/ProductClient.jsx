// app/(public)/product/[id]/ProductClient.jsx
'use client'
import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useAppContext } from '@/context/AppContext'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  Shield, Truck, RotateCcw, Share2, Package, Award, Weight, Cpu, Tag,
  CheckCircle, Clock, AlertCircle, XCircle, Minus, Plus,
  ShoppingCart, ChevronLeft, Star
} from 'lucide-react'
import Loading from '@/components/Loading'
import ProductCard from '@/components/ProductCard'

const statusMap = {
  in_stock: { icon: CheckCircle, text: 'In Stock', variant: 'default' },
  out_of_stock: { icon: XCircle, text: 'Out of Stock', variant: 'destructive' },
  pre_order: { icon: Clock, text: 'Pre Order', variant: 'secondary' },
  discontinued: { icon: AlertCircle, text: 'Discontinued', variant: 'outline' },
}

export default function ProductClient({ initialProduct, productId }) {
  const routeParams = useParams()
  const id = productId ?? routeParams?.id
  const { products, router, addToCart } = useAppContext()

  const [productData, setProductData] = useState(initialProduct ?? null)
  const [mainImage, setMainImage] = useState(initialProduct?.images?.[0] ?? null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [loadingFallback, setLoadingFallback] = useState(false)

  // Try to hydrate from context when it becomes available
  useEffect(() => {
    if (!id) return
    const fromCtx = Array.isArray(products)
      ? products.find(p => String(p?._id ?? p?.id) === String(id))
      : null
    if (fromCtx) {
      setProductData(fromCtx)
      if (fromCtx.images?.[0]) setMainImage(fromCtx.images[0])
    }
  }, [id, products])

  // Network fallback if we still don’t have productData (deep link/direct visit)
  useEffect(() => {
    if (productData || !id) return
    let cancelled = false
    ;(async () => {
      try {
        setLoadingFallback(true)
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/product/list`, { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        const arr = Array.isArray(data?.products) ? data.products : []
        const p = arr.find(x => String(x?._id ?? x?.id) === String(id))
        if (!cancelled && p) {
          setProductData(p)
          if (p.images?.[0]) setMainImage(p.images[0])
        }
      } finally {
        if (!cancelled) setLoadingFallback(false)
      }
    })()
    return () => { cancelled = true }
  }, [id, productData])

  const discountPct = useMemo(() => {
    if (!productData?.price || !productData?.offerPrice) return 0
    const d = ((productData.price - productData.offerPrice) / productData.price) * 100
    return Number.isFinite(d) ? Math.max(0, Math.round(d)) : 0
  }, [productData?.price, productData?.offerPrice])

  const status = statusMap[productData?.availability] ?? statusMap.in_stock

  const handleShare = async () => {
    const shareData = {
      title: productData?.name ?? 'Product',
      text: productData?.brand ? `Check out ${productData.name} – ${productData.brand}` : productData?.name,
      url: window.location.href,
    }
    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
        toast.success('Product shared successfully!')
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Product link copied to clipboard!')
      }
    } catch {
      try {
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Product link copied to clipboard!')
      } catch {
        toast.error('Unable to share. Please copy the URL manually.')
      }
    }
  }

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } } }

  if (!productData) return loadingFallback ? <Loading /> : <Loading />

  return (
    <div className="min-h-screen bg-[#030712] text-card-foreground selection:bg-primary/30 pt-20 lg:pt-24">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="container mx-auto px-4 md:px-8 lg:px-16 py-8">
        {/* Back + Share + Breadcrumb */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={() => router.back()} className="w-fit">
              <ChevronLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" /> Share
              </Button>
            </div>
          </div>

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink href="/all-products">Products</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>{productData.name}</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Images Section (lg: 5 cols) */}
          <motion.div variants={itemVariants} className="lg:col-span-5 space-y-4">
            <div className="sticky top-40">
              <Card className="overflow-hidden border-border bg-secondary/5 rounded-xl shadow-sm">
                <CardContent className="p-8">
                  <motion.div key={selectedImageIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="aspect-square rounded-lg overflow-hidden relative">
                    { (mainImage || productData.images?.[0]) && (
                      <Image src={mainImage || productData.images[0]} alt={productData.name} fill className="object-contain" />
                    )}
                  </motion.div>
                </CardContent>
              </Card>

              {/* Thumbnails */}
              <div className="grid grid-cols-5 gap-3 mt-4">
                {(productData.images ?? []).map((image, index) => (
                  <motion.div key={index} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <div
                      className={`aspect-square rounded-md overflow-hidden cursor-pointer border-2 transition-all ${selectedImageIndex === index ? 'border-primary shadow-md' : 'border-border hover:border-primary/50'}`}
                      onClick={() => { setMainImage(image); setSelectedImageIndex(index) }}
                    >
                      <Image src={image} alt={`${productData.name} ${index + 1}`} width={80} height={80} className="w-full h-full object-cover" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Core Info & Actions (lg: 7 cols) */}
          <motion.div variants={itemVariants} className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-primary uppercase tracking-widest">{productData.brand}</span>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-sm text-muted-foreground uppercase">{productData.category}</span>
              </div>
              
              <h1 className="text-3xl lg:text-5xl font-bold tracking-tight text-foreground uppercase">{productData.name}</h1>
              
              {/* Rating Section */}
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-green-600 text-white px-2 py-0.5 rounded text-xs font-bold gap-1">
                  4.5 <Star className="w-3 h-3 fill-current" />
                </div>
                <span className="text-sm text-muted-foreground font-medium underline cursor-pointer">452 Ratings & 84 Reviews</span>
                <Badge variant="outline" className="text-[10px] font-bold text-primary border-primary/20 bg-primary/5 uppercase">
                  Verified Specification
                </Badge>
              </div>
            </div>

            <Separator className="opacity-50" />

            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold">₹{productData.offerPrice?.toLocaleString()}</span>
                {productData.price && (
                  <span className="text-xl text-muted-foreground line-through font-medium">₹{productData.price?.toLocaleString()}</span>
                )}
                {discountPct > 0 && (
                  <span className="text-lg font-bold text-green-600">{discountPct}% off</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground font-medium">Inclusive of all taxes</p>
            </div>

            {/* Availability */}
            <div className="flex items-center gap-3">
              <Badge variant={status.variant} className="rounded-full px-3 py-1">
                <status.icon className="w-3 h-3 mr-1.5" /> {status.text}
              </Badge>
              <span className="text-xs text-muted-foreground">Free Delivery in 3-5 days</span>
            </div>

            <Separator className="opacity-50" />

            {/* Description Excerpt */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider">Product Highlights</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span>High-efficiency industrial-grade performance</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span>Certified for 24/7 mission-critical operations</span>
                </li>
                {productData.warranty && (
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <span>{productData.warranty.period} Months Standard Warranty</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center border border-border rounded-md bg-secondary/5 overflow-hidden">
                <Button variant="ghost" size="sm" onClick={() => setQuantity(q => Math.max(1, q - 1))} className="h-10 w-10 p-0 rounded-none border-r border-border" disabled={quantity <= 1}>
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-bold text-sm">{quantity}</span>
                <Button variant="ghost" size="sm" onClick={() => setQuantity(q => Math.min(10, q + 1))} className="h-10 w-10 p-0 rounded-none border-l border-border" disabled={quantity >= 10}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-xs text-muted-foreground font-medium italic">Available stock: High</div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                onClick={() => {
                  for (let i = 0; i < quantity; i++) addToCart(productData._id)
                  toast.success(`Added ${quantity} item(s) to cart!`)
                }}
                disabled={productData.availability === 'out_of_stock'}
                className="flex-1 rounded-md bg-[#FF9F00] hover:bg-[#FF9F00]/90 h-14 text-white font-bold text-sm uppercase tracking-wider"
              >
                <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
              </Button>
              <Button
                size="lg"
                onClick={() => {
                  for (let i = 0; i < quantity; i++) addToCart(productData._id)
                  router.push('/cart')
                }}
                disabled={productData.availability === 'out_of_stock'}
                className="flex-1 rounded-md bg-[#FB641B] hover:bg-[#FB641B]/90 h-14 text-white font-bold text-sm uppercase tracking-wider"
              >
                <CheckCircle className="w-5 h-5 mr-2" /> Buy Now
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
              <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-secondary/5">
                <Truck className="w-6 h-6 text-primary" />
                <div className="text-[10px]">
                  <p className="font-bold uppercase">Fast Shipping</p>
                  <p className="text-muted-foreground uppercase">Pan India Delivery</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-secondary/5">
                <RotateCcw className="w-6 h-6 text-primary" />
                <div className="text-[10px]">
                  <p className="font-bold uppercase">7 Day Return</p>
                  <p className="text-muted-foreground uppercase">Easy Replacements</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-secondary/5">
                <Shield className="w-6 h-6 text-primary" />
                <div className="text-[10px]">
                  <p className="font-bold uppercase">Safe Transaction</p>
                  <p className="text-muted-foreground uppercase">Secure Checkout</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="mb-16">
          <Tabs defaultValue="specifications" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-secondary/50 rounded-none p-1 border border-white/5">
              <TabsTrigger value="specifications" className="rounded-none data-[state=active]:bg-primary data-[state=active]:text-card-foreground uppercase tracking-widest text-[10px] font-bold h-10">Specifications</TabsTrigger>
              <TabsTrigger value="shipping" className="rounded-none data-[state=active]:bg-primary data-[state=active]:text-card-foreground uppercase tracking-widest text-[10px] font-bold h-10">Shipping & Logistics</TabsTrigger>
            </TabsList>

            <TabsContent value="specifications" className="mt-8">
              <Card className="bg-card border-white/5 rounded-none">
                <CardHeader className="border-b border-white/5">
                  <CardTitle className="flex items-center gap-2 text-card-foreground uppercase tracking-widest text-sm font-bold">
                    <Package className="w-4 h-4 text-primary" /> Technical Manifest
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <SpecRow icon={Award} label="Manufacturer" value={productData.brand} />
                      <SpecRow icon={Tag} label="System Model" value={productData.model} />
                      <SpecRow icon={Package} label="Classification" value={productData.category} />
                    </div>
                    <div className="space-y-6">
                      {productData.capacity?.value && <SpecRow icon={Cpu} label="Capacity Rating" value={`${productData.capacity.value} ${productData.capacity.unit || ''}`} />}
                      {productData.weight?.value && <SpecRow icon={Weight} label="Gross Weight" value={`${productData.weight.value} ${productData.weight.unit || 'kg'}`} />}
                      {productData.warranty && <SpecRow icon={Shield} label="Service Coverage" value={`${productData.warranty.period} months (${productData.warranty.type})`} />}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="shipping" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Shipping & Returns</CardTitle>
                  <CardDescription>Everything you need to know about delivery and returns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-2">Shipping Information</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Free shipping on orders over ₹500</li>
                        <li>• Standard delivery: 3–5 business days</li>
                        <li>• Express delivery: 1–2 business days (additional charges apply)</li>
                      </ul>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-2">Return Policy</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• 7-day return policy from delivery date</li>
                        <li>• Items must be in original condition</li>
                        <li>• Free return pickup available</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Related Products */}
        <motion.div variants={itemVariants}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Related Products</h2>
            <p className="text-muted-foreground">You might also like these products</p>
          </div>

          <motion.div variants={containerVariants} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
            {Array.isArray(products) && products.slice(0, 5).map((p, idx) => (
              <motion.div key={String(p._id ?? p.id ?? idx)} variants={itemVariants}>
                <ProductCard product={p} />
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center">
            <Button variant="outline" size="lg" onClick={() => router.push('/all-products')}>
              View All Products
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

function SpecRow({ icon: Icon, label, value }) {
  if (!value) return null
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5">
      <span className="text-slate-500 flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest">
        <Icon className="w-4 h-4 text-primary" /> {label}
      </span>
      <span className="font-mono text-xs text-card-foreground uppercase">{value}</span>
    </div>
  )
}
