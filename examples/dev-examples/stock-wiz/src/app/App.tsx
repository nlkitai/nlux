import './App.css';
import {useMemo} from 'react';
import {MyAiContext} from '../context';
import {StockWiz} from '../StockWiz';

export const App = () => {
    const initialContextItems = useMemo(() =>
            ({
                'appName': {
                    value: 'Stock Wiz',
                    description: 'The name of the application being used',
                },
                'appVersion': {
                    value: '0.1.0',
                    description: 'The version of the application',
                },
            })
        , []);

    return (
        <MyAiContext.Provider initialItems={initialContextItems}>
            <StockWiz/>
        </MyAiContext.Provider>
    );
};
