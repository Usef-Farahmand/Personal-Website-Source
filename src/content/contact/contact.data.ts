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
        confirmationNote:
          "A confirmation has been sent to your inbox (check spam if you don't see it).",
      },
      errors: {
        invalidName: "Please enter your name.",
        invalidEmail:
          "Please enter a valid email address — this one can't receive mail.",
        invalidSubject: "Subject is too long.",
        invalidMessage: "Message should be at least 10 characters.",
        sendFailed:
          "Something went wrong. Please try again, or email me directly.",
        notConfigured:
          "The contact form isn't available right now — please email me directly.",
      },
      confirmationEmail: {
        subject: "I got your message",
        greeting: "Hi {name},",
        intro:
          "Thanks for getting in touch! Your message reached me, and I usually reply within 2 business days.",
        summaryHeading: "Here's a copy of what you sent:",
        subjectLabel: "Subject",
        messageLabel: "Message",
        noSubject: "(no subject)",
        closing: "Talk soon,",
        signature: "Usef Farahmand",
        footer:
          "You're receiving this because this address was entered in the contact form on useffarahmand.com. If it wasn't you, you can ignore this email.",
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
        confirmationNote:
          "یک ایمیل تأیید برایتان فرستاده شد (اگر نرسید، پوشهٔ اسپم را هم ببینید).",
      },
      errors: {
        invalidName: "لطفاً نام خود را وارد کنید.",
        invalidEmail:
          "لطفاً یک ایمیل معتبر وارد کنید — این آدرس قابلیت دریافت ایمیل ندارد.",
        invalidSubject: "موضوع خیلی طولانی است.",
        invalidMessage: "پیام باید حداقل ۱۰ نویسه باشد.",
        sendFailed:
          "مشکلی پیش آمد. لطفاً دوباره تلاش کنید یا مستقیماً ایمیل بزنید.",
        notConfigured:
          "فرم تماس در حال حاضر در دسترس نیست — لطفاً مستقیماً ایمیل بزنید.",
      },
      confirmationEmail: {
        subject: "پیامتان به دستم رسید",
        greeting: "سلام {name}،",
        intro:
          "ممنون که پیام دادید! پیامتان به دستم رسید و معمولاً ظرف ۲ روز کاری پاسخ می‌دهم.",
        summaryHeading: "رونوشت پیامی که فرستادید:",
        subjectLabel: "موضوع",
        messageLabel: "پیام",
        noSubject: "(بدون موضوع)",
        closing: "به امید گفت‌وگو،",
        signature: "یوسف فرحمند",
        footer:
          "این ایمیل به این دلیل برایتان ارسال شده که این آدرس در فرم تماس useffarahmand.com وارد شده است. اگر شما نبوده‌اید، این ایمیل را نادیده بگیرید.",
      },
    },
  },
};
