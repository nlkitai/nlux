import {ExceptionType} from '../../../types/exception';

export type CompExceptionsBoxEvents = null;

export type CompExceptionsBoxProps = Readonly<{
    type: ExceptionType;
    message: string | undefined;
    visible: boolean;
}>;

export type CompExceptionsBoxEventListeners = Partial<{}>;

export type CompExceptionsBoxElements = Readonly<{}>;

export type CompExceptionsBoxActions = Readonly<{
    show: () => void;
    hide: () => void;
    setMessage: (message: string) => void;
    setMessageType: (type: ExceptionType) => void;
}>;
