import {ChatAdapter, ReadyEventDetails, StandardChatAdapter} from '@nlux/core';
import {useEffect} from 'react';
import {reactPropsToCoreProps} from '../../utils/reactPropsToCoreProps';
import {AiChatProps} from '../props';

export const useReadyEventTrigger = <AiMsg>(
    props: AiChatProps<AiMsg>,
): void => {
    // Ready event is only triggered once.
    // And only if the ready event callback is provided.
    useEffect(() => {
        const readyCallback = props.events?.ready;
        if (!readyCallback) {
            return;
        }

        const coreProps = reactPropsToCoreProps<AiMsg>(props);
        const readyEvent: ReadyEventDetails<AiMsg> = {
            aiChatProps: {
                ...coreProps,
                adapter: props.adapter as ChatAdapter<AiMsg> | StandardChatAdapter<AiMsg>,
            },
        };

        readyCallback(readyEvent);
    }, []);
};
