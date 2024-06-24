import {
    AiChat,
    AiChatProps,
    DataTransferMode,
    PersonaOptions,
    ResponseRenderer,
    ResponseRendererProps,
} from '@nlux-dev/react/src';
import {ChatItem} from '@nlux/core';
import {useChatAdapter} from '@nlux/langchain-react';
import {useMemo, useState} from 'react';
import '@nlux-dev/themes/src/luna/main.css';

type MessageObjectType = { txt: string, color: string, bg: string };

const possibleColors = ['red', 'green', 'blue', 'yellow', 'purple'];
const possibleBackgrounds = ['white', 'black', 'gray', 'lightgray', 'darkgray'];

const CustomMessageComponent: ResponseRenderer<MessageObjectType> = (props) => {
    const color = useMemo(() => possibleColors[Math.floor(Math.random() * possibleColors.length)], []);
    const bg = useMemo(() => possibleBackgrounds[Math.floor(Math.random() * possibleBackgrounds.length)], []);

    // This custom component does not support streaming mode
    if ((props as any).dataTransferMode === 'stream') {
        // This custom component does not support streaming mode
        return null;
    }

    const {content} = props as ResponseRendererProps<MessageObjectType>;
    const item = content.length > 1 ? content[0] : undefined;

    if (typeof content === 'object' && item?.txt !== undefined) {
        return (
            <div style={{color: item.color, backgroundColor: item.bg}}>
                {item.txt}
            </div>
        );
    }

    return (
        <div style={{
            color,
            backgroundColor: bg,
        }}>
            {`${content}`}
        </div>
    );
};

export const AiChatReactExpo = () => {
    const [rendererType, setRendererType] = useState<
        'default' | 'custom'
    >('default');

    const [dataTransferMode, setDataTransferMode] = useState<
        DataTransferMode
    >('batch');

    const langServeAdapter = useChatAdapter<MessageObjectType>({
        url: 'https://pynlux.api.nlkit.com/pirate-speak',
        dataTransferMode,
    });

    const initialConversationCustomMessages: ChatItem<MessageObjectType>[] = [
        {
            role: 'user',
            message: 'Hi, there!',
        },
        {
            role: 'assistant',
            message: {
                txt: 'Hello, World!',
                color: 'green',
                bg: 'red',
            },
        },
    ];

    const initialConversation: ChatItem<MessageObjectType>[] = [
        {
            message: 'Hi, there!',
            role: 'user',
        },
        {
            message: {
                txt: 'Hello, World!',
                color: 'blue',
                bg: 'yellow',
            },
            role: 'assistant',
        },
    ];

    const personaOptions: PersonaOptions = {
        assistant: {
            name: 'Assistant',
            avatar: 'https://i.pravatar.cc/300',
        },
        user: {
            name: 'User',
            avatar: 'https://i.pravatar.cc/400',
        },
    };

    const customProps: AiChatProps<MessageObjectType> = {
        adapter: langServeAdapter,
        personaOptions,
        initialConversation: initialConversationCustomMessages,
        messageOptions: {responseRenderer: CustomMessageComponent},
    };

    const defaultProps: AiChatProps<MessageObjectType> = {
        adapter: langServeAdapter,
        personaOptions,
        initialConversation,
        messageOptions: {responseRenderer: CustomMessageComponent},
    };

    return (
        <div style={{border: '2px solid #B0B0B0', padding: 20, margin: 20, borderRadius: 10}}>
            <div className="expo-container" style={{borderBottom: '1px dashed #B0B0B0', marginBottom: 20}}>
                <h3>AiChat Comp</h3>
            </div>
            <div className="Avatar-expo">
                <div className="controls">
                    <select
                        className="rendererType"
                        value={rendererType}
                        onChange={(e) => setRendererType(e.target.value as 'custom' | 'default')}
                    >
                        <option value="default">Default Renderer</option>
                        <option value="custom">Custom Renderer</option>
                    </select>
                    <select
                        className="dataTransferMode"
                        value={dataTransferMode}
                        onChange={(e) => setDataTransferMode(e.target.value as DataTransferMode)}
                    >
                        <option value="stream">Stream Data</option>
                        <option value="batch">Batch Data</option>
                    </select>
                </div>
                <div className="content">
                    {rendererType === 'default' ?
                        <AiChat key={'default'} {...defaultProps}/> :
                        <AiChat key={'custom'} {...customProps}/>
                    }
                </div>
            </div>
        </div>
    );
};
