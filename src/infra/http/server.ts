import { fastifyCors } from '@fastify/cors'
import { fastify } from 'fastify'

const server = fastify()

server.register(fastifyCors, { origin: '*' })

server.listen({ port: 3333, host: 'localhost' }).then(() => {
  console.log('Server is running on http://localhost:3333')
})
