import {NluxProps, warn} from '@nlux/core';
import {adapterParamToUsableAdapter} from '../../utils/adapterParamToUsableAdapter';
import {optionsUpdater} from '../../utils/optionsUpdater';
import {personaOptionsUpdater} from '../../utils/personasUpdater';
import type {AiChatProps} from './props';

export const handleNewPropsReceived = async (
    currentProps: AiChatProps,
    newProps: AiChatProps,
): Promise<Partial<NluxProps> | undefined> => {
    const eventListeners = optionsUpdater(
        currentProps.events,
        newProps.events,
    );

    const layoutOptions = optionsUpdater(
        currentProps.layoutOptions,
        newProps.layoutOptions,
    );

    const conversationOptions = optionsUpdater(
        currentProps.conversationOptions,
        newProps.conversationOptions,
    );

    const promptBoxOptions = optionsUpdater(
        currentProps.promptBoxOptions,
        newProps.promptBoxOptions,
    );

    const personaOptions = await personaOptionsUpdater(
        currentProps.personaOptions,
        newProps.personaOptions,
    );

    const propsToUpdate: Partial<NluxProps> = {};

    if (eventListeners !== undefined) {
        propsToUpdate.events = eventListeners ?? {};
    }

    if (layoutOptions !== undefined) {
        propsToUpdate.layoutOptions = layoutOptions ?? {};
    }

    if (conversationOptions !== undefined) {
        propsToUpdate.conversationOptions = conversationOptions ?? {};
    }

    if (promptBoxOptions !== undefined) {
        propsToUpdate.promptBoxOptions = promptBoxOptions ?? {};
    }

    if (personaOptions !== undefined) {
        propsToUpdate.personaOptions = personaOptions ?? {};
    }

    const newAdapterProp = currentProps.adapter !== newProps.adapter
        ? newProps.adapter
        : undefined;

    if (newAdapterProp !== undefined) {
        const newAdapter = adapterParamToUsableAdapter(newAdapterProp);
        if (!newAdapter) {
            warn({
                message: 'Invalid new adapter property provided! The adapter must be an instance of Adapter or AdapterBuilder.',
                type: 'invalid-adapter',
            });
        } else {
            propsToUpdate.adapter = newAdapter;
        }
    }

    if (currentProps.className !== newProps.className) {
        propsToUpdate.className = newProps.className;
    }

    if (currentProps.syntaxHighlighter !== newProps.syntaxHighlighter) {
        propsToUpdate.syntaxHighlighter = newProps.syntaxHighlighter;
    }

    const somethingChanged = Object.keys(propsToUpdate).length > 0;
    if (!somethingChanged) {
        return;
    }

    return propsToUpdate;
};
