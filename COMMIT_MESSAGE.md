feat(learning): replace sample notes with the FastLeaderboardUnity write-up

Remove the two placeholder Learning entries and add a full note on
FastLeaderboardUnity (1M-record Unity leaderboard with the Job System
and Burst), written out in en + fa from the repository's
"README-Full Report.md": project structure, load/parse, sort, search,
UI pooling and virtualization, design FAQ, limitations, profiler
results, and how to run. Linked to the repo, the full report, the
profiler report, and the demo video.

- Content model: `LearningEntry.content` is now a list of blocks
  (paragraph, heading, list, table, image; bare string = paragraph,
  backtick `code` spans). Added optional `externalLinks`.
- New `LearningContent` renderer; detail page now renders it and a
  "Links" section.
- next.config: allow raw.githubusercontent.com/Usef-Farahmand/** for
  the repo screenshots used as the cover and in-article images.
- Docs: Persian content guide updated for the new fields.
