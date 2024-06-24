import {ChatSegmentUserMessage} from '../../../types/chatSegment/chatSegmentUserMessage';
import {uid} from '../../../utils/uid';

export const getUserMessageFromPrompt = (prompt: string): ChatSegmentUserMessage => {
    return {
        uid: uid(),
        time: new Date(),
        status: 'complete',
        participantRole: 'user',
        content: prompt,
        contentType: 'text',
    };
};
