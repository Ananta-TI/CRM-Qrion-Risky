/* Resolver token tanggal relatif di data JSON dummy, supaya contoh selalu "segar".
   @d-3        -> tanggal 3 hari lalu (YYYY-MM-DD)
   @m-1        -> bulan lalu (YYYY-MM)
   @t-9d@02:10 -> waktu ISO, 9 hari lalu jam 02:10 UTC
   @t-9d@02:10+300m -> ditambah 300 menit */
const pad = (n: number) => String(n).padStart(2, "0");
const isoDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export function resolveToken(v: string, now = new Date()): string {
  let m = /^@d([+-]\d+)$/.exec(v);
  if (m) return isoDate(new Date(now.getTime() + +m[1] * 864e5));
  m = /^@m([+-]\d+)$/.exec(v);
  if (m) {
    const d = new Date(now.getFullYear(), now.getMonth() + +m[1], 1);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
  }
  m = /^@n(-?\d+)m(?:\+(\d+)m)?$/.exec(v);
  if (m) return new Date(now.getTime() + +m[1] * 6e4 + (m[2] ? +m[2] * 6e4 : 0)).toISOString();
  m = /^@t([+-]\d+)d@(\d\d):(\d\d)(?:\+(\d+)m)?$/.exec(v);
  if (m) {
    const day = isoDate(new Date(now.getTime() + +m[1] * 864e5));
    const t = new Date(`${day}T${m[2]}:${m[3]}:00Z`).getTime() + (m[4] ? +m[4] * 6e4 : 0);
    return new Date(t).toISOString();
  }
  return v;
}

export function resolveAll<T>(x: T): T {
  if (typeof x === "string") return (x.startsWith("@") ? resolveToken(x) : x) as T;
  if (Array.isArray(x)) return x.map(resolveAll) as T;
  if (x && typeof x === "object") {
    const o: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(x as Record<string, unknown>)) o[k.replace(/@d([+-]\d+)/g, (_m, n) => resolveToken("@d" + n))] = resolveAll(v);
    return o as T;
  }
  return x;
}
