## TypeScript Best Practices
- Use strict type checking.
- Prefer type inference when the type is obvious.
- Avoid the `any` type; use `unknown` when the type is uncertain.

## Angular Best Practices
- Always use standalone components over NgModules.
- Do not use explicit `standalone: true` (it is implied by default).
- Use signals for state management.
- Implement lazy loading for feature routes.
- Use `NgOptimizedImage` for all static images.

## Components
- Keep components small and focused on a single responsibility.
- Use `input()` and `output()` functions instead of decorators.
- Use `computed()` for derived state.
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in the `@Component` decorator.
- Prefer inline templates for small components.
- Prefer Reactive forms over Template-driven ones.
- Do not use `ngClass`; use `class` bindings instead.
- Do not use `ngStyle`; use `style` bindings instead.

## State Management
- Use signals for local component state.
- Use `computed()` for derived state.
- Keep state transformations pure and predictable.

## Templates
- Keep templates simple and avoid complex logic.
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`.
- Use the async pipe to handle observables.

## Services
- Design services around a single responsibility.
- Use the `providedIn: 'root'` option for singleton services.
- Use the `inject()` function instead of constructor injection.


This project uses Angular and TypeScript.

## Setup
- Ensure Angular CLI is installed globally. If `ng` is missing, run `npm install -g @angular/cli` before testing.
- If you see the error "Could not find the '@angular-devkit/build-angular:karma' builder", install it with `npm install --save-dev @angular-devkit/build-angular`.
- Ensure `google-chrome-stable` is installed on your system. On Ubuntu, you can install it with `sudo apt install google-chrome-stable`.
- Make sure `firefox` and `karma-firefox-launcher` are installed for running tests in Firefox. Install the launcher with `npm install --save-dev karma-firefox-launcher`.
- Ensure `karma-chrome-launcher` is installed for running tests in Chrome. Install it with `npm install --save-dev karma-chrome-launcher`.
- Ensure the Chrome browser binary is accessible on your system. If you encounter issues running tests in Chrome, verify that Chrome is installed and its path is available in your system's environment variables.

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
