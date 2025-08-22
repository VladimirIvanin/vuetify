'use strict'
const { execSync } = require('child_process')
const { rmSync, renameSync } = require('fs')

// Очищаем директории
rmSync('es5', { recursive: true, force: true })
rmSync('lib', { recursive: true, force: true })
rmSync('lib-temp', { recursive: true, force: true })

// Компилируем TypeScript
execSync('yarn run tsc -p tsconfig.dist.json', { stdio: 'inherit' })

// Трансформируем в ES5
execSync('yarn run cross-env NODE_ENV=es5 babel lib-temp --out-dir es5 --source-maps -q', { stdio: 'inherit' })

// Переименовываем файл
renameSync('./lib-temp/entry-lib.js', './lib-temp/index.js')

// Трансформируем в lib
execSync('yarn run cross-env NODE_ENV=lib babel lib-temp --out-dir lib --source-maps -q', { stdio: 'inherit' })
