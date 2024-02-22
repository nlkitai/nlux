import {useState} from 'react';
import {AppliedFilters} from '../@types/AppliedFilters.ts';
import {State} from '../@types/State.ts';

export type PortfolioActions = {
    updateRowSelection: (id: string, selected: boolean) => void;
    setFilter: (filter: AppliedFilters) => void;
};

export const usePortfolio = (initialState: State) => {
    const [state, setState] = useState<State>(initialState);
    const actions: PortfolioActions = {
        updateRowSelection: (id: string, selected: boolean) => {
            const stockRows = state.stockRows.map((stockRow) => {
                if (stockRow.data.id === id) {
                    return {
                        ...stockRow,
                        selected,
                    };
                }

                return stockRow;
            });

            setState({
                ...state,
                stockRows,
            });
        },
        setFilter: (filter: AppliedFilters) => {
            setState({
                ...state,
                appliedFilter: filter,
            });
        },
    };

    return {
        state,
        actions,
    };
};
