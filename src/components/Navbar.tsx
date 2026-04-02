import { Menu, Settings, ShoppingCart, UtensilsCrossed, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { to: "/", label: "Order Now", icon: ShoppingCart },
  { to: "/admin", label: "Admin", icon: Settings },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-xl text-slate-900">
                FoodKiosk
              </span>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 -mt-1">
                Customer Kiosk
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const isActive =
                location.pathname === to ||
                location.pathname.startsWith(to + "/");
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 pb-4">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const isActive =
              location.pathname === to ||
              location.pathname.startsWith(to + "/");
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all my-1
                  ${
                    isActive
                      ? "bg-emerald-600 text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
