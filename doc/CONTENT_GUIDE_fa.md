# راهنمای ویرایش محتوای وب‌سایت

این راهنما توضیح می‌دهد چطور اطلاعات هر بخش از وب‌سایت (پروژه‌ها، مقالات، سوابق کاری، مهارت‌ها، افتخارات، توصیه‌نامه‌ها، تماس و ...) را اضافه، حذف یا ویرایش کنید — بدون نیاز به دانش عمیق برنامه‌نویسی. کافی است الگوی آیتم‌های موجود را در فایل مربوطه کپی و مقادیرش را عوض کنید.

> این پروژه با **Next.js** ساخته شده و از دو زبان **انگلیسی (en)** و **فارسی (fa)** پشتیبانی می‌کند. تقریباً هر بخش محتوایی، هم نسخهٔ انگلیسی و هم نسخهٔ فارسی دارد و باید هر دو را با هم پر کنید.

---

## ۰. قوانین کلی قبل از شروع

1. **محل فایل‌های محتوا:** همهٔ محتوای قابل‌ویرایش داخل پوشهٔ زیر است:
   ```
   src/content/
   ```
   هر زیرپوشه (مثل `projects`, `articles`, `experience`, ...) مربوط به یک بخش از سایت است.

2. **ساختار دوزبانه:** هر آیتم محتوایی یک بخش `translations` دارد با دو کلید `en` و `fa`. حتماً هر دو را کامل پر کنید؛ اگر یکی خالی بماند، سایت معمولاً به‌جای آن از زبان دیگر استفاده می‌کند (که ظاهر حرفه‌ای سایت را خراب می‌کند).

3. **فیلد `id`:** هر آیتم یک `id` منحصربه‌فرد دارد (مثل `"prj-simulix"` یا `"art-broken-arrow-rts"`). موقع اضافه‌کردن آیتم جدید:
   - یک `id` جدید و یکتا با همان الگوی پیشوندی بسازید (مثلاً `prj-` برای پروژه، `art-` برای مقاله).
   - هرگز `id` یک آیتم موجود را که در جای دیگری از سایت لینک شده تغییر ندهید (چون ارتباط بین بخش‌ها — مثلاً پروژه‌ی مرتبط با یک مهارت — از طریق همین `id` انجام می‌شود).

4. **فیلد `order`:** ترتیب نمایش آیتم‌ها را کنترل می‌کند. عدد کوچک‌تر زودتر نمایش داده می‌شود. موقع اضافه‌کردن آیتم جدید، عدد بعدی در دنباله را بگذارید یا اعداد را طوری تنظیم کنید که ترتیب دلخواه‌تان ایجاد شود.

5. **کاما و نحو (Syntax):** این فایل‌ها فایل کد (TypeScript/JSON) هستند، نه ورد. نکات مهم:
   - بعد از هر آیتم داخل یک آرایه (`[...]`) باید کاما `,` بگذارید (به‌جز آیتم آخر که کاما لازم ندارد، ولی گذاشتنش هم مشکلی ایجاد نمی‌کند).
   - رشته‌های متنی فارسی و انگلیسی باید داخل گیومهٔ دوتایی `" "` باشند. اگر خود متن شامل علامت `"` بود، قبلش `\"` بگذارید.
   - آکولاد `{` و `}` و کروشه `[` و `]` باید همیشه جفت باز و بسته شوند.
   - بعد از هر تغییر بهتر است دستور `npm run lint` یا `npm run dev` را اجرا کنید تا خطای احتمالی نحوی زودتر مشخص شود.

6. **تصاویر و فایل‌ها:** تصاویر، لوگوها، گواهی‌نامه‌ها (PDF) و رزومه باید در پوشهٔ عمومی سایت (`public/`) قرار بگیرند و مسیرشان در محتوا به همان شکل نسبی نوشته شود (مثلاً `/projects/simulix-cover.jpg`). اگر پوشهٔ `public` را در پروژه ندیدید، باید آن را در ریشهٔ پروژه (کنار `src`) بسازید و فایل‌ها را داخل زیرپوشه‌های متناظر (`/projects`, `/certificates`, `/documents`, `/brand`) قرار دهید.

