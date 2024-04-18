import {ChatItemProps} from '../../../../../../shared/src/ui/ChatItem/props';

export type CompChatItemProps = {
    uid: string;
    domProps: ChatItemProps;
};

export type CompChatItemElements = Readonly<{
    chatItemContainer: HTMLElement;
}>;

export type CompChatItemActions = Readonly<{
    focus: () => void;
    processStreamedChunk: (chunk: string) => void;
}>;

export type CompChatItemEvents = Readonly<{}>;
