const fs = require("fs");
const path = require("path");

// Country -> Capital data
// Using well-known capitals, grouped by region for good wrong-answer pairing
const data = [
  // Europe
  ["France", "Paris", ["Berlin", "Madrid", "Rome"]],
  ["Germany", "Berlin", ["Vienna", "Warsaw", "Prague"]],
  ["Italy", "Rome", ["Madrid", "Athens", "Lisbon"]],
  ["Spain", "Madrid", ["Lisbon", "Rome", "Paris"]],
  ["Portugal", "Lisbon", ["Madrid", "Rome", "Athens"]],
  ["United Kingdom", "London", ["Dublin", "Edinburgh", "Paris"]],
  ["Ireland", "Dublin", ["London", "Belfast", "Edinburgh"]],
  ["Netherlands", "Amsterdam", ["Brussels", "Copenhagen", "Berlin"]],
  ["Belgium", "Brussels", ["Amsterdam", "Luxembourg City", "Paris"]],
  ["Luxembourg", "Luxembourg City", ["Brussels", "Bern", "Vaduz"]],
  ["Switzerland", "Bern", ["Zurich", "Geneva", "Vienna"]],
  ["Austria", "Vienna", ["Prague", "Budapest", "Berlin"]],
  ["Poland", "Warsaw", ["Prague", "Berlin", "Vilnius"]],
  ["Czech Republic", "Prague", ["Warsaw", "Vienna", "Bratislava"]],
  ["Slovakia", "Bratislava", ["Prague", "Budapest", "Vienna"]],
  ["Hungary", "Budapest", ["Bratislava", "Vienna", "Belgrade"]],
  ["Romania", "Bucharest", ["Budapest", "Sofia", "Belgrade"]],
  ["Bulgaria", "Sofia", ["Bucharest", "Belgrade", "Skopje"]],
  ["Greece", "Athens", ["Rome", "Nicosia", "Sofia"]],
  ["Sweden", "Stockholm", ["Oslo", "Helsinki", "Copenhagen"]],
  ["Norway", "Oslo", ["Stockholm", "Helsinki", "Copenhagen"]],
  ["Finland", "Helsinki", ["Stockholm", "Tallinn", "Oslo"]],
  ["Denmark", "Copenhagen", ["Stockholm", "Oslo", "Amsterdam"]],
  ["Iceland", "Reykjavik", ["Oslo", "Copenhagen", "Helsinki"]],
  ["Estonia", "Tallinn", ["Riga", "Helsinki", "Vilnius"]],
  ["Latvia", "Riga", ["Tallinn", "Vilnius", "Warsaw"]],
  ["Lithuania", "Vilnius", ["Riga", "Warsaw", "Tallinn"]],
  ["Croatia", "Zagreb", ["Belgrade", "Ljubljana", "Sarajevo"]],
  ["Slovenia", "Ljubljana", ["Zagreb", "Vienna", "Bratislava"]],
  ["Serbia", "Belgrade", ["Zagreb", "Sarajevo", "Sofia"]],
  ["Bosnia and Herzegovina", "Sarajevo", ["Belgrade", "Zagreb", "Podgorica"]],
  ["Montenegro", "Podgorica", ["Belgrade", "Sarajevo", "Tirana"]],
  ["Albania", "Tirana", ["Podgorica", "Skopje", "Athens"]],
  ["North Macedonia", "Skopje", ["Tirana", "Sofia", "Belgrade"]],
  ["Moldova", "Chisinau", ["Bucharest", "Kyiv", "Minsk"]],
  ["Ukraine", "Kyiv", ["Moscow", "Minsk", "Warsaw"]],
  ["Belarus", "Minsk", ["Kyiv", "Moscow", "Vilnius"]],
  ["Russia", "Moscow", ["Saint Petersburg", "Kyiv", "Minsk"]],
  ["Georgia", "Tbilisi", ["Yerevan", "Baku", "Ankara"]],
  ["Armenia", "Yerevan", ["Tbilisi", "Baku", "Tehran"]],
  ["Azerbaijan", "Baku", ["Tbilisi", "Yerevan", "Tehran"]],
  ["Cyprus", "Nicosia", ["Athens", "Ankara", "Beirut"]],

  // Asia
  ["Turkey", "Ankara", ["Istanbul", "Athens", "Tbilisi"]],
  ["Japan", "Tokyo", ["Seoul", "Beijing", "Osaka"]],
  ["South Korea", "Seoul", ["Tokyo", "Pyongyang", "Beijing"]],
  ["China", "Beijing", ["Shanghai", "Tokyo", "Seoul"]],
  ["India", "New Delhi", ["Mumbai", "Kolkata", "Islamabad"]],
  ["Pakistan", "Islamabad", ["Karachi", "New Delhi", "Kabul"]],
  ["Bangladesh", "Dhaka", ["Kolkata", "Yangon", "Kathmandu"]],
  ["Nepal", "Kathmandu", ["Dhaka", "New Delhi", "Thimphu"]],
  ["Bhutan", "Thimphu", ["Kathmandu", "New Delhi", "Dhaka"]],
  ["Sri Lanka", "Colombo", ["New Delhi", "Chennai", "Dhaka"]],
  ["Myanmar", "Naypyidaw", ["Yangon", "Bangkok", "Dhaka"]],
  ["Thailand", "Bangkok", ["Hanoi", "Phnom Penh", "Vientiane"]],
  ["Vietnam", "Hanoi", ["Bangkok", "Phnom Penh", "Ho Chi Minh City"]],
  ["Cambodia", "Phnom Penh", ["Bangkok", "Hanoi", "Vientiane"]],
  ["Laos", "Vientiane", ["Phnom Penh", "Bangkok", "Hanoi"]],
  ["Malaysia", "Kuala Lumpur", ["Singapore", "Jakarta", "Bangkok"]],
  ["Singapore", "Singapore", ["Kuala Lumpur", "Jakarta", "Bangkok"]],
  ["Indonesia", "Jakarta", ["Kuala Lumpur", "Manila", "Bangkok"]],
  ["Philippines", "Manila", ["Jakarta", "Bangkok", "Hanoi"]],
  ["Mongolia", "Ulaanbaatar", ["Beijing", "Astana", "Moscow"]],
  ["Kazakhstan", "Astana", ["Tashkent", "Bishkek", "Moscow"]],
  ["Uzbekistan", "Tashkent", ["Astana", "Bishkek", "Dushanbe"]],
  ["Kyrgyzstan", "Bishkek", ["Tashkent", "Astana", "Dushanbe"]],
  ["Tajikistan", "Dushanbe", ["Tashkent", "Bishkek", "Kabul"]],
  ["Turkmenistan", "Ashgabat", ["Tashkent", "Tehran", "Baku"]],
  ["Afghanistan", "Kabul", ["Islamabad", "Tehran", "Dushanbe"]],
  ["Iran", "Tehran", ["Baghdad", "Kabul", "Ankara"]],
  ["Iraq", "Baghdad", ["Tehran", "Damascus", "Amman"]],
  ["Syria", "Damascus", ["Beirut", "Baghdad", "Amman"]],
  ["Lebanon", "Beirut", ["Damascus", "Amman", "Nicosia"]],
  ["Jordan", "Amman", ["Damascus", "Baghdad", "Beirut"]],
  ["Israel", "Jerusalem", ["Tel Aviv", "Amman", "Beirut"]],
  ["Saudi Arabia", "Riyadh", ["Doha", "Abu Dhabi", "Muscat"]],
  ["Kuwait", "Kuwait City", ["Riyadh", "Doha", "Manama"]],
  ["Qatar", "Doha", ["Abu Dhabi", "Riyadh", "Manama"]],
  ["Oman", "Muscat", ["Abu Dhabi", "Riyadh", "Doha"]],
  ["Yemen", "Sanaa", ["Muscat", "Riyadh", "Djibouti"]],

  // Africa
  ["Egypt", "Cairo", ["Tripoli", "Khartoum", "Tunis"]],
  ["Libya", "Tripoli", ["Cairo", "Tunis", "Algiers"]],
  ["Tunisia", "Tunis", ["Algiers", "Tripoli", "Rabat"]],
  ["Algeria", "Algiers", ["Tunis", "Rabat", "Tripoli"]],
  ["Morocco", "Rabat", ["Algiers", "Casablanca", "Tunis"]],
  ["Nigeria", "Abuja", ["Lagos", "Accra", "Nairobi"]],
  ["Ghana", "Accra", ["Abuja", "Lome", "Dakar"]],
  ["Senegal", "Dakar", ["Bamako", "Accra", "Nouakchott"]],
  ["Kenya", "Nairobi", ["Dar es Salaam", "Kampala", "Addis Ababa"]],
  ["Ethiopia", "Addis Ababa", ["Nairobi", "Khartoum", "Mogadishu"]],
  ["Tanzania", "Dodoma", ["Nairobi", "Kampala", "Dar es Salaam"]],
  ["Uganda", "Kampala", ["Nairobi", "Kigali", "Dodoma"]],
  ["Rwanda", "Kigali", ["Kampala", "Bujumbura", "Nairobi"]],
  ["South Africa", "Pretoria", ["Cape Town", "Nairobi", "Windhoek"]],
  ["Namibia", "Windhoek", ["Pretoria", "Gaborone", "Luanda"]],
  ["Botswana", "Gaborone", ["Windhoek", "Pretoria", "Lusaka"]],
  ["Zimbabwe", "Harare", ["Lusaka", "Maputo", "Pretoria"]],
  ["Zambia", "Lusaka", ["Harare", "Lilongwe", "Dar es Salaam"]],
  ["Mozambique", "Maputo", ["Harare", "Pretoria", "Dar es Salaam"]],
  ["Madagascar", "Antananarivo", ["Maputo", "Nairobi", "Dar es Salaam"]],
  ["Sudan", "Khartoum", ["Cairo", "Addis Ababa", "Juba"]],
  ["South Sudan", "Juba", ["Khartoum", "Kampala", "Nairobi"]],
  ["Somalia", "Mogadishu", ["Nairobi", "Addis Ababa", "Djibouti"]],
  ["Democratic Republic of the Congo", "Kinshasa", ["Brazzaville", "Luanda", "Kampala"]],
  ["Republic of the Congo", "Brazzaville", ["Kinshasa", "Luanda", "Libreville"]],
  ["Cameroon", "Yaounde", ["Abuja", "Libreville", "Douala"]],
  ["Ivory Coast", "Yamoussoukro", ["Abidjan", "Accra", "Dakar"]],
  ["Mali", "Bamako", ["Dakar", "Ouagadougou", "Niamey"]],
  ["Niger", "Niamey", ["Bamako", "Ouagadougou", "Abuja"]],
  ["Chad", "N'Djamena", ["Niamey", "Abuja", "Yaounde"]],
  ["Gabon", "Libreville", ["Brazzaville", "Yaounde", "Malabo"]],

  // Americas
  ["United States", "Washington, D.C.", ["New York City", "Los Angeles", "Ottawa"]],
  ["Canada", "Ottawa", ["Toronto", "Vancouver", "Washington, D.C."]],
  ["Mexico", "Mexico City", ["Guadalajara", "Cancun", "Guatemala City"]],
  ["Guatemala", "Guatemala City", ["San Salvador", "Mexico City", "Tegucigalpa"]],
  ["Honduras", "Tegucigalpa", ["Guatemala City", "San Salvador", "Managua"]],
  ["El Salvador", "San Salvador", ["Tegucigalpa", "Guatemala City", "Managua"]],
  ["Nicaragua", "Managua", ["San Salvador", "Tegucigalpa", "San Jose"]],
  ["Costa Rica", "San Jose", ["Managua", "Panama City", "San Salvador"]],
  ["Panama", "Panama City", ["San Jose", "Bogota", "Managua"]],
  ["Colombia", "Bogota", ["Quito", "Caracas", "Lima"]],
  ["Venezuela", "Caracas", ["Bogota", "Quito", "Georgetown"]],
  ["Ecuador", "Quito", ["Bogota", "Lima", "Caracas"]],
  ["Peru", "Lima", ["Quito", "La Paz", "Bogota"]],
  ["Bolivia", "La Paz", ["Lima", "Quito", "Asuncion"]],
  ["Brazil", "Brasilia", ["Rio de Janeiro", "Sao Paulo", "Buenos Aires"]],
  ["Argentina", "Buenos Aires", ["Montevideo", "Santiago", "Brasilia"]],
  ["Chile", "Santiago", ["Buenos Aires", "Lima", "Montevideo"]],
  ["Uruguay", "Montevideo", ["Buenos Aires", "Asuncion", "Brasilia"]],
  ["Paraguay", "Asuncion", ["Montevideo", "La Paz", "Buenos Aires"]],
  ["Cuba", "Havana", ["Kingston", "Santo Domingo", "Nassau"]],
  ["Dominican Republic", "Santo Domingo", ["Havana", "San Juan", "Kingston"]],
  ["Haiti", "Port-au-Prince", ["Santo Domingo", "Kingston", "Havana"]],
  ["Jamaica", "Kingston", ["Havana", "Nassau", "Port-au-Prince"]],

  // Oceania
  ["Australia", "Canberra", ["Sydney", "Melbourne", "Wellington"]],
  ["New Zealand", "Wellington", ["Auckland", "Canberra", "Sydney"]],
  ["Fiji", "Suva", ["Wellington", "Apia", "Port Moresby"]],
  ["Papua New Guinea", "Port Moresby", ["Suva", "Canberra", "Jakarta"]],
];

