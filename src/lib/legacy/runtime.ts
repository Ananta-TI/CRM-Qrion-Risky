// @ts-nocheck
/* eslint-disable */
/* Mesin tampilan modul (disalin dari prototipe, disesuaikan agar berjalan di dalam Next.js). */
export default function boot(){
"use strict";
const $=(s,r)=>(r||document).querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const VIEWS=[['ringkasan','Ringkasan'],['isu','Isu'],['project','Project'],['sekolah','Mitra Sekolah'],['akses','Akses Data'],['pembayaran','Pembayaran Mitra'],['keluar','Uang Keluar'],['administrasi','Administrasi'],['branding','Branding Marketing'],['pipeline','Pipeline Leads'],['absen','Absen'],['catatan','Catatan'],['tim','Pengaturan']];
const TST={Open:['Open','info'],'In Progress':['In Progress','warn'],'Waiting Validation':['Waiting Validation',''],Closed:['Closed','good']};
const URG={Critical:['Critical','crit',0],High:['High','warn',1],Medium:['Medium','info',2],Low:['Low','',3]};
const TRANS={Open:['In Progress','Closed'],'In Progress':['Waiting Validation','Closed'],'Waiting Validation':['Closed','In Progress'],Closed:['In Progress']};
const TJUDUL=['Siswa tidak bisa login','Guru tidak bisa login','Lupa kata sandi akun','Akun terkunci atau dinonaktifkan','Data siswa tidak muncul','Impor data siswa gagal','Saldo kartu Oncard tidak sesuai','Top up kartu Oncard tidak masuk','Kartu Oncard tidak terbaca di mesin','Tagihan siswa tidak muncul','Pembayaran sudah dilakukan tapi belum terverifikasi','Nominal tagihan salah','Absensi tidak tercatat','Nilai atau rapor tidak muncul','Aplikasi lambat atau error','Server tidak bisa diakses','Permintaan fitur baru','Perubahan data sekolah'];
const subjOpts=()=>{const seen=new Set(),out=[];TJUDUL.concat(S.issues.map(i=>i.subject)).forEach(t=>{t=String(t||'').trim();const k=t.toLowerCase();if(t&&t!=='(tanpa judul)'&&!seen.has(k)){seen.add(k);out.push(t)}});return out.slice(0,80)};
const TCAT=['Server','Teknis','Keuangan','Akun','Transaksi','Pembayaran','Pengiriman','Produk','Lainnya'];
const SLA_MIN={Critical:240,High:480,Medium:1440,Low:4320},REOPEN_DAYS=7,AUTOCLOSE_DAYS=3;
const CAT_KW=[['Server',['server','server down','hosting','vps','database','jaringan','internet','koneksi','uptime','outage','downtime','maintenance','cloud','backup','domain','dns','ssl','deploy','production']],
 ['Keuangan',['keuangan','finance','gaji','payroll','anggaran','budget','laporan keuangan','pajak','reimbursement','pengeluaran','pemasukan','kas','akuntansi']],
 ['Pembayaran',['bayar','pembayaran','transfer','invoice','tagihan','kartu kredit','va ','virtual account','ewallet','e-wallet','gopay','ovo','dana','qris','cicilan','charge','tertagih','refund','dana kembali']],
 ['Transaksi',['transaksi','order','pesanan','beli','pembelian','checkout','keranjang','cart','voucher','promo','diskon','kupon','harga']],
 ['Pengiriman',['kirim','pengiriman','kurir','ekspedisi','resi','paket','barang','alamat','ongkir','jne','jnt','sicepat','anteraja','belum sampai','terlambat sampai','salah alamat','paket hilang']],
 ['Akun',['akun','login','masuk','password','sandi','otp','verifikasi','email','daftar','registrasi','profil','dibajak','diblokir','lupa password','tidak bisa masuk','reset']],
 ['Teknis',['error','bug','aplikasi','app','website','loading','lemot','crash','gangguan','sistem','tidak bisa dibuka','blank','tampilan','500']],
 ['Produk',['produk','barang rusak','cacat','kualitas','garansi','salah kirim','tidak sesuai','kadaluarsa','expired','ukuran','warna','spesifikasi']]];
function triCat(sub,desc){const t=((sub||'')+' '+(desc||'')).toLowerCase();let best=['Lainnya',0];for(const [c,kw] of CAT_KW){const h=kw.reduce((n,k)=>t.includes(k)?n+1:n,0);if(h>best[1])best=[c,h]}return best[0]}
function triUrg(sub,desc,cat,amount){const t=((sub||'')+' '+(desc||'')).toLowerCase();cat=cat||triCat(sub,desc);let sc=0;
  if(['hilang','dibobol','penipuan','fraud','double charge','tertagih dua kali','saldo berkurang','tidak bisa login','akun dibajak','data bocor','urgent banget','segera'].some(k=>t.includes(k)))sc+=3;
  if(['gagal','error','tidak bisa','belum diterima','terlambat','komplain','kecewa','refund','batal','pending','stuck'].some(k=>t.includes(k)))sc+=1;
  if(['Pembayaran','Transaksi','Keuangan','Server'].includes(cat))sc+=1;
  if((amount||0)>=5e6)sc+=2;else if((amount||0)>=1e6)sc+=1;
  if(t.includes('!!!'))sc+=1;
  return sc>=4?'Critical':sc>=2?'High':sc>=1?'Medium':'Low'}
function normIssue(x){const o=Object.assign({},x);
  o.subject=x.subject||x.title||'(tanpa judul)';
  o.urgency=URG[x.urgency]?x.urgency:({kritis:'Critical',tinggi:'High',sedang:'Medium',rendah:'Low'}[x.priority]||'Medium');
  o.status=TST[x.status]?x.status:({baru:'Open',diproses:'In Progress',menunggu:'Waiting Validation',selesai:'Closed'}[x.status]||'Open');
  o.category=TCAT.includes(x.category)?x.category:({'Bug':'Teknis','Akun & akses':'Akun','Tagihan':'Pembayaran','Permintaan fitur':'Produk'}[x.category]||'Lainnya');
  o.assignee=x.assignee!==undefined?x.assignee:(x.dev||null);
  o.messages=x.messages||(x.log||[]).map(l=>({at:l.at,by:l.by,kind:'text',body:l.text}));
  o.createdAt=x.createdAt||new Date().toISOString();
  o.slaDeadline=x.slaDeadline||(x.dueDate?x.dueDate+'T17:00:00':new Date(new Date(o.createdAt).getTime()+SLA_MIN[o.urgency]*6e4).toISOString());
  o.closedAt=x.closedAt||x.resolvedAt||null;return o}
const PRIO={kritis:['Kritis','crit',0],tinggi:['Tinggi','warn',1],sedang:['Sedang','info',2],rendah:['Rendah','',3]};
const PSTAT={perencanaan:'Perencanaan',berjalan:'Berjalan',tertahan:'Tertahan',selesai:'Selesai'};
const TSTAT={belum:['Belum mulai',''],dikerjakan:['Dikerjakan','warn'],selesai:['Selesai','good']};
const SLA={kritis:1,tinggi:3,sedang:7,rendah:14};
const ATYPE=['Catatan','Telepon','WhatsApp','Email','Kunjungan','Rapat'];
const CHANNEL=['WhatsApp','Telepon','Email','Kunjungan','Lainnya'];
const LSRC=['Website (Live Preview)','Daftar akun QMS','Chat WA QRION','Leads Offline'];
const PFX={isu:'ISU',project:'PRJ',sekolah:'SKL',pipeline:'LEAD'};
const PTYPE=['IT Produk','Implementasi','Bisnis'];
const waLink=v=>{const raw=String(v||'').trim();if(!raw)return'';let d=raw.replace(/[^0-9+]/g,'');if(!/^\+?[0-9]{8,15}$/.test(d))return esc(raw);d=d.replace(/^\+/,'');if(d.startsWith('0'))d='62'+d.slice(1);return esc(raw)+' <a class="btn small" href="https://wa.me/'+d+'" target="_blank" rel="noopener noreferrer">WhatsApp</a>'};
const SSTAT={onboarding:['Onboarding','info'],aktif:['Aktif','good'],berisiko:['Berisiko','warn'],churn:['Berhenti','']};
const JENJANG=['SD','SMP','SMA','SMK','Yayasan'];
const STAGE_C={baru:'#4f8cf7',kontak:'#14a8c4',demo:'#8b5cf6',proposal:'#f5a524',negosiasi:'#f97316',menang:'#1f9d55',kalah:'#e5484d'};
const stPill=k=>{const g=STAGES.find(x=>x[0]===k)||STAGES[0];return '<span class="spill" style="--c:'+(STAGE_C[g[0]]||'#888')+'">'+esc(g[1])+'</span>'};
const STAGES=[['baru','Lead baru',10],['kontak','Sudah dikontak',25],['demo','Demo',45],['proposal','Proposal',65],['negosiasi','Negosiasi',85],['menang','Menang',100],['kalah','Kalah',0]];
const LV3=[[0,'Tidak ada'],[1,'Lihat'],[2,'Ubah']];
const MODS=[['ringkasan','Ringkasan',[[0,'Tidak ada'],[1,'Lihat']]],['isu','Isu',[[0,'Tidak ada'],[1,'Lihat'],[2,'Buat tiket'],[3,'Tangani tiket']]],['isuNo','Ajukan keluhan',[[0,'Boleh'],[1,'Tidak']]],['project','Project',[[0,'Tidak ada'],[1,'Lihat'],[2,'Perbarui tugas'],[3,'Kelola project']]],['sekolah','Mitra Sekolah',LV3],['pembayaran','Pembayaran Mitra',LV3],['administrasi','Administrasi (surat dan MoU)',LV3],['branding','Branding Marketing',LV3],['pipeline','Pipeline Leads',LV3]];
MODS.push(['akses','Akses Data (data QMS sekolah)',[[0,'Tidak ada'],[1,'Lihat data']]]);
MODS.push(['absen','Absen',[[0,'Hanya absen sendiri'],[1,'Lihat rekap tim'],[2,'Kelola absensi tim']]]);
const DEF_ACCESS={pm:{name:'Project Manager',home:'project',access:{ringkasan:1,isu:2,project:3,sekolah:1,pembayaran:2,administrasi:2,branding:2,pipeline:1,absen:2,akses:1}},
  ceo:{name:'CEO',home:'ringkasan',access:{ringkasan:1,isu:2,project:2,sekolah:2,pembayaran:2,administrasi:2,branding:2,pipeline:2,absen:1,akses:1}},
  programmer:{name:'Programmer',home:'isu',access:{ringkasan:0,isu:3,isuNo:1,project:2,sekolah:0,pembayaran:0,pipeline:0,akses:1}},
  cs:{name:'Customer Service',home:'isu',access:{ringkasan:0,isu:2,project:0,sekolah:1,pembayaran:0,branding:1,pipeline:0,akses:1}},
  am:{name:'Account Manager',home:'sekolah',access:{ringkasan:0,isu:2,project:0,sekolah:2,pembayaran:0,administrasi:1,branding:1,pipeline:2,akses:1}}};
const COL={isu:'issues',project:'projects',sekolah:'schools',sekprod:'schools',pipeline:'leads'};
const KEY={isu:'issues',project:'projects',sekolah:'schools',sekprod:'schools',pipeline:'leads'};

const S={view:'ringkasan',people:['Ridho','Randy'],ams:[],issues:[],projects:[],schools:[],leads:[],products:[],roles:{},team:[],names:{},asked:new Set(),
  loaded:new Set(),slow:false,dead:false,drawer:null,form:null,pending:false,prodDraft:null,defaulted:false,
  sort:{},csv:null,dl:null,imp:null,gq:'',
  f:{isu:{q:'',st:'',prio:'',who:'',tab:'beranda'},project:{q:'',status:'aktif',who:'',type:'',asg:'',mode:'daftar'},sekolah:{q:'',status:'',who:''},pipeline:{q:'',who:'',src:'',mode:'papan'},pay:{tab:'status',q:'',f:'all',y:'',m:'',p:'',who:'',open:null},adm:{tab:'surat',q:'',arah:'',st:'',kode:'',y:''},brand:{q:'',kat:''},cat:{q:'',sel:null},log:{q:'',m:'',n:80},exp:{m:'',q:'',cat:''},akses:{sid:'',tab:'ringkas',q:'',st:'',kls:'',pg:1,sel:null},abs:{tab:'saya',m:'',d:'',st:'hadir',cat:''}},pay:[],cat:[],audit:[],abs:[],exp:[],qms:{},akLogged:new Set(),expForm:null,absSet:null,payForm:null,surat:[],mou:[],admForm:null,brand:[],brandForm:null};
const me={rid:null,get id(){return S.sim&&S.sim.id?S.sim.id:S.acct?'a:'+S.acct.id:this.rid},set id(v){this.rid=v},isOwner:false,canWrite:null};
const own=()=>me.isOwner&&!S.sim&&!S.acct;
let db=null,user=null;

/* ---------- helpers ---------- */
const pad=n=>String(n).padStart(2,'0');
const iso=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const today=()=>iso(new Date());
const days=(a,b)=>Math.round((new Date(b+'T00:00:00')-new Date(a+'T00:00:00'))/864e5);
const fmtD=s=>{if(!s)return '—';const d=new Date(String(s).slice(0,10)+'T00:00:00');return isNaN(d)?'—':d.toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'})};
const rp=n=>'Rp '+Math.round(n||0).toLocaleString('id-ID');
const rpS=n=>{n=n||0;const f=(v,u)=>'Rp '+v.toLocaleString('id-ID',{maximumFractionDigits:1})+' '+u;return n>=1e9?f(n/1e9,'M'):n>=1e6?f(n/1e6,'jt'):n>=1e3?f(n/1e3,'rb'):'Rp '+n};
const pill=(t,c)=>'<span class="pill '+(c||'')+'">'+esc(t)+'</span>';
const ACC=()=>S.access||DEF_ACCESS;
const myRoleKey=()=>S.sim?S.sim.key:S.acct?S.acct.role:(me.id&&S.roles[me.id])||null;
const role=()=>own()?'admin':(ACC()[myRoleKey()]?myRoleKey():null);
const lvl=v=>own()?9:(role()?(+ACC()[role()].access[v]||0):0);
const wr=()=>!!db&&me.canWrite!==false;
const roleName=k=>k==='admin'?'Super Admin':(ACC()[k]||{}).name||'Peran belum ditentukan';
const isProg=u=>{const c=ACC()[roleOf(u)];return !!c&&(+c.access.isu||0)>=3};
const can=k=>wr()&&lvl(k)>=2;
const canNew=()=>can('isu')&&(own()||!(+ACC()[role()].access.isuNo));
const canHandle=()=>wr()&&lvl('isu')>=3;
const progList=()=>{const m={};Object.keys(S.roles).concat(S.accounts.filter(a=>a.aktif!==false).map(a=>'a:'+a.id)).filter(u=>isProg(u)).concat(S.people,S.issues.map(i=>i.assignee).filter(Boolean)).forEach(u=>{const n=nameOf(u);if(!m[n])m[n]=u});return Object.values(m)};
const isMine=i=>!!me.id&&!!i.assignee&&(i.assignee===me.id||i.assignee===nameOf(me.id));
S.upl={form:[],msg:[],adm:[],brand:[]};
const ATT_ACCEPT='image/*,video/*,.pdf,.csv,.txt,.md,.json';
const isImg=f=>/^image\//.test(f.type||'');
const safeU=u=>/^(https:\/\/|\/)/.test(String(u||''))?String(u):'#';
const attChips=b=>S.upl[b].map((f,i)=>'<span class="att">'+esc(f.name)+'<button type="button" data-act="att-rm" data-b="'+b+'" data-i="'+i+'" aria-label="Hapus lampiran '+esc(f.name)+'">×</button></span>').join('');
const attPicker=b=>S.assets?'<div class="attbar"><label class="btn small attbtn">Lampirkan foto atau dokumen<input type="file" multiple hidden data-att="'+b+'" accept="'+ATT_ACCEPT+'"></label><span class="attl" data-attl="'+b+'">'+attChips(b)+'</span></div>':'';
const attView=a=>a&&a.length?'<div class="atts">'+a.map(f=>isImg(f)?'<a href="'+esc(safeU(f.url))+'" target="_blank" rel="noopener" title="'+esc(f.name)+'"><img src="'+esc(safeU(f.url))+'" alt="'+esc(f.name)+'" loading="lazy"></a>':'<a class="attf" href="'+esc(safeU(f.url))+'" target="_blank" rel="noopener">'+esc(f.name)+'</a>').join('')+'</div>':'';
const attRefresh=b=>document.querySelectorAll('[data-attl="'+b+'"]').forEach(el=>{el.innerHTML=attChips(b)});
async function pickFiles(b,inp){const fl=[...inp.files];inp.value='';if(!S.assets||!fl.length)return;toast('Mengunggah '+fl.length+' file…');let n=0;
  for(const f of fl){if(f.size>20*1048576){toast(f.name+' lebih dari 20 MB.',true);continue}
    try{const r=await S.assets.upload(f);S.upl[b].push({id:r.id,url:r.url,name:f.name,type:f.type||r.contentType||'',size:r.sizeBytes||f.size});n++}catch(e){toast('Gagal mengunggah '+f.name+'. Format yang didukung: foto, video, PDF, CSV, teks.',true)}}
  attRefresh(b);if(n)toast(n+' file terlampir.')}
const isReporter=x=>!!me.id&&x.createdBy===me.id;
const canPlan=()=>wr()&&lvl('project')>=3;
const allowed=v=>v==='keluar'?own():(v==='catatan'||v==='absen')?true:(!S.loaded.has('roles')||(v==='tim'?own():lvl(v)>=1));
const homeView=()=>{const h=(ACC()[myRoleKey()]||{}).home||(own()?'ringkasan':null);if(h&&allowed(h))return h;const f=VIEWS.find(v=>allowed(v[0]));return f?f[0]:null};
const isAdmin=()=>!!db&&own();
const nameOf=id=>!id?'Belum ditugaskan':(S.names[id]||(id===me.id?'Saya':isAcc(id)?'@'+String(id).slice(2):members().includes(id)?'Anggota tim':id));
const amList=()=>members().concat(S.ams.filter(n=>!members().includes(n)));
const isAcc=id=>String(id||'').slice(0,2)==='a:';
const members=()=>[...new Set([...S.team,...Object.keys(S.roles),...S.accounts.filter(a=>a.aktif!==false).map(a=>'a:'+a.id),...(me.id?[me.id]:[])])];
const roleOf=u=>isAcc(u)?((S.accounts.find(a=>a.id===String(u).slice(2))||{}).role||null):S.roles[u];
const school=id=>S.schools.find(s=>s.id===id);
const schoolName=id=>{const s=school(id);return s?s.name:'—'};
const prodName=id=>{const p=S.products.find(p=>p.id===id);return p?p.name:'Produk dihapus'};
const sMrr=s=>(s.products||[]).reduce((a,p)=>a+(+p.mrr||0),0);
const live=s=>s.status!=='churn';
function contract(s){
  if(!s.contractEnd)return['Belum ada kontrak','',null];
  const d=days(today(),s.contractEnd);
  if(d<0)return['Kedaluwarsa '+(-d)+' hari','crit',d];
  if(d<=60)return['Berakhir '+d+' hari lagi','warn',d];
  return['Aktif','good',d];
}
const tstat=t=>t.status||(t.done?'selesai':'belum');
function pProg(p){const m=p.milestones||[];return m.length?Math.round(m.filter(x=>tstat(x)==='selesai').length/m.length*100):0}
const tLate=p=>(p.milestones||[]).filter(x=>tstat(x)!=='selesai'&&x.due&&x.due<today()).length;
function pHealth(p){
  if(p.status==='selesai')return['Selesai',''];
  const t=today();
  if(p.end&&p.end<t)return['Terlambat','crit'];
  if(p.status==='tertahan')return['Tertahan','warn'];
  if(p.status==='perencanaan')return['Perencanaan','info'];
  if(p.start&&p.end){const tot=days(p.start,p.end)||1,el=Math.max(0,days(p.start,t));if(el/tot-pProg(p)/100>.25)return['Perlu perhatian','warn']}
  return['Lancar','good'];
}
const code=(k,x)=>(k==='isu'?'TKT-'+String(x.createdAt||'').slice(2,4)+String(x.createdAt||'').slice(5,7):PFX[k])+'-'+String(x.id).replace(/[^a-z0-9]/gi,'').slice(-4).toUpperCase();
const addDays=(d0,n)=>{const d=new Date(d0+'T00:00:00');d.setDate(d.getDate()+n);return iso(d)};
function durFmt(h){h=Math.abs(h);if(h<1)return Math.max(1,Math.round(h*60))+' menit';if(h<24)return Math.round(h)+' jam';const d=h/24;return (d<10?d.toFixed(1).replace('.',','):Math.round(d))+' hari'}
function slaOf(i){
  if(i.status==='Closed')return{tone:i.slaBreached?'crit':'good',label:i.slaBreached?'Selesai, lewat SLA':'Selesai',used:100};
  const start=new Date(i.createdAt).getTime(),end=new Date(i.slaDeadline).getTime(),paused=i.status==='Waiting Validation'&&i.pausedAt;
  const now=paused?new Date(i.pausedAt).getTime():Date.now(),pm=Math.max(i.pausedMinutes||0,0)*6e4,total=Math.max(end-start-pm,1),used=Math.min(Math.max((now-start-pm)/total*100,0),100),left=(end-now)/36e5;
  if(!(left>0))return{tone:'crit',label:'Lewat '+durFmt(-left||0),used:100,breached:true};
  if(paused)return{tone:'',label:'Menunggu validasi pelapor',used};
  return{tone:left<=total/36e5/3?'warn':'good',label:durFmt(left)+' lagi',used};
}
const sla=i=>{const g=slaOf(i);return[g.label,g.tone]};
const fmtDT=v=>{if(!v)return '—';const d=new Date(v);return isNaN(d)?'—':d.toLocaleString('id-ID',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})};
function relTime(v){const m=Math.round((Date.now()-new Date(v).getTime())/6e4);if(!(m>=1))return 'baru saja';if(m<60)return m+' menit lalu';const h=Math.round(m/60);if(h<24)return h+' jam lalu';const d=Math.round(h/24);return d<30?d+' hari lalu':fmtD(v)}
const HONOR=['bang','kak','pak','bu','bapak','ibu','mas','mbak','mba','kang','teh','mr','mrs','ms','dr','drs','prof','h'];
const greet=()=>{const p=String(S.names[me.id]||'').trim().split(/\s+/).filter(Boolean);if(!p.length)return 'Anda';return p[1]&&HONOR.includes(p[0].toLowerCase().replace(/[.,]/g,''))?p[1]:p[0]};
const inits=n=>String(n||'?').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0].toUpperCase()).join('');
const stars=n=>'<span class="stars" role="img" aria-label="'+n+' dari 5">'+'★'.repeat(n)+'<span style="opacity:.25">'+'★'.repeat(5-n)+'</span></span>';
const upill=i=>pill(i.urgency,URG[i.urgency][1]),spill=i=>pill(i.status,TST[i.status][1]);
const slaMeter=i=>{const g=slaOf(i),c=g.tone==='crit'?'var(--crit)':g.tone==='warn'?'#FF9F0A':'var(--accent)';return '<div class="slam"><div><span>SLA</span><strong>'+esc(g.label)+'</strong></div><div class="track"><i style="width:'+g.used+'%;background:'+c+'"></i></div></div>'};
const dl=rows=>'<dl class="dl">'+rows.filter(Boolean).map(r=>'<div><dt>'+r[0]+'</dt><dd>'+r[1]+'</dd></div>').join('')+'</dl>';
const person=(n,sub)=>'<div class="person"><span class="av" aria-hidden="true">'+esc(inits(n))+'</span><div><strong>'+esc(n)+'</strong>'+(sub?'<small>'+esc(sub)+'</small>':'')+'</div></div>';
const barsOf=a=>{const mx=Math.max(1,...a.map(x=>x[1]));return '<div class="bars">'+a.map(x=>'<div class="bar"><span>'+esc(x[0])+'</span><div class="track"><i style="width:'+(x[1]/mx*100)+'%"></i></div><strong>'+x[1]+'</strong></div>').join('')+'</div>'};
const asgTxt=i=>i.assignee?(i.assignee===me.id?'Ditugaskan ke Anda':'Ditugaskan ke '+nameOf(i.assignee)):'';
const repName=i=>i.createdBy?nameOf(i.createdBy):(i.reporter||'Pelapor');
function ticketPage(x){
  const hd=canHandle(),rep=isReporter(x)||isAdmin(),ms=(x.messages||[]).filter(l=>l.kind!=='note'||hd),nmsg=ms.filter(l=>l.kind!=='system').length;
  const waitD=x.status==='Waiting Validation'&&x.pausedAt?Math.floor((Date.now()-new Date(x.pausedAt).getTime())/864e5):0;
  const canRe=x.status==='Closed'&&(hd||(isReporter(x)&&x.closedAt&&Date.now()-new Date(x.closedAt).getTime()<=REOPEN_DAYS*864e5));
  const card=(t,right,b)=>'<section class="panel"><header><h2>'+t+'</h2>'+(right||'')+'</header>'+b+'</section>';
  const left=card('Keluhan','<span class="inline">'+spill(x)+upill(x)+(x.reopenCount?pill('Reopen '+x.reopenCount+'×','warn'):'')+'</span>',
      '<p style="margin:0;white-space:pre-wrap">'+esc(x.description||'Tidak ada deskripsi.')+'</p>'
      +(x.attachments&&x.attachments.length?'<hr class="hair"><h3>Lampiran</h3>'+attView(x.attachments):'')
      +(x.txRef||x.txAmount?'<hr class="hair"><h3>Transaksi terkait</h3>'+dl([['Referensi',esc(x.txRef||'—')],['Nilai',esc(x.txAmount?rp(x.txAmount):'—')]]):'')
      +(x.resolutionSummary?'<hr class="hair"><h3>Ringkasan solusi</h3><p style="margin:6px 0 0;white-space:pre-wrap">'+esc(x.resolutionSummary)+'</p>':''))
    +(x.status==='Waiting Validation'?(rep?card('Apakah masalah Anda sudah selesai?','','<p style="margin:0;color:var(--ink2)">Programmer sudah menyelesaikan penanganan. Konfirmasi hasilnya supaya tiket bisa ditutup.</p><div><button class="btn primary" data-act="tk-ok">Masalah Selesai</button></div><div class="inline"><input type="text" id="d-reason" placeholder="Apa yang masih bermasalah?" aria-label="Alasan belum selesai" style="flex:1 1 200px"><button class="btn" data-act="tk-notok">Belum Selesai</button></div>')
        :'<div class="banner info">Menunggu validasi pelapor. Jam SLA berhenti sementara.'+(waitD>=AUTOCLOSE_DAYS?' Sudah '+waitD+' hari tanpa validasi.':'')+'</div>'):'')
    +(x.status==='Closed'&&isReporter(x)&&!(x.csat&&x.csat.score)?card('Bagaimana penanganan tiket ini?','','<input type="text" id="d-csatc" placeholder="Komentar (opsional)" aria-label="Komentar penilaian"><div class="inline">'+[1,2,3,4,5].map(n=>'<button class="btn small" data-act="tk-csat" data-s="'+n+'" aria-label="Nilai '+n+' dari 5">'+n+' ★</button>').join('')+'</div>'):'')
    +(hd&&x.status!=='Closed'?card('Tindakan','',
        (x.status==='Open'&&(!x.assignee||isMine(x))?'<div><button class="btn primary" data-act="tk-claim">Ambil tiket</button></div>':'')
        +(x.status==='Open'?'<div class="inline"><label class="lbl" for="d-asg">Tugaskan ke</label><select id="d-asg" data-act-change="tk-asg">'+(x.assignee?'':opt('','Pilih programmer',''))+progList().map(u=>opt(u,nameOf(u),x.assignee||'')).join('')+'</select></div>':'')
        +'<div class="inline"><label class="lbl" for="d-tst">Ubah status</label><select id="d-tst" data-act-change="tk-status">'+opt('','Pilih status','')+TRANS[x.status].map(v=>opt(v,v==='Waiting Validation'?'Waiting Validation (minta validasi pelapor)':v,'')).join('')+'</select></div>'
        +'<div class="inline"><label class="lbl" for="d-tcat">Koreksi triase</label><select id="d-tcat" data-act-change="tk-cat">'+TCAT.map(c=>opt(c,c,x.category)).join('')+'</select><select id="d-turg" data-act-change="tk-urg" aria-label="Prioritas">'+Object.keys(URG).map(c=>opt(c,c,x.urgency)).join('')+'</select></div>'):'')
    +(canRe?card('Tiket ditutup','','<p style="margin:0;color:var(--ink2)">'+(hd?'Buka kembali tiket untuk melanjutkan penanganan.':'Masalah muncul lagi? Anda bisa membuka kembali tiket ini dalam '+REOPEN_DAYS+' hari setelah ditutup.')+'</p><div><button class="btn" data-act="tk-reopen">Buka kembali tiket</button></div>'):'')
    +card('Percakapan','<span class="chip">'+nmsg+' pesan</span>','<div class="thread">'+(ms.map(l=>l.kind==='system'?'<div class="msg msg--system">'+esc(l.body)+' · '+fmtDT(l.at)+'</div>'
        :'<div class="msg'+(l.by&&l.by===me.id?' msg--me':'')+(l.kind==='solution'?' msg--solution':l.kind==='note'?' msg--note':l.kind==='action'?' msg--action':'')+'"><small>'+esc(l.by?nameOf(l.by):'Tim QRION')+(l.kind==='solution'?' · Solusi':l.kind==='note'?' · Catatan internal':l.kind==='action'?' · Tindakan':'')+' · '+fmtDT(l.at)+'</small>'+(l.body?'<div style="white-space:pre-wrap">'+esc(l.body)+'</div>':'')+attView(l.files)+'</div>').join('')||'<div class="empty">Belum ada percakapan.</div>')+'</div>'
      +(x.status==='Closed'?'<p style="margin:12px 0 0;text-align:center;color:var(--ink2);font-size:12.5px">Tiket ditutup. Buka kembali tiket untuk membalas.</p>'
        :can('isu')?'<div class="composer"><textarea id="d-log" rows="2" placeholder="'+(hd?'Tulis pesan, tindakan, atau catatan':'Tulis pesan')+'" aria-label="Tulis pesan"></textarea>'+attPicker('msg')+'<div class="inline">'+(hd?'<select id="d-kind" aria-label="Jenis pesan"><option value="text">Pesan ke pelapor</option><option value="action">Tindakan yang dilakukan</option><option value="note">Catatan internal (tidak terlihat pelapor)</option></select>':'<span></span>')+'<button class="btn primary small" data-act="tk-msg">Kirim</button></div></div>':''));
  const sc=school(x.schoolId);
  const side=card('Ringkasan tiket','',slaMeter(x)+'<hr class="hair">'+dl([['Kategori',esc(x.category)],['Target SLA',Math.round(SLA_MIN[x.urgency]/60)+' jam'],x.reportedDate&&['Tanggal pelaporan',fmtD(x.reportedDate)],['Dibuat di sistem',fmtDT(x.createdAt)],['Batas SLA',fmtDT(x.slaDeadline)],x.firstResponseAt&&['Respons pertama',fmtDT(x.firstResponseAt)],x.closedAt&&['Ditutup',fmtDT(x.closedAt)],['Reopen',(x.reopenCount||0)+'×'],x.csat&&x.csat.score&&['CSAT',stars(x.csat.score)]])+(x.csat&&x.csat.comment?'<hr class="hair"><p style="margin:0;color:var(--ink2)">“'+esc(x.csat.comment)+'”</p>':''))
    +card('Pelapor','',person(repName(x),x.createdBy&&x.reporter?'Atas nama '+x.reporter:'')+'<hr class="hair">'+dl([['Mitra sekolah',sc&&!allowed('sekolah')?esc(sc.name):sc?'<button class="th" style="color:var(--link);font-weight:600" data-open="sekolah:'+esc(sc.id)+'">'+esc(sc.name)+'</button>':'—'],['Produk',esc(x.productId?prodName(x.productId):'—')],['AM',esc(x.am?nameOf(x.am):'—')]]))
    +(x.assignee?card('Programmer','',person(nameOf(x.assignee),x.status==='Open'?'Ditujukan ke programmer ini':'Menangani tiket ini')):'')
    +((hd||isReporter(x)||isAdmin())?'<div class="inline">'+(hd||isReporter(x)?'<button class="btn" data-act="edit">Ubah tiket</button>':'')+(isAdmin()?'<button class="btn danger" data-act="del" data-confirm="Klik lagi untuk menghapus">Hapus</button>':'')+'</div>':'');
  return{title:x.subject,sub:'Kode tiket '+code('isu',x),action:'<button class="btn" data-act="close">Kembali ke board</button>',
    body:'<div class="crumbs">Board Tiket / '+esc(code('isu',x))+'</div><div class="split"><div class="stack">'+left+'</div><aside class="side">'+side+'</aside></div>'};
}
const BLN=['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
const nowYM=()=>today().slice(0,7);
const addM=(ym,n)=>{let y=+ym.slice(0,4),m=+ym.slice(5,7)-1+n;y+=Math.floor(m/12);m=((m%12)+12)%12;return y+'-'+pad(m+1)};
const mLabel=ym=>(BLN[+String(ym).slice(5,7)-1]||'?')+' '+String(ym).slice(2,4);
const isYM=v=>/^\d{4}-(0[1-9]|1[0-2])$/.test(String(v));
const pItems=x=>Array.isArray(x.items)?x.items:[];
const numOf=v=>{const d=String(v==null?'':v).replace(/[^0-9]/g,'');return d?parseInt(d,10):null};
const fmtN=n=>Math.round(n||0).toLocaleString('id-ID');
const tBul=(y,x)=>{const b=(Array.isArray(y.bulan)?y.bulan:[]).filter(isYM);if(b.length)return b;const d=String((x&&(x.tanggal||x.dibuat))||'').slice(0,7);return isYM(d)?[d]:[]};
function paySummary(){const by={};S.pay.forEach(x=>{const g=by[x.mitraId]||(by[x.mitraId]={months:{},tamb:0,tn:0,tu:0,total:0,n:0,und:0});g.total+=typeof x.total==='number'?x.total:0;g.n++;const it=pItems(x);if(x.tipe==='transaksi'&&x.trx&&isYM(x.trx.bulan)){const t2=g.trx||(g.trx={});t2[x.trx.bulan]=(t2[x.trx.bulan]||0)+(typeof x.total==='number'?x.total:0)}if(x.tipe==='topup'&&x.topup&&isYM(x.topup.bulan)){const t3=g.tup||(g.tup={});t3[x.topup.bulan]=(t3[x.topup.bulan]||0)+(typeof x.total==='number'?x.total:0)}if(x.tipe==='topup'||x.tipe==='transaksi'){g.top=(g.top||0)+(typeof x.total==='number'?x.total:0);return}if(!it.length)g.und++;
  const lg=it.filter(y=>y.jenis!=='tambahan'),one=lg.length===1&&it.length===1&&typeof x.total==='number'&&x.total>0;it.forEach(y=>{if(y.jenis!=='tambahan'){const bl=(Array.isArray(y.bulan)?y.bulan:[]).filter(isYM),v=typeof y.nominal==='number'?y.nominal:(one?x.total:null);if(v!=null&&bl.length){const g2=g.nom||(g.nom={});bl.forEach(b=>{g2[b]=(g2[b]||0)+v})}}if(y.jenis==='tambahan'){tBul(y,x).forEach(b=>{const e=g.ext||(g.ext={});(e[b]||(e[b]=[])).push({n:y.nama||'Biaya tambahan',v:typeof y.nominal==='number'?y.nominal:null})});(g.tl||(g.tl=[])).push({n:y.nama||'Biaya tambahan',v:typeof y.nominal==='number'?y.nominal:null});g.tn++;if(typeof y.nominal==='number')g.tamb+=y.nominal;else g.tu++}else(Array.isArray(y.bulan)?y.bulan:[]).forEach(b=>{if(isYM(b)){(g.months[b]||(g.months[b]=[])).push(y.nama||'Langganan');(g.md||(g.md={}))[b]=(g.md[b]||[]).concat([{n:y.nama||'Langganan',v:typeof y.nominal==='number'?y.nominal:(one?x.total:null)}])}})})});Object.keys(by).forEach(k=>{const g=by[k];if(!g.md)return;Object.keys(g.md).forEach(b=>{const d=g.md[b];if(d.some(e=>e.v!=null)&&d.some(e=>e.v==null&&e.n==='Langganan')){g.months[b]=d.filter(e=>!(e.v==null&&e.n==='Langganan')).map(e=>e.n)}})});return by}
function payLine(x){const it=pItems(x);if(x.tipe==='topup')return pill('Top up'+(x.topup&&isYM(x.topup.bulan)?' '+mLabel(x.topup.bulan):''),'info');if(x.tipe==='transaksi'){const t=x.trx||{};return pill('Biaya transaksi'+(isYM(t.bulan)?' '+mLabel(t.bulan):'')+(t.jumlah?' · '+fmtN(t.jumlah)+' trx':'')+(t.biaya?' × '+rp(t.biaya):''),'info')}if(!it.length)return pill('Item belum dirinci','warn');
  return it.map(y=>{if(y.jenis==='tambahan')return pill('Tambahan: '+y.nama+(typeof y.nominal==='number'?' '+rp(y.nominal):''));const b=(Array.isArray(y.bulan)?y.bulan:[]).filter(isYM),per=b.length?(b.length>1?mLabel(b[0])+' s.d. '+mLabel(b[b.length-1]):mLabel(b[0])):'bulan belum diisi';return pill(y.nama+': '+per+(typeof y.nominal==='number'?' '+rp(y.nominal):''),'good')}).join(' ')}
const payText=x=>x.tipe==='topup'?'Top up'+(x.topup&&isYM(x.topup.bulan)?' '+mLabel(x.topup.bulan):''):x.tipe==='transaksi'?'Biaya transaksi'+(x.trx&&isYM(x.trx.bulan)?' '+mLabel(x.trx.bulan):''):pItems(x).map(y=>y.jenis==='tambahan'?'Tambahan: '+y.nama:(y.nama+' '+(Array.isArray(y.bulan)?y.bulan:[]).filter(isYM).map(mLabel).join(', '))).join('; ');
const bukti=x=>/^https?:\/\//i.test(x.bukti||'')?'<a href="'+esc(x.bukti)+'" target="_blank" rel="noopener" style="color:var(--link);font-weight:600">Lihat bukti</a>':'<span class="pay-muted">Tanpa bukti</span>';
/*INV*/
S.invoices=[];S.invSet={};S.invForm=null;
const invTo=x=>String((x&&x.untuk)||'').trim()||(x&&x.mitraId?schoolName(x.mitraId):'')||'-';
const newInv=()=>({editId:null,mitraId:'',untuk:'',alamatUntuk:'',tanggal:today(),jatuhTempo:addDays(today(),14),ppn:'0',diskon:'',catatan:'',items:[{produk:'',nama:'',qty:'1',harga:'',disc:''}]});
const invCalc=(items,dsk,ppn)=>{let sub=0,ld=0;(items||[]).forEach(y=>{const g=(numOf(y.qty)||0)*(numOf(y.harga)||0);sub+=g;ld+=Math.min(numOf(y.disc)||0,g)});const dk=ld+Math.min(numOf(dsk)||0,sub-ld),dpp=sub-dk,pj=0;return{sub,dk,pj,total:dpp}};
const BLN_F=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const fmtL=v=>{const d=new Date(String(v||'').slice(0,10)+'T00:00:00');return isNaN(d)?'':d.getDate()+' '+BLN[d.getMonth()]+', '+d.getFullYear()};
const invEff=x=>x.status==='terbit'&&x.jatuhTempo&&x.jatuhTempo<today()?'terlambat':(x.status||'terbit');
const INV_ST={terbit:['Belum dibayar','info'],terlambat:['Terlambat','crit'],lunas:['Lunas','good'],batal:['Batal','']};
const invPill=x=>{const s=INV_ST[invEff(x)]||INV_ST.terbit;return pill(s[0],s[1])};
const invTot=x=>invCalc(x.items,x.diskon,x.ppn).total;
const invNext=tgl=>{const pre='INV/'+tgl.slice(0,4)+'/';let m=Math.max(0,(+(S.invSet||{}).mulai||1)-1);S.invoices.forEach(x=>{if(String(x.no||'').indexOf(pre)===0&&/^\d+$/.test(String(x.no).slice(pre.length)))m=Math.max(m,parseInt(String(x.no).slice(pre.length),10)||0)});return pre+String(m+1).padStart(4,'0')};
const invTotHtml=c=>dl([['Subtotal',rp(c.sub)],c.dk?['Diskon','- '+rp(c.dk)]:null,c.pj?['PPN',rp(c.pj)]:null,['<strong>Total tagihan</strong>','<strong>'+rp(c.total)+'</strong>']]);
function invSum(){const el=$('#inv-tot');if(el&&S.invForm){const F=S.invForm;el.innerHTML=invTotHtml(invCalc(F.items,F.diskon,F.ppn))}}
const INV_CSS = `
.inv{position:relative;box-sizing:border-box;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;color:#334155;background:#fff;width:100%;max-width:794px;margin:0 auto;padding:54px 56px 40px;font-size:12.5px;line-height:1.5;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.inv *{box-sizing:border-box}
.inv-band{position:absolute;left:0;right:0;top:0;height:6px;background:linear-gradient(90deg,#2e5f8a 0%,#3f8fc4 58%,#7dbfe0 100%)}
.inv table{width:auto;min-width:0;margin:0;border-collapse:collapse}
.inv th,.inv td{padding:0;border:0;background:none;color:inherit;font:inherit;text-align:left;vertical-align:top;white-space:normal}
.inv-head{display:flex;align-items:flex-start;justify-content:space-between;gap:36px}
.inv-issuer{min-width:0}
.inv-logo{display:block;width:auto;max-width:220px;max-height:62px;object-fit:contain}
.inv-brand{color:#1e3a53;font-size:23px;font-weight:700;letter-spacing:-.015em;line-height:1.2}
.inv-addr{margin-top:10px;color:#64748b;font-size:11.5px;line-height:1.6}
.inv-contact{margin-top:4px;color:#64748b;font-size:11.5px}
.inv-headmeta{flex:none;width:270px;text-align:right}
.inv-kicker{color:#3f7fa8;font-size:10.5px;font-weight:700;letter-spacing:.22em;text-transform:uppercase}
.inv-number{margin-top:4px;color:#1e3a53;font-size:18px;font-weight:700;letter-spacing:-.01em}
.inv-flag{display:inline-flex;align-items:center;gap:6px;margin-top:10px;padding:4px 10px;border-radius:999px;background:#e8f1fa;color:#25648f;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
.inv-flag::before{content:"";width:5px;height:5px;border-radius:50%;background:currentColor}
.inv-flag.ok{background:#e7f7ec;color:#1d7a3a}
.inv-flag.t{background:#fdecea;color:#c0392b}
.inv-flag.b{background:#eef1f4;color:#75808d}
.inv-parties{display:grid;grid-template-columns:minmax(0,1fr) 270px;gap:36px;margin-top:36px;padding-top:28px;border-top:1px solid #e5eaf0}
.inv-label{margin-bottom:9px;color:#7b8794;font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase}
.inv-client{color:#1e3a53;font-size:16px;font-weight:700;line-height:1.3;overflow-wrap:anywhere}
.inv-client-addr{margin-top:6px;color:#64748b;font-size:12px;line-height:1.6}
.inv-facts{display:flex;flex-direction:column;gap:8px;padding:14px 16px;border:1px solid #e6edf4;border-radius:10px;background:#f6f9fc}
.inv-fact{display:flex;justify-content:space-between;gap:16px;font-size:11.5px}
.inv-fact span{color:#718096}
.inv-fact b{color:#1e3a53;font-weight:600;white-space:nowrap}
.inv-tablewrap{margin-top:30px;overflow-x:auto;-webkit-overflow-scrolling:touch}
.inv table.it{width:100%;min-width:600px;border-collapse:collapse;table-layout:fixed}
.inv .it th{padding:10px;border-top:1px solid #dbe6ef;border-bottom:1px solid #dbe6ef;background:#eef4f9;color:#36536e;font-size:9.5px;font-weight:700;letter-spacing:.09em;text-transform:uppercase}
.inv .it th:first-child{padding-left:14px;border-radius:8px 0 0 8px}
.inv .it th:last-child{padding-right:14px;border-radius:0 8px 8px 0}
.inv .it td{padding:13px 10px;border-bottom:1px solid #e8eef4;color:#435466;font-size:11.5px}
.inv .it td:first-child{padding-left:14px}
.inv .it td:last-child{padding-right:14px}
.inv .it tbody tr:last-child td{border-bottom:1px solid #dfe7ef}
.inv .it .prod{color:#1e3a53;font-weight:700}
.inv .it .desc{color:#64748b}
.inv .it .c{text-align:center}
.inv .it .r{text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums}
.inv .it .amount{color:#1e3a53;font-weight:600}
.inv .it .inv-empty{padding:22px 14px;color:#7b8794;text-align:center}
.inv-lower{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:36px;margin-top:26px;align-items:start}
.inv-block+.inv-block{margin-top:18px}
.inv-block h4{margin:0 0 6px;color:#7b8794;font-size:10px;font-weight:700;letter-spacing:.13em;text-transform:uppercase}
.inv-text{color:#526274;font-size:11.5px;line-height:1.65;overflow-wrap:anywhere}
.inv-pay{padding:14px 16px;border:1px solid #e6edf4;border-radius:10px;background:#f8fafc}
.inv-sum{padding:14px 16px;border:1px solid #e6edf4;border-radius:10px;background:#f6f9fc}
.inv-row{display:flex;justify-content:space-between;gap:18px;padding:4px 0;color:#64748b;font-size:11.5px}
.inv-row b{color:#334155;font-weight:600;font-variant-numeric:tabular-nums}
.inv-total{display:flex;align-items:baseline;justify-content:space-between;gap:18px;margin-top:10px;padding-top:12px;border-top:1.5px solid #cfdae5}
.inv-total span{color:#1e3a53;font-size:10.5px;font-weight:700;letter-spacing:.07em;text-transform:uppercase}
.inv-total strong{color:#1e3a53;font-size:21px;font-weight:700;line-height:1;letter-spacing:-.02em;font-variant-numeric:tabular-nums;white-space:nowrap}
.inv-signrow{display:flex;align-items:flex-end;justify-content:space-between;gap:32px;margin-top:36px;padding-top:24px;border-top:1px solid #e8eef4}
.inv-thanks{max-width:42ch;color:#7b8794;font-size:11.5px;line-height:1.65}
.inv-sign{width:240px;flex:none;color:#526274;font-size:11.5px;text-align:center}
.inv-sign .space{display:flex;align-items:center;justify-content:center;height:64px;margin:6px 0;border-bottom:1px solid #dbe4ed}
.inv-sign img{display:block;width:auto;max-width:210px;max-height:88px;object-fit:contain}
.inv-sign b{display:block;color:#1e3a53;font-size:12px}
.inv-sign small{display:block;margin-top:2px;color:#7b8794;font-size:10px}
.inv-foot{display:flex;justify-content:space-between;gap:16px;margin-top:28px;padding-top:12px;border-top:1px solid #eef2f6;color:#9aa6b2;font-size:9.5px}
@media(max-width:640px){
.inv{padding:34px 20px 28px}
.inv-head{flex-direction:column;gap:18px}
.inv-headmeta{width:100%;text-align:left}
.inv-number{margin-top:2px;font-size:17px}
.inv-flag{margin-top:8px}
.inv-parties{grid-template-columns:1fr;gap:18px;margin-top:26px;padding-top:22px}
.inv-facts{width:100%}
.inv-tablewrap{margin-top:22px;overflow:visible}
.inv table.it{display:block;min-width:0}
.inv .it thead{display:none}
.inv .it tbody{display:block}
.inv .it tr{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px 12px;padding:13px 0;border-top:1px solid #e8eef4}
.inv .it tbody tr:last-child{border-bottom:1px solid #dfe7ef}
.inv .it td{display:block;width:100%;padding:0!important;border:0!important;text-align:left!important;white-space:normal!important}
.inv .it td:nth-child(1),.inv .it td:nth-child(2){grid-column:1/-1}
.inv .it td:nth-child(1){color:#1e3a53;font-weight:700}
.inv .it td::before{content:attr(data-l);display:block;margin-bottom:1px;color:#94a3b8;font-size:8.5px;font-weight:700;letter-spacing:.07em;text-transform:uppercase}
.inv .it td:nth-child(1)::before,.inv .it td:nth-child(2)::before{display:none}
.inv .it td:nth-child(6){display:flex;grid-column:1/-1;align-items:baseline;justify-content:space-between;gap:12px;margin-top:3px;padding-top:6px!important;border-top:1px dashed #e5ebf2!important;font-size:12.5px}
.inv .it td:nth-child(6)::before{margin:0}
.inv .it .inv-cell-empty,.inv .it .disc0{display:none}
.inv .it .inv-empty{display:block;grid-column:1/-1;padding:16px 0!important}
.inv .it .inv-empty::before{display:none}
.inv-lower{grid-template-columns:1fr;gap:18px;margin-top:20px}
.inv-signrow{flex-direction:column;align-items:stretch;gap:22px;margin-top:26px}
.inv-sign{width:100%}
.inv-sign .space{height:54px}
.inv-foot{flex-direction:column;gap:4px}
}
@page{size:A4;margin:12mm}
@media print{
.inv{max-width:none;width:100%;margin:0;padding:0;overflow:visible;border-radius:0;box-shadow:none}
.inv-band{position:static;height:5px;margin:0 0 26px}
.inv-head{flex-direction:row}
.inv-headmeta{width:270px;text-align:right}
.inv-parties{grid-template-columns:minmax(0,1fr) 270px;gap:36px}
.inv-tablewrap{overflow:visible}
.inv table.it{display:table;min-width:0}
.inv .it thead{display:table-header-group}
.inv .it tbody{display:table-row-group}
.inv .it tr{display:table-row;padding:0;border:0}
.inv .it td{display:table-cell;width:auto;padding:10px;border-bottom:1px solid #e8eef4;text-align:left}
.inv .it td::before{display:none}
.inv .it td:first-child{padding-left:14px}
.inv .it td:last-child{padding-right:14px}
.inv .it td:nth-child(6){display:table-cell;padding-top:10px;border-top:0;font-size:11.5px}
.inv .it .inv-cell-empty,.inv .it .disc0{display:table-cell}
.inv-lower{grid-template-columns:minmax(0,1fr) 300px}
.inv-signrow{flex-direction:row;align-items:flex-end}
.inv-sign{width:240px}
.inv-foot{flex-direction:row}
}
`;
document.head.insertAdjacentHTML('beforeend','<style id="invcss">'+INV_CSS+'.invprint{display:none}.mchip{border:0;border-radius:99px;padding:6px 12px;font:inherit;font-size:12.5px;background:rgba(0,0,0,.06);color:var(--ink);cursor:pointer}.mchip[aria-pressed=true]{background:#1e7a35;color:#fff}.irow{display:grid!important;grid-template-columns:130px minmax(0,1fr) 64px 130px 110px auto;gap:8px;align-items:center}.irow input{width:100%;max-width:none!important;min-width:0}@media(max-width:820px){.irow{grid-template-columns:1fr 1fr}.irow .btn{grid-column:1/-1}}@media print{body>*{display:none!important}body>.invprint{display:block!important}body{background:#fff!important}}</style>');
function invMarkup(x){
  const c=invCalc(x.items,x.diskon,x.ppn),st=S.invSet||{},k=invEff(x),uri=u=>st.__d&&st.__d[u]||u;
  const nm=st.nama||'QRION',br=t=>esc(t).replace(/\n/g,'<br>');
  const dmy=v=>{const d=new Date(String(v||'').slice(0,10)+'T00:00:00');return isNaN(d)?'':String(d.getDate()).padStart(2,'0')+'/'+String(d.getMonth()+1).padStart(2,'0')+'/'+d.getFullYear()};
  const flag=k==='lunas'?'<span class="inv-flag ok">Lunas</span>':k==='batal'?'<span class="inv-flag b">Dibatalkan</span>':k==='terlambat'?'<span class="inv-flag t">Terlambat</span>':'<span class="inv-flag">Belum dibayar</span>';
  const logo=st.logo?'<img class="inv-logo" src="'+esc(safeU(uri(st.logo)).replace(/^(?!data:|https?:|\/)/,'#'))+'" alt="'+esc(nm)+'">':'<div class="inv-brand">'+esc(nm)+'</div>';
  const items=(x.items||[]).map(y=>{const g=(+y.qty||0)*(+y.harga||0),d=Math.min(+y.disc||0,g),pr=String(y.produk||'').trim();return '<tr><td class="prod'+(pr?'':' inv-cell-empty')+'" data-l="Produk">'+esc(pr)+'</td><td class="desc" data-l="Deskripsi">'+esc(y.nama||'')+'</td><td class="c" data-l="Qty">'+esc(y.qty||'0')+'</td><td class="r" data-l="Harga">'+fmtN(y.harga)+'</td><td class="r'+(d?'':' disc0')+'" data-l="Diskon">'+(d?fmtN(d):'—')+'</td><td class="r amount" data-l="Jumlah">'+fmtN(g-d)+'</td></tr>'}).join('');
  const rek=st.rekening?'<div class="inv-block inv-pay"><h4>Metode pembayaran</h4><div class="inv-text">'+br(st.rekening)+'</div></div>':'';
  const notes=x.catatan||st.catatan?'<div class="inv-block"><h4>Syarat dan ketentuan</h4><div class="inv-text">'+br([x.catatan,st.catatan].filter(Boolean).join('\n'))+'</div></div>':'';
  return '<div class="inv"><div class="inv-band"></div>'
   +'<header class="inv-head"><div class="inv-issuer">'+logo+(st.alamat?'<div class="inv-addr">'+br(st.alamat)+'</div>':'')+(st.kontak?'<div class="inv-contact">'+esc(st.kontak)+'</div>':'')+'</div>'
   +'<div class="inv-headmeta"><div class="inv-kicker">Invoice</div><div class="inv-number">'+esc(x.no||'—')+'</div>'+flag+'</div></header>'
   +'<div class="inv-parties"><section><div class="inv-label">Ditagihkan kepada</div><div class="inv-client">'+esc(invTo(x))+'</div>'+(x.alamatUntuk?'<div class="inv-client-addr">'+br(x.alamatUntuk)+'</div>':'')+'</section>'
   +'<section class="inv-facts"><div class="inv-fact"><span>Tanggal terbit</span><b>'+esc(dmy(x.tanggal)||'—')+'</b></div><div class="inv-fact"><span>Jatuh tempo</span><b>'+esc(dmy(x.jatuhTempo)||'—')+'</b></div></section></div>'
   +'<div class="inv-tablewrap"><table class="it"><colgroup><col style="width:19%"><col style="width:31%"><col style="width:8%"><col style="width:15%"><col style="width:12%"><col style="width:15%"></colgroup><thead><tr><th>Produk</th><th>Deskripsi</th><th class="c">Qty</th><th class="r">Harga</th><th class="r">Diskon</th><th class="r">Jumlah</th></tr></thead><tbody>'+(items||'<tr><td class="inv-empty" colspan="6">Belum ada rincian tagihan.</td></tr>')+'</tbody></table></div>'
   +'<div class="inv-lower"><div class="inv-notes">'+rek+notes+'</div><div class="inv-sum"><div class="inv-row"><span>Subtotal</span><b>'+rp(c.sub)+'</b></div>'+(c.dk?'<div class="inv-row"><span>Diskon</span><b>- '+rp(c.dk)+'</b></div>':'')+(c.pj?'<div class="inv-row"><span>PPN</span><b>'+rp(c.pj)+'</b></div>':'')+'<div class="inv-total"><span>Total tagihan</span><strong>'+rp(c.total)+'</strong></div></div></div>'
   +'<div class="inv-signrow"><div class="inv-thanks">Terima kasih telah mempercayakan kebutuhan pendidikan Anda kepada kami.</div><div class="inv-sign"><span>Hormat kami,</span><div class="space">'+(st.ttd?'<img src="'+esc(safeU(uri(st.ttd)))+'" alt="Tanda tangan">':'')+'</div><b>'+esc(st.penandatangan||nm)+'</b><small>'+esc(nm)+'</small></div></div>'
   +'<footer class="inv-foot"><span>Invoice ini dibuat secara elektronik.</span><span>'+esc(x.no||'')+'</span></footer></div>';
}
function invoiceView(f,ed,mitra,tabBar,sub){
  const g=f.inv||(f.inv={mode:'list',id:null}),cur=nowYM();f.iq=f.iq||'';f.ist=f.ist||'';
  if(g.mode==='form'&&ed){
    const F=S.invForm||(S.invForm=newInv()),c=invCalc(F.items,F.diskon,F.ppn);
    const body='<section class="panel"><header><h2>'+(F.editId?'Ubah invoice '+esc(F.no||''):'Invoice baru')+'</h2></header>'
      +'<div class="fields"><div class="fld"><label for="iv-untuk">Invoice ini untuk siapa</label><input type="text" id="iv-untuk" data-if="untuk" list="dl-iuntuk" autocomplete="off" placeholder="Nama sekolah, yayasan, atau perusahaan" value="'+esc(F.untuk)+'"><datalist id="dl-iuntuk">'+mitra.map(x=>'<option value="'+esc(x.name)+'">').join('')+'</datalist></div><div class="fld"><label for="iv-almt">Alamat penagihan (opsional)</label><textarea id="iv-almt" data-if="alamatUntuk" rows="2" placeholder="Alamat atau kontak yang tampil di invoice">'+esc(F.alamatUntuk)+'</textarea></div></div><div class="fields">'
      +'<div class="fld"><label for="iv-tgl">Tanggal terbit</label><input type="date" id="iv-tgl" data-if="tanggal" value="'+esc(F.tanggal)+'"></div>'
      +'<div class="fld"><label for="iv-tempo">Jatuh tempo</label><input type="date" id="iv-tempo" data-if="jatuhTempo" value="'+esc(F.jatuhTempo)+'"></div></div>'
      +'<div class="box"><h3>Rincian tagihan</h3><span style="font-size:13px;color:var(--ink2)">Satu baris untuk tiap produk atau biaya. Harga dan diskon dalam rupiah.</span>'
      +F.items.map((y,ix)=>'<div class="pitem irow"><input type="text" id="ir-p-'+ix+'" data-ix="'+ix+'" data-ir="produk" list="dl-iprod" aria-label="Produk" placeholder="Produk" value="'+esc(y.produk||'')+'"><input type="text" id="ir-n-'+ix+'" data-ix="'+ix+'" data-ir="nama" aria-label="Deskripsi" placeholder="Deskripsi, mis. Langganan November" value="'+esc(y.nama||'')+'"><input type="text" inputmode="numeric" id="ir-q-'+ix+'" data-ix="'+ix+'" data-ir="qty" aria-label="Qty" placeholder="Qty" value="'+esc(y.qty)+'"><input type="text" inputmode="numeric" id="ir-h-'+ix+'" data-ix="'+ix+'" data-ir="harga" aria-label="Harga satuan" placeholder="Harga (Rp)" value="'+esc(y.harga)+'"><input type="text" inputmode="numeric" id="ir-d-'+ix+'" data-ix="'+ix+'" data-ir="disc" aria-label="Diskon baris" placeholder="Disc (Rp)" value="'+esc(y.disc||'')+'"><button class="btn small" data-act="inv-del" data-i="'+ix+'">Hapus</button></div>').join('')
      +'<div class="inline"><button class="btn small" data-act="inv-add">Tambah baris</button>'+'</div></div>'
      +'<datalist id="dl-iprod">'+S.products.map(x=>'<option value="'+esc(x.name)+'">').join('')+'<option value="Boarding"><option value="Trx"><option value="Full paket"><option value="Kartu Oncard"><option value="Training"></datalist>'
      +'<div class="fld"><label for="iv-cat">Catatan untuk mitra</label><textarea id="iv-cat" data-if="catatan" rows="2">'+esc(F.catatan)+'</textarea></div>'
      +'<div class="box" id="inv-tot">'+invTotHtml(c)+'</div><div class="err" id="iv-err" hidden></div>'
      +'<div class="inline"><button class="btn primary" data-act="inv-save">'+(F.editId?'Simpan perubahan':'Terbitkan invoice')+'</button><button class="btn" data-act="inv-back">Batal</button></div></section>';
    return{title:'Pembayaran Mitra',sub,bar:tabBar,body}}
  if(g.mode==='view'){const x=S.invoices.find(y=>y.id===g.id);
    if(x){const k=invEff(x),open=ed&&(k==='terbit'||k==='terlambat');
      const body='<div class="invdoc-shell"><div class="invdoc-bar"><button class="btn inv-back" data-act="inv-back">← Kembali ke daftar</button><div class="invdoc-actions">'
        +(S.dl?'<button class="btn" data-act="inv-dl" data-id="'+esc(x.id)+'">Unduh file</button>':'')
        +(open?'<button class="btn" data-act="inv-edit" data-id="'+esc(x.id)+'">Ubah</button><button class="btn" data-act="inv-paid" data-id="'+esc(x.id)+'">Tandai lunas</button><button class="btn danger" data-act="inv-void" data-id="'+esc(x.id)+'" data-confirm="Klik lagi untuk membatalkan">Batalkan invoice</button>':'')
        +'<button class="btn primary" data-act="inv-print">Cetak atau simpan PDF</button></div></div><div class="invdoc">'+invMarkup(x)+'</div></div>';
      return{title:'Invoice '+esc(x.no||''),sub:'Pratinjau invoice untuk '+esc(invTo(x))+'.',bar:tabBar,body}}
    else return{title:'Invoice',sub,bar:tabBar,body:'<div class="invdoc-shell"><div class="invdoc-bar"><button class="btn inv-back" data-act="inv-back">← Kembali ke daftar</button></div><div class="panel empty">Memuat invoice…</div></div>'}}
  const q=f.iq.trim().toLowerCase(),all=S.invoices.slice().sort((a,b)=>String(b.no||'').localeCompare(String(a.no||''))),
    rows=all.filter(x=>(!f.ist||invEff(x)===f.ist)&&(!q||String(x.no||'').toLowerCase().indexOf(q)>=0||invTo(x).toLowerCase().indexOf(q)>=0)),
    sm=a=>a.reduce((n,x)=>n+invTot(x),0),op=all.filter(x=>invEff(x)==='terbit'||invEff(x)==='terlambat'),late=all.filter(x=>invEff(x)==='terlambat'),
    paid=all.filter(x=>x.status==='lunas'&&String(x.paidAt||'').slice(0,7)===cur),iss=all.filter(x=>x.status!=='batal'&&String(x.tanggal||'').slice(0,7)===cur);
  const tiles='<div class="tiles pay-tiles"><div class="tile"><span>Belum dibayar</span><strong>'+rp(sm(op))+'</strong><em>'+op.length+' invoice</em></div><div class="tile"><span>Terlambat</span><strong>'+rp(sm(late))+'</strong><em>'+late.length+' invoice</em></div><div class="tile"><span>Lunas bulan ini</span><strong>'+rp(sm(paid))+'</strong><em>'+paid.length+' invoice</em></div><div class="tile"><span>Diterbitkan bulan ini</span><strong>'+rp(sm(iss))+'</strong><em>'+iss.length+' invoice</em></div></div>';
  const cols=[{l:'No. invoice',v:x=>x.no||'',h:x=>'<button class="pay-inv-no" data-act="inv-view" data-id="'+esc(x.id)+'">'+esc(x.no||'-')+'</button>'},{l:'Untuk',v:x=>invTo(x),h:x=>'<strong class="pay-inv-to">'+esc(invTo(x))+'</strong>'},{l:'Terbit',v:x=>x.tanggal||'',h:x=>'<span class="pay-inv-date">'+fmtD(x.tanggal)+'</span>'},{l:'Jatuh tempo',v:x=>x.jatuhTempo||'',h:x=>{const n=invEff(x)==='terlambat'?-daysTo(x.jatuhTempo):null;return '<span class="pay-inv-date">'+fmtD(x.jatuhTempo)+'</span>'+(n?'<span class="sub pay-inv-late">Lewat '+n+' hari</span>':'')}},{l:'Total (Rp)',num:1,v:x=>invTot(x),h:x=>'<strong class="pay-inv-total">'+rp(invTot(x))+'</strong>'},{l:'Status',v:x=>(INV_ST[invEff(x)]||INV_ST.terbit)[0],h:invPill}]
    .concat([{l:'',v:()=>'',h:x=>'<span class="inline pay-inv-rowacts"><button class="btn small" data-act="inv-view" data-id="'+esc(x.id)+'">Lihat</button>'+(ed&&(invEff(x)==='terbit'||invEff(x)==='terlambat')?'<button class="btn small" data-act="inv-paid" data-id="'+esc(x.id)+'">Tandai lunas</button>':'')+'</span>'}]);
  const table=rows.length?tbl('invoice',cols,rows,''):'';
  const cards=rows.length?'<div class="pay-inv-cards">'+rows.map(x=>{const eff=invEff(x),late=eff==='terlambat'?-daysTo(x.jatuhTempo):null,canPay=ed&&(eff==='terbit'||eff==='terlambat');
    return '<article class="pay-inv-card"><div class="pay-inv-top"><button class="pay-inv-no" data-act="inv-view" data-id="'+esc(x.id)+'">'+esc(x.no||'-')+'</button>'+invPill(x)+'</div>'
      +'<strong class="pay-inv-to">'+esc(invTo(x))+'</strong>'
      +'<div class="pay-inv-meta"><span>Terbit '+fmtD(x.tanggal)+'</span><span>Jatuh tempo '+fmtD(x.jatuhTempo)+(late?' <em>lewat '+late+' hari</em>':'')+'</span></div>'
      +'<div class="pay-inv-foot"><strong>'+rp(invTot(x))+'</strong><div class="pay-inv-actions"><button class="btn small" data-act="inv-view" data-id="'+esc(x.id)+'">Lihat</button>'+(canPay?'<button class="btn small" data-act="inv-paid" data-id="'+esc(x.id)+'">Tandai lunas</button>':'')+'</div></div></article>'}).join('')+'</div>':'';
  const list=rows.length?'<section class="pay-inv-list"><header class="pay-inv-listhead"><div><h2>Daftar invoice</h2><p>'+rows.length+(rows.length===all.length?' invoice':' dari '+all.length+' invoice')+'</p></div></header><div class="pay-inv-table">'+table+'</div>'+cards+'</section>':'<div class="panel empty">'+(all.length?'Tidak ada invoice yang cocok.':'Belum ada invoice.'+(ed?' Buat lewat tombol Invoice baru.':''))+'</div>';
  if(!rows.length)S.csv=null;
  const bar=tabBar+'<div class="pay-filters"><input type="search" data-f="pay.iq" placeholder="Cari nomor atau mitra" aria-label="Cari invoice" value="'+esc(f.iq)+'"><select data-f="pay.ist" aria-label="Status invoice">'+[['','Semua status'],['terbit','Belum dibayar'],['terlambat','Terlambat'],['lunas','Lunas'],['batal','Dibatalkan']].map(c=>opt(c[0],c[1],f.ist)).join('')+'</select>'+csvBtn()+'</div>';
  return{title:'Pembayaran Mitra',sub,action:ed?'<button class="btn primary" data-act="inv-new">Invoice baru</button>':'',bar,body:'<div class="pay-page pay-invoice">'+tiles+list+'</div>'}}
const newPayForm=()=>({trxJml:'',trxBiaya:'',trxBulan:nowYM(),tipe:'langganan',editId:null,mitraId:'',tanggal:'',total:'',bukti:'',catatan:'',items:[]});
function payRead(){const f=S.payForm,out=[];let bad=false,nob=false;f.items.forEach(y=>{const it={jenis:y.jenis,nama:String(y.nama||'').trim(),bulan:[]};if(!it.nama)bad=true;
  if(y.jenis==='langganan'){it.bulan=[...new Set((Array.isArray(y.bulan)?y.bulan:[]).filter(isYM))].sort();if(!it.bulan.length)nob=true}
  if(y.jenis!=='langganan'){const bl=[...new Set((Array.isArray(y.bulan)?y.bulan:[]).filter(isYM))].sort();if(bl.length)it.bulan=bl}const nm=numOf(y.nominal);if(nm!==null)it.nominal=nm;out.push(it)});return{items:out,bad,nob}}
const itYr=y=>{const b=(Array.isArray(y.bulan)?y.bulan:[]).filter(isYM).sort();return +y.yr||(b.length?+b[0].slice(0,4):+nowYM().slice(0,4))};
const mchips=(ix,y)=>{const sel=(Array.isArray(y.bulan)?y.bulan:[]).filter(isYM),yr=itYr(y),cy=+nowYM().slice(0,4),ys=new Set([cy,cy+1,cy+2,yr]);sel.forEach(b=>ys.add(+b.slice(0,4)));const yl=[...ys].sort((a,b)=>a-b),lg=y.jenis==='langganan';
  return '<div class="ytabs" role="group" aria-label="Tahun">'+yl.map(t=>'<button type="button" class="mchip yt" data-act="pyr" data-ix="'+ix+'" data-y="'+t+'" aria-pressed="'+(t===yr)+'">'+t+'</button>').join('')+(lg?'<button type="button" class="btn small" style="margin-left:auto" data-act="pall" data-ix="'+ix+'">Satu tahun penuh</button>':'')+'</div><div class="mchips" role="group" aria-label="Bulan">'+BLN.map((n,k)=>{const b=yr+'-'+pad(k+1);return '<button type="button" class="mchip" data-act="pmon" data-ix="'+ix+'" data-b="'+b+'" aria-pressed="'+(sel.indexOf(b)>=0)+'">'+n+'</button>'}).join('')+'</div><span class="sub" style="display:block">'+(sel.length?'Terpilih: '+sel.sort().map(mLabel).join(', '):'Belum ada bulan dipilih.')+'</span>'};
function payTot(r){let t=0,miss=0;r.items.forEach(y=>{if(typeof y.nominal==='number')t+=y.nominal*(y.jenis==='langganan'?Math.max((y.bulan||[]).length,1):1);else miss++});return{t,miss}}
const ntTitle=t=>{const l=String(t||'').split('\n').map(x=>x.trim()).find(Boolean);return l||'Catatan baru'};
const ntPrev=t=>{const ls=String(t||'').split('\n').map(x=>x.trim()).filter(Boolean);return ls.slice(1).join(' ')||'Tidak ada teks tambahan'};
const ntWhen=x=>{const iso0=x.diubah||x.dibuat;if(!iso0)return '';const d=new Date(iso0);if(isNaN(d))return '';return String(iso0).slice(0,10)===today()?d.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'}):fmtD(String(iso0).slice(0,10))};
const ntItem=(x,on)=>'<button type="button" class="nt-i" data-act="cat-open" data-id="'+esc(x.id)+'"'+(on?' aria-current="true"':'')+'><b>'+esc(ntTitle(x.teks))+'</b><span>'+esc(ntWhen(x))+(x.teks?' · ':'')+esc(x.teks?ntPrev(x.teks):'')+'</span></button>';
const ntBlur=()=>{const a=document.activeElement;if(a&&a.blur&&a.id==='nt-text')a.blur();S.pending=false};
async function catSave(){const c=catCol(),f=S.f.cat,el=$('#nt-text');if(!c||!el)return;clearTimeout(S.catT);S.catT=null;const teks=el.value,now=new Date().toISOString(),st=$('#ntst');
  if(f.sel==='new'){if(!teks.trim())return;const ref=c.doc();f.sel=ref.id;const ci=$('.nt-i[aria-current="true"]');if(ci)ci.dataset.id=ref.id;S.cat.push({id:ref.id,teks,dibuat:now,diubah:now});try{await ref.set({teks,dibuat:now,diubah:now})}catch(e){toast(errMsg(e),true)}if(st)st.textContent='Tersimpan';return}
  const old=S.cat.find(x=>x.id===f.sel);if(!old||old.teks===teks)return;old.teks=teks;old.diubah=now;
  try{await c.doc(old.id).set({teks,dibuat:old.dibuat||now,diubah:now});if(st)st.textContent='Tersimpan'}catch(e){toast(errMsg(e),true)}}
async function catFlush(){if(S.catT){await catSave()}const f=S.f.cat,c=catCol();if(c&&f.sel&&f.sel!=='new'){const x=S.cat.find(y=>y.id===f.sel);if(x&&!String(x.teks||'').trim()){try{await c.doc(x.id).delete()}catch(e){}S.cat=S.cat.filter(y=>y.id!==x.id)}}}
const ABS_ST={hadir:['Hadir di kantor','good'],wfh:['WFH','info'],dinas:['Dinas luar','info'],izin:['Izin','warn'],sakit:['Sakit','warn']};
const absCfg=()=>Object.assign({jamMasuk:'09:00',jamPulang:'16:00',toleransi:10},S.absSet||{});
const absId=(d,u)=>d+'_'+String(u).replace(/[^a-zA-Z0-9_-]/g,'_');
const hhmm=v=>{if(!v)return '—';const d=new Date(v);return isNaN(d)?'—':pad(d.getHours())+':'+pad(d.getMinutes())};
const absOf=(d,u)=>S.abs.find(x=>x.id===absId(d,u));
const absNoTime=x=>x.status==='izin'||x.status==='sakit';
const lateMin=x=>{if(!x.masuk||absNoTime(x))return 0;const c=absCfg(),hm=String(c.jamMasuk).split(':').map(Number),d=new Date(x.masuk);if(isNaN(d))return 0;const t=d.getHours()*60+d.getMinutes()-((hm[0]||0)*60+(hm[1]||0));return t>(+c.toleransi||0)?t:0};
const absMin=x=>{if(!x.masuk||!x.pulang)return null;const m=Math.round((new Date(x.pulang)-new Date(x.masuk))/6e4);return isNaN(m)||m<0?null:m};
const durTxt=x=>{const m=absMin(x);return m===null?'—':Math.floor(m/60)+' j '+(m%60)+' m'};
const canAbsTeam=()=>own()||lvl('absen')>=1,canAbsAdm=()=>own()||lvl('absen')>=2;
const absDay=d=>new Date(d+'T00:00:00').toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
const absShort=d=>new Date(d+'T00:00:00').toLocaleDateString('id-ID',{weekday:'short',day:'numeric',month:'short'});
const myAm=()=>S.acct?(S.acct.am||(S.acct.role==='am'?'a:'+S.acct.id:null)):null;
const nrm=v=>String(v||'').toLowerCase().replace(/\s+/g,' ').trim();
const INVL={terbit:'Belum dibayar',terlambat:'Terlambat',lunas:'Lunas',batal:'Dibatalkan',draft:'Draft'};
function mitraTimeline(s0){
  const ev=[],nm=nrm(s0.name),id=s0.id,add=(d,k,t,sb,tone)=>{if(d)ev.push({d:String(d).slice(0,10),k,t:t||'-',sb:sb||'',tone:tone||''})};
  if(allowed('isu'))S.issues.filter(i=>i.schoolId===id).forEach(i=>add(i.createdAt,'Isu',i.subject,[code('isu',i),i.status].filter(Boolean).join(' · '),i.status==='Closed'?'good':'warn'));
  if(allowed('pembayaran')){S.pay.filter(x=>x.mitraId===id).forEach(x=>add(x.tanggal||x.dibuat,'Pembayaran',(x.total?rp(x.total):'Pembayaran'),payText(x),'good'));
    S.invoices.filter(x=>x.mitraId===id||nrm(x.untuk)===nm).forEach(x=>add(x.tanggal||x.dibuat,'Invoice',(x.no||'Invoice')+' · '+rp(invTot(x)),INVL[invEff(x)]||'','info'))}
  if(allowed('administrasi')){S.surat.filter(x=>nrm(x.pihak)===nm).forEach(x=>add(x.tanggal,'Surat',x.perihal||x.nomor,[x.nomor,x.arah==='masuk'?'Surat masuk':'Surat keluar'].filter(Boolean).join(' · '),''));
    S.mou.filter(x=>x.mitraId===id||nrm(x.untuk)===nm).forEach(x=>add(x.tanggalTtd||x.mulai||x.dibuat,'MoU',x.judul,[x.nomor,(MOU_ST[x.status]||[''])[0]].filter(Boolean).join(' · '),'info'))}
  if(allowed('project'))S.projects.filter(p=>p.schoolId===id).forEach(p=>add(p.createdAt||p.start,'Project',p.name,'','' ));
  (s0.log||[]).forEach(l=>add(l.at,'Catatan',l.text,[l.type,l.by?nameOf(l.by):'Tim QRION'].filter(Boolean).join(' · '),''));
  return ev.sort((a,b)=>a.d<b.d?1:a.d>b.d?-1:0)}
const mitraTl=s0=>{const ev=mitraTimeline(s0);return '<div><h3>Riwayat aktivitas ('+ev.length+')</h3><div class="rows">'+(ev.slice(0,40).map(e=>'<div class="rowi" style="cursor:default;align-items:flex-start"><span style="min-width:0"><span class="t">'+esc(e.t)+'</span><small>'+esc(fmtD(e.d)+(e.sb?' · '+e.sb:''))+'</small></span>'+pill(e.k,e.tone)+'</div>').join('')||'<div class="empty">Belum ada aktivitas tercatat untuk mitra ini.</div>')+(ev.length>40?'<div class="empty">Menampilkan 40 terbaru dari '+ev.length+'.</div>':'')+'</div></div>'};
function logAct(ket){if(!db||S.sim||!ket)return;try{const by=S.acct?(S.acct.nama||S.acct.id)+' (@'+S.acct.id+')':(S.names[me.rid]||(me.isOwner?'Pemilik':'Pengguna')),vw=(VIEWS.find(v=>v[0]===S.view)||[,''])[1];db.collection('audit').doc().set({t:new Date().toISOString(),by,byId:me.rid||null,akun:S.acct?S.acct.id:null,menu:vw,aksi:String(ket).slice(0,300)}).catch(()=>{})}catch(e){}}
const catCol=()=>{try{return db&&me.rid?db.collection('data/users/'+me.rid):null}catch(e){return null}};
const catDoc=(x,o)=>{const d=Object.assign({},x);delete d.id;return Object.assign(d,o)};
function paySum(){const el=$('#sumhint');if(!el||!S.payForm)return;const f=S.payForm;if(f.tipe==='topup'||f.tipe==='transaksi'){const n=numOf(f.total);el.innerHTML='<strong>'+(n!=null?rp(n):'—')+'</strong>';return}const r=payRead(),c=payTot(r);el.innerHTML='<strong>'+rp(c.t)+'</strong>'+(c.miss?'<span class="pay-total-warn">'+c.miss+' item belum ada nominal</span>':'')}
const iSch=i=>{const x=school(i.schoolId);return x?x.name:''};
const tsort=(a,b)=>((b.status!=='Closed')-(a.status!=='Closed'))||(overdue(b)-overdue(a))||String(a.slaDeadline).localeCompare(String(b.slaDeadline));
async function tstatus(i,to,extra,msgs,ok){
  if(!(TRANS[i.status]||[]).includes(to)){toast('Status '+i.status+' tidak bisa langsung ke '+to+'.',true);return false}
  const now=new Date(),nowS=now.toISOString(),u=Object.assign({status:to},extra||{});let dl=new Date(i.slaDeadline).getTime();
  if(i.status==='Waiting Validation'&&i.pausedAt){const mins=Math.max(0,Math.round((now-new Date(i.pausedAt))/6e4));u.pausedMinutes=(i.pausedMinutes||0)+mins;dl+=mins*6e4;u.pausedAt=null}
  u.slaDeadline=new Date(dl).toISOString();
  if(to==='Waiting Validation')u.pausedAt=nowS;
  if(to==='Closed'){u.closedAt=nowS;u.slaBreached=now.getTime()>dl}
  if(i.status==='Closed'){u.closedAt=null;u.reopenCount=(i.reopenCount||0)+1;u.csat=null;u.slaBreached=false}
  if(!i.firstResponseAt&&i.status==='Open'&&canHandle())u.firstResponseAt=nowS;
  u.messages=(i.messages||[]).concat([{at:nowS,by:me.id,kind:'system',body:'Status: '+i.status+' → '+to}],(msgs||[]).map(x=>Object.assign({at:nowS,by:me.id},x)));
  return write(()=>db.collection('issues').doc(i.id).update(u),ok||'Status tiket diperbarui');
}
const age=x=>x.createdAt?Math.max(0,days(String(x.createdAt).slice(0,10),today())):0;
const lastAct=x=>{const l=x.log||[];return l.length?String(l[l.length-1].at).slice(0,10):null};
const logHtml=(x,empty)=>'<div class="log" style="margin-top:8px">'+((x.log||[]).slice().reverse().map(l=>'<div><small>'+fmtD(l.at)+' · '+esc(l.type||'Catatan')+' · '+esc(l.by?nameOf(l.by):'Tim QRION')+'</small><div style="white-space:pre-wrap">'+esc(l.text)+'</div></div>').join('')||'<div class="empty">'+empty+'</div>')+'</div>';
const actForm=ph=>'<div class="inline"><select id="d-atype" aria-label="Jenis aktivitas">'+ATYPE.map(t=>opt(t,t,'Catatan')).join('')+'</select><input type="text" id="d-log" placeholder="'+ph+'" aria-label="'+ph+'"><button class="btn primary" data-act="log-add">Catat</button></div>';
const seg=(view,modes,cur)=>'<span class="seg" role="group" aria-label="Tampilan">'+modes.map(m=>'<button data-act="mode" data-v="'+view+'" data-m="'+m[0]+'" aria-pressed="'+(cur===m[0])+'">'+m[1]+'</button>').join('')+'</span>';
const csvBtn=()=>S.dl?'<button class="btn" data-act="csv">Ekspor CSV</button>':'';
const sumLine=parts=>'<p style="margin:0 0 10px;color:var(--ink2)">'+parts.join(' · ')+'</p>';
function tbl(view,cols,rows,kind,cls){
  const so=S.sort[view];
  if(so&&cols[so.i]){const c=cols[so.i];rows=rows.slice().sort((a,b)=>{const x=c.v(a),y=c.v(b);return so.d*(typeof x==='number'&&typeof y==='number'?x-y:String(x==null?'':x).localeCompare(String(y==null?'':y),'id'))})}
  S.csv={view,cols,rows};
  return '<div class="tablewrap"><table><thead><tr>'+cols.map((c,i)=>c.csvOnly?'':'<th class="'+(c.num?'num':'')+'"'+(so&&so.i===i?' aria-sort="'+(so.d>0?'ascending':'descending')+'"':'')+'><button class="th" data-act="sort" data-v="'+view+'" data-i="'+i+'" title="Urutkan">'+c.l+(so&&so.i===i?(so.d>0?' ▲':' ▼'):'')+'</button></th>').join('')+'</tr></thead><tbody>'
    +rows.map(r=>'<tr'+(kind?' data-open="'+kind+':'+esc(r.id)+'"':'')+' class="'+(cls?cls(r):'')+'">'+cols.map(c=>c.csvOnly?'':'<td class="'+(c.num?'num':'')+'">'+(c.h?c.h(r):esc(c.v(r)))+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
}
function searchView(){
  const q=S.gq.trim().toLowerCase(),hit=(...a)=>a.join(' ').toLowerCase().includes(q);
  const grp=(t,k,items,lab,sub)=>items.length?'<section class="panel"><header><h2>'+t+' ('+items.length+')</h2></header><div class="rows">'+items.slice(0,8).map(x=>'<button class="rowi" data-open="'+k+':'+esc(x.id)+'"><span><span class="t">'+esc(lab(x))+'</span><small>'+esc(sub(x))+'</small></span><small>'+esc(code(k,x))+'</small></button>').join('')+'</div></section>':'';
  const b=(allowed('sekolah')?grp('Mitra Sekolah','sekolah',S.schools.filter(x=>hit(x.name,x.city,x.picName,code('sekolah',x))),x=>x.name,x=>[x.jenjang,x.city].filter(Boolean).join(' · ')):'')
    +grp('Tiket isu','isu',S.issues.filter(x=>hit(x.subject,x.description,iSch(x),code('isu',x))),x=>x.subject,x=>[iSch(x),x.status].filter(Boolean).join(' · '))
    +(allowed('project')?grp('Project','project',S.projects.filter(x=>hit(x.name,x.notes,pSch(x),asg(x),code('project',x))),x=>x.name,x=>[pSch(x),asg(x),PSTAT[x.status]].filter(Boolean).join(' · ')):'')
    +(allowed('pipeline')?grp('Leads','pipeline',S.leads.filter(x=>hit(x.name,x.city,x.contact,code('pipeline',x))),x=>x.name,x=>[x.city,stage(x.stage)[1]].filter(Boolean).join(' · ')):'');
  return{title:'Hasil pencarian',sub:'Kata kunci: '+S.gq.trim(),body:b?'<div class="grid2">'+b+'</div>':'<div class="panel empty">Tidak ada data yang cocok. Coba nama sekolah, judul isu, atau nomor seperti TKT-2611.</div>'};
}
const dur=p=>p.start&&p.end&&p.end>=p.start?days(p.start,p.end):null;
const pSch=p=>{const x=school(p.schoolId);return x?x.name:''};
const who=v=>!v?'Belum ditugaskan':S.names[v]||(members().includes(v)?nameOf(v):v);
const asg=p=>p.assignee||(p.assignees||[]).map(nameOf).join(', ');
const overdue=i=>i.status!=='Closed'&&!!slaOf(i).breached;
const stage=k=>STAGES.find(s=>s[0]===k)||STAGES[0];
function toast(t,bad){try{window.__QR.toast(t,bad)}catch(e){}}
function errMsg(e){const c=e&&e.code;
  if(c==='quota_exceeded')return 'Penyimpanan penuh. Hapus data lama lalu coba lagi.';
  if(c==='invalid_argument')return 'Tidak tersimpan. Anda mungkin tidak punya hak ubah, atau datanya sudah dihapus.';
  if(c==='resource_exhausted')return 'Terlalu banyak permintaan. Tunggu sebentar lalu coba lagi.';
  return 'Tidak tersimpan karena koneksi bermasalah. Coba lagi.'}
async function write(fn,ok){if(S.sim){toast('Mode simulasi: perubahan tidak disimpan.',true);return false}try{await fn();if(ok){toast(ok);logAct(ok)}return true}catch(e){toast(errMsg(e),true);return false}}
function needNames(){
  if(!user||!user.profiles)return;
  const ids=new Set(members());
  [S.issues,S.schools,S.leads].forEach(a=>a.forEach(x=>{x.am&&ids.add(x.am);x.assignee&&ids.add(x.assignee);x.createdBy&&ids.add(x.createdBy)}));
  S.projects.forEach(x=>{x.pm&&ids.add(x.pm);(x.assignees||[]).forEach(u=>ids.add(u));(x.milestones||[]).forEach(t=>t.who&&ids.add(t.who));(x.log||[]).forEach(l=>l.by&&ids.add(l.by))});
  S.issues.forEach(i=>(i.messages||[]).forEach(l=>l.by&&ids.add(l.by)));
  const want=[...ids].filter(id=>!isAcc(id)&&!S.asked.has(id)&&!S.ams.includes(id)&&!S.people.includes(id)).slice(0,60);
  if(!want.length)return;
  want.forEach(id=>S.asked.add(id));
  Promise.resolve(user.profiles(want)).then(ps=>{let ch=false;want.forEach(id=>{const n=ps&&ps[id]&&ps[id].name;if(n){S.names[id]=n;ch=true}});if(ch)queue()}).catch(()=>{});
}

/* ---------- render core ---------- */
let qd=false;
function queue(){if(qd)return;qd=true;requestAnimationFrame(()=>{qd=false;render()})}
function typing(root){const a=document.activeElement;return a&&root.contains(a)&&(a.tagName==='TEXTAREA'||(a.tagName==='INPUT'&&!['checkbox','radio','button'].includes(a.type)))}
function payScroll(){if(S.view!=='pembayaran'||S.f.pay.tab!=='status'){S.scKey=null;S.payX=null;return}const w=$('.pay-matrix-scroll');if(!w)return;const k=String(S.f.pay.y||'cur');if(S.scKey!==k){S.scKey=k;S.payX=null}if(S.payX==null){const n=w.querySelector('.mhead-mon.now'),wr=w.getBoundingClientRect(),nr=n?n.getBoundingClientRect():null;S.payX=nr?Math.max(0,w.scrollLeft+nr.left-wr.left-220):0}w.scrollLeft=S.payX}
document.addEventListener('scroll',e=>{const t=e.target;if(t&&t.classList&&t.classList.contains('pay-matrix-scroll'))S.payX=t.scrollLeft},true);
S.entered=(()=>{try{return sessionStorage.getItem('qrion-in')==='1'}catch(e){return false}})();
S.accounts=[];S.acct=null;S.lg={n:0,until:0,err:'',busy:false};
S.acTok=(()=>{try{return JSON.parse(sessionStorage.getItem('qrion-acct')||'null')}catch(e){return null}})();
const b64=u=>{let t='';u.forEach(c=>t+=String.fromCharCode(c));return btoa(t)};
const unb64=t=>Uint8Array.from(atob(t),c=>c.charCodeAt(0));
async function pbk(pw,salt,iter){const c=window.crypto&&window.crypto.subtle;if(!c)throw new Error('Peramban tidak mendukung enkripsi sandi.');const k=await c.importKey('raw',new TextEncoder().encode(pw),'PBKDF2',false,['deriveBits']);return b64(new Uint8Array(await c.deriveBits({name:'PBKDF2',hash:'SHA-256',salt,iterations:iter},k,256)))}
const ITER=600000;
async function mkCred(pw){if(window.__QR&&window.__QR.remote)return{};const salt=crypto.getRandomValues(new Uint8Array(16));return{salt:b64(salt),iter:ITER,hash:await pbk(pw,salt,ITER)}}
const acDoc=a=>{const o=Object.assign({},a);delete o.id;return o};
const normU=u=>String(u||'').trim().toLowerCase();
const okU=u=>/^[a-z0-9._-]{3,32}$/.test(u);
function syncAcct(){
  const Q=window.__QR||{},a=Q.acct;
  if(!a){S.acct=null;S.entered=false;return}
  S.entered=true;me.rid=a.id;
  if(a.role==='admin'){S.acct=null;me.isOwner=true}else{me.isOwner=false;S.acct=Object.assign({},S.accounts.find(x=>x.id===a.id)||a)}
  if(a.nama)S.names[a.id]=a.nama;
}
function doLogout(){try{window.__QR.logout()}catch(e){}}
async function doLogin(){
  const L=S.lg,now=Date.now();
  if(L.busy)return;
  if(L.until>now){L.err='Terlalu banyak percobaan. Coba lagi dalam '+Math.ceil((L.until-now)/1000)+' detik.';render();return}
  const u=normU(($('#lg-u')||{}).value),pw=($('#lg-p')||{}).value||'';
  if(!u||!pw){L.err='Isi username dan password.';render();return}
  L.busy=true;
  try{
    const a=S.accounts.find(x=>x.id===u);
    const salt=a&&a.salt?unb64(a.salt):new Uint8Array(16),h=await pbk(pw,salt,(a&&a.iter)||ITER);
    if(a&&a.aktif!==false&&h===a.hash){L.n=0;L.err='';S.acct=Object.assign({},a);S.acTok={u:a.id,h:a.hash};try{sessionStorage.setItem('qrion-acct',JSON.stringify(S.acTok));sessionStorage.removeItem('qrion-in')}catch(e){}S.entered=true;S.landed=false;S.defaulted=false;S.view='ringkasan';try{location.hash=''}catch(e){}}
    else{L.n++;L.err='Username atau password salah.';if(L.n>=5){L.n=0;L.until=Date.now()+30000;L.err='Terlalu banyak percobaan. Tunggu 30 detik.'}}
  }catch(e){L.err=(e&&e.message)||'Gagal memeriksa sandi.'}
  L.busy=false;render();if(S.entered){const hv=homeView();if(hv){S.view=hv;try{location.hash=hv}catch(e){}}window.scrollTo(0,0);render()}
}
function gateOpen(){syncAcct();document.body.classList.toggle('gated',!S.entered);return false}
function render(){
  if(DRAG_LOCK){DEFER_RENDER=true;return}
  if(gateOpen())return;if(!$('#legacy-island'))return;
  setTimeout(payScroll,30);needNames();
  if(!S.defaulted&&me.id&&S.loaded.has('roles')){S.defaulted=true;if(S.acct&&myAm()){S.f.isu.who=S.f.sekolah.who=S.f.pipeline.who=S.f.pay.who=myAm()}else if(role()==='am'&&!S.acct){S.f.isu.who=S.f.sekolah.who=S.f.pipeline.who=me.id}if(role()==='pm'&&!S.acct)S.f.project.who=me.id;}
  if(S.loaded.has('roles')){const hv=homeView();if(me.id&&!S.landed){S.landed=true;if(false){S.view=hv;try{location.hash=S.view}catch(e){}}}
    if(!allowed(S.view)&&hv){S.view=hv;S.drawer=null;try{location.hash=S.view}catch(e){}}}
  const blocked=S.loaded.has('roles')&&!allowed(S.view);
  renderNav();
  const main=$('#legacy-island'),vk=blocked?'blokir':S.gq.trim()?'cari':S.view,v=blocked?{title:'QRION CRM',sub:'',body:'<div class="panel empty">'+(S.dead?'Data tidak dapat dimuat pada tampilan ini.':'Akun Anda belum diberi peran, jadi belum ada menu yang bisa dibuka. Minta super admin menetapkan peran Anda di menu Pengaturan.')+'</div>'}:vk==='cari'?searchView():VIEWBUILD[S.view]();
  const bar=$('.toolbar',main),body=$('#vbody',main);
  if(body&&typing(body)){S.pending=true}
  else if(bar&&body&&typing(bar)&&main.dataset.v===vk){body.innerHTML=v.body}
  else{
    main.dataset.v=vk;
    main.innerHTML='<header class="page-head"><div class="page-head-main"><h1>'+esc(v.title)+'</h1><p>'+esc(v.sub||'')+'</p></div>'+(v.action?'<div class="page-head-actions">'+v.action+'</div>':'')+'</header>'+banners()+(v.bar?'<div class="toolbar">'+v.bar+'</div>':'')+'<div id="vbody">'+v.body+'</div>';
  }
  renderDrawer();paySum();fixA11y();
}
function fixA11y(){
  document.querySelectorAll('th:empty').forEach(t=>{t.innerHTML='<span class="sr">Aksi</span>'});
  document.querySelectorAll('[style*="overflow-x:auto"],.tablewrap').forEach((e,i)=>{if(!e.hasAttribute('tabindex')){e.tabIndex=0;e.setAttribute('role','region');e.setAttribute('aria-label','Tabel '+(i+1)+', gunakan tombol panah untuk menggeser')}})}
function banners(){
  let h='';
  if(S.dead)h+='<div class="banner">Data tidak dapat dimuat pada tampilan ini. Buka halaman ini saat masuk ke akun Claude Anda.</div>';
  else if(S.slow&&S.loaded.size<8)h+='<div class="banner">Data belum bisa dijangkau. Halaman akan terisi sendiri begitu koneksi kembali.</div>';
  else if(db&&S.loaded.has('roles')){
    if(me.canWrite===false)h+='<div class="banner info">Anda punya akses lihat saja pada halaman ini.</div>';

    if(isAdmin()&&['issues','projects','schools','leads'].some(k=>S[k].some(x=>x.contoh)))h+='<div class="banner info">Sebagian data di sini adalah contoh. Hapus dari menu Pengaturan setelah Anda mulai mengisi data asli.</div>';
  }
  return h;
}
function setSim(v){
  if(!v){S.sim=null}else{const [t,x]=v.split(/:(.+)/);if(t==='prog')S.sim={v,key:'programmer',id:x,label:'Programmer '+x};else{const nm=(ACC()[x]||{}).name||x;S.sim={v,key:x,id:nm+' (simulasi)',label:nm}}}
  S.f.isu.tab='beranda';S.f.isu.who=S.f.sekolah.who=S.f.pipeline.who=S.f.project.who='';S.drawer=null;S.accDraft=null;
  const hv=homeView();try{location.hash=hv||'ringkasan'}catch(e){}S.view=hv||'ringkasan';render();window.scrollTo(0,0)}
function renderNav(){
  let sb=$('#simbar');if(S.sim){if(!sb){sb=document.createElement('div');sb.id='simbar';sb.className='simbar';document.body.appendChild(sb)}sb.innerHTML='<span>Mode simulasi: tampilan <b>'+esc(S.sim.label)+'</b>. Perubahan data tidak disimpan.</span><button class="btn small" data-act="sim-exit">Keluar simulasi</button>'}else if(sb)sb.remove();
}
const opt=(v,l,cur)=>'<option value="'+esc(v)+'"'+(String(v)===String(cur||'')?' selected':'')+'>'+esc(l)+'</option>';
const whoSel=(view,cur,lbl)=>'<select data-f="'+view+'.who" aria-label="'+lbl+'">'+opt('','Semua '+lbl,cur)+amList().map(id=>opt(id,nameOf(id),cur)).join('')+opt('none','Belum ditugaskan',cur)+'</select>';
const matchWho=(val,f)=>!f||(f==='none'?!val:val===f);
const addBtn=(k,l)=>(k==='project'?canPlan():can(k))?'<button class="btn primary" data-act="new" data-k="'+k+'">'+l+'</button>':'';


const ROMAN=['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];
const SURAT_KAT=['Penawaran','Undangan','Pemberitahuan','Permohonan','Balasan','Perjanjian','Lainnya'];
const SURAT_KODE=[['SP','Surat Pernyataan'],['SPB','Surat Pemberitahuan'],['SPH','Surat Penawaran'],['SK','Surat Keputusan'],['SKS','Surat Kerja Sama / Perjanjian'],['ST','Surat Tugas'],['INV','Invoice']],KODE_PT='QRION',KODE_NM=Object.fromEntries(SURAT_KODE);
const SURAT_ST={draft:['Draf',''],terkirim:['Terkirim','info'],diterima:['Diterima','good'],arsip:['Diarsipkan','']};
const MOU_ST={draft:['Draft',''],menunggu:['Menunggu tanda tangan','warn'],aktif:['Aktif','good'],berakhir:['Berakhir','crit'],batal:['Dibatalkan','']};
const daysTo=d=>{if(!d)return null;const a=new Date(String(d).slice(0,10)+'T00:00:00'),b=new Date(today()+'T00:00:00');return isNaN(a)?null:Math.round((a-b)/864e5)};
const mouEff=x=>{if(x.status==='aktif'){const n=daysTo(x.berakhir);if(n!==null&&n<0)return['berakhir',null];if(n!==null&&n<=60)return['segera',n]}return[x.status||'draft',null]};
const suratUrut=(kode,tgl,skipId)=>{const y=String(tgl||today()).slice(0,4);let mx=0;S.surat.forEach(x=>{if(x.arah!=='masuk'&&x.kode===kode&&String(x.tanggal||'').slice(0,4)===y&&x.id!==skipId){const n=+x.noUrut||parseInt(String(x.nomor||'').split('/')[0],10)||0;if(n>mx)mx=n}});return mx+1};
const suratNomor=(kode,n,tgl)=>{const t=String(tgl||today());return String(n).padStart(3,'0')+'/'+kode+'-'+KODE_PT+'/'+ROMAN[(+t.slice(5,7)||1)-1]+'/'+t.slice(0,4)};
const suratAuto=F=>{if(!F||F.arah==='masuk')return;F.noUrut=suratUrut(F.kode,F.tanggal,F.id);F.nomor=suratNomor(F.kode,F.noUrut,F.tanggal)};
const mouTo=x=>String((x&&x.untuk)||'').trim()||(x&&x.mitraId?schoolName(x.mitraId):'')||'-';
const newAdm=(k,x)=>{S.upl.adm=x&&Array.isArray(x.lampiran)?x.lampiran.slice():[];if(k==='mou')return Object.assign({kind:'mou',id:null,nomor:'',mitraId:'',untuk:(x&&!x.untuk&&x.mitraId?schoolName(x.mitraId):''),judul:'MoU Kerjasama',tanggalTtd:'',mulai:'',berakhir:'',status:'draft',ruang:'',penandatangan:'',catatan:''},x||{});const t=today();const d0=Object.assign({kind:'surat',id:null,arah:'keluar',kode:'SPB',noUrut:1,nomor:'',tanggal:t,perihal:'',pihak:'',penandatangan:'',lampiranKet:'',link:'',kategori:'',status:'draft',catatan:''},x||{});if(!x){suratAuto(d0)}else if(!d0.pihak&&d0.tujuan)d0.pihak=d0.tujuan;return d0};
const BR_KAT=['Logo','Brosur dan flyer','Poster dan banner','Presentasi dan pitch deck','Foto dan dokumentasi','Video','Panduan brand','Template','Lainnya'];
const fileKind=f=>isImg(f)?'img':/video\//.test(f.type||'')?'video':/pdf/.test(f.type||f.name||'')?'PDF':String((f.name||'').split('.').pop()||'FILE').toUpperCase().slice(0,4);
const admLamp=a=>a&&a.length?attView(a):'';
/* ---------- views ---------- */
const VIEWBUILD={
ringkasan(){
  const ls=S.schools.filter(live),mrr=ls.reduce((a,s)=>a+sMrr(s),0);
  const open=S.issues.filter(i=>i.status!=='Closed'),hot=open.filter(i=>['Critical','High'].includes(i.urgency));
  const run=S.projects.filter(p=>p.status!=='selesai'),late=run.filter(p=>pHealth(p)[1]==='crit');
  const ol=S.leads.filter(l=>!['menang','kalah'].includes(l.stage)),wp=ol.reduce((a,l)=>a+(+l.estMrr||0)*stage(l.stage)[2]/100,0);
  const risk=ls.filter(s=>s.status==='berisiko').length;
  const exp=ls.map(s=>[s,contract(s)]).filter(x=>x[1][2]!=null&&x[1][2]<=60).sort((a,b)=>a[1][2]-b[1][2]);
  const tiles='<div class="tiles">'
   +'<div class="tile"><span>MRR berjalan</span><strong>'+rpS(mrr)+'</strong><em>'+ls.length+' mitra sekolah</em></div>'
   +'<div class="tile"><span>Mitra berisiko</span><strong>'+risk+'</strong><em class="'+(exp.length?'warn':'')+'">'+exp.length+' kontrak perlu diperpanjang</em></div>'
   +'<div class="tile"><span>Isu terbuka</span><strong>'+open.length+'</strong><em class="'+(hot.length?'crit':'')+'">'+hot.length+' High atau Critical · '+open.filter(overdue).length+' lewat SLA</em></div>'
   +'<div class="tile"><span>Project berjalan</span><strong>'+run.length+'</strong><em class="'+(late.length?'crit':'')+'">'+late.length+' terlambat</em></div>'
   +'<div class="tile"><span>Pipeline tertimbang</span><strong>'+rpS(wp)+'</strong><em>'+ol.length+' leads terbuka, MRR per bulan</em></div></div>';
  const list=(items,empty)=>items.length?'<div class="rows">'+items.join('')+'</div>':'<div class="empty">'+empty+'</div>';
  const row=(k,id,t,sub,right)=>'<button class="rowi" data-open="'+k+':'+esc(id)+'"><span><span class="t">'+esc(t)+'</span><small>'+esc(sub)+'</small></span>'+right+'</button>';
  const pExp=list(exp.slice(0,6).map(([s,c])=>row('sekolah',s.id,s.name,rp(sMrr(s))+' per bulan · '+nameOf(s.am),pill(c[0],c[1]))),'Tidak ada kontrak yang berakhir dalam 60 hari.');
  const pIss=list(open.filter(i=>overdue(i)||hot.includes(i)).sort(tsort).slice(0,6).map(i=>{const g=sla(i);return row('isu',i.id,i.subject,[code('isu',i),i.urgency,iSch(i)].filter(Boolean).join(' · '),pill(g[0],g[1]))}),'Tidak ada tiket prioritas tinggi atau lewat SLA.');
  const pPrj=list(run.slice().sort((a,b)=>(a.end||'9')<(b.end||'9')?-1:1).slice(0,6).map(p=>{const h=pHealth(p);return row('project',p.id,p.name,(asg(p)?asg(p)+' · ':'')+pProg(p)+'% · deadline '+fmtD(p.end),pill(h[0],h[1]))}),'Belum ada project yang berjalan.');
  const byP=S.products.map(p=>[p.name,ls.reduce((a,s)=>a+(s.products||[]).filter(x=>x.productId===p.id).reduce((b,x)=>b+(+x.mrr||0),0),0),ls.filter(s=>(s.products||[]).some(x=>x.productId===p.id)).length]);
  const mx=Math.max(1,...byP.map(x=>x[1]));
  const pBar=byP.length?'<div class="bars">'+byP.map(x=>'<div class="bar"><span>'+esc(x[0])+' <small style="color:var(--ink2)">'+x[2]+' sekolah</small></span><div class="track"><i style="width:'+(x[1]/mx*100)+'%"></i></div><strong>'+rpS(x[1])+'</strong></div>').join('')+'</div>':'<div class="empty">Tambahkan produk di menu Pengaturan.</div>';
  const lim=addDays(today(),7);
  const fu=ol.filter(l=>l.nextDate&&l.nextDate<=lim).map(l=>['pipeline',l]).concat(ls.filter(x=>x.nextDate&&x.nextDate<=lim).map(x=>['sekolah',x])).sort((a,b)=>a[1].nextDate<b[1].nextDate?-1:1);
  const pFu=list(fu.slice(0,6).map(([k,x])=>row(k,x.id,x.nextAction||'Tindak lanjut',x.name+' · '+nameOf(x.am),pill(fmtD(x.nextDate),x.nextDate<today()?'crit':x.nextDate===today()?'warn':''))),'Tidak ada tindak lanjut terjadwal dalam 7 hari.');
  const fn=STAGES.slice(0,5).map(g=>{const it=ol.filter(l=>(l.stage||'baru')===g[0]);return[g[1],it.reduce((a,l)=>a+(+l.estMrr||0),0),it.length]}),mxf=Math.max(1,...fn.map(x=>x[1]));
  const pFun=ol.length?'<div class="bars">'+fn.map(x=>'<div class="bar"><span>'+esc(x[0])+' <small style="color:var(--ink2)">'+x[2]+' leads</small></span><div class="track"><i style="width:'+(x[1]/mxf*100)+'%"></i></div><strong>'+rpS(x[1])+'</strong></div>').join('')+'</div>':'<div class="empty">Belum ada lead terbuka.</div>';
  const sr=LSRC.map(x=>{const it=S.leads.filter(l=>l.source===x);return[x,it.length,it.filter(l=>l.stage==='menang').length]}),mxs=Math.max(1,...sr.map(x=>x[1]));
  const pSrc=S.leads.length?'<div class="bars">'+sr.map(x=>'<div class="bar"><span>'+esc(x[0])+'</span><div class="track"><i style="width:'+(x[1]/mxs*100)+'%"></i></div><strong>'+x[1]+' leads<small style="color:var(--ink2);font-weight:400"> · '+x[2]+' menang</small></strong></div>').join('')+'</div>':'<div class="empty">Belum ada lead.</div>';
  const myT=[];if(me.id)S.projects.forEach(p=>p.status!=='selesai'&&(p.milestones||[]).forEach(t=>{if(t.who===me.id&&tstat(t)!=='selesai')myT.push([p,t])}));
  const pMy=list(myT.sort((a,b)=>(a[1].due||'9')<(b[1].due||'9')?-1:1).slice(0,6).map(([p,t])=>row('project',p.id,t.title,p.name,pill(fmtD(t.due),t.due&&t.due<today()?'crit':''))),'');
  const myI=(me.id||myAm())?open.filter(i=>(me.id&&(i.am===me.id||i.assignee===me.id||i.createdBy===me.id))||(myAm()&&i.am===myAm())).sort(tsort):[];
  const pMyI=list(myI.slice(0,6).map(i=>{const g=sla(i);return row('isu',i.id,i.subject,[code('isu',i),i.status,iSch(i)].filter(Boolean).join(' · '),pill(g[0],g[1]))}),'');
  const pn=(t,link,l,b)=>'<section class="panel"><header><h2>'+t+'</h2><a href="#'+link+'">'+l+'</a></header>'+b+'</section>';
  const py=allowed('pembayaran')?paySummary():{},nm0=nowYM(),rn=[];
  ls.filter(x=>!myAm()||x.am===myAm()).forEach(x=>{const g=py[x.id];if(!g)return;const ms=Object.keys(g.months||{}).filter(isYM).sort();if(!ms.length)return;const last=ms[ms.length-1];if(last>addM(nm0,1))return;const gap=(+nm0.slice(0,4)-+last.slice(0,4))*12+(+nm0.slice(5,7)-+last.slice(5,7));rn.push([x,last,gap])});
  rn.sort((a,b)=>a[1]<b[1]?-1:a[1]>b[1]?1:0);
  const pRen=list(rn.slice(0,8).map(([x,last,gap])=>row('sekolah',x.id,x.name,'Dibayar s.d. '+mLabel(last)+' · '+nameOf(x.am),pill(gap>0?'Menunggak '+gap+' bulan':gap===0?'Habis bulan ini':'Habis bulan depan',gap>0?'crit':'warn'))),'Tidak ada langganan yang habis dalam 1 bulan.');
  const lim7=addDays(today(),7),ivs=allowed('pembayaran')?S.invoices.filter(x=>{const e=invEff(x);return e==='terlambat'||(e==='terbit'&&x.jatuhTempo&&x.jatuhTempo<=lim7)}).sort((a,b)=>String(a.jatuhTempo||'9').localeCompare(String(b.jatuhTempo||'9'))):[];
  const pInv=list(ivs.slice(0,8).map(x=>{const n=daysTo(x.jatuhTempo);return '<button class="rowi" data-act="inv-goto" data-id="'+esc(x.id)+'"><span><span class="t">'+esc(invTo(x))+'</span><small>'+esc((x.no||'Invoice')+' · '+rp(invTot(x)))+'</small></span>'+pill(n===null?'Belum bayar':n<0?'Terlambat '+(-n)+' hari':n===0?'Jatuh tempo hari ini':'Jatuh tempo '+n+' hari lagi',n!==null&&n<0?'crit':'warn')+'</button>'}),'Tidak ada invoice yang belum dibayar mendekati jatuh tempo.');
  const mus=allowed('administrasi')?S.mou.filter(x=>x.status==='aktif'&&x.berakhir&&daysTo(x.berakhir)!==null&&daysTo(x.berakhir)<=60).sort((a,b)=>String(a.berakhir).localeCompare(String(b.berakhir))):[];
  const pMou=list(mus.slice(0,8).map(x=>{const n=daysTo(x.berakhir);return '<button class="rowi" data-act="mou-goto"><span><span class="t">'+esc(mouTo(x))+'</span><small>'+esc((x.judul||'MoU')+' · berakhir '+fmtD(x.berakhir))+'</small></span>'+pill(n<0?'Sudah berakhir':n+' hari lagi',n<0?'crit':'warn')+'</button>'}),'Tidak ada MoU yang berakhir dalam 60 hari.');
  const remind=(allowed('pembayaran')?pn('Langganan hampir habis','pembayaran','Status mitra',pRen)+pn('Invoice belum dibayar','pembayaran','Invoice',pInv):'')+(allowed('administrasi')?pn('MoU segera berakhir','administrasi','Administrasi',pMou):'');
  return{title:'Ringkasan',sub:'Kondisi mitra, isu, project, dan pipeline per '+fmtD(today())+'.',
    body:tiles+'<div class="grid2" style="margin-top:14px">'+remind+pn('Kontrak segera berakhir','sekolah','Semua mitra',pExp)+pn('Isu yang perlu perhatian','isu','Semua isu',pIss)+pn('Project berjalan','project','Semua project',pPrj)+pn('MRR per produk','sekolah','Rincian',pBar)+pn('Tindak lanjut 7 hari ke depan','pipeline','Pipeline',pFu)+pn('Corong pipeline','pipeline','Pipeline',pFun)+pn('Leads per sumber','pipeline','Pipeline',pSrc)+(myT.length?pn('Tugas saya','project','Semua project',pMy):'')+(myI.length?pn('Tiket saya','isu','Semua tiket',pMyI):'')+'</div>'};
},
isu(){
  const f=S.f.isu,hd=canHandle(),tk=S.drawer&&S.drawer[0]==='isu'?S.issues.find(i=>i.id===S.drawer[1]):null;
  if(tk)return ticketPage(tk);
  const act0=S.issues.filter(i=>i.status!=='Closed'),n0=act0.length,nA=act0.filter(isMine).length,nR=S.issues.filter(isReporter).length;
  const tabs=hd?[['beranda','Beranda'],['board','Semua Tiket <small>'+n0+'</small>'],['tugas','Ditugaskan ke Saya <small>'+nA+'</small>']].concat(nR?[['saya','Tiket Saya']]:[],[['analitik','Analitik']]):[['beranda','Beranda'],['saya','Tiket Saya'],['board','Board Tiket'],['analitik','Analitik']];
  const tabBar='<span class="seg" role="group" aria-label="Bagian menu Isu">'+tabs.map(t=>'<button data-act="itab" data-t="'+t[0]+'" aria-pressed="'+(f.tab===t[0])+'">'+t[1]+'</button>').join('')+'</span>';
  const action=canNew()?'<button class="btn primary" data-act="new" data-k="isu">Ajukan Keluhan</button>':'';
  const all=S.issues,mine=all.filter(isReporter),card=(t,right,b)=>'<section class="panel"><header><h2>'+t+'</h2>'+(right||'')+'</header>'+b+'</section>';
  const stat=(t,v,n,tab,st)=>'<button class="tile" data-act="itab" data-t="'+tab+'" data-s="'+(st||'')+'"><span>'+t+'</span><strong>'+v+'</strong><em>'+n+'</em></button>';
  const cnt=(a,st)=>a.filter(i=>i.status===st).length;
  const slaRules=()=>card('Aturan SLA','','<p style="margin:0 0 8px;color:var(--ink2)">Target penyelesaian tiket menurut prioritas.</p>'+dl(Object.keys(SLA_MIN).map(k=>[k,Math.round(SLA_MIN[k]/60)+' jam']))
    +'<hr class="hair"><ul class="rules"><li>Waktu dihitung sejak tiket dibuat, termasuk akhir pekan.</li><li>Prioritas ditentukan otomatis dari judul dan deskripsi. Programmer bisa mengoreksinya dan tenggat dihitung ulang.</li><li>Alur status: Open, In Progress, Waiting Validation, Closed.</li><li>Jam SLA berhenti saat tiket Waiting Validation dan berjalan lagi jika pelapor menolak solusi.</li><li>Tiket yang melewati batas ditandai merah sebagai terlambat.</li><li>Pelapor bisa membuka kembali tiket dalam '+REOPEN_DAYS+' hari setelah ditutup.</li></ul>'
    +'<hr class="hair"><p style="margin:0;color:var(--ink2)"><b>Programmer:</b> ambil tiket, catat tindakan, lalu kirim solusi. <b>AM dan CS:</b> lengkapi keterangan dan lampiran, lalu validasi solusi.</p>');
  const recent=a=>a.slice().sort((x,y)=>String(y.createdAt).localeCompare(String(x.createdAt))).slice(0,5);
  const plist=a=>a.length?'<div class="rows">'+a.map(i=>'<button class="rowi" data-open="isu:'+esc(i.id)+'"><span><span class="t">'+esc(i.subject)+'</span><small><span class="code-ref">'+esc(code('isu',i))+'</span> · '+esc(i.category)+' · '+esc(relTime(i.createdAt))+'</small></span><span class="inline" style="justify-content:flex-end">'+spill(i)+upill(i)+'</span></button>').join('')+'</div>':'<div class="empty">Belum ada tiket. Ajukan keluhan pertama Anda dan tim akan merespons sesuai SLA.</div>';
  if(f.tab==='beranda'){
    const nv=mine.filter(i=>i.status==='Waiting Validation');
    let body=nv.length?'<div class="notice"><div><strong>'+nv.length+' tiket menunggu validasi Anda</strong><span>Programmer sudah menyelesaikan penanganan. Konfirmasi apakah masalah Anda sudah selesai.</span></div><button class="btn small" data-open="isu:'+esc(nv[0].id)+'">Tinjau sekarang</button></div>':'';
    if(hd){
      const act=all.filter(i=>i.status!=='Closed'),br=act.filter(overdue),closed=all.filter(i=>i.status==='Closed'),met=closed.filter(i=>!i.slaBreached).length,rate=closed.length?Math.round(met/closed.length*100):0,sc=closed.filter(i=>i.csat&&i.csat.score),my=act.filter(isMine);
      const cs=sc.length?sc.reduce((a,i)=>a+i.csat.score,0)/sc.length:null,queue=act.slice().sort(tsort).slice(0,8);
      body+=(br.length?'<div class="notice crit"><div><strong>'+br.length+' tiket melewati target SLA</strong><span>Prioritas tertinggi. Tangani sebelum pelapor menghubungi ulang.</span></div><button class="btn small" data-act="itab" data-t="board">Lihat tiket</button></div>':'')
        +'<div class="tiles">'+stat('Tiket Baru',cnt(all,'Open'),'Belum diambil programmer','board','Open')+stat('Sedang Diproses',cnt(all,'In Progress'),'Ditangani programmer','board','In Progress')+stat('Menunggu Pelapor',cnt(all,'Waiting Validation'),'Validasi solusi','board','Waiting Validation')+stat('Ditugaskan ke Saya',my.length,my.length?'Perlu Anda tangani':'Tidak ada beban aktif','tugas','')+'</div>'
        +'<div class="split" style="margin-top:16px">'+card('Antrian prioritas','<a href="#isu" data-act="itab" data-t="board">Lihat board</a>',queue.length?'<div style="overflow-x:auto"><table style="min-width:560px"><thead><tr><th>Kode</th><th>Subjek</th><th>Prioritas</th><th>Status</th><th>Batas SLA</th></tr></thead><tbody>'
            +queue.map(i=>{const g=slaOf(i);return '<tr data-open="isu:'+esc(i.id)+'"><td><span class="code-ref">'+esc(code('isu',i))+'</span></td><td><strong>'+esc(i.subject)+'</strong><span class="sub">'+esc(i.category)+'</span></td><td>'+upill(i)+'</td><td>'+spill(i)+'</td><td><span class="'+(g.breached?'err':'')+'" style="font-size:12.5px">'+esc(g.label)+'</span></td></tr>'}).join('')+'</tbody></table></div>':'<div class="empty">Tidak ada tiket aktif. Antrian bersih.</div>')
        +'<div class="side">'+card('Kesehatan SLA','','<div class="gauge"><svg viewBox="0 0 260 142" aria-hidden="true"><path class="trk" d="M32 120a98 98 0 0 1 196 0" pathLength="100"/>'+(rate?'<path class="sg" d="M32 120a98 98 0 0 1 196 0" pathLength="100" stroke-dasharray="'+rate+' '+(100-rate)+'"/>':'')+'</svg><p><b>'+rate+'%</b><span>Tiket tertutup tepat waktu</span></p></div><p style="margin:10px 0 0;text-align:center;font-size:12.5px;color:var(--ink2)">Tepat waktu '+met+' · Terlampaui '+(closed.length-met)+'</p>')
          +card('Kepuasan pelapor','',cs==null?'<p style="margin:0;color:var(--ink2)">Belum ada survei yang diisi.</p>':'<p style="margin:0;font-size:32px;font-weight:600">'+cs.toFixed(1).replace('.',',')+'<span style="font-size:16px;color:var(--ink2)">/5</span></p>'+stars(Math.round(cs))+'<p style="margin:6px 0 0;color:var(--ink2)">Dari '+sc.length+' survei terisi.</p>')
          +card('Tiket terbaru','',recent(all).length?'<div class="rows">'+recent(all).map(i=>'<button class="rowi" data-open="isu:'+esc(i.id)+'"><span><span class="t">'+esc(i.subject)+'</span><small>'+esc(relTime(i.createdAt))+'</small></span>'+spill(i)+'</button>').join('')+'</div>':'<div class="empty">Belum ada tiket.</div>')+slaRules()+'</div></div>';
      return{title:'Selamat datang, '+greet(),sub:'Antrian keluhan dan kesehatan SLA tim hari ini.',action,bar:tabBar,body};
    }
    body+='<div class="tiles">'+stat('Menunggu Validasi',cnt(mine,'Waiting Validation'),'Perlu konfirmasi Anda','saya','Waiting Validation')+stat('Sedang Diproses',cnt(mine,'In Progress'),'Ditangani programmer','saya','In Progress')+stat('Tiket Baru',cnt(mine,'Open'),'Belum diambil programmer','saya','Open')+stat('Selesai',cnt(mine,'Closed'),'Tiket tertutup','saya','Closed')+'</div>'
      +'<div class="split" style="margin-top:16px">'+card('Tiket terbaru','<a href="#isu" data-act="itab" data-t="saya">Lihat semua</a>',plist(recent(mine)))
      +'<div class="side">'+slaRules()+'</div></div>';
    return{title:'Halo, '+greet(),sub:'Semua keluhan Anda, beserta target penyelesaiannya.',action,bar:tabBar,body};
  }
  if(f.tab==='analitik'){
    const t30=Date.now()-30*864e5,rec=all.filter(i=>new Date(i.createdAt).getTime()>=t30),closed=all.filter(i=>i.status==='Closed'),c30=closed.filter(i=>i.closedAt&&new Date(i.closedAt).getTime()>=t30),sc=closed.filter(i=>i.csat&&i.csat.score);
    const daysA=[];for(let k=13;k>=0;k--){const d=addDays(today(),-k);daysA.push([d,all.filter(i=>iso(new Date(i.createdAt))===d).length])}
    const mx=Math.max(1,...daysA.map(x=>x[1]));
    const body='<div class="tiles"><div class="tile"><span>Tiket masuk 30 hari</span><strong>'+rec.length+'</strong><em>'+all.filter(i=>i.status!=='Closed').length+' masih aktif</em></div><div class="tile"><span>Ditutup 30 hari</span><strong>'+c30.length+'</strong><em>dari '+closed.length+' tiket tertutup</em></div><div class="tile"><span>Tepat waktu SLA</span><strong>'+(closed.length?Math.round(closed.filter(i=>!i.slaBreached).length/closed.length*100)+'%':'—')+'</strong><em>dari tiket tertutup</em></div><div class="tile"><span>CSAT rata-rata</span><strong>'+(sc.length?(sc.reduce((a,i)=>a+i.csat.score,0)/sc.length).toFixed(1).replace('.',',')+' / 5':'—')+'</strong><em>'+sc.length+' survei terisi</em></div></div>'
      +'<div class="grid2" style="margin-top:16px">'+card('Tiket masuk 14 hari terakhir','','<div class="colchart" role="img" aria-label="Jumlah tiket masuk per hari">'+daysA.map(x=>'<div title="'+esc(fmtD(x[0])+': '+x[1]+' tiket')+'"><span>'+(x[1]||'')+'</span><i style="height:'+(x[1]/mx*80)+'%"></i><span>'+(+x[0].slice(8))+'</span></div>').join('')+'</div>')
      +card('Komposisi prioritas (30 hari)','',barsOf(Object.keys(URG).map(k=>[k,rec.filter(i=>i.urgency===k).length])))
      +card('Per kategori (30 hari)','',barsOf(TCAT.map(k=>[k,rec.filter(i=>i.category===k).length]).filter(x=>x[1]).concat(rec.length?[]:[['Belum ada tiket',0]])))
      +card('Beban aktif per programmer','',barsOf([['Belum ditugaskan',all.filter(i=>i.status!=='Closed'&&!i.assignee).length]].concat([...new Set(all.filter(i=>i.status!=='Closed'&&i.assignee).map(i=>i.assignee))].map(u=>[nameOf(u),all.filter(i=>i.status!=='Closed'&&i.assignee===u).length]))))+'</div>';
    return{title:'Analitik Tiket',sub:'Volume, komposisi prioritas, kepatuhan SLA, dan kepuasan pelapor.',action,bar:tabBar,body};
  }
  const mineOnly=f.tab==='saya',asgOnly=hd&&f.tab==='tugas',q=f.q.toLowerCase(),base=mineOnly?mine:asgOnly?all.filter(isMine):all;
  const rows=base.filter(i=>(!f.st||i.status===f.st)&&(!f.prio||i.urgency===f.prio)&&(mineOnly||asgOnly||!f.who||(f.who==='none'?!i.assignee:i.assignee===f.who||i.am===f.who))&&(!q||(code('isu',i)+' '+i.subject+' '+iSch(i)).toLowerCase().includes(q))).sort(tsort);
  const progs=progList();
  const bar=tabBar+'<span style="flex-basis:100%"></span><input type="search" data-f="isu.q" placeholder="Cari kode, subjek, atau sekolah" aria-label="Cari tiket" value="'+esc(f.q)+'">'
    +'<span class="seg" role="group" aria-label="Status">'+[['','Semua']].concat(Object.keys(TST).map(k=>[k,k])).map(c=>'<button data-act="ist" data-s="'+c[0]+'" aria-pressed="'+(f.st===c[0])+'">'+c[1]+' <small>'+base.filter(i=>!c[0]||i.status===c[0]).length+'</small></button>').join('')+'</span>'
    +'<select data-f="isu.prio" aria-label="Prioritas">'+opt('','Semua prioritas',f.prio)+Object.keys(URG).map(k=>opt(k,k,f.prio)).join('')+'</select>'
    +(mineOnly||asgOnly?'':'<select data-f="isu.who" aria-label="Programmer">'+opt('','Semua programmer',f.who)+opt('none','Belum ditugaskan',f.who)+progs.map(u=>opt(u,nameOf(u),f.who)).join('')+'</select>')+csvBtn();
  const to=i=>i.assignee?nameOf(i.assignee):'Belum ditugaskan';
  S.csv=rows.length?{view:'tiket',rows,cols:[{l:'Kode',v:i=>code('isu',i)},{l:'Subjek',v:i=>i.subject},{l:'Kategori',v:i=>i.category},{l:'Prioritas',v:i=>i.urgency},{l:'Status',v:i=>i.status},{l:'Pelapor',v:repName},{l:'Ditujukan ke',v:to},{l:'Mitra sekolah',v:iSch},{l:'AM',v:i=>i.am?nameOf(i.am):''},{l:'Dibuat',v:i=>i.createdAt},{l:'Batas SLA',v:i=>i.slaDeadline},{l:'SLA',v:i=>sla(i)[0]},{l:'Ditutup',v:i=>i.closedAt||''},{l:'CSAT',v:i=>i.csat&&i.csat.score||''}]}:null;
  const body=rows.length?'<div class="stack">'+rows.map(i=>{const n=(i.messages||[]).filter(l=>l.kind!=='system'&&(l.kind!=='note'||hd)).length;
      return '<section class="panel"><div class="dhead2"><div style="flex:1;min-width:240px"><div class="inline"><span class="code-ref">'+esc(code('isu',i))+'</span>'+spill(i)+upill(i)+'</div><button class="ttitle" data-open="isu:'+esc(i.id)+'">'+esc(i.subject)+'</button><div class="tmeta"><span>'+esc(repName(i))+'</span>'+(asgTxt(i)?'<span>'+esc(asgTxt(i))+'</span>':'')+'<span>Dibuat '+esc(relTime(i.createdAt))+'</span><span>'+n+' pesan</span>'+(iSch(i)?'<span>'+esc(iSch(i))+'</span>':'')+(overdue(i)?'<span class="bad">Lewat target '+Math.round(SLA_MIN[i.urgency]/60)+' jam</span>':'')+'</div></div>'+slaMeter(i)+'</div>'
        +(hd&&!isMine(i)?'':'<div class="inline" style="margin-top:12px"><button class="btn small'+(hd?' primary':'')+'" data-open="isu:'+esc(i.id)+'">'+(hd?'Tangani tiket':'Lihat tiket')+'</button></div>')+'</section>'}).join('')+'</div>'
    :'<div class="panel empty">'+(base.length?'Tidak ada tiket yang cocok.':asgOnly?'Belum ada tiket yang ditugaskan ke Anda. Tiket yang ditujukan kepada Anda atau Anda ambil dari antrean akan muncul di sini.':mineOnly?'Belum ada tiket. Ajukan keluhan pertama Anda dan tim akan merespons sesuai SLA.':'Belum ada tiket.')+'</div>';
  return{title:asgOnly?'Ditugaskan ke Saya':mineOnly?'Tiket Saya':hd?'Semua Tiket':'Board Tiket',sub:asgOnly?'Tiket yang menjadi tanggung jawab Anda, diurutkan dari yang lewat SLA.':mineOnly?'Keluhan yang Anda ajukan dan statusnya.':'Semua tiket, diurutkan dari yang lewat SLA lalu batas waktu terdekat.',action,bar,body};
},
project(){
  const f=S.f.project,q=f.q.toLowerCase(),board=f.mode==='papan';
  const rows=S.projects.filter(p=>(board||(f.status==='aktif'?p.status!=='selesai':!f.status||p.status===f.status))&&matchWho(p.pm,f.who)&&(!f.type||p.type===f.type)&&(!f.asg||asg(p)===f.asg)&&(!q||(p.name+' '+asg(p)).toLowerCase().includes(q))).sort((a,b)=>(a.end||'9')<(b.end||'9')?-1:1);
  const bar='<input type="search" data-f="project.q" placeholder="Cari project atau pelaksana" aria-label="Cari project" value="'+esc(f.q)+'">'
    +(board?'':'<select data-f="project.status" aria-label="Status">'+opt('aktif','Belum selesai',f.status)+opt('','Semua status',f.status)+Object.entries(PSTAT).map(([k,v])=>opt(k,v,f.status)).join('')+'</select>')
    +'<select data-f="project.type" aria-label="Jenis project">'+opt('','Semua jenis',f.type)+PTYPE.map(t=>opt(t,t,f.type)).join('')+'</select>'+'<select data-f="project.asg" aria-label="Pelaksana">'+opt('','Semua pelaksana',f.asg)+S.people.map(n=>opt(n,n,f.asg)).join('')+'</select>'+whoSel('project',f.who,'PM')
    +seg('project',[['daftar','Daftar'],['papan','Papan'],['timeline','Timeline'],['kalender','Kalender']],f.mode)+csvBtn();
  const act=rows.filter(p=>p.status!=='selesai'),hs=act.map(pHealth),cnt=c=>hs.filter(h=>h[1]===c).length;
  const sum='<p style="margin:0 0 10px;color:var(--ink2)">'+act.length+' project belum selesai · '+cnt('crit')+' terlambat · '+cnt('warn')+' perlu perhatian</p>';
  const pr=p=>{const x=PRIO[p.priority]||PRIO.sedang;return pill(x[0],x[1])};
  const bars=g=>'<div class="prog"><div class="track"><i style="width:'+g+'%"></i></div><span>'+g+'%</span></div>';
  const cols=[{l:'No.',v:p=>code('project',p)},{l:'Project',v:p=>p.name,h:p=>'<strong>'+esc(p.name)+'</strong>'+(pSch(p)?'<span class="sub">'+esc(pSch(p))+'</span>':'')},{l:'Jenis',v:p=>p.type||'',h:p=>p.type?pill(p.type):'—'},
    {l:'Prioritas',v:p=>(PRIO[p.priority]||PRIO.sedang)[2],c:p=>(PRIO[p.priority]||PRIO.sedang)[0],h:pr},{l:'PM',v:p=>nameOf(p.pm)},{l:'Ditugaskan kepada',v:p=>asg(p),h:p=>esc(asg(p)||'—')},{l:'Mulai',v:p=>p.start||'',csvOnly:1},{l:'Durasi (hari)',v:p=>dur(p)==null?'':dur(p),csvOnly:1},
    {l:'Deadline',v:p=>p.end||'',h:p=>fmtD(p.end)+'<span class="sub">mulai '+fmtD(p.start)+(dur(p)!=null?' · '+dur(p)+' hari':'')+'</span>'},
    {l:'Progres (%)',v:p=>pProg(p),h:p=>{const m=p.milestones||[],tl=p.status!=='selesai'?tLate(p):0;return bars(pProg(p))+'<span class="sub">'+m.filter(x=>tstat(x)==='selesai').length+' dari '+m.length+' tugas'+(tl?' · <span class="err">'+tl+' lewat tenggat</span>':'')+'</span>'}},
    {l:'Kondisi',v:p=>pHealth(p)[0],h:p=>{const h=pHealth(p);return pill(h[0],h[1])}}];
  S.csv=rows.length?{view:'project',cols,rows}:null;
  let body;
  if(!rows.length)body='<div class="panel empty">'+(S.projects.length?'Tidak ada project yang cocok dengan filter ini.':'Belum ada project. Tambahkan lewat tombol Project baru.')+'</div>';
  else if(board)body=sum+'<div class="board">'+Object.entries(PSTAT).map(([k,l])=>{const it=rows.filter(p=>(p.status||'perencanaan')===k);return '<section class="col" data-pstat="'+k+'"><header><span>'+l+' <small>'+it.length+'</small></span></header>'
    +(it.map(p=>{const h=pHealth(p),m=p.milestones||[];return '<div class="card" role="button" tabindex="0" data-drag="proj:'+esc(p.id)+'" data-open="project:'+esc(p.id)+'"><strong>'+esc(p.name)+'</strong><small>'+esc(p.type||'')+'</small>'+bars(pProg(p))+'<small>'+m.filter(x=>tstat(x)==='selesai').length+' dari '+m.length+' tugas · selesai '+fmtD(p.end)+'</small><span>'+pill(h[0],h[1])+' '+pr(p)+'</span><small>PM: '+esc(nameOf(p.pm))+'</small>'+(asg(p)?'<small>Pelaksana: '+esc(asg(p))+'</small>':'')+'</div>'}).join('')||'<small style="color:var(--ink2)">Kosong</small>')+'</section>'}).join('')+'</div>';
  else if(f.mode==='kalender'){
    const t=today(),ym=f.cal||t.slice(0,7),y=+ym.slice(0,4),mo=+ym.slice(5,7),first=new Date(y,mo-1,1),dim=new Date(y,mo,0).getDate(),lead=(first.getDay()+6)%7,ev={};
    const add=(d,o)=>{if(d&&String(d).slice(0,7)===ym)(ev[d]=ev[d]||[]).push(o)};
    rows.forEach(p=>{const h=pHealth(p);add(p.end,{p,c:p.status==='selesai'?'good':h[1]})});
    let cells='';for(let i=0;i<lead;i++)cells+='<div class="cday off"></div>';
    for(let dd=1;dd<=dim;dd++){const ds=ym+'-'+pad(dd),e=ev[ds]||[];cells+='<div class="cday'+(ds===t?' now':'')+'"><span class="cnum">'+dd+'</span>'+e.map(o=>'<button class="card ccard '+o.c+'" data-open="project:'+esc(o.p.id)+'"><strong>'+esc(o.p.name)+'</strong><small>Deadline '+fmtD(o.p.end)+'</small>'+(asg(o.p)?'<small>'+esc(asg(o.p))+'</small>':'')+'</button>').join('')+'</div>'}
    for(let i=(lead+dim)%7;i>0&&i<7;i++)cells+='<div class="cday off"></div>';
    const n=Object.values(ev).reduce((a,b)=>a+b.length,0);
    body=sum+'<div class="calhead"><div class="inline"><button class="btn small" data-act="cal" data-d="-1">Bulan sebelumnya</button><button class="btn small" data-act="cal" data-d="0">Bulan ini</button><button class="btn small" data-act="cal" data-d="1">Bulan berikutnya</button></div><h2>'+esc(first.toLocaleDateString('id-ID',{month:'long',year:'numeric'}))+'</h2><small>'+n+' deadline project</small></div>'
      +'<div class="calwrap"><div class="cal">'+['Sen','Sel','Rab','Kam','Jum','Sab','Min'].map(x=>'<div class="cdow">'+x+'</div>').join('')+cells+'</div></div>'
      +'<p style="margin:8px 0 0;color:var(--ink2);font-size:12px">Setiap kartu berada di tanggal deadline project. Garis merah berarti terlambat, kuning perlu perhatian atau tertahan, hijau lancar atau selesai. Klik kartu untuk membuka project.</p>';
  }
  else if(f.mode==='timeline'){
    const dated=rows.filter(p=>p.start&&p.end&&p.end>=p.start),t=today();
    if(!dated.length)body='<div class="panel empty">Timeline butuh tanggal mulai dan target selesai. Lengkapi tanggal pada project.</div>';
    else{
      const start=dated.reduce((m,p)=>p.start<m?p.start:m,t),end=dated.reduce((m,p)=>p.end>m?p.end:m,t);
      const span=Math.max(1,days(start,end)+1);
      const unit=span<=140?'day':span<=730?'week':'month';
      const unitLabel=unit==='day'?'harian':unit==='week'?'mingguan':'bulanan';
      const dw=unit==='day'?30:unit==='week'?42:58;
      let s0=start;
      if(unit==='week'){const wd=(new Date(start+'T00:00:00').getDay()+6)%7;s0=addDays(start,-wd)}
      if(unit==='month')s0=start.slice(0,8)+'01';
      const cells=[];
      if(unit==='day'){for(let d=s0;d<=end;d=addDays(d,1))cells.push(d)}
      else if(unit==='week'){for(let d=s0;d<=end;d=addDays(d,7))cells.push(d)}
      else{for(let d=new Date(s0+'T00:00:00');iso(d)<=end;d=new Date(d.getFullYear(),d.getMonth()+1,1))cells.push(iso(d))}
      const idx=d=>{
        if(unit==='day')return days(s0,d);
        if(unit==='week')return Math.floor(days(s0,d)/7);
        const x=new Date(d+'T00:00:00');
        return (x.getFullYear()-(+s0.slice(0,4)))*12+(x.getMonth()-(+s0.slice(5,7)-1));
      };
      const W=cells.length*dw;
      const head=cells.map(d=>{
        if(unit==='day'){
          const x=new Date(d+'T00:00:00'),wk=x.getDay(),we=wk===0||wk===6;
          return '<div class="tl__cell'+(we?' is-weekend':'')+(d===t?' is-today':'')+'"><b>'+x.getDate()+'</b><small>'+(x.getDate()===1?BLN[x.getMonth()]:['Min','Sen','Sel','Rab','Kam','Jum','Sab'][wk])+'</small></div>';
        }
        if(unit==='week'){
          const x=new Date(d+'T00:00:00');
          return '<div class="tl__cell'+(d<=t&&addDays(d,6)>=t?' is-today':'')+'"><b>'+x.getDate()+'</b><small>'+BLN[x.getMonth()]+'</small></div>';
        }
        return '<div class="tl__cell'+(d.slice(0,7)===t.slice(0,7)?' is-today':'')+'"><b>'+BLN[+d.slice(5,7)-1]+'</b><small>'+d.slice(2,4)+'</small></div>';
      }).join('');
      const cols=cells.map(d=>{
        if(unit==='day'){const x=new Date(d+'T00:00:00'),wk=x.getDay();return '<div class="tl__col'+(wk===0||wk===6?' is-weekend':'')+(d===t?' is-today':'')+'"></div>'}
        if(unit==='week')return '<div class="tl__col'+(d<=t&&addDays(d,6)>=t?' is-today':'')+'"></div>';
        return '<div class="tl__col'+(d.slice(0,7)===t.slice(0,7)?' is-today':'')+'"></div>';
      }).join('');
      const nowIdx=t>=s0&&t<=end?idx(t):-1,nowLeft=nowIdx>=0?nowIdx*dw+(unit==='day'?dw/2:0):null;
      const rowsH=dated.slice().sort((a,b)=>a.start<b.start?-1:1).map(p=>{
        const h=pHealth(p),prog=pProg(p),l=Math.max(0,idx(p.start))*dw+2,w=Math.max(dw*0.6,(idx(p.end)-idx(p.start)+1)*dw-4);
        return '<div class="tl__row" role="button" tabindex="0" data-open="project:'+esc(p.id)+'">'
          +'<div class="tl__lab"><strong>'+esc(p.name)+'</strong><small>'+esc([pSch(p),asg(p),h[0]].filter(Boolean).join(' · '))+'</small></div>'
          +'<div class="tl__lane"><span class="tl__bar '+h[1]+'" style="left:'+l+'px;width:'+w+'px" title="'+esc(fmtD(p.start)+' s.d. '+fmtD(p.end)+' · '+prog+'%')+'"><i style="width:'+prog+'%"></i><b>'+prog+'%</b></span></div>'
          +'</div>';
      }).join('');
      body=sum
        +'<div class="tl"><div class="tl__scroll" tabindex="0" role="region" aria-label="Timeline project"><div class="tl__inner" style="--tl-left:clamp(170px,22vw,260px);--tl-w:'+W+'px;--tl-dw:'+dw+'px">'
        +'<div class="tl__head"><div class="tl__corner"><span>Project</span><small>'+dated.length+' item · '+unitLabel+'</small></div><div class="tl__cells">'+head+'</div></div>'
        +'<div class="tl__body"><div class="tl__cols">'+cols+'</div>'+rowsH+(nowLeft!=null?'<span class="tl__now" style="left:calc(var(--tl-left) + '+nowLeft+'px)" title="Hari ini"><b></b></span>':'')+'</div>'
        +'</div></div></div>'
        +'<p class="tl__hint">Batang menunjukkan rentang tanggal project, bagian gelap menunjukkan progres tugas. Garis merah menandai hari ini.'+(dated.length<rows.length?' '+(rows.length-dated.length)+' project tanpa tanggal tidak ditampilkan.':'')+'</p>';
    }
  }else body=sum+tbl('project',cols,rows,'project',p=>{const h=pHealth(p);return h[1]==='crit'?'s-crit':h[1]==='warn'?'s-warn':''});
  return{title:'Project',sub:'Pantau lewat daftar, papan status, atau timeline. Progres dihitung dari tugas yang selesai.',action:addBtn('project','Project baru'),bar,body};
},
sekolah(){
  const f=S.f.sekolah,q=f.q.toLowerCase();
  const rows=S.schools.filter(x=>(!f.status||x.status===f.status)&&matchWho(x.am,f.who)&&(!q||(x.name+' '+(x.city||'')+' '+code('sekolah',x)).toLowerCase().includes(q))).sort((a,b)=>String(a.name).localeCompare(String(b.name)));
  const lv=rows.filter(live),tot=lv.reduce((a,x)=>a+sMrr(x),0),ren=lv.filter(x=>{const c=contract(x);return c[2]!=null&&c[2]<=60}).length;
  const bar='<input type="search" data-f="sekolah.q" placeholder="Cari nama sekolah atau kota" aria-label="Cari sekolah" value="'+esc(f.q)+'"><select data-f="sekolah.status" aria-label="Status">'+opt('','Semua status',f.status)+Object.entries(SSTAT).map(([k,v])=>opt(k,v[0],f.status)).join('')+'</select>'+whoSel('sekolah',f.who,'AM')+csvBtn();
  const St=x=>SSTAT[x.status]||SSTAT.aktif;
  const cols=[{l:'Sekolah',v:x=>x.name,h:x=>'<strong>'+esc(x.name)+'</strong><span class="sub">'+esc([x.jenjang,x.city].filter(Boolean).join(' · '))+'</span>'},{l:'Jenjang',v:x=>x.jenjang||'',csvOnly:1},{l:'Kota',v:x=>x.city||'',csvOnly:1},
    {l:'Status',v:x=>St(x)[0],h:x=>pill(St(x)[0],St(x)[1])},{l:'Produk',v:x=>(x.products||[]).map(p=>prodName(p.productId)).join(', '),h:x=>(x.products||[]).map(p=>'<span class="chip">'+esc(prodName(p.productId))+'</span>').join('')||'—'},
    {l:'Siswa',num:1,v:x=>+x.students||0,h:x=>x.students?(+x.students).toLocaleString('id-ID'):'—'},{l:'MRR (Rp)',num:1,v:x=>sMrr(x),h:x=>rp(sMrr(x))},
    {l:'Kontrak berakhir',v:x=>x.contractEnd||'',h:x=>{const c=contract(x);return pill(c[0],c[1])+'<span class="sub">'+(x.contractEnd?'s.d. '+fmtD(x.contractEnd):'')+'</span>'}},{l:'AM',v:x=>nameOf(x.am),h:x=>can('sekolah')?'<select data-qam="'+esc(x.id)+'" aria-label="AM '+esc(x.name)+'" style="min-width:110px">'+opt('','Belum ada',x.am||'')+amList().map(u=>opt(u,nameOf(u),x.am||'')).join('')+(x.am&&!amList().includes(x.am)?opt(x.am,nameOf(x.am),x.am):'')+'</select>':esc(nameOf(x.am))},
    {l:'Aktivitas terakhir',v:x=>lastAct(x)||'',h:x=>fmtD(lastAct(x))+(x.nextDate?'<span class="sub'+(x.nextDate<today()?' err':'')+'">Berikutnya '+fmtD(x.nextDate)+'</span>':'')},{l:'Tindak lanjut berikutnya',v:x=>x.nextAction||'',csvOnly:1}];
  if(!rows.length)S.csv=null;
  const body=rows.length?sumLine([rows.length+' sekolah','MRR '+rp(tot),'ARR '+rp(tot*12),ren+' kontrak berakhir dalam 60 hari',lv.filter(x=>x.status==='berisiko').length+' berisiko'])
    +tbl('sekolah',cols,rows,'sekolah',x=>{const c=contract(x);return live(x)&&c[1]==='crit'?'s-crit':live(x)&&(c[1]==='warn'||x.status==='berisiko')?'s-warn':''})
    :'<div class="panel empty">'+(S.schools.length?'Tidak ada sekolah yang cocok dengan filter ini.':'Belum ada mitra sekolah. Tambahkan lewat tombol Sekolah baru, atau ubah lead yang menang menjadi mitra.')+'</div>';
  return{title:'Mitra Sekolah',sub:'Profil akun: produk, kontrak, MRR, kontak, dan riwayat aktivitas tiap sekolah.',action:addBtn('sekolah','Sekolah baru'),bar,body};
},
branding(){
  const f=S.f.brand,ed=can('branding'),F=S.brandForm,q=f.q.trim().toLowerCase();S.csv=null;
  const act=ed?'<button class="btn primary" data-act="br-new">Asset baru</button>':'';
  let formH='';
  if(ed&&F){formH='<section class="panel"><header><h2>'+(F.id?'Ubah asset':'Asset baru')+'</h2></header><div class="fields"><div class="fld wide"><label for="bf-judul">Nama asset</label><input type="text" id="bf-judul" data-bf="judul" value="'+esc(F.judul)+'" autocomplete="off" placeholder="mis. Logo Qrion versi putih"></div><div class="fld"><label for="bf-kat">Kategori</label><select id="bf-kat" data-bf="kategori">'+BR_KAT.map(x=>opt(x,x,F.kategori)).join('')+'</select></div><div class="fld"><label for="bf-prod">Produk (opsional)</label><select id="bf-prod" data-bf="produk">'+opt('','Umum, semua produk',F.produk)+S.products.map(x=>opt(x.name,x.name,F.produk)).join('')+'</select></div></div>'
    +'<div class="fld"><label for="bf-desk">Keterangan</label><textarea id="bf-desk" data-bf="deskripsi" rows="2" placeholder="Kegunaan, ukuran, atau ketentuan pemakaian">'+esc(F.deskripsi)+'</textarea></div>'
    +'<div class="fld"><label for="bf-link">Tautan desain (Canva, Google Drive, dan sejenisnya)</label><input type="url" id="bf-link" data-bf="tautan" value="'+esc(F.tautan)+'" placeholder="https://" autocomplete="off"></div>'
    +(S.assets?attPicker('brand'):'<p style="margin:0;color:var(--ink2);font-size:13px">Unggah file belum tersedia di tampilan ini. Gunakan tautan.</p>')
    +'<p style="margin:0;color:var(--ink2);font-size:13px">File yang bisa diunggah: foto, video, PDF, CSV, dan teks (maksimal 20 MB). Untuk file Word, PowerPoint, Photoshop, atau Illustrator, simpan dulu sebagai PDF atau gambar, atau tempel tautannya.</p><div class="err" id="bf-err" hidden></div><div class="inline"><button class="btn primary" data-act="br-save">'+(F.id?'Simpan perubahan':'Simpan asset')+'</button><button class="btn" data-act="br-cancel">Batal</button></div></section>'}
  const all=S.brand,cnt=k=>all.filter(x=>x.kategori===k).length;
  const rows=all.filter(x=>(!f.kat||x.kategori===f.kat)&&(!q||[x.judul,x.deskripsi,x.produk,x.kategori].some(v=>String(v||'').toLowerCase().indexOf(q)>=0))).sort((a,b)=>String(b.diubah||b.dibuat||'').localeCompare(String(a.diubah||a.dibuat||'')));
  const bar='<input type="search" data-f="brand.q" placeholder="Cari asset" aria-label="Cari asset" value="'+esc(f.q)+'"><select data-f="brand.kat" aria-label="Kategori">'+opt('','Semua kategori ('+all.length+')',f.kat)+BR_KAT.map(k=>opt(k,k+' ('+cnt(k)+')',f.kat)).join('')+'</select>';
  const card=x=>{const fl=Array.isArray(x.files)?x.files:[],im=fl.find(isImg),first=fl[0];
    const th=im?'<img src="'+esc(safeU(im.url))+'" alt="'+esc(x.judul||'')+'" loading="lazy">':first?esc(fileKind(first)==='video'?'VIDEO':fileKind(first)):(x.tautan?'TAUTAN':'—');
    return '<article class="bcard"><div class="bthumb">'+th+'</div><div class="bbody"><h2 class="bh">'+esc(x.judul||'Tanpa nama')+'</h2><div>'+pill(x.kategori||'Lainnya','info')+(x.produk?' '+pill(x.produk,''):'')+'</div>'+(x.deskripsi?'<span class="sub">'+esc(x.deskripsi)+'</span>':'')
      +'<div class="bfiles">'+fl.map(y=>'<a href="'+esc(safeU(y.url))+'" target="_blank" rel="noopener">'+esc(y.name)+'</a>').join('')+(/^https?:\/\//i.test(x.tautan||'')?'<a href="'+esc(x.tautan)+'" target="_blank" rel="noopener">Buka tautan desain</a>':'')+'</div>'
      +(ed?'<div class="inline" style="margin-top:auto;padding-top:6px"><button class="btn small" data-act="br-edit" data-id="'+esc(x.id)+'">Ubah</button><button class="btn small danger" data-act="br-del" data-id="'+esc(x.id)+'" data-confirm="Yakin hapus?">Hapus</button></div>':'')+'</div></article>'};
  const body=formH+(rows.length?'<div class="bgrid">'+rows.map(card).join('')+'</div>':'<div class="panel empty" style="margin-top:16px">'+(all.length?'Tidak ada asset yang cocok.':'Belum ada asset. Klik Asset baru untuk mengunggah logo, brosur, poster, atau materi marketing lainnya.')+'</div>');
  return{title:'Branding Marketing',sub:'Pustaka asset branding dan materi marketing Qrion: logo, brosur, poster, foto, video, dan panduan brand.',action:act,bar,body};
},
administrasi(){
  const f=S.f.adm,ed=can('administrasi'),F=S.admForm,q=f.q.trim().toLowerCase();S.csv=null;
  const tabBar='<span class="seg" role="group" aria-label="Bagian Administrasi">'+[['surat','Persuratan'],['mou','MoU Kerjasama']].map(t=>'<button data-act="adm-tab" data-t="'+t[0]+'" aria-pressed="'+(f.tab===t[0])+'">'+t[1]+'</button>').join('')+'</span>';
  const sub='Catatan surat masuk dan keluar, serta perjanjian kerjasama (MoU/PKS) dengan sekolah atau instansi.';
  const act=ed?'<button class="btn primary" data-act="adm-new" data-k="'+f.tab+'">'+(f.tab==='mou'?'MoU baru':'Surat baru')+'</button>':'';
  const lab=(id,l,inner)=>'<div class="fld"><label for="'+id+'">'+l+'</label>'+inner+'</div>';
  const inp=(id,k,l,v,ex)=>lab(id,l,'<input type="'+((ex&&ex.t)||'text')+'" id="'+id+'" data-af="'+k+'" value="'+esc(v)+'"'+((ex&&ex.ph)?' placeholder="'+esc(ex.ph)+'"':'')+' autocomplete="off">');
  let formH='';
  if(ed&&F&&F.kind===f.tab){
    const isM=F.kind==='mou';
    formH='<section class="panel" style="margin:16px 0"><header><h2>'+(F.id?'Ubah ':'')+(isM?'MoU kerjasama':'Surat')+(F.id?'':' baru')+'</h2></header>';
    if(!isM){
      const kl=F.arah!=='masuk';
      formH+='<div class="fields">'+lab('af-arah','Jenis surat','<select id="af-arah" data-af="arah">'+opt('keluar','Surat keluar',F.arah)+opt('masuk','Surat masuk',F.arah)+'</select>')+inp('af-tgl','tanggal','Tanggal surat',F.tanggal,{t:'date'})
        +(kl?lab('af-kode','Kode jenis','<select id="af-kode" data-af="kode">'+SURAT_KODE.map(k=>opt(k[0],k[0]+' · '+k[1],F.kode)).join('')+'</select>')+inp('af-urut','noUrut','No. urut',F.noUrut,{t:'number'}):'')
        +inp('af-nomor','nomor',kl?'Nomor surat (terisi otomatis)':'Nomor surat masuk',F.nomor)
        +lab('af-pen',kl?'Penandatangan':'Penandatangan / pengirim','<input type="text" id="af-pen" data-af="penandatangan" list="dl-adm-pen" value="'+esc(F.penandatangan)+'" autocomplete="off" placeholder="Nama penandatangan">')
        +lab('af-pihak',kl?'Tujuan / Mitra':'Pengirim','<input type="text" id="af-pihak" data-af="pihak" list="dl-adm-mitra" value="'+esc(F.pihak)+'" autocomplete="off" placeholder="Nama mitra atau instansi">')
        +'<div class="fld wide"><label for="af-perihal">Perihal</label><input type="text" id="af-perihal" data-af="perihal" value="'+esc(F.perihal)+'" autocomplete="off"></div>'
        +inp('af-lamp','lampiranKet','Lampiran',F.lampiranKet,{ph:'mis. 1 berkas (report review)'})
        +lab('af-st','Status','<select id="af-st" data-af="status">'+Object.keys(SURAT_ST).map(k=>opt(k,SURAT_ST[k][0],F.status)).join('')+'</select>')
        +'<div class="fld wide"><label for="af-link">Link / lokasi file</label><input type="text" id="af-link" data-af="link" value="'+esc(F.link)+'" autocomplete="off" placeholder="https://drive.google.com/..."></div></div>'
        +'<datalist id="dl-adm-pen">'+[...new Set(['Risky Antonio Pauji','Argeomerta Lisva'].concat(S.surat.map(x=>x.penandatangan).filter(Boolean)))].map(x=>'<option value="'+esc(x)+'">').join('')+'</datalist>';
    }else{
      formH+='<div class="fields">'+lab('af-untuk','PKS untuk sekolah / instansi mana','<input type="text" id="af-untuk" data-af="untuk" list="dl-adm-mitra" value="'+esc(F.untuk)+'" autocomplete="off" placeholder="Nama sekolah, yayasan, atau instansi">').replace('class="fld"','class="fld wide"')
        +inp('af-nomor','nomor','Nomor MoU / PKS',F.nomor)+lab('af-st','Status','<select id="af-st" data-af="status">'+Object.keys(MOU_ST).map(k=>opt(k,MOU_ST[k][0],F.status)).join('')+'</select>')
        +'<div class="fld wide"><label for="af-judul">Judul</label><input type="text" id="af-judul" data-af="judul" value="'+esc(F.judul)+'" autocomplete="off"></div>'
        +inp('af-ttd','tanggalTtd','Tanggal tanda tangan',F.tanggalTtd,{t:'date'})+inp('af-pen','penandatangan','Penandatangan pihak sekolah / instansi',F.penandatangan,{ph:'Nama dan jabatan'})
        +inp('af-mulai','mulai','Berlaku mulai',F.mulai,{t:'date'})+inp('af-akhir','berakhir','Berlaku sampai',F.berakhir,{t:'date'})+'</div>'
        +'<div class="fld"><label for="af-ruang">Ruang lingkup kerjasama</label><textarea id="af-ruang" data-af="ruang" rows="3">'+esc(F.ruang)+'</textarea></div>';
    }
    formH+='<div class="fld"><label for="af-cat">'+(isM?'Catatan':'Keterangan')+'</label><textarea id="af-cat" data-af="catatan" rows="2">'+esc(F.catatan)+'</textarea></div>'+attPicker('adm')+'<div class="err" id="af-err" hidden></div><div class="inline"><button class="btn primary" data-act="adm-save">'+(F.id?'Simpan perubahan':'Simpan')+'</button><button class="btn" data-act="adm-cancel">Batal</button></div></section>';
  }
  const dl='<datalist id="dl-adm-mitra">'+S.schools.filter(live).map(x=>'<option value="'+esc(x.name)+'">').join('')+'</datalist>';
  const btns=y=>ed?'<span class="inline" style="flex-wrap:nowrap"><button class="btn small" data-act="adm-edit" data-k="'+f.tab+'" data-id="'+esc(y.id)+'">Ubah</button><button class="btn small danger" data-act="adm-del" data-k="'+f.tab+'" data-id="'+esc(y.id)+'" data-confirm="Yakin hapus?">Hapus</button></span>':'';
  let bar=tabBar+'<span style="flex-basis:100%"></span><input type="search" data-f="adm.q" placeholder="'+(f.tab==='mou'?'Cari MoU atau sekolah':'Cari nomor, perihal, atau pihak')+'" aria-label="Cari" value="'+esc(f.q)+'">',body;
    const tplPanel=menu=>{const tl=(S.tpl||[]).filter(t=>(t.menu||'surat')===menu),tf=S.tplForm&&(S.tplForm.menu||'surat')===menu?S.tplForm:null,okU=u=>/^(https:\/\/|\/_blob\/)/.test(String(u||'')),
      tplH='<section class="panel" style="margin-top:16px"><header><h2>'+(menu==='mou'?'Template MoU / PKS':'Template surat QRION')+'</h2>'+(ed&&!tf?'<button class="btn small" data-act="tpl-new" data-menu="'+menu+'">Tambah template</button>':'')+'</header>'
      +(tf?'<div class="fields"><div class="fld"><label for="tf-nama">Nama template</label><input type="text" id="tf-nama" data-tf="nama" value="'+esc(tf.nama)+'" autocomplete="off" placeholder="mis. Template Surat Penawaran"></div><div class="fld"><label for="tf-kode">Kode jenis</label><select id="tf-kode" data-tf="kode">'+opt('','Umum',tf.kode)+SURAT_KODE.map(k=>opt(k[0],k[0]+' · '+k[1],tf.kode)).join('')+'</select></div><div class="fld wide"><label for="tf-link">Link template</label><input type="text" id="tf-link" data-tf="link" value="'+esc(tf.link)+'" autocomplete="off" placeholder="https://docs.google.com/document/d/..."></div><div class="fld wide"><label for="tf-ket">Keterangan</label><input type="text" id="tf-ket" data-tf="ket" value="'+esc(tf.ket)+'" autocomplete="off" placeholder="Kapan template ini dipakai"></div></div><div class="err" id="tf-err" hidden></div><div class="inline"><button class="btn primary" data-act="tpl-save">'+(tf.id?'Simpan perubahan':'Simpan template')+'</button><button class="btn" data-act="tpl-cancel">Batal</button></div>':'')
      +(tl.length?'<div style="margin-top:8px">'+tl.slice().sort((a,b)=>String(a.kode||'~').localeCompare(String(b.kode||'~'))||String(a.nama).localeCompare(String(b.nama))).map(t=>'<div class="rowi" style="cursor:default;gap:12px;align-items:flex-start"><div style="flex:1;min-width:0"><strong>'+esc(t.nama||'Template')+'</strong> '+(t.kode?pill(esc(t.kode),'info'):'')+(t.ket?'<span class="sub" style="display:block">'+esc(t.ket)+'</span>':'')+'</div><span class="inline" style="flex-wrap:nowrap">'+(okU(t.link)?'<a class="btn small" href="'+esc(t.link)+'" target="_blank" rel="noopener noreferrer"'+(String(t.link).indexOf('/_blob/')===0?' download="'+esc(t.file||'template')+'"':'')+'>'+(String(t.link).indexOf('/_blob/')===0?'Unduh':'Buka')+'</a>':'')+(ed?'<button class="btn small" data-act="tpl-edit" data-id="'+esc(t.id)+'">Ubah</button><button class="btn small danger" data-act="tpl-del" data-id="'+esc(t.id)+'" data-confirm="Yakin hapus?">Hapus</button>':'')+'</span></div>').join('')+'</div>':(tf?'':'<p class="sub" style="margin:8px 0 0">Belum ada template. Klik Tambah template lalu tempel link Google Docs atau Drive.</p>'))+'</section>';;return tplH};
  if(f.tab==='surat'){
    const all=S.surat,yr=today().slice(0,4),thisY=all.filter(x=>String(x.tanggal||'').slice(0,4)===yr),yl=[...new Set(all.map(x=>String(x.tanggal||'').slice(0,4)).filter(Boolean).concat([yr]))].sort();
    bar+='<select data-f="adm.arah" aria-label="Jenis surat">'+opt('','Semua surat',f.arah)+opt('keluar','Surat keluar',f.arah)+opt('masuk','Surat masuk',f.arah)+'</select><select data-f="adm.kode" aria-label="Kode jenis">'+opt('','Semua kode jenis',f.kode)+SURAT_KODE.map(k=>opt(k[0],k[0]+' · '+k[1],f.kode)).join('')+'</select><select data-f="adm.y" aria-label="Tahun">'+opt('','Semua tahun',f.y)+yl.map(y=>opt(y,'Tahun '+y,f.y)).join('')+'</select>';
    const rows=all.filter(x=>(!f.arah||x.arah===f.arah)&&(!f.kode||x.kode===f.kode)&&(!f.y||String(x.tanggal||'').slice(0,4)===f.y)&&(!q||[x.nomor,x.perihal,x.pihak,x.tujuan,x.penandatangan,x.catatan,x.lampiranKet].some(v=>String(v||'').toLowerCase().indexOf(q)>=0))).sort((a,b)=>String(a.tanggal||'').localeCompare(String(b.tanggal||''))||((+a.noUrut||0)-(+b.noUrut||0)));
    const tiles='<div class="tiles"><div class="tile"><span>Surat keluar '+yr+'</span><strong>'+thisY.filter(x=>x.arah!=='masuk').length+'</strong><em>surat</em></div><div class="tile"><span>Surat masuk '+yr+'</span><strong>'+thisY.filter(x=>x.arah==='masuk').length+'</strong><em>surat</em></div><div class="tile"><span>Masih draf</span><strong>'+all.filter(x=>x.status==='draft').length+'</strong><em>surat</em></div></div>';
    const legend='<p style="margin:12px 2px 0;color:var(--ink2);font-size:13px"><b>Format nomor:</b> NNN/KODE JENIS-'+KODE_PT+'/BULAN ROMAWI/TAHUN. No. urut dihitung per kode jenis tiap tahun. <b>Kode jenis:</b> '+SURAT_KODE.map(k=>k[0]+' = '+k[1]).join(', ')+'.</p>';
    const lk=u=>/^https:\/\//.test(String(u||''))?'<a href="'+esc(u)+'" target="_blank" rel="noopener noreferrer">Buka file</a>':esc(u||'');
    body=tiles+tplPanel('surat')+legend+formH+(rows.length?'<div class="tablewrap" style="margin-top:16px"><table class="stab"><thead><tr><th>Tanggal</th><th>Kode</th><th class="c">No. urut</th><th>Nomor surat</th><th>Tujuan / Mitra</th><th>Perihal</th><th>Penandatangan</th><th>Lampiran</th><th>Status</th><th>Link / Lokasi file</th><th>Keterangan</th><th></th></tr></thead><tbody>'+rows.map(y=>{const st=SURAT_ST[y.status]||SURAT_ST.draft,kd=y.arah==='masuk'?pill('Masuk',''):(y.kode?pill(esc(y.kode),'info'):'<span style="color:var(--faint)">–</span>'),dash='<span style="color:var(--faint)">–</span>';return '<tr><td style="white-space:nowrap">'+fmtD(y.tanggal)+'</td><td>'+kd+'</td><td class="c">'+(y.arah==='masuk'||!y.noUrut?dash:esc(y.noUrut))+'</td><td style="min-width:170px"><strong>'+esc(y.nomor||'—')+'</strong></td><td style="min-width:150px">'+esc(y.pihak||y.tujuan||'—')+'</td><td style="min-width:220px">'+esc(y.perihal||'—')+admLamp(y.lampiran)+'</td><td style="min-width:130px">'+(esc(y.penandatangan||'')||dash)+'</td><td style="min-width:110px">'+(esc(y.lampiranKet||'')||dash)+'</td><td>'+pill(st[0],st[1])+'</td><td>'+(y.link?lk(y.link):dash)+'</td><td style="min-width:200px">'+(esc(y.catatan||'')||dash)+'</td><td>'+btns(y)+'</td></tr>'}).join('')+'</tbody></table></div>':'<div class="panel empty" style="margin-top:16px">'+(all.length?'Tidak ada surat yang cocok.':'Belum ada surat. Klik Surat baru untuk mencatat surat masuk atau keluar.')+'</div>')+dl;
  }else{
    bar+='<select data-f="adm.st" aria-label="Status MoU">'+opt('','Semua status',f.st)+Object.keys(MOU_ST).map(k=>opt(k,MOU_ST[k][0],f.st)).join('')+opt('segera','Segera berakhir',f.st)+'</select>';
    const all=S.mou.map(x=>Object.assign({},x,{_e:mouEff(x)}));
    const rows=all.filter(x=>(!f.st||x._e[0]===f.st||(f.st==='aktif'&&x._e[0]==='segera'&&false))&&(!q||[x.nomor,x.judul,mouTo(x),x.ruang].some(v=>String(v||'').toLowerCase().indexOf(q)>=0))).sort((a,b)=>String(a.berakhir||'9999').localeCompare(String(b.berakhir||'9999')));
    const c=k=>all.filter(x=>x._e[0]===k).length;
    const tiles='<div class="tiles"><div class="tile"><span>MoU aktif</span><strong>'+(c('aktif')+c('segera'))+'</strong><em>perjanjian</em></div><div class="tile"><span>Segera berakhir</span><strong>'+c('segera')+'</strong><em>dalam 60 hari</em></div><div class="tile"><span>Menunggu tanda tangan</span><strong>'+c('menunggu')+'</strong><em>perjanjian</em></div><div class="tile"><span>Sudah berakhir</span><strong>'+c('berakhir')+'</strong><em>perjanjian</em></div></div>';
    body=tiles+tplPanel('mou')+formH+(rows.length?'<div class="tablewrap" style="margin-top:16px"><table><thead><tr><th>Sekolah / instansi</th><th>Nomor dan judul</th><th>Masa berlaku</th><th>Status</th><th></th></tr></thead><tbody>'+rows.map(y=>{const e=y._e,st=e[0]==='segera'?['Segera berakhir ('+e[1]+' hari)','warn']:MOU_ST[e[0]]||MOU_ST.draft;return '<tr><td style="min-width:200px"><strong>'+esc(mouTo(y))+'</strong>'+(y.penandatangan?'<span class="sub">'+esc(y.penandatangan)+'</span>':'')+'</td><td style="min-width:220px">'+esc(y.nomor||'—')+'<span class="sub">'+esc(y.judul||'')+'</span>'+(y.ruang?'<span class="sub">'+esc(y.ruang)+'</span>':'')+admLamp(y.lampiran)+'</td><td>'+(y.mulai||y.berakhir?fmtD(y.mulai)+' s.d. '+fmtD(y.berakhir):'—')+(y.tanggalTtd?'<span class="sub">Ditandatangani '+fmtD(y.tanggalTtd)+'</span>':'')+'</td><td>'+pill(st[0],st[1])+'</td><td>'+btns(y)+'</td></tr>'}).join('')+'</tbody></table></div>':'<div class="panel empty" style="margin-top:16px">'+(all.length?'Tidak ada MoU yang cocok.':'Belum ada MoU. Klik MoU baru untuk mencatat perjanjian kerjasama dengan sekolah atau instansi.')+'</div>')+dl;
  }
  return{title:'Administrasi',sub,action:act,bar,body};
},
pembayaran(){
  const f=S.f.pay,ed=can('pembayaran'),cur=nowYM(),by=paySummary();
  const mitra=S.schools.filter(live).sort((a,b)=>((a.urut||9999)-(b.urut||9999))||String(a.name).localeCompare(String(b.name)));
  const tabBar0='<span class="seg" role="group" aria-label="Bagian Pembayaran Mitra">'+[['status','Status mitra'],['input','Input pembayaran'],['riwayat','Riwayat'],['invoice','Invoice']].map(t=>'<button data-act="ptab" data-t="'+t[0]+'" aria-pressed="'+(f.tab===t[0])+'">'+t[1]+'</button>').join('')+'</span>';
  const tabBar='<div class="pay-tabbar">'+tabBar0+'</div>';
  const mpFn=()=>ed&&f.addM?'<section class="panel" style="flex-basis:100%;margin:6px 0 0"><header><h2>Tambah mitra baru</h2></header><div class="fields"><div class="fld"><label for="mn-nama">Nama mitra</label><input type="text" id="mn-nama" placeholder="mis. SMK Dirgantara Riau" autocomplete="off"></div><div class="fld"><label for="mn-jen">Jenjang</label><select id="mn-jen">'+opt('','Pilih jenjang','')+JENJANG.map(x=>opt(x,x,'')).join('')+'</select></div><div class="fld"><label for="mn-kota">Kota</label><input type="text" id="mn-kota"></div><div class="fld"><label for="mn-am">Account Manager</label><select id="mn-am">'+opt('','Belum ditentukan','')+amList().map(x=>opt(x,nameOf(x),'')).join('')+'</select></div><div class="fld"><label for="mn-pic">Nama PIC</label><input type="text" id="mn-pic"></div><div class="fld"><label for="mn-tel">Telepon PIC</label><input type="text" id="mn-tel" inputmode="tel"></div></div><div class="fld"><label>Produk yang dipakai</label><div class="inline">'+S.products.map(x=>'<label style="display:inline-flex;gap:6px;align-items:center"><input type="checkbox" class="mn-prod" value="'+esc(x.id)+'"> '+esc(x.name)+'</label>').join('')+'</div></div><div class="err" id="mn-err" hidden></div><div class="inline"><button class="btn primary" data-act="mn-save">Tambahkan ke daftar</button><button class="btn" data-act="mn-toggle">Batal</button></div><p style="margin:0;color:var(--ink2);font-size:13px">Nilai langganan (MRR) dan kontrak bisa dilengkapi nanti di menu Mitra Sekolah.</p></section>':'';
  const mpHtml=mpFn();
  const sub='Catat pembayaran yang sudah diterima, lihat bulan yang sudah dibayar tiap mitra.';
  if(f.tab==='invoice')return invoiceView(f,ed,mitra,tabBar,'Buat, terbitkan, dan pantau invoice tagihan untuk mitra sekolah.');
  if(f.tab==='input'){
    if(!ed)return{title:'Pembayaran Mitra',sub,bar:tabBar,body:'<div class="pay-page">'+mpHtml+'<div class="panel empty">Peran Anda hanya bisa melihat pembayaran. Mencatat pembayaran dilakukan oleh Account Manager, CEO, atau Admin.</div></div>'};
    const F=S.payForm||(S.payForm=newPayForm()),yopts=v=>{const cy=+nowYM().slice(0,4),cv=+String(v||nowYM()).slice(0,4),a=[...new Set([cy-1,cy,cy+1,cy+2,cv])].sort();return a.map(t=>opt(String(t),String(t),String(cv))).join('')};
    const tp=F.tipe==='topup'||F.tipe==='transaksi',tx=F.tipe==='transaksi',tname=tx?'Biaya per transaksi':tp?'Top up':'Berlangganan';
    const fieldMitra='<div class="fld"><label for="pf-mitra">Mitra</label><select id="pf-mitra" data-pf="mitraId">'+opt('','Pilih mitra',F.mitraId)+mitra.map(x=>opt(x.id,x.name,F.mitraId)).join('')+'</select></div>';
    const fieldTgl='<div class="fld"><label for="pf-tgl">Tanggal pembayaran</label><input type="date" id="pf-tgl" data-pf="tanggal" value="'+esc(F.tanggal)+'"></div>';
    const fieldTotal=tp?'<div class="fld"><label for="pf-total">'+(tx?'Total biaya transaksi (Rp)':'Jumlah top up (Rp)')+'</label><input type="text" inputmode="numeric" id="pf-total" data-pf="total" placeholder="contoh 1.500.000" autocomplete="off" value="'+esc(F.total)+'"></div>':'';
    const fieldBukti='<div class="fld"><label for="pf-bukti">Tautan bukti bayar <span class="pay-opt">opsional</span></label><input type="url" id="pf-bukti" data-pf="bukti" placeholder="https://drive.google.com/..." value="'+esc(F.bukti)+'"></div>';
    const periode=tx?'<div class="pay-block"><div class="pay-block-head"><h3>Periode dan biaya transaksi</h3></div><div class="fields pay-fields"><div class="fld"><label for="pf-ty">Tahun transaksi</label><select id="pf-ty" data-ty="1">'+yopts(F.trxBulan)+'</select></div><div class="fld"><label for="pf-tb">Bulan transaksi</label><select id="pf-tb" data-tm="1">'+BLN.map((n,k)=>opt(pad(k+1),n,String(F.trxBulan||nowYM()).slice(5,7))).join('')+'</select></div><div class="fld"><label for="pf-tj">Jumlah transaksi</label><input type="text" inputmode="numeric" id="pf-tj" data-pf="trxJml" placeholder="mis. 1200" autocomplete="off" value="'+esc(F.trxJml)+'"></div><div class="fld"><label for="pf-tf">Biaya per transaksi (Rp)</label><input type="text" inputmode="numeric" id="pf-tf" data-pf="trxBiaya" placeholder="mis. 2.500" autocomplete="off" value="'+esc(F.trxBiaya)+'"></div></div><p class="pay-hint">Total terisi otomatis dari jumlah transaksi dikali biaya per transaksi, dan tetap bisa diubah. Biaya transaksi dicatat sebagai uang masuk dan tidak mengisi bulan langganan.</p></div>'
      :tp?'<div class="pay-block"><div class="pay-block-head"><h3>Periode top up</h3></div><div class="fields pay-fields"><div class="fld"><label for="pf-ty">Top up untuk tahun</label><select id="pf-ty" data-ty="1">'+yopts(F.trxBulan)+'</select></div><div class="fld"><label for="pf-tb">Top up untuk bulan</label><select id="pf-tb" data-tm="1">'+BLN.map((n,k)=>opt(pad(k+1),n,String(F.trxBulan||nowYM()).slice(5,7))).join('')+'</select></div></div><p class="pay-hint">Top up dicatat sebagai uang masuk pada bulan yang dipilih dan tidak mengisi bulan langganan.</p></div>'
      :'<div class="pay-block pay-items"><div class="pay-block-head"><h3>Item yang dibayar</h3><span class="pay-hint">Total dihitung otomatis</span></div><p class="pay-hint">Langganan: isi produk dan nominal per bulan, lalu pilih bulan yang dibayarkan. Biaya tambahan: misalnya Kartu Oncard atau Training.</p>'
        +(F.items.length?F.items.map((y,ix)=>{const lg=y.jenis==='langganan';return '<div class="payitem"><div class="payitem-head"><span class="pill '+(lg?'good':'warn')+'">'+(lg?'Langganan':'Biaya tambahan')+'</span><button class="btn small danger" data-act="pidel" data-i="'+ix+'">Hapus</button></div><div class="payitem-fields"><div class="fld"><label for="pi-n-'+ix+'">Nama item</label><input type="text" id="pi-n-'+ix+'" data-ix="'+ix+'" data-pk="nama" list="'+(lg?'dl-lang':'dl-tamb')+'" aria-label="Nama item" placeholder="'+(lg?'Produk, mis. Ontuition':'Nama biaya, mis. Kartu Oncard')+'" value="'+esc(y.nama||'')+'"></div><div class="fld"><label for="pi-r-'+ix+'">Nominal '+(lg?'per bulan':'')+' (Rp)</label><input type="text" inputmode="numeric" id="pi-r-'+ix+'" data-ix="'+ix+'" data-pk="nominal" aria-label="Nominal item" placeholder="'+(lg?'mis. 150.000':'mis. 2.500.000')+'" value="'+esc(y.nominal||'')+'"></div></div><div class="payitem-months"><div class="payitem-label">'+(lg?'Dibayarkan untuk bulan apa? <span>Pilih satu atau lebih, boleh lintas tahun.</span>':'Dibayarkan di bulan apa? <span>Pilih satu bulan.</span>')+'</div>'+mchips(ix,y)+'</div></div>'}).join(''):'<div class="pay-empty"><strong>Belum ada item</strong><span>Tambahkan langganan atau biaya tambahan untuk mulai menghitung total.</span></div>')
        +'<div class="pay-add"><span class="pay-hint">Tambahkan baris sesuai pembayaran yang diterima.</span><div class="inline"><button class="btn small" data-act="piadd" data-j="langganan">Tambah langganan</button><button class="btn small" data-act="piadd" data-j="tambahan">Tambah biaya tambahan</button></div></div></div>';
    const body='<div class="pay-page pay-input">'+mpHtml+'<section class="panel pay-form">'
      +'<header class="pay-form-head"><div><h2>'+(F.editId?'Ubah pembayaran':'Catat pembayaran baru')+'</h2><p>'+(F.editId?'Perbarui rincian pembayaran untuk '+esc(schoolName(F.mitraId))+'.':'Isi mitra, tanggal, dan item yang dibayar. Total dihitung otomatis dari rincian di bawah.')+'</p></div><span class="pill '+(tp?'info':'good')+'">'+tname+'</span></header>'
      +'<div class="pay-type"><span class="lbl">Jenis pembayaran</span><span class="seg" role="group" aria-label="Jenis pembayaran">'+[['langganan','Berlangganan'],['topup','Top up'],['transaksi','Biaya per transaksi']].map(t=>'<button type="button" data-act="ptipe" data-v="'+t[0]+'" aria-pressed="'+((F.tipe||'langganan')===t[0])+'">'+t[1]+'</button>').join('')+'</span></div>'
      +'<div class="pay-block"><div class="pay-block-head"><h3>Mitra dan pembayaran</h3></div><div class="fields pay-fields">'+fieldMitra+fieldTgl+fieldTotal+fieldBukti+'</div><div class="pay-inline"><span>Mitra belum ada di daftar?</span><button class="btn small" data-act="mn-toggle">Tambah mitra baru</button></div></div>'
      +periode
      +'<div class="pay-block"><div class="fld"><label for="pf-cat">Catatan <span class="pay-opt">opsional</span></label><textarea id="pf-cat" data-pf="catatan" rows="2">'+esc(F.catatan)+'</textarea></div></div>'
      +'<div class="err" id="pf-err" hidden></div>'
      +'<div class="pay-foot"><div class="pay-total"><span>Total dibayar</span><div id="sumhint" class="pay-total-val"><strong>—</strong></div></div><div class="inline pay-actions"><button class="btn primary" data-act="psave">'+(F.editId?'Simpan perubahan':'Simpan pembayaran')+'</button><button class="btn" data-act="preset">Kosongkan</button></div></div>'
      +'</section></div>'
      +'<datalist id="dl-lang">'+S.products.map(x=>'<option value="'+esc(x.name)+'">').join('')+'<option value="Trx"><option value="Full paket"><option value="Boarding"><option value="Langganan"></datalist><datalist id="dl-tamb"><option value="Kartu Oncard"><option value="Training"><option value="Instalasi"><option value="Perangkat"></datalist>';
    return{title:'Pembayaran Mitra',sub,bar:tabBar,body};
  }
  if(f.tab==='riwayat'){
    const list=S.pay.slice().sort((a,b)=>{const x=a.tanggal||'',y=b.tanggal||'';if(x!==y){if(!x)return 1;if(!y)return -1;return x<y?1:-1}return String(b.dibuat||'')<String(a.dibuat||'')?-1:1});
    const cols=[{l:'Tgl bayar',v:x=>x.tanggal||'',h:x=>x.tanggal?fmtD(x.tanggal):pill('Tanpa tanggal','warn')},{l:'Mitra',v:x=>schoolName(x.mitraId),h:x=>'<strong>'+esc(schoolName(x.mitraId))+'</strong>'+(x.catatan?'<span class="sub">'+esc(x.catatan)+'</span>':'')},
      {l:'Item',v:payText,h:payLine},{l:'Catatan',v:x=>x.catatan||'',csvOnly:1},{l:'Total (Rp)',num:1,v:x=>+x.total||0,h:x=>x.total?rp(x.total):'–'},{l:'Bukti',v:x=>x.bukti||'',h:bukti}];
    const total=list.reduce((a,x)=>a+(+x.total||0),0),mitraN=new Set(list.map(x=>x.mitraId)).size;
    const body=list.length?'<div class="pay-page pay-history">'+mpHtml+'<div class="pay-hist-sum"><div><span>Total diterima</span><strong>'+rp(total)+'</strong></div><div><span>Jumlah pembayaran</span><strong>'+list.length+'</strong></div><div><span>Mitra</span><strong>'+mitraN+'</strong></div><em>Terbaru di atas</em></div><div class="pay-hist-list">'
      +list.map(x=>{const tg=x.tanggal?new Date(String(x.tanggal).slice(0,10)+'T00:00:00'):null,ok=tg&&!isNaN(tg);return '<article class="pay-hist"><div class="pay-hist-date"><strong>'+(ok?pad(tg.getDate()):'—')+'</strong><span>'+(ok?BLN[tg.getMonth()]+' '+tg.getFullYear():'Tanpa tanggal')+'</span></div><div class="pay-hist-main"><div class="pay-hist-title"><strong>'+esc(schoolName(x.mitraId))+'</strong></div><div class="pay-hist-items">'+payLine(x)+'</div>'+(x.catatan?'<p class="pay-hist-note">'+esc(x.catatan)+'</p>':'')+'</div><div class="pay-hist-side"><strong class="pay-hist-total">'+(x.total?rp(x.total):'—')+'</strong><div class="pay-hist-proof">'+bukti(x)+'</div>'+(ed?'<div class="inline pay-hist-actions"><button class="btn small" data-act="pedit" data-id="'+esc(x.id)+'">Ubah</button><button class="btn small danger" data-act="pdel" data-id="'+esc(x.id)+'" data-confirm="Yakin hapus?">Hapus</button></div>':'')+'</div></article>'}).join('')
      +'</div></div>':'<div class="pay-page">'+mpHtml+'<div class="panel empty">Belum ada pembayaran. Catat lewat tab Input pembayaran.</div></div>';
    S.csv=list.length?{view:'pembayaran',cols,rows:list}:null;
    return{title:'Pembayaran Mitra',sub,action:S.dl&&list.length?csvBtn():'',bar:tabBar,body};
  }
  S.csv=null;
  const cy=+cur.slice(0,4),ys=new Set([cy,cy+1]);Object.keys(by).forEach(k=>Object.keys(by[k].months).concat(Object.keys(by[k].ext||{}),Object.keys(by[k].trx||{}),Object.keys(by[k].tup||{})).forEach(b=>{if(isYM(b))ys.add(+b.slice(0,4))}));const yl=[...ys].sort((a,b)=>a-b),yr=ys.has(+f.y)?+f.y:cy;
  const months=[];for(let m=1;m<=12;m++)months.push(yr+'-'+pad(m));
  let total=0,tamb=0,tn=0,tu=0,und=0,paidNow=0;S.pay.forEach(x=>{total+=typeof x.total==='number'?x.total:0});Object.keys(by).forEach(k=>{tamb+=by[k].tamb;tn+=by[k].tn;tu+=by[k].tu;und+=by[k].und});const sm=months.indexOf(f.m)>=0?f.m:null,anyIn=(o)=>!!o&&months.some(b=>o[b]!=null&&o[b]!==undefined);mitra.forEach(x=>{const g=by[x.id];if(g&&(sm?g.months[sm]:anyIn(g.months)))paidNow++});
  const q=f.q.trim().toLowerCase(),rows=mitra.filter(x=>{if(q&&String(x.name).toLowerCase().indexOf(q)<0)return false;if(f.p&&!(x.products||[]).some(y=>y.productId===f.p))return false;if(f.who&&!matchWho(x.am,f.who))return false;const g=by[x.id]||{},pd=!!(sm?g.months&&g.months[sm]:anyIn(g.months));if(f.f==='paid'&&!pd)return false;if(f.f==='unpaid'&&pd)return false;if(f.f==='extra'&&!(sm?g.ext&&g.ext[sm]:anyIn(g.ext)))return false;if(f.f==='trx'&&!(sm?g.trx&&g.trx[sm]!=null:anyIn(g.trx)))return false;return true});
  const shortRp=n=>{n=+n||0;if(n>=1e9)return (n/1e9).toLocaleString('id-ID',{maximumFractionDigits:1})+' M';if(n>=1e6)return (n/1e6).toLocaleString('id-ID',{maximumFractionDigits:1})+' jt';if(n>=1e3)return Math.round(n/1e3).toLocaleString('id-ID')+' rb';return String(n)};
  const advN=(f.f&&f.f!=='all'?1:0)+(f.p?1:0)+(f.who?1:0);
  const filters='<input type="search" data-f="pay.q" placeholder="Cari mitra" aria-label="Cari mitra" value="'+esc(f.q)+'"><select data-f="pay.y" aria-label="Tahun">'+yl.map(y=>opt(y,'Tahun '+y,yr)).join('')+'</select><select data-f="pay.m" aria-label="Bulan">'+opt('','Semua bulan',sm||'')+months.map(b=>opt(b,mLabel(b),sm||'')).join('')+'</select><button type="button" class="btn pay-filter-toggle" data-act="pay-adv" aria-expanded="'+!!f.adv+'">Filter'+(advN?' · '+advN:'')+'</button><div class="pay-adv'+(f.adv?' is-open':'')+'"><select data-f="pay.f" aria-label="Status pembayaran">'+[['all','Semua status'],['paid','Sudah bayar langganan'],['unpaid','Belum bayar langganan'],['extra','Ada biaya tambahan'],['trx','Ada biaya transaksi']].map(c=>opt(c[0],c[1],f.f)).join('')+'</select><select data-f="pay.p" aria-label="Produk">'+opt('','Semua produk',f.p)+S.products.map(x=>opt(x.id,x.name,f.p)).join('')+'</select>'+(amList().length?'<select data-f="pay.who" aria-label="Account Manager">'+opt('','Semua AM',f.who)+amList().map(id=>opt(id,nameOf(id),f.who)).join('')+'</select>':'')+'</div>';
  const bar=tabBar+'<div class="pay-filters">'+filters+'</div>';
  const tiles='<div class="tiles pay-tiles"><div class="tile"><span>Total uang masuk</span><strong>'+rp(total)+'</strong><em>'+S.pay.length+' pembayaran</em></div><div class="tile"><span>Sudah bayar '+(sm?'untuk '+mLabel(sm):'di '+yr)+'</span><strong>'+paidNow+' dari '+mitra.length+'</strong><em>mitra</em></div><div class="tile"><span>Biaya tambahan</span><strong>'+rp(tamb)+'</strong><em>'+tn+' item'+(tu?', '+tu+' tanpa nominal':'')+'</em></div><div class="tile"><span>Perlu dirinci</span><strong>'+und+'</strong><em>pembayaran belum ada itemnya</em></div></div>';
  const monthCell=(x,g,cb,b)=>{const nv=g.nom&&g.nom[b],exl=(g.ext&&g.ext[b])||[],tv=g.trx&&g.trx[b],up=g.tup&&g.tup[b],hasLg=!!(g.months&&g.months[b]),hasEx=!!exl.length,hasIn=tv!=null||up!=null;
    if(!hasLg&&!hasEx&&!hasIn)return '<div class="mcell is-empty"><span class="mlab">'+BLN[+b.slice(5,7)-1]+'</span><span class="mval">–</span></div>';
    const sum=(nv||0)+exl.reduce((a,e)=>a+(e.v||0),0)+(tv||0)+(up||0),open=cb===b;
    return '<div class="mcellwrap"><button type="button" class="mcell is-filled '+(hasLg?'is-lg':hasEx?'is-ex':'is-in')+(open?' is-open':'')+'" data-act="pcell" data-id="'+esc(x.id)+'" data-b="'+b+'" aria-expanded="'+open+'" title="'+esc(mLabel(b)+' · '+(sum>0?rp(sum):'nominal belum diisi'))+'"><span class="mlab">'+BLN[+b.slice(5,7)-1]+'</span><span class="mval">'+(sum>0?shortRp(sum):'✓')+'</span><span class="mdots" aria-hidden="true">'+(hasLg?'<i class="lg"></i>':'')+(hasEx?'<i class="ex"></i>':'')+(hasIn?'<i class="in"></i>':'')+'</span></button></div>'};
  const monthDetail=(x,cb)=>{let ls=[];S.pay.filter(y=>y.mitraId===x.id).forEach(y=>{if(y.tipe==='transaksi'){if(y.trx&&y.trx.bulan===cb)ls.push({n:'Biaya transaksi'+(y.trx.jumlah?' ('+fmtN(y.trx.jumlah)+' trx × '+rp(y.trx.biaya)+')':''),v:typeof y.total==='number'?y.total:null,id:y.id});return}if(y.tipe==='topup'){if(y.topup&&y.topup.bulan===cb)ls.push({n:'Top up',v:typeof y.total==='number'?y.total:null,id:y.id});return}const it=pItems(y),lg=it.filter(z=>z.jenis!=='tambahan');it.filter(z=>z.jenis==='tambahan'&&tBul(z,y).indexOf(cb)>=0).forEach(z=>ls.push({n:(z.nama||'Biaya tambahan')+' (biaya tambahan)',v:typeof z.nominal==='number'?z.nominal:null,id:y.id}));lg.forEach(z=>{const bl=(Array.isArray(z.bulan)?z.bulan:[]).filter(isYM);if(bl.indexOf(cb)<0)return;ls.push({n:z.nama||'Langganan',lg:1,v:typeof z.nominal==='number'?z.nominal:(it.length===1&&typeof y.total==='number'&&y.total>0?y.total:null),id:y.id})})});if(ls.some(l=>l.lg&&l.v!=null))ls=ls.filter(l=>!(l.lg&&l.v==null&&l.n==='Langganan'));const sum=ls.reduce((a,l)=>a+(l.v||0),0);
    return '<div class="mdetail"><div class="mdetail-head"><div><strong>'+esc(x.name)+' · '+mLabel(cb)+'</strong><span>'+ls.length+' item tercatat</span></div><button class="btn small" data-act="pcell" data-id="'+esc(x.id)+'" data-b="'+cb+'">Tutup</button></div>'+(ls.length?'<div class="mdetail-list">'+ls.map(l=>'<div class="mdetail-item"><span class="mdetail-name">'+esc(l.n)+'</span><span class="mdetail-val">'+(l.v!=null?rp(l.v):'Nominal belum diisi')+'</span>'+(ed?'<button class="btn small" data-act="pedit" data-id="'+esc(l.id)+'">Ubah</button>':'')+'</div>').join('')+'</div>'+(ls.length>1?'<div class="mdetail-total"><span>Total '+mLabel(cb)+'</span><strong>'+rp(sum)+'</strong></div>':''):'<div class="mdetail-empty">Tidak ada pembayaran di bulan ini.</div>')+'</div>'};
  const matrixRows=rows.map(x=>{const g=by[x.id]||{months:{},tamb:0,tn:0,tu:0,total:0,n:0,und:0},pr=(x.products||[]).map(y=>prodName(y.productId)).join(', ')||'Produk belum diisi',cb=f.cell&&f.cell.id===x.id&&f.cell.b?f.cell.b:null;
    return '<div class="mrow'+(cb?' is-open':'')+'"><div class="mwho"><div class="mwho-top"><strong>'+esc(x.name)+'</strong>'+(g.und?pill(g.und+' perlu dirinci','warn'):'')+'</div><span>'+esc(pr)+'</span></div><div class="mcells">'+months.map(b=>monthCell(x,g,cb,b)).join('')+'</div>'+(cb?monthDetail(x,cb):'')+'</div>'}).join('');
  const board='<section class="pay-board"><div class="pay-board-head"><div><h2>Status pembayaran '+yr+'</h2><p>Klik bulan berwarna untuk melihat rincian nominal per produk.</p></div><div class="pay-legend"><span><i class="lg"></i>Langganan</span><span><i class="ex"></i>Biaya tambahan</span><span><i class="in"></i>Transaksi / top up</span><em>Angka dalam rupiah</em></div></div><div class="pay-matrix-scroll" tabindex="0" role="region" aria-label="Status pembayaran bulanan, geser untuk melihat semua bulan"><div class="pay-matrix"><div class="mhead"><div class="mwho">Mitra</div><div class="mcells">'+months.map(b=>'<div class="mhead-mon'+(b===cur?' now':'')+'">'+BLN[+b.slice(5,7)-1]+'</div>').join('')+'</div></div>'+(matrixRows||'<div class="pay-empty"><strong>'+(mitra.length?'Tidak ada mitra yang cocok':'Belum ada mitra')+'</strong><span>'+(mitra.length?'Coba ubah kata kunci atau filter.':'Tambahkan mitra lewat tombol Tambah mitra baru.')+'</span></div>')+'</div></div></section>';
  const body='<div class="pay-page pay-status">'+mpHtml+tiles+board+'</div>';
  return{title:'Pembayaran Mitra',sub,action:ed?'<button class="btn" data-act="mn-toggle">Tambah mitra baru</button>':'',bar,body};
},
pipeline(){
  const f=S.f.pipeline,q=f.q.toLowerCase(),ls=S.leads.filter(l=>matchWho(l.am,f.who)&&(!f.src||(f.src==='lain'?!LSRC.includes(l.source):l.source===f.src))&&(!q||(l.name+' '+(l.city||'')).toLowerCase().includes(q)));
  const op=ls.filter(l=>!['menang','kalah'].includes(l.stage)),won=ls.filter(l=>l.stage==='menang').length,lost=ls.filter(l=>l.stage==='kalah').length;
  const wv=l=>(+l.estMrr||0)*stage(l.stage)[2]/100;
  const tv=op.reduce((a,l)=>a+(+l.estMrr||0),0),tw=op.reduce((a,l)=>a+wv(l),0),od=op.filter(l=>l.nextDate&&l.nextDate<today()).length,wr=won+lost?Math.round(won/(won+lost)*100):null;
  const sum='<div class="tiles"><div class="tile"><span>Lead terbuka</span><strong>'+op.length+'</strong><em>dari '+ls.length+' lead</em></div>'
    +'<div class="tile"><span>Nilai pipeline</span><strong>'+rpS(tv)+'</strong><em>per bulan · ARR '+rpS(tv*12)+'</em></div>'
    +'<div class="tile"><span>Nilai tertimbang</span><strong>'+rpS(tw)+'</strong><em>per bulan · peluang rata-rata '+(tv?Math.round(tw/tv*100):0)+'%</em></div>'
    +'<div class="tile"><span>Tingkat menang</span><strong>'+(wr==null?'–':wr+'%')+'</strong><em>'+won+' menang · '+lost+' kalah</em></div>'
    +'<div class="tile'+(od?' warnt':'')+'"><span>Perlu tindak lanjut</span><strong>'+od+'</strong><em>'+(od?'lewat tanggal langkah berikutnya':'tidak ada yang terlewat')+'</em></div></div>';
  const SRC_C={'Website (Live Preview)':'#4f8cf7','Daftar akun QMS':'#8b5cf6','Chat WA QRION':'#1f9d55','Leads Offline':'#f5a524','Lainnya':'#9aa4b2'};
  const srcRows=LSRC.map(x=>[x,ls.filter(l=>l.source===x).length]).concat([['Lainnya',ls.filter(l=>!LSRC.includes(l.source)).length]]),smx=Math.max(1,...srcRows.map(r=>r[1]));
  const stCn=STAGES.map(g=>[g,ls.filter(x=>(x.stage||'baru')===g[0])]);
  const srcLine='<div class="grid2" style="margin:14px 0">'
    +'<section class="panel"><header><h2>Sebaran per tahap</h2><small>'+ls.length+' lead</small></header><div class="fbar" role="img" aria-label="Sebaran lead per tahap">'+(ls.length?stCn.filter(c=>c[1].length).map(c=>'<span style="flex:'+c[1].length+';background:'+STAGE_C[c[0][0]]+'" title="'+esc(c[0][1])+': '+c[1].length+'"></span>').join(''):'<span style="flex:1;background:#d9dee5"></span>')+'</div>'
    +'<div class="stgl">'+stCn.map(c=>'<div><i style="background:'+STAGE_C[c[0][0]]+'"></i><span>'+esc(c[0][1])+'</span><b>'+c[1].length+'</b><small>'+rpS(c[1].reduce((a,x)=>a+(+x.estMrr||0),0))+'</small></div>').join('')+'</div></section>'
    +'<section class="panel"><header><h2>Sumber lead</h2><small>'+(ls.length?'dari mana lead datang':'')+'</small></header><div class="srcl">'+srcRows.map(r=>'<div><span class="sn">'+esc(r[0])+'</span><span class="sb"><span style="width:'+Math.round(r[1]/smx*100)+'%;background:'+SRC_C[r[0]]+'"></span></span><b>'+r[1]+'</b></div>').join('')+'</div></section></div>';
  const bar='<input type="search" data-f="pipeline.q" placeholder="Cari nama lead atau kota" aria-label="Cari lead" value="'+esc(f.q)+'">'+'<select data-f="pipeline.src" aria-label="Sumber lead">'+opt('','Semua sumber',f.src)+LSRC.map(x=>opt(x,x,f.src)).join('')+opt('lain','Sumber lain atau kosong',f.src)+'</select>'+whoSel('pipeline',f.who,'AM')+seg('pipeline',[['papan','Papan'],['daftar','Daftar']],f.mode)+csvBtn();
  const cols=[{l:'Lead',v:l=>l.name,h:l=>'<strong>'+esc(l.name)+'</strong><span class="sub">'+esc(l.city||'')+'</span>'},{l:'Kota',v:l=>l.city||'',csvOnly:1},{l:'Kontak',v:l=>l.contact||'',csvOnly:1},{l:'Sumber',v:l=>l.source||'',h:l=>l.source?'<span class="chip">'+esc(l.source)+'</span>':'—'},
    {l:'Tahap',v:l=>STAGES.indexOf(stage(l.stage)),c:l=>stage(l.stage)[1],h:l=>stPill(l.stage||'baru')},
    {l:'Perkiraan MRR (Rp)',num:1,v:l=>+l.estMrr||0,h:l=>rp(l.estMrr)},{l:'Tertimbang (Rp)',num:1,v:l=>wv(l),h:l=>rp(wv(l))},{l:'Perkiraan closing',v:l=>l.closeDate||'',h:l=>fmtD(l.closeDate)},
    {l:'Langkah berikutnya',v:l=>l.nextAction||'',h:l=>esc(l.nextAction||'—')+(l.nextDate?'<span class="sub'+(l.nextDate<today()&&!['menang','kalah'].includes(l.stage)?' err':'')+'">'+fmtD(l.nextDate)+'</span>':'')},{l:'AM',v:l=>nameOf(l.am)},{l:'Umur (hari)',num:1,v:l=>age(l)}];
  let body;
  if(!ls.length){S.csv=null;body='<div class="panel empty">'+(S.leads.length?'Tidak ada lead yang cocok dengan filter ini.':'Belum ada lead. Tambahkan lewat tombol Lead baru.')+'</div>'}
  else if(f.mode==='daftar')body=sum+srcLine+tbl('pipeline',cols,ls,'pipeline');
  else{S.csv={view:'pipeline',cols,rows:ls};    body=sum+srcLine+'<div class="board">'+STAGES.map(([k,l,pr])=>{const it=ls.filter(x=>(x.stage||'baru')===k);return '<section class="col" data-stage="'+k+'" style="--c:'+STAGE_C[k]+'"><header><span><i class="sdot"></i>'+l+' <small class="scount">'+it.length+'</small></span><small class="ssum">'+rpS(it.reduce((a,x)=>a+(+x.estMrr||0),0))+'</small></header>'
    +(it.map(x=>'<div class="card" role="button" tabindex="0" data-open="pipeline:'+esc(x.id)+'" data-drag="lead:'+esc(x.id)+'"><strong>'+esc(x.name)+'</strong><small>'+esc(x.city||'')+'</small><span>'+rp(x.estMrr)+' per bulan</span>'+(x.source?'<span><span class="chip">'+esc(x.source)+'</span></span>':'')+(x.nextAction?'<small class="'+(x.nextDate&&x.nextDate<today()&&pr>0&&pr<100?'err':'')+'">Berikutnya: '+esc(x.nextAction)+(x.nextDate?' · '+fmtD(x.nextDate):'')+'</small>':'')+(x.closeDate?'<small>Closing '+fmtD(x.closeDate)+'</small>':'')+'<small>'+esc(nameOf(x.am))+'</small></div>').join('')||'<small style="color:var(--ink2)">Kosong</small>')+'</section>'}).join('')+'</div>'}
  return{title:'Pipeline Leads',sub:'Nilai tertimbang memakai peluang tiap tahap. Seret kartu untuk memindahkan tahap.',action:addBtn('pipeline','Lead baru'),bar,body};
},
keluar(){
  const f=S.f.exp;if(!isYM(f.m))f.m=nowYM();const ym=f.m,prev=ymAdd(ym,-1),F=S.expForm;
  if(!own())return{title:'Uang Keluar',sub:'',body:'<div class="panel empty">Menu ini hanya untuk super admin.</div>'};
  const all=expMonth(ym),tot=expSum(all),ptot=expSum(expMonth(prev)),inc=S.pay.filter(x=>String(x.tanggal).slice(0,7)===ym).reduce((t,x)=>t+(+x.total||0),0);
  const q=f.q.trim().toLowerCase(),rows=all.filter(x=>(!f.cat||x.kategori===f.cat)&&(!q||(String(x.deskripsi||'')+' '+String(x.vendor||'')+' '+String(x.catatan||'')).toLowerCase().indexOf(q)>=0)).sort((a,b)=>a.tanggal<b.tanggal?1:a.tanggal>b.tanggal?-1:String(b.dibuat||'').localeCompare(String(a.dibuat||'')));
  const diff=ptot?Math.round((tot-ptot)/ptot*100):null,net=inc-tot;
  const bar='<span class="inline"><button class="btn small" data-act="ex-mo" data-d="-1" aria-label="Bulan sebelumnya">‹</button><input type="month" data-exf="m" value="'+esc(ym)+'" aria-label="Pilih bulan"><button class="btn small" data-act="ex-mo" data-d="1" aria-label="Bulan berikutnya">›</button><button class="btn small" data-act="ex-mo" data-d="0">Bulan ini</button></span>';
  const tiles='<div class="tiles" style="margin-bottom:18px"><div class="tile"><span>Uang keluar '+esc(ymLbl(ym))+'</span><strong>'+rp(tot)+'</strong><em>'+all.length+' catatan</em></div>'
    +'<div class="tile"><span>Dibanding bulan lalu</span><strong>'+(diff===null?'—':(diff>0?'+':'')+diff+'%')+'</strong><em>'+(ptot?'Bulan lalu '+rp(ptot):'Belum ada data bulan lalu')+'</em></div>'
    +'<div class="tile"><span>Pemasukan (pembayaran mitra)</span><strong>'+rp(inc)+'</strong><em>Tercatat di Pembayaran Mitra</em></div>'
    +'<div class="tile"><span>Selisih</span><strong class="'+(net<0?'err':'')+'" style="'+(net<0?'':'color:var(--ok,inherit)')+'">'+(net<0?'-':'')+rp(Math.abs(net))+'</strong><em>'+(net<0?'Pengeluaran lebih besar':'Pemasukan dikurangi pengeluaran')+'</em></div></div>';
  let formH='';
  if(F){formH='<section class="panel" style="margin-bottom:16px"><header><h2>'+(F.id?'Ubah pengeluaran':'Catat pengeluaran')+'</h2></header><div class="fields">'
    +'<div class="fld"><label for="ef-tgl">Tanggal</label><input type="date" id="ef-tgl" data-ef="tanggal" value="'+esc(F.tanggal)+'"></div>'
    +'<div class="fld"><label for="ef-kat">Kategori</label><select id="ef-kat" data-ef="kategori">'+EXP_CAT.map(k=>opt(k,k,F.kategori)).join('')+(F.kategori&&EXP_CAT.indexOf(F.kategori)<0?opt(F.kategori,F.kategori,F.kategori):'')+'</select></div>'
    +'<div class="fld wide"><label for="ef-des">Keterangan</label><input type="text" id="ef-des" data-ef="deskripsi" value="'+esc(F.deskripsi)+'" autocomplete="off" placeholder="mis. Server bulan November"></div>'
    +'<div class="fld"><label for="ef-jml">Jumlah (Rp)</label><input type="text" id="ef-jml" inputmode="numeric" data-ef="jumlah" value="'+esc(F.jumlah)+'" autocomplete="off" placeholder="mis. 2.500.000"></div>'
    +'<div class="fld"><label for="ef-ven">Dibayarkan ke (opsional)</label><input type="text" id="ef-ven" data-ef="vendor" value="'+esc(F.vendor)+'" autocomplete="off" placeholder="mis. Biznet, nama karyawan"></div>'
    +'<div class="fld wide"><label for="ef-bk">Tautan bukti (opsional)</label><input type="text" id="ef-bk" data-ef="bukti" value="'+esc(F.bukti)+'" autocomplete="off" placeholder="https://drive.google.com/..."></div>'
    +'<div class="fld wide"><label for="ef-cat">Catatan (opsional)</label><input type="text" id="ef-cat" data-ef="catatan" value="'+esc(F.catatan)+'" autocomplete="off"></div></div>'
    +'<label style="display:inline-flex;gap:8px;align-items:center;margin:4px 0"><input type="checkbox" data-efc="rutin"'+(F.rutin?' checked':'')+'> Pengeluaran rutin tiap bulan (bisa disalin ke bulan berikutnya)</label>'
    +'<div class="err" id="ef-err" hidden></div><div class="inline"><button class="btn primary" data-act="ex-save">Simpan</button>'+(F.id?'':'<button class="btn" data-act="ex-save" data-more="1">Simpan dan tambah lagi</button>')+'<button class="btn" data-act="ex-cancel">Batal</button></div></section>'}
  const byC={};all.forEach(x=>{const k=x.kategori||'Lainnya';byC[k]=(byC[k]||0)+(+x.jumlah||0)});const cl=Object.entries(byC).sort((a,b)=>b[1]-a[1]),mx=cl.length?cl[0][1]:0;
  const catP='<section class="panel"><header><h2>Per kategori</h2></header>'+(cl.length?cl.map(([k,v])=>expRow(k,v,mx,rp(v),Math.round(v/tot*100)+'% dari total')).join(''):'<div class="empty">Belum ada pengeluaran di bulan ini.</div>')+'</section>';
  const rutinPrev=expMonth(prev).filter(x=>x.rutin&&!all.some(y=>y.rutin&&y.deskripsi===x.deskripsi&&y.kategori===x.kategori));
  const cp=rutinPrev.length?'<div class="banner info" role="status">Ada '+rutinPrev.length+' pengeluaran rutin dari '+esc(ymLbl(prev))+' yang belum dicatat di bulan ini. <button class="btn small" data-act="ex-copy" data-confirm="Klik lagi: salin '+rutinPrev.length+' catatan">Salin '+rutinPrev.length+' catatan rutin</button></div>':'';
  const tb=rows.length?'<div class="tablewrap"><table><thead><tr><th>Tanggal</th><th>Kategori</th><th>Keterangan</th><th>Dibayarkan ke</th><th style="text-align:right">Jumlah</th><th></th></tr></thead><tbody>'+rows.map(x=>'<tr><td style="white-space:nowrap">'+esc(fmtD(x.tanggal))+'</td><td><span class="chip">'+esc(x.kategori||'Lainnya')+'</span></td><td>'+esc(x.deskripsi||'')+(x.rutin?' <span class="chip">Rutin</span>':'')+(/^https?:\/\//i.test(x.bukti||'')?' <a href="'+esc(x.bukti)+'" target="_blank" rel="noopener noreferrer">Bukti</a>':'')+(x.catatan?'<br><small style="color:var(--ink2)">'+esc(x.catatan)+'</small>':'')+'</td><td>'+esc(x.vendor||'—')+'</td><td style="text-align:right;white-space:nowrap">'+rp(x.jumlah)+'</td><td style="white-space:nowrap"><button class="btn small" data-act="ex-edit" data-id="'+esc(x.id)+'" aria-label="Ubah '+esc(x.deskripsi||'pengeluaran')+'">Ubah</button> <button class="btn small danger" data-act="ex-del" data-id="'+esc(x.id)+'" data-confirm="Klik lagi untuk hapus" aria-label="Hapus '+esc(x.deskripsi||'pengeluaran')+'">Hapus</button></td></tr>').join('')+'</tbody><tfoot><tr><td colspan="4"><strong>Total'+(rows.length!==all.length?' (hasil filter)':'')+'</strong></td><td style="text-align:right;white-space:nowrap"><strong>'+rp(expSum(rows))+'</strong></td><td></td></tr></tfoot></table></div>':'<div class="empty">'+(all.length?'Tidak ada catatan yang cocok dengan filter.':'Belum ada pengeluaran di '+esc(ymLbl(ym))+'. Tekan "Catat pengeluaran" untuk mulai.')+'</div>';
  S.csv=rows.length?{view:'uang-keluar-'+ym,rows,cols:[{l:'Tanggal',v:x=>x.tanggal},{l:'Kategori',v:x=>x.kategori},{l:'Keterangan',v:x=>x.deskripsi},{l:'Dibayarkan ke',v:x=>x.vendor||''},{l:'Jumlah (Rp)',v:x=>+x.jumlah||0},{l:'Rutin',v:x=>x.rutin?'Ya':''},{l:'Catatan',v:x=>x.catatan||''},{l:'Bukti',v:x=>x.bukti||''}]}:null;
  const flt='<span class="inline"><input type="search" data-f="exp.q" value="'+esc(f.q)+'" placeholder="Cari keterangan atau penerima" aria-label="Cari pengeluaran"><select data-f="exp.cat" aria-label="Filter kategori">'+opt('','Semua kategori',f.cat)+EXP_CAT.map(k=>opt(k,k,f.cat)).join('')+'</select>'+csvBtn()+'</span>';
  const body=tiles+formH+cp+'<div style="margin-bottom:16px">'+catP+'</div><section class="panel"><header><h2>Catatan '+esc(ymLbl(ym))+'</h2></header>'+tb+'</section>';
  return{title:'Uang Keluar',sub:'Catat semua pengeluaran QRION per bulan. Data ini hanya bisa dilihat super admin.',action:F?'':'<button class="btn primary" data-act="ex-new">Catat pengeluaran</button>',bar:bar+'<span class="inline" style="margin-top:8px">'+flt+'</span>',body};
},
akses(){
  const f=S.f.akses,list=S.schools.filter(x=>x.name).slice().sort((a,b)=>String(a.name).localeCompare(String(b.name),'id'));
  const head={title:'Akses Data',sub:'Lihat data QMS sekolah mitra (siswa beserta tagihan dan saldo kartu Oncard, guru) untuk memeriksa masalah sebelum menaikkannya ke programmer. Hanya baca.'};
  if(!list.length)return Object.assign(head,{body:'<div class="panel empty">Belum ada mitra sekolah. Tambahkan dulu di menu Mitra Sekolah.</div>'});
  let s=list.find(x=>x.id===f.sid);if(!s){s=list[0];f.sid=s.id}
  const key=s.id+'|'+f.tab;if(f._k!==key){f._k=key;f.q='';f.st='';f.kls='';f.pg=1;f.sel=null}
  const fk=f.q+'|'+f.st+'|'+f.kls;if(f._f!==fk){f._f=fk;f.pg=1}
  const tab=f.tab,q=f.q.trim().toLowerCase();
  const tabs='<span class="seg" role="group" aria-label="Jenis data QMS">'+AK_TABS.map(k=>'<button data-act="ak-tab" data-t="'+k+'" aria-pressed="'+(tab===k)+'">'+AK_KIND[k]+'</button>').join('')+'</span>';
  const pickS='<select data-f="akses.sid" aria-label="Pilih sekolah">'+list.map(x=>opt(x.id,x.name+(x.city?' ('+x.city+')':''),s.id)).join('')+'</select>';
  const D=akLoad(s,tab);let filt='',body='';
  const info='<div class="banner info" role="note" style="margin-bottom:14px">Sumber data: <strong>contoh</strong>. API QMS belum tersambung, jadi isi di bawah dibuat otomatis untuk uji tampilan dan bukan data siswa sebenarnya. Kata sandi akun tidak pernah ditampilkan, dan setiap pembukaan data tercatat di Log perubahan.</div>';
  const issue='';
  if(D.loading)body='<div class="panel empty" role="status">Memuat data dari QMS...</div>';
  else if(D.err)body='<div class="panel empty">Data tidak bisa diambil dari QMS. <button class="btn small" data-act="ak-retry">Coba lagi</button></div>';
  else if(tab==='ringkas'){const r=D.rows;
    body='<div class="tiles"><div class="tile"><span>Siswa</span><strong>'+fmtN(r.siswa)+'</strong><em>'+fmtN(r.aktif)+' aktif</em></div><div class="tile"><span>Laki-laki aktif</span><strong>'+fmtN(r.laki)+'</strong><em>&nbsp;</em></div><div class="tile"><span>Perempuan aktif</span><strong>'+fmtN(r.perempuan)+'</strong><em>&nbsp;</em></div><div class="tile"><span>Guru</span><strong>'+fmtN(r.guru)+'</strong><em>'+fmtN(r.guruAktif)+' aktif</em></div><div class="tile"><span>Tagihan belum lunas</span><strong>'+fmtN(r.tagihanBelum)+'</strong><em>'+rp(r.tagihanRp)+'</em></div><div class="tile"><span>Kartu Oncard</span><strong>'+fmtN(r.kartuN)+'</strong><em>Total saldo '+rp(r.kartuSaldo)+(r.kartuBlok?' · '+fmtN(r.kartuBlok)+' diblokir/hilang':'')+'</em></div></div>'
      +'<section class="panel" style="margin-top:16px"><header><h2>Profil di CRM</h2></header>'+dl([['Nama',esc(s.name)],['Kota',esc(s.city||'—')],['Jenjang',esc(s.jenjang||'—')],['Status mitra',esc(s.status||'—')],['Account Manager',esc(s.am?nameOf(s.am):'Belum ditugaskan')],['PIC sekolah',esc((s.picName||'—')+(s.picPhone?' / '+s.picPhone:''))],['ID di QMS',esc(s.qmsId||'Belum dipetakan')]])+'</section>';
  }else{
    const rows0=D.rows;let rows=rows0;
    if(tab==='siswa'){
      const ks=[...new Set(rows0.map(x=>x.kelas))].sort((a,b)=>a.localeCompare(b,'id',{numeric:true}));
      filt='<input type="search" data-f="akses.q" value="'+esc(f.q)+'" placeholder="Cari nama atau NIS" aria-label="Cari siswa"><select data-f="akses.st" aria-label="Filter status">'+opt('','Semua status',f.st)+['Aktif','Lulus','Pindah','Nonaktif'].map(x=>opt(x,x,f.st)).join('')+'</select><select data-f="akses.kls" aria-label="Filter kelas">'+opt('','Semua kelas',f.kls)+ks.map(x=>opt(x,x,f.kls)).join('')+'</select>';
      rows=rows0.filter(x=>(!f.st||x.status===f.st)&&(!f.kls||x.kelas===f.kls)&&(!q||(x.nama+' '+x.nis).toLowerCase().indexOf(q)>=0));
    }else if(tab==='guru'){
      filt='<input type="search" data-f="akses.q" value="'+esc(f.q)+'" placeholder="Cari nama atau mapel" aria-label="Cari guru"><select data-f="akses.st" aria-label="Filter status">'+opt('','Semua status',f.st)+['Aktif','Nonaktif'].map(x=>opt(x,x,f.st)).join('')+'</select>';
      rows=rows0.filter(x=>(!f.st||x.status===f.st)&&(!q||(x.nama+' '+x.mapel+' '+x.jabatan).toLowerCase().indexOf(q)>=0));
    }else if(tab==='tagihan'){
      filt='<input type="search" data-f="akses.q" value="'+esc(f.q)+'" placeholder="Cari nama siswa" aria-label="Cari tagihan siswa"><select data-f="akses.st" aria-label="Filter status">'+opt('','Semua status',f.st)+['Belum bayar','Sebagian','Lunas'].map(x=>opt(x,x,f.st)).join('')+'</select>';
      rows=rows0.filter(x=>(!f.st||x.status===f.st)&&(!q||x.siswa.toLowerCase().indexOf(q)>=0)).sort((a,b)=>a.periode<b.periode?1:a.periode>b.periode?-1:a.siswa.localeCompare(b.siswa,'id'));
    }else if(tab==='kartu'){
      filt='<input type="search" data-f="akses.q" value="'+esc(f.q)+'" placeholder="Cari nama siswa, NIS, atau nomor kartu" aria-label="Cari kartu Oncard"><select data-f="akses.st" aria-label="Filter status kartu">'+opt('','Semua status',f.st)+['Aktif','Diblokir','Hilang'].map(x=>opt(x,x,f.st)).join('')+'</select>';
      rows=rows0.filter(x=>(!f.st||x.status===f.st)&&(!q||(x.siswa+' '+x.nis+' '+x.noKartu).toLowerCase().indexOf(q)>=0)).sort((a,b)=>a.siswa.localeCompare(b.siswa,'id'));
    }
    const P=akPage(f,rows.length),vis=rows.slice(P.from,P.from+AK_PER);let th='',tr='';
    const btn=(id,nm)=>'<button class="btn small" data-act="ak-open" data-id="'+esc(id)+'" aria-label="Lihat detail '+esc(nm)+'">Detail</button>';
    if(tab==='siswa'){th='<th>Nama</th><th>NIS</th><th>Kelas</th><th>Jenis kelamin</th><th>Status</th><th>Telepon orang tua</th><th>Login terakhir</th><th></th>';tr=vis.map(x=>'<tr><td>'+esc(x.nama)+'</td><td>'+esc(x.nis)+'</td><td>'+esc(x.kelas)+'</td><td>'+esc(x.jk)+'</td><td>'+akSt(x.status)+'</td><td>'+esc(x.telpOrtu||'—')+'</td><td>'+esc(akLogin(x.login))+'</td><td>'+btn(x.id,x.nama)+'</td></tr>').join('')}
    else if(tab==='guru'){th='<th>Nama</th><th>NIP</th><th>Mapel</th><th>Jabatan</th><th>Telepon</th><th>Status</th><th>Login terakhir</th><th></th>';tr=vis.map(x=>'<tr><td>'+esc(x.nama)+'</td><td>'+esc(x.nip)+'</td><td>'+esc(x.mapel)+'</td><td>'+esc(x.jabatan)+'</td><td>'+esc(x.telp)+'</td><td>'+akSt(x.status)+'</td><td>'+esc(akLogin(x.login))+'</td><td>'+btn(x.id,x.nama)+'</td></tr>').join('')}
    else if(tab==='tagihan'){th='<th>Siswa</th><th>Kelas</th><th>Jenis</th><th>Periode</th><th style="text-align:right">Jumlah</th><th>Jatuh tempo</th><th>Status</th><th>Dibayar</th>';tr=vis.map(x=>'<tr><td>'+esc(x.siswa)+'</td><td>'+esc(x.kelas)+'</td><td>'+esc(x.jenis)+'</td><td>'+esc(ymLbl(x.periode))+'</td><td style="text-align:right;white-space:nowrap">'+rp(x.jumlah)+'</td><td>'+esc(akTgl(x.jatuhTempo))+'</td><td>'+akSt(x.status)+'</td><td>'+esc(akTgl(x.dibayar))+'</td></tr>').join('')}
    else if(tab==='kartu'){th='<th>Siswa</th><th>Kelas</th><th>No. kartu</th><th style="text-align:right">Saldo</th><th>Status kartu</th><th>Transaksi terakhir</th><th></th>';tr=vis.map(x=>'<tr><td>'+esc(x.siswa)+'</td><td>'+esc(x.kelas)+'</td><td>'+esc(x.noKartu)+'</td><td style="text-align:right;white-space:nowrap">'+rp(x.saldo)+'</td><td>'+akSt(x.status)+'</td><td>'+esc(akLogin(x.terakhir))+'</td><td>'+btn(x.id,x.siswa)+'</td></tr>').join('')}
    let det='';
    if(f.sel&&f.sel.kind===tab){const o=rows0.find(x=>x.id===f.sel.id);
      if(o){
        const body2=tab==='kartu'?dl([['Siswa',esc(o.siswa)],['NIS',esc(o.nis)],['Kelas',esc(o.kelas)],['No. kartu',esc(o.noKartu)],['Saldo','<strong>'+rp(o.saldo)+'</strong>'],['Limit harian',rp(o.limitHarian)],['Status kartu',akSt(o.status)]])+'<h3 style="font-size:15px;margin:14px 0 6px">Riwayat transaksi</h3><div class="tablewrap"><table><thead><tr><th>Waktu</th><th>Jenis</th><th>Keterangan</th><th style="text-align:right">Jumlah</th></tr></thead><tbody>'+o.trx.map(t=>'<tr><td>'+esc(akLogin(t.tgl))+'</td><td>'+esc(t.jenis)+'</td><td>'+esc(t.ket)+'</td><td style="text-align:right;white-space:nowrap">'+(t.jumlah>0?'+':'-')+rp(Math.abs(t.jumlah))+'</td></tr>').join('')+'</tbody></table></div>':tab==='siswa'?dl([['Nama',esc(o.nama)],['NIS',esc(o.nis)],['Kelas',esc(o.kelas)],['Jenis kelamin',esc(o.jk)],['Agama',esc(o.agama)],['Tanggal lahir',esc(akTgl(o.tglLahir))],['Status',akSt(o.status)],['Nama orang tua',esc(o.ortu)],['Telepon orang tua',esc(o.telpOrtu||'—')],['Login terakhir',esc(akLogin(o.login))],['Terdaftar sejak',esc(akTgl(o.dibuat))]]):dl([['Nama',esc(o.nama)],['NIP',esc(o.nip)],['Mapel',esc(o.mapel)],['Jabatan',esc(o.jabatan)],['Telepon',esc(o.telp)],['Email',esc(o.email)],['Status',akSt(o.status)],['Login terakhir',esc(akLogin(o.login))]]);
        let tg='';
        if(tab==='siswa'){const T=akLoad(s,'tagihan');
          if(T.rows){const mine=T.rows.filter(x=>x.siswaId===o.id).sort((a,b)=>a.periode<b.periode?1:-1);tg='<h3 style="font-size:15px;margin:14px 0 6px">Tagihan siswa ini</h3>'+(mine.length?'<div class="tablewrap"><table><thead><tr><th>Jenis</th><th>Periode</th><th style="text-align:right">Jumlah</th><th>Status</th><th>Dibayar</th></tr></thead><tbody>'+mine.map(x=>'<tr><td>'+esc(x.jenis)+'</td><td>'+esc(ymLbl(x.periode))+'</td><td style="text-align:right">'+rp(x.jumlah)+'</td><td>'+akSt(x.status)+'</td><td>'+esc(akTgl(x.dibayar))+'</td></tr>').join('')+'</tbody></table></div>':'<div class="empty">Belum ada tagihan.</div>')}
          else tg='<p role="status" style="color:var(--ink2)">Memuat tagihan...</p>'
          const K=akLoad(s,'kartu');
          if(K.rows){const k=K.rows.find(x=>x.siswaId===o.id);tg+='<h3 style="font-size:15px;margin:14px 0 6px">Kartu Oncard</h3>'+(k?dl([['No. kartu',esc(k.noKartu)],['Saldo','<strong>'+rp(k.saldo)+'</strong>'],['Limit harian',rp(k.limitHarian)],['Status kartu',akSt(k.status)]])+'<div class="tablewrap"><table><thead><tr><th>Waktu</th><th>Jenis</th><th>Keterangan</th><th style="text-align:right">Jumlah</th></tr></thead><tbody>'+k.trx.slice(0,5).map(t=>'<tr><td>'+esc(akLogin(t.tgl))+'</td><td>'+esc(t.jenis)+'</td><td>'+esc(t.ket)+'</td><td style="text-align:right;white-space:nowrap">'+(t.jumlah>0?'+':'-')+rp(Math.abs(t.jumlah))+'</td></tr>').join('')+'</tbody></table></div>':'<div class="empty">Siswa ini belum punya kartu Oncard.</div>')}
          else tg+='<p role="status" style="color:var(--ink2)">Memuat kartu Oncard...</p>'}
        det='<section class="panel" style="margin-bottom:16px"><header><h2>'+esc(o.nama||o.siswa)+'</h2></header>'+body2+tg+'<div class="inline" style="margin-top:12px">'+'<button class="btn" data-act="ak-close">Tutup</button></div></section>'}}
    body=det+'<section class="panel"><header><h2>'+AK_KIND[tab]+' <small style="font-weight:400;color:var(--ink2)">'+fmtN(rows.length)+(rows.length!==rows0.length?' dari '+fmtN(rows0.length):'')+' data</small></h2></header>'
      +(tab==='kartu'?'<div class="tiles" style="margin-bottom:12px"><div class="tile"><span>Total saldo kartu</span><strong>'+rp(rows.reduce((t,x)=>t+x.saldo,0))+'</strong><em>'+fmtN(rows.length)+' kartu'+(rows.length!==rows0.length?' (sesuai filter)':'')+'</em></div><div class="tile"><span>Saldo rata-rata</span><strong>'+rp(rows.length?Math.round(rows.reduce((t,x)=>t+x.saldo,0)/rows.length):0)+'</strong><em>per kartu</em></div><div class="tile"><span>Saldo nol</span><strong>'+fmtN(rows.filter(x=>x.saldo===0).length)+'</strong><em>kartu</em></div></div>':'')
      +(tab==='tagihan'?'<p style="margin:0 0 8px;color:var(--ink2)">Belum lunas: '+fmtN(rows.filter(x=>x.status!=='Lunas').length)+' tagihan, sisa '+rp(rows.filter(x=>x.status!=='Lunas').reduce((t,x)=>t+x.jumlah-(x.dibayarRp||0),0))+'</p>':'')
      +(rows.length?'<div class="tablewrap"><table><thead><tr>'+th+'</tr></thead><tbody>'+tr+'</tbody></table></div>'+P.nav:'<div class="empty">'+(rows0.length?'Tidak ada data yang cocok dengan filter.':'Belum ada data.')+'</div>')+'</section>';
  }
  const api='<details class="panel" style="margin-top:16px"><summary style="cursor:pointer;font-weight:600">Untuk programmer: kontrak API QMS (baca-saja)</summary><p style="color:var(--ink2)">Menu ini memakai lapisan <code>QMS.fetch</code>. Saat API sudah ada, cukup ganti isi fungsi itu dengan pemanggilan ke endpoint di bawah.</p><pre tabindex="0" style="background:rgba(0,0,0,.05);padding:12px;border-radius:12px;overflow:auto;font-size:12px;line-height:1.5;white-space:pre">'+esc(AK_API)+'</pre></details>';
  return Object.assign(head,{action:issue,bar:'<span class="inline">'+pickS+tabs+'</span>'+(filt?'<span class="inline" style="margin-top:8px">'+filt+'</span>':''),body:info+body+api});
},
absen(){
  const f=S.f.abs;if(!f.m)f.m=nowYM();if(!f.d)f.d=today();if(f.tab==='tim'&&!canAbsTeam())f.tab='saya';
  const tabs='<span class="seg" role="group" aria-label="Bagian Absen"><button data-act="abs-tab" data-t="saya" aria-pressed="'+(f.tab==='saya')+'">Absen saya</button>'+(canAbsTeam()?'<button data-act="abs-tab" data-t="tim" aria-pressed="'+(f.tab==='tim')+'">Rekap tim</button>':'')+'</span>';
  const t0=today(),cfg=absCfg(),mine=me.id?S.abs.filter(x=>x.uid===me.id):[];
  if(f.tab==='saya'){
    const td=me.id?absOf(t0,me.id):null,open=mine.filter(x=>x.masuk&&!x.pulang&&x.tanggal<t0&&!absNoTime(x)).sort((a,b)=>a.tanggal<b.tanggal?1:-1);
    let card;
    if(!me.id)card='<div class="empty">Identitas Anda belum terbaca. Muat ulang halaman.</div>';
    else if(!td)card='<div class="fields"><div class="fld"><label for="ab-st">Status kehadiran</label><select id="ab-st" data-abf="st">'+Object.keys(ABS_ST).map(k=>opt(k,ABS_ST[k][0],f.st)).join('')+'</select></div><div class="fld"><label for="ab-cat">Catatan (opsional)</label><input type="text" id="ab-cat" data-abf="cat" placeholder="'+(absNoTime({status:f.st})?'Alasan singkat':'mis. Rapat dengan sekolah')+'" value="'+esc(f.cat)+'" autocomplete="off"></div></div><div><button class="btn primary" data-act="abs-in" style="padding:12px 22px;font-size:15px">'+(absNoTime({status:f.st})?'Simpan '+ABS_ST[f.st][0].toLowerCase():'Check in sekarang')+'</button></div>';
    else{const st=ABS_ST[td.status]||ABS_ST.hadir,lm=lateMin(td);
      card='<div class="inline" style="gap:10px">'+pill(st[0],st[1])+(lm?pill('Terlambat '+lm+' menit','crit'):td.masuk&&!absNoTime(td)?pill('Tepat waktu','good'):'')+'</div>'
        +(absNoTime(td)?'<p style="margin:0">Tercatat '+esc(st[0].toLowerCase())+' hari ini.'+(td.catatan?' '+esc(td.catatan):'')+'</p>'
          :'<div class="tiles" style="grid-template-columns:repeat(auto-fit,minmax(120px,1fr))"><div class="tile"><span>Masuk</span><strong>'+hhmm(td.masuk)+'</strong></div><div class="tile"><span>Pulang</span><strong>'+hhmm(td.pulang)+'</strong></div><div class="tile"><span>Durasi</span><strong style="font-size:22px">'+(td.pulang?durTxt(td):'berjalan')+'</strong></div></div>'+(td.catatan?'<p style="margin:0;color:var(--ink2)">'+esc(td.catatan)+'</p>':''))
        +'<div class="inline">'+(td.masuk&&!td.pulang&&!absNoTime(td)?'<button class="btn primary" data-act="abs-out" style="padding:12px 22px;font-size:15px">Check out</button>':'')+'<button class="btn small danger" data-act="abs-undo" data-id="'+esc(td.id)+'" data-confirm="Klik lagi untuk membatalkan">Batalkan absen hari ini</button></div>'}
    const ym=f.m,ms=mine.filter(x=>String(x.tanggal).slice(0,7)===ym).sort((a,b)=>a.tanggal<b.tanggal?1:-1);
    const cnt=k=>ms.filter(x=>x.status===k).length,lt=ms.filter(x=>lateMin(x)>0).length,tot=ms.reduce((a,x)=>a+(absMin(x)||0),0);
    const tiles='<div class="tiles"><div class="tile"><span>Hadir di kantor</span><strong>'+cnt('hadir')+'</strong><em>'+lt+' kali terlambat</em></div><div class="tile"><span>WFH dan dinas</span><strong>'+(cnt('wfh')+cnt('dinas'))+'</strong></div><div class="tile"><span>Izin dan sakit</span><strong>'+(cnt('izin')+cnt('sakit'))+'</strong></div><div class="tile"><span>Total jam kerja</span><strong>'+Math.floor(tot/60)+' j</strong></div></div>';
    const fix=open.slice(0,3).map(x=>'<div class="banner info" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><span>Anda belum check out pada '+esc(absShort(x.tanggal))+' (masuk '+hhmm(x.masuk)+').</span><input type="time" id="abt-'+esc(x.id)+'" value="'+esc(cfg.jamPulang)+'" aria-label="Jam pulang"><button class="btn small" data-act="abs-fix" data-id="'+esc(x.id)+'">Isi jam pulang</button></div>').join('');
    const rows=ms.map(x=>{const st=ABS_ST[x.status]||ABS_ST.hadir,lm=lateMin(x);return '<tr><td>'+esc(absShort(x.tanggal))+'</td><td>'+pill(st[0],st[1])+'</td><td>'+hhmm(x.masuk)+(lm?' <small style="color:var(--crit)">+'+lm+' mnt</small>':'')+'</td><td>'+(x.masuk&&!x.pulang&&!absNoTime(x)?'<small style="color:var(--warn)">belum check out</small>':hhmm(x.pulang))+'</td><td>'+durTxt(x)+'</td><td>'+esc(x.catatan||'')+'</td></tr>'}).join('');
    const body='<div class="grid2"><section class="panel"><header><h2>'+esc(absDay(t0))+'</h2></header><div class="abclk" id="abclk" aria-live="off">'+hhmm(new Date().toISOString())+'</div><p style="margin:0;color:var(--ink2);font-size:13px">Jam kerja '+esc(cfg.jamMasuk)+' sampai '+esc(cfg.jamPulang)+', toleransi '+(+cfg.toleransi||0)+' menit. Waktu diambil dari jam perangkat Anda.</p>'+card+'</section>'
      +'<section class="panel"><header><h2>Ringkasan bulan ini</h2><input type="month" data-abf="m" value="'+esc(ym)+'" aria-label="Pilih bulan"></header>'+tiles+'</section></div>'+fix
      +'<section class="panel" style="margin-top:14px"><header><h2>Riwayat absen saya</h2></header>'+(rows?'<div style="overflow-x:auto"><table><thead><tr><th>Tanggal</th><th>Status</th><th>Masuk</th><th>Pulang</th><th>Durasi</th><th>Catatan</th></tr></thead><tbody>'+rows+'</tbody></table></div>':'<div class="empty">Belum ada absen pada bulan ini.</div>')+'</section>';
    return{title:'Absen',sub:'Check in saat mulai bekerja dan check out saat selesai.',bar:tabs,body}}
  // tim
  S.csv=null;
  const ids=[...new Set(members().concat(S.abs.map(x=>x.uid).filter(Boolean)))],dd=f.d,dayAbs=S.abs.filter(x=>x.tanggal===dd);
  const wk=new Date(dd+'T00:00:00').getDay(),weekend=wk===0||wk===6;
  const dRows=ids.map(u=>[u,absOf(dd,u)]).sort((a,b)=>(a[1]?0:1)-(b[1]?0:1)||nameOf(a[0]).localeCompare(nameOf(b[0])));
  const inN=dayAbs.length,lateN=dayAbs.filter(x=>lateMin(x)>0).length,offN=dayAbs.filter(absNoTime).length,remN=dayAbs.filter(x=>x.status==='wfh'||x.status==='dinas').length;
  const dtiles='<div class="tiles"><div class="tile"><span>Sudah absen</span><strong>'+inN+' / '+ids.length+'</strong></div><div class="tile"><span>Terlambat</span><strong>'+lateN+'</strong></div><div class="tile"><span>WFH dan dinas</span><strong>'+remN+'</strong></div><div class="tile"><span>Izin dan sakit</span><strong>'+offN+'</strong></div></div>';
  const dTbl='<div style="overflow-x:auto"><table><thead><tr><th>Karyawan</th><th>Status</th><th>Masuk</th><th>Pulang</th><th>Durasi</th><th>Catatan</th><th></th></tr></thead><tbody>'+dRows.map(([u,x])=>{if(!x)return '<tr><td>'+esc(nameOf(u))+'</td><td>'+pill(weekend?'Akhir pekan':'Belum absen','')+'</td><td>—</td><td>—</td><td>—</td><td></td><td></td></tr>';const st=ABS_ST[x.status]||ABS_ST.hadir,lm=lateMin(x);return '<tr><td>'+esc(nameOf(u)||x.nama||'—')+'</td><td>'+pill(st[0],st[1])+'</td><td>'+hhmm(x.masuk)+(lm?' <small style="color:var(--crit)">+'+lm+' mnt</small>':'')+'</td><td>'+hhmm(x.pulang)+'</td><td>'+durTxt(x)+'</td><td>'+esc(x.catatan||'')+'</td><td>'+(canAbsAdm()?'<button class="btn small danger" data-act="abs-del" data-id="'+esc(x.id)+'" data-confirm="Klik lagi untuk menghapus">Hapus</button>':'')+'</td></tr>'}).join('')+'</tbody></table></div>';
  const ym=f.m,mAbs=S.abs.filter(x=>String(x.tanggal).slice(0,7)===ym);
  const rec=ids.map(u=>{const a=mAbs.filter(x=>x.uid===u);return{u,n:nameOf(u),h:a.filter(x=>x.status==='hadir').length,w:a.filter(x=>x.status==='wfh').length,d:a.filter(x=>x.status==='dinas').length,i:a.filter(x=>x.status==='izin').length,s:a.filter(x=>x.status==='sakit').length,t:a.filter(x=>lateMin(x)>0).length,j:Math.round(a.reduce((q,x)=>q+(absMin(x)||0),0)/6)/10}}).sort((a,b)=>a.n.localeCompare(b.n));
  S.csv=rec.length?{view:'absen-'+ym,rows:rec,cols:[{l:'Karyawan',v:r=>r.n},{l:'Hadir',v:r=>r.h},{l:'WFH',v:r=>r.w},{l:'Dinas luar',v:r=>r.d},{l:'Izin',v:r=>r.i},{l:'Sakit',v:r=>r.s},{l:'Terlambat',v:r=>r.t},{l:'Total jam',v:r=>r.j}]}:null;
  const rTbl='<div style="overflow-x:auto"><table><thead><tr><th>Karyawan</th><th>Hadir</th><th>WFH</th><th>Dinas</th><th>Izin</th><th>Sakit</th><th>Terlambat</th><th>Total jam</th></tr></thead><tbody>'+rec.map(r=>'<tr><td>'+esc(r.n)+'</td><td>'+r.h+'</td><td>'+r.w+'</td><td>'+r.d+'</td><td>'+r.i+'</td><td>'+r.s+'</td><td>'+(r.t?'<b style="color:var(--crit)">'+r.t+'</b>':0)+'</td><td>'+r.j+'</td></tr>').join('')+'</tbody></table></div>';
  const cfgp='';
  const body=dtiles+'<section class="panel" style="margin-top:14px"><header><h2>Absen harian</h2><input type="date" data-abf="d" value="'+esc(dd)+'" aria-label="Pilih tanggal"></header>'+dTbl+'</section>'
    +'<section class="panel" style="margin-top:14px"><header><h2>Rekap bulanan</h2><span class="inline"><input type="month" data-abf="m" value="'+esc(ym)+'" aria-label="Pilih bulan">'+csvBtn()+'</span></header>'+(rec.length?rTbl:'<div class="empty">Belum ada data.</div>')+'</section>'+cfgp;
  return{title:'Absen',sub:'Kehadiran tim: harian dan rekap bulanan.',bar:tabs,body}},
catatan(){
  const f=S.f.cat,q=f.q.trim().toLowerCase(),all=S.cat.slice().sort((a,b)=>String(b.diubah||b.dibuat||'').localeCompare(String(a.diubah||a.dibuat||'')));
  const list=all.filter(x=>!q||String(x.teks||'').toLowerCase().indexOf(q)>=0);
  if(!f.sel||(f.sel!=='new'&&!all.some(x=>x.id===f.sel)))f.sel=all.length?all[0].id:null;
  const cur=f.sel==='new'?{id:'new',teks:''}:all.find(x=>x.id===f.sel),t0=today();
  let h='',grp='';
  list.forEach(x=>{const d=String(x.diubah||x.dibuat||'').slice(0,10),n=d?days(d,t0):99,g=n<=0?'Hari ini':n===1?'Kemarin':n<=7?'7 hari terakhir':n<=30?'30 hari terakhir':'Lebih lama';if(g!==grp){grp=g;h+='<div class="nt-g">'+g+'</div>'}
    h+=ntItem(x,x.id===f.sel)});
  const left='<div class="nt-l" id="ntl">'+(f.sel==='new'?ntItem({id:'new',teks:''},true):'')+(h||(f.sel==='new'?'':'<div class="nt-g">'+(all.length?'Tidak ada yang cocok':'Belum ada catatan')+'</div>'))+'</div>';
  const right=cur?'<div class="nt-r"><div class="nt-bar"><span id="ntdate">'+(cur.diubah?'Diubah '+fmtDT(cur.diubah):'Catatan baru')+'</span><span class="sp"></span><span id="ntst"></span><button class="btn small danger" data-act="cat-del" data-confirm="Klik lagi untuk menghapus">Hapus</button></div><textarea id="nt-text" data-cn="1" placeholder="Tulis di sini. Baris pertama jadi judul." aria-label="Isi catatan">'+esc(cur.teks||'')+'</textarea></div>'
    :'<div class="nt-r"><div class="nt-e"><div><p style="margin:0 0 12px">Belum ada catatan yang dipilih.</p><button class="btn primary" data-act="cat-new">Catatan baru</button></div></div></div>';
  return{title:'Catatan',sub:'Catatan pribadi, hanya Anda yang bisa membukanya.',action:'<div><button class="btn primary" data-act="cat-new">Catatan baru</button></div>',bar:'<input type="search" data-f="cat.q" placeholder="Cari catatan" aria-label="Cari catatan" value="'+esc(f.q)+'">',body:'<div class="nt">'+left+right+'</div>'};
},
tim(){
  const adm=isAdmin();
  if(!S.prodDraft)S.prodDraft=S.products.map(p=>({id:p.id,name:p.name}));
  const used=id=>S.schools.some(s=>(s.products||[]).some(p=>p.productId===id));
  const A=S.accDraft||(S.accDraft=JSON.parse(JSON.stringify(ACC()))),homes=VIEWS.filter(v=>v[0]!=='tim'&&v[0]!=='catatan'&&v[0]!=='absen'&&v[0]!=='keluar');
  const acc='<section class="panel" style="grid-column:1/-1"><header><h2>Peran dan hak akses</h2></header><p style="margin:0;color:var(--ink2)">Tentukan menu yang bisa dibuka tiap peran dan sejauh apa. Perubahan berlaku setelah disimpan.</p><div class="set-table"><table style="min-width:1040px"><thead><tr><th>Peran</th>'+MODS.map(m=>'<th>'+m[1]+'</th>').join('')+'<th>Halaman pertama</th><th></th></tr></thead><tbody>'
    +Object.keys(A).map(k=>{const r=A[k],n=Object.values(S.roles).filter(x=>x===k).length+S.accounts.filter(a=>a.role===k).length,ek=esc(k);return '<tr><td><input type="text" id="ac-n-'+ek+'" data-ack="'+ek+'" data-acf="name" value="'+esc(r.name)+'" aria-label="Nama peran" style="min-width:160px"><span class="sub">'+n+' karyawan</span></td>'
        +MODS.map(m=>'<td><select id="ac-'+ek+'-'+m[0]+'" data-ack="'+ek+'" data-acm="'+m[0]+'" aria-label="'+m[1]+' untuk '+esc(r.name)+'">'+m[2].map(o=>opt(o[0],o[1],+(r.access||{})[m[0]]||0)).join('')+'</select></td>').join('')
        +'<td><select id="ac-h-'+ek+'" data-ack="'+ek+'" data-acf="home" aria-label="Halaman pertama">'+homes.map(v=>opt(v[0],v[1],r.home)).join('')+'</select></td><td><button class="btn small danger" data-act="acc-del" data-k="'+ek+'"'+(n?' disabled title="Masih dipakai karyawan"':'')+'>Hapus</button></td></tr>'}).join('')
    +'</tbody></table></div><div class="inline"><button class="btn" data-act="acc-add">Tambah peran</button><button class="btn primary" data-act="acc-save">Simpan hak akses</button><button class="btn" data-act="acc-reset">Batalkan perubahan</button></div>'
    +'<p style="margin:0;color:var(--ink2);font-size:12.5px">Isu: "Buat tiket" berarti mengajukan dan memvalidasi keluhan, "Tangani tiket" berarti juga mengambil tiket dan mengirim solusi. Project: "Perbarui tugas" berarti mengubah status tugas dan mencatat aktivitas, "Kelola project" berarti juga membuat project dan menentukan pelaksana. Menghapus data dan membuka menu Pengaturan hanya bisa dilakukan super admin.</p></section>';
  const team='<section class="panel" style="grid-column:1/-1"><header><h2>Karyawan</h2></header><p style="margin:0;color:var(--ink2)">Karyawan muncul di sini setelah diundang lewat menu Share dan membuka halaman CRM sekali. Sebelum diberi peran, mereka belum bisa membuka menu apa pun.</p><div class="rows">'
    +members().filter(id=>!isAcc(id)).map(id=>{const r=S.roles[id]||'';return '<div class="rowi" style="cursor:default"><span><span class="t">'+esc(S.names[id]||(id===me.id?'Anda':'Karyawan'))+'</span>'+(id===me.id?'<small>Super admin</small>':'')+'</span><select data-role="'+esc(id)+'" aria-label="Peran">'+opt('','Belum ditentukan',r)+Object.keys(ACC()).map(k=>opt(k,ACC()[k].name,r)).join('')+(r&&!ACC()[r]?opt(r,'Peran dihapus',r):'')+'</select></div>'}).join('')+'</div></section>';
  const prod='<section class="panel" style="grid-column:1/-1"><header><h2>Daftar produk</h2></header>'+(adm?S.prodDraft.map((p,i)=>'<div class="inline"><input type="text" id="prod-'+i+'" data-pi="'+i+'" value="'+esc(p.name)+'" placeholder="Nama produk" aria-label="Nama produk"><button class="btn small danger" data-act="prod-del" data-i="'+i+'"'+(used(p.id)?' disabled title="Masih dipakai sekolah"':'')+'>Hapus</button></div>').join('')+'<div class="inline"><button class="btn" data-act="prod-add">Tambah produk</button><button class="btn primary" data-act="prod-save">Simpan daftar produk</button></div>'
    :(S.products.map(p=>'<span class="chip">'+esc(p.name)+'</span>').join('')||'<div class="empty">Belum ada produk.</div>'))+'</section>';
  const ppl='<section class="panel"><header><h2>Daftar pelaksana project</h2></header><p style="margin:0;color:var(--ink2)">Nama di sini menjadi pilihan dropdown "Ditugaskan kepada" pada project dan tugas.</p>'+(adm?'<div class="inline"><input type="text" id="ppl-in" value="'+esc(S.people.join(', '))+'" aria-label="Nama pelaksana, pisahkan dengan koma"><button class="btn primary" data-act="ppl-save">Simpan daftar</button></div><small style="color:var(--ink2)">Pisahkan nama dengan koma.</small>':S.people.map(x=>'<span class="chip">'+esc(x)+'</span>').join(''))+'</section>';
  const amp='<section class="panel"><header><h2>Daftar Account Manager</h2></header><p style="margin:0;color:var(--ink2)">Nama di sini menjadi pilihan AM pada mitra sekolah, isu, dan leads, di samping anggota yang sudah punya akun.</p>'+(adm?'<div class="inline"><input type="text" id="am-in" value="'+esc(S.ams.join(', '))+'" placeholder="Contoh: Budi, Sari" aria-label="Nama AM, pisahkan dengan koma"><button class="btn primary" data-act="am-save">Simpan daftar</button></div><small style="color:var(--ink2)">Pisahkan nama dengan koma.</small>':(S.ams.map(x=>'<span class="chip">'+esc(x)+'</span>').join('')||'<div class="empty">Belum ada nama.</div>'))+'</section>';
  const ip=S.invSet||{},upl=(k,l)=>'<div class="fld"><label for="is-'+k+'">'+l+'</label>'+(ip[k]?'<img src="'+esc(ip[k])+'" alt="" style="max-height:70px;max-width:220px;object-fit:contain;display:block;margin:4px 0;background:#fff;border-radius:8px;padding:6px">':'')+(adm&&S.assets?'<div class="inline"><label class="btn small attbtn">'+(ip[k]?'Ganti':'Unggah')+' gambar<input type="file" id="is-'+k+'" accept="image/*" hidden data-up="'+k+'"></label>'+(ip[k]?'<button class="btn small" data-act="is-clear" data-k="'+k+'">Hapus</button>':'')+'</div>':'')+'</div>',
    invp='<section class="panel" style="grid-column:1/-1"><header><h2>Data penerbit invoice</h2></header><p style="margin:0;color:var(--ink2)">Dipakai pada setiap invoice untuk mitra.</p>'+(adm?'<div class="fields"><div class="fld"><label for="is-nama">Nama perusahaan</label><input type="text" id="is-nama" value="'+esc(ip.nama||'')+'" placeholder="PT ..."></div><div class="fld"><label for="is-kontak">Telepon atau email</label><input type="text" id="is-kontak" value="'+esc(ip.kontak||'')+'"></div></div><div class="fld"><label for="is-alamat">Alamat</label><textarea id="is-alamat" rows="3">'+esc(ip.alamat||'')+'</textarea></div><div class="fld"><label for="is-rek">Metode pembayaran (bank, nomor rekening, atas nama)</label><textarea id="is-rek" rows="4">'+esc(ip.rekening||'')+'</textarea></div><div class="fld"><label for="is-cat">Keterangan default (opsional)</label><textarea id="is-cat" rows="2">'+esc(ip.catatan||'')+'</textarea></div><div class="fields"><div class="fld"><label for="is-ttdn">Nama penandatangan</label><input type="text" id="is-ttdn" value="'+esc(ip.penandatangan||'')+'"></div><div class="fld"><label for="is-mulai">Nomor invoice berikutnya</label><input type="text" inputmode="numeric" id="is-mulai" value="'+esc(ip.mulai||'')+'" placeholder="mis. 270"></div></div>':'')+upl('logo','Logo')+upl('ttd','Tanda tangan dan stempel')+(adm?'<div><button class="btn primary" data-act="is-save">Simpan</button></div>':'')+'</section>';
  const F=S.acForm||(S.acForm={mode:'add',nama:'',username:'',password:'',role:Object.keys(ACC())[0]||'',u:''}),rk=Object.keys(ACC());
  const alist=S.accounts.slice().sort((x,y)=>x.id<y.id?-1:1);
  const cfg=absCfg();
  const absp=own()?'<section class="panel" style="grid-column:1/-1"><header><h2>Jam kerja absen</h2></header><p style="margin:0;color:var(--ink2);font-size:13px">Dipakai menu Absen untuk menandai terlambat. Berlaku untuk semua karyawan.</p><div class="fields"><div class="fld"><label for="as-m">Jam masuk</label><input type="time" id="as-m" value="'+esc(cfg.jamMasuk)+'"></div><div class="fld"><label for="as-p">Jam pulang</label><input type="time" id="as-p" value="'+esc(cfg.jamPulang)+'"></div><div class="fld"><label for="as-t">Toleransi terlambat (menit)</label><input type="number" id="as-t" min="0" max="120" value="'+(+cfg.toleransi||0)+'"></div></div><div><button class="btn primary" data-act="abs-set">Simpan jam kerja</button></div></section>':'';
  const impp=adm?'<section class="panel" style="grid-column:1/-1"><header><h2>Impor data dari Excel (.xlsx)</h2></header><p style="margin:0;color:var(--ink2)">Masukkan data mitra, pembayaran, dan leads yang sudah ada sekaligus, tanpa mengetik ulang. Unduh template, isi di Excel atau Google Sheets, simpan sebagai .xlsx, lalu unggah di sini. Anda akan melihat ringkasan dan daftar masalah dulu, data baru tersimpan setelah Anda menekan Impor.</p><div class="inline">'+(S.dl?'<button class="btn" data-act="imp-tpl">Unduh template</button>':'')+'<button class="btn primary" data-act="imp-pick">Pilih file .xlsx</button><input type="file" id="imp-file" hidden accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" aria-label="Pilih file xlsx untuk diimpor"></div>'+(S.dl?'':'<p style="margin:0;color:var(--ink2);font-size:13px">Unduhan template tidak tersedia pada tampilan ini. Buka CRM dari halaman penuh untuk mengunduhnya.</p>')+(S.imp?impPanel():'')+'</section>':'';
  const login='<section class="panel" style="grid-column:1/-1"><header><h2>Akun login</h2></header><p style="margin:0;color:var(--ink2)">Buat username dan password untuk tiap karyawan. Mereka masuk lewat halaman login memakai akun ini, dan menu yang terbuka mengikuti peran yang dipilih di sini. Akun juga muncul sebagai pilihan AM, penanggung jawab, dan pelapor di menu lain. Untuk Account Manager, kolom Nama AM boleh dibiarkan \"Akun ini sendiri\", atau diisi bila AM itu sudah tercatat dengan nama lain.</p>'
    +(alist.length?'<div class="set-table"><table><thead><tr><th>Nama</th><th>Username</th><th>Peran</th><th>Nama AM</th><th>Status</th><th></th></tr></thead><tbody>'+alist.map(a=>'<tr><td>'+esc(a.nama||'—')+'</td><td>@'+esc(a.id)+'</td><td><select data-acrole="'+esc(a.id)+'" aria-label="Peran '+esc(a.id)+'">'+rk.map(k=>opt(k,ACC()[k].name,a.role)).join('')+(a.role==='admin'?opt('admin','Super Admin',a.role):a.role&&!ACC()[a.role]?opt(a.role,'Peran dihapus',a.role):'')+'</select></td><td><select data-acam="'+esc(a.id)+'" aria-label="Nama AM untuk '+esc(a.id)+'">'+opt('','Akun ini sendiri',a.am||'')+amList().map(u=>opt(u,nameOf(u),a.am||'')).join('')+(a.am&&!amList().includes(a.am)?opt(a.am,nameOf(a.am),a.am):'')+'</select></td><td>'+(a.aktif===false?pill('Nonaktif','warn'):pill('Aktif','ok'))+'</td><td style="white-space:nowrap"><button class="btn small" data-act="ac-reset" data-u="'+esc(a.id)+'">Atur ulang sandi</button> <button class="btn small" data-act="ac-toggle" data-u="'+esc(a.id)+'">'+(a.aktif===false?'Aktifkan':'Nonaktifkan')+'</button> <button class="btn small danger" data-act="ac-del" data-u="'+esc(a.id)+'" data-confirm="Klik lagi untuk menghapus">Hapus</button></td></tr>').join('')+'</tbody></table></div>':'<div class="empty">Belum ada akun login.</div>')
    +'<form id="acf" autocomplete="off"><div class="box"><h3>'+(F.mode==='reset'?'Atur ulang sandi @'+esc(F.u):'Tambah akun')+'</h3><div class="acform">'
    +(F.mode==='add'?'<div class="fld"><label for="ac-nama">Nama lengkap</label><input type="text" id="ac-nama" data-lf="nama" value="'+esc(F.nama)+'" placeholder="mis. Dila"></div><div class="fld"><label for="ac-user">Username</label><input type="text" id="ac-user" data-lf="username" value="'+esc(F.username)+'" placeholder="huruf kecil, angka, titik" autocapitalize="none" spellcheck="false"></div>':'')
    +'<div class="fld"><label for="ac-pass">'+(F.mode==='reset'?'Sandi baru':'Sandi awal')+' (min. 10 karakter)</label><input type="text" id="ac-pass" data-lf="password" value="'+esc(F.password)+'" autocomplete="off" spellcheck="false"></div>'
    +(F.mode==='add'?'<div class="fld"><label for="ac-role">Peran</label><select id="ac-role" data-lf="role">'+rk.map(k=>opt(k,ACC()[k].name,F.role)).join('')+'</select></div>':'')
    +'<div class="inline"><button class="btn" type="button" data-act="ac-gen">Buat sandi acak</button><button class="btn primary" type="submit">'+(F.mode==='reset'?'Simpan sandi baru':'Tambah akun')+'</button>'+(F.mode==='reset'?'<button class="btn" type="button" data-act="ac-cancel">Batal</button>':'')+'</div></div></div></form>'
    +'<p style="margin:0;color:var(--ink2);font-size:12.5px">Sandi disimpan sebagai hash, bukan teks asli, dan tidak bisa dilihat lagi setelah disimpan. Sampaikan sandi awal langsung ke karyawan. Ini prototype: pemeriksaan login berjalan di peramban, jadi bukan pengganti pembatasan akses lewat Share.</p></section>';
  const LG=S.f.log,lq=LG.q.trim().toLowerCase(),lrows=S.audit.filter(x=>(!LG.m||x.menu===LG.m)&&(!lq||(String(x.aksi||'')+' '+String(x.by||'')).toLowerCase().indexOf(lq)>=0)),lmen=[...new Set(S.audit.map(x=>x.menu).filter(Boolean))].sort();
  const logp=adm?'<section class="panel" style="grid-column:1/-1"><header><h2>Log perubahan</h2></header><p style="margin:0;color:var(--ink2)">Mencatat siapa mengubah apa dan kapan, untuk perubahan yang tersimpan di semua menu. Hanya super admin yang melihat halaman ini.</p><div class="inline"><input type="search" data-f="log.q" placeholder="Cari aktivitas atau nama" aria-label="Cari log" value="'+esc(LG.q)+'"><select data-f="log.m" aria-label="Saring menu">'+opt('','Semua menu',LG.m)+lmen.map(m=>opt(m,m,LG.m)).join('')+'</select></div>'
    +(lrows.length?'<div class="set-table"><table><thead><tr><th>Waktu</th><th>Siapa</th><th>Menu</th><th>Aktivitas</th></tr></thead><tbody>'+lrows.slice(0,LG.n).map(x=>'<tr><td style="white-space:nowrap">'+esc(fmtDT(x.t))+'</td><td>'+esc(x.by||'—')+'</td><td>'+esc(x.menu||'—')+'</td><td>'+esc(x.aksi||'')+'</td></tr>').join('')+'</tbody></table></div>'+(lrows.length>LG.n?'<div><button class="btn small" data-act="log-more">Tampilkan lebih banyak ('+(lrows.length-LG.n)+' lagi)</button></div>':''):'<div class="empty">'+(S.audit.length?'Tidak ada yang cocok.':'Belum ada perubahan tercatat. Log mulai terisi dari perubahan yang disimpan setelah fitur ini aktif.')+'</div>')
    +'<p style="margin:0;color:var(--ink2);font-size:12.5px">Menampilkan maksimal 500 catatan terbaru. Prototype: log disimpan dari peramban pengguna, jadi belum kebal terhadap pengubahan.</p></section>':'';
  const n=['issues','projects','schools','leads','invoices','brand'].reduce((a,k)=>a+S[k].filter(x=>x.contoh).length,0);
  const demo=adm&&n?'<section class="panel" style="grid-column:1/-1"><header><h2>Data contoh</h2></header><p style="margin:0">Ada '+n+' data contoh di semua modul. Menghapusnya tidak bisa dibatalkan.</p><div><button class="btn danger" data-act="demo-del" data-confirm="Klik lagi untuk menghapus '+n+' data contoh">Hapus semua data contoh</button></div></section>':'';
  const aktif=alist.filter(a=>a.aktif!==false).length;
  const stat=(l,v,s)=>'<div class="tile"><span>'+l+'</span><strong>'+v+'</strong><em>'+s+'</em></div>';
  const sum='<div class="tiles set-sum">'+stat('Akun login',alist.length,aktif+' aktif')+stat('Peran',rk.length,'matriks hak akses')+stat('Karyawan',members().filter(id=>!isAcc(id)).length,'tanpa akun login')+stat('Produk',S.products.length,'terdaftar')+stat('Data contoh',n,'di semua modul')+'</div>';
  const sec=(id,title,desc,body)=>'<section class="set-sec" id="set-'+id+'"><header><span class="set-dot" aria-hidden="true"></span><div><h2>'+title+'</h2><p>'+desc+'</p></div></header><div class="set-grid">'+body+'</div></section>';
  const jump=(id,l)=>'<button type="button" data-act="set-jump" data-id="'+id+'">'+l+'</button>';
  const nav='<nav class="set-nav" aria-label="Bagian pengaturan">'+jump('akses','Akun & akses')+jump('organisasi','Organisasi')+jump('operasional','Operasional')+jump('data','Data & log')+'</nav>';
  const body='<div class="set">'+sum+nav
    +sec('akses','Akun & hak akses','Kelola akun login, karyawan, dan matriks peran di satu tempat.',login+team+acc)
    +sec('organisasi','Organisasi','Daftar pilihan yang dipakai di seluruh modul: AM, pelaksana project, dan produk.',amp+ppl+prod)
    +sec('operasional','Operasional & dokumen','Jam kerja untuk absensi serta identitas yang tampil pada invoice.',absp+invp)
    +sec('data','Data & pemeliharaan','Impor massal, jejak perubahan, dan pembersihan data contoh.',impp+logp+demo)
    +'</div>';
  return{title:'Pengaturan',sub:'Akun, peran, daftar pilihan, dan data operasional. Hanya super admin yang bisa membuka halaman ini.',body};
}};

/* ---------- drawer ---------- */
let drawerTimer=null;
function closeDrawer(instant){
  const d=$('#ldrawer'),s=$('#lscrim');if(!d||!s)return;
  clearTimeout(drawerTimer);
  d.classList.remove('is-open');s.classList.remove('is-open');
  if(instant){d.hidden=true;s.hidden=true;return}
  drawerTimer=setTimeout(()=>{if(!d.classList.contains('is-open')){d.hidden=true;s.hidden=true}},260);
}
function openDrawer(){
  const d=$('#ldrawer'),s=$('#lscrim');if(!d||!s)return;
  clearTimeout(drawerTimer);
  const first=d.hidden;
  d.hidden=false;s.hidden=false;
  if(first)requestAnimationFrame(()=>{d.classList.add('is-open');s.classList.add('is-open')});
  else{d.classList.add('is-open');s.classList.add('is-open')}
}
function renderDrawer(){
  const d=$('#ldrawer');
  if(!S.drawer||S.drawer[0]==='isu'){closeDrawer();return}
  if(!d.hidden&&typing(d)){S.pending=true;return}
  const [k,id]=S.drawer,x=S[KEY[k]].find(r=>r.id===id);
  if(!x){S.drawer=null;closeDrawer();return}
  const ed=can(k),ie=(l,key,v,t,o)=>'<div><span>'+l+'</span>'+(t==='select'?'<select class="ie" data-sf="'+key+'" aria-label="'+l+'">'+o+'</select>':'<input class="ie" type="'+t+'" data-sf="'+key+'" aria-label="'+l+'" value="'+esc(v)+'"'+(t==='number'?' min="0" step="1"':'')+' autocomplete="off">')+'</div>',m=(l,v)=>'<div><span>'+l+'</span>'+v+'</div>';
  const foot='<div class="actions">'+((k==='project'?canPlan():k==='isu'?canHandle()||isReporter(x):ed)?'<button class="btn" data-act="edit">Ubah</button>':'')+(isAdmin()?'<button class="btn danger" data-act="del" data-confirm="Klik lagi untuk menghapus">Hapus</button>':'')+'</div>';
  const head=(t,sub,pills)=>'<div class="dhead"><div><h2 style="font-size:20px">'+esc(t)+'</h2><p style="margin:2px 0 6px;color:var(--ink2)">'+esc(sub)+'</p>'+pills+'</div><button class="btn small" data-act="close" aria-label="Tutup">Tutup</button></div>';
  let h='';
  if(k==='isu'){
    const u=URG[x.urgency],st=TST[x.status],g=slaOf(x),hd=canHandle(),rep=isReporter(x)||isAdmin(),ms=(x.messages||[]).filter(l=>l.kind!=='note'||hd);
    const barc=g.tone==='crit'?'var(--crit)':g.tone==='warn'?'var(--warn)':'var(--accent)';
    const waitD=x.status==='Waiting Validation'&&x.pausedAt?Math.floor((Date.now()-new Date(x.pausedAt).getTime())/864e5):0;
    const canRe=x.status==='Closed'&&(hd||(isReporter(x)&&x.closedAt&&Date.now()-new Date(x.closedAt).getTime()<=REOPEN_DAYS*864e5));
    h=head(x.subject,code('isu',x)+(iSch(x)?' · '+iSch(x):''),pill(u[0],u[1])+' '+pill(st[0],st[1])+(x.reopenCount?' '+pill('Dibuka ulang '+x.reopenCount+' kali','warn'):''))
     +'<div class="prog"><div class="track"><i style="width:'+g.used+'%;background:'+barc+'"></i></div><strong>'+esc(g.label)+'</strong></div>'
     +'<div class="meta">'+m('Kategori',esc(x.category))+m('Ditujukan ke',esc(x.assignee?nameOf(x.assignee):'Belum ditugaskan'))+m('Pelapor',esc(x.createdBy?nameOf(x.createdBy):'—')+(x.reporter?'<br><small>'+esc(x.reporter)+'</small>':''))+m('AM',esc(nameOf(x.am)))
       +m('Produk',esc(x.productId?prodName(x.productId):'—'))+m('Dibuat',fmtDT(x.createdAt))+m('Tenggat SLA',fmtDT(x.slaDeadline))+m('Respons pertama',fmtDT(x.firstResponseAt))
       +(x.txRef||x.txAmount?m('Transaksi',esc(x.txRef||'—')+(x.txAmount?'<br><small>'+rp(x.txAmount)+'</small>':'')):'')+(x.closedAt?m('Ditutup',fmtDT(x.closedAt)):'')+'</div>'
     +(x.description?'<div><div class="lbl">Keluhan</div><p style="margin:4px 0;white-space:pre-wrap">'+esc(x.description)+'</p></div>':'')
     +(x.resolutionSummary?'<div><div class="lbl">Ringkasan solusi</div><p style="margin:4px 0;white-space:pre-wrap">'+esc(x.resolutionSummary)+'</p></div>':'')
     +(x.status==='Waiting Validation'?(rep?'<div class="box"><h3>Apakah masalah sudah selesai?</h3><span>Programmer sudah menyelesaikan penanganan. Konfirmasi hasilnya supaya tiket bisa ditutup.</span><div><button class="btn primary" data-act="tk-ok">Masalah Selesai</button></div><div class="inline"><input type="text" id="d-reason" placeholder="Apa yang masih bermasalah?" aria-label="Alasan belum selesai"><button class="btn" data-act="tk-notok">Belum Selesai</button></div></div>'
        :'<div class="banner info">Menunggu validasi pelapor. Jam SLA berhenti sementara.'+(waitD>=AUTOCLOSE_DAYS?' Sudah '+waitD+' hari tanpa validasi.':'')+'</div>'):'')
     +(x.status==='Closed'?(x.csat&&x.csat.score?'<div><div class="lbl">Penilaian pelapor (CSAT)</div><p style="margin:4px 0">'+esc(x.csat.score)+' dari 5'+(x.csat.comment?' · '+esc(x.csat.comment):'')+'</p></div>'
        :isReporter(x)?'<div class="box"><h3>Beri penilaian penanganan</h3><input type="text" id="d-csatc" placeholder="Komentar (opsional)" aria-label="Komentar penilaian"><div class="inline">'+[1,2,3,4,5].map(n=>'<button class="btn" data-act="tk-csat" data-s="'+n+'" aria-label="Nilai '+n+' dari 5">'+n+'</button>').join('')+'<small>1 buruk, 5 sangat baik</small></div></div>':'')
        +(canRe?'<div><button class="btn" data-act="tk-reopen">Buka kembali tiket</button></div>':''):'')
     +(hd&&x.status!=='Closed'?'<div class="box"><h3>Penanganan</h3>'
        +(x.status==='Open'&&(!x.assignee||isMine(x))?'<div><button class="btn primary" data-act="tk-claim">Ambil tiket</button></div>':'')
        +(x.status==='Open'?'<div class="inline"><label class="lbl" for="d-asg">Tugaskan ke</label><select id="d-asg" data-act-change="tk-asg">'+(x.assignee?'':opt('','Pilih programmer',''))+progList().map(u=>opt(u,nameOf(u),x.assignee||'')).join('')+'</select></div>':'')
        +'<div class="inline"><label class="lbl" for="d-tst">Ubah status</label><select id="d-tst" data-act-change="tk-status">'+opt('','Pilih status','')+TRANS[x.status].map(v=>opt(v,v==='Waiting Validation'?'Waiting Validation (minta validasi pelapor)':v,'')).join('')+'</select></div>'
        +'<div class="inline"><label class="lbl" for="d-tcat">Koreksi triase</label><select id="d-tcat" data-act-change="tk-cat">'+TCAT.map(c=>opt(c,c,x.category)).join('')+'</select><select id="d-turg" data-act-change="tk-urg" aria-label="Prioritas">'+Object.keys(URG).map(c=>opt(c,c,x.urgency)).join('')+'</select></div></div>':'')
     +'<div><h3>Percakapan</h3><div class="log" style="margin-top:8px">'+(ms.map(l=>'<div class="k-'+esc(l.kind||'text')+'"><small>'+fmtDT(l.at)+' · '+esc(l.by?nameOf(l.by):'Sistem')+(l.kind==='solution'?' · Solusi':l.kind==='note'?' · Catatan internal':'')+'</small><div style="white-space:pre-wrap">'+esc(l.body)+'</div></div>').join('')||'<div class="empty">Belum ada pesan.</div>')+'</div></div>'
     +(can('isu')&&x.status!=='Closed'?'<div class="inline"><input type="text" id="d-log" placeholder="Tulis pesan" aria-label="Tulis pesan">'+(hd?'<label><input type="checkbox" id="d-note"> Catatan internal</label>':'')+'<button class="btn primary" data-act="tk-msg">Kirim</button></div>':'')+foot;
  }else if(k==='project'){
    const hl=pHealth(x),ms=x.milestones||[],pp=PRIO[x.priority]||PRIO.sedang,ppl=members(),plan=canPlan();
    h=head(x.name,code('project',x)+(pSch(x)?' · '+pSch(x):''),pill(hl[0],hl[1])+' '+pill(PSTAT[x.status]||'Perencanaan')+' '+pill('Prioritas '+pp[0].toLowerCase(),pp[1]))
     +'<div class="prog"><div class="track"><i style="width:'+pProg(x)+'%"></i></div><strong>'+pProg(x)+'%</strong></div>'
     +'<div class="meta">'+m('Jenis',esc(x.type||'—'))+m('PM',esc(nameOf(x.pm)))+m('Ditugaskan kepada',esc(asg(x)||'Belum ada'))+m('Mulai',fmtD(x.start))+m('Deadline',fmtD(x.end))+m('Durasi',dur(x)!=null?dur(x)+' hari':'—')+m('Tugas',ms.filter(t=>tstat(t)==='selesai').length+' dari '+ms.length+' selesai')+'</div>'
     +(x.notes?'<div><div class="lbl">Deskripsi</div><p style="margin:4px 0;white-space:pre-wrap">'+esc(x.notes)+'</p></div>':'')
     +(plan?'<div class="inline"><label class="lbl" for="d-pstatus">Ubah status</label><select id="d-pstatus" data-act-change="pstatus">'+Object.entries(PSTAT).map(([a,b])=>opt(a,b,x.status)).join('')+'</select></div>':'')
     +'<div><h3>Tugas</h3><div style="margin-top:6px">'+(ms.map((t,i)=>{const st=tstat(t);return '<div class="ms'+(st==='selesai'?' done':'')+'">'+(ed?'<select data-tk="'+i+'" aria-label="Status tugas">'+Object.entries(TSTAT).map(([a,b])=>opt(a,b[0],st)).join('')+'</select>':pill(TSTAT[st][0],TSTAT[st][1]))+'<span>'+esc(t.title)+'<small>'+esc(who(t.who))+'</small></span><small class="'+(st!=='selesai'&&t.due&&t.due<today()?'err':'')+'">'+fmtD(t.due)+'</small>'+(plan?'<button class="btn small" data-act="ms-del" data-i="'+i+'" aria-label="Hapus tugas">Hapus</button>':'')+'</div>'}).join('')||'<div class="empty">Belum ada tugas. Progres project dihitung dari tugas.</div>')+'</div></div>'
     +(plan?'<div class="inline"><input type="text" id="d-ms" placeholder="Tugas baru" aria-label="Tugas baru"><select id="d-msw" aria-label="Penanggung jawab tugas">'+opt('','Belum ditugaskan','')+S.people.map(n=>opt(n,n,'')).join('')+'</select><input type="date" id="d-msdue" aria-label="Tenggat tugas"><button class="btn primary" data-act="ms-add">Tambah</button></div>':'')
     +'<div><h3>Aktivitas</h3><div class="log" style="margin-top:8px">'+((x.log||[]).slice().reverse().map(l=>'<div><small>'+fmtD(l.at)+' · '+esc(l.by?nameOf(l.by):'Tim QRION')+'</small><div style="white-space:pre-wrap">'+esc(l.text)+'</div></div>').join('')||'<div class="empty">Belum ada catatan aktivitas.</div>')+'</div></div>'
     +(ed?'<div class="inline"><input type="text" id="d-log" placeholder="Tulis pembaruan project" aria-label="Pembaruan project"><button class="btn primary" data-act="log-add">Tambah catatan</button></div>':'')+foot;
  }else if(k==='sekolah'){
    const c=contract(x),st=SSTAT[x.status]||SSTAT.aktif,iss=S.issues.filter(i=>i.schoolId===id&&i.status!=='Closed'),prj=S.projects.filter(p=>p.schoolId===id),ct=x.contacts||[];
    h=head(x.name,code('sekolah',x)+' · '+[x.jenjang,x.city].filter(Boolean).join(' · '),pill(st[0],st[1])+' '+pill(c[0],c[1]))
     +(ed?'<div class="meta">'+m('MRR (dari produk)',esc(rp(sMrr(x))))+m('ARR',esc(rp(sMrr(x)*12)))+ie('Status','status',x.status||'onboarding','select',Object.keys(SSTAT).map(k=>opt(k,SSTAT[k][0],x.status||'onboarding')).join(''))+ie('AM','am',x.am||'','select',opt('','Belum ditugaskan',x.am||'')+amList().map(u=>opt(u,nameOf(u),x.am||'')).join('')+(x.am&&!amList().includes(x.am)?opt(x.am,nameOf(x.am),x.am):''))+ie('Kontrak mulai','contractStart',x.contractStart||'','date')+ie('Kontrak berakhir','contractEnd',x.contractEnd||'','date')+ie('Jumlah siswa','students',x.students||'','number')+ie('Alamat','address',x.address||'','text')+ie('Tindak lanjut berikutnya','nextAction',x.nextAction||'','text')+ie('Tanggal tindak lanjut','nextDate',x.nextDate||'','date')+'</div><p class="sub" style="margin:0">Klik isian lalu ubah. Perubahan tersimpan otomatis.</p>'
     :'<div class="meta">'+m('MRR',esc(rp(sMrr(x))))+m('ARR',esc(rp(sMrr(x)*12)))+m('Kontrak mulai',fmtD(x.contractStart))+m('Kontrak berakhir',fmtD(x.contractEnd))+m('AM',esc(nameOf(x.am)))+m('Jumlah siswa',x.students?(+x.students).toLocaleString('id-ID'):'—')+m('Tindak lanjut berikutnya',esc(x.nextAction||'—')+(x.nextDate?'<br><small class="'+(x.nextDate<today()?'err':'')+'">'+fmtD(x.nextDate)+'</small>':''))+m('Alamat',esc(x.address||'—'))+'</div>')
     +'<div><h3>Kontak</h3><div class="rows">'+(x.picName?'<div class="rowi" style="cursor:default"><span><span class="t">'+esc(x.picName)+'</span><small>PIC utama</small></span><span>'+waLink(x.picPhone)+'</span></div>':'')
       +ct.map((p,i)=>'<div class="rowi" style="cursor:default"><span><span class="t">'+esc(p.name)+'</span><small>'+esc(p.title||'')+'</small></span><span class="inline"><span>'+waLink(p.phone)+'</span>'+(ed?'<button class="btn small" data-act="ct-del" data-i="'+i+'" aria-label="Hapus kontak">Hapus</button>':'')+'</span></div>').join('')
       +(!x.picName&&!ct.length?'<div class="empty">Belum ada kontak.</div>':'')+'</div></div>'
     +(ed?'<div class="inline"><input type="text" id="d-cn" placeholder="Nama kontak" aria-label="Nama kontak"><input type="text" id="d-cj" placeholder="Jabatan" aria-label="Jabatan"><input type="text" id="d-cp" placeholder="Telepon atau email" aria-label="Telepon atau email"><button class="btn primary" data-act="ct-add">Tambah kontak</button></div>':'')
     +(allowed('pembayaran')?(()=>{const ps=S.pay.filter(y=>y.mitraId===id).sort((a,b)=>String(b.tanggal||'').localeCompare(String(a.tanggal||'')));return '<div><h3>Pembayaran ('+ps.length+')</h3><div class="rows">'+(ps.slice(0,5).map(y=>'<div class="rowi" style="cursor:default"><span><span class="t">'+rp(y.total)+'</span><small>'+(y.tanggal?fmtD(y.tanggal):'tanggal belum diisi')+'</small></span><span style="text-align:right">'+payLine(y)+'</span></div>').join('')||'<div class="empty">Belum ada pembayaran tercatat.</div>')+'</div></div>'})():'')
     +'<div><div class="inline" style="justify-content:space-between;flex-wrap:nowrap"><h3 style="margin:0">Produk yang dipakai</h3>'+(ed?'<button class="btn small" data-act="edit-prod">Ubah produk</button>':'')+'</div><div class="rows">'+((x.products||[]).map(p=>'<div class="rowi" style="cursor:default"><span class="t">'+esc(prodName(p.productId))+'</span>'+(ed?'<span class="inline" style="flex-wrap:nowrap;gap:6px"><span style="font-size:12px;color:var(--ink2)">Rp</span><input class="ie" style="width:130px;text-align:right" type="number" min="0" step="50000" data-sfm="'+esc(p.productId)+'" aria-label="MRR '+esc(prodName(p.productId))+'" value="'+esc(p.mrr||0)+'"><span style="font-size:12px;color:var(--ink2)">per bulan</span></span>':'<span>'+rp(p.mrr)+' per bulan</span>')+'</div>').join('')||'<div class="empty">Belum ada produk.</div>')+'</div></div>'
     +'<div><h3>Tiket isu terbuka ('+iss.length+')</h3><div class="rows">'+(iss.map(i=>{const pp=URG[i.urgency];return '<button class="rowi" data-open="isu:'+esc(i.id)+'"><span class="t">'+esc(i.subject)+'</span>'+pill(pp[0],pp[1])+'</button>'}).join('')||'<div class="empty">Tidak ada tiket terbuka.</div>')+'</div></div>'
     +'<div><h3>Project ('+prj.length+')</h3><div class="rows">'+(prj.map(p=>{const hh=pHealth(p);return '<button class="rowi" data-open="project:'+esc(p.id)+'"><span class="t">'+esc(p.name)+'</span>'+pill(hh[0],hh[1])+'</button>'}).join('')||'<div class="empty">Belum ada project.</div>')+'</div></div>'+mitraTl(x)
     +(ed?'<div><div class="lbl">Catatan</div><textarea class="ie" rows="3" data-sf="notes" aria-label="Catatan">'+esc(x.notes||'')+'</textarea></div>':x.notes?'<div><div class="lbl">Catatan</div><p style="margin:4px 0;white-space:pre-wrap">'+esc(x.notes)+'</p></div>':'')
     +'<div><h3>Riwayat aktivitas</h3>'+logHtml(x,'Belum ada aktivitas. Catat telepon, kunjungan, atau rapat dengan sekolah di sini.')+'</div>'+(ed?actForm('Tulis ringkasan aktivitas'):'')+foot;
  }else{
    const sg=stage(x.stage),opn=!['menang','kalah'].includes(x.stage);
    h=head(x.name,code('pipeline',x)+(x.city?' · '+x.city:''),stPill(x.stage||'baru')+' '+pill('Peluang '+sg[2]+'%'))
     +'<div class="meta">'+m('Perkiraan MRR',esc(rp(x.estMrr)))+m('Nilai tertimbang',esc(rp((+x.estMrr||0)*sg[2]/100)))+m('AM',esc(nameOf(x.am)))+m('Perkiraan closing',fmtD(x.closeDate))+m('Kontak',esc(x.contact||'—')+(x.phone?'<br><small>'+waLink(x.phone)+'</small>':''))+m('Sumber',esc(x.source||'—'))+m('Langkah berikutnya',esc(x.nextAction||'—')+(x.nextDate?'<br><small class="'+(opn&&x.nextDate<today()?'err':'')+'">'+fmtD(x.nextDate)+'</small>':''))+m('Umur lead',age(x)+' hari')+(x.stage==='kalah'?m('Alasan kalah',esc(x.lostReason||'Belum diisi')):'')+'</div>'
     +'<div><div class="lbl">Produk diminati</div>'+((x.products||[]).map(p=>'<span class="chip">'+esc(prodName(p))+'</span>').join('')||'—')+'</div>'
     +(ed?'<div class="inline"><label class="lbl" for="d-stage">Pindahkan tahap</label><select id="d-stage" data-act-change="lstage">'+STAGES.map(g=>opt(g[0],g[1],x.stage)).join('')+'</select></div>':'')
     +(x.notes?'<div><div class="lbl">Catatan</div><p style="margin:4px 0;white-space:pre-wrap">'+esc(x.notes)+'</p></div>':'')
     +(x.stage==='menang'?(x.schoolId&&school(x.schoolId)?'<button class="btn" data-open="sekolah:'+esc(x.schoolId)+'">Buka data mitra sekolah</button>':can('sekolah')?'<button class="btn primary" data-act="convert">Jadikan mitra sekolah</button>':''):'')
     +'<div><h3>Riwayat aktivitas</h3>'+logHtml(x,'Belum ada aktivitas. Catat telepon, demo, atau rapat dengan calon mitra di sini.')+'</div>'+(ed?actForm('Tulis ringkasan aktivitas'):'')+foot;
  }
  d.innerHTML=h;openDrawer();
}

/* ---------- forms ---------- */
function fieldsFor(k){
  if(k==='sekprod')return[{k:'products',l:'Produk yang dipakai dan MRR per bulan (Rp)',t:'prodmrr',w:'wide'}];
  const ppl=[['','Belum ditugaskan']].concat(amList().map(id=>[id,nameOf(id)]));
  const sch=[['','Pilih sekolah']].concat(S.schools.slice().sort((a,b)=>String(a.name).localeCompare(String(b.name))).map(s=>[s.id,s.name]));
  const prods=[['','Tidak spesifik']].concat(S.products.map(p=>[p.id,p.name]));
  const o=a=>a.map(x=>[x,x]),e=(obj,i)=>Object.entries(obj).map(([a,b])=>[a,i!=null?b[i]:b]);
  if(k==='isu')return[{k:'reportedDate',l:'Tanggal pelaporan',t:'date',req:1,d:today(),max:today(),w:'wide'},{k:'subject',l:'Judul keluhan (ketik atau pilih dari daftar)',t:'combo',req:1,w:'wide',o:subjOpts()},{k:'description',l:'Deskripsi keluhan',t:'area',req:1,w:'wide'},{k:'category',l:'Kategori',t:'select',o:[['','Deteksi otomatis']].concat(o(TCAT))},{k:'assignee',l:'Ditujukan ke programmer',t:'select',req:1,o:[['','Pilih programmer']].concat(progList().map(u=>[u,nameOf(u)])),keep:1},{k:'schoolId',l:'Mitra sekolah (opsional)',t:'select',o:sch},{k:'productId',l:'Produk',t:'select',o:prods},{k:'reporter',l:'Nama pelapor di sekolah',t:'text'}];
  if(k==='project')return[{k:'name',l:'Nama project',t:'text',req:1,w:'wide'},{k:'type',l:'Jenis',t:'select',o:o(PTYPE)},{k:'pm',l:'Project manager',t:'select',o:ppl,d:role()==='pm'||S.roles[me.id]==='pm'?me.id:''},{k:'assignee',l:'Ditugaskan kepada',t:'select',o:[['','Pilih pelaksana']].concat(S.people.map(n=>[n,n]))},{k:'status',l:'Status',t:'select',o:e(PSTAT),d:'perencanaan'},{k:'priority',l:'Prioritas',t:'select',o:e(PRIO,0),d:'sedang'},{k:'start',l:'Tanggal mulai',t:'date'},{k:'duration',l:'Durasi pengerjaan (hari)',t:'number',step:1},{k:'end',l:'Deadline (terisi otomatis dari durasi)',t:'date',w:'wide'},{k:'notes',l:'Deskripsi',t:'area',w:'wide'}];
  if(k==='sekolah')return[{k:'name',l:'Nama sekolah',t:'text',req:1,w:'wide'},{k:'city',l:'Kota',t:'text'},{k:'jenjang',l:'Jenjang',t:'select',o:o(JENJANG)},{k:'status',l:'Status',t:'select',o:e(SSTAT,0),d:'onboarding'},{k:'am',l:'AM yang ditugaskan',t:'select',o:ppl,d:role()==='am'?me.id:'',keep:1},{k:'picName',l:'Nama PIC sekolah',t:'text'},{k:'picPhone',l:'No. telepon / WhatsApp PIC',t:'tel'},{k:'contractStart',l:'Kontrak mulai',t:'date'},{k:'contractEnd',l:'Kontrak berakhir',t:'date'},{k:'students',l:'Jumlah siswa',t:'number',step:1},{k:'address',l:'Alamat',t:'text'},{k:'nextAction',l:'Tindak lanjut berikutnya',t:'text'},{k:'nextDate',l:'Tanggal tindak lanjut',t:'date'},{k:'products',l:'Produk yang dipakai dan MRR per bulan (Rp)',t:'prodmrr',w:'wide'},{k:'notes',l:'Catatan',t:'area',w:'wide'}];
  return[{k:'name',l:'Nama sekolah atau yayasan',t:'text',req:1,w:'wide'},{k:'city',l:'Kota',t:'text'},{k:'stage',l:'Tahap',t:'select',o:STAGES.map(s=>[s[0],s[1]]),d:'baru'},{k:'contact',l:'Nama kontak',t:'text'},{k:'phone',l:'No. telepon / WhatsApp kontak',t:'tel'},{k:'estMrr',l:'Perkiraan MRR per bulan (Rp)',t:'number'},{k:'am',l:'AM',t:'select',o:ppl,d:role()==='am'?me.id:''},{k:'source',l:'Sumber lead',t:'select',o:[['','Pilih sumber']].concat(o(LSRC)),keep:1},{k:'nextDate',l:'Tanggal langkah berikutnya',t:'date'},{k:'closeDate',l:'Perkiraan closing',t:'date'},{k:'lostReason',l:'Alasan kalah (jika kalah)',t:'text'},{k:'nextAction',l:'Langkah berikutnya',t:'text',w:'wide'},{k:'products',l:'Produk diminati',t:'multi',w:'wide'},{k:'notes',l:'Catatan',t:'area',w:'wide'}];
}
function fld(f,v){
  const id='f-'+f.k;let c;
  if(v==null)v=f.d!=null?f.d:'';
  if(f.t==='select')c='<select id="'+id+'">'+f.o.map(x=>opt(x[0],x[1],v)).join('')+(f.keep&&v&&!f.o.some(x=>x[0]===v)?opt(v,nameOf(v)+' (di luar daftar)',v):'')+'</select>';
  else if(f.t==='area')c='<textarea id="'+id+'" rows="3">'+esc(v)+'</textarea>';
  else if(f.t==='prodmrr')c='<div id="'+id+'">'+(S.products.map(p=>{const cur=(v||[]).find(x=>x.productId===p.id);return '<div class="pm"><input type="checkbox" id="'+id+'-c-'+esc(p.id)+'" data-p="'+esc(p.id)+'"'+(cur?' checked':'')+'><label for="'+id+'-c-'+esc(p.id)+'">'+esc(p.name)+'</label><input type="number" min="0" step="50000" id="'+id+'-m-'+esc(p.id)+'" data-m="'+esc(p.id)+'" value="'+(cur?esc(cur.mrr):'')+'" placeholder="MRR" aria-label="MRR '+esc(p.name)+'"></div>'}).join('')||'<span class="empty">Tambahkan produk dulu di menu Pengaturan.</span>')+'</div>';
  else if(f.t==='multi')c='<div id="'+id+'" class="checks">'+((f.o||S.products.map(p=>[p.id,p.name])).map(p=>'<label><input type="checkbox" id="'+id+'-'+esc(p[0])+'" value="'+esc(p[0])+'"'+((v||[]).includes(p[0])?' checked':'')+'> '+esc(p[1])+'</label>').join('')||'<span class="empty">'+(f.none||'Belum ada produk.')+'</span>')+'</div>';
  else if(f.t==='combo')c='<input type="text" id="'+id+'" list="dl-'+id+'" value="'+esc(v)+'" autocomplete="off" placeholder="Ketik judul, atau klik lalu pilih dari daftar"><datalist id="dl-'+id+'">'+f.o.map(t=>'<option value="'+esc(t)+'">').join('')+'</datalist>';
  else c='<input type="'+f.t+'" id="'+id+'" value="'+esc(v)+'"'+(f.max?' max="'+f.max+'"':'')+(f.t==='number'?' min="0" step="'+(f.step||50000)+'"':'')+'>';
  return '<div class="fld '+(f.w||'')+'"><label '+(f.t==='prodmrr'||f.t==='multi'?'':'for="'+id+'"')+'>'+f.l+(f.req?' *':'')+'</label>'+c+'</div>';
}
let modalTimer=null;
function openModal(md){
  clearTimeout(modalTimer);
  md.hidden=false;
  requestAnimationFrame(()=>md.classList.add('is-open'));
}
function closeModal(instant){
  const md=$('#lmodal');if(!md)return;
  clearTimeout(modalTimer);
  md.classList.remove('is-open');
  if(instant){md.hidden=true;return}
  modalTimer=setTimeout(()=>{if(!md.classList.contains('is-open'))md.hidden=true},220);
}
function openForm(k,id){
  let x=id?S[KEY[k]].find(r=>r.id===id):null;const fields=fieldsFor(k);
  if(x&&k==='project')x=Object.assign({},x,{duration:dur(x)==null?'':dur(x)});
  if(x&&k==='isu')x=Object.assign({},x,{reportedDate:x.reportedDate||iso(new Date(x.createdAt))});
  S.form={k,id,fields};S.upl.form=[];
  const T={isu:'tiket isu',project:'project',sekolah:'mitra sekolah',sekprod:'produk mitra',pipeline:'lead'}[k];
  const md=$('#lmodal');
  md.innerHTML='<form id="frm" novalidate><h2 style="font-size:20px">'+(x?'Ubah ':'Tambah ')+T+'</h2><div class="fields">'+fields.map(f=>fld(f,x?x[f.k]:null)).join('')+'</div>'+(k==='isu'&&!id?attPicker('form'):'')+(k==='isu'&&!id?'<div class="banner info" id="triage">Triase otomatis muncul setelah judul dan deskripsi diisi.</div>':'')+'<div class="err" id="ferr" hidden></div><div class="actions"><button type="button" class="btn" data-act="form-close">Batal</button><button type="submit" class="btn primary">Simpan</button></div></form>';
  md.setAttribute('role','dialog');md.setAttribute('aria-modal','true');md.setAttribute('aria-label',(x?'Ubah ':'Tambah ')+T);openModal(md);const first=$('input,select,textarea',md);if(first)first.focus();
}
async function submitForm(){
  const {k,id,fields}=S.form,o={};
  for(const f of fields){const el=$('#f-'+f.k);
    if(f.t==='prodmrr')o[f.k]=[...el.querySelectorAll('[data-p]:checked')].map(c=>({productId:c.dataset.p,mrr:+el.querySelector('[data-m="'+c.dataset.p+'"]').value||0}));
    else if(f.t==='multi')o[f.k]=[...el.querySelectorAll('input:checked')].map(c=>c.value);
    else if(f.t==='number')o[f.k]=+el.value||0;
    else o[f.k]=el.value.trim()||null;
    if(f.req&&!o[f.k]){const er=$('#ferr');er.textContent=f.l+' wajib diisi.';er.hidden=false;el.focus();return}
  }
  if(k==='isu'&&o.reportedDate>today()){const er=$('#ferr');er.textContent='Tanggal pelaporan tidak boleh di masa depan.';er.hidden=false;$('#f-reportedDate').focus();return}
  if(k==='project'){if(o.start&&o.duration>0)o.end=addDays(o.start,o.duration);delete o.duration;if(o.start&&o.end&&o.end<o.start){const er=$('#ferr');er.textContent='Deadline tidak boleh sebelum tanggal mulai.';er.hidden=false;return}}
  const col=db.collection(COL[k]),now=new Date().toISOString();
  let ok;
  if(id){
    if(k==='isu'&&!o.category)o.category=triCat(o.subject,o.description);
    ok=await write(()=>col.doc(id).update(o),'Perubahan tersimpan');
  }else{
    o.createdAt=now;if(k==='isu'&&o.reportedDate&&o.reportedDate!==today()){const[yy,mm,dd]=o.reportedDate.split('-').map(Number),n0=new Date();o.createdAt=new Date(yy,mm-1,dd,n0.getHours(),n0.getMinutes(),n0.getSeconds()).toISOString()}o.createdBy=me.id;if(k==='isu')o.am=role()==='am'?me.id:null;if(k==='isu'&&S.upl.form.length)o.attachments=S.upl.form.slice();
    if(k==='isu'){o.category=o.category||triCat(o.subject,o.description);o.urgency=triUrg(o.subject,o.description,o.category,o.txAmount);o.status='Open';o.slaDeadline=new Date(new Date(o.createdAt).getTime()+SLA_MIN[o.urgency]*6e4).toISOString();o.messages=[];o.reopenCount=0;o.pausedMinutes=0;o.pausedAt=null;o.firstResponseAt=null;o.closedAt=null;o.slaBreached=false;o.csat=null}
    if(k==='sekolah'){o.log=[];o.contacts=[]}
    if(k==='pipeline')o.log=[];
    if(k==='project'){o.milestones=[];o.log=[]}
    ok=await write(()=>col.doc().set(o),'Data tersimpan');
  }
  if(ok){S.form=null;S.upl.form=[];closeModal()}
}


/* ---------- uang keluar ---------- */
const EXP_CAT=['Gaji dan honor','Komisi dan insentif','Server dan hosting','Software dan langganan','Marketing dan iklan','Operasional kantor','Transport dan perjalanan','Pajak dan legal','Pelatihan dan acara','Peralatan','Lainnya'];
const ymLbl=ym=>{const d=new Date(ym+'-01T00:00:00');return isNaN(d)?ym:d.toLocaleDateString('id-ID',{month:'long',year:'numeric'})};
const ymAdd=(ym,n)=>{const d=new Date(+ym.slice(0,4),+ym.slice(5,7)-1+n,1);return d.getFullYear()+'-'+pad(d.getMonth()+1)};
const expSum=a=>a.reduce((t,x)=>t+(+x.jumlah||0),0);
const expMonth=ym=>S.exp.filter(x=>String(x.tanggal).slice(0,7)===ym);
const newExpForm=ym=>({id:null,tanggal:(ym&&ym!==nowYM()?ym+'-01':today()),kategori:EXP_CAT[0],deskripsi:'',jumlah:'',vendor:'',bukti:'',catatan:'',rutin:false,dibuat:null});
const expRow=(lbl,val,max,txt,sub)=>'<div style="display:grid;grid-template-columns:minmax(120px,200px) 1fr auto;gap:12px;align-items:center;margin:8px 0"><span>'+esc(lbl)+(sub?'<br><small style="color:var(--ink2)">'+esc(sub)+'</small>':'')+'</span><div class="prog" style="margin:0"><div class="track"><i style="width:'+(max>0?Math.max(val>0?2:0,Math.round(val/max*100)):0)+'%"></i></div></div><strong style="white-space:nowrap">'+esc(txt)+'</strong></div>';

/* ---------- akses data QMS ---------- */
/* LAPISAN API. Di prototype datanya dibuat otomatis (contoh). Di versi asli, ganti QMS.fetch
   dengan pemanggilan ke API baca-saja QMS lewat backend CRM. Kontraknya ada di panel
   "Untuk programmer" pada menu Akses Data. */
const QMS={
  mode:'contoh',_b:{},
  rng(seed){let a=0;for(let i=0;i<seed.length;i++)a=(Math.imul(a^seed.charCodeAt(i),2654435761)+1013904223)>>>0;return()=>{a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296}},
  fetch(sch,kind){return new Promise(ok=>setTimeout(()=>ok(QMS.mock(sch,kind)),150))},
  mock(sch,kind){
    const b=QMS._b[sch.id]||(QMS._b[sch.id]=QMS.build(sch));
    if(kind==='siswa')return b.siswa;if(kind==='guru')return b.guru;if(kind==='tagihan')return b.tagihan;if(kind==='kartu')return b.kartu;
    const a=b.siswa.filter(x=>x.status==='Aktif'),bl=b.tagihan.filter(x=>x.status!=='Lunas');
    return{siswa:b.siswa.length,aktif:a.length,laki:a.filter(x=>x.jk==='Laki-laki').length,perempuan:a.filter(x=>x.jk==='Perempuan').length,guru:b.guru.length,guruAktif:b.guru.filter(x=>x.status==='Aktif').length,tagihanBelum:bl.length,tagihanRp:bl.reduce((t,x)=>t+(x.jumlah-(x.dibayarRp||0)),0),kartuN:b.kartu.length,kartuSaldo:b.kartu.reduce((t,x)=>t+x.saldo,0),kartuBlok:b.kartu.filter(x=>x.status!=='Aktif').length,sinkron:new Date().toISOString()};
  },
  build(sch){
    const R=QMS.rng(String(sch.id)),pick=a=>a[Math.floor(R()*a.length)],ri=(a,b)=>a+Math.floor(R()*(b-a+1));
    const FL=['Ahmad','Muhammad','Rizky','Fajar','Dimas','Aldi','Bagas','Raka','Naufal','Farhan','Arya','Hafiz','Kevin','Rafi','Zidan'],FP=['Siti','Aisyah','Nur','Putri','Dewi','Annisa','Salsabila','Nabila','Fitri','Zahra','Intan','Rahma','Alya','Citra','Dinda'],LN=['Fauzi','Rahman','Pratama','Saputra','Hidayat','Ramadhan','Wijaya','Lestari','Utami','Handayani','Kurniawan','Nugroho','Syahputra','Maharani','Hasibuan','Siregar','Nasution','Harahap','Lubis','Tanjung'];
    const KL={SD:['1A','1B','2A','3A','4A','5A','6A'],SMP:['7A','7B','8A','8B','9A','9B'],SMA:['X IPA','X IPS','XI IPA','XI IPS','XII IPA','XII IPS'],SMK:['X TKJ','XI TKJ','XII TKJ','X AKL','XI AKL','XII AKL']},kls=KL[sch.jenjang]||KL.SMP;
    const dayIso=n=>{const d=new Date();d.setDate(d.getDate()-n);return iso(d)},tsIso=n=>dayIso(n)+'T0'+ri(1,8)+':'+pad(ri(0,59))+':00.000Z';
    const hp=()=>'628'+ri(1,9)+String(ri(10000000,99999999));
    const siswa=[],nS=ri(45,120),yr=new Date().getFullYear();
    for(let i=0;i<nS;i++){
      const jk=R()<0.52?'Laki-laki':'Perempuan',ln=pick(LN),r=R(),st=r<0.9?'Aktif':r<0.94?'Lulus':r<0.97?'Pindah':'Nonaktif',kl=pick(kls);
      siswa.push({id:'s'+(i+1),nama:(jk==='Laki-laki'?pick(FL):pick(FP))+' '+ln,nis:String(yr-ri(0,3))+String(1000+i),jk,kelas:kl,agama:R()<0.92?'Islam':pick(['Kristen','Katolik','Hindu','Buddha']),tglLahir:(yr-ri(7,18))+'-'+pad(ri(1,12))+'-'+pad(ri(1,28)),status:st,ortu:pick(FL)+' '+ln,telpOrtu:R()<0.9?hp():'',login:R()<0.7?tsIso(ri(0,30)):null,dibuat:dayIso(ri(60,500))});
    }
    const guru=[],nG=ri(8,22),MP=['Matematika','Bahasa Indonesia','Bahasa Inggris','IPA','IPS','PAI','PKn','Seni Budaya','PJOK','Informatika'],JB=['Guru Mapel','Guru Mapel','Guru Mapel','Wali Kelas','Wali Kelas','Wakil Kepala Sekolah','Operator'];
    for(let i=0;i<nG;i++){const jk=R()<0.45,nm=(jk?pick(FL):pick(FP))+' '+pick(LN);
      guru.push({id:'g'+(i+1),nama:i===0?'Drs. '+nm:nm+', S.Pd.',nip:String(19700000+ri(10000,99999))+String(ri(100,999)),mapel:pick(MP),jabatan:i===0?'Kepala Sekolah':pick(JB),telp:hp(),email:nm.toLowerCase().replace(/[^a-z ]/g,'').replace(/ /g,'.')+'@mail.com',status:R()<0.93?'Aktif':'Nonaktif',login:R()<0.8?tsIso(ri(0,20)):null})}
    const tagihan=[],cur=nowYM(),pers=[ymAdd(cur,-2),ymAdd(cur,-1),cur],spp=pick([150000,175000,200000,250000,300000]);let tn=1;
    siswa.filter(x=>x.status==='Aktif').forEach(s=>{
      pers.forEach((p,pi)=>{const r=R(),lunas=pi<2?r<0.88:r<0.6,sebagian=!lunas&&r>(pi<2?0.88:0.6)&&R()<0.15;
        tagihan.push({id:'t'+(tn++),siswaId:s.id,siswa:s.nama,kelas:s.kelas,jenis:'SPP',periode:p,jumlah:spp,status:lunas?'Lunas':sebagian?'Sebagian':'Belum bayar',dibayarRp:lunas?spp:sebagian?Math.round(spp/2):0,jatuhTempo:p+'-10',dibayar:lunas?p+'-'+pad(ri(1,10)):null})});
      if(R()<0.08){const ok=R()<0.5;tagihan.push({id:'t'+(tn++),siswaId:s.id,siswa:s.nama,kelas:s.kelas,jenis:'Seragam',periode:cur,jumlah:350000,status:ok?'Lunas':'Belum bayar',dibayarRp:ok?350000:0,jatuhTempo:cur+'-20',dibayar:ok?cur+'-05':null})}
    });
    const kartu=[],TRX=[['Top up','Top up via transfer',1],['Top up','Top up di loket',1],['Jajan','Kantin sekolah',-1],['Jajan','Koperasi sekolah',-1],['Jajan','Kantin sekolah',-1],['Bayar','Fotokopi',-1]];
    siswa.filter(x=>x.status==='Aktif').forEach((s,i)=>{
      if(R()<0.06)return;
      const r=R(),st=r<0.93?'Aktif':r<0.97?'Diblokir':'Hilang',n=ri(2,7),trx=[];let saldo=ri(0,25)*5000;
      for(let k=0;k<n;k++){const t=pick(TRX),nom=t[2]>0?ri(2,20)*10000:ri(1,8)*2500;trx.push({tgl:tsIso(k*ri(1,3)+ri(0,2)),jenis:t[0],ket:t[1],jumlah:t[2]*nom})}
      trx.sort((a,b)=>a.tgl<b.tgl?1:-1);
      kartu.push({id:'k'+(i+1),siswaId:s.id,siswa:s.nama,nis:s.nis,kelas:s.kelas,noKartu:'ONC'+String(ri(10000000,99999999)),saldo,limitHarian:pick([25000,30000,50000]),status:st,terakhir:trx[0].tgl,trx})
    });
    return{siswa,guru,tagihan,kartu};
  }
};
const AK_TABS=['ringkas','siswa','guru'],AK_KIND={ringkas:'Ringkasan',siswa:'Siswa',guru:'Guru',tagihan:'Tagihan',kartu:'Saldo kartu Oncard'},AK_PER=25;
const akLoad=(s,kind)=>{const k=s.id+':'+kind,c=S.qms[k];if(c)return c;S.qms[k]={loading:true};
  QMS.fetch(s,kind).then(r=>{S.qms[k]={rows:r};akLog(s,'melihat '+(kind==='kartu'?'':'data ')+AK_KIND[kind].toLowerCase());queue()}).catch(()=>{S.qms[k]={err:true};queue()});return S.qms[k]};
const akLog=(s,t)=>{const k=s.id+'|'+t;if(S.akLogged.has(k))return;S.akLogged.add(k);logAct('Akses Data: '+t+' ('+s.name+')')};
const akTgl=v=>v?fmtD(String(v).slice(0,10)):'—',akLogin=v=>v?fmtDT(v):'Belum pernah';
const akSt=v=>pill(v,v==='Aktif'||v==='Lunas'?'good':v==='Sebagian'||v==='Pindah'||v==='Lulus'?'warn':v==='Belum bayar'||v==='Nonaktif'?'crit':'info');
const akPage=(f,total)=>{const pages=Math.max(1,Math.ceil(total/AK_PER));if(f.pg>pages)f.pg=pages;if(f.pg<1)f.pg=1;return{pages,from:(f.pg-1)*AK_PER,nav:total>AK_PER?'<div class="inline" style="justify-content:flex-end;margin-top:12px"><button class="btn small" data-act="ak-pg" data-d="-1"'+(f.pg<=1?' disabled':'')+'>Sebelumnya</button><span aria-live="polite">Halaman '+f.pg+' dari '+pages+'</span><button class="btn small" data-act="ak-pg" data-d="1"'+(f.pg>=pages?' disabled':'')+'>Berikutnya</button></div>':''}};
const AK_API=`Autentikasi : token server-ke-server dengan scope read-only. Disimpan di backend CRM, tidak pernah di browser.
Pemetaan    : tambahkan field qmsId pada data Mitra Sekolah (id sekolah di QMS).
Hak akses   : backend CRM memeriksa hak "Akses Data" milik pengguna sebelum meneruskan permintaan.
Aturan data : tidak pernah mengembalikan kata sandi, hash, atau token akun. Tanggal ISO 8601, nominal rupiah bulat.
Paging      : server-side. Respons: { "data": [...], "page": 1, "pageSize": 50, "total": 107 }
Audit       : setiap permintaan dicatat (siapa, sekolah, jenis data, waktu).

GET /api/v1/schools/{qmsId}/summary
GET /api/v1/schools/{qmsId}/students?q=&status=&class=&page=1&pageSize=50
GET /api/v1/schools/{qmsId}/teachers?q=&status=&page=1&pageSize=50
GET /api/v1/schools/{qmsId}/invoices?status=&period=YYYY-MM&page=1&pageSize=50
GET /api/v1/schools/{qmsId}/oncard/cards?q=&status=&page=1&pageSize=50
GET /api/v1/schools/{qmsId}/oncard/cards/{cardId}/transactions?page=1&pageSize=50

Contoh siswa:
{ "id": "s1", "name": "Ahmad Fauzi", "nis": "2026001", "gender": "Laki-laki", "class": "7A",
  "religion": "Islam", "birthDate": "2013-05-12", "status": "Aktif",
  "parentName": "Budi Fauzi", "parentPhone": "628123456789", "lastLoginAt": "2026-11-16T03:10:00Z" }

Contoh kartu Oncard (tanpa PIN):
{ "id": "k1", "studentId": "s1", "cardNo": "ONC12345678", "balance": 45000, "dailyLimit": 30000,
  "status": "Aktif", "lastTransactionAt": "2026-11-16T05:20:00Z" }

Contoh tagihan:
{ "id": "t1", "studentId": "s1", "type": "SPP", "period": "2026-11", "amount": 200000,
  "paidAmount": 0, "status": "Belum bayar", "dueDate": "2026-11-10", "paidAt": null }`;

/* ---------- impor xlsx ---------- */
const X={
  crcT:null,
  crc(b){if(!X.crcT){X.crcT=[];for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;X.crcT[n]=c>>>0}}let c=0xFFFFFFFF;for(let i=0;i<b.length;i++)c=X.crcT[(c^b[i])&255]^(c>>>8);return(c^0xFFFFFFFF)>>>0},
  enc:s=>new TextEncoder().encode(s),
  xe:s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,''),
  zip(files){
    const u16=v=>[v&255,v>>>8&255],u32=v=>[v&255,v>>>8&255,v>>>16&255,v>>>24&255],parts=[],cd=[];let off=0;
    files.forEach(([name,data])=>{
      const nb=X.enc(name),crc=X.crc(data),n=data.length;
      parts.push(new Uint8Array([0x50,0x4b,3,4,20,0,0,8,0,0,0,0,0x21,0,...u32(crc),...u32(n),...u32(n),...u16(nb.length),0,0]),nb,data);
      cd.push(new Uint8Array([0x50,0x4b,1,2,20,0,20,0,0,8,0,0,0,0,0x21,0,...u32(crc),...u32(n),...u32(n),...u16(nb.length),0,0,0,0,0,0,0,0,0,0,0,0,...u32(off)]),nb);
      off+=30+nb.length+n;
    });
    const cdl=cd.reduce((a,b)=>a+b.length,0);
    parts.push(...cd,new Uint8Array([0x50,0x4b,5,6,0,0,0,0,...u16(files.length),...u16(files.length),...u32(cdl),...u32(off),0,0]));
    const out=new Uint8Array(parts.reduce((a,b)=>a+b.length,0));let p=0;parts.forEach(b=>{out.set(b,p);p+=b.length});return out;
  },
  async inflate(d){const s=new Blob([d]).stream().pipeThrough(new DecompressionStream('deflate-raw'));return new Uint8Array(await new Response(s).arrayBuffer())},
  async unzip(b){
    const dv=new DataView(b.buffer,b.byteOffset,b.byteLength);let e=-1;
    for(let i=b.length-22;i>=Math.max(0,b.length-70000);i--)if(dv.getUint32(i,true)===0x06054b50){e=i;break}
    if(e<0)throw new Error('zip');
    const n=dv.getUint16(e+10,true);let p=dv.getUint32(e+16,true);const out={};
    for(let i=0;i<n;i++){
      if(dv.getUint32(p,true)!==0x02014b50)throw new Error('zip');
      const m=dv.getUint16(p+10,true),cs=dv.getUint32(p+20,true),nl=dv.getUint16(p+28,true),el=dv.getUint16(p+30,true),cl=dv.getUint16(p+32,true),lo=dv.getUint32(p+42,true);
      const name=new TextDecoder().decode(b.subarray(p+46,p+46+nl));
      const ls=lo+30+dv.getUint16(lo+26,true)+dv.getUint16(lo+28,true),raw=b.subarray(ls,ls+cs);
      if(/^xl\/(workbook\.xml|_rels\/workbook\.xml\.rels|sharedStrings\.xml|styles\.xml|worksheets\/[^/]+\.xml)$/.test(name))out[name]=m===0?raw:m===8?await X.inflate(raw):null;
      p+=46+nl+el+cl;
    }
    return out;
  },
  colIdx(r){const m=/^([A-Z]+)/.exec(r);let n=0;if(m)for(const ch of m[1])n=n*26+ch.charCodeAt(0)-64;return n-1},
  isDateFmt(id,codes){if(id>=14&&id<=22||id>=45&&id<=47)return true;const c=codes[id];if(!c)return false;return /[dy]/i.test(c.replace(/"[^"]*"|\\.|\[[^\]]*\]/g,''))},
  /* hasil: {namaSheet:[{n:nomorBaris,c:[sel...]}]} */
  async read(buf){
    const z=await X.unzip(buf),dec=n=>z[n]?new TextDecoder().decode(z[n]):null,P=s=>new DOMParser().parseFromString(s,'application/xml');
    const wb=dec('xl/workbook.xml'),rl=dec('xl/_rels/workbook.xml.rels');if(!wb||!rl)throw new Error('xlsx');
    const rel={};[...P(rl).getElementsByTagName('Relationship')].forEach(r=>{rel[r.getAttribute('Id')]=r.getAttribute('Target')});
    const sst=dec('xl/sharedStrings.xml')?[...P(dec('xl/sharedStrings.xml')).getElementsByTagName('si')].map(si=>{let t='';const ch=si.children;for(const c of ch){if(c.tagName==='t')t+=c.textContent;else if(c.tagName==='r'){const tt=c.getElementsByTagName('t')[0];if(tt)t+=tt.textContent}}return t}):[];
    const codes={},xfs=[];
    if(dec('xl/styles.xml')){const st=P(dec('xl/styles.xml'));[...st.getElementsByTagName('numFmt')].forEach(n=>{codes[+n.getAttribute('numFmtId')]=n.getAttribute('formatCode')});
      const cx=st.getElementsByTagName('cellXfs')[0];if(cx)[...cx.children].forEach(x=>xfs.push(+x.getAttribute('numFmtId')||0))}
    const out={};
    for(const s of [...P(wb).getElementsByTagName('sheet')]){
      const tg=rel[s.getAttribute('r:id')];if(!tg)continue;
      const path='xl/'+String(tg).replace(/^\/?(xl\/)?/,'');const xml=dec(path);if(!xml)continue;
      const rows=[];
      for(const r of [...P(xml).getElementsByTagName('row')]){
        const c=[];
        for(const cell of [...r.getElementsByTagName('c')]){
          const ix=X.colIdx(cell.getAttribute('r')||''),t=cell.getAttribute('t'),ve=cell.getElementsByTagName('v')[0];let v='';
          if(t==='inlineStr'){v=[...cell.getElementsByTagName('t')].map(x=>x.textContent).join('')}
          else if(ve){const raw=ve.textContent;
            if(t==='s')v=sst[+raw]||'';else if(t==='str')v=raw;else if(t==='b')v=raw==='1'?'Ya':'Tidak';else if(t==='e')v='';
            else{const n=Number(raw);if(isNaN(n))v=raw;else if(X.isDateFmt(xfs[+cell.getAttribute('s')||0]||0,codes)&&n>=1)v=new Date(Date.UTC(1899,11,30)+Math.floor(n)*864e5).toISOString().slice(0,10);else v=n}}
          if(ix>=0)c[ix]=v;
        }
        for(let i=0;i<c.length;i++)if(c[i]===undefined)c[i]='';
        rows.push({n:+r.getAttribute('r')||rows.length+1,c});
      }
      out[s.getAttribute('name')]=rows;
    }
    return out;
  }
};
/* kolom: [kunci, judul, lebar, tipe] tipe: t teks, tel teks nomor, n angka, d tanggal */
const IMP_MITRA=[['name','Nama mitra *',34],['jenjang','Jenjang',12],['city','Kota',18],['status','Status',14],['am','Account Manager',20],['picName','Nama PIC',22],['picPhone','Telepon PIC',18,'tel'],['contractStart','Kontrak mulai',15,'d'],['contractEnd','Kontrak berakhir',17,'d'],['students','Jumlah siswa',14,'n'],['address','Alamat',38],['products','Produk (pisahkan dengan koma)',30],['mrr','MRR total per bulan (Rp)',24,'n'],['notes','Catatan',34]];
const IMP_PAY=[['mitra','Nama mitra *',34],['tanggal','Tanggal bayar *',15,'d'],['jenis','Jenis pembayaran *',20],['item','Nama item',26],['bulan','Bulan yang dibayar (mis. 2026-01, 2026-02)',34],['nominal','Nominal (Rp) *',18,'n'],['jml','Jumlah transaksi',17,'n'],['biaya','Biaya per transaksi (Rp)',24,'n'],['catatan','Catatan',32],['bukti','Tautan bukti (https://...)',34]];
const IMP_LEAD=[['name','Nama sekolah atau yayasan *',34],['city','Kota',18],['stage','Tahap',16],['contact','Nama kontak',22],['phone','Telepon atau WhatsApp kontak',24,'tel'],['estMrr','Perkiraan MRR per bulan (Rp)',26,'n'],['am','Account Manager',20],['source','Sumber lead',24],['nextAction','Langkah berikutnya',32],['nextDate','Tanggal langkah berikutnya',24,'d'],['closeDate','Perkiraan closing',18,'d'],['lostReason','Alasan kalah',26],['products','Produk diminati (pisahkan dengan koma)',32],['notes','Catatan',34]];
const IMP_JENIS=['Langganan','Item tambahan','Top up','Transaksi'];
const impNorm=s=>String(s==null?'':s).toLowerCase().replace(/\([^)]*\)/g,'').replace(/[*]/g,'').replace(/\s+/g,' ').trim();
const IMP_STYLES='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><numFmts count="1"><numFmt numFmtId="164" formatCode="yyyy\\-mm\\-dd"/></numFmts>'
 +'<fonts count="6"><font><sz val="11"/><color rgb="FF1F2937"/><name val="Calibri"/><family val="2"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/><family val="2"/></font><font><b/><sz val="18"/><color rgb="FF14532D"/><name val="Calibri"/><family val="2"/></font><font><i/><sz val="10"/><color rgb="FF4B5563"/><name val="Calibri"/><family val="2"/></font><font><b/><sz val="11"/><color rgb="FF14532D"/><name val="Calibri"/><family val="2"/></font><font><i/><sz val="11"/><color rgb="FF6B7280"/><name val="Calibri"/><family val="2"/></font></fonts>'
 +'<fills count="6"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF1F6F43"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFF3F4F6"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFFF8E1"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFE8F5EE"/><bgColor indexed="64"/></patternFill></fill></fills>'
 +'<borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border><border><left style="thin"><color rgb="FFD1D5DB"/></left><right style="thin"><color rgb="FFD1D5DB"/></right><top style="thin"><color rgb="FFD1D5DB"/></top><bottom style="thin"><color rgb="FFD1D5DB"/></bottom><diagonal/></border></borders>'
 +'<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="15">'
 +'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>'
 +'<xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>'
 +'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="top"/></xf>'
 +'<xf numFmtId="3" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyAlignment="1"><alignment horizontal="right" vertical="top"/></xf>'
 +'<xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyAlignment="1"><alignment horizontal="left" vertical="top"/></xf>'
 +'<xf numFmtId="0" fontId="5" fillId="4" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="top"/></xf>'
 +'<xf numFmtId="3" fontId="5" fillId="4" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right" vertical="top"/></xf>'
 +'<xf numFmtId="164" fontId="5" fillId="4" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="top"/></xf>'
 +'<xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment vertical="center"/></xf>'
 +'<xf numFmtId="0" fontId="3" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>'
 +'<xf numFmtId="0" fontId="4" fillId="5" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>'
 +'<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>'
 +'<xf numFmtId="0" fontId="4" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>'
 +'<xf numFmtId="49" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyAlignment="1"><alignment vertical="top"/></xf>'
 +'<xf numFmtId="49" fontId="5" fillId="4" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="top"/></xf>'
 +'</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>';
const impColStyle=t=>t==='n'?3:t==='d'?4:t==='tel'?13:2,impExStyle=t=>t==='n'?6:t==='d'?7:t==='tel'?14:5;
/* spesifikasi sheet: {cols:[{w,s}], rows:[[{v,s}|v]], freeze, filter, merges, vals:[{sq,f,warn}], grid, tab, heights:{baris:tinggi}} */
function impSheet(sp){
  const L=i=>{let s='',n=i+1;while(n>0){const m=(n-1)%26;s=String.fromCharCode(65+m)+s;n=Math.floor((n-1)/26)}return s};
  let x='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">';
  x+='<sheetPr>'+(sp.tab?'<tabColor rgb="'+sp.tab+'"/>':'')+'<pageSetUpPr fitToPage="1"/></sheetPr>';
  x+='<sheetViews><sheetView workbookViewId="0"'+(sp.grid===false?' showGridLines="0"':'')+(sp.first?' tabSelected="1"':'')+'>'+(sp.freeze?'<pane ySplit="'+sp.freeze+'" topLeftCell="A'+(sp.freeze+1)+'" activePane="bottomLeft" state="frozen"/><selection pane="bottomLeft" activeCell="A'+(sp.freeze+1)+'" sqref="A'+(sp.freeze+1)+'"/>':'')+'</sheetView></sheetViews><sheetFormatPr defaultRowHeight="18"/>';
  x+='<cols>'+sp.cols.map((c,i)=>'<col min="'+(i+1)+'" max="'+(i+1)+'" width="'+c.w+'" customWidth="1"'+(c.s?' style="'+c.s+'"':'')+'/>').join('')+'</cols><sheetData>';
  sp.rows.forEach((r,ri)=>{
    const h=sp.heights&&sp.heights[ri+1];
    x+='<row r="'+(ri+1)+'"'+(h?' ht="'+h+'" customHeight="1"':'')+'>';
    r.forEach((c,ci)=>{
      if(c===null||c===undefined||c==='')return;
      const o=typeof c==='object'?c:{v:c},ref=L(ci)+(ri+1),s=o.s?' s="'+o.s+'"':'';
      if(o.v===''||o.v==null){x+='<c r="'+ref+'"'+s+'/>';return}
      if(typeof o.v==='number')x+='<c r="'+ref+'"'+s+'><v>'+o.v+'</v></c>';
      else x+='<c r="'+ref+'"'+s+' t="inlineStr"><is><t xml:space="preserve">'+X.xe(o.v)+'</t></is></c>';
    });
    x+='</row>';
  });
  x+='</sheetData>';
  if(sp.filter)x+='<autoFilter ref="'+sp.filter+'"/>';
  if(sp.merges&&sp.merges.length)x+='<mergeCells count="'+sp.merges.length+'">'+sp.merges.map(m=>'<mergeCell ref="'+m+'"/>').join('')+'</mergeCells>';
  if(sp.vals&&sp.vals.length)x+='<dataValidations count="'+sp.vals.length+'">'+sp.vals.map(v=>'<dataValidation type="list" allowBlank="1" showInputMessage="1" showErrorMessage="1" errorStyle="'+(v.warn?'warning':'stop')+'" errorTitle="Pilihan tidak dikenal" error="'+X.xe(v.err||'Pilih salah satu dari daftar.')+'" sqref="'+v.sq+'"><formula1>'+X.xe(v.f)+'</formula1></dataValidation>').join('')+'</dataValidations>';
  x+='<pageMargins left="0.5" right="0.5" top="0.6" bottom="0.6" header="0.3" footer="0.3"/><pageSetup orientation="landscape" fitToWidth="1" fitToHeight="0"/></worksheet>';
  return x;
}
function impTemplate(){
  const prod=S.products.map(p=>p.name),ams=amList().map(nameOf).filter((v,i,a)=>v&&v!=='Belum ditugaskan'&&a.indexOf(v)===i),mit=S.schools.map(s=>s.name).filter(Boolean).sort((a,b)=>String(a).localeCompare(b,'id'));
  const lists=[['Jenjang',JENJANG],['Status mitra',Object.keys(SSTAT).map(k=>SSTAT[k][0])],['Tahap lead',STAGES.map(s=>s[1])],['Sumber lead',LSRC],['Jenis pembayaran',IMP_JENIS],['Account Manager',ams],['Produk',prod],['Mitra terdaftar',mit]];
  const rng=i=>"Daftar!$"+String.fromCharCode(65+i)+"$2:$"+String.fromCharCode(65+i)+"$"+Math.max(2,lists[i][1].length+1);
  const hdr=cols=>cols.map(c=>({v:c[1],s:1}));
  const ser=v=>{const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(v);return m?Math.round((Date.UTC(+m[1],+m[2]-1,+m[3])-Date.UTC(1899,11,30))/864e5):v};
  const ex=(cols,vals)=>cols.map((c,i)=>vals[i]===undefined||vals[i]===''?{v:'',s:impExStyle(c[3])}:{v:c[3]==='d'?ser(vals[i]):vals[i],s:impExStyle(c[3])});
  const col=cols=>cols.map(c=>({w:c[2],s:impColStyle(c[3])}));
  const lc=(cols,k)=>String.fromCharCode(65+cols.findIndex(c=>c[0]===k));
  const amEx=ams[0]||'',prEx=prod.slice(0,2).join(', ');
  const mitra={cols:col(IMP_MITRA),rows:[hdr(IMP_MITRA),ex(IMP_MITRA,['(contoh) SMK Nusantara Jaya','SMK','Pekanbaru','Aktif',amEx,'Bu Ratna','081234567890','2026-01-01','2026-12-31',850,'Jl. Merdeka No. 10',prEx,2500000,'Baris contoh ini diabaikan saat impor. Hapus atau timpa.'])],freeze:1,filter:'A1:'+String.fromCharCode(64+IMP_MITRA.length)+'1',heights:{1:34},tab:'FF1F6F43',vals:[
    {sq:lc(IMP_MITRA,'jenjang')+'2:'+lc(IMP_MITRA,'jenjang')+'2000',f:rng(0)},{sq:lc(IMP_MITRA,'status')+'2:'+lc(IMP_MITRA,'status')+'2000',f:rng(1)}].concat(ams.length?[{sq:lc(IMP_MITRA,'am')+'2:'+lc(IMP_MITRA,'am')+'2000',f:rng(5),warn:1,err:'Nama ini belum terdaftar sebagai Account Manager. Baris tetap diimpor tanpa AM.'}]:[])};
  const pay={cols:col(IMP_PAY),rows:[hdr(IMP_PAY),ex(IMP_PAY,['(contoh) SMK Nusantara Jaya','2026-03-05','Langganan','Qrion Pay','2026-01, 2026-02, 2026-03',500000,'','','Bayar 3 bulan sekaligus','https://drive.google.com/...'])],freeze:1,filter:'A1:'+String.fromCharCode(64+IMP_PAY.length)+'1',heights:{1:34},tab:'FF1F6F43',vals:[
    {sq:lc(IMP_PAY,'jenis')+'2:'+lc(IMP_PAY,'jenis')+'5000',f:rng(4)}].concat(mit.length?[{sq:'A2:A5000',f:rng(7),warn:1,err:'Nama mitra ini belum terdaftar. Impor tetap jalan kalau mitra itu ada di sheet Mitra pada file yang sama.'}]:[])};
  const lead={cols:col(IMP_LEAD),rows:[hdr(IMP_LEAD),ex(IMP_LEAD,['(contoh) SMA Harapan Bangsa','Medan','Demo','Pak Dedi','081298765432',1500000,amEx,LSRC[0],'Kirim proposal','2026-12-01','2026-12-20','',prEx,'Tertarik paket lengkap'])],freeze:1,filter:'A1:'+String.fromCharCode(64+IMP_LEAD.length)+'1',heights:{1:34},tab:'FF1F6F43',vals:[
    {sq:lc(IMP_LEAD,'stage')+'2:'+lc(IMP_LEAD,'stage')+'2000',f:rng(2)},{sq:lc(IMP_LEAD,'source')+'2:'+lc(IMP_LEAD,'source')+'2000',f:rng(3),warn:1,err:'Sumber ini belum ada di daftar. Baris tetap diimpor.'}].concat(ams.length?[{sq:lc(IMP_LEAD,'am')+'2:'+lc(IMP_LEAD,'am')+'2000',f:rng(5),warn:1,err:'Nama ini belum terdaftar sebagai Account Manager. Baris tetap diimpor tanpa AM.'}]:[])};
  const maxL=Math.max(...lists.map(l=>l[1].length));
  const daf={cols:lists.map((l,i)=>({w:Math.max(16,Math.min(40,Math.max(l[0].length,...l[1].map(v=>String(v).length))+3)),s:2})),rows:[lists.map(l=>({v:l[0],s:1}))].concat(Array.from({length:maxL},(_,r)=>lists.map(l=>l[1][r]===undefined?'':{v:l[1][r],s:2}))),freeze:1,heights:{1:30},tab:'FF9CA3AF'};
  const T=(v)=>({v,s:11}),B=(v)=>({v,s:12}),H=(v)=>({v,s:10});
  const pet={cols:[{w:28},{w:100}],grid:false,first:1,tab:'FF14532D',heights:{1:34,2:30},merges:['A1:B1','A2:B2'],rows:[
    [{v:'Template impor data QRION CRM',s:8}],
    [{v:'Isi sheet Mitra, Pembayaran, dan Leads sesuai kebutuhan. Sheet yang dikosongkan akan dilewati.',s:9}],
    [],
    [H('Langkah'),H('')],
    [B('1. Isi data'),T('Mulai dari baris 2 di sheet Mitra, Pembayaran, atau Leads. Baris kuning bertanda (contoh) hanya ilustrasi dan diabaikan.')],
    [B('2. Simpan sebagai .xlsx'),T('Dari Google Sheets: File, Unduh, Microsoft Excel (.xlsx). Jangan ubah nama kolom di baris 1. Urutan kolom boleh berbeda.')],
    [B('3. Unggah'),T('Buka Pengaturan di QRION CRM, bagian Impor data, pilih file ini. Anda akan melihat ringkasan dan daftar masalah sebelum data disimpan.')],
    [B('4. Periksa lalu impor'),T('Baris yang bermasalah dilewati dan dijelaskan alasannya. Baris yang benar baru disimpan setelah Anda menekan Impor.')],
    [],
    [H('Aturan penting'),H('')],
    [B('Urutan impor'),T('Mitra lebih dulu, lalu Pembayaran, lalu Leads. Pembayaran boleh memakai nama mitra yang baru ada di sheet Mitra pada file yang sama.')],
    [B('Data ganda'),T('Mitra dan lead dengan nama yang sudah ada dilewati. Pembayaran dengan mitra, tanggal, jenis, dan total yang sama dengan data lama juga dilewati, jadi aman bila file diunggah dua kali.')],
    [B('Tanggal'),T('Tulis 2026-03-05 atau 05/03/2026 (hari/bulan/tahun). Sel bertipe tanggal di Excel juga bisa.')],
    [B('Bulan'),T('Tulis 2026-01 atau Jan 2026. Beberapa bulan dipisah koma, mis. 2026-01, 2026-02.')],
    [B('Angka'),T('Tulis angka saja, mis. 2500000. Tanda titik pemisah ribuan dan awalan Rp ikut dibaca dengan benar.')],
    [B('Account Manager, produk'),T('Tulis persis seperti di CRM (ada dropdown). Nama yang tidak dikenal dikosongkan dan diberi peringatan.')],
    [],
    [H('Sheet Pembayaran'),H('')],
    [B('Langganan'),T('Satu baris per item. Isi Bulan yang dibayar dan Nominal per bulan. Total dihitung otomatis (nominal x jumlah bulan). Beberapa baris dengan mitra dan tanggal sama digabung menjadi satu pembayaran dengan beberapa item.')],
    [B('Item tambahan'),T('Biaya sekali bayar, misalnya setup atau pelatihan. Nominal dihitung apa adanya, kolom bulan boleh kosong.')],
    [B('Top up'),T('Isi Nominal sebagai total top up dan Bulan sebagai periodenya. Bila bulan kosong dipakai bulan tanggal bayar.')],
    [B('Transaksi'),T('Isi Jumlah transaksi dan Biaya per transaksi. Nominal boleh kosong, otomatis jumlah x biaya.')],
    [],
    [H('Sheet Daftar'),H('')],
    [B('Daftar pilihan'),T('Berisi pilihan untuk dropdown (jenjang, status, tahap, sumber, produk, AM, mitra). Sheet ini dibuat dari data CRM saat template diunduh. Jangan dihapus.')]
  ]};
  const sheets=[['Petunjuk',pet],['Mitra',mitra],['Pembayaran',pay],['Leads',lead],['Daftar',daf]];
  const ct='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'+sheets.map((s,i)=>'<Override PartName="/xl/worksheets/sheet'+(i+1)+'.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>').join('')+'</Types>';
  const rels='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>';
  const wb='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><bookViews><workbookView activeTab="0"/></bookViews><sheets>'+sheets.map((s,i)=>'<sheet name="'+s[0]+'" sheetId="'+(i+1)+'" r:id="rId'+(i+1)+'"/>').join('')+'</sheets></workbook>';
  const wr='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+sheets.map((s,i)=>'<Relationship Id="rId'+(i+1)+'" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet'+(i+1)+'.xml"/>').join('')+'<Relationship Id="rId'+(sheets.length+1)+'" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>';
  return X.zip([['[Content_Types].xml',X.enc(ct)],['_rels/.rels',X.enc(rels)],['xl/workbook.xml',X.enc(wb)],['xl/_rels/workbook.xml.rels',X.enc(wr)],['xl/styles.xml',X.enc(IMP_STYLES)]].concat(sheets.map((s,i)=>['xl/worksheets/sheet'+(i+1)+'.xml',X.enc(impSheet(s[1]))])));
}
/* ---- baca dan validasi ---- */
const IMP_BLN=['jan','feb','mar','apr','mei','jun','jul','agu','sep','okt','nov','des'],IMP_BLN_EN={may:5,aug:8,oct:10,dec:12};
const impMon=s=>{const k=String(s).toLowerCase().slice(0,3),i=IMP_BLN.indexOf(k);return i>=0?i+1:(IMP_BLN_EN[k]||0)};
function impDate(v){
  if(v===''||v==null)return null;
  const ok=(y,m,d)=>{const t=new Date(Date.UTC(y,m-1,d));return t.getUTCFullYear()===y&&t.getUTCMonth()===m-1&&t.getUTCDate()===d&&y>=1990&&y<=2100?y+'-'+pad(m)+'-'+pad(d):false};
  if(typeof v==='number'){if(v>=20000&&v<=80000){const t=new Date(Date.UTC(1899,11,30)+Math.floor(v)*864e5);return t.toISOString().slice(0,10)}return false}
  const s=String(v).trim();let m;
  if(m=/^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(s))return ok(+m[1],+m[2],+m[3]);
  if(m=/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})$/.exec(s))return ok(+m[3],+m[2],+m[1]);
  if(m=/^(\d{1,2})\s+([A-Za-z]+)\.?\s+(\d{4})$/.exec(s)){const mo=impMon(m[2]);return mo?ok(+m[3],mo,+m[1]):false}
  return false;
}
function impYM(v){
  const s=String(v==null?'':v).trim();let m;if(!s)return null;
  if(m=/^(\d{4})-(0?[1-9]|1[0-2])(-\d{1,2})?$/.exec(s))return m[1]+'-'+pad(+m[2]);
  if(m=/^(0?[1-9]|1[0-2])[\/\-](\d{4})$/.exec(s))return m[2]+'-'+pad(+m[1]);
  if(m=/^([A-Za-z]+)\.?\s+(\d{4})$/.exec(s)){const mo=impMon(m[1]);return mo?m[2]+'-'+pad(mo):false}
  return false;
}
const impStr=v=>v==null?'':String(typeof v==='number'?(Number.isInteger(v)?v:v):v).trim();
const impPhone=v=>{if(v===''||v==null)return null;let t=impStr(v);if(typeof v==='number'&&/^8\d{7,11}$/.test(t))t='0'+t;return t||null};
const impNum=v=>{if(v===''||v==null)return null;if(typeof v==='number')return Math.round(v);const s=String(v).trim().replace(/^rp\.?\s*/i,'');if(!/\d/.test(s)||/[^\d.,\s]/.test(s))return false;const d=s.replace(/[\s.]/g,'').replace(/,\d{1,2}$/,'').replace(/,/g,'');return /^\d+$/.test(d)?parseInt(d,10):false};
function impTable(rows,cols){
  /* temukan baris judul: baris pertama yang memuat kolom wajib pertama */
  if(!rows||!rows.length)return null;
  const want=impNorm(cols[0][1]);let hi=rows.findIndex(r=>r.c.some(x=>impNorm(x)===want));if(hi<0)return{missing:cols[0][1]};
  const idx={};rows[hi].c.forEach((x,i)=>{const n=impNorm(x);if(n&&idx[n]===undefined)idx[n]=i});
  const map={};cols.forEach(c=>{const i=idx[impNorm(c[1])];if(i!==undefined)map[c[0]]=i});
  const out=[];rows.slice(hi+1).forEach(r=>{
    if(!r.c.some(x=>impStr(x)!==''))return;
    const o={_n:r.n};cols.forEach(c=>{const i=map[c[0]];o[c[0]]=i===undefined?'':(r.c[i]===undefined?'':r.c[i])});
    if(/^\(contoh\)/i.test(impStr(o[cols[0][0]])))return;
    out.push(o)});
  return{rows:out,map};
}
function impPlan(sheets){
  const P={mitra:{add:[],dup:0,err:[],warn:[],has:false},pay:{add:[],dup:0,err:[],warn:[],has:false},lead:{add:[],dup:0,err:[],warn:[],has:false}},now=new Date().toISOString();
  const amMap={};amList().forEach(id=>{amMap[impNorm(nameOf(id))]=id;amMap[impNorm(id)]=id;if(isAcc(id))amMap[impNorm('@'+String(id).slice(2))]=id});
  const prMap={};S.products.forEach(p=>{prMap[impNorm(p.name)]=p.id});
  const stMap={};Object.keys(SSTAT).forEach(k=>{stMap[impNorm(k)]=k;stMap[impNorm(SSTAT[k][0])]=k});
  const sgMap={};STAGES.forEach(s=>{sgMap[impNorm(s[0])]=s[0];sgMap[impNorm(s[1])]=s[0]});
  const jnMap={};JENJANG.forEach(j=>{jnMap[impNorm(j)]=j});
  const find=(name)=>{const k=Object.keys(sheets).find(x=>impNorm(x)===name);return k?sheets[k]:null};
  const where=(sh,r)=>sh+' baris '+r._n;
  const prods=(txt,pl,w)=>{const ids=[];String(txt||'').split(/[,;\n]/).map(s=>s.trim()).filter(Boolean).forEach(n=>{const id=prMap[impNorm(n)];if(id){if(!ids.includes(id))ids.push(id)}else w('produk "'+n+'" tidak dikenal, dilewati')});return ids};
  const lookAm=(v,w)=>{const s=impStr(v);if(!s)return null;const id=amMap[impNorm(s)];if(!id)w('Account Manager "'+s+'" tidak dikenal, dikosongkan');return id||null};
  /* ---- mitra ---- */
  const known={};S.schools.forEach(s=>{known[impNorm(s.name)]=s.id});const newIds={};
  const tm=impTable(find('mitra'),IMP_MITRA);
  if(tm&&tm.missing)P.mitra.err.push('Sheet Mitra: kolom "'+tm.missing+'" tidak ditemukan di baris judul.');
  else if(tm){P.mitra.has=tm.rows.length>0;tm.rows.forEach(r=>{
    const er=m=>P.mitra.err.push(where('Mitra',r)+': '+m),w=m=>P.mitra.warn.push(where('Mitra',r)+': '+m),name=impStr(r.name);
    if(!name)return er('nama mitra kosong');
    if(known[impNorm(name)]||newIds[impNorm(name)]){P.mitra.dup++;return}
    const cs=impDate(r.contractStart),ce=impDate(r.contractEnd);
    if(cs===false)return er('Kontrak mulai "'+impStr(r.contractStart)+'" bukan tanggal yang valid');
    if(ce===false)return er('Kontrak berakhir "'+impStr(r.contractEnd)+'" bukan tanggal yang valid');
    if(cs&&ce&&ce<cs)return er('Kontrak berakhir lebih awal dari Kontrak mulai');
    const mr=impNum(r.mrr),st=impNum(r.students);
    if(mr===false)return er('MRR "'+impStr(r.mrr)+'" bukan angka');
    if(st===false)return er('Jumlah siswa "'+impStr(r.students)+'" bukan angka');
    let jn=null;if(impStr(r.jenjang)){jn=jnMap[impNorm(r.jenjang)]||null;if(!jn)w('jenjang "'+impStr(r.jenjang)+'" tidak dikenal, dikosongkan')}
    let ss='aktif';if(impStr(r.status)){ss=stMap[impNorm(r.status)]||'aktif';if(!stMap[impNorm(r.status)])w('status "'+impStr(r.status)+'" tidak dikenal, dipakai Aktif')}
    const ids=prods(r.products,0,w),per=ids.length&&mr?Math.round(mr/ids.length):0;
    if(mr&&!ids.length)w('MRR diisi tapi produk kosong, MRR tidak tersimpan (MRR dihitung dari produk)');
    const id=db.collection('schools').doc().id;newIds[impNorm(name)]=id;
    P.mitra.add.push({id,doc:{name,city:impStr(r.city)||null,jenjang:jn,status:ss,am:lookAm(r.am,w),picName:impStr(r.picName)||null,picPhone:impPhone(r.picPhone),contractStart:cs||today(),contractEnd:ce||null,students:st||null,address:impStr(r.address)||null,products:ids.map(p=>({productId:p,mrr:per})),notes:impStr(r.notes)||null,createdAt:now,createdBy:me.id,impor:true}});
  })}
  /* ---- pembayaran ---- */
  const mid=n=>known[impNorm(n)]||newIds[impNorm(n)]||null;
  const tp=impTable(find('pembayaran'),IMP_PAY);
  if(tp&&tp.missing)P.pay.err.push('Sheet Pembayaran: kolom "'+tp.missing+'" tidak ditemukan di baris judul.');
  else if(tp){P.pay.has=tp.rows.length>0;
    const groups={},order=[],exist=new Set(S.pay.map(x=>[x.mitraId,x.tanggal,x.tipe||'langganan',x.total].join('|')));
    tp.rows.forEach(r=>{
      const er=m=>P.pay.err.push(where('Pembayaran',r)+': '+m),w=m=>P.pay.warn.push(where('Pembayaran',r)+': '+m),nm=impStr(r.mitra);
      if(!nm)return er('nama mitra kosong');
      const m=mid(nm);if(!m)return er('mitra "'+nm+'" belum terdaftar. Tambahkan di sheet Mitra atau periksa ejaannya');
      const tg=impDate(r.tanggal);if(tg===null)return er('tanggal bayar kosong');if(tg===false)return er('tanggal bayar "'+impStr(r.tanggal)+'" tidak valid');
      const jn=impNorm(r.jenis),jk=jn==='langganan'?'langganan':(jn==='item tambahan'||jn==='tambahan')?'tambahan':jn==='top up'||jn==='topup'?'topup':jn==='transaksi'?'transaksi':null;
      if(!jk)return er('jenis pembayaran "'+impStr(r.jenis)+'" tidak dikenal. Pilih: '+IMP_JENIS.join(', '));
      let nom=impNum(r.nominal);const jm=impNum(r.jml),bi=impNum(r.biaya);
      if(nom===false)return er('nominal "'+impStr(r.nominal)+'" bukan angka');if(jm===false||bi===false)return er('jumlah atau biaya transaksi bukan angka');
      let bl=[],bad=null;String(r.bulan==null?'':r.bulan).split(/[,;\n]/).map(s=>s.trim()).filter(Boolean).forEach(s=>{const y=impYM(s);if(y===false)bad=s;else if(y&&!bl.includes(y))bl.push(y)});
      if(bad)return er('bulan "'+bad+'" tidak valid. Tulis seperti 2026-01 atau Jan 2026');
      const bk=impStr(r.bukti);if(bk&&!/^https?:\/\//i.test(bk))return er('tautan bukti harus diawali http:// atau https://');
      if(jk==='transaksi'){if(!nom&&jm&&bi)nom=jm*bi;if(!nom||nom<=0)return er('isi Nominal, atau Jumlah dan Biaya per transaksi');
        const bln=bl[0]||tg.slice(0,7);addDoc({tipe:'transaksi',mitraId:m,tanggal:tg,total:nom,items:[],catatan:impStr(r.catatan),bukti:bk,trx:{bulan:bln,jumlah:jm||0,biaya:bi||0}});return}
      if(!nom||nom<=0)return er('nominal kosong atau nol');
      if(jk==='topup'){addDoc({tipe:'topup',mitraId:m,tanggal:tg,total:nom,items:[],catatan:impStr(r.catatan),bukti:bk,topup:{bulan:bl[0]||tg.slice(0,7)}});return}
      if(jk==='langganan'&&!bl.length)return er('Langganan perlu minimal satu bulan yang dibayar');
      const key=[m,tg,'L'].join('|');
      if(!groups[key]){groups[key]={mitraId:m,tanggal:tg,items:[],catatan:'',bukti:'',rows:[]};order.push(key)}
      const g=groups[key];g.items.push({jenis:jk,nama:impStr(r.item)||(jk==='langganan'?'Langganan':'Item tambahan'),bulan:jk==='langganan'?bl:[],nominal:nom});
      if(!g.catatan)g.catatan=impStr(r.catatan);if(!g.bukti)g.bukti=bk;
    });
    function addDoc(d){d.dibuat=now;d.dicatatOleh=me.id||null;d.impor=true;const k=[d.mitraId,d.tanggal,d.tipe,d.total].join('|');if(exist.has(k)){P.pay.dup++;return}exist.add(k);P.pay.add.push({doc:d})}
    order.forEach(k=>{const g=groups[k],t=payTot({items:g.items}).t;addDoc({tipe:'langganan',mitraId:g.mitraId,tanggal:g.tanggal,total:t,items:g.items,catatan:g.catatan,bukti:g.bukti})});
  }
  /* ---- leads ---- */
  const lk={};S.leads.forEach(l=>{lk[impNorm(l.name)]=1});
  const tl=impTable(find('leads'),IMP_LEAD);
  if(tl&&tl.missing)P.lead.err.push('Sheet Leads: kolom "'+tl.missing+'" tidak ditemukan di baris judul.');
  else if(tl){P.lead.has=tl.rows.length>0;tl.rows.forEach(r=>{
    const er=m=>P.lead.err.push(where('Leads',r)+': '+m),w=m=>P.lead.warn.push(where('Leads',r)+': '+m),name=impStr(r.name);
    if(!name)return er('nama lead kosong');
    if(lk[impNorm(name)]){P.lead.dup++;return}
    const nd=impDate(r.nextDate),cd=impDate(r.closeDate),mr=impNum(r.estMrr);
    if(nd===false)return er('Tanggal langkah berikutnya "'+impStr(r.nextDate)+'" tidak valid');
    if(cd===false)return er('Perkiraan closing "'+impStr(r.closeDate)+'" tidak valid');
    if(mr===false)return er('Perkiraan MRR "'+impStr(r.estMrr)+'" bukan angka');
    let sg='baru';if(impStr(r.stage)){sg=sgMap[impNorm(r.stage)]||'baru';if(!sgMap[impNorm(r.stage)])w('tahap "'+impStr(r.stage)+'" tidak dikenal, dipakai Lead baru')}
    let src=impStr(r.source)||null;
    lk[impNorm(name)]=1;
    P.lead.add.push({doc:{name,city:impStr(r.city)||null,stage:sg,contact:impStr(r.contact)||null,phone:impPhone(r.phone),estMrr:mr||0,am:lookAm(r.am,w),source:src,nextAction:impStr(r.nextAction)||null,nextDate:nd||null,closeDate:cd||null,lostReason:impStr(r.lostReason)||null,products:prods(r.products,0,w),notes:impStr(r.notes)||null,log:[],createdAt:now,createdBy:me.id,impor:true}});
  })}
  return P;
}
const impTotal=P=>P.mitra.add.length+P.pay.add.length+P.lead.add.length;
function impPanel(){
  const I=S.imp,row=(l,k)=>{const p=I.plan[k];return '<tr><td>'+l+'</td><td><strong>'+p.add.length+'</strong></td><td>'+p.dup+'</td><td>'+(p.err.length?'<span class="err" style="display:inline">'+p.err.length+'</span>':'0')+'</td><td>'+p.warn.length+'</td></tr>'};
  const all=[].concat(I.plan.mitra.err,I.plan.pay.err,I.plan.lead.err),wr=[].concat(I.plan.mitra.warn,I.plan.pay.warn,I.plan.lead.warn),n=impTotal(I.plan);
  return '<div class="banner info" role="status">File: <strong>'+esc(I.name)+'</strong></div>'
   +'<div style="overflow-x:auto"><table><thead><tr><th>Data</th><th>Akan diimpor</th><th>Dilewati (sudah ada)</th><th>Bermasalah (dilewati)</th><th>Peringatan</th></tr></thead><tbody>'+row('Mitra','mitra')+row('Pembayaran','pay')+row('Leads','lead')+'</tbody></table></div>'
   +(all.length?'<div><div class="lbl">Baris bermasalah (tidak diimpor)</div><ul style="margin:4px 0;padding-left:20px">'+all.slice(0,40).map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>'+(all.length>40?'<small>dan '+(all.length-40)+' lainnya.</small>':'')+'</div>':'')
   +(wr.length?'<div><div class="lbl">Peringatan (tetap diimpor)</div><ul style="margin:4px 0;padding-left:20px">'+wr.slice(0,20).map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>'+(wr.length>20?'<small>dan '+(wr.length-20)+' lainnya.</small>':'')+'</div>':'')
   +(n?'':'<div class="banner warn">Tidak ada data baru yang bisa diimpor dari file ini.</div>')
   +'<div class="inline">'+(n?'<button class="btn primary" data-act="imp-go" data-confirm="Klik lagi: impor '+n+' data">Impor '+n+' data sekarang</button>':'')+'<button class="btn" data-act="imp-clear">Batal</button></div>';
}

/* ---------- actions ---------- */
const cur=()=>{const [k,id]=S.drawer||[];return{k,id,x:k&&S[KEY[k]].find(r=>r.id===id),ref:k&&db.collection(COL[k]).doc(id)}};
function armed(b){if(b.dataset.armed)return true;b.dataset.armed='1';b.dataset.label=b.textContent;b.textContent=b.dataset.confirm;setTimeout(()=>{if(b.isConnected){delete b.dataset.armed;b.textContent=b.dataset.label}},4000);return false}
const ACT={
  new:b=>openForm(b.dataset.k),
  'ak-tab'(b){const f=S.f.akses;f.tab=b.dataset.t;render()},
  'ak-pg'(b){const f=S.f.akses;f.pg+=+b.dataset.d;render()},
  'ak-close'(){S.f.akses.sel=null;render()},
  'ak-retry'(){const f=S.f.akses;delete S.qms[f.sid+':'+f.tab];render()},
  'ak-open'(b){const f=S.f.akses,s=S.schools.find(x=>x.id===f.sid),D=s&&S.qms[s.id+':'+f.tab];if(!D||!D.rows)return;const o=D.rows.find(x=>x.id===b.dataset.id);if(!o)return;f.sel={kind:f.tab,id:o.id};akLog(s,'membuka detail '+(f.tab==='siswa'?'siswa ':f.tab==='kartu'?'kartu Oncard ':'guru ')+(o.nama||o.siswa));render();const p=$('#legacy-island section.panel');if(p&&p.scrollIntoView)p.scrollIntoView({block:'nearest'})},

  'ex-new'(){if(!own())return;S.expForm=newExpForm(S.f.exp.m);render();const e=$('#ef-des');if(e)e.focus()},
  'ex-cancel'(){S.expForm=null;if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();S.pending=false;render()},
  'ex-mo'(b){const f=S.f.exp,d=+b.dataset.d;f.m=d?ymAdd(isYM(f.m)?f.m:nowYM(),d):nowYM();render()},
  'ex-edit'(b){if(!own())return;const x=S.exp.find(y=>y.id===b.dataset.id);if(!x)return;S.expForm={id:x.id,tanggal:x.tanggal||today(),kategori:x.kategori||EXP_CAT[0],deskripsi:x.deskripsi||'',jumlah:x.jumlah?fmtN(x.jumlah):'',vendor:x.vendor||'',bukti:x.bukti||'',catatan:x.catatan||'',rutin:!!x.rutin,dibuat:x.dibuat||null};if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();S.pending=false;render();window.scrollTo(0,0)},
  async 'ex-del'(b){if(!own()||!armed(b))return;const x=S.exp.find(y=>y.id===b.dataset.id);await write(()=>db.doc('pengeluaran/'+b.dataset.id).delete(),'Pengeluaran dihapus'+(x?': '+(x.deskripsi||'')+' '+rp(x.jumlah):''))},
  async 'ex-save'(b){if(!own()||!S.expForm)return;const F=S.expForm,er=$('#ef-err'),jm=numOf(F.jumlah),des=String(F.deskripsi||'').trim(),bk=String(F.bukti||'').trim();let msg='';
    if(!/^\d{4}-\d{2}-\d{2}$/.test(F.tanggal||''))msg='Isi tanggal pengeluaran.';else if(!des)msg='Isi keterangan pengeluaran.';else if(!jm||jm<=0)msg='Isi jumlah pengeluaran dengan angka lebih dari nol.';else if(bk&&!/^https?:\/\//i.test(bk))msg='Tautan bukti harus diawali http:// atau https://.';
    if(msg){er.textContent=msg;er.hidden=false;return}
    const docu={tanggal:F.tanggal,kategori:F.kategori||'Lainnya',deskripsi:des,jumlah:jm,vendor:String(F.vendor||'').trim(),bukti:bk,catatan:String(F.catatan||'').trim(),rutin:!!F.rutin,dibuat:F.dibuat||new Date().toISOString(),dicatatOleh:me.id||null},more=!!b.dataset.more&&!F.id;
    b.disabled=true;const ref=F.id?db.doc('pengeluaran/'+F.id):db.collection('pengeluaran').doc();
    if(await write(()=>ref.set(docu),'Uang keluar dicatat: '+des+' '+rp(jm))){S.f.exp.m=F.tanggal.slice(0,7);if(more){S.expForm=Object.assign(newExpForm(S.f.exp.m),{tanggal:F.tanggal,kategori:F.kategori})}else S.expForm=null;if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();S.pending=false;render();if(more){const e=$('#ef-des');if(e)e.focus()}}else b.disabled=false},
  async 'ex-copy'(b){if(!own()||!armed(b))return;const f=S.f.exp,ym=f.m,prev=ymAdd(ym,-1),all=expMonth(ym),src=expMonth(prev).filter(x=>x.rutin&&!all.some(y=>y.rutin&&y.deskripsi===x.deskripsi&&y.kategori===x.kategori));if(!src.length)return;
    const ld=new Date(+ym.slice(0,4),+ym.slice(5,7),0).getDate(),now=new Date().toISOString();
    await write(async()=>{for(const x of src){const dd=Math.min(+String(x.tanggal).slice(8,10)||1,ld);await db.collection('pengeluaran').doc().set({tanggal:ym+'-'+pad(dd),kategori:x.kategori,deskripsi:x.deskripsi,jumlah:x.jumlah,vendor:x.vendor||'',bukti:'',catatan:x.catatan||'',rutin:true,dibuat:now,dicatatOleh:me.id||null})}},src.length+' pengeluaran rutin disalin ke '+ymLbl(ym))},

  'imp-pick'(){const e=$('#imp-file');if(e){e.value='';e.click()}},
  'imp-clear'(){S.imp=null;render()},
  async 'imp-tpl'(){if(!S.dl)return;const u=impTemplate(),fn='template-impor-qrion-crm.xlsx',mime='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    try{try{await S.dl.save({filename:fn,data:new Blob([u],{type:mime})})}catch(e){if(e&&e.code==='declined')throw e;await S.dl.save({filename:fn,data:u})}toast('Template disimpan')}catch(e){if(!e||e.code!=='declined')toast('Unduhan tidak tersedia pada tampilan ini.',true)}},
  async 'imp-go'(b){if(!S.imp||!armed(b))return;const P=S.imp.plan,n=impTotal(P);if(!n)return;b.disabled=true;const lb=b.textContent;b.textContent='Mengimpor...';
    const jobs=[].concat(P.mitra.add.map(x=>()=>db.collection('schools').doc(x.id).set(x.doc)),P.pay.add.map(x=>()=>db.collection('pembayaran').doc().set(x.doc)),P.lead.add.map(x=>()=>db.collection('leads').doc().set(x.doc)));
    const msg='Impor selesai: '+P.mitra.add.length+' mitra, '+P.pay.add.length+' pembayaran, '+P.lead.add.length+' lead';
    const ok=await write(async()=>{for(let i=0;i<jobs.length;i+=8)await Promise.all(jobs.slice(i,i+8).map(f=>f()))},msg);
    if(ok){S.imp=null;if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();S.pending=false;render()}else{b.disabled=false;b.textContent=lb}},
  mode:b=>{S.f[b.dataset.v].mode=b.dataset.m;render()},
  'mn-toggle':()=>{S.f.pay.addM=!S.f.pay.addM;if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();if(S.f.pay.addM&&S.f.pay.tab==='riwayat')S.f.pay.tab='status';render();if(S.f.pay.addM){const e=$('#mn-nama');if(e)e.focus()}},
  async 'mn-save'(){const nama=$('#mn-nama').value.trim(),er=$('#mn-err');if(!nama){er.textContent='Isi nama mitra dulu.';er.hidden=false;return}
    if(S.schools.some(x=>String(x.name).trim().toLowerCase()===nama.toLowerCase())){er.textContent='Mitra dengan nama ini sudah ada di daftar.';er.hidden=false;return}
    const ps=[...document.querySelectorAll('.mn-prod:checked')].map(c=>({productId:c.value,mrr:0})),ref=db.collection('schools').doc();
    const ok=await write(()=>ref.set({name:nama,city:$('#mn-kota').value.trim()||null,jenjang:$('#mn-jen').value||null,status:'aktif',am:$('#mn-am').value||null,picName:$('#mn-pic').value.trim()||null,picPhone:$('#mn-tel').value.trim()||null,contractStart:today(),contractEnd:null,products:ps,notes:null,createdAt:new Date().toISOString(),createdBy:me.id}),'Mitra ditambahkan ke daftar');
    if(ok){S.f.pay.addM=false;if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();render()}},
  ptipe:b=>{if(!S.payForm)return;S.payForm.tipe=['topup','transaksi'].indexOf(b.dataset.v)>=0?b.dataset.v:'langganan';render()},
  'br-new':()=>{if(!can('branding'))return;S.upl.brand=[];S.brandForm={id:null,judul:'',kategori:'Logo',produk:'',deskripsi:'',tautan:''};render();window.scrollTo(0,0)},
  'br-cancel':()=>{S.brandForm=null;S.upl.brand=[];render()},
  'br-edit':b=>{if(!can('branding'))return;const x=S.brand.find(y=>y.id===b.dataset.id);if(!x)return;S.upl.brand=Array.isArray(x.files)?x.files.slice():[];S.brandForm={id:x.id,dibuat:x.dibuat,judul:x.judul||'',kategori:x.kategori||'Lainnya',produk:x.produk||'',deskripsi:x.deskripsi||'',tautan:x.tautan||''};render();window.scrollTo(0,0)},
  async 'br-del'(b){if(!can('branding')||!armed(b))return;await write(()=>db.doc('branding/'+b.dataset.id).delete(),'Asset dihapus')},
  async 'br-save'(b){const F=S.brandForm;if(!F||!can('branding'))return;const er=$('#bf-err'),tl=String(F.tautan||'').trim();let msg='';
    if(!String(F.judul).trim())msg='Isi nama asset.';else if(tl&&!/^https?:\/\//i.test(tl))msg='Tautan harus diawali http:// atau https://.';else if(!S.upl.brand.length&&!tl)msg='Unggah minimal satu file atau isi tautan desain.';
    if(msg){er.textContent=msg;er.hidden=false;return}
    const d={judul:String(F.judul).trim(),kategori:F.kategori,produk:F.produk||'',deskripsi:String(F.deskripsi||'').trim(),tautan:tl,files:S.upl.brand.slice(),dibuat:F.dibuat||new Date().toISOString(),diubah:new Date().toISOString(),oleh:me.id||null},ref=F.id?db.doc('branding/'+F.id):db.collection('branding').doc();b.disabled=true;
    if(await write(()=>ref.set(d),'Asset tersimpan')){S.brandForm=null;S.upl.brand=[];if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();S.pending=false;render()}else b.disabled=false},
  'adm-tab':b=>{S.f.adm.tab=b.dataset.t;S.admForm=null;S.upl.adm=[];render()},
  'adm-new':b=>{if(!can('administrasi'))return;S.admForm=newAdm(b.dataset.k);render();window.scrollTo(0,0)},
  'tpl-new':b=>{if(!can('administrasi'))return;const m=b&&b.dataset&&b.dataset.menu||'surat';S.tplForm={id:null,menu:m,nama:'',kode:m==='mou'?'SKS':'',link:'',ket:''};render()},
  'tpl-edit':b=>{if(!can('administrasi'))return;const t=(S.tpl||[]).find(y=>y.id===b.dataset.id);if(!t)return;S.tplForm={id:t.id,menu:t.menu||'surat',nama:t.nama||'',kode:t.kode||'',link:t.link||'',ket:t.ket||'',file:t.file||'',dibuat:t.dibuat};render();window.scrollTo(0,0)},
  'tpl-cancel':()=>{S.tplForm=null;render()},
  async 'tpl-del'(b){if(!can('administrasi')||!armed(b))return;await write(()=>db.doc('suratTpl/'+b.dataset.id).delete(),'Template dihapus')},
  async 'tpl-save'(b){const F=S.tplForm;if(!F||!can('administrasi'))return;const er=$('#tf-err');let msg='';const l=String(F.link||'').trim();
    if(!String(F.nama).trim())msg='Isi nama template.';else if(!l)msg='Isi link template.';else if(!/^(https:\/\/|\/_blob\/)/.test(l))msg='Link harus diawali https://';
    if(msg){er.textContent=msg;er.hidden=false;return}
    const d={menu:F.menu||'surat',nama:String(F.nama).trim(),kode:F.kode||'',link:l,ket:String(F.ket||'').trim(),dibuat:F.dibuat||new Date().toISOString(),diubah:new Date().toISOString()};if(F.file)d.file=F.file;const ref=F.id?db.doc('suratTpl/'+F.id):db.collection('suratTpl').doc();b.disabled=true;
    if(await write(()=>ref.set(d),'Template tersimpan')){S.tplForm=null;if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();S.pending=false;render()}else b.disabled=false},
  'gate-in':()=>{if(!me.isOwner)return;try{sessionStorage.setItem('qrion-in','1');sessionStorage.removeItem('qrion-acct')}catch(e){}S.acct=null;S.acTok=null;S.entered=true;S.drawer=null;render();window.scrollTo(0,0)},
  'gate-retry':()=>{S.dead=false;render()},
  logout:()=>doLogout(),
  'adm-cancel':()=>{S.admForm=null;S.upl.adm=[];render()},
  'adm-edit':b=>{if(!can('administrasi'))return;const x=(b.dataset.k==='mou'?S.mou:S.surat).find(y=>y.id===b.dataset.id);if(!x)return;S.admForm=newAdm(b.dataset.k,x);S.admForm.id=x.id;S.admForm.dibuat=x.dibuat;S.f.adm.tab=b.dataset.k;render();window.scrollTo(0,0)},
  async 'adm-del'(b){if(!can('administrasi')||!armed(b))return;await write(()=>db.doc((b.dataset.k==='mou'?'mou/':'surat/')+b.dataset.id).delete(),'Data dihapus')},
  async 'adm-save'(b){const F=S.admForm;if(!F||!can('administrasi'))return;const er=$('#af-err');let msg='';
    if(F.kind==='surat'){if(!String(F.nomor).trim())msg='Isi nomor surat.';else if(F.link&&!/^https:\/\//.test(String(F.link).trim()))msg='Link file harus diawali https://';else if(!F.tanggal)msg='Isi tanggal surat.';else if(!String(F.perihal).trim())msg='Isi perihal surat.'}
    else{if(!String(F.untuk||'').trim())msg='Isi dulu PKS ini untuk sekolah atau instansi mana.';else if(F.mulai&&F.berakhir&&F.berakhir<F.mulai)msg='Tanggal berakhir tidak boleh sebelum tanggal mulai.'}
    if(msg){er.textContent=msg;er.hidden=false;return}
    const base={status:F.status,catatan:String(F.catatan||'').trim(),lampiran:S.upl.adm.slice(),dibuat:F.dibuat||new Date().toISOString(),diubah:new Date().toISOString(),oleh:me.id||null};
    const d=F.kind==='mou'?Object.assign(base,{untuk:String(F.untuk).trim(),nomor:String(F.nomor||'').trim(),judul:String(F.judul||'').trim()||'MoU Kerjasama',tanggalTtd:F.tanggalTtd||'',mulai:F.mulai||'',berakhir:F.berakhir||'',ruang:String(F.ruang||'').trim(),penandatangan:String(F.penandatangan||'').trim()}):Object.assign(base,{arah:F.arah,nomor:String(F.nomor).trim(),tanggal:F.tanggal,perihal:String(F.perihal).trim(),pihak:String(F.pihak||'').trim(),kategori:F.kategori||'',kode:F.arah==='masuk'?'':F.kode,noUrut:F.arah==='masuk'?0:(+F.noUrut||0),penandatangan:String(F.penandatangan||'').trim(),lampiranKet:String(F.lampiranKet||'').trim(),link:String(F.link||'').trim()});
    const col=F.kind==='mou'?'mou':'surat',ref=F.id?db.doc(col+'/'+F.id):db.collection(col).doc();b.disabled=true;
    if(await write(()=>ref.set(d),F.kind==='mou'?'MoU tersimpan':'Surat tersimpan')){S.admForm=null;S.upl.adm=[];if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();S.pending=false;render()}else b.disabled=false},
  ptab:b=>{S.f.pay.tab=b.dataset.t;render();window.scrollTo(0,0)},
  pfil:b=>{S.f.pay.f=b.dataset.s;render()},
  'pay-adv':()=>{S.f.pay.adv=!S.f.pay.adv;render()},
  pcell:b=>{const c=S.f.pay.cell;S.f.pay.cell=c&&c.id===b.dataset.id&&c.b===b.dataset.b?null:{id:b.dataset.id,b:b.dataset.b};render()},
  popen:b=>{S.f.pay.open=S.f.pay.open===b.dataset.id?null:b.dataset.id;render()},
  pyr:b=>{const it=S.payForm&&S.payForm.items[+b.dataset.ix];if(!it)return;it.yr=+b.dataset.y;render()},
  pall:b=>{const it=S.payForm&&S.payForm.items[+b.dataset.ix];if(!it)return;const yr=itYr(it),all=BLN.map((n,k)=>yr+'-'+pad(k+1)),cur=Array.isArray(it.bulan)?it.bulan:[],full=all.every(x=>cur.indexOf(x)>=0);it.bulan=(full?cur.filter(x=>all.indexOf(x)<0):[...new Set(cur.concat(all))]).sort();render()},
  pmon:b=>{const it=S.payForm&&S.payForm.items[+b.dataset.ix];if(!it)return;const a=Array.isArray(it.bulan)?it.bulan.slice():[],i=a.indexOf(b.dataset.b);if(it.jenis==='langganan'){if(i>=0)a.splice(i,1);else a.push(b.dataset.b);it.bulan=a.sort()}else it.bulan=i>=0?[]:[b.dataset.b];render()},
  piadd:b=>{(S.payForm||(S.payForm=newPayForm())).items.push({jenis:b.dataset.j,nama:'',bulan:[nowYM()],yr:+nowYM().slice(0,4),nominal:''});render();const el=$('#pi-n-'+(S.payForm.items.length-1));if(el)el.focus()},
  pidel:b=>{S.payForm.items.splice(+b.dataset.i,1);render()},
  preset:()=>{S.payForm=newPayForm();render()},
  'inv-new':()=>{if(!can('pembayaran'))return;S.invForm=newInv();S.f.pay.inv={mode:'form',id:null};render();window.scrollTo(0,0)},
  'inv-back':()=>{S.invForm=null;S.f.pay.inv={mode:'list',id:null};render();window.scrollTo(0,0)},
  'inv-view':b=>{S.f.pay.inv={mode:'view',id:b.dataset.id};render();window.scrollTo(0,0)},
  'inv-edit':b=>{const x=S.invoices.find(y=>y.id===b.dataset.id);if(!x||!can('pembayaran'))return;S.invForm={editId:x.id,no:x.no,status:x.status,dibuat:x.dibuat,dibuatOleh:x.dibuatOleh,paidAt:x.paidAt,mitraId:x.mitraId||'',untuk:invTo(x)==='-'?'':invTo(x),alamatUntuk:x.alamatUntuk||'',tanggal:x.tanggal,jatuhTempo:x.jatuhTempo,ppn:String(x.ppn||0),diskon:x.diskon?fmtN(x.diskon):'',catatan:x.catatan||'',items:(x.items||[]).map(y=>({produk:y.produk||'',nama:y.nama||'',qty:String(y.qty),harga:fmtN(y.harga),disc:y.disc?fmtN(y.disc):''}))};S.f.pay.inv={mode:'form',id:x.id};render();window.scrollTo(0,0)},
  'inv-add':()=>{if(!S.invForm)return;S.invForm.items.push({produk:'',nama:'',qty:'1',harga:'',disc:''});render();const el=$('#ir-n-'+(S.invForm.items.length-1));if(el)el.focus()},
  'inv-del':b=>{if(!S.invForm)return;if(S.invForm.items.length>1)S.invForm.items.splice(+b.dataset.i,1);else S.invForm.items=[{produk:'',nama:'',qty:'1',harga:'',disc:''}];render()},
  'inv-fill':()=>{const F=S.invForm,sc=F&&school(F.mitraId);if(!sc)return;const rows=(sc.products||[]).map(p=>({produk:prodName(p.productId),nama:'Langganan '+BLN_F[+nowYM().slice(5,7)-1],qty:'1',harga:p.mrr?fmtN(p.mrr):'',disc:''}));if(!rows.length)return;F.items=F.items.every(y=>!y.nama&&!y.produk&&!y.harga)?rows:F.items.concat(rows);render()},
  async 'inv-save'(b){const F=S.invForm,er=$('#iv-err');if(!F||!can('pembayaran'))return;let msg='';const items=F.items.map(y=>({produk:String(y.produk||'').trim(),nama:String(y.nama||'').trim(),qty:numOf(y.qty)||0,harga:numOf(y.harga)||0,disc:numOf(y.disc)||0}));
    if(!String(F.untuk||'').trim())msg='Isi dulu invoice ini untuk siapa.';else if(!F.tanggal||!F.jatuhTempo)msg='Isi tanggal terbit dan jatuh tempo.';else if(F.jatuhTempo<F.tanggal)msg='Jatuh tempo tidak boleh sebelum tanggal terbit.';else if(!items.length||items.some(y=>(!y.nama&&!y.produk)||y.qty<1||y.harga<1))msg='Setiap baris perlu produk atau deskripsi, qty minimal 1, dan harga.';
    if(msg){er.textContent=msg;er.hidden=false;return}
    const c=invCalc(items,F.diskon,F.ppn),docu={untuk:String(F.untuk).trim(),alamatUntuk:String(F.alamatUntuk||'').trim(),tanggal:F.tanggal,jatuhTempo:F.jatuhTempo,items,diskon:numOf(F.diskon)||0,ppn:+F.ppn||0,subtotal:c.sub,total:c.total,catatan:String(F.catatan||'').trim(),status:F.status||'terbit',no:F.no||invNext(F.tanggal),dibuat:F.dibuat||new Date().toISOString(),dibuatOleh:F.dibuatOleh||me.id||null};
    if(F.paidAt)docu.paidAt=F.paidAt;const ref=F.editId?db.doc('invoices/'+F.editId):db.collection('invoices').doc();b.disabled=true;
    if(await write(()=>ref.set(docu),'Invoice '+docu.no+' tersimpan')){S.invForm=null;S.f.pay.inv=ref.id?{mode:'view',id:ref.id}:{mode:'list',id:null};if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();S.pending=false;render();window.scrollTo(0,0)}else b.disabled=false},
  async 'inv-paid'(b){if(!can('pembayaran'))return;await write(()=>db.doc('invoices/'+b.dataset.id).update({status:'lunas',paidAt:today()}),'Invoice ditandai lunas')},
  async 'inv-void'(b){if(!can('pembayaran')||!armed(b))return;await write(()=>db.doc('invoices/'+b.dataset.id).update({status:'batal'}),'Invoice dibatalkan')},
  'inv-print':()=>{const x=S.invoices.find(y=>y.id===(S.f.pay.inv||{}).id);if(!x)return;const d=document.createElement('div');d.className='invprint';d.innerHTML=invMarkup(x);document.body.appendChild(d);try{window.print()}catch(e){toast('Cetak tidak tersedia di tampilan ini. Gunakan Unduh file.',true)}setTimeout(()=>d.remove(),800)},
  async 'inv-dl'(b){const x=S.invoices.find(y=>y.id===b.dataset.id);if(!x||!S.dl)return;const emb=async u=>{try{const r=await fetch(u),bl=await r.blob();return await new Promise(ok=>{const fr=new FileReader();fr.onload=()=>ok(fr.result);fr.onerror=()=>ok(u);fr.readAsDataURL(bl)})}catch(e){return u}},keep=S.invSet;S.invSet=Object.assign({},keep,{__d:{}});for(const k of ['logo','ttd'])if(keep[k])S.invSet.__d[keep[k]]=await emb(keep[k]);const mk=invMarkup(x);S.invSet=keep;const data='<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>'+esc(x.no)+'</title><style>body{margin:0;padding:24px;background:#f5f5f7}'+INV_CSS+'.inv{border-radius:6px;overflow:hidden;box-shadow:0 1px 2px rgba(15,23,42,.08),0 18px 40px rgba(15,23,42,.14)}@media print{body{padding:0;background:#fff}.inv{border-radius:0;box-shadow:none}}'+'</style></head><body>'+mk+'</body></html>';
    try{await S.dl.save({filename:'invoice-'+String(x.no||'qrion').replace(/[\/\\]/g,'-')+'.html',data});toast('File invoice disimpan. Buka lalu cetak untuk membuat PDF.')}catch(e){if(!e||e.code!=='declined')toast('Unduhan tidak tersedia pada tampilan ini.',true)}},
  invfil:b=>{S.f.pay.ist=b.dataset.s;render()},
  async 'is-save'(){if(!me.isOwner||S.sim)return;await write(()=>db.doc('settings/invoice').set(Object.assign({},S.invSet,{nama:$('#is-nama').value.trim(),kontak:$('#is-kontak').value.trim(),alamat:$('#is-alamat').value.trim(),rekening:$('#is-rek').value.trim(),catatan:$('#is-cat').value.trim(),penandatangan:$('#is-ttdn').value.trim(),mulai:numOf($('#is-mulai').value)||''})),'Data penerbit invoice tersimpan')},
  async 'is-clear'(b){if(!me.isOwner||S.sim)return;const o=Object.assign({},S.invSet);delete o[b.dataset.k];await write(()=>db.doc('settings/invoice').set(o),'Gambar dihapus')},
  pedit:b=>{const x=S.pay.find(y=>y.id===b.dataset.id);if(!x)return;S.payForm={trxJml:x.trx&&x.trx.jumlah?fmtN(x.trx.jumlah):'',trxBiaya:x.trx&&x.trx.biaya?fmtN(x.trx.biaya):'',trxBulan:x.trx&&isYM(x.trx.bulan)?x.trx.bulan:x.topup&&isYM(x.topup.bulan)?x.topup.bulan:nowYM(),tipe:['topup','transaksi'].indexOf(x.tipe)>=0?x.tipe:'langganan',editId:x.id,mitraId:x.mitraId||'',tanggal:x.tanggal||'',total:typeof x.total==='number'?fmtN(x.total):'',bukti:x.bukti||'',catatan:x.catatan||'',dibuat:x.dibuat,sumber:x.sumber,
    items:pItems(x).map(y=>{const bl=(Array.isArray(y.bulan)?y.bulan:[]).filter(isYM);return{jenis:y.jenis==='tambahan'?'tambahan':'langganan',nama:y.nama||'',bulan:bl,nominal:typeof y.nominal==='number'?fmtN(y.nominal):''}})};S.f.pay.tab='input';render();window.scrollTo(0,0)},
  async pdel(b){if(!armed(b))return;await write(()=>db.doc('pembayaran/'+b.dataset.id).delete(),'Pembayaran dihapus')},
  async psave(b){const F=S.payForm,er=$('#pf-err'),r=F.tipe==='topup'||F.tipe==='transaksi'?{items:[],bad:false}:payRead(),isL=!(F.tipe==='topup'||F.tipe==='transaksi'),pc=isL?payTot(r):null,leg=isL&&F.editId&&pc.t<=0&&r.items.every(y=>typeof y.nominal!=='number'),total=isL?(leg?numOf(F.total):pc.t):numOf(F.total),bk=String(F.bukti||'').trim();let msg='';
    if(!F.mitraId)msg='Pilih mitra dulu.';else if(isL&&!r.items.length)msg='Tambahkan minimal satu item yang dibayar.';else if(isL&&!leg&&pc.miss)msg='Isi nominal untuk setiap item.';else if(total===null||total<=0)msg=isL?'Isi nominal item yang dibayar.':'Isi total yang dibayar.';else if(r.bad)msg='Setiap item perlu nama. Isi namanya atau hapus barisnya.';else if(r.nob)msg='Pilih minimal satu bulan untuk tiap item langganan.';else if(bk&&!/^https?:\/\//i.test(bk))msg='Tautan bukti harus diawali http:// atau https://.';
    if(msg){er.textContent=msg;er.hidden=false;return}
    const docu={tipe:['topup','transaksi'].indexOf(F.tipe)>=0?F.tipe:'langganan',mitraId:F.mitraId,tanggal:F.tanggal||'',total,items:r.items,catatan:String(F.catatan||'').trim(),bukti:bk,dibuat:F.dibuat||new Date().toISOString(),dicatatOleh:me.id||null};if(F.sumber)docu.sumber=F.sumber;if(F.tipe==='topup')docu.topup={bulan:isYM(F.trxBulan)?F.trxBulan:nowYM()};if(F.tipe==='transaksi')docu.trx={bulan:F.trxBulan,jumlah:numOf(F.trxJml)||0,biaya:numOf(F.trxBiaya)||0};
    b.disabled=true;const mid=F.mitraId,ref=F.editId?db.doc('pembayaran/'+F.editId):db.collection('pembayaran').doc();
    if(await write(()=>ref.set(docu),'Pembayaran '+schoolName(mid)+' '+rp(total)+' tersimpan')){S.payForm=newPayForm();S.f.pay.open=mid;S.f.pay.tab='status';if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();S.pending=false;render();window.scrollTo(0,0)}else b.disabled=false},
  itab:b=>{S.f.isu.tab=b.dataset.t;if(b.dataset.s!==undefined)S.f.isu.st=b.dataset.s;S.drawer=null;render();window.scrollTo(0,0)},
  ist:b=>{S.f.isu.st=b.dataset.s;render()},
  async 'tk-claim-id'(b){const x=S.issues.find(i=>i.id===b.dataset.id);if(!x)return;const r=await tstatus(x,'In Progress',{assignee:me.id},[],'Tiket diambil, status In Progress');if(r!==false||S.sim){S.drawer=['isu',x.id];render();window.scrollTo(0,0)}},
  async 'tk-claim'(){const x=cur().x;await tstatus(x,'In Progress',{assignee:me.id},[],'Tiket diambil, status In Progress')},
  async 'tk-ok'(){await tstatus(cur().x,'Closed',{},[{kind:'text',body:'Pelapor menyatakan masalah selesai.'}],'Tiket ditutup')},
  async 'tk-notok'(){const x=cur().x,r=$('#d-reason').value.trim();if(!r){toast('Tulis apa yang masih bermasalah.',true);return}$('#d-reason').value='';await tstatus(x,'In Progress',{reopenCount:(x.reopenCount||0)+1},[{kind:'text',body:'Belum selesai: '+r}],'Tiket dikembalikan ke programmer')},
  async 'tk-reopen'(){await tstatus(cur().x,'In Progress',{},[],'Tiket dibuka kembali')},
  async 'tk-csat'(b){const c=cur(),cm=$('#d-csatc').value.trim();await write(()=>c.ref.update({csat:{score:+b.dataset.s,comment:cm||null,at:new Date().toISOString()}}),'Terima kasih atas penilaiannya')},
  async 'tk-msg'(){const c=cur(),el=$('#d-log'),t=el.value.trim(),fl=S.upl.msg.slice();if(!t&&!fl.length)return;const nt=$('#d-note'),kd=$('#d-kind'),kind=kd?kd.value:(nt&&nt.checked?'note':'text'),now=new Date().toISOString(),m={at:now,by:me.id,kind,body:t};if(fl.length)m.files=fl;const u={messages:(c.x.messages||[]).concat([m])};if(canHandle()&&!c.x.firstResponseAt&&kind!=='note')u.firstResponseAt=now;el.value='';if(await write(()=>c.ref.update(u),kind==='action'?'Tindakan dicatat':'Pesan terkirim')){S.upl.msg=[];attRefresh('msg')}},
  'att-rm':b=>{S.upl[b.dataset.b].splice(+b.dataset.i,1);attRefresh(b.dataset.b)},
  cal:b=>{const f=S.f.project,d=+b.dataset.d,c=f.cal||today().slice(0,7);if(!d)f.cal=today().slice(0,7);else{const n=new Date(+c.slice(0,4),+c.slice(5,7)-1+d,1);f.cal=n.getFullYear()+'-'+pad(n.getMonth()+1)}render()},
  sort:b=>{const v=b.dataset.v,i=+b.dataset.i,c=S.sort[v];S.sort[v]=c&&c.i===i?{i,d:-c.d}:{i,d:1};render()},
  async csv(){const c=S.csv;if(!c||!S.dl)return;const q=v=>{let t=String(v==null?'':v);if(typeof v==='string'&&/^[=+\-@\t\r]/.test(t))t="'"+t;return '"'+t.replace(/"/g,'""')+'"'};
    const data='﻿'+[c.cols.map(x=>q(x.l)).join(',')].concat(c.rows.map(r=>c.cols.map(x=>q((x.c||x.v)(r))).join(','))).join('\r\n');
    try{await S.dl.save({filename:'qrion-'+c.view+'-'+today()+'.csv',data});toast('File CSV disimpan')}catch(e){if(!e||e.code!=='declined')toast('Ekspor tidak tersedia pada tampilan ini.',true)}},
  async 'ct-add'(){const c=cur(),n=$('#d-cn').value.trim();if(!n)return;const p={name:n,title:$('#d-cj').value.trim()||null,phone:$('#d-cp').value.trim()||null};['#d-cn','#d-cj','#d-cp'].forEach(i=>$(i).value='');await write(()=>c.ref.update({contacts:(c.x.contacts||[]).concat([p])}),'Kontak ditambahkan')},
  async 'ct-del'(b){const c=cur(),a=(c.x.contacts||[]).slice();a.splice(+b.dataset.i,1);await write(()=>c.ref.update({contacts:a}))},
  edit:()=>{const c=cur();openForm(c.k,c.id)},
  'edit-prod':()=>{const c=cur();if(c&&c.k==='sekolah')openForm('sekprod',c.id)},
  close:()=>{const t=S.drawer&&S.drawer[0]==='isu';S.drawer=null;if(t&&S.f.isu.tab==='beranda')S.f.isu.tab='board';render()},
  'form-close':()=>{S.form=null;closeModal()},
  async del(b){if(!armed(b))return;const c=cur();if(await write(()=>c.ref.delete(),'Data dihapus')){S.drawer=null;render()}},
  async 'log-add'(){const c=cur(),el=$('#d-log'),t=el.value.trim();if(!t)return;el.value='';const ty=$('#d-atype');await write(()=>c.ref.update({log:(c.x.log||[]).concat([{at:new Date().toISOString(),by:me.id,type:ty?ty.value:'Catatan',text:t}])}),'Aktivitas dicatat')},
  async 'ms-add'(){const c=cur(),el=$('#d-ms'),t=el.value.trim();if(!t)return;const due=$('#d-msdue').value||null,who=$('#d-msw').value||null;el.value='';$('#d-msdue').value='';await write(()=>c.ref.update({milestones:(c.x.milestones||[]).concat([{title:t,due,who,status:'belum',done:false}])}),'Tugas ditambahkan')},
  async 'ms-del'(b){const c=cur(),ms=(c.x.milestones||[]).slice();ms.splice(+b.dataset.i,1);await write(()=>c.ref.update({milestones:ms}))},
  async convert(){const c=cur(),l=c.x,ps=l.products||[],ref=db.collection('schools').doc();
    const ok=await write(()=>ref.set({name:l.name,city:l.city||null,jenjang:null,status:'onboarding',am:l.am||null,picName:l.contact||null,picPhone:l.phone||null,contractStart:today(),contractEnd:null,products:ps.map(p=>({productId:p,mrr:Math.round((+l.estMrr||0)/ps.length)})),notes:l.notes||null,createdAt:new Date().toISOString(),createdBy:me.id}));
    if(ok&&await write(()=>c.ref.update({schoolId:ref.id}),'Mitra sekolah dibuat. Lengkapi kontrak dan MRR-nya.')){S.drawer=['sekolah',ref.id];location.hash='sekolah';render()}},
  'ac-gen'(){if(!S.acForm)return;const cs='abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789',r=crypto.getRandomValues(new Uint8Array(14));S.acForm.password=[...r].map(x=>cs[x%cs.length]).join('');const i=$('#ac-pass');if(i)i.value=S.acForm.password},
  'ac-cancel'(){S.acForm=null;render()},
  'ac-reset'(b){if(!own())return;S.acForm={mode:'reset',u:b.dataset.u,nama:'',username:'',password:'',role:''};render();const i=$('#ac-pass');if(i)i.focus()},
  async 'ac-save'(){
    const F=S.acForm;if(!F||!own()||!db)return;
    const pw=String(F.password||'');if(pw.length<10){toast('Sandi minimal 10 karakter.',true);return}
    try{
      if(F.mode==='reset'){const a=S.accounts.find(x=>x.id===F.u);if(!a){toast('Akun tidak ditemukan.',true);return}const c=await mkCred(pw);await window.__QR.setPassword(a.id,pw);
        if(await write(()=>db.doc('accounts/'+a.id).set(Object.assign(acDoc(a),c)),'Sandi diperbarui'))S.acForm=null;render();return}
      const u=normU(F.username),nama=String(F.nama||'').trim();
      if(!nama){toast('Isi nama lengkap.',true);return}
      if(!okU(u)){toast('Username 3-32 karakter: huruf kecil, angka, titik, strip, atau garis bawah.',true);return}
      if(S.accounts.some(x=>x.id===u)){toast('Username sudah dipakai.',true);return}
      if(!F.role||!ACC()[F.role]){toast('Pilih peran.',true);return}
      const c=await mkCred(pw);await window.__QR.setPassword(u,pw);
      if(await write(()=>db.doc('accounts/'+u).set(Object.assign({nama,role:F.role,aktif:true,dibuat:new Date().toISOString()},c)),'Akun @'+u+' dibuat'))S.acForm=null;render()
    }catch(e){toast((e&&e.message)||'Gagal menyimpan akun.',true)}},
  async 'ac-toggle'(b){const a=S.accounts.find(x=>x.id===b.dataset.u);if(!a||!own())return;await write(()=>db.doc('accounts/'+a.id).set(Object.assign(acDoc(a),{aktif:a.aktif===false})),a.aktif===false?'Akun diaktifkan':'Akun dinonaktifkan')},
  async 'ac-del'(b){if(!own()||!armed(b))return;try{await window.__QR.dropUser(b.dataset.u)}catch(e){toast((e&&e.message)||'Gagal menghapus login.',true);return}await write(()=>db.doc('accounts/'+b.dataset.u).delete(),'Akun dihapus')},
  async 'cat-new'(){await catFlush();S.f.cat.q='';S.f.cat.sel='new';ntBlur();render();const e=$('#nt-text');if(e)e.focus()},
  async 'cat-open'(b){const id=b.dataset.id;if(id===S.f.cat.sel)return;await catFlush();S.f.cat.sel=id;ntBlur();render()},
  async 'cat-del'(b){const c=catCol(),id=S.f.cat.sel;if(!armed(b))return;clearTimeout(S.catT);S.catT=null;if(id&&id!=='new'&&c){try{await c.doc(id).delete();toast('Catatan dihapus')}catch(e){toast(errMsg(e),true);return}}S.f.cat.sel=null;render()},
  'abs-tab'(b){S.f.abs.tab=b.dataset.t;render()},
  async 'abs-in'(){const f=S.f.abs,d=today();if(!me.id||!db||S.absBusy)return;if(absOf(d,me.id)){toast('Anda sudah absen hari ini.',true);return}
    S.absBusy=true;const now=new Date().toISOString(),nt=absNoTime({status:f.st}),doc={tanggal:d,uid:me.id,nama:nameOf(me.id),status:f.st,masuk:nt?null:now,pulang:null,catatan:String(f.cat||'').trim(),dibuat:now};
    const ok=await write(()=>db.doc('absensi/'+absId(d,me.id)).set(doc));S.absBusy=false;if(ok){f.cat='';toast(nt?'Tercatat '+ABS_ST[f.st][0].toLowerCase():'Check in berhasil, '+hhmm(now))}},
  async 'abs-out'(){const d=today(),x=me.id&&absOf(d,me.id);if(!x||!x.masuk||x.pulang||S.absBusy)return;S.absBusy=true;const now=new Date().toISOString();const ok=await write(()=>db.doc('absensi/'+x.id).update({pulang:now}));S.absBusy=false;if(ok)toast('Check out berhasil, '+hhmm(now))},
  async 'abs-undo'(b){const x=S.abs.find(y=>y.id===b.dataset.id);if(!x||x.uid!==me.id||!armed(b))return;await write(()=>db.doc('absensi/'+x.id).delete());toast('Absen hari ini dibatalkan')},
  async 'abs-del'(b){if(!canAbsAdm()||!armed(b))return;await write(()=>db.doc('absensi/'+b.dataset.id).delete(),'Data absen dihapus')},
  async 'abs-fix'(b){const x=S.abs.find(y=>y.id===b.dataset.id),el=$('#abt-'+b.dataset.id);if(!x||x.uid!==me.id||!el||!el.value)return;const t=new Date(x.tanggal+'T'+el.value+':00');if(isNaN(t)||t<new Date(x.masuk)){toast('Jam pulang harus setelah jam masuk.',true);return}await write(()=>db.doc('absensi/'+x.id).update({pulang:t.toISOString(),dikoreksi:true}))},
  async 'abs-set'(){if(!own())return;const m=$('#as-m').value,pl=$('#as-p').value,t=+$('#as-t').value;if(!m||!pl){toast('Isi jam masuk dan jam pulang.',true);return}await write(()=>db.doc('settings/absen').set({jamMasuk:m,jamPulang:pl,toleransi:Math.max(0,Math.min(120,t||0))}),'Jam kerja tersimpan')},
  'inv-goto'(b){S.f.pay.tab='invoice';S.f.pay.inv={mode:'view',id:b.dataset.id};if(location.hash==='#pembayaran')render();else location.hash='pembayaran'},
  'log-more'(){S.f.log.n+=80;render()},
 'set-jump'(b){const el=document.getElementById('set-'+(b.dataset.id||''));if(el)el.scrollIntoView({behavior:'smooth',block:'start'})},
  'mou-goto'(){S.f.adm.tab='mou';if(location.hash==='#administrasi')render();else location.hash='administrasi'},
  async 'ppl-save'(){const items=[...new Set($('#ppl-in').value.split(',').map(x=>x.trim()).filter(Boolean))];if(!items.length){toast('Isi minimal satu nama.',true);return}await write(()=>db.doc('settings/people').set({items}),'Daftar pelaksana tersimpan')},
  async 'am-save'(){const items=[...new Set($('#am-in').value.split(',').map(x=>x.trim()).filter(Boolean))];await write(()=>db.doc('settings/ams').set({items}),'Daftar AM tersimpan')},
  'acc-add':()=>{const k='r-'+Math.random().toString(36).slice(2,8);S.accDraft[k]={name:'Peran baru',home:'isu',access:{ringkasan:0,isu:2,project:0,sekolah:0,pembayaran:0,pipeline:0}};render();const el=$('#ac-n-'+k);if(el){el.focus();el.select()}},
  'sim-exit':()=>window.__QR.setSim(''),
  'acc-del':b=>{delete S.accDraft[b.dataset.k];render()},
  'acc-reset':()=>{S.accDraft=null;render()},
  async 'acc-save'(){const A=S.accDraft,ks=Object.keys(A);for(const k of ks){const r=A[k];r.name=String(r.name||'').trim();if(!r.name){toast('Setiap peran perlu nama.',true);return}
      MODS.forEach(m=>{r.access[m[0]]=+r.access[m[0]]||0});if(!MODS.some(m=>m[0]!=='isuNo'&&m[0]!=='absen'&&r.access[m[0]]>=1)){toast('Peran '+r.name+' belum punya akses ke menu apa pun.',true);return}
      if(!(r.access[r.home]>=1))r.home=MODS.find(m=>m[0]!=='isuNo'&&m[0]!=='absen'&&r.access[m[0]]>=1)[0]}
    if(await write(()=>db.doc('settings/access').set({roles:A}),'Hak akses tersimpan')){S.accDraft=null;if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();render()}},
  'prod-add':()=>{S.prodDraft.push({id:'p-'+Math.random().toString(36).slice(2,8),name:''});render();const el=$('#prod-'+(S.prodDraft.length-1));if(el)el.focus()},
  'prod-del':b=>{S.prodDraft.splice(+b.dataset.i,1);render()},
  async 'prod-save'(){const items=S.prodDraft.map(p=>({id:p.id,name:p.name.trim()})).filter(p=>p.name);if(await write(()=>db.doc('settings/products').set({items}),'Daftar produk tersimpan')){S.prodDraft=null;render()}},
  async 'demo-del'(b){if(!armed(b))return;b.disabled=true;let n=0;
    for(const k of ['issues','projects','schools','leads','invoices','brand'])for(const x of S[k].filter(r=>r.contoh)){try{await db.collection(k==='brand'?'branding':k).doc(x.id).delete();n++}catch(e){toast(errMsg(e),true);return}}
    toast(n+' data contoh dihapus')}
};
document.addEventListener('click',e=>{
  if(e.target.closest&&e.target.closest('select[data-qam]'))return;
  const a=e.target.closest('[data-act]');
  if(a){if(a.tagName!=='SELECT'){e.preventDefault();ACT[a.dataset.act](a)}return}
  const o=e.target.closest('[data-open]');
  if(o){const [k,id]=o.dataset.open.split(':');S.drawer=[k,id];if(k==='isu'){if(S.view!=='isu'){location.hash='isu';return}render();window.scrollTo(0,0);return}render();return}
  if(e.target.id==='lscrim'){S.drawer=null;render()}
});
document.addEventListener('submit',e=>{e.preventDefault();if(e.target.id==='frm')submitForm();if(e.target.id==='lgf')doLogin();if(e.target.id==='acf')ACT['ac-save']()});
document.addEventListener('input',e=>{
  const t=e.target;
  if(t.dataset.f&&t.type==='search'){const [v,k]=t.dataset.f.split('.');S.f[v][k]=t.value;queue()}
  if(t.id==='gq'){S.gq=t.value;queue()}
  if(t.dataset.cn){const it=$('.nt-i[aria-current="true"]'),v=t.value;if(it){it.querySelector('b').textContent=ntTitle(v);it.querySelector('span').textContent=(v.trim()?'Baru saja · '+ntPrev(v):'')}const st=$('#ntst');if(st)st.textContent='Menyimpan…';clearTimeout(S.catT);S.catT=setTimeout(catSave,700);return}
  if(t.dataset.ef&&S.expForm){S.expForm[t.dataset.ef]=t.value;return}
  if(t.dataset.abf&&t.dataset.abf!=='m'&&t.dataset.abf!=='d'){S.f.abs[t.dataset.abf]=t.value;if(t.dataset.abf==='st'){return}}
  if(S.acForm&&t.dataset.lf){S.acForm[t.dataset.lf]=t.dataset.lf==='username'?t.value.toLowerCase():t.value}
  if(t.dataset.ack&&S.accDraft&&S.accDraft[t.dataset.ack]){const r=S.accDraft[t.dataset.ack];if(t.dataset.acm)r.access[t.dataset.acm]=+t.value;else r[t.dataset.acf]=t.value}
  if(S.invForm&&t.dataset.if){S.invForm[t.dataset.if]=t.value;invSum()}
  if(S.invForm&&t.dataset.ir&&S.invForm.items[+t.dataset.ix]){S.invForm.items[+t.dataset.ix][t.dataset.ir]=t.value;invSum()}
  if(S.brandForm&&t.dataset.bf){S.brandForm[t.dataset.bf]=t.value;return}
  if(S.tplForm&&t.dataset.tf){S.tplForm[t.dataset.tf]=t.value;return}
  if(S.admForm&&t.dataset.af){S.admForm[t.dataset.af]=t.value;if(t.dataset.af==='noUrut'&&S.admForm.kind==='surat'&&S.admForm.arah!=='masuk'&&+t.value>0){S.admForm.nomor=suratNomor(S.admForm.kode,+t.value,S.admForm.tanggal);const n=$('#af-nomor');if(n)n.value=S.admForm.nomor}return}
  if(S.payForm&&t.dataset.pf){S.payForm[t.dataset.pf]=t.value;if(S.payForm.tipe==='transaksi'&&(t.dataset.pf==='trxJml'||t.dataset.pf==='trxBiaya')){const j=numOf(S.payForm.trxJml),b=numOf(S.payForm.trxBiaya);if(j&&b){S.payForm.total=fmtN(j*b);const el=$('#pf-total');if(el)el.value=S.payForm.total}}paySum()}
  if(S.payForm&&t.dataset.pk&&S.payForm.items[+t.dataset.ix]){S.payForm.items[+t.dataset.ix][t.dataset.pk]=t.value;paySum()}
  if(S.form&&S.form.k==='isu'&&!S.form.id&&$('#triage')){const a=$('#f-subject').value,b=$('#f-description').value,c=$('#f-category').value||triCat(a,b),u=triUrg(a,b,c,+(($('#f-txAmount')||{}).value)||0);$('#triage').textContent='Triase otomatis: kategori '+c+', prioritas '+u+', target penyelesaian '+durFmt(SLA_MIN[u]/60)+'.'}
  if(S.form&&S.form.k==='project'){const a=$('#f-start'),b=$('#f-duration'),c=$('#f-end');if((t===a||t===b)&&a.value&&+b.value>0)c.value=addDays(a.value,+b.value);else if(t===c&&a.value&&c.value>=a.value)b.value=days(a.value,c.value)}
  if(t.dataset.pi!=null&&S.prodDraft)S.prodDraft[+t.dataset.pi].name=t.value;
});
document.addEventListener('change',async e=>{
  const t=e.target;
  if(t.id==='imp-file'){const f=t.files&&t.files[0];if(!f||!isAdmin())return;
    if(f.size>8*1024*1024){toast('File terlalu besar (maksimal 8 MB).',true);return}
    if(!/\.xlsx$/i.test(f.name)){toast('Gunakan file berformat .xlsx. Dari Google Sheets: File, Unduh, Microsoft Excel (.xlsx).',true);return}
    try{const sh=await X.read(new Uint8Array(await f.arrayBuffer()));S.imp={name:f.name,plan:impPlan(sh)};render()}catch(er){toast('File tidak bisa dibaca. Pastikan file .xlsx dan berasal dari template.',true)}
    return}
  if(S.admForm&&S.admForm.kind==='surat'&&['arah','kode','tanggal'].indexOf(t.dataset.af)>=0){S.admForm[t.dataset.af]=t.value;if(!S.admForm.id){if(S.admForm.arah==='masuk'&&t.dataset.af==='arah'){S.admForm.nomor='';S.admForm.noUrut=0}else suratAuto(S.admForm)}if(t.dataset.af!=='tanggal'||!S.admForm.id||true)render();return}
  if(S.payForm&&(t.dataset.ty||t.dataset.tm)){const cv=String(S.payForm.trxBulan||nowYM()),y0=cv.slice(0,4),m0=cv.slice(5,7);S.payForm.trxBulan=(t.dataset.ty?t.value:y0)+'-'+(t.dataset.tm?t.value:m0);return}
  if(t.dataset.att){await pickFiles(t.dataset.att,t);return}
  if(t.dataset.up){const f0=t.files&&t.files[0],k=t.dataset.up;t.value='';if(!f0||!S.assets||!me.isOwner||S.sim)return;if(f0.size>5*1048576){toast('Gambar maksimal 5 MB.',true);return}try{const r=await S.assets.upload(f0);await write(()=>db.doc('settings/invoice').set(Object.assign({},S.invSet,{[k]:r.url})),'Gambar tersimpan')}catch(e){toast('Gagal mengunggah gambar.',true)}return}
  if(t.dataset.sim!=null){window.__QR.setSim(t.value);return}
  if(t.dataset.f&&t.tagName==='SELECT'){const [v,k]=t.dataset.f.split('.');S.f[v][k]=t.value;queue();return}
  if(t.dataset.ack&&S.accDraft&&S.accDraft[t.dataset.ack]){const r=S.accDraft[t.dataset.ack];if(t.dataset.acm)r.access[t.dataset.acm]=+t.value;else r[t.dataset.acf]=t.value;return}
  if(t.dataset.ef&&S.expForm){S.expForm[t.dataset.ef]=t.value;return}
  if(t.dataset.efc&&S.expForm){S.expForm[t.dataset.efc]=t.checked;return}
  if(t.dataset.exf){S.f.exp.m=isYM(t.value)?t.value:nowYM();S.pending=false;render();return}
  if(t.dataset.abf){S.f.abs[t.dataset.abf]=t.value;if(t.dataset.abf==='st'||t.dataset.abf==='m'||t.dataset.abf==='d'){S.pending=false;render()}return}
  if(S.acForm&&t.dataset.lf==='role'){S.acForm.role=t.value;return}
  if(t.dataset.qam){const sc=S.schools.find(x=>x.id===t.dataset.qam);if(sc&&can('sekolah'))await write(()=>db.collection('schools').doc(sc.id).update({am:t.value||null}),'AM '+sc.name+': '+(t.value?nameOf(t.value):'dikosongkan'));return}
  if(t.dataset.acam!=null){const a=S.accounts.find(x=>x.id===t.dataset.acam);if(a&&own())await write(()=>db.doc('accounts/'+a.id).set(Object.assign(acDoc(a),{am:t.value||null})),'AM akun @'+a.id+' diperbarui');return}
  if(t.dataset.acrole){const a=S.accounts.find(x=>x.id===t.dataset.acrole);if(a&&own())await write(()=>db.doc('accounts/'+a.id).set(Object.assign(acDoc(a),{role:t.value})),'Peran akun diperbarui');return}
  if(t.dataset.role!=null){const ref=db.doc('roles/'+t.dataset.role);await write(()=>t.value?ref.set({role:t.value}):ref.delete(),'Peran diperbarui');return}
  if(t.dataset.tk!=null){const c=cur(),ms=(c.x.milestones||[]).map((m,i)=>i===+t.dataset.tk?Object.assign({},m,{status:t.value,done:t.value==='selesai'}):m);await write(()=>c.ref.update({milestones:ms}));return}
  if(t.dataset.actChange==='pstatus'){const c=cur();await write(()=>c.ref.update({status:t.value,log:(c.x.log||[]).concat([{at:new Date().toISOString(),by:me.id,text:'Status diubah menjadi '+PSTAT[t.value]}])}),'Status diperbarui');return}
  if(t.dataset.actChange==='tk-status'){if(t.value)await tstatus(cur().x,t.value);return}
  if(t.dataset.actChange==='tk-asg'){const c=cur(),x=c.x;if(!t.value||(x.assignee||'')===t.value)return;await write(()=>c.ref.update({assignee:t.value||null,messages:(x.messages||[]).concat([{at:new Date().toISOString(),by:me.id,kind:'system',body:t.value?'Ditugaskan ke '+nameOf(t.value):'Dikembalikan ke antrean bersama'}])}),t.value?'Tiket ditugaskan ke '+nameOf(t.value):'Tiket dikembalikan ke antrean');return}
  if(t.dataset.actChange==='tk-cat'){const c=cur();await write(()=>c.ref.update({category:t.value}),'Kategori dikoreksi');return}
  if(t.dataset.actChange==='tk-urg'){const c=cur(),x=c.x;await write(()=>c.ref.update({urgency:t.value,slaDeadline:new Date(new Date(x.createdAt).getTime()+(SLA_MIN[t.value]+(x.pausedMinutes||0))*6e4).toISOString()}),'Prioritas dikoreksi, tenggat SLA dihitung ulang');return}
  if(t.dataset.actChange==='sam'){const c=cur();await write(()=>c.ref.update({am:t.value||null,log:(c.x.log||[]).concat([{at:new Date().toISOString(),by:me.id,type:'Catatan',text:'AM diubah menjadi '+(t.value?nameOf(t.value):'belum ditugaskan')}])}),'AM diperbarui');return}
  if(t.dataset.sf&&S.drawer&&S.drawer[0]==='sekolah'&&can('sekolah')){const c=cur(),k=t.dataset.sf;if(!c.x)return;let v=t.value;if(k==='students')v=+v||0;else if(['contractStart','contractEnd','nextDate','am','address','nextAction','notes'].indexOf(k)>=0)v=String(v).trim()||null;const upd={[k]:v};if(k==='am')upd.log=(c.x.log||[]).concat([{at:new Date().toISOString(),by:me.id,type:'Catatan',text:'AM diubah menjadi '+(v?nameOf(v):'belum ditugaskan')}]);await write(()=>c.ref.update(upd),'Perubahan tersimpan');return}
  if(t.dataset.sfm&&S.drawer&&S.drawer[0]==='sekolah'&&can('sekolah')){const c=cur();if(!c.x)return;const pr=(c.x.products||[]).map(p=>p.productId===t.dataset.sfm?{productId:p.productId,mrr:Math.max(0,+t.value||0)}:p);await write(()=>c.ref.update({products:pr}),'MRR tersimpan');return}
  if(t.dataset.actChange==='lstage'){const c=cur();await write(()=>c.ref.update({stage:t.value}),'Tahap diperbarui')}
});
document.addEventListener('focusout',()=>{if(S.pending){S.pending=false;setTimeout(render,0)}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.documentElement.classList.contains('is-dragging'))return;if(e.key==='Escape'){if(S.form){ACT['form-close']()}else if(S.drawer){S.drawer=null;render()}}});
const colCan=c=>c.dataset.pstat?canPlan():c.dataset.istat?canHandle():can('pipeline');
const cardCanDrag=el=>{const d=(el&&el.dataset.drag)||'';if(d.indexOf('lead:')===0)return can('pipeline');if(d.indexOf('proj:')===0)return canPlan();if(d.indexOf('isu:')===0)return canHandle();return false};
const reducedMotion=()=>{try{return matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}};
const backOut=p=>{const c1=1.70158*2.5,c3=c1+1,q=p-1;return 1+c3*q*q*q+c1*q*q};
var DRAG_LOCK=false,DEFER_RENDER=false;
let PEND=null,DRAG=null,CLICK_GUARD=0;

function dragCardOf(el){return el&&el.closest?el.closest('[data-drag]'):null}
function cardCanStart(el){if(!el||!cardCanDrag(el))return false;const col=el.closest('.col');return !col||colCan(col)}
function dragListen(on){
  const m=on?'addEventListener':'removeEventListener';
  document[m]('pointermove',onPointerMove,{passive:false});
  document[m]('pointerup',onPointerUp);
  document[m]('pointercancel',onPointerCancel);
  if(on)document.addEventListener('touchmove',onTouchMove,{passive:false});
  else document.removeEventListener('touchmove',onTouchMove,{passive:false});
}
function onTouchMove(e){if(DRAG)e.preventDefault()}
function clearPending(){
  if(!PEND)return;
  clearTimeout(PEND.timer);
  PEND=null;
  if(!DRAG)dragListen(false);
}
function startDrag(st,x,y,pid){
  if(!st||!st.el||!st.el.isConnected||!cardCanStart(st.el)){clearPending();return}
  clearTimeout(st.timer);
  if(PEND===st)PEND=null;
  const el=st.el,col=el.closest('.col'),board=el.closest('.board');
  if(!col||!board){dragListen(false);return}
  const r=el.getBoundingClientRect();
  if(!r.width||!r.height){dragListen(false);return}
  const cs=getComputedStyle(el);
  const keepBorder=cs.borderLeftWidth&&cs.borderLeftWidth!=='0px'?cs.borderLeftWidth+' '+cs.borderLeftStyle+' '+cs.borderLeftColor:'';
  const ph=document.createElement('div');
  ph.className='drag-ph';
  ph.style.height=r.height+'px';
  const startParent=el.parentElement,startNext=el.nextSibling;
  el.parentNode.insertBefore(ph,el);
  document.body.appendChild(el);
  el.classList.add('is-dragging');
  el.style.left=r.left+'px';
  el.style.top=r.top+'px';
  el.style.width=r.width+'px';
  el.style.transformOrigin='50% 50%';
  el.style.transform='translate3d(0,0,0) scale(1) rotate(0deg)';
  if(keepBorder)el.style.borderLeft=keepBorder;
  document.documentElement.classList.add('is-dragging');
  board.classList.add('is-drag');
  try{if(document.activeElement&&document.activeElement.blur)document.activeElement.blur()}catch(_){}
  try{const sel=getSelection();if(sel&&sel.removeAllRanges)sel.removeAllRanges()}catch(_){}
  DRAG={el,ph,board,fromCol:col,startParent,startNext,pid,ox:x-r.left,oy:y-r.top,originLeft:r.left,originTop:r.top,px:x,py:y,cx:0,cy:0,vx:0,rot:0,scale:1,t0:performance.now(),last:performance.now(),over:null,raf:0};
  DRAG_LOCK=true;
  DRAG.raf=requestAnimationFrame(tickDrag);
}
function tickDrag(now){
  const d=DRAG;if(!d)return;
  if(!d.board.isConnected||!d.ph.isConnected){endDrag(true);return}
  const dt=Math.max(8,Math.min(48,now-(d.last||now)));
  d.last=now;
  const br=d.board.getBoundingClientRect();
  let sx=0;
  if(d.px>br.right-64)sx=Math.min(1,(d.px-(br.right-64))/64)*16;
  else if(d.px<br.left+64)sx=-Math.min(1,(br.left+64-d.px)/64)*16;
  if(sx&&d.board.scrollWidth>d.board.clientWidth)d.board.scrollLeft+=sx;
  const sy=d.py<72?-12:d.py>innerHeight-72?12:0;
  if(sy)window.scrollBy(0,sy);
  const tx=d.px-d.ox-d.originLeft,ty=d.py-d.oy-d.originTop;
  const k=1-Math.exp(-dt/55);
  d.cx+=(tx-d.cx)*k;
  d.cy+=(ty-d.cy)*k;
  d.vx*=.82;
  const rt=Math.max(-7,Math.min(7,d.vx*.5-1.5));
  d.rot+=(rt-d.rot)*(1-Math.exp(-dt/120));
  if(!reducedMotion()){
    const p=Math.min(1,(now-d.t0)/250);
    d.scale=1+0.045*backOut(p);
  }else d.scale=1;
  d.el.style.transform='translate3d('+d.cx.toFixed(2)+'px,'+d.cy.toFixed(2)+'px,0) scale('+d.scale.toFixed(3)+') rotate('+d.rot.toFixed(2)+'deg)';
  hoverDrag();
  d.raf=requestAnimationFrame(tickDrag);
}
function phRef(col,d){
  const kids=Array.prototype.slice.call(col.children);
  let lastCard=null;
  kids.forEach(k=>{if(k.classList&&k.classList.contains('card')&&k.hasAttribute('data-drag')&&k!==d.el)lastCard=k});
  if(lastCard){
    let n=lastCard.nextElementSibling;
    if(n===d.ph)n=n.nextElementSibling;
    return n;
  }
  let n=null;
  for(const k of kids){
    if(k===d.ph)continue;
    if(k.tagName==='HEADER')continue;
    if(k.classList&&k.classList.contains('drag-ph'))continue;
    n=k;break;
  }
  return n;
}
function hoverDrag(){
  const d=DRAG;if(!d)return;
  const br=d.board.getBoundingClientRect();
  let col=null;
  if(d.px>=br.left&&d.px<=br.right&&d.py>br.top-120&&d.py<br.bottom+120){
    const cols=Array.prototype.slice.call(d.board.querySelectorAll('.col'));
    for(const c of cols){
      if(!colCan(c))continue;
      const r=c.getBoundingClientRect();
      if(d.px>=r.left-6&&d.px<=r.right+6){col=c;break}
    }
  }
  if(col!==d.over){
    if(d.over)d.over.classList.remove('is-over');
    if(col)col.classList.add('is-over');
    d.over=col;
  }
  if(!col)return;
  const cards=Array.prototype.slice.call(col.querySelectorAll('.card[data-drag]')).filter(c=>c!==d.el&&!c.classList.contains('is-dragging'));
  let ref=null;
  for(const c of cards){const r=c.getBoundingClientRect();if(d.py<r.top+r.height/2){ref=c;break}}
  if(!ref)ref=phRef(col,d);
  if(d.ph.parentElement===col&&d.ph.nextElementSibling===ref)return;
  flipBoard(d.board,()=>col.insertBefore(d.ph,ref));
}
function flipBoard(root,mutate){
  const cards=Array.prototype.slice.call(root.querySelectorAll('.card[data-drag]'));
  const first=new Map();
  cards.forEach(c=>{if(c.isConnected)first.set(c,c.getBoundingClientRect())});
  cards.forEach(c=>{if(c.__qrFlip){try{c.__qrFlip.cancel()}catch(_){}c.__qrFlip=null}});
  mutate();
  if(reducedMotion())return;
  cards.forEach(c=>{
    const a=first.get(c);if(!a||!c.isConnected||!c.animate)return;
    const b=c.getBoundingClientRect(),dx=a.left-b.left,dy=a.top-b.top;
    if(Math.abs(dx)<0.5&&Math.abs(dy)<0.5)return;
    const anim=c.animate([{transform:'translate('+dx.toFixed(2)+'px,'+dy.toFixed(2)+'px)'},{transform:'translate(0px,0px)'}],{duration:550,easing:'cubic-bezier(.455,.03,.515,.955)'});
    c.__qrFlip=anim;
    anim.onfinish=()=>{if(c.__qrFlip===anim)c.__qrFlip=null};
    anim.oncancel=()=>{if(c.__qrFlip===anim)c.__qrFlip=null};
  });
}
function settleKey(key){
  if(reducedMotion())return;
  const el=document.querySelector('[data-drag="'+key+'"]');
  if(!el)return;
  el.classList.add('is-settling');
  setTimeout(()=>el.classList.remove('is-settling'),820);
}
async function moveCard(kind,id,col){
  let changed=false;
  if(kind==='lead'&&col.dataset.stage){const l=S.leads.find(x=>x.id===id);if(l&&l.stage!==col.dataset.stage){changed=await write(()=>db.collection('leads').doc(id).update({stage:col.dataset.stage}),'Dipindahkan ke '+stage(col.dataset.stage)[1])}}
  if(kind==='isu'&&col.dataset.istat){const i=S.issues.find(x=>x.id===id),v=col.dataset.istat;if(i&&i.status!==v){changed=true;await tstatus(i,v,i.status==='Open'&&v==='In Progress'&&!i.assignee?{assignee:me.id}:{})}}
  if(kind==='proj'&&col.dataset.pstat){const p=S.projects.find(x=>x.id===id);if(p&&p.status!==col.dataset.pstat){changed=await write(()=>db.collection('projects').doc(id).update({status:col.dataset.pstat,log:(p.log||[]).concat([{at:new Date().toISOString(),by:me.id,text:'Status diubah menjadi '+PSTAT[col.dataset.pstat]}])}),'Dipindahkan ke '+PSTAT[col.dataset.pstat])}}
  if(changed)setTimeout(()=>settleKey(kind+':'+id),120);
}
function endDrag(cancelled){
  const d=DRAG;if(!d)return;
  DRAG=null;
  if(d.raf)cancelAnimationFrame(d.raf);
  dragListen(false);
  document.documentElement.classList.remove('is-dragging');
  d.board.classList.remove('is-drag');
  document.querySelectorAll('.col.is-over').forEach(c=>c.classList.remove('is-over'));
  const valid=!cancelled&&d.over&&colCan(d.over);
  if(!valid){
    flipBoard(d.board,()=>{
      if(d.startNext&&d.startNext.parentElement===d.startParent)d.startParent.insertBefore(d.ph,d.startNext);
      else d.startParent.appendChild(d.ph);
    });
  }
  const phConnected=!!d.ph.parentNode;
  const targetCol=phConnected&&d.ph.parentElement?d.ph.parentElement.closest('.col'):null;
  const phRect=phConnected?d.ph.getBoundingClientRect():d.el.getBoundingClientRect();
  const from=d.el.style.transform||'translate3d(0,0,0) scale(1) rotate(0deg)';
  const to='translate3d('+(phRect.left-d.originLeft).toFixed(2)+'px,'+(phRect.top-d.originTop).toFixed(2)+'px,0) scale(1) rotate(0deg)';
  let done=false;
  const finish=()=>{
    if(done)return;
    done=true;
    if(d.ph.parentNode)d.ph.parentNode.replaceChild(d.el,d.ph);
    else if(d.el.parentNode)d.el.parentNode.removeChild(d.el);
    d.el.classList.remove('is-dragging');
    d.el.removeAttribute('style');
    CLICK_GUARD=performance.now()+420;
    if(valid&&targetCol){
      const parts=(d.el.dataset.drag||'').split(':');
      if(parts[0]&&parts[1])moveCard(parts[0],parts[1],targetCol);
      if(d.board.scrollWidth>d.board.clientWidth){
        try{d.board.scrollTo({left:Math.max(0,targetCol.offsetLeft-12),behavior:reducedMotion()?'auto':'smooth'})}catch(_){}
      }
    }
    try{d.el.focus({preventScroll:true})}catch(_){}
    DRAG_LOCK=false;
    if(DEFER_RENDER){DEFER_RENDER=false;queue()}
  };
  if(reducedMotion()||!d.el.animate||!phConnected){finish();return}
  const anim=d.el.animate([{transform:from},{transform:to}],{duration:300,easing:'cubic-bezier(.215,.61,.355,1)',fill:'forwards'});
  anim.onfinish=()=>{try{anim.cancel()}catch(_){}finish()};
  anim.oncancel=()=>finish();
}
function onPointerDown(e){
  if(DRAG||PEND)return;
  if(e.pointerType==='mouse'&&e.button>0)return;
  const card=dragCardOf(e.target);
  if(!card||!cardCanStart(card))return;
  if(e.target.closest&&e.target.closest('button,a,input,select,textarea,label,[contenteditable]'))return;
  const st={el:card,id:e.pointerId,sx:e.clientX,sy:e.clientY,type:e.pointerType==='touch'?'touch':'mouse',timer:0};
  if(st.type==='touch'){
    PEND=st;
    st.timer=setTimeout(()=>{if(PEND!==st)return;try{if(navigator.vibrate)navigator.vibrate(8)}catch(_){}startDrag(st,st.sx,st.sy,st.id)},380);
  }else{
    PEND=st;
  }
  dragListen(true);
}
function onPointerMove(e){
  if(DRAG){
    e.preventDefault();
    DRAG.px=e.clientX;DRAG.py=e.clientY;
    DRAG.vx=DRAG.vx*.5+(e.movementX||0)*.5;
    return;
  }
  if(!PEND||e.pointerId!==PEND.id)return;
  const dist=Math.hypot(e.clientX-PEND.sx,e.clientY-PEND.sy);
  if(PEND.type==='touch'){if(dist>10)clearPending();return}
  if(dist>5)startDrag(PEND,e.clientX,e.clientY,PEND.id);
}
function onPointerUp(e){
  if(DRAG){if(e.pointerId===DRAG.pid)endDrag(false);return}
  clearPending();
}
function onPointerCancel(e){
  if(DRAG){if(e.pointerId===DRAG.pid)endDrag(true);return}
  clearPending();
}
document.addEventListener('pointerdown',onPointerDown);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&DRAG){e.preventDefault();endDrag(true)}});
document.addEventListener('click',e=>{if(performance.now()<CLICK_GUARD){e.preventDefault();e.stopPropagation()}},true);
document.addEventListener('contextmenu',e=>{const c=dragCardOf(e.target);if(c&&cardCanStart(c))e.preventDefault()});
window.addEventListener('blur',()=>{if(DRAG)endDrag(true);else clearPending()});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.matches&&e.target.matches('div[data-open]')){const [k,id]=e.target.dataset.open.split(':');S.drawer=[k,id];render()}});
function route(){if(S.catT)catSave();const h=(window.__QR&&window.__QR.view)||'ringkasan';S.view=VIEWS.some(v=>v[0]===h)?h:'ringkasan';if(S.view!=='tim'){S.prodDraft=null;S.accDraft=null}S.drawer=null;S.form=null;S.payForm=null;S.expForm=null;S.admForm=null;S.brandForm=null;S.tplForm=null;closeModal(true);closeDrawer(true);S.gq='';const g=$('#gq');if(g)g.value='';render();window.scrollTo(0,0)}
window.addEventListener('hashchange',()=>{const h=location.hash.slice(1);if(h===S.view)render()});

/* ---------- start ---------- */
window.__QR_API={go:()=>route(),setSim,rerender:()=>queue(),openDrawer:(k,id)=>{S.drawer=[k,id];render()},ready:()=>S.loaded.has('accounts'),simV:()=>S.sim?S.sim.v:'',search:q=>{S.gq=q;const g=$('#gq');if(g&&g.value!==q)g.value=q;render()}};
route();
setInterval(()=>{const e=document.getElementById('abclk');if(e){const d=new Date();e.textContent=pad(d.getHours())+':'+pad(d.getMinutes())}},15000);
(async function start(){
  const use=n=>window.claude&&window.claude.use?window.claude.use(n).catch(()=>null):Promise.resolve(null);
  [db,user,S.dl]=await Promise.all([use('db'),use('user'),use('downloads')]);
  if(user){try{me.id=await user.id();me.isOwner=!!(await user.isOwner());me.canWrite=await user.can('data.write')}catch(e){}}
  try{S.assets=await claude.use('assets')}catch(e){S.assets=null}
  if(!db){S.dead=true;render();return}
  const timer=setTimeout(()=>{S.slow=true;queue()},10000);
  const done=k=>{S.loaded.add(k);if(S.loaded.size>=8)clearTimeout(timer);queue()};
  const fail=k=>e=>{if(e&&(e.code==='revoked'||e.code==='not_granted'))S.dead=true;done(k)};
  ['issues','projects','schools','leads'].forEach(k=>db.collection(k).onSnapshot(s=>{S[k]=s.docs.map(d=>Object.assign({id:d.id},d.data()));if(k==='issues')S[k]=S[k].map(normIssue);done(k)},fail(k)));
  db.collection('suratTpl').onSnapshot(sn=>{S.tpl=sn.docs.map(d=>Object.assign({id:d.id},d.data()));queue()},()=>{});
  db.collection('surat').onSnapshot(sn=>{S.surat=sn.docs.map(d=>Object.assign({id:d.id},d.data()));queue()},()=>{});
  db.collection('branding').onSnapshot(sn=>{S.brand=sn.docs.map(d=>Object.assign({id:d.id},d.data()));queue()},()=>{});
  db.collection('mou').onSnapshot(sn=>{S.mou=sn.docs.map(d=>Object.assign({id:d.id},d.data()));queue()},()=>{});
  db.collection('pembayaran').onSnapshot(sn=>{S.pay=sn.docs.map(d=>Object.assign({id:d.id},d.data()));done('pay')},fail('pay'));
  db.collection('invoices').onSnapshot(sn=>{S.invoices=sn.docs.map(d=>Object.assign({id:d.id},d.data()));done('inv')},fail('inv'));
  db.doc('settings/invoice').onSnapshot(d0=>{S.invSet=d0.exists?d0.data():{};queue()},()=>{});
  db.collection('roles').onSnapshot(s=>{S.roles={};s.docs.forEach(d=>{S.roles[d.id]=(d.data()||{}).role});done('roles')},fail('roles'));
  if(me.rid){try{db.collection('data/users/'+me.rid).onSnapshot(sn=>{S.cat=sn.docs.map(d=>Object.assign({id:d.id},d.data()));queue()},()=>{})}catch(e){}}
  if(me.isOwner){try{db.collection('audit').orderBy('t','desc').limit(500).onSnapshot(sn=>{S.audit=sn.docs.map(d=>Object.assign({id:d.id},d.data()));queue()},()=>{})}catch(e){}}
  db.collection('pengeluaran').onSnapshot(sn=>{S.exp=sn.docs.map(d=>Object.assign({id:d.id},d.data()));queue()},()=>{});
  db.collection('absensi').onSnapshot(sn=>{S.abs=sn.docs.map(d=>Object.assign({id:d.id},d.data()));queue()},()=>{});
  db.doc('settings/absen').onSnapshot(d0=>{S.absSet=d0.exists?d0.data():null;queue()},()=>{});
  db.collection('accounts').onSnapshot(s=>{S.accounts=s.docs.map(d=>Object.assign({id:d.id},d.data()));S.accounts.forEach(a=>{S.names['a:'+a.id]=a.nama||a.id});done('accounts')},fail('accounts'));
  db.collection('team').onSnapshot(s=>{S.team=s.docs.map(d=>d.id);done('team')},fail('team'));
  db.doc('settings/access').onSnapshot(d0=>{const r=d0.exists&&d0.data().roles;S.access=r&&typeof r==='object'&&Object.keys(r).length?r:null;queue()},()=>{});
  db.doc('settings/ams').onSnapshot(d0=>{if(d0.exists&&Array.isArray(d0.data().items))S.ams=d0.data().items;queue()},()=>{});
  db.doc('settings/people').onSnapshot(d0=>{if(d0.exists&&Array.isArray(d0.data().items))S.people=d0.data().items;queue()},()=>{});
  db.doc('settings/products').onSnapshot(s=>{S.products=s.exists?(s.data().items||[]):[];done('products')},fail('products'));
  if(me.rid&&me.canWrite!==false){try{const r=db.doc('team/'+me.rid),g=await r.get();if(!g.exists)await r.set({joinedAt:new Date().toISOString()})}catch(e){}}
  render();
})();

}
