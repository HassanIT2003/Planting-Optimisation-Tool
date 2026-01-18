import "./style.css";

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

const API_BASE_URL = "http://127.0.0.1:8081";

interface RecommendationApiItem {
  species_id: number;
  species_name: string;
  species_common_name: string;
  score_mcda: number;
  rank_overall: number;
  key_reasons: string[];
}

interface RecommendationsApiResponse {
  farm_id: number;
  recommendations: RecommendationApiItem[];
}

interface FarmCreateApiPayload {
  rainfall_mm: number;
  temperature_celsius: number;
  elevation_m: number;
  ph: number;
  soil_texture_id: number;
  area_ha: number;
  latitude: number;
  longitude: number;
  coastal: boolean;
  riparian: boolean;
  nitrogen_fixing: boolean;
  shade_tolerant: boolean;
  bank_stabilising: boolean;
  slope: number;
  agroforestry_type_ids: number[] | null;
  external_id: number | null;
}

interface FarmReadApiResponse {
  id: number;
  rainfall_mm: number;
  temperature_celsius: number;
  elevation_m: number;
  ph: number;
  soil_texture: {
    name: string;
  };
  latitude: number;
  longitude: number;
}

let accessToken: string | null = null;

async function getAccessToken(): Promise<string | null> {
  if (accessToken) return accessToken;
  try {
    const body = new URLSearchParams();
    body.set("username", "testuser@test.com");
    body.set("password", "devpassword");
    body.set("grant_type", "password");

    const res = await fetch(`${API_BASE_URL}/auth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    if (!res.ok) return null;
    const data = (await res.json()) as { access_token?: string };
    if (!data.access_token) return null;
    accessToken = data.access_token;
    return accessToken;
  } catch {
    return null;
  }
}

function normaliseNumber(value: string, fallback: number): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return n;
}

function mapSoilTextureToId(soilType: string): number {
  const v = soilType.trim().toLowerCase();
  if (!v) return 4;
  if (v.includes("clay")) return 12;
  if (v.includes("loam")) return 4;
  if (v.includes("sand")) return 1;
  return 4;
}

async function createFarmInBackend(fromForm: FarmData): Promise<number | null> {
  const token = await getAccessToken();
  if (!token) return null;

  const rainfall = normaliseNumber(fromForm.rainfall, 1500);
  const temperature = normaliseNumber(fromForm.temperature, 20);
  const elevation = normaliseNumber(fromForm.altitude, 500);
  const ph = normaliseNumber(fromForm.ph, 6);
  const latitude = normaliseNumber(fromForm.latitude, 0);
  const longitude = normaliseNumber(fromForm.longitude, 0);
  const soilTextureId = mapSoilTextureToId(fromForm.soilType);

  const payload: FarmCreateApiPayload = {
    rainfall_mm: Math.round(rainfall),
    temperature_celsius: Math.round(temperature),
    elevation_m: Math.round(elevation),
    ph,
    soil_texture_id: soilTextureId,
    area_ha: 1,
    latitude,
    longitude,
    coastal: false,
    riparian: false,
    nitrogen_fixing: false,
    shade_tolerant: false,
    bank_stabilising: false,
    slope: 0,
    agroforestry_type_ids: [],
    external_id: null,
  };

  try {
    const res = await fetch(`${API_BASE_URL}/farms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as FarmReadApiResponse;
    if (!data || typeof data.id !== "number") return null;
    return data.id;
  } catch {
    return null;
  }
}

async function fetchUserFarms(): Promise<FarmReadApiResponse[] | null> {
  const token = await getAccessToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/farms`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as FarmReadApiResponse[];
    if (!Array.isArray(data)) return null;
    return data;
  } catch {
    return null;
  }
}

async function fetchFarmDetails(
  farmId: string
): Promise<FarmReadApiResponse | null> {
  const token = await getAccessToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/farms/${farmId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as FarmReadApiResponse;
    if (!data || typeof data.id !== "number") return null;
    return data;
  } catch {
    return null;
  }
}

async function fetchRecommendationsFromApi(
  farmId: string
): Promise<SpeciesRec[] | null> {
  const token = await getAccessToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/recommendations/${farmId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return null;

    const data = (await res.json()) as RecommendationsApiResponse;
    if (!data || !Array.isArray(data.recommendations)) return null;

    const species: SpeciesRec[] = data.recommendations.map(rec => {
      const name = rec.species_common_name || rec.species_name;
      return {
        name,
        matched: `Score: ${rec.score_mcda.toFixed(3)}`,
        keyReasons: rec.key_reasons || [],
        score: rec.score_mcda,
      };
    });

    if (!species.length) return null;
    const best = species.reduce((a, b) => (a.score > b.score ? a : b));
    return species.map(sp => ({ ...sp, isBest: sp.name === best.name }));
  } catch {
    return null;
  }
}

interface FarmData {
  latitude: string;
  longitude: string;
  ph: string;
  soilType: string;
  rainfall: string;
  temperature: string;
  altitude: string;
}

interface SpeciesRec {
  name: string;
  matched: string;
  keyReasons: string[];
  score: number;
  isBest?: boolean;
}

const farmDatabase: Record<string, FarmData> = {};

let formData: FarmData & { farmId: string } = {
  farmId: "",
  latitude: "",
  longitude: "",
  ph: "",
  soilType: "",
  rainfall: "",
  temperature: "",
  altitude: "",
};
let speciesList: SpeciesRec[] = [];

const farmIdSelect = document.getElementById(
  "farmIdSelect"
) as HTMLSelectElement;
const newFarmSection = document.getElementById(
  "newFarmSection"
) as HTMLDivElement;
const polygonInput = document.getElementById(
  "polygonInput"
) as HTMLInputElement;
const polygonSearchBtn = document.getElementById(
  "polygonSearchBtn"
) as HTMLButtonElement;
const saveProfileBtn = document.getElementById(
  "saveProfileBtn"
) as HTMLButtonElement;
const generateBtn = document.getElementById("generateBtn") as HTMLButtonElement;
const resultsSection = document.getElementById(
  "resultsSection"
) as HTMLDivElement;
const resultFarmId = document.getElementById(
  "resultFarmId"
) as HTMLHeadingElement;
const speciesGrid = document.getElementById("speciesGrid") as HTMLDivElement;

const inputs = {
  latitude: document.getElementById("latitudeInput") as HTMLInputElement,
  longitude: document.getElementById("longitudeInput") as HTMLInputElement,
  ph: document.getElementById("phInput") as HTMLInputElement,
  soilType: document.getElementById("soilTypeInput") as HTMLInputElement,
  rainfall: document.getElementById("rainfallInput") as HTMLInputElement,
  temperature: document.getElementById("temperatureInput") as HTMLInputElement,
  altitude: document.getElementById("altitudeInput") as HTMLInputElement,
};

function updateFormInputs() {
  (Object.keys(inputs) as Array<keyof FarmData>).forEach(key => {
    if (inputs[key]) {
      inputs[key].value = formData[key] || "";
    }
  });
}

function mapFarmReadToFarmData(farm: FarmReadApiResponse): FarmData {
  return {
    latitude: String(farm.latitude),
    longitude: String(farm.longitude),
    ph: String(farm.ph),
    soilType: farm.soil_texture?.name ?? "",
    rainfall: String(farm.rainfall_mm),
    temperature: String(farm.temperature_celsius),
    altitude: String(farm.elevation_m),
  };
}

async function handleFarmChange() {
  const value = farmIdSelect.value;

  if (value === "new") {
    formData = {
      farmId: "new",
      latitude: "",
      longitude: "",
      ph: "",
      soilType: "",
      rainfall: "",
      temperature: "",
      altitude: "",
    };
    newFarmSection.style.display = "flex";
    saveProfileBtn.style.display = "inline-block";
  } else {
    newFarmSection.style.display = "none";
    saveProfileBtn.style.display = "none";
    if (value) {
      let stored = farmDatabase[value];
      if (!stored) {
        const apiFarm = await fetchFarmDetails(value);
        if (apiFarm) {
          stored = mapFarmReadToFarmData(apiFarm);
          farmDatabase[value] = stored;
        }
      }
      if (stored) {
        formData = { farmId: value, ...stored };
      } else {
        formData = {
          farmId: "",
          latitude: "",
          longitude: "",
          ph: "",
          soilType: "",
          rainfall: "",
          temperature: "",
          altitude: "",
        };
      }
    } else {
      formData = {
        farmId: "",
        latitude: "",
        longitude: "",
        ph: "",
        soilType: "",
        rainfall: "",
        temperature: "",
        altitude: "",
      };
    }
  }
  updateFormInputs();
}

function handlePolygonSearch() {
  if (!polygonInput.value.trim()) {
    alert("Please enter polygon input");
    return;
  }

  const mockEnv = {
    latitude: "-8.55",
    longitude: "186.50",
    ph: (5 + Math.random() * 2).toFixed(1),
    soilType: ["Clay", "Loam", "Sandy"][Math.floor(Math.random() * 3)],
    rainfall: (1500 + Math.random() * 1000).toFixed(0),
    temperature: (18 + Math.random() * 6).toFixed(1),
    altitude: (700 + Math.random() * 400).toFixed(0),
  };

  formData = { ...formData, ...mockEnv };
  updateFormInputs();
}

async function handleSaveProfile() {
  const currentForm: FarmData = {
    latitude: inputs.latitude.value,
    longitude: inputs.longitude.value,
    ph: inputs.ph.value,
    soilType: inputs.soilType.value,
    rainfall: inputs.rainfall.value,
    temperature: inputs.temperature.value,
    altitude: inputs.altitude.value,
  };

  const backendFarmId = await createFarmInBackend(currentForm);
  const newId =
    backendFarmId !== null
      ? backendFarmId.toString()
      : (Object.keys(farmDatabase).length + 1).toString();

  farmDatabase[newId] = currentForm;

  const option = document.createElement("option");
  option.value = newId;
  option.text = `Farm ${newId}`;
  farmIdSelect.insertBefore(option, farmIdSelect.lastElementChild);

  farmIdSelect.value = newId;
  handleFarmChange();

  if (backendFarmId !== null) {
    alert(`Farm ${newId} saved to server successfully.`);
  } else {
    alert(`Farm ${newId} saved locally (server unavailable).`);
  }
}

async function handleGenerate() {
  const id = farmIdSelect.value;
  if (!id || id === "new") {
    alert("Please select a saved Farm ID");
    return;
  }

  const apiSpecies = await fetchRecommendationsFromApi(id);
  if (apiSpecies && apiSpecies.length) {
    speciesList = apiSpecies;
  } else {
    speciesList = [
      {
        name: "Sandalwood",
        matched: "70% (estimated)",
        keyReasons: ["auto-analysis"],
        score: 70,
      },
      {
        name: "Mahogany",
        matched: "65% (estimated)",
        keyReasons: ["auto-analysis"],
        score: 65,
      },
      {
        name: "Bamboo",
        matched: "60% (estimated)",
        keyReasons: ["auto-analysis"],
        score: 60,
      },
    ];
    const best = speciesList.reduce((a, b) => (a.score > b.score ? a : b));
    speciesList = speciesList.map(sp => ({
      ...sp,
      isBest: sp.name === best.name,
    }));
  }
  renderResults();
}

function renderResults() {
  resultFarmId.textContent = `Farm ID: ${farmIdSelect.value}`;
  resultsSection.style.display = "block";
  speciesGrid.innerHTML = "";

  speciesList.forEach(item => {
    const card = document.createElement("div");
    card.className = `species-card ${item.isBest ? "best" : ""}`;

    const reasonsHtml = item.keyReasons.map(r => `<li>${r}</li>`).join("");

    card.innerHTML = `
            <div class="image-placeholder">
                <span>Image</span>
            </div>
            <div class="species-name">${item.name}</div>
            <div class="match-score">Match: ${item.matched}</div>
            <ul class="reasons-list">
                ${reasonsHtml}
            </ul>
        `;
    speciesGrid.appendChild(card);
  });
}

function initNav() {
  const links = document.querySelectorAll(".nav-link");
  const path = window.location.pathname;
  const currentPage = path.includes("insights")
    ? "insights"
    : path.includes("recommendations")
      ? "recommendations"
      : "calculator";

  links.forEach(link => {
    link.classList.remove("active");
    const page = link.getAttribute("data-page");
    if (page === currentPage) link.classList.add("active");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initThemeToggle();

  if (farmIdSelect) {
    farmIdSelect.addEventListener("change", () => {
      handleFarmChange();
    });
    fetchUserFarms().then(farms => {
      if (!farms) return;
      farms.forEach(farm => {
        const id = farm.id.toString();
        const option = document.createElement("option");
        option.value = id;
        option.text = `Farm ${id}`;
        farmIdSelect.insertBefore(option, farmIdSelect.lastElementChild);
      });
    });
  }

  if (polygonSearchBtn)
    polygonSearchBtn.addEventListener("click", handlePolygonSearch);
  if (saveProfileBtn)
    saveProfileBtn.addEventListener("click", handleSaveProfile);
  if (generateBtn)
    generateBtn.addEventListener("click", () => {
      handleGenerate();
    });
  Object.keys(inputs).forEach(key => {
    const k = key as keyof FarmData;
    inputs[k].addEventListener("input", e => {
      formData[k] = (e.target as HTMLInputElement).value;
    });
  });
});
