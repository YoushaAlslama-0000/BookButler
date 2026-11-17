import React from 'react';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { ToastContainer } from './components/ToastContainer';
import { AppProvider, useApp } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { BookDetailPage } from './pages/BookDetailPage';
import { BooksPage } from './pages/BooksPage';
import { CartPage } from './pages/CartPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { RegisterPage } from './pages/RegisterPage';

function AppRoutes() {
  const { currentPath } = useApp();
  const pathname = (currentPath.split('?')[0] || '/').replace(/\/+$/, '') || '/';

  const renderPage = () => {
    if (pathname === '/') return <HomePage />;
    if (pathname === '/books') return <BooksPage />;

    const bookMatch = pathname.match(/^\/books\/([^/]+)$/);
    if (bookMatch) {
      return <BookDetailPage bookId={bookMatch[1]} />;
    }

    if (pathname === '/favorites') return <FavoritesPage />;
    if (pathname === '/profile') return <ProfilePage />;
    if (pathname === '/cart') return <CartPage />;
    if (pathname === '/login') return <LoginPage />;
    if (pathname === '/register') return <RegisterPage />;
    if (pathname === '/admin/login') return <AdminLoginPage />;
    if (pathname === '/admin/dashboard') return <AdminDashboardPage />;

    return <HomePage />;
  };

  return (
    <div dir="rtl" className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{renderPage()}</main>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </ThemeProvider>
  );
}
