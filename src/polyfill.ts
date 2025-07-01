import { resolveUserAgent } from 'browserslist-useragent'
import compat from 'core-js-compat'
import {build} from 'esbuild'

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
            targets: `${family} ${parseMajorVersion(version)}`,
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

export const getPolyfillImportScript = (scripts: string[]) => {
    return scripts.map(script => {
        return `
            import "core-js/modules/${script}"
        `
    }).join('\n')
}

export const getPolyfillScript = async (script: string) => {
    const result = await build({
        stdin: {
            contents: script,
            loader: 'js',
            resolveDir: '.',
        },
        minify: true,
        write: false,
        bundle: true,
        target: 'es5',
        platform: 'browser',
        format: 'iife',
    })

    const {contents} = result.outputFiles[0]

    return contents
}
