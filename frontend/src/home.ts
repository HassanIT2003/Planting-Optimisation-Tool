import "./style.css";
import "./home.css";

// Nav Logic
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

// Sticky Header Logic
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

// Reviews Carousel Logic
const reviewsData = [
  {
    id: 1,
    name: "Maria da Silva",
    location: "Baucau, Timor-Leste",
    date: "October 12, 2025",
    text: "This tool helped me choose the right species for my farm. The recommendations matched my land conditions perfectly, and my new trees are thriving!",
  },
  {
    id: 2,
    name: "José Fernandes",
    location: "Dili, Timor-Leste",
    date: "November 05, 2025",
    text: "I was unsure which trees would grow well on my slope, but the tool gave clear guidance. It saved me time and effort, and the results speak for themselves.",
  },
  {
    id: 3,
    name: "Ana Martins",
    location: "Maliana, Timor-Leste",
    date: "December 01, 2025",
    text: "Simple to use and very accurate. I recommended it to my neighbors who were struggling with dry soil crops. A great resource for our community.",
  },
];

const cardsToShow = 2;
let currentIndex = 0;
let autoTimer: number | undefined;
let maxIndex = 0;
let track: HTMLDivElement | null = null;

function getReviewsContainer() {
  return document.getElementById("reviewsWrapper") as HTMLDivElement | null;
}

function buildTrack() {
  const container = getReviewsContainer();
  if (!container) return;

  track = document.createElement("div");
  track.className = "cardsTrack";

  reviewsData.forEach(review => {
    const card = document.createElement("div");
    card.className = "reviewCard";
    card.innerHTML = `
      <div class="cardContent">
        <div class="cardMeta">
          <span class="metaName">${review.name}</span>
          <span class="metaDate">${review.date}</span>
        </div>
        <h3 class="cardLocation">${review.location}</h3>
        <p class="cardText">"${review.text}"</p>
      </div>
    `;
    track!.appendChild(card);
  });

  container.innerHTML = "";
  container.appendChild(track);

  const total = reviewsData.length;
  maxIndex = Math.max(0, total - cardsToShow);
}

function goTo(index: number) {
  if (!track) return;
  if (maxIndex === 0) {
    track.style.transform = "translateX(0)";
    return;
  }
  currentIndex = index;
  if (currentIndex < 0) currentIndex = maxIndex;
  if (currentIndex > maxIndex) currentIndex = 0;
  const percentage = (100 / cardsToShow) * currentIndex;
  track.style.transform = `translateX(-${percentage}%)`;
}

function nextSlide() {
  goTo(currentIndex + 1);
}

function prevSlide() {
  goTo(currentIndex - 1);
}

function initReviews() {
  const container = getReviewsContainer();
  if (!container) return;

  buildTrack();
  goTo(0);

  document.getElementById("nextReview")?.addEventListener("click", nextSlide);
  document.getElementById("prevReview")?.addEventListener("click", prevSlide);

  const startAuto = () => {
    if (autoTimer) window.clearInterval(autoTimer);
    autoTimer = window.setInterval(nextSlide, 3000);
  };
  const stopAuto = () => {
    if (autoTimer) {
      window.clearInterval(autoTimer);
      autoTimer = undefined;
    }
  };
  startAuto();

  const reviewsSection = document.querySelector(".reviewsSection");
  reviewsSection?.addEventListener("mouseenter", stopAuto);
  reviewsSection?.addEventListener("mouseleave", startAuto);
}

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initStickyHeader();
  initReviews();
});
