import { NICHE_LABELS, type NicheType } from '@/types'

export interface GenerateWrittenPostOptions {
  niche?: string | NicheType
  themeOrProduct: string
  characterOrIdea?: string
  durationText?: string
  category?: 'virais' | 'ecommerce'
}

/**
 * Modelos de posts escritos por nicho, sem hashtags preenchidas,
 * terminando sempre com os marcadores "# " para o usuário preencher com o que desejar.
 */
const NICHE_TEMPLATES: Record<string, Array<(title: string, detail?: string) => string>> = {
  historinhas_frutas: [
    (title, detail) =>
      `Você nunca mais vai olhar para uma fruta do mesmo jeito depois disso! 😱🍎\n\nAcompanhe a história do(a) ${title}${detail ? ` (${detail})` : ''} que viralizou e conquistou todo mundo.\n\nQual fruta você quer ver no próximo vídeo? Deixe nos comentários! 👇\n\n# # # # # `,
    (title, detail) =>
      `A melhor historinha que você vai ver no seu feed hoje! 🍉✨\n\nConheça o(a) ${title}${detail ? ` — ${detail}` : ''}. O final vai te surpreender demais.\n\nComente qual fruta merece um episódio só dela! 💬\n\n# # # # # `,
  ],
  infantil_historinhas: [
    (title, detail) =>
      `Era uma vez uma aventura cheia de lições e magia! 🌟📚\n\nVenha se encantar com ${title}${detail ? `, uma história sobre ${detail}` : ''} perfeita para todas as idades.\n\nCompartilhe com quem adora boas historinhas e fábulas encantadas! 💖\n\n# # # # # `,
    (title, detail) =>
      `Uma história fofa para alegrar o seu dia! 🎈✨\n\nConheça a turminha de ${title}${detail ? ` e viva essa aventura: ${detail}` : ''}.\n\nDeixe seu coraçãozinho e salve para assistir depois! 👇\n\n# # # # # `,
  ],
  terror_suspense: [
    (title, detail) =>
      `NÃO ASSISTA ESTE VÍDEO SE VOCÊ TIVER MEDO DO ESCURO... 🕯️👁️\n\nO que aconteceu com ${title}${detail ? ` às 3 da manhã (${detail})` : ' às 3 da manhã'} não tem explicação lógica.\n\nVocê teria coragem de ficar sozinho nesse lugar? Comente sua teoria aqui embaixo... se tiver coragem. 😱\n\n# # # # # `,
    (title, detail) =>
      `O mistério que a internet inteira está tentando decifrar... 💀⚠️\n\nPreste muita atenção em cada detalhe de ${title}${detail ? `: ${detail}` : ''}.\n\nVocê notou algo estranho no fundo? Me conte nos comentários! 👇\n\n# # # # # `,
  ],
  comedia_engracado: [
    (title, detail) =>
      `Eu juro que tentei disfarçar, mas não deu! 😂🤣\n\nQuando o assunto é ${title}${detail ? ` (${detail})` : ''}, o perrengue vem em dose dupla!\n\nMarca aquele amigo que passa exatamente pela mesma vergonha todo dia! 👇👇\n\n# # # # # `,
    (title, detail) =>
      `Se você não rir disso, pode ter certeza de que já perdeu a alegria de viver! 😭😂\n\nOlha só o que aconteceu com ${title}${detail ? `: ${detail}` : ''}.\n\nCompartilhe com o grupo da família antes que deletem! 🚀\n\n# # # # # `,
  ],
  face_swap: [
    (title, detail) =>
      `Parece real, mas é pura inteligência artificial! 🤖✨\n\nTroca de rosto épica com ${title}${detail ? ` explorando ${detail}` : ''}. O nível de realismo ficou absurdo.\n\nQuem você gostaria de ver transformado no próximo vídeo? Manda nos comentários! 👇\n\n# # # # # `,
    (title, detail) =>
      `O futuro da criação de conteúdo chegou e está surreal! 🎭🔥\n\nResultado impressionante de troca de rosto em ${title}${detail ? ` (${detail})` : ''}.\n\nDe 0 a 10, que nota você dá para esse resultado? Comente aí! 💬\n\n# # # # # `,
  ],
  asmr_sensorial: [
    (title, detail) =>
      `Coloque os fones de ouvido e sinta o relaxamento imediato... 🎧🫧\n\nSons táteis e visual super satisfatório de ${title}${detail ? ` com foco em ${detail}` : ''}.\n\nDeixe nos comentários qual gatilho te dá mais arrepio bom! 💆‍♀️✨\n\n# # # # # `,
    (title, detail) =>
      `O alívio mental que você precisava no final do dia. 🌿✨\n\nExperiência sensorial completa com ${title}${detail ? ` (${detail})` : ''}. Relaxe e aproveite cada textura.\n\nSalve para ouvir antes de dormir! 💤\n\n# # # # # `,
  ],
  animais_falantes: [
    (title, detail) =>
      `Se os bichinhos pudessem falar tudo o que pensam, seria exatamente assim! 🐶🐱🗣️\n\nA reação de ${title}${detail ? ` diante de ${detail}` : ''} é simplesmente impagável.\n\nQual é a raça do seu pet? Me conta nos comentários como ele reagiria! 👇❤️\n\n# # # # # `,
    (title, detail) =>
      `Flagra real com narração hilária do seu pet favorito! 🐾😂\n\nOlha a ousadia de ${title}${detail ? ` quando achou que ninguém estava gravando: ${detail}` : ''}.\n\nMarca quem é louco por bichinhos e deixe o like! 🐶❤️\n\n# # # # # `,
  ],
  perfumes_cosmeticos: [
    (title, detail) =>
      `O segredo para ficar com cheiro de gente rica e marcante o dia inteiro! 💎✨\n\nConheça todos os detalhes de ${title}${detail ? ` — ${detail}` : ''}. Projeção e fixação que chamam atenção por onde você passar.\n\nVocê já testou essa fragrância? Me conta nos comentários o que achou! 👇🛍️\n\n# # # # # `,
    (title, detail) =>
      `Se você ama se cuidar e andar sempre impecável, para tudo e olha isso! 💄✨\n\nTudo sobre ${title}${detail ? ` e como aplicar: ${detail}` : ''}.\n\nLink no primeiro comentário ou no perfil para garantir o seu! 📦👇\n\n# # # # # `,
  ],
  curiosidades: [
    (title, detail) =>
      `O detalhe chocante que 99% das pessoas não sabiam até agora! 🤯🔍\n\nDescubra a verdade sobre ${title}${detail ? ` (${detail})` : ''} e como isso muda tudo o que você pensava.\n\nVocê já desconfiava disso? Me conte a sua teoria nos comentários! 👇\n\n# # # # # `,
    (title, detail) =>
      `Fatos inacreditáveis que vão explodir a sua cabeça em 60 segundos! ⚡🧠\n\nA história completa de ${title}${detail ? `: ${detail}` : ''}.\n\nCompartilhe com aquele amigo que ama curiosidades bizarras! 🚀\n\n# # # # # `,
  ],
  moda_feminina: [
    (title, detail) =>
      `POV: Você finalmente achou a peça perfeita que valoriza qualquer look! 👗✨\n\nOlha o caimento desse(a) ${title}${detail ? ` — detalhes: ${detail}` : ''}. Tecido encorpado, não marca e combina com tudo.\n\nJá deixei o link com cupom ativo no carrinho amarelo aqui embaixo! Garanta o seu antes que esgote! 👇🛍️\n\n# # # # # `,
    (title, detail) =>
      `Para tudo e olha essa perfeição em movimento! 😍🔥\n\n${title}${detail ? ` com caimento impecável: ${detail}` : ''}. Do casual ao elegante em segundos!\n\nComente "EU QUERO" ou clique no link da sacolinha para garantir com desconto hoje! 📦💃\n\n# # # # # `,
  ],
  calcados: [
    (title, detail) =>
      `Conforto de nuvem e estilo de passarela no mesmo produto! 👟✨\n\nTestando o caimento de ${title}${detail ? ` — ${detail}` : ''}. Amortecimento premium e acabamento de primeira linha.\n\nTodos os tamanhos disponíveis no carrinho aqui embaixo com frete facilitado! 👇📦\n\n# # # # # `,
  ],
  acessorios: [
    (title, detail) =>
      `O toque final que transforma qualquer visual básico em pura elegância! 💍✨\n\nConheça ${title}${detail ? ` (${detail})` : ''}. Brilho duradouro e acabamento de joia fina.\n\nGaranta com desconto especial clicando no link aqui embaixo! 👇🛍️\n\n# # # # # `,
  ],
  casa_decoracao: [
    (title, detail) =>
      `Achadinho imperdível para deixar a sua casa muito mais bonita e organizada! 🏠✨\n\nOlha que incrível esse(a) ${title}${detail ? ` — ${detail}` : ''}. Prático, elegante e super funcional.\n\nLink direto com desconto ativo no carrinho aqui embaixo! Corre antes que zere o estoque! 👇📦\n\n# # # # # `,
  ],
  fitness_suplementos: [
    (title, detail) =>
      `O segredo para acelerar seus resultados e manter a constância nos treinos! 💪⚡\n\nConheça ${title}${detail ? ` — ${detail}` : ''}. Sabor incrível e qualidade testada e aprovada.\n\nClique no carrinho amarelo aqui embaixo para garantir com o cupom de hoje! 👇🔥\n\n# # # # # `,
  ],
  eletronicos: [
    (title, detail) =>
      `Será que esse produto vale todo o hype da internet? Testei na prática! 📱⚡\n\nTudo sobre ${title}${detail ? ` — ${detail}` : ''}. Custo-benefício impressionante e entrega ultra rápida.\n\nLink oficial no carrinho aqui embaixo com garantia e desconto! Garanta o seu! 👇🛒\n\n# # # # # `,
  ],
}

