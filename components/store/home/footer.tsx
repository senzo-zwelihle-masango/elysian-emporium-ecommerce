import React from 'react'
import Link from 'next/link'

import { footerNavigationItems } from '@/data/constants/navigation'
import ElysianEmporiumLogo from '@/components/ui/elysian-emporium-ecommerce-logo'

const FooterMenu = () => {
  return (
    <footer className="bg-background border-b pt-20">
      <div className="mx-auto px-8">
        <div className="grid gap-12 md:grid-cols-5">
          <div className="md:col-span-2">
            <Link href="/" aria-label="go home" className="block size-fit">
              <ElysianEmporiumLogo className="size-8 rounded-sm" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 md:col-span-3">
            {footerNavigationItems.map((link, index) => (
              <div key={index} className="space-y-4 text-sm">
                <span className="block font-medium">{link.group}</span>
                {link.items.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="text-muted-foreground hover:text-primary block duration-150"
                  >
                    <span>{item.title}</span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-wrap items-end justify-between gap-6 border-t py-6">
          <span className="text-muted-foreground order-last block text-center text-sm md:order-first">
            © {new Date().getFullYear()} Elysian Emporium Store, All rights reserved
          </span>
        </div>
      </div>
    </footer>
  )
}

export default FooterMenu
