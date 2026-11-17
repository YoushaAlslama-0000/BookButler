import React, { useCallback, useEffect, useState } from 'react';
import {
  BookOpen,
  Calendar,
  Edit3,
  FolderPlus,
  Layers,
  LogOut,
  Percent,
  Plus,
  RefreshCw,
  Search,
  Star,
  Trash2,
  Upload,
  Users,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  adminApi,
  booksApi,
  categoriesApi,
  getBookImageUrl,
} from '../services/api';
import type { AdminDashboardStats, Book, Category } from '../types';

const EMPTY_STATS: AdminDashboardStats = {
  totalBooks: 0,
  discountedBooks: 0,
  weeklyPicks: 0,
  monthlyPicks: 0,
  totalCategories: 0,
  totalUsers: 0,
};

export function AdminDashboardPage() {
  const { adminToken, logoutAdmin, navigate, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'books' | 'categories'>('books');
  const [stats, setStats] = useState<AdminDashboardStats>(EMPTY_STATS);
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tableSearch, setTableSearch] = useState('');

  // Book Form State
  const [editingBookId, setEditingBookId] = useState<number | null>(null);
  const [bookTitle, setBookTitle] = useState('');
  const [bookDescription, setBookDescription] = useState('');
  const [bookPrice, setBookPrice] = useState('');
  const [bookDiscount, setBookDiscount] = useState('0');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [isWeeklyPick, setIsWeeklyPick] = useState(false);
  const [isMonthlyPick, setIsMonthlyPick] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [savingBook, setSavingBook] = useState(false);

  // Category Form State
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null
  );
  const [catName, setCatName] = useState('');
  const [catDescription, setCatDescription] = useState('');
  const [savingCategory, setSavingCategory] = useState(false);

  useEffect(() => {
    if (!adminToken) {
      navigate('/admin/login');
    }
  }, [adminToken, navigate]);

  const loadDashboardData = useCallback(async () => {
    if (!adminToken) return;
    setLoading(true);
    setError(null);
    try {
      const [dashRes, allBooks, allCategories] = await Promise.all([
        adminApi.getDashboard(adminToken),
        booksApi.list(),
        categoriesApi.list(),
      ]);
      setStats(dashRes.stats);
      setBooks(allBooks);
      setCategories(allCategories);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'تعذر تحميل بيانات لوحة التحكم'
      );
    } finally {
      setLoading(false);
    }
  }, [adminToken]);

  useEffect(() => {
    if (adminToken) {
      loadDashboardData();
    }
  }, [adminToken, loadDashboardData]);

  const resetBookForm = () => {
    setEditingBookId(null);
    setBookTitle('');
    setBookDescription('');
    setBookPrice('');
    setBookDiscount('0');
    setSelectedCategoryIds([]);
    setIsWeeklyPick(false);
    setIsMonthlyPick(false);
    setImageFile(null);
    setImagePreview(null);
  };

  const startEditBook = (book: Book) => {
    setActiveTab('books');
    setEditingBookId(book.id);
    setBookTitle(book.title);
    setBookDescription(book.description || '');
    setBookPrice(String(book.price));
    setBookDiscount(String(book.discountPercentage ?? 0));
    setSelectedCategoryIds(
      book.categoryIds || book.categories?.map((c) => c.id) || []
    );
    setIsWeeklyPick(Boolean(book.isWeeklyPick));
    setIsMonthlyPick(Boolean(book.isMonthlyPick));
    setImageFile(null);
    setImagePreview(getBookImageUrl(book.image));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(String(reader.result));
    reader.readAsDataURL(file);
  };

  const toggleCategorySelection = (id: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSaveBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;

    if (!bookTitle.trim() || !bookPrice) {
      showToast('يرجى إدخال اسم الكتاب والسعر.', 'error');
      return;
    }

    const formData = new FormData();
    if (imageFile) {
      formData.append('image', imageFile);
    }
    formData.append('title', bookTitle.trim());
    formData.append('description', bookDescription.trim());
    formData.append('price', String(Number(bookPrice)));
    formData.append('discountPercentage', String(Number(bookDiscount || 0)));
    formData.append('isWeeklyPick', String(isWeeklyPick));
    formData.append('isMonthlyPick', String(isMonthlyPick));
    formData.append('categoryIds', JSON.stringify(selectedCategoryIds));

    setSavingBook(true);
    try {
      if (editingBookId !== null) {
        await booksApi.update(editingBookId, formData, adminToken);
        showToast('تم تحديث بيانات الكتاب بنجاح', 'success');
      } else {
        await booksApi.create(formData, adminToken);
        showToast('تمت إضافة الكتاب بنجاح', 'success');
      }
      resetBookForm();
      await loadDashboardData();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'تعذر حفظ الكتاب',
        'error'
      );
    } finally {
      setSavingBook(false);
    }
  };

  const handleDeleteBook = async (book: Book) => {
    if (!adminToken) return;
    try {
      await booksApi.remove(book.id, adminToken);
      showToast(`تم حذف كتاب "${book.title}"`, 'info');
      if (editingBookId === book.id) resetBookForm();
      await loadDashboardData();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'تعذر حذف الكتاب',
        'error'
      );
    }
  };

  const handleToggleRecommendation = async (
    book: Book,
    field: 'isWeeklyPick' | 'isMonthlyPick'
  ) => {
    if (!adminToken) return;
    const payload = {
      isWeeklyPick:
        field === 'isWeeklyPick' ? !book.isWeeklyPick : Boolean(book.isWeeklyPick),
      isMonthlyPick:
        field === 'isMonthlyPick'
          ? !book.isMonthlyPick
          : Boolean(book.isMonthlyPick),
    };
    try {
      await booksApi.updateRecommendations(book.id, payload, adminToken);
      showToast('تم تحديث حالة الترشيح بنجاح', 'success');
      await loadDashboardData();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'تعذر تحديث حالة الترشيح',
        'error'
      );
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;
    if (!catName.trim()) {
      showToast('يرجى إدخال اسم النوع.', 'error');
      return;
    }

    setSavingCategory(true);
    try {
      if (editingCategoryId !== null) {
        await categoriesApi.update(
          editingCategoryId,
          { name: catName.trim(), description: catDescription.trim() },
          adminToken
        );
        showToast('تم تحديث النوع بنجاح', 'success');
      } else {
        await categoriesApi.create(
          { name: catName.trim(), description: catDescription.trim() },
          adminToken
        );
        showToast('تمت إضافة النوع الجديد بنجاح', 'success');
      }
      setEditingCategoryId(null);
      setCatName('');
      setCatDescription('');
      await loadDashboardData();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'تعذر حفظ النوع',
        'error'
      );
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (cat: Category) => {
    if (!adminToken) return;
    try {
      await categoriesApi.remove(cat.id, adminToken);
      showToast(`تم حذف النوع "${cat.name}"`, 'info');
      if (editingCategoryId === cat.id) {
        setEditingCategoryId(null);
        setCatName('');
        setCatDescription('');
      }
      await loadDashboardData();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'تعذر حذف النوع',
        'error'
      );
    }
  };

  if (!adminToken) return null;

  const filteredBooks = books.filter((b) => {
    if (!tableSearch.trim()) return true;
    const q = tableSearch.trim().toLowerCase();
    return (
      b.title.toLowerCase().includes(q) ||
      String(b.id).includes(q) ||
      b.description?.toLowerCase().includes(q)
    );
  });

  const statCards = [
    { label: 'إجمالي الكتب', value: stats.totalBooks, icon: BookOpen },
    { label: 'الكتب المخفضة', value: stats.discountedBooks, icon: Percent },
    { label: 'الترشيحات الأسبوعية', value: stats.weeklyPicks, icon: Star },
    { label: 'الترشيحات الشهرية', value: stats.monthlyPicks, icon: Calendar },
    { label: 'أنواع الكتب', value: stats.totalCategories, icon: Layers },
    { label: 'المستخدمون', value: stats.totalUsers, icon: Users },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#001D51]/12 dark:border-[#F1EBE3]/12">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#001D51] dark:text-[#F1EBE3]">
            لوحة تحكم المشرف العام
          </h1>
          <p className="mt-1 text-sm text-[#001D51]/75 dark:text-[#F1EBE3]/75">
            إدارة الكتب، الأنواع، الحسومات، والترشيحات الأسبوعية والشهرية.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadDashboardData}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-[#001D51]/15 dark:border-[#F1EBE3]/15 text-[#001D51] dark:text-[#F1EBE3] hover:bg-[#001D51]/5 dark:hover:bg-[#F1EBE3]/10 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>تحديث</span>
          </button>

          <button
            type="button"
            onClick={logoutAdmin}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-[#ff5c40]/50 text-[#ff5c40] hover:bg-[#ff5c40]/10 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل خروج المشرف</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-[#ff5c40] bg-[#ff5c40]/10 flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-[#ff5c40]">{error}</p>
          <button
            type="button"
            onClick={loadDashboardData}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#ff5c40] text-white cursor-pointer"
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* Stat Cards Grid */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="p-4 rounded-xl border border-[#001D51]/12 dark:border-[#F1EBE3]/12 bg-[#FAF7F2] dark:bg-[#001334]/75 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#001D51]/70 dark:text-[#F1EBE3]/70">
                  {card.label}
                </span>
                <Icon className="w-4 h-4 text-[#ff5c40]" />
              </div>
              <p className="text-2xl font-bold font-mono-num text-[#001D51] dark:text-[#F1EBE3]">
                {loading ? '—' : card.value}
              </p>
            </div>
          );
        })}
      </section>

      {/* Section Tabs */}
      <div className="flex items-center gap-2 border-b border-[#001D51]/12 dark:border-[#F1EBE3]/12 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('books')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer ${
            activeTab === 'books'
              ? 'bg-[#001D51] text-[#F1EBE3] dark:bg-[#F1EBE3] dark:text-[#001D51]'
              : 'text-[#001D51]/75 dark:text-[#F1EBE3]/75 hover:bg-[#001D51]/5 dark:hover:bg-[#F1EBE3]/10'
          }`}
        >
          إدارة الكتب ({books.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer ${
            activeTab === 'categories'
              ? 'bg-[#001D51] text-[#F1EBE3] dark:bg-[#F1EBE3] dark:text-[#001D51]'
              : 'text-[#001D51]/75 dark:text-[#F1EBE3]/75 hover:bg-[#001D51]/5 dark:hover:bg-[#F1EBE3]/10'
          }`}
        >
          إدارة أنواع الكتب ({categories.length})
        </button>
      </div>

      {/* BOOKS TAB */}
      {activeTab === 'books' && (
        <div className="space-y-8">
          {/* Add / Edit Book Form */}
          <section className="p-6 sm:p-8 rounded-2xl border border-[#001D51]/12 dark:border-[#F1EBE3]/12 bg-[#FAF7F2] dark:bg-[#001334]/80 space-y-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-display text-2xl font-bold text-[#001D51] dark:text-[#F1EBE3]">
                {editingBookId !== null
                  ? `تعديل الكتاب #${editingBookId}`
                  : 'إضافة كتاب جديد'}
              </h2>
              {editingBookId !== null && (
                <button
                  type="button"
                  onClick={resetBookForm}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#001D51]/20 dark:border-[#F1EBE3]/20 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>إلغاء التعديل</span>
                </button>
              )}
            </div>

            <form onSubmit={handleSaveBook} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Image Upload Column */}
                <div className="md:col-span-4 space-y-2">
                  <label className="block text-sm font-semibold text-[#001D51] dark:text-[#F1EBE3]">
                    صورة الغلاف
                  </label>
                  <label className="flex flex-col items-center justify-center aspect-[3/4] max-h-72 w-full rounded-xl border-2 border-dashed border-[#001D51]/20 dark:border-[#F1EBE3]/20 bg-[#F1EBE3]/50 dark:bg-[#000B21]/50 cursor-pointer overflow-hidden hover:border-[#ff5c40] transition-colors">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="معاينة الغلاف"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="p-4 text-center space-y-2">
                        <Upload className="w-7 h-7 mx-auto text-[#737373]" />
                        <p className="text-xs font-semibold text-[#001D51]/80 dark:text-[#F1EBE3]/80">
                          اضغط لاختيار صورة الغلاف
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Fields Column */}
                <div className="md:col-span-8 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="block text-sm font-semibold text-[#001D51] dark:text-[#F1EBE3]">
                        اسم الكتاب
                      </label>
                      <input
                        type="text"
                        required
                        value={bookTitle}
                        onChange={(e) => setBookTitle(e.target.value)}
                        placeholder="أدخل عنوان الكتاب"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#001D51]/15 dark:border-[#F1EBE3]/15 bg-[#F1EBE3]/60 dark:bg-[#000B21]/60 text-sm focus:outline-none focus:ring-2 focus:ring-[#001D51] dark:focus:ring-[#F1EBE3]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-semibold text-[#001D51] dark:text-[#F1EBE3]">
                        السعر ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        value={bookPrice}
                        onChange={(e) => setBookPrice(e.target.value)}
                        placeholder="25.00"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#001D51]/15 dark:border-[#F1EBE3]/15 bg-[#F1EBE3]/60 dark:bg-[#000B21]/60 text-sm font-mono-num focus:outline-none focus:ring-2 focus:ring-[#001D51] dark:focus:ring-[#F1EBE3]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-semibold text-[#001D51] dark:text-[#F1EBE3]">
                        نسبة الحسم (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={bookDiscount}
                        onChange={(e) => setBookDiscount(e.target.value)}
                        placeholder="0"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#001D51]/15 dark:border-[#F1EBE3]/15 bg-[#F1EBE3]/60 dark:bg-[#000B21]/60 text-sm font-mono-num focus:outline-none focus:ring-2 focus:ring-[#001D51] dark:focus:ring-[#F1EBE3]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-[#001D51] dark:text-[#F1EBE3]">
                      وصف الكتاب
                    </label>
                    <textarea
                      rows={3}
                      value={bookDescription}
                      onChange={(e) => setBookDescription(e.target.value)}
                      placeholder="نبذة مختصرة عن موضوع الكتاب..."
                      className="w-full px-4 py-2.5 rounded-xl border border-[#001D51]/15 dark:border-[#F1EBE3]/15 bg-[#F1EBE3]/60 dark:bg-[#000B21]/60 text-sm focus:outline-none focus:ring-2 focus:ring-[#001D51] dark:focus:ring-[#F1EBE3]"
                    />
                  </div>

                  {/* Multi Categories Checkboxes */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-[#001D51] dark:text-[#F1EBE3]">
                      أنواع الكتاب
                    </label>
                    {categories.length === 0 ? (
                      <p className="text-xs text-[#737373]">
                        لا توجد أنواع مضافة بعد. يمكنك إضافة أنواع من تبويب "إدارة أنواع الكتب".
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2.5">
                        {categories.map((cat) => {
                          const checked = selectedCategoryIds.includes(cat.id);
                          return (
                            <label
                              key={cat.id}
                              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                                checked
                                  ? 'bg-[#001D51] text-[#F1EBE3] border-[#001D51] dark:bg-[#F1EBE3] dark:text-[#001D51]'
                                  : 'border-[#001D51]/15 dark:border-[#F1EBE3]/15 text-[#001D51] dark:text-[#F1EBE3]'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleCategorySelection(cat.id)}
                                className="sr-only"
                              />
                              <span>{cat.name}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Recommendations Checkboxes */}
                  <div className="flex flex-wrap items-center gap-6 pt-1">
                    <label className="inline-flex items-center gap-2 text-sm font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isWeeklyPick}
                        onChange={(e) => setIsWeeklyPick(e.target.checked)}
                        className="w-4 h-4 accent-[#ff5c40]"
                      />
                      <span>ضمن الترشيحات الأسبوعية</span>
                    </label>

                    <label className="inline-flex items-center gap-2 text-sm font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isMonthlyPick}
                        onChange={(e) => setIsMonthlyPick(e.target.checked)}
                        className="w-4 h-4 accent-[#ff5c40]"
                      />
                      <span>ضمن الترشيحات الشهرية</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="submit"
                  disabled={savingBook}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-[#001D51] text-[#F1EBE3] hover:bg-[#072761] dark:bg-[#F1EBE3] dark:text-[#001D51] dark:hover:bg-[#E7DFD3] cursor-pointer disabled:opacity-60"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    {savingBook
                      ? 'جاري الحفظ...'
                      : editingBookId !== null
                      ? 'حفظ التعديلات'
                      : 'إضافة الكتاب'}
                  </span>
                </button>
              </div>
            </form>
          </section>

          {/* Books Table */}
          <section className="rounded-2xl border border-[#001D51]/12 dark:border-[#F1EBE3]/12 bg-[#FAF7F2] dark:bg-[#001334]/80 overflow-hidden">
            <div className="p-5 border-b border-[#001D51]/10 dark:border-[#F1EBE3]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="font-display text-xl font-bold text-[#001D51] dark:text-[#F1EBE3]">
                جدول الكتب المسجلة
              </h2>
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-[#737373]" />
                <input
                  type="text"
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  placeholder="بحث بالاسم أو ID..."
                  className="w-full ps-9 pe-3 py-2 rounded-lg border border-[#001D51]/15 dark:border-[#F1EBE3]/15 bg-[#F1EBE3]/60 dark:bg-[#000B21]/60 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-start border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[#001D51]/10 dark:border-[#F1EBE3]/10 text-xs text-[#001D51]/65 dark:text-[#F1EBE3]/65">
                    <th className="py-3 px-4 text-start font-semibold">ID</th>
                    <th className="py-3 px-4 text-start font-semibold">الكتاب</th>
                    <th className="py-3 px-4 text-start font-semibold">السعر</th>
                    <th className="py-3 px-4 text-start font-semibold">الحسم</th>
                    <th className="py-3 px-4 text-start font-semibold">الترشيحات</th>
                    <th className="py-3 px-4 text-end font-semibold">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#001D51]/10 dark:divide-[#F1EBE3]/10">
                  {filteredBooks.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-10 text-center text-sm text-[#737373]"
                      >
                        لا توجد كتب مطابقة للعرض.
                      </td>
                    </tr>
                  ) : (
                    filteredBooks.map((book) => {
                      const cover = getBookImageUrl(book.image);
                      return (
                        <tr
                          key={book.id}
                          className="hover:bg-[#001D51]/[0.03] dark:hover:bg-[#F1EBE3]/[0.03]"
                        >
                          <td className="py-3 px-4 font-mono-num text-xs">
                            #{book.id}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-13 rounded overflow-hidden bg-[#E7DFD3] dark:bg-[#000B21] shrink-0 flex items-center justify-center">
                                {cover ? (
                                  <img
                                    src={cover}
                                    alt={book.title}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <BookOpen className="w-4 h-4 text-[#737373]" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-[#001D51] dark:text-[#F1EBE3] truncate max-w-[220px]">
                                  {book.title}
                                </p>
                                {book.categories && book.categories.length > 0 && (
                                  <p className="text-xs text-[#001D51]/60 dark:text-[#F1EBE3]/60 truncate max-w-[220px]">
                                    {book.categories.map((c) => c.name).join(' · ')}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono-num">
                            ${book.price.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 font-mono-num">
                            {Number(book.discountPercentage || 0) > 0 ? (
                              <span className="px-2 py-0.5 rounded bg-[#ff5c40] text-white text-xs font-bold">
                                {book.discountPercentage}%
                              </span>
                            ) : (
                              <span className="text-xs text-[#737373]">—</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  handleToggleRecommendation(book, 'isWeeklyPick')
                                }
                                className={`px-2.5 py-1 rounded text-xs font-semibold border cursor-pointer transition-colors ${
                                  book.isWeeklyPick
                                    ? 'bg-[#001D51] text-[#F1EBE3] border-[#001D51] dark:bg-[#F1EBE3] dark:text-[#001D51]'
                                    : 'border-[#001D51]/20 dark:border-[#F1EBE3]/20 text-[#737373]'
                                }`}
                              >
                                أسبوعي
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleToggleRecommendation(book, 'isMonthlyPick')
                                }
                                className={`px-2.5 py-1 rounded text-xs font-semibold border cursor-pointer transition-colors ${
                                  book.isMonthlyPick
                                    ? 'bg-[#ff5c40] text-white border-[#ff5c40]'
                                    : 'border-[#001D51]/20 dark:border-[#F1EBE3]/20 text-[#737373]'
                                }`}
                              >
                                شهري
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => startEditBook(book)}
                                aria-label={`تعديل ${book.title}`}
                                className="p-2 rounded-lg border border-[#001D51]/15 dark:border-[#F1EBE3]/15 hover:bg-[#001D51]/10 dark:hover:bg-[#F1EBE3]/10 cursor-pointer"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteBook(book)}
                                aria-label={`حذف ${book.title}`}
                                className="p-2 rounded-lg border border-[#ff5c40]/30 text-[#ff5c40] hover:bg-[#ff5c40]/10 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* CATEGORIES TAB */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Category Form */}
          <section className="lg:col-span-5 p-6 rounded-2xl border border-[#001D51]/12 dark:border-[#F1EBE3]/12 bg-[#FAF7F2] dark:bg-[#001334]/80 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-[#001D51] dark:text-[#F1EBE3]">
                {editingCategoryId !== null
                  ? `تعديل النوع #${editingCategoryId}`
                  : 'إضافة نوع كتاب جديد'}
              </h2>
              {editingCategoryId !== null && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingCategoryId(null);
                    setCatName('');
                    setCatDescription('');
                  }}
                  className="text-xs font-semibold text-[#ff5c40] cursor-pointer"
                >
                  إلغاء
                </button>
              )}
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold">اسم النوع</label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="مثال: خيال علمي، غموض، رومنسي..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#001D51]/15 dark:border-[#F1EBE3]/15 bg-[#F1EBE3]/60 dark:bg-[#000B21]/60 text-sm focus:outline-none focus:ring-2 focus:ring-[#001D51] dark:focus:ring-[#F1EBE3]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold">
                  وصف مختصر (اختياري)
                </label>
                <textarea
                  rows={3}
                  value={catDescription}
                  onChange={(e) => setCatDescription(e.target.value)}
                  placeholder="وصف للنوع الأدبي..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#001D51]/15 dark:border-[#F1EBE3]/15 bg-[#F1EBE3]/60 dark:bg-[#000B21]/60 text-sm focus:outline-none focus:ring-2 focus:ring-[#001D51] dark:focus:ring-[#F1EBE3]"
                />
              </div>

              <button
                type="submit"
                disabled={savingCategory}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-[#001D51] text-[#F1EBE3] dark:bg-[#F1EBE3] dark:text-[#001D51] cursor-pointer disabled:opacity-60"
              >
                <FolderPlus className="w-4 h-4" />
                <span>
                  {savingCategory
                    ? 'جاري الحفظ...'
                    : editingCategoryId !== null
                    ? 'تحديث النوع'
                    : 'إضافة النوع'}
                </span>
              </button>
            </form>
          </section>

          {/* Categories List */}
          <section className="lg:col-span-7 rounded-2xl border border-[#001D51]/12 dark:border-[#F1EBE3]/12 bg-[#FAF7F2] dark:bg-[#001334]/80 divide-y divide-[#001D51]/10 dark:divide-[#F1EBE3]/10">
            <div className="p-5">
              <h2 className="font-display text-xl font-bold text-[#001D51] dark:text-[#F1EBE3]">
                الأنواع الحالية
              </h2>
            </div>
            {categories.length === 0 ? (
              <div className="p-10 text-center text-sm text-[#737373]">
                لا توجد أنواع مسجلة حالياً.
              </div>
            ) : (
              categories.map((cat) => (
                <div
                  key={cat.id}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-[#001D51] dark:text-[#F1EBE3]">
                        {cat.name}
                      </span>
                      <span className="text-xs font-mono-num text-[#737373]">
                        #{cat.id}
                      </span>
                    </div>
                    {cat.description && (
                      <p className="text-xs text-[#001D51]/70 dark:text-[#F1EBE3]/70 mt-1">
                        {cat.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCategoryId(cat.id);
                        setCatName(cat.name);
                        setCatDescription(cat.description || '');
                      }}
                      aria-label={`تعديل ${cat.name}`}
                      className="p-2 rounded-lg border border-[#001D51]/15 dark:border-[#F1EBE3]/15 hover:bg-[#001D51]/10 dark:hover:bg-[#F1EBE3]/10 cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat)}
                      aria-label={`حذف ${cat.name}`}
                      className="p-2 rounded-lg border border-[#ff5c40]/30 text-[#ff5c40] hover:bg-[#ff5c40]/10 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </section>
        </div>
      )}
    </div>
  );
}
