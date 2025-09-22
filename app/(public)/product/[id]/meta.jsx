// app/(public)/product/[id]/page.jsx  (SERVER)
import { notFound } from 'next/navigation'
import ProductClient from './ProductClient'

const BASE = 'https://powerele.shop'

// Read API: fetch the list, then select one by id
async function getProduct(id) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/product/list`,
      { cache: 'no-store' }
    )
    if (!res.ok) return null
    const data = await res.json()
    const items = Array.isArray(data?.products) ? data.products : []
    const prod = items.find(p => String(p?._id ?? p?.id) === String(id))
    return prod || null
  } catch {
    return null
  }
}

// Metadata for social previews (server-rendered)
export async function generateMetadata({ params }) {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) {
    return {
      title: 'Product Not Found – Shop',
      description: 'The requested product could not be found.',
      robots: { index: false, follow: false },
      alternates: { canonical: `${BASE}/product/${id}` },
    }
  }

  const title = `${product.name} – ${product.brand}`
  const desc = (product.description || '').slice(0, 160)
  const raw = product.images?.[0] || '/og-product-default.jpg'
  const absoluteImg = raw.startsWith('http') ? raw : `${BASE}${raw.startsWith('/') ? '' : '/'}${raw}`

  return {
    title,
    description: desc,
    alternates: { canonical: `${BASE}/product/${id}` },
    openGraph: {
      // Use supported type to satisfy Next.js metadata typing
      type: 'website',
      url: `${BASE}/product/${id}`,
      title,
      description: desc,
      images: [
        { url: absoluteImg, width: 1200, height: 630, type: 'image/jpeg', alt: `${product.name} – ${product.brand}` },
      ],
    },
    // Product details via additional OG keys
    other: {
      'product:price:amount': String(product.offerPrice),
      'product:price:currency': 'INR',
      'product:availability': product.availability === 'in_stock' ? 'in stock' : 'out of stock',
      'product:retailer_item_id': String(product._id ?? id),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: [absoluteImg],
    },
  }
}

export default async function ProductPage({ params }) {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) notFound()
  return <ProductClient initialProduct={product} productId={id} />
}
