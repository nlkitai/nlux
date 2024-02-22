import './Row.css';
import {ChangeEvent, useCallback} from 'react';
import {Column} from '../../../@types/Column.ts';
import {StockData} from '../../../@types/StockData.ts';

export type RowProps = {
    item: StockData;
    columns: Column[];
    selected: boolean;
    updateSelection: (id: string, selected: boolean) => void;
};

export const Row = (props: RowProps) => {
    const {item, selected, updateSelection, columns} = props;
    const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        updateSelection(item.id, event.target.checked);
    }, [item.id, updateSelection]);

    const handleRowClick = useCallback(() => {
        updateSelection(item.id, !selected);
    }, [item.id, selected, updateSelection]);

    return (
        <div className="row">
            <div style={{width: '50px'}}>
                <input type="checkbox" checked={selected} onChange={handleChange}/>
            </div>
            {columns.map((column) => (
                <div className="cell" key={column.field} style={{width: column.width}} onClick={handleRowClick}>
                    <span className="value">{item[column.field as keyof StockData] ?? '-'}</span>
                </div>
            ))}
        </div>
    );
};
