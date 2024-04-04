import {ChangeEvent, useCallback} from 'react';
import {MarketCapCategory} from '../../../@types/Data.ts';

export type MarketCapFilterProps = {
    selectedMarketCaps: string[];
    availableMarketCaps: MarketCapCategory[];
    setMarketCapsFilter: (marketCapIds: string[]) => void;
};

export const MarketCapFilter = (props: MarketCapFilterProps) => {
    const {
        selectedMarketCaps,
        availableMarketCaps,
        setMarketCapsFilter,
    } = props;

    const handleMarketCapChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const {name, checked} = event.target;
        const marketCaps = checked
            ? [...selectedMarketCaps, name]
            : selectedMarketCaps.filter((marketCap) => marketCap !== name);

        setMarketCapsFilter(marketCaps);
    }, [selectedMarketCaps, setMarketCapsFilter]);

    return (
        <div className="criterion market-cap">
            <span className="title">Market Cap</span>
            <ul className="options">
                {availableMarketCaps.map(({id, label}) => (
                    <li key={id}>
                        <input
                            type="checkbox"
                            id={`market-cap-${id}`}
                            name={id}
                            checked={selectedMarketCaps.includes(id)}
                            onChange={handleMarketCapChange}
                        />
                        <label htmlFor={`market-cap-${id}`}>{label}</label>
                    </li>
                ))}
            </ul>
        </div>
    );
};
