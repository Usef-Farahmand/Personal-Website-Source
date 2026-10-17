# طرح پنل ادمین (Git-based Admin Panel)

این سند طرح فنی پنل ادمین سایت **useffarahmand.com** است: چه می‌سازیم، چرا این روش را انتخاب کردیم، معماری، مدل امنیتی، نحوهٔ حفظ ارتباط بین بخش‌ها، و مراحل پیاده‌سازی. توسعهٔ پنل بر اساس همین سند انجام می‌شود؛ هر تصمیمی که در حین کار عوض شد، اول این سند به‌روز شود.

> وضعیت: **پیش‌نویس تأییدشده برای شروع توسعه** — برنچ `feature/adminPanel`

---

## ۱. هدف و محدوده

**هدف:** مدیریت کامل محتوا و تنظیمات سایت از طریق مرورگر، بدون ویرایش دستی فایل‌ها، با این شرایط:

- **رایگان:** بدون دیتابیس یا سرویس پولی؛ فقط Vercel (پلن Hobby) و GitHub.
- **امن:** فقط صاحب سایت بتواند وارد شود و تغییر بدهد.
- **پوشش کامل:** همهٔ بخش‌های محتوایی + تنظیمات سایت + فایل‌های رسانه.
- **حفظ ارتباطات:** ارجاع‌های بین بخش‌ها (تیم ↔ پروژه ↔ توصیه‌نامه و …) هرگز نشکنند.
- **بدون تغییر در سایت عمومی:** ظاهر و رفتار سایت، SEO و عملکرد دقیقاً همان بماند.

**خارج از محدوده (فعلاً):** چند کاربره بودن و نقش‌ها، پیش‌نویس زمان‌بندی‌شده، ویرایش متن‌های رابط کاربری (`src/messages/*.json`) — این آخری در فاز اختیاری آخر آمده است.

---

## ۲. وضعیت فعلی پروژه (مبنای طراحی)

| موضوع | وضعیت |
|---|---|
| فریم‌ورک | Next.js 16 (App Router)، React 19، next-intl، Tailwind 4 |
| میزبانی | Vercel (فرم تماس `src/app/api/contact/route.ts` و `src/middleware.ts` سمت سرور اجرا می‌شوند). GitHub Pages سرور ندارد، پس پنل حتماً روی Vercel اجرا می‌شود. |
| دیتابیس | ندارد. همهٔ محتوا داخل ریپو است و هنگام build در صفحات استاتیک قرار می‌گیرد (`generateStaticParams`). |
| ریپو | عمومی (public) |
| لایهٔ دسترسی به محتوا | `src/content/<section>/index.ts` ← `src/services/content/*.service.ts` ← کامپوننت‌ها |

### فایل‌های محتوا

| بخش | فایل منبع فعلی | فرمت |
|---|---|---|
| پروژه‌ها | `src/content/generated/projects.json` | JSON |
| مقالات | `src/content/generated/articles.json` | JSON |
| رسانه (عمومی) | `src/content/generated/media.json` | JSON |
| تیم | `src/content/team/team.json` | JSON |
| توصیه‌نامه‌ها | `src/content/recommendations/recommendations.json` | JSON |
| یادگیری | `src/content/learning/learning.json` (+ `learning.schema.json`) | JSON |
| مهارت‌ها | `src/content/skills/skills.data.ts` | TypeScript |
| سوابق کاری | `src/content/experience/experience.data.ts` | TypeScript |
| دستاوردها | `src/content/achievements/achievements.data.ts` | TypeScript |
| اسناد (رزومه و …) | `src/content/documents/documents.data.ts` | TypeScript |
| اطلاعات تماس | `src/content/contact/contact.data.ts` | TypeScript |
| تنظیمات سایت | `src/content/site/site.data.ts` | TypeScript |
| تنظیمات فنی تماس | `src/content/contact/contact.config.ts` | TypeScript (پیکربندی، نه محتوا) |

