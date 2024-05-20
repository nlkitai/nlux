import './App.css';
import {AiChatReactExpo} from './comp/AiChatReactExpo';
import {AiChatWelcomeMessageReactExpo} from './comp/AiChatWelcomeMessageReactExpo';
import {AvatarReactExpo} from './comp/AvatarReactExpo';
import {ChatItemReactExpo} from './comp/ChatItemReactExpo';
import {LoaderReactExpo} from './comp/LoaderReactExpo';
import {MessageReactExpo} from './comp/MessageReactExpo';
import {PromptBoxReactExpo} from './comp/PromptBoxReactExpo';
import {WelcomeMessageReactExpo} from './comp/WelcomeMessageReactExpo';

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
            <AiChatWelcomeMessageReactExpo/>
        </>
    );
}

export default App;
