import type { Card, Category } from "@/lib/types";

import languageToTextData from "./language-to-text.json";
import textToLanguageData from "./text-to-language.json";
import countryShapesData from "./country-shapes.json";
import shapesReverseData from "./shapes-reverse.json";
import flagsData from "./flags.json";
import factsData from "./facts.json";
import flagsReverseData from "./flags-reverse.json";

export const allCards: Card[] = [
  ...languageToTextData,
  ...textToLanguageData,
  ...countryShapesData,
  ...shapesReverseData,
  ...flagsData,
  ...flagsReverseData,
  ...factsData,
];

export const categories: Category[] = [
  {
    id: "language-to-text",
    name: "Text \u2192 Language",
    icon: "\uD83D\uDD24",
    description: "See example text and identify the language",
    mode: "random",
  },
  {
    id: "text-to-language",
    name: "Language \u2192 Text",
    icon: "\uD83C\uDF10",
    description: "Given a language name, pick the correct text sample",
    mode: "random",
  },
  {
    id: "country-shapes",
    name: "Country Shapes",
    icon: "\uD83D\uDDFA\uFE0F",
    description: "Identify countries by their geographic outline",
    mode: "srs",
  },
  {
    id: "shapes-reverse",
    name: "Name \u2192 Shape",
    icon: "\uD83C\uDF0D",
    description: "Given a country name, pick the correct shape",
    mode: "srs",
  },
  {
    id: "flags",
    name: "Flags",
    icon: "\uD83C\uDFF4",
    description: "Match flags to their countries",
    mode: "srs",
  },
  {
    id: "flags-reverse",
    name: "Name \u2192 Flag",
    icon: "\uD83C\uDFF3\uFE0F",
    description: "Given a country name, pick the correct flag",
    mode: "srs",
  },
  {
    id: "facts",
    name: "Country Facts",
    icon: "\uD83D\uDCA1",
    description: "Guess the country from an interesting fact",
    mode: "srs",
  },
];
