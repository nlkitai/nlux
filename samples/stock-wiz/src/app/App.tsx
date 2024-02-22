import './App.css';
import {useMemo} from 'react';
import {MyAiContext} from '../context.tsx';
import {StockWiz} from '../StockWiz.tsx';

export const App = () => {
    const initialData = useMemo(() =>
            ({'appName': 'Stock Wiz', 'appVersion': '1.0.0'})
        , []);

    return (
        <MyAiContext.Provider value={initialData}>
            <StockWiz/>
        </MyAiContext.Provider>
    );
};
