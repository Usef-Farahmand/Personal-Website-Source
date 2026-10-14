# Security Policy

This repository is the source of [useffarahmand.com](https://www.useffarahmand.com). Only the current `main` branch, which is what the live site runs, is supported.

## Reporting a vulnerability

Please **don't open a public issue** for a security problem. Use one of these instead:

- GitHub's [private vulnerability report](https://github.com/Usef-Farahmand/Personal-Website-Source/security/advisories/new) for this repository, or
- email **contact@useffarahmand.com** with the subject `Security`.

Include what you found, where (URL or file), and the steps to reproduce it. I'll reply within a few days and let you know when it's fixed. Please give me a reasonable time to fix it before you talk about it publicly.

## In scope

- The live site on `useffarahmand.com` and `useffarahmand.ir`
- The contact form endpoint (`/api/contact`), for example sending email to arbitrary recipients or getting around its validation or rate limit
- Secrets or personal data exposed in this repository or in the site's client bundle

## Out of scope

- Reports from automated scanners with no demonstrated impact
- Missing best-practice headers with no concrete exploit
- Denial of service through traffic volume
- Problems in third-party services (Vercel, EmailJS, GitHub) themselves. Report those to the service.
