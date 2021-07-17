import path from 'path'
import fs from 'fs'

import { REPO_NAME, OUTPUT_DIR } from '../config.js'

const baseLine = `module.exports = require('./${REPO_NAME}`
const contents = `
'use strict'

if (process.env.NODE_ENV === 'production') {
  ${baseLine}.cjs.production.min.js')
} else {
  ${baseLine}.cjs.development.js')
}
`.trimStart()

fs.writeFileSync(path.join(OUTPUT_DIR, 'index.js'), contents)
