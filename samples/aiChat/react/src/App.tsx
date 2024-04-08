import {useChatAdapter} from '@nlux/nlbridge-react';
import {AiChat} from '@nlux/react';
import '@nlux/themes/luna.css';
import './App.css';

function App() {
    const nlBridge = useChatAdapter({
        url: 'http://localhost:8899/',
    });

    return (
        <>
            <h1>AiChat React + TS</h1>
            <AiChat adapter={nlBridge}/>
        </>
    );
}

export default App;
