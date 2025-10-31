import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
export const Dashboard = (props) => {
    const [lineOptions, setLineOptions] = useState({});
    const [stackedOptions, setStackedOptions] = useState({});
    const [pieData, setPieData] = useState([]);

    useEffect(() => {

        //Line
        setLineOptions({
            maintainAspectRatio: false,
            aspectRatio: .6,
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        });

        //     //Stacked
        //     setStackedOptions({
        //         tooltips: {
        //             mode: 'index',
        //             intersect: false
        //         },
        //         responsive: true,
        //         scales: {
        //             xAxes: [{
        //                 stacked: true,
        //                 ticks: {
        //                     fontColor: '#495057'
        //                 },
        //                 gridLines: {
        //                     color: '#ebedef'
        //                 }
        //             }],
        //             yAxes: [{
        //                 stacked: true,
        //                 ticks: {
        //                     fontColor: '#495057'
        //                 },
        //                 gridLines: {
        //                     color: '#ebedef'
        //                 }
        //             }]
        //         },
        //         legend: {
        //             labels: {
        //                 fontColor: '#495057'
        //             }
        //         }
        //     });

    }, [])


    const renderLine = () => {
        return (
            <>
                <Chart type="line" data={props.graphData.chart_series} options={lineOptions} />
            </>
        )
    }

    // const renderStacked = () => {
    //     return (
    //         <>
    //             <Chart type="bar" data={props.graphData.bar_series} options={stackedOptions} />
    //         </>
    //     )
    // }

    const optionsBar = {
        chart: {
            type: 'column'
        },
        title: {
            text: '',
            align: 'left'
        },
        xAxis: {
            categories: props.graphData.categories
        },
        yAxis: {
            min: 0,
            title: {
                text: 'การเข้าใช้งาน'
            },
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: '',
                    color: ( // theme
                        Highcharts.defaultOptions.title.style &&
                        Highcharts.defaultOptions.title.style.color
                    ) || 'gray',
                    textOutline: 'none'
                }
            }
        },
        legend: {
            align: 'center',
            x: 0,
            verticalAlign: 'bottom',
            y: 0,
            // floating: true,
            backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || 'white',
            borderColor: '#CCC',
            // borderWidth: 1,
            shadow: false
        },
        tooltip: {
            headerFormat: '<b>{point.x}</b><br/>',
            pointFormat: '{series.name}: {point.y}<br/>ทั้งหมด: {point.stackTotal} ครั้ง'
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true
                }
            }
        },
        series: props.graphData.newDataBar
    };
    const optionsPie = {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },

        title: {
            text: '',
            align: 'left'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.y}</b> ครั้ง'
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: "<b font-family: 'CSChatThaiUI';>{point.name}</b>: {point.y} ครั้ง"
                },
                showInLegend: true
            }
        },
        colors: ['#64E572', '#ED561B', '#24CBE5', '#FF9655', '#8085e9', '#6AF9C4'],
        series: [{
            name: '',
            colorByPoint: true,
            data: props.graphData.newDataPie
        }]
    };
    return (
        <div>
            <div className="p-grid card">
                <div className='p-col-12'>
                    {renderLine()}
                    {/* <HighchartsReact highcharts={Highcharts} options={options} /> */}
                </div>
                <div className='p-col-7' style={{ marginTop: '30px' }}>
                    {/* {renderStacked()} */}
                    <HighchartsReact highcharts={Highcharts} options={optionsBar} />
                </div>
                <div className='p-col-5' style={{ alignSelf: 'center', marginTop: '30px' }}>
                    {/* {renderPie()} */}
                    <HighchartsReact highcharts={Highcharts} options={optionsPie} />
                </div>
            </div>

        </div>
    )
}