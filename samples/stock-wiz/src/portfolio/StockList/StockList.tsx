import './StockList.css';
import {useAiContext} from '@nlux-dev/react/src';
import {useEffect, useMemo} from 'react';
import {StockRow} from '../../@types/StockData.ts';
import {MyAiContext} from '../../context.tsx';
import {columns} from '../../data/columns.ts';
import {HeaderRow} from './HeaderRow/HeaderRow.tsx';
import {Row} from './Row/Row.tsx';

export type StockListProps = {
    stockRows: StockRow[];
    updateRowSelection: (id: string, selected: boolean) => void;
};

export const StockList = (props: StockListProps) => {
    const {stockRows, updateRowSelection} = props;
    const cols = useMemo(() => columns, []);

    const compAiContext = useAiContext(MyAiContext, 'stock-list-data');

    useEffect(() => {
        compAiContext.update(stockRows);
        const {cancel} = compAiContext.registerTask(
            'selectStock',
            (stockId: string | null) => stockId && updateRowSelection(stockId, true),
            ['a string representing the ID of the stock to select. if no matching stock is found, set it to null'],
        );

        return () => {
            cancel();
            compAiContext.clear();
        };
    }, [stockRows, compAiContext, updateRowSelection]);

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
