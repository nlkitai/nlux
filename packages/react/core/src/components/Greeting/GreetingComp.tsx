import {
    className as compGreetingClassName,
    personaNameClassName as compGreetingPersonaNameClassName,
} from '@shared/components/Greeting/create';
import {
    greetingTextClassName as compGreetingTextClassName,
} from '@shared/components/Greeting/utils/updateGreetingText';
import {ReactNode} from 'react';
import {AvatarComp} from '../Avatar/AvatarComp';
import {GreetingProps} from './props';

export const GreetingComp = (props: GreetingProps) => {
    return (
        <div className={compGreetingClassName}>
            <AvatarComp
                avatar={props.avatar}
                name={props.name}
            />
            <div className={compGreetingPersonaNameClassName}>
                {props.name}
            </div>
            {props.message && (
                <div className={compGreetingTextClassName}>{props.message}</div>
            )}
        </div>
    );
};

export const GreetingContainer = ({children}: {children: ReactNode}) => {
    return (
        <div className={compGreetingClassName}>
            {children}
        </div>
    );
};
