import {Sector, SectorId} from '../../../@types/Data.ts';

export const filterSectors: Sector[] = [
    {id: 'technology', label: 'Technology'},
    {id: 'renewable-energy', label: 'Renewable Energy'},
    {id: 'financial-services', label: 'Finance'},
    {id: 'healthcare', label: 'Healthcare'},
    {id: 'consumer-goods', label: 'Consumer Goods'},
    {id: 'industrial', label: 'Industrial'},
    {id: 'utilities', label: 'Utilities'},
    {id: 'real-estate', label: 'Real Estate'},
];

export const filterSectorsById: Record<SectorId, Sector> = filterSectors
    .reduce((acc, sector) => {
        acc[sector.id] = sector;
        return acc;
    }, {} as Record<SectorId, Sector>);
