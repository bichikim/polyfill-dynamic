import {Router, Request} from 'hyper-express'


export const getUserAgent = (req: Request) => {
  return req.headers['user-agent']
}
