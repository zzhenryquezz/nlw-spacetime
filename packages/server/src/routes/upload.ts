import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import axios from 'axios'
import { prisma } from '../lib/prisma'
import { randomUUID } from 'crypto'
import { extname, resolve } from 'path'
import { createReadStream, createWriteStream } from 'fs'
import { pipeline } from 'stream'
import { promisify } from 'util'

const pump = promisify(pipeline)

export async function uploadRoutes(app: FastifyInstance) {
  app.post('/upload', async (request, reply) => {
    const upload = await request.file({
      limits: {
        fieldSize: 5_242_880, // 5MB
      }
    })

    if (!upload) {
      return reply.status(400).send()
    }

    const isValidFormat = /^(image|video)\/[a-zA-z]+/.test(upload.mimetype)

    if (!isValidFormat) {
      return reply.status(400).send()
    }

    const fileId = randomUUID()
    const ext = extname(upload.filename)

    const fileName = fileId.concat(ext)

    const writeStream = createWriteStream(
      resolve(__dirname, '..', '..', 'uploads', fileName)
    )

    await pump(upload.file, writeStream)

    const fullURL = request.protocol.concat('://').concat(request.hostname)
    const fileURL = new URL(`/uploads/${fileName}`, fullURL).toString()


    return {
      fileURL
    }

  })
}
