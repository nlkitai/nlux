import {exec} from 'child_process';
import {error, info} from '../utils/log.mjs';

export const run = async (cmd) => {
    info(`Running 🏃 #\n${cmd}\n`);
    return new Promise((resolve, reject) => {
        const child = exec(cmd);

        child.stdout.on('data', (data) => {
            if (data) {
                info(`${data}`);
            }
        });

        child.stderr.on('data', (data) => {
            error(`${data}`);
        });

        child.on('close', (code) => {
            info(`Process exited with code ${code}`);
            info(`Done 🏃✅‍\n`);
            resolve();
        });
    });
};
