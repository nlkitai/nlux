import './App.css';
import {useMemo} from 'react';
import {MyAiContext} from '../context.tsx';
import {StockWiz} from '../StockWiz.tsx';

export const App = () => {
    const initialData = useMemo(() =>
            ({
                'appName': {
                    value: 'Stock Wiz',
                    description: 'The name of the application',
                },
                'appVersion': {
                    value: '0.1.0',
                    description: 'The version of the application',
                },
            })
        , []);

    return (
        <MyAiContext.Provider initialContext={initialData}>
            <StockWiz/>
        </MyAiContext.Provider>
    );
};
