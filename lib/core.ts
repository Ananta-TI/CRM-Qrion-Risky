/* Logika inti dan konstanta QRION CRM (dipindah dari prototipe HTML). */
/* eslint-disable */
export const VIEWS: [string,string][]=[['ringkasan','Ringkasan'],['isu','Isu'],['project','Project'],['sekolah','Mitra Sekolah'],['akses','Akses Data'],['pembayaran','Pembayaran Mitra'],['keluar','Uang Keluar'],['administrasi','Administrasi'],['branding','Branding Marketing'],['pipeline','Pipeline Leads'],['absen','Absen'],['catatan','Catatan'],['tim','Pengaturan']];
export const TST={Open:['Open','info'],'In Progress':['In Progress','warn'],'Waiting Validation':['Waiting Validation',''],Closed:['Closed','good']};
export const URG={Critical:['Critical','crit',0],High:['High','warn',1],Medium:['Medium','info',2],Low:['Low','',3]};
export const TRANS={Open:['In Progress','Closed'],'In Progress':['Waiting Validation','Closed'],'Waiting Validation':['Closed','In Progress'],Closed:['In Progress']};
export const TJUDUL=['Siswa tidak bisa login','Guru tidak bisa login','Lupa kata sandi akun','Akun terkunci atau dinonaktifkan','Data siswa tidak muncul','Impor data siswa gagal','Saldo kartu Oncard tidak sesuai','Top up kartu Oncard tidak masuk','Kartu Oncard tidak terbaca di mesin','Tagihan siswa tidak muncul','Pembayaran sudah dilakukan tapi belum terverifikasi','Nominal tagihan salah','Absensi tidak tercatat','Nilai atau rapor tidak muncul','Aplikasi lambat atau error','Server tidak bisa diakses','Permintaan fitur baru','Perubahan data sekolah'];
export const TCAT=['Server','Teknis','Keuangan','Akun','Transaksi','Pembayaran','Pengiriman','Produk','Lainnya'];
export const SLA_MIN: Record<string,number>={Critical:240,High:480,Medium:1440,Low:4320},REOPEN_DAYS=7,AUTOCLOSE_DAYS=3;
export const CAT_KW=[['Server',['server','server down','hosting','vps','database','jaringan','internet','koneksi','uptime','outage','downtime','maintenance','cloud','backup','domain','dns','ssl','deploy','production']],
 ['Keuangan',['keuangan','finance','gaji','payroll','anggaran','budget','laporan keuangan','pajak','reimbursement','pengeluaran','pemasukan','kas','akuntansi']],
 ['Pembayaran',['bayar','pembayaran','transfer','invoice','tagihan','kartu kredit','va ','virtual account','ewallet','e-wallet','gopay','ovo','dana','qris','cicilan','charge','tertagih','refund','dana kembali']],
 ['Transaksi',['transaksi','order','pesanan','beli','pembelian','checkout','keranjang','cart','voucher','promo','diskon','kupon','harga']],
 ['Pengiriman',['kirim','pengiriman','kurir','ekspedisi','resi','paket','barang','alamat','ongkir','jne','jnt','sicepat','anteraja','belum sampai','terlambat sampai','salah alamat','paket hilang']],
 ['Akun',['akun','login','masuk','password','sandi','otp','verifikasi','email','daftar','registrasi','profil','dibajak','diblokir','lupa password','tidak bisa masuk','reset']],
 ['Teknis',['error','bug','aplikasi','app','website','loading','lemot','crash','gangguan','sistem','tidak bisa dibuka','blank','tampilan','500']],
 ['Produk',['produk','barang rusak','cacat','kualitas','garansi','salah kirim','tidak sesuai','kadaluarsa','expired','ukuran','warna','spesifikasi']]];
