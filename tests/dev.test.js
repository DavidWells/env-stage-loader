const test = require('ava')
const loadStageEnv = require('../index')

test('Pulls in development values', t => {
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
	t.deepEqual(values, {
    REACT_APP_ENV: 'development',
    REACT_APP_VALUE_ONE: 'A from .env.development file',
    REACT_APP_VALUE_TWO: 'B from .env.development file',
    REACT_APP_VALUE_THREE: 'C from .env.development file',
    REACT_APP_VALUE_FOUR: 'D from .env.development file',
    REACT_APP_SITE_ENDPOINT: 'https://devsite.com',
    REACT_APP_API_ENDPOINT: 'https://api.devsite.com',
    OTHER: 'base value from .env file'
  })
})

test('forceSet value', t => {
  const values = loadStageEnv({
    env: 'development',
    forceSet: {
      REACT_APP_ENV: 'whatatatat'
    },
  })
  // console.log('values', values)
	t.deepEqual(values, {
    REACT_APP_ENV: 'whatatatat',
    REACT_APP_VALUE_ONE: 'A from .env.development file',
    REACT_APP_VALUE_TWO: 'B from .env.development file',
    REACT_APP_VALUE_THREE: 'C from .env.development file',
    REACT_APP_VALUE_FOUR: 'D from .env.development file',
    REACT_APP_SITE_ENDPOINT: 'https://devsite.com',
    REACT_APP_API_ENDPOINT: 'https://api.devsite.com',
    OTHER: 'base value from .env file'
  })
})

test('ignoreFiles excludes values', t => {
  const values = loadStageEnv({
    env: 'development',
    ignoreFiles: ['.env']
  })
  // console.log('values', values)
	t.deepEqual(values, {
    REACT_APP_ENV: 'whatatatat',
    REACT_APP_VALUE_ONE: 'A from .env.development file',
    REACT_APP_VALUE_TWO: 'B from .env.development file',
    REACT_APP_VALUE_THREE: 'C from .env.development file',
    REACT_APP_VALUE_FOUR: 'D from .env.development file',
    REACT_APP_SITE_ENDPOINT: 'https://devsite.com',
    REACT_APP_API_ENDPOINT: 'https://api.devsite.com',
  })
})

test('Reset values in same process via unloadEnv', t => {
  const values = loadStageEnv({
    // debug: true,
    env: 'prod',
    unloadEnv: true
  })
  // console.log(values)
	t.deepEqual(values, {
    REACT_APP_ENV: '.env.prod.local override',
    REACT_APP_VALUE_ONE: 'A from .env.prod.local file',
    REACT_APP_VALUE_TWO: 'B from .env.prod.local file',
    REACT_APP_VALUE_THREE: 'C from .env.prod.local file',
    REACT_APP_VALUE_FOUR: 'D from .env.prod.local file',
    REACT_APP_SITE_ENDPOINT: 'https://site.com',
    REACT_APP_API_ENDPOINT: 'https://api.site.com',
    OTHER: 'base value from .env file'
  })
})