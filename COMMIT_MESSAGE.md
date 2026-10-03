refactor(learning): move learning notes to an editable learning.json

Learning entries now live in `content/learning/learning.json` instead of
a typed .ts file, so adding or editing a note is a plain JSON change
(same data-driven approach as recommendations.json).

- `learning.json`: the FastLeaderboardUnity entry, converted 1:1.
- `learning.schema.json` + `.vscode/settings.json`: JSON Schema for
  validation and autocomplete while editing (entries, translations,
  content blocks, links, snippets).
- `content/learning/index.ts` loads the JSON and casts it to
  `LearningEntry[]`; removed `learning.data.ts`.
- Docs: Persian content guide and README point at the new file.
