import {AdapterBuilder, DataTransferMode, StandardAdapter} from '@nlux/core';

export interface NlBridgeAdapterBuilder extends AdapterBuilder<any, any> {
    create(): StandardAdapter<any, any>;
    withDataTransferMode(mode: DataTransferMode): NlBridgeAdapterBuilder;
    withUrl(endpointUrl: string): NlBridgeAdapterBuilder;
}
