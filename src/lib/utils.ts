import { Prisma } from "@prisma/client"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isVariableValid<T>(variable: T) {
  return variable !== null && variable !== undefined
}

export const formatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
})

export function getOrderBy(
  sort: string | undefined
): Prisma.ProductOrderByWithRelationInput {
  let orderBy: Prisma.ProductOrderByWithRelationInput

  switch (sort) {
    case "most_expensive":
      orderBy = {
        price: "desc", // Sorting by price in descending order
      }
      break
    case "most_cheaper":
      orderBy = {
        price: "asc", // Sorting by price in ascending order
      }
      break
    default:
      orderBy = {
        orders: {
          _count: "desc", // Sorting by the count of related orders in descending order
        },
      }
      break
  }

  return orderBy
}
