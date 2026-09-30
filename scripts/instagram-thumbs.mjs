/**
 * Descarga la imagen de cada publicación de Instagram listada en
 * client/content/instagram.json (lo que se edita en el panel /admin) para mostrarlas en el
 * carrusel como tarjetas uniformes, sin los iframes de Instagram.
 *
 * Uso:  npm run instagram
 *
 * Ejecutarlo después de agregar publicaciones en el panel (o subir la
 * imagen de cada post directamente desde el panel, sin usar este script).
 * Usa el Chrome (o Edge) instalado en la PC mediante playwright-core.
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

const BROWSERS = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
];

/** Misma lógica que parseInstagramCode() en client/components/site/data.ts */
function parseInstagramCode(value) {
  const s = String(value ?? "").trim();
  if (/^[\w-]{5,40}$/.test(s)) return s;
  const m = s.match(/instagram\.com\/(?:[\w.]+\/)?(?:p|reel|reels|tv)\/([\w-]{5,40})/);
  return m ? m[1] : null;
}

async function readPostCodes() {
  const { posts = [] } = JSON.parse(await readFile(contentFile, "utf8"));
  return posts.map((p) => parseInstagramCode(p.url)).filter(Boolean);
}

async function main() {
  const codes = await readPostCodes();
  const executablePath = BROWSERS.find((p) => existsSync(p));
  if (!executablePath) throw new Error("No se encontró Chrome ni Edge instalado.");

  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch({ executablePath });
  const page = await browser.newPage({ viewport: { width: 540, height: 1000 } });
  const manifest = [];

  for (const code of codes) {
    process.stdout.write(`• ${code} ... `);
    try {
      await page.goto(`https://www.instagram.com/p/${code}/embed/`, {
        waitUntil: "networkidle",
        timeout: 30000,
      });
    } catch {
      /* networkidle puede no llegar nunca; seguimos con lo que haya cargado */
    }
    await page.waitForSelector("img.EmbeddedMediaImage", { timeout: 15000 }).catch(() => {});

    const info = await page.evaluate(() => {
      const media = document.querySelector("img.EmbeddedMediaImage");
      const username =
        document.querySelector(".UsernameText")?.textContent?.trim() ||
        document.querySelector("a.Username")?.textContent?.trim() ||
        "";
      const bigImages = [...document.querySelectorAll("img")].filter(
        (i) => i.naturalWidth > 200,
      );
      return {
        src: media ? media.currentSrc || media.src : null,
        width: media?.naturalWidth ?? 0,
        height: media?.naturalHeight ?? 0,
        username,
        isVideo: !!document.querySelector("video"),
        isCarousel: bigImages.length > 2,
      };
    });

    if (!info.src) {
      console.log("sin imagen (¿post privado o eliminado?)");
      continue;
    }

    const res = await page.request.get(info.src);
    if (!res.ok()) {
      console.log(`error al descargar (${res.status()})`);
      continue;
    }
    await writeFile(path.join(outDir, `${code}.jpg`), await res.body());

    const type = info.isVideo ? "reel" : info.isCarousel ? "carousel" : "photo";
    manifest.push({
      code,
      image: `/instagram/${code}.jpg`,
      width: info.width,
      height: info.height,
      username: info.username,
      type,
    });
    console.log(`ok (${type}, ${info.width}x${info.height}, @${info.username || "?"})`);
  }

  await browser.close();
  await writeFile(manifestFile, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`\nListo: ${manifest.length}/${codes.length} publicaciones guardadas en public/instagram/`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
