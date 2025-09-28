const { test } = require('uvu')
const assert = require('uvu/assert')
const loadStageEnv = require('../index')

test('Pulls in staging values', () => {
  const values = loadStageEnv({
    env: 'staging',
    // unloadEnv needed if previous values were set
    // unloadEnv: true
  })

	assert.equal(values, {
    REACT_APP_ENV: 'staging',
    REACT_APP_VALUE_ONE: 'A from .env.staging file',
    REACT_APP_VALUE_TWO: 'B from .env.staging file',
    REACT_APP_VALUE_THREE: 'C from .env.staging file',
    REACT_APP_VALUE_FOUR: 'D from .env.staging file',
    REACT_APP_SITE_ENDPOINT: 'https://stagingsite.com',
    REACT_APP_API_ENDPOINT: 'https://api.stagingsite.com',
    OTHER: 'base value from .env file'
  })

  // Verify values are actually set on process.env
  assert.is(process.env.REACT_APP_ENV, 'staging')
  assert.is(process.env.REACT_APP_VALUE_ONE, 'A from .env.staging file')
  assert.is(process.env.REACT_APP_VALUE_TWO, 'B from .env.staging file')
  assert.is(process.env.REACT_APP_VALUE_THREE, 'C from .env.staging file')
  assert.is(process.env.REACT_APP_VALUE_FOUR, 'D from .env.staging file')
  assert.is(process.env.REACT_APP_SITE_ENDPOINT, 'https://stagingsite.com')
  assert.is(process.env.REACT_APP_API_ENDPOINT, 'https://api.stagingsite.com')
  assert.is(process.env.OTHER, 'base value from .env file')
})

test.run()