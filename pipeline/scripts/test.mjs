import {run} from './run.mjs';
import {assertDevelopmentBuild} from './workspaces.mjs';

try {
    assertDevelopmentBuild();
    await run('yarn workspace @nlux-dev/specifications test');
} catch (error) {
    console.error(error.message);
    process.exitCode = 1;
}
