import {ExchangeId, MarketCapTypeId, SectorId} from './Data.ts';

export type StockData = {
    id: string;
    company: string;
    description: string;
    country: string;
    logoUrl: string;

    symbol: string;
    exchange: ExchangeId;
    sector: SectorId;
    marketCap: string;
    marketCapType: MarketCapTypeId;

    price: number;
    oneDayChange: number;
    oneWeekChange: number;
    oneMonthChange: number;
}

export type StockRow = {
    data: StockData;
    selected: boolean;
};
