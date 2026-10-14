import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import test from 'node:test';
import {packagesList} from '../scripts/packages.mjs';
import {run} from '../scripts/run.mjs';

const repository = fileURLToPath(new URL('../../', import.meta.url));

function fixture(t) {
    const root = mkdtempSync(join(tmpdir(), 'nlux-pipeline-test-'));
    t.after(() => rmSync(root, {recursive: true, force: true}));
    for (const path of ['pipeline', 'package.json', 'docs/package.json', 'specs/package.json',
        ...packagesList.map(pkg => `packages/${pkg.directory}/package.tpl.json`)]) {
        mkdirSync(join(root, path, '..'), {recursive: true});
        cpSync(join(repository, path), join(root, path), {recursive: true});
    }
    return root;
}

function write(root, path, content = 'sentinel') {
    mkdirSync(join(root, path, '..'), {recursive: true});
    writeFileSync(join(root, path), content);
}

function execute(root, script, args = [], env = {}) {
    return spawnSync(process.execPath, [join(root, 'pipeline/scripts', script), ...args], {
        cwd: root,
        encoding: 'utf8',
        env: {...process.env, PATH: '', ...env},
        timeout: 15000,
    });
}

function succeeded(result) {
    assert.equal(result.status, 0, result.error?.message ?? result.stderr + result.stdout);
}

function generate(root) {
    succeeded(execute(root, 'generate.mjs'));
}

function installStub(root) {
    for (const pkg of packagesList) {
        for (const [name, directory] of [[pkg.devName, `packages/${pkg.directory}`], [pkg.npmName, `dist/dev/${pkg.name}`]]) {
            const link = join(root, 'node_modules', name);
            mkdirSync(join(link, '..'), {recursive: true});
            symlinkSync(join(root, directory), link, 'dir');
        }
    }
    write(root, 'node_modules/.bin/tsc');
    const bin = join(root, 'bin');
    mkdirSync(bin);
    writeFileSync(join(bin, 'yarn'), `#!${process.execPath}\n` + `
const fs = require('node:fs');
const args = process.argv.slice(2);
fs.appendFileSync('commands.jsonl', JSON.stringify({args, mode:process.env.NODE_ENV}) + '\\n');
if (args.includes(process.env.FAIL_WORKSPACE)) process.exit(7);
`, {mode: 0o755});
    return {PATH: bin};
}

function buildOutputs(root) {
    for (const pkg of packagesList) {
        const directory = `dist/dev/${pkg.name}`;
        const manifest = JSON.parse(readFileSync(join(root, directory, 'package.json'), 'utf8'));
        for (const file of [manifest.module ?? manifest.main, manifest.types].filter(Boolean)) write(root, `${directory}/${file}`);
    }
}

