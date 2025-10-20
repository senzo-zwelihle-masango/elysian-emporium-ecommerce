import React from 'react'
import Link from 'next/link'
import { ShoppingBagIcon, SparklesIcon } from 'lucide-react'

import { AnimatedGroup } from '@/components/motion-primitives/animated-group'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { TextEffect } from '@/components/motion-primitives/text-effect'

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: 'blur(12px)',
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        type: 'spring' as const,
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
}

const Hero = () => {
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
      <section>
        <div className="relative pt-28">
          <div className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"></div>
          <div className="mx-auto">
            <div className="sm:mx-auto lg:mt-0 lg:mr-auto">
              <TextEffect
                preset="fade-in-blur"
                speedSegment={0.3}
                as="h1"
                className="mt-8 max-w-3xl text-5xl text-balance md:text-6xl lg:mt-16 lg:text-7xl"
              >
                Elevate Every Day with Timeless Style
              </TextEffect>
              <TextEffect
                per="line"
                preset="fade-in-blur"
                speedSegment={0.3}
                delay={0.5}
                as="p"
                className="mt-6 max-w-2xl text-pretty"
              >
                Discover hand-picked collections that blend elegance, quality, and modern design
                crafted to make every purchase a statement.
              </TextEffect>

              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: {
                        staggerChildren: 0.05,
                        delayChildren: 0.75,
                      },
                    },
                  },
                  ...transitionVariants,
                }}
                className="mt-12 flex items-center gap-2"
              >
                <div key={1}>
                  <Button asChild size="lg">
                    <ShoppingBagIcon />
                    <Link href="#featured-products">
                      <span className="text-nowrap">Start Shopping</span>
                    </Link>
                  </Button>
                </div>
                <Button key={2} asChild size="lg" variant="ghost">
                  <SparklesIcon />
                  <Link href="#promotions">
                    <span className="text-nowrap">Promotions</span>
                  </Link>
                </Button>
              </AnimatedGroup>
            </div>
          </div>
        </div>
      </section>
    </Container>
  )
}

export default Hero
