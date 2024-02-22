import {useCallback, useState} from 'react';

export type OneMonthChangeFilterProps = {
    oneMonthChange: number | null;
    setOneMonthChangeFilter: (oneMonthChange: number | null) => void;
};

export const OneMonthChangeFilter = (props: OneMonthChangeFilterProps) => {
    const {oneMonthChange, setOneMonthChangeFilter} = props;
    const [inputValue, setInputValue] = useState<string>(`${oneMonthChange}`);

    const handleOneMonthChangeBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
        try {
            const oneMonthChange = parseFloat(event.target.value);
            if (isNaN(oneMonthChange)) {
                setOneMonthChangeFilter(null);
                setInputValue('');
                return;
            }

            setOneMonthChangeFilter(oneMonthChange);
        } catch (error) {
            setOneMonthChangeFilter(null);
            setInputValue('');
        }
    }, [setOneMonthChangeFilter, setInputValue]);

    return (
        <div className="criterion w-change">
            <span className="title">1 Month<br/>Change %<br/>&gt; / &lt;</span>
            <div>
                <input
                    type="number"
                    id="1m-change"
                    name="1m-change"
                    value={inputValue}
                    onBlur={handleOneMonthChangeBlur}
                    onChange={(event) => setInputValue(event.target.value)}
                />
            </div>
        </div>
    );
};
