export type SectorId =
    'technology'
    | 'renewable-energy'
    | 'financial-services'
    | 'healthcare'
    | 'consumer-goods'
    | 'industrial'
    | 'utilities'
    | 'real-estate';

export type Sector = {
    id: SectorId;
    label: string;
};

export type ExchangeId = 'NYSE' | 'NASDAQ' | 'LSE' | 'HK';

export type Exchange = {
    id: ExchangeId;
    label: string;
};

export type MarketCapCategoryId = 'micro' | 'small' | 'mid' | 'large' | 'mega';

export type MarketCapCategory = {
    id: MarketCapCategoryId;
    label: string;
};
