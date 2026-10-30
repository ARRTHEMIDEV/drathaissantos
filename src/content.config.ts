import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Fontes científicas compartilhadas entre artigos (uma ficha por estudo).
const fontes = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/fontes' }),
  schema: z.object({
    citacao: z.string(),
    titulo: z.string(),
    autores: z.string(),
    publicacao: z.string(),
    ano: z.number(),
    tipo: z.string(),
    url: z.url(),
  }),
});

const artigos = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/artigos' }),
  schema: ({ image }) =>
    z.object({
      titulo: z.string(),
      tituloCurto: z.string(),
      resumo: z.string(),
      tema: z.enum(['enxaqueca', 'cervical', 'consulta']),
      capa: image(),
      capaAlt: z.string(),
      capaFoco: z.string().default('50% 40%'),
      status: z.enum(['rascunho', 'em-revisao', 'aprovado']),
      revisao: z
        .object({
          revisor: z.string().nullish(),
          data: z.string().nullish(),
          versao: z.string().nullish(),
        })
        .default({}),
      publicadoEm: z.string().nullish(),
      fontes: z.array(reference('fontes')).default([]),
      proximo: reference('artigos').nullish(),
    }),
});

export const collections = { fontes, artigos };
