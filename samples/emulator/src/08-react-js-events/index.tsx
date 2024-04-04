import {highlighter} from '@nlux/highlighter';
import {useUnsafeChatAdapter} from '@nlux/openai-react';
import {AiChat, ErrorCallback, ErrorEventDetails, MessageSentCallback} from '@nlux/react';
import React, {useCallback, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {streamAdapter} from './stream';

debugger;
const apiKey = localStorage.getItem('apiKey') || 'YOUR_API_KEY_HERE';

const ExampleWrapper = () => {
    const adapter = useUnsafeChatAdapter({
        apiKey,
        model: 'gpt-3.5-turbo',
        // dataTransferMode: 'stream',
        dataTransferMode: 'stream',
        // systemMessage: 'You are a funny financial advisor called FinFunBot. Give sound, tailored financial advice. '
        //     + 'Explain concepts simply. Be funny and engaging. Tell some jokes. Do not be rude or offensive.'
        //     + 'Only recommend legal, ethical practices. Write concise answers under 5 sentences.',
        systemMessage: 'You are a chatbot called HarryBotter. When users chat with you, respond from the perspective'
            + 'of Harry Potter, as if you are him. Apply Harry\'s personality - brave, witty and wise. Access the '
            + 'knowledge of Harry Potter lore, locations, spells, events from the books and movies to answer questions '
            + 'and have engaging conversations related to the Wizarding World. Address the user by their name if '
            + 'known or neutrally. Be helpful, friendly and inject appropriate British vocabulary and magic '
            + 'terminology in natural ways. Enjoy bringing the magic of Harry Potter to users! Write short answers',
    });

    const [enableErrorCallback, setEnableErrorCallback] = useState(false);
    const [enableMessageSentCallback, setEnableMessageSentCallback] = useState(false);
    const [enableMessageReceivedCallback, setEnableMessageReceivedCallback] = useState(false);

    const errorEventCallback = useCallback<ErrorCallback>(({errorId, message}: ErrorEventDetails) => {
        console.error('Error ❌ event callback with error ID:', errorId);
        console.error('Details:', message);
    }, []);

    const messageSentCallback = useCallback<MessageSentCallback>((message: string) => {
        console.log('Message 👋 sent callback with message:', message);
    }, []);

    const messageReceivedCallback = useCallback<MessageSentCallback>((message: string) => {
        console.log('Message 📮 received callback with message:', message);
    }, []);

    if (!adapter) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div style={{marginTop: '50px'}}>
                <label>
                    <input
                        type="checkbox"
                        checked={enableErrorCallback}
                        onChange={(e) => setEnableErrorCallback(e.target.checked)}
                    />
                    Enable error callback
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={enableMessageSentCallback}
                        onChange={(e) => setEnableMessageSentCallback(e.target.checked)}
                    />
                    Enable message sent callback
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={enableMessageReceivedCallback}
                        onChange={(e) => setEnableMessageReceivedCallback(e.target.checked)}
                    />
                    Enable message received callback
                </label>
                <hr/>
                <AiChat
                    className="ai-chat-emulator"
                    adapter={streamAdapter}
                    // adapter={adapter}
                    events={{
                        error: enableErrorCallback ? errorEventCallback : undefined,
                        messageSent: enableMessageSentCallback ? messageSentCallback : undefined,
                        messageReceived: enableMessageReceivedCallback ? messageReceivedCallback : undefined,
                    }}
                    conversationOptions={{
                        scrollWhenGenerating: true,
                    }}
                    layoutOptions={{
                        height: 380,
                        width: 450,
                    }}
                    // Optional: Instruct ChatGPT how to behave during the conversation.
                    promptBoxOptions={{
                        // placeholder: 'FinFunBot here! How can I help you today?',
                        autoFocus: true,
                    }}
                    syntaxHighlighter={highlighter}
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
