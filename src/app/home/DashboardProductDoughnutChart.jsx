import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardProductDoughnutChart = ({ data = [] }) => {
  const labels = data.map((item) => item.invoice_product);
  const values = data.map((item) => Number(item.total_value));

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        hoverOffset: 6,
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 10,
          padding: 12,
          color: "#475569",
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: "#ffffff",
        titleColor: "#0f172a",
        bodyColor: "#334155",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        callbacks: {
          label: (ctx) => `₹ ${ctx.raw}`,
        },
      },
    },
  };

  return (
    <Card className="bg-white/80 backdrop-blur border border-slate-200 shadow-sm rounded-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-slate-700">
          Sales by Product
        </CardTitle>
        <p className="text-xs text-slate-500">
          Invoice value grouped by product
        </p>
      </CardHeader>
      <CardContent className="h-[280px] flex items-center justify-center pt-4">
        {data.length ? (
          <Doughnut data={chartData} options={options} />
        ) : (
          <p className="text-sm text-slate-500">No data available</p>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardProductDoughnutChart;
