import { createHash } from 'node:crypto';
import { getCollection, type CollectionEntry } from 'astro:content';
import { modoPreview } from './modo';

export type Artigo = CollectionEntry<'artigos'>;

/**
 * Versão do conteúdo clínico: hash do título, resumo, fontes e corpo.
 * Quem publica copia este valor para `revisao.versao` ao enviar o texto para
 * a revisão da Dra. Thaís. Qualquer mudança posterior no texto altera a versão,
 * e o artigo sai da produção até ser revisado de novo.
 */
export function versaoDoArtigo(artigo: Artigo): string {
  const fontes = artigo.data.fontes.map((f) => f.id);
  const corpo = (artigo.body ?? '').replace(/\r\n/g, '\n').trim();
  return createHash('sha256')
    .update(JSON.stringify([artigo.data.titulo, artigo.data.resumo, fontes, corpo]))
    .digest('hex')
    .slice(0, 12);
}

export type EstadoRevisao = {
  status: Artigo['data']['status'];
  versaoAtual: string;
  versaoAprovada: string | null;
  publicavel: boolean;
  motivo: string | null;
};

export function estadoRevisao(artigo: Artigo): EstadoRevisao {
  const versaoAtual = versaoDoArtigo(artigo);
  const versaoAprovada = artigo.data.revisao.versao ?? null;
  const { status } = artigo.data;
  let motivo: string | null = null;
  if (status !== 'aprovado') motivo = status === 'rascunho' ? 'Rascunho' : 'Em revisão médica';
  else if (versaoAprovada !== versaoAtual) motivo = 'O texto mudou depois da aprovação e precisa de nova revisão';
  else if (!artigo.data.revisao.revisor || !artigo.data.revisao.data) motivo = 'Aprovação sem revisor ou data';
  return { status, versaoAtual, versaoAprovada, publicavel: motivo === null, motivo };
}

/** Artigos que entram no build: todos no preview, só os aprovados na produção. */
export async function artigosVisiveis(): Promise<Artigo[]> {
  const todos = await getCollection('artigos');
  const visiveis = modoPreview ? todos : todos.filter((a) => estadoRevisao(a).publicavel);
  return visiveis.sort((a, b) => (b.data.publicadoEm ?? '').localeCompare(a.data.publicadoEm ?? ''));
}

export const nomesDosTemas: Record<Artigo['data']['tema'], string> = {
  enxaqueca: 'Enxaqueca e dores de cabeça',
  cervical: 'Dor no pescoço',
  consulta: 'Consulta e sessão',
};
