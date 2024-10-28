import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import axios from "axios"
import { useState } from "react"
import { useRouter } from "next/navigation"

// Validation schema using Zod
const checkoutSchema = z.object({
  name: z.string().min(1, "name is required min 1 character"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().regex(/^\d{10,11}$/, {
    message: "Phone must be a valid 10-11 digit number",
  }),
  city: z.string().min(1, "City is required"),
  zip: z.string().min(5, "Zip code must be at least 5 characters"),
  country: z.string().min(2, "Country is required"),
})

type CheckoutFormValue = z.infer<typeof checkoutSchema>

export function CheckoutForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<CheckoutFormValue>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      city: "",
      zip: "",
      country: "",
    },
  })

  const onSubmit = async (data: CheckoutFormValue) => {
    try {
      setLoading(true)
      console.log(data)
      const response = await axios.post("/api/orders", data)

      console.log(response.data)

      if (response.data) {
        const { orderWithItems } = response.data
        router.push(
          `/checkout/success?orderId=${orderWithItems.id}&totalItems=${orderWithItems.orderItems.length}&totalPrice=${orderWithItems.total}`
        )
      } else {
        console.error("Failed to place order")
      }
    } catch (error) {
      console.error("An error occurred:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mt-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Checkout</CardTitle>
            <CardDescription>
              Enter your details to complete your order.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name ..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="address"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="123 Main St, Anytown USA"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="phone"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="city"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="zip"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zip code</FormLabel>
                    <FormControl>
                      <Input placeholder="12345" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              name="country"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="vn">Vietnam</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Placing Order..." : "Place Order"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
