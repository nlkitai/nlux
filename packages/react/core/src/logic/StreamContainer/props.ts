import {MessageDirection} from '../../../../../shared/src/ui/Message/props';

export type StreamContainerProps = {
    uid: string,
    direction: MessageDirection,
    status: 'rendered' | 'streaming' | 'error';
};

export type StreamContainerImperativeProps = {
    streamChunk: (chunk: string) => void;
};
