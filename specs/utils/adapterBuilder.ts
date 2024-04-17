import {AdapterController, createAdapterController} from './adapters';

export interface AdapterControllerBuilder<AiMsg> {
    withFetchText: (includeFetchText?: boolean) => AdapterControllerBuilder<AiMsg>;
    withStreamText: (includeStreamText?: boolean) => AdapterControllerBuilder<AiMsg>;
    create(): AdapterController<AiMsg>;
}

class ChatAdapterBuilder<AiMsg> implements AdapterControllerBuilder<AiMsg> {
    private created = false;
    private shouldIncludeFetchText = false;
    private shouldIncludeStreamText = false;

    create() {
        if (this.created) {
            throw new Error('AdapterControllerBuilder already created');
        }

        this.created = true;
        return createAdapterController<AiMsg>({
            includeFetchText: this.shouldIncludeFetchText,
            includeStreamText: this.shouldIncludeStreamText,
        });
    }

    withFetchText(includeFetchText: boolean = true): AdapterControllerBuilder<AiMsg> {
        this.shouldIncludeFetchText = includeFetchText;
        return this;
    }

    withStreamText(includeFetchText: boolean = true): AdapterControllerBuilder<AiMsg> {
        this.shouldIncludeStreamText = includeFetchText;
        return this;
    }
}

export const adapterBuilder = <AiMsg = string>() => new ChatAdapterBuilder<AiMsg>();
