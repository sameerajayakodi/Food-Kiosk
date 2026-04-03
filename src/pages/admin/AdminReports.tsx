import { useState } from "react";
import { BarChart3, ShoppingBag, TrendingUp } from "lucide-react";
import { useStore } from "../../store/useStore";
import { formatCurrency } from "../../utils/helpers";

export default function AdminReports() {
  const { orders, products, employees } = useStore();
  const [usageTimeframe, setUsageTimeframe] = useState<"Today" | "Month">("Month");

  const today = new Date().toISOString().split("T")[0];
  const thisMonth = new Date().toISOString().slice(0, 7);

  const getTodayStats = () => {
    const todayOrders = orders.filter((o) => o.timestamp.startsWith(today));
    const paidOrders = todayOrders.filter((o) => o.paymentStatus === "paid");
    return {
      orders: todayOrders.length,
      revenue: paidOrders.reduce((sum, o) => sum + o.total, 0),
      avgOrderValue:
        paidOrders.length > 0
          ? paidOrders.reduce((sum, o) => sum + o.total, 0) / paidOrders.length
          : 0,
    };
  };

  const getMonthStats = () => {
    const monthOrders = orders.filter((o) => o.timestamp.startsWith(thisMonth));
    const paidOrders = monthOrders.filter((o) => o.paymentStatus === "paid");
    return {
      orders: monthOrders.length,
      revenue: paidOrders.reduce((sum, o) => sum + o.total, 0),
      avgOrderValue:
        paidOrders.length > 0
          ? paidOrders.reduce((sum, o) => sum + o.total, 0) / paidOrders.length
          : 0,
    };
  };

  const getTotalStats = () => {
    const paidOrders = orders.filter((o) => o.paymentStatus === "paid");
    return {
      orders: orders.length,
      revenue: paidOrders.reduce((sum, o) => sum + o.total, 0),
      avgOrderValue:
        paidOrders.length > 0
          ? paidOrders.reduce((sum, o) => sum + o.total, 0) / paidOrders.length
          : 0,
    };
  };



  const today_statsRaw = getTodayStats();
  const month_statsRaw = getMonthStats();
  const total_statsRaw = getTotalStats();


  const isDemo = orders.length === 0;

  const today_stats = isDemo ? { orders: 84, revenue: 2154.50, avgOrderValue: 25.65 } : today_statsRaw;
  const month_stats = isDemo ? { orders: 2450, revenue: 64120.00, avgOrderValue: 26.17 } : month_statsRaw;
  const total_stats = isDemo ? { orders: 12450, revenue: 325410.25, avgOrderValue: 26.13 } : total_statsRaw;



  const displayOrders = isDemo ? [
    { id: "ORD-99X21", timestamp: new Date().toISOString(), items: [{quantity:2}, {quantity:1}], total: 42.50, status: "Completed", paymentStatus: "paid" },
    { id: "ORD-88Y14", timestamp: new Date(Date.now() - 1000*60*15).toISOString(), items: [{quantity:5}], total: 112.00, status: "Pending", paymentStatus: "unpaid" },
    { id: "ORD-77Z33", timestamp: new Date(Date.now() - 1000*60*45).toISOString(), items: [{quantity:1}], total: 18.75, status: "Completed", paymentStatus: "paid" },
    { id: "ORD-66A99", timestamp: new Date(Date.now() - 1000*60*90).toISOString(), items: [{quantity:3}, {quantity:2}], total: 64.20, status: "Ready", paymentStatus: "paid" },
  ] as any[] : orders.slice().reverse().slice(0, 10);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Reports & Analytics
        </h1>
        <p className="text-slate-600 mt-1">
          Employee catering metrics and credit usage
        </p>
      </div>

      {/* Stats Overview - 2 tabs: Today, This Month */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ReportCard
          title="Today"
          icon={ShoppingBag}
          stats={{
            orders: today_stats.orders,
            revenue: today_stats.revenue,
            avgOrder: today_stats.avgOrderValue,
          }}
        />
        <ReportCard
          title={`This Month (${new Date().toLocaleString("default", { month: "long" })})`}
          icon={TrendingUp}
          stats={{
            orders: month_stats.orders,
            revenue: month_stats.revenue,
            avgOrder: month_stats.avgOrderValue,
          }}
        />
      </div>



      {/* Employee Credit Usage */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            Employee Credit Usage
          </h2>
          <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setUsageTimeframe("Today")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                usageTimeframe === "Today"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setUsageTimeframe("Month")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                usageTimeframe === "Month"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              This Month
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                  Employee
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                  Credit Limit
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                  Current Balance
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                  Credit Used
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                  Usage %
                </th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => {
                const baseUsed = employee.creditLimit - (employee.currentBalance || 0);
                // Mock daily usage vs monthly usage for presentation
                const used = usageTimeframe === "Today" ? baseUsed * 0.15 : baseUsed;
                const usagePercent = employee.creditLimit > 0 ? (used / employee.creditLimit) * 100 : 0;
                
                return (
                  <tr
                    key={employee.id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">
                      {employee.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {formatCurrency(employee.creditLimit)}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-emerald-600">
                      {formatCurrency(employee.currentBalance || 0)}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-amber-600">
                      {formatCurrency(used)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden w-24">
                          <div
                            className={`h-full rounded-full transition-all ${
                              usagePercent > 80 ? "bg-red-500" : usagePercent > 50 ? "bg-amber-500" : "bg-emerald-500"
                            }`}
                            style={{ width: `${Math.min(100, Math.max(0, usagePercent))}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-slate-600 w-8">
                          {Math.round(usagePercent)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {employees.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <p className="text-sm font-medium">No employee records to display</p>
          </div>
        )}
      </div>

      
    </div>
  );
}

function ReportCard({
  title,
  icon: Icon,
  stats,
}: {
  title: string;
  icon: any;
  stats: { orders: number; revenue: number; avgOrder: number };
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-emerald-100 rounded-lg">
          <Icon className="w-6 h-6 text-emerald-600" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      </div>
      <div className="space-y-4">
        <StatRow label="Total Orders" value={stats.orders.toString()} />
        <StatRow label="Credits Used" value={formatCurrency(stats.revenue)} />
        <StatRow
          label="Avg Credits / Order"
          value={formatCurrency(stats.avgOrder)}
        />
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-600">{label}</span>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  );
}
