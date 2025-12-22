import axios from "axios";
import qs from "qs";

export function getAtlanticBaseUrl() {
  return process.env.ATLANTIC_BASE_URL || "https://atlantich2h2h.com";
}

export function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env ${name}`);
  return v;
}

/**
 * Atlantic requests in docs use x-www-form-urlencoded body.
 * This helper sends POST with urlencoded payload.
 */
export async function atlanticPost(path, payload) {
  const apiKey = requireEnv("ATLANTIC_API_KEY");
  const base = getAtlanticBaseUrl();
  const url = `${base}${path}`;

  const data = qs.stringify({ api_key: apiKey, ...payload });

  const res = await axios({
    method: "post",
    url,
    data,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    timeout: 30_000,
    maxBodyLength: Infinity,
  });

  return res.data;
}
