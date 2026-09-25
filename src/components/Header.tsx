import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Car,
  Menu,
  X,
  Zap,
  Shield,
  Phone,
  User,
  LogOut,
  Search,
  ChevronDown,
  Battery,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import logo from "./logo.png";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const getNavItems = () => {
    if (isAuthenticated) {
      if (user?.role === "admin") {
        return [{ path: "/admin", label: "Admin Dashboard", icon: Shield }];
      } else if (user?.role === "garage_owner") {
        return [
          { path: "/", label: "Home", icon: Car },
          {
            path: "/garage-dashboard",
            label: "Garage Dashboard",
            icon: Shield,
          },
          { path: "/manage-bookings", label: "Manage Bookings", icon: Zap },
        ];
      } else {
        return [
          { path: "/", label: "Home", icon: Car },
          { path: "/garages", label: "Find Garages", icon: Search },
          {
            path: "/battery-charging",
            label: "Battery Charging",
            icon: Battery,
          },
          { path: "/booking", label: "Book Service", icon: Zap },
          { path: "/emergency", label: "Emergency", icon: Phone },
          { path: "/diagnosis", label: "AI Diagnosis", icon: Shield },
        ];
      }
    }

    return [
      { path: "/", label: "Home", icon: Car },
      { path: "/garages", label: "Find Garages", icon: Search },
      { path: "/battery-charging", label: "Battery Charging", icon: Battery },
    ];
  };

  const navItems = getNavItems();

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-secondary/95 text-accent shadow-lg shadow-black/10 backdrop-blur-md">
      <div className="h-1 bg-primary" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-[4.5rem] items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to={user?.role === "admin" ? "/admin" : "/"}
            className="group flex shrink-0 items-center"
            aria-label="Veloresq home"
          >
            <img
              src={logo}
              alt="Veloresq"
              className="mr-3 h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.03]"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden flex-1 items-center justify-center gap-1 md:flex"
            aria-label="Primary navigation"
          >
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`group relative flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
                  isActive(path)
                    ? "bg-primary text-secondary shadow-sm shadow-primary/20"
                    : "text-accent/75 hover:bg-white/5 hover:text-primary"
                }`}
              >
                <Icon className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated ? (
              <>
                <div
                  className="hidden items-center gap-2 text-xs text-accent/50 xl:flex"
                  title="Veloresq service network"
                >
                  <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_0_3px_rgba(234,179,8,0.15)]" />
                  <span>Service network online</span>
                </div>
                {/* Go Premium Button (for customers only) */}
                {user?.role === "customer" && (
                  <Link
                    to="/subscription"
                    className="flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2.5 text-sm font-semibold text-secondary transition-all duration-200 hover:bg-primary-dark hover:shadow-md hover:shadow-primary/20"
                  >
                    <Zap className="h-4 w-4" />
                    <span>Go Premium</span>
                  </Link>
                )}

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() =>
                      setIsProfileDropdownOpen(!isProfileDropdownOpen)
                    }
                    aria-expanded={isProfileDropdownOpen}
                    aria-haspopup="menu"
                    aria-label="Open account menu"
                    className="flex items-center gap-2 rounded-lg px-2.5 py-2 transition-colors duration-200 hover:bg-white/5"
                  >
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-secondary" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-accent">
                        {user?.firstName} {user?.lastName}
                      </div>
                      <div className="text-xs text-gray-400 capitalize">
                        {user?.role?.replace("_", " ")}
                      </div>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                        isProfileDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <User className="h-4 w-4 mr-3" />
                        View Profile
                      </Link>

                      {user?.role === "customer" && (
                        <>
                          <Link
                            to="/subscription"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                          >
                            <Zap className="h-4 w-4 mr-3" />
                            Manage Subscription
                          </Link>
                          <Link
                            to="/battery-charging"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                          >
                            <Battery className="h-4 w-4 mr-3" />
                            Battery Charging
                          </Link>
                        </>
                      )}

                      <hr className="my-2" />

                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg border border-primary/70 px-3.5 py-2.5 text-sm font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-secondary"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-primary px-3.5 py-2.5 text-sm font-semibold text-secondary transition-all duration-200 hover:bg-primary-dark hover:shadow-md hover:shadow-primary/20"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={
              isMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            className="rounded-lg p-2 text-accent transition-colors duration-200 hover:bg-white/10 md:hidden"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div
            id="mobile-navigation"
            className="animate-slide-up border-t border-white/10 py-4 md:hidden"
          >
            <nav className="space-y-2">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive(path)
                      ? "bg-primary text-secondary"
                      : "text-accent hover:bg-gray-dark hover:text-primary"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              ))}

              <div className="pt-4 space-y-2 border-t border-gray-dark">
                {isAuthenticated ? (
                  <>
                    {/* User Info */}
                    <div className="px-3 py-2 text-accent">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-secondary" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">
                            {user?.firstName} {user?.lastName}
                          </div>
                          <div className="text-xs text-gray-400 capitalize">
                            {user?.role?.replace("_", " ")}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Profile Link */}
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 text-accent hover:bg-gray-dark hover:text-primary rounded-md transition-colors duration-200"
                    >
                      <User className="h-4 w-4" />
                      <span>View Profile</span>
                    </Link>

                    {/* Go Premium (for customers) */}
                    {user?.role === "customer" && (
                      <>
                        <Link
                          to="/subscription"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center space-x-2 bg-primary text-secondary px-3 py-2 rounded-lg font-semibold mx-3"
                        >
                          <Zap className="h-4 w-4" />
                          <span>Go Premium</span>
                        </Link>
                        <Link
                          to="/battery-charging"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center space-x-2 px-3 py-2 text-accent hover:bg-gray-dark hover:text-primary rounded-md transition-colors duration-200"
                        >
                          <Battery className="h-4 w-4" />
                          <span>Battery Charging</span>
                        </Link>
                      </>
                    )}

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 text-red-400 px-3 py-2 rounded-lg hover:bg-red-900 hover:bg-opacity-20 transition-colors duration-200"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block border border-primary text-primary px-3 py-2 rounded-lg font-semibold text-center mx-3"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="block bg-primary text-secondary px-3 py-2 rounded-lg font-semibold text-center mx-3"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {isProfileDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileDropdownOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
