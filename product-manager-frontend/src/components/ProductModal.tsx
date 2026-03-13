import { useEffect, useState } from "react"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  VStack,
  useToast
} from "@chakra-ui/react"

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (product: any) => void
  initialData?: {
    id?: string
    name: string
    description: string
    price: number
  }
  isEditing?: boolean
}

export default function ProductModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData,
  isEditing = false 
}: ProductModalProps) {
  const toast = useToast()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price || 0
      })
    } else {
      setFormData({
        name: "",
        description: "",
        price: 0
      })
    }
  }, [initialData, isOpen])

  const handleSubmit = () => {
    if (!formData.name || !formData.description || !formData.price) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos",
        status: "warning",
        duration: 3000,
        isClosable: true,
      })
      return
    }

    onSave(formData)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isEditing ? "Editar Produto" : "Adicionar Novo Produto"}
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Nome do Produto</FormLabel>
              <Input
                placeholder="Digite o nome do produto"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Descrição</FormLabel>
              <Textarea
                placeholder="Digite a descrição do produto"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Preço</FormLabel>
              <NumberInput
                min={0}
                precision={2}
                step={0.01}
                value={formData.price}
                onChange={(valueString) => setFormData({ ...formData, price: parseFloat(valueString) || 0 })}
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
          <Button colorScheme="blue" onClick={handleSubmit}>
            {isEditing ? "Salvar Alterações" : "Adicionar Produto"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}