import React from 'react'
import Navigationbar from '@/components/store/home/navigationbar'
import FooterMenu from '@/components/store/home/footer'

const StoreLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <Navigationbar />
      {children}
      <FooterMenu />
    </main>
  )
}

export default StoreLayout
