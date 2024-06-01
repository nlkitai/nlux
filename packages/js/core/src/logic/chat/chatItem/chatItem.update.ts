import {CompUpdater} from '../../../types/comp';
import {CompChatItemActions, CompChatItemElements, CompChatItemProps} from './chatItem.types';

export const updateChatItem: CompUpdater<
    CompChatItemProps, CompChatItemElements, CompChatItemActions
> = ({
         propName,
         newValue,
         dom,
     }) => {
    switch (propName) {
        case 'markdownLinkTarget':
        case 'skipStreamingAnimation':
        case 'syntaxHighlighter':
        case 'htmlSanitizer':
        case 'showCodeBlockCopyButton':
        case 'streamingAnimationSpeed':
            dom.actions?.updateMarkdownStreamRenderer({
                [propName]: newValue,
            });
            break;
    }
};
