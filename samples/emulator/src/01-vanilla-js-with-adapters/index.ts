import {AiChat, createAiChat} from '@nlux/core';
import {highlighter} from '@nlux/highlighter';
import {createAdapter as createLangServeAdapter} from '@nlux/langchain';
import {createAdapter as createOpenAiAdapter} from '@nlux/openai';
import {nlBridgeCustomPromiseAdapter} from './nlBridgeCustomAdapter';
import {personaOptions} from './personaOptions';

debugger;
const apiKey = localStorage.getItem('apiKey') || 'YOUR_API_KEY_HERE';

let aiChat: AiChat | null = null;
let rootElement: HTMLElement | null = null;

(window as any).demo = {
    mount: () => rootElement && aiChat?.mount(rootElement),
    unmount: () => aiChat?.unmount(),
    show: () => aiChat?.show(),
    hide: () => aiChat?.hide(),
};

document.addEventListener('DOMContentLoaded', () => {
    rootElement = document.getElementById('nluxc-root');
    if (!rootElement) {
        throw new Error('Root element not found');
    }

    const openAiAdapter = createOpenAiAdapter()
        .withApiKey(apiKey)
        // .withModel('gpt-4')
        .withDataTransferMode('stream')
        .withSystemMessage(
            'Give sound, tailored financial advice. Explain concepts simply. When unsure, ask questions. ' +
            'Only recommend legal, ethical practices. Be friendly. Write concise answers under 5 sentences.',
        );

    const langServeAdapter = createLangServeAdapter()
        .withUrl('http://127.0.0.1:8000/einbot')
        // .withUrl('http://127.0.0.1:8000/einbot/invoke')
        // .withUrl('http://127.0.0.1:8000/einbot/stream')
        // .withInputSchema(false)
        // .withInputPreProcessor((message: string) => ({
        //     message,
        //     year: 1999,
        // }))
        // .withOutputPreProcessor((output: any) => {
        //     if (typeof output === 'string') {
        //         return output;
        //     }
        //
        //     if (typeof output?.content === 'string') {
        //         return output.content;
        //     }
        //
        //     return 'Sorry, I did not understand that.';
        // })
        // .withDataTransferMode('fetch')
        .withDataTransferMode('stream');

    aiChat = createAiChat()
        // .withAdapter(langServeAdapter)
        // .withAdapter(openAiAdapter)
        // .withAdapter(myCustomStreamingAdapter)
        // .withAdapter(myCustomPromiseAdapter)
        .withAdapter(nlBridgeCustomPromiseAdapter)
        .withSyntaxHighlighter(highlighter)
        .withConversationOptions({
            historyPayloadSize: 3,
        })
        .withLayoutOptions({
            maxWidth: 500,
            maxHeight: 500,
        })
        .withPromptBoxOptions({
            placeholder: 'How can I help you today?',
            autoFocus: true,
        })
        .withPersonaOptions(personaOptions);

    aiChat.mount(rootElement);
});
