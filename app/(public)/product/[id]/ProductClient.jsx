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
  ShoppingCart, ChevronLeft,
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
    <div className="min-h-screen  bg-background pt-10">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <motion.div variants={itemVariants} className="space-y-4">
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <motion.div key={selectedImageIndex} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="aspect-square rounded-lg overflow-hidden bg-muted relative">
                  { (mainImage || productData.images?.[0]) && (
                    <Image src={mainImage || productData.images[0]} alt={productData.name} fill className="object-cover" />
                  )}
                  <div className="absolute top-4 right-4">
                    <Button variant="secondary" size="sm" onClick={handleShare} className="rounded-full w-10 h-10 p-0">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              </CardContent>
            </Card>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {(productData.images ?? []).map((image, index) => (
                <motion.div key={index} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Card
                    className={`cursor-pointer transition-all ${selectedImageIndex === index ? 'ring-2 ring-primary' : 'hover:ring-1 hover:ring-primary/50'}`}
                    onClick={() => { setMainImage(image); setSelectedImageIndex(index) }}
                  >
                    <CardContent className="p-2">
                      <div className="aspect-square rounded overflow-hidden">
                        <Image src={image} alt={`${productData.name} ${index + 1}`} width={100} height={100} className="w-full h-full object-cover" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-center gap-3">
              <Badge variant={status.variant} className="flex items-center gap-1">
                <status.icon className="w-3 h-3" /> {status.text}
              </Badge>
              {discountPct > 0 && <Badge variant="destructive">{discountPct}% OFF</Badge>}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-primary" />
                {productData.brand && <Badge variant="outline">{productData.brand}</Badge>}
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">{productData.name}</h1>
              {productData.model && <p className="text-muted-foreground">Model: {productData.model}</p>}
            </div>

            <p className="text-muted-foreground leading-relaxed">{productData.description}</p>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-bold">₹{productData.offerPrice?.toLocaleString()}</span>
                  {productData.price && <span className="text-xl text-muted-foreground line-through">₹{productData.price?.toLocaleString()}</span>}
                </div>
                {productData.price && productData.offerPrice && (
                  <p className="text-green-600 font-semibold mt-2">
                    You save ₹{Math.max(0, (productData.price - productData.offerPrice))?.toLocaleString()}
                  </p>
                )}
              </CardContent>
            </Card>

            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Quantity:</label>
              <div className="flex items-center border rounded-lg">
                <Button variant="ghost" size="sm" onClick={() => setQuantity(q => Math.max(1, q - 1))} className="h-10 w-10 p-0" disabled={quantity <= 1}>
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button variant="ghost" size="sm" onClick={() => setQuantity(q => Math.min(10, q + 1))} className="h-10 w-10 p-0" disabled={quantity >= 10}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <span className="text-sm text-muted-foreground">Max: 10</span>
            </div>

            <div className="flex flex-row gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  for (let i = 0; i < quantity; i++) addToCart(productData._id)
                  toast.success(`Added ${quantity} item(s) to cart!`)
                }}
                disabled={productData.availability === 'out_of_stock'}
                className="flex-1"
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
                className="flex-1"
              >
                <CheckCircle className="w-5 h-5 mr-2" /> Buy Now
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Truck className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="font-medium">Free Delivery</p>
                  <p className="text-xs text-muted-foreground">On orders above ₹500</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <RotateCcw className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="font-medium">Easy Returns</p>
                  <p className="text-xs text-muted-foreground">7 day return policy</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Shield className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <p className="font-medium">{productData.warranty?.period}M Warranty</p>
                  <p className="text-xs text-muted-foreground">{productData.warranty?.type} warranty</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="mb-16">
          <Tabs defaultValue="specifications" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            </TabsList>

            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" /> Product Specifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <SpecRow icon={Award} label="Brand" value={productData.brand} />
                      <SpecRow icon={Tag} label="Model" value={productData.model} />
                      <SpecRow icon={Package} label="Category" value={productData.category} />
                    </div>
                    <div className="space-y-4">
                      {productData.capacity?.value && <SpecRow icon={Cpu} label="Capacity" value={`${productData.capacity.value} ${productData.capacity.unit || ''}`} />}
                      {productData.weight?.value && <SpecRow icon={Weight} label="Weight" value={`${productData.weight.value} ${productData.weight.unit || 'kg'}`} />}
                      {productData.warranty && <SpecRow icon={Shield} label="Warranty" value={`${productData.warranty.period} months (${productData.warranty.type})`} />}
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
    <div className="flex items-center justify-between py-2 border-b">
      <span className="text-muted-foreground flex items-center gap-2">
        <Icon className="w-4 h-4" /> {label}
      </span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
