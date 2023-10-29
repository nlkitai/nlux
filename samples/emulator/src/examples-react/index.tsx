import {ConvoPit} from '@nlux/nlux-react';
import {useAdapter} from '@nlux/openai-react';
import React, {useCallback, useState} from 'react';
import {createRoot} from 'react-dom/client';

const apiKey = 'YOUR_OPEN_AI_API_KEY';

const ExampleWrapper = () => {
    const [height, setHeight] = useState<number>(550);
    const [key, setKey] = useState<number>(0);
    const handleRandomContainerHeight = useCallback(() => {
        const newHeight = Math.floor(Math.random() * 1000);
        setHeight(newHeight);
    }, []);

    const adapter = useAdapter('openai/gpt4', {
        apiKey,
        dataExchangeMode: 'stream',
        initialSystemMessage: 'Act as a Nobel Prize winner teaching PHD students about the nuclear physics.',
    });

    if (!adapter) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <span>{key}</span>
            <button onClick={() => setKey(key + 1)}>Reset</button>
            <button onClick={handleRandomContainerHeight}>Random Container Height</button>
            <ConvoPit
                key={key}
                className="chat-emulator"
                adapter={adapter}
                containerMaxHeight={height}
                // Optional: Instruct ChatGPT how to behave during the conversation.
                promptBoxOptions={{
                    placeholder: 'Tell me ?',
                    autoFocus: true,
                }}
            />,
        </>
    );
};

export default () => {
    const root = document.getElementById('convopit-root');
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
