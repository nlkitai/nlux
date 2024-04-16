import {FC, ReactElement, ReactNode} from 'react';
import {MessageDirection} from '../../../../../shared/src/ui/Message/props';

export type MessageProps<MessageType> = {
    uid: string;
    direction: MessageDirection;
    status: 'rendered' | 'streaming' | 'loading' | 'error';
    loader?: ReactElement;
    message?: ReactNode | FC<void>;
};
