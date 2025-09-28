const { test } = require('uvu')
const assert = require('uvu/assert')
const loadStageEnv = require('../index')

test('Pulls in production values', () => {
  const values = loadStageEnv({
    env: 'prod',
    // unloadEnv needed if previous values were set
    // unloadEnv: true
  })
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