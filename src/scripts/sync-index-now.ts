import { fetchUrlsFromSitemapIndex, submitUrlsToIndexNow } from "../utils/index-now.ts";

const WEBSITE_DOMAIN = "arielmessing.github.io";
const SITEMAP_INDEX_URL = `https://${WEBSITE_DOMAIN}/sitemap-index.xml`;

const INDEXNOW_API_URL = "https://www.bing.com/indexnow";
const INDEXNOW_KEY = process.env.INDEXNOW_KEY;

async function syncIndexNow(): Promise<boolean> {
  if (!INDEXNOW_KEY) {
    throw new Error("Environment parameter INDEXNOW_KEY is not defined.");
  }

  console.log("Starting automated IndexNow sync");
  const urlsToSubmit = await fetchUrlsFromSitemapIndex(SITEMAP_INDEX_URL);

  if (urlsToSubmit.length === 0) {
    throw new Error("No page URLs resolved.");
  }

  return await submitUrlsToIndexNow(INDEXNOW_API_URL, INDEXNOW_KEY, WEBSITE_DOMAIN, urlsToSubmit);
}

syncIndexNow()
  .then((success) => {
    if (!success) {
      console.error("IndexNow submission failed.");
      process.exitCode = 1;
    }
  })
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });