import {Response} from 'hyper-express'

export const setHeaders = (res: Response, headers: Record<string, string>) => {
  for (const [key, value] of Object.entries(headers)) {
    res.header(key, value)
  }
} 