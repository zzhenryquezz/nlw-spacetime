import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

export async function memoriesRoutes(app: FastifyInstance) {
  app.get('/memories', async () => {
    const memories = await prisma.memory.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    })

    return memories.map((m) => ({
      id: m.id,
      coverUrl: m.coverUrl,
      excerpt: m.content.slice(0, 115) + '...',
    }))
  })

  app.get('/memories/:id', async (request) => {
    const { id } = z.object({ id: z.string().uuid() }).parse(request.params)

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    })

    return memory
  })

  app.post('/memories', async (request) => {
    const payload = z
      .object({
        content: z.string(),
        coverUrl: z.string(),
        isPublic: z.coerce.boolean().default(false),
      })
      .parse(request.body)

    const memory = await prisma.memory.create({
      data: {
        userId: 'a8f3e1c5-d1f1-46fd-af71-13f7fd4400ed',
        content: payload.content,
        coverUrl: payload.coverUrl,
        isPublic: payload.isPublic,
      },
    })

    return memory
  })

  app.put('/memories/:id', async (request) => {
    const { id } = z.object({ id: z.string().uuid() }).parse(request.params)

    const payload = z
      .object({
        content: z.string(),
        coverUrl: z.string(),
        isPublic: z.coerce.boolean().default(false),
      })
      .parse(request.body)

    const memory = await prisma.memory.update({
      data: payload,
      where: {
        id,
      },
    })

    return memory
  })

  app.delete('/memories/:id', async (request) => {
    const { id } = z.object({ id: z.string().uuid() }).parse(request.params)

    await prisma.memory.delete({
      where: {
        id,
      },
    })
  })
}
