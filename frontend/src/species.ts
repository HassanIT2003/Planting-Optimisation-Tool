import "./style.css";


const API_BASE_URL = "http://127.0.0.1:8081";

interface SoilTexture {
  name: string;
}

interface AgroforestryType {
  name: string;
}

interface Species {
  id: number;
  name: string; // Scientific name
  common_name: string;
  rainfall_mm_min: number;
  rainfall_mm_max: number;
  temperature_celsius_min: number;
  temperature_celsius_max: number;
  elevation_m_min: number;
  elevation_m_max: number;
  ph_min: number;
  ph_max: number;
  coastal: boolean;
  riparian: boolean;
  nitrogen_fixing: boolean;
  shade_tolerant: boolean;
  bank_stabilising: boolean;
  soil_textures: SoilTexture[];
  agroforestry_types: AgroforestryType[];
}

const searchInput = document.getElementById(
  "insightsSearch"
) as HTMLInputElement;
const searchBtn = document.getElementById(
  "insightsSearchBtn"
) as HTMLButtonElement;
const grid = document.getElementById("insightsArticles") as HTMLElement;
const emptyMsg = document.getElementById("insightsEmpty") as HTMLElement;

// Modal elements
const modal = document.getElementById("articleModal");
const modalClose = modal?.querySelector(".modal-close");

let allSpecies: Species[] = [];
let isLoaded = false;

function initThemeToggle() {
  const toggleBtn = document.getElementById("themeToggle");
  if (!toggleBtn) return;

  // Check saved preference
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  }

  toggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    if (currentTheme === "dark") {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    }
  });
}

// Close modal logic
if (modal && modalClose) {
  modalClose.addEventListener("click", () => {
    modal.classList.remove("active");
  });
  // Click outside to close
  modal.addEventListener("click", e => {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });
}

async function fetchSpecies() {
  try {
    const res = await fetch(`${API_BASE_URL}/species`);
    if (!res.ok) throw new Error("Failed to fetch species");
    const data = await res.json();
    allSpecies = data;
    isLoaded = true;
  } catch (err) {
    console.error("Error fetching species:", err);
    grid.innerHTML = "<p>Error loading species data. Please try again later.</p>";
  }
}

async function handleSearch() {
  const query = searchInput.value.trim().toLowerCase();

  // If not loaded, fetch first
  if (!isLoaded) {
    grid.innerHTML = "<p>Loading...</p>";
    emptyMsg.hidden = true;
    await fetchSpecies();
  }

  grid.innerHTML = "";
  emptyMsg.hidden = true;

  if (allSpecies.length === 0) {
    grid.innerHTML = "<p>No species data available.</p>";
    return;
  }

  const filtered = allSpecies.filter(s => {
    if (!query) return true;
    return (
      s.name.toLowerCase().includes(query) ||
      s.common_name.toLowerCase().includes(query) ||
      s.agroforestry_types.some(t => t.name.toLowerCase().includes(query)) ||
      s.soil_textures.some(t => t.name.toLowerCase().includes(query))
    );
  });

  if (filtered.length === 0) {
    grid.innerHTML = "<p>No species found matching your criteria.</p>";
    return;
  }

  filtered.forEach(species => {
    const card = document.createElement("div");
    card.className = "insight-card";

    // Placeholder image since DB doesn't have images yet
    const imgUrl = "assets/images/logo2.svg";

    card.innerHTML = `
      <div class="card-img" style="background-image: url('${imgUrl}'); background-size: contain; background-repeat: no-repeat; background-position: center; background-color: #f0fdf4;"></div>
      <div class="card-body">
          <h3>${species.common_name}</h3>
          <p class="scientific">${species.name}</p>
          <p class="excerpt">
             Click to view ecological details...
          </p>
      </div>
    `;

    card.addEventListener("click", () => {
      openModal(species, imgUrl);
    });

    grid.appendChild(card);
  });
}

function openModal(species: Species, imageUrl: string) {
  const modalContent = modal!.querySelector(
    ".modal-content-body"
  ) as HTMLElement;

  const benefits = [];
  if (species.nitrogen_fixing) benefits.push("Nitrogen Fixing");
  if (species.shade_tolerant) benefits.push("Shade Tolerant");
  if (species.bank_stabilising) benefits.push("Bank Stabilising");
  if (species.coastal) benefits.push("Coastal Resilient");
  if (species.riparian) benefits.push("Riparian");

  const descriptionHtml = `
    <div class="species-details">
      <p><strong>Scientific Name:</strong> ${species.name}</p>
      <p><strong>Common Name:</strong> ${species.common_name}</p>
      
      <div class="detail-section">
        <h4>Ecological Requirements</h4>
        <ul>
          <li><strong>Rainfall:</strong> ${species.rainfall_mm_min} - ${species.rainfall_mm_max} mm</li>
          <li><strong>Temperature:</strong> ${species.temperature_celsius_min} - ${species.temperature_celsius_max} °C</li>
          <li><strong>Elevation:</strong> ${species.elevation_m_min} - ${species.elevation_m_max} m</li>
          <li><strong>Soil pH:</strong> ${species.ph_min} - ${species.ph_max}</li>
          <li><strong>Soil Textures:</strong> ${species.soil_textures.map(t => t.name).join(", ")}</li>
        </ul>
      </div>

      <div class="detail-section">
        <h4>Agroforestry Uses</h4>
        <p>${species.agroforestry_types.map(t => t.name).join(", ")}</p>
      </div>

      ${benefits.length > 0 ? `
      <div class="detail-section">
        <h4>Key Benefits</h4>
        <ul>
          ${benefits.map(b => `<li>${b}</li>`).join("")}
        </ul>
      </div>
      ` : ""}
    </div>
  `;

  modalContent.innerHTML = `
    <div class="modal-header-img" style="background-color: #f0fdf4; display: flex; justify-content: center; align-items: center;">
        <img src="${imageUrl}" alt="${species.common_name}" style="max-height: 200px; width: auto;">
    </div>
    <h2>${species.common_name}</h2>
    <div class="modal-rich-text">
        ${descriptionHtml}
    </div>
  `;

  modal!.classList.add("active");
}

function init() {
  searchBtn.addEventListener("click", handleSearch);
  searchInput.addEventListener("keydown", e => {
    if (e.key === "Enter") handleSearch();
  });

  emptyMsg.hidden = false;
  emptyMsg.textContent =
    "Enter keywords like '2000mm' or 'boundary' to find species.";
  initThemeToggle();
}

init();

