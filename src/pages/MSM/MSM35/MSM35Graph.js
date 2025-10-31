import React, { useState, useEffect, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { TabView, TabPanel } from "primereact/tabview";
import MSM35List from "./MSM35List";
import { formatDateAPI, formatDateTH_full2 } from "../../../utils/DateUtil";

export const MSM35Graph = (props) => {
  const [optionsYearByYear, setOptionsYearByYear] = useState({
    chart: {
      zoomType: "xy",
      style: {
        fontFamily: "CSChatThaiUI",
      },
    },
    title: {
      text: "รายงานจำนวนข้อมูลและผลต่างข้อมูลรายวัน เดือนมกราคม 2566",
      align: "center",
    },
    xAxis: [
      {
        ...props.dataGraph.categories,
        crosshair: true,
      },
    ],
    yAxis: [
      {
        // Primary yAxis
        labels: {
          format: "{value} bn",
          style: {
            color: Highcharts.getOptions().colors[1],
          },
          // enabled: true,
        },
        title: {
          text: "จำนวนข้อมูล",
          style: {
            color: Highcharts.getOptions().colors[1],
          },
        },
      },
      {
        title: {
          text: "ผลต่างข้อมูลเทียบวันก่อนหน้า",
          style: {
            color: Highcharts.getOptions().colors[1],
          },
        },
        labels: {
          format: "{value} M",
          style: {
            color: Highcharts.getOptions().colors[1],
          },
        },
        opposite: true,
      },
    ],
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
        },
      },
    },
    tooltip: {
      shared: true,
    },
    legend: {
      align: "center",
      // x: 80,
      verticalAlign: "bottom",
      // y: 80,
      // floating: true,
      backgroundColor:
        Highcharts.defaultOptions.legend.backgroundColor ||
        "rgba(255,255,255,0.25)",
    },
    series: props.dataGraph.series,
  });
  // const [optionsYearByDay, setOptionsYearByDay] = useState({
  //     chart: {
  //         zoomType: 'xy',
  //         style: {
  //             fontFamily: 'CSChatThaiUI'
  //         }
  //     },
  //     title: {
  //         text: 'รายงานจำนวนข้อมูลและผลต่างข้อมูลรายวัน เดือนมกราคม 2566',
  //         align: 'center'
  //     },
  //     xAxis: [
  //         {
  //             ...props.dataGraphDay.categories,
  //             crosshair: true
  //         }
  //     ],
  //     yAxis: [
  //         { // Primary yAxis
  //             labels: {
  //                 format: '{value} bn',
  //                 style: {
  //                     color: Highcharts.getOptions().colors[1]
  //                 },
  //                 // enabled: true,
  //             },
  //             title: {
  //                 text: 'จำนวนข้อมูล',
  //                 style: {
  //                     color: Highcharts.getOptions().colors[1]
  //                 }
  //             },
  //         },
  //         {
  //             title: {
  //                 text: 'ผลต่างข้อมูลเทียบวันก่อนหน้า',
  //                 style: {
  //                     color: Highcharts.getOptions().colors[1]
  //                 }
  //             },
  //             labels: {
  //                 format: '{value} M',
  //                 style: {
  //                     color: Highcharts.getOptions().colors[1]
  //                 }
  //             },
  //             opposite: true
  //         },
  //     ],
  //     plotOptions: {
  //         series: {
  //             dataLabels: {
  //                 enabled: true,
  //             }
  //         }
  //     },
  //     tooltip: {
  //         shared: true
  //     },
  //     legend: {
  //         align: 'center',
  //         // x: 80,
  //         verticalAlign: 'bottom',
  //         // y: 80,
  //         // floating: true,
  //         backgroundColor:
  //             Highcharts.defaultOptions.legend.backgroundColor || 'rgba(255,255,255,0.25)'
  //     },
  //     series: props.dataGraphDay.series,
  // });

  //! รายเดือน
  useEffect(() => {
    setOptionsYearByYear({
      chart: {
        zoomType: "xy",
        style: {
          fontFamily: "CSChatThaiUI",
        },
      },
      title: {
        text: `รายงานจำนวนข้อมูลและผลต่างข้อมูลรายเดือน ปี ${props.searchData.year_start}`,
        align: "center",
      },
      xAxis: [
        {
          ...props.dataGraph.categories,
          crosshair: true,
        },
      ],
      yAxis: [
        {
          // Primary yAxis
          labels: {
            format: "{value} bn",
            style: {
              color: Highcharts.getOptions().colors[1],
            },
            // enabled: true,
          },
          title: {
            text: "จำนวนข้อมูล",
            style: {
              color: Highcharts.getOptions().colors[1],
            },
          },
        },
        {
          title: {
            text: "ผลต่างข้อมูลเทียบวันก่อนหน้า",
            style: {
              color: Highcharts.getOptions().colors[1],
            },
          },
          labels: {
            format: "{value} M",
            style: {
              color: Highcharts.getOptions().colors[1],
            },
          },
          opposite: true,
        },
      ],
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
          },
        },
      },
      tooltip: {
        shared: true,
      },
      legend: {
        align: "center",
        // x: 80,
        verticalAlign: "bottom",
        // y: 80,
        // floating: true,
        backgroundColor:
          Highcharts.defaultOptions.legend.backgroundColor ||
          "rgba(255,255,255,0.25)",
      },
      series: props.dataGraph.series,
    });
  }, [props.dataGraph.categories]);

  //! รายวัน
  useEffect(() => {
    // console.log(props.searchData);
    // setOptionsYearByDay({
    //     chart: {
    //         zoomType: 'xy',
    //         style: {
    //             fontFamily: 'CSChatThaiUI'
    //         }
    //     },
    //     title: {
    //         text: `รายงานจำนวนข้อมูลและผลต่างข้อมูลรายวัน ${formatDateTH_full2(props.searchData.log_dtm)}`,
    //         align: 'center'
    //     },
    //     xAxis: [
    //         {
    //             ...props.dataGraphDay.categories,
    //             crosshair: true
    //         }
    //     ],
    //     yAxis: [
    //         {
    //             title: {
    //                 text: 'ผลต่างข้อมูลเทียบวันก่อนหน้า',
    //                 style: {
    //                     color: Highcharts.getOptions().colors[1]
    //                 }
    //             },
    //             labels: {
    //                 format: '{value} M',
    //                 style: {
    //                     color: Highcharts.getOptions().colors[1]
    //                 }
    //             },
    //             opposite: true,
    //             min: 0
    //         },
    //         {
    //             title: {
    //                 text: 'จำนวนข้อมูล',
    //                 style: {
    //                     color: Highcharts.getOptions().colors[1]
    //                 }
    //             },
    //             labels: {
    //                 format: '{value} bn',
    //                 style: {
    //                     color: Highcharts.getOptions().colors[1]
    //                 },
    //                 enabled: true,
    //             },
    //         },
    //     ],
    //     plotOptions: {
    //         series: {
    //             dataLabels: {
    //                 enabled: true,
    //             }
    //         }
    //     },
    //     tooltip: {
    //         shared: true
    //     },
    //     legend: {
    //         align: 'center',
    //         // x: 80,
    //         verticalAlign: 'bottom',
    //         // y: 80,
    //         // floating: true,
    //         backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || 'rgba(255,255,255,0.25)'
    //     },
    //     series: props.dataGraphDay.series,
    // })
  }, [props.dataGraphDay.categories]);

  return (
    <>
      <TabView
        activeIndex={props.activeIndex}
        onTabChange={(e) => props.onTabChangeClick(e.index)}
      >
        <TabPanel header="รายวัน">
          <HighchartsReact
            highcharts={Highcharts}
            options={props.optionsYearByDay}
          />
          <MSM35List
            dataTable={props.dataTable}
            activeIndex={props.activeIndex}
          />
        </TabPanel>
        <TabPanel header="รายเดือน">
          <HighchartsReact
            highcharts={Highcharts}
            options={optionsYearByYear}
          />
          <MSM35List
            dataTable={props.dataTable}
            activeIndex={props.activeIndex}
          />
        </TabPanel>
        <TabPanel header="รายปี">
          <HighchartsReact
            highcharts={Highcharts}
            options={props.dataGraphYears}
          />
          <MSM35List
            dataTable={props.dataTable}
            activeIndex={props.activeIndex}
          />
        </TabPanel>
      </TabView>
    </>
  );
};
