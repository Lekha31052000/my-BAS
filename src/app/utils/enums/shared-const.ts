export const jobTypes = [
    { type: 'All', value: '', sendValue: 'All' },
    { type: 'Associates', value: 'ASSOCIATES', sendValue: 'ASSOCIATES' },
    { type: 'Driver', value: 'DRIVER', sendValue: 'DRIVER' },
    { type: 'Security', value: 'SECURITY', sendValue: 'SECURITY' },
    { type: 'Facility/House Keeping', value: 'FACILITY', sendValue: 'FACILITY' },
    { type: 'Delivery Associates', value: 'DELIVERY', sendValue: 'DELIVERY' }
];

export const flagFilters = [
    { type: 'All', value: '' },
    { type: 'Green', value: 'GREEN' },
    { type: 'Orange', value: 'ORANGE' },
    { type: 'Red', value: 'RED' }
];

export const duration = [
    { type: 'Custom', value: 'custom' },
    // { type: 'Year', value: 'year' },
    { type: 'Month', value: 'month' },
    { type: 'Quarter', value: 'quarter' },
    { type: 'Week', value: 'week' }
];

export const monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const weekListText = ['1st Week', '2nd Week', '3rd Week', '4th Week', '5th Week', '6th Week'];

export const quarterArray = [{
    month: 'Jan Feb Mar',
    quarterInfo: ['Jan', 'Feb', 'Mar'],
    quarter: 'Quarter 1',
    startDate: 1,
    endDate: 31,
    startMonth: 0,
    endMonth: 2
},
{
    month: 'Apr May Jun',
    quarterInfo: ['Apr', 'May', 'Jun'],
    quarter: 'Quarter 2',
    startDate: 1,
    endDate: 30,
    startMonth: 3,
    endMonth: 5
},
{
    month: 'Jul Aug Sep',
    quarterInfo: ['Jul', 'Aug', 'Sep'],
    quarter: 'Quarter 3',
    startDate: 1,
    endDate: 30,
    startMonth: 6,
    endMonth: 8
},
{
    month: 'Oct Nov Dec',
    quarterInfo: ['Oct', 'Nov', 'Dec'],
    quarter: 'Quarter 4',
    startDate: 1,
    endDate: 31,
    startMonth: 9,
    endMonth: 11
}];




export class AssociatesEnrollementRate {
    chartOptions = {
        chart: {
            type: 'area'
        },
        title: {
            text: `Associate's Enrollment`,
            align: 'left',
            x: 0,
            style: {
                color: '#5baaff91'
            }
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',],
            crosshair: {
                width: 3,
                color: '#5baaff91'
            }, tickmarkPlacement: 'on',
            startOnTick: true
        },
        yAxis: {
            title: {
                text: null
            }
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            area: {
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            },
            series: {
                animation: {
                    duration: 2300
                }
            }
        },
        series: [{
            name: 'Year',
            data: [],
            color: '#5baaff91',
            showInLegend: false
        }],
        lang: {
            noData: "No Data"
        },
        noData: {
            style: {
                fontWeight: 'bold',
                fontSize: '15px',
                color: '#303030'
            }
        }
    };
}

