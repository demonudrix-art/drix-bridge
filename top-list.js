import { assertToken, fetchJson } from "../lib/superbet.js";

export default async function handler(req, res) {
  const auth = assertToken(req);
  if (!auth.ok) return res.status(auth.status).json({ ok: false, error: auth.error });

  try {
    const url = "https://production-superbet-offer-ro.freetls.fastly.net/v2/ro-RO/events/top-list";
    const data = await fetchJson(url);

    const topMatches = data?.topMatches || [];
    res.status(200).json({
      ok: true,
      count: topMatches.length,
      topMatches
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e.message || e) });
  }
}
