import {MessageDirection, MessageStatus} from '@nlux-dev/core/src/comp/Message/props.ts';
import {MessageComp} from '@nlux-dev/react/src/comp/Message/MessageComp.tsx';
import '@nlux-dev/themes/src/naked/components/Message.css';
import '@nlux-dev/themes/src/naked/components/animation.css';
import {ReactElement, useState} from 'react';

export const MessageReactExpo = () => {
    const [direction, setDirection] = useState<MessageDirection>('incoming');
    const [status, setStatus] = useState<MessageStatus>('rendered');
    const [message, setMessage] = useState<string>('Hello, World!');
    const [loader, setLoader] = useState<ReactElement | undefined>();

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
                        <option value="rendered">Rendered</option>
                        <option value="loading">Loading</option>
                        <option value="streaming">Streaming</option>
                        <option value="error">Error</option>
                    </select>
                    <input
                        type="text"
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        placeholder="Message"
                    />
                    <select
                        value={loader ? 'custom' : 'default'}
                        onChange={(event) => {
                            if (event.target.value === 'custom') {
                                setLoader(<div>Loading...</div>);
                            } else {
                                setLoader(undefined);
                            }
                        }}
                    >
                        <option value="default">Default Loader</option>
                        <option value="custom">Custom Loader</option>
                    </select>
                </div>
                <div className="content">
                    <MessageComp
                        id={'1'}
                        direction={direction}
                        status={status}
                        message={message}
                        loader={loader}
                    />
                </div>
            </div>
        </div>
    );
};
