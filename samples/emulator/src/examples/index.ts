import {ConvoPit, createConvoPit} from '@nlux/nlux';
import {createAdapter} from '@nlux/openai';
import {debug} from '../x/debug';

const apiKey = 'YOUR_OPEN_AI_API_KEY';

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

    const adapter = createAdapter('openai/gpt4')
        .withApiKey(apiKey)
        .useStreamingMode()
        .withHistoryDepth(5)
        .withInitialSystemMessage('As as a teacher who is explaining complex concepts to an 8 years old student, '
            + 'I want to be able to explain the concept in a simple way so that the student can understand it easily. '
            + 'I want you to use stories and examples to explain the concept.');

    convoPit = createConvoPit()
        .withAdapter(adapter)
        .withPromptBoxOptions({
            placeholder: 'Type something...',
            autoFocus: true,
        })
        .withContainerMaxHeight(300);

    convoPit.mount(rootElement);

    debug(
        'Instance config:',
        JSON.stringify(convoPit.config, null, 2),
    );
});
