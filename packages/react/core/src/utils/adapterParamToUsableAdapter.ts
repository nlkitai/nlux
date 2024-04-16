import {ChatAdapter, ChatAdapterBuilder, StandardChatAdapter} from '@nlux/core';
import {warn} from '../../../../shared/src/utils/warn';

export const adapterParamToUsableAdapter = <MessageType>(
    anAdapterOrAdapterBuilder: ChatAdapter<MessageType> | ChatAdapterBuilder<MessageType>,
): ChatAdapter<MessageType> | StandardChatAdapter<MessageType> | undefined => {
    let adapterType: 'instance' | 'builder' | 'unknown' = 'unknown';

    const adapterAsAny = anAdapterOrAdapterBuilder as any;
    if (typeof adapterAsAny?.create === 'function') {
        adapterType = 'builder';
    } else {
        if (
            (typeof adapterAsAny?.fetchText === 'function') ||
            (typeof adapterAsAny?.streamText === 'function')
        ) {
            return anAdapterOrAdapterBuilder as ChatAdapter<MessageType>;
        }
    }

    if (adapterType === 'unknown') {
        warn('Unable to determine the type of the adapter.');
        return undefined;
    }

    if (adapterType === 'builder') {
        const adapterBuilder: ChatAdapterBuilder<MessageType> = adapterAsAny;
        const newAdapter = adapterBuilder.create();
        if (
            (typeof newAdapter?.fetchText === 'function') ||
            (typeof newAdapter?.streamText === 'function')
        ) {
            return newAdapter as ChatAdapter<MessageType>;
        } else {
            warn('The adapter builder did not return a valid adapter.');
            return undefined;
        }
    }

    return anAdapterOrAdapterBuilder as ChatAdapter<MessageType>;
};
