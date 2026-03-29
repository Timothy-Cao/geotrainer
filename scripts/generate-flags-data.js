const fs = require("fs");
const path = require("path");

// ISO 3166-1 alpha-2 lookup via Intl API
// We'll use a hardcoded comprehensive map generated from standard sources
const CODE_MAP = {};

// Use Intl.DisplayNames to reverse-lookup: iterate all 2-letter codes
for (let i = 0; i < 26; i++) {
  for (let j = 0; j < 26; j++) {
    const code = String.fromCharCode(65 + i) + String.fromCharCode(65 + j);
    try {
      const dn = new Intl.DisplayNames(["en"], { type: "region" });
      const name = dn.of(code);
      if (name && name !== code) {
        CODE_MAP[name] = code;
      }
    } catch (e) {
      // invalid code, skip
    }
  }
}

// Manual overrides for names that don't match Intl output exactly
const OVERRIDES = {
  "Ivory Coast": "CI",
  "Cabo Verde": "CV",
  "East Timor": "TL",
  "Eswatini": "SZ",
  "Micronesia": "FM",
  "Republic of the Congo": "CG",
  "Democratic Republic of the Congo": "CD",
  "Sao Tome and Principe": "ST",
  "Saint Kitts and Nevis": "KN",
  "Saint Lucia": "LC",
  "Saint Vincent and the Grenadines": "VC",
  "Vatican City": "VA",
  "Antigua and Barbuda": "AG",
  "Bosnia and Herzegovina": "BA",
  "Brunei": "BN",
  "Czech Republic": "CZ",
  "Guinea-Bissau": "GW",
  "Marshall Islands": "MH",
  "North Macedonia": "MK",
  "Papua New Guinea": "PG",
  "Solomon Islands": "SB",
  "South Korea": "KR",
  "South Sudan": "SS",
  "Sri Lanka": "LK",
  "Trinidad and Tobago": "TT",
  "United Arab Emirates": "AE",
  "United Kingdom": "GB",
  "United States": "US",
  "Myanmar": "MM",
  "Palestine": "PS",
  "Turkey": "TR",
};

Object.assign(CODE_MAP, OVERRIDES);

// Read existing flags.json
const flagsPath = path.join(__dirname, "..", "src", "data", "flags.json");
const flags = JSON.parse(fs.readFileSync(flagsPath, "utf-8"));

// 1. Generate flags.ts
const entries = [];
const missing = [];
for (const card of flags) {
  const country = card.correctAnswer;
  const code = CODE_MAP[country];
  if (code) {
    entries.push(`  "${country}": "${code}"`);
  } else {
    missing.push(country);
  }
  // Also check wrong answers
  for (const wa of card.wrongAnswers) {
    if (!CODE_MAP[wa] && !missing.includes(wa)) {
      // try to find it
    }
  }
}

const flagsTs = `// Country name to ISO 3166-1 alpha-2 code mapping
const COUNTRY_CODES: Record<string, string> = {
${entries.join(",\n")},
};

export function countryToFlag(country: string): string {
  const code = COUNTRY_CODES[country];
  if (!code) return "";
  return code
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");
}

export function countryToFlagUrl(country: string): string {
  const code = COUNTRY_CODES[country];
  if (!code) return "";
  return \`https://flagcdn.com/w320/\${code.toLowerCase()}.png\`;
}
`;

const flagsTsPath = path.join(__dirname, "..", "src", "lib", "flags.ts");
fs.writeFileSync(flagsTsPath, flagsTs);
console.log(`Generated flags.ts with ${entries.length} country codes`);
if (missing.length > 0) {
  console.log(`Missing codes for: ${missing.join(", ")}`);
}

// 2. Generate flags-reverse.json
const reverseCards = flags.map((card) => {
  const id = card.id.replace("flags-", "flags-rev-");
  return {
    id,
    category: "flags-reverse",
    question: `Which flag belongs to ${card.correctAnswer}?`,
    hint: "",
    image: "",
    correctAnswer: card.correctAnswer,
    wrongAnswers: card.wrongAnswers,
    explanation: card.explanation,
  };
});

const reversePath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "flags-reverse.json"
);
fs.writeFileSync(reversePath, JSON.stringify(reverseCards, null, 2));
console.log(`Generated flags-reverse.json with ${reverseCards.length} cards`);
