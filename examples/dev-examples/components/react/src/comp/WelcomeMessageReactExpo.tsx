import {WelcomeMessageComp} from '@nlux-dev/react/src/components/WelcomeMessage/WelcomeMessageComp';
import '@nlux-dev/themes/src/luna/main.css';
import {ReactElement, useState} from 'react';

export const WelcomeMessageReactExpo = () => {
    const [message, setMessage] = useState<string>('Hello, World!');
    const [name, setName] = useState<string>('John Doe');
    const [avatar, setAvatar] = useState<string | ReactElement>('https://i.pravatar.cc/150');

    return (
        <div style={{border: '2px solid #B0B0B0', padding: 20, margin: 20, borderRadius: 10}}>
            <div className="expo-container" style={{borderBottom: '1px dashed #B0B0B0', marginBottom: 20}}>
                <h3>WelcomeMessage Comp</h3>
            </div>
            <div className="WelcomeMessage nlux_root">
                <div className="controls">
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
                    <WelcomeMessageComp
                        name={name}
                        avatar={avatar}
                        message={message}
                    />
                </div>
            </div>
        </div>
    );
};
