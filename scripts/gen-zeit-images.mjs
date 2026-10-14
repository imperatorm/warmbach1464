// Generates the painted pieces for /zeit/v4 with Gemini (Nano Banana) and
// writes them to public/zeit-v4/*.webp.
//
//   node scripts/gen-zeit-images.mjs            # every piece that is missing
//   node scripts/gen-zeit-images.mjs hof-alt    # one piece, regenerated
//   node scripts/gen-zeit-images.mjs --rekey    # re-key every cut-out from its
//                                               # raw PNG, no API call
//
// Key: GEMINI_API_KEY in .env.local (gitignored). Needs `sharp` (devDependency).
//
// Two kinds of piece:
//   plate   — a full-frame watercolour that dissolves into white paper at its
//             edges; laid on the kalk ground with mix-blend-mode: multiply.
//   cutout  — one subject painted on a flat chroma background, keyed here to
//             real alpha, so the page can stand it up on scroll like the
//             figures in a pop-up book. The model cannot write transparency,
//             so the background is a colour no watercolour of this house uses
//             (pure magenta) and every pixel is unmixed against it: alpha from
//             its distance to the chroma, colour recovered by subtracting the
//             background's share — which is what keeps the soft watercolour
//             edge instead of a hard matte.
//
// Why painted and not photographic: the page is a scroll experience in the
// manner of davidwhyte.com/experience, where the world is watercolour on
// paper and assembles as you scroll. A painting of the old farmhouse is
// honest in a way a fake photograph is not — the page can say "Darstellung"
// and mean it.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import sharp from "sharp";

const ROOT = resolve(import.meta.dirname, "..");
const OUT = resolve(ROOT, "public/zeit-v4");
const env = readFileSync(resolve(ROOT, ".env.local"), "utf8");
const KEY = env.match(/^GEMINI_API_KEY=(\S+)/m)?.[1];
if (!KEY) throw new Error("GEMINI_API_KEY missing from .env.local");

const MODEL = process.env.GEMINI_IMAGE_MODEL ?? "gemini-3-pro-image-preview";

const STYLE =
  "Loose watercolour and gouache illustration, painted the way an architect's travel sketchbook is painted: confident wet brushwork, transparent layered washes, a few dry-brush accents, no ink outlines. Muted palette: bronze green, ochre, warm grey limestone, a little copper. Soft morning light from the left. No text, no signature, no watermark.";

const PLATE_GROUND =
  "On white cold-pressed paper; the painting dissolves into untouched white paper towards all four edges — no border, no frame, no vignette.";

const CHROMA = { r: 255, g: 0, b: 255 };
const CUTOUT_GROUND =
  "The subject is painted as an isolated cut-out pasted onto a green-screen style backdrop: the entire background is one solid, flat, digital fill of pure magenta (#FF00FF) — no paper texture, no brush marks, no gradient, no noise, no shadow, no ground plane, no horizon, nothing at all except the subject. Where the subject ends, pure magenta begins immediately, including under its bottom edge. The subject's own edges stay soft and watercolour-like. The subject fills most of the frame.";

/** The same eye as the land plate, so the figures sit on its meadow. */
const ANGLE =
  "Seen from the front-left and slightly above, as from a drone forty metres up looking down at about thirty degrees.";

const HOUSE =
  "The farmhouse exactly as in the attached photograph: two storeys of warm larch timber over a white rendered ground floor, carved wooden balconies on both upper floors, a steep roof with a small open bell tower and a cross on the ridge, an arched yellow door in the centre of the white floor.";

