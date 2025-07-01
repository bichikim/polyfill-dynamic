import {Router} from 'hyper-express'
import {getPolyfillList, getPolyfillImportScript, getPolyfillScript} from './polyfill'

const router = new Router()

router.get('/', (req, res) => {
  res.send('Wavve Dynamic Polyfill API v1')
})

router.get('/polyfill.js', async (req, res) => {
  const userAgent = req.headers['user-agent']
  const polyfillList = getPolyfillList(userAgent)
  const polyfillImportScript = getPolyfillImportScript(polyfillList)
  const polyfillScript = await getPolyfillScript(polyfillImportScript)
  res.type('application/javascript')
  res.send(polyfillScript)
})

export default router
