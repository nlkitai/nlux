import {isValidElement} from 'react';
import {className as compAvatarClassName} from '../../../../../shared/src/ui/Avatar/create';
import {
    renderedInitialsClassName as compAvatarInitialsClassName,
    renderedPhotoClassName as compAvatarPhotoClassName,
    renderedPhotoContainerClassName as compAvatarPhotoContainerClassName,
} from '../../../../../shared/src/ui/Avatar/utils/createPhotoContainerFromUrl';
import {AvatarProps} from './props';

export const AvatarComp = (props: AvatarProps) => {
    const isAvatarUrl = typeof props.avatar === 'string';
    const isAvatarElement = !isAvatarUrl && isValidElement(props.avatar);

    return (
        <div className={compAvatarClassName}>
            {isAvatarElement && props.avatar}
            {!isAvatarElement && isAvatarUrl && (
                <div className={compAvatarPhotoContainerClassName}>
                    <span className={compAvatarInitialsClassName}>
                        {props.name && props.name.length > 0 ? props.name[0].toUpperCase() : ''}
                    </span>
                    {props.avatar && (
                        <div
                            className={compAvatarPhotoClassName}
                            style={{
                                backgroundImage: `url("${encodeURI(props.avatar as string)}")`,
                            }}
                        />
                    )}
                </div>
            )}
        </div>
    );
};
