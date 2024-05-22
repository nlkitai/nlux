import {
    DataTransferMode,
    FetchResponseComponentProps,
    PersonaOptions,
    StreamResponseComponentProps,
} from '@nlux-dev/react/src';
import {AiChat} from '@nlux-dev/react/src/exports/AiChat';
import {AiChatProps} from '@nlux-dev/react/src/exports/props';
import {useChatAdapter} from '@nlux/langchain-react';
import {FC, useMemo, useState} from 'react';
import '@nlux-dev/themes/src/luna/main.css';

type MessageObjectType = {txt: string, color: string, bg: string};

const possibleColors = ['red', 'green', 'blue', 'yellow', 'purple'];
const possibleBackgrounds = ['white', 'black', 'gray', 'lightgray', 'darkgray'];

const CustomMessageComponent: FC<FetchResponseComponentProps<MessageObjectType>> = (
    {content}: {content: MessageObjectType}
) => {
    const color = useMemo(() => possibleColors[Math.floor(Math.random() * possibleColors.length)], []);
    const bg = useMemo(() => possibleBackgrounds[Math.floor(Math.random() * possibleBackgrounds.length)], []);

    if (typeof content === 'object' && content?.txt !== undefined) {
        return (
            <div style={{color: content.color, backgroundColor: content.bg}}>
                {content.txt}
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

export const AiChatWelcomeMessageReactExpo = () => {
    const [rendererType, setRendererType] = useState<
        'default' | 'custom'
    >('default');

    const [dataTransferMode, setDataTransferMode] = useState<
        DataTransferMode
    >('fetch');

    const langServeAdapter = useChatAdapter<MessageObjectType>({
        url: 'https://pynlux.api.nlux.ai/pirate-speak',
        dataTransferMode,
    });

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

    const defaultProps: AiChatProps<MessageObjectType> = {
        adapter: langServeAdapter,
        personaOptions,
        messageOptions: {
            responseRenderer: rendererType === 'custom' ? CustomMessageComponent : undefined,
        },
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
                        <option value="fetch">Fetch Data</option>
                    </select>
                </div>
                <div className="content">
                    <AiChat key={'default'} {...defaultProps}/>
                </div>
            </div>
        </div>
    );
};
