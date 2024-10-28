"use client"

import React from "react"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { OrderWithIncludes } from "@/types/prisma"
import { formatter } from "@/lib/utils"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Clock, Package, MapPin, ArrowLeft, AlertCircle } from "lucide-react"

const fetchAllOrders = async () => {
  const response = await fetch("/api/orders", {
    method: "GET",
  })

  if (!response.ok) {
    throw new Error("Error when getting orders")
  }
  return response.json()
}

const OrderStatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
        status
      )}`}
    >
      {status}
    </span>
  )
}

const OrderPage = () => {
  const router = useRouter()

  const {
    data: orders,
    isLoading,
    error,
  } = useQuery<OrderWithIncludes[]>({
    queryKey: ["orders"],
    queryFn: fetchAllOrders,
  })

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="w-full">
              <CardHeader>
                <Skeleton className="h-8 w-1/4 mb-2" />
                <Skeleton className="h-4 w-1/6" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-6 w-1/5" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{(error as Error).message}</AlertDescription>
      </Alert>
    )
  }

  if (!orders || orders.length === 0) {
    return (
      <Alert variant="destructive" className="m-4">
        <Package className="h-4 w-4" />
        <AlertTitle>No Orders Found</AlertTitle>
        <AlertDescription>
          You haven&apos;t placed any orders yet.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="container mx-auto p-8 max-w-6xl dark:text-white">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Your Orders</h1>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </Button>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <Card
            key={order.id}
            className="transition-all duration-200 hover:shadow-lg"
          >
            <CardHeader className="border-b bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-gray-900">
                      Order #{order.id}
                    </h2>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>
                      Ordered on{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <h3 className="text-lg font-semibold">Shipping Address</h3>
                </div>
                <p className="text-gray-600 ml-6">
                  {order?.address?.address}, {order.address?.city}
                </p>
              </div>

              <div className="dark:text-white">
                <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                <ul className="divide-y divide-gray-200">
                  {order.orderItems.map((item) => (
                    <li
                      key={item.orderId}
                      className="flex items-center py-4 hover:bg-gray-50 transition-colors duration-150 rounded-lg p-2"
                    >
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        <Image
                          src={item.product?.images[0]}
                          alt={item.product?.title}
                          width={80}
                          height={80}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="ml-6 flex flex-1 flex-col">
                        <div className="flex justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white dark:hover:text-black">
                              {item.product?.title}
                            </h4>
                            <p className="mt-1 text-sm text-gray-500">
                              {item.product?.categories
                                .map((c) => c.title)
                                .join(", ")}
                            </p>
                          </div>
                          <p className="text-right font-medium text-gray-900 dark:text-white dark:hover:text-black">
                            {formatter.format(item.product?.price)}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-sm text-gray-500">
                            Qty: {item.count}
                          </p>
                          <p className="font-medium text-gray-900 dark:text-white dark:hover:text-black">
                            Subtotal:{" "}
                            {formatter.format(
                              (item.product?.price || 0) * item.count
                            )}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>

            <CardFooter className="border-t bg-gray-50 p-6 dark:bg-gray-900">
              <div className="flex justify-between w-full">
                <Button variant={"outline"}>Cancel</Button>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Order Total</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatter.format(order.total)}
                  </p>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default OrderPage
