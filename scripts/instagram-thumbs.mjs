/**
 * Descarga la imagen de cada publicación de Instagram listada en
 * client/content/instagram.json (lo que se edita en el panel /admin) para
 * mostrarlas en el carrusel como tarjetas uniformes.
 *
 * Se ejecuta SOLO en GitHub cada vez que se publican cambios de Instagram
 * desde el panel (.github/workflows/instagram.yml). También se puede correr
 * a mano en la PC con:  npm run instagram
 *
 * - Solo descarga las publicaciones nuevas; las que ya tienen imagen se
 *   conservan (usa --todas para volver a descargarlas todas).
 * - Si una publicación falla, se muestra con el logo de Instagram y el resto
 *   sigue funcionando.
 */
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentFile = path.join(root, "client/content/instagram.json");
const outDir = path.join(root, "public/instagram");
const manifestFile = path.join(root, "client/components/site/instagram.generated.json");
const publicManifest = path.join(outDir, "index.json");
const redownloadAll = process.argv.includes("--todas");

const BROWSERS = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);

/** Misma lógica que parseInstagramCode() en client/components/site/data.ts */
function parseInstagramCode(value) {
  const s = String(value ?? "").trim();
  if (/^[\w-]{5,40}$/.test(s)) return s;
  const m = s.match(/instagram\.com\/(?:[\w.]+\/)?(?:p|reel|reels|tv)\/([\w-]{5,40})/);
  return m ? m[1] : null;
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch {
    return fallback;
  }
}

async function fetchPost(page, code) {
  try {
    await page.goto(`https://www.instagram.com/p/${code}/embed/`, {
      waitUntil: "networkidle",
      timeout: 30000,
    });
  } catch {
    /* networkidle puede no llegar nunca; seguimos con lo que haya cargado */
  }
  await page.waitForSelector("img.EmbeddedMediaImage", { timeout: 20000 }).catch(() => {});

  const info = await page.evaluate(() => {
    const media = document.querySelector("img.EmbeddedMediaImage");
    const username =
      document.querySelector(".UsernameText")?.textContent?.trim() ||
      document.querySelector("a.Username")?.textContent?.trim() ||
      "";
    const bigImages = [...document.querySelectorAll("img")].filter((i) => i.naturalWidth > 200);
    return {
      src: media ? media.currentSrc || media.src : null,
      width: media?.naturalWidth ?? 0,
      height: media?.naturalHeight ?? 0,
      username,
      isVideo: !!document.querySelector("video"),
      isCarousel: bigImages.length > 2,
    };
  });
  if (!info.src) throw new Error("sin imagen (¿post privado, eliminado o Instagram bloqueó la petición?)");

  const res = await page.request.get(info.src);
  if (!res.ok()) throw new Error(`error al descargar la imagen (${res.status()})`);
  await writeFile(path.join(outDir, `${code}.jpg`), await res.body());

  return {
    code,
    image: `/instagram/${code}.jpg`,
    width: info.width,
    height: info.height,
    username: info.username,
    type: info.isVideo ? "reel" : info.isCarousel ? "carousel" : "photo",
  };
}

async function main() {
  const { posts = [] } = await readJson(contentFile, {});
  const codes = [...new Set(posts.map((p) => parseInstagramCode(p.url)).filter(Boolean))];
  const previous = new Map((await readJson(manifestFile, [])).map((p) => [p.code, p]));
  await mkdir(outDir, { recursive: true });

  const pending = codes.filter(
    (code) =>
      redownloadAll ||
      !previous.has(code) ||
      !existsSync(path.join(outDir, `${code}.jpg`)),
  );
  console.log(`Publicaciones: ${codes.length} · nuevas por descargar: ${pending.length}`);

  const downloaded = new Map();
  if (pending.length) {
    const executablePath = BROWSERS.find((p) => existsSync(p));
    if (!executablePath) throw new Error("No se encontró Chrome ni Edge instalado.");
    const browser = await chromium.launch({
      executablePath,
      args: process.env.CI ? ["--no-sandbox"] : [],
    });
    const page = await browser.newPage({
      viewport: { width: 540, height: 1000 },
      locale: "es-ES",
    });
    for (const code of pending) {
      process.stdout.write(`• ${code} ... `);
      try {
        const post = await fetchPost(page, code);
        downloaded.set(code, post);
        console.log(`ok (${post.type}, @${post.username || "?"})`);
      } catch (err) {
        console.log(err.message);
      }
    }
    await browser.close();
  }

  // Manifiesto en el orden actual; solo con las publicaciones que tienen imagen
  const manifest = codes
    .map((code) => downloaded.get(code) || previous.get(code))
    .filter((post) => post && existsSync(path.join(outDir, `${post.code}.jpg`)));

  const json = JSON.stringify(manifest, null, 2) + "\n";
  await writeFile(manifestFile, json);
  // Copia pública para las vistas previas del panel /admin
  await writeFile(publicManifest, json);
  console.log(`\nListo: ${manifest.length}/${codes.length} publicaciones con imagen.`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
