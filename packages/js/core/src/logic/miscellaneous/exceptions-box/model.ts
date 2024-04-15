import {ExceptionType} from '../../../../../../shared/src/types/exception';
import {BaseComp} from '../../../exports/aiChat/comp/base';
import {Model} from '../../../exports/aiChat/comp/decorators';
import {ControllerContext} from '../../../types/controllerContext';
import {renderExceptionsBox} from './render';
import {
    CompExceptionsBoxActions,
    CompExceptionsBoxElements,
    CompExceptionsBoxEvents,
    CompExceptionsBoxProps,
} from './types';
import {updateExceptionsBox} from './update';

@Model('exceptions-box', renderExceptionsBox, updateExceptionsBox)
export class CompExceptionsBox extends BaseComp<
    CompExceptionsBoxProps,
    CompExceptionsBoxElements,
    CompExceptionsBoxEvents,
    CompExceptionsBoxActions
> {
    constructor(
        context: ControllerContext,
        props: CompExceptionsBoxProps,
    ) {
        super(context, props);
    }

    public destroy() {
        super.destroy();
    }

    public showAlert(type: ExceptionType, message: string) {
        this.executeDomAction('displayException', message);
    }
}
