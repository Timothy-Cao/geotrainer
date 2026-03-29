const fs = require("fs");
const path = require("path");
const https = require("https");

// Natural Earth 110m countries GeoJSON (small file, simple outlines)
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

// Project lon/lat to simple x/y (Mercator-like, clamped)
function project(lon, lat) {
  const x = lon;
  const y = -lat; // flip y so north is up
  return [x, y];
}

function coordsToPath(coords) {
  return coords
    .map((ring) => {
      const points = ring.map(([lon, lat]) => project(lon, lat));
      return (
        points
          .map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(2)},${p[1].toFixed(2)}`)
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

function makeSVG(pathData, bbox) {
  const [minX, minY, maxX, maxY] = bbox;
  const padding = 2;
  const vx = minX - padding;
  const vy = minY - padding;
  const vw = maxX - minX + padding * 2;
  const vh = maxY - minY + padding * 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vx.toFixed(2)} ${vy.toFixed(2)} ${vw.toFixed(2)} ${vh.toFixed(2)}" width="300" height="300" preserveAspectRatio="xMidYMid meet">
  <path d="${pathData}" fill="#00e5ff" stroke="#00e5ff" stroke-width="0.5" fill-opacity="0.8"/>
</svg>`;
}

function getBBox(pathData) {
  const nums = pathData.match(/[-\d.]+/g).map(Number);
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (let i = 0; i < nums.length; i += 2) {
    if (isNaN(nums[i]) || isNaN(nums[i + 1])) continue;
    minX = Math.min(minX, nums[i]);
    minY = Math.min(minY, nums[i + 1]);
    maxX = Math.max(maxX, nums[i]);
    maxY = Math.max(maxY, nums[i + 1]);
  }
  return [minX, minY, maxX, maxY];
}

// Name mappings: our card names -> Natural Earth NAME property
const NAME_MAP = {
  "United States": "United States of America",
  "United Kingdom": "United Kingdom",
  "South Korea": "South Korea",
  "North Korea": "North Korea",
  "Czech Republic": "Czechia",
  "Ivory Coast": "Ivory Coast",
  "Republic of the Congo": "Republic of the Congo",
  "Democratic Republic of the Congo": "Democratic Republic of the Congo",
  "East Timor": "East Timor",
  "Eswatini": "eSwatini",
  "Cabo Verde": "Cabo Verde",
  "Bosnia and Herzegovina": "Bosnia and Herzegovina",
  "North Macedonia": "North Macedonia",
  "Dominican Republic": "Dominican Republic",
  "Central African Republic": "Central African Republic",
  "South Sudan": "South Sudan",
  "Papua New Guinea": "Papua New Guinea",
  "Solomon Islands": "Solomon Islands",
  "Equatorial Guinea": "Equatorial Guinea",
  "Trinidad and Tobago": "Trinidad and Tobago",
  "Antigua and Barbuda": "Antigua and Barbuda",
  "Saint Kitts and Nevis": "Saint Kitts and Nevis",
  "Saint Lucia": "Saint Lucia",
  "Saint Vincent and the Grenadines": "Saint Vincent and the Grenadines",
  "Sao Tome and Principe": "Sao Tome and Principe",
  "Guinea-Bissau": "Guinea-Bissau",
  "Marshall Islands": "Marshall Islands",
  "Sierra Leone": "Sierra Leone",
  "Sri Lanka": "Sri Lanka",
  "Saudi Arabia": "Saudi Arabia",
  "New Zealand": "New Zealand",
  "Costa Rica": "Costa Rica",
  "El Salvador": "El Salvador",
  "Burkina Faso": "Burkina Faso",
  "United Arab Emirates": "United Arab Emirates",
  "Vatican City": "Vatican",
};

async function main() {
  console.log("Downloading Natural Earth GeoJSON...");
  const raw = await fetch(GEOJSON_URL);
  const geo = JSON.parse(raw);
  console.log(`Got ${geo.features.length} features`);

  // Read our country shapes data
  const shapesPath = path.join(__dirname, "..", "src", "data", "country-shapes.json");
  const shapes = JSON.parse(fs.readFileSync(shapesPath, "utf-8"));
  const countries = new Set(shapes.map((s) => s.correctAnswer));

  // Also get countries from shapes-reverse
  const revPath = path.join(__dirname, "..", "src", "data", "shapes-reverse.json");
  if (fs.existsSync(revPath)) {
    const rev = JSON.parse(fs.readFileSync(revPath, "utf-8"));
    rev.forEach((r) => countries.add(r.correctAnswer));
    // Also add wrong answers since they need shapes too for reverse mode
    rev.forEach((r) => r.wrongAnswers.forEach((w) => countries.add(w)));
  }

  // Also add wrong answers from shapes
  shapes.forEach((s) => s.wrongAnswers.forEach((w) => countries.add(w)));

  const outDir = path.join(__dirname, "..", "public", "shapes");

  // Build lookup of Natural Earth features by various name fields
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

  let generated = 0;
  let missing = [];

  for (const country of countries) {
    // Try direct match, then our name map
    const lookupName = NAME_MAP[country] || country;
    let feature = featureLookup.get(lookupName);

    // Fuzzy fallback: try partial match
    if (!feature) {
      for (const [name, feat] of featureLookup) {
        if (name.toLowerCase().includes(country.toLowerCase()) ||
            country.toLowerCase().includes(name.toLowerCase())) {
          feature = feat;
          break;
        }
      }
    }

    if (!feature || !feature.geometry) {
      missing.push(country);
      continue;
    }

    const pathData = geometryToPath(feature.geometry);
    if (!pathData) {
      missing.push(country);
      continue;
    }

    const bbox = getBBox(pathData);
    const svg = makeSVG(pathData, bbox);

    // Filename: lowercase, spaces to hyphens
    const filename = country.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + ".svg";
    fs.writeFileSync(path.join(outDir, filename), svg);
    generated++;
  }

  console.log(`Generated ${generated} SVG silhouettes`);
  if (missing.length > 0) {
    console.log(`Missing (${missing.length}): ${missing.join(", ")}`);
  }

  // Update country-shapes.json to add image paths
  const updatedShapes = shapes.map((card) => {
    const filename = card.correctAnswer.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + ".svg";
    const filepath = path.join(outDir, filename);
    if (fs.existsSync(filepath)) {
      return { ...card, image: `/shapes/${filename}` };
    }
    return card;
  });
  fs.writeFileSync(shapesPath, JSON.stringify(updatedShapes, null, 2));
  console.log("Updated country-shapes.json with image paths");

  // Update shapes-reverse.json too
  if (fs.existsSync(revPath)) {
    const rev = JSON.parse(fs.readFileSync(revPath, "utf-8"));
    const updatedRev = rev.map((card) => {
      const filename = card.correctAnswer.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + ".svg";
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
