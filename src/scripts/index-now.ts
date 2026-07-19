const DOMAIN = "arielmessing.github.io"; // Replace with your domain
const KEY = process.env.INDEXNOW_KEY;

async function run(): Promise<void> {
  if (!KEY) {
    console.error("Error: Environment parameter INDEXNOW_KEY is not defined.");
    console.error("If using a .env file, ensure script is executed with the --env-file flag.");
    process.exit(1);
  }

  const urlsToSubmit = [
    `https://${DOMAIN}/`,
    `https://${DOMAIN}/about/`,
    `https://${DOMAIN}/postbox/`,
    `https://${DOMAIN}/tags/`,
    `https://${DOMAIN}/notes/`,
  ];

  if (process.argv.length > 2) {
    for (let i = 2; i < process.argv.length; i++) {
      const slug = process.argv[i];

      const cleanSlug = slug.replace(/^\/+|\/+$/g, "");

      urlsToSubmit.push(`https://${DOMAIN}/notes/${cleanSlug}`);
    }
  }

  console.log("Preparing to submit the following updated URLs:");
  urlsToSubmit.forEach(url => console.log(` - ${url}`));

  const payload = {
    host: DOMAIN,
    key: KEY,
    urlList: urlsToSubmit,
  };

  try {
    const res = await fetch("https://www.bing.com/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });

    if (res.ok || res.status === 202) {
      console.log(`\nSuccess! IndexNow accepted all ${urlsToSubmit.length} URLs ${res.ok ? "" : "(key validation pending)"}`);

    } else {
      console.error(`\nError from IndexNow (HTTP ${res.status}):`, await res.text());
      process.exit(1);
    }
  } catch (err: any) {
    console.error("\nNetwork request failed:", err.message);
    process.exit(1);
  }
}

run();