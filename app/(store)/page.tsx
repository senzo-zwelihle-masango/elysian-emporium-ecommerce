import React from 'react'
import Billboards from '@/components/store/home/billboards'
import Collections from '@/components/store/home/collections'
import Promotions from '@/components/store/home/promotions'
import FeaturedProducts from '@/components/store/home/featured-products'
import PaymentBrands from '@/components/store/home/payment-brands'

const Store = () => {
  return (
    <div className="mb-40 space-y-40 overflow-hidden">
      <Billboards />
      <FeaturedProducts />
      <Collections />
      <Promotions />
      <PaymentBrands />
    </div>
  )
}

export default Store
