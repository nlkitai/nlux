import {useCallback} from 'react';
import {AppliedFilters} from '../../@types/AppliedFilters.ts';
import './Filters.css';
import {ExchangeId, MarketCapCategoryId, SectorId} from '../../@types/Data.ts';
import {ExchangeFilter} from './ExchangeFilter/ExchangeFilter.tsx';
import {filterExchanges, filterExchangesById} from './ExchangeFilter/values.ts';
import {MarketCapFilter} from './MarketCapFilter/MarketCapFilter.tsx';
import {filterMarketCapCategories, filterMarketCapCategoriesById} from './MarketCapFilter/values.ts';
import {OneMonthChangeFilter} from './OneMonthChangeFilter/OneMonthChangeFilter.tsx';
import {OneWeekChangeFilter} from './OneWeekChangeFilter/OneWeekChangeFilter.tsx';
import {SectorFilter} from './SectorFilter/SectorFilter.tsx';
import {filterSectors, filterSectorsById} from './SectorFilter/values.ts';

export type FiltersProps = {
    appliedFilters: AppliedFilters;
    applyFilters: (newFilters: AppliedFilters) => void;
};

export const Filters = (props: FiltersProps) => {
    const {appliedFilters, applyFilters} = props;

    const setSelectedExchanges = useCallback((newExchangeIds: string[]) => {
        // Filter out any exchange ids that are not in the pre-defined list of exchanges
        const newExchangesToApply = newExchangeIds.filter(
            (newExchangeId) => (filterExchangesById as never)[newExchangeId],
        ) as ExchangeId[];

        applyFilters({...appliedFilters, exchanges: newExchangesToApply!});
    }, [appliedFilters, applyFilters]);

    const setSelectedMarketCaps = useCallback((newMarketCaps: string[]) => {
        // Filter out any market cap ids that are not in the pre-defined list of market caps
        const newMarketCapsToApply = newMarketCaps.filter(
            (newMarketCap) => (filterMarketCapCategoriesById as never)[newMarketCap],
        ) as MarketCapCategoryId[];

        applyFilters({...appliedFilters, marketCaps: newMarketCapsToApply!});
    }, [appliedFilters, applyFilters]);

    const setSelectedSectors = useCallback((newSectors: string[]) => {
        // Filter out any sector ids that are not in the pre-defined list of sectors
        const newSectorsToApply = newSectors.filter(
            (newSector) => (filterSectorsById as never)[newSector],
        ) as SectorId[];

        applyFilters({...appliedFilters, sectors: newSectorsToApply!});
    }, [appliedFilters, applyFilters]);

    return (
        <div className="filter">
            <ExchangeFilter
                availableExchanges={filterExchanges}
                setExchangesFilter={setSelectedExchanges}
                selectedExchanges={appliedFilters.exchanges ?? []}
            />
            <MarketCapFilter
                availableMarketCaps={filterMarketCapCategories}
                setMarketCapsFilter={setSelectedMarketCaps}
                selectedMarketCaps={appliedFilters.marketCaps ?? []}
            />
            <SectorFilter
                availableSectors={filterSectors}
                setSectorsFilter={setSelectedSectors}
                selectedSectors={appliedFilters.sectors ?? []}
            />
            <OneWeekChangeFilter
                oneWeekChange={appliedFilters.oneWeekChange}
                setOneWeekChangeFilter={(oneWeekChange) => applyFilters({...appliedFilters, oneWeekChange})}
            />
            <OneMonthChangeFilter
                oneMonthChange={appliedFilters.oneMonthChange}
                setOneMonthChangeFilter={(oneMonthChange) => applyFilters({...appliedFilters, oneMonthChange})}
            />
        </div>
    );
};
