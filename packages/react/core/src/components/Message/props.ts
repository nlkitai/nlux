import {FC, ReactNode} from 'react';
import {MessageDirection} from '../../../../../shared/src/components/Message/props';

export type MessageProps = {
    uid: string;
    direction: MessageDirection;
    status: 'streaming' | 'complete';
    message?: ReactNode | FC<object>;
};
