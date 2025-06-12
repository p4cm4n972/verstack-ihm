# AGENT INSTRUCTIONS

This project uses Angular and TypeScript.

## Setup
- Ensure Angular CLI is installed globally. If `ng` is missing, run `npm install -g @angular/cli` before testing.

## Style Guide
- Use **2 spaces** for indentation in TypeScript, JavaScript and HTML files.
- Prefer **single quotes** for string literals in `.ts`, `.js` and `.html` files.
- Keep lines under 120 characters when possible.

## Testing
- After making changes in the repository, run `npm test` to execute unit tests.
- Some environments may lack Angular CLI dependencies; if tests fail because of missing packages, note this in the PR.

## Pull Request
- Summarize changes referencing affected files with GitHub style line numbers (e.g. `path/to/file.ts:12-18`).
- Include a short Testing section reporting the result of `npm test`.
