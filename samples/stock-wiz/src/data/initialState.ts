import {State} from '../@types/State';
import {stocks} from './stocks';

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
