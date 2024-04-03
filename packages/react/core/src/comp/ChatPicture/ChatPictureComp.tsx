import {className} from '@nlux-dev/core/src/comp/ChatPicture/create';
import {
    renderedInitialsClassName,
    renderedPhotoClassName,
    renderedPhotoContainerClassName,
} from '@nlux-dev/core/src/comp/ChatPicture/utils/createPhotoContainerFromUrl';
import React from 'react';
import {ChatPictureProps} from './props';

export const ChatPictureComp = (props: ChatPictureProps) => {
    const isPictureUrl = typeof props.picture === 'string';
    const isPictureElement = !isPictureUrl && React.isValidElement(props.picture);

    return (
        <div className={className}>
            {isPictureElement && props.picture}
            {!isPictureElement && isPictureUrl && (
                <div className={renderedPhotoContainerClassName}>
                    <span className={renderedInitialsClassName}>
                        {props.name && props.name.length > 0 ? props.name[0].toUpperCase() : ''}
                    </span>
                    {props.picture && (
                        <div
                            className={renderedPhotoClassName}
                            style={{
                                backgroundImage: `url("${encodeURI(props.picture as string)}")`,
                            }}
                        />
                    )}
                </div>
            )}
        </div>
    );
};
