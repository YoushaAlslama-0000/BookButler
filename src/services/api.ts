import type {
  AdminDashboardResponse,
  AdminUser,
  Book,
  CartData,
  Category,
  RecommendationsResponse,
  StoreConfig,
  User,
} from '../types';

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ||  'http://localhost:5000').replace(/\/$/, '');

export const DEFAULT_SUPPORT_WHATSAPP_URL =
  'https://wa.me/963980266994?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%20Book%20Butler%20%20,%20%D9%84%D8%AF%D9%8A%20%D9%85%D8%B4%D9%83%D9%84%D8%A9%20%D9%81%D9%8A%20%D8%AA%D8%B3%D8%AC%D9%8A%D9%84%20%D8%A7%D9%84%D8%AF%D8%AE%D9%88%D9%84%20%D9%84%D8%AD%D8%B3%D8%A7%D8%A8%D9%8A%20%D8%B9%D9%84%D9%89%20%D9%85%D9%88%D9%82%D8%B9%20%D9%85%D8%AA%D8%AC%D8%B1%20%D8%A7%D9%84%D9%83%D8%AA%D8%A8%20%D9%88%20%D8%A7%D8%AD%D8%AA%D8%A7%D8%AC%20%D9%84%D9%85%D8%B3%D8%A7%D8%B9%D8%AF%D8%A9';

export const WHATSAPP_ORDER_PHONE = '963980266994';

export interface WhatsappOrderItem {
  title: string;
  quantity: number;
}

export function buildWhatsappOrderMessage(
  items: string[] | WhatsappOrderItem[]
): string {
  const titles = items.map((item) =>
    typeof item === 'string'
      ? item
      : item.quantity > 1
        ? `${item.title} (العدد: ${item.quantity})`
        : item.title
  );
  return `مرحبا Book Butler , اريد شراء الكتب التالية :  "${titles.join(' ، ')}"`;
}

export function buildWhatsappOrderUrl(
  items: string[] | WhatsappOrderItem[]
): string {
  return `https://wa.me/${WHATSAPP_ORDER_PHONE}?text=${encodeURIComponent(
    buildWhatsappOrderMessage(items)
  )}`;
}

