import {defineConfig} from 'tsdown'
import {$} from 'execa'

export default defineConfig({
  entry: ['./src/main.ts'],
  hooks(hooks) {
    let subprocess: any = null
    let isWatch = false
    hooks.hook('build:done', async function (){
      if (!isWatch) {
        return
      }
    
      const _subprocess = $`node dist/main.js`
      subprocess = _subprocess
      console.info('run target js')
    })
    hooks.hook('build:before', () => {
    
      isWatch = this?.watch
      if (!isWatch || !subprocess) {
        return
      }
      subprocess.kill('SIGTERM')
      subprocess = null
      console.info('kill target js')
    })
  }
})