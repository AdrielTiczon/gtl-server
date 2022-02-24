import server from '@server'

test('hello', async () => {
  const fastifyServer = server

  const res = await fastifyServer.inject({
    method: 'GET',
    url: '/ping',
  })

  expect(res.statusCode).toBe(200)
  expect(true).toBe(true)

  fastifyServer.close()
})
