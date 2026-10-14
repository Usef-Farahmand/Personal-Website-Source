# EmailJS — راهنمای راه‌اندازی

فرم تماس برای هر پیام **دو ایمیل** می‌فرستد، هر دو با **یک قالب** EmailJS:

1. پیام بازدیدکننده به ایمیل شما (`contact@useffarahmand.com`، از فیلد `email` در `src/content/contact/contact.data.ts`).
2. ایمیل تأیید به کسی که فرم را پر کرده — **اگر پیام را فارسی نوشته باشد فارسی (راست‌به‌چپ)، وگرنه انگلیسی**.

کل HTML هر دو ایمیل در کد ساخته می‌شود (`src/services/contact/email-html.ts`) و قالب EmailJS فقط یک پوستهٔ خالی است. برای تغییر ظاهر یا متن ایمیل‌ها لازم نیست به داشبورد بروید:

- ظاهر و ایمیل پیام به خودتان: `src/services/contact/email-html.ts`
- متن ایمیل تأیید (هر زبان): `confirmationEmail` در `src/content/contact/contact.data.ts`

## مراحل

1. در [dashboard.emailjs.com](https://dashboard.emailjs.com) → **Email Services** یک سرویس (Gmail یا SMTP دامنهٔ خودتان) وصل کنید و **Service ID** را بردارید.
2. **Email Templates → Create New Template**. در تب **Content**، حالت **Code** (`<>`) را بزنید و کل محتوا را با فقط این یک خط جایگزین کنید (سه آکولاد، نه دو):

   ```
   {{{html}}}
   ```

3. فیلدهای قالب را این‌طور پر کنید:

   | فیلد      | مقدار               |
   | --------- | ------------------- |
   | Subject   | `{{email_subject}}` |
   | To Email  | `{{to_email}}`      |
   | From Name | `{{from_name}}`     |
   | Reply To  | `{{reply_to}}`      |

   **Template ID** را بردارید.

4. **Account → General** → **Public Key** را بردارید.
5. **Account → Security** → دامنه‌های `useffarahmand.com` و `useffarahmand.ir` (و `localhost` برای تست) را به فهرست مجاز اضافه کنید. چون گیرنده و محتوای ایمیل از سمت مرورگر تعیین می‌شود، این فهرست تنها چیزی است که جلوی استفادهٔ سایت‌های دیگر از کلید شما را می‌گیرد — حتماً تنظیمش کنید.
6. این متغیرها را در `.env.local` و در Vercel (**Settings → Environment Variables**) بگذارید و دوباره deploy کنید — مقادیر `NEXT_PUBLIC_` هنگام build در کد قرار می‌گیرند:

   ```
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxx
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=xxxxxxxx
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xxx
   ```

> اگر ایمیلی نرسید، Console مرورگر را ببینید: پیام `EmailJS notification send failed` (یا `confirmation`) همراه با متن خطای EmailJS دلیل دقیق را می‌گوید — مثلاً `The Public Key is invalid` یا `The recipients address is empty` (یعنی To Email روی `{{to_email}}` نیست).

## متغیرهایی که هر ارسال می‌فرستد

| متغیر           | پیام به شما               | ایمیل تأیید                             |
| --------------- | ------------------------- | --------------------------------------- |
| `to_email`      | ایمیل شما                 | ایمیل فرستنده                           |
| `reply_to`      | ایمیل فرستنده             | ایمیل شما                               |
| `from_name`     | نام فرستنده               | امضا (`Usef Farahmand` / `یوسف فرحمند`) |
| `email_subject` | `New message: … — from …` | موضوع ایمیل تأیید به زبان پیام          |
| `html`          | کل ایمیل به‌صورت HTML     | کل ایمیل به‌صورت HTML                   |
