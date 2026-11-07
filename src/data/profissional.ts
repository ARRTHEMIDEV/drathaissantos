// Fonte única para nome, registros, contato e local de atendimento.
// Páginas, rodapé e JSON-LD leem daqui. Campo `null` = informação pendente:
// o componente que usar o campo mostra a marcação [PENDENTE] e o build de
// produção falha enquanto ela existir.

export const profissional = {
  nome: 'Dra. Thaís Santos',
  especialidade: 'Médica especialista em Acupuntura',
  cidade: 'Belo Horizonte',
  uf: 'MG',
  crm: 'CRM-MG 80240',
  rqe: 'RQE 60876',
  areaRqe: 'Acupuntura',
  instagram: 'https://www.instagram.com/drathais.bh/',
  instagramUsuario: '@drathais.bh',
  buscaCfm: 'https://portal.cfm.org.br/busca-medicos/',

  // WhatsApp do consultório, só dígitos com DDI. Vem do botão "Atendimento" do
  // Linktree da bio do Instagram (linktr.ee/drathais.bh), lido em 07/11/2026.
  whatsapp: '5531984916090' as string | null,
  mensagemWhatsapp: 'Olá! Gostaria de informações sobre uma consulta com a Dra. Thaís.',

  local: {
    nome: 'Espaço Arthemi',
    site: 'https://www.arthemisaude.com',
    // Endereço público do Espaço Arthemi. Falta a Dra. Thaís confirmar que
    // é o endereço atual do consultório; até lá aparece marcado como pendente.
    endereco: 'Avenida Brasil, 248',
    bairro: 'Santa Efigênia',
    cep: '30140-900',
    confirmado: false,
    rota: 'https://www.google.com/maps/search/?api=1&query=Avenida+Brasil+248+Santa+Efig%C3%AAnia+Belo+Horizonte',
  },

  // Fatos documentados no currículo recebido pelo projeto (briefing de 13/10/2026).
  // Conferir se continuam atuais antes de publicar.
  formacao: [
    { periodo: '2013–2019', texto: 'Graduação em Medicina pela Universidade Federal de Minas Gerais (UFMG)' },
    { periodo: '2021–2023', texto: 'Especialização em Acupuntura no IMBA' },
    { periodo: null, texto: 'Título de especialista em Acupuntura pelo Colégio Médico Brasileiro de Acupuntura (CMBA) e pela Associação Médica Brasileira (AMB)' },
    { periodo: 'Desde 2024', texto: 'Consultório particular de Acupuntura em Belo Horizonte' },
    { periodo: null, texto: 'Monitora na formação em Acupuntura do IMBA' },
  ],
} as const;

export const linkAgendamento = '/agendar';

export function urlWhatsapp(): string | null {
  if (!profissional.whatsapp) return null;
  return `https://wa.me/${profissional.whatsapp}?text=${encodeURIComponent(profissional.mensagemWhatsapp)}`;
}
