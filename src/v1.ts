import {Router} from 'hyper-express'

const router = new Router()

router.get('/', (req, res) => {
  res.send('Hello World?')
})

export default router
