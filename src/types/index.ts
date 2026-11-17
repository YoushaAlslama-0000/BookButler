export interface StoreConfig {
  storeName?: string;
  name?: string;
  title?: string;
  description?: string;
  about?: string;
  tagline?: string;
  supportWhatsappUrl?: string;
  whatsappUrl?: string;
  supportPhone?: string;
  colors?: {
    primary?: string;
    accent?: string;
    light?: Record<string, string>;
    dark?: Record<string, string>;
  };
}

export interface User {
  id: number | string;
  email: string;
  fullName: string;
  createdAt?: string;
}

export interface AdminUser {
  id?: number | string;
  username: string;
  role?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  booksCount?: number;
}

export interface Book {
  id: number;
  title: string;
  description: string;
  image?: string | null;
  price: number;
  discountPercentage?: number;
  hasDiscount?: boolean;
  finalPrice?: number;
  isWeeklyPick?: boolean;
  isMonthlyPick?: boolean;
  categories?: Category[];
  categoryIds?: number[];
  createdAt?: string;
  updatedAt?: string;
}

export interface RecommendationsResponse {
  weeklyPicks: Book[];
  monthlyPicks: Book[];
}

export interface CartItem {
  id: number;
  bookId: number;
  quantity: number;
  book: Book;
  originalSubtotal?: number;
  finalSubtotal?: number;
}

export interface CartData {
  items: CartItem[];
  totalOriginalPrice: number;
  totalFinalPrice: number;
  totalSavings?: number;
  itemsCount?: number;
}

export interface AdminDashboardStats {
  totalBooks: number;
  discountedBooks: number;
  weeklyPicks: number;
  monthlyPicks: number;
  totalCategories: number;
  totalUsers: number;
}

export interface AdminDashboardResponse {
  stats: AdminDashboardStats;
  recentBooks: Book[];
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}
