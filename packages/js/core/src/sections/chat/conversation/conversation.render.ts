import {AnyAiMsg} from '@shared/types/anyAiMsg';
import {CompRenderer} from '../../../types/comp';
import {
    CompConversationActions,
    CompConversationElements,
    CompConversationEvents,
    CompConversationProps,
} from './conversation.types';

export const renderConversation: CompRenderer<
    CompConversationProps<AnyAiMsg>, CompConversationElements, CompConversationEvents, CompConversationActions
> = ({appendToRoot}) => {

    const segmentsContainer = document.createElement('div') as HTMLElement;
    segmentsContainer.classList.add('nlux-chatSegments-container');
    appendToRoot(segmentsContainer);

    return {
        elements: {
            segmentsContainer,
        },
        actions: {},
    };
};
