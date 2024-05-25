import {ReactElement} from 'react';

export type WelcomeMessageProps = {
    name: string;
    avatar: string | ReactElement;
    message?: string;
};
