# Planting Optimisation Tool – Frontend

This folder contains the frontend for the Planting Optimisation Tool.  
It is a multi-page Vite + TypeScript application that provides:

<<<<<<< HEAD
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
=======
- A **Home** page (Landing page)
- A **Environmental Profile** page
- A **Sapling Calculator** page
- A **Agroforestry Recommendation** page
- A **Species** page

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

## App Structure (High Level)

Key files:

- `index.html` – Home page
- `profile.html` – Environmental Profile page (To be updated)
- `calculator.html` – Sapling Calculator page (To be updated)
- `recommendation.html` - Agroforestry Recommendation page (To be updated)
- `species.html` – Species page (To be updated)

Main TypeScript entry points:

- `src/home.ts` – Home page logic (navigation)
- `src/profile.ts` – Environmental profile generation logic (To be updated)
- `src/calculator.ts` – Sapling Calculator (To be updated)
- `src/recommendation.ts` – Agroforestry Recommendation (To be updated)
- `src/species.ts` – Searching species information based on keywords (To be updated)

Vite is configured in `vite.config.ts` to treat these HTML files as separate entry points.

---

## How to Run the Frontend

From the project root:
>>>>>>> upstream/master

## Installation & Setup

### 1. Clone the Repository

You can clone the repository directly or fork it first if you plan to contribute.

**Option A: Clone directly**
```bash
<<<<<<< HEAD
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


=======
cd Planting-Optimisation-Tool/frontend
npm install
npm run dev
```

## 1. Fork and Clone the repository

First fork the repo to create your own copy:
https://github.com/Chameleon-company/Planting-Optimisation-Tool/fork

Then clone your fork locally

```bash
git clone https://github.com/<your-username>/Planting-Optimisation-Tool.git  # Replace <your-username> with your github username.
cd Planting-Optimisation-Tool
```

Add the project repo as remote to keep your fork up to date

```bash
git remote add upstream https://github.com/Chameleon-company/Planting-Optimisation-Tool.git
git remote -v
```

#### To work on a feature, create a branch for it.

```bash
git checkout -b feature/<feature-name>  # e.g. feature/recommendation-tool
```

Make your changes to what you're working on.

## Before You Commit

A few important points to keep in mind to make sure your contributions are safe, clean, and easy to review:

1. **Never commit secrets or credentials** – do not include API keys, passwords, or `.env` files in your commits. Use environment variables or secret management instead.

2. **Run linting and formatting** – make sure your code follows the project’s style guidelines before committing:

   ```bash
   npm run lint       # frontend
   npm run format     # frontend
   ```

3. **Write clear commit messages** – short but descriptive messages make reviewing and tracking changes easier.

4. **Keep PRs focused** – one feature, bugfix, or documentation change per PR. Avoid unrelated changes.

5. **Sync with the main repository** – regularly pull from `upstream/master` to avoid merge conflicts:

   ```bash
   git fetch upstream
   git checkout master
   git merge upstream/master
   git checkout feature/<branch-name>
   git rebase master
   ```

6. **Don’t commit unnecessary files** – node modules, build artifacts, logs, or temporary IDE files should be ignored (`.gitignore`).

7. **Document important changes** – if your contribution affects setup, usage, or configuration, update the README or other documentation.

8. **Check for sensitive information in comments or logs** – remove passwords, internal URLs, or secret tokens.

9. **Tag the affected team / area in your PR** – Frontend, Backend, Data Science, Documentation, etc., to help reviewers know who should look at it.

Following these guidelines ensures that contributions are safe, consistent, and easy to review.

## 2. When you're ready to commit:

Stage your changes with

```
git add .
```

Then commit your changes with

```bash
git commit -m "Description of changes, what you are committing"
```

Then push your changes **locally** to your fork with

```bash
git push origin feature/<branch-name>
```

# **MOST IMPORTANT - BEFORE SUBMITTING PR**

- Your code **MUST** have tests committed with it.
- Your code **MUST** be documented, legible and following the guidelines.
- Your code **MUST** be linked to an item in the project planner in MS Teams that is assigned to **YOU**.

Failure to adhere to any of the the above will result in your PR **not being accepted**.

Once you have confirmed:

Open a Pull request - https://github.com/Chameleon-company/Planting-Optimisation-Tool/compare

Fill out the PR template and click Create Pull request. Then mark off your task on the MS Teams planner [here](https://teams.microsoft.com/l/entity/com.microsoft.teamspace.tab.planner/_djb2_msteams_prefix_4285208193?context=%7B%22channelId%22%3A%2219%3A040b4a55d7084ae0b2426a200c20ac53%40thread.tacv2%22%7D&tenantId=d02378ec-1688-46d5-8540-1c28b5f470f6).

---

## 3. Front-end setup

The front-end is built with React. Make sure you have **Node.js (v24+)** and **npm** installed.

[Download Node.js](https://nodejs.org/en/download)

Confirm installation with:

```bash
node -v # should return >24.0
npm -v
```

then

```bash
cd frontend
npm install # to install dependencies
```

then to start the development server

```bash
npm run dev
```

If you get errors or white screen after pulling new changes, run `npm install` again to update dependencies.

### Testing

The front end uses **Vitest** for testing

```bash
npm run test # runs tests
npm run test -- --coverage # runs tests with coverage
```

Your code must include tests and pass existing tests before submitting a PR.

The front end uses [ESlint](https://eslint.org/docs/latest/use/getting-started) for linting

```bash
npm run lint:scripts # checks code
npm run lint:styles  # checks css
```

[Prettier](https://prettier.io/docs/) for code formatting

```bash
npm run format:scripts  # format code
npm run format:styles   # format CSS/SCSS
npm run format           # formats everything
```

[Husky](https://github.com/typicode/husky) is set up for pre-commit hooks. When you commit, lint-staged will run to ensure your staged files are properly linted and formatted. You do not need to run it manually.

---

## Useful NPM Scripts

From the `frontend` directory:

- `npm run dev` – start the Vite dev server
- `npm run build` – build the production bundle into `build/dist`
- `npm run test` / `npm run test:coverage` – run unit tests with Vitest
- `npm run lint:scripts` – lint TypeScript files with ESLint
- `npm run lint:styles` – lint CSS/SCSS with Stylelint
- `npm run format` – format scripts and styles with Prettier + Stylelint
>>>>>>> upstream/master
