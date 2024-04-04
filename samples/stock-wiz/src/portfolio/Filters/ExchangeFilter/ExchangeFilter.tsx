import {useAiTask} from '@nlux-dev/react/src/providers/useAiTask.ts';
import {useAiContext} from '@nlux/react';
import {ChangeEvent, useCallback} from 'react';
import {Exchange} from '../../../@types/Data.ts';
import {MyAiContext} from '../../../context.tsx';

export type ExchangeFilterProps = {
    selectedExchanges: string[];
    availableExchanges: Exchange[];
    setExchangesFilter: (exchangeIds: string[]) => void;
};

export const ExchangeFilter = (props: ExchangeFilterProps) => {
    const {
        selectedExchanges,
        availableExchanges,
        setExchangesFilter,
    } = props;

    const toggleExchanges = useCallback((...exchangesToggles: boolean[]) => {
        if (!availableExchanges) {
            return;
        }

        if (availableExchanges.length !== exchangesToggles.length) {
            return;
        }

        const exchanges = availableExchanges.filter((_, index) => exchangesToggles[index]);
        setExchangesFilter(exchanges.map(({id}) => id));
    }, [availableExchanges, setExchangesFilter]);

    useAiContext(
        MyAiContext,
        'Applied Filter View',
        selectedExchanges,
    );

    useAiTask(
        MyAiContext,
        'Filter the stocks displayed in the page by exchange',
        toggleExchanges,
        availableExchanges.map(
            (exchange) => `A boolean. Set it to true to include exchange `
                + `"${exchange.label}" (${exchange.id}) ] in the filters applied. Set it to `
                + `false to exclude "${exchange.label}" (${exchange.id}).`,
        ),
    );

    const handleExchangeChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const {name, checked} = event.target;
        const exchanges = checked
            ? [...selectedExchanges, name]
            : selectedExchanges.filter((exchange) => exchange !== name);

        setExchangesFilter(exchanges);
    }, [setExchangesFilter, selectedExchanges]);

    return (
        <div className="criterion exchange">
            <span className="title">Exchange</span>
            <ul className="options">
                {availableExchanges.map(({id, label}) => (
                    <li key={id}>
                        <input
                            type="checkbox"
                            id={`exchange-${id}`}
                            name={id}
                            checked={selectedExchanges.includes(id)}
                            onChange={handleExchangeChange}
                        />
                        <label htmlFor={`exchange-${id}`}>{label}</label>
                    </li>
                ))}
            </ul>
        </div>
    );
};
