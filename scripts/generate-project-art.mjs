/**
 * Project art generator — Temple Night edition.
 *
 * Generates per-project assets into public/assets/projects/<id>/:
 *   - thumb.webp  1280x720 lantern-night card artwork (rasterized via sharp)
 *   - arch.svg    800x450 light-paper architecture diagram for the modal
 *
 * Usage: node scripts/generate-project-art.mjs [projectId ...]
 * With no args, regenerates everything.
 */
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(process.cwd(), 'public/assets/projects');

/* ============================================================
   Shared lantern-night vocabulary
   ============================================================ */

const W = 1280;
const H = 720;

const T = {
  bgTop: '#081220',
  bgBottom: '#04060a',
  ink: '#ece5d8',
  mist: '#9aa7b1',
  gold: '#e9b44c',
  goldBright: '#ffd489',
  vermilion: '#d64933',
  teal: '#57b3a7',
  silhouette: '#030407',
};

const svgOpen = (w, h, body, defs = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${defs}${body}</svg>`;

// Deterministic star field (so re-runs are stable)
function stars(cx = 640, yMax = 460, count = 70, seed = 7) {
  let s = seed;
  const rnd = () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  let out = '';
  for (let i = 0; i < count; i++) {
    const x = Math.round(rnd() * W);
    const y = Math.round(rnd() * yMax);
    const r = (0.7 + rnd() * 1.4).toFixed(2);
    const o = (0.25 + rnd() * 0.55).toFixed(2);
    out += `<circle cx="${x}" cy="${y}" r="${r}" fill="${T.ink}" opacity="${o}"/>`;
  }
  return `<g>${out}</g>`;
}

// Crescent vermilion moon
const moon = (x = 1112, y = 108, r = 52) => `
  <g>
    <circle cx="${x}" cy="${y}" r="${r}" fill="${T.vermilion}"/>
    <circle cx="${x - r * 0.42}" cy="${y - r * 0.25}" r="${r * 0.92}" fill="${T.bgTop}" opacity="0.92"/>
    <circle cx="${x}" cy="${y}" r="${r * 1.9}" fill="none" stroke="${T.vermilion}" stroke-width="1" opacity="0.18"/>
  </g>`;

// Stylized pagoda silhouette standing on the horizon
function pagoda(cx, baseY, s = 1) {
  const body = [];
  const widths = [300, 235, 172];
  const roofH = 42 * s;
  const bodyH = 34 * s;
  let y = baseY;
  const layers = [];
  for (const w of widths) {
    y -= roofH;
    // sweeping roof band with upturned eave tips
    layers.push(
      `<path d="M ${cx - w * 1.28} ${y} Q ${cx - w * 1.1} ${y - roofH * 0.62} ${cx} ${y - roofH * 0.78}
                 Q ${cx + w * 1.1} ${y - roofH * 0.62} ${cx + w * 1.28} ${y}
                 L ${cx + w * 0.92} ${y + roofH * 0.55}
                 L ${cx - w * 0.92} ${y + roofH * 0.55} Z" fill="${T.silhouette}"/>`,
    );
    // faint gold rim on the roof edge
    layers.push(
      `<path d="M ${cx - w * 1.28} ${y} Q ${cx - w * 1.1} ${y - roofH * 0.62} ${cx} ${y - roofH * 0.78}
                 Q ${cx + w * 1.1} ${y - roofH * 0.62} ${cx + w * 1.28} ${y}"
             fill="none" stroke="${T.gold}" stroke-width="1.4" opacity="0.35"/>`,
    );
    layers.push(`<rect x="${cx - w * 0.62}" y="${y + roofH * 0.5}" width="${w * 1.24}" height="${bodyH}" fill="${T.silhouette}"/>`);
    y += roofH * 0.55;
    y -= bodyH;
  }
  // finial
  const topY = y - roofH;
  body.push(...layers);
  body.push(`<rect x="${cx - 2 * s}" y="${topY - 34 * s}" width="${4 * s}" height="${36 * s}" fill="${T.silhouette}"/>`);
  body.push(`<circle cx="${cx}" cy="${topY - 40 * s}" r="${7 * s}" fill="${T.gold}" opacity="0.8"/>`);
  return `<g>${body.join('')}</g>`;
}

