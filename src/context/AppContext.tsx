// import React, {
//   createContext,
//   useCallback,
//   useContext,
//   useEffect,
//   useMemo,
//   useState,
// } from 'react';
// import {
//   adminApi,
//   authApi,
//   cartApi,
//   DEFAULT_SUPPORT_WHATSAPP_URL,
//   favoritesApi,
//   storeApi,
// } from '../services/api';
// import type {
//   AdminUser,
//   Book,
//   CartData,
//   StoreConfig,
//   ToastMessage,
//   User,
// } from '../types';

// interface AppContextValue {
//   currentPath: string;
//   navigate: (path: string) => void;
//   storeConfig: StoreConfig;
//   supportUrl: string;

//   userToken: string | null;
//   user: User | null;
//   isUserLoading: boolean;
//   loginUser: (fullName: string, password: string) => Promise<void>;
//   registerUser: (data: {
//     email: string;
//     fullName: string;
//     password: string;
//     confirmPassword: string;
//   }) => Promise<void>;
//   logoutUser: () => void;
//   refreshUserProfile: () => Promise<void>;

//   adminToken: string | null;
//   adminUser: AdminUser | null;
//   loginAdmin: (username: string, password: string) => Promise<void>;
//   logoutAdmin: () => void;

//   favorites: Book[];
//   favoriteIds: Set<number>;
//   refreshFavorites: () => Promise<void>;
//   toggleFavorite: (book: Book) => Promise<void>;

//   cart: CartData;
//   isCartLoading: boolean;
//   refreshCart: () => Promise<void>;
//   addToCart: (book: Book, quantity?: number) => Promise<void>;
//   updateCartQuantity: (itemId: number, quantity: number) => Promise<void>;
//   removeCartItem: (itemId: number) => Promise<void>;

//   toasts: ToastMessage[];
//   showToast: (text: string, type?: ToastMessage['type']) => void;
//   dismissToast: (id: string) => void;
// }

// const USER_TOKEN_KEY = 'book_butler_user_token';
// const ADMIN_TOKEN_KEY = 'book_butler_admin_token';

// const EMPTY_CART: CartData = {
//   items: [],
//   totalOriginalPrice: 0,
//   totalFinalPrice: 0,
//   totalSavings: 0,
//   itemsCount: 0,
// };

// const DEFAULT_STORE_CONFIG: StoreConfig = {
//   storeName: 'Book Butler',
//   description:
//     'خادمك الشخصي لاختيار الكتب العربية والعالمية بعناية — تصفح إصداراتنا المختارة، الترشيحات الأسبوعية والشهرية، واطلب نسختك مباشرة عبر واتساب.',
//   supportWhatsappUrl: DEFAULT_SUPPORT_WHATSAPP_URL,
// };

// const AppContext = createContext<AppContextValue | undefined>(undefined);

// export function AppProvider({ children }: { children: React.ReactNode }) {
//   const [currentPath, setCurrentPath] = useState<string>(() => {
//     return window.location.pathname || '/';
//   });

//   const [storeConfig, setStoreConfig] =
//     useState<StoreConfig>(DEFAULT_STORE_CONFIG);
//   const [supportUrl, setSupportUrl] = useState<string>(
//     DEFAULT_SUPPORT_WHATSAPP_URL
//   );

//   const [userToken, setUserToken] = useState<string | null>(() => {
//     try {
//       return localStorage.getItem(USER_TOKEN_KEY);
//     } catch {
//       return null;
//     }
//   });
//   const [user, setUser] = useState<User | null>(null);
//   const [isUserLoading, setIsUserLoading] = useState<boolean>(false);

//   const [adminToken, setAdminToken] = useState<string | null>(() => {
//     try {
//       return localStorage.getItem(ADMIN_TOKEN_KEY);
//     } catch {
//       return null;
//     }
//   });
//   const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

//   const [favorites, setFavorites] = useState<Book[]>([]);
//   const [cart, setCart] = useState<CartData>(EMPTY_CART);
//   const [isCartLoading, setIsCartLoading] = useState<boolean>(false);
//   const [toasts, setToasts] = useState<ToastMessage[]>([]);