test('generation works without dependencies and preserves builds, lockfile, and unrelated folders', t => {
    const root = fixture(t);
    write(root, 'yarn.lock');
    write(root, 'dist/demo/keep.txt');
    write(root, 'dist/dev/nlux-core/esm/nlux-core.js');
    write(root, 'dist/prod/nlux-core/esm/nlux-core.js');
    write(root, 'packages/js/unregistered/package.tpl.json', '{"name":"unregistered"}');
    generate(root);
    const before = readFileSync(join(root, 'dist/dev/nlux-react/package.json'), 'utf8');
    generate(root);
    assert.equal(readFileSync(join(root, 'dist/dev/nlux-react/package.json'), 'utf8'), before);
    assert.equal(existsSync(join(root, 'node_modules')), false);
    assert.equal(existsSync(join(root, 'packages/js/unregistered/package.json')), false);
    for (const path of ['yarn.lock', 'dist/demo/keep.txt', 'dist/dev/nlux-core/esm/nlux-core.js', 'dist/prod/nlux-core/esm/nlux-core.js']) {
        assert.equal(readFileSync(join(root, path), 'utf8'), 'sentinel');
    }
    const versions = JSON.parse(readFileSync(join(root, 'pipeline/npm/versions.json'), 'utf8'));
    for (const pkg of packagesList) {
        for (const [path, name, version] of [
            [`packages/${pkg.directory}`, pkg.devName, '0.0.0-latest'],
            [`dist/dev/${pkg.name}`, pkg.npmName, '0.0.0-latest'],
            [`dist/prod/${pkg.name}`, pkg.npmName, versions.nlux],
        ]) {
            const text = readFileSync(join(root, path, 'package.json'), 'utf8');
            const manifest = JSON.parse(text);
            assert.equal(manifest.name, name);
            assert.equal(manifest.version, version);
            assert.doesNotMatch(text, /\{versions\./);
            for (const [dependency, range] of Object.entries(manifest.dependencies)) {
                if (dependency.startsWith('@nlux/')) assert.equal(range, version);
            }
        }
    }
});

test('workspace scope is explicit and catalog drift fails before generation', t => {
    const root = fixture(t);
    const path = join(root, 'package.json');
    const manifest = JSON.parse(readFileSync(path, 'utf8'));
    assert.equal(manifest.workspaces.length, 32);
    assert.ok(manifest.workspaces.every(path => !path.includes('*') && !path.startsWith('samples/')));
    assert.ok(!manifest.workspaces.some(path => path.startsWith('dist/prod/') || path.startsWith('examples/')));
    manifest.workspaces.push('packages/**/*');
    writeFileSync(path, JSON.stringify(manifest));
    const result = execute(root, 'generate.mjs');
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /explicit package catalog/);
    assert.equal(existsSync(join(root, 'dist')), false);
});

test('install and build guards explain missing generation, links, and development output', t => {
    const root = fixture(t);
    let result = execute(root, 'check-workspaces.mjs');
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /yarn generate/);
    generate(root);
    succeeded(execute(root, 'check-workspaces.mjs'));
    result = execute(root, 'build.mjs', ['development']);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /yarn install --frozen-lockfile/);
    const env = installStub(root);
    result = execute(root, 'build.mjs', ['production'], env);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /yarn build:dev/);
    assert.equal(existsSync(join(root, 'commands.jsonl')), false);
});

test('development and production builds only compile, with explicit modes', t => {
    const root = fixture(t);
    generate(root);
    const env = installStub(root);
    succeeded(execute(root, 'build.mjs', ['development'], {...env, NODE_ENV: 'production'}));
    buildOutputs(root);
    succeeded(execute(root, 'build.mjs', ['production'], {...env, NODE_ENV: 'development'}));
    const commands = readFileSync(join(root, 'commands.jsonl'), 'utf8').trim().split('\n').map(JSON.parse);
    assert.equal(commands.length, 2 * (packagesList.length + 1));
    for (const [index, mode] of ['development', 'production'].entries()) {
        const group = commands.slice(index * (packagesList.length + 1), (index + 1) * (packagesList.length + 1));
        assert.deepEqual(group[0].args, ['run', 'tsc', '--project', 'pipeline/utils/tsconfig.json']);
        assert.deepEqual(group.slice(1), packagesList.map(pkg => ({args: ['workspace', pkg.devName, 'build'], mode})));
    }
});

test('failed build commands stop subsequent packages and surface a useful error', t => {
    const root = fixture(t);
    generate(root);
    const env = installStub(root);
    const result = execute(root, 'build.mjs', ['development'], {...env, FAIL_WORKSPACE: packagesList[0].devName});
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Command failed \(7\)/);
    const commands = readFileSync(join(root, 'commands.jsonl'), 'utf8').trim().split('\n');
    assert.equal(commands.length, 2);
});

