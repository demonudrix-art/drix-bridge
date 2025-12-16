import { assertToken, fetchJson, toBucharestIso } from "../../lib/superbet.js";

export default async function handler(req, res) {
  const auth = assertToken(req);
  if (!auth.ok) return res.status(auth.status).json({ ok: false, error: auth.error });

  const { id } = req.query;
  if (!id) return res.status(400).json({ ok: false, error: "Missing id" });

  try {
    const url = `https://production-superbet-offer-ro.freetls.fastly.net/v2/ro-RO/events/${id}`;
    const data = await fetchJson(url);

    const ev = Array.isArray(data?.data) ? data.data[0] : null;

    const out = {
      ok: true,
      eventId: Number(id),
      matchName: ev?.matchName || null,
      matchDateRaw: ev?.matchDate || null,
      matchDateRO: ev?.matchDate ? toBucharestIso(ev.matchDate) : null,
      hasLive: ev?.hasLive ?? null,
      marketCount: ev?.marketCount ?? null,
      oddsCount: Array.isArray(ev?.odds) ? ev.odds.length : 0,
      oddsSample: Array.isArray(ev?.odds) ? ev.odds.slice(0, 10) : [],
      raw: data
    };

    res.status(200).json(out);
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e.message || e) });
  }
}
