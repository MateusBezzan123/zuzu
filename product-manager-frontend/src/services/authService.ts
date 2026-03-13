import { api } from "../api/api"

export interface RegisterDTO {
  username: string
  email: string
  password: string
}

export interface LoginDTO {
  email: string
  password: string
}

export const authService = {

  async register(data: RegisterDTO) {
    const response = await api.post("/auth/register", data)
    return response.data
  },

  async login(data: LoginDTO) {
    const response = await api.post("/auth/login", data)
    return response.data
  },

  async me() {
    const response = await api.get("/auth/me")
    return response.data
  }
}
