import {Column} from '../@types/Column.ts';

export const columns: Column[] = [
    {field: 'symbol', name: 'Symbol', width: '100px'},
    {field: 'company', name: 'Company', width: '220px'},
    {field: 'sector', name: 'Sector', width: '160px'},
    {field: 'price', name: 'Price', width: '120px'},
    {field: 'oneDayChange', name: '1 Day Change %', width: '100px'},
    {field: 'oneWeekChange', name: '1 Week Change %', width: '100px'},
    {field: 'oneMonthChange', name: '1 Month Change %', width: '100px'},
];
