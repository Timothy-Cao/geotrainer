// Country name → ISO 3166-1 alpha-2 code for emoji flag rendering
const COUNTRY_CODES: Record<string, string> = {
  "Japan": "JP",
  "France": "FR",
  "Germany": "DE",
  "Italy": "IT",
  "Brazil": "BR",
  "India": "IN",
  "South Korea": "KR",
  "Turkey": "TR",
  "Canada": "CA",
  "Australia": "AU",
  "United Kingdom": "GB",
  "Sweden": "SE",
  "Norway": "NO",
  "Finland": "FI",
  "Denmark": "DK",
  "Switzerland": "CH",
  "Netherlands": "NL",
  "Belgium": "BE",
  "Ireland": "IE",
  "Mexico": "MX",
  "Argentina": "AR",
  "Colombia": "CO",
  "Thailand": "TH",
  "Indonesia": "ID",
  "Poland": "PL",
  "Bangladesh": "BD",
  "Palau": "PW",
  "Luxembourg": "LU",
  "Romania": "RO",
  "Austria": "AT",
  "Spain": "ES",
  "China": "CN",
  "Nigeria": "NG",
  "Ivory Coast": "CI",
  "Monaco": "MC",
  "Chad": "TD",
  "Hungary": "HU",
  "Russia": "RU",
  "Ukraine": "UA",
  "Czech Republic": "CZ",
  "Philippines": "PH",
  "Cuba": "CU",
  "Chile": "CL",
  "New Zealand": "NZ",
  "Peru": "PE",
  "Egypt": "EG",
  "South Africa": "ZA",
  "Kenya": "KE",
  "Greece": "GR",
  "Portugal": "PT",
  "Singapore": "SG",
  "Malaysia": "MY",
  "Vietnam": "VN",
  "Pakistan": "PK",
  "Saudi Arabia": "SA",
  "United States": "US",
  "Nepal": "NP",
  "Sri Lanka": "LK",
  "Madagascar": "MG",
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
  return `https://flagcdn.com/w320/${code.toLowerCase()}.png`;
}