> نکته: `projects.data.ts` و `articles.data.ts` دیگر import نمی‌شوند (تاریخچهٔ قبل از CMS). اسکریپت `cms/` که فایل‌های `generated` را می‌ساخت در این ریپو وجود ندارد؛ با آمدن پنل، **خود فایل‌های JSON منبع اصلی (source of truth) می‌شوند** و پنل مستقیماً آن‌ها را ویرایش می‌کند.

---

## ۳. تصمیم: چرا پنل اختصاصی Git-based؟

| گزینه | دلیل رد/انتخاب |
|---|---|
| Decap CMS | رایگان و git-based، ولی با مدل ترجمهٔ تودرتو (`translations.en/fa`) و ارجاع‌های چندگانه ضعیف است، ظاهرش با Design System سایت هماهنگ نیست و توسعه‌اش کند شده. |
| Keystatic | گزینهٔ دوم. رایگان و git-based با فیلد relationship؛ ولی سازگاری با Next 16 قطعی نیست و باید ساختار محتوا را به مدل خودش درآوریم. |
| TinaCMS | سطح رایگان محدود و وابسته به Tina Cloud. |
| Sanity / Payload / Supabase | محتوا از ریپو خارج می‌شود، لایهٔ سرویس‌ها باید بازنویسی شود و وابستگی به سرویس بیرونی اضافه می‌شود. |
| **پنل اختصاصی Git-based** ✅ | صفر هزینه، بدون دیتابیس، کنترل کامل روی اعتبارسنجی و ارتباطات، هم‌شکل با Design System، تاریخچه و امکان بازگشت از طریق git. |

---

## ۴. معماری کلی

```
 مرورگر (شما)
     │  HTTPS
     ▼
 ┌─────────────────────────── Vercel ───────────────────────────┐
 │  /admin/*            صفحات پنل (Server Components + فرم‌ها)    │
 │  /api/admin/auth/*   ورود/خروج با GitHub OAuth                 │
 │  Server Actions      ذخیره → اعتبارسنجی → commit               │
 │        │                                                       │
 │        ├─ lib/admin/auth      نشست امضاشده، allowlist          │
 │        ├─ lib/admin/schemas   Zod schema هر بخش               │
 │        ├─ lib/admin/integrity بررسی ارجاع‌ها و یکتایی         │
 │        └─ lib/admin/github    خواندن/نوشتن فایل با GitHub API  │
 └────────┼───────────────────────────────────────────────────────┘
          │ GitHub REST API (توکن فقط سمت سرور)
          ▼
   ریپو GitHub  ──(push به main)──►  Vercel build خودکار  ──►  سایت به‌روز
```

**جریان یک تغییر:**

1. پنل آخرین نسخهٔ فایل را **از GitHub** می‌خواند (نه از bundle در حال اجرا)، همراه با `sha` آن.
2. شما فرم را ویرایش و ذخیره می‌کنید.
3. Server Action: احراز هویت ← بررسی Origin ← اعتبارسنجی Zod ← بررسی یکپارچگی ارجاع‌ها روی **کل** محتوا.
4. اگر همه‌چیز درست بود، یک commit اتمیک ساخته می‌شود (در صورت تغییر چند فایل، با Git Data API در یک commit).
5. Vercel خودکار build می‌گیرد؛ چون build اجرای `next build` است، هر خطای نوعی هم قبل از انتشار گرفته می‌شود و سایت قبلی سر جایش می‌ماند.

**جلوگیری از تداخل:** هنگام نوشتن، `sha` خوانده‌شده ارسال می‌شود. اگر فایل در این فاصله (مثلاً با commit دستی شما) عوض شده باشد، GitHub خطای 409 می‌دهد و پنل پیام «این محتوا تغییر کرده، دوباره بارگذاری کنید» نشان می‌دهد — هیچ تغییری بی‌صدا رونویسی نمی‌شود.

**برنچ مقصد:** پیش‌فرض `main` (انتشار مستقیم). گزینهٔ «ذخیره به‌صورت پیش‌نویس» می‌تواند روی برنچ `content/drafts` commit کند و Vercel برای آن Preview Deployment می‌سازد؛ انتشار = merge.

