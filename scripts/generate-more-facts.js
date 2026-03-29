const fs = require("fs");
const path = require("path");

// Read existing facts to avoid duplicates
const factsPath = path.join(__dirname, "..", "src", "data", "facts.json");
const existing = JSON.parse(fs.readFileSync(factsPath, "utf-8"));
const existingCountries = new Set(existing.map((c) => c.correctAnswer));

// Additional facts data - each entry: [id, question, hint, correct, wrongs, explanation]
const newFacts = [
  [
    "facts-singapore-water-01",
    "This city-state imports most of its water from a neighboring country and has built massive reservoirs and desalination plants to reduce dependence.",
    "It's one of the smallest but wealthiest countries in Southeast Asia.",
    "Singapore",
    ["Hong Kong", "Bahrain", "Malta"],
    "Singapore imports water from Malaysia via pipelines across the Johor Strait. The country has invested heavily in desalination, rainwater harvesting (Marina Barrage), and recycled water (NEWater).",
  ],
  [
    "facts-chile-length-01",
    "This country stretches over 4,300 km from north to south but averages only 177 km wide, making it the longest and narrowest country in the world.",
    "It runs along the western edge of South America.",
    "Chile",
    ["Argentina", "Peru", "Norway"],
    "Chile extends from the Atacama Desert in the north to Patagonian glaciers in the south. Despite its narrow width, it encompasses deserts, Mediterranean valleys, temperate rainforests, and Antarctic territory.",
  ],
  [
    "facts-mexico-pyramids-01",
    "This country has more pyramids than Egypt, with estimates of over 10,000 ancient pyramidal structures across its territory.",
    "It's in North America, south of the United States.",
    "Mexico",
    ["Peru", "Guatemala", "Honduras"],
    "Mexico has thousands of pyramids built by Aztec, Maya, Zapotec, and other civilizations. Many remain unexcavated. The Pyramid of the Sun in Teotihuacan is one of the largest in the Western Hemisphere.",
  ],
  [
    "facts-panama-sunrise-01",
    "Due to the S-shape of its isthmus, this is the only country where you can watch the sun rise over the Pacific Ocean and set over the Atlantic.",
    "It's famous for a canal connecting two oceans.",
    "Panama",
    ["Costa Rica", "Colombia", "Nicaragua"],
    "The Isthmus of Panama runs roughly east-west at certain points, meaning the Pacific is to the east and Atlantic to the west in some areas, reversing the typical ocean-side expectations.",
  ],
  [
    "facts-bangladesh-rivers-01",
    "This country is the world's largest river delta, formed where the Ganges and Brahmaputra rivers meet, with over 700 rivers flowing through it.",
    "It's a densely populated South Asian country surrounded mostly by India.",
    "Bangladesh",
    ["India", "Myanmar", "Nepal"],
    "Bangladesh sits on the Bengal Delta, the largest delta on Earth. The country has over 700 rivers and roughly 80% of the land is floodplain. Seasonal flooding affects about a third of the country annually.",
  ],
  [
    "facts-switzerland-neutral-01",
    "This country has not fought in a foreign war since 1815, maintaining armed neutrality for over 200 years, yet has mandatory military service.",
    "It's a landlocked country in Central Europe, famous for chocolate, watches, and banking.",
    "Switzerland",
    ["Austria", "Sweden", "Finland"],
    "Switzerland's neutrality was formally established at the Congress of Vienna in 1815. Despite this, it maintains a well-trained citizens' militia and requires military service for male citizens.",
  ],
  [
    "facts-denmark-lego-01",
    "This country invented LEGO bricks, and its LEGOLAND theme park was the first of its kind. The name comes from this country's words for 'play well.'",
    "It's a Scandinavian kingdom consisting of a peninsula and islands.",
    "Denmark",
    ["Sweden", "Netherlands", "Germany"],
    "LEGO was founded in Billund, Denmark in 1932 by Ole Kirk Christiansen. The name combines the Danish words 'leg godt' meaning 'play well.' The original LEGOLAND park opened in Billund in 1968.",
  ],
  [
    "facts-new-zealand-sheep-01",
    "This country has roughly 5 sheep for every human — about 26 million sheep for a population of around 5 million people.",
    "It's an island nation in the southwestern Pacific Ocean.",
    "New Zealand",
    ["Australia", "Ireland", "Uruguay"],
    "New Zealand's sheep population, while still large, has actually declined from a peak of 70 million in 1982. Wool and lamb remain major exports, and the country has more farm animals than people.",
  ],
  [
    "facts-costa-rica-army-01",
    "This country abolished its military in 1948 and redirected the defense budget to education and healthcare, becoming one of the most stable democracies in Latin America.",
    "It's a Central American country known for its biodiversity and 'Pura Vida' lifestyle.",
    "Costa Rica",
    ["Panama", "Uruguay", "Iceland"],
    "After a brief civil war in 1948, President Jose Figueres Ferrer abolished the army. The funds were redirected to education, healthcare, and environmental conservation. The country now has a 97% literacy rate.",
  ],
  [
    "facts-ethiopia-coffee-01",
    "This country is considered the birthplace of coffee — legend says a goat herder named Kaldi discovered the beans when his goats became energetic after eating them.",
    "It's in the Horn of Africa with one of the oldest civilizations in the world.",
    "Ethiopia",
    ["Colombia", "Brazil", "Kenya"],
    "Coffee originated in the Kaffa region of Ethiopia. The country has an elaborate coffee ceremony culture, and coffee (called 'buna') is central to social life. Ethiopia remains Africa's top coffee producer.",
  ],
  [
    "facts-netherlands-below-sea-01",
    "About one-third of this country lies below sea level, protected by an extensive system of dikes, dams, and storm surge barriers.",
    "It's a small, flat country in Western Europe known for windmills and tulips.",
    "Netherlands",
    ["Belgium", "Denmark", "Germany"],
    "The Netherlands' lowest point is 6.76 meters below sea level. The Dutch have been reclaiming land from the sea for centuries. The Delta Works flood protection system is considered one of the Seven Wonders of the Modern World.",
  ],
  [
    "facts-peru-potato-01",
    "This country is home to over 3,000 varieties of potatoes — the tuber was first domesticated here around 8,000 years ago.",
    "It's on the western coast of South America, home to Machu Picchu.",
    "Peru",
    ["Bolivia", "Ireland", "Colombia"],
    "Peru's Andean communities cultivate over 3,000 potato varieties in colors ranging from purple to yellow to red. The potato was domesticated near Lake Titicaca and spread worldwide after Spanish contact.",
  ],
  [
    "facts-india-postal-01",
    "This country has the largest postal network in the world — over 155,000 post offices, including one that floats on a lake.",
    "It's the most populous country in the world as of 2023.",
    "India",
    ["China", "Indonesia", "United States"],
    "India Post operates over 155,000 post offices, roughly 90% in rural areas. The floating post office sits on Dal Lake in Srinagar, Kashmir. India also has one of the world's highest post offices in Hikkim, Himachal Pradesh.",
  ],
  [
    "facts-madagascar-unique-01",
    "About 90% of this island country's wildlife is found nowhere else on Earth, including lemurs, chameleons, and baobab trees.",
    "It's the world's fourth-largest island, off the southeast coast of Africa.",
    "Madagascar",
    ["Sri Lanka", "Indonesia", "Papua New Guinea"],
    "Madagascar separated from India about 88 million years ago, allowing its species to evolve in isolation. It has over 100 species of lemurs, nearly half the world's chameleon species, and 6 of the world's 8 baobab species.",
  ],
  [
    "facts-south-africa-capitals-01",
    "This country has three capital cities — one for each branch of government: executive, legislative, and judicial.",
    "It's at the southern tip of Africa, known for its diverse landscapes and history.",
    "South Africa",
    ["Malaysia", "Tanzania", "Nigeria"],
    "South Africa's three capitals are Pretoria (executive/administrative), Cape Town (legislative/parliament), and Bloemfontein (judicial/supreme court). This arrangement was a compromise when the Union of South Africa was formed in 1910.",
  ],
  [
    "facts-japan-trains-01",
    "This country's bullet trains have an average delay of less than 1 minute per year, and conductors bow to passengers when entering and leaving each car.",
    "It's an island nation in East Asia.",
    "Japan",
    ["South Korea", "Germany", "Switzerland"],
    "Japan's Shinkansen (bullet train) network has operated since 1964 with an extraordinary safety and punctuality record. The average delay across the entire system is typically under 60 seconds per year.",
  ],
  [
    "facts-kenya-marathon-01",
    "Athletes from this country have won about 75% of all major marathon titles in the last two decades, particularly runners from the Kalenjin ethnic group.",
    "It's in East Africa, on the equator.",
    "Kenya",
    ["Ethiopia", "Tanzania", "Uganda"],
    "Kenyan runners, especially from the Kalenjin community in the Rift Valley highlands, dominate distance running. Training at high altitude (around 2,400m) and a culture of running from childhood contribute to their success.",
  ],
  [
    "facts-canada-maple-01",
    "This country produces about 75% of the world's maple syrup, mostly from one province that has a strategic reserve of the sweetener.",
    "It's the second-largest country by area, in North America.",
    "Canada",
    ["United States", "Russia", "Finland"],
    "Quebec produces roughly 75% of the world's maple syrup. The Federation of Quebec Maple Syrup Producers maintains a Global Strategic Maple Syrup Reserve — warehouses holding millions of pounds of syrup to stabilize supply.",
  ],
  [
    "facts-germany-bread-01",
    "This country has over 3,200 officially recognized varieties of bread — more than any other country — and bread culture here is on the UNESCO intangible heritage list.",
    "It's the most populous country in the European Union.",
    "Germany",
    ["France", "Italy", "Austria"],
    "Germany's bread culture (Brotkultur) was added to the UNESCO Intangible Cultural Heritage list in 2014. The German Bread Institute has registered over 3,200 varieties, from dense rye pumpernickel to soft pretzels.",
  ],
  [
    "facts-philippines-text-01",
    "This country sends more text messages per day than the United States and Europe combined, earning it the nickname 'the texting capital of the world.'",
    "It's an archipelago of over 7,600 islands in Southeast Asia.",
    "Philippines",
    ["Indonesia", "India", "Vietnam"],
    "Filipinos send billions of text messages annually. The texting culture took off in the early 2000s due to affordable prepaid plans and the social nature of Filipino culture. SMS was even used to organize political protests.",
  ],
  [
    "facts-egypt-calendar-01",
    "This country created the first 365-day calendar, dividing the year into 12 months of 30 days each, plus 5 extra days — over 4,000 years ago.",
    "It's home to the only surviving ancient wonder of the world.",
    "Egypt",
    ["Greece", "Iraq", "China"],
    "Ancient Egyptians developed the 365-day solar calendar around 3000 BC, based on the annual flooding of the Nile and the star Sirius. This calendar became the basis for the Julian and eventually Gregorian calendars.",
  ],
  [
    "facts-spain-olive-01",
    "This country produces nearly half of the world's olive oil — about 1.5 million tonnes per year — with olive groves covering over 2.5 million hectares.",
    "It's on the Iberian Peninsula in southern Europe.",
    "Spain",
    ["Italy", "Greece", "Portugal"],
    "Spain produces about 44% of the world's olive oil, with the region of Andalusia alone accounting for roughly 75% of Spanish production. The country has over 300 million olive trees.",
  ],
  [
    "facts-italy-heritage-01",
    "This country has the most UNESCO World Heritage Sites of any nation — over 55 cultural and natural sites recognized for their outstanding universal value.",
    "It's a boot-shaped peninsula in Southern Europe.",
    "Italy",
    ["Spain", "China", "France"],
    "Italy leads the world with over 55 UNESCO World Heritage Sites, including the Colosseum, Venice, the Amalfi Coast, Pompeii, and the historic centers of Florence and Rome. China is the close second.",
  ],
  [
    "facts-morocco-university-01",
    "This country is home to the oldest continuously operating university in the world, founded in 859 AD.",
    "It's in North Africa, across the Strait of Gibraltar from Europe.",
    "Morocco",
    ["Egypt", "Iraq", "Tunisia"],
    "The University of al-Qarawiyyin in Fez, Morocco was founded in 859 AD by Fatima al-Fihri. It has been in continuous operation since, making it the oldest existing and continually operating educational institution in the world.",
  ],
  [
    "facts-ireland-halloween-01",
    "Halloween originated in this country as the ancient Celtic festival of Samhain, which marked the end of the harvest season and the beginning of winter.",
    "It's an island nation in the North Atlantic, west of Great Britain.",
    "Ireland",
    ["Scotland", "United Kingdom", "Wales"],
    "The Celtic festival of Samhain, celebrated on October 31st, originated in Ireland over 2,000 years ago. Celts believed the boundary between the living and dead became thin. Irish immigrants brought Halloween traditions to America.",
  ],
];

// Convert to card objects and merge
const newCards = newFacts
  .filter(([, , , correct]) => !existingCountries.has(correct))
  .map(([id, question, hint, correct, wrongs, explanation]) => ({
    id,
    category: "facts",
    question,
    hint,
    image: "",
    correctAnswer: correct,
    wrongAnswers: wrongs,
    explanation,
  }));

// Also add duplicates that have different facts (same country, different fact)
const dupeCards = newFacts
  .filter(([, , , correct]) => existingCountries.has(correct))
  .map(([id, question, hint, correct, wrongs, explanation]) => ({
    id,
    category: "facts",
    question,
    hint,
    image: "",
    correctAnswer: correct,
    wrongAnswers: wrongs,
    explanation,
  }));

const allFacts = [...existing, ...newCards, ...dupeCards];

fs.writeFileSync(factsPath, JSON.stringify(allFacts, null, 2));
console.log(
  `Facts: ${existing.length} existing + ${newCards.length} new countries + ${dupeCards.length} additional facts = ${allFacts.length} total`
);