/**
 * Fallback padrão caso o nicho não esteja listado explicitamente.
 */
const DEFAULT_VIRAL_TEMPLATE = (title: string, detail?: string) =>
  `Você não vai acreditar no que aconteceu aqui! 😱🎬\n\nConfira todos os detalhes de ${title}${detail ? ` (${detail})` : ''}. Uma história pensada para prender sua atenção do primeiro ao último segundo.\n\nO que você faria nessa situação? Deixe sua opinião sincera nos comentários e siga para mais conteúdos como esse! 👇💬\n\n# # # # # `

const DEFAULT_ECOMMERCE_TEMPLATE = (title: string, detail?: string) =>
  `Achadinho viral que todo mundo está procurando na internet! 🛍️✨\n\nOlha o acabamento e a presença desse(a) ${title}${detail ? ` — ${detail}` : ''}. Qualidade premium com envio imediato para todo o Brasil!\n\nClique no carrinho amarelo ou no link aqui embaixo para garantir o seu com cupom ativo hoje! 👇📦\n\n# # # # # `

/**
 * Gera um post escrito pronto para cópia, coerente com o nicho do vídeo gerado,
 * SEM nenhuma hashtag preenchida — apenas com os marcadores "# " (cerilha + espaço)
 * para a pessoa preencher como quiser.
 */
