const DEFAULT_HEADERS = {
  "accept": "application/json, text/plain, */*",
  "accept-language": "ro-RO,ro;q=0.9,en-US;q=0.8,en;q=0.7",
  "origin": "https://superbet.ro",
  "referer": "https://superbet.ro/",
  "user-agent": "Mozilla/5.0 (compatible; DrixBridge/1.0; +https://vercel.app)"
};

export function assertToken(req) {
  const required = process.env.DRIX_TOKEN;
  if (!required) return { ok: true }; // if no token set, do not block
  const token = req.query?.token || req.headers["x-drix-token"];
  if (token !== required) return { ok: false, status: 401, error: "Unauthorized" };
  return { ok: true };
}

export async function fetchJson(url) {
  const resp = await fetch(url, { headers: DEFAULT_HEADERS });
  const text = await resp.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error(`Non-JSON response from ${url}: ${text.slice(0, 200)}`);
  }
  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status} from ${url}: ${JSON.stringify(data).slice(0, 300)}`);
  }
  return data;
}

export function toBucharestIso(matchDateStr) {
  const d = new Date(matchDateStr.replace(" ", "T") + "Z"); // treat as UTC
  const fmt = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Bucharest",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
  const parts = Object.fromEntries(fmt.formatToParts(d).map(p => [p.type, p.value]));
  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}`;
}

export function isTodayBucharest(matchDateStr, now = new Date()) {
  const fmt = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Bucharest",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
  const today = fmt.format(now); // YYYY-MM-DD
  const d = new Date(matchDateStr.replace(" ", "T") + "Z");
  const day = fmt.format(d);
  return day === today;
}
