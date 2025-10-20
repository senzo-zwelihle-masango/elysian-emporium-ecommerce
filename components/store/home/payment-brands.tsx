import React from 'react'
import Image from 'next/image'
import { InView } from '@/components/motion-primitives/in-view'
import { InfiniteSlider } from '@/components/motion-primitives/infinite-slider'
import { ProgressiveBlur } from '@/components/motion-primitives/progressive-blur'
import { paymentBrandsItems } from '@/data/constants/payment-brands'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'

const PaymentBrands = () => {
  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'screen'}
      padding={'px-md'}
      gap={'none'}
      flow={'none'}
      id="hero"
      className="overflow-hidden"
    >
      <InView
        variants={{
          hidden: { opacity: 0, y: 100, filter: 'blur(4px)' },
          visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
        }}
        viewOptions={{ margin: '0px 0px -200px 0px' }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <Heading size={'6xl'} spacing={'normal'} lineHeight={'none'} margin={'md'}>
          Payment Brands
        </Heading>
        <div className="group relative">
          <div className="flex flex-col items-center md:flex-row">
            <div className="md:max-w-44 md:border-r md:pr-6">
              <p className="text-base">Secure Payments, Trusted By</p>
            </div>
            <div className="relative py-6 md:w-[calc(100%-11rem)]">
              <InfiniteSlider speedOnHover={20} speed={40} gap={112}>
                {paymentBrandsItems.map((logo, index) => (
                  <div key={index} className="flex">
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      height={logo.height}
                      width={logo.width}
                      className={`mx-auto ${logo.className} w-fit`}
                    />
                  </div>
                ))}
              </InfiniteSlider>

              <div className="from-background absolute inset-y-0 left-0 w-20 bg-linear-to-r"></div>
              <div className="from-background absolute inset-y-0 right-0 w-20 bg-linear-to-l"></div>
              <ProgressiveBlur
                className="pointer-events-none absolute top-0 left-0 h-full w-20"
                direction="left"
                blurIntensity={1}
              />
              <ProgressiveBlur
                className="pointer-events-none absolute top-0 right-0 h-full w-20"
                direction="right"
                blurIntensity={1}
              />
            </div>
          </div>
        </div>
      </InView>
    </Container>
  )
}

export default PaymentBrands
