import React, { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import { DashboardPageSkeleton } from "../components/common/PageSkeletons";
import { useAdminStore } from "../stores/admin.store";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from "chart.js";
import { Line, Bar, Doughnut, Radar } from "react-chartjs-2";
import {
  Users,
  FileText,
  MessageSquare,
  TrendingUp,
  Activity,
  BarChart3,
  PieChart,
  Calendar,
  ArrowUp,
} from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend,
  Filler,
);

// Mock data for charts
const generateLineData = (count: number, base: number, variation: number) => {
  return Array.from({ length: count }, (_, i) =>
    Math.max(
      0,
      base + Math.sin(i * 0.5) * variation + (Math.random() - 0.5) * 20,
    ),
  );
};

const generateBarData = (count: number, max: number) => {
  return Array.from(
    { length: count },
    () => Math.floor(Math.random() * max) + 50,
  );
};

const rangeMockData: Record<
  "7d" | "30d" | "90d",
  {
    userGrowth: number[];
    prescriptionActivity: number[];
    pharmacyEngagement: number[];
    platformMetrics: {
      uptime: number;
      responseTime: number;
      errorRate: number;
      satisfaction: number;
    };
    topHospitals: Array<{ name: string; users: number; growth: number }>;
  }
> = {
  "7d": {
    userGrowth: generateLineData(7, 100, 30),
    prescriptionActivity: generateLineData(7, 50, 20),
    pharmacyEngagement: generateBarData(5, 150),
    platformMetrics: {
      uptime: 99.8,
      responseTime: 124,
      errorRate: 0.2,
      satisfaction: 4.7,
    },
    topHospitals: [
      { name: "General Hospital", users: 245, growth: 12 },
      { name: "City Medical", users: 189, growth: 8 },
      { name: "Community Health", users: 156, growth: -2 },
      { name: "Regional Center", users: 134, growth: 15 },
      { name: "University Hospital", users: 98, growth: 5 },
    ],
  },
  "30d": {
    userGrowth: generateLineData(4, 130, 40),
    prescriptionActivity: generateLineData(4, 70, 25),
    pharmacyEngagement: generateBarData(5, 200),
    platformMetrics: {
      uptime: 99.5,
      responseTime: 138,
      errorRate: 0.35,
      satisfaction: 4.5,
    },
    topHospitals: [
      { name: "General Hospital", users: 820, growth: 18 },
      { name: "City Medical", users: 744, growth: 14 },
      { name: "Community Health", users: 692, growth: 9 },
      { name: "Regional Center", users: 621, growth: 11 },
      { name: "University Hospital", users: 575, growth: 7 },
    ],
  },
  "90d": {
    userGrowth: generateLineData(3, 170, 55),
    prescriptionActivity: generateLineData(3, 95, 30),
    pharmacyEngagement: generateBarData(5, 280),
    platformMetrics: {
      uptime: 99.2,
      responseTime: 151,
      errorRate: 0.48,
      satisfaction: 4.3,
    },
    topHospitals: [
      { name: "General Hospital", users: 2140, growth: 24 },
      { name: "City Medical", users: 2015, growth: 21 },
      { name: "Community Health", users: 1884, growth: 17 },
      { name: "Regional Center", users: 1731, growth: 16 },
      { name: "University Hospital", users: 1650, growth: 14 },
    ],
  },
};

