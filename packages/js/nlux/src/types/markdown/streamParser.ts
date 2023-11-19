import {IObserver} from '../../core/bus/observer';

export type StreamParser = (root: HTMLElement, options?: {
    skipAnimation?: boolean;
}) => IObserver<string>;
