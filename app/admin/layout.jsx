'use client'
import Navbar from '@/components/seller/Navbar'
import Sidebar from '@/components/seller/Sidebar'
import React from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import Footer from '@/components/seller/Footer'

const Layout = ({ children }) => {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1 w-full">
          {/* Fixed Sidebar */}
          <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
            <Sidebar />
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default Layout
