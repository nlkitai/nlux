import {useAdapter} from '@nlux/langchain-react';
import {AiChat} from '@nlux/react';
import React, {useCallback, useState} from 'react';
import {createRoot} from 'react-dom/client';

const ExampleWrapper = () => {
    const [maxHeight, setMaxHeight] = useState<number>(550);
    const [key, setKey] = useState<number>(0);

    const handleRandomContainerHeight = useCallback(() => {
        const newHeight = Math.floor(Math.random() * 1000);
        setMaxHeight(newHeight);
    }, []);

    const langServeAdapter = useAdapter({
        url: 'http://127.0.0.1:8000/einbot',
        dataTransferMode: 'fetch',
    });

    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <span>{key}</span>
            <button onClick={() => setKey(key + 1)}>Reset</button>
            <button onClick={handleRandomContainerHeight}>Random Container Height</button>
            <div style={{height: '550px', width: '600px'}}>
                <AiChat
                    key={key}
                    className="ai-chat-emulator"
                    adapter={langServeAdapter}
                    conversationOptions={{
                        scrollWhenGenerating: true,
                    }}
                    layoutOptions={{
                        maxHeight,
                    }}
                    promptBoxOptions={{
                        placeholder: 'How can I help you today?',
                        autoFocus: true,
                    }}
                />
            </div>
        </div>
    );
};

export default () => {
    const root = document.getElementById('nlux-ai-chat-root');
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
