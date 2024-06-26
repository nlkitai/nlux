'use server';

import SalesOverview from '@/app/gen-ui/sales';
import {streamUI} from 'ai/rsc';
import {openai} from '@ai-sdk/openai';
import {z} from 'zod';

import { StreamedServerComponentProps } from '@nlux/react';

const LoadingComponent = () => (
    <div className="animate-pulse p-4">Generating</div>
);

const getWeather = async (location: string) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return '82°F️ ☀️';
};

interface WeatherProps {
    location: string;
    weather: string;
}

const WeatherComponent = (props: WeatherProps) => (
    <div className="border border-neutral-200 p-4 rounded-lg max-w-fit">
        The weather in {props.location} is {props.weather}
    </div>
);

export default async function StreamComponent({ message } : StreamedServerComponentProps) {
    const result = await streamUI({
        model: openai('gpt-4o'),
        prompt: message,
        text: ({ content }) => <div>{content}</div>,
        tools: {
            salesOverview: {
                description: 'Show a graph with an overview of sales',
                parameters: z.object({
                    title: z.string(),
                    data: z.array(z.object({
                        item: z.string(),
                        percentage: z.number(),
                    })),
                }),
                generate: async function* ({ title, data }) {
                    yield <LoadingComponent/>;
                    return <SalesOverview title={title} data={data} />;
                },
            },
            getWeather: {
                description: 'Get the weather for a location',
                parameters: z.object({
                    location: z.string(),
                }),
                generate: async function* ({ location }) {
                    yield <LoadingComponent/>;
                    const weather = await getWeather(location);
                    return <WeatherComponent weather={weather} location={location}/>;
                },
            },
        },
    });

    return result.value;
}
