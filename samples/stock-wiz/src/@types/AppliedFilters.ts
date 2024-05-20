import {ExchangeId, MarketCapCategoryId, SectorId} from './Data';

export type AppliedFilters = {
    exchanges: ExchangeId[];
    marketCaps: MarketCapCategoryId[];
    sectors: SectorId[];
    oneWeekChange: number | null;
    oneMonthChange: number | null;
};
