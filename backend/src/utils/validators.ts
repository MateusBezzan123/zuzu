export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePassword = (password: string): boolean => {
  return password.length >= 6
}

export const validateUsername = (username: string): boolean => {
  return username.length >= 3 && username.length <= 30
}

export const validateProduct = (name: string, description: string, price: number): boolean => {
  return name.length > 0 && description.length > 0 && price > 0
}