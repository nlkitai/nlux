import {ChatItemComp} from '@nlux-dev/react/src/components/ChatItem/ChatItemComp';
import {forwardRef, ReactElement, useMemo, useState} from 'react';
import {MessageDirection, MessageStatus} from '@shared/components/Message/props';
import '@nlux-dev/themes/src/luna/main.css';

export const ChatItemReactExpo = () => {
    const [direction, setDirection] = useState<MessageDirection>('received');
    const [status, setStatus] = useState<MessageStatus>('complete');
    const [message, setMessage] = useState<string>('Hello, World!');

    const [name, setName] = useState<string>('John Doe');
    const [avatar, setAvatar] = useState<string | ReactElement>('https://i.pravatar.cc/150');

    const ForwardRefChatItemComp = useMemo(() => forwardRef(
        ChatItemComp,
    ), []);

    return (
        <div style={{border: '2px solid #B0B0B0', padding: 20, margin: 20, borderRadius: 10}}>
            <div className="expo-container" style={{borderBottom: '1px dashed #B0B0B0', marginBottom: 20}}>
                <h3>ChatItemComp Comp</h3>
            </div>
            <div className="ChatItem nlux_root">
                <div className="controls">
                    <select
                        value={direction}
                        onChange={(event) => setDirection(event.target.value as MessageDirection)}
                    >
                        <option value="received">Received</option>
                        <option value="sent">Sent</option>
                    </select>
                    <select
                        value={status}
                        onChange={(event) => setStatus(event.target.value as MessageStatus)}
                    >
                        <option value="complete">Complete</option>
                        <option value="streaming">Streaming</option>
                    </select>
                    <input
                        type="text"
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        placeholder="Message"
                    />
                    <input
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Name"
                    />
                    <input
                        type="text"
                        value={typeof avatar === 'string' ? avatar : ''}
                        onChange={(event) => setAvatar(event.target.value)}
                        placeholder="Avatar"
                    />
                </div>
                <div className="content">
                    <ForwardRefChatItemComp
                        uid={'1'}
                        dataTransferMode={'batch'}
                        direction={direction}
                        layout={'bubbles'}
                        status={status}
                        fetchedContent={message}
                        avatar={avatar}
                        name={name}
                    />
                </div>
            </div>
        </div>
    );
};
