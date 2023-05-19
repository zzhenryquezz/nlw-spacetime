import 'dotenv/config'

import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'

import { memoriesRoutes } from './routes/memories'
import { authRoutes } from './routes/auth'

const PORT = 3333

const app = fastify()

app.register(cors, {
  origin: true,
})

app.register(jwt, {
  secret: 'spacetime',
})

app.register(memoriesRoutes)
app.register(authRoutes)

app.get('/', async () => {
  return { hello: 'world' }
})

app.listen({ port: PORT }).then(() => {
  console.log(`Server running: http://locahost:${PORT}`)
})
