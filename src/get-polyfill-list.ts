import { resolveUserAgent } from 'browserslist-useragent'
import compat from 'core-js-compat'

export interface Browser {
    family: string
    version: string
}

export const parseMajorVersion = (version: string | null) => {
    if (version == null) {
        return null
    }

    const match = version.match(/^(\d+)\./);

    if (match == null) {
      return version;
    }
  
    return match[1];
}

const DEFAULT_VERSION = '11'
const DEFAULT_TARGET = 'IE'

export const parseUserAgent = (userAgent: string): Browser => {
    
    const {family, version} = resolveUserAgent(userAgent)
    return {family: family || DEFAULT_TARGET, version: parseMajorVersion(version) || DEFAULT_VERSION}
}

// todo caniuse 쓰는 import caniuse from 'caniuse-lite' 브라우저 전용 폴리필 추가도 있어야됨
export const getPolyfillList = (payload: Browser) => {

    const coreJsVersion = '3'
    const {family, version} = payload

    try {
        return compat({
            targets: `${family} >= ${version}`,
            version: coreJsVersion,
        }).list
    } catch {
        // todo return cached defaults list
        return compat({
            targets: `${DEFAULT_TARGET} >= ${DEFAULT_VERSION}`,
            version: coreJsVersion,
        }).list
    }
} 