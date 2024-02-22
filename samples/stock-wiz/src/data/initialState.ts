import {State} from '../@types/State.ts';
import {stocks} from './stocks.ts';

export const initialState: State = {
    appliedFilter: {
        exchanges: [],
        sectors: [],
        marketCaps: [],
        oneMonthChange: null,
        oneWeekChange: null,
    },
    account: {
        investedAmount: 10000,
        currentValue: 11226,
    },
    stockRows: stocks.map(stock => ({
        data: stock,
        selected: false,
    })),
};
