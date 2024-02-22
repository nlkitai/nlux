import './Portfolio.css';
import {useEffect, useState} from 'react';
import {AppliedFilters} from '../@types/AppliedFilters.ts';
import {State} from '../@types/State.ts';
import {StockData, StockRow} from '../@types/StockData.ts';
import {AccountOverview} from './AccountOverview/AccountOverview.tsx';
import {applyFilter} from './applyFilter.ts';
import {Filters} from './Filters/Filters.tsx';
import {StatusBar} from './StatusBar/StatusBar.tsx';
import {StockList} from './StockList/StockList.tsx';

export type PortfolioProps = {
    state: State;
    actions: {
        updateRowSelection: (id: string, selected: boolean) => void;
        setFilter: (filter: AppliedFilters) => void;
    };
};

export const Portfolio = (props: PortfolioProps) => {
    const {state, actions} = props;

    const [
        filteredStockRows,
        setFilteredStockRows,
    ] = useState<StockRow[]>([]);

    const [selectedStocks, setSelectedStocks] = useState<StockData[]>([]);

    useEffect(
        () => setFilteredStockRows(applyFilter(state.stockRows, state.appliedFilter)),
        [state.stockRows, state.appliedFilter],
    );

    useEffect(() => {
        setSelectedStocks(
            filteredStockRows.filter((stockRow) => stockRow.selected).map((stockRow) => stockRow.data),
        );
    }, [filteredStockRows]);

    return (
        <div className="portfolio">
            <AccountOverview balance={state.account}/>
            <Filters appliedFilters={state.appliedFilter} applyFilters={actions.setFilter}/>
            <StockList stockRows={filteredStockRows} updateRowSelection={actions.updateRowSelection}/>
            <StatusBar selectedStocks={selectedStocks}/>
        </div>
    );
};
