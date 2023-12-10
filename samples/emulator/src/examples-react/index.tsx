import {highlighter} from '@nlux/highlighter';
import {NluxConvo} from '@nlux/nlux-react';
import {useAdapter} from '@nlux/openai-react';
import React, {useCallback, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {streamAdapter} from './stream';

debugger;
const apiKey = localStorage.getItem('apiKey') || 'YOUR_API_KEY_HERE';

const ExampleWrapper = () => {
    const [height, setHeight] = useState<number>(550);
    const [key, setKey] = useState<number>(0);
    const handleRandomContainerHeight = useCallback(() => {
        const newHeight = Math.floor(Math.random() * 1000);
        setHeight(newHeight);
    }, []);

    const adapter = useAdapter({
        apiKey,
        model: 'gpt-3.5-turbo',
        // dataTransferMode: 'stream',
        dataTransferMode: 'fetch',
        systemMessage: 'Act as a Nobel Prize in Physics winner who is helping a PHD student in their research',
    });

    if (!adapter) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <span>{key}</span>
            <button onClick={() => setKey(key + 1)}>Reset</button>
            <button onClick={handleRandomContainerHeight}>Random Container Height</button>
            <div style={{height: '550px', width: '600px'}}>
                <NluxConvo
                    key={key}
                    className="chat-emulator-convo"
                    adapter={streamAdapter}
                    conversationOptions={{
                        scrollWhenGenerating: true,
                    }}
                    layoutOptions={{
                        height,
                        width: 440,
                    }}
                    // Optional: Instruct ChatGPT how to behave during the conversation.
                    promptBoxOptions={{
                        placeholder: 'How can I help you today?',
                        autoFocus: true,
                    }}
                    syntaxHighlighter={highlighter}
                />
            </div>
        </div>
    );
};

export default () => {
    const root = document.getElementById('nlux-convo-root');
    if (!root) {
        throw new Error('Root element not found');
    }

    const reactRoot = createRoot(root);
    reactRoot.render(
        <React.StrictMode>
            <ExampleWrapper/>
        </React.StrictMode>,
    );
};
