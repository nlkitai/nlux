export const debug = (...messages: any[]) => {
    if (process.env.NLUX_DEBUG_ENABLED !== 'true') {
        return;
    }

    for (const message of messages) {
        if (typeof message === 'string') {
            console.log(`[nlux] ${message}`);
        } else {
            console.log('[nlux] Debug:');
            console.log(message);
        }
    }
};

export const warn = (message: any) => {
    const prefix = (process.env.NLUX_DEBUG_ENABLED === 'true')
        ? '[nlux]: '
        : '';

    if (typeof message === 'string') {
        console.warn(`${prefix}${message}`);
    } else {
        prefix && console.warn(prefix);
        console.warn(message);
    }
};
