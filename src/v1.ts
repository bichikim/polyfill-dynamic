import {Router} from 'hyper-express'
import {getPolyfillList, getPolyfillImportScript, getPolyfillScript} from './polyfill'

const router = new Router()

router.get('/', (req, res) => {
  res.send('Dynamic Polyfill API v1')
})

router.get('/polyfill.js', async (req, res) => {
  const userAgent = req.headers['user-agent']
  const polyfillList = getPolyfillList(userAgent)
  const polyfillImportScript = getPolyfillImportScript(polyfillList)
  const polyfillScript = await getPolyfillScript(polyfillImportScript)
  // todo userAgent 를 키로 하여 polyfillScript 를 캐시하고 있으면 캐시된 스크립트를 반환하도록 해야함
  // 가능 하다면 cdn 으로 배포하고 있는 스크립트를 사용하도록 해야함
  res.type('application/javascript')
  res.send(polyfillScript)
})

export default router