//   const showToast = useCallback(
//     (text: string, type: ToastMessage['type'] = 'info') => {
//       const id = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
//       setToasts((prev) => [...prev, { id, text, type }]);
//       setTimeout(() => {
//         setToasts((prev) => prev.filter((t) => t.id !== id));
//       }, 4000);
//     },
//     []
//   );

//   const dismissToast = useCallback((id: string) => {
//     setToasts((prev) => prev.filter((t) => t.id !== id));
//   }, []);

//   const navigate = useCallback((path: string) => {
//     if (path !== window.location.pathname) {
//       window.history.pushState({}, '', path);
//     }
//     setCurrentPath(path);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   }, []);

//   useEffect(() => {
//     const onPopState = () => {
//       setCurrentPath(window.location.pathname || '/');
//     };
//     window.addEventListener('popstate', onPopState);
//     return () => window.removeEventListener('popstate', onPopState);
//   }, []);

//   // Load Store Config and Support URL
//   useEffect(() => {
//     let mounted = true;
//     storeApi
//       .getConfig()
//       .then((cfg) => {
//         if (!mounted || !cfg) return;
//         setStoreConfig((prev) => ({
//           ...prev,
//           ...cfg,
//           storeName: cfg.storeName || cfg.name || cfg.title || 'Book Butler',
//         }));
//         if (cfg.supportWhatsappUrl || cfg.whatsappUrl) {
//           setSupportUrl(String(cfg.supportWhatsappUrl || cfg.whatsappUrl));
//         }
//       })
//       .catch(() => {
//         // Fallback to default store config gracefully
//       });

//     authApi
//       .getSupportUrl()
//       .then((url) => {
//         if (mounted && url) setSupportUrl(url);
//       })
//       .catch(() => {
//         // Keep default WhatsApp support URL
//       });

//     return () => {
//       mounted = false;
//     };
//   }, []);

//   const refreshFavorites = useCallback(async () => {
//     if (!userToken) {
//       setFavorites([]);
//       return;
//     }
//     try {
//       const list = await favoritesApi.list(userToken);
//       setFavorites(list);
//     } catch {
//       // Keep existing state if request fails transiently
//     }
//   }, [userToken]);

//   const refreshCart = useCallback(async () => {
//     if (!userToken) {
//       setCart(EMPTY_CART);
//       return;
//     }
//     setIsCartLoading(true);
//     try {
//       const data = await cartApi.get(userToken);
//       setCart(data);
//     } catch {
//       // ignore transient error
//     } finally {
//       setIsCartLoading(false);
//     }
//   }, [userToken]);

//   const refreshUserProfile = useCallback(async () => {
//     if (!userToken) {
//       setUser(null);
//       return;
//     }
//     setIsUserLoading(true);
//     try {
//       const profile = await authApi.getProfile(userToken);
//       setUser(profile);
//     } catch (err) {
//       // Clear expired/invalid token if unauthorized
//       if (
//         err &&
//         typeof err === 'object' &&
//         'status' in err &&
//         (err as { status: number }).status === 401
//       ) {
//         localStorage.removeItem(USER_TOKEN_KEY);
//         setUserToken(null);
//         setUser(null);
//       }
//     } finally {
//       setIsUserLoading(false);
//     }
//   }, [userToken]);

//   useEffect(() => {
//     if (userToken) {
//       refreshUserProfile();
//       refreshFavorites();
//       refreshCart();
//     } else {
//       setUser(null);
//       setFavorites([]);
//       setCart(EMPTY_CART);
//     }
//   }, [userToken, refreshUserProfile, refreshFavorites, refreshCart]);

//   const loginUser = async (fullName: string, password: string) => {
//     const res = await authApi.login({ fullName, password });
//     localStorage.setItem(USER_TOKEN_KEY, res.token);
//     setUserToken(res.token);
//     setUser(res.user);
//     showToast(`أهلاً بك ${res.user?.fullName || fullName}`, 'success');
//   };

//   const registerUser = async (data: {
//     email: string;
//     fullName: string;
//     password: string;
//     confirmPassword: string;
//   }) => {
//     const res = await authApi.register(data);
//     if (res.token) {
//       localStorage.setItem(USER_TOKEN_KEY, res.token);
//       setUserToken(res.token);
//       if (res.user) setUser(res.user);
//       showToast('تم إنشاء حسابك وتسجيل الدخول بنجاح', 'success');
//       navigate('/');
//     } else {
//       showToast('تم إنشاء الحساب بنجاح، يمكنك تسجيل الدخول الآن', 'success');
//       navigate('/login');
//     }
//   };

