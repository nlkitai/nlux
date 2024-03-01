import {useChatAdapter} from '@nlux/langchain-react';
import {AiChat} from '@nlux/react';
import React, {useCallback, useState} from 'react';
import {createRoot} from 'react-dom/client';

const ExampleWrapper = () => {
    const [maxHeight, setMaxHeight] = useState<number>(550);
    const [key, setKey] = useState<number>(0);
    const [streamingAnimationSpeed, setStreamingAnimationSpeed] = useState<number | null | undefined>();

    const handleRandomContainerHeight = useCallback(() => {
        const newHeight = Math.floor(Math.random() * 1000);
        setMaxHeight(newHeight);
    }, []);

    const langServeAdapter = useChatAdapter({
        url: 'https://pynlux.api.nlux.ai/einbot',
        dataTransferMode: 'fetch',
    });

    const handleStreamingAnimationSpeedChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.toLowerCase() === 'null') {
            setStreamingAnimationSpeed(null);
            return;
        }

        if (value === '') {
            setStreamingAnimationSpeed(undefined);
            return;
        }

        try {
            const speed = value ? parseInt(value, 10) : null;
            if (Number.isNaN(speed) || (typeof speed === 'number' && speed < 0)) {
                setStreamingAnimationSpeed(undefined);
            }

            setStreamingAnimationSpeed(speed);
        } catch (e) {
            // ignore
        }
    }, [setStreamingAnimationSpeed]);

    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <span>{key}</span>
            <button onClick={() => setKey(key + 1)}>Reset</button>
            <button onClick={handleRandomContainerHeight}>Random Container Height</button>
            <span>
                Streaming Animation Speed: <input onInput={handleStreamingAnimationSpeedChange}/>
            </span>
            <div style={{height: '550px', width: '600px'}}>
                <AiChat
                    key={key}
                    className="ai-chat-emulator"
                    adapter={langServeAdapter}
                    personaOptions={{
                        bot: {
                            name: 'FinFunBot',
                            tagline: 'Your AI financial advisor',
                            picture: 'https://nlux.ai/images/demos/persona-finbot.png',
                        },
                        user: {
                            name: 'Melanie',
                            picture: 'https://nlux.ai/images/demos/persona-woman.jpeg',
                        },
                    }}
                    initialConversation={[
                        {
                            role: 'user',
                            message: 'Hello',
                        },
                        {
                            role: 'ai',
                            message: 'Hi There!',
                        },
                    ]}
                    conversationOptions={{
                        scrollWhenGenerating: true,
                        streamingAnimationSpeed,
                        // streamingAnimationSpeed: null,
                        // streamingAnimationSpeed: 300,
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
