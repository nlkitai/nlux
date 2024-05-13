import {ReadyEventDetails} from '@nlux/core';
import {useEffect} from 'react';
import {reactPropsToCorePropsInEvents} from '../../utils/reactPropsToCorePropsInEvents';
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

        const coreProps = reactPropsToCorePropsInEvents<AiMsg>(props);
        const readyEvent: ReadyEventDetails<AiMsg> = {
            aiChatProps: coreProps,
        };

        readyCallback(readyEvent);
    }, []);
};
