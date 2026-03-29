const fs = require("fs");
const path = require("path");
const https = require("https");

// Natural Earth 110m countries GeoJSON
const GEOJSON_URL =
  "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson";

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "geotrainer" } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetch(res.headers.location).then(resolve).catch(reject);
      }
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
      res.on("error", reject);
    });
  });
}

// Simple Mercator projection
function project(lon, lat) {
  // Clamp latitude to avoid infinity at poles
  const clampedLat = Math.max(-85, Math.min(85, lat));
  const x = lon;
  const y = -(180 / Math.PI) * Math.log(Math.tan(Math.PI / 4 + (clampedLat * Math.PI) / 360));
  return [x, y];
}

function coordsToPath(coords) {
  return coords
    .map((ring) => {
      const points = ring.map(([lon, lat]) => project(lon, lat));
      return (
        points
          .map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`)
          .join("") + "Z"
      );
    })
    .join("");
}

function geometryToPath(geometry) {
  if (geometry.type === "Polygon") {
    return coordsToPath(geometry.coordinates);
  }
  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates.map((poly) => coordsToPath(poly)).join("");
  }
  return "";
}

function getBBox(geometry) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  function processCoords(coords) {
    for (const ring of coords) {
      for (const [lon, lat] of ring) {
        const [x, y] = project(lon, lat);
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (geometry.type === "Polygon") {
    processCoords(geometry.coordinates);
  } else if (geometry.type === "MultiPolygon") {
    geometry.coordinates.forEach((poly) => processCoords(poly));
  }

  return [minX, minY, maxX, maxY];
}

// Name mappings: our card names -> Natural Earth NAME property
const NAME_MAP = {
  "United States": "United States of America",
  "Czech Republic": "Czechia",
  "Eswatini": "eSwatini",
  "East Timor": "Timor-Leste",
  "Ivory Coast": "Côte d'Ivoire",
  "Republic of the Congo": "Republic of the Congo",
  "Democratic Republic of the Congo": "Dem. Rep. Congo",
  "North Macedonia": "North Macedonia",
  "South Korea": "South Korea",
  "North Korea": "North Korea",
  "Bosnia and Herzegovina": "Bosnia and Herz.",
  "Central African Republic": "Central African Rep.",
  "Dominican Republic": "Dominican Rep.",
  "Equatorial Guinea": "Eq. Guinea",
  "South Sudan": "S. Sudan",
  "Solomon Islands": "Solomon Is.",
  "Papua New Guinea": "Papua New Guinea",
  "Guinea-Bissau": "Guinea-Bissau",
  "Marshall Islands": "Marshall Is.",
  "Trinidad and Tobago": "Trinidad and Tobago",
  "Antigua and Barbuda": "Antigua and Barb.",
  "Saint Kitts and Nevis": "St. Kitts and Nevis",
  "Saint Lucia": "Saint Lucia",
  "Saint Vincent and the Grenadines": "St. Vin. and Gren.",
  "Sao Tome and Principe": "São Tomé and Principe",
  "Vatican City": "Vatican",
  "Cabo Verde": "Cabo Verde",
  "Brunei": "Brunei",
  "Sri Lanka": "Sri Lanka",
  "Saudi Arabia": "Saudi Arabia",
  "New Zealand": "New Zealand",
  "Costa Rica": "Costa Rica",
  "El Salvador": "El Salvador",
  "Burkina Faso": "Burkina Faso",
  "United Arab Emirates": "United Arab Emirates",
  "United Kingdom": "United Kingdom",
};

function findFeature(featureLookup, country) {
  const lookupName = NAME_MAP[country] || country;
  let feature = featureLookup.get(lookupName);
  if (feature) return feature;

  // Try partial match
  for (const [name, feat] of featureLookup) {
    if (
      name.toLowerCase() === country.toLowerCase() ||
      name.toLowerCase().includes(country.toLowerCase()) ||
      country.toLowerCase().includes(name.toLowerCase())
    ) {
      return feat;
    }
  }
  return null;
}

function makeSVG(targetPath, neighborPaths, viewBox) {
  const [vx, vy, vw, vh] = viewBox;

  const neighborPathsStr = neighborPaths
    .map((p) => `  <path d="${p}" fill="#1e1e2e" stroke="#2a2a3a" stroke-width="0.3"/>`)
    .join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vx.toFixed(1)} ${vy.toFixed(1)} ${vw.toFixed(1)} ${vh.toFixed(1)}" width="400" height="300" preserveAspectRatio="xMidYMid meet">
  <rect x="${vx.toFixed(1)}" y="${vy.toFixed(1)}" width="${vw.toFixed(1)}" height="${vh.toFixed(1)}" fill="#0e0e18"/>
${neighborPathsStr}
  <path d="${targetPath}" fill="#00e5ff" stroke="#00c4dd" stroke-width="0.4" fill-opacity="0.9"/>
</svg>`;
}

async function main() {
  console.log("Downloading Natural Earth GeoJSON...");
  const raw = await fetch(GEOJSON_URL);
  const geo = JSON.parse(raw);
  console.log(`Got ${geo.features.length} features`);

  // Read our country data
  const shapesPath = path.join(__dirname, "..", "src", "data", "country-shapes.json");
  const shapes = JSON.parse(fs.readFileSync(shapesPath, "utf-8"));
  const countries = new Set(shapes.map((s) => s.correctAnswer));

  const revPath = path.join(__dirname, "..", "src", "data", "shapes-reverse.json");
  if (fs.existsSync(revPath)) {
    const rev = JSON.parse(fs.readFileSync(revPath, "utf-8"));
    rev.forEach((r) => countries.add(r.correctAnswer));
    rev.forEach((r) => r.wrongAnswers.forEach((w) => countries.add(w)));
  }
  shapes.forEach((s) => s.wrongAnswers.forEach((w) => countries.add(w)));

  const outDir = path.join(__dirname, "..", "public", "shapes");

  // Build lookup
  const featureLookup = new Map();
  for (const feature of geo.features) {
    const props = feature.properties;
    const names = [
      props.NAME,
      props.NAME_LONG,
      props.FORMAL_EN,
      props.SOVEREIGNT,
      props.ADMIN,
      props.BRK_NAME,
      props.ABBREV,
    ].filter(Boolean);
    for (const n of names) {
      if (!featureLookup.has(n)) {
        featureLookup.set(n, feature);
      }
    }
  }

  // Precompute all paths for neighbor rendering
  const allPaths = new Map();
  for (const feature of geo.features) {
    if (feature.geometry) {
      const p = geometryToPath(feature.geometry);
      if (p) allPaths.set(feature, p);
    }
  }

  let generated = 0;
  let missing = [];

  for (const country of countries) {
    const feature = findFeature(featureLookup, country);

    if (!feature || !feature.geometry) {
      missing.push(country);
      continue;
    }

    const targetPath = geometryToPath(feature.geometry);
    if (!targetPath) {
      missing.push(country);
      continue;
    }

    // Get bounding box of target country
    const [minX, minY, maxX, maxY] = getBBox(feature.geometry);
    const cw = maxX - minX;
    const ch = maxY - minY;

    // Add padding to show surrounding context (at least 50% extra on each side)
    const padX = Math.max(cw * 0.7, 15);
    const padY = Math.max(ch * 0.7, 15);
    const vx = minX - padX;
    const vy = minY - padY;
    const vw = cw + padX * 2;
    const vh = ch + padY * 2;

    // Find all features that overlap with our view
    const neighborPaths = [];
    for (const [feat, p] of allPaths) {
      if (feat === feature) continue; // skip target
      const [fMinX, fMinY, fMaxX, fMaxY] = getBBox(feat.geometry);
      // Check if this feature's bbox overlaps with our view
      if (fMaxX >= vx && fMinX <= vx + vw && fMaxY >= vy && fMinY <= vy + vh) {
        neighborPaths.push(p);
      }
    }

    const svg = makeSVG(targetPath, neighborPaths, [vx, vy, vw, vh]);

    const filename =
      country
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "") + ".svg";
    fs.writeFileSync(path.join(outDir, filename), svg);
    generated++;
  }

  console.log(`Generated ${generated} contextual map SVGs`);
  if (missing.length > 0) {
    console.log(`Missing (${missing.length}): ${missing.join(", ")}`);
  }

  // Update country-shapes.json with image paths
  const updatedShapes = shapes.map((card) => {
    const filename =
      card.correctAnswer
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "") + ".svg";
    const filepath = path.join(outDir, filename);
    if (fs.existsSync(filepath)) {
      return { ...card, image: `/shapes/${filename}` };
    }
    return card;
  });
  fs.writeFileSync(shapesPath, JSON.stringify(updatedShapes, null, 2));
  console.log("Updated country-shapes.json with image paths");

  if (fs.existsSync(revPath)) {
    const rev = JSON.parse(fs.readFileSync(revPath, "utf-8"));
    const updatedRev = rev.map((card) => {
      const filename =
        card.correctAnswer
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "") + ".svg";
      const filepath = path.join(outDir, filename);
      if (fs.existsSync(filepath)) {
        return { ...card, image: `/shapes/${filename}` };
      }
      return card;
    });
    fs.writeFileSync(revPath, JSON.stringify(updatedRev, null, 2));
    console.log("Updated shapes-reverse.json with image paths");
  }
}

main().catch(console.error);
