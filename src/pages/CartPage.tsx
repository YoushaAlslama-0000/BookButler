
import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Check,
  Copy,
  LogIn,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  buildWhatsappOrderMessage,
  buildWhatsappOrderUrl,
  cartApi,
  getBookImageUrl,
} from '../services/api';

export function CartPage() {
  const {
    userToken,
    cart,
    isCartLoading,
    isCartUpdating,
    refreshCart,
    updateCartQuantity,
    removeCartItem,
    navigate,
    showToast,
  } = useApp();

  const [checkingOut, setCheckingOut] = useState(false);
  const [generatedWhatsappUrl, setGeneratedWhatsappUrl] = useState<string | null>(
    null
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (userToken) {
      refreshCart();
    }
  }, [userToken, refreshCart]);

  const cartSignature = cart.items
    .map((item) => `${item.id}:${item.bookId}:${item.quantity}`)
    .join('|');

  useEffect(() => {
    setGeneratedWhatsappUrl(null);
  }, [cartSignature]);

  if (!userToken) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="p-8 sm:p-10 rounded-2xl border border-[#001D51]/12 dark:border-[#F1EBE3]/12 bg-[#FAF7F2] dark:bg-[#001334]/75 space-y-4">
          <ShoppingBag className="w-10 h-10 mx-auto text-[#001D51] dark:text-[#F1EBE3]" />
          <h1 className="font-display text-2xl font-bold text-[#001D51] dark:text-[#F1EBE3]">
            سلة المشتريات
          </h1>
          <p className="text-sm text-[#001D51]/75 dark:text-[#F1EBE3]/75">
            سجل الدخول للوصول إلى سلة مشترياتك وإتمام الطلب عبر واتساب.
          </p>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-[#001D51] text-[#F1EBE3] dark:bg-[#F1EBE3] dark:text-[#001D51] cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>تسجيل الدخول</span>
          </button>
        </div>
      </div>
    );
  }

  const totalOriginal = cart.totalOriginalPrice || 0;
  const totalFinal = cart.totalFinalPrice || 0;
  const totalSavings = Math.max(0, totalOriginal - totalFinal);

  const orderItems = cart.items.map((item) => ({
    title: item.book.title,
    quantity: item.quantity,
  }));

  const fallbackOrderUrl = buildWhatsappOrderUrl(orderItems);

  const handleCheckout = async () => {
    if (cart.items.length === 0 || checkingOut || isCartUpdating) return;
    setCheckingOut(true);
    try {
      const res = await cartApi.checkoutWhatsapp(userToken);
      const finalUrl = res.whatsappUrl || fallbackOrderUrl;
      setGeneratedWhatsappUrl(finalUrl);
      showToast('تم تجهيز طلب الشراء عبر واتساب', 'success');
    } catch {
      // Even if backend checkout endpoint fails, generate exact required WhatsApp order URL
      setGeneratedWhatsappUrl(fallbackOrderUrl);
      showToast('تم تجهيز رابط طلب الواتساب للكتب المحددة', 'info');
    } finally {
      setCheckingOut(false);
    }
  };

  const handleCopyMessage = async () => {
    const text = buildWhatsappOrderMessage(orderItems);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard errors
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#001D51]/12 dark:border-[#F1EBE3]/12">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#001D51] dark:text-[#F1EBE3]">
            سلة المشتريات
          </h1>
          <p className="mt-1.5 text-sm text-[#001D51]/75 dark:text-[#F1EBE3]/75">
            راجع الكميات والأسعار النهائية ثم اضغط طلب شراء لإرسال طلبك عبر واتساب.
          </p>
        </div>
        <span className="text-sm font-mono-num font-semibold text-[#001D51]/70 dark:text-[#F1EBE3]/70">
          {cart.items.length} عنوان
        </span>
      </div>

      {isCartLoading && cart.items.length === 0 ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div
              key={n}
              className="h-28 rounded-xl bg-[#FAF7F2]/60 dark:bg-[#001334]/50 animate-pulse"
            />
          ))}
        </div>
      ) : cart.items.length === 0 ? (
        <div className="p-14 rounded-2xl border border-[#001D51]/12 dark:border-[#F1EBE3]/12 bg-[#FAF7F2]/70 dark:bg-[#001334]/60 text-center space-y-4">
          <ShoppingBag className="w-10 h-10 mx-auto text-[#737373]" />
          <h2 className="text-lg font-bold text-[#001D51] dark:text-[#F1EBE3]">
            سلة المشتريات فارغة
          </h2>
          <p className="text-sm text-[#001D51]/70 dark:text-[#F1EBE3]/70">
            أضف بعض الكتب من المكتبة لتبدأ طلبك.
          </p>
          <button
            type="button"
            onClick={() => navigate('/books')}
            className="px-5 py-2.5 rounded-xl text-sm font-bold bg-[#001D51] text-[#F1EBE3] dark:bg-[#F1EBE3] dark:text-[#001D51] cursor-pointer"
          >
            تصفح الكتب
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cart.items.map((item) => {
              const cover = getBookImageUrl(item.book.image);
              const unitFinal = item.book.finalPrice ?? item.book.price;
              const hasDisc =
                Boolean(item.book.hasDiscount) ||
                Number(item.book.discountPercentage || 0) > 0;

              return (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 rounded-2xl border border-[#001D51]/12 dark:border-[#F1EBE3]/12 bg-[#FAF7F2] dark:bg-[#001334]/75 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div
                    onClick={() => navigate(`/books/${item.book.id}`)}
                    className="flex items-center gap-4 min-w-0 cursor-pointer"
                  >
                    <div className="w-16 h-22 rounded-lg overflow-hidden bg-[#E7DFD3] dark:bg-[#000B21] shrink-0 flex items-center justify-center">
                      {cover ? (
                        <img
                          src={cover}
                          alt={item.book.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <BookOpen className="w-6 h-6 text-[#737373]" />
                      )}
                    </div>

                    <div className="min-w-0 space-y-1">
                      <h3 className="font-bold text-base text-[#001D51] dark:text-[#F1EBE3] truncate">
                        {item.book.title}
                      </h3>
                      <p className="text-xs font-mono-num text-[#001D51]/60 dark:text-[#F1EBE3]/60">
                        #{item.book.id}
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-bold font-mono-num text-[#001D51] dark:text-[#F1EBE3]">
                          ${unitFinal.toFixed(2)}
                        </span>
                        {hasDisc && (
                          <span className="text-xs font-mono-num line-through text-[#737373]">
                            ${item.book.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stepper & Delete */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                    <div className="inline-flex items-center rounded-xl border border-[#001D51]/15 dark:border-[#F1EBE3]/20 bg-[#F1EBE3]/60 dark:bg-[#000B21]/60">
                      <button
                        type="button"
                        onClick={() =>
                          updateCartQuantity(item.id, item.quantity - 1)
                        }
                        aria-label="إنقاص الكمية"
                        className="w-9 h-9 inline-flex items-center justify-center text-[#001D51] dark:text-[#F1EBE3] cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-9 text-center text-sm font-bold font-mono-num text-[#001D51] dark:text-[#F1EBE3]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateCartQuantity(item.id, item.quantity + 1)
                        }
                        aria-label="زيادة الكمية"
                        className="w-9 h-9 inline-flex items-center justify-center text-[#001D51] dark:text-[#F1EBE3] cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-sm font-bold font-mono-num min-w-[64px] text-end text-[#001D51] dark:text-[#F1EBE3]">
                      ${(unitFinal * item.quantity).toFixed(2)}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeCartItem(item.id)}
                      aria-label={`حذف ${item.book.title}`}
                      className="w-9 h-9 rounded-lg inline-flex items-center justify-center text-[#ff5c40] hover:bg-[#ff5c40]/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary Sidebar */}
          <aside className="lg:col-span-4 p-6 rounded-2xl border border-[#001D51]/12 dark:border-[#F1EBE3]/12 bg-[#FAF7F2] dark:bg-[#001334]/80 space-y-5 sticky top-24">
            <h2 className="font-display text-2xl font-bold text-[#001D51] dark:text-[#F1EBE3]">
              ملخص الطلب
            </h2>

            <div className="space-y-3 text-sm pt-2 border-t border-[#001D51]/10 dark:border-[#F1EBE3]/10">
              <div className="flex items-center justify-between">
                <span className="text-[#001D51]/75 dark:text-[#F1EBE3]/75">
                  السعر الإجمالي قبل الحسم
                </span>
                <span className="font-mono-num font-semibold text-[#001D51] dark:text-[#F1EBE3]">
                  ${totalOriginal.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#001D51]/75 dark:text-[#F1EBE3]/75">
                  مقدار التوفير
                </span>
                <span className="font-mono-num font-bold text-[#ff5c40]">
                  -${totalSavings.toFixed(2)}
                </span>
              </div>

              <div className="pt-3 border-t border-[#001D51]/10 dark:border-[#F1EBE3]/10 flex items-center justify-between text-base">
                <span className="font-bold text-[#001D51] dark:text-[#F1EBE3]">
                  السعر النهائي
                </span>
                <span className="text-xl font-bold font-mono-num text-[#001D51] dark:text-[#F1EBE3]">
                  ${totalFinal.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={checkingOut || isCartUpdating}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold bg-[#001D51] text-[#F1EBE3] hover:bg-[#072761] dark:bg-[#F1EBE3] dark:text-[#001D51] dark:hover:bg-[#E7DFD3] transition-colors cursor-pointer disabled:opacity-60"
            >
              <MessageCircle className="w-4 h-4" />
              <span>
                {isCartUpdating
                  ? 'جاري تحديث السلة...'
                  : checkingOut
                  ? 'جاري تجهيز الطلب...'
                  : 'طلب شراء'}
              </span>
            </button>

            {generatedWhatsappUrl && (
              <div className="p-4 rounded-xl border border-[#001D51]/15 dark:border-[#F1EBE3]/20 bg-[#F1EBE3]/80 dark:bg-[#000B21]/70 space-y-3">
                <p className="text-xs font-bold text-[#001D51] dark:text-[#F1EBE3]">
                  رابط الطلب جاهز للإرسال عبر واتساب:
                </p>
                <a
                  href={generatedWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold bg-[#ff5c40] text-white hover:opacity-90 transition-opacity"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>فتح واتساب وإرسال الطلب</span>
                </a>
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-[#001D51]/15 dark:border-[#F1EBE3]/15 text-[#001D51] dark:text-[#F1EBE3] cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#ff5c40]" />
                      <span>تم نسخ نص الطلب</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>نسخ رسالة الطلب</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
