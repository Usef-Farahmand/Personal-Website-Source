import type { ContactContent } from "@/types/contact";

export const contactContent: ContactContent = {
  id: "contact",
  email: "contact@useffarahmand.com",
  translations: {
    en: {
      title: "Contact",
      subtitle:
        "Have a project, a role, or just an interesting problem? I'd like to hear about it.",
      location: "Based in Tehran, Iran — working with teams anywhere.",
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
  },
};
