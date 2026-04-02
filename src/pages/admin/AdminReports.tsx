import { BarChart3, ShoppingBag, TrendingUp } from "lucide-react";
import { useStore } from "../../store/useStore";
import { formatCurrency } from "../../utils/helpers";

export default function AdminReports() {
  const { orders, products, employees } = useStore();

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

  const getPopularProducts = () => {
    const productSells: Record<string, number> = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        productSells[item.product.id] =
          (productSells[item.product.id] || 0) + item.quantity;
      });
    });

    return Object.entries(productSells)
      .map(([id, qty]) => ({
        product: products.find((p) => p.id === id),
        quantity: qty,
      }))
      .filter((item) => item.product)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
  };

  const getCategorySales = () => {
    const categorySales: Record<string, { count: number; revenue: number }> =
      {};
    orders
      .filter((o) => o.paymentStatus === "paid")
      .forEach((order) => {
        order.items.forEach((item) => {
          const cat = item.product.category;
          if (!categorySales[cat]) {
            categorySales[cat] = { count: 0, revenue: 0 };
          }
          categorySales[cat].count += item.quantity;
          categorySales[cat].revenue += item.product.price * item.quantity;
        });
      });
    return Object.entries(categorySales).map(([category, data]) => ({
      category,
      ...data,
    }));
  };

  const today_statsRaw = getTodayStats();
  const month_statsRaw = getMonthStats();
  const total_statsRaw = getTotalStats();
  const popularRaw = getPopularProducts();
  const categoriesRaw = getCategorySales();

  const isDemo = orders.length === 0;

  const today_stats = isDemo ? { orders: 84, revenue: 2154.50, avgOrderValue: 25.65 } : today_statsRaw;
  const month_stats = isDemo ? { orders: 2450, revenue: 64120.00, avgOrderValue: 26.17 } : month_statsRaw;
  const total_stats = isDemo ? { orders: 12450, revenue: 325410.25, avgOrderValue: 26.13 } : total_statsRaw;

  const popular = isDemo ? [
    { product: { id: "p1", name: "Classic Burger", category: "Lunch", price: 12.50 }, quantity: 450 },
    { product: { id: "p2", name: "Pancakes", category: "Breakfast", price: 8.50 }, quantity: 380 },
    { product: { id: "p3", name: "Pasta Carbonara", category: "Dinner", price: 18.00 }, quantity: 320 },
    { product: { id: "p4", name: "French Fries", category: "Side Dishes", price: 4.50 }, quantity: 295 },
    { product: { id: "p5", name: "Grilled Salmon", category: "Dinner", price: 24.00 }, quantity: 180 },
  ] as any[] : popularRaw;

  const categories = isDemo ? [
    { category: "Lunch", count: 850, revenue: 12400 },
    { category: "Dinner", count: 1200, revenue: 25300 },
    { category: "Breakfast", count: 650, revenue: 6500 },
    { category: "Side Dishes", count: 420, revenue: 3100 },
  ] : categoriesRaw;

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
          Business performance metrics and insights
        </p>
      </div>

      {/* Stats Overview - 3 tabs: Today, This Month, Total */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        <ReportCard
          title="All Time"
          icon={BarChart3}
          stats={{
            orders: total_stats.orders,
            revenue: total_stats.revenue,
            avgOrder: total_stats.avgOrderValue,
          }}
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Products */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Top 10 Popular Products
          </h2>
          <div className="space-y-4">
            {popular.length > 0 ? (
              popular.map((item, idx) => (
                <div
                  key={item.product?.id}
                  className="flex items-center justify-between pb-4 border-b border-slate-100 last:border-0"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-700">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">
                        {item.product?.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {item.product?.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">{item.quantity}x</p>
                    <p className="text-xs text-slate-500">
                      {formatCurrency(item.product?.price || 0)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-500 py-8">
                No sales data yet
              </p>
            )}
          </div>
        </div>

        {/* Sales by Category */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Sales by Category
          </h2>
          <div className="space-y-4">
            {categories.length > 0 ? (
              categories
                .sort((a, b) => b.revenue - a.revenue)
                .map((item) => (
                  <div
                    key={item.category}
                    className="pb-4 border-b border-slate-100 last:border-0"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-slate-900">
                        {item.category}
                      </p>
                      <p className="font-bold text-emerald-600">
                        {formatCurrency(item.revenue)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{item.count} items sold</span>
                      <span>
                        {total_stats.revenue > 0
                          ? Math.round(
                              (item.revenue / total_stats.revenue) * 100,
                            )
                          : 0}
                        % of revenue
                      </span>
                    </div>
                    <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{
                          width: `${total_stats.revenue > 0 ? (item.revenue / total_stats.revenue) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-center text-slate-500 py-8">
                No sales data yet
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Orders Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-6">
          Recent Orders Details
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                  Order ID
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                  Date & Time
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                  Items
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                  Total
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                  Payment
                </th>
              </tr>
            </thead>
            <tbody>
              {displayOrders
                .map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">
                      {order.id.slice(0, 6)}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {new Date(order.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {order.items.reduce(
                        (sum: number, item: any) => sum + item.quantity,
                        0,
                      )}{" "}
                      items
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-emerald-600">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-block px-3 py-1 rounded-lg text-xs font-medium ${
                          order.status === "Completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-block px-3 py-1 rounded-lg text-xs font-medium ${
                          order.paymentStatus === "paid"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {order.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <p className="text-sm font-medium">No orders to display</p>
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
        <StatRow label="Revenue" value={formatCurrency(stats.revenue)} />
        <StatRow
          label="Avg Order Value"
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