const DashboardPage: React.FC = () => {
  const stats = useAdminStore((state) => state.overview);
  const loading = useAdminStore((state) => state.overviewLoading);
  const overviewLoaded = useAdminStore((state) => state.overviewLoaded);
  const fetchOverview = useAdminStore((state) => state.fetchOverview);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("7d");

  const selectedRangeData = rangeMockData[timeRange];

  useEffect(() => {
    if (!overviewLoaded) {
      fetchOverview();
    }
  }, [overviewLoaded, fetchOverview]);

  const getTimeLabels = () => {
    switch (timeRange) {
      case "7d":
        return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      case "30d":
        return ["Week 1", "Week 2", "Week 3", "Week 4"];
      case "90d":
        return ["Month 1", "Month 2", "Month 3"];
      default:
        return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    }
  };

  const timeLabels = getTimeLabels();

  // Ensure we have valid data for charts
  const pharmacyData = selectedRangeData.pharmacyEngagement || [
    50, 75, 100, 125, 150,
  ];
  const userGrowthData = selectedRangeData.userGrowth.slice(
    0,
    timeLabels.length,
  );
  const userGrowthDelta =
    userGrowthData.length > 1
      ? ((userGrowthData[userGrowthData.length - 1] - userGrowthData[0]) /
          Math.max(userGrowthData[0], 1)) *
        100
      : 0;
  const prescriptionGrowthData = selectedRangeData.prescriptionActivity.slice(
    0,
    timeLabels.length,
  );
  const messageData = generateLineData(timeLabels.length, 200, 80);
  const scopedMessageData = messageData.slice(0, timeLabels.length);
  const commonLineOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0f172a",
        titleColor: "#f8fafc",
        bodyColor: "#f8fafc",
        padding: 10,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#64748b", font: { size: 11 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(156, 163, 175, 0.2)" },
        ticks: { color: "#64748b", font: { size: 11 } },
      },
    },
    elements: {
      point: { radius: 3, hoverRadius: 6 },
      line: { tension: 0.35, borderWidth: 3 },
    },
  };

  const userGrowthChartData = {
    labels: timeLabels,
    datasets: [
      {
        label: "Users",
        data: userGrowthData,
        borderColor: "#7c3aed",
        backgroundColor: "rgba(124, 58, 237, 0.18)",
        fill: true,
      },
    ],
  };

  const prescriptionChartData = {
    labels: timeLabels,
    datasets: [
      {
        label: "Prescriptions",
        data: prescriptionGrowthData,
        borderColor: "#8b5cf6",
        backgroundColor: "rgba(139, 92, 246, 0.16)",
        fill: true,
      },
    ],
  };

  const pharmacyChartData = {
    labels: selectedRangeData.topHospitals.map(
      (item) => item.name.split(" ")[0],
    ),
    datasets: [
      {
        label: "Active Users",
        data: pharmacyData,
        backgroundColor: [
          "rgba(124, 58, 237, 0.88)",
          "rgba(244, 63, 94, 0.85)",
          "rgba(167, 139, 250, 0.82)",
          "rgba(109, 40, 217, 0.9)",
          "rgba(232, 121, 249, 0.8)",
        ],
        borderRadius: 10,
      },
    ],
  };

  const pharmacyChartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0f172a",
        titleColor: "#f8fafc",
        bodyColor: "#f8fafc",
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#64748b" } },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(148, 163, 184, 0.2)" },
        ticks: { color: "#64748b" },
      },
    },
  };

  const performanceRadarData = {
    labels: ["Uptime", "Speed", "Low Errors", "Satisfaction"],
    datasets: [
      {
        label: "Platform Score",
        data: [
          selectedRangeData.platformMetrics.uptime,
          ((300 - selectedRangeData.platformMetrics.responseTime) / 300) * 100,
          100 - selectedRangeData.platformMetrics.errorRate,
          (selectedRangeData.platformMetrics.satisfaction / 5) * 100,
        ],
        borderColor: "#f43f5e",
        backgroundColor: "rgba(244, 63, 94, 0.2)",
        pointBackgroundColor: "#f43f5e",
      },
    ],
  };

  const performanceRadarOptions: ChartOptions<"radar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: { display: false },
        grid: { color: "rgba(156, 163, 175, 0.25)" },
        angleLines: { color: "rgba(156, 163, 175, 0.25)" },
        pointLabels: { color: "#64748b", font: { size: 11 } },
      },
    },
  };

  const topHospitalsChartData = {
    labels: selectedRangeData.topHospitals.map((item) => item.name),
    datasets: [
      {
        data: selectedRangeData.topHospitals.map((item) => item.users),
        backgroundColor: [
          "#7c3aed",
          "#f43f5e",
          "#a78bfa",
          "#6d28d9",
          "#64748b",
        ],
        borderWidth: 0,
      },
    ],
  };

  const topHospitalsChartOptions: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#64748b", boxWidth: 12 },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.parsed} users`,
        },
      },
    },
    cutout: "62%",
  };

  const messageChartData = {
    labels: timeLabels,
    datasets: [
      {
        label: "Messages",
        data: scopedMessageData,
        borderColor: "#f43f5e",
        backgroundColor: "rgba(244, 63, 94, 0.16)",
        fill: true,
      },
    ],
  };

  if (loading) {
    return (
      <Layout>
        <DashboardPageSkeleton />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-linear-to-br from-primary-600 via-primary-700 to-slate-900 p-6 text-white shadow-lg shadow-primary-900/15 sm:flex-1 dark:border-slate-700/50">
            <div
              className="pointer-events-none absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_100%_0%,rgba(244,63,94,0.35),transparent_45%)]"
              aria-hidden
            />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary-100/90">
                Overview
              </p>
              <h1 className="mt-1 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Dashboard
              </h1>
              <p className="mt-2 text-sm text-white/85">
                EzyMed admin analytics and platform signals.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-primary-500/30 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <Calendar className="h-5 w-5 text-slate-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-linear-to-br from-primary-600 to-primary-800 p-6 text-white shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary-100">
                  Total users
                </p>
                <p className="mt-2 text-3xl font-bold tabular-nums">
                  {stats?.users || 0}
                </p>
              </div>
              <Users className="h-8 w-8 text-primary-200" />
            </div>
            <div className="mt-4 flex items-center gap-1">
              <ArrowUp className="h-4 w-4" />
              <span className="text-sm text-primary-100">
                +12.5% from last period
              </span>
            </div>
          </div>

          <div className="rounded-2xl bg-linear-to-br from-primary-800 to-primary-950 p-6 text-white shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary-200">
                  Prescriptions
                </p>
                <p className="mt-2 text-3xl font-bold tabular-nums">
                  {stats?.prescriptions || 0}
                </p>
              </div>
              <FileText className="h-8 w-8 text-primary-300" />
            </div>
            <div className="mt-4 flex items-center gap-1">
              <ArrowUp className="h-4 w-4" />
              <span className="text-sm text-primary-200">
                +8.3% from last period
              </span>
            </div>
          </div>

          <div className="rounded-2xl bg-linear-to-br from-secondary to-[#be123c] p-6 text-white shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/90">Messages</p>
                <p className="mt-2 text-3xl font-bold tabular-nums">
                  {stats?.messages || 0}
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-white/80" />
            </div>
            <div className="mt-4 flex items-center gap-1">
              <ArrowUp className="h-4 w-4" />
              <span className="text-sm text-white/90">
                +23.1% from last period
              </span>
            </div>
          </div>

          <div className="rounded-2xl bg-linear-to-br from-slate-700 to-slate-900 p-6 text-white shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-300">
                  Pharmacies
                </p>
                <p className="mt-2 text-3xl font-bold tabular-nums">
                  {stats?.pharmacies || 0}
                </p>
              </div>
              <Activity className="h-8 w-8 text-slate-400" />
            </div>
            <div className="mt-4 flex items-center gap-1">
              <ArrowUp className="h-4 w-4" />
              <span className="text-sm text-slate-300">+2 new this month</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth Line Chart */}
          <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-primary-600" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  User growth
                </h3>
              </div>
              <span
                className={`text-sm font-semibold ${userGrowthDelta >= 0 ? "text-primary-600 dark:text-primary-400" : "text-red-600 dark:text-red-400"}`}
              >
                {userGrowthDelta >= 0 ? "+" : ""}
                {userGrowthDelta.toFixed(1)}%
              </span>
            </div>
            <div className="h-56">
              <Line data={userGrowthChartData} options={commonLineOptions} />
            </div>
          </div>

          {/* Prescription Activity Line Chart */}
          <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary-600" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Prescription activity
                </h3>
              </div>
              <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                +8.3%
              </span>
            </div>
            <div className="h-56">
              <Line
                data={prescriptionChartData}
                options={{
                  ...commonLineOptions,
                  elements: {
                    ...commonLineOptions.elements,
                    line: { tension: 0.35, borderWidth: 3 },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Performance Metrics & Pharmacy Engagement */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Indicators */}
          <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/70 lg:col-span-1">
            <div className="mb-6 flex items-center gap-3">
              <Activity className="h-6 w-6 text-secondary" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Performance
              </h3>
            </div>
            <div className="h-56">
              <Radar
                data={performanceRadarData}
                options={performanceRadarOptions}
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-400">
              <p>
                Uptime:{" "}
                <span className="font-semibold text-primary-600 dark:text-primary-400">
                  {selectedRangeData.platformMetrics.uptime}%
                </span>
              </p>
              <p>
                Response:{" "}
                <span className="font-semibold text-secondary dark:text-secondary-light">
                  {selectedRangeData.platformMetrics.responseTime}ms
                </span>
              </p>
              <p>
                Error:{" "}
                <span className="font-semibold text-red-600 dark:text-red-400">
                  {selectedRangeData.platformMetrics.errorRate}%
                </span>
              </p>
              <p>
                Satisfaction:{" "}
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  {selectedRangeData.platformMetrics.satisfaction}/5
                </span>
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/70 lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-6 w-6 text-primary-600" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Pharmacy engagement
                </h3>
              </div>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Active users
              </span>
            </div>
            <div className="h-64">
              <Bar data={pharmacyChartData} options={pharmacyChartOptions} />
            </div>
          </div>
        </div>

        {/* Top Pharmacies & Message Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Pharmacies Distribution */}
          <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
            <div className="mb-6 flex items-center gap-3">
              <PieChart className="h-6 w-6 text-primary-600" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Top pharmacies
              </h3>
            </div>
            <div className="h-64">
              <Doughnut
                data={topHospitalsChartData}
                options={topHospitalsChartOptions}
              />
            </div>
          </div>

          {/* Message Activity Chart */}
          <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-6 w-6 text-secondary" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Message activity
                </h3>
              </div>
              <span className="text-sm font-semibold text-secondary dark:text-secondary-light">
                +23.1%
              </span>
            </div>
            <div className="h-56">
              <Line data={messageChartData} options={commonLineOptions} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
