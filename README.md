# DRIX Bridge (Superbet endpoints)

Endpoints:
- /api/ping
- /api/top-list?token=...
- /api/event/<id>?token=...
- /api/hot-tournaments/<YYYY-MM-DD>?token=...

Optional security:
Set env var DRIX_TOKEN in Vercel, then call with ?token=DRIX_TOKEN (or header x-drix-token).
