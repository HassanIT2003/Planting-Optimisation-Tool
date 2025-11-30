# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

Planting Optimisation Tool

A modern React project built using Vite, JSX, and CSS Modules for modular and maintainable styling.

🚀 Features

⚡ Vite as the build tool for ultra-fast development
⚛️ React (JSX) for UI components
🎨 CSS Modules for scoped, maintainable component-level styling
🧱 Clean, component-based structure
🔧 Easy to build, run, and extend

Project Structure
project-folder/
│
├── src/
│ ├── components/
│ │ └── Header.jsx
│ │ └── Header.module.css
│ │ └── Footer.css
│ │ └── Footer.module.css
│ │ └── Form.css
│ │ └── Footer.module.css
│ ├── App.jsx
│ ├── App.css
│ ├── main.jsx
│
├── index.html
├── package.json
├── vite.config.js
└── README.md

🧑‍💻 Installation & Setup

1. Clone or Download the Project

If someone received the project as a ZIP file, they must:

Extract the ZIP
Open the project folder in a terminal

2. Install dependencies
   npm install

3. Start the development server
   npm run dev

Vite will start the project on a local server. The terminal will show something like:
Local: http://localhost:5173/
