const fs = require("fs");
const path = require("path");

const factsPath = path.join(__dirname, "..", "src", "data", "facts.json");
const existing = JSON.parse(fs.readFileSync(factsPath, "utf-8"));

// Currency facts
const currencyFacts = [
  [
    "facts-currency-japan-01",
    "This country's currency, the yen, has no subunit (no cents) — the smallest coin is worth 1 unit, and the highest banknote features author Shibusawa Eiichi.",
    "An island nation in East Asia.",
    "Japan",
    ["China", "South Korea", "Taiwan"],
    "The Japanese yen has no subdivision. One yen coins are made of aluminum and are so light they can float on water. Japan introduced new banknote designs in 2024.",
  ],
  [
    "facts-currency-uk-01",
    "This country's currency is the oldest still in use, dating back over 1,200 years. Its name comes from the Latin word 'pondus' meaning weight.",
    "An island nation in Western Europe.",
    "United Kingdom",
    ["France", "Germany", "Netherlands"],
    "The British pound sterling has been in continuous use since around 775 AD. It was originally equal to the value of one pound weight of silver.",
  ],
  [
    "facts-currency-kuwait-01",
    "This country has the highest-valued currency unit in the world — one unit of its currency equals roughly $3.25 USD.",
    "A small, oil-rich nation on the Persian Gulf.",
    "Kuwait",
    ["Qatar", "Saudi Arabia", "United Arab Emirates"],
    "The Kuwaiti dinar is the world's most valuable currency unit. Kuwait's wealth from oil reserves supports the dinar's high value.",
  ],
  [
    "facts-currency-india-01",
    "This country's currency symbol was designed through a national competition in 2010, combining the Devanagari letter 'Ra' with a horizontal line.",
    "The most populous country in the world.",
    "India",
    ["Nepal", "Sri Lanka", "Bangladesh"],
    "The Indian rupee symbol was designed by D. Udaya Kumar and adopted in 2010. India is also one of the largest consumers of gold in the world.",
  ],
  [
    "facts-currency-euro-01",
    "This country was one of the founding members of its shared currency zone, yet its capital is often confused with a city in Belgium that hosts the currency's central bank.",
    "A Western European country famous for its cuisine and the Eiffel Tower.",
    "France",
    ["Germany", "Italy", "Belgium"],
    "France adopted the euro in 1999. The European Central Bank is in Frankfurt, Germany, not Brussels. The euro is used by 20 EU member states.",
  ],
  [
    "facts-currency-switzerland-01",
    "Despite being surrounded by euro-using countries, this nation kept its own currency — and its banknotes are printed vertically, unlike almost every other country.",
    "A neutral, landlocked country in Central Europe.",
    "Switzerland",
    ["Austria", "Liechtenstein", "Luxembourg"],
    "The Swiss franc is one of the world's most stable currencies. Swiss banknotes are among the most secure and artistically designed, printed in a vertical orientation since 2016.",
  ],
  [
    "facts-currency-brazil-01",
    "This country has changed its currency 8 times since 1942, including the cruzeiro, cruzado, and the current unit introduced in 1994 to combat hyperinflation.",
    "The largest country in South America.",
    "Brazil",
    ["Argentina", "Venezuela", "Colombia"],
    "Brazil introduced the real in 1994 as part of the Plano Real economic stabilization. Before that, hyperinflation had made previous currencies nearly worthless.",
  ],
  [
    "facts-currency-australia-01",
    "This country was the first to introduce polymer (plastic) banknotes in 1988, which are now used by over 50 countries worldwide.",
    "A continent-country in the Southern Hemisphere.",
    "Australia",
    ["New Zealand", "Canada", "United Kingdom"],
    "Australia introduced polymer banknotes to combat counterfeiting. The technology was developed by the CSIRO and the Reserve Bank of Australia. Canada, UK, and many others later adopted it.",
  ],
  [
    "facts-currency-zimbabwe-01",
    "This country once printed a 100 trillion dollar banknote during a period of hyperinflation that reached 79.6 billion percent per month in 2008.",
    "A landlocked country in southern Africa.",
    "Zimbabwe",
    ["Zambia", "Mozambique", "South Africa"],
    "Zimbabwe's hyperinflation was so extreme that prices doubled every 24 hours. The country eventually abandoned its own currency and adopted the US dollar and other foreign currencies.",
  ],
  [
    "facts-currency-sweden-01",
    "This Scandinavian country is closest to becoming the world's first cashless society — less than 1% of GDP is in physical cash, and many businesses refuse coins and bills.",
    "A Nordic country known for IKEA and ABBA.",
    "Sweden",
    ["Norway", "Denmark", "Finland"],
    "Sweden's Swish mobile payment system is used by over 80% of the population. The Riksbank, founded in 1668, is the world's oldest central bank and is developing an e-krona digital currency.",
  ],

  // Landmark facts
  [
    "facts-landmark-peru-01",
    "This country is home to an ancient Incan citadel built at 2,430 meters elevation, rediscovered by Hiram Bingham in 1911 and now a UNESCO World Heritage Site.",
    "A South American country on the Pacific coast.",
    "Peru",
    ["Bolivia", "Ecuador", "Colombia"],
    "Machu Picchu was built in the 15th century and abandoned during the Spanish Conquest. It was unknown to the outside world until 1911. About 1.5 million tourists visit annually.",
  ],
  [
    "facts-landmark-india-01",
    "This country has a white marble mausoleum built by a Mughal emperor in memory of his wife, considered one of the New Seven Wonders of the World.",
    "The most populous country, in South Asia.",
    "India",
    ["Pakistan", "Bangladesh", "Iran"],
    "The Taj Mahal was built by Shah Jahan between 1632-1653 for his wife Mumtaz Mahal. It took 20,000 workers and 1,000 elephants. The marble changes color throughout the day.",
  ],
  [
    "facts-landmark-jordan-01",
    "This country contains an ancient city carved directly into rose-red sandstone cliffs, featured in Indiana Jones and the Last Crusade.",
    "A Middle Eastern kingdom east of Israel.",
    "Jordan",
    ["Egypt", "Iraq", "Saudi Arabia"],
    "Petra was the capital of the Nabataean Kingdom around 300 BC. The Treasury (Al-Khazneh) is its most famous facade. It was named a UNESCO World Heritage Site in 1985.",
  ],
  [
    "facts-landmark-australia-01",
    "This country has an iconic opera house with sail-shaped shells on its harbor, designed by a Danish architect who never saw it completed.",
    "A continent-country in the Southern Hemisphere.",
    "Australia",
    ["New Zealand", "United Kingdom", "Denmark"],
    "The Sydney Opera House was designed by Jorn Utzon. Construction took 16 years (1957-1973) and went 1,357% over budget. Utzon left the project in 1966 and never returned to see it finished.",
  ],
  [
    "facts-landmark-cambodia-01",
    "This country has the world's largest religious monument — a temple complex spanning 162 hectares, originally built as a Hindu temple in the 12th century.",
    "A Southeast Asian country between Thailand and Vietnam.",
    "Cambodia",
    ["Thailand", "Indonesia", "Myanmar"],
    "Angkor Wat was built by King Suryavarman II around 1150 AD. It gradually transformed from Hindu to Buddhist. The temple appears on the country's national flag — the only building on any national flag.",
  ],
  [
    "facts-landmark-china-01",
    "This country built a defensive wall system stretching over 21,000 km, constructed over 2,000 years by multiple dynasties. Contrary to myth, it's not visible from space.",
    "The most populous country in East Asia.",
    "China",
    ["Mongolia", "India", "Japan"],
    "The Great Wall was built across centuries, with the most well-known sections from the Ming Dynasty (1368-1644). Despite the popular claim, it cannot be seen from space with the naked eye.",
  ],
  [
    "facts-landmark-brazil-01",
    "This country has a 30-meter Art Deco statue of Christ standing atop a 700-meter mountain overlooking its second-largest city.",
    "The largest country in South America.",
    "Brazil",
    ["Argentina", "Mexico", "Colombia"],
    "Christ the Redeemer stands atop Corcovado mountain overlooking Rio de Janeiro. Built between 1922-1931, the statue is made of reinforced concrete clad in soapstone tiles.",
  ],
  [
    "facts-landmark-italy-01",
    "This country has a medieval bell tower that famously leans at about 4 degrees, taking 199 years to build because construction kept stopping due to wars and the sinking foundation.",
    "A boot-shaped country in Southern Europe.",
    "Italy",
    ["Greece", "Spain", "France"],
    "The Leaning Tower of Pisa began tilting during construction in 1173. It was stabilized in the late 1990s-2001, reducing the lean from 5.5 to about 4 degrees. It took 199 years to build.",
  ],
  [
    "facts-landmark-mexico-01",
    "This country has a step pyramid built by the Maya civilization around 1000 AD. During equinoxes, shadows create the illusion of a serpent slithering down its staircase.",
    "A large North American country south of the US.",
    "Mexico",
    ["Guatemala", "Honduras", "Peru"],
    "El Castillo (Temple of Kukulcan) at Chichen Itza creates a shadow serpent effect during spring and autumn equinoxes. The pyramid has 365 steps — one for each day of the year.",
  ],
  [
    "facts-landmark-turkey-01",
    "This country has a 6th-century domed cathedral that was the world's largest for nearly 1,000 years, served as a mosque, and is now a mosque again after briefly being a museum.",
    "A transcontinental country bridging Europe and Asia.",
    "Turkey",
    ["Greece", "Egypt", "Iran"],
    "Hagia Sophia in Istanbul was built in 537 AD by Emperor Justinian. Its dome was the largest in the world for nearly a millennium. It was converted from a cathedral to a mosque in 1453, a museum in 1934, and back to a mosque in 2020.",
  ],
  [
    "facts-landmark-egypt-01",
    "This country's most famous landmark is the only surviving structure of the original Seven Wonders of the Ancient World, built over 4,500 years ago.",
    "A North African country on the Nile.",
    "Egypt",
    ["Iraq", "Greece", "Iran"],
    "The Great Pyramid of Giza was built around 2560 BC for Pharaoh Khufu. It was the tallest man-made structure for over 3,800 years. It contains roughly 2.3 million stone blocks.",
  ],
  [
    "facts-landmark-usa-01",
    "This country carved four presidents' faces into a granite mountain in the Black Hills, taking 14 years and 400 workers to complete.",
    "A large North American country.",
    "United States",
    ["Canada", "France", "United Kingdom"],
    "Mount Rushmore features Washington, Jefferson, Roosevelt, and Lincoln. Sculptor Gutzon Borglum began work in 1927 and it was completed in 1941. About 450,000 tons of rock were removed.",
  ],
  [
    "facts-landmark-france-01",
    "This country's most famous landmark was built as a temporary exhibit for an 1889 world fair and was nearly torn down — but was saved because it was useful as a radio transmission tower.",
    "A Western European country.",
    "France",
    ["United Kingdom", "Germany", "Belgium"],
    "The Eiffel Tower was built for the 1889 World's Fair and was meant to stand for only 20 years. Gustave Eiffel's radio antenna experiments saved it. It's repainted every 7 years using 60 tons of paint.",
  ],
];

const newCards = currencyFacts.map(
  ([id, question, hint, correct, wrongs, explanation]) => ({
    id,
    category: "facts",
    question,
    hint,
    image: "",
    correctAnswer: correct,
    wrongAnswers: wrongs,
    explanation,
  })
);

const allFacts = [...existing, ...newCards];
fs.writeFileSync(factsPath, JSON.stringify(allFacts, null, 2));
console.log(
  `Facts: ${existing.length} existing + ${newCards.length} new (currency + landmarks) = ${allFacts.length} total`
);
