#!/usr/bin/env node
const process = require('process');
const fs = require('fs');
const configPaths = require('./configPaths.json');
function generateTemplate(apiKey, apiUrl) {
  return `import { StocksAppConfig } from '@coding-challenge/stocks/data-access-app-config';

export const environment: StocksAppConfig = {
  production: true,
  apiKey: '${apiKey}',
  apiURL: '${apiUrl}'
};`;

}
console.log('hello world');



