import { useState } from "react"
import { 
  Button, 
  Input, 
  VStack, 
  Heading, 
  Container,
  Box,
  Text,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  useToast,
  Link,
  FormControl,
  FormErrorMessage,
  IconButton
} from "@chakra-ui/react"
import { 
  EmailIcon, 
  LockIcon, 
  ViewIcon, 
  ViewOffIcon,
  PhoneIcon
} from "@chakra-ui/icons"
import { useNavigate, Link as RouterLink } from "react-router-dom"
import { api } from "../api/api"

export default function Register() {
  const navigate = useNavigate()
  const toast = useToast()

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: ""
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const validateForm = () => {
    const newErrors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
    let isValid = true

    // Validação do username
    if (!formData.username) {
      newErrors.username = "Nome de usuário é obrigatório"
      isValid = false
    } else if (formData.username.length < 3) {
      newErrors.username = "Nome de usuário deve ter pelo menos 3 caracteres"
      isValid = false
    }

    // Validação do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) {
      newErrors.email = "Email é obrigatório"
      isValid = false
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email inválido"
      isValid = false
    }

    // Validação da senha
    if (!formData.password) {
      newErrors.password = "Senha é obrigatória"
      isValid = false
    } else if (formData.password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres"
      isValid = false
    }

    // Validação da confirmação de senha
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirme sua senha"
      isValid = false
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  async function handleRegister() {
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      await api.post("/auth/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined
      })

      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Você já pode fazer login no sistema",
        status: "success",
        duration: 3000,
        isClosable: true,
      })

      // Redirecionar para a página de login após 2 segundos
      setTimeout(() => {
        navigate("/")
      }, 2000)

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Erro ao criar usuário"
      
      toast({
        title: "Erro no cadastro",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value })
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field as keyof typeof errors]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleRegister()
    }
  }

  // Função para verificar a força da senha
  const getPasswordStrength = () => {
    const password = formData.password
    if (!password) return { color: "gray.300", text: "" }
    
    if (password.length < 6) return { color: "red.400", text: "Fraca" }
    if (password.length < 8) return { color: "yellow.400", text: "Média" }
    
    // Verifica se tem números e letras
    const hasNumber = /\d/.test(password)
    const hasLetter = /[a-zA-Z]/.test(password)
    
    if (hasNumber && hasLetter && password.length >= 8) {
      return { color: "green.400", text: "Forte" }
    }
    
    return { color: "yellow.400", text: "Média" }
  }

  const passwordStrength = getPasswordStrength()

  return (
    <Container maxW="md" py={10}>
      <Box
        bg="white"
        p={8}
        borderRadius="lg"
        boxShadow="xl"
        borderWidth="1px"
      >
        <VStack spacing={6}>
          <Heading color="green.600">Criar Conta</Heading>
          <Text color="gray.600">Preencha os dados para se registrar</Text>

          <VStack spacing={4} w="100%">
 
            <FormControl isInvalid={!!errors.username}>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <EmailIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Nome de usuário"
                  value={formData.username}
                  onChange={handleChange("username")}
                  onKeyPress={handleKeyPress}
                  bg="gray.50"
                  border="1px"
                  borderColor="gray.200"
                  _hover={{ borderColor: "green.400" }}
                  _focus={{ borderColor: "green.500", boxShadow: "0 0 0 1px green.500" }}
                />
              </InputGroup>
              <FormErrorMessage>{errors.username}</FormErrorMessage>
            </FormControl>

     
            <FormControl isInvalid={!!errors.email}>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <EmailIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Seu email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange("email")}
                  onKeyPress={handleKeyPress}
                  bg="gray.50"
                  border="1px"
                  borderColor="gray.200"
                  _hover={{ borderColor: "green.400" }}
                  _focus={{ borderColor: "green.500", boxShadow: "0 0 0 1px green.500" }}
                />
              </InputGroup>
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>

  
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <PhoneIcon color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Telefone (opcional)"
                value={formData.phone}
                onChange={handleChange("phone")}
                onKeyPress={handleKeyPress}
                bg="gray.50"
                border="1px"
                borderColor="gray.200"
                _hover={{ borderColor: "green.400" }}
                _focus={{ borderColor: "green.500", boxShadow: "0 0 0 1px green.500" }}
              />
            </InputGroup>

     
            <FormControl isInvalid={!!errors.password}>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <LockIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Sua senha"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange("password")}
                  onKeyPress={handleKeyPress}
                  bg="gray.50"
                  border="1px"
                  borderColor="gray.200"
                  _hover={{ borderColor: "green.400" }}
                  _focus={{ borderColor: "green.500", boxShadow: "0 0 0 1px green.500" }}
                />
                <InputRightElement>
                  <IconButton
                    aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.password}</FormErrorMessage>
              
             
              {formData.password && !errors.password && (
                <Box mt={1}>
                  <Text fontSize="xs" color={passwordStrength.color}>
                    Força da senha: {passwordStrength.text}
                  </Text>
                </Box>
              )}
            </FormControl>

   
            <FormControl isInvalid={!!errors.confirmPassword}>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <LockIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Confirme sua senha"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  onKeyPress={handleKeyPress}
                  bg="gray.50"
                  border="1px"
                  borderColor="gray.200"
                  _hover={{ borderColor: "green.400" }}
                  _focus={{ borderColor: "green.500", boxShadow: "0 0 0 1px green.500" }}
                />
                <InputRightElement>
                  <IconButton
                    aria-label={showConfirmPassword ? "Esconder senha" : "Mostrar senha"}
                    icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
            </FormControl>

    
            <Button
              colorScheme="green"
              size="lg"
              w="100%"
              onClick={handleRegister}
              isLoading={isLoading}
              loadingText="Cadastrando..."
              mt={4}
            >
              Cadastrar
            </Button>

  
            <Text>
              Já tem uma conta?{" "}
              <Link as={RouterLink} to="/" color="green.500" fontWeight="medium">
                Faça login
              </Link>
            </Text>

       
            <Text fontSize="xs" color="gray.500" textAlign="center">
              Ao se cadastrar, você concorda com nossos{" "}
              <Link color="green.500">Termos de Serviço</Link> e{" "}
              <Link color="green.500">Política de Privacidade</Link>
            </Text>
          </VStack>
        </VStack>
      </Box>
    </Container>
  )
}