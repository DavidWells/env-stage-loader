/*
Load environment variables from .env* files.
dotenv will never modify any environment variables that have already been set.
*/
const path = require('path')
const fs = require('fs')
/* https://github.com/motdotla/dotenv */
const dotEnv = require('dotenv')
/* https://github.com/motdotla/dotenv-expand */
const dotEnvExpand = require('dotenv-expand')
const { NODE_ENV } = process.env

function smartEnv(config = {}) {
  if (!NODE_ENV) {
    throw new Error('The NODE_ENV environment variable is required but was not specified.');
  }
  const { debug, forceSet } = config
  const directory = fs.realpathSync(process.cwd())
  const dotEnvPath = path.resolve(directory, '.env')

  /* .env presidence order */
  const dotenvFiles = [
    /* 1. .env.[stage].local */
    `${dotEnvPath}.${NODE_ENV}.local`,
    /* 2. (unless NODE_ENV === test) .env.local */
    NODE_ENV !== 'test' && `${dotEnvPath}.local`,
    /* 3. .env.[stage] */
    `${dotEnvPath}.${NODE_ENV}`,
    /* 4. .env */
    dotEnvPath,
  ].filter(Boolean)

  /*
  For more on load order see:
  https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
  */

  if (debug) {
    console.log('Attempting to load these config files')
    console.log(dotenvFiles)
  }

  dotenvFiles.forEach((dotenvFile) => {
    if (fs.existsSync(dotenvFile)) {
      if (debug) console.log(`[dotenv][DEBUG] Load file ${dotenvFile}`)
      dotEnvExpand(dotEnv.config({
        path: dotenvFile,
        debug: debug
      }))
    }
  })

  const overrides = Object.keys(forceSet)
  if (Object.keys(overrides).length) {
    overrides.forEach((key) => {
      if (debug) {
        console.log(`[dotenv][DEBUG] OVERRIDE process.env.${key}`)
        if (process.env[key]) {
          console.log(`[dotenv][DEBUG] process.env.${key} overriden by smartEnv forceSet`)
        }
      }
      process.env[key] = forceSet[key]
    })
  }
  // @TODO return set values?
}

module.exports = smartEnv
