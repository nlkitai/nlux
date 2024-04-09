import {useChatAdapter} from '@nlux-dev/nlbridge-react/src';
import {AiChat} from '@nlux-dev/react/src';
import '@nlux-dev/themes/src/luna/theme.css';
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