// Ground shadow line + faint teal water reflection
const ground = (baseY = 668) => `
  <g>
    <rect x="0" y="${baseY}" width="${W}" height="${H - baseY}" fill="${T.silhouette}"/>
    <rect x="0" y="${baseY}" width="${W}" height="2" fill="${T.teal}" opacity="0.35"/>
    <rect x="${W * 0.3}" y="${baseY + 10}" width="${W * 0.4}" height="3" fill="${T.teal}" opacity="0.12"/>
    <rect x="${W * 0.42}" y="${baseY + 22}" width="${W * 0.16}" height="3" fill="${T.teal}" opacity="0.08"/>
  </g>`;

// Center-bottom warm haze
const haze = (baseY = 500) => `
  <rect x="0" y="${baseY}" width="${W}" height="${H - baseY}"
        fill="url(#hazeGrad)"/>`;

// Title wordmark + caption
const wordmark = (title, caption, y = 486) => `
  <text x="640" y="${y}" text-anchor="middle" font-family="Consolas, 'Courier New', monospace"
        font-size="56" letter-spacing="14" fill="${T.goldBright}">${title}</text>
  <text x="640" y="${y + 40}" text-anchor="middle" font-family="Consolas, 'Courier New', monospace"
        font-size="20" letter-spacing="7" fill="${T.mist}">${caption}</text>`;

const thumbDefs = `
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${T.bgTop}"/>
      <stop offset="1" stop-color="${T.bgBottom}"/>
    </linearGradient>
    <radialGradient id="hazeGrad" cx="0.5" cy="1" r="0.9">
      <stop offset="0" stop-color="#e9b44c" stop-opacity="0.10"/>
      <stop offset="0.6" stop-color="#e9b44c" stop-opacity="0.03"/>
      <stop offset="1" stop-color="#04060a" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowGold" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#ffd489" stop-opacity="0.55"/>
      <stop offset="0.55" stop-color="#e9b44c" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#e9b44c" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowEmber" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#d64933" stop-opacity="0.6"/>
      <stop offset="0.5" stop-color="#d64933" stop-opacity="0.2"/>
      <stop offset="1" stop-color="#d64933" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowTeal" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#57b3a7" stop-opacity="0.45"/>
      <stop offset="1" stop-color="#57b3a7" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="beam" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ffd489" stop-opacity="0.5"/>
      <stop offset="1" stop-color="#ffd489" stop-opacity="0.02"/>
    </linearGradient>
  </defs>`;

const thumbBase = (motif) => svgOpen(
  W,
  H,
  `<rect width="${W}" height="${H}" fill="url(#bgGrad)"/>
   ${stars()}
   ${moon()}
   ${motif}
   ${pagoda(1030, 700, 0.92)}
   ${ground(668)}
   ${haze(420)}
   <rect width="${W}" height="${H}" fill="url(#bgGrad)" opacity="0"/>`,
  thumbDefs,
);

/* ============================================================
   Per-project thumbnails
   ============================================================ */

