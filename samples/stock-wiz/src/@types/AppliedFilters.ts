import {ExchangeId, MarketCapCategoryId, SectorId} from './Data.ts';

export type AppliedFilters = {
    exchanges: ExchangeId[];
    marketCaps: MarketCapCategoryId[];
    sectors: SectorId[];
    oneWeekChange: number | null;
    oneMonthChange: number | null;
};
