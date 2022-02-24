import {FastifyInstance, FastifyServerOptions} from 'fastify'
import auth from './auth'

const routes = async (fastify: FastifyInstance, _ops: FastifyServerOptions) => {
  // auth
  fastify.register(auth, {prefix: '/auth'})
}


export default routes
