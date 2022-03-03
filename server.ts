import fastify, {FastifyInstance} from 'fastify'
import cors from 'fastify-cors'

import routes from './src/api/v1'

const server: FastifyInstance = fastify()

// middlewares
server.register(cors)

// routes with version
server.register(routes, {prefix: '/v1'})


export default server
