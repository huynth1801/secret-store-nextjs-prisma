const URL = `${process.env.NEXT_PUBLIC_API_URL}/cart`

const getCartItem = async () => {
  const res = await fetch(`${URL}`)
  return res.json()
}

export default getCartItem
