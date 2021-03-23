const test = require('ava')
const loadStageEnv = require('../index')

process.env.OTHER = 'set from env'

test('Pulls in process.env values first', t => {
  const values = loadStageEnv({
    env: 'staging',
  })

	t.deepEqual(values, {
    REACT_APP_ENV: 'staging',
    REACT_APP_VALUE_ONE: 'A from .env.staging file',
    REACT_APP_VALUE_TWO: 'B from .env.staging file',
    REACT_APP_VALUE_THREE: 'C from .env.staging file',
    REACT_APP_VALUE_FOUR: 'D from .env.staging file',
    REACT_APP_SITE_ENDPOINT: 'https://stagingsite.com',
    REACT_APP_API_ENDPOINT: 'https://api.stagingsite.com',
    OTHER: 'set from env'
  })
})