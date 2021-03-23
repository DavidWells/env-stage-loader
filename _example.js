const loadStageEnv = require('../index')

// Load env variables
const values = loadStageEnv({
  debug: true,
  env: 'development',
  // defaultEnv: 'prod',
  forceSet: {
    REACT_APP_ENV: 'whatatatat'
  },
  // ignoreFiles: ['.env']
})

console.log(process.env.REACT_APP_ENV)
console.log('values', values)