export function getBookImageUrl(imagePath?: string | null): string | null {
  if (!imagePath) return null;
  if (
    imagePath.startsWith('http://') ||
    imagePath.startsWith('https://') ||
    imagePath.startsWith('data:')
  ) {
    return imagePath;
  }
  const normalized = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${API_BASE_URL}${normalized}`;
}

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers = new Headers(options.headers);
  const isFormData = options.body instanceof FormData;

  if (!isFormData && !headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch {
    throw new ApiError(
      'تعذر الاتصال بخادم التطبيق. يرجى التأكد من تشغيله ثم المحاولة مجدداً.',
      0
    );
  }

  const contentType = response.headers.get('content-type') || '';
  let payload: Record<string, unknown> | null = null;

  if (contentType.includes('application/json')) {
    try {
      payload = (await response.json()) as Record<string, unknown>;
    } catch {
      payload = null;
    }
  } else {
    const text = await response.text();
    if (text) {
      payload = { message: text };
    }
  }

  if (!response.ok) {
    const errMsg =
      (payload?.message as string) ||
      (payload?.error as string) ||
      (Array.isArray(payload?.errors)
        ? (payload?.errors as Array<{ message?: string; msg?: string }>)
            .map((e) => e.message || e.msg)
            .filter(Boolean)
            .join('، ')
        : '') ||
      `حدث خطأ في الطلب (${response.status})`;
    throw new ApiError(errMsg, response.status, payload);
  }

  return (payload ?? {}) as T;
}

function unwrap<T>(res: unknown, keys: string[] = []): T {
  if (res && typeof res === 'object' && !Array.isArray(res)) {
    const obj = res as Record<string, unknown>;
    for (const key of keys) {
      if (obj[key] !== undefined) {
        return obj[key] as T;
      }
    }
    if (obj.data !== undefined) {
      return obj.data as T;
    }
  }
  return res as T;
}

function normalizeBook(raw: Record<string, unknown>): Book {
  const price = Number(raw.price ?? 0);
  const discountPercentage = Number(raw.discountPercentage ?? 0);
  const hasDiscount =
    Boolean(raw.hasDiscount) || discountPercentage > 0;
  const computedFinal =
    discountPercentage > 0
      ? Number((price * (1 - discountPercentage / 100)).toFixed(2))
      : price;
  const finalPrice =
    raw.finalPrice !== undefined ? Number(raw.finalPrice) : computedFinal;

  const rawCategories = Array.isArray(raw.categories)
    ? (raw.categories as Array<Record<string, unknown> | string>).map(
        (cat, idx) =>
          typeof cat === 'string'
            ? { id: idx + 1, name: cat }
            : {
                id: Number(cat.id ?? idx + 1),
                name: String(cat.name ?? ''),
                description: cat.description ? String(cat.description) : undefined,
              }
      )
    : [];

  return {
    id: Number(raw.id),
    title: String(raw.title ?? ''),
    description: String(raw.description ?? ''),
    image: raw.image ? String(raw.image) : null,
    price,
    discountPercentage,
    hasDiscount,
    finalPrice,
    isWeeklyPick: Boolean(raw.isWeeklyPick),
    isMonthlyPick: Boolean(raw.isMonthlyPick),
    categories: rawCategories,
    categoryIds: Array.isArray(raw.categoryIds)
      ? (raw.categoryIds as unknown[]).map(Number)
      : rawCategories.map((c) => c.id),
    createdAt: raw.createdAt ? String(raw.createdAt) : undefined,
    updatedAt: raw.updatedAt ? String(raw.updatedAt) : undefined,
  };
}

export const storeApi = {
  async getConfig(): Promise<StoreConfig> {
    const res = await request<Record<string, unknown>>('/api/store/config');
    return unwrap<StoreConfig>(res, ['config', 'store']);
  },
};

export const authApi = {
  async register(body: {
    email: string;
    fullName: string;
    password: string;
    confirmPassword: string;
  }): Promise<{ token?: string; user?: User; message?: string }> {
    const res = await request<Record<string, unknown>>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    const inner = unwrap<Record<string, unknown>>(res);
    return {
      token: (inner.token || res.token) as string | undefined,
      user: (inner.user || res.user) as User | undefined,
      message: (res.message as string) || undefined,
    };
  },

  async login(body: {
    fullName: string;
    password: string;
  }): Promise<{ token: string; user: User }> {
    const res = await request<Record<string, unknown>>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    const inner = unwrap<Record<string, unknown>>(res);
    const token = String(inner.token || res.token || '');
    const user = (inner.user || res.user) as User;
    return { token, user };
  },

  async getProfile(token: string): Promise<User> {
    const res = await request<Record<string, unknown>>(
      '/api/auth/profile',
      {},
      token
    );
    return unwrap<User>(res, ['user', 'profile']);
  },

  async getSupportUrl(): Promise<string> {
    const res = await request<Record<string, unknown>>('/api/auth/support');
    const data = unwrap<Record<string, unknown>>(res);
    return String(
      data.whatsappUrl ||
        data.supportUrl ||
        data.url ||
        res.whatsappUrl ||
        res.supportUrl ||
        DEFAULT_SUPPORT_WHATSAPP_URL
    );
  },
};

export const booksApi = {
  async list(params?: {
    search?: string;
    categoryId?: number | string;
    category?: string;
    discounted?: boolean;
  }): Promise<Book[]> {
    const query = new URLSearchParams();
    if (params?.search?.trim()) query.set('search', params.search.trim());
    if (params?.categoryId) query.set('categoryId', String(params.categoryId));
    if (params?.category) query.set('category', params.category);
    if (params?.discounted) query.set('discounted', 'true');

    const qs = query.toString();
    const res = await request<unknown>(`/api/books${qs ? `?${qs}` : ''}`);
    const list = unwrap<unknown[]>(res, ['books', 'items']);
    return Array.isArray(list)
      ? list.map((b) => normalizeBook(b as Record<string, unknown>))
      : [];
  },

  async getRecommendations(): Promise<RecommendationsResponse> {
    const res = await request<Record<string, unknown>>(
      '/api/books/recommendations'
    );
    const data = unwrap<Record<string, unknown>>(res);
    const weeklyRaw = (data.weeklyPicks || res.weeklyPicks || []) as Array<
      Record<string, unknown>
    >;
    const monthlyRaw = (data.monthlyPicks || res.monthlyPicks || []) as Array<
      Record<string, unknown>
    >;
    return {
      weeklyPicks: Array.isArray(weeklyRaw) ? weeklyRaw.map(normalizeBook) : [],
      monthlyPicks: Array.isArray(monthlyRaw)
        ? monthlyRaw.map(normalizeBook)
        : [],
    };
  },

  async getById(id: number | string): Promise<Book> {
    const res = await request<Record<string, unknown>>(`/api/books/${id}`);
    const data = unwrap<Record<string, unknown>>(res, ['book']);
    return normalizeBook(data);
  },

  async create(formData: FormData, adminToken: string): Promise<Book> {
    const res = await request<Record<string, unknown>>(
      '/api/books',
      {
        method: 'POST',
        body: formData,
      },
      adminToken
    );
    const data = unwrap<Record<string, unknown>>(res, ['book']);
    return normalizeBook(data);
  },

  async update(
    id: number | string,
    body: FormData | Record<string, unknown>,
    adminToken: string
  ): Promise<Book> {
    const res = await request<Record<string, unknown>>(
      `/api/books/${id}`,
      {
        method: 'PUT',
        body: body instanceof FormData ? body : JSON.stringify(body),
      },
      adminToken
    );
    const data = unwrap<Record<string, unknown>>(res, ['book']);
    return normalizeBook(data);
  },

  async updateRecommendations(
    id: number | string,
    body: { isWeeklyPick: boolean; isMonthlyPick: boolean },
    adminToken: string
  ): Promise<Book> {
    const res = await request<Record<string, unknown>>(
      `/api/books/${id}/recommendations`,
      {
        method: 'PATCH',
        body: JSON.stringify(body),
      },
      adminToken
    );
    const data = unwrap<Record<string, unknown>>(res, ['book']);
    return normalizeBook(data);
  },

  async remove(id: number | string, adminToken: string): Promise<void> {
    await request<unknown>(
      `/api/books/${id}`,
      { method: 'DELETE' },
      adminToken
    );
  },
};

export const categoriesApi = {
  async list(): Promise<Category[]> {
    const res = await request<unknown>('/api/categories');
    const list = unwrap<Category[]>(res, ['categories', 'items']);
    return Array.isArray(list) ? list : [];
  },

  async create(
    body: { name: string; description?: string },
    adminToken: string
  ): Promise<Category> {
    const res = await request<Record<string, unknown>>(
      '/api/categories',
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      adminToken
    );
    return unwrap<Category>(res, ['category']);
  },

  async update(
    id: number | string,
    body: { name: string; description?: string },
    adminToken: string
  ): Promise<Category> {
    const res = await request<Record<string, unknown>>(
      `/api/categories/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(body),
      },
      adminToken
    );
    return unwrap<Category>(res, ['category']);
  },

  async remove(id: number | string, adminToken: string): Promise<void> {
    await request<unknown>(
      `/api/categories/${id}`,
      { method: 'DELETE' },
      adminToken
    );
  },
};

