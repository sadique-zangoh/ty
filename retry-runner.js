#!/usr/bin/env node

const { spawn } = require('child_process');

class RetryRunner {
  constructor(maxRetries = 3, delay = 1000) {
    this.maxRetries = maxRetries;
    this.delay = delay;
  }

  async runCommand(command, args = [], options = {}) {
    let attempt = 1;
    
    while (attempt <= this.maxRetries) {
      console.log(`Attempt ${attempt}/${this.maxRetries}: Running ${command} ${args.join(' ')}`);
      
      try {
        const result = await this.executeCommand(command, args, options);
        console.log(`✅ Command succeeded on attempt ${attempt}`);
        return result;
      } catch (error) {
        console.log(`❌ Attempt ${attempt} failed: ${error.message}`);
        
        if (attempt === this.maxRetries) {
          throw new Error(`Command failed after ${this.maxRetries} attempts: ${error.message}`);
        }
        
        console.log(`⏳ Waiting ${this.delay}ms before retry...`);
        await this.sleep(this.delay);
        attempt++;
      }
    }
  }

  executeCommand(command, args, options) {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, { 
        stdio: 'inherit',
        shell: true,
        ...options
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve({ code, command, args });
        } else {
          reject(new Error(`Process exited with code ${code}`));
        }
      });

      child.on('error', (error) => {
        reject(error);
      });
    });
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node retry-runner.js [--retries=N] [--delay=MS] <command> [args...]');
    console.log('Examples:');
    console.log('  node retry-runner.js npm test');
    console.log('  node retry-runner.js --retries=5 --delay=2000 curl https://api.example.com');
    process.exit(1);
  }

  let maxRetries = 3;
  let delay = 1000;
  let commandArgs = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--retries=')) {
      maxRetries = parseInt(arg.split('=')[1]) || 3;
    } else if (arg.startsWith('--delay=')) {
      delay = parseInt(arg.split('=')[1]) || 1000;
    } else {
      commandArgs = args.slice(i);
      break;
    }
  }

  if (commandArgs.length === 0) {
    console.error('Error: No command specified');
    process.exit(1);
  }

  const runner = new RetryRunner(maxRetries, delay);
  const [command, ...cmdArgs] = commandArgs;

  try {
    await runner.runCommand(command, cmdArgs);
    console.log('🎉 Command completed successfully');
  } catch (error) {
    console.error('💥 Command failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = RetryRunner;