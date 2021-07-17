import path from 'path'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const packageConfig = require('./package.json')

export const REPO_NAME = packageConfig.name
export const OUTPUT_DIR = path.resolve('dist')
