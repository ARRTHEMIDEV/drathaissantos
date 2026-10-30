// PUBLIC_MODO=producao gera o site público: só artigos aprovados entram, as
// páginas são indexáveis e scripts/verificar-publicacao.mjs bloqueia pendências.
// Qualquer outro valor (padrão) gera preview: tudo visível, com noindex.
export const modoPreview = import.meta.env.PUBLIC_MODO !== 'producao';
