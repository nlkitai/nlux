import {spawn} from 'node:child_process';
import {info} from '../utils/log.mjs';

export const run = (cmd, showDone = true, env = {}) => {
    info(`Running: ${cmd}`);
    return new Promise((resolve, reject) => {
        const child = spawn(cmd, {
            shell: true,
            stdio: 'inherit',
            env: {...process.env, ...env},
        });
        child.once('error', reject);
        child.once('close', (code, signal) => {
            if (code !== 0) {
                reject(new Error(`Command failed (${signal ?? code}): ${cmd}`));
            } else {
                if (showDone) info('Done');
                resolve();
            }
        });
    });
};
