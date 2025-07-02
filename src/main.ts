import {express, Router} from 'hyper-express'
import v1 from '@/v1'

const app = express()

app.use('/', (req, res) => {
  res.send('Dynamic Polyfill API please use /api/v1')
})

app.use('/api/v1', v1)

app.listen(3000)
