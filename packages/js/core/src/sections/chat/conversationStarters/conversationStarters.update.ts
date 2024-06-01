import {emptyInnerHtml} from '../../../../../../shared/src/utils/dom/emptyInnerHtml';
import {CompUpdater} from '../../../types/comp';
import {
    CompConversationStartersActions,
    CompConversationStartersElements,
    CompConversationStartersProps,
} from './conversationStarters.types';

export const updateConversationStarters: CompUpdater<
    CompConversationStartersProps,
    CompConversationStartersElements,
    CompConversationStartersActions
> = ({
         propName,
         newValue,
         dom: {elements}
     }) => {
    if (!elements) {
        return;
    }

    if (propName === 'items') {
        elements.conversationStarters.innerHTML = '';
        emptyInnerHtml(elements.conversationStarters);

        newValue.forEach((item, index) => {
            const conversationStarter = document.createElement('div');
            conversationStarter.classList.add('nlux-comp-convStrt');
            conversationStarter.textContent = item.prompt;
            elements.conversationStarters.appendChild(conversationStarter);
        });
    }
};
