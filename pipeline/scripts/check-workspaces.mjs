import {assertGeneratedWorkspaces} from './workspaces.mjs';

try {
    assertGeneratedWorkspaces();
} catch (error) {
    console.error(error.message);
    process.exitCode = 1;
}
