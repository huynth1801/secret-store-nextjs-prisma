"use client"

import { MainNav } from "@/components/main-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { LogInIcon, ShoppingBasketIcon } from "lucide-react"
import Link from "next/link"

export default function Header() {
  return (
    <header
      className="supports-backdrop-blur:bg-background-90 
                        sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur 
                        mb-4 px-[1.4rem] md:px-[4rem] lg:px-[6rem] 
                        xl:px-[8rem] 2xl:px-[12rem]
                        dark:bg-black dark:text-white"
    >
      <div className="flex items-center h-14">
        <MainNav />
        <div className="flex flex-1 items-center space-x-2 justify-end">
          <CartNav />
          <ModeToggle />
          <LoginDialog />
        </div>
      </div>
    </header>
  )
}

export function CartNav() {
  return (
    <Link href={"/cart"}>
      <Button size={"icon"} variant={"outline"} className="h-9">
        <ShoppingBasketIcon className="h-4" />
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
