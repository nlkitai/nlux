import {AdapterController, createAdapterController} from './adapters';

export interface AdapterControllerBuilder<AiMsg> {
    withBatchText: (includeBatchText?: boolean) => AdapterControllerBuilder<AiMsg>;
    withStreamText: (includeStreamText?: boolean) => AdapterControllerBuilder<AiMsg>;
    create(): AdapterController<AiMsg>;
}

class ChatAdapterBuilder<AiMsg> implements AdapterControllerBuilder<AiMsg> {
    private created = false;
    private shouldIncludeBatchText = false;
    private shouldIncludeStreamText = false;

    create() {
        if (this.created) {
            throw new Error('AdapterControllerBuilder already created');
        }

        this.created = true;
        return createAdapterController<AiMsg>({
            includeBatchText: this.shouldIncludeBatchText,
            includeStreamText: this.shouldIncludeStreamText,
        });
    }

    withBatchText(includeBatchText: boolean = true): AdapterControllerBuilder<AiMsg> {
        this.shouldIncludeBatchText = includeBatchText;
        return this;
    }

    withStreamText(includeBatchText: boolean = true): AdapterControllerBuilder<AiMsg> {
        this.shouldIncludeStreamText = includeBatchText;
        return this;
    }
}

export const adapterBuilder = <AiMsg = string>() => new ChatAdapterBuilder<AiMsg>();
