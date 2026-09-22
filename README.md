# Playwright + TypeScript: UI and API Automation Suite

A single end-to-end and API testing framework built with [Playwright Test](https://playwright.dev/) and TypeScript, covering a real retail site's public pages (UI) and a REST API (Petstore) from one codebase. Implements the Page Object Model for UI, a typed client for the API, and reports every run with an HTML report, screenshots and traces.

## 🚀 Features

- **UI + API in one framework:** Two Playwright projects (`ui`, `api`) sharing config, reporter and tooling instead of two separate test setups.
- **Page Object Model (POM):** UI locators and interactions live in `src/pages`, so tests read like sentences and a markup change only touches one file.
- **Typed API client:** `src/api/petClient.ts` wraps each Petstore endpoint (create/read/update/delete) with typed request/response shapes.
- **Self-healing waits, not sleeps:** Flaky interactions (e.g. a click firing before the page's JS attaches) retry the whole action with `expect(...).toPass()` instead of a fixed delay.
- **Reporting & artifacts:** HTML report with a screenshot on UI failure, a trace on retry, and every API call logged as a step with its request/response JSON attached.
- **No hardcoded test data:** API tests generate a random pet (via Faker) with a collision-safe unique id at runtime, and clean it up afterwards even if a test fails.

## 🛠️ Prerequisites

- [Node.js](https://nodejs.org) (built and tested on v24.21; any current LTS should work)
- npm (bundled with Node.js)

## 📁 Project Structure

```text
playwright.config.ts        # Projects (ui / api), timeouts, reporters, base URLs
src/
├── pages/                  # UI page objects
│   ├── HeaderComponent.ts    # Header, Products mega menu, search
│   ├── HomePage.ts           # Opens the site, owns the header
│   └── ProductListPage.ts    # Heading + product cards (category and search pages)
├── api/
│   ├── types.ts               # Pet / Category / Tag / ApiMessage types
│   └── petClient.ts           # create / getById / update / delete calls
└── utils/
    ├── screenshot.ts          # Saves screenshots into verification/
    ├── popups.ts               # Closes JB Hi-Fi's marketing popup automatically
    └── testData.ts             # Random pet + unique id (Faker)
tests/
├── ui/jbhifi.spec.ts        # UI tests (home page, menu navigation, search)
└── api/pet-crud.spec.ts     # API tests (create, read, update, delete)
verification/                # Screenshots produced by the UI tests
```

## 📦 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/Samiya2820/Playwright-API-UI-Automation-Testing
cd Playwright-API-UI-Automation-Testing
```

### 2. Install Dependencies
Install Node modules and the Chromium browser binary Playwright needs (this suite runs Chromium only — see "Design notes" below):
```bash
npm install
npx playwright install chromium
```

There's no `.env`/secrets step here: both targets (JB Hi-Fi and the public Petstore demo) are open, unauthenticated services, so nothing needs configuring before the first run.

## 🧪 Running Tests

| | Command | Description |
| :--- | :--- | :--- |
| 🧪 | `npm test` | Run everything — all UI and API tests, headless |
| 🖥️ | `npm run test:ui` | Run the UI project only (JB Hi-Fi), headless |
| 🔌 | `npm run test:api` | Run the API project only (Petstore) — no browser involved |
| 👀 | `npm run test:headed` | Run the UI tests with a visible browser window, for watching what happens |
| 📊 | `npm run report` | Open the HTML report from the last run |
| ✅ | `npm run typecheck` | Type-check all TypeScript without running any tests |
| 🎥 | `npm run codegen` | Open Playwright's recorder against JB Hi-Fi, for finding locators quickly |

### Running Specific Tests
```bash
# Run a single spec file
npx playwright test tests/api/pet-crud.spec.ts --project=api

# Run tests whose title matches a pattern
npx playwright test --project=ui -g "search"

# Step through a test in the Playwright Inspector
npx playwright test --project=ui --debug
```

## 📊 Test Reports

After a run finishes:
```bash
npm run report
```
This opens the HTML report for the last run. Failed UI tests attach a screenshot automatically, and a trace as well if the failure happened on a retry (`npx playwright show-trace <path>/trace.zip` to open one directly). On the API side, every request `PetClient` makes is recorded as its own step in the report, with the request and response — status, headers and body — attached as JSON, so you can see exactly what went over the wire without re-running anything.

## 🤖 Continuous Integration

No CI workflow is set up in this repository yet. `playwright.config.ts` already checks for a `CI` environment variable (`process.env.CI`) and reduces to 1 worker with 2 retries when it's set, so the config is ready to drop into a GitHub Actions (or similar) workflow whenever one is added — it just isn't included here yet.

## 📝 Design Notes

- **Chromium only, headless by default:** eBay AU and ASOS AU (the other obvious "public shopping site" choices) both return HTTP 403 to headless browsers; JB Hi-Fi doesn't, so it's the one this suite runs against, with no attempt to disguise the browser or spoof headers.
- **Ordering, not full independence:** the API tests intentionally run in sequence (`test.describe.configure({ mode: 'serial' })`) because create → read → update → delete share one pet; UI tests in a file also run one after another since JB Hi-Fi's pages are heavy enough that three in parallel start timing out each other.
- **Smart waits over sleeps:** assertions use Playwright's auto-waiting (`expect(locator).toBeVisible()`, etc.), and the couple of genuinely flaky interactions (search, menu navigation) retry the whole action via `toPass()` rather than adding a fixed delay.
- **Hooks for cleanup:** an `afterAll` hook deletes the API test's pet even if an earlier test in the file failed, so the shared public server doesn't accumulate leftovers.
- **Respecting third-party sites:** both targets are live, real services outside this repo's control — assertions avoid brittle fixed prices/counts, and the UI suite isn't meant to be run repeatedly in quick succession against JB Hi-Fi.

## Troubleshooting

| Problem | Fix |
| :--- | :--- |
| "Executable doesn't exist" | Run `npx playwright install chromium` |
| UI tests suddenly return 403 or time out | The site may be rate-limiting or blocking; wait a while, then retry with `npm run test:headed` to see what the browser shows |
| Type errors | Run `npm run typecheck` to see them |
