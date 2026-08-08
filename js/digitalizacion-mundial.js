/* ================================================
   Digitalización Mundial — Script
   D3 World Map + Mexico Panel + Ocean Animation
   ================================================ */

// ══════════════════════════════════════════
// COUNTRY DATA
// ══════════════════════════════════════════
const CD = {
  "USA":  { name: "Estados Unidos",  pct: "+28%", val: 28, desc: "42% del gasto tecnológico mundial. ICT creció 3× más rápido que la economía. E-commerce y fintech lideran el crecimiento digital global.", src: "Forrester 2024 · OECD" },
  "CHN":  { name: "China",           pct: "+31%", val: 31, desc: "39% del retail es digital. Mayor mercado e-commerce del planeta. Inversión masiva en IA, 5G y manufactura 4.0.", src: "Forrester 2024 · UNCTAD" },
  "GBR":  { name: "Reino Unido",     pct: "+22%", val: 22, desc: "ICT creció +10% en 2023 (top 5 OCDE). Fintech londinense entre las más importantes del mundo.", src: "OECD Digital Outlook 2024" },
  "DEU":  { name: "Alemania",        pct: "+18%", val: 18, desc: "Industria 4.0 como política nacional. ICT superó +10% en 2023. Manufactura inteligente eleva productividad 22%.", src: "OECD Digital Outlook 2024" },
  "JPN":  { name: "Japón",           pct: "+16%", val: 16, desc: "Robótica e IoT integrados a la cadena de valor. Digitalización de gobierno reduce costos 18%.", src: "Forrester · World Bank 2023" },
  "KOR":  { name: "Corea del Sur",   pct: "+24%", val: 24, desc: "Mayor inversión en I+D como % del PIB de la OCDE. Líder en semiconductores, 5G e IA. Digitalización = 24% del PIB.", src: "OECD Digital Outlook 2024" },
  "IND":  { name: "India",           pct: "+19%", val: 19, desc: "Exportaciones ICT son el principal motor digital. E-commerce creció 68% post-pandemia.", src: "World Bank 2023 · Forrester" },
  "BRA":  { name: "Brasil",          pct: "+14%", val: 14, desc: "Mayor mercado digital de LATAM. Pix lo usan +140M personas. E-commerce crece 27% anual.", src: "OECD · World Bank 2023" },
  "CAN":  { name: "Canadá",          pct: "+20%", val: 20, desc: "IA y cloud computing en auge. Digitalización de PyMEs subió 35% desde 2020.", src: "Forrester 2024 · OECD" },
  "FRA":  { name: "Francia",         pct: "+17%", val: 17, desc: "Gasto tech supera €83B anuales. E-commerce y turismo digital destacan.", src: "OECD Digital Outlook 2024" },
  "AUS":  { name: "Australia",       pct: "+15%", val: 15, desc: "Economía de servicios altamente digitalizada. Digitalización reduce costos en salud y educación.", src: "OECD 2024 · IDC" },
  "SGP":  { name: "Singapur",        pct: "+26%", val: 26, desc: "Hub digital Asia-Pacífico. Smart Nation: 100% conectividad. Centros de datos y IA son pilares del PIB.", src: "UNCTAD 2024" },
  "NLD":  { name: "Países Bajos",    pct: "+21%", val: 21, desc: "ICT creció +10% en 2023. Principal hub de internet de Europa.", src: "OECD Digital Outlook 2024" },
  "BEL":  { name: "Bélgica",         pct: "+19%", val: 19, desc: "ICT creció +10% en 2023. E-government avanzado reduce burocracia.", src: "OECD Digital Outlook 2024" },
  "AUT":  { name: "Austria",         pct: "+18%", val: 18, desc: "Manufactura con alta automatización. Digitalización de PyMEs con fuerte apoyo estatal.", src: "OECD Digital Outlook 2024" },
  "SWE":  { name: "Suecia",          pct: "+23%", val: 23, desc: "Ecosistema de unicorns (Spotify, Klarna). Gobierno 100% digital.", src: "OECD · World Bank 2023" },
  "NOR":  { name: "Noruega",         pct: "+20%", val: 20, desc: "Sector público muy digitalizado. Identidad digital universal.", src: "OECD 2024" },
  "DNK":  { name: "Dinamarca",       pct: "+21%", val: 21, desc: "Máxima puntuación en índice digitalización UE. Alta adopción cloud en PyMEs.", src: "OECD Digital Outlook 2024" },
  "FIN":  { name: "Finlandia",       pct: "+20%", val: 20, desc: "Educación digital referente mundial. PIB digital = 20% del total.", src: "OECD 2024" },
  "ESP":  { name: "España",          pct: "+15%", val: 15, desc: "Turismo digital y fintech impulsan economía. Agenda Digital 2026 en ejecución.", src: "OECD · Forrester 2024" },
  "ITA":  { name: "Italia",          pct: "+13%", val: 13, desc: "E-commerce creció 40% en 5 años. Plan de Recuperación: €49B para digitalización.", src: "OECD · Forrester 2024" },
  "MEX":  { name: "México",          pct: "+12%", val: 12, desc: "Haz clic para explorar los 32 estados. Digitalización podría agregar $150B al PIB. Solo 36% de PyMEs digitalizada.", src: "McKinsey · OCDE · INEGI 2023" },
  "ARG":  { name: "Argentina",       pct: "+11%", val: 11, desc: "Exportaciones software +20% anual. Talento digital demandado globalmente.", src: "World Bank 2023" },
  "COL":  { name: "Colombia",        pct: "+13%", val: 13, desc: "Economía digital crece 3× más rápido que el PIB. Fintech en expansión.", src: "World Bank · OCDE 2023" },
  "CHL":  { name: "Chile",           pct: "+14%", val: 14, desc: "El más avanzado digitalmente de Sudamérica. Fintech y exportaciones digitales crecen 25% anual.", src: "OCDE · World Bank 2023" },
  "PER":  { name: "Perú",            pct: "+10%", val: 10, desc: "E-commerce creció 170% entre 2019–2023. Banca digital alcanza 60% de adultos.", src: "World Bank 2023" },
  "ZAF":  { name: "Sudáfrica",       pct: "+9%",  val: 9,  desc: "Hub tecnológico africano emergente. Fintech lidera inclusión financiera.", src: "World Bank · IDC 2023" },
  "NGA":  { name: "Nigeria",         pct: "+8%",  val: 8,  desc: "Fintech africana más grande. E-commerce en crecimiento explosivo.", src: "World Bank 2023" },
  "KEN":  { name: "Kenia",           pct: "+12%", val: 12, desc: "M-Pesa: referente mundial de dinero móvil. 70% de transacciones son digitales.", src: "World Bank · UNCTAD 2023" },
  "EGY":  { name: "Egipto",          pct: "+10%", val: 10, desc: "Digitalización del gobierno acelera. E-commerce crece 25% anual.", src: "World Bank 2023" },
  "IDN":  { name: "Indonesia",       pct: "+18%", val: 18, desc: "Economía digital más grande del Sudeste Asiático. $77B en economía digital (2022).", src: "Google-Temasek-Bain 2023" },
  "MYS":  { name: "Malasia",         pct: "+16%", val: 16, desc: "MyDIGITAL: 22.6% del PIB digital para 2025. Hub regional de semiconductores.", src: "World Bank · IDC 2023" },
  "THA":  { name: "Tailandia",       pct: "+14%", val: 14, desc: "Thailand 4.0. Turismo y e-commerce motores principales.", src: "World Bank 2023" },
  "VNM":  { name: "Vietnam",         pct: "+15%", val: 15, desc: "Exportaciones tech superaron $110B. Economía digital crece 28% anual.", src: "Google-Temasek-Bain 2023" },
  "ISR":  { name: "Israel",          pct: "+25%", val: 25, desc: "Startup Nation: mayor densidad de startups tech. Sector tech = 18% del PIB.", src: "OECD · World Bank 2023" },
  "ARE":  { name: "Emiratos Árabes", pct: "+22%", val: 22, desc: "Economía 100% digital meta 2031. IA integrada en gobierno.", src: "IDC · World Bank 2023" },
  "SAU":  { name: "Arabia Saudita",  pct: "+18%", val: 18, desc: "Vision 2030 impulsa digitalización. E-commerce creció 60% en 3 años.", src: "IDC 2023" },
  "TUR":  { name: "Turquía",         pct: "+16%", val: 16, desc: "Economía digital crece 35% anual. E-commerce y fintech en auge.", src: "OECD · World Bank 2023" },
  "POL":  { name: "Polonia",         pct: "+17%", val: 17, desc: "Hub digital de Europa del Este. Outsourcing IT de clase mundial.", src: "OECD Digital Outlook 2024" },
  "RUS":  { name: "Rusia",           pct: "+11%", val: 11, desc: "Sector tech en desarrollo. Yandex como ecosistema digital completo.", src: "IDC · World Bank 2023" },
  "PHL":  { name: "Filipinas",       pct: "+14%", val: 14, desc: "BPO digital = 9% del PIB. E-commerce creció 93% en 2021–2023.", src: "Google-Temasek-Bain 2023" },
};

