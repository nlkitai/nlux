import '@nlux-dev/themes/src/nova/main.css';
import '@nlux-dev/themes/src/unstyled/main.css';
import '@nlux-dev/themes/src/luna/main.css';
import {ChatItem, createAiChat, DisplayOptions} from '@nlux-dev/core/src';
import DOMPurify from 'dompurify';
// import {highlighter} from '@nlux-dev/highlighter/src';
// import '@nlux-dev/highlighter/src/themes/stackoverflow/dark.css';
import {createChatAdapter as createHuggingFaceChatAdapter} from '@nlux-dev/hf/src';
import {createChatAdapter as createLangChainChatAdapter} from '@nlux-dev/langchain/src';
import {createChatAdapter as createNlbridgeChatAdapter} from '@nlux-dev/nlbridge/src';
import {createUnsafeChatAdapter as createOpenAiChatAdapter} from '@nlux-dev/openai/src';
import './style.css';

document.addEventListener('DOMContentLoaded', () => {
    const parent = document.getElementById('root')!;

    type ThemeId = 'nova' | 'luna' | 'unstyled' | 'dev';
    let themeId: ThemeId = 'nova';
    let colorScheme: 'light' | 'dark' | 'auto' = 'dark';

    const htmlSanitizer = (html: string) => {
        const trustedTypes = globalThis?.trustedTypes as unknown as {
            createPolicy: (name: string, policy: Record<string, unknown>) => unknown;
        };

        if (typeof trustedTypes.createPolicy === 'function') {
            const policy = trustedTypes.createPolicy('htmlSanitizer', {
                createHTML: (input: string) => DOMPurify.sanitize(input),
            });

            return policy.createHTML(html);
        }
        return DOMPurify.sanitize(html);
    };

    const nlBridgeAdapter = createNlbridgeChatAdapter<string>()
        .withUrl('http://localhost:8899/');

    const langChainAdapter = createLangChainChatAdapter()
        .withUrl('https://pynlux.api.nlkit.com/einbot')
        .withDataTransferMode('stream')
        .withInputSchema(true);

    const huggingFaceAdapter = createHuggingFaceChatAdapter()
        .withModel('gpt4')
        .withDataTransferMode('batch')
        .withAuthToken('N/A');

    const openAiAdapter = createOpenAiChatAdapter()
        .withApiKey(localStorage.getItem('openai-api-key') || 'N/A')
        .withDataTransferMode('stream');

    const themeSelector = document.querySelector('#themeSelector') as HTMLSelectElement;
    themeSelector.addEventListener('change', () => {
        themeId = themeSelector.value as ThemeId;
        displayOptions.themeId = themeId;
        aiChat.updateProps({displayOptions});
    });

    const colorSchemeSelector = document.querySelector('#colorSchemeSelector') as HTMLSelectElement;
    colorSchemeSelector.addEventListener('change', () => {
        colorScheme = colorSchemeSelector.value as 'light' | 'dark';
        displayOptions.colorScheme = colorScheme;
        aiChat.updateProps({displayOptions});
        document.body.style.backgroundColor = colorScheme === 'dark' ? 'black' : 'white';
    });

    document.body.style.backgroundColor = colorScheme === 'dark' ? 'black' : 'white';

    const longMessage = 'Hello, [how can I help you](http://questions.com)? This is going to be a very long greeting '
        + 'It is so long that it will be split into multiple lines. It will also showcase that no '
        + 'typing animation will be shown for this message when it is loaded. This is a very long '
        + 'message. Trust me.\n' + 'In a message, long and true,\n' + 'Words kept flowing, never few.\n'
        + 'Stories told with heartfelt grace,\n' + 'In each line, a sacred space.\n\n'
        + 'Each word a bridge, connecting souls,\n'
        + 'Across distances, making us whole.\n'
        + 'Emotions poured, thoughts unfurled,\n'
        + 'In this message, a treasure world.\n\n'
        + 'Pages filled with hopes and dreams,\n'
        + 'In this message, it truly seems,\n'
        + 'That connection can transcend the miles,\n'
        + 'In this message, love it files.\n'
        + 'So let us embrace this lengthy tale,\n'
        + 'For in its depth, we will prevail.\n'
        + 'For in a message, long and grand,\n'
        + 'We find connection, hand in hand.';

    const messageWithCode = '```python\n'
        + 'def hello_world():\n'
        + '    print("Hello, World!")\n'
        + '```\n'
        + 'This is a code block.';

    const initialConversation: ChatItem<string>[] = [
        {role: 'assistant', message: longMessage},
        {role: 'user', message: 'I need help with my account.'},
        {
            role: 'assistant',
            message: 'Sure, I can help you with that.\n\nLet\'s start with some python code:\n\n' + messageWithCode,
        },
    ];

    const displayOptions: DisplayOptions = {
        width: 600,
        height: 400,
        themeId,
        colorScheme,
    };

    const domElement = document.createElement('div');
    domElement.style.width = '24px';
    domElement.style.height = '24px';
    domElement.style.backgroundColor = 'red';


    const aiChat = createAiChat<string>()
        // .withAdapter(nlBridgeAdapter)
        // .withAdapter(openAiAdapter)
        .withAdapter(langChainAdapter)
        // .withInitialConversation(initialConversation)
        .withComposerOptions({
            placeholder: 'Type your prompt here',
            autoFocus: true,
            // submitShortcut: 'CommandEnter',
        })
        .withConversationOptions({
            // autoScroll: false,
            // showWelcomeMessage: false,
            conversationStarters: [
                {
                  icon: 'https://content.nlkit.com/logos/nlkit.png',
                  prompt: "Write Hello World in Python, C++, and Java.",
                },
                {
                  prompt: "What can I help you with today? Imagine I am a chatbot.",
                  label: "Reverse Roles",
                },
                {
                  icon: domElement,
                  prompt: "How can I assist you today?",
                },
            ],
        })
        .withDisplayOptions(displayOptions)
        .withMessageOptions({
            markdownLinkTarget: 'blank',
            htmlSanitizer: htmlSanitizer,
            // htmlSanitizer: (html: string) => html.replace('h', 'x'),
            // syntaxHighlighter: highlighter,
            // showCodeBlockCopyButton: false,
        })
        .withPersonaOptions({
            user: {
                name: 'Alex',
                avatar: 'https://docs.nlkit.com/nlux/images/personas/alex.png',
            },
            assistant: {
                name: 'AI Assistant',
                avatar: 'https://docs.nlkit.com/nlux/images/personas/harry-botter.png',
                tagline: 'Welcome to the chat',
            },
        });

    aiChat.mount(parent);
    (window as any).aiChat = aiChat;

    aiChat.updateProps({
        // syntaxHighlighter: highlighter,
    });
});