// Generate capital -> country cards
const capitalToCountry = data.map(([country, capital, wrongCapitals]) => ({
  id: `cap-to-country-${country.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`,
  category: "capitals",
  question: `${capital} is the capital of which country?`,
  hint: "",
  image: "",
  correctAnswer: country,
  wrongAnswers: wrongCapitals.map((wc) => {
    // Find the country for each wrong capital
    const match = data.find(([, c]) => c === wc);
    return match ? match[0] : wc;
  }),
  explanation: `${capital} is the capital city of ${country}.`,
}));

// Generate country -> capital cards
const countryToCapital = data.map(([country, capital, wrongCapitals]) => ({
  id: `country-to-cap-${country.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`,
  category: "capitals-reverse",
  question: `What is the capital of ${country}?`,
  hint: "",
  image: "",
  correctAnswer: capital,
  wrongAnswers: wrongCapitals,
  explanation: `${capital} is the capital city of ${country}.`,
}));

const outDir = path.join(__dirname, "..", "src", "data");

fs.writeFileSync(
  path.join(outDir, "capitals.json"),
  JSON.stringify(capitalToCountry, null, 2)
);
console.log(`Generated capitals.json: ${capitalToCountry.length} cards`);

fs.writeFileSync(
  path.join(outDir, "capitals-reverse.json"),
  JSON.stringify(countryToCapital, null, 2)
);
console.log(`Generated capitals-reverse.json: ${countryToCapital.length} cards`);
