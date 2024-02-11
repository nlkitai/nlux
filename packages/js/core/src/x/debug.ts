export const debug = (...messages: any[]) => {
    if (process.env.NLUX_DEBUG_ENABLED !== 'true') {
        return;
    }

    for (const message of messages) {
        if (typeof message === 'string') {
            console.log(`[nlux] ${message}`);
            continue;
        }

        if (message && typeof message.toString === 'function') {
            console.log(`[nlux] ${message.toString()}`);
            continue;
        }

        console.log('[nlux] Debug:');
        console.log(JSON.stringify(message, null, 2));
    }
};
