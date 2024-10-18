"use client"

import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Package, CreditCard, Home } from "lucide-react"

interface CheckoutSuccessProps {
  searchParams: {
    orderId: string
    totalItems: string
    totalPrice: string
  }
}

const CheckoutSuccess = ({ searchParams }: CheckoutSuccessProps) => {
  const router = useRouter()
  const { orderId, totalItems, totalPrice } = searchParams

  if (!orderId || !totalItems || !totalPrice) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <Card className="w-full max-w-lg p-6">
          <CardContent>
            <p className="text-red-500">Error: Missing order information</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 dark:bg-black dark:text-black">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-6 border-b">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-600 mb-2">
              Đặt hàng thành công!
            </CardTitle>
            <CardDescription className="text-gray-600">
              Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 dark:bg-black dark:text-black">
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div className="flex items-center space-x-3">
                  <Package className="h-5 w-5 text-gray-400" />
                  <div className="flex items-center">
                    <p className="text-sm text-gray-500">Mã đơn hàng:</p>&nbsp;
                    <p className="font-medium">{orderId}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                  <div className="flex items-center">
                    <p className="text-sm text-gray-500">Tổng thanh toán:</p>
                    &nbsp;
                    <p className="font-medium text-lg">
                      {parseFloat(totalPrice).toLocaleString()} VND
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Package className="h-5 w-5 text-gray-400" />
                  <div className="flex items-center">
                    <p className="text-sm text-gray-500">Số lượng sản phẩm:</p>
                    &nbsp;
                    <p className="font-medium">{totalItems}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-600">
                  Bạn sẽ nhận được email xác nhận đơn hàng trong ít phút. Vui
                  lòng kiểm tra hộp thư của bạn.
                </p>
              </div>

              <Button
                className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700"
                onClick={() => router.push("/")}
              >
                <Home className="h-4 w-4" />
                <span>Về trang chủ</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CheckoutSuccess
