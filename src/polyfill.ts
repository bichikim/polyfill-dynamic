import {build} from 'esbuild'
import {transform} from '@babel/core'
import presetEnv from '@babel/preset-env'
import { getPolyfillList } from './get-polyfill-list'
import {type Browser } from './get-polyfill-list'

export * from './get-polyfill-list'

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

export const getPolyfillScriptWithBabel = async (script: string, browser: Browser) => {
    const result = await transform(script, {
        presets: [[
            presetEnv, {
                targets: `${browser.family} >= ${browser.version}`,
                corejs: '3.45',
                useBuiltIns: 'entry',
            }
        ]],
        plugins: [
            ['@babel/plugin-transform-runtime', {
                corejs: 3,
                regenerator: true,
                helpers: true,
            
            }],
        ],
        minified: true,
    })

    return result?.code ?? ''
}