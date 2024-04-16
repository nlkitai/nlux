import {FunctionComponent, ReactElement} from 'react';
import {MessageDirection} from '../../../../../shared/src/ui/Message/props';

export type ChatItemProps<MessageType> = {
    uid: string;
    direction: MessageDirection;
    status: 'rendered' | 'streaming' | 'loading' | 'error';
    loader?: ReactElement;
    message?: MessageType | string;
    customRenderer?: FunctionComponent<{message: MessageType}>;
    name?: string;
    picture?: string | ReactElement;
};

export type ChatItemImperativeProps = {
    streamChunk: (chunk: string) => void;
};
