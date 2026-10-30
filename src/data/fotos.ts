import type { ImageMetadata } from 'astro';
import f8873 from '../assets/fotos/nkz-8873.jpg';
import f8884 from '../assets/fotos/nkz-8884.jpg';
import f8771 from '../assets/fotos/nkz-8771.jpg';
import f8738 from '../assets/fotos/nkz-8738.jpg';
import f8748 from '../assets/fotos/nkz-8748.jpg';
import f8815 from '../assets/fotos/nkz-8815.jpg';
import f8828 from '../assets/fotos/nkz-8828.jpg';
import f8828detalhe from '../assets/fotos/nkz-8828-detalhe.jpg';
import f8847 from '../assets/fotos/nkz-8847.jpg';
import f8778 from '../assets/fotos/nkz-8778.jpg';
import f8854 from '../assets/fotos/nkz-8854.jpg';

// Cada foto guarda o ponto focal por uso (desktop e celular), para que o
// enquadramento não "salte" quando uma imagem substitui outra.
// NKZ_8890 e NKZ_8894 mostram outra pessoa e não entram no site.
// NKZ_8828 tem o rosto desfocado no original: usar só como detalhe.

export type Foto = {
  src: ImageMetadata;
  alt: string;
  foco: { desktop: string; celular: string };
};

export const fotos = {
  retratoAbertura: {
    src: f8873,
    alt: 'Dra. Thaís Santos sentada em uma poltrona do consultório, com uma xícara de café, sorrindo para a câmera.',
    foco: { desktop: '50% 28%', celular: '50% 20%' },
  },
  retratoAberturaCelular: {
    src: f8884,
    alt: 'Dra. Thaís Santos sentada no consultório, com a mão apoiada no rosto, sorrindo.',
    foco: { desktop: '50% 30%', celular: '52% 26%' },
  },
  retratoTrajetoria: {
    src: f8771,
    alt: 'Dra. Thaís Santos em pé no consultório, diante de uma estante com livros.',
    foco: { desktop: '50% 26%', celular: '50% 22%' },
  },
  consultorio: {
    src: f8738,
    alt: 'Consultório com mesa branca, divisória de ripas de madeira e maca ao fundo; a Dra. Thaís está sentada à mesa.',
    foco: { desktop: '46% 55%', celular: '44% 60%' },
  },
  conversa: {
    src: f8748,
    alt: 'Dra. Thaís sentada em uma cadeira do consultório, com um livro no colo, olhando para a câmera.',
    foco: { desktop: '50% 30%', celular: '50% 28%' },
  },
  maca: {
    src: f8815,
    alt: 'Dra. Thaís em pé ao lado da maca do consultório.',
    foco: { desktop: '50% 34%', celular: '50% 30%' },
  },
  agulha: {
    src: f8828,
    alt: 'Mão segurando uma agulha de acupuntura em primeiro plano; ao fundo, desfocada, a Dra. Thaís.',
    foco: { desktop: '42% 62%', celular: '42% 62%' },
  },
  agulhaDetalhe: {
    src: f8828detalhe,
    alt: 'Mão segurando uma agulha de acupuntura, em detalhe.',
    foco: { desktop: '45% 40%', celular: '45% 40%' },
  },
  cartao: {
    src: f8847,
    alt: 'Dra. Thaís estendendo um cartão verde com a marca na direção da câmera.',
    foco: { desktop: '45% 32%', celular: '45% 30%' },
  },
  leitura: {
    src: f8778,
    alt: 'Dra. Thaís lendo um livro, apoiada na maca do consultório.',
    foco: { desktop: '62% 40%', celular: '64% 40%' },
  },
  pausa: {
    src: f8854,
    alt: 'Dra. Thaís em pé no consultório, segurando uma xícara de café.',
    foco: { desktop: '50% 30%', celular: '50% 26%' },
  },
} satisfies Record<string, Foto>;
