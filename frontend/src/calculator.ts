import "./style.css";

export { sum } from "./sum";

import { initSaplingCalculator } from "./sapling-calculator";

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSaplingCalculator);
} else {
  initSaplingCalculator();
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

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initStickyHeader);
} else {
  initStickyHeader();
}

function setActiveNavForPage() {
  const path = window.location.pathname;
  let page = "calculator";
  if (path.includes("recommendations.html")) page = "recommendations";
  else if (path.includes("calculator.html")) page = "calculator";
  else if (path.includes("insights.html")) page = "insights";
  else if (path.includes("index.html") || path === "/") page = "home";

  const links = document.querySelectorAll(".nav .nav-link");
  links.forEach(el => {
    const pageId = (el as HTMLElement).dataset.page;
    el.classList.toggle("active", pageId === page);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setActiveNavForPage);
} else {
  setActiveNavForPage();
}