7. **⚠️ نکتهٔ مهم دربارهٔ «پروژه‌ها» و «مقالات»:** برخلاف بقیهٔ بخش‌ها، محتوای نهایی صفحات **پروژه‌ها** و **مقالات** از فایل‌های JSON در مسیر `src/content/generated/` خوانده می‌شود (`projects.json` و `articles.json`)، نه مستقیماً از فایل‌های `projects.data.ts` / `articles.data.ts`. این دو فایل JSON به‌طور خودکار توسط یک اسکریپت CMS (`npm run content:export`، که در پوشه‌ای به نام `cms/` قرار دارد) ساخته می‌شوند و آن پوشه در این نسخه از پروژه که در اختیار شماست وجود ندارد.
   تا وقتی آن ابزار CMS را ندارید، دو راه دارید:
   - **راه سریع:** مستقیماً فایل‌های `src/content/generated/projects.json` و `src/content/generated/articles.json` را ویرایش کنید (همان ساختار `projects.data.ts` / `articles.data.ts` را دارند، فقط با نحو JSON به‌جای TypeScript).
   - **راه بلندمدت:** ابزار CMS پروژه (`cms/`) را نصب/بازیابی کنید و از طریق آن محتوا را export بگیرید.
   فایل‌های `.data.ts` این دو بخش را هم می‌توانید برای مستندسازی/تاریخچه به‌روز نگه دارید، اما تا وقتی فایل JSON مربوطه را عوض نکنید، تغییرشان روی سایت دیده نمی‌شود.

---

## ۱. صفحهٔ اصلی و «دربارهٔ من» (Hero / About)

**فایل:** `src/content/site/site.data.ts`

این فایل اطلاعات هستهٔ سایت را نگه می‌دارد:

| بخش | چه چیزی کنترل می‌کند |
|---|---|
| `socialLinks` | لینک‌های شبکه‌های اجتماعی (گیت‌هاب، لینکدین، تلگرام، ایمیل، یوتیوب، مدیوم و ...) |
| `availability.isAvailable` | نشانگر «در دسترس برای پروژهٔ جدید» (`true` یا `false`) |
| `aboutBuildAreas` | لیست حوزه‌هایی که در صفحهٔ «دربارهٔ من» زیر عنوان «چه می‌سازم» نمایش داده می‌شود |
| `translations.en.hero` / `translations.fa.hero` | متن بخش Hero (نام، عنوان شغلی، معرفی کوتاه، وضعیت در دسترس‌بودن) |
| `translations.en.aboutPreview` / `.fa.aboutPreview` | خلاصهٔ معرفی که در پیش‌نمایش صفحهٔ اصلی می‌آید |
| `translations.en.about` / `.fa.about` | متن کامل صفحهٔ «دربارهٔ من» (معرفی، داستان، تمرکز فعلی) |

### افزودن یک شبکهٔ اجتماعی جدید
داخل آرایهٔ `socialLinks` یک آیتم جدید مثل زیر اضافه کنید:
```ts
{
  id: "instagram",
  platform: "instagram", // باید یکی از مقادیر مجاز باشد: github, linkedin, telegram, youtube, instagram, medium, email
  url: "https://instagram.com/your-handle",
  enabled: true, // false کنید تا بدون حذف‌کردن، پنهانش کنید
},
```
اگر پلتفرم جدیدی خارج از این لیست (`github, linkedin, telegram, youtube, instagram, medium, email`) می‌خواهید، لازم است ابتدا یک برنامه‌نویس آن را به نوع `SocialPlatform` در `src/types/content.ts` و آیکن مربوطه در `src/lib/socialPlatforms.tsx` اضافه کند.

### ویرایش متن Hero یا About
همان کلید متناظر را در `translations.en` و `translations.fa` پیدا کرده و متن را جایگزین کنید. برای `story` و `currentFocus` (که آرایه هستند)، هر خط داستان یا هر مورد تمرکز فعلی یک عضو جداگانهٔ آرایه است — می‌توانید عضو اضافه یا کم کنید:
```ts
story: [
  "پاراگراف اول داستان شما...",
  "پاراگراف دوم...",
],
```

---

## ۲. پروژه‌ها (Projects)

**فایل نهایی (که سایت واقعاً می‌خواند):** `src/content/generated/projects.json`
**فایل مرجع/تاریخی:** `src/content/projects/projects.data.ts`

