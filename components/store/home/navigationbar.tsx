import React from 'react'
import { headers } from 'next/headers'
import { unstable_noStore as noStore } from 'next/cache'
import Link from 'next/link'
import { MenuIcon, HeartIcon, ShoppingBagIcon } from 'lucide-react'

import { prisma } from '@/lib/prisma/client'
import { auth } from '@/lib/auth'

import { ShoppingCartType } from '@/types/store/cart'
import { redisShoppingCart } from '@/redis/db/cart'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

import ThemeSwitcher from '@/components/ui/theme-switcher'
import NotificationMenu from '@/components/notification/notification-menu'
import UserDropdown from '@/components/user/user-dropdown'

import { mobileNavigationMenuItems, navigationMenuItems } from '@/data/constants/navigation'
import ElysianEmporiumLogo from '@/components/ui/elysian-emporium-ecommerce-logo'

// fetch favorites
async function fetchFavoriteProducts() {
  noStore()
  return prisma.favorite.findMany({
    select: {
      id: true,
    },
  })
}

const Navigationbar = async () => {
  noStore()

  // fetch user session
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  const userId = session?.user?.id

  // fetch favoritess count
  const favorites = await fetchFavoriteProducts()
  const favoritesCount = favorites.length

  // fetch redis shopping cart
  let cart: ShoppingCartType | null = null
  let total = 0
  if (userId) {
    cart = await redisShoppingCart.get<ShoppingCartType>(`cart-${userId}`)
    total = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0
  }
  return (
    <header>
      <nav className="fixed z-40 mt-4 w-full px-4 md:px-6 lg:px-6">
        <div className="bg-background/50 rounded-2xl border px-4 backdrop-blur-lg">
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full justify-between lg:w-auto">
              <Link href="/" aria-label="home" className="flex items-center space-x-2">
                <ElysianEmporiumLogo className="size-8 rounded-sm" />
              </Link>

              {/* mobile */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open Menu">
                    <MenuIcon />
                  </Button>
                </SheetTrigger>

                {/* content */}
                <SheetContent side="right">
                  <SheetHeader className="text-left">
                    <SheetTitle className="flex items-center gap-2">
                      <ElysianEmporiumLogo className="size-8 rounded-sm" />
                    </SheetTitle>
                    <SheetDescription className="sr-only">Navigation menu</SheetDescription>
                  </SheetHeader>

                  {/* items */}
                  <div className="flex h-full flex-col">
                    {/* user avatar */}
                    {session?.user && (
                      <div className="mb-6 flex items-center gap-3 rounded-lg px-3">
                        <Avatar>
                          <AvatarImage
                            src={
                              session.user.image || `https://avatar.vercel.sh/${session.user.email}`
                            }
                            alt="User avatar"
                          />
                          <AvatarFallback>
                            {session?.user.name && session.user.name.length > 0
                              ? session.user.name.charAt(0).toUpperCase()
                              : session?.user.email.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                    {/* Navigation Links */}
                    <nav className="mb-6 flex flex-col gap-2">
                      {mobileNavigationMenuItems.map((item, index) => (
                        <Link
                          key={index}
                          href={item.href}
                          className="hover:bg-accent hover:text-accent-foreground flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors"
                        >
                          {item.title}
                        </Link>
                      ))}
                    </nav>

                    {/* action buttons */}

                    {/* theme */}
                    <div className="mb-6 flex items-center gap-3 px-3 py-2.5">
                      <span className="text-sm font-medium">Appearance</span>
                      <div className="ml-auto">
                        <ThemeSwitcher />
                      </div>
                    </div>
                    {/* Auth Buttons */}
                    <div className="mt-auto space-y-3 px-3 pt-6">
                      {session?.user ? (
                        <div className="mb-10 space-y-2">
                          <Button asChild className="w-full">
                            <Link href="/sign-up">
                              <span>Sign Out</span>
                            </Link>
                          </Button>
                        </div>
                      ) : (
                        <div className="mb-10 grid space-y-2">
                          <Button asChild>
                            <Link href="/sign-up">
                              <span>Sign Up</span>
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* main */}
            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {navigationMenuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="hover:text-accent-foreground block duration-150"
                    >
                      <span>{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-background mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 in-data-[state=active]:block md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none lg:in-data-[state=active]:flex dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {navigationMenuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="hover:text-accent-foreground block duration-150"
                      >
                        <span>{item.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <ThemeSwitcher />

                {session ? (
                  <>
                    <NotificationMenu />

                    {/* favorites list */}

                    <div className="relative">
                      <Link href={'/account/favorites'}>
                        <Button
                          variant={'ghost'}
                          size={'icon'}
                          className="rounded-full"
                          aria-label="Open favorites"
                        >
                          <Badge className="bg-destructive absolute top-0 right-0 size-5 translate-x-1 -translate-y-1 rounded-full px-1">
                            {favoritesCount}
                          </Badge>

                          <HeartIcon className="size-4" />
                        </Button>
                      </Link>
                    </div>

                    {/* shoping cart */}
                    <div className="relative">
                      <Link href={'/account/cart'}>
                        <Button variant={'ghost'} size={'icon'} className="rounded-full">
                          <Badge className="bg-destructive absolute top-0 right-0 size-5 translate-x-1 -translate-y-1 rounded-full px-1">
                            {total}
                          </Badge>
                          <ShoppingBagIcon className="size-4" />
                        </Button>
                      </Link>
                    </div>
                    <UserDropdown
                      email={session.user.email}
                      image={
                        session?.user.image ?? `https://avatar.vercel.sh/${session?.user.email}`
                      }
                      name={
                        session?.user.name && session.user.name.length > 0
                          ? session.user.name
                          : session?.user.email.split('@')[0]
                      }
                    />
                  </>
                ) : (
                  <>
                    <Button asChild variant="outline">
                      <Link href="/sign-in">
                        <span>Sign In</span>
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link href="/sign-up">
                        <span>Sign Up</span>
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navigationbar
