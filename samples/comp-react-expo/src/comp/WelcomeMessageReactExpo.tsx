import {WelcomeMessageComp} from '@nlux-dev/react/src/comp/WelcomeMessage/WelcomeMessageComp.tsx';
import '@nlux-dev/themes/src/naked/components/WelcomeMessage.css';
import '@nlux-dev/themes/src/naked/components/animation.css';
import {ReactElement, useState} from 'react';

export const WelcomeMessageReactExpo = () => {
    const [message, setMessage] = useState<string>('Hello, World!');
    const [name, setName] = useState<string>('John Doe');
    const [picture, setPicture] = useState<string | ReactElement>('https://i.pravatar.cc/150');

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
                        value={typeof picture === 'string' ? picture : ''}
                        onChange={(event) => setPicture(event.target.value)}
                        placeholder="Picture"
                    />
                </div>
                <div className="content">
                    <WelcomeMessageComp
                        picture={picture}
                        name={name}
                        message={message}
                    />
                </div>
            </div>
        </div>
    );
};
