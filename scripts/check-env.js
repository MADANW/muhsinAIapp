#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const chalk = require('chalk');

// Check if .env file exists
const envPath = path.resolve(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.error(chalk.red('❌ .env file not found!'));
  console.log(chalk.yellow('Please create a .env file in the project root by copying .env.example'));
  console.log(chalk.yellow('cp .env.example .env'));
  process.exit(1);
}

// Load .env file
const envConfig = dotenv.parse(fs.readFileSync(envPath));

// Required environment variables
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY'
];

// Check for missing or empty environment variables
const missingEnvVars = requiredEnvVars.filter(varName => {
  return !envConfig[varName] || envConfig[varName].trim() === '';
});

if (missingEnvVars.length > 0) {
  console.error(chalk.red('❌ Missing required environment variables:'));
  missingEnvVars.forEach(varName => {
    console.error(chalk.yellow(`  - ${varName}`));
  });
  console.log('\nPlease set these variables in your .env file.');
  process.exit(1);
}

// Check if values look valid (basic check)
const validationIssues = [];

if (envConfig.SUPABASE_URL && !envConfig.SUPABASE_URL.includes('https://')) {
  validationIssues.push('SUPABASE_URL should start with https://');
}

if (envConfig.SUPABASE_ANON_KEY && envConfig.SUPABASE_ANON_KEY.length < 20) {
  validationIssues.push('SUPABASE_ANON_KEY seems too short, please check it');
}

if (validationIssues.length > 0) {
  console.warn(chalk.yellow('⚠️ Potential issues with environment variables:'));
  validationIssues.forEach(issue => {
    console.warn(chalk.yellow(`  - ${issue}`));
  });
  console.log('\nPlease verify your .env file values.');
}

console.log(chalk.green('✅ Environment variables validated successfully!'));
console.log('Environment variables found:');
requiredEnvVars.forEach(varName => {
  // Show first few characters and asterisks for sensitive data
  const value = envConfig[varName];
  const displayValue = value.length > 10 
    ? `${value.substring(0, 4)}...${value.substring(value.length - 4)}`
    : '********';
  console.log(`  - ${varName}: ${displayValue}`);
});