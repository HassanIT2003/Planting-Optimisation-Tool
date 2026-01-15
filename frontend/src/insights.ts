import "./style.css";

function titleCase(s: string) {
  return s
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, c => c.toUpperCase());
}

async function fetchDirIndex(url: string): Promise<string[]> {
  const res = await fetch(url, { headers: { Accept: "text/html" } });
  if (!res.ok) return [];
  const html = await res.text();
  const doc = new DOMParser().parseFromString(html, "text/html");
  const anchors = Array.from(doc.querySelectorAll("a"));
  return anchors.map(a => (a.getAttribute("href") || "").trim()).filter(Boolean);
}

async function loadArticlesFromAssets() {
  const root = "/assets/";
  const entries = await fetchDirIndex(root);
  const folderLinks = entries.filter(h => h.endsWith("/")).map(h => new URL(h, root).pathname);
  const articles: Array<{ title: string; lead: string; image: string; path: string }> = [];
  for (const folder of folderLinks) {
    const list = await fetchDirIndex(folder);
    const files = list
      .map(h => new URL(h, folder).pathname)
      .filter(p => /\.(png|jpg|jpeg|webp|gif|heic)$/i.test(p));
    if (!files.length) continue;
    const image = files[0];
    const folderName = decodeURIComponent(folder.split("/").filter(Boolean).pop() || "Article");
    const title = titleCase(folderName);
    const lead = `Learn about ${title} characteristics, suitability, and best practices for your farmland.`;
    articles.push({ title, lead, image, path: folder });
  }
  return articles;
}

function renderArticles(list: Array<{ title: string; lead: string; image: string; path: string }>) {
  const mount = document.getElementById("insightsArticles") as HTMLElement | null;
  const empty = document.getElementById("insightsEmpty") as HTMLElement | null;
  if (!mount) return;
  mount.innerHTML = "";
  if (!list.length) {
    if (empty) empty.hidden = false;
    return;
  }
  if (empty) empty.hidden = true;
  for (const a of list) {
    const card = document.createElement("article");
    card.className = "article-card";
    card.innerHTML = `
      <div class="article-media"><img src="${a.image}" alt="${a.title}" /></div>
      <div class="article-body">
        <h3 class="article-title">${a.title}</h3>
        <p class="article-lead">${a.lead}</p>
        <div class="article-actions">
          <a class="btn-outline" href="${a.image}" target="_blank" rel="noopener">Read</a>
        </div>
      </div>
    `;
    mount.appendChild(card);
  }
}

function setupSearch(articles: Array<{ title: string; lead: string; image: string; path: string }>) {
  const input = document.getElementById("insightsSearch") as HTMLInputElement | null;
  const btn = document.getElementById("insightsSearchBtn") as HTMLButtonElement | null;
  const doFilter = () => {
    const q = (input?.value || "").toLowerCase().trim();
    if (!q) {
      renderArticles(articles);
      return;
    }
    const filtered = articles.filter(a => a.title.toLowerCase().includes(q) || a.lead.toLowerCase().includes(q));
    renderArticles(filtered);
  };
  if (btn) btn.addEventListener("click", doFilter);
  if (input) input.addEventListener("keydown", e => { if ((e as KeyboardEvent).key === "Enter") doFilter(); });
}

function setActiveNav() {
  const links = document.querySelectorAll(".nav .nav-link");
  links.forEach(el => {
    const pageId = (el as HTMLElement).dataset.page;
    el.classList.toggle("active", pageId === "insights");
  });
}

async function init() {
  setActiveNav();
  const articles = await loadArticlesFromAssets();
  renderArticles(articles);
  setupSearch(articles);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
