import {exec} from 'child_process';
import {error, info} from '../utils/log.mjs';

export const run = async (cmd, showDone = true) => {
    let promiseResolved = false;
    info(`Running 🏃 #\n${cmd}\n`);
    return new Promise((resolve, reject) => {
        const child = exec(
            cmd,
            {
                maxBuffer: 1024 * 1024 * 100,
                env: {
                    ...process.env,
                    FORCE_COLOR: 'true',
                },
            },
        );

        child.stdout.on('data', (data) => {
            if (data) {
                info(`${data}`);
            }
        });

        child.stderr.on('data', (data) => {
            if (data) {
                info(`${data}`);
            }
        });

        child.on('disconnect', () => {
            child.kill(1);
            error(`Process disconnected`);

            if (!promiseResolved) {
                reject();
                promiseResolved = true;
            }
        });

        child.on('exit', (code) => {
            const exitCode = code === 0 || code === null ? 0 : 1;

            child.kill(exitCode);
            info(`Process exited with code ${exitCode}`);

            if (showDone) {
                info(`Done 🏃✅‍`);
            }

            if (!promiseResolved) {
                promiseResolved = true;
                if (exitCode !== 0) {
                    reject();
                } else {
                    resolve();
                }
            }
        })

        child.on('close', (code) => {
            const exitCode = code === 0 || code === null ? 0 : 1;
            info(`Process closed with code ${code}`);

            if (showDone) {
                info(`Done 🏃✅‍`);
            }

            if (!promiseResolved) {
                promiseResolved = true;
                if (exitCode !== 0) {
                    reject();
                } else {
                    resolve();
                }
            }
        });
    });
};
