import '@nlux-dev/themes/src/luna/theme.css';
import '@nlux-dev/highlighter/src/themes/stackoverflow/dark.css';
import {highlighter} from '@nlux-dev/highlighter/src';
import {useChatAdapter} from '@nlux-dev/nlbridge-react/src';
import {createUnsafeChatAdapter} from '@nlux-dev/openai/src';
import {AiChat, ChatItem} from '@nlux-dev/react/src';
import './App.css';

function App() {
    const nlBridge = useChatAdapter({
        url: 'http://localhost:8899/',
    });

    const openAiAdapter = createUnsafeChatAdapter()
        .withApiKey(localStorage.getItem('openai-api-key') || 'N/A')
        .withDataTransferMode('stream');

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
        {
            role: 'ai',
            message: longMessage,
        },
        {role: 'user', message: 'I need help with my account.'},
        {
            role: 'ai',
            message: 'Sure, I can help you with that.\n\nLet\'s start with some python code:\n\n' + messageWithCode,
        },
    ];

    return (
        <AiChat
            // adapter={nlBridge}
            adapter={openAiAdapter}
            // initialConversation={initialConversation}
            promptBoxOptions={{
                placeholder: 'Type your prompt here',
                autoFocus: true,
                // submitShortcut: 'CommandEnter',
            }}
            layoutOptions={{
                width: 400,
                height: 300,
            }}
            conversationOptions={{
                // autoScroll: false,
            }}
            messageOptions={{
                markdownLinkTarget: 'blank',
                syntaxHighlighter: highlighter,
                // showCodeBlockCopyButton: false,
                // streamingAnimationSpeed: 100,
            }}
            personaOptions={{
                user: {
                    name: 'Mr User',
                    // picture: 'https://nlux.ai/images/demos/persona-user.jpeg',
                    picture: <div style={{backgroundColor: 'red', width: 50, height: 50}}>JsX</div>,
                },
                bot: {
                    name: 'Harry Botter',
                    picture: 'https://nlux.ai/images/demos/persona-harry-botter.jpg',
                    tagline: 'Your friendly AI assistant',
                },
            }}
        />
    );
}

export default App;