> ⚠️ AGENTS.md: این نسخهٔ Next.js تغییرات ناسازگار دارد. قبل از نوشتن کد، راهنماهای `node_modules/next/dist/docs/` را دربارهٔ Server Actions، cookies، middleware/proxy و Route Handlers بخوانید و به هشدارهای deprecation توجه کنید (از جمله احتمال تغییر نام `middleware.ts`).

---

## ۵. مدل امنیتی

### ۵.۱ احراز هویت

- **GitHub OAuth** (یا GitHub App با user-to-server token). کاربر به GitHub هدایت می‌شود، `state` تصادفی در کوکی کوتاه‌مدت ذخیره و هنگام callback مقایسه می‌شود (ضد CSRF در OAuth). PKCE هم فعال شود.
- بعد از callback، شناسهٔ **عددی** کاربر GitHub (`id`، نه `login` که قابل تغییر است) با `ADMIN_GITHUB_USER_ID` مقایسه می‌شود. هر کاربر دیگری ← 403، بدون ساخت نشست.
- توکن OAuth کاربر فقط برای تأیید هویت است و **ذخیره نمی‌شود**.

### ۵.۲ نشست (Session)

- کوکی `__Host-admin_session` با `HttpOnly`، `Secure`، `SameSite=Strict`، `Path=/`.
- محتوا: `{ userId, issuedAt, expiresAt }` امضاشده با HMAC-SHA256 (یا JWT با کتابخانهٔ `jose`) و کلید `ADMIN_SESSION_SECRET` (حداقل ۳۲ بایت تصادفی).
- انقضای مطلق ۸ ساعت؛ بدون «مرا به خاطر بسپار».
- خروج = پاک کردن کوکی. برای «خروج از همهٔ دستگاه‌ها» کافی است `ADMIN_SESSION_SECRET` در Vercel عوض شود.

### ۵.۳ مجوز در هر درخواست

- **هر** Server Action و Route Handler ادمین اول `requireAdmin()` را صدا می‌زند (نشست + مقایسهٔ userId). محافظت middleware فقط لایهٔ اول است و به‌تنهایی کافی نیست، چون Server Actionها endpoint عمومی‌اند.
- بررسی `Origin`/`Host` روی درخواست‌های تغییردهنده (Server Actions خودشان Origin را چک می‌کنند؛ برای Route Handlerها دستی).
- محدودیت نرخ (rate limit) روی مسیرهای ورود، مثل الگوی موجود در `contact.config.ts`.

### ۵.۴ دسترسی به GitHub برای نوشتن

- ترجیح: **GitHub App** شخصی که فقط روی همین ریپو نصب شده، با مجوز `Contents: Read & write` (و `Metadata: Read`). کلید خصوصی در `GITHUB_APP_PRIVATE_KEY`.
- جایگزین ساده‌تر: **Fine-grained PAT** فقط برای همین ریپو با همان مجوز و تاریخ انقضا.
- این اعتبارنامه‌ها فقط در Environment Variables سرور Vercel‌اند؛ هرگز `NEXT_PUBLIC_` نمی‌گیرند و هرگز به مرورگر ارسال نمی‌شوند.
- مسیرهای قابل‌نوشتن **allowlist** شده‌اند (فقط فایل‌های محتوای بخش ۲ و پوشه‌های رسانه در `public/`)؛ پنل هیچ مسیر دلخواهی را نمی‌نویسد (ضد path traversal).
- پیام commit استاندارد: `content(<section>): <action> <id>` + `Co-authored-by` نام کاربر — تا تاریخچه خوانا بماند.

### ۵.۵ ورودی‌ها و خروجی‌ها

- همهٔ ورودی‌ها سمت سرور با Zod اعتبارسنجی می‌شوند (اعتبارسنجی سمت کاربر فقط برای راحتی است).
- URLها فقط `https:` یا مسیر نسبی `/…` (و `mailto:` برای لینک ایمیل)؛ `javascript:` و `data:` رد می‌شوند.
- آپلود فایل: بررسی نوع واقعی فایل (magic bytes)، سقف حجم، نام فایل slugify شده. **SVG آپلودی ممنوع** (می‌تواند اسکریپت داشته باشد).
- متن‌ها به‌صورت متن ساده ذخیره و در سایت با escape خودکار React رندر می‌شوند؛ پنل HTML خام نمی‌پذیرد.

