export const debug = (...messages: any[]) => {
    for (const message of messages) {
        if (typeof message === 'string') {
            console.log(`[nlux-emulator] ${message}`);
            continue;
        }

        if (message && typeof message.toString === 'function') {
            console.log(`[nlux-emulator] ${message.toString()}`);
            continue;
        }

        console.log('[nlux-emulator] Debug:');
        console.log(JSON.stringify(message, null, 2));
    }
};

export const warn = (message: any) => {
    if (typeof message === 'string') {
        console.warn(`[nlux-emulator] ${message}`);
        return;
    }

    if (message && typeof message.toString === 'function') {
        console.warn(`[nlux-emulator] ${message.toString()}`);
        return;
    }

    console.warn('[nlux-emulator] Warn:');
    console.log(JSON.stringify(message, null, 2));
};
