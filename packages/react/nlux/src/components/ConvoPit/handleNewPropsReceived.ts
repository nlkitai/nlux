import {NluxProps} from '@nlux-dev/nlux/src';
import {ConvoPit as ConvoPitType} from '@nlux/nlux';
import {optionsUpdater} from './optionsUpdater';
import type {ConvoPitProps} from './props';

export const handleNewPropsReceived = (
    instance: ConvoPitType,
    currentProps: ConvoPitProps,
    newProps: ConvoPitProps,
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
