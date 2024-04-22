import {MessageDirection, MessageStatus} from '@nlux-dev/core/src/comp/Message/props.ts';
import {ConversationItemComp} from '@nlux-dev/react/src/comp/ConversationItem/ConversationItemComp.tsx';
import '@nlux-dev/themes/src/naked/components/ConversationItem.css';
import '@nlux-dev/themes/src/naked/components/animation.css';
import {ReactElement, useState} from 'react';

export const ConversationItemExpo = () => {
    const [direction, setDirection] = useState<MessageDirection>('incoming');
    const [status, setStatus] = useState<MessageStatus>('rendered');
    const [message, setMessage] = useState<string>('Hello, World!');
    const [loader, setLoader] = useState<ReactElement | undefined>();

    const [name, setName] = useState<string>('John Doe');
    const [picture, setPicture] = useState<string | ReactElement>('https://i.pravatar.cc/150');

    return (
        <div style={{border: '2px solid #B0B0B0', padding: 20, margin: 20, borderRadius: 10}}>
            <div className="expo-container" style={{borderBottom: '1px dashed #B0B0B0', marginBottom: 20}}>
                <h3>ConversationItemComp Comp</h3>
            </div>
            <div className="ConversationItem nlux_root">
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
                    <input
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Name"
                    />
                    <input
                        type="text"
                        value={typeof picture === 'string' ? picture : ''}
                        onChange={(event) => setPicture(event.target.value)}
                        placeholder="Picture"
                    />
                </div>
                <div className="content">
                    <ConversationItemComp
                        direction={direction}
                        status={status}
                        message={message}
                        loader={loader}
                        picture={picture}
                        name={name}
                    />
                </div>
            </div>
        </div>
    );
};
