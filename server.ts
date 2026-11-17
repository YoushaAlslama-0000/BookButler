// import 'dotenv/config';
// import express, { type Request, type Response } from 'express';
// import fs from 'fs';
// import os from 'os';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { createServer as createViteServer } from 'vite';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const DEFAULT_PORT = 3000;
// const WHATSAPP_ORDER_PHONE = '963980266994';
// const DEFAULT_SUPPORT_WHATSAPP_URL =
//   'https://wa.me/963980266994?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%20Book%20Butler%20%20,%20%D9%84%D8%AF%D9%8A%20%D9%85%D8%B4%D9%83%D9%84%D8%A9%20%D9%81%D9%8A%20%D8%AA%D8%B3%D8%AC%D9%8A%D9%84%20%D8%A7%D9%84%D8%AF%D8%AE%D9%88%D9%84%20%D9%84%D8%AD%D8%B3%D8%A7%D8%A8%D9%8A%20%D8%B9%D9%84%D9%89%20%D9%85%D9%88%D9%82%D8%B9%20%D9%85%D8%AA%D8%AC%D8%B1%20%D8%A7%D9%84%D9%83%D8%AA%D8%A8%20%D9%88%20%D8%A7%D8%AD%D8%AA%D8%A7%D8%AC%20%D9%84%D9%85%D8%B3%D8%A7%D8%B9%D8%AF%D8%A9';

// interface CategoryRecord {
//   id: number;
//   name: string;
//   description?: string;
// }

// interface BookRecord {
//   id: number;
//   title: string;
//   description: string;
//   image: string | null;
//   price: number;
//   discountPercentage: number;
//   isWeeklyPick: boolean;
//   isMonthlyPick: boolean;
//   categoryIds: number[];
//   createdAt: string;
//   updatedAt: string;
// }

// interface UserRecord {
//   id: number;
//   email: string;
//   fullName: string;
//   password: string;
//   createdAt: string;
// }

// interface CartItemRecord {
//   id: number;
//   bookId: number;
//   quantity: number;
// }

// // In-memory store (persists for lifetime of server process)
// const categories: CategoryRecord[] = [
//   { id: 1, name: 'الأدب والرواية', description: 'روايات عربية ومترجمة مختارة بعناية' },
//   { id: 2, name: 'الفكر والفلسفة', description: 'دراسات فكرية وفلسفية معاصرة وكلاسيكية' },
//   { id: 3, name: 'الأعمال والتقنية', description: 'كتب ريادة الأعمال، البرمجة، وبناء المنتجات' },
//   { id: 4, name: 'تطوير الذات', description: 'مهارات التفكير والإنتاجية والنمو الشخصي' },
//   { id: 5, name: 'الخيال العلمي', description: 'عوالم مستقبلية وقصص استشرافية ملهمة' },
// ];

// const nowIso = () => new Date().toISOString();

// const books: BookRecord[] = [
//   {
//     id: 1,
//     title: 'ظلال المكتبة المنسية',
//     description:
//       'رواية أدبية مشوقة تأخذك في رحلة بين المخطوطات النادرة وأسرار بائعي الكتب القدامى في حكاية تمزج الغموض بالشغف المعرفي.',
//     image: '/src/assets/images/hero_bookstore_editorial_1794898525681.jpg',
//     price: 24,
//     discountPercentage: 15,
//     isWeeklyPick: true,
//     isMonthlyPick: false,
//     categoryIds: [1],
//     createdAt: nowIso(),
//     updatedAt: nowIso(),
//   },
//   {
//     id: 2,
//     title: 'هندسة الأفكار في سوق العمل',
//     description:
//       'دليل عملي لربط الحلول البرمجية باحتياجات السوق الحقيقية وتحويل الأفكار الأولية إلى منتجات رقمية ناجحة ومستدامة.',
//     image: '/src/assets/images/about_book_butler_1794898525802.jpg',
//     price: 32,
//     discountPercentage: 0,
//     isWeeklyPick: true,
//     isMonthlyPick: true,
//     categoryIds: [3, 4],
//     createdAt: nowIso(),
//     updatedAt: nowIso(),
//   },
//   {
//     id: 3,
//     title: 'مدن من ورق وضوء',
//     description:
//       'مجموعة تأملات فلسفية وأدبية حول العلاقة بين الإنسان والمدينة والذاكرة المكتوبة، بأسلوب رصين ولغة شاعرية.',
//     image: null,
//     price: 19,
//     discountPercentage: 20,
//     isWeeklyPick: true,
//     isMonthlyPick: false,
//     categoryIds: [1, 2],
//     createdAt: nowIso(),
//     updatedAt: nowIso(),
//   },
//   {
//     id: 4,
//     title: 'ما وراء المدار السابع',
//     description:
//       'رواية خيال علمي تستكشف مستقبل الذكاء الجمعي وبناء المستعمرات الفضائية حين تصبح المعرفة أثمن من أي مورد آخر.',
//     image: null,
//     price: 28,
//     discountPercentage: 10,
//     isWeeklyPick: false,
//     isMonthlyPick: true,
//     categoryIds: [5],
//     createdAt: nowIso(),
//     updatedAt: nowIso(),
//   },
//   {
//     id: 5,
//     title: 'البساطة العميقة في تصميم النظم',
//     description:
//       'كتاب متخصص للمهندسين والمصممين حول بناء برمجيات واضحة وقابلة للتوسع دون تعقيد غير ضروري.',
//     image: null,
//     price: 35,
//     discountPercentage: 0,
//     isWeeklyPick: false,
//     isMonthlyPick: true,
//     categoryIds: [3],
//     createdAt: nowIso(),
//     updatedAt: nowIso(),
//   },
//   {
//     id: 6,
//     title: 'فن القراءة المتأنية',
//     description:
//       'دعوة لإعادة اكتشاف القراءة العميقة وبناء عادة معرفية يومية تمنح القارئ وضوحاً ذهنياً في عالم مزدحم.',
//     image: null,
//     price: 18,
//     discountPercentage: 25,
//     isWeeklyPick: false,
//     isMonthlyPick: false,
//     categoryIds: [2, 4],
//     createdAt: nowIso(),
//     updatedAt: nowIso(),
//   },
// ];

// let nextBookId = 7;
// let nextCategoryId = 6;
// let nextUserId = 2;
// let nextCartItemId = 1;

// const users: UserRecord[] = [
//   {
//     id: 1,
//     email: 'reader@bookbutler.app',
//     fullName: 'أحمد محمد العلي',
//     password: 'password123',
//     createdAt: nowIso(),
//   },
// ];

// const userTokens = new Map<string, number>();
// const adminTokens = new Map<string, { username: string; role: string }>();
// const userFavorites = new Map<number, Set<number>>();
// const userCarts = new Map<number, CartItemRecord[]>();

// function enrichBook(book: BookRecord) {
//   const hasDiscount = book.discountPercentage > 0;
//   const finalPrice = hasDiscount
//     ? Number((book.price * (1 - book.discountPercentage / 100)).toFixed(2))
//     : book.price;
//   const bookCategories = book.categoryIds
//     .map((cid) => categories.find((c) => c.id === cid))
//     .filter((c): c is CategoryRecord => Boolean(c));