const PIECES = [
  // ── the stage ──────────────────────────────────────────────────────────
  {
    id: "land-1464",
    kind: "plate",
    aspect: "16:9",
    prompt: `${STYLE} ${PLATE_GROUND} Composition: a three-quarter aerial view from about forty metres up, looking down at roughly thirty degrees across a gently sloping alpine meadow towards the jagged grey limestone wall of the Wilder Kaiser massif, which fills the upper third. Dark spruce forest closes the left and right edges. A pale cart track curves through the meadow from the bottom left towards the middle. The year is 1464: no building anywhere, only the meadow, the track and a few boulders. Nothing modern.`,
    refs: [],
  },
  // ── the figures that stand up on it, old to new ────────────────────────
  {
    id: "hof-alt",
    kind: "cutout",
    aspect: "4:3",
    prompt: `${STYLE} ${CUTOUT_GROUND} ${ANGLE} An old Tyrolean farmhouse of the eighteenth century: low and wide, dark weathered timber on a whitewashed stone base, a shallow roof weighted with stones, one wooden balcony, a small timber hay barn attached at its right, a low fence with a vegetable plot in front. One object, the house with its barn and fence.`,
    refs: [],
  },
  {
    id: "hof-rohbau",
    kind: "cutout",
    aspect: "4:3",
    prompt: `${STYLE} ${CUTOUT_GROUND} ${ANGLE} The raw timber frame of a large new Tyrolean farmhouse under construction: fresh pale larch posts and beams, the roof trusses up but not yet covered, over a finished white rendered ground floor, a neat stack of squared timber beside it. Nothing around it — no bushes, no shrubs, no trees, no earth, no ground wash, no shadow on the ground: magenta directly against the bottom of the white base. One object, the frame with its stack.`,
    refs: [],
    // The model paints a pale purple ground wash under the frame; it sits just
    // outside the default band, so this piece keys wider and paler.
    key: { band: 45, minSat: 0.18 },
  },
  {
    id: "hof-neu",
    kind: "cutout",
    aspect: "4:3",
    prompt: `${STYLE} ${CUTOUT_GROUND} ${ANGLE} ${HOUSE} Use the photograph only for the house's appearance; paint none of its surroundings — no earth mounds, no gravel, no road, no meadow, no mountain. The painting ends at the bottom edge of the white wall; below it is magenta. One object, the finished house alone.`,
    refs: ["gallery/warmbach/img_0027.jpg"],
  },
  {
    id: "setzlinge",
    kind: "cutout",
    aspect: "16:9",
    prompt: `${STYLE} ${CUTOUT_GROUND} ${ANGLE} Three staggered rows of young fruit-tree saplings freshly planted in a strip of turned brown earth, each thin sapling tied to a pale wooden stake, a small mound of soil at each foot. One object: the strip of earth with its saplings, wider than tall.`,
    refs: [],
  },
  {
    id: "obstbaeume",
    kind: "cutout",
    aspect: "16:9",
    prompt: `${STYLE} ${CUTOUT_GROUND} ${ANGLE} Three staggered rows of young orchard trees, small and round in full leaf, a few in blossom, standing in a strip of lush green meadow grass. One object: the strip of meadow with its trees, wider than tall.`,
    refs: [],
  },
  {
    id: "apfelbaum",
    kind: "cutout",
    aspect: "1:1",
    prompt: `${STYLE} ${CUTOUT_GROUND} A single hundred-year-old apple tree in full blossom, gnarled trunk leaning slightly, broad crown, seen from slightly below eye level. One object, the tree alone.`,
    refs: [],
  },
  // ── v5, the diorama: what a camera flying through the world needs ──────
  {
    id: "boden-aerial",
    kind: "plate",
    aspect: "3:2",
    // The floor of the diorama, 200 m across: nothing on it may carry a
    // scale of its own (a boulder, a yard), only the grass and the track.
    prompt: `${STYLE} An alpine meadow seen from directly above, from very high up, painted edge to edge with no white margin at all — the paint reaches every edge of the frame. Only grass: soft patches of green and ochre, the faint stripes of mown and unmown ground, the texture small and even like a map. One thin pale cart track, two faint wheel lines, curving from the bottom left edge to the centre of the frame and ending there. No boulders, no yard, no gravel, no buildings, no trees, no people, no text. Flat, even daylight, no shadows.`,
    refs: [],
  },
  {
    id: "kaiser",
    kind: "cutout",
    aspect: "16:9",
    prompt: `${STYLE} ${CUTOUT_GROUND} The jagged grey limestone wall of the Wilder Kaiser massif seen from the south across the valley: a long serrated ridge of pale grey rock with snow in the gullies, dark green forested foothills along its base. One object: the whole ridge with its foothills as a wide strip, its top edge the sky line, its bottom edge the foothills — wider than tall.`,
    refs: ["gallery/warmbach/img_0027.jpg"],
  },
  {
    id: "wald",
    kind: "cutout",
    aspect: "16:9",
    prompt: `${STYLE} ${CUTOUT_GROUND} A dense stand of tall dark spruce trees seen from the side at eye level, their tops uneven, a few lighter larches among them, the trunks hidden in shadow at the base. One object: the stand of trees as a wide strip, wider than tall.`,
    refs: [],
  },
  {
    id: "apfelbaum-frucht",
    kind: "cutout",
    aspect: "1:1",
    prompt: `${STYLE} ${CUTOUT_GROUND} A single hundred-year-old apple tree in early autumn, gnarled trunk leaning slightly, broad crown of green leaves heavy with small red and yellow apples, seen from eye level. One object, the tree alone.`,
    refs: [],
  },
  {
    id: "jungbaum",
    kind: "cutout",
    aspect: "3:4",
    prompt: `${STYLE} ${CUTOUT_GROUND} A young apple tree a few years old, slender trunk tied to a pale wooden stake, a small round crown of green leaves with a handful of red apples, seen from eye level. One object, the young tree with its stake.`,
    refs: [],
  },
  {
    id: "apfelzweig",
    kind: "cutout",
    aspect: "4:3",
    prompt: `${STYLE} ${CUTOUT_GROUND} A close view of one apple-tree branch coming in from the left, with four ripe apples hanging from it, red streaked with yellow, a few leaves, one apple catching the light. One object: the branch with its apples and leaves, nothing beyond where the branch leaves the frame.`,
    refs: [],
  },
  // ── the record and the craft ───────────────────────────────────────────
  {
    id: "salbuch",
    kind: "cutout",
    aspect: "3:4",
    prompt: `${STYLE} ${CUTOUT_GROUND} A single loose leaf of a fifteenth-century Tyrolean land register, slightly curled, seen from above at a slight angle: cream vellum, a few lines of brown iron-gall script in a gothic cursive, one line emphasised by a warmer wash, a red initial. The script must be suggestive brushwork, not legible words. One object, the leaf alone.`,
    refs: [],
  },
  {
    id: "haende",
    kind: "cutout",
    aspect: "4:3",
    prompt: `${STYLE} ${CUTOUT_GROUND} Two weathered hands grafting a scion onto the cut branch of an old apple tree: the knife, the pale wedge of new wood set into the dark stock, a strip of raffia being bound around the join. One object: the two hands, the branch and the knife, nothing beyond the wrists.`,
    refs: [],
  },
  {
    id: "kupfer",
    kind: "cutout",
    aspect: "3:4",
    prompt: `${STYLE} ${CUTOUT_GROUND} The copper still from the attached photograph: the onion-shaped copper pot with its round sight glass, the tall copper column with its row of small round windows beside it. No steam, no vapour. Warm copper, a little verdigris. Use the photograph only for the still's shape; paint none of the room — no stone wall, no floor, no bar. One object, the still alone.`,
    refs: ["gallery/warmbach/img_0068.jpg"],
  },
  {
    id: "glasballon",
    kind: "cutout",
    aspect: "1:1",
    prompt: `${STYLE} ${CUTOUT_GROUND} A large round glass demijohn filled with clear spirit, light passing through it, grey-green glass with a cream highlight. One object, the demijohn alone.`,
    refs: [],
  },
  {
    id: "flasche",
    kind: "cutout",
    aspect: "3:4",
    prompt: `${STYLE} ${CUTOUT_GROUND} The crystal decanter from the attached photograph: the flat oval body, the small pewter tag on its chain, the stopper, the engraved 1464 near the base as a faint mark. Clear glass rendered in greys and a touch of bronze green; the glass is opaque paint, not see-through to the background. Use the photograph only for the decanter's shape; none of its black backdrop. One object, the decanter alone.`,
    refs: ["flasche/shot-front.jpg"],
  },
];

