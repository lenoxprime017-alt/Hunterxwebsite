/**
 * Guarda el contenido actual de la página (client/content/*.json) como
 * PUNTO DE RESTAURACIÓN en public/admin/restore-point.json.
 *
 * El botón «Restablecer página» del panel /admin vuelve a dejar la página
 * exactamente así.
 *
 * Uso:  npm run punto-restauracion
 * (solo cuando quieras fijar un nuevo estado como punto de restauración)
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = path.join(root, "client/content");
const outFile = path.join(root, "public/admin/restore-point.json");

const names = (await readdir(contentDir)).filter((f) => f.endsWith(".json")).sort();
const files = {};
for (const name of names) {
  const raw = await readFile(path.join(contentDir, name), "utf8");
  JSON.parse(raw); // si un archivo está dañado, falla aquí y no se guarda nada
  files[`client/content/${name}`] = raw.replace(/\r\n/g, "\n");
}

const snapshot = { createdAt: new Date().toISOString(), files };
await writeFile(outFile, JSON.stringify(snapshot, null, 2) + "\n");
console.log(`Punto de restauración guardado (${names.length} archivos): ${names.join(", ")}`);
