# Planting Optimisation Tool – Frontend

This folder contains the frontend for the Planting Optimisation Tool.  
It is a multi-page Vite + TypeScript application that provides:

- A marketing-style home page
- A **Recommendation page**
- A **Sapling Calculator**
- An **Species** section for species information

---

## Tech Stack

- **Build tool:** Vite 7 (multi-page setup)
- **Language:** TypeScript (no framework, vanilla TS)
- **Styling:** CSS (global styles in `src/style.css` and page‑specific CSS)
- **Testing / tooling:**
  - Vitest
  - ESLint, Stylelint
  - Prettier

---

## App Structure (high level)

Key files:

- `index.html` – Home page (hero, features, testimonials)
- `recommendations.html` – Species Finder page
- `calculator.html` – Sapling Calculator page
- `species.html` – Species page

Main TypeScript entry points:

- `src/home.ts` – home page logic (navigation)
- `src/recommendations.ts` – Species Finder logic
  - Renders the farm selection UI
  - Fetches the authenticated user’s farms from the backend
  - Calls the backend API for species recommendations
- `src/calculator.ts` – Sapling Calculator
- `src/species.ts` – Species listing and search

Vite is configured in `vite.config.ts` to treat these HTML files as separate entry points.

---

## How to Run the Frontend

From the project root:

```bash
cd Planting-Optimisation-Tool-master/frontend
npm install
npm run dev
```

Then open:

- **http://localhost:5173/**

Navigation links in the header route you between:

- `/index.html` – Home
- `/recommendations.html` – Species Finder
- `/calculator.html` – Sapling Calculator
- `/species.html` – Species

Vite prints the exact dev URL in the terminal (by default `http://localhost:5173/`).

---

## Backend Integration (Species Finder)

The Species Finder page (`recommendations.html` / `src/recommendations.ts`) can talk to the backend API for real recommendations.

- The frontend is currently configured to use:

  ```ts
  const API_BASE_URL = "http://127.0.0.1:8081";
  ```

- It calls:
  - `POST /auth/token` to obtain an access token
  - `GET /farms` to fetch all farms for the authenticated user
  - `GET /farms/{farm_id}` to fetch farm details when a farm is selected
  - `GET /recommendations/{farm_id}` to fetch species recommendations

If the backend is not running or the request fails, the UI falls back to a small hard-coded list of species so the page still shows example output.

You can run the backend (from the `backend` folder) with:

```bash
python -m fastapi dev src/main.py --port 8081 --host 127.0.0.1
```

The frontend does **not** require the backend to run, but real recommendations on the Species Finder page are only available when the backend is up.

---

## Useful NPM Scripts

From the `frontend` directory:

- `npm run dev` – start the Vite dev server
- `npm run build` – build the production bundle into `build/dist`
- `npm run test` / `npm run test:coverage` – run unit tests with Vitest
- `npm run lint:scripts` – lint TypeScript files with ESLint
- `npm run lint:styles` – lint CSS/SCSS with Stylelint
- `npm run format` – format scripts and styles with Prettier + Stylelint

---

## Recent UI Changes

- Species Finder is now user-centric:
  - Farm dropdown loads farms from the backend for the logged-in user.
  - Farm details in the form are populated from the selected backend farm.
- The “Download Report” button on the Species Finder page no longer uses mock data; it is present but not yet wired to a backend export.
- The top navigation bar on all pages now includes a “Species” link placeholder for future species-related views.

### Additional recent changes

- Species Finder form layout:
  - The farm profile form on `recommendations.html` has been restructured and centered for a clearer, more balanced layout.
  - Related layout styles live in `src/style.css` under the farm form and grid row sections.
- Footer branding:
  - All pages (home, recommendations, calculator, species) now use **“Species Finder”** as the footer product title.
- Dark mode toggle:
  - A global **Dark mode** toggle button has been added to the header on all pages.
  - Theme state is stored in `localStorage` and applied on load so the user’s choice persists across pages and refreshes.
  - Theme variables (light/dark) are defined in `src/style.css`, and the toggle logic is implemented in:
    - `src/home.ts`
    - `src/recommendations.ts`
    - `src/calculator.ts`
    - `src/species.ts`
- Logo integration:
  - New SVG logo asset added at `public/assets/images/logo-main.svg`.
  - Header and footer use this logo inside a circular `.logo-circle` container sized to 44×44px.
  - `.logo-circle` styling in `src/style.css` ensures the logo fills the circle with no residual whitespace (using `overflow: hidden` and `object-fit: cover`).
- Home page feature cards:
  - The three “Explore Now” feature cards on `index.html` now use `logo-main.svg` as their hover background image.
  - The image is wired via the `hoverBgImage` `<img>` elements inside each `.featureCard`.
- Header logo navigation:
  - The logo in the header on all pages is now wrapped in an anchor linking to `/index.html`.
  - Clicking the logo from any page returns the user to the home page.
- Linting and CI alignment:
  - `eslint.config.ts` was updated to keep Prettier enforcement while disabling the strict `@typescript-eslint/no-explicit-any` rule to accommodate existing Contentful-related code.
  - `.stylelintrc` was updated to relax some stylistic rules (such as strict selector naming and property ordering) while keeping core Stylelint + Prettier integration.
  - Frontend commands used by `.github/workflows/frontend-ci.yml` now pass locally:
    - `npm run lint:scripts`
    - `npm run lint:styles`
    - `npm run format:scripts -- --check`
    - `npm run format:styles`

---

## Contentful Management for Species Information Page (CMS)

- Contentful (Headless CMS)
- Manages dynamic species data including images, rich text descriptions, and keywords.
- _Note: Species data can be managed via the [Contentful Dashboard](https://app.contentful.com). You can optionally bulk-seed data `species.csv` using `npx ts-node seedContentful.ts`._

## Local Configuration

To run the frontend locally, you must create a `.env` file in the root directory with the following Contentful keys:

```ini
VITE_SPACE_ID=your_space_id_here
VITE_ACCESS_TOKEN=your_access_token_here
```
