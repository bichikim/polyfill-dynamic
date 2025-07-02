import { resolveUserAgent } from 'browserslist-useragent'
import compat from 'core-js-compat'

const parseMajorVersion = (version: string) => {
    const match = version.match(/^(\\d+)\\.*/);

    if (match == null) {
      return version;
    }
  
    return match[1];
}

export const getPolyfillList = (userAgent: string) => {
    try {
        const {family, version} = resolveUserAgent(userAgent)

        return compat({
            targets: `${family} >= ${parseMajorVersion(version)}`,
            version: '3',
        }).list
    } catch {
        // todo return cached defaults list
        return compat({
            targets: 'IE >= 11',
            version: '3',
        }).list
    }
} 