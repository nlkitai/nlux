import {BaseComp} from '../../../exports/aiChat/comp/base';
import {Model} from '../../../exports/aiChat/comp/decorators';
import {ControllerContext} from '../../../types/controllerContext';
import {Exception, ExceptionType} from '../../../types/exception';
import {renderExceptionsBox} from './render';
import {
    CompExceptionsBoxActions,
    CompExceptionsBoxElements,
    CompExceptionsBoxEvents,
    CompExceptionsBoxProps,
} from './types';
import {updateExceptionsBox} from './update';

const alertTimeout = 3000;

@Model('exceptions-box', renderExceptionsBox, updateExceptionsBox)
export class CompExceptionsBox extends BaseComp<
    CompExceptionsBoxProps,
    CompExceptionsBoxElements,
    CompExceptionsBoxEvents,
    CompExceptionsBoxActions
> {
    private alertExpiryTimer?: ReturnType<typeof setTimeout> | null;
    private alertShowing = false;
    private alertsQueue: Exception[] = [];

    constructor(
        context: ControllerContext,
        props: CompExceptionsBoxProps,
    ) {
        super(context, props);
    }

    public destroy() {
        super.destroy();
        if (this.alertExpiryTimer) {
            clearTimeout(this.alertExpiryTimer);
        }

        this.alertsQueue = [];
        this.alertShowing = false;
        this.alertExpiryTimer = null;
    }

    public removeAllAlerts() {
        if (this.alertShowing) {
            this.setProp('visible', false);
            this.alertShowing = false;
        }

        if (this.alertExpiryTimer) {
            clearTimeout(this.alertExpiryTimer);
            this.alertExpiryTimer = null;
        }

        this.alertsQueue = [];
    }

    public showAlert(type: ExceptionType, message: string) {
        if (this.alertShowing) {
            this.alertsQueue.push({type, message});
            return;
        }

        this.alertShowing = true;

        this.setProp('type', type);
        this.setProp('message', message);
        this.setProp('visible', true);

        this.alertExpiryTimer = setTimeout(() => {
            this.setProp('visible', false);
            this.alertShowing = false;

            // Hide the alert after a short delay before showing the next alert
            setTimeout(() => {
                this.checkAlertQueue();
            }, 200);
        }, alertTimeout);
    }

    private checkAlertQueue() {
        if (this.alertsQueue.length === 0) {
            return;
        }

        const alert = this.alertsQueue.shift();
        if (!alert) {
            return;
        }

        this.showAlert(alert.type, alert.message);
    }
}
