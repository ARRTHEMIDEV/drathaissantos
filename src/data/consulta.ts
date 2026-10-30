import { fotos, type Foto } from './fotos';

// [PENDENTE] Sequência e textos a confirmar com a rotina real da Dra. Thaís.
// A sessão não deve parecer obrigatória na primeira consulta, e nem todas as
// etapas precisam acontecer no mesmo encontro.

export type Etapa = {
  id: string;
  titulo: string;
  resumo: string;
  texto: string[];
  foto: Foto;
  legenda: string;
};

export const etapasConsulta: Etapa[] = [
  {
    id: 'conversa',
    titulo: 'Conversa',
    resumo: 'Como a dor começou, o que piora e o que ela atrapalha.',
    texto: [
      'A consulta começa pela história da dor: quando começou, como se comporta, o que piora ou alivia e o que você já tentou.',
      'Também entra o que ela tem impedido no dia a dia, porque melhorar inclui voltar a fazer o que importa para você.',
    ],
    foto: fotos.conversa,
    legenda: 'A conversa acontece com calma, antes de qualquer procedimento.',
  },
  {
    id: 'exame',
    titulo: 'Exame',
    resumo: 'Procura a causa da dor e sinais que pedem outra investigação.',
    texto: [
      'O exame físico procura a causa da dor e as estruturas envolvidas: músculos, tendões, articulações e nervos.',
      'Ele também verifica sinais de alarme, que indicam a necessidade de outra investigação antes de pensar em tratamento.',
    ],
    foto: fotos.maca,
    legenda: 'Parte do exame é feita na maca do consultório.',
  },
  {
    id: 'plano',
    titulo: 'Plano',
    resumo: 'Se a acupuntura fizer sentido, o plano é discutido com você.',
    texto: [
      'Com a avaliação feita, a médica explica o que encontrou e discute as opções. Se a acupuntura fizer sentido, o plano é combinado com você.',
      'O número de sessões depende da avaliação e é revisto conforme a evolução.',
    ],
    foto: fotos.consultorio,
    legenda: 'Mesa de atendimento, com a maca ao fundo.',
  },
  {
    id: 'sessao',
    titulo: 'Sessão, quando indicada',
    resumo: 'Pode acontecer no mesmo dia ou em outro encontro.',
    texto: [
      'Quando a acupuntura é indicada, a sessão pode acontecer no mesmo dia ou em outro encontro. Você pode falar sobre qualquer desconforto durante a sessão.',
    ],
    foto: fotos.agulhaDetalhe,
    legenda: 'Agulha de acupuntura, fina e de uso único.',
  },
];
