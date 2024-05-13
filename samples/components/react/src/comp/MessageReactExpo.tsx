import {MessageComp} from '@nlux-dev/react/src/ui/Message/MessageComp.tsx';
import '@nlux-dev/themes/src/luna/theme.css';
import {useState} from 'react';
import {MessageDirection, MessageStatus} from '../../../../../packages/shared/src/ui/Message/props';

export const MessageReactExpo = () => {
    const [direction, setDirection] = useState<MessageDirection>('incoming');
    const [status, setStatus] = useState<MessageStatus>('complete');
    const [message, setMessage] = useState<string>('Hello, World!');

    return (
        <div style={{border: '2px solid #B0B0B0', padding: 20, margin: 20, borderRadius: 10}}>
            <div className="expo-container" style={{borderBottom: '1px dashed #B0B0B0', marginBottom: 20}}>
                <h3>Message Comp</h3>
            </div>
            <div className="Message-expo nlux_root">
                <div className="controls">
                    <select
                        value={direction}
                        onChange={(event) => setDirection(event.target.value as MessageDirection)}
                    >
                        <option value="incoming">Incoming</option>
                        <option value="outgoing">Outgoing</option>
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
                </div>
                <div className="content">
                    <MessageComp
                        uid={'1'}
                        direction={direction}
                        status={status}
                        message={message}
                    />
                </div>
            </div>
        </div>
    );
};
