# Contributing to Matemind

Thank you for helping. Bug reports, feature ideas and focused pull requests are all welcome.

## Code of conduct

- Be friendly and respectful.
- Give feedback on the code, not on the person.
- Be patient: contributors have different levels of experience.

## Pull requests

**Keep them small.** One pull request fixes one thing. For a large feature, open an issue first so we can agree on the approach and split it into reviewable steps.

Before you open a pull request:

1. Run the checks:
   ```bash
   bun run typecheck
   bun run test
   bun run brand:check
   bun run safety:check
   ```
2. Add or update tests for the behaviour you change.
3. Update the docs when you change something a user can see.
4. Write a clear commit message: what changed and why.

**AI-assisted code is welcome.** You are responsible for it: read it, test it, and be ready to explain it in review.

## Bug reports

Please include:

- What happened, and what you expected.
- Steps to reproduce.
- Your environment: OS, Bun version, which agent (Claude Code, Codex, ...).
- Relevant logs or screenshots. Remove tokens, emails and private paths first.

## Feature requests

Open an issue with the problem you want solved, who has it, and any idea for a solution. Matemind's focus is in [docs/brand/BRAND.md](docs/brand/BRAND.md): understand the user, split the work, keep watch, give the bottom line.

## Getting started

1. Fork and clone the repository.
2. Install dependencies:
   ```bash
   bun install
   ```
3. Start the hub and the web app in development mode:
   ```bash
   bun run dev
   ```

See the [README](README.md) for build and install options.

## Questions

Open an issue. We are happy to help.
