import Carousel from "@/components/native/carousel"
import prisma from "@/lib/prisma"
import { isVariableValid } from "@/lib/utils"
import { Product, Category } from "@prisma/client"
import { ChevronRightIcon } from "lucide-react"
import Link from "next/link"
import React from "react"
import { DataSection } from "./components/data"

export default async function ProductPage({
  params,
}: {
  params: { productId: string }
}) {
  const product = await prisma.product.findUnique({
    where: {
      id: params.productId,
    },
    include: {
      categories: true,
      colors: true,
    },
  })

  if (isVariableValid(product)) {
    return (
      <>
        <Breadcrumbs product={product} />
        <div className="mt-6 grid grid-cols-1 gap-2 md:grid-cols-3">
          <ImageList product={product} />
          <DataSection product={product} />
        </div>
      </>
    )
  }
}

interface BreadcrumbsProps {
  product: (Product & { categories: Category[] }) | null
}

const Breadcrumbs = ({ product }: BreadcrumbsProps) => {
  return (
    <nav className="flex text-muted-foreground" aria-label="Breadcrumb">
      <ol className="flex items-center">
        <li className="inline-flex items-center">
          <Link
            href={"/"}
            className="inline-flex items-center text-sm font-medium"
          >
            Home
          </Link>
        </li>
        <li>
          <div className="flex items-center gap-2">
            <ChevronRightIcon className="h-4" />
            <Link href={"/products"} className="text-sm font-medium">
              Products
            </Link>
          </div>
        </li>
        <li aria-label="page">
          <div className="flex items-center gap-2">
            <ChevronRightIcon className="h-4" />
            <span className="text-sm font-medium">{product?.title}</span>
          </div>
        </li>
      </ol>
    </nav>
  )
}

const ImageList = ({ product }) => {
  return (
    <div className="relative min-h-[50vh] w-full col-span-1">
      <Carousel images={product?.images} />
    </div>
  )
}