هر پروژه یک شیء با این فیلدهای اصلی است:

- `id`, `slug` — شناسهٔ یکتا و بخشی از URL صفحهٔ پروژه (مثلاً `simulix` → `/projects/simulix`)
- `status` — یکی از: `active`, `shipped`, `paused`, `archived`
- `featured` — `true` یعنی در صفحهٔ اصلی به‌عنوان «کار ویژه» نمایش داده شود
- `category` — یکی از: `ai`, `web`, `mobile`, `game`, `playable-ad`, `tool`
- `technologies` — آرایه‌ای از رشته‌های فناوری (مثل `["Unity", "C#"]`)
- `platforms` — آرایه‌ای از: `web`, `ios`, `android`, `desktop`, `cross-platform`
- `startDate` / `endDate` — تاریخ به فرمت `"YYYY-MM-DD"`؛ برای پروژهٔ در حال انجام، `endDate: null`
- `logoUrl`, `coverImageUrl` — مسیر تصاویر در `public/`
- `gallery` — آرایه‌ای از تصاویر/ویدیوهای گالری پروژه
- `links` — آبجکتی با کلیدهای اختیاری `website`, `playable`, `download`, `appStore`, `googlePlay`, `repository`
- `externalLinks` — لیست آزاد لینک‌های بیرونی دیگر (مثل Steam، مستندات)
- `relatedProjectIds`, `relatedArticleIds` — آرایه‌ای از `id` سایر پروژه‌ها/مقالات مرتبط
- `experienceId` — `id` مربوط به آیتمِ سوابق کاری (بخش Experience) که این پروژه به آن وصل است، یا `null`
- `order` — ترتیب نمایش
- `translations.en` / `translations.fa` — شامل `title`, `summary`, `problem`, `solution`, `lessonsLearned`, `targetAudience`, `myRole`, `featureHighlights`, `metaTitle`, `metaDescription` و چند فیلد اختیاری دیگر (`research`, `design`, `architecture`, `implementation`, `goals`, `challenges`)

### افزودن یک پروژهٔ جدید (نمونهٔ کوتاه)
```json
{
  "id": "prj-my-new-project",
  "slug": "my-new-project",
  "status": "shipped",
  "featured": false,
  "category": "web",
  "technologies": ["Next.js", "TypeScript"],
  "platforms": ["web"],
  "releaseYear": 2026,
  "startDate": "2026-01-01",
  "endDate": "2026-03-01",
  "logoUrl": "/projects/my-new-project-logo.png",
  "coverImageUrl": "/projects/my-new-project-cover.jpg",
  "gallery": [],
  "links": { "website": "https://example.com" },
  "externalLinks": [],
  "relatedProjectIds": [],
  "relatedArticleIds": [],
  "experienceId": null,
  "order": 99,
  "translations": {
    "en": {
      "title": "My New Project",
      "summary": "One-line summary of what it does.",
      "problem": "The problem this project solves.",
      "solution": "How you solved it.",
      "lessonsLearned": "What you learned.",
      "targetAudience": "Who it's for.",
      "myRole": "Your role on the project.",
      "metaTitle": "My New Project — Usef Farahmand",
      "metaDescription": "Short SEO description."
    },
    "fa": {
      "title": "پروژهٔ جدید من",
      "summary": "خلاصهٔ یک‌خطی از کاری که انجام می‌دهد.",
      "problem": "مسئله‌ای که این پروژه حل می‌کند.",
      "solution": "چطور آن را حل کردید.",
      "lessonsLearned": "چه چیزی یاد گرفتید.",
      "targetAudience": "برای چه کسانی است.",
      "myRole": "نقش شما در پروژه.",
      "metaTitle": "پروژهٔ جدید من — یوسف فرح‌مند",
      "metaDescription": "توضیح کوتاه سئو."
    }
  }
}
```
این آیتم را داخل آرایهٔ اصلی `projects.json` اضافه کنید (بعد از یکی از آیتم‌های موجود، با کامای جداکننده).

---

## ۳. مقالات (Articles)

**فایل نهایی:** `src/content/generated/articles.json`
**فایل مرجع/تاریخی:** `src/content/articles/articles.data.ts`

