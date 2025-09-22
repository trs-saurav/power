// app/sitemap.js
import { MetadataRoute } from 'next'

const BASE_URL = 'https://powerele.shop'
export const revalidate = 3600

export default async function sitemap() /* : Promise<MetadataRoute.Sitemap> */ {
  const staticRoutes = [
    { url: `${BASE_URL}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/all-products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/aboutus`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/contact-us`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    // Gallery route with image sitemap entries (added below after fetching)
    // { url: `${BASE_URL}/gallery`, ... images: [...] }
  ]

  const [products, galleryImages] = await Promise.all([
    getProducts(),
    getGalleryImages(), // fetch Cloudinary URLs from your Gallery API/DB
  ])

  // Attach image entries to the gallery page
  const galleryEntry = {
    url: `${BASE_URL}/gallery`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
    images: galleryImages.slice(0, 1000), // up to 1000 images per <url> per Google spec
  }

  const productRoutes = products
    .map((p) => {
      const raw = p?._id ?? p?.id
      const id = typeof raw === 'string' ? raw : raw?.toString?.()
      if (!id) return null
      const imageList = Array.isArray(p?.images)
        ? p.images
            .filter(Boolean)
            .map((u) => (u.startsWith('http') ? u : `${BASE_URL}${u.startsWith('/') ? '' : '/'}${u}`))
        : []

      return {
        url: `${BASE_URL}/product/${encodeURIComponent(id)}`,
        lastModified: p?.updatedAt ? new Date(p.updatedAt) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
        images: imageList, // product images (can be Cloudinary or site-hosted)
      }
    })
    .filter(Boolean)

  return [...staticRoutes, galleryEntry, ...productRoutes]
}

// Reads all products (for product image entries)
async function getProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/product/list`, { cache: 'no-store' })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data?.products) ? data.products : []
  } catch {
    return []
  }
}

// Reads gallery images (Cloudinary URLs) – implement to hit your DB/API
async function getGalleryImages() {
  try {
    // If you have an API like /api/gallery that returns [{ imageUrl, type }, ...]
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/gallery`, { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      const arr = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : data?.gallery || []
      return arr.map((g) => String(g?.imageUrl)).filter((u) => !!u && u.startsWith('http'))
    }
  } catch {}
  return []
}
