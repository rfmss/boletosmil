import { readdir, readFile } from "node:fs/promises";
import { basename, extname, join, relative } from "node:path";

const root = process.cwd();
const ignoredDirectories = new Set([".git", "node_modules", "dist"]);
const textExtensions = new Set([".js", ".mjs", ".json", ".md", ".html", ".css", ".yml", ".yaml", ".txt", ".svg", ".webmanifest"]);
const blockedExtensions = new Set([
  ".pdf", ".jpg", ".jpeg", ".png", ".webp", ".gif",
  ".zip", ".7z", ".rar", ".bak", ".backup",
  ".doc", ".docx", ".xls", ".xlsx", ".csv",
  ".sqlite", ".sqlite3", ".db",
  ".keystore", ".jks", ".p12", ".pem", ".key",
]);

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
  { name: "CNPJ", re: /\b\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}\b/g },
  { name: "CEP", re: /\b\d{5}-\d{3}\b/g },
  { name: "e-mail fora de exemplo", re: /\b[A-Z0-9._%+-]+@(?!example\.(?:com|org|net)\b)[A-Z0-9.-]+\.[A-Z]{2,}\b/gi },
  { name: "telefone brasileiro", re: /(?:\+?55\s*)?(?:\(?\d{2}\)?\s*)?9?\d{4}[-\s]?\d{4}/g },
  { name: "linha digitável de boleto", re: /\b\d{5}\.\d{5}\s+\d{5}\.\d{6}\s+\d{5}\.\d{6}\s+\d\s+\d{14}\b/g },
  { name: "payload Pix", re: /000201[0-9A-Z$%*+\-./:]{20,}BR\.GOV\.BCB\.PIX/gi },
  { name: "token GitHub", re: /gh[pousr]_[A-Za-z0-9_]{30,}/g },
  { name: "chave AWS", re: /AKIA[0-9A-Z]{16}/g },
  { name: "chave Google", re: /AIza[0-9A-Za-z\-_]{35}/g },
  { name: "JWT", re: /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g },
];

const blockedPathPatterns = [
  { name: "diretório de backup", re: /(?:^|\/)(?:backups?|exports?)(?:\/|$)/i },
  { name: "backup exportado", re: /(?:backup|export)[^/]*\.(?:json|zip|txt)$/i },
  { name: "arquivo de ambiente", re: /(?:^|\/)\.env(?:\.|$)/i },
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
  const rel = relative(root, file).replaceAll("\\", "/");
  const extension = extname(file).toLowerCase();

  for (const pattern of blockedPathPatterns) {
    if (pattern.re.test(rel) && basename(rel) !== ".env.example") findings.push(`${rel}: caminho bloqueado (${pattern.name})`);
    pattern.re.lastIndex = 0;
  }

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
