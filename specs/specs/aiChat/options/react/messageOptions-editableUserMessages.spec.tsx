import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';

describe('<AiChat /> + messageOptions + editableUserMessages', () => {
    let adapterController: AdapterController | undefined = undefined;

    beforeEach(() => {
        adapterController = adapterBuilder()
            .withBatchText(true)
            .withStreamText(false)
            .create();
    });

    afterEach(() => {
        adapterController = undefined;
    });

    describe('When editableUserMessages is not set', () => {
        it('Users should not be able to edit messages', async () => {
            // ...
        });
    });

    describe('When editableUserMessages is set', () => {
        it('Users should be able to edit and resubmit messages from initial state', async () => {
            // ...
        });

        it('Users should be able to edit and resubmit messages', async () => {
            // ...
        });

        it('Users should be able to edit and resubmit messages multiple times', async () => {
            // ...
        });
    });
});
