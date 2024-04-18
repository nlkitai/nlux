import {ChatSegmentStatus} from '../../../../../../shared/src/types/chatSegment/chatSegment';

export type CompChatSegmentProps = Readonly<{
    uid: string;
    status: ChatSegmentStatus;
}>;

export type CompChatSegmentElements = Readonly<{
    chatSegmentContainer: HTMLElement;
}>;

export type CompChatSegmentActions = Readonly<{
    appendChatItem: (chatItemId: string, chatItem: HTMLElement) => void;
}>;

export type CompChatSegmentEvents = 'chat-segment-ready';
