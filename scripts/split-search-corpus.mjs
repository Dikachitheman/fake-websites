import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const mixedCorpusPath = path.join(rootDir, "search.json");
const registryPath = path.join(rootDir, "sources.json");

const registry = JSON.parse(await readFile(registryPath, "utf8"));
const mixedText = await readFile(mixedCorpusPath, "utf8");

const registryMarker = "# fake_web_sources";
const registryMarkerIndex = mixedText.indexOf(registryMarker);

if (registryMarkerIndex < 0) {
  throw new Error("Could not locate the article array in fake-websites/search.json");
}

const corpusPrefix = mixedText.slice(0, registryMarkerIndex);
const articleArrayMatches = corpusPrefix.match(/\[\s*\{\s*"id":\s*"[^"]+"\s*,\s*"title":[\s\S]*?\n\]/g) ?? [];
const articles = articleArrayMatches.flatMap((match) => JSON.parse(match));

if (articles.length === 0) {
  throw new Error("No article arrays were extracted from fake-websites/search.json");
}

const sourceNameToId = new Map(registry.sources.map((source) => [source.name, source.id]));

const fallbackSourceMap = {
  "Sallaum Lines": "sallaum-lines",
  "Grimaldi Group": "grimaldi-group",
  "Nigeria Port Watch": "nigeria-port-watch",
  "Naija Customs Guide": "naija-customs-guide",
  "Corridor Briefing": "corridor-briefing",
  "FX Bulletin": "fx-bulletin",
  "West Africa Weather": "west-africa-weather",
  "Maritime Sanctions Watch": "maritime-sanctions-watch",
  "Apapa Tin Can Terminal": "apapa-tin-can-terminal",
  "Vessel Tracker News": "vessel-tracker-news",
  "Shipping Lane Analyst": "shipping-lane-analyst",
  "Nigeria Trade Desk": "nigeria-trade-desk"
};

const grouped = new Map(registry.sources.map((source) => [source.id, []]));

for (const article of articles) {
  const sourceId = sourceNameToId.get(article.source) ?? fallbackSourceMap[article.source];
  if (!sourceId) {
    throw new Error(`No site mapping found for article source: ${article.source}`);
  }
  grouped.get(sourceId).push(article);
}

for (const source of registry.sources) {
  const siteDir = path.join(rootDir, source.id);
  const publicDir = path.join(siteDir, "public");
  await mkdir(publicDir, { recursive: true });
  const sourceArticles = grouped.get(source.id) ?? [];
  await writeFile(
    path.join(publicDir, "search-index.json"),
    JSON.stringify(sourceArticles, null, 2) + "\n",
    "utf8"
  );
}

const summary = Object.fromEntries(
  Array.from(grouped.entries()).map(([sourceId, sourceArticles]) => [sourceId, sourceArticles.length])
);

console.log(`Split ${articles.length} articles across ${registry.sources.length} site indexes.`);
console.log(JSON.stringify(summary, null, 2));
