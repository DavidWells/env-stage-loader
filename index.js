/*
Load environment variables from .env* files.
dotenv will never modify any environment variables that have already been set.
*/
const fs = require('fs')
const path = require('path')
/* https://github.com/motdotla/dotenv */
const dotEnv = require('dotenv')
/* https://github.com/motdotla/dotenv-expand */
const dotEnvExpand = require('dotenv-expand')

const LOG_PREFIX = '[dotenv]'

function envStageLoader(config = {}) {
  const { debug, forceSet, unloadEnv, ignoreFiles, silent, required, } = config
  const debugLogger = logger(debug)
  if (config.env) {
    debugLogger(`NODE_ENV set from "env" config value, using instead of process.env.NODE_ENV`)
  }
  if (!process.env.NODE_ENV && !config.env && config.defaultEnv) {
    debugLogger(`NODE_ENV set from "defaultEnv" config value, using instead of process.env.NODE_ENV`)
  }

  const nodeEnv = config.env || process.env.NODE_ENV || config.defaultEnv

  if (!nodeEnv) {
    throw new Error(`
  The config.env, config.defaultEnv or process.env.NODE_ENV environment variable is required but none was not specified.
    `)
  }

  if (!silent) {
    console.log(`${LOG_PREFIX} Loading "${nodeEnv}" environment values`)
  }

  const envPath = config.path || config.envPath || config.envDir || config.dir || process.cwd()

  const directory = fs.realpathSync(envPath)
  const dotEnvPath = path.resolve(directory, '.env')

  /* .env precedence order */
  let dotEnvFiles = [
    /* 1. .env.[stage].local */
    `${dotEnvPath}.${nodeEnv}.local`,
    /* 2. (unless NODE_ENV === test) .env.local */
    nodeEnv !== 'test' && `${dotEnvPath}.local`,
    /* 3. .env.[stage] */
    `${dotEnvPath}.${nodeEnv}`,
    /* 4. .env */
    dotEnvPath,
  ].filter(Boolean)

  /* if config.ignoreFiles array set, exclude those files from loading */
  if (ignoreFiles) {
    dotEnvFiles = dotEnvFiles.filter((file) => !ignoreFiles.includes(path.basename(file)))
  }

  /* Filter to down to existing files only */
  dotEnvFiles = dotEnvFiles.filter((file) => {
    return fs.existsSync(file)
  })
  
  /*
    For more on load order see:
    https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
  */

  debugLogger('Attempting to load these config files')
  debugLogger(dotEnvFiles)

  // Unset previously set values for dotenv conflicts
  if (unloadEnv) {
    dotEnvFiles.forEach((dotEnvFile) => {
      debugLogger(`${LOG_PREFIX}[DEBUG] Unload file values ${dotEnvFile}`)
      // unload(dotEnvPath, { encoding })
      unload(dotEnvFile, {
        ...config,
        debugLogger
      })
    })
  }

  let resolvedValues = {}

  /* Loop over env files and set values found */
  dotEnvFiles.forEach((dotEnvFile, i) => {
    if (!silent) {
      console.log(`${LOG_PREFIX}   ${i + 1}. Loading "${dotEnvFile}" config file values to ENV`)
    }
    debugLogger(`${LOG_PREFIX}[DEBUG] Load file ${dotEnvFile}`)

    const dotEnvConf = {
      path: dotEnvFile,
      debug: debug
    }

    const values = dotEnvExpand(dotEnv.config(dotEnvConf))
    // Assign resolved values
    if (values && values.parsed) {
      resolvedValues = Object.assign({}, resolvedValues, values.parsed)
    }
  })

  const forceOverrides = forceSet || {}
  const overrides = Object.keys(forceOverrides)
  if (Object.keys(overrides).length) {
    overrides.forEach((key) => {
      if (process.env[key]) {
        debugLogger(`${LOG_PREFIX}[DEBUG] process.env.${key} overridden by envStageLoader forceSet value`)
      }
      process.env[key] = forceOverrides[key]
      resolvedValues[key] = forceOverrides[key]
    })
  }

  /* Validate required env variables */
  if (required) {
    const requiredArray = Array.isArray(required) ? required : [required]
    requiredArray.forEach((key) => {
      if (!process.env[key]) {
        throw new Error(`${LOG_PREFIX} Required environment variable ${key} is not set`)
      }
    })
  }

  return resolvedValues
}

const noOp = () => {}

function logger(debug) {
  if (!debug) return noOp
  return console.log
}

/* Unset previously set env variables */
function unload(file, options = {}) {
  const values = dotEnvExpand(dotEnv.config({
    path: file,
    debug: options.debug
  }))

  if (values && values.parsed) {
    Object.keys(values.parsed).forEach((key) => {
      if (process.env[key] === values.parsed[key]) {
        options.debugLogger('[dotenv][DEBUG] Unset key', key)
        // Unset keys
        delete process.env[key];
      }
    })
  }
}

module.exports = envStageLoader
