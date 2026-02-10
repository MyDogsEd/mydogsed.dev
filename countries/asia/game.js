const countries = [
  // Central Asia
  { name: "Kazakhstan", code: "kz" },
  { name: "Uzbekistan", code: "uz" },
  { name: "Turkmenistan", code: "tm" },
  { name: "Kyrgyzstan", code: "kg" },
  { name: "Tajikistan", code: "tj" },

  // South & Southwest Asia
  { name: "Afghanistan", code: "af" },
  { name: "Pakistan", code: "pk" },
  { name: "India", code: "in" },
  { name: "Nepal", code: "np" },
  { name: "Bhutan", code: "bt" },
  { name: "Bangladesh", code: "bd" },
  { name: "Sri Lanka", code: "lk" },
  { name: "Maldives", code: "mv" },

  // East & Northeast Asia
  { name: "China", code: "cn" },
  { name: "Mongolia", code: "mn" },
  { name: "Japan", code: "jp" },
  { name: "South Korea", code: "kr" },
  { name: "North Korea", code: "kp" },
  { name: "Taiwan", code: "tw" },

  // Southeast Asia
  { name: "Myanmar", code: "mm" },
  { name: "Thailand", code: "th" },
  { name: "Laos", code: "la" },
  { name: "Cambodia", code: "kh" },
  { name: "Vietnam", code: "vn" },
  { name: "Malaysia", code: "my" },
  { name: "Singapore", code: "sg" },
  { name: "Brunei", code: "bn" },
  { name: "Indonesia", code: "id" },
  { name: "Philippines", code: "ph" },
  { name: "East Timor", code: "tl" },

  // Oceania
  { name: "Papua New Guinea", code: "pg" },
  { name: "Solomon Islands", code: "sb" },
  { name: "Australia", code: "au" },
  { name: "New Zealand", code: "nz" },
  { name: "New Caledonia", code: "nc" },
  { name: "Fiji", code: "fj" },
  { name: "Vanuatu", code: "vu" },

  // Other entities shown on the map
  { name: "United States", code: "us" }
];



let remaining = countries.sort(() => Math.random() - 0.5);
let current;
let svg;

const input = document.getElementById("answer");
const feedback = document.getElementById("feedback");
const mapContainer = document.getElementById("map-container");

// Fetch and inject SVG
fetch('asia.svg')
  .then(r => r.text())
  .then(svgText => {
    mapContainer.innerHTML = svgText;
    svg = mapContainer.querySelector('svg'); // root SVG element
    nextQuestion();
  })
  .catch(err => {
    console.error("Failed to load SVG:", err);
    mapContainer.textContent = "Failed to load map.";
  });

// -----------------------
// Class helper functions
// -----------------------

// Add or remove a class on a path or all children of a group
function updateClass(el, className, action = "add") {
  if (!el) return;
  const method = action === "add" ? "add" : "remove";

  if (el.tagName.toLowerCase() === "path") {
    el.classList[method](className);
  } else if (el.querySelectorAll) {
    const children = el.querySelectorAll("path");
    if (children.length > 0) {
      children.forEach(p => p.classList[method](className));
    } else {
      // fallback in case the group has no paths
      el.classList[method](className);
    }
  }
}

// -----------------------
// Game logic
// -----------------------

function nextQuestion() {
  if (remaining.length === 0) {
    document.getElementById("prompt").textContent = "All countries guessed correctly!";
    input.disabled = true;
    return;
  }

  clearHighlights();
  current = remaining[0]; // pick first country
  document.getElementById("prompt").textContent = `Type the country name:`;
  feedback.textContent = "";

  // highlight current country lightly
  const el = svg.getElementById(current.code);
  updateClass(el, "highlight", "add");
}

function clearHighlights() {
  svg.querySelectorAll("path, g").forEach(el => {
    if (!el.classList.contains("correct")) {
      updateClass(el, "highlight", "remove");
    }
  });
}

input.addEventListener("keydown", e => {
  if (e.key === "Enter") checkAnswer();
});

function checkAnswer() {
  const guess = normalize(input.value);
  const correctName = normalize(current.name);
  const el = svg.getElementById(current.code);

  if (!el) {
    feedback.textContent = "Map error: country not found in SVG.";
    return;
  }

  const distance = levenshtein(guess, correctName);
  const maxLen = Math.max(guess.length, correctName.length);

  // threshold: allow minor spelling mistakes
  const similarity = 1 - distance / maxLen; // 1 = perfect match

  if (similarity === 1) {
    // exact match
    updateClass(el, "correct", "add");
    feedback.textContent = "Correct!";
    remaining.shift();
    input.value = "";
  } else if (similarity >= 0.7) {
    // close enough to warn
    updateClass(el, "highlight", "add"); // temporary visual hint
    feedback.textContent = `Check your spelling! Did you mean "${current.name}"?`;
  } else {
    // really wrong
    updateClass(el, "wrong", "add");
    feedback.textContent = `Wrong — that was ${current.name}.`;

    setTimeout(() => updateClass(el, "wrong", "remove"), 1000);

    remaining.shift();
    input.value = "";
    const randIndex = Math.floor(Math.random() * (remaining.length + 1));
    remaining.splice(randIndex, 0, current);
  }

  setTimeout(nextQuestion, 800);
}


// Test function: loops through all countries and highlights them
function testAllCountries() {
  if (!svg) {
    console.warn("SVG not loaded yet!");
    return;
  }

  countries.forEach((country, index) => {
    const el = svg.getElementById(country.code);
    if (!el) {
      console.warn(`Country not found in SVG: ${country.name} (${country.code})`);
      return;
    }

    // Cycle through classes for testing
    const classType = index % 3 === 0 ? "highlight"
                     : index % 3 === 1 ? "correct"
                     : "wrong";

    updateClass(el, classType, "add");
  });

  console.log("All countries test highlight applied. Check the map!");
}


// Fuzzy checking helper functions
function normalize(str) {
  return str
    .toLowerCase()
    .normalize("NFD")         // decompose accented characters
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .trim();
}


// no idea how this works lmfao
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({length: m+1}, () => Array(n+1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i-1] === b[j-1]) dp[i][j] = dp[i-1][j-1];
      else dp[i][j] = 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
    }
  }

  return dp[m][n];
}

