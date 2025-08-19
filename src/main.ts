import {express, Router} from 'hyper-express'
import {createPolyfillRoute} from '@/v1'

const app = express()

const rootRouter = new Router()

rootRouter.get('/', (req, res) => {
  res.send('Dynamic Polyfill API. Please use /api/v1')
})

app.use('/api/v1', createPolyfillRoute({
  cacheStrategy: {
    type: 'cdn',
  }
})).use('/', rootRouter)

app.listen(3000)
