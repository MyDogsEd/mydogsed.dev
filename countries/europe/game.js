// export the array so other scripts can import it
const countries = [
  { name: "Albania", code: "al" },
  { name: "Armenia", code: "am" },
  { name: "Austria", code: "at" },
  { name: "Azerbaijan", code: "az" },
  { name: "Belarus", code: "by" },
  { name: "Belgium", code: "be" },
  { name: "Bosnia and Herzegovina", code: "ba" },
  { name: "Bulgaria", code: "bg" },
  { name: "Croatia", code: "hr" },
  { name: "Cyprus", code: "cy" },
  { name: "Czech Republic", code: "cz" },
  { name: "Denmark", code: "dk" },
  { name: "Estonia", code: "ee" },
  { name: "Finland", code: "fi" },
  { name: "France", code: "fr" },
  { name: "Georgia", code: "ge" },
  { name: "Germany", code: "de" },
  { name: "Greece", code: "gr" },
  { name: "Hungary", code: "hu" },
  { name: "Iceland", code: "is" },
  { name: "Ireland", code: "ie" },
  { name: "Italy", code: "it" },
  { name: "Kosovo", code: "xk" },
  { name: "Latvia", code: "lv" },
  { name: "Lithuania", code: "lt" },
  { name: "Luxembourg", code: "lu" },
  { name: "Moldova", code: "md" },
  { name: "Montenegro", code: "me" },
  { name: "Netherlands", code: "nl" },
  { name: "North Macedonia", code: "mk" },
  { name: "Norway", code: "no" },
  { name: "Poland", code: "pl" },
  { name: "Portugal", code: "pt" },
  { name: "Romania", code: "ro" },
  { name: "Russia", code: "ru" },
  { name: "Serbia", code: "rs" },
  { name: "Slovakia", code: "sk" },
  { name: "Slovenia", code: "si" },
  { name: "Spain", code: "es" },
  { name: "Sweden", code: "se" },
  { name: "Switzerland", code: "ch" },
  { name: "Türkiye", code: "tr" },
  { name: "Ukraine", code: "ua" },
  { name: "United Kingdom", code: "gb" }
];


let remaining = countries.sort(() => Math.random() - 0.5);
let current;
let svg;

const input = document.getElementById("answer");
const feedback = document.getElementById("feedback");
const mapContainer = document.getElementById("map-container");

// Fetch and inject SVG
fetch('europe.svg')
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