فیلدهای اصلی هر مقاله:
- `id`, `category` (یکی از: `software-engineering`, `ai`, `web-development`, `mobile`, `game-development`, `product-development`, `design`, `personal-journey`)
- `tags` — آرایه‌ای از برچسب‌ها
- `sourcePlatform` — یکی از: `medium`, `linkedin`, `website`, `other`
- `sourceUrl` — لینک کامل مقاله در پلتفرم اصلی
- `readingTimeMinutes` — زمان مطالعه به دقیقه (باید دستی وارد شود)
- `publishedDate` — فرمت `"YYYY-MM-DD"`
- `headerImageUrl` — تصویر هدر (اختیاری)
- `relatedProjectIds`, `relatedArticleIds`
- `order`
- `translations.en` / `.fa` — شامل `title`, `summary`, `metaTitle`, `metaDescription`

### افزودن مقالهٔ جدید
یک آیتم جدید با همین ساختار به آرایهٔ `articles.json` اضافه کنید و `sourceUrl` را به لینک واقعی مقاله (مثلاً در Medium) وصل کنید.

---

## ۴. سوابق کاری (Experience)

**فایل:** `src/content/experience/experience.data.ts` (مستقیماً توسط سایت خوانده می‌شود — نیازی به فایل generated نیست)

فیلدهای هر آیتم:
- `companyName`, `employmentType` (یکی از: `full-time`, `part-time`, `contract`, `freelance`, `internship`)
- `startDate` / `endDate` (`null` برای شغل فعلی)
- `technologies` — آرایهٔ فناوری‌ها
- `relatedLinks` — لینک‌های مرتبط (مثل صفحهٔ شرکت در لینکدین)
- `relatedProjectIds`
- `order`
- `translations.en` / `.fa` — شامل `role`, `headlineAchievement` (جملهٔ خلاصهٔ دستاورد)، `fullDescription`, `location`

نمونهٔ افزودن:
```ts
{
  id: "exp-new-company",
  companyName: "Company Name",
  employmentType: "full-time",
  startDate: "2026-01-01",
  endDate: null,
  technologies: ["React", "Node.js"],
  relatedLinks: [],
  relatedProjectIds: [],
  order: 0, // عدد کوچک‌تر از بقیه بگذارید تا اول لیست بیاید (چون معمولاً جدیدترین تجربه بالاست)
  translations: {
    en: {
      role: "Your Role",
      headlineAchievement: "One-line outcome-focused achievement.",
      fullDescription: "Full paragraph describing the role.",
      location: "Remote",
    },
    fa: {
      role: "سمت شما",
      headlineAchievement: "جملهٔ خلاصهٔ دستاورد.",
      fullDescription: "پاراگراف کامل دربارهٔ این سمت.",
      location: "دورکاری",
    },
  },
},
```

---

## ۵. مهارت‌ها (Skills)

**فایل:** `src/content/skills/skills.data.ts`

فیلدها:
- `domain` — یکی از: `frontend`, `backend`, `mobile`, `game`, `ai`, `cloud`, `devops`, `ui-ux`, `database`, `tools`
- `experienceLevel` — یکی از: `beginner`, `intermediate`, `advanced`, `expert`
- `yearsOfExperience` — عدد (اختیاری)
- `technologies` — ابزارها/کتابخانه‌های نزدیک به این مهارت
- `relatedProjectIds`, `relatedArticleIds`, `externalLinks`
- `order`
- `translations.en` / `.fa` — `name`, `description`

---

## ۶. افتخارات و گواهی‌نامه‌ها (Achievements)

**فایل:** `src/content/achievements/achievements.data.ts`

فیلدها:
- `category` — یکی از: `certificate`, `award`, `competition`, `publication`, `speaking`, `open-source`, `recognition`
- `organization` — نام سازمان صادرکننده (اختیاری)
- `date` — فرمت `"YYYY-MM-DD"`
- `relatedLink` — `{ label, url }` (اختیاری)
- `media` — گواهی/تصویر قابل‌مشاهده؛ نمونه:
  ```ts
  media: {
    id: "media-my-certificate",
    type: "pdf", // یا "image"
    src: "/certificates/my-certificate.pdf",
    title: "عنوان گواهی",
    downloadable: true,
  },
  ```
- `order`
- `translations.en` / `.fa` — `title`, `description`

