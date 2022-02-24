import {FastifyInstance, FastifyServerOptions} from 'fastify'
import cookie from 'fastify-cookie'
import session from 'fastify-session'
import grant from 'fastify-grant'
import {v1 as uuidv1} from 'uuid'

import grantConfig from '@util/config/grant'
import AuthService from './service'

const routes = async (fastify: FastifyInstance, _ops: FastifyServerOptions) => {
  fastify
      .register(cookie)
      .register(session, {secret: uuidv1(), cookie: {secure: false}})
      .register(grant(grantConfig))

  fastify.get('/verify', async (request, reply) => {
    if (!request.session.grant) reply.code(403).send('unauthorized')
    const sessionId = request.session.sessionId
    const session = request.session.grant

    const authService = new AuthService()
    const oAuthUser = await authService.parseOAuth(session)

    if (!oAuthUser) reply.code(500).send('Something went wrong')

    const user = await authService.verifyUser(oAuthUser)
    const token = await authService.generateToken(user, sessionId)

    console.log({oAuthUser, user, token})

    reply.send('success')
  })
}


export default routes