function thumbSourceLens() {
  const sheet = (y, w = 168) => `
    <g>
      <rect x="232" y="${y}" width="${w}" height="62" rx="7" fill="#0c1622" stroke="${T.gold}" stroke-width="1.3" stroke-opacity="0.65"/>
      <rect x="232" y="${y + 14}" width="${w - 92}" height="5" rx="2.5" fill="${T.ink}" opacity="0.5"/>
      <rect x="232" y="${y + 28}" width="${w - 44}" height="5" rx="2.5" fill="${T.ink}" opacity="0.3"/>
      <rect x="232" y="${y + 42}" width="${w - 120}" height="5" rx="2.5" fill="${T.ink}" opacity="0.22"/>
    </g>`;
  const motif = `
    <g>
      <circle cx="640" cy="258" r="150" fill="url(#glowGold)"/>
      <!-- document sources on the left -->
      ${sheet(120)}${sheet(200)}${sheet(280)}
      <!-- the lens -->
      <circle cx="640" cy="258" r="88" fill="#0a1420" stroke="${T.goldBright}" stroke-width="3.5"/>
      <circle cx="640" cy="258" r="70" fill="none" stroke="${T.gold}" stroke-width="1.6" opacity="0.7"/>
      <circle cx="640" cy="258" r="52" fill="none" stroke="${T.gold}" stroke-width="1" opacity="0.45"/>
      <circle cx="640" cy="258" r="26" fill="#ffd489" opacity="0.85"/>
      <!-- beam to the answer -->
      <polygon points="700,258 838,196 838,330" fill="url(#beam)"/>
      <!-- dotted retrieval lines -->
      <g stroke="${T.gold}" stroke-width="1.6" stroke-dasharray="2 7" opacity="0.65">
        <path d="M410 155 C 480 150, 520 200, 552 236"/>
        <path d="M410 231 C 470 236, 500 244, 548 244"/>
        <path d="M410 311 C 480 316, 520 282, 552 268"/>
      </g>
      <!-- grounded answer bubble -->
      <g>
        <rect x="838" y="182" width="308" height="152" rx="18" fill="#0c1622" stroke="${T.gold}" stroke-width="1.6" stroke-opacity="0.8"/>
        <polygon points="862,334 852,362 890,334" fill="#0c1622" stroke="${T.gold}" stroke-width="1.6" stroke-opacity="0.8"/>
        <rect x="872" y="212" width="240" height="6" rx="3" fill="${T.ink}" opacity="0.55"/>
        <rect x="872" y="232" width="204" height="6" rx="3" fill="${T.ink}" opacity="0.38"/>
        <rect x="872" y="252" width="256" height="6" rx="3" fill="${T.ink}" opacity="0.3"/>
        <rect x="872" y="272" width="180" height="6" rx="3" fill="${T.ink}" opacity="0.22"/>
        <!-- citation chips -->
        <g font-family="Consolas, 'Courier New', monospace" font-size="20" fill="${T.goldBright}">
          <rect x="872" y="296" width="52" height="30" rx="15" fill="#1a1207" stroke="${T.gold}" stroke-width="1.2"/>
          <rect x="936" y="296" width="52" height="30" rx="15" fill="#1a1207" stroke="${T.gold}" stroke-width="1.2"/>
          <rect x="1000" y="296" width="52" height="30" rx="15" fill="#1a1207" stroke="${T.gold}" stroke-width="1.2"/>
          <text x="898" y="317" text-anchor="middle">1</text>
          <text x="962" y="317" text-anchor="middle">2</text>
          <text x="1026" y="317" text-anchor="middle">3</text>
        </g>
      </g>
    </g>`;
  return {
    svg: thumbBase(`${motif}${wordmark('SOURCELENS', 'DOMAIN-SPECIFIC RAG CHATBOT')}`),
    id: 'source-lens',
  };
}

