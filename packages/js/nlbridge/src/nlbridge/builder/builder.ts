import {AdapterBuilder, DataTransferMode, StandardAdapter} from '@nlux/core';

export interface NlBridgeAdapterBuilder extends AdapterBuilder {
    create(): StandardAdapter;
    withDataTransferMode(mode: DataTransferMode): NlBridgeAdapterBuilder;
    withUrl(endpointUrl: string): NlBridgeAdapterBuilder;
}
