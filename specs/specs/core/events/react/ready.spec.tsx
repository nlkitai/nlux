import {AiChat} from '@nlux/react';
import {render} from '@testing-library/react';
import React from 'react';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForRenderCycle} from '../../../../utils/wait';

describe('When ready event handler is used with React JS AiChat component', () => {
    let adapterController: AdapterController;

    beforeEach(() => {
        adapterController = adapterBuilder().withFetchText().create();
    });

    it('should be called when the component is mounted', async () => {
        const readyCallback = vi.fn();
        const component = <AiChat
            adapter={adapterController.adapter}
            events={{
                ready: readyCallback,
            }}
        />;

        render(component);
        await waitForRenderCycle();
        expect(readyCallback).toHaveBeenCalledOnce();
    });

    it('should be called with initialisation options', async () => {
        const readyCallback = vi.fn();
        const component = <AiChat
            adapter={adapterController.adapter}
            className={'test-class'}
            events={{
                ready: readyCallback,
            }}
        />;

        render(component);
        await waitForRenderCycle();

        expect(readyCallback).toHaveBeenCalledWith(expect.objectContaining({
            aiChatProps: {
                adapter: adapterController.adapter,
                className: 'test-class',
            },
        }));
    });
});
