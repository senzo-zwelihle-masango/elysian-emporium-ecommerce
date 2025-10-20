'use client'

import { useState, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  CalendarDays,
  Package,
  Search,
  Eye,
  ExternalLink,
  MapPin,
  CreditCard,
  Clock,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { OrderStatus } from '@/lib/generated/prisma'
import { OrderDetailsModal } from './order-detail-modal'
import { OrderWithRelations } from '@/types/store/prisma-relations'
import { dateFormat, formatPrice } from '@/utils/store/format'
import { orderStatusColors, paymentStatusColors } from '@/types/store/order'

interface OrdersClientProps {
  orders: OrderWithRelations[]
}

export function OrderClient({ orders }: OrdersClientProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<OrderWithRelations | null>(null) // Keep this state
  const [showDetailsModal, setShowDetailsModal] = useState(false) // Keep this state

  const router = useRouter() // Initialize useRouter

  // Memoize filtered orders to avoid re-calculating on every render if inputs haven't changed
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some((item) =>
          item.product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )

      const matchesStatus = statusFilter === 'all' || order.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [orders, searchTerm, statusFilter])

  // Group orders for tab counts
  const ordersByStatus = useMemo(
    () => ({
      all: orders,
      active: orders.filter(
        (order) => !['Delivered', 'Cancelled', 'Returned'].includes(order.status)
      ),
      delivered: orders.filter((order) => order.status === 'delivered'),
      cancelled: orders.filter((order) => ['Cancelled', 'Returned'].includes(order.status)),
    }),
    [orders]
  )

  // Function to open the modal (for "Quick view")
  const handleViewDetailsModal = (order: OrderWithRelations) => {
    setSelectedOrder(order)
    setShowDetailsModal(true)
  }

  // Function to navigate to the full page (for "View Full Details")
  const handleViewFullDetailsPage = (orderId: string) => {
    router.push(`/account/orders/${orderId}`)
  }

  return (
    <>
      <div className="space-y-6">
        {/* Search and Filters */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Search orders by number or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              {Object.values(OrderStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Orders Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all" onClick={() => setStatusFilter('all')}>
              All ({ordersByStatus.all.length})
            </TabsTrigger>
            <TabsTrigger value="active" onClick={() => setStatusFilter('active')}>
              Active ({ordersByStatus.active.length})
            </TabsTrigger>
            <TabsTrigger value="delivered" onClick={() => setStatusFilter('Delivered')}>
              Delivered ({ordersByStatus.delivered.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled" onClick={() => setStatusFilter('Cancelled')}>
              Cancelled ({ordersByStatus.cancelled.length})
            </TabsTrigger>
          </TabsList>

          {/* Render the filtered orders in all tabs, the actual filter is handled by statusFilter state */}
          <TabsContent value="all" className="space-y-4">
            <OrdersList
              orders={statusFilter === 'all' ? filteredOrders : []}
              onViewDetailsModal={handleViewDetailsModal}
              onViewFullDetailsPage={handleViewFullDetailsPage}
              formatCurrency={formatPrice}
              formatDate={dateFormat}
            />
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <OrdersList
              orders={
                statusFilter === 'active'
                  ? filteredOrders.filter(
                      (order) => !['Delivered', 'Cancelled', 'Returned'].includes(order.status)
                    )
                  : []
              }
              onViewDetailsModal={handleViewDetailsModal}
              onViewFullDetailsPage={handleViewFullDetailsPage}
              formatCurrency={formatPrice}
              formatDate={dateFormat}
            />
          </TabsContent>

          <TabsContent value="delivered" className="space-y-4">
            <OrdersList
              orders={
                statusFilter === 'Delivered'
                  ? filteredOrders.filter((order) => order.status === 'delivered')
                  : []
              }
              onViewDetailsModal={handleViewDetailsModal}
              onViewFullDetailsPage={handleViewFullDetailsPage}
              formatCurrency={formatPrice}
              formatDate={dateFormat}
            />
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            <OrdersList
              orders={
                statusFilter === 'Cancelled' || statusFilter === 'Returned'
                  ? filteredOrders.filter((order) =>
                      ['Cancelled', 'Returned'].includes(order.status)
                    )
                  : []
              }
              onViewDetailsModal={handleViewDetailsModal}
              onViewFullDetailsPage={handleViewFullDetailsPage}
              formatCurrency={formatPrice}
              formatDate={dateFormat}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Order Details Modal (Keep this) */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          open={showDetailsModal}
          onOpenChange={setShowDetailsModal}
          formatCurrency={formatPrice}
          formatDate={dateFormat}
        />
      )}
    </>
  )
}

function OrdersList({
  orders,
  onViewDetailsModal,
  onViewFullDetailsPage,
  formatCurrency,
  formatDate,
}: {
  orders: OrderWithRelations[]
  onViewDetailsModal: (order: OrderWithRelations) => void
  onViewFullDetailsPage: (orderId: string) => void
  formatCurrency: (amount: number) => string
  formatDate: (date: Date) => string
}) {
  if (orders.length === 0) {
    return (
      <div className="py-12 text-center">
        <Package className="mx-auto mb-4 h-12 w-12 text-gray-400" />
        <h3 className="mb-2 text-lg font-medium text-gray-900">No orders found</h3>
        <p className="text-gray-500">No orders match your current filters.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id} className="overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-lg">Order #{order.orderNumber}</CardTitle>
                <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <CalendarDays className="h-4 w-4" />
                    {formatDate(order.createdAt)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Package className="h-4 w-4" />
                    {order.items.length} item
                    {order.items.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:items-end">
                <div className="text-2xl font-bold">{formatCurrency(order.totalAmount)}</div>
                <div className="flex gap-2">
                  <Badge className={orderStatusColors[order.status]}>{order.status}</Badge>
                  <Badge className={paymentStatusColors[order.paymentStatus]}>
                    {order.paymentStatus}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            {/* Order Items Preview */}
            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {order.items.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                    {item.product.images[0] && (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${item.product.id}`}
                      className="block truncate text-sm font-medium transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity} × {formatCurrency(item.price)}
                    </p>
                  </div>
                </div>
              ))}
              {order.items.length > 3 && (
                <div className="flex h-12 items-center justify-center rounded-lg bg-gray-50 text-sm text-gray-500">
                  +{order.items.length - 3} more items
                </div>
              )}
            </div>

            {/* Order Info */}
            <div className="grid grid-cols-1 gap-4 border-t pt-4 text-sm sm:grid-cols-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">
                  {order.shipping.city}, {order.shipping.province}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{order.paymentMethod}</span>
              </div>
              {order.expectedDeliveryDate && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">
                    Expected: {formatDate(order.expectedDeliveryDate)}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end gap-2 border-t pt-4">
              <Button variant="outline" onClick={() => onViewDetailsModal(order)}>
                <Eye />
                Quick view
              </Button>
              <Button onClick={() => onViewFullDetailsPage(order.id)}>
                <ExternalLink />
                Full Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