// ══════════════════════════════════════════
// MEXICO STATES DATA
// ══════════════════════════════════════════
const STATES = [
  ["Centro",    "Ciudad de México", 24, "🏙️", "Motor digital de México. +420 startups activas. PIB digital = 22% del total. Hub de fintechs para toda Latinoamérica.", "INEGI 2023 · CIDE", "FINTECH · IA · STARTUPS"],
  ["Norte",     "Jalisco",          20, "⚡", "Silicon Valley Mexicano. +700 empresas tech en ZMG. Dell, IBM e Intel con oficinas regionales. Exportaciones software +18% anual.", "SEFOE Jalisco 2023", "TECH · SOFTWARE"],
  ["Norte",     "Nuevo León",       19, "🏭", "Hub industrial 4.0. Mayor adopción de automatización del país. Monterrey Tech y UANL forman talento digital de clase mundial.", "CAINTRA · INEGI 2023", "INDUSTRIA 4.0"],
  ["Centro",    "Querétaro",        17, "✈️", "Aeroespacial + manufactura avanzada digital. Hub logístico del Bajío. Líder en crecimiento de startups tech del interior del país.", "INEGI · ProMéxico 2023", "AEROESPACIAL"],
  ["Norte",     "Baja California",  16, "🔌", "Maquiladora 4.0 con IoT y automatización. Ecosistema binacional con San Diego. Exportaciones tech en alza sostenida.", "Index BC · INEGI 2023", "MAQUILADORA 4.0"],
  ["Norte",     "Chihuahua",        15, "🛩️", "Manufactura aeroespacial y automotriz digitalizada. Honeywell y Foxconn con plantas 4.0. Trazabilidad digital completa.", "INEGI 2023", "AEROESPACIAL"],
  ["Centro",    "Guanajuato",       14, "🚗", "Cluster automotriz más digitalizado. Toyota, GM y VW con fábricas inteligentes. León lidera e-commerce de calzado.", "INEGI · Cluster Auto 2023", "AUTO 4.0"],
  ["Norte",     "Sonora",           14, "🌵", "Agroindustria digitalizada. Blockchain en exportaciones. IoT en minería reduce costos 20%.", "INEGI 2023 · SE", "AGRO DIGITAL"],
  ["Sur y SE",  "Quintana Roo",     14, "🌴", "Turismo digital líder en México. Cancún y Tulum con plataformas avanzadas. E-commerce hotelero genera miles de empleos.", "INEGI · SEDETUR 2023", "TURISMO DIGITAL"],
  ["Norte",     "Aguascalientes",   14, "⚙️", "Industria automotriz 4.0 muy eficiente. Nissan con planta inteligente. Alta adopción digital en PyMEs.", "INEGI 2023", "AUTO 4.0"],
  ["Norte",     "Coahuila",         13, "🔩", "Manufactura automotriz 4.0. Saltillo: hub industrial digital del norte.", "INEGI 2023", "INDUSTRIAL"],
  ["Centro",    "Estado de México", 13, "📦", "PyMEs integradas a cadenas digitales. E-commerce manufacturero en crecimiento. Cercanía con CDMX facilita adopción.", "INEGI 2023", "MANUFACTURA"],
  ["Sur y SE",  "Yucatán",          13, "🏛️", "Mérida: ciudad inteligente. E-commerce artesanal en expansión constante. Turismo digital en crecimiento.", "INEGI · SEDETUR 2023", "CIUDAD SMART"],
  ["Norte",     "Tamaulipas",       12, "🚢", "Corredor industrial 4.0. E-commerce crossborder con EE.UU. en crecimiento acelerado.", "INEGI 2023", "CROSSBORDER"],
  ["Centro",    "San Luis Potosí",  12, "🏎️", "Manufactura automotriz y logística digitalizada. GM y BMW con procesos 4.0.", "INEGI 2023", "AUTO 4.0"],
  ["Centro",    "Puebla",           11, "🏗️", "AUDI digital factory referente en México. Manufactura 4.0 creciente.", "INEGI 2023", "MANUFACTURA"],
  ["Norte",     "Baja California Sur", 11, "🎣", "Turismo de alto valor con plataformas avanzadas. Los Cabos lidera reservas online. Pesca con trazabilidad digital.", "INEGI 2023", "TURISMO"],
  ["Centro",    "Tlaxcala",         10, "🧵", "Industria textil en transición digital. Gran potencial en e-commerce. Cercanía con CDMX y Puebla facilita adopción.", "INEGI 2023", "E-COMMERCE"],
  ["Norte",     "Sinaloa",          10, "🥑", "Agroindustria exportadora con plataformas digitales. E-commerce alimentario creciendo.", "INEGI 2023", "AGRO DIGITAL"],
  ["Centro",    "Veracruz",          9, "⚓", "Puerto digitalizado con trazabilidad en tiempo real. Agroindustria con plataformas de comercio. Potencial enorme.", "INEGI 2023", "LOGÍSTICA"],
  ["Centro",    "Hidalgo",           9, "🏔️", "Cercanía con CDMX impulsa adopción digital. Manufactura en transición 4.0.", "INEGI 2023", "MANUFACTURA"],
  ["Norte",     "Colima",            9, "🚢", "Puerto de Manzanillo con digitalización creciente. PyMEs en adopción tecnológica.", "INEGI 2023", "LOGÍSTICA"],
  ["Centro",    "Michoacán",         9, "🥑", "Aguacate 4.0 en desarrollo. E-commerce artesanal en crecimiento sostenido.", "INEGI 2023", "AGRO DIGITAL"],
  ["Norte",     "Durango",           9, "🌲", "Industria maderera con digitalización de procesos. Potencial en turismo de aventura digital.", "INEGI 2023", "INDUSTRIA"],
  ["Sur y SE",  "Tabasco",           8, "🛢️", "Sector petrolero adoptando tecnología digital. Hub logístico fluvial en digitalización.", "INEGI 2023", "ENERGÍA"],
  ["Norte",     "Nayarit",           8, "🏄", "Turismo digital en Riviera Nayarit. Agroindustria con plataformas de exportación. Gran potencial.", "INEGI 2023", "TURISMO"],
  ["Sur y SE",  "Campeche",          8, "🛢️", "Petróleo y pesca con digitalización incipiente. Turismo arqueológico online creciendo.", "INEGI 2023", "ENERGÍA"],
  ["Sur y SE",  "Zacatecas",         7, "⛏️", "Minería con sensores IoT. Agro con riego inteligente. Gran oportunidad en digitalización del sector primario.", "INEGI 2023", "MINERÍA"],
  ["Sur y SE",  "Oaxaca",            7, "🎨", "Artesanías en e-commerce crecen 40% anual. Turismo digital emergente. Enorme oportunidad en inclusión digital.", "INEGI · SE 2023", "E-COMMERCE"],
  ["Sur y SE",  "Guerrero",          7, "🏖️", "Turismo digital en Acapulco en recuperación. Artesanías en plataformas online creciendo.", "INEGI 2023", "TURISMO"],
  ["Sur y SE",  "Chiapas",           6, "☕", "Mayor rezago digital pero potencial enorme. Café y artesanías en e-commerce crecen 35%. La digitalización es la palanca más poderosa.", "INEGI 2023", "OPORTUNIDAD"],
];

