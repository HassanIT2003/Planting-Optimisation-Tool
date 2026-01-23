# Planting Optimisation Tool – Frontend

This folder contains the frontend for the Planting Optimisation Tool.  
It is a multi-page Vite + TypeScript application that provides:

- A user-friendly home page
- A **Agroforestory species recommendation**
- A **Sapling Estimation**
- A **Environmental profile generation**
- An **Species** section for species information

---

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **[Node.js](https://nodejs.org/)** (version 18 or higher recommended) - This includes **npm** (Node Package Manager).
- **[Git](https://git-scm.com/)** - For version control and cloning the repository.

---

## Installation & Setup

### 1. Clone the Repository

You can clone the repository directly or fork it first if you plan to contribute.

**Option A: Clone directly**
```bash
git clone https://github.com/your-username/Planting-Optimisation-Tool.git
```

**Option B: Fork and Clone**
1. Click the **Fork** button at the top right of the repository page.
2. Clone your forked repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Planting-Optimisation-Tool.git
   ```

### 2. Navigate to the Frontend Directory

```bash
cd Planting-Optimisation-Tool/frontend
```

### 3. Install Dependencies

Install all required Node.js packages listed in `package.json`:

```bash
npm install
```

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
- `recommendations.html` – Agroforestry species recommendation
- `profile.html` – Environmental profile generation
- `calculator.html` – Sapling estimation page
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

## Troubleshooting

### Port in Use / Blocked

If you encounter an error indicating that the port `5173` is already in use or blocked by a firewall/security policy, you can specify a different port or check your network settings.

**1. Specify a Custom Port**

You can run the dev server on a different port (e.g., `3000`) by passing the `--port` flag:

```bash
npm run dev -- --port 3000
```

Alternatively, you can modify the `package.json` file:

```json
"scripts": {
  "dev": "vite --port 3000",
  ...
}
```

**2. Firewall & Security Settings**

- **Windows Firewall**: Ensure that `node.exe` is allowed to communicate through the firewall on Private (and Public, if needed) networks.
- **Corporate/University Networks**: Some environments block non-standard ports. Try using port `80` or `8080` if `5173` is blocked, though this may require administrator privileges.
- **Check Port Availability**:
  - **Windows**: `netstat -ano | findstr :5173`
  - **Mac/Linux**: `lsof -i :5173`

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

If the backend is not running or the request fails, the UI will display an error message.

You can run the backend (from the `backend` folder) 

The frontend does **not** require the backend to run, but real recommendations on the Species Finder page are only available when the backend returns data.

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


