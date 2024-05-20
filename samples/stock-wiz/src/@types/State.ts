import {AppliedFilters} from './AppliedFilters';
import {Balance} from './Balance';
import {StockRow} from './StockData';

export type State = {
    appliedFilter: AppliedFilters;
    stockRows: StockRow[];
    account: Balance;
};