//   const logoutUser = () => {
//     localStorage.removeItem(USER_TOKEN_KEY);
//     setUserToken(null);
//     setUser(null);
//     setFavorites([]);
//     setCart(EMPTY_CART);
//     showToast('تم تسجيل الخروج بنجاح', 'info');
//     navigate('/');
//   };

//   const loginAdmin = async (username: string, password: string) => {
//     const res = await adminApi.login({ username, password });
//     localStorage.setItem(ADMIN_TOKEN_KEY, res.token);
//     setAdminToken(res.token);
//     setAdminUser(res.admin || { username, role: 'superadmin' });
//     showToast('تم تسجيل دخول المشرف بنجاح', 'success');
//   };

//   const logoutAdmin = () => {
//     localStorage.removeItem(ADMIN_TOKEN_KEY);
//     setAdminToken(null);
//     setAdminUser(null);
//     showToast('تم تسجيل خروج المشرف', 'info');
//     navigate('/admin/login');
//   };

//   const favoriteIds = useMemo(
//     () => new Set(favorites.map((b) => b.id)),
//     [favorites]
//   );

//   const toggleFavorite = async (book: Book) => {
//     if (!userToken) {
//       showToast('يرجى تسجيل الدخول لإضافة الكتب إلى المفضلة', 'error');
//       navigate('/login');
//       return;
//     }

//     const wasFav = favoriteIds.has(book.id);
//     // Optimistic update
//     if (wasFav) {
//       setFavorites((prev) => prev.filter((item) => item.id !== book.id));
//     } else {
//       setFavorites((prev) => [book, ...prev]);
//     }

//     try {
//       await favoritesApi.toggle(book.id, userToken);
//       showToast(
//         wasFav
//           ? `تمت إزالة "${book.title}" من المفضلة`
//           : `تمت إضافة "${book.title}" إلى المفضلة`,
//         'success'
//       );
//       refreshFavorites();
//     } catch (err) {
//       // Revert optimistic update
//       refreshFavorites();
//       showToast(
//         err instanceof Error ? err.message : 'تعذر تحديث المفضلة',
//         'error'
//       );
//     }
//   };

//   const addToCart = async (book: Book, quantity = 1) => {
//     if (!userToken) {
//       showToast('يرجى تسجيل الدخول لإضافة الكتب إلى السلة', 'error');
//       navigate('/login');
//       return;
//     }

//     try {
//       await cartApi.addItem({ bookId: book.id, quantity }, userToken);
//       await refreshCart();
//       showToast(`تمت إضافة "${book.title}" إلى السلة`, 'success');
//     } catch (err) {
//       showToast(
//         err instanceof Error ? err.message : 'تعذر إضافة الكتاب إلى السلة',
//         'error'
//       );
//     }
//   };

//   const updateCartQuantity = async (itemId: number, quantity: number) => {
//     if (!userToken) return;
//     if (quantity < 1) {
//       await removeCartItem(itemId);
//       return;
//     }
//     try {
//       await cartApi.updateItem(itemId, quantity, userToken);
//       await refreshCart();
//     } catch (err) {
//       showToast(
//         err instanceof Error ? err.message : 'تعذر تعديل الكمية',
//         'error'
//       );
//     }
//   };

//   const removeCartItem = async (itemId: number) => {
//     if (!userToken) return;
//     try {
//       await cartApi.removeItem(itemId, userToken);
//       await refreshCart();
//       showToast('تم حذف الكتاب من السلة', 'info');
//     } catch (err) {
//       showToast(
//         err instanceof Error ? err.message : 'تعذر حذف الكتاب من السلة',
//         'error'
//       );
//     }
//   };

//   return (
//     <AppContext.Provider
//       value={{
//         currentPath,
//         navigate,
//         storeConfig,
//         supportUrl,
//         userToken,
//         user,
//         isUserLoading,
//         loginUser,
//         registerUser,
//         logoutUser,
//         refreshUserProfile,
//         adminToken,
//         adminUser,
//         loginAdmin,
//         logoutAdmin,
//         favorites,
//         favoriteIds,
//         refreshFavorites,
//         toggleFavorite,
//         cart,
//         isCartLoading,
//         refreshCart,
//         addToCart,
//         updateCartQuantity,
//         removeCartItem,
//         toasts,
//         showToast,
//         dismissToast,
//       }}
//     >
//       {children}
//     </AppContext.Provider>
//   );
// }

