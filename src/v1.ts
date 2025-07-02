/**
 * /polyfill.js -> response a js file that contains polyfills for the userAgent in the request headers
 * / -> health check
 * @description Dynamic Polyfill API v1
 */

import {Router} from 'hyper-express'
import {getPolyfillList, getPolyfillImportScript, getPolyfillScript} from './polyfill'
import {createIsMaxRequest} from './is-max-request'
import {createStorage} from 'unstorage'
import memoryDriver from 'unstorage/drivers/memory'
import {getCacheHeaders} from './get-cache-headers'
import {setHeaders} from './set-headers'
import {getUserAgent} from './get-user-agent'

const router = new Router()

const storage = createStorage({
  driver: memoryDriver(),
})

const isMaxRequest = createIsMaxRequest(storage, {
  maxRequests: 100,
})

router.get('/', (req, res) => {
  res.send('Dynamic Polyfill API v1 to get polyfills route is ./polyfill.js')
})

router.get('/polyfill.js', async (req, res) => {
  const userAgent = getUserAgent(req)
  const polyfillList = getPolyfillList(userAgent)
  const polyfillImportScript = getPolyfillImportScript(polyfillList)
  const polyfillScript = await getPolyfillScript(polyfillImportScript)
  const shouldCache = await isMaxRequest(userAgent)

  // CDN cache headers
  // TODO: Modify getCacheHeaders according to the CDN being used
  const cacheHeaders = getCacheHeaders(shouldCache)

  setHeaders(res, cacheHeaders)

  // js mime type
  res.type('application/javascript')
  res.send(polyfillScript)
})

export default router
