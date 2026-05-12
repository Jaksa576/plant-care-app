// scripts/test-perenual-one.mjs

const key = process.env.PERENUAL_API_KEY;

if (!key) {
  throw new Error("Missing PERENUAL_API_KEY");
}

const query = process.argv.slice(2).join(" ").trim();

if (!query) {
  throw new Error('Provide one plant query, e.g. node .\\scripts\\test-perenual-one.mjs "Dracaena trifasciata"');
}

function parseBenchmark(benchmark) {
  const value = benchmark?.value;
  const unit = benchmark?.unit;

  if (!value || unit !== "days") return null;

  const rangeMatch = String(value).match(/^(\d+)\s*-\s*(\d+)$/);
  if (rangeMatch) {
    const minDays = Number(rangeMatch[1]);
    const maxDays = Number(rangeMatch[2]);

    return {
      minDays,
      maxDays,
      defaultDays: maxDays,
      display: `${minDays}-${maxDays} days`,
    };
  }

  const singleMatch = String(value).match(/^(\d+)$/);
  if (singleMatch) {
    const days = Number(singleMatch[1]);

    return {
      minDays: days,
      maxDays: days,
      defaultDays: days,
      display: `${days} days`,
    };
  }

  return null;
}

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${response.status} ${response.statusText}: ${body.slice(0, 300)}`);
  }

  return response.json();
}

async function searchSpecies(query) {
  const url = new URL("https://perenual.com/api/species-list");
  url.searchParams.set("key", key);
  url.searchParams.set("q", query);

  return fetchJson(url);
}

async function getSpeciesDetails(id) {
  const url = new URL(`https://perenual.com/api/species/details/${id}`);
  url.searchParams.set("key", key);

  return fetchJson(url);
}

const search = await searchSpecies(query);
const first = search?.data?.[0];

if (!first?.id) {
  console.log(JSON.stringify({ query, error: "No match found" }, null, 2));
  process.exit(0);
}

const details = await getSpeciesDetails(first.id);
const parsedBenchmark = parseBenchmark(details?.watering_general_benchmark);

const result = {
  query,
  matchedId: first.id,
  matchedCommonName: first.common_name ?? details.common_name ?? null,
  matchedScientificName:
    first.scientific_name?.[0] ??
    details.scientific_name?.[0] ??
    details.scientific_name ??
    null,
  watering: details.watering ?? null,
  wateringBenchmarkRaw: details.watering_general_benchmark ?? null,
  parsedBenchmark,
  sunlight: details.sunlight ?? null,
  soil: details.soil ?? null,
  indoor: details.indoor ?? null,
  careLevel: details.care_level ?? null,
  poisonousToHumans: details.poisonous_to_humans ?? null,
  poisonousToPets: details.poisonous_to_pets ?? null,
};

console.table([
  {
    query: result.query,
    matched: result.matchedCommonName ?? result.matchedScientificName ?? "",
    watering: result.watering ?? "",
    benchmark: result.parsedBenchmark?.display ?? "",
    defaultDays: result.parsedBenchmark?.defaultDays ?? "",
    indoor: result.indoor ?? "",
    careLevel: result.careLevel ?? "",
  },
]);

console.log(JSON.stringify(result, null, 2));