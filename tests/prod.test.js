const test = require('ava')
const loadStageEnv = require('../index')

test('Pulls in production values', t => {
  const values = loadStageEnv({
    env: 'prod',
    // unloadEnv needed if previous values were set
    // unloadEnv: true
  })
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