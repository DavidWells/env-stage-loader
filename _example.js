const loadStageEnv = require('./index')

console.log('process.env.REACT_APP_ENV', process.env.REACT_APP_ENV)

// Load env variables
const values = loadStageEnv({
  silent: true,
  // debug: true,
  env: 'development',
  // defaultEnv: 'prod',
  forceSet: {
    REACT_APP_ENV: 'whatatatat'
  },
  // ignoreFiles: ['.env']
})

console.log('process.env.REACT_APP_ENV', process.env.REACT_APP_ENV)
console.log('values', values)
