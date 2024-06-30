import '@nlux-dev/themes/src/luna/main.css';
import {ComposerComp} from '@nlux-dev/react/src/sections/Composer/ComposerComp';
import {useState} from 'react';
import {ComposerStatus} from '@shared/components/Composer/props';

export const ComposerReactExpo = () => {
    const [status, setStatus] = useState<ComposerStatus>('typing');
    const [prompt] = useState<string>('Hello, World!');
    const [placeholder, setPlaceholder] = useState<string>('Type your prompt!');

    return (
        <div style={{border: '2px solid #B0B0B0', padding: 20, margin: 20, borderRadius: 10}}>
            <div className="expo-container" style={{borderBottom: '1px dashed #B0B0B0', marginBottom: 20}}>
                <h3>Message Comp</h3>
            </div>
            <div className="Message-expo nlux_root">
                <div className="controls">
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as ComposerStatus)}
                    >
                        <option value="typing">Typing</option>
                        <option value="submitting">Submitting</option>
                        <option value="waiting">Waiting</option>
                    </select>
                    <input
                        type="text"
                        value={placeholder}
                        onChange={(e) => setPlaceholder(e.target.value)}
                        placeholder="Placeholder"
                    />
                </div>
                <div className="content">
                    <ComposerComp
                        prompt={prompt}
                        status={status}
                        placeholder={placeholder}
                        onChange={(value) => console.log(value)}
                        onSubmit={() => console.log('Submit')}
                        onCancel={() => console.log('Cancel')}
                        Loader={<div>Loading...</div>}
                    />
                </div>
            </div>
        </div>
    );
};
