import {AiChat} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {act} from 'react';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForMdStreamToComplete, waitForReactRenderCycle, waitForRenderCycle} from '../../../../utils/wait';

describe('<AiChat /> + messageOptions + editingEnabled', () => {
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

    describe('When editingEnabled is not set', () => {
        it('Users should not be able to edit messages', async () => {
            // ...
        });
    });

    describe('When editingEnabled is set', () => {
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
