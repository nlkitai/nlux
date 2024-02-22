import {Exchange, ExchangeId} from '../../../@types/Data.ts';

export const filterExchanges: Exchange[] = [
    {id: 'NYSE', label: 'NYSE'},
    {id: 'NASDAQ', label: 'NASDAQ'},
    {id: 'LSE', label: 'London'},
    {id: 'HK', label: 'Hong Kong'},
];

export const filterExchangesById: Record<ExchangeId, Exchange> = filterExchanges
    .reduce((acc, exchange) => {
        acc[exchange.id] = exchange;
        return acc;
    }, {} as Record<ExchangeId, Exchange>);
