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
  const [ isOption1Checked, setShouldUseAssistantPersona ] = useState(true);
  const [ isOption2Checked, setShowWelcomeMessage ] = useState(true);

  const DemoOptionsComponent = useCallback(() => {
    return (
      <div style={optionsSelectorStyle}>
        <label>
          <input
            type="checkbox"
            checked={isOption1Checked}
            onChange={() => setShouldUseAssistantPersona(!isOption1Checked)}
          />
          Use assistant persona
        </label>
        <label>
          <input
            type="checkbox"
            checked={isOption2Checked}
            onChange={() => setShowWelcomeMessage(!isOption2Checked)}
          />
          Show welcome message
        </label>
      </div>
    );
  }, [ isOption1Checked, isOption2Checked ]);

  return [
    DemoOptionsComponent,
    isOption1Checked,
    isOption2Checked
  ];
};

export const userPersona: UserPersona = {
  name: 'Alex',
  avatar: 'https://docs.nlkit.com/nlux/images/personas/alex.png'
};
`;
