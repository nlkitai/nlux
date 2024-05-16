import {useChatAdapter} from '@nlux/nlbridge-react';
import {AiChat} from '@nlux/react';
import {StrictMode, useCallback, useState} from 'react';
import {createRoot} from 'react-dom/client';

const ExampleWrapper = () => {
    const [height, setHeight] = useState<number>(550);
    const [key, setKey] = useState<number>(0);

    const handleRandomContainerHeight = useCallback(() => {
        const newHeight = Math.floor(Math.random() * 1000);
        setHeight(newHeight);
    }, []);

    const nlBridge = useChatAdapter({
        url: 'http://localhost:8899/',
    });

    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <span>{key}</span>
            <button onClick={() => setKey(key + 1)}>Reset</button>
            <button onClick={handleRandomContainerHeight}>Random Container Height</button>
            <div style={{height: '550px', width: '600px'}}>
                <AiChat
                    key={key}
                    adapter={nlBridge}
                    conversationOptions={{
                        autoScroll: true,
                    }}
                    displayOptions={{
                        height,
                        className: 'ai-chat-emulator',
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
        <StrictMode>
            <ExampleWrapper/>
        </StrictMode>,
    );
};
