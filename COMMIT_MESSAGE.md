docs(agents): require posting commit message in chat, not just in the zip

Extend the delivery convention in AGENTS.md: whenever a project zip is
packaged for delivery, the Conventional Commits header and description
must now also be posted directly in the chat reply (in addition to the
existing COMMIT_MESSAGE.md file included in the zip), so Usef never has
to open the file or ask for the message separately.

No application code changed in this delivery — confirmed the new logo
(from the previous round) is still correctly in place in both Header
and Footer via the shared BrandLogo component / config/brand.ts, which
was already the single source both consume.
