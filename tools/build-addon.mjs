import { execSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs'
import chalk from 'chalk';

const __dirname = new URL('.', import.meta.url).pathname;

const cwd = path.resolve(__dirname, '../src/native/');
console.log(chalk.blue('Building native module...'));
execSync('npx node-gyp rebuild', { cwd });
console.log(chalk.green('Built native module successfully.'));

const addonPath = path.resolve(cwd, 'build');
const newPath = path.resolve(__dirname, '../build');
if (fs.existsSync(newPath)) {
  fs.rmSync(newPath, { recursive: true, force: true });
}
fs.renameSync(addonPath, newPath);
