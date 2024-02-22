import {AppliedFilters} from './AppliedFilters.ts';
import {Balance} from './Balance.ts';
import {StockRow} from './StockData.ts';

export type State = {
    appliedFilter: AppliedFilters;
    stockRows: StockRow[];
    account: Balance;
};