//   return {
//     ...book,
//     hasDiscount,
//     finalPrice,
//     categories: bookCategories,
//   };
// }

// function getBearerToken(req: Request): string | null {
//   const auth = req.headers.authorization;
//   if (!auth) return null;
//   const match = auth.match(/^Bearer\s+(.+)$/i);
//   return match ? match[1].trim() : null;
// }

// function requireUser(req: Request, res: Response): UserRecord | null {
//   const token = getBearerToken(req);
//   if (!token) {
//     res.status(401).json({ message: 'يرجى تسجيل الدخول للمتابعة.' });
//     return null;
//   }
//   const userId = userTokens.get(token);
//   const user = userId ? users.find((u) => u.id === userId) : undefined;
//   if (!user) {
//     res.status(401).json({ message: 'انتهت جلسة الدخول، يرجى تسجيل الدخول مجدداً.' });
//     return null;
//   }
//   return user;
// }

// function requireAdmin(req: Request, res: Response): boolean {
//   const token = getBearerToken(req);
//   if (!token || !adminTokens.has(token)) {
//     res.status(401).json({ message: 'صلاحية المشرف مطلوبة.' });
//     return false;
//   }
//   return true;
// }

// function buildCartResponse(userId: number) {
//   const rawItems = userCarts.get(userId) || [];
//   const items = rawItems
//     .map((it) => {
//       const book = books.find((b) => b.id === it.bookId);
//       if (!book) return null;
//       const enriched = enrichBook(book);
//       const originalSubtotal = Number((enriched.price * it.quantity).toFixed(2));
//       const finalSubtotal = Number((enriched.finalPrice * it.quantity).toFixed(2));
//       return {
//         id: it.id,
//         bookId: it.bookId,
//         quantity: it.quantity,
//         book: enriched,
//         originalSubtotal,
//         finalSubtotal,
//       };
//     })
//     .filter((item): item is NonNullable<typeof item> => Boolean(item));

//   const totalOriginalPrice = Number(
//     items.reduce((sum, item) => sum + item.originalSubtotal, 0).toFixed(2)
//   );
//   const totalFinalPrice = Number(
//     items.reduce((sum, item) => sum + item.finalSubtotal, 0).toFixed(2)
//   );

//   return {
//     items,
//     totalOriginalPrice,
//     totalFinalPrice,
//     totalSavings: Number(Math.max(0, totalOriginalPrice - totalFinalPrice).toFixed(2)),
//   };
// }

// // Lightweight multipart/form-data parser for book image uploads without extra dependencies
// async function parseMultipartOrJson(
//   req: Request
// ): Promise<{ fields: Record<string, string>; imageDataUrl: string | null }> {
//   const contentType = req.headers['content-type'] || '';
//   if (!contentType.includes('multipart/form-data')) {
//     const fields: Record<string, string> = {};
//     if (req.body && typeof req.body === 'object') {
//       for (const [k, v] of Object.entries(req.body)) {
//         fields[k] = typeof v === 'string' ? v : JSON.stringify(v);
//       }
//     }
//     return { fields, imageDataUrl: null };
//   }

//   const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
//   if (!boundaryMatch) {
//     return { fields: {}, imageDataUrl: null };
//   }
//   const boundary = `--${boundaryMatch[1] || boundaryMatch[2]}`;

//   const chunks: Buffer[] = [];
//   for await (const chunk of req) {
//     chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
//   }
//   const rawBuffer = Buffer.concat(chunks);
//   const rawLatin = rawBuffer.toString('latin1');
//   const parts = rawLatin.split(boundary).slice(1, -1);

//   const fields: Record<string, string> = {};
//   let imageDataUrl: string | null = null;

//   for (const part of parts) {
//     const headerEnd = part.indexOf('\r\n\r\n');
//     if (headerEnd === -1) continue;

//     const headerStr = part.slice(0, headerEnd);
//     // Remove leading \r\n and trailing \r\n
//     let bodyLatin = part.slice(headerEnd + 4);
//     if (bodyLatin.endsWith('\r\n')) {
//       bodyLatin = bodyLatin.slice(0, -2);
//     }

//     const nameMatch = headerStr.match(/name="([^"]+)"/i);
//     if (!nameMatch) continue;
//     const fieldName = nameMatch[1];

//     const filenameMatch = headerStr.match(/filename="([^"]*)"/i);
//     if (filenameMatch && filenameMatch[1]) {
//       const mimeMatch = headerStr.match(/Content-Type:\s*([^\r\n;]+)/i);
//       const mime = mimeMatch ? mimeMatch[1].trim() : 'image/jpeg';
//       const fileBuf = Buffer.from(bodyLatin, 'latin1');
//       if (fileBuf.length > 0) {
//         imageDataUrl = `data:${mime};base64,${fileBuf.toString('base64')}`;
//       }
//     } else {
//       fields[fieldName] = Buffer.from(bodyLatin, 'latin1').toString('utf8');
//     }
//   }

//   return { fields, imageDataUrl };
// }

// async function startServer() {
//   const app = express();

//   app.use((req, res, next) => {
//     const contentType = req.headers['content-type'] || '';
//     if (contentType.includes('multipart/form-data')) {
//       return next();
//     }
//     return express.json()(req, res, next);
//   });

//   // Store & Support Config
//   app.get('/api/store/config', (_req, res) => {
//     res.json({
//       storeName: 'Book Butler',
//       description:
//         'متجرك الشخصي لاقتناء الكتب العربية والعالمية المختارة بعناية — تصفح الترشيحات الأسبوعية والشهرية واطلب نسختك مباشرة عبر واتساب.',
//       supportWhatsappUrl: DEFAULT_SUPPORT_WHATSAPP_URL,
//     });
//   });

//   app.get('/api/auth/support', (_req, res) => {
//     res.json({ whatsappUrl: DEFAULT_SUPPORT_WHATSAPP_URL });
//   });

//   // Auth Routes
//   app.post('/api/auth/register', (req, res) => {
//     const { email, fullName, password, confirmPassword } = req.body || {};
//     if (!email || !fullName || !password) {
//       return res.status(400).json({ message: 'يرجى تعبئة جميع الحقول المطلوبة.' });
//     }
//     if (confirmPassword && password !== confirmPassword) {
//       return res.status(400).json({ message: 'كلمتا المرور غير متطابقتين.' });
//     }
//     const normalizedEmail = String(email).trim().toLowerCase();
//     const normalizedName = String(fullName).trim();

//     if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
//       return res.status(409).json({ message: 'البريد الإلكتروني مسجل مسبقاً.' });
//     }

//     const newUser: UserRecord = {
//       id: nextUserId++,
//       email: normalizedEmail,
//       fullName: normalizedName,
//       password: String(password),
//       createdAt: nowIso(),
//     };
//     users.push(newUser);
//     const token = `user_${newUser.id}_${Date.now()}`;
//     userTokens.set(token, newUser.id);

//     res.status(201).json({
//       token,
//       user: {
//         id: newUser.id,
//         email: newUser.email,
//         fullName: newUser.fullName,
//         createdAt: newUser.createdAt,
//       },
//     });
//   });

