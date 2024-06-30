import {ReactElement} from 'react';

export type GreetingProps = {
    name: string;
    avatar: string | ReactElement;
    message?: string;
};