function refPart(ref) {
  const file = resolve(ROOT, "public", ref);
  if (!existsSync(file)) throw new Error(`reference missing: ${file}`);
  const mimeType = file.endsWith(".png") ? "image/png" : "image/jpeg";
  return { inlineData: { mimeType, data: readFileSync(file).toString("base64") } };
}

async function generate(piece) {
  const parts = [...piece.refs.map(refPart), { text: piece.prompt }];
  const body = {
    contents: [{ parts }],
    generationConfig: {
      responseModalities: ["IMAGE"],
      imageConfig: { aspectRatio: piece.aspect, imageSize: "2K" },
    },
  };
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    { method: "POST", headers: { "x-goog-api-key": KEY, "content-type": "application/json" }, body: JSON.stringify(body) },
  );
  const json = await res.json();
  if (json.error) throw new Error(`${json.error.status}: ${json.error.message}`);
  const img = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
  if (!img) throw new Error(`no image in response: ${JSON.stringify(json).slice(0, 400)}`);
  return Buffer.from(img.inlineData.data, "base64");
}

/**
 * Chroma key against the magenta ground, in three passes.
 *
 * 1. Matte. The model rarely delivers a perfectly flat fill — it likes to
 *    give the magenta a paper texture — so background is decided by hue, not
 *    by exact value: anything in the magenta band with real saturation is
 *    ground, whatever its brightness.
 * 2. Body. Only the largest connected block of subject pixels is kept, which
 *    drops the speckle the texture leaves and any fragment of a reference
 *    photograph's surroundings that floats free of the subject.
 * 3. Edge. In a thin band along the matte, alpha is read from how magenta the
 *    pixel is (R and B high, G low — a measure that is zero for every colour
 *    this palette uses), and the colour is unmixed: what the model painted
 *    there is (true colour × alpha) + (chroma × (1 − alpha)), so the chroma's
 *    share is subtracted back out. That is what keeps the soft watercolour
 *    edge soft instead of leaving it a hard matte with a pink fringe. Pixels
 *    inside the body are left exactly as painted.
 */
