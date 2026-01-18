import "./style.css";
import "./home.css";

function initThemeToggle() {
  const root = document.documentElement;
  const stored = window.localStorage.getItem("theme");
  if (stored === "dark") root.classList.add("dark-theme");
  const btn = document.getElementById("themeToggle");
  if (!(btn instanceof HTMLButtonElement)) return;
  const setLabel = () => {
    const isDark = root.classList.contains("dark-theme");
    btn.textContent = isDark ? "Light mode" : "Dark mode";
  };
  setLabel();
  btn.addEventListener("click", () => {
    const isDark = root.classList.toggle("dark-theme");
    window.localStorage.setItem("theme", isDark ? "dark" : "light");
    setLabel();
  });
}

function initNav() {
  const path = window.location.pathname;
  let page = "home";
  if (path.includes("recommendations.html")) page = "recommendations";
  else if (path.includes("calculator.html")) page = "calculator";
  else if (path.includes("insights.html")) page = "insights";

  const links = document.querySelectorAll(".nav .nav-link");
  links.forEach(el => {
    const link = el as HTMLAnchorElement;
    const pageId = link.dataset.page;
    if (pageId === page) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

function initStickyHeader() {
  const header = document.querySelector(".topbar") as HTMLElement | null;
  if (!header) return;
  const toggle = () => {
    if (window.scrollY > 4) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  };
  window.addEventListener("scroll", toggle, {
    passive: true,
  } as AddEventListenerOptions);
  toggle();
}

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initStickyHeader();
  initThemeToggle();
});
