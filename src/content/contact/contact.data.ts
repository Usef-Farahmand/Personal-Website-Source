import type { ContactContent } from "@/types/contact";

/**
 * `location` softened from "Based in Tehran, Iran" to "Based in Iran" —
 * no source (previous site, CV, or LinkedIn) states a specific city, only
 * Iran-based signals (ICPC Asia Tehran Regional Contest, Imam Reza
 * International University, remote roles for teams abroad). Naming the
 * country is supported; naming a specific city was not.
 */
export const contactContent: ContactContent = {
  id: "contact",
  email: "contact@useffarahmand.com",
  translations: {
    en: {
      title: "Contact",
      subtitle:
        "Have a project, a role, or just an interesting problem? I'd like to hear about it.",
      location: "Based in Iran — working with teams anywhere.",
      responseTime: "I usually reply within 2 business days.",
      privacyNote:
        "Your message is used only to reply to you. It is never shared or used for anything else.",
      form: {
        nameLabel: "Name",
        namePlaceholder: "Your name",
        emailLabel: "Email",
        emailPlaceholder: "you@example.com",
        subjectLabel: "Subject",
        subjectPlaceholder: "What's this about?",
        messageLabel: "Message",
        messagePlaceholder: "What would you like to talk about?",
        submitLabel: "Send Message",
        submittingLabel: "Sending…",
        sendAnotherLabel: "Send another message",
      },
      success: {
        title: "Message sent",
        body: "Thanks for reaching out — I'll get back to you soon.",
      },
      errors: {
        invalidName: "Please enter your name.",
        invalidEmail: "Please enter a valid email address.",
        invalidSubject: "Subject is too long.",
        invalidMessage: "Message should be at least 10 characters.",
        sendFailed:
          "Something went wrong. Please try again, or email me directly.",
        notConfigured:
          "The contact form isn't available right now — please email me directly.",
      },
    },
    fa: {
      title: "تماس",
      subtitle:
        "پروژه‌ای، فرصت شغلی، یا حتی یک مسئلهٔ جالب دارید؟ دوست دارم بشنوم.",
      location: "مستقر در ایران — همکاری با تیم‌ها در هر نقطه.",
      responseTime: "معمولاً ظرف ۲ روز کاری پاسخ می‌دهم.",
      privacyNote:
        "پیام شما فقط برای پاسخ‌دادن استفاده می‌شود و هرگز به اشتراک گذاشته یا برای کار دیگری استفاده نمی‌شود.",
      form: {
        nameLabel: "نام",
        namePlaceholder: "نام شما",
        emailLabel: "ایمیل",
        emailPlaceholder: "you@example.com",
        subjectLabel: "موضوع",
        subjectPlaceholder: "دربارهٔ چیست؟",
        messageLabel: "پیام",
        messagePlaceholder: "دربارهٔ چه چیزی می‌خواهید صحبت کنید؟",
        submitLabel: "ارسال پیام",
        submittingLabel: "در حال ارسال…",
        sendAnotherLabel: "ارسال پیام دیگر",
      },
      success: {
        title: "پیام ارسال شد",
        body: "ممنون از پیامتان — به‌زودی پاسخ می‌دهم.",
      },
      errors: {
        invalidName: "لطفاً نام خود را وارد کنید.",
        invalidEmail: "لطفاً یک ایمیل معتبر وارد کنید.",
        invalidSubject: "موضوع خیلی طولانی است.",
        invalidMessage: "پیام باید حداقل ۱۰ نویسه باشد.",
        sendFailed:
          "مشکلی پیش آمد. لطفاً دوباره تلاش کنید یا مستقیماً ایمیل بزنید.",
        notConfigured:
          "فرم تماس در حال حاضر در دسترس نیست — لطفاً مستقیماً ایمیل بزنید.",
      },
    },
  },
};
