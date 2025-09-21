// app/(public)/all-products/layout.js

export const metadata = {
  title: {
    default: 'All Products - Power Electronics Patna',
    template: '%s - Power Electronics Patna'
  },
  description: 'Browse our complete range of UPS systems, solar panels, CCTV cameras, voltage stabilizers, and electrical accessories in Patna, Bihar. Quality electrical solutions with warranty.',
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
    title: 'All Electrical Products - Power Electronics Patna',
    description: 'Complete range of electrical solutions including UPS, solar, CCTV, and power backup systems available in Patna with 30+ years experience.',
    url: 'https://powerele.shop/all-products',
    siteName: 'Power Electronics',
    images: [
      {
        url: '/products-gallery.jpg',
        width: 1200,
        height: 630,
        alt: 'Power Electronics - All Electrical Products in Patna',
      },
    ],
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Electrical Products - Power Electronics Patna',
    description: 'Complete range of UPS, solar, CCTV systems and electrical accessories in Patna, Bihar.',
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
};

// Optional: Add structured data for product catalog
const productCatalogSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Electrical Products - Power Electronics",
  "description": "Complete range of electrical products including UPS, solar, CCTV systems in Patna, Bihar",
  "url": "https://powerele.shop/all-products",
  "mainEntity": {
    "@type": "ItemList",
    "name": "Electrical Products",
    
  }
};

export default function AllProductsLayout({ children }) {
  return (
    <>
      {/* Add structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productCatalogSchema) }}
      />
      
      {/* Render child pages */}
      {children}
    </>
  );
}
