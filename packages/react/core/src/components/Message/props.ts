import {FC, ReactNode} from 'react';
import {MessageDirection} from '@shared/components/Message/props';

export type MessageProps = {
    uid: string;
    direction: MessageDirection;
    status: 'streaming' | 'complete';
    contentType: 'text' | 'server-component';
    message?: ReactNode | FC<object>;
};
