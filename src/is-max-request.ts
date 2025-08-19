import type { Storage } from 'unstorage'

export const DEFAULT_MAX_REQUESTS = 100

export interface IsMaxRequestOptions {
  /**
   * Maximum number of requests allowed (default: 100)
   */
  maxRequests?: number
}

/**
 * Creates an is-max-request function with simple request counting using provided storage
 * @param storage - Storage instance for persisting request counts
 * @param options - Optional configuration (default: { maxRequests: 100 })
 */
export function createIsMaxRequest(
  storage: Storage<number>, 
  options: IsMaxRequestOptions = {}
) {
  const { maxRequests = DEFAULT_MAX_REQUESTS } = options

  /**
   * Checks if the request from a specific identifier exceeds the maximum limit
   * @param identifier - Unique identifier for the requester (e.g., IP address, user ID)
   * @returns Promise<boolean> - true if max requests exceeded, false otherwise
   */
  return async function isMaxRequest(identifier: string): Promise<boolean> {
    const key = `requests:${identifier}`
    
    // Get current request count from storage
    const currentCount = await storage.getItem<number>(key) || 0
    
    // Check if max requests exceeded
    if (currentCount >= maxRequests) {
      return true // Max requests exceeded
    }
    
    // Increment counter
    await storage.setItem(key, currentCount + 1)
    
    return false
  }
}
