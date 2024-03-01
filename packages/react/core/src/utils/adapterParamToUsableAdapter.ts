import {ChatAdapter, ChatAdapterBuilder, StandardChatAdapter, warn} from '@nlux/core';

export const adapterParamToUsableAdapter = (
    anAdapterOrAdapterBuilder: ChatAdapter | ChatAdapterBuilder,
): ChatAdapter | StandardChatAdapter | undefined => {
    let adapterType: 'instance' | 'builder' | 'unknown' = 'unknown';

    const adapterAsAny = anAdapterOrAdapterBuilder as any;
    if (typeof adapterAsAny?.create === 'function') {
        adapterType = 'builder';
    } else {
        if (
            (typeof adapterAsAny?.fetchText === 'function') ||
            (typeof adapterAsAny?.streamText === 'function')
        ) {
            adapterType = 'instance';
            return anAdapterOrAdapterBuilder as ChatAdapter;
        }
    }

    if (adapterType === 'unknown') {
        warn('Unable to determine the type of the adapter.');
        return undefined;
    }

    if (adapterType === 'builder') {
        const adapterBuilder: ChatAdapterBuilder = adapterAsAny;
        const newAdapter = adapterBuilder.create();
        if (
            (typeof newAdapter?.fetchText === 'function') ||
            (typeof newAdapter?.streamText === 'function')
        ) {
            return newAdapter as ChatAdapter;
        } else {
            warn('The adapter builder did not return a valid adapter.');
            return undefined;
        }
    }

    return anAdapterOrAdapterBuilder as ChatAdapter;
};
