// ----------------------------------------------
// MOBILE NAVIGATION (hamburger menu)
// ----------------------------------------------
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

function setMenu(open) {
  navMenu.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

navToggle.addEventListener("click", function () {
  setMenu(!navMenu.classList.contains("open"));
});

// close the menu after choosing a link, pressing Escape, or resizing to desktop
navMenu.addEventListener("click", function (e) {
  if (e.target.closest("a")) setMenu(false);
});
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") setMenu(false);
});
window.matchMedia("(min-width: 1024px)").addEventListener("change", function () {
  setMenu(false);
});

// highlight the nav link of the section currently on screen
const navAnchors = document.querySelectorAll(".nav-links a");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      navAnchors.forEach(function (a) {
        a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  document.querySelectorAll("main section[id]").forEach(function (s) { observer.observe(s); });
}

// ----------------------------------------------
// FEATURE 1: DAILY ECO CHALLENGE + ECO POINTS
// ----------------------------------------------
const challenges = [
  {
    title: "Say no to single-use plastic",
    description: "Carry a reusable bag or bottle today and avoid disposable plastic where possible."
  },
  {
    title: "Save electricity",
    description: "Switch off lights, fans and devices when they are not being used."
  },
  {
    title: "Choose a greener journey",
    description: "Walk, cycle, carpool or use public transport for one journey if practical."
  },
  {
    title: "Prevent water waste",
    description: "Turn off the tap while brushing and report or fix a leaking tap."
  },
  {
    title: "Care for a plant",
    description: "Water a plant, care for a garden or learn about a native plant."
  },
  {
    title: "Sort your waste",
    description: "Separate recyclable, food and other waste according to local rules."
  },
  {
    title: "Reuse before replacing",
    description: "Find one item you can repair, refill, reuse or share instead of buying new."
  }
];

const today = new Date();
const dateKey = [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2, "0"),
  String(today.getDate()).padStart(2, "0")
].join("-");

const challengeIndex = Math.floor(
  (new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime() -
    new Date(2026, 0, 1).getTime()) / 86400000
) % challenges.length;

const todaysChallenge = challenges[(challengeIndex + challenges.length) % challenges.length];

const titleElement = document.getElementById("challengeTitle");
const descriptionElement = document.getElementById("challengeDescription");
const completeButton = document.getElementById("completeChallenge");
const statusElement = document.getElementById("challengeStatus");
const pointsElement = document.getElementById("pointsTotal");

titleElement.textContent = todaysChallenge.title;
descriptionElement.textContent = todaysChallenge.description;

function storageGet(key) {
  try { return localStorage.getItem(key); } catch (e) { return null; }
}

function storageSet(key, value) {
  try { localStorage.setItem(key, value); } catch (e) { /* private mode: ignore */ }
}

let sessionPoints = 0;      // fallback when storage is unavailable
let sessionCompleted = null;

function getPoints() {
  const stored = Number(storageGet("ecoversePoints"));
  return Math.max(stored || 0, sessionPoints);
}

function updatePointsDisplay() {
  pointsElement.textContent = getPoints();
}

function updateChallengeButton() {
  const completedDate = storageGet("ecoverseCompletedDate") || sessionCompleted;
  if (completedDate === dateKey) {
    completeButton.disabled = true;
    completeButton.textContent = "Challenge completed ✓";
    statusElement.textContent = "Great work! You have already earned today's points.";
  }
}

completeButton.addEventListener("click", function () {
  const completedDate = storageGet("ecoverseCompletedDate") || sessionCompleted;
  if (completedDate === dateKey) {
    statusElement.textContent = "You have already completed today's challenge.";
    return;
  }

  const newTotal = getPoints() + 10;
  sessionPoints = newTotal;
  sessionCompleted = dateKey;
  storageSet("ecoversePoints", String(newTotal));
  storageSet("ecoverseCompletedDate", dateKey);

  updatePointsDisplay();
  updateChallengeButton();
  statusElement.textContent = "Well done! 10 Eco Points have been added. 🌱";
});

updatePointsDisplay();
updateChallengeButton();

