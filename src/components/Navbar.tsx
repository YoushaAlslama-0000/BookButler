import React, { useState } from 'react';
import {
  BookOpen,
  Heart,
  Home,
  Menu,
  Moon,
  ShoppingBag,
  Sun,
  User as UserIcon,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

export function Navbar() {
  const { currentPath, navigate, storeConfig, cart } = useApp();
  const { isDark, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: 'الرئيسية', path: '/', icon: Home },
    { label: 'الكتب', path: '/books', icon: BookOpen },
    { label: 'المفضلة', path: '/favorites', icon: Heart },
    { label: 'الملف الشخصي', path: '/profile', icon: UserIcon },
  ];

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  const cartCount = cart.itemsCount ?? cart.items.reduce((s, i) => s + i.quantity, 0);
  const cartActive = isActive('/cart');

  const handleNav = (path: string) => {
    setMobileOpen(false);
    navigate(path);
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-200 border-b ${
        isDark
          ? 'bg-[#001334]/95 border-[#F1EBE3]/12 backdrop-blur-md'
          : 'bg-[#001D51] border-[#001D51]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Brand Logo & Title */}
        <button
          type="button"
          onClick={() => handleNav('/')}
          className="flex items-center gap-2.5 text-xl sm:text-2xl font-bold tracking-tight text-[#F1EBE3] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F1EBE3]/60 rounded-lg px-1"
        >
          <img
            src={
              isDark
                ? '/assets/logos/book_logo_w.jpg'
                : '/assets/logos/book_logo_b.jpg'
            }
            alt="شعار Book Butler"
            className="w-9 h-9 rounded-lg object-cover border border-[#F1EBE3]/20 shrink-0"
          />
          <span className="font-display">
            {storeConfig.storeName || 'Book Butler'}
          </span>
        </button>

        {/* Zone 2: Desktop Navigation Links */}
        <nav
          aria-label="التنقل الرئيسي"
          className="hidden md:flex items-center gap-7"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => handleNav(item.path)}
                className={`group relative flex items-center gap-2 py-2 text-sm font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F1EBE3]/60 rounded ${
                  active
                    ? 'text-[#F1EBE3]'
                    : 'text-[#F1EBE3]/75 hover:text-[#F1EBE3]'
                }`}
              >
                <Icon
                  className="w-4 h-4 transition-colors duration-150"
                  style={{ color: active ? '#F1EBE3' : '#737373' }}
                />
                <span>{item.label}</span>
                <span
                  className={`absolute bottom-0 inset-x-0 h-0.5 rounded-full transition-transform duration-200 origin-center ${
                    active
                      ? 'bg-[#F1EBE3] scale-x-100'
                      : 'bg-[#F1EBE3]/50 scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Cart + Theme Toggle + Mobile Menu Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleNav('/cart')}
            aria-label="سلة المشتريات"
            className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F1EBE3]/60 ${
              cartActive
                ? 'bg-[#F1EBE3]/15 text-[#F1EBE3]'
                : 'text-[#F1EBE3]/85 hover:bg-[#F1EBE3]/10'
            }`}
          >
            <ShoppingBag
              className="w-5 h-5"
              style={{ color: cartActive ? '#F1EBE3' : '#F1EBE3' }}
            />
            <span className="hidden sm:inline">السلة</span>
            <span
              className={`min-w-5 h-5 px-1.5 inline-flex items-center justify-center rounded-md text-xs font-mono-num font-semibold ${
                cartCount > 0
                  ? 'bg-[#ff5c40] text-white'
                  : 'bg-[#F1EBE3]/15 text-[#F1EBE3]'
              }`}
            >
              {cartCount}
            </span>
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن'}
            title={isDark ? 'الوضع الفاتح' : 'الوضع الداكن'}
            className="w-10 h-10 inline-flex items-center justify-center rounded-lg text-[#F1EBE3] hover:bg-[#F1EBE3]/10 transition-colors duration-150 cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F1EBE3]/60"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="القائمة"
            className="md:hidden w-10 h-10 inline-flex items-center justify-center rounded-lg text-[#F1EBE3] hover:bg-[#F1EBE3]/10 transition-colors duration-150 cursor-pointer shrink-0"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div
          className={`md:hidden border-t px-4 py-3 space-y-1 ${
            isDark
              ? 'bg-[#001334] border-[#F1EBE3]/10'
              : 'bg-[#001D51] border-[#F1EBE3]/15'
          }`}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => handleNav(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#F1EBE3]/15 text-[#F1EBE3]'
                    : 'text-[#F1EBE3]/80 hover:bg-[#F1EBE3]/10 hover:text-[#F1EBE3]'
                }`}
              >
                <Icon
                  className="w-4 h-4"
                  style={{ color: active ? '#F1EBE3' : '#737373' }}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
