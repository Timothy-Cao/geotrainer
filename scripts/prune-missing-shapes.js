const fs = require("fs");
const path = require("path");

const shapesDir = path.join(__dirname, "..", "public", "shapes");
const availableSVGs = new Set(
  fs.readdirSync(shapesDir).map((f) => f.replace(".svg", ""))
);

function countryToFilename(name) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function hasShape(country) {
  return availableSVGs.has(countryToFilename(country));
}

// Process country-shapes.json
const shapesPath = path.join(__dirname, "..", "src", "data", "country-shapes.json");
const shapes = JSON.parse(fs.readFileSync(shapesPath, "utf-8"));

// Keep only cards where the correct answer AND all wrong answers have shapes
const filteredShapes = shapes.filter((card) => {
  if (!hasShape(card.correctAnswer)) return false;
  const validWrongs = card.wrongAnswers.filter(hasShape);
  if (validWrongs.length < 3) return false;
  card.wrongAnswers = validWrongs.slice(0, 3);
  return true;
});

fs.writeFileSync(shapesPath, JSON.stringify(filteredShapes, null, 2));
console.log(`country-shapes.json: ${shapes.length} -> ${filteredShapes.length} cards`);

// Process shapes-reverse.json
const revPath = path.join(__dirname, "..", "src", "data", "shapes-reverse.json");
const rev = JSON.parse(fs.readFileSync(revPath, "utf-8"));

const filteredRev = rev.filter((card) => {
  if (!hasShape(card.correctAnswer)) return false;
  const validWrongs = card.wrongAnswers.filter(hasShape);
  if (validWrongs.length < 3) return false;
  card.wrongAnswers = validWrongs.slice(0, 3);
  return true;
});

fs.writeFileSync(revPath, JSON.stringify(filteredRev, null, 2));
console.log(`shapes-reverse.json: ${rev.length} -> ${filteredRev.length} cards`);

// Show which countries have shapes available
const shapesCountries = new Set(filteredShapes.map((c) => c.correctAnswer));
const allCountriesWithShapes = [...availableSVGs].length;
console.log(`Total SVG files available: ${allCountriesWithShapes}`);
