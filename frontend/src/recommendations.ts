import { exportDocx } from "./utils/exportDocx";
import "./style.css";

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

const farmDatabase: Record<string, FarmData> = {
  "1": {
    latitude: "-8.6",
    longitude: "186.52",
    ph: "6.2",
    soilType: "Clay",
    rainfall: "2383",
    temperature: "20",
    altitude: "1089",
  },
  "2": {
    latitude: "-8.2",
    longitude: "187.12",
    ph: "5.8",
    soilType: "Loam",
    rainfall: "2000",
    temperature: "21",
    altitude: "950",
  },
  "3": {
    latitude: "-8.0",
    longitude: "185.90",
    ph: "6.8",
    soilType: "Sandy",
    rainfall: "1800",
    temperature: "22",
    altitude: "700",
  },
};

const speciesRecommendationByFarm: Record<string, SpeciesRec[]> = {
  "1": [
    {
      name: "Acacia",
      matched: "82% (farm condition)",
      keyReasons: ["rainfall:ideal", "soil:match", "temp:below optimal"],
      score: 82,
    },
    {
      name: "Eucalyptus",
      matched: "76% (farm condition)",
      keyReasons: ["rainfall:below optimal", "soil:match", "ph:ideal"],
      score: 76,
    },
    {
      name: "Mahogany",
      matched: "70% (farm condition)",
      keyReasons: ["temp:ideal", "soil:match", "rainfall:low"],
      score: 70,
    },
  ],
  "2": [
    {
      name: "Teak",
      matched: "88% (farm condition)",
      keyReasons: ["rainfall:ideal", "temp:ideal", "soil:match"],
      score: 88,
    },
    {
      name: "Pine",
      matched: "75% (farm condition)",
      keyReasons: ["temp:low", "soil:match"],
      score: 75,
    },
    {
      name: "Cedar",
      matched: "68% (farm condition)",
      keyReasons: ["ph:ideal", "rainfall:low"],
      score: 68,
    },
  ],
  "3": [
    {
      name: "Bamboo",
      matched: "90% (farm condition)",
      keyReasons: ["rainfall:ideal", "temp:ideal"],
      score: 90,
    },
    {
      name: "Sandalwood",
      matched: "72% (farm condition)",
      keyReasons: ["soil:match", "temp:low"],
      score: 72,
    },
    {
      name: "Rosewood",
      matched: "65% (farm condition)",
      keyReasons: ["ph:ideal", "rainfall:below optimal"],
      score: 65,
    },
  ],
};

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
const downloadBtn = document.getElementById("downloadBtn") as HTMLButtonElement;

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

function handleFarmChange() {
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
    if (value && farmDatabase[value]) {
      formData = { farmId: value, ...farmDatabase[value] };
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

function handleSaveProfile() {
  const newId = (Object.keys(farmDatabase).length + 1).toString();

  farmDatabase[newId] = {
    latitude: inputs.latitude.value,
    longitude: inputs.longitude.value,
    ph: inputs.ph.value,
    soilType: inputs.soilType.value,
    rainfall: inputs.rainfall.value,
    temperature: inputs.temperature.value,
    altitude: inputs.altitude.value,
  };

  const option = document.createElement("option");
  option.value = newId;
  option.text = `Farm ${newId}`;
  farmIdSelect.insertBefore(option, farmIdSelect.lastElementChild);

  farmIdSelect.value = newId;
  handleFarmChange();

  alert(`Farm ${newId} saved successfully!`);
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
    renderResults();
    return;
  }

  let species = speciesRecommendationByFarm[id];

  if (!species) {
    species = [
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
  }

  const best = species.reduce((a, b) => (a.score > b.score ? a : b));
  speciesList = species.map(sp => ({ ...sp, isBest: sp.name === best.name }));

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

  if (farmIdSelect) {
    Object.keys(farmDatabase).forEach(id => {
      const option = document.createElement("option");
      option.value = id;
      option.text = `Farm ${id}`;
      farmIdSelect.insertBefore(option, farmIdSelect.lastElementChild);
    });

    farmIdSelect.addEventListener("change", handleFarmChange);
  }

  if (polygonSearchBtn)
    polygonSearchBtn.addEventListener("click", handlePolygonSearch);
  if (saveProfileBtn)
    saveProfileBtn.addEventListener("click", handleSaveProfile);
  if (generateBtn)
    generateBtn.addEventListener("click", () => {
      handleGenerate();
    });
  if (downloadBtn)
    downloadBtn.addEventListener("click", () => exportDocx(speciesList));

  Object.keys(inputs).forEach(key => {
    const k = key as keyof FarmData;
    inputs[k].addEventListener("input", e => {
      formData[k] = (e.target as HTMLInputElement).value;
    });
  });
});