### ۵.۶ سخت‌سازی مسیر `/admin`

- `robots: noindex, nofollow` و خارج کردن از `sitemap.ts`/`robots.ts`/`llms.txt`.
- هدرها برای `/admin`: `Content-Security-Policy` سخت‌گیرانه، `X-Frame-Options: DENY`، `Referrer-Policy: no-referrer`، `Cache-Control: no-store`.
- `@vercel/analytics` در صفحات ادمین غیرفعال.
- پنل خارج از `[locale]` است (مسیر `/admin`) و باید در matcher میان‌افزار next-intl استثنا شود تا به `/en/admin` هدایت نشود.

### ۵.۷ چک‌لیست امنیتی قبل از انتشار

- [ ] کاربر دیگر GitHub نمی‌تواند وارد شود (تست دستی با حساب دوم).
- [ ] فراخوانی مستقیم Server Action بدون کوکی ← 401.
- [ ] کوکی دست‌کاری‌شده یا منقضی ← 401.
- [ ] `state` اشتباه در OAuth callback ← رد.
- [ ] هیچ secret در bundle کلاینت نیست (`grep` روی `.next/static`).
- [ ] نوشتن مسیر خارج از allowlist ← رد.
- [ ] آپلود SVG/فایل اجرایی ← رد.
- [ ] Branch protection روی `main`: فقط GitHub App/صاحب ریپو اجازهٔ push دارد.

---

## ۶. لایهٔ داده

### ۶.۱ تبدیل فایل‌های TypeScript به JSON (پیش‌نیاز)

پنل نمی‌تواند فایل `.ts` را مطمئن ویرایش کند، پس این فایل‌ها به JSON منتقل می‌شوند، همان الگویی که `team`، `recommendations` و `learning` الان دارند:

```
skills.data.ts        → skills.json
experience.data.ts    → experience.json
achievements.data.ts  → achievements.json
documents.data.ts     → documents.json
contact.data.ts       → contact.json
site.data.ts          → site.json
```

- `index.ts` هر بخش فقط منبع import را عوض می‌کند (`… as unknown as T[]`)؛ سرویس‌ها و کامپوننت‌ها **دست نمی‌خورند**.
- `contact.config.ts` پیکربندی فنی است و TypeScript می‌ماند (در پنل فقط‌خواندنی یا خارج از پنل).
- تأیید: خروجی HTML صفحات قبل و بعد از تبدیل یکی باشد (مقایسهٔ build).
- `projects.data.ts` و `articles.data.ts` بلااستفاده حذف شوند (در تاریخچهٔ git می‌مانند) و `CONTENT_GUIDE_fa.md` به‌روز شود.

### ۶.۲ Schemaها

- برای هر بخش یک Zod schema در `src/lib/admin/schemas/` که دقیقاً با `src/types/content.ts` منطبق است. نوع TypeScript با `z.infer` با تایپ‌های موجود مقایسه شود (تست نوعی) تا دو تعریف از هم جدا نشوند.
- schema مشترک برای `translations: { en, fa }`، `MediaItem` و `ExternalLink`.
- بعداً همین schemaها می‌توانند cast‌های `as unknown as` در `index.ts` را با اعتبارسنجی هنگام build جایگزین کنند.

---

## ۷. یکپارچگی ارتباطات بین بخش‌ها

### ۷.۱ نقشهٔ ارجاع‌ها

| فیلد ارجاع‌دهنده | به | توضیح |
|---|---|---|
| `Project.team[]` | `TeamMember.id` | اعضای تیم پروژه |
| `Project.relatedProjectIds[]` | `Project.id` | |
| `Project.relatedArticleIds[]` | `Article.id` | |
| `Project.experienceId` | `Experience.id` یا `null` | |
| `Article.relatedProjectIds[]` / `relatedArticleIds[]` | `Project.id` / `Article.id` | |
| `Article.coAuthors[]` | (فعلاً متن آزاد؛ در آینده `TeamMember.id`) | |
| `Experience.relatedProjectIds[]` | `Project.id` | |
| `Skill.relatedProjectIds[]` / `relatedArticleIds[]` | `Project.id` / `Article.id` | |
| `LearningEntry.relatedProjectIds[]` / `relatedArticleIds[]` | `Project.id` / `Article.id` | |
| `Recommendation.personId` | `TeamMember.id` | در صورت نبود، `name` الزامی است |
| فیلدهای `src`/`coverImageUrl`/`logoUrl`/`avatarUrl` | فایل در `public/` | فایل باید وجود داشته باشد |

