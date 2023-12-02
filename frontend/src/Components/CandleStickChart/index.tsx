import Chart, { ChartWrapperOptions } from "react-google-charts";
import styles from "./index.module.css";
import { useEffect, useRef } from "react";

interface CloudStickChartProps {
  data: Array<Array<number | string>>;
}

const CandleStickChart: React.FC<CloudStickChartProps> = (
  props: CloudStickChartProps
) => {
  const { data } = props;
  const chartRef = useRef<HTMLElement>(null);

  // useEffect(() => {
  //   // const fallingCandles = chartRef?.current?.q(
  //   //   'rect[fill="#a52714"]'
  //   // );
  //   const fallingCandles = chartRef.current?.querySelectorAll(
  //     'rect[fill="#FB3D58"]'
  //   );
  //   console.log(fallingCandles);
  //   // fallingCandles.forEach(function (e) {
  //   //   e.previousSibling.style.fill = "#a52714";
  //   // });
  //   // const risingCandles = chartElement.querySelectorAll('rect[fill="#0f9d58"]');
  //   // risingCandles.forEach(function (e) {
  //   //   e.previousSibling.style.fill = "#0f9d58";
  //   // });
  // }, [chartRef, chartRef.current]);

  const options: ChartWrapperOptions["options"] = {
    legend: "none",
    backgroundColor: "#191b35",
    candlestick: {
      fallingColor: {
        strokeWidth: 2,
        fill: "#FB3D58",
        stroke: "#FB3D58",
      },
      risingColor: {
        strokeWidth: 2,
        fill: "#0FCD83",
        stroke: "#0FCD83",
      },
    },
    vAxis: {
      gridlines: {
        color: "#282B46",
      },
    },
  };

  return (
    <div className={styles.container}>
      <Chart
        // ref={chartRef}
        chartType="CandlestickChart"
        width="100%"
        data={data}
        options={options}
      />
    </div>
  );
};

export default CandleStickChart;
