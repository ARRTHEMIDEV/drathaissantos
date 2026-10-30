// Painel de conteúdo (Keystatic, modo local). Abre em http://localhost:4321/keystatic
// durante o `npm run dev`, só na máquina de quem publica. Não vai para o site público.
//
// Fluxo editorial: rascunho → em revisão → aprovado → publicado.
// A aprovação clínica é da Dra. Thaís (review no pull request). Preencher o
// campo "status" aqui não equivale, sozinho, a aprovação médica.
import { config, collection, fields } from '@keystatic/core';
import { block, inline, mark } from '@keystatic/core/content-components';
import { highlighterIcon } from '@keystar/ui/icon/icons/highlighterIcon';

const temas = [
  { label: 'Enxaqueca e dores de cabeça', value: 'enxaqueca' },
  { label: 'Dor no pescoço', value: 'cervical' },
  { label: 'Consulta e sessão', value: 'consulta' },
] as const;

export default config({
  storage: { kind: 'local' },
  ui: {
    brand: { name: 'Dra. Thaís Santos' },
  },
  collections: {
    artigos: collection({
      label: 'Artigos',
      slugField: 'titulo',
      path: 'src/content/artigos/*',
      format: { contentField: 'conteudo' },
      entryLayout: 'content',
      columns: ['titulo', 'status'],
      schema: {
        titulo: fields.slug({ name: { label: 'Título', description: 'A pergunta como a pessoa digitaria no Google.' } }),
        tituloCurto: fields.text({ label: 'Título curto', description: 'Usado na faixa de leitura e no compartilhamento.' }),
        resumo: fields.text({ label: 'Em resumo', multiline: true, description: 'Resposta curta no topo. O limite que muda a conclusão fica aqui também.' }),
        tema: fields.select({ label: 'Tema', options: temas, defaultValue: 'enxaqueca' }),
        capa: fields.image({ label: 'Capa', directory: 'src/assets/artigos', publicPath: '../../assets/artigos/' }),
        capaAlt: fields.text({ label: 'Descrição da capa (texto alternativo)' }),
        capaFoco: fields.text({ label: 'Ponto focal da capa', defaultValue: '50% 40%', description: 'Posição horizontal e vertical, ex.: 50% 30%.' }),
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Rascunho', value: 'rascunho' },
            { label: 'Em revisão médica', value: 'em-revisao' },
            { label: 'Aprovado', value: 'aprovado' },
          ],
          defaultValue: 'rascunho',
        }),
        revisao: fields.object(
          {
            revisor: fields.text({ label: 'Revisor' }),
            data: fields.text({ label: 'Data da revisão (AAAA-MM-DD)' }),
            versao: fields.text({
              label: 'Versão aprovada',
              description: 'Copie a "versão atual do texto" mostrada no preview. Se o texto mudar depois, o artigo sai do site até nova revisão.',
            }),
          },
          { label: 'Revisão médica' },
        ),
        publicadoEm: fields.text({ label: 'Publicado em (AAAA-MM-DD)' }),
        fontes: fields.array(fields.relationship({ label: 'Fonte', collection: 'fontes' }), {
          label: 'Fontes (na ordem de citação)',
          itemLabel: (props) => props.value ?? 'Fonte',
        }),
        proximo: fields.relationship({ label: 'Próximo conteúdo sugerido', collection: 'artigos' }),
        conteudo: fields.markdoc({
          label: 'Texto',
          extension: 'mdoc',
          components: {
            ref: inline({
              label: 'Marcador de fonte',
              schema: { id: fields.relationship({ label: 'Fonte', collection: 'fontes' }) },
            }),
            evidencia: block({
              label: 'Bloco de evidência',
              schema: {
                titulo: fields.text({ label: 'Comparação' }),
                estudado: fields.text({ label: 'O que foi estudado', multiline: true }),
                pessoas: fields.text({ label: 'Em quem e com qual comparação', multiline: true }),
                resultado: fields.text({ label: 'O que se observou', multiline: true }),
                limite: fields.text({ label: 'O limite que muda a leitura', multiline: true }),
                fonte: fields.relationship({ label: 'Fonte', collection: 'fontes' }),
              },
            }),
            pendente: mark({
              label: 'Pendente',
              icon: highlighterIcon,
              schema: { motivo: fields.text({ label: 'O que falta confirmar' }) },
            }),
          },
        }),
      },
    }),
    fontes: collection({
      label: 'Fontes científicas',
      slugField: 'citacao',
      path: 'src/content/fontes/*',
      format: 'yaml',
      columns: ['citacao'],
      schema: {
        citacao: fields.slug({ name: { label: 'Citação curta', description: 'Ex.: Linde et al., Cochrane, 2016' } }),
        titulo: fields.text({ label: 'Título do estudo' }),
        autores: fields.text({ label: 'Autores' }),
        publicacao: fields.text({ label: 'Publicação' }),
        ano: fields.integer({ label: 'Ano' }),
        tipo: fields.text({ label: 'Tipo de estudo' }),
        url: fields.url({ label: 'Link (DOI ou página oficial)' }),
      },
    }),
  },
});