// export function useApp() {
//   const ctx = useContext(AppContext);
//   if (!ctx) throw new Error('useApp must be used within AppProvider');
//   return ctx;
// }


import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  adminApi,
  authApi,
  cartApi,
  DEFAULT_SUPPORT_WHATSAPP_URL,
  favoritesApi,
  storeApi,
} from '../services/api';
import type {
  AdminUser,
  Book,
  CartData,
  StoreConfig,
  ToastMessage,
  User,
} from '../types';

interface AppContextValue {
  currentPath: string;
  navigate: (path: string) => void;
  storeConfig: StoreConfig;
  supportUrl: string;

  userToken: string | null;
  user: User | null;
  isUserLoading: boolean;
  loginUser: (fullName: string, password: string) => Promise<void>;
  registerUser: (data: {
    email: string;
    fullName: string;
    password: string;
    confirmPassword: string;
  }) => Promise<void>;
  logoutUser: () => void;
  refreshUserProfile: () => Promise<void>;

  adminToken: string | null;
  adminUser: AdminUser | null;
  loginAdmin: (username: string, password: string) => Promise<void>;
  logoutAdmin: () => void;

  favorites: Book[];
  favoriteIds: Set<number>;
  refreshFavorites: () => Promise<void>;
  toggleFavorite: (book: Book) => Promise<void>;

  cart: CartData;
  isCartLoading: boolean;
  isCartUpdating: boolean;
  refreshCart: () => Promise<void>;
  addToCart: (book: Book, quantity?: number) => Promise<void>;
  updateCartQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeCartItem: (itemId: number) => Promise<void>;