const MORELOS = {
  region: "Centro", name: "Morelos", val: 8, icon: "⭐",
  desc: "Solo 28% de PyMEs tienen presencia digital activa. La digitalización puede generar +15,000 empleos y aumentar el PIB estatal en $2,800 MDP anuales. Cuernavaca tiene potencial como hub tech regional del centro del país.",
  src: "INEGI 2023 · SE Morelos", tag: "OPORTUNIDAD CLAVE"
};

// ISO numeric → alpha-3
const ISO = {
  840:"USA",276:"DEU",156:"CHN",826:"GBR",392:"JPN",410:"KOR",356:"IND",
  76:"BRA",124:"CAN",250:"FRA",36:"AUS",702:"SGP",528:"NLD",56:"BEL",
  40:"AUT",752:"SWE",578:"NOR",208:"DNK",246:"FIN",724:"ESP",380:"ITA",
  484:"MEX",32:"ARG",170:"COL",152:"CHL",604:"PER",710:"ZAF",566:"NGA",
  404:"KEN",818:"EGY",360:"IDN",458:"MYS",764:"THA",704:"VNM",376:"ISR",
  784:"ARE",682:"SAU",792:"TUR",616:"POL",643:"RUS",608:"PHL"
};

// ── Helpers de color ───────────────────────────────
function ccol(v) {
  if (!v) return "#050f1e";
  if (v >= 25) return "rgba(57,255,20,.82)";
  if (v >= 20) return "rgba(57,255,20,.58)";
  if (v >= 15) return "rgba(57,255,20,.38)";
  if (v >= 10) return "rgba(57,255,20,.20)";
  return "rgba(57,255,20,.10)";
}
function pctColor(v) {
  if (v >= 20) return "#39FF14";
  if (v >= 15) return "#8aff14";
  if (v >= 12) return "#ccff14";
  if (v >= 9)  return "#ff9500";
  return "#ff6b00";
}
function barGrad(v) {
  if (v >= 15) return "linear-gradient(90deg,#39FF14,#aaff00)";
  if (v >= 10) return "linear-gradient(90deg,#aaff00,#ccff14)";
  return "linear-gradient(90deg,#FF6B00,#ff9500)";
}

