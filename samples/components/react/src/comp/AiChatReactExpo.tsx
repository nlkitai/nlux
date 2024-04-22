import {PersonaOptions} from '@nlux-dev/react/src';
import {AiChat} from '@nlux-dev/react/src/exports/AiChat.tsx';
import {AiChatComponentProps} from '@nlux-dev/react/src/exports/props.tsx';
import {ChatItem} from '@nlux/core';
import '@nlux-dev/themes/src/luna/components/AiChat.css';
import {useChatAdapter} from '@nlux/langchain-react';
import {useMemo, useState} from 'react';

type MessageObjectType = {txt: string, color: string, bg: string};

const possibleColors = ['red', 'green', 'blue', 'yellow', 'purple'];
const possibleBackgrounds = ['white', 'black', 'gray', 'lightgray', 'darkgray'];

const CustomMessageComponent = ({message}: {message: MessageObjectType}) => {
    const color = useMemo(() => possibleColors[Math.floor(Math.random() * possibleColors.length)], []);
    const bg = useMemo(() => possibleBackgrounds[Math.floor(Math.random() * possibleBackgrounds.length)], []);

    if (typeof message === 'object' && message?.txt !== undefined) {
        return (
            <div style={{color: message.color, backgroundColor: message.bg}}>
                {message.txt}
            </div>
        );
    }

    return (
        <div style={{
            color,
            backgroundColor: bg,
        }}>
            {`${message}`}
        </div>
    );
};

export const AiChatReactExpo = () => {
    const [rendererType, setRendererType] = useState<
        'default' | 'custom'
    >('default');

    const [dataTransferMode, setDataTransferMode] = useState<
        'stream' | 'fetch'
    >('fetch');

    const langServeAdapter = useChatAdapter({
        url: 'https://pynlux.api.nlux.ai/pirate-speak',
        dataTransferMode,
    });

    const initialConversationCustomMessages: ChatItem<MessageObjectType>[] = [
        {
            role: 'user',
            message: 'Hi, there!',
        },
        {
            role: 'ai',
            message: {
                txt: 'Hello, World!',
                color: 'green',
                bg: 'white',
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
                color: 'green',
                bg: 'white',
            },
            role: 'ai',
        },
    ];

    const personaOptions: PersonaOptions = {
        bot: {
            name: 'Bot',
            picture: 'https://i.pravatar.cc/300',
        },
        user: {
            name: 'User',
            picture: 'https://i.pravatar.cc/400',
        },
    };

    const customProps: AiChatComponentProps<MessageObjectType> = {
        adapter: langServeAdapter,
        personaOptions,
        initialConversation: initialConversationCustomMessages,
        aiMessageComponent: CustomMessageComponent,
    };

    const defaultProps: AiChatComponentProps<MessageObjectType> = {
        adapter: langServeAdapter,
        personaOptions,
        initialConversation,
        aiMessageComponent: CustomMessageComponent,
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
                        onChange={(e) => setDataTransferMode(e.target.value as 'stream' | 'fetch')}
                    >
                        <option value="stream">Stream Data</option>
                        <option value="fetch">Fetch Data</option>
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
