// lib/atlantic.js
/**
 * Atlantic API client (server-only).
 * - Uses native fetch (more compatible with WAF than axios in some cases)
 * - Sends x-www-form-urlencoded body (per Postman docs)
 */

const DEFAULT_BASE_URL = "https://atlantich2h.com";

function getBaseUrl() {
  const raw = process.env.ATLANTIC_BASE_URL || DEFAULT_BASE_URL;
  return raw.replace(/\/+$/, ""); // trim trailing slash
}

function getApiKey() {
  const key = process.env.ATLANTIC_API_KEY;
  if (!key) throw new Error("Missing ATLANTIC_API_KEY env var");
  return key;
}

export async function atlanticPost(path, params = {}) {
  const base = getBaseUrl();
  const url = `${base}${path.startsWith("/") ? "" : "/"}${path}`;

  const body = new URLSearchParams();
  body.set("api_key", getApiKey());
  for (const [k, v] of Object.entries(params || {})) {
    if (v === undefined || v === null || v === "") continue;
    body.set(k, String(v));
  }

  const res = await fetch(url, {
    method: "POST",
    // Some CDNs/WAFs block default node/axios UA. Spoof a common UA.
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json, text/plain, */*",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      "X-Requested-With": "XMLHttpRequest",
    },
    body,
    // Next.js fetch caching off for API calls
    cache: "no-store",
  });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    const msg = `Atlantic API ${res.status} ${res.statusText}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}
