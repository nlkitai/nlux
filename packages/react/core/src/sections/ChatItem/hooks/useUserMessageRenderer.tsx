import {useCallback} from 'react';
import {MarkdownSnapshotRenderer} from '../../MessageRenderer/MarkdownSnapshotRenderer';
import {ChatItemProps} from '../props';

export const useUserMessageRenderer = function<AiMsg>(
    props: ChatItemProps<AiMsg>
) {
    return useCallback(() => {
        if (props.messageOptions?.promptRenderer === undefined) {
            return (
                <MarkdownSnapshotRenderer
                    messageUid={props.uid}
                    content={props.fetchedContent as string}
                    markdownOptions={{
                        htmlSanitizer: props.messageOptions?.htmlSanitizer,
                        // User message does not need syntax highlighting, advanced markdown options
                        // Only HTML sanitization is needed
                    }}
                    canResubmit={props.messageOptions?.editableUserMessages}
                    onResubmit={(newPrompt) => {
                        props.onPromptResubmit ? props.onPromptResubmit(newPrompt) : undefined
                    }}
                />
            );
        }

        const PromptRenderer = props.messageOptions.promptRenderer;
        const isEditable = props.messageOptions.editableUserMessages ?? false;
        const onResubmit = (newPrompt: string) => {
            props.onPromptResubmit ? props.onPromptResubmit(newPrompt) : undefined
        };

        return (
            <PromptRenderer
                uid={props.uid}
                prompt={props.fetchedContent as string}
                isEditable={isEditable}
                onResubmit={onResubmit}
            />
        );
    }, [props.messageOptions?.promptRenderer, props.fetchedContent, props.uid]);
};