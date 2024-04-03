import {createExceptionsBoxDom} from '@nlux-dev/core/src/comp/ExceptionsBox/create';
import {ExceptionsBoxProps} from '@nlux-dev/core/src/comp/ExceptionsBox/props';
import {updateExceptionsBox} from '@nlux-dev/core/src/comp/ExceptionsBox/update';
import {describe, expect, it} from 'vitest';

describe('When an exceptions box component is rendered', () => {
    it('should render the message', () => {
        // Given
        const props: ExceptionsBoxProps = {
            message: 'An error occurred',
        };

        // When
        const exceptionsBox = createExceptionsBoxDom(props);

        // Then
        expect(exceptionsBox.outerHTML).toEqual(expect.stringContaining('An error occurred'));
    });

    describe('when the message is updated', () => {
        it('should update the message', () => {
            // Given
            const props: ExceptionsBoxProps = {
                message: 'An error occurred',
            };
            const exceptionsBox = createExceptionsBoxDom(props);

            // When
            const newProps: ExceptionsBoxProps = {
                ...props,
                message: 'Another error occurred',
            };
            updateExceptionsBox(
                exceptionsBox,
                props,
                newProps,
            );

            // Then
            expect(exceptionsBox.outerHTML).toEqual(expect.stringContaining('Another error occurred'));
        });
    });
});
