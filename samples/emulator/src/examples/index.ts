import {ConvoPit, createConvoPit} from '@nlux/nlux';
import {createAdapter} from '@nlux/openai';
import {debug} from '../x/debug';

const apiKey = 'YOUR_API_KEY_HERE';

let convoPit: ConvoPit | null = null;
let rootElement: HTMLElement | null = null;

(window as any).demo = {
    mount: () => rootElement && convoPit?.mount(rootElement),
    unmount: () => convoPit?.unmount(),
    show: () => convoPit?.show(),
    hide: () => convoPit?.hide(),
};

document.addEventListener('DOMContentLoaded', () => {
    rootElement = document.getElementById('nluxc-root');
    if (!rootElement) {
        throw new Error('Root element not found');
    }

    const adapter = createAdapter('openai/gpt')
        .withApiKey(apiKey)
        // .withModel('gpt-4')
        // .useStreamingMode()
        .useFetchingMode()
        // .useStreamingMode()
        .withInitialSystemMessage(
            'Act as a Nobel Prize in Physics winner who is ' +
            'helping a PHD student in their research',
        );

    convoPit = createConvoPit()
        .withAdapter(adapter)
        .withPromptBoxOptions({
            placeholder: 'Ask me anything about nuclear physics!',
            autoFocus: true,
        })
        .withContainerMaxHeight(300);

    convoPit.mount(rootElement);

    debug(
        'Instance config:',
        JSON.stringify(convoPit.config, null, 2),
    );
});
