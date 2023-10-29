import {ConvoPit as ConvoPitType} from '@nlux/nlux';
import type {ConvoPitProps} from './props.ts';
import {conversationOptionsUpdater} from './propUpdaters/conversationOptionsUpdater.ts';
import {messageOptionsUpdater} from './propUpdaters/messageOptionsUpdater.ts';
import {promptBoxOptionsUpdater} from './propUpdaters/promptBoxOptionsUpdater.ts';

export const handleNewPropsReceived = (instance: ConvoPitType, currentProps: ConvoPitProps, newProps: ConvoPitProps) => {
    const propsToUpdate: Partial<any> = {}; // TODO - Have a type
    if (currentProps.className !== newProps.className) {
        propsToUpdate.className = newProps.className;
    }

    if (currentProps.containerMaxHeight !== newProps.containerMaxHeight) {
        propsToUpdate.containerMaxHeight = newProps.containerMaxHeight;
    }

    if (currentProps.theme !== newProps.theme) {
        propsToUpdate.theme = newProps.theme;
    }

    if (currentProps.messageOptions !== newProps.messageOptions) {
        const updatedMessageOptions = messageOptionsUpdater(
            currentProps.messageOptions,
            newProps.messageOptions,
        );

        if (updatedMessageOptions) {
            propsToUpdate.messageOptions = updatedMessageOptions;
        }
    }

    if (currentProps.conversationOptions !== newProps.conversationOptions) {
        const updatedConversationOptions = conversationOptionsUpdater(
            currentProps.conversationOptions,
            newProps.conversationOptions,
        );

        if (updatedConversationOptions) {
            propsToUpdate.conversationOptions = updatedConversationOptions;
        }
    }

    if (currentProps.promptBoxOptions !== newProps.promptBoxOptions) {
        const updatedPromptBoxOptions = promptBoxOptionsUpdater(
            currentProps.promptBoxOptions,
            newProps.promptBoxOptions,
        );

        if (updatedPromptBoxOptions) {
            propsToUpdate.promptBoxOptions = updatedPromptBoxOptions;
        }
    }

    instance.updateProps(propsToUpdate);
};
