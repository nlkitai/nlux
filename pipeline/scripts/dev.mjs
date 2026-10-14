import {existsSync} from 'node:fs';
import {createServer} from 'vite';

const requiredFiles = [
    'dist/dev/nlux-core/esm/nlux-core.js',
    'dist/dev/themes/nova.css',
];

if (requiredFiles.some(file => !existsSync(file))) {
    console.error('Build artifacts are missing. Run `yarn set` before `yarn dev`.');
    process.exit(1);
}

const server = await createServer({
    root: 'examples/baseline',
    server: {host: '127.0.0.1', port: Number(process.env.PORT || 9090), strictPort: true},
});
await server.listen();
server.printUrls();

for (const signal of ['SIGINT', 'SIGTERM']) {
    process.once(signal, async () => {
        await server.close();
        process.exit(0);
    });
}
