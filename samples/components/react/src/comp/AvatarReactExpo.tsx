import {AvatarComp} from '@nlux-dev/react/src/ui/Avatar/AvatarComp';
import {ReactElement, useEffect, useState} from 'react';
import '@nlux-dev/themes/src/luna/main.css';

export const AvatarReactExpo = () => {
    const [name, setName] = useState('Alex');
    const [url, setUrl] = useState('https://nlux.ai/images/demos/persona-user.jpeg');
    const [type, setType] = useState<'url' | 'img'>('url');
    const [avatar, setAvatar] = useState<string | ReactElement>('');

    useEffect(() => {
        if (type === 'url') {
            setAvatar(url);
        } else {
            setAvatar(<img src={url} alt={name}/>);
        }
    }, [name, url, type]);

    return (
        <div style={{border: '2px solid #B0B0B0', padding: 20, margin: 20, borderRadius: 10}}>
            <div className="expo-container" style={{borderBottom: '1px dashed #B0B0B0', marginBottom: 20}}>
                <h3>Avatar Comp</h3>
            </div>
            <div className="Avatar-expo nlux_root">
                <div className="controls">
                    <input
                        type="text"
                        className="name"
                        value={name}
                        onChange={(name) => setName(name.target.value)}
                    />
                    <input
                        type="text"
                        className="url"
                        value={url}
                        onChange={(url) => setUrl(url.target.value)}
                    />
                    <select
                        value={type}
                        onChange={(type) => setType(type.target.value as 'url' | 'img')}
                    >
                        <option value="url">Insert as URL</option>
                        <option value="img">Insert as IMG Tag</option>
                    </select>
                </div>
                <div className="content">
                    <AvatarComp name={name} avatar={avatar}/>
                </div>
            </div>
        </div>
    );
};