//   app.post('/api/auth/login', (req, res) => {
//     const { fullName, password } = req.body || {};
//     if (!fullName || !password) {
//       return res.status(400).json({ message: 'يرجى إدخال الاسم الثلاثي وكلمة المرور.' });
//     }
//     const normalizedName = String(fullName).trim();
//     const user = users.find(
//       (u) => u.fullName === normalizedName && u.password === String(password)
//     );
//     if (!user) {
//       return res
//         .status(401)
//         .json({ message: 'الاسم الثلاثي أو كلمة المرور غير صحيحة.' });
//     }
//     const token = `user_${user.id}_${Date.now()}`;
//     userTokens.set(token, user.id);

//     res.json({
//       token,
//       user: {
//         id: user.id,
//         email: user.email,
//         fullName: user.fullName,
//         createdAt: user.createdAt,
//       },
//     });
//   });

//   app.get('/api/auth/profile', (req, res) => {
//     const user = requireUser(req, res);
//     if (!user) return;
//     res.json({
//       user: {
//         id: user.id,
//         email: user.email,
//         fullName: user.fullName,
//         createdAt: user.createdAt,
//       },
//     });
//   });

//   // Categories Routes
//   app.get('/api/categories', (_req, res) => {
//     res.json({
//       categories: categories.map((cat) => ({
//         ...cat,
//         booksCount: books.filter((b) => b.categoryIds.includes(cat.id)).length,
//       })),
//     });
//   });

//   app.post('/api/categories', (req, res) => {
//     if (!requireAdmin(req, res)) return;
//     const { name, description } = req.body || {};
//     if (!name || !String(name).trim()) {
//       return res.status(400).json({ message: 'يرجى إدخال اسم النوع.' });
//     }
//     const newCat: CategoryRecord = {
//       id: nextCategoryId++,
//       name: String(name).trim(),
//       description: description ? String(description).trim() : undefined,
//     };
//     categories.push(newCat);
//     res.status(201).json({ category: newCat });
//   });

//   app.put('/api/categories/:id', (req, res) => {
//     if (!requireAdmin(req, res)) return;
//     const id = Number(req.params.id);
//     const cat = categories.find((c) => c.id === id);
//     if (!cat) {
//       return res.status(404).json({ message: 'النوع غير موجود.' });
//     }
//     const { name, description } = req.body || {};
//     if (name !== undefined && String(name).trim()) {
//       cat.name = String(name).trim();
//     }
//     if (description !== undefined) {
//       cat.description = String(description).trim();
//     }
//     res.json({ category: cat });
//   });

//   app.delete('/api/categories/:id', (req, res) => {
//     if (!requireAdmin(req, res)) return;
//     const id = Number(req.params.id);
//     const idx = categories.findIndex((c) => c.id === id);
//     if (idx === -1) {
//       return res.status(404).json({ message: 'النوع غير موجود.' });
//     }
//     categories.splice(idx, 1);
//     for (const book of books) {
//       book.categoryIds = book.categoryIds.filter((cid) => cid !== id);
//     }
//     res.json({ success: true });
//   });

//   // Books Routes
//   app.get('/api/books/recommendations', (_req, res) => {
//     res.json({
//       weeklyPicks: books.filter((b) => b.isWeeklyPick).map(enrichBook),
//       monthlyPicks: books.filter((b) => b.isMonthlyPick).map(enrichBook),
//     });
//   });

//   app.get('/api/books', (req, res) => {
//     const search = String(req.query.search || '').trim().toLowerCase();
//     const categoryId = req.query.categoryId ? Number(req.query.categoryId) : null;
//     const categoryName = String(req.query.category || '').trim().toLowerCase();
//     const discounted = req.query.discounted === 'true';

//     const filtered = books.filter((b) => {
//       if (search) {
//         const matchesText =
//           b.title.toLowerCase().includes(search) ||
//           b.description.toLowerCase().includes(search) ||
//           String(b.id).includes(search);
//         if (!matchesText) return false;
//       }
//       if (categoryId && !b.categoryIds.includes(categoryId)) {
//         return false;
//       }
//       if (categoryName) {
//         const matched = b.categoryIds.some((cid) => {
//           const cat = categories.find((c) => c.id === cid);
//           return cat?.name.toLowerCase() === categoryName;
//         });
//         if (!matched) return false;
//       }
//       if (discounted && b.discountPercentage <= 0) {
//         return false;
//       }
//       return true;
//     });

//     res.json({ books: filtered.map(enrichBook) });
//   });

//   app.get('/api/books/:id', (req, res) => {
//     const id = Number(req.params.id);
//     const book = books.find((b) => b.id === id);
//     if (!book) {
//       return res.status(404).json({ message: 'الكتاب غير موجود.' });
//     }
//     res.json({ book: enrichBook(book) });
//   });

//   app.post('/api/books', async (req, res) => {
//     if (!requireAdmin(req, res)) return;
//     const { fields, imageDataUrl } = await parseMultipartOrJson(req);
//     const title = (fields.title || '').trim();
//     const price = Number(fields.price);
//     if (!title || Number.isNaN(price)) {
//       return res.status(400).json({ message: 'يرجى إدخال اسم الكتاب والسعر.' });
//     }

//     let parsedCategoryIds: number[] = [];
//     if (fields.categoryIds) {
//       try {
//         const arr = JSON.parse(fields.categoryIds);
//         if (Array.isArray(arr)) parsedCategoryIds = arr.map(Number);
//       } catch {
//         parsedCategoryIds = [];
//       }
//     }

//     const created: BookRecord = {
//       id: nextBookId++,
//       title,
//       description: (fields.description || '').trim(),
//       image: imageDataUrl,
//       price,
//       discountPercentage: Math.max(0, Math.min(100, Number(fields.discountPercentage || 0))),
//       isWeeklyPick: fields.isWeeklyPick === 'true',
//       isMonthlyPick: fields.isMonthlyPick === 'true',
//       categoryIds: parsedCategoryIds,
//       createdAt: nowIso(),
//       updatedAt: nowIso(),
//     };
//     books.unshift(created);
//     res.status(201).json({ book: enrichBook(created) });
//   });

//   app.put('/api/books/:id', async (req, res) => {
//     if (!requireAdmin(req, res)) return;
//     const id = Number(req.params.id);
//     const book = books.find((b) => b.id === id);
//     if (!book) {
//       return res.status(404).json({ message: 'الكتاب غير موجود.' });
//     }

//     const { fields, imageDataUrl } = await parseMultipartOrJson(req);
//     if (fields.title !== undefined && fields.title.trim()) {
//       book.title = fields.title.trim();
//     }
//     if (fields.description !== undefined) {
//       book.description = fields.description.trim();
//     }
//     if (fields.price !== undefined && !Number.isNaN(Number(fields.price))) {
//       book.price = Number(fields.price);
//     }
//     if (
//       fields.discountPercentage !== undefined &&
//       !Number.isNaN(Number(fields.discountPercentage))
//     ) {
//       book.discountPercentage = Math.max(
//         0,
//         Math.min(100, Number(fields.discountPercentage))
//       );
//     }
//     if (fields.isWeeklyPick !== undefined) {
//       book.isWeeklyPick = fields.isWeeklyPick === 'true';
//     }
//     if (fields.isMonthlyPick !== undefined) {
//       book.isMonthlyPick = fields.isMonthlyPick === 'true';
//     }
//     if (fields.categoryIds) {
//       try {
//         const arr = JSON.parse(fields.categoryIds);
//         if (Array.isArray(arr)) book.categoryIds = arr.map(Number);
//       } catch {
//         // ignore invalid categoryIds
//       }
//     }
//     if (imageDataUrl) {
//       book.image = imageDataUrl;
//     }
//     book.updatedAt = nowIso();
//     res.json({ book: enrichBook(book) });
//   });

