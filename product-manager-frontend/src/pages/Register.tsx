import { useState } from "react"
import { api } from "../api/api"
import { Button, Input, VStack, Heading } from "@chakra-ui/react"

export default function Register() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function handleRegister() {
    await api.post("/auth/register", {
      username,
      email,
      password
    })

    alert("Usuário criado!")
  }

  return (
    <VStack gap={4} mt={20}>
      <Heading>Cadastro</Heading>

      <Input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

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

      <Button colorScheme="green" onClick={handleRegister}>
        Cadastrar
      </Button>
    </VStack>
  )
}