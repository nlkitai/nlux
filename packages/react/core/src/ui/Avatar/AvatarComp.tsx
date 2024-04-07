import {
    renderedInitialsClassName,
    renderedPhotoClassName,
    renderedPhotoContainerClassName,
} from '@nlux-dev/core/src/ui/Avatar/utils/createPhotoContainerFromUrl';
import {compAvatarClassName} from '@nlux/core';
import {isValidElement} from 'react';
import {AvatarProps} from './props';

export const AvatarComp = (props: AvatarProps) => {
    const isPictureUrl = typeof props.picture === 'string';
    const isPictureElement = !isPictureUrl && isValidElement(props.picture);

    return (
        <div className={compAvatarClassName}>
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