// ----------------------------------------------
// FEATURE 2: WASTE SEGREGATION ASSISTANT
// ----------------------------------------------
const wasteItems = [
  { names: ["banana peel", "banana skin", "fruit peel"], category: "Biodegradable", instruction: "Place in the food/organic waste stream or compost if accepted locally." },
  { names: ["vegetable peels", "vegetable peel", "food scraps", "leftover food"], category: "Biodegradable", instruction: "Use the organic waste collection or a suitable home compost system." },
  { names: ["dry leaves", "leaves", "garden waste"], category: "Biodegradable", instruction: "Compost or use the local garden-waste collection where available." },
  { names: ["tea leaves", "coffee grounds"], category: "Biodegradable", instruction: "Usually suitable for composting; check local collection guidance." },
  { names: ["paper plate", "paper cup", "tissue box"], category: "General waste", instruction: "Food-soiled or plastic-coated paper is usually not accepted with clean paper recycling. Follow local waste rules." },
  { names: ["newspaper", "paper", "cardboard", "paper box"], category: "Recyclable", instruction: "Keep clean and dry. Recycle through an accepted paper collection service." },
  { names: ["plastic bottle", "water bottle", "pet bottle"], category: "Recyclable", instruction: "Empty and rinse. Recycle only if this plastic type is accepted locally." },
  { names: ["glass bottle", "glass jar"], category: "Recyclable", instruction: "Keep separate and follow local glass collection rules. Wrap broken glass safely." },
  { names: ["aluminium can", "soda can", "metal can"], category: "Recyclable", instruction: "Empty and rinse before placing in the accepted metal recycling stream." },
  { names: ["steel tin", "tin can"], category: "Recyclable", instruction: "Empty and rinse. Check whether metal cans are accepted in your area." },
  { names: ["clean clothes", "old clothes", "textile"], category: "Special reuse/donation", instruction: "Donate or use a textile collection point if the item is still usable." },
  { names: ["battery", "batteries", "cell battery"], category: "Hazardous / special collection", instruction: "Never put loose batteries in ordinary waste. Take them to an authorised battery collection point." },
  { names: ["mobile phone", "phone", "old charger", "electronics", "laptop"], category: "E-waste / special collection", instruction: "Give to an authorised e-waste collection or take-back programme. Do not put in regular bins." },
  { names: ["light bulb", "tube light", "fluorescent lamp"], category: "Special collection", instruction: "Some lamps contain hazardous materials. Keep intact and use an authorised collection point." },
  { names: ["paint", "paint can", "chemical"], category: "Hazardous / special collection", instruction: "Do not pour into drains or soil. Follow the product label and local hazardous-waste guidance." },
  { names: ["medicine", "expired medicine", "tablets"], category: "Special collection", instruction: "Do not flush medicines. Ask a pharmacy or local authority about safe take-back." },
  { names: ["sanitary waste", "diaper", "nappy"], category: "General / sanitary waste", instruction: "Wrap securely and follow local municipal sanitary-waste instructions." },
  { names: ["used tissue", "dirty tissue", "contaminated paper"], category: "General waste", instruction: "Usually not accepted with clean paper recycling. Follow local waste rules." },
  { names: ["chips packet", "snack wrapper", "multilayer wrapper"], category: "General / special collection", instruction: "Often not accepted in ordinary recycling. Check local collection options." },
  { names: ["cooking oil", "used oil"], category: "Special collection", instruction: "Never pour oil into a drain. Store safely and use an approved collection route where available." },
  { names: ["ceramic", "broken plate", "mirror"], category: "General / special handling", instruction: "Not usually accepted with glass bottles. Wrap sharp pieces securely and follow local rules." }
];

const wasteSearch = document.getElementById("wasteSearch");
const wasteResult = document.getElementById("wasteResult");
const searchWasteButton = document.getElementById("searchWaste");

// lower-case, strip punctuation and trailing plural "s" so "batteries"/"battery" style variants compare fairly
function normalise(text) {
  return text.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(Boolean)
    .map(function (w) { return w.length > 3 && w.endsWith("s") && !w.endsWith("ss") ? w.slice(0, -1) : w; })
    .join(" ");
}

// true when `needle` appears in `haystack` as whole words (so "phone" does NOT match "headphones")
function containsWholeWords(haystack, needle) {
  return (" " + haystack + " ").includes(" " + needle + " ");
}

