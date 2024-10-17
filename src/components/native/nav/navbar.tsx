"use client"

import { useAuth } from "@/app/hooks/use-auth"
import { useQuery } from "@tanstack/react-query"
import { MainNav } from "@/components/main-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { LogInIcon, ShoppingBagIcon } from "lucide-react"
import Link from "next/link"
import { UserNav } from "./user"
import { useEffect, useState } from "react"
import { MobileNav } from "./mobile"
import { CommandMenu } from "@/components/composites/command"
import getCartItem from "@/actions/get-cart"
import { Spinner } from "../icons"
import { Badge } from "@/components/ui/badge"
import useCartStore from "@/store/useCartStore"

export default function Header() {
  const { isAuthenticated, loading } = useAuth()
  console.log(isAuthenticated)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <header
      className="supports-backdrop-blur:bg-background/90
      sticky top-0 z-50 
      w-full border-b 
      bg-background/90 
      backdrop-blur mb-4 px-[1.4rem] 
      md:px-[4rem] lg:px-[6rem] 
      xl:px-[8rem] 2xl:px-[12rem]
    dark:bg-black dark:text-white"
    >
      <div className="flex items-center h-14">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center space-x-2 justify-end">
          <div className="flex-none">
            <CommandMenu />
          </div>
          <CartNav />
          <ModeToggle />
          {isAuthenticated ? <UserNav /> : <LoginDialog />}
        </div>
      </div>
    </header>
  )
}

export function CartNav() {
  const { cart, loading, refreshCart } = useCartStore()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    refreshCart(isAuthenticated)
  }, [isAuthenticated, refreshCart])

  if (loading) {
    return <Spinner />
  }

  // Calculate total number of items in the cart
  const totalItems = cart.items.reduce((sum, item) => sum + item.count, 0)

  return (
    <Link href="/cart">
      <Button size="icon" variant="outline" className="h-9 relative">
        <ShoppingBagIcon className="h-4" />
        {totalItems > 0 && (
          <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </Button>
    </Link>
  )
}

const LoginDialog = () => {
  return (
    <Link href="/sign-in">
      <Button className="font-medium flex gap-2">
        <LogInIcon className="h-4" />
        <p>Sign in</p>
      </Button>
    </Link>
  )
}
