export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/cart']
    },
    sitemap: 'https://powerele.shop/sitemap.xml',
    host: 'https://powerele.shop'
  }
}
