import {exec} from 'child_process';
import {error, info} from '../utils/log.mjs';

export const run = async (cmd, showDone = true) => {
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
            error(`${data}`);
        });

        child.on('error', (err) => {
            error(`${err}`);
            reject();
        });

        child.on('disconnect', () => {
            error(`Process disconnected`);
            reject();
        });

        child.on('spawn', () => {
            info(`Process spawned`);
        });

        child.on('message', (message) => {
            info(`Process message: ${message}`);
        });

        child.on('exit', (code) => {
            info(`Process exited with code ${code}`);

            if (showDone) {
                info(`Done 🏃✅‍\n`);
            }

            resolve();
        })

        child.on('close', (code) => {
            info(`Process exited with code ${code}`);

            if (showDone) {
                info(`Done 🏃✅‍\n`);
            }

            resolve();
        });
    });
};
