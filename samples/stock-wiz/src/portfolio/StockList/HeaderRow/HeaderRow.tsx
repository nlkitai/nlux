import './HeaderRow.css';
import {Column} from '../../../@types/Column.ts';

export type HeaderRowProps = {
    columns: Column[];
};

export const HeaderRow = (props: HeaderRowProps) => {
    return (
        <div className="header-row">
            <div style={{width: '50px'}}></div>
            {props.columns.map((column) => (
                <div className="column-header" key={column.field} style={{width: column.width}}>
                    <span className="title">{column.name}</span>
                </div>
            ))}
        </div>
    );
};
