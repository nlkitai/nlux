import {DataTransferMode} from '@nlux-dev/core/src/types/adapters/chat/chatAdapter';
import {MessageStatus} from '../../ui/Message/props';

/**
 * The interface for a controller that can be used to change a chat segment.
 */
export interface ChatSegmentController<ResponseType> {
    addAiMessage: (
        status: MessageStatus,
        dataTransferMode: DataTransferMode,
        content?: ResponseType,
    ) => string,
    addUserMessage: (
        status: MessageStatus,
        content?: string,
    ) => string;
    chunk: (chunk: ResponseType) => void,
    complete: () => void,
    error: (error: Error) => void,
    updateMessage: (
        id: string,
        status: MessageStatus,
        content?: string,
    ) => void,
}
