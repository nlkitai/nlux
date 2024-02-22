import {MarketCapCategory, MarketCapCategoryId} from '../../../@types/Data.ts';

export const filterMarketCapCategories: MarketCapCategory[] = [
    {id: 'mega', label: 'Mega'},
    {id: 'large', label: 'Large'},
    {id: 'mid', label: 'Mid'},
    {id: 'small', label: 'Small'},
    {id: 'micro', label: 'Micro'},
];

export const filterMarketCapCategoriesById: Record<MarketCapCategoryId, MarketCapCategory> = filterMarketCapCategories
    .reduce((acc, category) => {
        acc[category.id] = category;
        return acc;
    }, {} as Record<MarketCapCategoryId, MarketCapCategory>);
