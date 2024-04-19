import {ChatSegmentStatus} from '../../../../../../shared/src/types/chatSegment/chatSegment';

export type CompChatSegmentProps = Readonly<{
    uid: string;
    status: ChatSegmentStatus;
}>;

export type CompChatSegmentElements = {
    chatSegmentContainer: HTMLElement;
    loaderContainer?: HTMLElement;
};

export type CompChatSegmentActions = Readonly<{
    showLoader: () => void;
    hideLoader: () => void;
}>;

export type CompChatSegmentEvents = 'chat-segment-ready' | 'loader-shown' | 'loader-hidden';
