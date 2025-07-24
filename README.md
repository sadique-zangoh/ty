# Retry Runner

A simple command runner with retry functionality for Node.js.

## Features

- Run any command with automatic retry on failure
- Configurable number of retries (default: 3)
- Configurable delay between retries (default: 1000ms)
- Clear logging of attempt status

## Usage

### Basic usage:
```bash
node retry-runner.js <command> [args...]
```

### With options:
```bash
node retry-runner.js --retries=5 --delay=2000 <command> [args...]
```

### Examples:
```bash
# Retry npm test up to 3 times (default)
node retry-runner.js npm test

# Retry curl with 5 attempts and 2 second delay
node retry-runner.js --retries=5 --delay=2000 curl https://api.example.com

# Retry a flaky build command
node retry-runner.js --retries=10 npm run build
```

## Installation

1. Clone this repository
2. Make the script executable: `chmod +x retry-runner.js`
3. Optionally install globally: `npm install -g .`

## Options

- `--retries=N`: Number of retry attempts (default: 3)
- `--delay=MS`: Delay between retries in milliseconds (default: 1000)

## Exit Codes

- 0: Command succeeded
- 1: Command failed after all retry attempts