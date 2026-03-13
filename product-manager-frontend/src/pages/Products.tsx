import { useEffect, useState } from "react"
import { productService } from "../services/productService"
import ProductModal from "../components/ProductModal"
import {
  Box,
  Button,
  Input,
  VStack,
  HStack,
  Text,
  Heading,
  Container,
  SimpleGrid,
  Card,
  CardBody,
  CardFooter,
  IconButton,
  InputGroup,
  InputLeftElement,
  useToast,
  Badge,
  Flex,
  Spacer,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  useDisclosure
} from "@chakra-ui/react"
import { 
  SearchIcon, 
  AddIcon, 
  EditIcon, 
  DeleteIcon, 
  ChevronDownIcon 
} from "@chakra-ui/icons"
import { AuthContext } from "../context/AuthContext"
import { useContext } from "react"
import { useNavigate } from "react-router-dom"

interface Product {
  id: string
  name: string
  description: string
  price: number
}

export default function Products() {
  const { logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function loadProducts() {
    setIsLoading(true)
    try {
      const data = await productService.getAll(search)
      setProducts(data)
    } catch (error) {
      toast({
        title: "Erro ao carregar produtos",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  async function handleDelete(id: string) {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await productService.delete(id)
        toast({
          title: "Produto excluído com sucesso!",
          status: "success",
          duration: 3000,
          isClosable: true,
        })
        loadProducts()
      } catch {
        toast({
          title: "Erro ao excluir produto",
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      }
    }
  }

  async function handleSave(productData: any) {
    try {
      if (isEditing && selectedProduct) {
        await productService.update(selectedProduct.id, productData)
        toast({
          title: "Produto atualizado com sucesso!",
          status: "success",
          duration: 3000,
          isClosable: true,
        })
      } else {
        await productService.create(productData)
        toast({
          title: "Produto adicionado com sucesso!",
          status: "success",
          duration: 3000,
          isClosable: true,
        })
      }
      loadProducts()
    } catch {
      toast({
        title: isEditing ? "Erro ao atualizar produto" : "Erro ao adicionar produto",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  function handleEdit(product: Product) {
    setSelectedProduct(product)
    setIsEditing(true)
    onOpen()
  }

  function handleAdd() {
    setSelectedProduct(null)
    setIsEditing(false)
    onOpen()
  }

  function handleSearch() {
    loadProducts()
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  function handleLogout() {
    logout()
    navigate("/")
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box bg="blue.600" color="white" py={4} px={8} shadow="md">
        <Flex align="center">
          <Heading size="lg">Sistema de Produtos</Heading>
          <Spacer />
          <HStack spacing={4}>
            <Text>Bem-vindo!</Text>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                variant="ghost"
                color="white"
                _hover={{ bg: "blue.700" }}
              >
                <Avatar size="sm" name="Usuário" bg="blue.500" />
              </MenuButton>
              <MenuList color="gray.800">
                <MenuItem onClick={handleLogout}>Sair</MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
      </Box>

      <Container maxW="container.xl" py={8}>
        <VStack spacing={6}>
          {/* Search and Add Bar */}
          <Flex w="100%" gap={4} direction={{ base: "column", md: "row" }}>
            <InputGroup flex={1}>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Buscar produtos por nome..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={handleKeyPress}
                bg="white"
                _placeholder={{ color: "gray.400" }}
              />
            </InputGroup>
            <HStack>
              <Button
                leftIcon={<SearchIcon />}
                onClick={handleSearch}
                colorScheme="blue"
                variant="outline"
              >
                Buscar
              </Button>
              <Button
                leftIcon={<AddIcon />}
                onClick={handleAdd}
                colorScheme="green"
              >
                Adicionar Produto
              </Button>
            </HStack>
          </Flex>

          {/* Products Grid */}
          {isLoading ? (
            <Text>Carregando produtos...</Text>
          ) : products.length === 0 ? (
            <Box textAlign="center" py={10}>
              <Text fontSize="xl" color="gray.500">
                Nenhum produto encontrado
              </Text>
              <Button
                mt={4}
                leftIcon={<AddIcon />}
                onClick={handleAdd}
                colorScheme="blue"
              >
                Adicionar seu primeiro produto
              </Button>
            </Box>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="100%">
              {products.map((product) => (
                <Card
                  key={product.id}
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  bg="white"
                  boxShadow="md"
                  transition="transform 0.2s"
                  _hover={{ transform: "translateY(-4px)", boxShadow: "lg" }}
                >
                  <CardBody>
                    <Badge colorScheme="green" mb={2}>
                      Em estoque
                    </Badge>
                    <Heading size="md" mb={2}>
                      {product.name}
                    </Heading>
                    <Text color="gray.600" noOfLines={2} mb={4}>
                      {product.description}
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                      {formatPrice(product.price)}
                    </Text>
                  </CardBody>

                  <CardFooter bg="gray.50" pt={4}>
                    <HStack spacing={2} w="100%" justify="flex-end">
                      <IconButton
                        aria-label="Editar produto"
                        icon={<EditIcon />}
                        onClick={() => handleEdit(product)}
                        colorScheme="blue"
                        variant="outline"
                        size="sm"
                      />
                      <IconButton
                        aria-label="Excluir produto"
                        icon={<DeleteIcon />}
                        onClick={() => handleDelete(product.id)}
                        colorScheme="red"
                        variant="outline"
                        size="sm"
                      />
                    </HStack>
                  </CardFooter>
                </Card>
              ))}
            </SimpleGrid>
          )}
        </VStack>
      </Container>

      {/* Product Modal */}
      <ProductModal
        isOpen={isOpen}
        onClose={onClose}
        onSave={handleSave}
        initialData={selectedProduct || undefined}
        isEditing={isEditing}
      />
    </Box>
  )
}