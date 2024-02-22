import {AppliedFilters} from '../@types/AppliedFilters.ts';
import {StockRow} from '../@types/StockData.ts';

export const applyFilter = (stockRows: StockRow[], filter: AppliedFilters): StockRow[] => {
    return stockRows.filter((stockRow) => {
        const {data} = stockRow;
        if (filter.exchanges?.length && !filter.exchanges.includes(data.exchange)) {
            return false;
        }

        if (filter.marketCaps?.length && !filter.marketCaps.includes(data.marketCapType)) {
            return false;
        }

        if (filter.sectors?.length && !filter.sectors.includes(data.sector)) {
            return false;
        }

        if (filter.oneWeekChange !== null && data.oneWeekChange !== null) {
            if (filter.oneWeekChange > 0 && data.oneWeekChange < filter.oneWeekChange) {
                return false;
            }

            if (filter.oneWeekChange < 0 && data.oneWeekChange > filter.oneWeekChange) {
                return false;
            }
        }

        if (filter.oneMonthChange !== null && data.oneMonthChange !== null) {
            if (filter.oneMonthChange > 0 && data.oneMonthChange < filter.oneMonthChange) {
                return false;
            }

            if (filter.oneMonthChange < 0 && data.oneMonthChange > filter.oneMonthChange) {
                return false;
            }
        }

        return true;
    });
};
