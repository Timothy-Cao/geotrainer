const fs = require("fs");
const path = require("path");

// Read the flags.ts file and extract the COUNTRY_CODES map
const flagsTs = fs.readFileSync(
  path.join(__dirname, "..", "src", "lib", "flags.ts"),
  "utf-8"
);

// Parse country codes from the TS file
const codeMap = {};
const regex = /"([^"]+)":\s*"([A-Z]{2})"/g;
let match;
while ((match = regex.exec(flagsTs)) !== null) {
  codeMap[match[1]] = match[2];
}

console.log(`Flag codes available: ${Object.keys(codeMap).length}`);

function hasFlag(country) {
  return !!codeMap[country];
}

// Process flags.json
const flagsPath = path.join(__dirname, "..", "src", "data", "flags.json");
const flags = JSON.parse(fs.readFileSync(flagsPath, "utf-8"));

const filteredFlags = flags.filter((card) => {
  if (!hasFlag(card.correctAnswer)) return false;
  const validWrongs = card.wrongAnswers.filter(hasFlag);
  if (validWrongs.length < 3) return false;
  card.wrongAnswers = validWrongs.slice(0, 3);
  return true;
});

fs.writeFileSync(flagsPath, JSON.stringify(filteredFlags, null, 2));
console.log(`flags.json: ${flags.length} -> ${filteredFlags.length} cards`);

// Process flags-reverse.json
const revPath = path.join(__dirname, "..", "src", "data", "flags-reverse.json");
const rev = JSON.parse(fs.readFileSync(revPath, "utf-8"));

const filteredRev = rev.filter((card) => {
  if (!hasFlag(card.correctAnswer)) return false;
  const validWrongs = card.wrongAnswers.filter(hasFlag);
  if (validWrongs.length < 3) return false;
  card.wrongAnswers = validWrongs.slice(0, 3);
  return true;
});

fs.writeFileSync(revPath, JSON.stringify(filteredRev, null, 2));
console.log(`flags-reverse.json: ${rev.length} -> ${filteredRev.length} cards`);

// Show any flags cards with missing wrong answer flags
const missing = new Set();
[...filteredFlags, ...filteredRev].forEach((card) => {
  card.wrongAnswers.forEach((w) => {
    if (!hasFlag(w)) missing.add(w);
  });
});
if (missing.size > 0) {
  console.log(`Wrong answers missing flag codes: ${[...missing].join(", ")}`);
}
