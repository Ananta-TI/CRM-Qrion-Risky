"use client";
import { useRouter } from "next/navigation";
import ViewFrame from "@/components/ui/ViewFrame";
import { Bars, Panel, Pill, RowItem, Rows } from "@/components/ui";
import { useAccess } from "@/lib/auth/access";
import {
  LSRC, STAGES, addDays, addM, code, contract, daysTo, fmtD, invEff, invTot, isYM, live, mLabel, nowYM, overdue,
  pHealth, pProg, paySummary, rp, rpS, sMrr, sla, stage, today, tsort, tstat,
} from "@/lib/core";
import { useCollection } from "@/lib/data/db";
import { useNameOf } from "@/lib/names";
import { useSession } from "@/lib/auth/session";

export default function Ringkasan() {
  const A = useAccess();
  const router = useRouter();
  const nameOf = useNameOf();
  const { acct } = useSession();
  const schools = useCollection("schools");
  const issues = useCollection("issues");
  const projects = useCollection("projects");
  const leads = useCollection("leads");
  const products = (useCollection("settings").find((s) => s.id === "products") as any)?.items || [];
  const pay = useCollection("pembayaran");
  const invoices = useCollection("invoices");
  const mou = useCollection("mou");

  const myAm = acct ? acct.am || (acct.role === "am" ? "a:" + acct.id : null) : null;
  const meId = acct ? "a:" + acct.id : null;
  const schoolName = (id: string) => schools.find((s) => s.id === id)?.name || "";
  const iSch = (i: any) => schoolName(i.schoolId);
  const asg = (p: any) => p.assignee || (p.assignees || []).map(nameOf).join(", ");

  const ls = schools.filter((s) => live(s));
  const mrr = ls.reduce((a, s) => a + sMrr(s), 0);
  const open = issues.filter((i) => i.status !== "Closed");
  const hot = open.filter((i) => ["Critical", "High"].includes(i.urgency));
  const run = projects.filter((p) => p.status !== "selesai");
  const late = run.filter((p) => pHealth(p)[1] === "crit");
  const ol = leads.filter((l) => !["menang", "kalah"].includes(l.stage));
  const wp = ol.reduce((a, l) => a + (+l.estMrr || 0) * +(stage(l.stage)[2] as number) / 100, 0);
  const risk = ls.filter((s) => s.status === "berisiko").length;
  const exp = ls
    .map((s) => [s, contract(s)] as const)
    .filter((x) => x[1][2] != null && (x[1][2] as number) <= 60)
    .sort((a, b) => (a[1][2] as number) - (b[1][2] as number));

  const byP = products.map((p: any) => [
    p.name,
    ls.reduce((a, s) => a + (s.products || []).filter((x: any) => x.productId === p.id).reduce((b: number, x: any) => b + (+x.mrr || 0), 0), 0),
    ls.filter((s) => (s.products || []).some((x: any) => x.productId === p.id)).length,
  ]);
  const lim = addDays(today(), 7);
  const fu = ol
    .filter((l) => l.nextDate && l.nextDate <= lim)
    .map((l) => ["pipeline", l] as const)
    .concat(ls.filter((x) => x.nextDate && x.nextDate <= lim).map((x) => ["sekolah", x] as any))
    .sort((a, b) => (a[1].nextDate < b[1].nextDate ? -1 : 1));
  const fn = STAGES.slice(0, 5).map((g: any) => {
    const it = ol.filter((l) => (l.stage || "baru") === g[0]);
    return [g[1], it.reduce((a, l) => a + (+l.estMrr || 0), 0), it.length] as const;
  });
  const sr = LSRC.map((x: string) => {
    const it = leads.filter((l) => l.source === x);
    return [x, it.length, it.filter((l) => l.stage === "menang").length] as const;
  });
  const myT: any[] = [];
  if (meId) projects.forEach((p) => p.status !== "selesai" && (p.milestones || []).forEach((t: any) => { if (t.who === meId && tstat(t) !== "selesai") myT.push([p, t]); }));
  const myI = meId || myAm
    ? open.filter((i) => (meId && (i.am === meId || i.assignee === meId || i.createdBy === meId)) || (myAm && i.am === myAm)).sort(tsort)
    : [];

  const py: any = A.allowed("pembayaran") ? paySummary(pay) : {};
  const nm0 = nowYM();
  const rn: [any, string, number][] = [];
  ls.filter((x) => !myAm || x.am === myAm).forEach((x) => {
    const g = py[x.id];
    if (!g) return;
    const ms = Object.keys(g.months || {}).filter(isYM).sort();
    if (!ms.length) return;
    const last = ms[ms.length - 1];
    if (last > addM(nm0, 1)) return;
    const gap = (+nm0.slice(0, 4) - +last.slice(0, 4)) * 12 + (+nm0.slice(5, 7) - +last.slice(5, 7));
    rn.push([x, last, gap]);
  });
  rn.sort((a, b) => (a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0));
  const lim7 = addDays(today(), 7);
  const ivs = A.allowed("pembayaran")
    ? invoices
        .filter((x) => { const e = invEff(x); return e === "terlambat" || (e === "terbit" && x.jatuhTempo && x.jatuhTempo <= lim7); })
        .sort((a, b) => String(a.jatuhTempo || "9").localeCompare(String(b.jatuhTempo || "9")))
    : [];
  const mus = A.allowed("administrasi")
    ? mou.filter((x) => x.status === "aktif" && x.berakhir && daysTo(x.berakhir) !== null && (daysTo(x.berakhir) as number) <= 60).sort((a, b) => String(a.berakhir).localeCompare(String(b.berakhir)))
    : [];
  const invTo = (x: any) => String(x.untuk || "").trim() || (x.mitraId ? schoolName(x.mitraId) : "") || "-";

  const issueRows = open.filter((i) => overdue(i) || hot.includes(i)).sort(tsort).slice(0, 6);
  const prjRows = run.slice().sort((a, b) => ((a.end || "9") < (b.end || "9") ? -1 : 1)).slice(0, 6);

  return (
    <ViewFrame title="Ringkasan" sub={"Kondisi mitra, isu, project, dan pipeline per " + fmtD(today()) + "."}>
      <div className="tiles">
        <div className="tile"><span>MRR berjalan</span><strong>{rpS(mrr)}</strong><em>{ls.length} mitra sekolah</em></div>
        <div className="tile"><span>Mitra berisiko</span><strong>{risk}</strong><em className={exp.length ? "warn" : ""}>{exp.length} kontrak perlu diperpanjang</em></div>
        <div className="tile"><span>Isu terbuka</span><strong>{open.length}</strong><em className={hot.length ? "crit" : ""}>{hot.length} High atau Critical · {open.filter(overdue).length} lewat SLA</em></div>
        <div className="tile"><span>Project berjalan</span><strong>{run.length}</strong><em className={late.length ? "crit" : ""}>{late.length} terlambat</em></div>
        <div className="tile"><span>Pipeline tertimbang</span><strong>{rpS(wp)}</strong><em>{ol.length} leads terbuka, MRR per bulan</em></div>
      </div>
      <div className="grid2" style={{ marginTop: 14 }}>
        {A.allowed("pembayaran") ? (
          <>
            <Panel title="Langganan hampir habis" link="pembayaran" linkLabel="Status mitra">
              <Rows count={rn.length} empty="Tidak ada langganan yang habis dalam 1 bulan.">
                {rn.slice(0, 8).map(([x, last, gap]) => (
                  <RowItem key={x.id} kind="sekolah" id={x.id} title={x.name} sub={"Dibayar s.d. " + mLabel(last) + " · " + nameOf(x.am)}
                    right={<Pill t={gap > 0 ? "Menunggak " + gap + " bulan" : gap === 0 ? "Habis bulan ini" : "Habis bulan depan"} c={gap > 0 ? "crit" : "warn"} />} />
                ))}
              </Rows>
            </Panel>
            <Panel title="Invoice belum dibayar" link="pembayaran" linkLabel="Invoice">
              <Rows count={ivs.length} empty="Tidak ada invoice yang belum dibayar mendekati jatuh tempo.">
                {ivs.slice(0, 8).map((x) => {
                  const n = daysTo(x.jatuhTempo);
                  return (
                    <button key={x.id} className="rowi" onClick={() => router.push("/pembayaran?tab=invoice")}>
                      <span><span className="t">{invTo(x)}</span><small>{(x.no || "Invoice") + " · " + rp(invTot(x))}</small></span>
                      <Pill t={n === null ? "Belum bayar" : n < 0 ? "Terlambat " + -n + " hari" : n === 0 ? "Jatuh tempo hari ini" : "Jatuh tempo " + n + " hari lagi"} c={n !== null && n < 0 ? "crit" : "warn"} />
                    </button>
                  );
                })}
              </Rows>
            </Panel>
          </>
        ) : null}
        {A.allowed("administrasi") ? (
          <Panel title="MoU segera berakhir" link="administrasi" linkLabel="Administrasi">
            <Rows count={mus.length} empty="Tidak ada MoU yang berakhir dalam 60 hari.">
              {mus.slice(0, 8).map((x) => {
                const n = daysTo(x.berakhir) as number;
                return (
                  <button key={x.id} className="rowi" onClick={() => router.push("/administrasi?tab=mou")}>
                    <span><span className="t">{invTo(x)}</span><small>{(x.judul || "MoU") + " · berakhir " + fmtD(x.berakhir)}</small></span>
                    <Pill t={n < 0 ? "Sudah berakhir" : n + " hari lagi"} c={n < 0 ? "crit" : "warn"} />
                  </button>
                );
              })}
            </Rows>
          </Panel>
        ) : null}
        <Panel title="Kontrak segera berakhir" link="sekolah" linkLabel="Semua mitra">
          <Rows count={exp.length} empty="Tidak ada kontrak yang berakhir dalam 60 hari.">
            {exp.slice(0, 6).map(([s, c]) => (
              <RowItem key={s.id} kind="sekolah" id={s.id} title={s.name} sub={rp(sMrr(s)) + " per bulan · " + nameOf(s.am)} right={<Pill t={c[0] as string} c={c[1] as string} />} />
            ))}
          </Rows>
        </Panel>
        <Panel title="Isu yang perlu perhatian" link="isu" linkLabel="Semua isu">
          <Rows count={issueRows.length} empty="Tidak ada tiket prioritas tinggi atau lewat SLA.">
            {issueRows.map((i) => {
              const g = sla(i);
              return <RowItem key={i.id} kind="isu" id={i.id} title={i.subject} sub={[code("isu", i), i.urgency, iSch(i)].filter(Boolean).join(" · ")} right={<Pill t={g[0]} c={g[1]} />} />;
            })}
          </Rows>
        </Panel>
        <Panel title="Project berjalan" link="project" linkLabel="Semua project">
          <Rows count={prjRows.length} empty="Belum ada project yang berjalan.">
            {prjRows.map((p) => {
              const h = pHealth(p);
              return <RowItem key={p.id} kind="project" id={p.id} title={p.name} sub={(asg(p) ? asg(p) + " · " : "") + pProg(p) + "% · deadline " + fmtD(p.end)} right={<Pill t={h[0]} c={h[1]} />} />;
            })}
          </Rows>
        </Panel>
        <Panel title="MRR per produk" link="sekolah" linkLabel="Rincian">
          {byP.length ? (
            <Bars items={byP.map((x: any) => ({ label: <>{x[0]} <small style={{ color: "var(--ink2)" }}>{x[2]} sekolah</small></>, value: x[1], text: rpS(x[1]) }))} />
          ) : <div className="empty">Tambahkan produk di menu Pengaturan.</div>}
        </Panel>
        <Panel title="Tindak lanjut 7 hari ke depan" link="pipeline" linkLabel="Pipeline">
          <Rows count={fu.length} empty="Tidak ada tindak lanjut terjadwal dalam 7 hari.">
            {fu.slice(0, 6).map(([k, x]: any) => (
              <RowItem key={k + x.id} kind={k} id={x.id} title={x.nextAction || "Tindak lanjut"} sub={x.name + " · " + nameOf(x.am)}
                right={<Pill t={fmtD(x.nextDate)} c={x.nextDate < today() ? "crit" : x.nextDate === today() ? "warn" : ""} />} />
            ))}
          </Rows>
        </Panel>
        <Panel title="Corong pipeline" link="pipeline" linkLabel="Pipeline">
          {ol.length ? (
            <Bars items={fn.map((x) => ({ label: <>{x[0]} <small style={{ color: "var(--ink2)" }}>{x[2]} leads</small></>, value: x[1], text: rpS(x[1]) }))} />
          ) : <div className="empty">Belum ada lead terbuka.</div>}
        </Panel>
        <Panel title="Leads per sumber" link="pipeline" linkLabel="Pipeline">
          {leads.length ? (
            <Bars items={sr.map((x) => ({ label: x[0], value: x[1], text: <>{x[1]} leads<small style={{ color: "var(--ink2)", fontWeight: 400 }}> · {x[2]} menang</small></> }))} />
          ) : <div className="empty">Belum ada lead.</div>}
        </Panel>
        {myT.length ? (
          <Panel title="Tugas saya" link="project" linkLabel="Semua project">
            <Rows count={myT.length} empty="">
              {myT.sort((a, b) => ((a[1].due || "9") < (b[1].due || "9") ? -1 : 1)).slice(0, 6).map(([p, t]) => (
                <RowItem key={p.id + t.title} kind="project" id={p.id} title={t.title} sub={p.name} right={<Pill t={fmtD(t.due)} c={t.due && t.due < today() ? "crit" : ""} />} />
              ))}
            </Rows>
          </Panel>
        ) : null}
        {myI.length ? (
          <Panel title="Tiket saya" link="isu" linkLabel="Semua tiket">
            <Rows count={myI.length} empty="">
              {myI.slice(0, 6).map((i) => {
                const g = sla(i);
                return <RowItem key={i.id} kind="isu" id={i.id} title={i.subject} sub={[code("isu", i), i.status, iSch(i)].filter(Boolean).join(" · ")} right={<Pill t={g[0]} c={g[1]} />} />;
              })}
            </Rows>
          </Panel>
        ) : null}
      </div>
    </ViewFrame>
  );
}
