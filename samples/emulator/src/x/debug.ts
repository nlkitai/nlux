export const debug = (...messages: any[]) => {
    for (const message of messages) {
        if (typeof message === 'string') {
            console.log(`[nlux-emulator] ${message}`);
        } else {
            console.log('[nlux-emulator] Debug:');
            console.log(message);
        }
    }
};

export const warn = (message: any) => {
    if (typeof message === 'string') {
        console.warn(`[nlux-emulator] ${message}`);
    } else {
        console.warn('[nlux-emulator] Debug:');
        console.warn(message);
    }
};
