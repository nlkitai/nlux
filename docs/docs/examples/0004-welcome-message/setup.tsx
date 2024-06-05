export default `import {useState, useCallback} from 'react';
import {UserPersona} from '@nlux/react';

const optionsSelectorStyle = {
    backgroundColor: '#f0f0f0',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '15px',
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
    alignItems: 'center',
    justifyContent: 'center'
};

export const useDemoOptions = () => {
  const [shouldUseAssistantPersona, setShouldUseAssistantPersona] = useState(true);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);

  const DemoOptionsComponent = useCallback(() => {
    return (
      <div style={optionsSelectorStyle}>
        <label>
        <label>
          <input
            type="checkbox"
            checked={shouldUseAssistantPersona}
            onChange={() => setShouldUseAssistantPersona(!shouldUseAssistantPersona)}
          />
          Use assistant persona
        </label>
          <input
            type="checkbox"
            checked={showWelcomeMessage}
            onChange={() => setShowWelcomeMessage(!showWelcomeMessage)}
          />
          Show welcome message
        </label>
      </div>
    );
  }, [shouldUseAssistantPersona, showWelcomeMessage]);

  return [
    DemoOptionsComponent,
    shouldUseAssistantPersona,
    showWelcomeMessage
  ];
};

export const userPersona: UserPersona = {
  name: 'Alex',
  avatar: 'https://docs.nlkit.com/nlux/images/personas/alex.png'
};
`;
