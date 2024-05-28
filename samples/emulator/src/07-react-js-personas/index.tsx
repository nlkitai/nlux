import {highlighter} from '@nlux/highlighter';
import {useUnsafeChatAdapter} from '@nlux/openai-react';
import {AiChat, AssistantPersona, UserPersona} from '@nlux/react';
import {StrictMode, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {myCustomPromiseAdapter} from './customAdapter';

debugger;
const apiKey = localStorage.getItem('apiKey') || 'YOUR_API_KEY_HERE';

const assistantPersonas: (AssistantPersona | undefined)[] = [
    {
        name: 'FinFunAssistant',
        tagline: 'Your AI financial advisor',
        avatar: 'https://nlux.ai/images/demos/persona-finbot.png',
    },
    {
        name: 'HarryBotter',
        tagline: 'Your Magical AI assistant',
        avatar: 'https://docs.nlkit.com/nlux/images/docs/examples/harry-botter.png',
    },
    undefined,
];

const userPersonas: (UserPersona | undefined)[] = [
    {
        name: 'Melanie',
        avatar: 'https://nlux.ai/images/demos/persona-woman.jpeg',
    },
    {
        name: 'Alex',
        avatar: 'https://nlux.ai/images/demos/persona-user.jpeg',
    },
    undefined,
];

const ExampleWrapper = () => {
    const [key, setKey] = useState<number>(0);
    const [assistantPersonaIndex, setAssistantPersonaIndex] = useState<number>(0);
    const [userPersonaIndex, setUserPersonaIndex] = useState<number>(0);

    const handleNextAssistantPersona = () => {
        setAssistantPersonaIndex((assistantPersonaIndex + 1) % assistantPersonas.length);
    };

    const handleNextUserPersona = () => {
        setUserPersonaIndex((userPersonaIndex + 1) % userPersonas.length);
    };

    const adapter = useUnsafeChatAdapter({
        apiKey,
        model: 'gpt-4-turbo',
        // dataTransferMode: 'stream',
        dataTransferMode: 'stream',
        // systemMessage: 'You are a funny financial advisor called FinFunBot. Give sound, tailored financial advice. '
        //     + 'Explain concepts simply. Be funny and engaging. Tell some jokes. Do not be rude or offensive.'
        //     + 'Only recommend legal, ethical practices. Write concise answers under 5 sentences.',
        systemMessage: 'You are a chatbot called HarryBotter. When users chat with you, respond from the perspective'
            + 'of Harry Potter, as if you are him. Apply Harry\'s personality - brave, witty and wise. Access the '
            + 'knowledge of Harry Potter lore, locations, spells, events from the books and movies to answer questions '
            + 'and have engaging conversations related to the Wizarding World. Address the user by their name if '
            + 'known or neutrally. Be helpful, friendly and inject appropriate British vocabulary and magic '
            + 'terminology in natural ways. Enjoy bringing the magic of Harry Potter to users! Write short answers',
    });

    if (!adapter) {
        return <div>Loading...</div>;
    }

    const coloredJsxDiv = <div style={{
        backgroundImage: 'linear-gradient(yellow, orange)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }}>🤖</div>;

    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div style={{marginTop: '50px'}}>
                <span>Current Assistant Persona: {assistantPersonaIndex}</span>
                <button onClick={handleNextAssistantPersona}>Next Assistant Persona</button>
                <hr/>
                <span>Current User Persona: {userPersonaIndex}</span>
                <button onClick={handleNextUserPersona}>Next User Persona</button>
                <hr/>
                <AiChat
                    className="ai-chat-emulator"
                    adapter={myCustomPromiseAdapter}
                    // adapter={adapter}
                    personaOptions={{
                        assistant: assistantPersonas[assistantPersonaIndex],
                        user: userPersonas[userPersonaIndex],
                        // assistant: {
                        //     name: 'FinFunAssistant',
                        //     tagline: 'Your AI financial advisor',
                        //     // avatar: 'https://1000logos.net/wp-content/uploads/2023/02/ChatGPT-Logo.png',
                        //     avatar:
                        // 'https://static.vecteezy.com/system/resources/previews/021/608/790/non_2x/chatgpt-logo-chat-gpt-icon-on-black-background-free-vector.jpg',
                        // // avatar: profilePic, // avatar: <img src={profilePic} style={{width: '100%', height:
                        // '100%'}}/>, // avatar: coloredJsxDiv, }, user: { name: 'Melanie', avatar:
                        // 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=200',
                        // },

                        // assistant: {
                        //     name: 'HarryBotter',
                        //     avatar: 'https://docs.nlkit.com/nlux/images/docs/examples/harry-botter.png',
                        //     tagline: 'Mischievously Making Magic With Mirthful AI!',
                        // },
                    }}
                    // initialConversationContent={[
                    //     {
                    //         role: 'user',
                    //         message: 'Hello',
                    //     },
                    //     {
                    //         role: 'assistant',
                    //         message: 'Hi There!',
                    //     },
                    // ]}
                    conversationOptions={{
                        autoScroll: true,
                    }}
                    displayOptions={{
                        height: 380,
                        width: 450,
                    }}
                    // Optional: Instruct ChatGPT how to behave during the conversation.
                    composerOptions={{
                        // placeholder: 'FinFunBot here! How can I help you today?',
                        autoFocus: true,
                    }}
                    messageOptions={{
                        syntaxHighlighter: highlighter,
                    }}
                />
            </div>
        </div>
    );
};

export default () => {
    const root = document.getElementById('nlux-ai-chat-root');
    if (!root) {
        throw new Error('Root element not found');
    }

    const reactRoot = createRoot(root);
    reactRoot.render(
        <StrictMode>
            <ExampleWrapper/>
        </StrictMode>,
    );
};
