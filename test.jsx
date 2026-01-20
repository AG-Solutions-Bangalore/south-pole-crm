import { useEffect, useMemo, useState } from "react";
import LoadingBar from "@/components/loader/loading-bar";
import { DASHBOARD } from "@/constants/apiConstants";
import useDebounce from "@/hooks/useDebounce";
import { useApiMutation } from "@/hooks/useApiMutation";

/* ---------------- Helper: Year-Month Options ---------------- */
const generateYearMonthOptions = (startYear = 2024, yearsAhead = 5) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const options = [];

  for (let year = startYear; year <= startYear + yearsAhead; year++) {
    months.forEach((month) => {
      options.push({
        label: `${year} ${month}`, // UI
        value: `${year} ${month}`, // API expects THIS format
      });
    });
  }

  return options;
};

const Home = () => {
  /* ---------------- State ---------------- */
  const [search, setSearch] = useState("");
  const [yearMonth, setYearMonth] = useState("2026 January"); // default
  const [dashboardData, setDashboardData] = useState(null);

  const debouncedSearch = useDebounce(search);

  /* ---------------- Dropdown Options ---------------- */
  const yearMonthOptions = useMemo(
    () => generateYearMonthOptions(2024, 5),
    []
  );

  /* ---------------- POST Dashboard API ---------------- */
  const { trigger, loading: isLoading } = useApiMutation();

  const fetchDashboard = async () => {
    const formData = new FormData();
    formData.append("year_month", yearMonth);

    // Optional: if API supports search
    if (debouncedSearch?.trim()) {
      formData.append("search", debouncedSearch.trim());
    }

    const res = await trigger({
      url: DASHBOARD.list,
      method: "POST",
      data: formData,
    });

    if (res?.success) {
      setDashboardData(res.data);
    }
  };

  /* ---------------- Effects ---------------- */
  useEffect(() => {
    if (yearMonth) {
      fetchDashboard();
    }
  }, [yearMonth, debouncedSearch]);

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-4 p-4">
      {/* Year-Month Dropdown */}
      <select
        value={yearMonth}
        onChange={(e) => setYearMonth(e.target.value)}
        className="border rounded px-3 py-2 w-60"
      >
        {yearMonthOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Dashboard Content */}
      <div>
        {/* Example render */}
        {/* <pre>{JSON.stringify(dashboardData, null, 2)}</pre> */}
      </div>

      {/* Loader */}
      {isLoading && <LoadingBar />}
    </div>
  );
};

export default Home;