function thumbPolicyForge() {
  const spark = (x, y, r, o) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${T.goldBright}" opacity="${o}"/>`;
  const motif = `
    <g>
      <!-- the intent, being forged into a policy -->
      <g font-family="Consolas, 'Courier New', monospace" font-size="27">
        <rect x="400" y="104" width="480" height="162" rx="14" fill="#0b1119" stroke="${T.gold}" stroke-width="1.8"/>
        <text x="434" y="146" fill="${T.mist}">{</text>
        <text x="434" y="184" fill="${T.mist}">&quot;Resource&quot;: [ arn:...:etl-eu ],</text>
        <text x="434" y="222" fill="${T.mist}">&quot;Action&quot;: [ ...exact ops ],</text>
        <circle cx="448" cy="248" r="4" fill="${T.gold}"/>
        <text x="466" y="256" fill="${T.mist}">&quot;Effect&quot;:</text>
        <text x="640" y="256" fill="${T.goldBright}">&quot;Allow&quot;</text>
      </g>
      <text x="640" y="292" text-anchor="middle" font-family="Consolas, 'Courier New', monospace"
            font-size="21" letter-spacing="4" fill="${T.gold}" opacity="0.9">— no wildcards permitted —</text>

      <g transform="translate(0,-50)">
        <circle cx="640" cy="408" r="150" fill="url(#glowEmber)"/>
        <!-- the anvil -->
        <g>
          <path d="M552 384 L728 384 L728 404 Q706 414 692 414 L682 428 L598 428 L588 414
                   Q572 414 552 414 Z" fill="#0d0a06" stroke="#e9b44c" stroke-width="2" stroke-opacity="0.85"/>
          <rect x="612" y="428" width="56" height="22" fill="#0d0a06" stroke="#e9b44c" stroke-width="1.6" stroke-opacity="0.6"/>
          <path d="M552 384 L728 384" stroke="${T.vermilion}" stroke-width="2" opacity="0.85"/>
        </g>
        <!-- forge embers -->
        <g>
          <ellipse cx="640" cy="452" rx="230" ry="22" fill="#d64933" opacity="0.25"/>
          ${spark(572, 340, 3.4, 0.9)}${spark(610, 306, 2.6, 0.7)}${spark(688, 344, 3, 0.85)}
          ${spark(710, 298, 2.2, 0.6)}${spark(650, 316, 2.4, 0.75)}${spark(544, 322, 2, 0.5)}
          ${spark(724, 330, 2.8, 0.65)}${spark(662, 286, 1.8, 0.45)}
        </g>
      </g>
    </g>`;
  return {
    svg: thumbBase(`${motif}${wordmark('POLICYFORGE', 'LEAST-PRIVILEGE IAM · DETERMINISTIC')}`),
    id: 'policy-forge',
  };
}

function thumbSpamDetector() {
  const bubble = (y, flagged) => `
    <g>
      <rect x="212" y="${y}" width="336" height="74" rx="16"
            fill="${flagged ? '#180d0c' : '#0c1622'}"
            stroke="${flagged ? T.vermilion : T.teal}" stroke-width="1.8" stroke-opacity="${flagged ? 1 : 0.75}"/>
      <rect x="238" y="${y + 16}" width="252" height="6" rx="3" fill="${T.ink}" opacity="0.5"/>
      <rect x="238" y="${y + 32}" width="196" height="6" rx="3" fill="${T.ink}" opacity="0.32"/>
      ${flagged
        ? `<g font-family="Consolas, 'Courier New', monospace" font-size="22" fill="${T.vermilion}">
             <rect x="464" y="${y + 42}" width="70" height="28" rx="14" fill="#1c0906" stroke="${T.vermilion}" stroke-width="1.4"/>
             <text x="499" y="${y + 62}" text-anchor="middle">SPAM</text>
           </g>`
        : `<g font-family="Consolas, 'Courier New', monospace" font-size="22" fill="${T.teal}">
             <rect x="464" y="${y + 42}" width="58" height="28" rx="14" fill="#081512" stroke="${T.teal}" stroke-width="1.4"/>
             <text x="493" y="${y + 62}" text-anchor="middle">ham</text>
           </g>`}
    </g>`;
  const motif = `
    <g>
      ${bubble(110, true)}
      ${bubble(196, false)}
      ${bubble(282, false)}
      <!-- gauge -->
      <g>
        <circle cx="920" cy="238" r="130" fill="url(#glowGold)" transform="translate(0,60)"/>
        <path d="M 806 330 A 140 140 0 1 1 1034 330" fill="none" stroke="#26333f" stroke-width="13" stroke-linecap="round"/>
        <path d="M 806 330 A 140 140 0 1 1 1008 224" fill="none" stroke="${T.goldBright}" stroke-width="13" stroke-linecap="round"/>
        <line x1="920" y1="330" x2="1002" y2="218" stroke="${T.goldBright}" stroke-width="4" stroke-linecap="round"/>
        <circle cx="920" cy="330" r="9" fill="${T.goldBright}"/>
        <text x="920" y="300" text-anchor="middle" font-family="Consolas, 'Courier New', monospace"
              font-size="52" fill="${T.goldBright}">98.8%</text>
        <text x="920" y="384" text-anchor="middle" font-family="Consolas, 'Courier New', monospace"
              font-size="20" letter-spacing="5" fill="${T.mist}">HELD-OUT ACCURACY</text>
      </g>
      <!-- flow dots -->
      <g stroke="${T.gold}" stroke-width="1.6" stroke-dasharray="2 8" opacity="0.6">
        <path d="M552 236 C 640 236, 660 260, 772 276" fill="none"/>
      </g>
      <!-- feature ticks -->
      <g fill="${T.teal}" opacity="0.9">
        <rect x="806" y="406" width="118" height="6" rx="3"/>
        <rect x="936" y="406" width="64" height="6" rx="3"/>
        <rect x="826" y="420" width="232" height="6" rx="3" opacity="0.5"/>
      </g>
    </g>`;
  return {
    svg: thumbBase(`${motif}${wordmark('SPAM DETECTOR', 'CALIBRATED · TESTED · SERVED 4 WAYS')}`),
    id: 'spam-detector',
  };
}

