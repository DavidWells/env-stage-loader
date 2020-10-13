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

function envStageLoader(config = {}) {
  const { debug, forceSet } = config
  const debugLogger = logger(debug)
  if (config.env) {
    debugLogger(`NODE_ENV set from "env" config value, using instead of process.env.NODE_ENV`)
  }
  if (config.defaultEnv) {
    debugLogger(`NODE_ENV set from "defaultEnv" config value, using instead of process.env.NODE_ENV`)
  }

  const nodeEnv = config.env || NODE_ENV || config.defaultEnv

  if (!nodeEnv) {
    throw new Error('The NODE_ENV environment variable is required but was not specified.');
  }

  const envPath = config.path || process.cwd()

  const directory = fs.realpathSync(envPath)
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

  debugLogger('Attempting to load these config files')
  debugLogger(dotenvFiles)

  // Unset previously set values for dotenv conflicts
  if (options.unloadEnv && fs.existsSync(dotEnvPath))
    debugLogger(`[dotenv][DEBUG] Load file ${dotenvFile}`)
    unload(dotEnvPath, { encoding })
  }

  /* Loop over env files and set values found */
  dotenvFiles.forEach((dotenvFile) => {
    if (fs.existsSync(dotenvFile)) {
      debugLogger(`[dotenv][DEBUG] Load file ${dotenvFile}`)

      dotEnvExpand(dotEnv.config({
        path: dotenvFile,
        debug: debug
      }))
    }
  })

  const overrides = Object.keys(forceSet)
  if (Object.keys(overrides).length) {
    overrides.forEach((key) => {
      debugLogger(`[dotenv][DEBUG] OVERRIDE process.env.${key}`)
      if (process.env[key]) {
        debugLogger(`[dotenv][DEBUG] process.env.${key} overriden by envStageLoader forceSet`)
      }
      process.env[key] = forceSet[key]
    })
  }
  // @TODO return set values?
}

const noOp = () => {}

function logger(debug) {
  if (!debug) return noOp
  return console.log
}

function unload(filenames, options = {}) {
  const parsed = parse(filenames, options);

  Object.keys(parsed).forEach((key) => {
    if (process.env[key] === parsed[key]) {
      delete process.env[key];
    }
  })
}

module.exports = envStageLoader