test('cleanup is repeatable and preserves links, metadata, sources, and unrelated data', t => {
    const root = fixture(t);
    generate(root);
    installStub(root);
    buildOutputs(root);
    const manifest = readFileSync(join(root, 'dist/dev/nlux-core/package.json'), 'utf8');
    for (const path of ['node_modules/keep.txt', 'packages/js/core/node_modules/keep.txt', 'packages/js/core/local.js',
        '.repo-upgrade/evidence/keep.txt', 'dist/unrelated/keep.txt']) write(root, path);
    write(root, 'dist/prod/nlux-core/esm/nlux-core.js');
    write(root, 'dist/demo/index.html');
    write(root, 'pipeline/utils/rollup/generateDts.js');
    succeeded(execute(root, 'cleanup.mjs'));
    succeeded(execute(root, 'cleanup.mjs'));
    for (const path of ['node_modules/keep.txt', 'packages/js/core/node_modules/keep.txt', 'packages/js/core/local.js',
        '.repo-upgrade/evidence/keep.txt', 'dist/unrelated/keep.txt']) {
        assert.equal(readFileSync(join(root, path), 'utf8'), 'sentinel');
    }
    assert.equal(readFileSync(join(root, 'dist/dev/nlux-core/package.json'), 'utf8'), manifest);
    assert.ok(existsSync(join(root, 'node_modules/@nlux/core/index.js')));
    assert.ok(existsSync(join(root, 'packages/js/core/tsconfig.json')));
    for (const path of ['dist/dev/nlux-core/esm', 'dist/prod/nlux-core/esm', 'dist/demo', 'pipeline/utils/rollup/generateDts.js']) {
        assert.equal(existsSync(join(root, path)), false);
    }
});

test('a signal-terminated command rejects rather than reporting success', async () => {
    await assert.rejects(run('kill -TERM $$'), /Command failed \(SIGTERM\)/);
});

test('shared build versions propagate only to declared dependencies', t => {
    const root = fixture(t);
    const path = join(root, 'pipeline/npm/versions.json');
    const versions = JSON.parse(readFileSync(path, 'utf8'));
    versions.devDependencies.rollup = '4.99.0';
    writeFileSync(path, JSON.stringify(versions));
    generate(root);
    for (const pkg of packagesList) {
        const template = JSON.parse(readFileSync(join(root, `packages/${pkg.directory}/package.tpl.json`), 'utf8'));
        const generated = JSON.parse(readFileSync(join(root, `packages/${pkg.directory}/package.json`), 'utf8'));
        assert.deepEqual(Object.keys(generated.devDependencies), Object.keys(template.devDependencies));
        assert.equal(generated.devDependencies.rollup, '4.99.0');
        for (const [name, range] of Object.entries(template.devDependencies)) {
            assert.equal(generated.devDependencies[name], versions.devDependencies[name] ?? range);
        }
        for (const mode of ['dev', 'prod']) {
            const distribution = JSON.parse(readFileSync(join(root, `dist/${mode}/${pkg.name}/package.json`), 'utf8'));
            assert.equal(distribution.devDependencies, undefined);
        }
    }
});

test('generation rejects missing shared versions and literal overrides', t => {
    for (const invalid of ['missing', 'empty', 'literal', 'unknown']) {
        const root = fixture(t);
        const path = join(root, 'pipeline/npm/versions.json');
        const versions = JSON.parse(readFileSync(path, 'utf8'));
        if (invalid === 'missing') delete versions.devDependencies.rollup;
        if (invalid === 'empty') versions.devDependencies.rollup = '';
        writeFileSync(path, JSON.stringify(versions));
        if (invalid === 'literal' || invalid === 'unknown') {
            const templatePath = join(root, 'packages/js/core/package.tpl.json');
            const template = JSON.parse(readFileSync(templatePath, 'utf8'));
            template.devDependencies.rollup = invalid === 'literal' ? '^4' : '{versions.devDependencies.typo}';
            writeFileSync(templatePath, JSON.stringify(template));
        }
        const result = execute(root, 'generate.mjs');
        assert.notEqual(result.status, 0, invalid);
        assert.match(result.stderr, /Invalid build dependency rollup/);
        assert.match(result.stderr, /pipeline\/npm\/versions.json/);
    }
});
