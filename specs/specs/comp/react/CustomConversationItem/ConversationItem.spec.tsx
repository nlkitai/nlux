import {ConversationItemComp} from '@nlux-dev/react/src/comp/ConversationItem/ConversationItemComp';
import {render} from '@testing-library/react';
import React from 'react';
import {describe, expect, it} from 'vitest';

describe('When a custom conversation item is rendered', () => {
    it('should render the custom conversation item', async () => {
        // Given
        const component = <ConversationItemComp
            direction={'incoming'}
            status={'rendered'}
            message={'This is a test message'}
        />;

        // When
        render(component);

        // Then
        expect(document.body).toHaveTextContent('This is a test message');
    });
});
