'use client'

import * as React from 'react'
import Link from 'next/link'

import {
  ArchiveIcon,
  CalendarIcon,
  CrownIcon,
  FlameIcon,
  GalleryThumbnailsIcon,
  GaugeIcon,
  HeartHandshakeIcon,
  LayersIcon,
  LayoutDashboardIcon,
  LayoutListIcon,
  MapPinIcon,
  PackageOpenIcon,
  SettingsIcon,
  ShieldUserIcon,
  ShoppingBagIcon,
  SparklesIcon,
  TablePropertiesIcon,
  TicketIcon,
  Trash2Icon,
  UsersRoundIcon,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

import NavigationMain from '@/components/admin/layout/navigation-main'
import NavigationUser from '@/components/admin/layout/navigation-user'
import ElysianEmporiumLogo from '@/components/ui/elysian-emporium-ecommerce-logo'

// data

const data = {
  // placeholder
  user: {
    name: 'user',
    email: 'user@email.com',
    avatar: '/assets/placeholders/avatar-placeholder.png',
  },
  navMain: [
    {
      title: 'Dashboard',
      url: '/admin',
      icon: LayoutDashboardIcon,
    },
    {
      title: 'Analytics',
      url: '/admin/analytics',
      icon: GaugeIcon,
    },
    {
      title: 'Organization',
      url: '/admin/organization',
      icon: ShieldUserIcon,
    },
    {
      title: 'Orders',
      url: '/admin/orders',
      icon: ShoppingBagIcon,
    },
    {
      title: 'Products',
      url: '/admin/products',
      icon: PackageOpenIcon,
    },
    {
      title: 'Brands',
      url: '/admin/brands',
      icon: LayoutListIcon,
    },
    {
      title: 'Categories',
      url: '/admin/categories',
      icon: TablePropertiesIcon,
    },
    {
      title: 'Promotions',
      url: '/admin/promotions',
      icon: SparklesIcon,
    },
    {
      title: 'Billboards',
      url: '/admin/billboards',
      icon: GalleryThumbnailsIcon,
    },
    {
      title: 'Collections',
      url: '/admin/collections',
      icon: FlameIcon,
    },

    {
      title: 'Warehouses',
      url: '/admin/warehouses',
      icon: MapPinIcon,
    },
    {
      title: 'Documents',
      url: '/admin/documents',
      icon: LayersIcon,
    },
    {
      title: 'Events',
      url: '/admin/events',
      icon: CalendarIcon,
    },
    {
      title: 'Users',
      url: '/admin/users',
      icon: UsersRoundIcon,
    },
    {
      title: 'Tickets',
      url: '/admin/tickets',
      icon: TicketIcon,
    },
    {
      title: 'Memberships',
      url: '/admin/memberships',
      icon: CrownIcon,
    },

    {
      title: 'Feedback',
      url: '/admin/feedback',
      icon: HeartHandshakeIcon,
    },

    {
      title: 'Settings',
      url: '/admin/settings',
      icon: SettingsIcon,
    },
  ],
  navSecondary: [
    {
      title: 'Trash',
      url: '/admin/trash',
      icon: Trash2Icon,
      isActive: true,
      items: [
        {
          title: 'Archives',
          url: '/admin/trash/archives',
        },
        {
          title: 'Deleted ',
          url: '/admin/trash/deleted',
        },
      ],
    },
  ],
}

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                  <ElysianEmporiumLogo className="size-8 rounded-sm" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Elysian Emporium</span>
                  <span className="truncate text-xs">v1.0.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {/* search */}
      </SidebarHeader>
      {/* content */}
      <SidebarContent>
        <NavigationMain items={data.navMain} />
        {/* <NavigationSecondary items={data.navSecondary} /> */}
      </SidebarContent>
      {/* user */}
      <SidebarFooter>
        <NavigationUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
