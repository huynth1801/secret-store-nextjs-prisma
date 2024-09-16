"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { MenuIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const menuItems = [
  { title: "Documentation", href: "/documentation" },
  { title: "GitHub", href: "/github" },
  { title: "Products", href: "/products" },
  { title: "Blog", href: "/blog" },
  { title: "Orders", href: "/orders" },
  { title: "Payments", href: "/payments" },
  { title: "Contact", href: "/contact" },
  { title: "About", href: "/about" },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base 
          hover:bg-transparent 
          focus-visible:bg-transparent 
          focus-visible:ring-0 
          focus-visible:ring-offset-0 
          md:hidden
          
          "
        >
          <MenuIcon className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] border-r-0 p-0">
        <div className="flex h-full w-full flex-col overflow-hidden bg-white/95 backdrop-blur-sm dark:bg-black/60 dark:text-white">
          <div className="flex items-center justify-between border-b px-4 py-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold ">Store</span>
            </Link>
          </div>
          <ScrollArea className="flex-1">
            <div className="space-y-2 p-4">
              {menuItems.map((item) => (
                <MobileLink
                  key={item.href}
                  href={item.href}
                  onOpenChange={setOpen}
                  className="block py-2"
                >
                  {item.title}
                </MobileLink>
              ))}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
}

interface MobileLinkProps {
  href: string
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

const MobileLink = ({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) => {
  const router = useRouter()
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href)
        onOpenChange?.(false)
      }}
      className={cn(
        "text-foreground/70 transition-colors hover:text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  )
}
