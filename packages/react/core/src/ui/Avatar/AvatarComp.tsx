import {isValidElement} from 'react';
import {className as compAvatarClassName} from '../../../../../shared/src/ui/Avatar/create';
import {
    renderedInitialsClassName as compAvatarInitialsClassName,
    renderedPhotoClassName as compAvatarPhotoClassName,
    renderedPhotoContainerClassName as compAvatarPhotoContainerClassName,
} from '../../../../../shared/src/ui/Avatar/utils/createPhotoContainerFromUrl';
import {AvatarProps} from './props';

export const AvatarComp = (props: AvatarProps) => {
    const isPictureUrl = typeof props.picture === 'string';
    const isPictureElement = !isPictureUrl && isValidElement(props.picture);

    return (
        <div className={compAvatarClassName}>
            {isPictureElement && props.picture}
            {!isPictureElement && isPictureUrl && (
                <div className={compAvatarPhotoContainerClassName}>
                    <span className={compAvatarInitialsClassName}>
                        {props.name && props.name.length > 0 ? props.name[0].toUpperCase() : ''}
                    </span>
                    {props.picture && (
                        <div
                            className={compAvatarPhotoClassName}
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