async function keyChroma(png, { band = 30, minSat = 0.4 } = {}) {
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, N = W * H;

  // 1. matte: 1 = ground
  const ground = new Uint8Array(N);
  for (let p = 0, i = 0; p < N; p++, i += 4) {
    const r = data[i] / 255, g = data[i + 1] / 255, b = data[i + 2] / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b), c = max - min;
    const sat = max === 0 ? 0 : c / max;
    let hue = 0;
    if (c > 0) {
      hue = max === r ? ((g - b) / c + 6) % 6 : max === g ? (b - r) / c + 2 : (r - g) / c + 4;
      hue *= 60;
    }
    const dh = Math.abs(((hue - 300 + 540) % 360) - 180);
    ground[p] = dh <= band && sat >= minSat && max >= 0.2 ? 1 : 0;
  }

  // 2. body: largest 4-connected component of non-ground pixels
  const seen = new Uint8Array(N);
  const stack = new Int32Array(N);
  let best = [];
  for (let s = 0; s < N; s++) {
    if (seen[s] || ground[s]) continue;
    let top = 0;
    stack[top++] = s; seen[s] = 1;
    const members = [];
    while (top) {
      const q = stack[--top];
      members.push(q);
      const x = q % W, y = (q / W) | 0;
      if (x > 0 && !seen[q - 1] && !ground[q - 1]) { seen[q - 1] = 1; stack[top++] = q - 1; }
      if (x < W - 1 && !seen[q + 1] && !ground[q + 1]) { seen[q + 1] = 1; stack[top++] = q + 1; }
      if (y > 0 && !seen[q - W] && !ground[q - W]) { seen[q - W] = 1; stack[top++] = q - W; }
      if (y < H - 1 && !seen[q + W] && !ground[q + W]) { seen[q + W] = 1; stack[top++] = q + W; }
    }
    if (members.length > best.length) best = members;
  }
  const body = new Uint8Array(N);
  for (const q of best) body[q] = 1;

  // 3. edge band: body pixels within 3px of ground
  const R = 3;
  const edge = new Uint8Array(N);
  for (let p = 0; p < N; p++) {
    if (!body[p]) continue;
    const x = p % W, y = (p / W) | 0;
    let near = false;
    for (let dy = -R; dy <= R && !near; dy++) {
      const yy = y + dy; if (yy < 0 || yy >= H) continue;
      for (let dx = -R; dx <= R; dx++) {
        const xx = x + dx; if (xx < 0 || xx >= W) continue;
        if (!body[yy * W + xx]) { near = true; break; }
      }
    }
    edge[p] = near ? 1 : 0;
  }

  for (let p = 0, i = 0; p < N; p++, i += 4) {
    if (!body[p]) { data[i + 3] = 0; continue; }
    if (!edge[p]) { data[i + 3] = 255; continue; }
    // magenta-ness: 1 for pure chroma, ~0 for every colour of the palette
    const m = ((data[i] + data[i + 2]) / 2 - data[i + 1]) / 255;
    const a = m <= 0 ? 1 : m >= 0.9 ? 0 : 1 - m;
    if (a <= 0) { data[i + 3] = 0; continue; }
    if (a < 1) {
      for (let ch = 0; ch < 3; ch++) {
        const bg = ch === 0 ? CHROMA.r : ch === 1 ? CHROMA.g : CHROMA.b;
        const v = (data[i + ch] - (1 - a) * bg) / a;
        data[i + ch] = v < 0 ? 0 : v > 255 ? 255 : Math.round(v);
      }
    }
    data[i + 3] = Math.round(a * 255);
  }
  return sharp(data, { raw: { width: W, height: H, channels: 4 } }).trim({ threshold: 1 });
}

mkdirSync(OUT, { recursive: true });
const args = process.argv.slice(2);
const rekey = args.includes("--rekey");
const only = args.filter((a) => !a.startsWith("--"));
for (const piece of PIECES) {
  const png = resolve(OUT, `${piece.id}.png`);
  const webp = resolve(OUT, `${piece.id}.webp`);
  const wanted = only.length
    ? only.includes(piece.id)
    : rekey ? piece.kind === "cutout" && existsSync(png) : !existsSync(webp);
  if (!wanted) continue;
  process.stdout.write(`${piece.id} … `);
  const t0 = Date.now();
  let buf;
  if (rekey && existsSync(png)) {
    buf = readFileSync(png);
  } else {
    buf = await generate(piece);
    writeFileSync(png, buf); // the raw generation, gitignored
  }
  const meta = await sharp(buf).metadata();
  const img = piece.kind === "cutout" ? await keyChroma(buf, piece.key) : sharp(buf);
  await img.resize({ width: 1800, withoutEnlargement: true }).webp({ quality: 84, alphaQuality: 90 }).toFile(webp);
  const out = await sharp(webp).metadata();
  console.log(`${meta.width}x${meta.height} → ${out.width}x${out.height} ${piece.kind} in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}
