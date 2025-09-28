const { test } = require('uvu')
const assert = require('uvu/assert')
const loadStageEnv = require('../index')

test('Pulls in development values', () => {
  const values = loadStageEnv({
    // debug: true,
    env: 'development',
    defaultEnv: 'prod',
    // forceSet: {
    //   REACT_APP_ENV: 'whatatatat'
    // },
    // ignoreFiles: ['.env']
  })
  // console.log('values', values)
	assert.equal(values, {
    REACT_APP_ENV: 'development',
    REACT_APP_VALUE_ONE: 'A from .env.development file',
    REACT_APP_VALUE_TWO: 'B from .env.development file',
    REACT_APP_VALUE_THREE: 'C from .env.development file',
    REACT_APP_VALUE_FOUR: 'D from .env.development file',
    REACT_APP_SITE_ENDPOINT: 'https://devsite.com',
    REACT_APP_API_ENDPOINT: 'https://api.devsite.com',
    OTHER: 'base value from .env file'
  })

  // Verify values are actually set on process.env
  assert.is(process.env.REACT_APP_ENV, 'development')
  assert.is(process.env.REACT_APP_VALUE_ONE, 'A from .env.development file')
  assert.is(process.env.REACT_APP_VALUE_TWO, 'B from .env.development file')
  assert.is(process.env.REACT_APP_VALUE_THREE, 'C from .env.development file')
  assert.is(process.env.REACT_APP_VALUE_FOUR, 'D from .env.development file')
  assert.is(process.env.REACT_APP_SITE_ENDPOINT, 'https://devsite.com')
  assert.is(process.env.REACT_APP_API_ENDPOINT, 'https://api.devsite.com')
  assert.is(process.env.OTHER, 'base value from .env file')
})

test('forceSet value', () => {
  const values = loadStageEnv({
    env: 'development',
    forceSet: {
      REACT_APP_ENV: 'whatatatat'
    },
  })
  // console.log('values', values)
	assert.equal(values, {
    REACT_APP_ENV: 'whatatatat',
    REACT_APP_VALUE_ONE: 'A from .env.development file',
    REACT_APP_VALUE_TWO: 'B from .env.development file',
    REACT_APP_VALUE_THREE: 'C from .env.development file',
    REACT_APP_VALUE_FOUR: 'D from .env.development file',
    REACT_APP_SITE_ENDPOINT: 'https://devsite.com',
    REACT_APP_API_ENDPOINT: 'https://api.devsite.com',
    OTHER: 'base value from .env file'
  })

  // Verify values are actually set on process.env
  assert.is(process.env.REACT_APP_ENV, 'whatatatat')
  assert.is(process.env.REACT_APP_VALUE_ONE, 'A from .env.development file')
  assert.is(process.env.REACT_APP_VALUE_TWO, 'B from .env.development file')
  assert.is(process.env.REACT_APP_VALUE_THREE, 'C from .env.development file')
  assert.is(process.env.REACT_APP_VALUE_FOUR, 'D from .env.development file')
  assert.is(process.env.REACT_APP_SITE_ENDPOINT, 'https://devsite.com')
  assert.is(process.env.REACT_APP_API_ENDPOINT, 'https://api.devsite.com')
  assert.is(process.env.OTHER, 'base value from .env file')
})

test('ignoreFiles excludes values', () => {
  const values = loadStageEnv({
    env: 'development',
    ignoreFiles: ['.env']
  })
  // console.log('values', values)
	assert.equal(values, {
    REACT_APP_ENV: 'whatatatat',
    REACT_APP_VALUE_ONE: 'A from .env.development file',
    REACT_APP_VALUE_TWO: 'B from .env.development file',
    REACT_APP_VALUE_THREE: 'C from .env.development file',
    REACT_APP_VALUE_FOUR: 'D from .env.development file',
    REACT_APP_SITE_ENDPOINT: 'https://devsite.com',
    REACT_APP_API_ENDPOINT: 'https://api.devsite.com',
  })

  // Verify values are actually set on process.env (ignoreFiles test excludes .env)
  assert.is(process.env.REACT_APP_ENV, 'whatatatat')
  assert.is(process.env.REACT_APP_VALUE_ONE, 'A from .env.development file')
  assert.is(process.env.REACT_APP_VALUE_TWO, 'B from .env.development file')
  assert.is(process.env.REACT_APP_VALUE_THREE, 'C from .env.development file')
  assert.is(process.env.REACT_APP_VALUE_FOUR, 'D from .env.development file')
  assert.is(process.env.REACT_APP_SITE_ENDPOINT, 'https://devsite.com')
  assert.is(process.env.REACT_APP_API_ENDPOINT, 'https://api.devsite.com')
})

test('Reset values in same process via unloadEnv', () => {
  const values = loadStageEnv({
    // debug: true,
    env: 'prod',
    unloadEnv: true
  })
  // console.log(values)
	assert.equal(values, {
    REACT_APP_ENV: '.env.prod.local override',
    REACT_APP_VALUE_ONE: 'A from .env.prod.local file',
    REACT_APP_VALUE_TWO: 'B from .env.prod.local file',
    REACT_APP_VALUE_THREE: 'C from .env.prod.local file',
    REACT_APP_VALUE_FOUR: 'D from .env.prod.local file',
    REACT_APP_SITE_ENDPOINT: 'https://site.com',
    REACT_APP_API_ENDPOINT: 'https://api.site.com',
    OTHER: 'base value from .env file'
  })

  // Verify values are actually set on process.env
  assert.is(process.env.REACT_APP_ENV, '.env.prod.local override')
  assert.is(process.env.REACT_APP_VALUE_ONE, 'A from .env.prod.local file')
  assert.is(process.env.REACT_APP_VALUE_TWO, 'B from .env.prod.local file')
  assert.is(process.env.REACT_APP_VALUE_THREE, 'C from .env.prod.local file')
  assert.is(process.env.REACT_APP_VALUE_FOUR, 'D from .env.prod.local file')
  assert.is(process.env.REACT_APP_SITE_ENDPOINT, 'https://site.com')
  assert.is(process.env.REACT_APP_API_ENDPOINT, 'https://api.site.com')
  assert.is(process.env.OTHER, 'base value from .env file')
})

test.run()