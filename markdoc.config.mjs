import { defineMarkdocConfig, component, nodes } from '@astrojs/markdoc/config';

export default defineMarkdocConfig({
  // Sem o <article> extra: a página do artigo já é o <article>.
  nodes: {
    document: { ...nodes.document, render: null },
  },
  tags: {
    // Marcador de fonte que abre uma ficha junto ao trecho: {% ref id="linde-2016" /%}
    ref: {
      render: component('./src/components/artigo/Ref.astro'),
      inline: true,
      selfClosing: true,
      attributes: {
        id: { type: String, required: true },
      },
    },
    // Bloco de evidência: o que foi estudado, em quem, resultado, limite e fonte.
    evidencia: {
      render: component('./src/components/artigo/Evidencia.astro'),
      selfClosing: true,
      attributes: {
        titulo: { type: String, required: true },
        estudado: { type: String, required: true },
        pessoas: { type: String, required: true },
        resultado: { type: String, required: true },
        limite: { type: String, required: true },
        fonte: { type: String, required: true },
      },
    },
    // Trecho que ainda depende de confirmação: {% pendente motivo="..." %}texto{% /pendente %}
    pendente: {
      render: component('./src/components/Pendente.astro'),
      inline: true,
      attributes: {
        motivo: { type: String, required: true },
      },
    },
  },
});
