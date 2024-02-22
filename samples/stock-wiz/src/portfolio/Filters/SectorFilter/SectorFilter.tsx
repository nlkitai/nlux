import {useCallback} from 'react';
import {Sector} from '../../../@types/Data.ts';

export type SectorFilterProps = {
    selectedSectors: string[];
    setSectorsFilter: (sectorIds: string[]) => void;
    availableSectors: Sector[];
};

export const SectorFilter = (props: SectorFilterProps) => {
    const {
        availableSectors,
        selectedSectors,
        setSectorsFilter,
    } = props;

    const handleSectorChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        const {options} = event.target;
        const sectors = Array.from(options).filter(({selected}) => selected).map(({value}) => value);
        setSectorsFilter(sectors);
    }, [setSectorsFilter]);

    return (
        <div className="criterion sector">
            <span className="title">Sector</span>
            <div>
                <select multiple id="sector" name="sector" onChange={handleSectorChange}>
                    {availableSectors.map(({id, label}) => (
                        <option key={id} value={id} selected={selectedSectors.includes(id)}>{label}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};
