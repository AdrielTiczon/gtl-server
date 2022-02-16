import axios from 'axios'

const uwu = (fastify, ops, done) => {
  fastify.get('/uwu', async (req, res) => {
    const query = `
    query MyQuery {
      room_aggregate {
        aggregate {
          count
        }
      }
    }`
    const uwu = await axios.post(
        `${process.env.HASURA_URL}`, {query}, {
          headers: {
            'Content-Type': 'application/json',
            'x-hasura-admin-secret': `${process.env.HASURA_SECRET}`,
          },
        })
    console.log(uwu.data)
    res.send('../index.html')
  })
  done()
}


export default uwu
