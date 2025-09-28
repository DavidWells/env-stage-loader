const { test } = require('uvu')
const assert = require('uvu/assert')
const loadStageEnv = require('../index')
const path = require('path')

test('Parses multiline values correctly', () => {
  const values = loadStageEnv({
    env: 'test',
    silent: true,
    path: path.join(__dirname, '..', 'fixtures')
  })

  // Test that GITHUB_PRIVATE_KEY is loaded
  assert.ok(process.env.GITHUB_PRIVATE_KEY, 'GITHUB_PRIVATE_KEY should be loaded')

  const githubKey = process.env.GITHUB_PRIVATE_KEY

  // Should start and end with the proper markers
  assert.ok(githubKey.startsWith('-----FAKE BEGIN RSA PRIVATE KEY-----'), 'Should start with BEGIN marker')
  assert.ok(githubKey.endsWith('-----END RSA PRIVATE KEY-----'), 'Should end with END marker')

  // Should contain newlines (multiline)
  assert.ok(githubKey.includes('\n'), 'Should contain newlines')

  // Should have proper number of lines for a typical RSA key
  const lines = githubKey.split('\n')
  assert.ok(lines.length === 12, `Should have 12 lines, got ${lines.length}`)

  // Should be in the resolved values
  assert.ok(values.GITHUB_PRIVATE_KEY, 'GITHUB_PRIVATE_KEY should be in resolved values')
  assert.is(values.GITHUB_PRIVATE_KEY, githubKey, 'Resolved value should match process.env value')

  // Verify multiline value is set correctly on process.env
  assert.ok(process.env.GITHUB_PRIVATE_KEY, 'GITHUB_PRIVATE_KEY should be set on process.env')
  assert.is(process.env.GITHUB_PRIVATE_KEY, values.GITHUB_PRIVATE_KEY, 'process.env value should match returned value')
})

test('Multiline value is not truncated', () => {
  const values = loadStageEnv({
    env: 'test',
    silent: true,
    path: path.join(__dirname, '..', 'fixtures')
  })

  console.log('values', values)

  const githubKey = process.env.GITHUB_PRIVATE_KEY

  // The key should be substantial in length (typical RSA 2048 key is ~1600+ chars)
  assert.ok(githubKey.length > 700, `Key should be >1500 chars, got ${githubKey.length}`)

  // Should not end abruptly (previous bug was cutting off mid-line)
  assert.not(githubKey.endsWith('-----BEGIN RSA PRIVATE KEY-----'), 'Should not end with BEGIN marker')
  assert.not(githubKey.includes('XXXXXXXXXXXXXXXXXXXXXXX+r7m6eKF56rJ2yaZ+/OJU/Fu8582xTCjhGxEwu/NM\n}'), 'Should not have malformed ending')

  // Verify value is correctly set on process.env
  assert.ok(process.env.GITHUB_PRIVATE_KEY, 'GITHUB_PRIVATE_KEY should be set on process.env')
  assert.is(process.env.GITHUB_PRIVATE_KEY, values.GITHUB_PRIVATE_KEY, 'process.env value should match returned value')
  assert.is(process.env.GITHUB_PRIVATE_KEY.length, githubKey.length, 'process.env value should have same length')
})

test.run()