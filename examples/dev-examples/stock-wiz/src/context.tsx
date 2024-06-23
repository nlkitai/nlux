import {createContextAdapter} from '@nlux-dev/nlbridge-react/src';
import {createAiContext} from '@nlux-dev/react/src';

const contextAdapter = createContextAdapter()
    .withUrl('http://localhost:8899');

export const MyAiContext = createAiContext(contextAdapter);
