import React, { useState } from "react";
import { Chart } from "react-chartjs-2";

const DepthChart = () => {
  const [chartData, setChartData] = useState({
    labels: ["40,133", "40,133", "40,133", "...", "40,133"],
    datasets: [
      {
        label: "Size",
        data: [0.4273, 0.4273, 0.4273, 0.4273, 0.4273],
        backgroundColor: "rgba(0, 0, 255, 0.2)",
      },
      {
        label: "Sum",
        data: [48.958, 48.958, 48.958, 48.958, 48.958],
        backgroundColor: "rgba(255, 0, 0, 0.2)",
      },
    ],
  });

  const options = {
    legend: {
      display: true,
    },
    scales: {
      xAxis: {
        title: "Price",
      },
      yAxis: {
        title: "Size",
      },
    },
  };

  return (
    <div>
      <Chart type="bar" data={chartData} />
    </div>
  );
};

export default DepthChart;
