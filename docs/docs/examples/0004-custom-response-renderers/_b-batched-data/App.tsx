export default (colorMode: 'dark' | 'light') => `import {AiChat, StreamResponseComponentProps} from '@nlux/react';
import {useChatAdapter} from '@nlux/langchain-react';
import '@nlux/themes/nova.css';
import {personaOptions} from './personas';
import {WavesBackground} from './Waves';

const ColourfulResponseRenderer = (props: BatchResponseComponentProps<string>) => {
    console.log('Response Renderer Props:');
    console.dir(props);

    return (
        <div className="colourful-response-renderer">
            <div className="response-container">{props.content}</div>
            <div className="rating-container">
                What do you think of this response?
                &nbsp;
                <button onClick={() => console.log('I like it!')}>👍</button>
                <button onClick={() => console.log('I love it!')}>❤️</button>
                <button onClick={() => console.log('I hate it!')}>😵</button>
            </div>
            <WavesBackground/>
        </div>
    );
};

export default () => {
    // LangServe adapter that connects to a demo LangChain Runnable API
    const adapter = useChatAdapter({
        url: 'https://pynlux.api.nlkit.com/pirate-speak',
        dataTransferMode: 'batch'
    });

  return (
    <AiChat
        messageOptions={{
            // Custom response renderer for the assistant's messages
            responseRenderer: ColourfulResponseRenderer
        }}
      adapter={adapter}
      personaOptions={personaOptions}
      displayOptions={{colorScheme: '${colorMode}'}}
    />
  );
};
`;
