import {highlighter} from '@nlux-dev/highlighter/src';
import '@nlux-dev/themes/src/luna/theme.css';
import '@nlux-dev/highlighter/src/themes/stackoverflow/dark.css';
import {useChatAdapter} from '@nlux-dev/nlbridge-react/src';
import {createUnsafeChatAdapter} from '@nlux-dev/openai/src';
import {AiChat} from '@nlux-dev/react/src';
import './App.css';

function App() {
    const nlBridge = useChatAdapter({
        url: 'http://localhost:8899/',
    });

    const openAiAdapter = createUnsafeChatAdapter()
        .withApiKey('sk_1234567890')
        .withDataTransferMode('fetch');

    highlighter;

    return (
        <AiChat
            // adapter={nlBridge}
            adapter={openAiAdapter}
            syntaxHighlighter={highlighter}
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
                autoScroll: true,
            }}
        />
    );
}

export default App;