فایل PDF یا تصویر گواهی را از قبل در `public/certificates/` قرار دهید، سپس مسیرش را در `media.src` بنویسید.

---

## ۷. در حال کاوش (Exploring)

**فایل:** `src/content/exploring/exploring.data.ts`

بخش کوچکی در صفحهٔ «دربارهٔ من» که نشان می‌دهد الان روی چه چیزهایی در حال یادگیری/کاوش هستید.

فیلدها: `order`, `relatedArticleId` (یا `null`)، و `translations.en` / `.fa` با `title` و `description`.

---

## ۸. توصیه‌نامه‌ها (Recommendations)

**فایل:** `src/content/recommendations/recommendations.json`

⚠️ این فایل، برخلاف پروژه‌ها/مقالات، مستقیماً خوانده می‌شود (پوشهٔ `generated` ندارد) — همین‌جا ویرایش کنید.

فیلدها:
- `name`, `company` (اختیاری), `avatar` (اختیاری), `date`
- `linkedin`, `website` — لینک‌های پروفایل
- `order`
- `published` — فقط `true` باشد تا در سایت نمایش داده شود
- `translations.en` / `.fa` — `jobTitle`, `recommendation` (متن کامل توصیه‌نامه)

نمونه:
```json
{
  "id": "rec-new-person",
  "name": "Full Name",
  "date": "2026-09-01",
  "linkedin": "https://www.linkedin.com/in/username/",
  "order": 3,
  "published": true,
  "translations": {
    "en": {
      "jobTitle": "Their Job Title",
      "recommendation": "The full recommendation text..."
    },
    "fa": {
      "jobTitle": "عنوان شغلی ایشان",
      "recommendation": "متن کامل توصیه‌نامه به فارسی..."
    }
  }
}
```

---

## ۹. رزومه و مدارک (Documents)

**فایل:** `src/content/documents/documents.data.ts`

برای اضافه‌کردن رزومهٔ جدید (مثلاً نسخهٔ فارسی رزومه):
1. فایل PDF را در `public/documents/` قرار دهید.
2. آیتم جدید اضافه کنید:
```ts
{
  id: "doc-resume-fa",
  kind: "resume", // یا "portfolio"
  language: "fa", // زبان خودِ فایل، نه زبان رابط کاربری
  version: "v1.0",
  lastUpdatedDate: "2026-09-01",
  media: {
    id: "media-resume-fa",
    type: "pdf",
    src: "/documents/usef-farahmand-resume-fa.pdf",
    title: "Resume (Persian)",
    downloadable: true,
  },
  order: 2,
  translations: {
    en: { title: "Resume (Persian)" },
    fa: { title: "رزومه (فارسی)" },
  },
},
```

---

## ۱۰. بخش تماس (Contact)

**فایل محتوای متنی:** `src/content/contact/contact.data.ts`
شامل عنوان، توضیح کوتاه، محل زندگی، زمان پاسخ‌گویی، متن‌های فرم (برچسب‌ها، پیام‌های خطا، پیام موفقیت) — هر کدام برای `en` و `fa` جداگانه.

**فایل تنظیمات فنی فرم:** `src/content/contact/contact.config.ts`
اینجا محتوای نمایشی نیست، بلکه تنظیمات فنی سرویس ارسال ایمیل (EmailJS) و قوانین اعتبارسنجی فرم است:
- برای فعال‌کردن ارسال واقعی ایمیل، باید متغیرهای محیطی زیر را در فایل `.env.local` تنظیم کنید:
  ```
  NEXT_PUBLIC_EMAILJS_SERVICE_ID=...
  NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=...
  NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=...
  ```
- `validation` — حداقل/حداکثر طول فیلدهای فرم (نام، ایمیل، موضوع، پیام) را اینجا تغییر می‌دهید.
- تغییر `email` اصلی در `contact.data.ts` (فیلد `email`) انجام می‌شود.

---

## ۱۱. برچسب‌های ثابت رابط کاربری (منو، دکمه‌ها و ...)

**فایل‌ها:** `src/messages/en.json` و `src/messages/fa.json`

