import {NluxProps} from '@nlux-dev/nlux/src';
import {NluxConvo as NluxConvoType} from '@nlux/nlux';
import {optionsUpdater} from './optionsUpdater';
import type {NluxConvoProps} from './props';

export const handleNewPropsReceived = (
    instance: NluxConvoType,
    currentProps: NluxConvoProps,
    newProps: NluxConvoProps,
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

    if (!somethingChanged) {
        return;
    }

    instance.updateProps(propsToUpdate);
};
