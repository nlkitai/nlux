export default `import { useState, useCallback } from 'react';
import {ConversationLayout} from '@nlux/react';

export const useLayoutOptions = (defaultLayout: ConversationLayout) => {
  const [conversationLayout, setConversationLayout] = useState<ConversationLayout>(defaultLayout);
  const onConversationsLayoutChange = useCallback(
    (e) => setConversationLayout(e.target.value),
    [setConversationLayout],
  );

  return {
    conversationLayout,
    onConversationsLayoutChange
  };
};

const layoutSelectorStyle = {
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

export const LayoutSelector = ({conversationLayout, onConversationsLayoutChange}) => {
    return (
        <div style={layoutSelectorStyle}>
            <div>
                Conversation Layout
            </div>
            <div style={{display: 'flex', flexDirection: 'row', gap: '5px', fontWeight: 600}}>
                <label>
                    <input
                        type="radio"
                        name="conversationLayout"
                        value="list"
                        checked={conversationLayout === 'list'}
                        onChange={onConversationsLayoutChange}
                    /> 
                    List
                </label>
                <label>
                    <input
                        type="radio"
                        name="conversationMode"
                        value="bubbles"
                        checked={conversationLayout === 'bubbles'}
                        onChange={onConversationsLayoutChange}
                    />
                    Bubbles
                </label>
            </div>
        </div>
    );
};

`;
