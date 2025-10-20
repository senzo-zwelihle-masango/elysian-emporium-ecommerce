'use client'

import React from 'react'
import { motion } from 'motion/react'

interface FavoritesPageWrapperProps {
  children: React.ReactNode
}

export function FavoritesPageWrapper({ children }: FavoritesPageWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="container mx-auto px-4 py-8 md:px-6 lg:px-8"
    >
      {children}
    </motion.div>
  )
}
