export async function fetchUrlsFromSitemapIndex(sitemapIndexUrl: string): Promise<string[]> {
  console.log(`Scanning top-level index: ${sitemapIndexUrl}`);

  const subSitemaps = await extractUrlsFromSitemap(sitemapIndexUrl);
  const allPages: string[] = [];

  for (const subUrl of subSitemaps) {
    console.log(` -> Extracting page URLs from: ${subUrl}`);
    const pageUrls = await extractUrlsFromSitemap(subUrl);
    allPages.push(...pageUrls);
  }

  return Array.from(new Set(allPages));
}

export async function extractUrlsFromSitemap(sitemapUrl: string): Promise<string[]> {
  try {
    const response = await fetch(sitemapUrl);
    if (!response.ok) {
      console.warn(`Skipping [${sitemapUrl}]: HTTP ${response.status}`);
      return [];
    }

    const text = await response.text();
    const matches = text.matchAll(/<loc>\s*(https?:\/\/[^<]+)\s*<\/loc>/gi);

    return Array.from(matches, match => match[1].trim());

  } catch (error) {
    console.warn(`Failed to process [${sitemapUrl}]:`, error instanceof Error ? error.message : error);
    return [];
  }
}

export async function submitUrlsToIndexNow(
  indexNowApiUrl: string,
  indexNowKey: string,
  websiteDomain: string,
  websiteUrls: string[]
): Promise<boolean> {

  console.log(`Submitting ${websiteUrls.length} URLs to IndexNow...`);

  try {
    const res = await fetch(indexNowApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: websiteDomain,
        key: indexNowKey,
        urlList: websiteUrls
      }),
    });

    if (res.ok || res.status === 202) {
      console.log(`Success! URLs ${res.ok 
        ? "submitted" 
        : "received (key validation pending)"}`);

      return true;
    }

    console.error(`Rejected by IndexNow (HTTP ${res.status}):`, await res.text());
    return false;

  } catch (err) {
    console.error("Network error:", err instanceof Error ? err.message : String(err));
    return false;
  }
}