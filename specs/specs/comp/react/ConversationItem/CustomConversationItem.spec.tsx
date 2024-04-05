import {ConvItemComp} from '@nlux-dev/react/src/comp/ConvItem/ConvItemComp';
import {render} from '@testing-library/react';
import React, {forwardRef} from 'react';
import {describe, expect, it} from 'vitest';

describe('When a custom conversation item is rendered', () => {
    it('should render the custom conversation item', async () => {
        // Given
        const ForwardRefConversationItemComp = forwardRef(ConvItemComp);
        const component = <ForwardRefConversationItemComp
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

    it('should render the custom conversation item with JSON as message', async () => {
        // Given
        const ForwardRefConversationItemComp = forwardRef(ConvItemComp);
        const component = <ForwardRefConversationItemComp
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
