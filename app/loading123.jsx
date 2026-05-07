'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'

export default function Loading() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 90) {
          return prev + Math.random() * 30
        }
        return prev
      })
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Card Container with Glassmorphism */}
        <div className="relative backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-slate-800/20 rounded-3xl p-12 shadow-2xl">
          {/* Animated Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-purple-400/5 dark:from-blue-500/5 dark:to-purple-500/5 rounded-3xl" />

          {/* Main Content */}
          <div className="relative flex flex-col items-center gap-8">
            {/* Logo/Icon Container */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6, ease: 'backOut' }}
              className="relative"
            >
              {/* Outer Rotating Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 w-24 h-24 rounded-full border-2 border-transparent border-t-blue-500 border-r-blue-500 dark:border-t-blue-400 dark:border-r-blue-400"
              />

              {/* Middle Pulsing Ring */}
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-2 w-20 h-20 rounded-full border border-blue-300/30 dark:border-blue-400/30"
              />

              {/* Icon Background */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 flex items-center justify-center shadow-lg"
              >
                <span className="text-4xl">⚡</span>
              </motion.div>
            </motion.div>

            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-center space-y-2"
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-400 dark:to-blue-500 bg-clip-text text-transparent">
                Power Electronics
              </h2>
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-sm text-slate-600 dark:text-slate-400 font-medium"
              >
                Preparing your experience...
              </motion.p>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: '100%' }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="w-full space-y-2"
            >
              {/* Progress Container */}
              <div className="relative w-full h-2 bg-slate-200/50 dark:bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-white/20 dark:border-slate-700/20">
                {/* Progress Fill */}
                <motion.div
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 dark:from-blue-400 dark:via-blue-500 dark:to-blue-600 rounded-full shadow-lg shadow-blue-500/50"
                />

                {/* Shimmer Effect */}
                <motion.div
                  animate={{ x: ['0%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  className="absolute top-0 left-0 h-full w-1/4 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
              </div>

              {/* Progress Text */}
              <motion.p
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-xs text-slate-500 dark:text-slate-400 text-center font-medium"
              >
                {Math.round(progress)}% Complete
              </motion.p>
            </motion.div>

            {/* Floating Elements */}
            <div className="absolute top-8 left-8 w-2 h-2 bg-blue-400 rounded-full opacity-30" />
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-8 left-8 w-2 h-2 bg-blue-400 rounded-full"
            />

            <div className="absolute bottom-8 right-8 w-3 h-3 bg-purple-400 rounded-full opacity-30" />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute bottom-8 right-8 w-3 h-3 bg-purple-400 rounded-full"
            />
          </div>
        </div>

        {/* Background Decoration */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 dark:from-blue-500/10 dark:to-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10"
        />
      </motion.div>
    </div>
  )
}
