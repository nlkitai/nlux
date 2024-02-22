import {useCallback, useState} from 'react';

export type OneWeekChangeFilterProps = {
    oneWeekChange: number | null;
    setOneWeekChangeFilter: (oneWeekChange: number | null) => void;
};

export const OneWeekChangeFilter = (props: OneWeekChangeFilterProps) => {
    const {oneWeekChange, setOneWeekChangeFilter} = props;
    const [inputValue, setInputValue] = useState<string>(`${oneWeekChange ?? ''}`);

    const handleOneWeekChangeBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
        try {
            const oneWeekChange = parseFloat(event.target.value);
            if (isNaN(oneWeekChange)) {
                setOneWeekChangeFilter(null);
                setInputValue('');
                return;
            }

            setOneWeekChangeFilter(oneWeekChange);
        } catch (error) {
            setOneWeekChangeFilter(null);
            setInputValue('');
        }
    }, [setOneWeekChangeFilter, setInputValue]);

    return (
        <div className="criterion w-change">
            <span className="title">1 Week<br/>Change %<br/>&gt; / &lt;</span>
            <div>
                <input
                    type="number"
                    id="1w-change"
                    name="1w-change"
                    value={inputValue}
                    onBlur={handleOneWeekChangeBlur}
                    onChange={(event) => setInputValue(event.target.value)}
                />
            </div>
        </div>
    );
};