export const favoritesApi = {
  async list(userToken: string): Promise<Book[]> {
    const res = await request<unknown>('/api/favorites', {}, userToken);
    const rawList = unwrap<unknown[]>(res, ['favorites', 'books', 'items']);
    if (!Array.isArray(rawList)) return [];
    return rawList.map((item) => {
      const rec = item as Record<string, unknown>;
      const bookObj = (rec.book as Record<string, unknown>) || rec;
      return normalizeBook(bookObj);
    });
  },

  async toggle(
    bookId: number | string,
    userToken: string
  ): Promise<{ isFavorite?: boolean; message?: string }> {
    const res = await request<Record<string, unknown>>(
      `/api/favorites/${bookId}`,
      { method: 'POST' },
      userToken
    );
    return unwrap<{ isFavorite?: boolean; message?: string }>(res);
  },
};

export const cartApi = {
  async get(userToken: string): Promise<CartData> {
    const res = await request<Record<string, unknown>>(
      '/api/cart',
      {},
      userToken
    );
    const data = unwrap<Record<string, unknown>>(res, ['cart']);
    const rawItems = (data.items || res.items || []) as Array<
      Record<string, unknown>
    >;
    const items = Array.isArray(rawItems)
      ? rawItems.map((it) => ({
          id: Number(it.id),
          bookId: Number(it.bookId ?? (it.book as Record<string, unknown>)?.id),
          quantity: Number(it.quantity ?? 1),
          book: normalizeBook(
            ((it.book as Record<string, unknown>) || it) as Record<
              string,
              unknown
            >
          ),
          originalSubtotal:
            it.originalSubtotal !== undefined
              ? Number(it.originalSubtotal)
              : undefined,
          finalSubtotal:
            it.finalSubtotal !== undefined
              ? Number(it.finalSubtotal)
              : undefined,
        }))
      : [];

    const totalOriginalPrice = Number(
      data.totalOriginalPrice ?? res.totalOriginalPrice ?? 0
    );
    const totalFinalPrice = Number(
      data.totalFinalPrice ?? res.totalFinalPrice ?? 0
    );

    return {
      items,
      totalOriginalPrice,
      totalFinalPrice,
      totalSavings: Math.max(0, totalOriginalPrice - totalFinalPrice),
      itemsCount: items.reduce((acc, item) => acc + item.quantity, 0),
    };
  },

  async addItem(
    body: { bookId: number; quantity?: number },
    userToken: string
  ): Promise<void> {
    await request<unknown>(
      '/api/cart',
      {
        method: 'POST',
        body: JSON.stringify({ bookId: body.bookId, quantity: body.quantity ?? 1 }),
      },
      userToken
    );
  },

  async updateItem(
    itemId: number | string,
    quantity: number,
    userToken: string
  ): Promise<void> {
    await request<unknown>(
      `/api/cart/${itemId}`,
      {
        method: 'PUT',
        body: JSON.stringify({ quantity }),
      },
      userToken
    );
  },

  async removeItem(itemId: number | string, userToken: string): Promise<void> {
    await request<unknown>(
      `/api/cart/${itemId}`,
      { method: 'DELETE' },
      userToken
    );
  },

  async checkoutWhatsapp(
    userToken: string
  ): Promise<{ whatsappUrl: string; order?: Record<string, unknown> }> {
    const res = await request<Record<string, unknown>>(
      '/api/cart/checkout-whatsapp',
      { method: 'POST' },
      userToken
    );
    const data = unwrap<Record<string, unknown>>(res);
    const order = (data.order || res.order || data) as Record<string, unknown>;
    const whatsappUrl = String(
      order?.whatsappUrl || data.whatsappUrl || res.whatsappUrl || ''
    );
    return { whatsappUrl, order };
  },
};

