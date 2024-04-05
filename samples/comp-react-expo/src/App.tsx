import './App.css';
import {AiChatReactExpo} from './comp/AiChatReactExpo.tsx';
import {AvatarReactExpo} from './comp/AvatarReactExpo.tsx';
import {ChatItemReactExpo} from './comp/ChatItemReactExpo.tsx';
import {LoaderReactExpo} from './comp/LoaderReactExpo.tsx';
import {MessageReactExpo} from './comp/MessageReactExpo.tsx';
import {PromptBoxReactExpo} from './comp/PromptBoxReactExpo.tsx';
import {WelcomeMessageReactExpo} from './comp/WelcomeMessageReactExpo.tsx';

function App() {

    return (
        <>
            <h1>Comp React Expo</h1>
            <LoaderReactExpo/>
            <MessageReactExpo/>
            <AvatarReactExpo/>
            <ChatItemReactExpo/>
            <PromptBoxReactExpo/>
            <WelcomeMessageReactExpo/>
            <AiChatReactExpo/>
        </>
    );
}

export default App;
