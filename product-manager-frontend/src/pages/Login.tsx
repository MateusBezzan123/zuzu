import { useState, useContext } from "react"
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
  useToast,
  Link
} from "@chakra-ui/react"
import { EmailIcon, LockIcon } from "@chakra-ui/icons"
import { authService } from "../services/authService"
import { AuthContext } from "../context/AuthContext"
import { useNavigate, Link as RouterLink } from "react-router-dom"

export default function Login() {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()
  const toast = useToast()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleLogin() {
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha email e senha",
        status: "warning",
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setIsLoading(true)
    try {
      const data = await authService.login({
        email,
        password
      })

      login(data.token)
      
      toast({
        title: "Login realizado com sucesso!",
        status: "success",
        duration: 2000,
      })
      
      navigate("/products")
    } catch {
      toast({
        title: "Credenciais inválidas",
        description: "Verifique seu email e senha",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleLogin()
    }
  }

  return (
    <Container maxW="md" py={20}>
      <Box
        bg="white"
        p={8}
        borderRadius="lg"
        boxShadow="xl"
        borderWidth="1px"
      >
        <VStack spacing={6}>
          <Heading color="blue.600">Bem-vindo!</Heading>
          <Text color="gray.600">Faça login para acessar o sistema</Text>

          <VStack spacing={4} w="100%">
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <EmailIcon color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Seu email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                bg="gray.50"
                border="1px"
                borderColor="gray.200"
                _hover={{ borderColor: "blue.400" }}
              />
            </InputGroup>

            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <LockIcon color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Sua senha"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                bg="gray.50"
                border="1px"
                borderColor="gray.200"
                _hover={{ borderColor: "blue.400" }}
              />
            </InputGroup>

            <Button
              colorScheme="blue"
              size="lg"
              w="100%"
              onClick={handleLogin}
              isLoading={isLoading}
              loadingText="Entrando..."
            >
              Entrar
            </Button>

            <Text>
              Não tem uma conta?{" "}
              <Link as={RouterLink} to="/register" color="blue.500">
                Registre-se
              </Link>
            </Text>
          </VStack>
        </VStack>
      </Box>
    </Container>
  )
}