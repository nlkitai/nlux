import {NluxProps} from '@nlux-dev/core/src';
import {AiChat as AiChatType} from '@nlux/core';
import {optionsUpdater} from './optionsUpdater';
import type {AiChatProps} from './props';

export const handleNewPropsReceived = (
    instance: AiChatType,
    currentProps: AiChatProps,
    newProps: AiChatProps,
) => {
    let somethingChanged = false;

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

    if ([layoutOptions, conversationOptions, promptBoxOptions].some((x) => x !== undefined)) {
        somethingChanged = true;
    }

    const propsToUpdate: NluxProps = {
        layoutOptions: layoutOptions ?? {},
        conversationOptions: conversationOptions ?? {},
        promptBoxOptions: promptBoxOptions ?? {},
    };

    if (currentProps.className !== newProps.className) {
        propsToUpdate.className = newProps.className;
        somethingChanged = true;
    }

    if (currentProps.syntaxHighlighter !== newProps.syntaxHighlighter) {
        propsToUpdate.syntaxHighlighter = newProps.syntaxHighlighter;
        somethingChanged = true;
    }

    if (!somethingChanged) {
        return;
    }

    instance.updateProps(propsToUpdate);
};
