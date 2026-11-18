/** Kerangka halaman saat sesi/data belum siap. Dirender di server juga, jadi
 *  refresh langsung menampilkan bentuk aplikasi (bukan layar kosong). */
export default function AppSkeleton() {
  return (
    <>
      <header className="page-head" aria-hidden="true">
        <div className="page-head-main">
          <span className="sk sk-title" />
          <span className="sk sk-sub" />
        </div>
        <span className="sk sk-btn" />
      </header>
      <div className="toolbar" aria-hidden="true">
        <span className="sk sk-pill" />
        <span className="sk sk-pill" />
        <span className="sk sk-pill" />
        <span className="sk sk-pill" />
      </div>
      <div className="tiles" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <div className="tile sk-tile" key={i}>
            <span className="sk sk-line sm" />
            <span className="sk sk-line lg" />
            <span className="sk sk-line xs" />
          </div>
        ))}
      </div>
      <div className="grid2" aria-hidden="true">
        {Array.from({ length: 2 }).map((_, i) => (
          <section className="panel sk-panel" key={i}>
            <span className="sk sk-line md" />
            <span className="sk sk-line" />
            <span className="sk sk-line" />
            <span className="sk sk-line" />
            <span className="sk sk-line sm" />
          </section>
        ))}
      </div>
      <span className="sr">Memuat data…</span>
    </>
  );
}