export function generateWrittenPost(options: GenerateWrittenPostOptions): string {
  const nicheKey = String(options.niche || '')
    .trim()
    .toLowerCase()
  const title = (options.themeOrProduct || options.characterOrIdea || 'Vídeo em destaque').trim()
  const detail =
    options.characterOrIdea && options.characterOrIdea !== title
      ? options.characterOrIdea.trim()
      : undefined

  const templates = NICHE_TEMPLATES[nicheKey]
  let postText = ''

  if (templates && templates.length > 0) {
    const idx = Math.abs(title.length + (detail?.length || 0)) % templates.length
    postText = templates[idx](title, detail)
  } else if (options.category === 'ecommerce') {
    postText = DEFAULT_ECOMMERCE_TEMPLATE(title, detail)
  } else {
    postText = DEFAULT_VIRAL_TEMPLATE(title, detail)
  }

  // Garantia absoluta: nenhuma palavra colada à hashtag (remove #palavra e mantém apenas "# ")
  // Se houver qualquer hashtag preenchida (#tag), remove a tag deixando "# "
  let sanitized = postText.replace(/#([a-zA-Z0-9_À-ÿ]+)/g, '# ')

  // Assegura que o final termine com "# # # # # "
  if (!/#\s+#\s+#/.test(sanitized)) {
    sanitized = sanitized.trim() + '\n\n# # # # # '
  }

  return sanitized.trim()
}
