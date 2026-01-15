# Planting Optimisation Tool – Frontend

This folder contains the frontend for the Planting Optimisation Tool.  
It is a multi-page Vite + TypeScript application that provides:

- A marketing-style home page
- A **Species Finder** (species recommendations for farms)
- A **Sapling Calculator**
- An **Insights** section for content and articles

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
- `insights.html` – Insights page

Main TypeScript entry points:

- `src/home.ts` – home page logic (navigation, sticky header, reviews carousel)
- `src/recommendations.ts` – Species Finder logic
  - Renders the farm selection UI
  - Calls the backend API for species recommendations
  - Falls back to mock data if the backend is not available
- `src/calculator.ts` – Sapling Calculator
- `src/insights.ts` – Insights listing and search

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
- `/insights.html` – Insights

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
  - `GET /recommendations/{farm_id}` to fetch species recommendations

If the backend is not running or the request fails, the UI automatically falls back to mock data so the page still works.

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
