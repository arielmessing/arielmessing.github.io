import type { APIRoute } from "astro";

// Filename is based on IndexNow key, which is available as an environment variable
export function getStaticPaths() {
  const key = process.env.INDEXNOW_KEY;

  if (key) {
    return [{ params: { key } }];
  }

  return [];
}

export const GET: APIRoute = ({ params }) => {

  // Return key as plain text
  return new Response(params.key, {
    headers: { "Content-Type": "text/plain" },
  });
};