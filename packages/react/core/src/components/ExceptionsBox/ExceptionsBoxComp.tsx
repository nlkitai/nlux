import {className as compExceptionsBoxClassName} from '../../../../../shared/src/components/ExceptionsBox/create';
import {ExceptionsBoxProps} from './props';

export const ExceptionsBoxComp = (props: ExceptionsBoxProps) => {
    return (
        <div className={compExceptionsBoxClassName}>{props.message}</div>
    );
};
