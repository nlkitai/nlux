import {ChatItemComp} from '@nlux-dev/react/src/ui/ChatItem/ChatItemComp';
import {render} from '@testing-library/react';
import {forwardRef} from 'react';
import {describe, expect, it} from 'vitest';

describe('When a custom chat item is rendered', () => {
    it('Should render the custom chat item', async () => {
        // Arrange
        const ForwardRefChatItemComp = forwardRef(ChatItemComp);
        const component = <ForwardRefChatItemComp
            uid={'1'}
            direction={'incoming'}
            status={'complete'}
            message={'Hello'}
            responseRenderer={({response}: any) => <>{`THE AI SAID [${response}]`}</>}
        />;

        // Act
        render(component);

        // Assert
        expect(document.body).toHaveTextContent('THE AI SAID [Hello]');
    });

    it('Should render the custom chat item with JSON as message', async () => {
        // Arrange
        const ForwardRefChatItemComp = forwardRef(ChatItemComp);
        const component = <ForwardRefChatItemComp
            uid={'1'}
            direction={'incoming'}
            status={'complete'}
            message={{text: 'Hello Jason!'}}
            responseRenderer={({response}: any) => <>{`THE AI SAID [${response.text}]`}</>}
        />;

        // Act
        render(component);

        // Assert
        expect(document.body).toHaveTextContent('THE AI SAID [Hello Jason!]');
    });
});