این دو فایل متن‌های ثابت و کوتاه رابط کاربری را نگه می‌دارند که «محتوا» نیستند بلکه بخشی از قالب سایت‌اند: نام آیتم‌های منو (خانه، دربارهٔ من، پروژه‌ها، ...)، برچسب دکمه‌ها، پیام‌های کمکی و غیره. اگر می‌خواهید متن یکی از این موارد را عوض کنید (مثلاً عنوان منو یا متن دکمهٔ «مشاهدهٔ همهٔ پروژه‌ها»)، مقدار متناظر را در هر دو فایل عوض کنید تا هماهنگی بین دو زبان حفظ شود.

---

## ۱۲. لوگو و تصویر پروفایل

**فایل تنظیمات:** `src/config/brand.ts`

- `brand.mark.src` — مسیر لوگوی سایت (پیش‌فرض: `/brand/logo-mark.png`)
- `brand.profile.src` — تصویر پروفایل نمایش داده‌شده در صفحهٔ «دربارهٔ من» (در حال حاضر به‌صورت موقت همان لوگو است — توصیه می‌شود آن را با یک عکس واقعی جایگزین کنید)
- `brand.openGraphImage` — تصویری که در پیش‌نمایش لینک سایت در شبکه‌های اجتماعی نشان داده می‌شود

برای تغییر هرکدام، فایل تصویر جدید را در `public/brand/` قرار دهید و مسیر (`src`) و در صورت نیاز `width`/`height` را در همین فایل به‌روزرسانی کنید.

---

## ۱۳. اطلاعات دامنه و سئوی کلی سایت

**فایل:** `src/config/site.ts`
- `siteDomains.primary` / `siteDomains.secondary` — دامنه‌های اصلی سایت
- `siteMetadataDefaults.titleTemplate` — الگوی عنوان صفحات (پیش‌فرض: `"%s — Usef Farahmand"`)

---

## ۱۴. چک‌لیست بعد از هر ویرایش

1. مقدار مربوطه را هم در `en` و هم در `fa` وارد کردم؟
2. `id`های استفاده‌شده منحصربه‌فرد هستند؟
3. همهٔ کاماها، آکولادها و کروشه‌ها درست بسته شده‌اند؟
4. اگر تصویر/فایل جدید اضافه کردم، آن را در پوشهٔ `public/` مسیر درست قرار دادم؟
5. سایت را به‌صورت محلی اجرا کردم تا مطمئن شوم خطا نمی‌دهد:
   ```bash
   npm run dev
   ```
   سپس در مرورگر به آدرس `http://localhost:3000` رفتم و بخش تغییر‌یافته را چک کردم (هم در حالت انگلیسی هم فارسی).
6. `npm run lint` را اجرا کردم تا اگر خطای نحوی یا تایپی هست، زودتر مشخص شود.

---

## خلاصهٔ جدول مسیر فایل‌ها

| بخش سایت | فایل محتوا |
|---|---|
| صفحهٔ اصلی / دربارهٔ من / شبکه‌های اجتماعی | `src/content/site/site.data.ts` |
| پروژه‌ها | `src/content/generated/projects.json` *(یا `projects.data.ts` برای مرجع)* |
| مقالات | `src/content/generated/articles.json` *(یا `articles.data.ts` برای مرجع)* |
| سوابق کاری | `src/content/experience/experience.data.ts` |
| مهارت‌ها | `src/content/skills/skills.data.ts` |
| افتخارات و گواهی‌نامه‌ها | `src/content/achievements/achievements.data.ts` |
| در حال کاوش | `src/content/exploring/exploring.data.ts` |
| توصیه‌نامه‌ها | `src/content/recommendations/recommendations.json` |
| رزومه و مدارک | `src/content/documents/documents.data.ts` |
| متن‌های صفحهٔ تماس | `src/content/contact/contact.data.ts` |
| تنظیمات فنی فرم تماس | `src/content/contact/contact.config.ts` |
| متن‌های ثابت منو/دکمه‌ها | `src/messages/en.json`, `src/messages/fa.json` |
| لوگو و تصویر پروفایل | `src/config/brand.ts` |
| دامنه و عنوان سایت | `src/config/site.ts` |

اگر بخشی وجود دارد که نمی‌دانید فایلش کجاست، معمولاً می‌توانید نام بخش را (به انگلیسی) در پوشهٔ `src/content` یا `src/config` جست‌وجو کنید — ساختار پروژه کاملاً بر این الگو استوار است.
