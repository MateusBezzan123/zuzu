import { api } from "../api/api"

export interface ProductDTO {
  name: string
  description: string
  price: number
}

export const productService = {

  async getAll(search?: string) {
    const response = await api.get("/products", {
      params: { search }
    })

    return response.data
  },

  async getById(id: string) {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  async create(data: ProductDTO) {
    const response = await api.post("/products", data)
    return response.data
  },

  async update(id: string, data: ProductDTO) {
    const response = await api.put(`/products/${id}`, data)
    return response.data
  },

  async delete(id: string) {
    await api.delete(`/products/${id}`)
  },

  async getMyProducts() {
    const response = await api.get("/products/my/products")
    return response.data
  }
}
