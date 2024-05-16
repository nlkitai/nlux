import {describe, expect, it} from 'vitest';
import {createPromptBoxDom} from '../../../../../packages/shared/src/ui/PromptBox/create';
import {PromptBoxProps} from '../../../../../packages/shared/src/ui/PromptBox/props';
import {updatePromptBoxDom} from '../../../../../packages/shared/src/ui/PromptBox/update';

describe('When a prompt box component is rendered and is in typing status', () => {
    it('Should render the prompt box with a textarea and button', () => {
        // Arrange
        const dom = createPromptBoxDom({status: 'typing'});

        // Act
        const html = dom.outerHTML;

        // Assert
        expect(html).toEqual(expect.stringContaining('<div class="nlux-comp-prmptBox nlux-prmpt-typing">'));
        expect(html).toEqual(expect.stringContaining('<textarea placeholder=""></textarea>'));
        expect(html).toEqual(
            expect.stringContaining('<button disabled=""><div class="nlux_sndIcn"><div class="snd_icn_ctn">'),
        );
    });

    it('The textarea should be enabled and empty', () => {
        // Arrange
        const dom = createPromptBoxDom({status: 'typing'});
        const textarea = dom.querySelector('textarea')!;

        // Act
        const html = dom.outerHTML;

        // Assert
        expect(textarea.disabled).toBe(false);
        expect(textarea.value).toBe('');
    });

    it('The submit button should be disabled', () => {
        // Arrange
        const dom = createPromptBoxDom({status: 'typing'});
        const submitButton = dom.querySelector('button')!;

        // Act
        const html = dom.outerHTML;

        // Assert
        expect(submitButton.disabled).toBe(true);
    });

    describe('With a placeholder', () => {
        it('Should render the placeholder', () => {
            // Arrange
            const dom = createPromptBoxDom({status: 'typing', placeholder: 'Type here'});

            // Act
            const html = dom.outerHTML;

            // Assert
            expect(html).toEqual(expect.stringContaining('<textarea placeholder="Type here"></textarea>'));
        });

        describe('When the placeholder is updated', () => {
            it('Should update the placeholder', () => {
                // Arrange
                const beforeProps: PromptBoxProps = {status: 'typing', placeholder: 'Type here'};
                const props: PromptBoxProps = {status: 'typing', placeholder: 'Type something else'};
                const dom = createPromptBoxDom(beforeProps);
                const textarea = dom.querySelector('textarea')!;

                // Act
                updatePromptBoxDom(dom, beforeProps, props);

                // Assert
                expect(textarea.placeholder).toBe('Type something else');
            });
        });
    });

    describe('With a message', () => {
        it('Should render the message', () => {
            // Arrange
            const props: PromptBoxProps = {status: 'typing', message: 'Hello, World!'};
            const dom = createPromptBoxDom(props);
            const textarea = dom.querySelector('textarea')!;

            // Act
            const html = dom.outerHTML;

            // Assert
            expect(textarea.value).toBe('Hello, World!');
        });

        describe('When the message is updated', () => {
            it('Should update the message', () => {
                // Arrange
                const beforeProps: PromptBoxProps = {status: 'typing', message: 'Hello, World!'};
                const props: PromptBoxProps = {status: 'typing', message: 'Goodbye, World!'};
                const dom = createPromptBoxDom(beforeProps);
                const textarea = dom.querySelector('textarea')!;

                // Act
                updatePromptBoxDom(dom, beforeProps, props);

                // Assert
                expect(textarea.value).toBe('Goodbye, World!');
            });
        });
    });

    describe('When status is updated to submitting', () => {
        it('Should disable the textarea and submit button', () => {
            // Arrange
            const beforeProps: PromptBoxProps = {status: 'typing'};
            const props: PromptBoxProps = {status: 'submitting'};
            const dom = createPromptBoxDom(beforeProps);
            const textarea = dom.querySelector('textarea')!;
            const submitButton = dom.querySelector('button')!;

            // Act
            updatePromptBoxDom(dom, beforeProps, props);

            // Assert
            expect(textarea.disabled).toBe(true);
            expect(submitButton.disabled).toBe(true);
        });
    });

    describe('When status is updated to waiting', () => {
        it('Should disable submit button and keep textarea enabled', () => {
            // Arrange
            const beforeProps: PromptBoxProps = {status: 'typing'};
            const props: PromptBoxProps = {status: 'waiting'};
            const dom = createPromptBoxDom(beforeProps);
            const textarea = dom.querySelector('textarea')!;
            const submitButton = dom.querySelector('button')!;

            // Act
            updatePromptBoxDom(dom, beforeProps, props);

            // Assert
            expect(textarea.disabled).toBe(false);
            expect(submitButton.disabled).toBe(true);
        });
    });
});
