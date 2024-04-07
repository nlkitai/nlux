import {ChatItemComp} from '@nlux-dev/react/src/ui/ChatItem/ChatItemComp';
import {render} from '@testing-library/react';
import {forwardRef} from 'react';
import {describe, expect, it} from 'vitest';

describe('When a custom chat item is rendered', () => {
    it('should render the custom chat item', async () => {
        // Given
        const ForwardRefChatItemComp = forwardRef(ChatItemComp);
        const component = <ForwardRefChatItemComp
            id={'1'}
            direction={'incoming'}
            status={'rendered'}
            message={'Hello'}
            customRenderer={(message) => <>{`THE AI SAID [${message}]`}</>}
        />;

        // When
        render(component);

        // Then
        expect(document.body).toHaveTextContent('THE AI SAID [Hello]');
    });

    it('should render the custom chat item with JSON as message', async () => {
        // Given
        const ForwardRefChatItemComp = forwardRef(ChatItemComp);
        const component = <ForwardRefChatItemComp
            id={'1'}
            direction={'incoming'}
            status={'rendered'}
            message={{text: 'Hello Jason!'}}
            customRenderer={(message) => <>{`THE AI SAID [${message.text}]`}</>}
        />;

        // When
        render(component);

        // Then
        expect(document.body).toHaveTextContent('THE AI SAID [Hello Jason!]');
    });
});
