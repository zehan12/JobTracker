const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const repoDir = process.cwd();
const targetDir = '/tmp/job-apply-target';

console.log('Starting git rewrite...');

try {
  execSync('git add . && git commit -m "temp commit"', { stdio: 'ignore' });
} catch (e) {}

execSync(`rm -rf ${targetDir}`);
execSync(`mkdir -p ${targetDir}`);
execSync(`cp -r . ${targetDir}/temp`);
execSync(`mv ${targetDir}/temp/* ${targetDir}/ 2>/dev/null || true`);
execSync(`mv ${targetDir}/temp/.* ${targetDir}/ 2>/dev/null || true`);
execSync(`rm -rf ${targetDir}/.git`);
execSync(`rm -rf ${targetDir}/node_modules`);
execSync(`rm -rf ${targetDir}/.next`);

execSync('git checkout --orphan new-main');
execSync('git rm -rf .');
execSync('git clean -fdx');

function commitFile(fileRelPath, msg) {
  const src = path.join(targetDir, fileRelPath);
  const dest = path.join(repoDir, fileRelPath);
  
  if (!fs.existsSync(src)) return;
  
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  execSync(`git add "${fileRelPath}"`);
  execSync(`git commit -m "${msg}"`, { stdio: 'ignore' });
}

const sequence = [
  { f: 'package.json', m: 'chore: setup project dependencies' },
  { f: 'package-lock.json', m: 'chore: lock dependencies' },
  { f: 'bun.lockb', m: 'chore: add bun lockfile' },
  { f: 'tsconfig.json', m: 'chore: configure typescript' },
  { f: 'next.config.mjs', m: 'chore: configure next.js' },
  { f: 'postcss.config.mjs', m: 'chore: setup postcss' },
  { f: 'tailwind.config.ts', m: 'chore: configure tailwind styles' },
  { f: 'components.json', m: 'chore: add shadcn components config' },
  { f: 'eslint.config.mjs', m: 'chore: setup eslint configuration' },
  { f: '.gitignore', m: 'chore: ignore build and node_modules' },
  { f: 'src/app/globals.css', m: 'style: define global css variables' },
  { f: 'src/app/layout.tsx', m: 'feat(app): create root layout' },
  { f: 'src/app/page.tsx', m: 'feat(app): create home page entrypoint' },
  { f: 'src/app/api/scrape/route.ts', m: 'feat(api): add web scraping endpoint' },
  { f: 'src/lib/utils.ts', m: 'feat(lib): add cn utility function' },
  { f: 'src/lib/db.ts', m: 'feat(db): implement indexedDB with dexie' },
  { f: 'src/types.ts', m: 'feat(types): define application domain models' },
  { f: 'src/hooks/useTracker.ts', m: 'feat(hooks): create global state tracker hook' },
];

const uiPath = path.join(targetDir, 'src/components/ui');
if (fs.existsSync(uiPath)) {
  const uiFiles = fs.readdirSync(uiPath).filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));
  for (const file of uiFiles) {
    sequence.push({ f: `src/components/ui/${file}`, m: `feat(ui): add ${file.replace('.tsx', '').replace('.ts', '')} component` });
  }
}

const customPath = path.join(targetDir, 'src/components/custom');
if (fs.existsSync(customPath)) {
  const customFiles = fs.readdirSync(customPath).filter(f => f.endsWith('.tsx'));
  for (const file of customFiles) {
    sequence.push({ f: `src/components/custom/${file}`, m: `feat(custom): implement ${file.replace('.tsx', '')} view` });
  }
}

for (const step of sequence) {
  commitFile(step.f, step.m);
}

execSync(`cp -a ${targetDir}/. .`);
execSync('git add .');
try {
  execSync('git commit -m "chore: add remaining assets and public files"', { stdio: 'ignore' });
} catch (e) {}

execSync('git branch -D main 2>/dev/null || true');
execSync('git branch -M main');

console.log('Done!');
