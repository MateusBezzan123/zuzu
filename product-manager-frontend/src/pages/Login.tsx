import { useState, useContext } from "react"
import { Button, Input, VStack, Heading } from "@chakra-ui/react"
import { authService } from "../services/authService"
import { AuthContext } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

export default function Login() {

  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function handleLogin() {
    try {

      const data = await authService.login({
        email,
        password
      })

      login(data.token)

      navigate("/products")

    } catch {
      alert("Credenciais inválidas")
    }
  }

  return (
    <VStack spacing={4} mt={20}>
      <Heading>Login</Heading>

      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        placeholder="Senha"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button colorScheme="blue" onClick={handleLogin}>
        Entrar
      </Button>

    </VStack>
  )
}