  toasts: ToastMessage[];
  showToast: (text: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;
}

const USER_TOKEN_KEY = 'book_butler_user_token';
const ADMIN_TOKEN_KEY = 'book_butler_admin_token';

const EMPTY_CART: CartData = {
  items: [],
  totalOriginalPrice: 0,
  totalFinalPrice: 0,
  totalSavings: 0,
  itemsCount: 0,
};

const DEFAULT_STORE_CONFIG: StoreConfig = {
  storeName: 'Book Butler',
  description:
    'خادمك الشخصي لاختيار الكتب العربية والعالمية بعناية — تصفح إصداراتنا المختارة، الترشيحات الأسبوعية والشهرية، واطلب نسختك مباشرة عبر واتساب.',
  supportWhatsappUrl: DEFAULT_SUPPORT_WHATSAPP_URL,
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [storeConfig, setStoreConfig] =
    useState<StoreConfig>(DEFAULT_STORE_CONFIG);
  const [supportUrl, setSupportUrl] = useState<string>(
    DEFAULT_SUPPORT_WHATSAPP_URL
  );

  const [userToken, setUserToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(USER_TOKEN_KEY);
    } catch {
      return null;
    }
  });
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState<boolean>(false);

  const [adminToken, setAdminToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(ADMIN_TOKEN_KEY);
    } catch {
      return null;
    }
  });
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  const [favorites, setFavorites] = useState<Book[]>([]);
  const [cart, setCart] = useState<CartData>(EMPTY_CART);
  const [isCartLoading, setIsCartLoading] = useState<boolean>(false);
  const [isCartUpdating, setIsCartUpdating] = useState<boolean>(false);
  const pendingCartOpsRef = useRef<number>(0);
  const cartQueueRef = useRef<Promise<void>>(Promise.resolve());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (text: string, type: ToastMessage['type'] = 'info') => {
      const id = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev, { id, text, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const navigate = useCallback((path: string) => {
    if (path !== window.location.pathname) {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Load Store Config and Support URL
  useEffect(() => {
    let mounted = true;
    storeApi
      .getConfig()
      .then((cfg) => {
        if (!mounted || !cfg) return;
        setStoreConfig((prev) => ({
          ...prev,
          ...cfg,
          storeName: cfg.storeName || cfg.name || cfg.title || 'Book Butler',
        }));
        if (cfg.supportWhatsappUrl || cfg.whatsappUrl) {
          setSupportUrl(String(cfg.supportWhatsappUrl || cfg.whatsappUrl));
        }
      })
      .catch(() => {
        // Fallback to default store config gracefully
      });

    authApi
      .getSupportUrl()
      .then((url) => {
        if (mounted && url) setSupportUrl(url);
      })
      .catch(() => {
        // Keep default WhatsApp support URL
      });

    return () => {
      mounted = false;
    };
  }, []);

  const refreshFavorites = useCallback(async () => {
    if (!userToken) {
      setFavorites([]);
      return;
    }
    try {
      const list = await favoritesApi.list(userToken);
      setFavorites(list);
    } catch {
      // Keep existing state if request fails transiently
    }
  }, [userToken]);

  const refreshCart = useCallback(async () => {
    if (!userToken) {
      setCart(EMPTY_CART);
      return;
    }
    setIsCartLoading(true);
    try {
      const data = await cartApi.get(userToken);
      setCart(data);
    } catch {
      // ignore transient error
    } finally {
      setIsCartLoading(false);
    }
  }, [userToken]);

  const refreshUserProfile = useCallback(async () => {
    if (!userToken) {
      setUser(null);
      return;
    }
    setIsUserLoading(true);
    try {
      const profile = await authApi.getProfile(userToken);
      setUser(profile);
    } catch (err) {
      // Clear expired/invalid token if unauthorized
      if (
        err &&
        typeof err === 'object' &&
        'status' in err &&
        (err as { status: number }).status === 401
      ) {
        localStorage.removeItem(USER_TOKEN_KEY);
        setUserToken(null);
        setUser(null);
      }
    } finally {
      setIsUserLoading(false);
    }
  }, [userToken]);

  useEffect(() => {
    if (userToken) {
      refreshUserProfile();
      refreshFavorites();
      refreshCart();
    } else {
      setUser(null);
      setFavorites([]);
      setCart(EMPTY_CART);
    }
  }, [userToken, refreshUserProfile, refreshFavorites, refreshCart]);

  const loginUser = async (fullName: string, password: string) => {
    const res = await authApi.login({ fullName, password });
    localStorage.setItem(USER_TOKEN_KEY, res.token);
    setUserToken(res.token);
    setUser(res.user);
    showToast(`أهلاً بك ${res.user?.fullName || fullName}`, 'success');
  };

  const registerUser = async (data: {
    email: string;
    fullName: string;
    password: string;
    confirmPassword: string;
  }) => {
    const res = await authApi.register(data);
    if (res.token) {
      localStorage.setItem(USER_TOKEN_KEY, res.token);
      setUserToken(res.token);
      if (res.user) setUser(res.user);
      showToast('تم إنشاء حسابك وتسجيل الدخول بنجاح', 'success');
      navigate('/');
    } else {
      showToast('تم إنشاء الحساب بنجاح، يمكنك تسجيل الدخول الآن', 'success');
      navigate('/login');
    }
  };

  const logoutUser = () => {
    localStorage.removeItem(USER_TOKEN_KEY);
    setUserToken(null);
    setUser(null);
    setFavorites([]);
    setCart(EMPTY_CART);
    showToast('تم تسجيل الخروج بنجاح', 'info');
    navigate('/');
  };

  const loginAdmin = async (username: string, password: string) => {
    const res = await adminApi.login({ username, password });
    localStorage.setItem(ADMIN_TOKEN_KEY, res.token);
    setAdminToken(res.token);
    setAdminUser(res.admin || { username, role: 'superadmin' });
    showToast('تم تسجيل دخول المشرف بنجاح', 'success');
  };

  const logoutAdmin = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setAdminToken(null);
    setAdminUser(null);
    showToast('تم تسجيل خروج المشرف', 'info');
    navigate('/admin/login');
  };

  const favoriteIds = useMemo(
    () => new Set(favorites.map((b) => b.id)),
    [favorites]
  );

  const toggleFavorite = async (book: Book) => {
    if (!userToken) {
      showToast('يرجى تسجيل الدخول لإضافة الكتب إلى المفضلة', 'error');
      navigate('/login');
      return;
    }

    const wasFav = favoriteIds.has(book.id);
    // Optimistic update
    if (wasFav) {
      setFavorites((prev) => prev.filter((item) => item.id !== book.id));
    } else {
      setFavorites((prev) => [book, ...prev]);
    }

    try {
      await favoritesApi.toggle(book.id, userToken);
      showToast(
        wasFav
          ? `تمت إزالة "${book.title}" من المفضلة`
          : `تمت إضافة "${book.title}" إلى المفضلة`,
        'success'
      );
      refreshFavorites();
    } catch (err) {
      // Revert optimistic update
      refreshFavorites();
      showToast(
        err instanceof Error ? err.message : 'تعذر تحديث المفضلة',
        'error'
      );
    }
  };

  const recalculateCart = (items: CartData['items']): CartData => {
    const totalOriginalPrice = Number(
      items
        .reduce((sum, item) => sum + Number(item.book.price || 0) * item.quantity, 0)
        .toFixed(2)
    );
    const totalFinalPrice = Number(
      items
        .reduce(
          (sum, item) =>
            sum + Number(item.book.finalPrice ?? item.book.price ?? 0) * item.quantity,
          0
        )
        .toFixed(2)
    );
    return {
      items,
      totalOriginalPrice,
      totalFinalPrice,
      totalSavings: Number(Math.max(0, totalOriginalPrice - totalFinalPrice).toFixed(2)),
      itemsCount: items.reduce((acc, item) => acc + item.quantity, 0),
    };
  };

  const enqueueCartMutation = (task: () => Promise<void>) => {
    pendingCartOpsRef.current += 1;
    setIsCartUpdating(true);

    const run = cartQueueRef.current.then(task, task).finally(async () => {
      pendingCartOpsRef.current = Math.max(0, pendingCartOpsRef.current - 1);
      if (pendingCartOpsRef.current === 0) {
        await refreshCart();
        setIsCartUpdating(false);
      }
    });

    cartQueueRef.current = run.catch(() => {});
    return run;
  };

  const addToCart = async (book: Book, quantity = 1) => {
    if (!userToken) {
      showToast('يرجى تسجيل الدخول لإضافة الكتب إلى السلة', 'error');
      navigate('/login');
      return;
    }

    await enqueueCartMutation(async () => {
      try {
        await cartApi.addItem({ bookId: book.id, quantity }, userToken);
        showToast(`تمت إضافة "${book.title}" إلى السلة`, 'success');
      } catch (err) {
        showToast(
          err instanceof Error ? err.message : 'تعذر إضافة الكتاب إلى السلة',
          'error'
        );
      }
    });
  };

  const updateCartQuantity = async (itemId: number, quantity: number) => {
    if (!userToken) return;
    if (quantity < 1) {
      await removeCartItem(itemId);
      return;
    }

    // Optimistic update for responsive UI & accurate totals
    setCart((prev) =>
      recalculateCart(
        prev.items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        )
      )
    );

    await enqueueCartMutation(async () => {
      try {
        await cartApi.updateItem(itemId, quantity, userToken);
      } catch (err) {
        showToast(
          err instanceof Error ? err.message : 'تعذر تعديل الكمية',
          'error'
        );
      }
    });
  };

  const removeCartItem = async (itemId: number) => {
    if (!userToken) return;

    // Optimistic removal
    setCart((prev) =>
      recalculateCart(prev.items.filter((item) => item.id !== itemId))
    );

    await enqueueCartMutation(async () => {
      try {
        await cartApi.removeItem(itemId, userToken);
        showToast('تم حذف الكتاب من السلة', 'info');
      } catch (err) {
        showToast(
          err instanceof Error ? err.message : 'تعذر حذف الكتاب من السلة',
          'error'
        );
      }
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentPath,
        navigate,
        storeConfig,
        supportUrl,
        userToken,
        user,
        isUserLoading,
        loginUser,
        registerUser,
        logoutUser,
        refreshUserProfile,
        adminToken,
        adminUser,
        loginAdmin,
        logoutAdmin,
        favorites,
        favoriteIds,
        refreshFavorites,
        toggleFavorite,
        cart,
        isCartLoading,
        isCartUpdating,
        refreshCart,
        addToCart,
        updateCartQuantity,
        removeCartItem,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
