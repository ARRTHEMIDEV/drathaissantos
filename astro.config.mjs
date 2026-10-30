// @ts-check
import { defineConfig } from 'astro/config';
import markdoc from '@astrojs/markdoc';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

// O painel do Keystatic roda só no `astro dev`, na máquina de quem publica.
// O build de produção é 100% estático e não expõe nenhuma rota de painel.
const emDesenvolvimento = process.argv.includes('dev');

export default defineConfig({
  // [PENDENTE] domínio definitivo
  site: 'https://drathaissantos.com.br',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [
    markdoc(),
    sitemap({ filter: (pagina) => !pagina.includes('/agendar') }),
    ...(emDesenvolvimento ? [react(), keystatic()] : []),
  ],
  devToolbar: { enabled: false },
});
