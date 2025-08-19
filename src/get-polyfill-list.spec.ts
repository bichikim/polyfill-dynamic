import { describe, it, expect } from 'vitest'
import { getPolyfillList, parseMajorVersion, parseUserAgent } from './get-polyfill-list'

describe('getPolyfillList', () => {
    it('should return polyfill list for modern Chrome', () => {
        const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        const result = getPolyfillList(parseUserAgent(userAgent))
        
        expect(result).toMatchSnapshot()
    })

    it('should return polyfill list for old Safari', () => {
        const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.3 Safari/605.1.15'
        const result = getPolyfillList(parseUserAgent(userAgent))
        
        expect(result).toMatchSnapshot()
    })

    it('should return polyfill list for Firefox', () => {
        const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0'
        const result = getPolyfillList(parseUserAgent(userAgent))
        
        expect(result).toMatchSnapshot()
    })

    it('should return polyfill list for Edge', () => {
        const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0'
        const result = getPolyfillList(parseUserAgent(userAgent))
        
        expect(result).toMatchSnapshot()
    })

    it('should return default polyfill list for invalid user agent', () => {
        const userAgent = 'InvalidUserAgent'
        const result = getPolyfillList(parseUserAgent(userAgent))
        
        expect(result).toMatchSnapshot()
    })

    it('should return default polyfill list for empty user agent', () => {
        const userAgent = ''
        const result = getPolyfillList(parseUserAgent(userAgent))
        
        expect(result).toMatchSnapshot()
    })

    it('should return polyfill list for IE11', () => {
        const userAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko'
        const result = getPolyfillList(parseUserAgent(userAgent))
        
        expect(result).toMatchSnapshot()
    })

    it('should return consistent results for same user agent', () => {
        const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        
        const result1 = getPolyfillList(parseUserAgent(userAgent))
        const result2 = getPolyfillList(parseUserAgent(userAgent))
        
        expect(result1).toEqual(result2)
    })

    it('should return polyfill list for mobile Safari', () => {
        const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
        const result = getPolyfillList(parseUserAgent(userAgent))
        
        expect(result).toMatchSnapshot()
    })

    it('should return polyfill list for Android Chrome', () => {
        const userAgent = 'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36'
        const result = getPolyfillList(parseUserAgent(userAgent))
        
        expect(result).toMatchSnapshot()
    })

    it('should return polyfill list for older Chrome', () => {
        const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36'
        const result = getPolyfillList(parseUserAgent(userAgent))
        
        expect(result).toMatchSnapshot()
    })
})

describe('parseMajorVersion', () => {
    it('should return major version for valid version', () => {
        const version = '120.0.0.0'
        const result = parseMajorVersion(version)
        
        expect(result).toBe('120')
    })
})