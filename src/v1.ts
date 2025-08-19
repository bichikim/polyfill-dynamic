/**
 * /polyfill.js -> response a js file that contains polyfills for the userAgent in the request headers
 * / -> health check
 * @description Dynamic Polyfill API v1
 */

import {Router} from 'hyper-express'
import {getPolyfillList, getPolyfillImportScript, getPolyfillScript, parseUserAgent, type Browser, getPolyfillScriptWithBabel} from './polyfill'
import {createIsMaxRequest} from './is-max-request'
import {createStorage} from 'unstorage'
import memoryDriver from 'unstorage/drivers/memory'
import {getCacheHeaders} from './get-cache-headers'
import {setHeaders} from './set-headers'
import {getUserAgent} from './get-user-agent'
import type { Storage } from 'unstorage'
import {Response} from 'hyper-express'

export interface CDNCacheStrategy {
  type: 'cdn'
  maxRequestsThreshold?: number
  maxRequestCounterStorage?: Storage<number>
}

export interface DisabledCacheStrategy {
  type: 'disabled'
}

export interface StorageCacheStrategy {
  type: 'storage'
  storage: Storage<string>
}

export interface CreatePolyfillRouteOptions {
  cacheStrategy: CDNCacheStrategy | DisabledCacheStrategy | StorageCacheStrategy
}

export interface CacheManager {
  /**
   * Prepare the response for the browser
   * for Cdn cache, it will set the cache headers
   * @param res - The response object
   * @param browser - The browser object
   */
  prepare?: (res: Response, browser: Browser) => void
  get: (browser: Browser) => Promise<string | null> | string | null
  set: (browser: Browser, value: string | Buffer | ArrayBuffer) => Promise<void> | void
  delete: (browser: Browser) => Promise<void> | void
}

const browserToKey = (browser: Browser) => {
  return `${browser.family}$$${browser.version}`
}

const createCdnCacheManager = (options: CDNCacheStrategy): CacheManager => {
  const {maxRequestsThreshold = 100, maxRequestCounterStorage = createStorage({
    driver: memoryDriver(),
  })} = options

  const isMaxRequest = createIsMaxRequest(maxRequestCounterStorage, {
    maxRequests: maxRequestsThreshold,
  })

  return {
    get: () => {
      // skip
      return null
    },
    set: () => {
      // skip
    },
    delete: () => {
      // skip
    },
    prepare: async (res: Response, browser: Browser) => {
      // Prevent excessive CDN caching
      const shouldCache = await isMaxRequest(browserToKey(browser))
  
      // get CDN cache headers
      // TODO: Modify getCacheHeaders according to the CDN being used
      const cacheHeaders = getCacheHeaders(shouldCache)
    
      // set CDN cache headers
      setHeaders(res, cacheHeaders)
    }
  }
}

const createDisabledCacheManager = (): CacheManager => {
  return {
    get: () => null,
    set: () => {},
    delete: () => {},
  }
}

const createStorageCacheManager = (options: StorageCacheStrategy): CacheManager => {
  const {storage} = options

  return {
    get: (browser: Browser) => {
      return storage.getItem(browserToKey(browser))
    },
    set: (browser: Browser, value: string | Buffer | ArrayBuffer) => {
      if (typeof value === 'string') {
        return storage.setItem(browserToKey(browser), value)
      }

      // set raw value
      return storage.setItemRaw(browserToKey(browser), value)
    },
    delete: (browser: Browser) => {
      return storage.removeItem(browserToKey(browser))
    },
  }
}

const createCacheManager = (options: CreatePolyfillRouteOptions['cacheStrategy']): CacheManager => {
  if (options.type === 'cdn') {
    return createCdnCacheManager(options)
  }

  if (options.type === 'storage') {
    return createStorageCacheManager(options)
  }

  return createDisabledCacheManager()
}

export const createPolyfillRoute = (options: CreatePolyfillRouteOptions) => {
  const {cacheStrategy} = options
  const cacheManager = createCacheManager(cacheStrategy)
  const router = new Router()

  router.get('/', (req, res) => {
    res.send('Dynamic Polyfill API v1 to get polyfills route is ./polyfill.js')
  })
  
  router.get('/polyfill.js', async (req, res) => {
    const userAgent = getUserAgent(req)
    const browser = parseUserAgent(userAgent)
    cacheManager.prepare?.(res, browser)

    const cachedPolyfill = await cacheManager.get(browser)
    if (cachedPolyfill) {
      res.type('application/javascript')
      res.send(cachedPolyfill)
      return
    }

    const polyfillList = getPolyfillList(browser)
    const polyfillImportScript = getPolyfillImportScript(polyfillList)
    const polyfillScript = await getPolyfillScriptWithBabel(polyfillImportScript, browser)

    await cacheManager.set(browser, polyfillScript)
  
    // js mime type
    res.type('application/javascript')
    res.send(polyfillScript)
  })

  return router
}
