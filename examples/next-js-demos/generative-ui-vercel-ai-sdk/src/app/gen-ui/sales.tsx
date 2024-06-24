import {CSSProperties} from 'react';

const getItemStyle = (percentage: number, multiplier: number): CSSProperties => {
    return {
        minWidth: `${percentage * multiplier}%`,
        backgroundColor: 'rgb(241 177 101)',
        borderRadius: '5px',
        display: 'flex',
        flexDirection: 'row',
        height: '40px',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '5px 0',
        padding: '10px',

    };
};

const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    alignItems: 'flex-start',
    width: '100%',
}

const textStyle: CSSProperties = {
    alignItems: 'center',
    width: '130px',
    left: '0',
    justifyContent: 'flex-end',
}

const titleStyle: CSSProperties = {
    width: '100%',
    textAlign: 'center',
}

type SalesData = Array<{
    item: string,
    percentage: number,
}>;

export default function sales({data, title} : {title: string, data: SalesData}) {
    const max = 49;
    const multiplier = 100 / max;
    return (
        <div style={containerStyle}>
            <div style={titleStyle}>{title}</div>
            {data.map(({percentage, item}) => (
                <div key={item} style={getItemStyle(percentage, multiplier)}><span style={textStyle}>{item}: {percentage}%</span></div>
            ))}
        </div>
    );
};
