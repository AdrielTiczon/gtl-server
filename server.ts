import fastify, {FastifyInstance} from 'fastify'
import cors from 'fastify-cors'

import uwu from './src/uwu'

const server: FastifyInstance = fastify()


// version wrapper
const v1 = (server, _ops, done) => {
  server.register(uwu, {prefix: '/aj'})
  done()
}

// middlewares
server.register(cors)
server.register(v1, {prefix: '/v1'})


server.get('/ping', async (request, _reply) => {
  return `pong\n`
})


export default server
