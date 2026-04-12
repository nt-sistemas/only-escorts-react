import { Outlet, Link, useNavigate } from "react-router";
import { LogOut, Edit } from "lucide-react";
import { Button } from "../ui/button";
import OnlyLogo from "../../assets/img/logo.svg";
import { clearAuthSession, getAuthSession, hasRole } from "../../auth/session";

export function MainLayout() {
  const navigate = useNavigate();
  const isAuthenticated = Boolean(getAuthSession());
  const isUser = hasRole("user");

  const handleLogout = () => {
    clearAuthSession();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-primary/80 bg-primary text-primary-foreground shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary-foreground">
            <img src={OnlyLogo} alt="Only Escorts Intim" className="h-8" />
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            {!isAuthenticated && (
              <Link to="/models" className="text-primary-foreground/85 hover:text-primary-foreground transition-colors">
                Models
              </Link>
            )}
            {!isAuthenticated && (
              <Link to="/plans" className="text-primary-foreground/85 hover:text-primary-foreground transition-colors">
                Plans
              </Link>
            )}
            {isUser && (
              <Link to="/edit-profile" className="text-primary-foreground/85 hover:text-primary-foreground transition-colors">
                My Profile
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {isUser && (
              <Button
                onClick={() => navigate("/edit-profile")}
                variant="ghost"
                size="sm"
                className="text-primary-foreground/85 hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
            {isAuthenticated && (
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-primary-foreground/85 hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-border/80 bg-card/70 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-pink-500 font-bold mb-4">Only Escorts Intim</h3>
              <p className="text-muted-foreground text-sm">
                The best luxury companion platform.
              </p>
            </div>
            <div>
              <h4 className="text-foreground font-semibold mb-4">Links</h4>
              <ul className="space-y-2 text-sm">
                {!isAuthenticated && (
                  <li><Link to="/models" className="text-muted-foreground hover:text-pink-500 transition-colors">Models</Link></li>
                )}
                {!isAuthenticated && (
                  <li><Link to="/plans" className="text-muted-foreground hover:text-pink-500 transition-colors">Plans</Link></li>
                )}
                <li><Link to="/register" className="text-muted-foreground hover:text-pink-500 transition-colors">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-foreground font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-pink-500 transition-colors">FAQ</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-pink-500 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-foreground font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-pink-500 transition-colors">Terms of Use</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-pink-500 transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-border/80 pt-8 text-center text-muted-foreground text-sm">
            © 2026 Only Escorts Intim. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
