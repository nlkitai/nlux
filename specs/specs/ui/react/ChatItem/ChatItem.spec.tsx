import {FetchResponseComponentProps} from '@nlux-dev/react/src';
import {ChatItemComp} from '@nlux-dev/react/src/ui/ChatItem/ChatItemComp';
import {render} from '@testing-library/react';
import {forwardRef} from 'react';
import {describe, expect, it} from 'vitest';

describe('When a custom chat item is provided', () => {
    it('Should render the custom chat item', async () => {
        // Arrange
        const ForwardRefChatItemComp = forwardRef(ChatItemComp);
        const component = <ForwardRefChatItemComp
            uid={'1'}
            direction={'incoming'}
            dataTransferMode={'fetch'}
            displayMode={'bubbles'}
            status={'complete'}
            fetchedContent={'Hello'}
            responseRenderer={({content}: any) => <>{`THE AI SAID [${content}]`}</>}
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
            dataTransferMode={'fetch'}
            displayMode={'bubbles'}
            status={'complete'}
            fetchedContent={{text: 'Hello Jason!'}}
            responseRenderer={({content}: FetchResponseComponentProps<any>) => <>{`THE AI SAID [${content.text}]`}</>}
        />;

        // Act
        render(component);

        // Assert
        expect(document.body).toHaveTextContent('THE AI SAID [Hello Jason!]');
    });
});
