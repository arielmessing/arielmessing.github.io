import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  extractUrlsFromSitemap,
  fetchUrlsFromSitemapIndex,
  submitUrlsToIndexNow
} from "./index-now";

describe("IndexNow Business Logic Unit Tests", () => {

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    // Mute logs during test execution to ensure a readable terminal output
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("extractUrlsFromSitemap", () => {
    it("should parse valid xml and return a trimmed list of strings", async () => {
      const mockXml = `
        <urlset>
          <url><loc>https://example.com/page1</loc></url>
          <url><loc>  https://example.com/page2  </loc></url>
        </urlset>
      `;

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        text: async () => mockXml,
      } as Response);

      const result = await extractUrlsFromSitemap("https://example.com/sitemap.xml");
      expect(result).toEqual(["https://example.com/page1", "https://example.com/page2"]);
    });

    it("should return an empty array gracefully on a 404 response", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response);

      const result = await extractUrlsFromSitemap("https://example.com/404.xml");
      expect(result).toEqual([]);
    });
  });

  describe("fetchUrlsFromSitemapIndex", () => {
    it("should coordinate a 2-tier extraction structure and deduplicate the page output", async () => {
      const mockIndexXml = `
        <sitemapindex>
          <sitemap><loc>https://example.com/sub1.xml</loc></sitemap>
          <sitemap><loc>https://example.com/sub2.xml</loc></sitemap>
        </sitemapindex>
      `;
      const mockSubXml1 = `<urlset><loc>https://example.com/a</loc></urlset>`;
      // Intentionally introducing a duplicate URL ("https://example.com/a") to test the unique Set logic
      const mockSubXml2 = `<urlset><loc>https://example.com/a</loc><loc>https://example.com/b</loc></urlset>`;

      vi.mocked(fetch)
        .mockResolvedValueOnce({ ok: true, text: async () => mockIndexXml } as Response)
        .mockResolvedValueOnce({ ok: true, text: async () => mockSubXml1 } as Response)
        .mockResolvedValueOnce({ ok: true, text: async () => mockSubXml2 } as Response);

      const result = await fetchUrlsFromSitemapIndex("https://example.com/index.xml");

      // Asserts that order holds up and duplicates are stripped out completely
      expect(result).toEqual(["https://example.com/a", "https://example.com/b"]);
    });
  });

  describe("submitUrlsToIndexNow", () => {
    const api = "https://www.bing.com/indexnow";
    const key = "mock_key";
    const host = "example.com";
    const list = ["https://example.com/a"];

    it("should evaluate an HTTP 200 response status as true", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({ ok: true, status: 200 } as Response);

      const success = await submitUrlsToIndexNow(api, key, host, list);
      expect(success).toBe(true);
    });

    it("should evaluate an HTTP 202 response status as true", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({ ok: false, status: 202 } as Response);

      const success = await submitUrlsToIndexNow(api, key, host, list);
      expect(success).toBe(true);
    });

    it("should pass the exact structured JSON configuration payload through the body", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({ ok: true, status: 200 } as Response);

      await submitUrlsToIndexNow(api, key, host, list);

      expect(fetch).toHaveBeenCalledWith(api, expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ host, key, urlList: list })
      }));
    });

    it("should return false if the endpoint throws a network error", async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error("Connection Timeout"));

      const success = await submitUrlsToIndexNow(api, key, host, list);
      expect(success).toBe(false);
    });
  });
});