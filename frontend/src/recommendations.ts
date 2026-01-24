import "./style.css";
import "./recommendations.css";

const API_BASE_URL = "http://127.0.0.1:8081";

// Auth Helper
async function getAccessToken(): Promise<string | null> {
  const username = "testuser@test.com";
  const password = "password123";

  const params = new URLSearchParams();
  params.append("username", username);
  params.append("password", password);

  try {
    const res = await fetch(`${API_BASE_URL}/auth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });
    if (!res.ok) {
      console.warn("Auth failed", res.status);
      return null;
    }
    const data = await res.json();
    return data.access_token;
  } catch (err) {
    console.error("Auth error:", err);
    return null;
  }
}

// Interfaces based on backend schemas
interface FarmCreate {
  rainfall_mm: number;
  temperature_celsius: number;
  elevation_m: number;
  ph: number;
  soil_texture_id: number;
  area_ha: number;
  latitude: number;
  longitude: number;
  slope: number;
  coastal: boolean;
  riparian: boolean;
  nitrogen_fixing: boolean;
  shade_tolerant: boolean;
  bank_stabilising: boolean;
  // agroforestry_type_ids?: number[]; // Optional
}

interface FarmRead {
  id: number;
  // other fields...
}

interface SpeciesRecommendation {
  species_id: number;
  species_name: string;
  species_common_name: string;
  score_mcda: number;
  rank_overall: number;
  key_reasons: string[];
}

interface RecommendationResponse {
  farm_id: number;
  recommendations: SpeciesRecommendation[];
}

// DOM Elements
const form = document.getElementById("farmForm") as HTMLFormElement;
const resultsSection = document.getElementById(
  "resultsSection"
) as HTMLDivElement;
const speciesList = document.getElementById("speciesList") as HTMLDivElement;
const loadingSpinner = document.getElementById(
  "loadingSpinner"
) as HTMLDivElement;

// Helper to get form data
function getFormData(): FarmCreate {
  const formData = new FormData(form);

  return {
    rainfall_mm: Number(formData.get("rainfall_mm")),
    temperature_celsius: Number(formData.get("temperature_celsius")),
    elevation_m: Number(formData.get("elevation_m")),
    ph: Number(formData.get("ph")),
    soil_texture_id: Number(formData.get("soil_texture_id")),
    area_ha: Number(formData.get("area_ha")),
    latitude: Number(formData.get("latitude")),
    longitude: Number(formData.get("longitude")),
    slope: Number(formData.get("slope")),
    coastal: formData.get("coastal") === "on",
    riparian: formData.get("riparian") === "on",
    nitrogen_fixing: formData.get("nitrogen_fixing") === "on",
    shade_tolerant: formData.get("shade_tolerant") === "on",
    bank_stabilising: formData.get("bank_stabilising") === "on",
  };
}

// Helper to create farm
async function createFarm(data: FarmCreate, token: string): Promise<FarmRead> {
  const response = await fetch(`${API_BASE_URL}/farms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create farm: ${errorText}`);
  }

  return response.json();
}

// Helper to get recommendations
async function getRecommendations(
  farmId: number,
  token: string
): Promise<RecommendationResponse> {
  const response = await fetch(`${API_BASE_URL}/recommendations/${farmId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch recommendations");
  }

  return response.json();
}

// Render Logic
function renderRecommendations(recs: SpeciesRecommendation[]) {
  speciesList.innerHTML = "";

  if (recs.length === 0) {
    speciesList.innerHTML =
      "<p>No suitable species found for this profile.</p>";
    return;
  }

  recs.forEach(rec => {
    const card = document.createElement("div");
    card.className = "species-card";

    // Format score as percentage
    const scorePct = Math.round(rec.score_mcda * 100);

    card.innerHTML = `
      <div class="species-header">
        <h3>${rec.species_common_name}</h3>
        <span class="score-badge">${scorePct}% Match</span>
      </div>
      <p class="scientific-name"><em>${rec.species_name}</em></p>
      
      <div class="reasons">
        <h4>Key Reasons:</h4>
        <ul>
          ${rec.key_reasons.map(r => `<li>${r}</li>`).join("")}
        </ul>
      </div>
    `;
    speciesList.appendChild(card);
  });
}

// Event Listener
form.addEventListener("submit", async e => {
  e.preventDefault();

  try {
    // UI State: Loading
    const submitBtn = form.querySelector(
      "button[type='submit']"
    ) as HTMLButtonElement;
    submitBtn.disabled = true;
    submitBtn.textContent = "Processing...";

    resultsSection.hidden = false;
    loadingSpinner.hidden = false;
    speciesList.innerHTML = "";

    // 0. Authenticate
    const token = await getAccessToken();
    if (!token) {
      throw new Error(
        "Authentication failed. Please check backend credentials."
      );
    }

    // 1. Create Farm
    const farmData = getFormData();
    console.log("Creating farm with data:", farmData);
    const farm = await createFarm(farmData, token);
    console.log("Farm created:", farm);

    // 2. Get Recommendations
    const recData = await getRecommendations(farm.id, token);
    console.log("Recommendations received:", recData);

    // 3. Render
    renderRecommendations(recData.recommendations);
  } catch (error) {
    console.error(error);
    alert(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    resultsSection.hidden = true;
  } finally {
    // UI State: Reset
    const submitBtn = form.querySelector(
      "button[type='submit']"
    ) as HTMLButtonElement;
    submitBtn.disabled = false;
    submitBtn.textContent = "Generate Recommendations";
    loadingSpinner.hidden = true;
  }
});
