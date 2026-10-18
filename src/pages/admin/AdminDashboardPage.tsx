import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  AlertTriangle,
  Users,
  TrendingUp,
  Package,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { StatCard } from '../../components/admin/StatCard';
import { DashboardSkeleton } from '../../components/common/LoadingSkeleton';
import { adminApi, DashboardStats } from '../../api/admin';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = () => {
    setIsLoading(true);
    adminApi
      .getStats()
      .then(setStats)
      .catch((err) => console.error('Failed to load dashboard stats:', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (isLoading || !stats) {
    return <DashboardSkeleton />;
  }

  const kpis = stats.kpis;
  const maxRev = Math.max(...stats.sales_chart.map((d) => d.revenue), 1000);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-charcoal">Executive Boutique Overview</h2>
          <p className="text-xs text-mutedGrey mt-0.5">
            Real-time business telemetry computed from active database transactions.
          </p>
        </div>

        <button
          onClick={fetchStats}
          className="btn-secondary h-9 px-3 text-xs gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Gross Revenue"
          value={`₹${Number(kpis.total_revenue).toLocaleString('en-IN')}`}
          subtitle="From confirmed & delivered orders"
          icon={<DollarSign className="w-5 h-5" />}
          color="primary"
        />
        <StatCard
          title="Total Orders"
          value={kpis.total_orders}
          subtitle={`AOV: ₹${Number(kpis.avg_order_value).toLocaleString('en-IN')}`}
          icon={<ShoppingBag className="w-5 h-5" />}
          color="neutral"
        />
        <StatCard
          title="Pending Fulfilment"
          value={kpis.pending_fulfillment}
          subtitle="Orders awaiting vault packing/dispatch"
          icon={<Clock className="w-5 h-5" />}
          color={kpis.pending_fulfillment > 0 ? 'accent' : 'primary'}
        />
        <StatCard
          title="Low Stock Alerts"
          value={kpis.low_stock_count}
          subtitle="Variants with ≤ 5 units remaining"
          icon={<AlertTriangle className="w-5 h-5" />}
          color={kpis.low_stock_count > 0 ? 'red' : 'primary'}
        />
      </div>

      {/* Charts & Top Products Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 7-Day Revenue Trend (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-borderNeutral rounded-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-borderNeutral">
            <div>
              <h3 className="text-sm font-bold text-charcoal">7-Day Revenue Performance</h3>
              <p className="text-[11px] text-mutedGrey">Daily order volume and revenue generation</p>
            </div>
            <span className="text-xs font-semibold text-primary">Daily Telemetry</span>
          </div>

          <div className="h-56 flex items-end justify-between gap-2 pt-6 px-2">
            {stats.sales_chart.map((day, idx) => {
              const heightPercent = Math.max(8, Math.round((day.revenue / maxRev) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-12 bg-charcoal text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-lg">
                    <p className="font-bold">₹{day.revenue.toLocaleString('en-IN')}</p>
                    <p className="text-warmIvory/70">{day.orders} orders</p>
                  </div>

                  <div className="w-full max-w-[40px] bg-softNeutral rounded-t overflow-hidden h-40 flex items-end">
                    <div
                      className="w-full bg-primary hover:bg-primary-hover transition-all duration-300 rounded-t"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>

                  <span className="text-[11px] text-mutedGrey font-medium">{day.date}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Selling Products (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-borderNeutral rounded-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-borderNeutral">
            <h3 className="text-sm font-bold text-charcoal">Top Performing Pieces</h3>
            <p className="text-[11px] text-mutedGrey">Ranked by volume sold</p>
          </div>

          {stats.top_products.length === 0 ? (
            <p className="text-xs text-mutedGrey text-center py-8">No sales data recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {stats.top_products.map((tp, i) => (
                <div key={i} className="flex items-center justify-between text-xs pb-2 border-b border-borderNeutral/50 last:border-b-0">
                  <div className="pr-2">
                    <span className="font-semibold text-charcoal block line-clamp-1">{tp.name}</span>
                    <span className="text-[11px] text-mutedGrey">{tp.units_sold} units sold</span>
                  </div>
                  <span className="font-bold text-primary whitespace-nowrap">
                    ₹{Number(tp.revenue).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Recent Orders & Low Stock Queue Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Orders Table (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-borderNeutral rounded-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-borderNeutral">
            <div>
              <h3 className="text-sm font-bold text-charcoal">Recent Customer Orders</h3>
              <p className="text-[11px] text-mutedGrey">Latest orders awaiting fulfillment or updates</p>
            </div>
            <Link to="/admin/orders" className="text-xs text-primary font-semibold hover:underline">
              View All Orders →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-borderNeutral text-mutedGrey font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-2.5">Order</th>
                  <th className="py-2.5">Patron</th>
                  <th className="py-2.5">Amount</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderNeutral/60">
                {stats.recent_orders.map((o) => (
                  <tr key={o.order_number} className="hover:bg-softNeutral/30">
                    <td className="py-3 font-bold text-charcoal">{o.order_number}</td>
                    <td className="py-3">
                      <p className="font-medium text-charcoal">{o.customer_name}</p>
                      <p className="text-[11px] text-mutedGrey">{o.customer_email}</p>
                    </td>
                    <td className="py-3 font-bold text-charcoal">
                      ₹{Number(o.total_amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary">
                        {o.status_display}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        to={`/admin/orders?search=${o.order_number}`}
                        className="text-primary hover:underline font-semibold"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Watchlist (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-borderNeutral rounded-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-borderNeutral">
            <div>
              <h3 className="text-sm font-bold text-charcoal">Low Stock Watchlist</h3>
              <p className="text-[11px] text-mutedGrey">Replenishment needed</p>
            </div>
            <Link to="/admin/products" className="text-xs text-primary font-semibold hover:underline">
              Inventory →
            </Link>
          </div>

          {stats.low_stock_items.length === 0 ? (
            <p className="text-xs text-primary font-semibold text-center py-8">
              All inventory thresholds healthy.
            </p>
          ) : (
            <div className="space-y-3">
              {stats.low_stock_items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs pb-2 border-b border-borderNeutral/50 last:border-b-0">
                  <div className="pr-2">
                    <span className="font-semibold text-charcoal block line-clamp-1">{item.product_name}</span>
                    <span className="text-[11px] text-mutedGrey">{item.variant_name} • SKU: {item.sku}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-700">
                    {item.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
