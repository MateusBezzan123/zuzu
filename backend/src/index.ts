import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import routes from './routes'
import database from './config/database'
import { errorHandler } from './utils/errors'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use('/api', routes)

app.use(errorHandler)

async function bootstrap() {
  try {
    await database.connect()

    app.listen(port, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${port}`)
      console.log(`📝 Documentação da API: http://localhost:${port}/api`)
    })
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error)
    process.exit(1)
  }
}

bootstrap()

process.on('SIGINT', async () => {
  await database.disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await database.disconnect()
  process.exit(0)
})