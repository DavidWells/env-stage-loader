const { test } = require('uvu')
const assert = require('uvu/assert')
const loadStageEnv = require('../index')

// Helper function to clean up environment variables before each test
function cleanupEnv() {
  const envVarsToClean = [
    'REACT_APP_ENV',
    'REACT_APP_VALUE_ONE',
    'REACT_APP_VALUE_TWO',
    'REACT_APP_VALUE_THREE',
    'REACT_APP_VALUE_FOUR',
    'REACT_APP_SITE_ENDPOINT',
    'REACT_APP_API_ENDPOINT',
    'OTHER',
    'CUSTOM_VALUE'
  ]

  envVarsToClean.forEach(key => {
    delete process.env[key]
  })
}

test('unloadEnv removes previously set values', () => {
  cleanupEnv()

  // First load development values
  const devValues = loadStageEnv({
    env: 'development',
    silent: true
  })

  // Verify dev values are loaded
  assert.is(process.env.REACT_APP_ENV, 'development')
  assert.is(process.env.REACT_APP_VALUE_ONE, 'A from .env.development file')

  // Now load staging with unloadEnv to clear previous values
  const stagingValues = loadStageEnv({
    env: 'staging',
    unloadEnv: true,
    silent: true
  })

  // Verify staging values are now loaded
  assert.is(process.env.REACT_APP_ENV, 'staging')
  assert.is(process.env.REACT_APP_VALUE_ONE, 'A from .env.staging file')

  // Verify the returned values match what's in process.env
  assert.equal(stagingValues, {
    REACT_APP_ENV: 'staging',
    REACT_APP_VALUE_ONE: 'A from .env.staging file',
    REACT_APP_VALUE_TWO: 'B from .env.staging file',
    REACT_APP_VALUE_THREE: 'C from .env.staging file',
    REACT_APP_VALUE_FOUR: 'D from .env.staging file',
    REACT_APP_SITE_ENDPOINT: 'https://stagingsite.com',
    REACT_APP_API_ENDPOINT: 'https://api.stagingsite.com',
    OTHER: 'base value from .env file'
  })
})

test('unloadEnv only removes values that match file contents', () => {
  cleanupEnv()

  // Set a custom value that won't match any env file
  process.env.CUSTOM_VALUE = 'custom value'

  // Load development values
  loadStageEnv({
    env: 'development',
    silent: true
  })

  // Verify dev values and custom value are set
  assert.is(process.env.REACT_APP_ENV, 'development')
  assert.is(process.env.CUSTOM_VALUE, 'custom value')

  // Load staging with unloadEnv
  loadStageEnv({
    env: 'staging',
    unloadEnv: true,
    silent: true
  })

  // Custom value should still be there (not in any env file)
  assert.is(process.env.CUSTOM_VALUE, 'custom value')

  // But staging values should be loaded
  assert.is(process.env.REACT_APP_ENV, 'staging')

  // Clean up
  delete process.env.CUSTOM_VALUE
})

test('unloadEnv works with forceSet values', () => {
  cleanupEnv()

  // Load development values first
  loadStageEnv({
    env: 'development',
    silent: true
  })

  assert.is(process.env.REACT_APP_ENV, 'development')

  // Load with unloadEnv and forceSet
  const values = loadStageEnv({
    env: 'staging',
    unloadEnv: true,
    forceSet: {
      REACT_APP_ENV: 'forced-value'
    },
    silent: true
  })

  // forceSet should override everything
  assert.is(process.env.REACT_APP_ENV, 'forced-value')
  assert.is(values.REACT_APP_ENV, 'forced-value')
})

test('unloadEnv with debug logging', () => {
  cleanupEnv()

  // This test verifies unloadEnv works with debug enabled
  // Load development values first
  loadStageEnv({
    env: 'development',
    silent: true
  })

  // Load staging with unloadEnv and debug
  const values = loadStageEnv({
    env: 'staging',
    unloadEnv: true,
    debug: true,
    silent: true
  })

  // Should work the same as without debug
  assert.is(process.env.REACT_APP_ENV, 'staging')
  assert.is(values.REACT_APP_ENV, 'staging')
})

test.run()