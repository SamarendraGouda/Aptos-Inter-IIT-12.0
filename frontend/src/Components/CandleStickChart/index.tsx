import { createChart, ColorType } from "lightweight-charts";
import React, { useEffect, useRef } from "react";

//@ts-ignore
export const ChartComponent = (props) => {
  const {
    data,
    colors: {
      textColor = "#ffffff",
      backgroundColor = "#16182E",
      upColor = "#0ECC83",
      downColor = "#FA3C58",
      borderVisible = false,
      wickUpColor = "#26a69a",
      wickDownColor = "#ef5350",
    } = {},
  } = props;

  const chartContainerRef = useRef();

  useEffect(() => {
    if (!chartContainerRef.current) return;
    const handleResize = () => {
      //@ts-ignore
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      //@ts-ignore
      width: 840,
      height: 400,
      grid: {
        vertLines: {
          color: "#363c4e",
        },
        horzLines: {
          color: "#363c4e",
        },
      },
    });
    chart.timeScale().fitContent();

    const newSeries = chart.addCandlestickSeries({
      upColor,
      downColor,
      borderVisible,
      wickUpColor,
      wickDownColor,
    });
    newSeries.setData(data);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      chart.remove();
    };
  }, [
    data,
    backgroundColor,
    textColor,
    upColor,
    downColor,
    borderVisible,
    wickUpColor,
    wickDownColor,
  ]);
  //@ts-ignore
  return <div ref={chartContainerRef} />;
};

const data = [
  { open: 10, high: 10.63, low: 9.49, close: 9.55, time: 1642427876 },
  { open: 9.55, high: 10.3, low: 9.42, close: 9.94, time: 1642514276 },
  { open: 9.94, high: 10.17, low: 9.92, close: 9.78, time: 1642600676 },
  { open: 9.78, high: 10.59, low: 9.18, close: 9.51, time: 1642687076 },
  { open: 9.51, high: 10.46, low: 9.1, close: 10.17, time: 1642773476 },
  { open: 10.17, high: 10.96, low: 10.16, close: 10.47, time: 1642859876 },
  { open: 10.47, high: 11.39, low: 10.4, close: 10.81, time: 1642946276 },
  { open: 10.81, high: 11.6, low: 10.3, close: 10.75, time: 1643032676 },
  { open: 10.75, high: 11.6, low: 10.49, close: 10.93, time: 1643119076 },
  { open: 10.93, high: 11.53, low: 10.76, close: 10.96, time: 1643205476 },
];

//@ts-ignore
export default function CandleStickChart(props) {
  return <ChartComponent {...props} data={data}></ChartComponent>;
}