export const adminApi = {
  async login(body: {
    username: string;
    password: string;
  }): Promise<{ token: string; admin?: AdminUser }> {
    const res = await request<Record<string, unknown>>('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    const data = unwrap<Record<string, unknown>>(res);
    return {
      token: String(data.token || res.token || ''),
      admin: (data.admin || res.admin) as AdminUser | undefined,
    };
  },

  async getDashboard(adminToken: string): Promise<AdminDashboardResponse> {
    const res = await request<Record<string, unknown>>(
      '/api/admin/dashboard',
      {},
      adminToken
    );
    const data = unwrap<Record<string, unknown>>(res);
    const rawStats = (data.stats || data) as Record<string, unknown>;
    const rawRecent = (data.recentBooks || res.recentBooks || []) as Array<
      Record<string, unknown>
    >;

    return {
      stats: {
        totalBooks: Number(rawStats.totalBooks ?? 0),
        discountedBooks: Number(rawStats.discountedBooks ?? 0),
        weeklyPicks: Number(
          rawStats.weeklyPicks ?? rawStats.weeklyPicksCount ?? 0
        ),
        monthlyPicks: Number(
          rawStats.monthlyPicks ?? rawStats.monthlyPicksCount ?? 0
        ),
        totalCategories: Number(
          rawStats.totalCategories ?? rawStats.categoriesCount ?? 0
        ),
        totalUsers: Number(rawStats.totalUsers ?? rawStats.usersCount ?? 0),
      },
      recentBooks: Array.isArray(rawRecent)
        ? rawRecent.map(normalizeBook)
        : [],
    };
  },
};
