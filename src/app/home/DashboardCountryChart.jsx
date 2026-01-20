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

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const DashboardCountryBarChart = ({ data = [] }) => {
  const labels = data.map((item) => item.invoice_destination_country);
  const values = data.map((item) => Number(item.total_value));

  const chartData = {
    labels,
    datasets: [
      {
        label: "Invoice Value",
        data: values,
        backgroundColor: "#60a5fa", // blue-400 (lighter)
        borderRadius: 8,
        barThickness: 36,
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
          label: (ctx) => `₹ ${ctx.raw}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#64748b", font: { size: 12 } },
      },
      y: {
        grid: { color: "#e5e7eb" },
        ticks: {
          color: "#64748b",
          callback: (v) => `₹ ${v}`,
        },
      },
    },
  };

  return (
    <Card className="border border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-slate-700">
          Sales by Country
        </CardTitle>
        <p className="text-xs text-slate-500">
          Invoice value grouped by destination
        </p>
      </CardHeader>

      <CardContent className="h-[280px]">
        {data.length ? (
          <Bar data={chartData} options={options} />
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-slate-400">
            No country data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCountryBarChart;
