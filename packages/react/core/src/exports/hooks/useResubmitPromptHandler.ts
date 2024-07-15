import {useCallback} from 'react';
import {ComposerStatus} from '@shared/components/Composer/props';
import {ChatSegment} from '@shared/types/chatSegment/chatSegment';

export const useResubmitPromptHandler = <AiMsg>(
    initialSegment: ChatSegment<AiMsg> | undefined,
    setInitialSegment: (segment: ChatSegment<AiMsg>) => void,
    chatSegments: ChatSegment<AiMsg>[],
    setChatSegments: (segments: ChatSegment<AiMsg>[]) => void,
    setPrompt: (prompt: string) => void,
    setComposerStatus: (status: ComposerStatus) => void,
) => {
    return useCallback((segmentId: string, messageId: string, newPrompt: string) => {
        //
        // Handle the case where the message being edited is in the initial segment
        //
        if (segmentId === 'initial' && initialSegment) {
            const newInitialSegmentItems = [];
            for (const item of initialSegment.items) {
                if (item.uid !== messageId) {
                    newInitialSegmentItems.push(item);
                } else {
                    break;
                }
            }

            const newInitialSegment: ChatSegment<AiMsg> = {
                ...initialSegment,
                items: newInitialSegmentItems,
            };

            setInitialSegment(newInitialSegment);
            setChatSegments([]);
            setPrompt(newPrompt);
            setComposerStatus('submitting-edit');
            return;
        }

        //
        // Handle the case where the message being edited is in a chat segment
        //
        // Find the segment
        const segmentIndex = chatSegments.findIndex((segment) => segment.uid === segmentId);

        // Remove the segment from the chatSegments array
        const newChatSegments = chatSegments.slice(0, segmentIndex);
        setChatSegments(newChatSegments);

        // Submit the new prompt
        setPrompt(newPrompt);
        setComposerStatus('submitting-edit');
    }, [
        chatSegments,
        setChatSegments,
        initialSegment,
        setInitialSegment,
        setPrompt,
        setComposerStatus,
    ]);
};