# EmailJS — راهنمای راه‌اندازی

فرم تماس برای هر پیام **دو ایمیل** می‌فرستد، هر دو با **یک قالب** EmailJS:

1. پیام بازدیدکننده به ایمیل شما (`contact@useffarahmand.com`، از فیلد `email` در `src/content/contact/contact.data.ts`).
2. ایمیل تأیید به کسی که فرم را پر کرده — **اگر پیام را فارسی نوشته باشد فارسی (راست‌به‌چپ)، وگرنه انگلیسی**.

## ارسال از سمت سرور

مرورگر فقط پیام را به `/api/contact` (روی خود سایت) می‌فرستد. سرور دوباره همه‌چیز را بررسی می‌کند — شکل ایمیل، وجود دامنه در DNS، محدودیت تعداد ارسال از هر IP — و بعد از طریق REST API به EmailJS وصل می‌شود. در نتیجه:

- هیچ کلید یا شناسهٔ EmailJS در کد مرورگر نیست و همه در Vercel به‌صورت **Sensitive** ثبت می‌شوند.
- گیرنده‌ها روی سرور تعیین می‌شوند: پیام فقط به ایمیل شما، و تأیید فقط به ایمیلِ واردشده در فرم. کسی نمی‌تواند از حساب شما ایمیل دلخواه به آدرس دلخواه بفرستد.

کل HTML هر دو ایمیل در کد ساخته می‌شود و قالب EmailJS فقط یک پوستهٔ خالی است:

- ظاهر ایمیل‌ها و متن ایمیلی که به خودتان می‌رسد: `src/services/contact/email-html.ts`
- متن ایمیل تأیید (هر زبان): `confirmationEmail` در `src/content/contact/contact.data.ts`

## مراحل

1. در [dashboard.emailjs.com](https://dashboard.emailjs.com) → **Email Services** یک سرویس (Gmail یا SMTP دامنهٔ خودتان) وصل کنید و **Service ID** را بردارید.
2. **Email Templates → Create New Template**. در تب **Content**، حالت **Code** (`<>`) را بزنید و کل محتوا را با فقط این یک خط جایگزین کنید (سه آکولاد، نه دو):

   ```
   {{{html}}}
   ```

3. فیلدهای قالب را این‌طور پر کنید و **Template ID** را بردارید:

   | فیلد      | مقدار               |
   | --------- | ------------------- |
   | Subject   | `{{email_subject}}` |
   | To Email  | `{{to_email}}`      |
   | From Name | `{{from_name}}`     |
   | Reply To  | `{{reply_to}}`      |

4. **Account → API Keys**: هم **Public Key** و هم **Private Key** را بردارید.
5. **Account → Security**:
   - گزینهٔ **Allow EmailJS API for non-browser applications** را روشن کنید — بدون آن EmailJS درخواست‌های سرور را رد می‌کند.
   - گزینهٔ **Use Private Key** را هم روشن کنید تا هیچ درخواستی بدون Private Key پذیرفته نشود.
6. در Vercel → **Settings → Environment Variables** این چهار متغیر را **بدون** پیشوند `NEXT_PUBLIC_` و به‌صورت **Sensitive** ثبت کنید (برای Production، و اگر روی Preview تست می‌کنید برای Preview هم):

   ```
   EMAILJS_SERVICE_ID=service_xxx
   EMAILJS_TEMPLATE_ID=template_xxx
   EMAILJS_PUBLIC_KEY=xxxxxxxx
   EMAILJS_PRIVATE_KEY=xxxxxxxx
   ```

7. **Deployments → Redeploy**.

برای اجرا روی کامپیوتر خودتان (`npm run dev`)، همین چهار خط را در فایل `.env.local` کنار `package.json` بگذارید. این فایل در `.gitignore` است و commit نمی‌شود.

## عیب‌یابی

اگر ایمیلی نرسید، در Vercel → **Logs** دنبال `Contact:` بگردید. متن خطای EmailJS دلیل دقیق را می‌گوید، مثلاً:

- `EmailJS is not configured` ← یکی از چهار متغیر ثبت نشده یا بعد از ثبت Redeploy نشده.
- `API calls are disabled for non-browser applications` ← مرحلهٔ ۵ انجام نشده.
- `The Private Key is invalid` ← مقدار `EMAILJS_PRIVATE_KEY` اشتباه است.
- `The recipients address is empty` ← To Email قالب روی `{{to_email}}` نیست.

## متغیرهایی که هر ارسال به قالب می‌دهد

| متغیر           | پیام به شما               | ایمیل تأیید                             |
| --------------- | ------------------------- | --------------------------------------- |
| `to_email`      | ایمیل شما                 | ایمیل فرستنده                           |
| `reply_to`      | ایمیل فرستنده             | ایمیل شما                               |
| `from_name`     | نام فرستنده               | امضا (`Usef Farahmand` / `یوسف فرحمند`) |
| `email_subject` | `New message: … — from …` | موضوع ایمیل تأیید به زبان پیام          |
| `html`          | کل ایمیل به‌صورت HTML     | کل ایمیل به‌صورت HTML                   |