//   app.patch('/api/books/:id/recommendations', (req, res) => {
//     if (!requireAdmin(req, res)) return;
//     const id = Number(req.params.id);
//     const book = books.find((b) => b.id === id);
//     if (!book) {
//       return res.status(404).json({ message: 'الكتاب غير موجود.' });
//     }
//     const { isWeeklyPick, isMonthlyPick } = req.body || {};
//     if (isWeeklyPick !== undefined) book.isWeeklyPick = Boolean(isWeeklyPick);
//     if (isMonthlyPick !== undefined) book.isMonthlyPick = Boolean(isMonthlyPick);
//     book.updatedAt = nowIso();
//     res.json({ book: enrichBook(book) });
//   });

//   app.delete('/api/books/:id', (req, res) => {
//     if (!requireAdmin(req, res)) return;
//     const id = Number(req.params.id);
//     const idx = books.findIndex((b) => b.id === id);
//     if (idx === -1) {
//       return res.status(404).json({ message: 'الكتاب غير موجود.' });
//     }
//     books.splice(idx, 1);
//     res.json({ success: true });
//   });

//   // Favorites Routes
//   app.get('/api/favorites', (req, res) => {
//     const user = requireUser(req, res);
//     if (!user) return;
//     const favSet = userFavorites.get(user.id) || new Set<number>();
//     const favBooks = books.filter((b) => favSet.has(b.id)).map(enrichBook);
//     res.json({ favorites: favBooks });
//   });

//   app.post('/api/favorites/:bookId', (req, res) => {
//     const user = requireUser(req, res);
//     if (!user) return;
//     const bookId = Number(req.params.bookId);
//     if (!books.some((b) => b.id === bookId)) {
//       return res.status(404).json({ message: 'الكتاب غير موجود.' });
//     }
//     let favSet = userFavorites.get(user.id);
//     if (!favSet) {
//       favSet = new Set<number>();
//       userFavorites.set(user.id, favSet);
//     }
//     let isFavorite = false;
//     if (favSet.has(bookId)) {
//       favSet.delete(bookId);
//       isFavorite = false;
//     } else {
//       favSet.add(bookId);
//       isFavorite = true;
//     }
//     res.json({ isFavorite });
//   });

//   // Cart Routes
//   app.get('/api/cart', (req, res) => {
//     const user = requireUser(req, res);
//     if (!user) return;
//     res.json({ cart: buildCartResponse(user.id) });
//   });

//   app.post('/api/cart', (req, res) => {
//     const user = requireUser(req, res);
//     if (!user) return;
//     const { bookId, quantity = 1 } = req.body || {};
//     const targetBookId = Number(bookId);
//     const qty = Math.max(1, Number(quantity || 1));
//     if (!books.some((b) => b.id === targetBookId)) {
//       return res.status(404).json({ message: 'الكتاب غير موجود.' });
//     }
//     let items = userCarts.get(user.id);
//     if (!items) {
//       items = [];
//       userCarts.set(user.id, items);
//     }
//     const existing = items.find((i) => i.bookId === targetBookId);
//     if (existing) {
//       existing.quantity += qty;
//     } else {
//       items.push({ id: nextCartItemId++, bookId: targetBookId, quantity: qty });
//     }
//     res.status(201).json({ cart: buildCartResponse(user.id) });
//   });

//   app.put('/api/cart/:itemId', (req, res) => {
//     const user = requireUser(req, res);
//     if (!user) return;
//     const itemId = Number(req.params.itemId);
//     const qty = Number(req.body?.quantity ?? 1);
//     const items = userCarts.get(user.id) || [];
//     const idx = items.findIndex((i) => i.id === itemId);
//     if (idx === -1) {
//       return res.status(404).json({ message: 'العنصر غير موجود في السلة.' });
//     }
//     if (qty < 1) {
//       items.splice(idx, 1);
//     } else {
//       items[idx].quantity = qty;
//     }
//     res.json({ cart: buildCartResponse(user.id) });
//   });

//   app.delete('/api/cart/:itemId', (req, res) => {
//     const user = requireUser(req, res);
//     if (!user) return;
//     const itemId = Number(req.params.itemId);
//     const items = userCarts.get(user.id) || [];
//     const idx = items.findIndex((i) => i.id === itemId);
//     if (idx !== -1) {
//       items.splice(idx, 1);
//     }
//     res.json({ cart: buildCartResponse(user.id) });
//   });

//   app.post('/api/cart/checkout-whatsapp', (req, res) => {
//     const user = requireUser(req, res);
//     if (!user) return;
//     const cartData = buildCartResponse(user.id);
//     const titles = cartData.items.map((item) => item.book.title).join(' ، ');
//     const message = `مرحبا Book Butler , اريد شراء الكتب التالية :  "${titles}"`;
//     const whatsappUrl = `https://wa.me/${WHATSAPP_ORDER_PHONE}?text=${encodeURIComponent(
//       message
//     )}`;
//     res.json({ whatsappUrl, order: { whatsappUrl, totalFinalPrice: cartData.totalFinalPrice } });
//   });

//   // Admin Routes
//   app.post('/api/admin/login', (req, res) => {
//     const { username, password } = req.body || {};
//     if (
//       String(username || '').trim() !== 'superadmin' ||
//       !String(password || '').trim()
//     ) {
//       return res
//         .status(401)
//         .json({ message: 'بيانات دخول المشرف غير صحيحة.' });
//     }
//     const token = `admin_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
//     const admin = { id: 1, username: 'superadmin', role: 'superadmin' };
//     adminTokens.set(token, admin);
//     res.json({ token, admin });
//   });

//   app.get('/api/admin/dashboard', (req, res) => {
//     if (!requireAdmin(req, res)) return;
//     res.json({
//       stats: {
//         totalBooks: books.length,
//         discountedBooks: books.filter((b) => b.discountPercentage > 0).length,
//         weeklyPicks: books.filter((b) => b.isWeeklyPick).length,
//         monthlyPicks: books.filter((b) => b.isMonthlyPick).length,
//         totalCategories: categories.length,
//         totalUsers: users.length,
//       },
//       recentBooks: books.slice(0, 5).map(enrichBook),
//     });
//   });

//   // Vite / Static Frontend
//   if (process.env.NODE_ENV !== 'production') {
//     const vite = await createViteServer({
//       server: { middlewareMode: true },
//       appType: 'spa',
//     });
//     app.use(vite.middlewares);
//   } else {
//     const distDir = path.resolve(__dirname, 'dist');
//     if (fs.existsSync(distDir)) {
//       app.use(express.static(distDir));
//       app.get('*', (_req, res) => {
//         res.sendFile(path.join(distDir, 'index.html'));
//       });
//     }
//   }

