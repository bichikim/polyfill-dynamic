/**
 * checked for Cloudflare, AWS CloudFront, Google Cloud, Azure, Fastly CDN
 * @description Get cache headers for the response
 * @param shouldCache - Whether to cache the response
 * @returns Cache headers
 */
export const getCacheHeaders = (shouldCache: boolean) => {
    if (!shouldCache) {
        return {
            'Cache-Control': 'public, s-maxage=86400, max-age=3600', // CDN 24시간, 브라우저 1시간
            'Vary': 'User-Agent',
            'X-Cache-Strategy': 'adaptive-enabled'
        }
    }

    return {
        'Cache-Control': 'private, no-store', // CDN 캐싱 금지
        'Vary': 'User-Agent',
        'X-Cache-Strategy': 'adaptive-disabled'
    }
}