function findWasteMatch(query) {
  const q = normalise(query);
  let best = null;
  let bestScore = 0;

  wasteItems.forEach(function (item) {
    item.names.forEach(function (name) {
      const n = normalise(name);
      let score = 0;
      if (n === q) score = 1000 + n.length;                          // exact match wins
      else if (containsWholeWords(q, n)) score = n.length;           // "old plastic bottle" -> "plastic bottle"
      else if (containsWholeWords(n, q)) score = q.length / 2;       // "bottle" -> "plastic bottle"
      if (score > bestScore) { bestScore = score; best = item; }
    });
  });
  return best;
}

function showResult(title, text, tag) {
  wasteResult.textContent = "";
  const h = document.createElement("h3");
  h.textContent = title;
  wasteResult.appendChild(h);
  if (tag) {
    const t = document.createElement("span");
    t.className = "category-tag";
    t.textContent = tag;
    wasteResult.appendChild(t);
  }
  const p = document.createElement("p");
  p.textContent = text;
  wasteResult.appendChild(p);
}

function searchWasteItem() {
  const query = wasteSearch.value.trim();

  if (!query) {
    showResult("Enter an item", "Type something like banana peel, battery or newspaper.");
    return;
  }

  if (query.length < 3) {
    showResult("Too short", "Please type at least 3 letters.");
    return;
  }

  const match = findWasteMatch(query);

  if (!match) {
    showResult("Item not found",
      "We do not have guidance for this item yet. Check your local municipality's waste instructions before disposing of it.");
    return;
  }

  showResult(match.category, match.instruction, "Suggested category");
}

searchWasteButton.addEventListener("click", searchWasteItem);
wasteSearch.addEventListener("keydown", function (event) {
  if (event.key === "Enter") searchWasteItem();
});

// ----------------------------------------------
// FEATURE 3: SUSTAINABILITY FACTS
// ----------------------------------------------
const facts = [
  {
    text: "The United Nations Sustainable Development Goals include a goal dedicated to climate action.",
    source: "Source: United Nations – Sustainable Development Goals, Goal 13 (sdgs.un.org/goals/goal13)"
  },
  {
    text: "Forests provide habitats for many species and support livelihoods and ecosystem services.",
    source: "Source: FAO – The State of the World's Forests (fao.org/forestry)"
  },
  {
    text: "Renewable energy comes from sources that are replenished naturally, such as sunlight and wind.",
    source: "Source: International Energy Agency (iea.org/energy-system/renewables)"
  },
  {
    text: "Reducing food waste can help save the resources used to grow, transport and prepare food.",
    source: "Source: United Nations Environment Programme (unep.org)"
  },
  {
    text: "The ocean helps regulate Earth's climate and supports a wide range of life.",
    source: "Source: NOAA Ocean Service (oceanservice.noaa.gov)"
  },
  {
    text: "Biodiversity describes the variety of life at genetic, species and ecosystem levels.",
    source: "Source: Convention on Biological Diversity (cbd.int)"
  },
  {
    text: "Keeping recyclable materials clean and separated can improve the quality of recycling.",
    source: "Source: US Environmental Protection Agency – Recycling Basics (epa.gov/recycle)"
  },
  {
    text: "Walking, cycling and public transport can be lower-emission travel options than driving alone.",
    source: "Source: United Nations – Climate Action (un.org/actnow)"
  },
  {
    text: "Freshwater is essential for people, food production and healthy ecosystems.",
    source: "Source: UNESCO – World Water Assessment Programme (unesco.org/water)"
  },
  {
    text: "Energy efficiency means using less energy to provide the same service or outcome.",
    source: "Source: International Energy Agency (iea.org/topics/energy-efficiency)"
  }
];

let factOrder = [];
let factPosition = 0;

function shuffleFacts() {
  factOrder = facts.map((fact, index) => index);
  for (let i = factOrder.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [factOrder[i], factOrder[j]] = [factOrder[j], factOrder[i]];
  }
  factPosition = 0;
}

function showFact() {
  const fact = facts[factOrder[factPosition]];
  document.getElementById("factText").textContent = fact.text;
  document.getElementById("factSource").textContent = fact.source;
  document.getElementById("factCount").textContent =
    "FACT " + (factPosition + 1) + " OF " + facts.length;
}

document.getElementById("nextFact").addEventListener("click", function () {
  factPosition++;
  if (factPosition >= facts.length) {
    shuffleFacts();
  }
  showFact();
});

shuffleFacts();
showFact();