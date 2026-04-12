import { Outlet, Link, useNavigate, useLocation } from "react-router";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  ReceiptText,
  LogOut,
  Tags,
  VenetianMask,
} from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../ui/utils";
import { clearAuthSession } from "../../auth/session";

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    clearAuthSession();
    navigate("/login");
  };

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/users", label: "Users", icon: Users },
    { path: "/admin/billing", label: "Billing", icon: CreditCard },
    { path: "/admin/plans", label: "Plans", icon: ReceiptText },
    { path: "/admin/categories", label: "Categories", icon: Tags },
    { path: "/admin/genders", label: "Genders", icon: VenetianMask },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-primary/80 bg-primary text-primary-foreground shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/admin" className="font-display text-2xl font-bold text-primary-foreground">
            Only Escorts Intim Admin
          </Link>

          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-primary-foreground/85 hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="col-span-12 md:col-span-3">
            <nav className="space-y-2 rounded-2xl border border-border/80 bg-card/70 p-3 shadow-sm backdrop-blur-sm">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="col-span-12 md:col-span-9">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
