// only browser-safe imports
import axios from "axios";

const BRAVE_API_KEY = process.env.VUE_APP_BRAVE_SEARCH_API_KEY;

if (!BRAVE_API_KEY) {
  throw new Error("Missing BRAVE_SEARCH API key!");
}

export async function searchBraveVideos(query, count = 1) {
  const url = "https://api.search.brave.com/res/v1/videos/search";
  const response = await axios.get(url, {
    params: { q: query, count },
    headers: {
      Accept: "application/json",
      "X-Subscription-Token": BRAVE_API_KEY,
    },
  });

  return Array.isArray(response.data.results)
    ? response.data.results
    : [];
}
