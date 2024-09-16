"use client"

import { useAuth } from "@/app/hooks/use-auth"
import { MainNav } from "@/components/main-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { LogInIcon, ShoppingBagIcon } from "lucide-react"
import Link from "next/link"
import { UserNav } from "./user"
import { useEffect, useState } from "react"
import { MobileNav } from "./mobile"
import { CommandMenu } from "@/components/composites/command"

export default function Header() {
  const { isAuthenticated, loading } = useAuth()
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
  return (
    <Link href={"/cart"}>
      <Button size={"icon"} variant={"outline"} className="h-9">
        <ShoppingBagIcon className="h-4" />
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
