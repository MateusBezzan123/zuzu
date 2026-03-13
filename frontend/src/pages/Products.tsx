import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  VStack,
  Heading,
  HStack,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Badge,
  Text,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import {
  AddIcon,
  EditIcon,
  DeleteIcon,
  SearchIcon,
  ChevronDownIcon,
} from "@chakra-ui/icons";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  userId: string;
  user: {
    username: string;
  };
  createdAt: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
  });
  const [loading, setLoading] = useState(false);
  const { user, signOut } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const toast = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async (search?: string) => {
    try {
      const url = search ? `/products?search=${search}` : "/products";
      const response = await api.get(url);
      setProducts(response.data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os produtos",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSearch = () => {
    loadProducts(searchTerm);
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setSelectedProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
      });
    } else {
      setSelectedProduct(null);
      setFormData({ name: "", description: "", price: 0 });
    }
    onOpen();
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (selectedProduct) {
        await api.put(`/products/${selectedProduct.id}`, formData);
        toast({
          title: "Sucesso",
          description: "Produto atualizado com sucesso",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await api.post("/products", formData);
        toast({
          title: "Sucesso",
          description: "Produto criado com sucesso",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      onClose();
      loadProducts(searchTerm);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o produto",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;

    try {
      await api.delete(`/products/${selectedProduct.id}`);
      toast({
        title: "Sucesso",
        description: "Produto removido com sucesso",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onDeleteClose();
      loadProducts(searchTerm);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível remover o produto",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const filteredProducts = products.filter((product) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.price.toString().includes(term)
    );
  });

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg" color="brand.500">
            Product Manager
          </Heading>
          <HStack>
            <Text>Olá, {user?.username}</Text>
            <Button size="sm" onClick={signOut} colorScheme="red" variant="ghost">
              Sair
            </Button>
          </HStack>
        </HStack>

        <HStack spacing={4}>
          <InputGroup flex={1}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Buscar produtos por nome, descrição ou preço..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
          </InputGroup>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="brand"
            onClick={() => handleOpenModal()}
          >
            Novo Produto
          </Button>
        </HStack>

        <Box bg="white" borderRadius="lg" boxShadow="sm" overflow="hidden">
          <Table variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th>Nome</Th>
                <Th>Descrição</Th>
                <Th isNumeric>Preço</Th>
                <Th>Criado por</Th>
                <Th width="100px">Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredProducts.map((product) => (
                <Tr key={product.id}>
                  <Td fontWeight="medium">{product.name}</Td>
                  <Td maxW="300px" isTruncated>
                    {product.description}
                  </Td>
                  <Td isNumeric>
                    <Badge colorScheme="green" fontSize="sm" px={2} py={1}>
                      R$ {product.price.toFixed(2)}
                    </Badge>
                  </Td>
                  <Td>{product.user.username}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        aria-label="Editar"
                        icon={<EditIcon />}
                        size="sm"
                        colorScheme="blue"
                        variant="ghost"
                        onClick={() => handleOpenModal(product)}
                        isDisabled={product.userId !== user?.id}
                      />
                      <IconButton
                        aria-label="Excluir"
                        icon={<DeleteIcon />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => {
                          setSelectedProduct(product);
                          onDeleteOpen();
                        }}
                        isDisabled={product.userId !== user?.id}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {filteredProducts.length === 0 && (
            <Box textAlign="center" py={8}>
              <Text color="gray.500">
                Nenhum produto encontrado. Comece criando um novo produto!
              </Text>
            </Box>
          )}
        </Box>
      </VStack>

      {/* Modal de Produto */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedProduct ? "Editar Produto" : "Novo Produto"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Nome</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Nome do produto"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Descrição</FormLabel>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Descrição detalhada do produto"
                  rows={4}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Preço</FormLabel>
                <NumberInput
                  min={0}
                  precision={2}
                  step={0.01}
                  value={formData.price}
                  onChange={(valueString) =>
                    setFormData({ ...formData, price: parseFloat(valueString) || 0 })
                  }
                >
                  <NumberInputField placeholder="0,00" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button
              colorScheme="brand"
              onClick={handleSave}
              isLoading={loading}
            >
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Excluir Produto
            </AlertDialogHeader>

            <AlertDialogBody>
              Tem certeza que deseja excluir este produto? Esta ação não pode ser
              desfeita.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Excluir
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
};

export default Products;