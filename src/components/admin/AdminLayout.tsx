import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Star,
  TicketPercent,
  Settings,
  Store,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from '../common/Navbar';
import { Footer } from '../common/Footer';
import { CartDrawer } from '../common/CartDrawer';

export const AdminLayout: React.FC = () => {
  const { user, isAdmin, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warmIvory flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-mutedGrey font-medium tracking-wide">Authenticating Owner Portal...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-warmIvory flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <div className="bg-white border border-borderNeutral rounded-card p-8 max-w-md w-full text-center space-y-4 shadow-card">
            <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="font-serif-luxury text-2xl font-bold text-charcoal">Restricted Administrator Area</h2>
            <p className="text-xs text-mutedGrey leading-relaxed">
              This dashboard is reserved for authorized store administrators and owners. Please sign in with an account that has administrative privileges.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <Link to="/login" className="btn-primary w-full text-xs">
                Sign In as Administrator
              </Link>
              <Link to="/" className="btn-secondary w-full text-xs">
                Return to Storefront
              </Link>
            </div>
          </div>
        </div>
        <Footer />
        <CartDrawer />
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard Overview', path: '/admin', icon: <LayoutDashboard className="w-4 h-4" />, end: true },
    { name: 'Products & Inventory', path: '/admin/products', icon: <Package className="w-4 h-4" /> },
    { name: 'Orders & Fulfilment', path: '/admin/orders', icon: <ShoppingBag className="w-4 h-4" /> },
    { name: 'Review Moderation', path: '/admin/reviews', icon: <Star className="w-4 h-4" /> },
    { name: 'Coupons & Promos', path: '/admin/coupons', icon: <TicketPercent className="w-4 h-4" /> },
    { name: 'Store Settings & CSV', path: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-warmIvory text-charcoal">
      <Navbar />

      {/* Admin Body Shell */}
      <div className="flex-1 flex w-full">
        {/* Sidebar for Desktop */}
        <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-borderNeutral flex-shrink-0">
          {/* Admin Header */}
          <div className="h-16 border-b border-borderNeutral flex items-center justify-between px-6 bg-warmIvory/50">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="font-serif-luxury font-bold text-sm text-charcoal">Owner Portal</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
              Admin
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-button text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-charcoal hover:bg-softNeutral hover:text-primary'
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-borderNeutral space-y-2">
            <Link
              to="/"
              className="flex items-center justify-between px-3.5 py-2 text-xs font-medium text-charcoal hover:bg-softNeutral rounded-button transition-colors"
            >
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-primary" />
                <span>View Live Storefront</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-mutedGrey" />
            </Link>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-button transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Mobile Drawer */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm"
              onClick={() => setIsSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-float flex flex-col z-50">
              <div className="h-16 border-b border-borderNeutral flex items-center justify-between px-4 bg-warmIvory/50">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span className="font-serif-luxury font-bold text-sm text-charcoal">Owner Portal</span>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="p-1 text-mutedGrey">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    onClick={() => setIsSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-button text-xs font-semibold ${
                        isActive ? 'bg-primary text-white' : 'text-charcoal hover:bg-softNeutral'
                      }`
                    }
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </nav>
              <div className="p-4 border-t border-borderNeutral">
                <Link to="/" className="flex items-center gap-2 text-xs font-medium text-primary py-2">
                  <Store className="w-4 h-4" />
                  <span>View Storefront</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-softNeutral/30">
          {/* Admin Header Sub-bar */}
          <header className="h-14 bg-white border-b border-borderNeutral px-4 sm:px-6 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-1.5 text-charcoal hover:bg-softNeutral rounded-button"
                aria-label="Open Admin Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                  Admin Dashboard
                </span>
                <span className="text-xs text-mutedGrey hidden sm:inline">•</span>
                <h1 className="text-xs sm:text-sm font-semibold text-charcoal tracking-wide hidden sm:inline">
                  Store Operations & Fulfilment
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-bold text-charcoal">{user?.display_name || 'Admin'}</p>
                <p className="text-[10px] text-mutedGrey">{user?.email}</p>
              </div>
              <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {user?.display_name?.charAt(0).toUpperCase() || 'A'}
              </div>
            </div>
          </header>

          {/* Child Routes */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>

      <Footer />
      <CartDrawer />
    </div>
  );
};

export default AdminLayout;
