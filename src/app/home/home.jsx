import LoadingBar from "@/components/loader/loading-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DASHBOARD } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  CheckCircle,
  ClipboardCheck,
  FileText,
  PackageCheck,
  PieChart,
  Truck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import DashboardCountryBarChart from "./DashboardCountryChart";
import DashboardProductDoughnutChart from "./DashboardProductDoughnutChart";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const StatCard = ({ title, value, icon: Icon }) => (
  <Card className="relative overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-md transition">
    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-transparent" />
    <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
      <CardTitle className="text-xs font-medium text-slate-500">
        {title}
      </CardTitle>
      <div className="p-2 rounded-lg bg-accent/10 text-accent">
        <Icon className="h-4 w-4" />
      </div>
    </CardHeader>
    <CardContent className="relative">
      <div className="text-2xl font-semibold text-slate-800">{value ?? 0}</div>
    </CardContent>
  </Card>
);

const tabVariants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
  exit: { opacity: 0, y: -12 },
};

const Home = () => {
  const today = new Date();
  const [year, setYear] = useState(String(today.getFullYear()));
  const [month, setMonth] = useState(MONTHS[today.getMonth()]);
  const [dashboardData, setDashboardData] = useState(null);

  const { trigger, loading } = useApiMutation();

  const yearMonth = useMemo(() => `${year} ${month}`, [year, month]);

  const years = useMemo(() => {
    const start = 2025;
    const current = new Date().getFullYear();
    return Array.from({ length: current - start + 1 }, (_, i) =>
      String(start + i),
    );
  }, []);

  const fetchDashboard = async () => {
    const formData = new FormData();
    formData.append("year_month", yearMonth);

    const res = await trigger({
      url: DASHBOARD.list,
      method: "POST",
      data: formData,
    });

    if (res) {
      setDashboardData(res);
    }
  };
  console.log(dashboardData, "dashboardData");
  useEffect(() => {
    fetchDashboard();
  }, [yearMonth]);

  if (loading) return <LoadingBar />;

  return (
    <div className="p-4 sm:p-6 bg-slate-50 min-h-screen">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left : Title */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Overview for {month} {year}
          </p>
        </div>

        {/* Right : Filters */}
        <div className="flex gap-3">
          {/* Year Select */}
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-[110px] h-10 bg-white">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Month Select */}
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-[150px] h-10 bg-white">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="Open Contracts"
          value={dashboardData?.contract_count}
          icon={FileText}
        />
        <StatCard
          title="Total Invoices"
          value={dashboardData?.invoice_count}
          icon={ClipboardCheck}
        />
        <StatCard
          title="Order in Hand"
          value={dashboardData?.invoice_order_in_hand}
          icon={CheckCircle}
        />
        <StatCard
          title="Pre Shipment"
          value={dashboardData?.invoice_pre_shipment}
          icon={PackageCheck}
        />
        <StatCard
          title="Dispatched"
          value={dashboardData?.invoice_dispatched}
          icon={Truck}
        />
        <StatCard
          title="Stuffed"
          value={dashboardData?.invoice_stuffed}
          icon={CheckCircle}
        />
      </div>

      {/* <div className="mt-6 overflow-hidden">
        <Tabs defaultValue="sales" className="w-full">
          <TabsList className="bg-white border border-slate-200 rounded-lg">
            <TabsTrigger value="sales" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Country Analytics
            </TabsTrigger>
            <TabsTrigger value="balance" className="gap-2">
              <PieChart className="h-4 w-4" />
              Product Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sales">
            <AnimatePresence mode="wait">
              <motion.div
                key="sales"
                variants={tabVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="mt-4"
              >
                <DashboardCountryBarChart data={dashboardData?.graph1 || []} />
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="balance">
            <AnimatePresence mode="wait">
              <motion.div
                key="balance"
                variants={tabVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="mt-4"
              >
                <DashboardProductDoughnutChart
                  data={dashboardData?.graph2 || []}
                />
              </motion.div>
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </div> */}
    </div>
  );
};

export default Home;
