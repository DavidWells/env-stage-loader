# Env Stage Loader

Loads `.env` files in order based on `process.env.NODE_ENV` value.

1. shell
2. .env.{environment}.local
3. .env.{environment}
4. .env.local
5. .env

If environment variable is set, any file loaded after will not override it.

## Usage

Import and use asap in your build process or app

```js
const smartEnv = require('smart-env')

// Load env variables
smartEnv()

// Debug load order & value setting
smartEnv({ debug: true })
```

## Examples

**Example:**

```
.env.dev.local contains FOO=BAR
.env.dev contains FOO=ZAZ

process.env.FOO === BAR from .env.dev.local
```

**Example Two:**

```
# Shell value set
export FOO=1

.env contains FOO=ZAZ

process.env.FOO === 1
# because shell takes precedence
# Also values are never overridden if already set
```

## Typical `.env` files used

- `.env`: Default.
- `.env.local`: Local overrides. **This file is loaded for all environments except test.**
- `.env.development`, `.env.test`, `.env.production`: Environment-specific settings.
- `.env.development.local`, `.env.test.local`, `.env.production.local`: Local overrides of environment-specific settings.

Files on the left have more priority than files on the right:

- `npm start`: `.env.development.local`, `.env.local`, `.env.development`, `.env`

These variables will act as the defaults if the machine does not explicitly set them.

Please refer to the [dotenv documentation](https://github.com/motdotla/dotenv) for more details.