### ۷.۲ قوانین

1. **یکتایی:** `id` در هر بخش یکتا؛ `slug` پروژه‌ها و یادگیری یکتا (مسیر صفحه است).
2. **ارجاع معتبر:** هر id ارجاع‌شده باید وجود داشته باشد؛ ارجاع به خود (`relatedProjectIds` شامل id خود پروژه) ممنوع.
3. **حذف امن:** حذف آیتمی که جایی ارجاع شده مسدود است و پنل لیست ارجاع‌دهنده‌ها را نشان می‌دهد، با گزینهٔ «حذف همراه با پاک کردن ارجاع‌ها» که همهٔ فایل‌های درگیر را در **یک commit** اصلاح می‌کند.
4. **تغییر id/slug:** فقط با عمل «تغییر نام» که همهٔ ارجاع‌ها را هم‌زمان به‌روز می‌کند؛ برای slug، یک redirect دائمی در `next.config.ts` پیشنهاد می‌شود تا لینک‌های قدیمی و SEO نشکنند.
5. **ترجمه:** نبود `fa` یا `en` خطا نیست (سایت fallback دارد) ولی به‌صورت هشدار نشان داده می‌شود.
6. **رسانه:** حذف فایل از `public/` فقط وقتی مجاز است که هیچ محتوایی به آن اشاره نکند.

### ۷.۳ پیاده‌سازی

- `src/lib/admin/integrity.ts`: یک تابع خالص `checkIntegrity(allContent) → { errors, warnings }` که روی کل محتوا اجرا می‌شود. قبل از هر commit، روی «محتوای فعلی + تغییر پیشنهادی» اجرا می‌شود؛ هر `error` جلوی commit را می‌گیرد.
- همین تابع در یک اسکریپت `npm run content:check` و در CI (GitHub Actions، رایگان) هم اجرا شود تا ویرایش‌های دستی هم پوشش داده شوند.
- در UI، فیلدهای ارجاع **لیست انتخابی با جست‌وجو** هستند (نام نمایشی + id)، نه ورودی متنی.
- صفحهٔ هر آیتم بخش «استفاده‌شده در» دارد (ارجاع‌های معکوس).

---

## ۸. ساختار پنل

### ۸.۱ مسیرها

```
/admin                         داشبورد: خلاصهٔ بخش‌ها، هشدارهای یکپارچگی، آخرین commitها
/admin/login                   ورود با GitHub
/admin/projects                لیست + جست‌وجو + مرتب‌سازی (order)
/admin/projects/new
/admin/projects/[id]           ویرایش
/admin/articles …              (همین الگو برای همهٔ بخش‌ها)
/admin/experience
/admin/skills
/admin/achievements
/admin/learning
/admin/team
/admin/recommendations
/admin/documents
/admin/contact
/admin/settings                site.json: لینک‌های اجتماعی، وضعیت در دسترس بودن، سال‌های تجربه، استودیو، متن‌های Hero/About
/admin/media                   کتابخانهٔ رسانه (آپلود، جست‌وجو، محل استفاده)
/admin/history                 commitهای محتوا با لینک به GitHub (بازگشت = revert از GitHub)
```

### ۸.۲ ساختار فایل‌ها (پیشنهادی)

