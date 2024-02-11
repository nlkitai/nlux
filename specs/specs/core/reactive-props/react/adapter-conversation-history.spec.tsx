import {AiChat} from '@nlux/react';
import {render} from '@testing-library/react';
import React from 'react';
import {beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {submit, type} from '../../../../utils/userInteractions';
import {delayBeforeSendingResponse, waitForMilliseconds, waitForRenderCycle} from '../../../../utils/wait';

describe('When the adapter consuming conversation history is used with a React component', () => {
    let adapterController: AdapterController;

    beforeEach(() => {
        adapterController = adapterBuilder().withFetchText().create();
    });

    it('adapter should receive the initial conversation in extras', async () => {
        render(
            <AiChat
                adapter={adapterController.adapter}
                initialConversation={[
                    {role: 'user', message: 'Hello'},
                    {role: 'ai', message: 'Hi there! How can I help you today?'},
                ]}
            />,
        );

        await type('How is the weather today?');
        await submit();
        await waitForMilliseconds(delayBeforeSendingResponse / 2);

        adapterController.resolve('The weather is great!');
        await waitForMilliseconds(delayBeforeSendingResponse);

        expect(adapterController.getLastExtras()?.conversationHistory).toEqual([
            {role: 'user', message: 'Hello'},
            {role: 'ai', message: 'Hi there! How can I help you today?'},
        ]);
    });

    it('should receive new messages in extras', async () => {
        render(
            <AiChat
                adapter={adapterController.adapter}
                initialConversation={[
                    {role: 'user', message: 'Hello'},
                    {role: 'ai', message: 'Hi there! How can I help you today?'},
                ]}
                conversationOptions={{
                    historyPayloadSize: 3,
                }}
            />,
        );

        await type('How is the weather today?');
        await submit();
        await waitForMilliseconds(delayBeforeSendingResponse / 2);

        adapterController.resolve('The weather is great!');
        await waitForMilliseconds(delayBeforeSendingResponse);

        await type('And tomorrow?');
        await submit();
        await waitForMilliseconds(delayBeforeSendingResponse / 2);

        expect(adapterController.getLastExtras()?.conversationHistory).toEqual([
            {role: 'ai', message: 'Hi there! How can I help you today?'},
            {role: 'user', message: 'How is the weather today?'},
            {role: 'ai', message: 'The weather is great!'},
        ]);
    });

    it('should not receive history when disabled', async () => {
        render(
            <AiChat
                adapter={adapterController.adapter}
                initialConversation={[
                    {role: 'user', message: 'Hello'},
                    {role: 'ai', message: 'Hi there! How can I help you today?'},
                ]}
                conversationOptions={{
                    historyPayloadSize: 'none',
                }}
            />,
        );

        await type('How is the weather today?');
        await submit();
        await waitForMilliseconds(delayBeforeSendingResponse / 2);

        adapterController.resolve('The weather is great!');
        await waitForMilliseconds(delayBeforeSendingResponse);

        expect(adapterController.getLastExtras()?.conversationHistory).toEqual(undefined);
    });

    it('adapter should stop receiving conversation history when option changes', async () => {
        const {rerender} = render(
            <AiChat
                adapter={adapterController.adapter}
                initialConversation={[
                    {role: 'user', message: 'Hello'},
                    {role: 'ai', message: 'Hi there! How can I help you today?'},
                ]}
                conversationOptions={{
                    historyPayloadSize: 'max',
                }}
            />,
        );

        await type('How is the weather today?');
        await submit();
        await waitForMilliseconds(delayBeforeSendingResponse / 2);

        adapterController.resolve('The weather is great!');
        await waitForMilliseconds(delayBeforeSendingResponse);

        expect(adapterController.getLastExtras()?.conversationHistory).toEqual([
            {role: 'user', message: 'Hello'},
            {role: 'ai', message: 'Hi there! How can I help you today?'},
        ]);

        rerender(
            <AiChat
                adapter={adapterController.adapter}
                initialConversation={[
                    {role: 'user', message: 'Hello'},
                    {role: 'ai', message: 'Hi there! How can I help you today?'},
                ]}
                conversationOptions={{
                    historyPayloadSize: 'none',
                }}
            />,
        );

        await type('How is the rain today?');
        await submit();
        await waitForMilliseconds(delayBeforeSendingResponse / 2);

        adapterController.resolve('The rain is great!');
        await waitForMilliseconds(delayBeforeSendingResponse);

        expect(adapterController.getLastExtras()?.conversationHistory).toBeUndefined();
    });

    it('should get adjusted history when option changes', async () => {
        const {rerender} = render(
            <AiChat
                adapter={adapterController.adapter}
                initialConversation={[
                    {role: 'user', message: 'Hello'},
                    {role: 'ai', message: 'Hi there! How can I help you today?'},
                ]}
                conversationOptions={{
                    historyPayloadSize: 1,
                }}
            />,
        );

        await type('How is the weather today?');
        await submit();
        await waitForMilliseconds(delayBeforeSendingResponse / 2);

        adapterController.resolve('The weather is great!');
        await waitForMilliseconds(delayBeforeSendingResponse);

        expect(adapterController.getLastExtras()?.conversationHistory).toEqual([
            {role: 'ai', message: 'Hi there! How can I help you today?'},
        ]);

        rerender(
            <AiChat
                adapter={adapterController.adapter}
                initialConversation={[
                    {role: 'user', message: 'Hello'},
                    {role: 'ai', message: 'Hi there! How can I help you today?'},
                ]}
                conversationOptions={{
                    historyPayloadSize: 'max',
                }}
            />,
        );

        await type('And tomorrow?');
        await submit();
        await waitForMilliseconds(delayBeforeSendingResponse / 2);

        expect(adapterController.getLastExtras()?.conversationHistory).toEqual([
            {role: 'user', message: 'Hello'},
            {role: 'ai', message: 'Hi there! How can I help you today?'},
            {role: 'user', message: 'How is the weather today?'},
            {role: 'ai', message: 'The weather is great!'},
        ]);
    });

    it('should not be impacted by change in initial conversation', async () => {
        const {rerender} = render(
            <AiChat
                adapter={adapterController.adapter}
                initialConversation={[
                    {role: 'user', message: 'Hello'},
                    {role: 'ai', message: 'Hi there! How can I help you today?'},
                ]}
            />,
        );

        await type('How is the weather today?');
        await submit();
        await waitForMilliseconds(delayBeforeSendingResponse / 2);

        adapterController.resolve('The weather is great!');
        await waitForMilliseconds(delayBeforeSendingResponse);

        expect(adapterController.getLastExtras()?.conversationHistory).toEqual([
            {role: 'user', message: 'Hello'},
            {role: 'ai', message: 'Hi there! How can I help you today?'},
        ]);

        rerender(
            <AiChat
                adapter={adapterController.adapter}
                initialConversation={[
                    {role: 'user', message: 'Bonjour'},
                    {role: 'ai', message: 'Bonsoir! Vous avez besoin d\'aide?'},
                ]}
                conversationOptions={{
                    historyPayloadSize: 'max',
                }}
            />,
        );

        await waitForRenderCycle();

        await type('Non, merci');
        await submit();
        await waitForMilliseconds(delayBeforeSendingResponse / 2);

        expect(adapterController.getLastExtras()?.conversationHistory).toEqual([
            {role: 'user', message: 'Hello'},
            {role: 'ai', message: 'Hi there! How can I help you today?'},
            {role: 'user', message: 'How is the weather today?'},
            {role: 'ai', message: 'The weather is great!'},
        ]);

        await waitForRenderCycle();
        adapterController.resolve('Ca marche!');

        await type('Ok!');
        await submit();
        await waitForMilliseconds(delayBeforeSendingResponse / 2);

        expect(adapterController.getLastExtras()?.conversationHistory).toEqual([
            {role: 'user', message: 'Hello'},
            {role: 'ai', message: 'Hi there! How can I help you today?'},
            {role: 'user', message: 'How is the weather today?'},
            {role: 'ai', message: 'The weather is great!'},
            {role: 'user', message: 'Non, merci'},
            {role: 'ai', message: 'Ca marche!'},
        ]);
    });
});
