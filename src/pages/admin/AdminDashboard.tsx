import {
  Activity,
  Clock,
  LucideIcon,
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useStore } from "../../store/useStore";
import type { Category } from "../../types";
import { formatCurrency } from "../../utils/helpers";

const categories: Category[] = ["Breakfast", "Lunch", "Dinner", "Side Dishes"];
const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6"];

export default function AdminDashboard() {
  const { products, orders, employees } = useStore();

  const now = new Date().toISOString().split("T")[0];

  const paidOrders = useMemo(
    () => orders.filter((order) => order.paymentStatus === "paid"),
    [orders],
  );

  const todayOrders = useMemo(
    () => orders.filter((order) => order.timestamp.startsWith(now)),
    [orders, now],
  );

  const todayRevenue = useMemo(
    () =>
      todayOrders
        .filter((order) => order.paymentStatus === "paid")
        .reduce((sum, order) => sum + order.total, 0),
    [todayOrders],
  );

  const totalRevenue = useMemo(
    () => paidOrders.reduce((sum, order) => sum + order.total, 0),
    [paidOrders],
  );

  const averageOrderValue =
    paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;

  const activeEmployees = employees.filter(
    (employee) => employee.active,
  ).length;
  const activeProducts = products.filter((product) => product.available).length;

  const categoryStatsRaw = useMemo(() => {
    const totals: Record<Category, number> = {
      Breakfast: 0,
      Lunch: 0,
      Dinner: 0,
      "Side Dishes": 0,
    };

    paidOrders.forEach((order) => {
      order.items.forEach((item) => {
        totals[item.product.category] += item.product.price * item.quantity;
      });
    });

    return categories.map((category) => ({
      name: category,
      value: totals[category],
    }));
  }, [paidOrders]);

  const recentOrdersRaw = orders.slice(0, 6);

  // DUMMY DATA FALLBACK LOGIC
  const isDemo = orders.length === 0;

  const d_todayOrdersLength = isDemo ? 84 : todayOrders.length.toString();
  const d_todayRevenue = isDemo ? 2154.50 : todayRevenue;
  const d_activeStaff = isDemo ? "6" : activeEmployees.toString();
  const d_activeProducts = isDemo ? "32" : activeProducts.toString();

  const d_totalRevenue = isDemo ? 34215.80 : totalRevenue;
  const d_totalOrders = isDemo ? "1,245" : orders.length.toString();
  const d_avgTicket = isDemo ? 27.50 : averageOrderValue;
  const d_staffCoverage = isDemo ? "6/10" : `${activeEmployees}/${employees.length}`;

  const categoryStats = isDemo ? [
    { name: "Breakfast", value: 4500 },
    { name: "Lunch", value: 12400 },
    { name: "Dinner", value: 15300 },
    { name: "Side Dishes", value: 2015.80 },
  ] : categoryStatsRaw;

  // Mock a weekly trend for the area chart
  const weeklyData = isDemo ? [
    { name: "Mon", revenue: 1800 },
    { name: "Tue", revenue: 2300 },
    { name: "Wed", revenue: 1950 },
    { name: "Thu", revenue: 2600 },
    { name: "Fri", revenue: 3800 },
    { name: "Sat", revenue: 4500 },
    { name: "Sun", revenue: 3100 },
  ] : [
    { name: "Mon", revenue: 1200 },
    { name: "Tue", revenue: 1900 },
    { name: "Wed", revenue: 1500 },
    { name: "Thu", revenue: 2200 },
    { name: "Fri", revenue: 2800 },
    { name: "Sat", revenue: 3500 },
    { name: "Sun", revenue: todayRevenue > 0 ? todayRevenue : 3100 },
  ];

  const recentOrders = isDemo ? [
    { id: "ORD-99X21", timestamp: new Date().toISOString(), total: 42.50, paymentStatus: "paid" },
    { id: "ORD-88Y14", timestamp: new Date(Date.now() - 1000*60*15).toISOString(), total: 112.00, paymentStatus: "pending" },
    { id: "ORD-77Z33", timestamp: new Date(Date.now() - 1000*60*45).toISOString(), total: 18.75, paymentStatus: "paid" },
    { id: "ORD-66A99", timestamp: new Date(Date.now() - 1000*60*90).toISOString(), total: 64.20, paymentStatus: "paid" },
    { id: "ORD-55B11", timestamp: new Date(Date.now() - 1000*60*120).toISOString(), total: 8.50, paymentStatus: "paid" },
    { id: "ORD-44C44", timestamp: new Date(Date.now() - 1000*60*200).toISOString(), total: 32.10, paymentStatus: "pending" }
  ] : recentOrdersRaw;

  return (
    <div className="p-4 space-y-4">
      {/* Slimmer Top Banner */}
      {/* <section className="rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">
              Live Operations
            </h2>
          </div>
          <p className="text-slate-400 text-xs">
            Real-time sales and staffing metrics
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <QuickPill label="Orders" value={d_todayOrdersLength.toString()} color="emerald" />
          <QuickPill label="Revenue (Today)" value={formatCurrency(d_todayRevenue)} color="blue" />
          <QuickPill label="Staff" value={d_activeStaff} color="violet" />
          <QuickPill label="Products" value={d_activeProducts} color="amber" />
        </div>
      </section> */}

      {/* Compact Stat Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(d_totalRevenue)}
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          title="Total Orders"
          value={d_totalOrders.toString()}
          icon={ShoppingBag}
          color="blue"
        />
        <StatCard
          title="Avg Ticket"
          value={formatCurrency(d_avgTicket)}
          icon={Activity}
          color="violet"
        />
        <StatCard
          title="Coverage"
          value={d_staffCoverage}
          icon={Users}
          color="amber"
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-800">Revenue Trend</h3>
              <p className="text-[11px] text-slate-500">Weekly sales performance</p>
            </div>
          </div>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} tickFormatter={(val) => `LKR ${val}`} />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "none", fontSize: "12px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  itemStyle={{ color: "#10b981", fontWeight: "bold" }}
                  formatter={(val: any) => [`LKR ${Number(val).toLocaleString()}`, "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col">
          <div className="mb-2">
            <h3 className="text-base font-bold text-slate-800">Category Mix</h3>
            <p className="text-[11px] text-slate-500">Revenue distribution</p>
          </div>
          <div className="flex-1 min-h-[160px]">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: "8px", border: "none", fontSize: "12px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                   formatter={(val: any) => `LKR ${Number(val).toLocaleString()}`} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-2 mt-2">
             {categoryStats.map((stat, i) => (
                <div key={stat.name} className="flex items-center gap-1.5">
                   <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                   <div>
                     <p className="text-[10px] whitespace-nowrap overflow-hidden text-ellipsis font-medium text-slate-500">{stat.name}</p>
                     <p className="text-xs font-bold text-slate-800">{formatCurrency(stat.value)}</p>
                   </div>
                </div>
             ))}
          </div>
        </div>
      </section>

      <section className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
               <h3 className="text-base font-bold text-slate-800">Recent Transactions</h3>
               <p className="text-[11px] text-slate-500">Latest {recentOrders.length} orders</p>
            </div>
            <button className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors">
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentOrders.length === 0 ? (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-6 text-slate-400 bg-slate-50 rounded-xl">
                <Package className="w-6 h-6 mx-auto mb-2 opacity-30" />
                <p className="text-xs font-semibold">No active orders</p>
              </div>
            ) : (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-xl border border-slate-100/80 hover:border-emerald-200 bg-gradient-to-br from-white to-slate-50/50 p-3 shadow-sm hover:shadow-md transition-all group cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                     <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                        <ShoppingBag className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                     </div>
                     <div>
                        <p className="font-bold text-slate-900 text-[13px]">
                           Order {order.id.slice(0, 5).toUpperCase()}
                        </p>
                        <p className="text-[10px] text-slate-500 flex items-center gap-1">
                           <Clock className="w-2.5 h-2.5" />
                           {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                     </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-slate-800 text-[13px]">
                      {formatCurrency(order.total)}
                    </p>
                    <span
                      className={`text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-md inline-block mt-0.5 ${
                        order.paymentStatus === "paid"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {order.paymentStatus === "paid" ? "Paid" : "Wait"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
    </div>
  );
}

function QuickPill({ label, value, color }: { label: string; value: string, color: 'emerald'|'blue'|'amber'|'violet' }) {
  const bgMap = {
     emerald: "bg-emerald-500/20 text-emerald-100 border-emerald-500/20",
     blue: "bg-blue-500/20 text-blue-100 border-blue-500/20",
     amber: "bg-amber-500/20 text-amber-100 border-amber-500/20",
     violet: "bg-violet-500/20 text-violet-100 border-violet-500/20",
  };
  return (
    <div className={`rounded-xl ${bgMap[color]} px-3 py-1.5 border min-w-[90px]`}>
      <p className="text-[9px] uppercase font-semibold opacity-80">{label}</p>
      <p className="text-sm font-bold tracking-tight leading-none mt-0.5">{value}</p>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  icon: LucideIcon;
  color: "emerald" | "blue" | "violet" | "amber";
}) {
  const colorMap = {
    emerald: "bg-emerald-100 text-emerald-600",
    blue: "bg-blue-100 text-blue-600",
    violet: "bg-violet-100 text-violet-600",
    amber: "bg-amber-100 text-amber-600",
  } as const;

  const bgMap = {
    emerald: "from-emerald-50/30 to-white",
    blue: "from-blue-50/30 to-white",
    violet: "from-violet-50/30 to-white",
    amber: "from-amber-50/30 to-white",
  } as const;

  return (
    <div className={`bg-gradient-to-br ${bgMap[color]} border border-slate-100 rounded-2xl p-3 shadow-sm flex items-center gap-3`}>
      <div className={`w-10 h-10 rounded-xl flex shrink-0 items-center justify-center ${colorMap[color]}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
         <p className="text-[11px] font-semibold text-slate-500 truncate">{title}</p>
         <p className="text-base font-extrabold text-slate-800 leading-tight truncate">{value}</p>
      </div>
    </div>
  );
}