```
src/app/admin/
  layout.tsx                   ساختار پنل، noindex، requireAdmin
  login/page.tsx
  [section]/…                  یا پوشهٔ جدا برای هر بخش
src/app/api/admin/auth/
  login/route.ts               شروع OAuth
  callback/route.ts            تبادل code، بررسی کاربر، ساخت نشست
  logout/route.ts
src/lib/admin/
  auth.ts                      requireAdmin، امضا/بررسی نشست
  github.ts                    readFile، commitFiles (با sha)
  content-store.ts             نگاشت بخش → مسیر فایل، load/save
  schemas/*.ts                 Zod schemaها
  integrity.ts                 بررسی ارجاع‌ها
  media.ts                     آپلود و اعتبارسنجی فایل
src/components/admin/
  fields/                      TextField، TranslatedField (en/fa کنار هم، RTL برای fa)،
                               ReferencePicker، MediaPicker، ListEditor (افزودن/حذف/جابجایی)،
                               ContentBlocksEditor (برای learning)
scripts/content-check.mjs
```

### ۸.۳ تجربهٔ ویرایش

- فیلدهای ترجمه‌دار به‌صورت دو ستون en / fa (ستون fa با `dir="rtl"` و فونت Vazirmatn).
- آرایه‌ها (gallery، features، challenges، timeline، content blocks) با افزودن/حذف/جابجایی.
- مرتب‌سازی `order` با drag یا دکمهٔ بالا/پایین.
- نمایش تغییرات (diff) قبل از commit.
- خود پنل هم دوزبانه نیست؛ زبان رابط پنل فارسی یا انگلیسی ثابت (تصمیم باز، بخش ۱۲).

---

## ۹. رسانه

| گزینه | مزایا | معایب |
|---|---|---|
| **داخل ریپو (`public/…`)** — پیش‌فرض پیشنهادی | بدون سرویس بیرونی، همان الگوی فعلی، نسخه‌دار | حجم ریپو بالا می‌رود؛ GitHub Contents API فایل‌های بزرگ (~بیش از ۵۰MB) را نمی‌پذیرد |
| Cloudinary (رایگان) | بهینه‌سازی و CDN خودکار | سرویس بیرونی و حساب جدا |
| Vercel Blob (سطح رایگان) | یکپارچه با Vercel | سقف رایگان محدود؛ فایل‌ها خارج از git |

پیشنهاد: تصاویر و PDFها داخل ریپو با سقف حجم (مثلاً ۵MB، تبدیل خودکار تصاویر به WebP هنگام آپلود)؛ ویدیوهای بزرگ روی YouTube (نوع `youtube` در `MediaItem` از قبل پشتیبانی می‌شود). مسیرها طبق قرارداد فعلی: `public/projects/<slug>/…`، `public/team/…`، `public/articles/…`.

---

## ۱۰. متغیرهای محیطی (Vercel → Settings → Environment Variables)

| نام | توضیح |
|---|---|
| `ADMIN_GITHUB_USER_ID` | شناسهٔ عددی حساب GitHub شما (`https://api.github.com/users/<username>` → `id`) |
| `ADMIN_SESSION_SECRET` | رشتهٔ تصادفی حداقل ۳۲ بایت (`openssl rand -base64 48`) |
| `GITHUB_OAUTH_CLIENT_ID` | از OAuth App یا GitHub App |
| `GITHUB_OAUTH_CLIENT_SECRET` | از OAuth App یا GitHub App |
| `GITHUB_APP_ID` | اگر GitHub App استفاده شود |
| `GITHUB_APP_PRIVATE_KEY` | کلید خصوصی GitHub App (یا به‌جای این دو: `GITHUB_CONTENT_TOKEN` = Fine-grained PAT) |
| `GITHUB_REPO_OWNER` / `GITHUB_REPO_NAME` | مثلاً `Usef-Farahmand` / `Personal-Website-Source` |
| `GITHUB_CONTENT_BRANCH` | پیش‌فرض `main` |

همهٔ این‌ها در `.env.example` هم (بدون مقدار) اضافه شوند. محیط Preview می‌تواند callback URL و برنچ جدا داشته باشد.

### راه‌اندازی GitHub App (یک‌بار)

1. GitHub → Settings → Developer settings → GitHub Apps → New GitHub App.
2. Callback URL: `https://www.useffarahmand.com/api/admin/auth/callback` (و برای توسعهٔ محلی `http://localhost:3000/api/admin/auth/callback` در یک App جدا).
3. Webhook: غیرفعال.
4. Repository permissions: `Contents: Read and write`، `Metadata: Read-only`. هیچ مجوز دیگری.
5. «Only on this account» ← ساخت ← Install فقط روی ریپو `Personal-Website-Source`.
6. Client ID، Client secret، App ID و Private key را در Vercel وارد کنید.

