import { useEffect, useState } from "react"
import { productService } from "../services/productService"
import {
  Box,
  Button,
  Input,
  VStack,
  Text
} from "@chakra-ui/react"

interface Product {
  id: string
  name: string
  description: string
  price: number
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState("")

  async function loadProducts() {
    const data = await productService.getAll(search)
    setProducts(data)
  }

  useEffect(() => {
    loadProducts()
  }, [])

  async function handleDelete(id: string) {
    await productService.delete(id)
    loadProducts()
  }

  return (
    <VStack p={10} spacing={4}>

      <Input
        placeholder="Buscar produto"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Button onClick={loadProducts}>
        Buscar
      </Button>

      {products.map((product) => (
        <Box key={product.id} borderWidth="1px" p={4} w="400px">

          <Text fontWeight="bold">
            {product.name}
          </Text>

          <Text>
            {product.description}
          </Text>

          <Text>
            R$ {product.price}
          </Text>

          <Button
            mt={2}
            colorScheme="red"
            onClick={() => handleDelete(product.id)}
          >
            Deletar
          </Button>

        </Box>
      ))}

    </VStack>
  )
}
