import './StockList.css';
import {useAiContext} from '@nlux-dev/react/src';
import {useAiTask} from '@nlux-dev/react/src/providers/useAiTask';
import {useMemo} from 'react';
import {StockRow} from '../../@types/StockData';
import {MyAiContext} from '../../context';
import {columns} from '../../data/columns';
import {HeaderRow} from './HeaderRow/HeaderRow';
import {Row} from './Row/Row';

export type StockListProps = {
    stockRows: StockRow[];
    updateRowSelection: (id: string, selected: boolean) => void;
};

export const StockList = (props: StockListProps) => {
    const {stockRows, updateRowSelection} = props;
    const cols = useMemo(() => columns, []);

    useAiContext(MyAiContext, 'Stock List Data', stockRows);

    useAiTask(
        MyAiContext,
        'Select a single stock from the list of stocks displays in the page',
        (stockId: string) => updateRowSelection(stockId, true),
        ['a string representing the ID of the stock to select. if no matching stock is found, set it to null'],
    );

    return (
        <div className="stock-list">
            <HeaderRow columns={cols}/>
            {stockRows.map((stockRow) => (
                <Row
                    key={stockRow.data.id}
                    columns={cols}
                    item={stockRow.data}
                    selected={stockRow.selected}
                    updateSelection={updateRowSelection}
                />
            ))}
        </div>
    );
};
