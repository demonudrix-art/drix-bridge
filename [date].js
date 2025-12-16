import { assertToken, fetchJson } from "../../lib/superbet.js";

export default async function handler(req, res) {
  const auth = assertToken(req);
  if (!auth.ok) return res.status(auth.status).json({ ok: false, error: auth.error });

  const { date } = req.query; // YYYY-MM-DD
  if (!date) return res.status(400).json({ ok: false, error: "Missing date (YYYY-MM-DD)" });

  try {
    const url = `https://superbet-content.freetls.fastly.net/cached-superbet/hot-tournaments/offer/ro/${date}`;
    const data = await fetchJson(url);

    res.status(200).json({
      ok: true,
      date,
      raw: data
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e.message || e) });
  }
}
