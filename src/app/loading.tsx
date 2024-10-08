"use client"

import { Loader } from "@/components/ui/loader"

const Loading = () => {
  return (
    <div className="h-screen">
      <div className="flex items-center justify-center h-full">
        <Loader />
      </div>
    </div>
  )
}

export default Loading
