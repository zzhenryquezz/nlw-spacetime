import 'dotenv/config'

import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import staticPlugin from '@fastify/static'

import { memoriesRoutes } from './routes/memories'
import { authRoutes } from './routes/auth'
import { uploadRoutes } from './routes/upload'
import { resolve } from 'path'

const PORT = 3333
const HOST = '0.0.0.0'

const app = fastify({
  // logger: {
  //   transport: {
  //     target: 'pino-pretty',
  //     options: {
  //       translateTime: 'HH:MM:ss Z',
  //       ignore: 'pid,hostname',
  //     },
  //   },
  // },
  
})

app.register(cors, { origin: ["*"]})
app.register(jwt, { secret: 'spacetime' })
app.register(multipart)
app.register(staticPlugin, {
  root: resolve(__dirname, '..', 'uploads'),
  prefix: '/uploads/',
})

app.register(memoriesRoutes)
app.register(authRoutes)
app.register(uploadRoutes)

app.get('/', async () => {
  return { hello: 'world' }
})

app.listen({ port: PORT, host: HOST }).then(() => {
  // console.log(`Server running: http://${HOST}:${PORT}`)
})
