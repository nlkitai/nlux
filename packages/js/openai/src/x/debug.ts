export const debug = (...messages: any[]) => {
    if (!process.env.NLUX_DEBUG_ENABLED) {
        return;
    }

    for (const message of messages) {
        if (typeof message === 'string') {
            console.log(`[nlux-openai] ${message}`);
        } else {
            console.log('[nlux-openai] Debug:');
            console.log(message);
        }
    }
};

export const warn = (message: any) => {
    if (typeof message === 'string') {
        console.warn(`[nlux-openai] ${message}`);
    } else {
        console.warn('[nlux-openai] Debug:');
        console.warn(message);
    }
};
