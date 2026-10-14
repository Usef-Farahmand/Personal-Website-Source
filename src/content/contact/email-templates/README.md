# EmailJS templates — راهنمای راه‌اندازی

فرم تماس برای هر پیام **دو ایمیل** از طریق EmailJS می‌فرستد:

| قالب         | فایل                | گیرنده                               |
| ------------ | ------------------- | ------------------------------------ |
| Notification | `notification.html` | خودتان (`contact@useffarahmand.com`) |
| Auto-reply   | `auto-reply.html`   | کسی که فرم را پر کرده (`{{email}}`)  |

## مراحل

1. در [dashboard.emailjs.com](https://dashboard.emailjs.com) → **Email Services** یک سرویس (مثلاً Gmail یا SMTP دامنهٔ خودتان) وصل کنید و **Service ID** را بردارید.
2. **Email Templates → Create New Template** → در ویرایشگر، حالت **Code** (`<>`) را بزنید و کل محتوای `notification.html` را (بعد از کامنت بالای فایل) جایگزین کنید. در تب تنظیمات:
   - **Subject:** `New message: {{subject}} — from {{name}}`
   - **To Email:** `contact@useffarahmand.com` ← ثابت؛ متغیر نگذارید
   - **From Name:** `useffarahmand.com`
   - **Reply To:** `{{email}}`
3. یک قالب دیگر برای `auto-reply.html` بسازید:
   - **Subject:** `{{reply_subject}}`
   - **To Email:** `{{email}}`
   - **From Name:** `Usef Farahmand`
   - **Reply To:** `contact@useffarahmand.com`
4. **Account → General** → **Public Key** را بردارید. در **Account → Security** دامنه‌های `useffarahmand.com` و `useffarahmand.ir` (و `localhost` برای تست) را به فهرست مجاز اضافه کنید.
5. این متغیرها را در `.env.local` و در Vercel (**Settings → Environment Variables**) بگذارید و دوباره deploy کنید — مقادیر `NEXT_PUBLIC_` هنگام build در کد قرار می‌گیرند:

   ```
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxx
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=xxxxxxxx
   NEXT_PUBLIC_EMAILJS_NOTIFICATION_TEMPLATE_ID=template_xxx
   NEXT_PUBLIC_EMAILJS_AUTOREPLY_TEMPLATE_ID=template_yyy
   ```

> اگر خطا داشت، Console مرورگر را ببینید: پیام `EmailJS notification send failed` همراه با متن خطای EmailJS (مثلاً `The Public Key is invalid` یا `The recipients address is empty`) دلیل دقیق را می‌گوید.

## متغیرهای قالب

هر دو قالب همهٔ این متغیرها را دریافت می‌کنند (`emailjs.provider.ts`):

| متغیر                                                                                                                                                                       | مقدار                                                                            |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `name`, `email`, `subject`, `message`                                                                                                                                       | فیلدهای فرم (موضوع خالی → «بدون موضوع»)                                          |
| `locale`, `dir`, `align`                                                                                                                                                    | `en`/`fa`، `ltr`/`rtl`، `left`/`right`                                           |
| `time`                                                                                                                                                                      | زمان ارسال به وقت تهران                                                          |
| `page_url`                                                                                                                                                                  | صفحه‌ای که فرم از آن ارسال شد                                                    |
| `owner_email`                                                                                                                                                               | ایمیل سایت از `contact.data.ts`                                                  |
| `from_name`, `from_email`, `reply_to`, `title`                                                                                                                              | نام‌های جایگزین برای سازگاری با قالب پیش‌فرض EmailJS                             |
| `reply_subject`, `reply_greeting`, `reply_intro`, `reply_summary_heading`, `reply_subject_label`, `reply_message_label`, `reply_closing`, `reply_signature`, `reply_footer` | متن ایمیل تأیید به زبان بازدیدکننده، از `confirmationEmail` در `contact.data.ts` |

`{{...}}` در EmailJS به‌طور خودکار HTML-escape می‌شود، پس متن واردشده توسط کاربر نمی‌تواند HTML تزریق کند — از `{{{...}}}` استفاده نکنید.
