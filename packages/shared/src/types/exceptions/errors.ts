export const NLErrors = {
    //
    // Adapter config errors
    //
    'data-transfer-mode-not-supported': 'Requested data transfer mode is not supported',
    'no-data-transfer-mode-supported': 'Adapter does not support any valid data transfer modes',

    //
    // Internet, HTTP, and API errors
    //
    'connection-error': 'Connection error',
    'invalid-credentials': 'Invalid credentials',
    'invalid-api-key': 'Invalid API key',
    'http-server-side-error': 'HTTP server side error',
    'http-client-side-error': 'HTTP client side error',

    //
    // Generic data loading errors
    //
    'failed-to-load-content': 'Failed to load content',
    'failed-to-stream-content': 'Failed to stream content',
    'failed-to-stream-server-component': 'Failed to stream server component',

    //
    // Content rendering errors
    //
    'failed-to-render-content': 'Failed to display content',
};

export type NLErrorId = keyof typeof NLErrors;