function thumbSkillify() {
  const node = (x, y, color) => `
    <g>
      <circle cx="${x}" cy="${y}" r="42" fill="#0c1622" stroke="${color}" stroke-width="2.4"/>
      <circle cx="${x}" cy="${y}" r="20" fill="${color}" opacity="0.22"/>
      <circle cx="${x}" cy="${y}" r="7" fill="${color}"/>
    </g>`;
  const coin = (x, y, r = 15) => `
    <g>
      <circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${T.goldBright}" stroke-width="2.4"/>
      <circle cx="${x}" cy="${y}" r="${r * 0.55}" fill="none" stroke="${T.goldBright}" stroke-width="1.2" opacity="0.8"/>
    </g>`;
  const motif = `
    <g>
      <circle cx="640" cy="262" r="170" fill="url(#glowGold)"/>
      <!-- threads -->
      <g stroke="${T.gold}" stroke-width="1.4" stroke-dasharray="3 7" opacity="0.55">
        <path d="M640 262 L448 158"/><path d="M640 262 L838 170"/><path d="M640 262 L430 340"/>
        <path d="M640 262 L856 330"/><path d="M640 262 L640 360"/>
      </g>
      <!-- the community hub -->
      <circle cx="640" cy="262" r="62" fill="#0a1420" stroke="${T.goldBright}" stroke-width="3"/>
      <circle cx="640" cy="262" r="41" fill="none" stroke="${T.gold}" stroke-width="1.4" opacity="0.7"/>
      <circle cx="640" cy="262" r="10" fill="${T.goldBright}"/>
      <!-- member nodes -->
      ${node(448, 146, T.teal)}
      ${node(844, 158, T.vermilion)}
      ${node(418, 336, T.vermilion)}
      ${node(862, 326, T.teal)}
      ${node(640, 372, T.gold)}
      <!-- skill coins -->
      ${coin(520, 420)}${coin(756, 412)}${coin(688, 116, 12)}${coin(568, 108, 11)}
      <!-- badge ribbon -->
      <g transform="rotate(12 948 132)">
        <rect x="922" y="104" width="52" height="74" rx="8" fill="#1a1207" stroke="${T.gold}" stroke-width="1.6"/>
        <path d="M930 168 L942 186 L954 168" fill="none" stroke="${T.gold}" stroke-width="2"/>
      </g>
    </g>`;
  return {
    svg: thumbBase(`${motif}${wordmark('SKILLIFY', 'SHARE · LEARN · BORROW · EARN')}`),
    id: 'skillify',
  };
}

/* ============================================================
   Paper architecture diagrams (for the modal)
   ============================================================ */

const P = {
  paper: '#f7f2e8',
  box: '#ffffff',
  line: '#33414f',
  text: '#212a33',
  sub: '#5a6375',
  teal: '#2a7f76',
  vermilion: '#c24331',
  gold: '#b98a1f',
};

