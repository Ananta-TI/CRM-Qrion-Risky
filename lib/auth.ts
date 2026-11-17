/* Pemeriksaan sandi (PBKDF2-SHA256, sama dengan prototipe). Untuk produksi pindahkan verifikasi ke server. */
export const ITER = 600000;
export const b64 = (u: Uint8Array) => btoa(String.fromCharCode(...u));
export const unb64 = (t: string) => Uint8Array.from(atob(t), (c) => c.charCodeAt(0));

export async function pbk(pw: string, salt: Uint8Array, iter: number): Promise<string> {
  const c = globalThis.crypto && globalThis.crypto.subtle;
  if (!c) throw new Error("Peramban tidak mendukung enkripsi sandi.");
  const k = await c.importKey("raw", new TextEncoder().encode(pw), "PBKDF2", false, ["deriveBits"]);
  const bits = await c.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: salt as BufferSource, iterations: iter }, k, 256);
  return b64(new Uint8Array(bits));
}
export async function mkCred(pw: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return { salt: b64(salt), iter: ITER, hash: await pbk(pw, salt, ITER) };
}
export const normU = (u: string) => String(u || "").trim().toLowerCase();
export const okU = (u: string) => /^[a-z0-9._-]{3,32}$/.test(u);
