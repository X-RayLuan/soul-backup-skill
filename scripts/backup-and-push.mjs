#!/usr/bin/env node

import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SKILL_ROOT = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const options = {
  branch: null,
  remote: 'origin',
  message: null,
  rawOpenClawConfig: true
};

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--branch' && args[i + 1]) {
    options.branch = args[++i];
  } else if (args[i] === '--remote' && args[i + 1]) {
    options.remote = args[++i];
  } else if (args[i] === '--message' && args[i + 1]) {
    options.message = args[++i];
  } else if (args[i] === '--sanitized-config-only') {
    options.rawOpenClawConfig = false;
  }
}

function run(command, commandArgs, opts = {}) {
  const result = spawnSync(command, commandArgs, {
    cwd: SKILL_ROOT,
    stdio: 'pipe',
    encoding: 'utf8',
    ...opts
  });

  if (result.status !== 0) {
    const stderr = (result.stderr || '').trim();
    const stdout = (result.stdout || '').trim();
    const details = stderr || stdout || `exit ${result.status}`;
    throw new Error(`${command} ${commandArgs.join(' ')} failed: ${details}`);
  }

  return (result.stdout || '').trim();
}

function ensureGitRepo() {
  if (!fs.existsSync(path.join(SKILL_ROOT, '.git'))) {
    throw new Error(`No git repo found at ${SKILL_ROOT}`);
  }
}

function currentBranch() {
  return run('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
}

function latestBackupDir() {
  const backupsRoot = path.join(SKILL_ROOT, 'backups');
  const entries = fs.readdirSync(backupsRoot, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && entry.name !== 'named')
    .map(entry => entry.name)
    .sort();

  if (entries.length === 0) throw new Error('No backup directory found after backup run');
  return entries[entries.length - 1];
}

function main() {
  ensureGitRepo();

  const branch = options.branch || currentBranch();
  const backupArgs = ['scripts/backup.mjs'];
  if (options.rawOpenClawConfig) backupArgs.push('--raw-openclaw-config');

  console.log('🔍 Creating backup before git push...');
  run('node', backupArgs);

  const latest = latestBackupDir();
  console.log(`✅ Latest backup: ${latest}`);

  run('git', ['add', 'backups']);

  const status = run('git', ['status', '--short', 'backups']);
  if (!status) {
    console.log('ℹ️  No backup changes to commit.');
    return;
  }

  const message = options.message || `backup: ${latest}`;
  run('git', ['commit', '-m', message]);
  run('git', ['push', options.remote, branch]);

  console.log(`✅ Backup committed and pushed to ${options.remote}/${branch}`);
  console.log(`   Commit message: ${message}`);
}

try {
  main();
} catch (error) {
  console.error(`❌ ${error.message}`);
  process.exit(1);
}
