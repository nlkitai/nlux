import {className, personaNameClassName} from '@nlux-dev/core/src/comp/WelcomeMessage/create';
import {welcomeMessageTextClassName} from '@nlux-dev/core/src/comp/WelcomeMessage/utils/updateWelcomeMessageText';
import React from 'react';
import {ChatPictureComp} from '../ChatPicture/ChatPictureComp';
import {WelcomeMessageProps} from './props';

export const WelcomeMessageComp = (props: WelcomeMessageProps) => {
    return (
        <div className={className}>
            <ChatPictureComp
                picture={props.picture}
                name={props.name}
            />
            <div className={personaNameClassName}>
                {props.name}
            </div>
            {props.message && (
                <div className={welcomeMessageTextClassName}>{props.message}</div>
            )}
        </div>
    );
};
