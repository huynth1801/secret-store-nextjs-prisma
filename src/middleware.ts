import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Danh sách các route cần bảo vệ
const protectedRoutes = ["/profile", "/settings", "/orders"]

const publicOnlyRoutes = ["/sign-in", "/sign-up"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Kiểm tra token xác thực
  const token = request.cookies.get("refreshToken")?.value

  // Nếu người dùng đã đăng nhập và cố gắng truy cập các route công khai
  if (token && publicOnlyRoutes.includes(pathname)) {
    // Chuyển hướng về trang chủ
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Kiểm tra xem route hiện tại có cần bảo vệ không
  if (protectedRoutes.includes(pathname)) {
    if (!token) {
      // Nếu không có token, chuyển hướng đến trang đăng nhập
      return NextResponse.redirect(new URL("/sign-in", request.url))
    }

    // Ở đây bạn có thể thêm logic để xác thực token
    // Ví dụ: gọi API để xác thực token

    // Nếu token hợp lệ, cho phép truy cập
    return NextResponse.next()
  }

  // Đối với các route không được bảo vệ, cho phép truy cập bình thường
  return NextResponse.next()
}

// Cấu hình các route mà middleware sẽ chạy
export const config = {
  matcher: [
    "/",
    "/api/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/sign-in",
    "/sign-up",
  ],
}
