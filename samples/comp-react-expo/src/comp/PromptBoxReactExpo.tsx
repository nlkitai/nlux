import {PromptBoxStatus} from '@nlux-dev/core/src/ui/PromptBox/props.ts';
import {PromptBoxComp} from '@nlux-dev/react/src/ui/PromptBox/PromptBoxComp.tsx';
import '@nlux-dev/themes/src/naked/components/PromptBox.css';
import '@nlux-dev/themes/src/naked/components/animation.css';
import {useState} from 'react';

export const PromptBoxReactExpo = () => {
    const [status, setStatus] = useState<PromptBoxStatus>('typing');
    const [initialMessage] = useState<string>('Hello, World!');
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
                        onChange={(e) => setStatus(e.target.value as PromptBoxStatus)}
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
                    <PromptBoxComp
                        prompt={initialMessage}
                        status={status}
                        placeholder={placeholder}
                    />
                </div>
            </div>
        </div>
    );
};
