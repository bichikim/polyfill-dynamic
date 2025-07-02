import {build} from 'esbuild'
import { getPolyfillList } from './get-polyfill-list'

export { getPolyfillList }

export const getPolyfillImportScript = (scripts: string[], includeNext: boolean = false) => {
    const targetScripts = includeNext ? scripts : scripts.filter(script => !script.startsWith('esnext.'))
    
    return targetScripts.map(script => {
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
