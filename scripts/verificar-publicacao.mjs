// Verificação depois do build de produção (npm run build:producao).
// Falha se o site público tiver pendências, fonte provisória, página sem a
// identificação profissional ou página marcada para não indexar.
import { readdir, readFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = fileURLToPath(new URL('../dist/', import.meta.url));
const semIndiceEsperado = ['agendar.html', '404.html'];
const problemas = [];

async function* arquivos(dir) {
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const caminho = join(dir, item.name);
    if (item.isDirectory()) yield* arquivos(caminho);
    else yield caminho;
  }
}

for await (const arquivo of arquivos(raiz)) {
  const nome = relative(raiz, arquivo).split(sep).join('/');
  if (/provisori/i.test(nome)) problemas.push(`${nome}: arquivo provisório (licença pendente)`);
  if (!nome.endsWith('.html')) continue;

  const html = await readFile(arquivo, 'utf8');
  for (const [, motivo] of html.matchAll(/data-pendente="([^"]*)"/g)) {
    problemas.push(`${nome}: pendente — ${motivo}`);
  }
  if (!html.includes('CRM-MG 80240') || !html.includes('RQE 60876')) {
    problemas.push(`${nome}: sem identificação profissional (CRM e RQE)`);
  }
  if (!html.includes('static.cloudflareinsights.com')) {
    problemas.push(`${nome}: sem Cloudflare Web Analytics (token pendente em src/data/site.ts)`);
  }
  if (html.includes('name="robots" content="noindex') && !semIndiceEsperado.includes(nome)) {
    problemas.push(`${nome}: marcada como noindex no build de produção`);
  }
}

if (problemas.length) {
  console.error(`\n✗ O site ainda não pode ser publicado (${problemas.length} problema(s)):\n`);
  for (const p of [...new Set(problemas)]) console.error(`  - ${p}`);
  console.error('');
  process.exit(1);
}
console.log('\n✓ Nenhuma pendência encontrada. Build de produção liberado.\n');
