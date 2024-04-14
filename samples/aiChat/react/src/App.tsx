import {useChatAdapter} from '@nlux-dev/nlbridge-react/src';
import {createUnsafeChatAdapter} from '@nlux-dev/openai/src';
import {AiChat} from '@nlux-dev/react/src';
import '@nlux-dev/themes/src/luna/theme.css';
import './App.css';

function App() {
    const nlBridge = useChatAdapter({
        url: 'http://localhost:8899/',
    });

    const openAiAdapter = createUnsafeChatAdapter()
        .withApiKey('sk_1234567890')
        .withDataTransferMode('fetch');

    return (
        <AiChat
            // adapter={nlBridge}
            adapter={openAiAdapter}
            promptBoxOptions={{
                placeholder: 'Type your prompt here',
                autoFocus: true,
                // submitShortcut: 'CommandEnter',
            }}
            layoutOptions={{
                width: 400,
            }}
        />
    );
}

export default App;
