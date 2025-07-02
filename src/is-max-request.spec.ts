import { describe, test, expect } from 'vitest'
import { createStorage } from 'unstorage'
import memoryDriver from 'unstorage/drivers/memory'
import { createIsMaxRequest, DEFAULT_MAX_REQUESTS } from './is-max-request'

describe('createIsMaxRequest', () => {
  test('should allow requests within limit', async () => {
    const storage = createStorage({
      driver: memoryDriver()
    })
    
    const isMaxRequest = createIsMaxRequest(storage, {
      maxRequests: 3
    })

    const identifier = 'test-user-1'
    
    // First request should be allowed
    expect(await isMaxRequest(identifier)).toBe(false)
    
    // Second request should be allowed
    expect(await isMaxRequest(identifier)).toBe(false)
    
    // Third request should be allowed
    expect(await isMaxRequest(identifier)).toBe(false)
  })

  test('should block requests exceeding limit', async () => {
    const storage = createStorage({
      driver: memoryDriver()
    })
    
    const isMaxRequest = createIsMaxRequest(storage, {
      maxRequests: 2
    })

    const identifier = 'test-user-2'
    
    // First two requests should be allowed
    expect(await isMaxRequest(identifier)).toBe(false)
    expect(await isMaxRequest(identifier)).toBe(false)
    
    // Third request should be blocked
    expect(await isMaxRequest(identifier)).toBe(true)
    
    // Fourth request should still be blocked
    expect(await isMaxRequest(identifier)).toBe(true)
  })

  test('should handle different identifiers separately', async () => {
    const storage = createStorage({
      driver: memoryDriver()
    })
    
    const isMaxRequest = createIsMaxRequest(storage, {
      maxRequests: 1
    })

    const user1 = 'user-1'
    const user2 = 'user-2'
    
    // Both users should be allowed their first request
    expect(await isMaxRequest(user1)).toBe(false)
    expect(await isMaxRequest(user2)).toBe(false)
    
    // Both users should be blocked on second request
    expect(await isMaxRequest(user1)).toBe(true)
    expect(await isMaxRequest(user2)).toBe(true)
  })

  test('should handle zero max requests', async () => {
    const storage = createStorage({
      driver: memoryDriver()
    })
    
    const isMaxRequest = createIsMaxRequest(storage, {
      maxRequests: 0
    })

    const identifier = 'test-user-3'
    
    // All requests should be blocked when maxRequests is 0
    expect(await isMaxRequest(identifier)).toBe(true)
    expect(await isMaxRequest(identifier)).toBe(true)
  })

  test(`should use default maxRequests (${DEFAULT_MAX_REQUESTS}) when not specified`, async () => {
    const storage = createStorage({
      driver: memoryDriver()
    })
    
    // No options provided, should use default maxRequests
    const isMaxRequest = createIsMaxRequest(storage)

    const identifier = 'test-user-default'
    
    // Should allow DEFAULT_MAX_REQUESTS requests
    for (let i = 0; i < DEFAULT_MAX_REQUESTS; i++) {
      expect(await isMaxRequest(identifier)).toBe(false)
    }
    
    // (DEFAULT_MAX_REQUESTS + 1)th request should be blocked
    expect(await isMaxRequest(identifier)).toBe(true)
  })

  test(`should use default maxRequests (${DEFAULT_MAX_REQUESTS}) when empty options provided`, async () => {
    const storage = createStorage({
      driver: memoryDriver()
    })
    
    // Empty options provided, should use default maxRequests
    const isMaxRequest = createIsMaxRequest(storage, {})

    const identifier = 'test-user-empty-options'
    
    // Should allow DEFAULT_MAX_REQUESTS requests
    for (let i = 0; i < DEFAULT_MAX_REQUESTS; i++) {
      expect(await isMaxRequest(identifier)).toBe(false)
    }
    
    // (DEFAULT_MAX_REQUESTS + 1)th request should be blocked
    expect(await isMaxRequest(identifier)).toBe(true)
  })
}) 