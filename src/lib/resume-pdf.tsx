import path from "node:path";
import {
  Document,
  Font,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";
import { getResume, type ResumeData } from "@/services/content/resume.service";
import type { Locale } from "@/types/content";

/**
 * The downloadable resume PDFs (app/documents/*.pdf), rendered at build
 * time from the same ResumeData as the /resume page. A plain single-column
 * layout with real, selectable text — what applicant tracking systems
 * parse best — in the site's own fonts (Geist, Vazirmatn for Persian).
 *
 * The Persian PDF only flips alignment and row direction; react-pdf's
 * bidi handling takes care of the mixed Persian/English runs.
 */

const FONT_DIR = path.join(process.cwd(), "node_modules/@fontsource");

Font.register({
  family: "Geist",
  fonts: [
    { src: path.join(FONT_DIR, "geist/files/geist-latin-400-normal.woff") },
    {
      src: path.join(FONT_DIR, "geist/files/geist-latin-700-normal.woff"),
      fontWeight: 700,
    },
  ],
});
// Geist's latin-ext subset ships as a separate file (İ, ş, ğ ...), so it
// is registered as its own family and used as a fallback after Geist.
Font.register({
  family: "GeistExt",
  fonts: [
    { src: path.join(FONT_DIR, "geist/files/geist-latin-ext-400-normal.woff") },
    {
      src: path.join(FONT_DIR, "geist/files/geist-latin-ext-700-normal.woff"),
      fontWeight: 700,
    },
  ],
});
Font.register({
  family: "Vazirmatn",
  fonts: [
    {
      src: path.join(
        FONT_DIR,
        "vazirmatn/files/vazirmatn-arabic-400-normal.woff"
      ),
    },
    {
      src: path.join(
        FONT_DIR,
        "vazirmatn/files/vazirmatn-arabic-700-normal.woff"
      ),
      fontWeight: 700,
    },
  ],
});
// Long URLs and technology lists should wrap at spaces, never mid-word.
Font.registerHyphenationCallback((word) => [word]);

const COLOR = {
  text: "#111827",
  muted: "#4b5563",
  accent: "#c2410c",
  rule: "#e5e7eb",
};

function createStyles(rtl: boolean) {
  const align = rtl ? "right" : "left";
  const row = rtl ? "row-reverse" : "row";
  return StyleSheet.create({
    page: {
      paddingVertical: 28,
      paddingHorizontal: 42,
      fontFamily: rtl
        ? ["Vazirmatn", "Geist", "GeistExt"]
        : ["Geist", "GeistExt", "Vazirmatn"],
      // Ligatures (fi, fl) break the PDF's text layer: copied or
      // ATS-parsed text would read "workfow". Persian shaping is unaffected.
      fontFeatureSettings: { liga: false },
      fontSize: 9.5,
      lineHeight: rtl ? 1.55 : 1.35,
      color: COLOR.text,
      textAlign: align,
    },
    // `direction` is not inherited from the page in react-pdf, so every
    // Text carries this style; without it, Persian lines that contain
    // English words come out in the wrong order.
    text: { direction: rtl ? "rtl" : "ltr" },
    name: { fontSize: 22, fontWeight: 700, lineHeight: 1.2 },
    headline: { fontSize: 11, color: COLOR.accent, marginTop: 2 },
    contact: {
      flexDirection: row,
      flexWrap: "wrap",
      marginTop: 6,
      color: COLOR.muted,
    },
    contactItem: rtl ? { marginLeft: 10 } : { marginRight: 10 },
    link: { color: COLOR.muted, textDecoration: "none" },
    section: { marginTop: 10 },
    sectionTitle: {
      fontSize: 10.5,
      fontWeight: 700,
      color: COLOR.accent,
      textTransform: rtl ? "none" : "uppercase",
      letterSpacing: rtl ? 0 : 0.8,
      paddingBottom: 3,
      marginBottom: 6,
      borderBottomWidth: 1,
      borderBottomColor: COLOR.rule,
    },
    row: { flexDirection: row, justifyContent: "space-between" },
    strong: { fontWeight: 700 },
    muted: { color: COLOR.muted },
    entry: { marginBottom: 6 },
    role: { marginTop: 3 },
    bullet: { flexDirection: row, marginTop: 1.5 },
    bulletMark: { width: 10, textAlign: align },
    bulletText: { flex: 1 },
  });
}

type Styles = ReturnType<typeof createStyles>;

function Section({
  title,
  styles,
  children,
}: {
  title: string;
  styles: Styles;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={[styles.text, styles.sectionTitle]} minPresenceAhead={40}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function Bullets({ items, styles }: { items: string[]; styles: Styles }) {
  return items.map((item) => (
    <View key={item} style={styles.bullet} wrap={false}>
      <Text style={[styles.text, styles.bulletMark]}>•</Text>
      <Text style={[styles.text, styles.bulletText]}>{item}</Text>
    </View>
  ));
}

function ResumeDocument({ resume }: { resume: ResumeData }) {
  const rtl = resume.locale === "fa";
  const styles = createStyles(rtl);
  const { labels } = resume;

  return (
    <Document
      title={`${resume.name} — ${labels.eyebrow}`}
      author={resume.name}
      subject={resume.headline}
      language={resume.locale}
    >
      <Page size="A4" style={styles.page}>
        <Text style={[styles.text, styles.name]}>{resume.name}</Text>
        <Text style={[styles.text, styles.headline]}>{resume.headline}</Text>
        <View style={styles.contact}>
          <Text style={[styles.text, styles.contactItem]}>
            {resume.location}
          </Text>
          {resume.links.map((link) => (
            <Link
              key={link.url}
              src={link.url}
              style={[styles.link, styles.contactItem]}
            >
              {link.display}
            </Link>
          ))}
        </View>

        <Section title={labels.sections.summary} styles={styles}>
          <Text style={styles.text}>{resume.summary}</Text>
        </Section>

        <Section title={labels.sections.experience} styles={styles}>
          {resume.experience.map((group) => (
            <View
              key={`${group.company}-${group.roles[0].dateRange}`}
              style={styles.entry}
            >
              <View style={styles.row} minPresenceAhead={30}>
                <Text style={[styles.text, styles.strong]}>
                  {group.company}
                </Text>
                <Text style={[styles.text, styles.muted]}>
                  {group.location}
                </Text>
              </View>
              {group.roles.map((role) => (
                <View key={role.role} style={styles.role}>
                  <View style={styles.row}>
                    <Text style={[styles.text, styles.strong]}>
                      {role.role}
                    </Text>
                    <Text style={[styles.text, styles.muted]}>
                      {role.dateRange}
                    </Text>
                  </View>
                  <Bullets items={role.bullets} styles={styles} />
                </View>
              ))}
            </View>
          ))}
        </Section>

        <Section title={labels.sections.projects} styles={styles}>
          {resume.projects.map((project) => (
            <View key={project.url} style={styles.entry} wrap={false}>
              <Link
                src={project.url}
                style={[
                  styles.strong,
                  { color: COLOR.text, textDecoration: "none" },
                ]}
              >
                {project.title}
              </Link>
              <Text style={styles.text}>{project.summary}</Text>
              <Text style={[styles.text, styles.muted]}>
                {project.technologies.join(" · ")}
              </Text>
            </View>
          ))}
        </Section>

        <Section title={labels.sections.skills} styles={styles}>
          {resume.skills.map((group) => (
            <Text key={group.label} style={[styles.text, { marginBottom: 2 }]}>
              <Text style={[styles.text, styles.strong]}>{group.label}: </Text>
              {group.items.join(rtl ? "، " : ", ")}
            </Text>
          ))}
        </Section>

        <Section title={labels.sections.education} styles={styles}>
          {resume.education.map((entry) => (
            <View key={entry.institution} style={styles.entry} wrap={false}>
              <View style={styles.row}>
                <Text style={[styles.text, styles.strong]}>{entry.degree}</Text>
                <Text style={[styles.text, styles.muted]}>
                  {entry.dateRange}
                </Text>
              </View>
              <Text style={styles.text}>{entry.institution}</Text>
              {entry.note && (
                <Text style={[styles.text, styles.muted]}>{entry.note}</Text>
              )}
            </View>
          ))}
        </Section>

        <Section title={labels.sections.achievements} styles={styles}>
          <Bullets
            items={resume.achievements.map((entry) => entry.title)}
            styles={styles}
          />
        </Section>

        <Section title={labels.sections.languages} styles={styles}>
          <Text style={styles.text}>
            {resume.languages
              .map((language) => `${language.name} (${language.level})`)
              .join(rtl ? "، " : " · ")}
          </Text>
        </Section>
      </Page>
    </Document>
  );
}

export function renderResumePdf(locale: Locale): Promise<Buffer> {
  return renderToBuffer(<ResumeDocument resume={getResume(locale)} />);
}
