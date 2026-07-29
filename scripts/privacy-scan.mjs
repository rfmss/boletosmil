import { readdir, readFile } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const root = process.cwd();
const ignoredDirectories = new Set([".git", "node_modules", "dist"]);
const textExtensions = new Set([".js", ".mjs", ".json", ".md", ".html", ".css", ".yml", ".yaml", ".txt", ".svg", ".webmanifest"]);
const blockedExtensions = new Set([".pdf", ".jpg", ".jpeg", ".png", ".webp", ".keystore", ".jks", ".p12", ".key"]);

const forbiddenLiterals = [
  "/home/",
  "debug.keystore",
  "private-user-images.githubusercontent.com",
  "BEGIN PRIVATE KEY",
  "BEGIN RSA PRIVATE KEY",
  "BEGIN OPENSSH PRIVATE KEY",
];

const forbiddenPatterns = [
  { name: "CPF", re: /\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/g },
  { name: "e-mail fora de exemplo", re: /\b[A-Z0-9._%+-]+@(?!example\.(?:com|org|net)\b)[A-Z0-9.-]+\.[A-Z]{2,}\b/gi },
  { name: "telefone brasileiro", re: /(?:\+?55\s*)?(?:\(?\d{2}\)?\s*)?9?\d{4}[-\s]?\d{4}/g },
  { name: "token GitHub", re: /gh[pousr]_[A-Za-z0-9_]{30,}/g },
  { name: "chave AWS", re: /AKIA[0-9A-Z]{16}/g },
];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (ignoredDirectories.has(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else files.push(path);
  }
  return files;
}

const findings = [];
for (const file of await walk(root)) {
  const rel = relative(root, file);
  const extension = extname(file).toLowerCase();
  if (blockedExtensions.has(extension)) {
    findings.push(`${rel}: tipo de arquivo bloqueado (${extension})`);
    continue;
  }
  if (!(textExtensions.has(extension) || rel === "LICENSE")) continue;
  if (rel === "scripts/privacy-scan.mjs") continue;
  const content = await readFile(file, "utf8");
  for (const literal of forbiddenLiterals) {
    if (content.includes(literal)) findings.push(`${rel}: literal de alto risco encontrado`);
  }
  for (const pattern of forbiddenPatterns) {
    if (pattern.re.test(content)) findings.push(`${rel}: padrão suspeito (${pattern.name})`);
    pattern.re.lastIndex = 0;
  }
}

if (findings.length) {
  console.error("Auditoria de privacidade falhou:\n" + findings.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}
console.log("Auditoria de privacidade aprovada.");
