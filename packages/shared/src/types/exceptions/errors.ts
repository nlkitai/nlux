export const NLErrors = {
    'connection-error': 'Connection error',
    'invalid-credentials': 'Invalid credentials',
    'invalid-api-key': 'Invalid API key',
    'http-server-side-error': 'HTTP server side error',
    'http-client-side-error': 'HTTP client side error',

    'failed-to-load-content': 'Failed to load content',
    'data-transfer-mode-not-supported': 'Requested data transfer mode is not supported',
    'no-data-transfer-mode-supported': 'Adapter does not support any valid data transfer modes',
};

export type NLErrorId = keyof typeof NLErrors;
