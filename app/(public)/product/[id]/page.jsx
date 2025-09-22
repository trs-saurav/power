// app/(public)/product/[id]/page.jsx (SERVER)
import { notFound } from 'next/navigation'
import ProductClient from './ProductClient'

// If not in root already, set metadataBase there so relative URLs resolve sitewide:
// export const metadata = { metadataBase: new URL('https://powerele.shop') }

const BASE = 'https://powerele.shop'

// Read API: fetch the list, then select one by id (kept to match your API setup)
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

// Server-rendered metadata (SEO + social)
export async function generateMetadata({ params }) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    return {
      title: 'Product Not Found – Shop',
      description: 'The requested product could not be found.',
      robots: { index: false, follow: false },
      alternates: { canonical: `/product/${id}` }, // resolves with metadataBase
    }
  }

  const title = `${product.name} – ${product.brand}`
  const desc = (product.description || '').slice(0, 160)
  const raw = product.images?.[0] || '/og-product-default.jpg'
  const absoluteImg = raw?.startsWith('http') ? raw : `${BASE}${raw?.startsWith('/') ? '' : '/'}${raw}`

  return {
    title,
    description: desc,
    alternates: { canonical: `/product/${id}` }, // relative is safer with metadataBase
    openGraph: {
      type: 'website',       // supported by Next metadata API
      url: `/product/${id}`, // relative path
      title,
      description: desc,
      images: [
        { url: absoluteImg, width: 1200, height: 630, type: 'image/jpeg', alt: `${product.name} – ${product.brand}` },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: [absoluteImg],
    },
    // Additional product OG keys (will render as meta name=...; acceptable for many scrapers)
    other: {
      'product:price:amount': String(product.offerPrice ?? product.price ?? ''),
      'product:price:currency': 'INR',
      'product:availability': product.availability === 'in_stock' ? 'in stock' : (product.availability || ''),
      'product:retailer_item_id': String(product._id ?? id),
    },
  }
}

export default async function ProductPage({ params }) {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) notFound()

  // Minimal, standards-compliant Product JSON-LD
  const offerPrice = product.offerPrice ?? product.price
  const availabilityMap = {
    in_stock: 'https://schema.org/InStock',
    out_of_stock: 'https://schema.org/OutOfStock',
    pre_order: 'https://schema.org/PreOrder',
    discontinued: 'https://schema.org/Discontinued',
  }
  const availabilityUrl = availabilityMap[product.availability] || availabilityMap.in_stock

  const raw = product.images?.[0] || '/og-product-default.jpg'
  const absoluteImg = raw?.startsWith('http') ? raw : `${BASE}${raw?.startsWith('/') ? '' : '/'}${raw}`

  const productJsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: absoluteImg,
    description: product.description || '',
    brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
    sku: product.sku || String(product._id || id),
    offers: {
      '@type': 'Offer',
      url: `${BASE}/product/${encodeURIComponent(String(product._id ?? id))}`,
      price: offerPrice ? String(offerPrice) : '',
      priceCurrency: 'INR',
      availability: availabilityUrl,
      itemCondition: 'https://schema.org/NewCondition',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductClient initialProduct={product} productId={id} />
    </>
  )
}
