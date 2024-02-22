import {Balance} from '../../@types/Balance.ts';
import './AccountOverview.css';

export type AccountOverviewProps = {
    balance: Balance;
};

const gbp = new Intl.NumberFormat('en-EN', {style: 'currency', currency: 'GBP'});
const percent = new Intl.NumberFormat('en-EN', {style: 'percent', minimumFractionDigits: 2});

export const AccountOverview = (props: AccountOverviewProps) => {
    const {
        balance: {
            investedAmount,
            currentValue,
        },
    } = props;

    const gain = currentValue - investedAmount;
    const gainRatio = gain / investedAmount;

    return (
        <div className="account-overview">
            <div className="invested-capital">
                <h3>Invested Capital</h3>
                <span className="value">{gbp.format(investedAmount)}</span>
            </div>
            <div className="current-value">
                <h3>Current Value</h3>
                <span className="value">{gbp.format(currentValue)}</span>
            </div>
            <div className="total-gain">
                <h3>Total Gain</h3>
                <span className="value">{gbp.format(gain)} ({percent.format(gainRatio)})</span>
            </div>
        </div>
    );
};
