#!/usr/bin/env node
const process = require('process');
const fs = require('fs');
const path = require('path');
const rootDir = process.cwd();
const configPaths = require(`${rootDir}/tools/configPaths.json`);
function generateTemplate(apiKey, production) {
  return `import { StocksAppConfig } from '@coding-challenge/stocks/data-access-app-config';

export const environment: StocksAppConfig = {
  production: ${production},
  apiKey: '${apiKey}',
  apiURL: 'https://api.polygon.io'
};`;

}

(function main() {
  const scriptCalled = process.argv[process.argv.length - 1];
  const precommit = scriptCalled === '--pre-commit';
  for (const configPath of configPaths) {
    const prod = configPath.endsWith('prod.ts') ? 'true' : 'false';
    let template = '';
    if (precommit) {
      template = generateTemplate('', prod);
    } else {
      const { apiKey } = process.env;
      if (!apiKey) {
        throw new Error('missing required environment variable "apiKey"');
      }
      template = generateTemplate(apiKey, prod);
    }
    const nextPath = path.join(rootDir, configPath);
    fs.writeFileSync(nextPath, template);
  }
})();