// ══════════════════════════════════════════
// TOOLTIP
// ══════════════════════════════════════════
const TT = document.getElementById("tooltip");
const TN = document.getElementById("tn");
const TP = document.getElementById("tp");
const TD = document.getElementById("td");
const TB = document.getElementById("tb");
const TS = document.getElementById("ts");

function showT(e, name, pct, val, desc, src) {
  TN.textContent = name; TP.textContent = pct;
  TD.textContent = desc; TS.textContent = "📊 " + src;
  TB.style.width = Math.min(val, 35) / 35 * 100 + "%";
  TT.classList.add("vis"); mvT(e);
}
function mvT(e) {
  const tw = 320;
  let x = e.clientX + 18, y = e.clientY - 60;
  if (x + tw > window.innerWidth) x = e.clientX - tw - 18;
  if (y < 8) y = 8;
  if (y + 220 > window.innerHeight) y = window.innerHeight - 225;
  TT.style.left = x + "px"; TT.style.top = y + "px";
}
function hideT() { TT.classList.remove("vis"); }

// ══════════════════════════════════════════
// OCEAN ANIMATION
// ══════════════════════════════════════════
function initOcean(cid) {
  const canvas = document.getElementById(cid); if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const wrap = canvas.parentElement;
  function rsz() { canvas.width = wrap.offsetWidth || window.innerWidth; canvas.height = wrap.offsetHeight || 600; }
  rsz(); new ResizeObserver(rsz).observe(wrap);
  const currents = [
    { ax: .08, ay: .28, dx: 1, dy: 0, amp: .025, freq: 2.5, col: [0, 120, 200] },
    { ax: .30, ay: .22, dx: .9, dy: -.05, amp: .02, freq: 3, col: [0, 140, 220] },
    { ax: .55, ay: .25, dx: 1, dy: .02, amp: .02, freq: 2.8, col: [0, 100, 180] },
    { ax: .72, ay: .20, dx: .8, dy: .03, amp: .03, freq: 2.2, col: [0, 110, 190] },
    { ax: .15, ay: .58, dx: -.7, dy: .08, amp: .03, freq: 2, col: [0, 90, 160] },
    { ax: .5, ay: .82, dx: -1, dy: 0, amp: .015, freq: 4, col: [20, 80, 150] },
    { ax: .62, ay: .50, dx: .8, dy: -.05, amp: .025, freq: 2.5, col: [0, 130, 210] },
    { ax: .85, ay: .30, dx: -.1, dy: .9, amp: .015, freq: 3.5, col: [0, 100, 170] },
    { ax: .5, ay: .44, dx: -1, dy: 0, amp: .01, freq: 5, col: [0, 150, 230] },
  ];
  const pts = [];
  for (let i = 0; i < 200; i++) {
    const c = currents[i % currents.length];
    pts.push({ c, t: Math.random() * Math.PI * 2, spd: .003 + Math.random() * .005, sz: .6 + Math.random() * 1.4, al: .07 + Math.random() * .2, prog: Math.random() });
  }
  let fr = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); fr++;
    for (const p of pts) {
      p.prog += p.spd * .012; if (p.prog > 1) p.prog = 0; p.t += p.spd;
      const c = p.c, W = canvas.width, H = canvas.height;
      const bx = ((c.ax + p.prog * c.dx + 100) % 1) * W;
      const by = (c.ay + c.amp * Math.sin(p.t * c.freq)) * H;
      const wave = Math.sin(p.t * 1.7 + p.prog * 8) * 4;
      const x = bx, y = by + wave;
      const [r, g, b] = c.col;
      const grd = ctx.createRadialGradient(x, y, 0, x, y, p.sz * 3.5);
      grd.addColorStop(0, `rgba(${r},${g},${b},${p.al})`);
      grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.beginPath(); ctx.arc(x, y, p.sz * 3.5, 0, Math.PI * 2); ctx.fillStyle = grd; ctx.fill();
      ctx.beginPath(); ctx.arc(x, y, p.sz * .7, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r + 80},${g + 40},${b + 20},${p.al * 1.5})`; ctx.fill();
    }
    const sh = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    const t2 = (Math.sin(fr * .005) * .5 + .5) * .025;
    sh.addColorStop(0, `rgba(0,60,120,${t2})`);
    sh.addColorStop(.5, `rgba(0,100,180,${t2 * .5})`);
    sh.addColorStop(1, `rgba(0,40,100,${t2})`);
    ctx.fillStyle = sh; ctx.fillRect(0, 0, canvas.width, canvas.height);
    requestAnimationFrame(draw);
  }
  draw();
}
initOcean("ocean-canvas");

// ══════════════════════════════════════════
// WORLD MAP (D3)
// ══════════════════════════════════════════
const WSVG = d3.select("#map-svg");
const W = 1400, H = 680;
WSVG.attr("viewBox", `0 0 ${W} ${H}`);
WSVG.append("rect").attr("width", W).attr("height", H).attr("fill", "#020d1a");

const defs = WSVG.append("defs");
const og = defs.append("radialGradient").attr("id", "og").attr("cx", "50%").attr("cy", "50%").attr("r", "70%");
og.append("stop").attr("offset", "0%").attr("stop-color", "#041e38").attr("stop-opacity", ".9");
og.append("stop").attr("offset", "100%").attr("stop-color", "#010810").attr("stop-opacity", "1");
WSVG.append("rect").attr("width", W).attr("height", H).attr("fill", "url(#og)");

const proj = d3.geoNaturalEarth1().scale(222).translate([W / 2, H / 2 + 28]);
const pg = d3.geoPath().projection(proj);
WSVG.append("path").datum(d3.geoGraticule()()).attr("d", pg).attr("fill", "none").attr("stroke", "rgba(0,80,160,.1)").attr("stroke-width", ".4");

d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(world => {
  const feats = topojson.feature(world, world.objects.countries).features;
  const g = WSVG.append("g");

  g.selectAll(".country")
    .data(feats.filter(d => ISO[+d.id] !== "MEX"))
    .enter().append("path").attr("class", "country").attr("d", pg)
    .attr("fill", d => { const dat = CD[ISO[+d.id]]; return dat ? ccol(dat.val) : "#050f1e"; })
    .on("mousemove", function (ev, d) {
      const dat = CD[ISO[+d.id]];
      if (dat) showT(ev, dat.name, dat.pct, dat.val, dat.desc, dat.src);
      else showT(ev, "País en digitalización", "~7%", 7, "Este país también avanza en su transformación digital.", "UNCTAD 2024");
    })
    .on("mouseleave", hideT);

  const mxF = feats.find(d => ISO[+d.id] === "MEX");
  if (mxF) {
    g.append("path").datum(mxF).attr("class", "mx-country").attr("d", pg).attr("fill", "rgba(255,107,0,.18)")
      .on("mousemove", ev => showT(ev, "🇲🇽 México — clic para ver 32 estados", "+12%", 12, "Digitalización puede agregar $150B al PIB. Solo 36% de PyMEs digitalizada. ¡Haz clic!", "McKinsey · OCDE · INEGI 2023"))
      .on("mouseleave", hideT)
      .on("click", () => { hideT(); openMX(); });
    const mc = pg.centroid(mxF);
    if (mc && !isNaN(mc[0])) {
      g.append("text").attr("x", mc[0]).attr("y", mc[1] - 4).attr("class", "mx-hint").text("🇲🇽 México");
      g.append("text").attr("x", mc[0]).attr("y", mc[1] + 9).attr("class", "mx-hint").attr("font-size", "7px").attr("fill", "rgba(255,200,80,.5)").text("▶ clic para estados");
    }
  }
  WSVG.on("mousemove", ev => { if (TT.classList.contains("vis")) mvT(ev); });
});

// ══════════════════════════════════════════
// MEXICO PANEL (card grid)
// ══════════════════════════════════════════
const MXO = document.getElementById("mx-overlay");
document.getElementById("back-btn").onclick = () => { MXO.classList.remove("open"); hideT(); };

function openMX() {
  MXO.classList.add("open");
  if (!document.getElementById("states-grid").children.length) buildGrid("mayor", "todos");
}

let currentSort = "mayor", currentRegion = "todos";

function buildGrid(sort, region) {
  currentSort = sort; currentRegion = region;
  const grid = document.getElementById("states-grid");
  grid.innerHTML = "";

  ["f-mayor", "f-menor", "f-az"].forEach(id => {
    document.getElementById(id).classList.toggle("active",
      (id === "f-mayor" && sort === "mayor") || (id === "f-menor" && sort === "menor") || (id === "f-az" && sort === "az"));
  });
  ["f-todos", "f-norte", "f-centro", "f-sur"].forEach(id => {
    document.getElementById(id).classList.toggle("active",
      (id === "f-todos" && region === "todos") || (id === "f-norte" && region === "norte") ||
      (id === "f-centro" && region === "centro") || (id === "f-sur" && region === "sur"));
  });

  const meta = document.createElement("div");
  meta.className = "grid-meta";
  meta.textContent = `${STATES.length + 1} estados · ordenado por ${sort === "mayor" ? "mayor crecimiento" : sort === "menor" ? "menor crecimiento" : "nombre"}`;
  grid.appendChild(meta);

  let list = [
    [MORELOS.region, MORELOS.name, MORELOS.val, MORELOS.icon, MORELOS.desc, MORELOS.src, MORELOS.tag],
    ...STATES
  ];

  const regionMap = { "norte": "Norte", "centro": "Centro", "sur": "Sur y SE" };
  if (region !== "todos") list = list.filter(s => s[0] === regionMap[region]);

  if (sort === "mayor") list.sort((a, b) => b[2] - a[2]);
  else if (sort === "menor") list.sort((a, b) => a[2] - b[2]);
  else list.sort((a, b) => a[1].localeCompare(b[1], "es"));

  list.forEach((s, i) => {
    const [reg, name, val, icon, desc, src, tag] = s;
    const isMor = name === "Morelos";
    const pct = "+" + val + "%";
    const card = document.createElement("div");
    card.className = "state-card" + (isMor ? " morelos-card" : "");
    card.innerHTML = `
      <div class="card-rank">#${i + 1}</div>
      <div class="card-header">
        <div>
          <div class="card-name">${icon} ${name}</div>
          <div class="card-tag">${tag || reg.toUpperCase()}</div>
        </div>
        <div class="card-pct" style="color:${isMor ? "#FF6B00" : pctColor(val)}">${pct}</div>
      </div>
      <div class="card-bar-bg">
        <div class="card-bar-fill" style="width:${Math.min(val, 30) / 30 * 100}%;background:${isMor ? "linear-gradient(90deg,#FF6B00,#FF8C00)" : barGrad(val)}"></div>
      </div>
      <div class="card-desc">${desc}</div>
      <div style="font-size:.58rem;color:rgba(57,255,20,.22);margin-top:5px;font-family:'Share Tech Mono',monospace">📊 ${src}</div>
    `;
    grid.appendChild(card);
  });
}

// Filter buttons
document.getElementById("f-mayor").onclick = () => buildGrid("mayor", currentRegion);
document.getElementById("f-menor").onclick = () => buildGrid("menor", currentRegion);
document.getElementById("f-az").onclick   = () => buildGrid("az", currentRegion);
document.getElementById("f-todos").onclick = () => buildGrid(currentSort, "todos");
document.getElementById("f-norte").onclick = () => buildGrid(currentSort, "norte");
document.getElementById("f-centro").onclick = () => buildGrid(currentSort, "centro");
document.getElementById("f-sur").onclick   = () => buildGrid(currentSort, "sur");