export function triCat(sub,desc){const t=((sub||'')+' '+(desc||'')).toLowerCase();let best:any=['Lainnya',0];for(const [c,kw] of CAT_KW as any[]){const h=(kw as string[]).reduce((n,k)=>t.includes(k)?n+1:n,0);if(h>best[1])best=[c,h]}return best[0]}
export function triUrg(sub,desc,cat,amount){const t=((sub||'')+' '+(desc||'')).toLowerCase();cat=cat||triCat(sub,desc);let sc=0;
  if(['hilang','dibobol','penipuan','fraud','double charge','tertagih dua kali','saldo berkurang','tidak bisa login','akun dibajak','data bocor','urgent banget','segera'].some(k=>t.includes(k)))sc+=3;
  if(['gagal','error','tidak bisa','belum diterima','terlambat','komplain','kecewa','refund','batal','pending','stuck'].some(k=>t.includes(k)))sc+=1;
  if(['Pembayaran','Transaksi','Keuangan','Server'].includes(cat))sc+=1;
  if((amount||0)>=5e6)sc+=2;else if((amount||0)>=1e6)sc+=1;
  if(t.includes('!!!'))sc+=1;
  return sc>=4?'Critical':sc>=2?'High':sc>=1?'Medium':'Low'}
export function normIssue(x){const o=Object.assign({},x);
  o.subject=x.subject||x.title||'(tanpa judul)';
  o.urgency=URG[x.urgency]?x.urgency:({kritis:'Critical',tinggi:'High',sedang:'Medium',rendah:'Low'}[x.priority]||'Medium');
  o.status=TST[x.status]?x.status:({baru:'Open',diproses:'In Progress',menunggu:'Waiting Validation',selesai:'Closed'}[x.status]||'Open');
  o.category=TCAT.includes(x.category)?x.category:({'Bug':'Teknis','Akun & akses':'Akun','Tagihan':'Pembayaran','Permintaan fitur':'Produk'}[x.category]||'Lainnya');
  o.assignee=x.assignee!==undefined?x.assignee:(x.dev||null);
  o.messages=x.messages||(x.log||[]).map(l=>({at:l.at,by:l.by,kind:'text',body:l.text}));
  o.createdAt=x.createdAt||new Date().toISOString();
  o.slaDeadline=x.slaDeadline||(x.dueDate?x.dueDate+'T17:00:00':new Date(new Date(o.createdAt).getTime()+SLA_MIN[o.urgency]*6e4).toISOString());
  o.closedAt=x.closedAt||x.resolvedAt||null;return o}
export const PRIO={kritis:['Kritis','crit',0],tinggi:['Tinggi','warn',1],sedang:['Sedang','info',2],rendah:['Rendah','',3]};
export const PSTAT={perencanaan:'Perencanaan',berjalan:'Berjalan',tertahan:'Tertahan',selesai:'Selesai'};
export const TSTAT={belum:['Belum mulai',''],dikerjakan:['Dikerjakan','warn'],selesai:['Selesai','good']};
export const SLA={kritis:1,tinggi:3,sedang:7,rendah:14};
export const ATYPE=['Catatan','Telepon','WhatsApp','Email','Kunjungan','Rapat'];
export const CHANNEL=['WhatsApp','Telepon','Email','Kunjungan','Lainnya'];
export const LSRC=['Website (Live Preview)','Daftar akun QMS','Chat WA QRION','Leads Offline'];
export const PFX={isu:'ISU',project:'PRJ',sekolah:'SKL',pipeline:'LEAD'};
export const PTYPE=['IT Produk','Implementasi','Bisnis'];
export const SSTAT={onboarding:['Onboarding','info'],aktif:['Aktif','good'],berisiko:['Berisiko','warn'],churn:['Berhenti','']};
export const JENJANG=['SD','SMP','SMA','SMK','Yayasan'];
export const STAGE_C={baru:'#4f8cf7',kontak:'#14a8c4',demo:'#8b5cf6',proposal:'#f5a524',negosiasi:'#f97316',menang:'#1f9d55',kalah:'#e5484d'};
export const STAGES=[['baru','Lead baru',10],['kontak','Sudah dikontak',25],['demo','Demo',45],['proposal','Proposal',65],['negosiasi','Negosiasi',85],['menang','Menang',100],['kalah','Kalah',0]];
export const LV3=[[0,'Tidak ada'],[1,'Lihat'],[2,'Ubah']];
export const MODS: any[]=[['ringkasan','Ringkasan',[[0,'Tidak ada'],[1,'Lihat']]],['isu','Isu',[[0,'Tidak ada'],[1,'Lihat'],[2,'Buat tiket'],[3,'Tangani tiket']]],['isuNo','Ajukan keluhan',[[0,'Boleh'],[1,'Tidak']]],['project','Project',[[0,'Tidak ada'],[1,'Lihat'],[2,'Perbarui tugas'],[3,'Kelola project']]],['sekolah','Mitra Sekolah',LV3],['pembayaran','Pembayaran Mitra',LV3],['administrasi','Administrasi (surat dan MoU)',LV3],['branding','Branding Marketing',LV3],['pipeline','Pipeline Leads',LV3]];
MODS.push(['akses','Akses Data (data QMS sekolah)',[[0,'Tidak ada'],[1,'Lihat data']]]);
MODS.push(['absen','Absen',[[0,'Hanya absen sendiri'],[1,'Lihat rekap tim'],[2,'Kelola absensi tim']]]);
export const DEF_ACCESS={pm:{name:'Project Manager',home:'project',access:{ringkasan:1,isu:2,project:3,sekolah:1,pembayaran:2,administrasi:2,branding:2,pipeline:1,absen:2,akses:1}},
  ceo:{name:'CEO',home:'ringkasan',access:{ringkasan:1,isu:2,project:2,sekolah:2,pembayaran:2,administrasi:2,branding:2,pipeline:2,absen:1,akses:1}},
  programmer:{name:'Programmer',home:'isu',access:{ringkasan:0,isu:3,isuNo:1,project:2,sekolah:0,pembayaran:0,pipeline:0,akses:1}},
  cs:{name:'Customer Service',home:'isu',access:{ringkasan:0,isu:2,project:0,sekolah:1,pembayaran:0,branding:1,pipeline:0,akses:1}},
  am:{name:'Account Manager',home:'sekolah',access:{ringkasan:0,isu:2,project:0,sekolah:2,pembayaran:0,administrasi:1,branding:1,pipeline:2,akses:1}}};
