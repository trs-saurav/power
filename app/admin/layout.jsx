'use client'
import Navbar from '@/components/seller/Navbar'
import Sidebar from '@/components/seller/Sidebar'
import React from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import Footer from '@/components/seller/Footer'

const Layout = ({ children }) => {
  return (
    <ProtectedRoute requiredRole="admin">
    <div>
      <Navbar />
      <div className='flex w-full'>
        <Sidebar />
        {children}
      </div>
      <Footer />
    </div>
    </ProtectedRoute>
  )
}

export default Layout