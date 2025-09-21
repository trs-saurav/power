// app/sitemap.js
import { MetadataRoute } from 'next'

export default async function sitemap() {
  const baseUrl = 'https://powerele.shop'
  
  // Static routes with high priority
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/all-products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/aboutus`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }
  ]

  // Fetch dynamic product URLs
  const products = await getProducts() // Your product fetching function
  
  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: product.updatedAt || new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...staticRoutes, ...productRoutes]
}

// Function to fetch all products from your database
async function getProducts() {
  try {
    // Replace this with your actual API call or database query
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/product/list`, {
      cache: 'no-store'
    })
    const data = await response.json()
    return data.products || []
  } catch (error) {
    console.error('Error fetching products for sitemap:', error)
    return []
  }
}
