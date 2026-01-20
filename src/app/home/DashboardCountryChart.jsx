import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const DashboardCountryBarChart = ({ data = [] }) => {
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      const el = document.getElementById("country-bar-chart-container");
      if (el) setContainerWidth(el.offsetWidth);
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const labels = data.map((item) => item.invoice_destination_country);
  const values = data.map((item) => Number(item.total_value));

  const chartData = {
    labels,
    datasets: [
      {
        label: "Invoice Value",
        data: values,
        backgroundColor: "#60a5fa",
        borderRadius: 8,
        maxBarThickness: 36,
        categoryPercentage: 0.7,
        barPercentage: 0.8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0f172a",
        titleColor: "#fff",
        bodyColor: "#fff",
        callbacks: {
          label: (ctx) => `₹ ${ctx.raw?.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#64748b",
          font: { size: 12 },
          autoSkip: true,
          maxRotation: 0,
          minRotation: 0,
          callback: function (value) {
            const label = this.getLabelForValue(value);
            return label.length > 12 ? `${label.slice(0, 12)}…` : label;
          },
        },
      },
      y: {
        grid: { color: "#e5e7eb" },
        ticks: {
          color: "#64748b",
          callback: (v) => `₹ ${v.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <Card className="w-full overflow-hidden border border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-slate-700">
          Sales by Country
        </CardTitle>
        <p className="text-xs text-slate-500">
          Invoice value grouped by destination
        </p>
      </CardHeader>

      <CardContent
        id="country-bar-chart-container"
        className="h-[280px] w-full"
      >
        {data.length ? (
          <Bar
            key={containerWidth} // ✅ Forces chart to resize when container width changes
            data={chartData}
            options={options}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            No country data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCountryBarChart;
