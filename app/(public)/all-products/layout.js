// app/(public)/all-products/layout.js

export const metadata = {
  title: {
    default: 'Shop - Power Electronics',
    template: '%s  - Shop', // keep a single, clean suffix
  },
  description: 'Browse UPS systems, solar panels, CCTV, voltage stabilizers, and electrical accessories in Patna, Bihar with warranty and expert support.',
  keywords: [
    'electrical products Patna',
    'UPS systems Bihar',
    'solar panels Patna',
    'CCTV cameras Bihar',
    'voltage stabilizers Patna',
    'power backup products',
    'electrical accessories Patna',
    'inverter batteries Bihar',
    'electrical wiring supplies',
    'power electronics shop'
  ],
  openGraph: {
    title: 'Shop - All Products',
    description: 'Complete range of electrical solutions including UPS, solar, CCTV, and power backup systems in Patna with 30+ years experience.',
    url: 'https://powerele.shop/all-products',
    siteName: 'Power Electronics',
    images: [
      {
        url: '/products-gallery.jpg',
        width: 1200,
        height: 630,
        alt: 'All Electrical Products - Power Electronics Shop',
      },
    ],
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop - All Products',
    description: 'UPS, solar, CCTV and electrical accessories in Patna, Bihar.',
    images: ['/products-gallery.jpg'],
  },
  alternates: {
    canonical: 'https://powerele.shop/all-products',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

// Valid CollectionPage + ItemList JSON‑LD
const productCatalogSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Shop – All Products',
  description: 'Electrical products catalog including UPS, solar, CCTV, stabilizers and accessories.',
  url: 'https://powerele.shop/all-products',
  mainEntity: {
    '@type': 'ItemList',
    name: 'Electrical Products',
    itemListElement: [], // optional: you can inject category links here if you want
  },
}

export default function AllProductsLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productCatalogSchema) }}
      />
      {children}
    </>
  )
}
