import {llama2InputPreProcessor, llama2OutputPreProcessor, useAdapter} from '@nlux/hf-react';
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

    // const adapter = useMemo(() => {
    //     return createAdapter()
    //         .withDataTransferMode('fetch')
    //         .withEndpoint('https://<LLAMA2 MODEL ENDPOINT>.endpoints.huggingface.cloud')
    //         .withSystemMessage('Your are a funny assistant. You only response in short sharp daring humour')
    //         .withInputPreProcessor(llama2InputPreProcessor)
    //         .withMaxNewTokens(100);
    // }, []);

    const adapter = useAdapter({
        dataTransferMode: 'stream',
        model: 'https://n2srbwelqq8uhu7z.us-east-1.aws.endpoints.huggingface.cloud',
        systemMessage: 'Your are a funny assistant. You only respond in short sharp daring humour',
        preProcessors: {
            input: llama2InputPreProcessor,
            output: llama2OutputPreProcessor,
        },
        maxNewTokens: 1200,
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
                <AiChat
                    key={key}
                    className="ai-chat-emulator"
                    adapter={adapter}
                    conversationOptions={{
                        scrollWhenGenerating: true,
                    }}
                    layoutOptions={{
                        maxHeight,
                    }}
                    // Optional: Instruct ChatGPT how to behave during the conversation.
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
