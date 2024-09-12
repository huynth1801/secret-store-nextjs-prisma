"use client"

import { MainNav } from "@/components/main-nav"
import { ModeToggle } from "@/components/mode-toggle"

export default function Header() {
  return (
    <header
      className="supports-backdrop-blur:bg-background-90 
                        sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur 
                        mb-4 px-[1.4rem] md:px-[4rem] lg:px-[6rem] 
                        xl:px-[8rem] 2xl:px-[12rem]
                        dark:bg-black dark:text-white"
    >
      <div className="flex items-center">
        <MainNav />
        <div className="flex flex-1 items-center h-14">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
