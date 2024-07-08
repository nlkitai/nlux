import '@nlux-dev/themes/src/luna/main.css';
import {useState} from 'react';
import {MessageDirection, MessageStatus} from '@shared/components/Message/props';
import {className as compMessageClassName} from '../../../../../../packages/shared/src/components/Message/create';
import {
    directionClassName as compMessageDirectionClassName
} from '../../../../../../packages/shared/src/components/Message/utils/applyNewDirectionClassName';
import {
    statusClassName as compMessageStatusClassName
} from '../../../../../../packages/shared/src/components/Message/utils/applyNewStatusClassName';

export const MessageReactExpo = () => {
    const [direction, setDirection] = useState<MessageDirection>('received');
    const [status, setStatus] = useState<MessageStatus>('complete');
    const [message, setMessage] = useState<string>('Hello, World!');

    const compStatusClassName = status
        ? compMessageStatusClassName[status]
        : compMessageStatusClassName['rendered'];

    const compDirectionClassName = direction
        ? compMessageDirectionClassName[direction]
        : compMessageDirectionClassName['received'];

    const className = `${compMessageClassName} ${compStatusClassName} ${compDirectionClassName}`;

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
                </div>
                <div className="content">
                    <div className={className}>
                        {message}
                    </div>
                </div>
            </div>
        </div>
    );
};
