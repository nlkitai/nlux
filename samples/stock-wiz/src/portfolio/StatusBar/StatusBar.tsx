import './StatusBar.css';
import {StockData} from '../../@types/StockData.ts';

export type StatusBarProps = {
    selectedStocks: StockData[];
};

export const StatusBar = (props: StatusBarProps) => {
    const {selectedStocks} = props;
    const selectedStocksCount = selectedStocks.length;
    const canAddToWatchlist = selectedStocksCount > 0;

    return (
        <div className="status-bar">
            <div className="items-selected">
                {selectedStocksCount} item{selectedStocksCount === 1 ? '' : 's'} selected
            </div>
            <div className="actions">
                <button disabled={!canAddToWatchlist}>Add To Watchlist</button>
                <button style={{display: 'none'}}>Place An Order</button>
            </div>
        </div>
    );
};
