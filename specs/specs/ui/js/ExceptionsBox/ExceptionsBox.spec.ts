import {createExceptionBoxController} from '@nlux-dev/core/src/ui/ExceptionsBox/control';
import {createExceptionsBoxDom} from '@nlux-dev/core/src/ui/ExceptionsBox/create';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

describe('When an exceptions box component is rendered', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('Should render an empty exceptions box', () => {
        // When
        const exceptionsBox = createExceptionsBoxDom();

        // Then
        expect(exceptionsBox.outerHTML).toEqual(expect.stringContaining('<div class="nlux-comp-exp_box"></div>'));
    });

    describe('When an exception occurs', () => {
        it('Should be displayed in the exceptions box', async () => {
            // Given
            const exceptionsBox = createExceptionsBoxDom();
            const controller = createExceptionBoxController(exceptionsBox);

            // When
            controller.displayException('An error occurred');
            vi.advanceTimersByTime(1);

            // Then
            expect(exceptionsBox.outerHTML).toEqual(
                expect.stringContaining(
                    '<div class="nlux-comp-exp_box"><div class="nlux-comp-exp_itm"><span class="nlux-comp-exp_itm_msg">An error occurred</span></div></div>',
                ),
            );
        });

        it('Should be removed after 4.5 seconds', async () => {
            // Given
            const exceptionsBox = createExceptionsBoxDom();
            const controller = createExceptionBoxController(exceptionsBox);

            // When
            controller.displayException('An error occurred');
            vi.advanceTimersByTime(4500 + 1);

            // Then
            expect(exceptionsBox.outerHTML).toEqual(expect.stringContaining('<div class="nlux-comp-exp_box"></div>'));
        });
    });

    describe('When multiple exceptions occur', () => {
        it('They should be displayed in the exceptions box one after the other', async () => {
            // Given
            const exceptionsBox = createExceptionsBoxDom();
            const controller = createExceptionBoxController(exceptionsBox);

            // When
            controller.displayException('An error occurred');
            controller.displayException('Another error occurred');

            // Then
            expect(exceptionsBox.outerHTML).toEqual(
                expect.stringContaining(
                    '<div class="nlux-comp-exp_box"><div class="nlux-comp-exp_itm"><span class="nlux-comp-exp_itm_msg">An error occurred</span></div></div>',
                ),
            );

            // When
            vi.advanceTimersByTime(4500 + 1);

            // Then
            expect(exceptionsBox.outerHTML).toEqual(
                expect.stringContaining(
                    '<div class="nlux-comp-exp_box"><div class="nlux-comp-exp_itm"><span class="nlux-comp-exp_itm_msg">Another error occurred</span></div></div>',
                ),
            );
        });

        it('They should be removed one after the other', async () => {
            // Given
            const exceptionsBox = createExceptionsBoxDom();
            const controller = createExceptionBoxController(exceptionsBox);

            // When
            controller.displayException('An error occurred');
            controller.displayException('Another error occurred');

            // When
            vi.advanceTimersByTime(4500 * 2 + 1);

            // Then
            expect(exceptionsBox.outerHTML).toEqual(expect.stringContaining('<div class="nlux-comp-exp_box"></div>'));
        });
    });
});
