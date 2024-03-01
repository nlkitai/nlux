import {AssistCallback} from '../aiAssistant/assist';
import {RegisterTaskCallback} from '../aiAssistant/registerTask';
import {UnregisterTaskCallback} from '../aiAssistant/unregisterTask';
import {ClearContextCallback} from './clear';
import {GetContextDataCallback} from './get';
import {SetContextCallback} from './set';
import {UpdateContextCallback} from './update';

export interface ContextAdapter {
    assist: AssistCallback;
    clear: ClearContextCallback;
    get: GetContextDataCallback;
    registerTask: RegisterTaskCallback;
    set: SetContextCallback;
    unregisterTask: UnregisterTaskCallback;
    update: UpdateContextCallback;
}
