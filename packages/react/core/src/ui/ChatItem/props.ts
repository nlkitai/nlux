import {FunctionComponent, ReactElement} from 'react';
import {MessageDirection} from '../../../../../shared/src/ui/Message/props';

export type ChatItemProps<AiMsg> = {
    uid: string;
    direction: MessageDirection;
    status: 'rendered' | 'streaming' | 'loading' | 'error';
    loader?: ReactElement;
    message?: AiMsg | string;
    customRenderer?: FunctionComponent<{message: AiMsg}>;
    name?: string;
    picture?: string | ReactElement;
};

export type ChatItemImperativeProps = {
    streamChunk: (chunk: string) => void;
};