const aw = 800;
const ah = 450;

const archOpen = (inner, defs = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${aw}" height="${ah}" viewBox="0 0 ${aw} ${ah}">
     ${defs}
     <rect width="${aw}" height="${ah}" rx="10" fill="${P.paper}"/>
     ${inner}
   </svg>`;

function box(x, y, w, h, lines, opt = {}) {
  const accent = opt.accent || P.line;
  const fs = opt.fs || 14;
  const title = opt.title;
  const startY = opt.center ? y + h / 2 - ((lines.length - 1) * (fs + 4)) / 2 : 0;
  return `
    <g>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="9" fill="${P.box}" stroke="${accent}" stroke-width="${opt.sw || 2}"/>
      ${title ? `<text x="${x + w / 2}" y="${y + fs + 4}" text-anchor="middle" font-family="Consolas, 'Courier New', monospace" font-size="${fs + 1}" font-weight="bold" fill="${accent}">${title}</text>` : ''}
      ${lines
        .map((l, i) => {
          const yy = title ? y + fs * 2 + 12 + i * (fs + 4) : (opt.center ? startY + i * (fs + 4) : y + fs + 10 + i * (fs + 4));
          return `<text x="${x + w / 2}" y="${yy + (fs - 10) / 2}" text-anchor="middle" font-family="Consolas, 'Courier New', monospace" font-size="${fs - 1}" fill="${P.text}">${l}</text>`;
        })
        .join('')}
    </g>`;
}

function arrow(x1, y1, x2, y2, color = P.sub, dashed = false) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const c = Math.abs(x2 - x1) > Math.abs(y2 - y1)
    ? `C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`
    : `C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`;
  return `<path d="M ${x1} ${y1} ${c}" fill="none" stroke="${color}" stroke-width="1.8"
    ${dashed ? 'stroke-dasharray="5 4"' : ''} marker-end="url(#ah)"/>`;
}

const archDefs = `
  <defs>
    <marker id="ah" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
      <path d="M0 0 L8 4 L0 8 Z" fill="${P.sub}"/>
    </marker>
  </defs>`;

const archTitle = (t) =>
  `<text x="${aw / 2}" y="34" text-anchor="middle" font-family="Consolas, 'Courier New', monospace"
     font-size="17" font-weight="bold" letter-spacing="2" fill="${P.line}">${t}</text>`;

function archSourceLens() {
  const inner = `
    ${archTitle('SOURCELENS — GROUNDED RAG PIPELINE')}
    ${box(28, 86, 150, 58, ['PDFs', 'internal wiki'], { accent: P.teal })}
    ${box(28, 162, 150, 58, ['tickets', 'web pages'], { accent: P.teal })}
    ${box(28, 238, 150, 58, ['CSV / JSON', 'exports'], { accent: P.teal })}
    <text x="103" y="330" text-anchor="middle" font-family="Consolas, 'Courier New', monospace" font-size="13" fill="${P.sub}">domain sources</text>

    ${box(258, 96, 200, 74, ['semantic chunking', '512-token windows'], { title: 'Ingestion', accent: P.gold })}
    ${box(258, 196, 200, 72, ['bge-small embeddings'], { title: 'Vector Index', accent: P.gold })}
    ${box(258, 296, 200, 74, ['top-50 recall'], { title: 'Retriever', accent: P.gold })}

    ${box(520, 196, 210, 72, ['query decomposition', 'cross-encoder scoring'], { title: 'Re-rank Agent', accent: P.vermilion })}
    ${box(520, 86, 210, 74, ['LangGraph flow', 'grounding guardrails'], { title: 'Answer Synthesis', accent: P.vermilion })}
    ${box(520, 296, 210, 74, ['answer + [1][2][3]', 'chat history'], { title: 'Citations', accent: P.vermilion })}

    ${box(60, 366, 250, 56, ['FastAPI · streaming SSE'], { title: 'Chat Interface', accent: P.teal, fs: 13 })}
    ${box(480, 366, 250, 56, ['no source, no answer'], { title: 'Groundedness Check', accent: P.teal, fs: 13 })}

    ${arrow(178, 115, 252, 126)}
    ${arrow(178, 191, 252, 146)}
    ${arrow(178, 267, 252, 280, P.sub, true)}
    ${arrow(358, 170, 358, 194)}
    ${arrow(358, 268, 358, 292)}
    ${arrow(458, 232, 516, 232)}
    ${arrow(458, 320, 516, 330, P.sub, true)}
    ${arrow(625, 268, 625, 292)}
    ${arrow(660, 160, 660, 194, P.vermilion)}
    ${arrow(645, 296, 500, 300, P.sub, true)}
    ${arrow(310, 366, 310, 200, P.sub, true)}
  `;
  return archOpen(inner, archDefs);
}

function archPolicyForge() {
  const inner = `
    ${archTitle('POLICYFORGE — DETERMINISTIC · LEAST-PRIVILEGE')}
    ${box(28, 150, 180, 130, ['service · actions', 'resources', '', 'declared up front —', 'no NLP guessing'], { title: 'Access Intent', accent: P.teal, fs: 12.5 })}

    ${box(266, 90, 210, 90, ['schema + enums', 'deny unknown fields'], { title: 'Validation', accent: P.gold })}
    ${box(266, 220, 210, 90, ['allowlist of services', 'per-service action map', 'resource ARN patterns'], { title: 'Rules Engine', accent: P.gold, fs: 13 })}

    ${box(534, 90, 238, 90, ['canonical JSON, sorted keys', 'actions always exact strings'], { title: 'Policy Renderer', accent: P.vermilion, fs: 13 })}
    ${box(534, 220, 238, 90, ['Effect: Allow · no wildcards', 'ARN scope-down to the request'], { title: 'Least-Privilege Pass', accent: P.vermilion, fs: 13 })}

    ${box(120, 352, 250, 62, ['IAM JSON document'], { title: 'Output', accent: P.teal })}
    ${box(420, 352, 250, 62, ['simulator runs deny-by-default'], { title: 'Policy Tests', accent: P.teal, fs: 13 })}

    ${arrow(208, 185, 262, 135)}
    ${arrow(208, 245, 262, 259)}
    ${arrow(371, 180, 371, 218)}
    ${arrow(476, 135, 530, 135)}
    ${arrow(476, 265, 530, 265, P.sub, true)}
    ${arrow(653, 180, 653, 218)}
    ${arrow(653, 310, 653, 348, P.teal)}
    ${arrow(545, 310, 545, 348, P.teal)}
    ${arrow(420, 383, 374, 383, P.sub, true)}
  `;
  return archOpen(inner, archDefs);
}

function archSpamDetector() {
  const inner = `
    ${archTitle('SPAM DETECTOR — TRAIN → CALIBRATE → SERVE')}
    ${box(28, 86, 170, 76, ['UCI SMS Collection', '5,574 raw messages'], { title: 'Dataset', accent: P.teal, fs: 13 })}
    ${box(258, 86, 200, 76, ['dedupe · stratified split', 'abort on label conflict'], { title: 'Validate', accent: P.gold })}
    ${box(518, 86, 250, 76, ['word + char n-grams (30k feats)', 'class-balanced LogisticRegression', 'sigmoid calibration'], { title: 'TF-IDF → CLF → Calibrate', accent: P.vermilion, fs: 12.5 })}

    ${box(380, 208, 250, 70, ['spam_model.joblib', 'metrics.json + dataset SHA-256'], { title: 'Artifacts', accent: P.gold, fs: 13 })}

    ${box(40, 322, 150, 56, ['build_model()'], { title: 'Library API', accent: P.teal, fs: 13 })}
    ${box(214, 322, 150, 56, ['/predict · /batch', '/health · /drift'], { title: 'FastAPI', accent: P.teal, fs: 12.5 })}
    ${box(388, 322, 150, 56, ['5 console scripts'], { title: 'CLI', accent: P.teal, fs: 13 })}
    ${box(562, 322, 150, 56, ['model card sidebar', 'confidence panel'], { title: 'Streamlit', accent: P.teal, fs: 13 })}

    ${arrow(198, 124, 254, 124)}
    ${arrow(458, 124, 514, 124)}
    ${arrow(643, 162, 643, 204)}
    ${arrow(505, 278, 505, 318)}
    ${arrow(630, 278, 630, 318, P.sub, true)}
    ${arrow(380, 278, 115, 318, P.sub, true)}
    ${arrow(380, 278, 290, 318, P.sub, true)}
  `;

  // runtime guardrails footnote (drift + feedback monitoring)
  const monitoring = `
    <g>
      <path d="M 712 378 C 751 378, 751 380, 751 402" fill="none" stroke="${P.vermilion}" stroke-width="1.5" stroke-dasharray="5 4"/>
      <text x="751" y="418" text-anchor="middle" font-family="Consolas, 'Courier New', monospace" font-size="12" fill="${P.vermilion}">/drift + /feedback</text>
      <text x="751" y="434" text-anchor="middle" font-family="Consolas, 'Courier New', monospace" font-size="11" fill="${P.sub}">length z-score · OOV · misclassification log</text>
    </g>`;

  return archOpen(inner + monitoring, archDefs);
}

function archSkillify() {
  const inner = `
    ${archTitle('SKILLIFY — COMMUNITY SKILL PLATFORM')}
    ${box(60, 86, 170, 72, ['sign-up / sign-in', 'protected routes'], { title: 'Auth', accent: P.teal, fs: 13 })}
    ${box(315, 86, 170, 72, ['HTML/JS modules', 'firebase-config.js'], { title: 'Static Frontend', accent: P.teal, fs: 12.5 })}
    ${box(570, 86, 170, 72, ['coin ledger UI', 'progress badges'], { title: 'Gamification', accent: P.vermilion, fs: 13 })}

    ${box(285, 214, 230, 84, ['routes/* blueprints', 'Firebase Admin SDK', 'REST API'], { title: 'Flask Backend', accent: P.gold })}

    ${box(60, 350, 170, 62, ['users · sessions', 'skill coins'], { title: 'Firestore', accent: P.vermilion, fs: 13 })}
    ${box(315, 350, 170, 62, ['service account', 'env-injected'], { title: 'Secrets', accent: P.teal, fs: 13 })}
    ${box(570, 350, 170, 62, ['railway.json', 'backend hosting'], { title: 'Railway', accent: P.teal, fs: 13 })}

    ${arrow(230, 122, 311, 122)}
    ${arrow(485, 122, 566, 122)}
    ${arrow(400, 158, 400, 210)}
    ${arrow(230, 132, 281, 246, P.sub, true)}
    ${arrow(570, 132, 515, 246, P.sub, true)}
    ${arrow(400, 298, 400, 346)}
    ${arrow(350, 298, 145, 346, P.sub, true)}
    ${arrow(450, 298, 655, 346, P.sub, true)}
  `;
  return archOpen(inner, archDefs);
}

/* ============================================================
   Emit everything
   ============================================================ */

const projects = [
  thumbSourceLens(),
  thumbPolicyForge(),
  thumbSpamDetector(),
  thumbSkillify(),
];

const archs = {
  'source-lens': archSourceLens(),
  'policy-forge': archPolicyForge(),
  'spam-detector': archSpamDetector(),
  skillify: archSkillify(),
};

const only = process.argv.slice(2);
for (const p of projects) {
  if (only.length && !only.includes(p.id)) continue;

  const dir = path.join(ROOT, p.id);
  await mkdir(dir, { recursive: true });

  await sharp(Buffer.from(p.svg))
    .webp({ quality: 86 })
    .toFile(path.join(dir, 'thumb.webp'));
  console.log(`✔ ${p.id}/thumb.webp`);

  await writeFile(path.join(dir, 'arch.svg'), archs[p.id], 'utf8');
  console.log(`✔ ${p.id}/arch.svg`);
}