//   const configuredPort = process.env.PORT ? Number(process.env.PORT) : DEFAULT_PORT;
//   if (!Number.isInteger(configuredPort) || configuredPort < 1 || configuredPort > 65535) {
//     throw new Error(`Invalid PORT value: ${process.env.PORT}`);
//   }

//   const httpServer = app.listen(configuredPort, '0.0.0.0');
//   let activePort = configuredPort;

//   httpServer.on('listening', () => {
//     const address = httpServer.address();
//     if (!address || typeof address === 'string') {
//       console.error('The HTTP server started without a usable network address.');
//       return;
//     }

//     const port = address.port;
//     console.log(`\n  Book Butler server ready`);
//     console.log(`  ➜ Local:   http://localhost:${port}/`);
//     const networkAddresses = Object.values(os.networkInterfaces())
//       .flatMap((interfaces) => interfaces || [])
//       .filter((network) => network.family === 'IPv4' && !network.internal)
//       .map((network) => network.address);
//     for (const address of networkAddresses) {
//       console.log(`  ➜ Network: http://${address}:${port}/`);
//     }
//     console.log('  ➜ Press Ctrl+C to stop the server\n');
//   });

//   httpServer.on('error', (error: NodeJS.ErrnoException) => {
//     if (
//       error.code === 'EADDRINUSE' &&
//       process.env.PORT === undefined &&
//       activePort < configuredPort + 10 &&
//       activePort < 65535
//     ) {
//       console.warn(`Port ${activePort} is already in use; trying ${activePort + 1}.`);
//       activePort += 1;
//       httpServer.listen(activePort, '0.0.0.0');
//       return;
//     }

//     console.error(`Failed to start the HTTP server on port ${activePort}:`, error);
//     process.exit(1);
//   });
// }

// startServer().catch((err) => {
//   console.error('Failed to start server:', err);
//   process.exit(1);
// });


import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_PORT = 3000;
const WHATSAPP_ORDER_PHONE = '963980266994';
const DEFAULT_SUPPORT_WHATSAPP_URL =
  'https://wa.me/963980266994?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%20Book%20Butler%20%20,%20%D9%84%D8%AF%D9%8A%20%D9%85%D8%B4%D9%83%D9%84%D8%A9%20%D9%81%D9%8A%20%D8%AA%D8%B3%D8%AC%D9%8A%D9%84%20%D8%A7%D9%84%D8%AF%D8%AE%D9%88%D9%84%20%D9%84%D8%AD%D8%B3%D8%A7%D8%A8%D9%8A%20%D8%B9%D9%84%D9%89%20%D9%85%D9%88%D9%82%D8%B9%20%D9%85%D8%AA%D8%AC%D8%B1%20%D8%A7%D9%84%D9%83%D8%AA%D8%A8%20%D9%88%20%D8%A7%D8%AD%D8%AA%D8%A7%D8%AC%20%D9%84%D9%85%D8%B3%D8%A7%D8%B9%D8%AF%D8%A9';

interface CategoryRecord {
  id: number;
  name: string;
  description?: string;
}

interface BookRecord {
  id: number;
  title: string;
  description: string;
  image: string | null;
  price: number;
  discountPercentage: number;
  isWeeklyPick: boolean;
  isMonthlyPick: boolean;
  categoryIds: number[];
  createdAt: string;
  updatedAt: string;
}

interface UserRecord {
  id: number;
  email: string;
  fullName: string;
  password: string;
  createdAt: string;
}

interface CartItemRecord {
  id: number;
  bookId: number;
  quantity: number;
}

// In-memory store (persists for lifetime of server process)
const categories: CategoryRecord[] = [
  { id: 1, name: 'الأدب والرواية', description: 'روايات عربية ومترجمة مختارة بعناية' },
  { id: 2, name: 'الفكر والفلسفة', description: 'دراسات فكرية وفلسفية معاصرة وكلاسيكية' },
  { id: 3, name: 'الأعمال والتقنية', description: 'كتب ريادة الأعمال، البرمجة، وبناء المنتجات' },
  { id: 4, name: 'تطوير الذات', description: 'مهارات التفكير والإنتاجية والنمو الشخصي' },
  { id: 5, name: 'الخيال العلمي', description: 'عوالم مستقبلية وقصص استشرافية ملهمة' },
];

const nowIso = () => new Date().toISOString();

