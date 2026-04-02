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
import { useStore } from "../../store/useStore";
import type { Category } from "../../types";
import { formatCurrency } from "../../utils/helpers";

const categories: Category[] = ["Breakfast", "Lunch", "Dinner", "Side Dishes"];

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

  const categoryStats = useMemo(() => {
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

    const max = Math.max(...Object.values(totals), 1);

    return categories.map((category) => ({
      category,
      total: totals[category],
      width: Math.max(8, Math.round((totals[category] / max) * 100)),
    }));
  }, [paidOrders]);

  const recentOrders = orders.slice(0, 6);

  return (
    <div className="p-4 md:p-8 space-y-6">
      <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-800 text-white p-6 md:p-8 shadow-lg overflow-hidden relative">
        <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-white/10" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <p className="text-xs uppercase tracking-wider text-emerald-200">
              Today at a glance
            </p>
            <h2 className="text-2xl md:text-3xl font-bold mt-1">
              Operations Dashboard
            </h2>
            <p className="text-slate-200 mt-2 max-w-xl">
              Track real-time sales, staffing, and product performance from one
              place.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 min-w-[260px]">
            <QuickPill
              label="Today Orders"
              value={todayOrders.length.toString()}
            />
            <QuickPill
              label="Today Revenue"
              value={formatCurrency(todayRevenue)}
            />
            <QuickPill
              label="Active Staff"
              value={activeEmployees.toString()}
            />
            <QuickPill
              label="Live Products"
              value={activeProducts.toString()}
            />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          subtitle="Paid orders only"
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          title="Total Orders"
          value={orders.length.toString()}
          subtitle={`${paidOrders.length} paid`}
          icon={ShoppingBag}
          color="blue"
        />
        <StatCard
          title="Average Ticket"
          value={formatCurrency(averageOrderValue)}
          subtitle="Per paid order"
          icon={Activity}
          color="violet"
        />
        <StatCard
          title="Team Coverage"
          value={`${activeEmployees}/${employees.length}`}
          subtitle="Active employees"
          icon={Users}
          color="amber"
        />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[1.2fr_1fr] gap-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-slate-900">Recent Orders</h3>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
              Last {recentOrders.length}
            </span>
          </div>

          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm font-medium">No orders yet</p>
              </div>
            ) : (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">
                      Order {order.id.slice(0, 6)}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(order.timestamp).toLocaleString()} •{" "}
                      {order.items.length} items
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-700">
                      {formatCurrency(order.total)}
                    </p>
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                        order.paymentStatus === "paid"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {order.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-5">
            Revenue by Category
          </h3>
          <div className="space-y-4">
            {categoryStats.map((stat) => (
              <div key={stat.category}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-slate-700">
                    {stat.category}
                  </span>
                  <span className="text-sm font-semibold text-slate-900">
                    {formatCurrency(stat.total)}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-full"
                    style={{ width: `${stat.width}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function QuickPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 px-3 py-2.5">
      <p className="text-[11px] text-slate-200">{label}</p>
      <p className="text-sm font-semibold mt-0.5">{value}</p>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  color: "emerald" | "blue" | "violet" | "amber";
}) {
  const colorMap = {
    emerald: "bg-emerald-100 text-emerald-700",
    blue: "bg-blue-100 text-blue-700",
    violet: "bg-violet-100 text-violet-700",
    amber: "bg-amber-100 text-amber-700",
  } as const;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color]}`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-sm text-slate-600">{title}</p>
      <p className="text-2xl font-bold text-slate-900 mt-0.5">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
    </div>
  );
}