---

## ۱۱. فازهای پیاده‌سازی

هر فاز یک یا چند commit مستقل روی `feature/adminPanel` است و در پایانش `npm run lint` و `npm run build` باید سبز باشند.

| فاز | محتوا | معیار پذیرش |
|---|---|---|
| **۰. آماده‌سازی** | تبدیل فایل‌های TS به JSON (بخش ۶.۱)، Zod schemaها، `integrity.ts`، `npm run content:check` و workflow CI | خروجی سایت بدون تغییر؛ `content:check` روی محتوای فعلی بدون خطا |
| **۱. احراز هویت و اسکلت** | OAuth، نشست، `requireAdmin`، layout پنل، noindex و هدرها، استثنای next-intl | چک‌لیست ۵.۷ (بندهای ورود) پاس شود |
| **۲. لایهٔ GitHub** | `github.ts` (خواندن با sha، commit چندفایلی اتمیک، مدیریت 409)، allowlist مسیرها | تست commit روی برنچ آزمایشی |
| **۳. ویرایشگر بخش‌های ساده** | تیم، توصیه‌نامه‌ها، اسناد، تماس، تنظیمات سایت | ویرایش ← commit ← deploy ← تغییر روی سایت |
| **۴. ویرایشگر بخش‌های پیچیده** | پروژه‌ها، مقالات، سوابق، مهارت‌ها، دستاوردها، یادگیری (content blocks) + ReferencePicker و «استفاده‌شده در» | حذف/تغییر نام امن طبق ۷.۲ |
| **۵. رسانه** | آپلود، کتابخانه، MediaPicker، جلوگیری از حذف فایل در حال استفاده | آپلود و استفاده در یک پروژه |
| **۶. تکمیل** | داشبورد و تاریخچه، پیش‌نویس روی برنچ جدا، به‌روزرسانی `CONTENT_GUIDE_fa.md`، بازبینی امنیتی کامل | کل چک‌لیست ۵.۷ |
| **۷. (اختیاری)** | ویرایش متن‌های رابط کاربری `src/messages/en.json` و `fa.json` | |

وابستگی‌های جدید پیشنهادی: `zod`، `jose` (یا HMAC با `node:crypto`)، `@octokit/rest` (یا fetch مستقیم)، `sharp` برای تبدیل تصویر (Next خودش دارد). همه رایگان و متن‌باز.

---

## ۱۲. تصمیم‌های باز

- [ ] رسانه: داخل ریپو (پیشنهاد) یا Cloudinary / Vercel Blob؟
- [ ] GitHub App (پیشنهاد) یا Fine-grained PAT؟
- [ ] انتشار مستقیم روی `main` یا همیشه از طریق برنچ پیش‌نویس و merge؟
- [ ] زبان رابط خود پنل: فارسی یا انگلیسی؟
- [ ] آیا `Article.coAuthors` به `TeamMember.id` تبدیل شود؟

---

## ۱۳. ریسک‌ها و نکات

- **محدودیت build در Vercel Hobby:** هر ذخیره یک deploy است؛ برای جلوگیری از deployهای پشت‌سرهم، ذخیرهٔ چند تغییر در یک commit ممکن باشد.
- **خطای build:** اگر محتوای معتبر از نظر schema باز هم build را خراب کند، Vercel نسخهٔ قبلی را نگه می‌دارد؛ پنل لینک وضعیت deploy را نشان می‌دهد.
- **ریپو عمومی:** هر چیزی که در پنل ذخیره می‌شود عمومی است (مثل الان). محتوای خصوصی نباید در پنل وارد شود.
- **ویرایش دستی هم‌زمان:** با مکانیزم sha (بخش ۴) و `content:check` در CI پوشش داده می‌شود.
- **از دست رفتن دسترسی:** چون همه‌چیز در git است، در بدترین حالت محتوا همیشه به‌صورت دستی قابل ویرایش است.
