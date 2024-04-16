import {ChatSegmentUserMessage} from '../../../../../../../../shared/src/types/chatSegment/chatSegmentUserMessage';
import {uid} from '../../../../../../../../shared/src/utils/uid';

export const getUserMessageFromPrompt = (prompt: string): ChatSegmentUserMessage => {
    return {
        uid: uid(),
        time: new Date(),
        status: 'complete',
        participantRole: 'user',
        content: prompt,
    };
};
