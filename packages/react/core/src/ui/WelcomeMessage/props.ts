import {ReactElement} from 'react';

export type WelcomeMessageProps = {
    name: string;
    picture: string | ReactElement;
    message?: string;
};
