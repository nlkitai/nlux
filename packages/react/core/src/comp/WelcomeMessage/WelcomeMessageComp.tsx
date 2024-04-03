import {
    compWelcomeMessageClassName,
    compWelcomeMessagePersonaNameClassName,
    compWelcomeMessageTextClassName,
} from '@nlux/core';
import React from 'react';
import {ChatPictureComp} from '../ChatPicture/ChatPictureComp';
import {WelcomeMessageProps} from './props';

export const WelcomeMessageComp = (props: WelcomeMessageProps) => {
    return (
        <div className={compWelcomeMessageClassName}>
            <ChatPictureComp
                picture={props.picture}
                name={props.name}
            />
            <div className={compWelcomeMessagePersonaNameClassName}>
                {props.name}
            </div>
            {props.message && (
                <div className={compWelcomeMessageTextClassName}>{props.message}</div>
            )}
        </div>
    );
};