const books: BookRecord[] = [
  {
    id: 1,
    title: 'ظلال المكتبة المنسية',
    description:
      'رواية أدبية مشوقة تأخذك في رحلة بين المخطوطات النادرة وأسرار بائعي الكتب القدامى في حكاية تمزج الغموض بالشغف المعرفي.',
    image: '/src/assets/images/hero_bookstore_editorial_1794898525681.jpg',
    price: 24,
    discountPercentage: 15,
    isWeeklyPick: true,
    isMonthlyPick: false,
    categoryIds: [1],
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: 2,
    title: 'هندسة الأفكار في سوق العمل',
    description:
      'دليل عملي لربط الحلول البرمجية باحتياجات السوق الحقيقية وتحويل الأفكار الأولية إلى منتجات رقمية ناجحة ومستدامة.',
    image: '/src/assets/images/about_book_butler_1794898525802.jpg',
    price: 32,
    discountPercentage: 0,
    isWeeklyPick: true,
    isMonthlyPick: true,
    categoryIds: [3, 4],
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: 3,
    title: 'مدن من ورق وضوء',
    description:
      'مجموعة تأملات فلسفية وأدبية حول العلاقة بين الإنسان والمدينة والذاكرة المكتوبة، بأسلوب رصين ولغة شاعرية.',
    image: null,
    price: 19,
    discountPercentage: 20,
    isWeeklyPick: true,
    isMonthlyPick: false,
    categoryIds: [1, 2],
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: 4,
    title: 'ما وراء المدار السابع',
    description:
      'رواية خيال علمي تستكشف مستقبل الذكاء الجمعي وبناء المستعمرات الفضائية حين تصبح المعرفة أثمن من أي مورد آخر.',
    image: null,
    price: 28,
    discountPercentage: 10,
    isWeeklyPick: false,
    isMonthlyPick: true,
    categoryIds: [5],
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: 5,
    title: 'البساطة العميقة في تصميم النظم',
    description:
      'كتاب متخصص للمهندسين والمصممين حول بناء برمجيات واضحة وقابلة للتوسع دون تعقيد غير ضروري.',
    image: null,
    price: 35,
    discountPercentage: 0,
    isWeeklyPick: false,
    isMonthlyPick: true,
    categoryIds: [3],
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: 6,
    title: 'فن القراءة المتأنية',
    description:
      'دعوة لإعادة اكتشاف القراءة العميقة وبناء عادة معرفية يومية تمنح القارئ وضوحاً ذهنياً في عالم مزدحم.',
    image: null,
    price: 18,
    discountPercentage: 25,
    isWeeklyPick: false,
    isMonthlyPick: false,
    categoryIds: [2, 4],
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
];

let nextBookId = 7;
let nextCategoryId = 6;
let nextUserId = 2;
let nextCartItemId = 1;

const users: UserRecord[] = [
  {
    id: 1,
    email: 'reader@bookbutler.app',
    fullName: 'أحمد محمد العلي',
    password: 'password123',
    createdAt: nowIso(),
  },
];

const userTokens = new Map<string, number>();
const adminTokens = new Map<string, { username: string; role: string }>();
const userFavorites = new Map<number, Set<number>>();
const userCarts = new Map<number, CartItemRecord[]>();

function enrichBook(book: BookRecord) {
  const hasDiscount = book.discountPercentage > 0;
  const finalPrice = hasDiscount
    ? Number((book.price * (1 - book.discountPercentage / 100)).toFixed(2))
    : book.price;
  const bookCategories = book.categoryIds
    .map((cid) => categories.find((c) => c.id === cid))
    .filter((c): c is CategoryRecord => Boolean(c));

  return {
    ...book,
    hasDiscount,
    finalPrice,
    categories: bookCategories,
  };
}

function getBearerToken(req: Request): string | null {
  const auth = req.headers.authorization;
  if (!auth) return null;
  const match = auth.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}

function requireUser(req: Request, res: Response): UserRecord | null {
  const token = getBearerToken(req);
  if (!token) {
    res.status(401).json({ message: 'يرجى تسجيل الدخول للمتابعة.' });
    return null;
  }
  const userId = userTokens.get(token);
  const user = userId ? users.find((u) => u.id === userId) : undefined;
  if (!user) {
    res.status(401).json({ message: 'انتهت جلسة الدخول، يرجى تسجيل الدخول مجدداً.' });
    return null;
  }
  return user;
}

function requireAdmin(req: Request, res: Response): boolean {
  const token = getBearerToken(req);
  if (!token || !adminTokens.has(token)) {
    res.status(401).json({ message: 'صلاحية المشرف مطلوبة.' });
    return false;
  }
  return true;
}

function buildCartResponse(userId: number) {
  const rawItems = userCarts.get(userId) || [];
  const items = rawItems
    .map((it) => {
      const book = books.find((b) => b.id === it.bookId);
      if (!book) return null;
      const enriched = enrichBook(book);
      const originalSubtotal = Number((enriched.price * it.quantity).toFixed(2));
      const finalSubtotal = Number((enriched.finalPrice * it.quantity).toFixed(2));
      return {
        id: it.id,
        bookId: it.bookId,
        quantity: it.quantity,
        book: enriched,
        originalSubtotal,
        finalSubtotal,
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const totalOriginalPrice = Number(
    items.reduce((sum, item) => sum + item.originalSubtotal, 0).toFixed(2)
  );
  const totalFinalPrice = Number(
    items.reduce((sum, item) => sum + item.finalSubtotal, 0).toFixed(2)
  );

  return {
    items,
    totalOriginalPrice,
    totalFinalPrice,
    totalSavings: Number(Math.max(0, totalOriginalPrice - totalFinalPrice).toFixed(2)),
  };
}

// Lightweight multipart/form-data parser for book image uploads without extra dependencies
async function parseMultipartOrJson(
  req: Request
): Promise<{ fields: Record<string, string>; imageDataUrl: string | null }> {
  const contentType = req.headers['content-type'] || '';
  if (!contentType.includes('multipart/form-data')) {
    const fields: Record<string, string> = {};
    if (req.body && typeof req.body === 'object') {
      for (const [k, v] of Object.entries(req.body)) {
        fields[k] = typeof v === 'string' ? v : JSON.stringify(v);
      }
    }
    return { fields, imageDataUrl: null };
  }

  const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  if (!boundaryMatch) {
    return { fields: {}, imageDataUrl: null };
  }
  const boundary = `--${boundaryMatch[1] || boundaryMatch[2]}`;

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const rawBuffer = Buffer.concat(chunks);
  const rawLatin = rawBuffer.toString('latin1');
  const parts = rawLatin.split(boundary).slice(1, -1);

  const fields: Record<string, string> = {};
  let imageDataUrl: string | null = null;

  for (const part of parts) {
    const headerEnd = part.indexOf('\r\n\r\n');
    if (headerEnd === -1) continue;

    const headerStr = part.slice(0, headerEnd);
    // Remove leading \r\n and trailing \r\n
    let bodyLatin = part.slice(headerEnd + 4);
    if (bodyLatin.endsWith('\r\n')) {
      bodyLatin = bodyLatin.slice(0, -2);
    }

    const nameMatch = headerStr.match(/name="([^"]+)"/i);
    if (!nameMatch) continue;
    const fieldName = nameMatch[1];

    const filenameMatch = headerStr.match(/filename="([^"]*)"/i);
    if (filenameMatch && filenameMatch[1]) {
      const mimeMatch = headerStr.match(/Content-Type:\s*([^\r\n;]+)/i);
      const mime = mimeMatch ? mimeMatch[1].trim() : 'image/jpeg';
      const fileBuf = Buffer.from(bodyLatin, 'latin1');
      if (fileBuf.length > 0) {
        imageDataUrl = `data:${mime};base64,${fileBuf.toString('base64')}`;
      }
    } else {
      fields[fieldName] = Buffer.from(bodyLatin, 'latin1').toString('utf8');
    }
  }

  return { fields, imageDataUrl };
}

async function startServer() {
  const app = express();

  app.use((req, res, next) => {
    const contentType = req.headers['content-type'] || '';
    if (contentType.includes('multipart/form-data')) {
      return next();
    }
    return express.json()(req, res, next);
  });

  // Store & Support Config
  app.get('/api/store/config', (_req, res) => {
    res.json({
      storeName: 'Book Butler',
      description:
        'متجرك الشخصي لاقتناء الكتب العربية والعالمية المختارة بعناية — تصفح الترشيحات الأسبوعية والشهرية واطلب نسختك مباشرة عبر واتساب.',
      supportWhatsappUrl: DEFAULT_SUPPORT_WHATSAPP_URL,
    });
  });

  app.get('/api/auth/support', (_req, res) => {
    res.json({ whatsappUrl: DEFAULT_SUPPORT_WHATSAPP_URL });
  });

  // Auth Routes
  app.post('/api/auth/register', (req, res) => {
    const { email, fullName, password, confirmPassword } = req.body || {};
    if (!email || !fullName || !password) {
      return res.status(400).json({ message: 'يرجى تعبئة جميع الحقول المطلوبة.' });
    }
    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ message: 'كلمتا المرور غير متطابقتين.' });
    }
    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedName = String(fullName).trim();

    if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
      return res.status(409).json({ message: 'البريد الإلكتروني مسجل مسبقاً.' });
    }

    const newUser: UserRecord = {
      id: nextUserId++,
      email: normalizedEmail,
      fullName: normalizedName,
      password: String(password),
      createdAt: nowIso(),
    };
    users.push(newUser);
    const token = `user_${newUser.id}_${Date.now()}`;
    userTokens.set(token, newUser.id);

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        createdAt: newUser.createdAt,
      },
    });
  });

  app.post('/api/auth/login', (req, res) => {
    const { fullName, password } = req.body || {};
    if (!fullName || !password) {
      return res.status(400).json({ message: 'يرجى إدخال الاسم الثلاثي وكلمة المرور.' });
    }
    const normalizedName = String(fullName).trim();
    const user = users.find(
      (u) => u.fullName === normalizedName && u.password === String(password)
    );
    if (!user) {
      return res
        .status(401)
        .json({ message: 'الاسم الثلاثي أو كلمة المرور غير صحيحة.' });
    }
    const token = `user_${user.id}_${Date.now()}`;
    userTokens.set(token, user.id);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        createdAt: user.createdAt,
      },
    });
  });

  app.get('/api/auth/profile', (req, res) => {
    const user = requireUser(req, res);
    if (!user) return;
    res.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        createdAt: user.createdAt,
      },
    });
  });

  // Categories Routes
  app.get('/api/categories', (_req, res) => {
    res.json({
      categories: categories.map((cat) => ({
        ...cat,
        booksCount: books.filter((b) => b.categoryIds.includes(cat.id)).length,
      })),
    });
  });

  app.post('/api/categories', (req, res) => {
    if (!requireAdmin(req, res)) return;
    const { name, description } = req.body || {};
    if (!name || !String(name).trim()) {
      return res.status(400).json({ message: 'يرجى إدخال اسم النوع.' });
    }
    const newCat: CategoryRecord = {
      id: nextCategoryId++,
      name: String(name).trim(),
      description: description ? String(description).trim() : undefined,
    };
    categories.push(newCat);
    res.status(201).json({ category: newCat });
  });

  app.put('/api/categories/:id', (req, res) => {
    if (!requireAdmin(req, res)) return;
    const id = Number(req.params.id);
    const cat = categories.find((c) => c.id === id);
    if (!cat) {
      return res.status(404).json({ message: 'النوع غير موجود.' });
    }
    const { name, description } = req.body || {};
    if (name !== undefined && String(name).trim()) {
      cat.name = String(name).trim();
    }
    if (description !== undefined) {
      cat.description = String(description).trim();
    }
    res.json({ category: cat });
  });

  app.delete('/api/categories/:id', (req, res) => {
    if (!requireAdmin(req, res)) return;
    const id = Number(req.params.id);
    const idx = categories.findIndex((c) => c.id === id);
    if (idx === -1) {
      return res.status(404).json({ message: 'النوع غير موجود.' });
    }
    categories.splice(idx, 1);
    for (const book of books) {
      book.categoryIds = book.categoryIds.filter((cid) => cid !== id);
    }
    res.json({ success: true });
  });

  // Books Routes
  app.get('/api/books/recommendations', (_req, res) => {
    res.json({
      weeklyPicks: books.filter((b) => b.isWeeklyPick).map(enrichBook),
      monthlyPicks: books.filter((b) => b.isMonthlyPick).map(enrichBook),
    });
  });

  app.get('/api/books', (req, res) => {
    const search = String(req.query.search || '').trim().toLowerCase();
    const categoryId = req.query.categoryId ? Number(req.query.categoryId) : null;
    const categoryName = String(req.query.category || '').trim().toLowerCase();
    const discounted = req.query.discounted === 'true';

    const filtered = books.filter((b) => {
      if (search) {
        const matchesText =
          b.title.toLowerCase().includes(search) ||
          b.description.toLowerCase().includes(search) ||
          String(b.id).includes(search);
        if (!matchesText) return false;
      }
      if (categoryId && !b.categoryIds.includes(categoryId)) {
        return false;
      }
      if (categoryName) {
        const matched = b.categoryIds.some((cid) => {
          const cat = categories.find((c) => c.id === cid);
          return cat?.name.toLowerCase() === categoryName;
        });
        if (!matched) return false;
      }
      if (discounted && b.discountPercentage <= 0) {
        return false;
      }
      return true;
    });

    res.json({ books: filtered.map(enrichBook) });
  });

  app.get('/api/books/:id', (req, res) => {
    const id = Number(req.params.id);
    const book = books.find((b) => b.id === id);
    if (!book) {
      return res.status(404).json({ message: 'الكتاب غير موجود.' });
    }
    res.json({ book: enrichBook(book) });
  });

  app.post('/api/books', async (req, res) => {
    if (!requireAdmin(req, res)) return;
    const { fields, imageDataUrl } = await parseMultipartOrJson(req);
    const title = (fields.title || '').trim();
    const price = Number(fields.price);
    if (!title || Number.isNaN(price)) {
      return res.status(400).json({ message: 'يرجى إدخال اسم الكتاب والسعر.' });
    }

    let parsedCategoryIds: number[] = [];
    if (fields.categoryIds) {
      try {
        const arr = JSON.parse(fields.categoryIds);
        if (Array.isArray(arr)) parsedCategoryIds = arr.map(Number);
      } catch {
        parsedCategoryIds = [];
      }
    }

    const created: BookRecord = {
      id: nextBookId++,
      title,
      description: (fields.description || '').trim(),
      image: imageDataUrl,
      price,
      discountPercentage: Math.max(0, Math.min(100, Number(fields.discountPercentage || 0))),
      isWeeklyPick: fields.isWeeklyPick === 'true',
      isMonthlyPick: fields.isMonthlyPick === 'true',
      categoryIds: parsedCategoryIds,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    books.unshift(created);
    res.status(201).json({ book: enrichBook(created) });
  });

  app.put('/api/books/:id', async (req, res) => {
    if (!requireAdmin(req, res)) return;
    const id = Number(req.params.id);
    const book = books.find((b) => b.id === id);
    if (!book) {
      return res.status(404).json({ message: 'الكتاب غير موجود.' });
    }

    const { fields, imageDataUrl } = await parseMultipartOrJson(req);
    if (fields.title !== undefined && fields.title.trim()) {
      book.title = fields.title.trim();
    }
    if (fields.description !== undefined) {
      book.description = fields.description.trim();
    }
    if (fields.price !== undefined && !Number.isNaN(Number(fields.price))) {
      book.price = Number(fields.price);
    }
    if (
      fields.discountPercentage !== undefined &&
      !Number.isNaN(Number(fields.discountPercentage))
    ) {
      book.discountPercentage = Math.max(
        0,
        Math.min(100, Number(fields.discountPercentage))
      );
    }
    if (fields.isWeeklyPick !== undefined) {
      book.isWeeklyPick = fields.isWeeklyPick === 'true';
    }
    if (fields.isMonthlyPick !== undefined) {
      book.isMonthlyPick = fields.isMonthlyPick === 'true';
    }
    if (fields.categoryIds) {
      try {
        const arr = JSON.parse(fields.categoryIds);
        if (Array.isArray(arr)) book.categoryIds = arr.map(Number);
      } catch {
        // ignore invalid categoryIds
      }
    }
    if (imageDataUrl) {
      book.image = imageDataUrl;
    }
    book.updatedAt = nowIso();
    res.json({ book: enrichBook(book) });
  });

  app.patch('/api/books/:id/recommendations', (req, res) => {
    if (!requireAdmin(req, res)) return;
    const id = Number(req.params.id);
    const book = books.find((b) => b.id === id);
    if (!book) {
      return res.status(404).json({ message: 'الكتاب غير موجود.' });
    }
    const { isWeeklyPick, isMonthlyPick } = req.body || {};
    if (isWeeklyPick !== undefined) book.isWeeklyPick = Boolean(isWeeklyPick);
    if (isMonthlyPick !== undefined) book.isMonthlyPick = Boolean(isMonthlyPick);
    book.updatedAt = nowIso();
    res.json({ book: enrichBook(book) });
  });

  app.delete('/api/books/:id', (req, res) => {
    if (!requireAdmin(req, res)) return;
    const id = Number(req.params.id);
    const idx = books.findIndex((b) => b.id === id);
    if (idx === -1) {
      return res.status(404).json({ message: 'الكتاب غير موجود.' });
    }
    books.splice(idx, 1);
    res.json({ success: true });
  });

  // Favorites Routes
  app.get('/api/favorites', (req, res) => {
    const user = requireUser(req, res);
    if (!user) return;
    const favSet = userFavorites.get(user.id) || new Set<number>();
    const favBooks = books.filter((b) => favSet.has(b.id)).map(enrichBook);
    res.json({ favorites: favBooks });
  });

  app.post('/api/favorites/:bookId', (req, res) => {
    const user = requireUser(req, res);
    if (!user) return;
    const bookId = Number(req.params.bookId);
    if (!books.some((b) => b.id === bookId)) {
      return res.status(404).json({ message: 'الكتاب غير موجود.' });
    }
    let favSet = userFavorites.get(user.id);
    if (!favSet) {
      favSet = new Set<number>();
      userFavorites.set(user.id, favSet);
    }
    let isFavorite = false;
    if (favSet.has(bookId)) {
      favSet.delete(bookId);
      isFavorite = false;
    } else {
      favSet.add(bookId);
      isFavorite = true;
    }
    res.json({ isFavorite });
  });

  // Cart Routes
  app.get('/api/cart', (req, res) => {
    const user = requireUser(req, res);
    if (!user) return;
    res.json({ cart: buildCartResponse(user.id) });
  });

  app.post('/api/cart', (req, res) => {
    const user = requireUser(req, res);
    if (!user) return;
    const { bookId, quantity = 1 } = req.body || {};
    const targetBookId = Number(bookId);
    const qty = Math.max(1, Number(quantity || 1));
    if (!books.some((b) => b.id === targetBookId)) {
      return res.status(404).json({ message: 'الكتاب غير موجود.' });
    }
    let items = userCarts.get(user.id);
    if (!items) {
      items = [];
      userCarts.set(user.id, items);
    }
    const existing = items.find((i) => i.bookId === targetBookId);
    if (existing) {
      existing.quantity += qty;
    } else {
      items.push({ id: nextCartItemId++, bookId: targetBookId, quantity: qty });
    }
    res.status(201).json({ cart: buildCartResponse(user.id) });
  });

  app.put('/api/cart/:itemId', (req, res) => {
    const user = requireUser(req, res);
    if (!user) return;
    const itemId = Number(req.params.itemId);
    const qty = Number(req.body?.quantity ?? 1);
    const items = userCarts.get(user.id) || [];
    const idx = items.findIndex((i) => i.id === itemId);
    if (idx === -1) {
      return res.status(404).json({ message: 'العنصر غير موجود في السلة.' });
    }
    if (qty < 1) {
      items.splice(idx, 1);
    } else {
      items[idx].quantity = qty;
    }
    res.json({ cart: buildCartResponse(user.id) });
  });

  app.delete('/api/cart/:itemId', (req, res) => {
    const user = requireUser(req, res);
    if (!user) return;
    const itemId = Number(req.params.itemId);
    const items = userCarts.get(user.id) || [];
    const idx = items.findIndex((i) => i.id === itemId);
    if (idx !== -1) {
      items.splice(idx, 1);
    }
    res.json({ cart: buildCartResponse(user.id) });
  });

  app.post('/api/cart/checkout-whatsapp', (req, res) => {
    const user = requireUser(req, res);
    if (!user) return;
    const cartData = buildCartResponse(user.id);
    const titles = cartData.items
      .map((item) =>
        item.quantity > 1
          ? `${item.book.title} (العدد: ${item.quantity})`
          : item.book.title
      )
      .join(' ، ');
    const message = `مرحبا Book Butler , اريد شراء الكتب التالية :  "${titles}"`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_ORDER_PHONE}?text=${encodeURIComponent(
      message
    )}`;
    res.json({ whatsappUrl, order: { whatsappUrl, totalFinalPrice: cartData.totalFinalPrice } });
  });

  // Admin Routes
  app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body || {};
    if (
      String(username || '').trim() !== 'superadmin' ||
      !String(password || '').trim()
    ) {
      return res
        .status(401)
        .json({ message: 'بيانات دخول المشرف غير صحيحة.' });
    }
    const token = `admin_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const admin = { id: 1, username: 'superadmin', role: 'superadmin' };
    adminTokens.set(token, admin);
    res.json({ token, admin });
  });

  app.get('/api/admin/dashboard', (req, res) => {
    if (!requireAdmin(req, res)) return;
    res.json({
      stats: {
        totalBooks: books.length,
        discountedBooks: books.filter((b) => b.discountPercentage > 0).length,
        weeklyPicks: books.filter((b) => b.isWeeklyPick).length,
        monthlyPicks: books.filter((b) => b.isMonthlyPick).length,
        totalCategories: categories.length,
        totalUsers: users.length,
      },
      recentBooks: books.slice(0, 5).map(enrichBook),
    });
  });

  // Vite / Static Frontend
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distDir)) {
      app.use(express.static(distDir));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distDir, 'index.html'));
      });
    }
  }

  const configuredPort = process.env.PORT ? Number(process.env.PORT) : DEFAULT_PORT;
  if (!Number.isInteger(configuredPort) || configuredPort < 1 || configuredPort > 65535) {
    throw new Error(`Invalid PORT value: ${process.env.PORT}`);
  }

  const httpServer = app.listen(configuredPort, '0.0.0.0');
  let activePort = configuredPort;

  httpServer.on('listening', () => {
    const address = httpServer.address();
    if (!address || typeof address === 'string') {
      console.error('The HTTP server started without a usable network address.');
      return;
    }

    const port = address.port;
    console.log(`\n  Book Butler server ready`);
    console.log(`  ➜ Local:   http://localhost:${port}/`);
    const networkAddresses = Object.values(os.networkInterfaces())
      .flatMap((interfaces) => interfaces || [])
      .filter((network) => network.family === 'IPv4' && !network.internal)
      .map((network) => network.address);
    for (const address of networkAddresses) {
      console.log(`  ➜ Network: http://${address}:${port}/`);
    }
    console.log('  ➜ Press Ctrl+C to stop the server\n');
  });

  httpServer.on('error', (error: NodeJS.ErrnoException) => {
    if (
      error.code === 'EADDRINUSE' &&
      process.env.PORT === undefined &&
      activePort < configuredPort + 10 &&
      activePort < 65535
    ) {
      console.warn(`Port ${activePort} is already in use; trying ${activePort + 1}.`);
      activePort += 1;
      httpServer.listen(activePort, '0.0.0.0');
      return;
    }

    console.error(`Failed to start the HTTP server on port ${activePort}:`, error);
    process.exit(1);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