export const COL={isu:'issues',project:'projects',sekolah:'schools',sekprod:'schools',pipeline:'leads'};
export const KEY={isu:'issues',project:'projects',sekolah:'schools',sekprod:'schools',pipeline:'leads'};
export const pad=n=>String(n).padStart(2,'0');
export const iso=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
export const today=()=>iso(new Date());
export const days=(a,b)=>Math.round((new Date(b+'T00:00:00').getTime()-new Date(a+'T00:00:00').getTime())/864e5);
export const fmtD=s=>{if(!s)return '—';const d=new Date(String(s).slice(0,10)+'T00:00:00');return isNaN(d.getTime())?'—':d.toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'})};
export const rp=n=>'Rp '+Math.round(n||0).toLocaleString('id-ID');
export const rpS=n=>{n=n||0;const f=(v,u)=>'Rp '+v.toLocaleString('id-ID',{maximumFractionDigits:1})+' '+u;return n>=1e9?f(n/1e9,'M'):n>=1e6?f(n/1e6,'jt'):n>=1e3?f(n/1e3,'rb'):'Rp '+n};
export const sMrr=s=>(s.products||[]).reduce((a,p)=>a+(+p.mrr||0),0);
export const live=s=>s.status!=='churn';
export function contract(s){
  if(!s.contractEnd)return['Belum ada kontrak','',null];
  const d=days(today(),s.contractEnd);
  if(d<0)return['Kedaluwarsa '+(-d)+' hari','crit',d];
  if(d<=60)return['Berakhir '+d+' hari lagi','warn',d];
  return['Aktif','good',d];
}
export const tstat=t=>t.status||(t.done?'selesai':'belum');
export function pProg(p){const m=p.milestones||[];return m.length?Math.round(m.filter(x=>tstat(x)==='selesai').length/m.length*100):0}
export const tLate=p=>(p.milestones||[]).filter(x=>tstat(x)!=='selesai'&&x.due&&x.due<today()).length;
export function pHealth(p){
  if(p.status==='selesai')return['Selesai',''];
  const t=today();
  if(p.end&&p.end<t)return['Terlambat','crit'];
  if(p.status==='tertahan')return['Tertahan','warn'];
  if(p.status==='perencanaan')return['Perencanaan','info'];
  if(p.start&&p.end){const tot=days(p.start,p.end)||1,el=Math.max(0,days(p.start,t));if(el/tot-pProg(p)/100>.25)return['Perlu perhatian','warn']}
  return['Lancar','good'];
}
export const code=(k,x)=>(k==='isu'?'TKT-'+String(x.createdAt||'').slice(2,4)+String(x.createdAt||'').slice(5,7):PFX[k])+'-'+String(x.id).replace(/[^a-z0-9]/gi,'').slice(-4).toUpperCase();
export const addDays=(d0,n)=>{const d=new Date(d0+'T00:00:00');d.setDate(d.getDate()+n);return iso(d)};
export function durFmt(h){h=Math.abs(h);if(h<1)return Math.max(1,Math.round(h*60))+' menit';if(h<24)return Math.round(h)+' jam';const d=h/24;return (d<10?d.toFixed(1).replace('.',','):Math.round(d))+' hari'}
export function slaOf(i){
  if(i.status==='Closed')return{tone:i.slaBreached?'crit':'good',label:i.slaBreached?'Selesai, lewat SLA':'Selesai',used:100};
  const start=new Date(i.createdAt).getTime(),end=new Date(i.slaDeadline).getTime(),paused=i.status==='Waiting Validation'&&i.pausedAt;
  const now=paused?new Date(i.pausedAt).getTime():Date.now(),pm=Math.max(i.pausedMinutes||0,0)*6e4,total=Math.max(end-start-pm,1),used=Math.min(Math.max((now-start-pm)/total*100,0),100),left=(end-now)/36e5;
  if(!(left>0))return{tone:'crit',label:'Lewat '+durFmt(-left||0),used:100,breached:true};
  if(paused)return{tone:'',label:'Menunggu validasi pelapor',used};
  return{tone:left<=total/36e5/3?'warn':'good',label:durFmt(left)+' lagi',used};
}
export const sla=i=>{const g=slaOf(i);return[g.label,g.tone]};
export const fmtDT=v=>{if(!v)return '—';const d=new Date(v);return isNaN(d.getTime())?'—':d.toLocaleString('id-ID',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})};
export function relTime(v){const m=Math.round((Date.now()-new Date(v).getTime())/6e4);if(!(m>=1))return 'baru saja';if(m<60)return m+' menit lalu';const h=Math.round(m/60);if(h<24)return h+' jam lalu';const d=Math.round(h/24);return d<30?d+' hari lalu':fmtD(v)}
export const inits=n=>String(n||'?').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0].toUpperCase()).join('');
export const BLN=['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
export const nowYM=()=>today().slice(0,7);
export const addM=(ym,n)=>{let y=+ym.slice(0,4),m=+ym.slice(5,7)-1+n;y+=Math.floor(m/12);m=((m%12)+12)%12;return y+'-'+pad(m+1)};
export const mLabel=ym=>(BLN[+String(ym).slice(5,7)-1]||'?')+' '+String(ym).slice(2,4);
export const isYM=v=>/^\d{4}-(0[1-9]|1[0-2])$/.test(String(v));
export const pItems=x=>Array.isArray(x.items)?x.items:[];
export const numOf=v=>{const d=String(v==null?'':v).replace(/[^0-9]/g,'');return d?parseInt(d,10):null};
export const tBul=(y,x)=>{const b=(Array.isArray(y.bulan)?y.bulan:[]).filter(isYM);if(b.length)return b;const d=String((x&&(x.tanggal||x.dibuat))||'').slice(0,7);return isYM(d)?[d]:[]};
export function paySummary(pay:any[]){const by:any={};pay.forEach(x=>{const g=by[x.mitraId]||(by[x.mitraId]={months:{},tamb:0,tn:0,tu:0,total:0,n:0,und:0});g.total+=typeof x.total==='number'?x.total:0;g.n++;const it=pItems(x);if(x.tipe==='transaksi'&&x.trx&&isYM(x.trx.bulan)){const t2=g.trx||(g.trx={});t2[x.trx.bulan]=(t2[x.trx.bulan]||0)+(typeof x.total==='number'?x.total:0)}if(x.tipe==='topup'&&x.topup&&isYM(x.topup.bulan)){const t3=g.tup||(g.tup={});t3[x.topup.bulan]=(t3[x.topup.bulan]||0)+(typeof x.total==='number'?x.total:0)}if(x.tipe==='topup'||x.tipe==='transaksi'){g.top=(g.top||0)+(typeof x.total==='number'?x.total:0);return}if(!it.length)g.und++;
  const lg=it.filter(y=>y.jenis!=='tambahan'),one=lg.length===1&&it.length===1&&typeof x.total==='number'&&x.total>0;it.forEach(y=>{if(y.jenis!=='tambahan'){const bl=(Array.isArray(y.bulan)?y.bulan:[]).filter(isYM),v=typeof y.nominal==='number'?y.nominal:(one?x.total:null);if(v!=null&&bl.length){const g2=g.nom||(g.nom={});bl.forEach(b=>{g2[b]=(g2[b]||0)+v})}}if(y.jenis==='tambahan'){tBul(y,x).forEach(b=>{const e=g.ext||(g.ext={});(e[b]||(e[b]=[])).push({n:y.nama||'Biaya tambahan',v:typeof y.nominal==='number'?y.nominal:null})});(g.tl||(g.tl=[])).push({n:y.nama||'Biaya tambahan',v:typeof y.nominal==='number'?y.nominal:null});g.tn++;if(typeof y.nominal==='number')g.tamb+=y.nominal;else g.tu++}else(Array.isArray(y.bulan)?y.bulan:[]).forEach(b=>{if(isYM(b)){(g.months[b]||(g.months[b]=[])).push(y.nama||'Langganan');(g.md||(g.md={}))[b]=(g.md[b]||[]).concat([{n:y.nama||'Langganan',v:typeof y.nominal==='number'?y.nominal:(one?x.total:null)}])}})})});Object.keys(by).forEach(k=>{const g=by[k];if(!g.md)return;Object.keys(g.md).forEach(b=>{const d=g.md[b];if(d.some(e=>e.v!=null)&&d.some(e=>e.v==null&&e.n==='Langganan')){g.months[b]=d.filter(e=>!(e.v==null&&e.n==='Langganan')).map(e=>e.n)}})});return by}
export const invCalc=(items,dsk,ppn)=>{let sub=0,ld=0;(items||[]).forEach(y=>{const g=(numOf(y.qty)||0)*(numOf(y.harga)||0);sub+=g;ld+=Math.min(numOf(y.disc)||0,g)});const dk=ld+Math.min(numOf(dsk)||0,sub-ld),dpp=sub-dk,pj=0;return{sub,dk,pj,total:dpp}};
export const BLN_F=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
export const fmtL=v=>{const d=new Date(String(v||'').slice(0,10)+'T00:00:00');return isNaN(d.getTime())?'':d.getDate()+' '+BLN[d.getMonth()]+', '+d.getFullYear()};
export const invEff=x=>x.status==='terbit'&&x.jatuhTempo&&x.jatuhTempo<today()?'terlambat':(x.status||'terbit');
export const INV_ST={terbit:['Belum dibayar','info'],terlambat:['Terlambat','crit'],lunas:['Lunas','good'],batal:['Batal','']};
export const invTot=x=>invCalc(x.items,x.diskon,x.ppn).total;
export const tsort=(a,b)=>(+(b.status!=='Closed')-+(a.status!=='Closed'))||(+overdue(b)-+overdue(a))||String(a.slaDeadline).localeCompare(String(b.slaDeadline));
export const age=x=>x.createdAt?Math.max(0,days(String(x.createdAt).slice(0,10),today())):0;
export const lastAct=x=>{const l=x.log||[];return l.length?String(l[l.length-1].at).slice(0,10):null};
export const overdue=i=>i.status!=='Closed'&&!!slaOf(i).breached;
export const stage=k=>STAGES.find(s=>s[0]===k)||STAGES[0];
export const daysTo=d=>{if(!d)return null;const a=new Date(String(d).slice(0,10)+'T00:00:00'),b=new Date(today()+'T00:00:00');return isNaN(a.getTime())?null:Math.round((a.getTime()-b.getTime())/864e5)};