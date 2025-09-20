'use client'
import { useAppContext } from '@/context/AppContext'
import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'

const OrderPlaced = () => {
  const { router } = useAppContext()
  const [showTick, setShowTick] = useState(false)

  useEffect(() => {
    // Show tick after 1 second
    setTimeout(() => setShowTick(true), 1000)
    
    // Redirect after 5 seconds
    setTimeout(() => {
      router.push('/my-orders')
    }, 5000)
  }, [])

  return (
    <div className='min-h-screen bg-background flex flex-col justify-center items-center gap-8 p-4'>
      {/* Loading Circle with Animated Tick */}
      <div className="relative flex items-center justify-center">
        {/* Spinning Border */}
        <div className={`rounded-full h-24 w-24 border-4 transition-all duration-500 ${
          showTick 
            ? 'border-green-500 animate-pulse' 
            : 'border-gray-200 dark:border-gray-700 border-t-green-500 animate-spin'
        }`}></div>
        
        {/* Animated Tick Mark */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`bg-green-500 rounded-full shadow-lg transition-all duration-500 ${
            showTick ? 'p-3 scale-100' : 'p-2 scale-75 opacity-50'
          }`}>
            <Check className={`text-white stroke-[3] transition-all duration-300 ${
              showTick ? 'w-8 h-8' : 'w-6 h-6'
            }`} />
          </div>
        </div>
      </div>

      {/* Success Message */}
      <div className="text-center text-2xl font-semibold text-foreground">
        Order Placed Successfully
      </div>
      
      {/* Optional: Redirect notice */}
      <div className="text-sm text-muted-foreground">
        Redirecting to your orders...
      </div>
    </div>
  )
}

export default OrderPlaced
