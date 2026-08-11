<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Delivery convention

Whenever a zip of this project is packaged for delivery:

1. Generate a `COMMIT_MESSAGE.md` file at the project root containing the
   Conventional Commits header and description for that round of
   changes, and include it in the zip. Overwrite it each time — it
   reflects only the most recent delivered change, not a running log.
2. Also post that same Conventional Commits header and description
   directly in the chat reply, right after presenting the zip — don't
   make Usef open the file to see it. Usef runs the actual `git commit`
   himself; both copies exist so he never has to ask for the message
   separately.
