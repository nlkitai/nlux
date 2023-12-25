import {AdapterController, createAdapterController} from './adapters';

export interface AdapterControllerBuilder {
    withFetchText: (includeFetchText?: boolean) => AdapterControllerBuilder;
    withStreamText: (includeStreamText?: boolean) => AdapterControllerBuilder;
    create(): AdapterController;
}

class AdapterBuilder implements AdapterControllerBuilder {
    private created = false;
    private shouldIncludeFetchText = false;
    private shouldIncludeStreamText = false;

    create() {
        if (this.created) {
            throw new Error('AdapterControllerBuilder already created');
        }

        this.created = true;
        return createAdapterController({
            includeFetchText: this.shouldIncludeFetchText,
            includeStreamText: this.shouldIncludeStreamText,
        });
    }

    withFetchText(includeFetchText: boolean = true): AdapterControllerBuilder {
        this.shouldIncludeFetchText = includeFetchText;
        return this;
    }

    withStreamText(includeFetchText: boolean = true): AdapterControllerBuilder {
        this.shouldIncludeStreamText = includeFetchText;
        return this;
    }
}

export const adapterBuilder = () => new AdapterBuilder();
