import pb from '@/lib/pocketbase/client'
import type { GenerationRecord, NicheType, StyleType, PlatformType } from '@/types'
import { NICHE_LABELS, STYLE_LABELS, PLATFORM_LABELS } from '@/types'

export interface GeneratePromptInput {
  userId: string
  productName: string
  niche: NicheType
  style: StyleType
  platform?: PlatformType
  targetAudience?: string
  details?: string
  referenceImages?: File[]
  referenceImageUrls?: string[]
  visualDetails?: string
  category?: 'ecommerce' | 'virais'
}

export interface AdaptPromptInput {
  originalPrompt?: string
  promptTitle?: string
  productName?: string
  characterName?: string
  visualDetails?: string
  niche?: string
  style?: StyleType
  platform?: PlatformType
  referenceImages?: File[]
  imagesCount?: number
  category?: 'ecommerce' | 'virais'
  iterationSeed?: number
}

export interface GenerateViralSceneInput {
  userId?: string
  userIdea?: string
  themeName?: string
  characterName?: string
  niche: NicheType
  visualDetails?: string
  referenceImages?: File[]
  imagesCount?: number
  seed?: number
}

export interface GenerateViralSceneResult {
  success: boolean
  theme_name: string
  user_idea?: string
  character_name?: string
  niche: NicheType
  niche_label: string
  scene_concept: string
  optional_script: string
  image_count: number
  record_id?: string
  error?: string
}

export interface PromptVariation {
  id: string
  angle: string
  badge: string
  description: string
  prompt_text: string
}

export interface RegenerateVariationsInput {
  basePrompt?: string
  promptTitle?: string
  productName?: string
  characterName?: string
  visualDetails?: string
  niche?: string
  imagesCount?: number
  category?: 'ecommerce' | 'virais'
  seed?: number
}

export interface RegenerateVariationsResult {
  success: boolean
  product_name: string
  character_name?: string
  variations: PromptVariation[]
}

export interface AdaptPromptResult {
  success: boolean
  adapted_prompt: string
  product_name?: string
  character_name?: string
  visual_details?: string
  error?: string
}

export function buildPromptScript(input: Omit<GeneratePromptInput, 'userId'>): string {
  const nicheLabel = NICHE_LABELS[input.niche]
  const styleLabel = STYLE_LABELS[input.style]
  const platformLabel = PLATFORM_LABELS[input.platform || 'ambos']
  const audience =
    input.targetAudience?.trim() ||
    'Compradores que buscam estilo, custo-benefício e caimento perfeito no TikTok Shop/Shopee'

  const imageCount = input.referenceImages?.length || input.referenceImageUrls?.length || 0
  const photoNote =
    imageCount > 0
      ? `Roteiro 100% calibrado nas ${imageCount} foto(s) reais enviadas da peça (preservando cores, caimento, textura e modelagem exata)`
      : ''

  const details =
    input.details?.trim() ||
    input.visualDetails?.trim() ||
    (photoNote
      ? `Cores vibrantes, modelagem e caimento idênticos às fotos enviadas pelo criador/lojista`
      : 'Acabamento premium, costuras reforçadas e caimento perfeito no corpo')

  const commonHeader = `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - MÁXIMO 10 SEGUNDOS]
🎯 PRODUTO: ${input.productName}
🏷️ NICHO: ${nicheLabel}
📱 CANAL DE VENDA: ${platformLabel}
👥 PÚBLICO-ALVO: ${audience}
✨ DETALHES FIÉIS: ${details}

⏱️ DURAÇÃO MÁXIMA: 10 segundos
📌 DIRETRIZES ESSENCIAIS:
- Idioma da narração: Português Brasileiro (PT-BR)
- Vídeo totalmente liso: SEM legendas, SEM textos na tela, SEM caracteres desenhados no vídeo (as IAs de vídeo erram texto).`

  if (input.style === 'pov') {
    return `${commonHeader}

🎬 CENA 1 (0-3s) - O GANCHO HIPNÓTICO (HOOK):
- Câmera em primeira pessoa (POV): Você em frente ao espelho com o(a) ${input.productName}.
- Vídeo totalmente liso e limpo, sem nenhuma palavra escrita na tela.
- Narração empolgada (PT-BR): "POV: Você finalmente achou o(a) ${input.productName} que disfarça qualquer insegurança e veste perfeitamente!"

🎬 CENA 2 (3-7s) - TESTE DE CAIMENTO REAL:
- Meio giro em câmera lenta mostrando lateral e caimento das costas.
- Close na mão tocando a textura: "${details}."
- Narração (PT-BR): "Caimento impecável, tecido encorpado que não marca e veste com conforto imediato."

🎬 CENA 3 (7-10s) - CHAMADA DIRETA PARA O CARRINHO (CTA):
- Apontando para o canto inferior onde fica o carrinho:
- Narração (PT-BR): "Deixei o link no carrinho amarelo aqui embaixo com desconto ativo hoje. Garanta o seu!"`
  } else if (input.style === 'modelo') {
    return `${commonHeader}

🎬 CENA 1 (0-3s) - GANCHO VISUAL DE ALTO IMPACTO (HOOK):
- Modelo caminhando com atitude em direção à câmera, iluminação nítida e olhar confiante.
- Vídeo 100% limpo, sem texto ou legendas gravadas na imagem.
- Narração com presença (PT-BR): "Se você ama se vestir bem sem gastar rios de dinheiro, pare tudo e olha o caimento desse(a) ${input.productName}!"

🎬 CENA 2 (3-7s) - O TESTE REAL EM MOVIMENTO:
- Modelo fazendo giro suave de 360 graus, mostrando silhueta e acabamento (${details}).
- Narração (PT-BR): "Olha como valoriza a silhueta sem apertar. A modelagem abraça o corpo com perfeição."

🎬 CENA 3 (7-10s) - CTA DIRETO AO CARRINHO:
- Modelo apontando diretamente para a sacolinha ou vitrine no canto inferior:
- Narração (PT-BR): "Tem todos os tamanhos disponíveis no link aqui embaixo. Corre antes que esgote!"`
  } else {
    return `${commonHeader}

🎬 CENA 1 (0-3s) - O GANCHO SATISFATÓRIO (HOOK):
- Câmera superior em ângulo plano mostrando o(a) ${input.productName} sendo retirado da embalagem com som satisfatório.
- Vídeo totalmente liso, sem palavras ou legendas na tela.
- Narração (PT-BR): "Será que esse(a) ${input.productName} vale todo o hype da internet? Vamos conferir agora!"

🎬 CENA 2 (3-7s) - INSPEÇÃO RÁPIDA DE ACABAMENTO:
- Close nos detalhes das costuras, toque e firmeza: "${details}."
- Narração (PT-BR): "Costura reforçada de fábrica, zero defeitos e caimento de peça premium."

🎬 CENA 3 (7-10s) - CTA COM SENSO DE URGÊNCIA:
- Apontando para o carrinho amarelo no canto inferior:
- Narração (PT-BR): "Envio no mesmo dia com cupom ativo. Clica no carrinho aqui embaixo pra garantir o seu!"`
  }
}

export async function saveGeneratedPrompt(input: GeneratePromptInput): Promise<GenerationRecord> {
  const generatedText = buildPromptScript(input)

  if (input.referenceImages && input.referenceImages.length > 0) {
    const formData = new FormData()
    formData.append('user', input.userId)
    formData.append('product_name', input.productName)
    formData.append('niche', input.niche)
    formData.append('style', input.style)
    formData.append('platform', input.platform || 'ambos')
    formData.append('target_audience', input.targetAudience || '')
    formData.append('generated_prompt', generatedText)

    if (input.visualDetails) {
      formData.append('image_prompt_description', input.visualDetails)
    }

    input.referenceImages.slice(0, 3).forEach((file) => {
      formData.append('reference_images', file)
    })

    return await pb.collection('generations').create<GenerationRecord>(formData)
  }

  return await pb.collection('generations').create<GenerationRecord>({
    user: input.userId,
    product_name: input.productName,
    niche: input.niche,
    style: input.style,
    platform: input.platform || 'ambos',
    target_audience: input.targetAudience || '',
    generated_prompt: generatedText,
    image_prompt_description: input.visualDetails || '',
  })
}

export async function regeneratePromptVariations(
  input: RegenerateVariationsInput,
): Promise<RegenerateVariationsResult> {
  const imagesCount = input.imagesCount || 1
  const category = input.category || 'ecommerce'
  const seed = input.seed || Math.floor(Math.random() * 1000000)

  try {
    const response = await fetch(
      `${import.meta.env.VITE_POCKETBASE_URL}/backend/v1/regenerate-variations`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(pb.authStore.token ? { Authorization: pb.authStore.token } : {}),
        },
        body: JSON.stringify({
          original_prompt: input.basePrompt,
          prompt_title: input.promptTitle,
          product_name: input.productName,
          character_name: input.characterName,
          visual_details: input.visualDetails,
          niche: input.niche || (category === 'virais' ? 'historinhas_frutas' : 'moda_feminina'),
          images_count: imagesCount,
          category,
          seed,
        }),
      },
    )

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      throw new Error(errData.message || `Erro ${response.status} ao regenerar variações.`)
    }

    return (await response.json()) as RegenerateVariationsResult
  } catch (err: any) {
    console.warn('Erro na rota de regeneração, usando fallback local com 3 variações:', err)
    const fallbackProd = input.productName || input.promptTitle || 'peça em destaque'
    const fallbackVisual = input.visualDetails || 'detalhes fiéis e acabamento premium'

    if (category === 'virais') {
      return {
        success: true,
        product_name: fallbackProd,
        variations: [
          {
            id: 'v_humor_60s',
            angle: 'Humor & Situações Cômicas',
            badge: '😂 Ângulo Humor (60s)',
            description: 'Roteiro de 60s em 6 cenas de 10s focado em perrengue divertido.',
            prompt_text: `[ROTEIRO VIRAL CRIADORES - 60 SEGUNDOS EM CENAS DE 10S]\n✨ ÂNGULO 1: NARRATIVA CÔMICA & HUMOR\n⏱️ DURAÇÃO ALVO: ~60s (6 Cenas de até 10s)\n📌 DIRETRIZES: Narração PT-BR cômica, vídeo 100% limpo sem texto na tela.\n\n🎬 CENA 1 (0-10s) - O FLAGRA INESPERADO (HOOK):\n- Visual: Close cômico em ${fallbackProd}.\n- Narração (PT-BR): "Eu jurei que ninguém tava olhando, até que o pior aconteceu na minha frente!"\n\n🎬 CENA 2 (10-20s) - A TENTATIVA DE DISFARÇAR:\n- Visual: Movimento desajeitado tentando esconder a bagunça (${fallbackVisual}).\n- Narração (PT-BR): "Tentei disfarçar, mas a cara de culpa entregou tudo em dois segundos!"\n\n🎬 CENA 3 (20-30s) - A REAÇÃO DOS OUTROS:\n- Visual: Outros personagens encarando a cena.\n- Narração (PT-BR): "Quem tava por perto parou tudo pra rir da minha desgraça!"\n\n🎬 CENA 4 (30-40s) - O CLÍMAX DA TRAPALHADA:\n- Visual: O desfecho mais atrapalhado.\n- Narração (PT-BR): "Quando achei que ia dar certo, o desastre foi completo!"\n\n🎬 CENA 5 (40-50s) - A CONFORMAÇÃO:\n- Visual: O personagem aceitando a derrota.\n- Narração (PT-BR): "Rir da própria vergonha é a única saída digna nesse momento!"\n\n🎬 CENA 6 (50-60s) - CTA:\n- Visual: Piscadela para a câmera.\n- Narração (PT-BR): "Marca aquele amigo que vive passando por isso e deixa seu like!"`,
          },
          {
            id: 'v_suspense_60s',
            angle: 'Suspense & Curiosidade',
            badge: '🕯️ Ângulo Suspense (60s)',
            description: 'Roteiro de 60s em 6 cenas de 10s focado em mistério e retenção alta.',
            prompt_text: `[ROTEIRO VIRAL CRIADORES - 60 SEGUNDOS EM CENAS DE 10S]\n⚡ ÂNGULO 2: SUSPENSE & CURIOSIDADE MÁXIMA\n⏱️ DURAÇÃO ALVO: ~60s (6 Cenas de até 10s)\n📌 DIRETRIZES: Narração PT-BR misteriosa, vídeo 100% limpo sem texto na tela.\n\n🎬 CENA 1 (0-10s) - O DETALHE QUE NINGUÉM NOTOU (HOOK):\n- Visual: Enquadramento escuro em ${fallbackProd}.\n- Narração (PT-BR): "Olhe com muita atenção para este detalhe antes que o vídeo acabe..."\n\n🎬 CENA 2 (10-20s) - A PISTA ESCONDIDA:\n- Visual: Câmera revelando sombras e texturas (${fallbackVisual}).\n- Narração (PT-BR): "Quase todo mundo passa reto, mas quem repara nos olhos percebe o mistério."\n\n🎬 CENA 3 (20-30s) - APROXIMAÇÃO GRADUAL:\n- Visual: Traveling contínuo com som ambiente tenso.\n- Narração (PT-BR): "Quanto mais você olha, mais a história ganha um sentido bizarro..."\n\n🎬 CENA 4 (30-40s) - O PONTO DE VIRADA:\n- Visual: Corte de luz revelando o elemento chave.\n- Narração (PT-BR): "Foi exatamente aqui que a gravação registrou algo inexplicável."\n\n🎬 CENA 5 (40-50s) - A DESCOBERTA FINAL:\n- Visual: Clímax do mistério em 4K.\n- Narração (PT-BR): "Agora me diz: você percebeu o que estava acontecendo desde o início?"\n\n🎬 CENA 6 (50-60s) - CTA:\n- Visual: Enquadramento final estático.\n- Narração (PT-BR): "Compartilhe este vídeo com quem é curioso e comente sua teoria aqui embaixo!"`,
          },
          {
            id: 'v_emocao_60s',
            angle: 'Emoção & Fofura',
            badge: '💖 Ângulo Emoção (60s)',
            description: 'Roteiro de 60s em 6 cenas de 10s focado em acolhimento e conexão.',
            prompt_text: `[ROTEIRO VIRAL CRIADORES - 60 SEGUNDOS EM CENAS DE 10S]\n💖 ÂNGULO 3: EMOÇÃO, FOFURA & TRANSFORMAÇÃO\n⏱️ DURAÇÃO ALVO: ~60s (6 Cenas de até 10s)\n📌 DIRETRIZES: Narração PT-BR calorosa, vídeo 100% limpo sem texto na tela.\n\n🎬 CENA 1 (0-10s) - O INÍCIO DE UMA JORNADA DOCE (HOOK):\n- Visual: Luz dourada envolvendo ${fallbackProd}.\n- Narração (PT-BR): "Essa é a história mais fofa e inspiradora que vai passar no seu feed hoje!"\n\n🎬 CENA 2 (10-20s) - O DESAFIO INICIAL:\n- Visual: Personagem encarando um pequeno desafio com olhos curiosos.\n- Narração (PT-BR): "Parecia um obstáculo gigante para alguém tão pequenininho..."\n\n🎬 CENA 3 (20-30s) - A AJUDA INESPERADA:\n- Visual: Gesto de carinho com cores vibrantes.\n- Narração (PT-BR): "Mas quando a coragem vem do coração, nenhum sonho é grande demais."\n\n🎬 CENA 4 (30-40s) - A CONQUISTA BRILHANTE:\n- Visual: Momento triunfante com estrelinhas e luz suave.\n- Narração (PT-BR): "E com paciência e persistência, a mágica finalmente aconteceu!"\n\n🎬 CENA 5 (40-50s) - O ABRAÇO DE GRATIDÃO:\n- Visual: Expressão de pura felicidade (${fallbackVisual}).\n- Narração (PT-BR): "Momentos assim mostram que a beleza da vida está nos pequenos gestos."\n\n🎬 CENA 6 (50-60s) - CTA:\n- Visual: Agradecimento com sorriso doce.\n- Narração (PT-BR): "Mande esse vídeo para iluminar o dia de alguém especial e deixe um coraçãozinho!"`,
          },
        ],
      }
    }
    const prod = input.productName || input.promptTitle || 'peça em destaque'
    const visual = input.visualDetails || 'caimento fiel e acabamento premium'
    const baseScript = input.basePrompt || ''

    return {
      success: true,
      product_name: prod,
      variations: [
        {
          id: 'v1_emocional',
          angle: 'Emocional & Autoestima',
          badge: '💖 Ângulo Emocional',
          description: 'Focado em sensação, transformação pessoal, elogios e desejo imediato.',
          prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS]\n✨ ÂNGULO 1: EMOCIONAL & AUTOESTIMA\n📌 DIRETRIZES: Narração em PT-BR, máx 10s, vídeo totalmente liso sem texto na tela.\n\n🎬 CENA 1 (0-3s) - O GANCHO EMOCIONAL (HOOK):\n- POV em frente ao espelho: segurando o(a) ${prod} no corpo com olhar radiante.\n- Vídeo 100% liso sem textos ou legendas.\n- Narração (PT-BR): "POV: O dia em que eu cansei de peças sem graça e experimentei esse(a) ${prod}! O caimento no corpo é surreal."\n\n🎬 CENA 2 (3-7s) - DETALHES REAIS:\n- Close nos detalhes das fotos: ${visual}.\n- Narração (PT-BR): "Material de extrema qualidade que valoriza as curvas e dá conforto o dia todo."\n\n🎬 CENA 3 (7-10s) - CHAMADA DE DESEJO:\n- Apontando para o carrinho amarelo:\n- Narração (PT-BR): "Você merece se sentir linda todos os dias! O link com envio imediato tá no carrinho amarelo aqui embaixo."`,
        },
        {
          id: 'v2_urgencia',
          angle: 'Urgência & Escassez',
          badge: '⚡ Ângulo Urgência',
          description:
            'Focado em promoção relâmpago, estoque acabando e chamada direta pro carrinho.',
          prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS]\n⚡ ÂNGULO 2: URGÊNCIA & ESCASSEZ MÁXIMA\n📌 DIRETRIZES: Narração em PT-BR, máx 10s, vídeo totalmente liso sem texto na tela.\n\n🎬 CENA 1 (0-3s) - O GANCHO DE ALERTA (HOOK):\n- Câmera rápida com cortes dinâmicos mostrando o(a) ${prod}.\n- Vídeo 100% limpo sem palavras na tela.\n- Narração (PT-BR): "SE VOCÊ TÁ VENDO ESSE VÍDEO, CORRE! O lote desse(a) ${prod} tá zerando com cupom hoje!"\n\n🎬 CENA 2 (3-7s) - PROVA DO PRODUTO:\n- Destaque nos detalhes observados: ${visual}.\n- Narração (PT-BR): "Estoque nacional que esgota em poucas horas pela procura recorde."\n\n🎬 CENA 3 (7-10s) - CHAMADA URGENTE:\n- Apontando para o carrinho:\n- Narração (PT-BR): "Clica agora no carrinho amarelo antes que a promoção encerre e volte ao preço normal!"`,
        },
        {
          id: 'v3_prova_social',
          angle: 'Prova Social & Quebra de Objeções',
          badge: '⭐ Ângulo Prova Social',
          description:
            'Focado em avaliações 5 estrelas, durabilidade, caimento real e comparativo.',
          prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS]\n⭐ ÂNGULO 3: PROVA SOCIAL & CONFIANÇA\n📌 DIRETRIZES: Narração em PT-BR, máx 10s, vídeo totalmente liso sem texto na tela.\n\n🎬 CENA 1 (0-3s) - O GANCHO DE PROVA REAL (HOOK):\n- POV abrindo o pacote ou mostrando o(a) ${prod} com luz natural.\n- Vídeo 100% liso sem nenhuma legenda gravada.\n- Narração (PT-BR): "Eu comprei esse(a) ${prod} pra ver se todas aquelas avaliações 5 estrelas eram verdade... E olhem esse acabamento!"\n\n🎬 CENA 2 (3-7s) - COMPROVAÇÃO DE QUALIDADE:\n- Mostrando acabamento fiel às fotos: ${visual}.\n- Narração (PT-BR): "Costuras reforçadas, toque nobre e zero decepção na entrega."\n\n🎬 CENA 3 (7-10s) - CTA CONFIÁVEL:\n- Apontando para o link da sacolinha:\n- Narração (PT-BR): "Mais de 3.000 pessoas já compraram e aprovaram. Veja as avaliações no link da sacolinha aqui embaixo!"`,
        },
      ],
    }
  }
}

export async function adaptPromptWithImages(input: AdaptPromptInput): Promise<AdaptPromptResult> {
  const imagesCount =
    input.referenceImages?.length ||
    input.imagesCount ||
    (input.referenceImages ? input.referenceImages.length : 0)
  const iterationSeed = input.iterationSeed || Math.floor(Math.random() * 1000000)

  try {
    const response = await fetch(`${import.meta.env.VITE_POCKETBASE_URL}/backend/v1/adapt-prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(pb.authStore.token ? { Authorization: pb.authStore.token } : {}),
      },
      body: JSON.stringify({
        original_prompt: input.originalPrompt,
        prompt_title: input.promptTitle,
        product_name: input.productName,
        character_name: input.characterName,
        visual_details: input.visualDetails,
        niche: input.niche,
        style: input.style || 'pov',
        platform: input.platform || 'ambos',
        images_count: imagesCount,
        category: input.category || 'ecommerce',
        iteration_seed: iterationSeed,
      }),
    })

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      throw new Error(errData.error || `Erro ${response.status} ao adaptar prompt com fotos.`)
    }

    return (await response.json()) as AdaptPromptResult
  } catch (err: any) {
    console.warn('Erro na rota de adaptação, usando fallback local inteligente:', err)
    const char = input.characterName
    const prod = char || input.productName || input.promptTitle || 'Peça em destaque'
    const visual =
      input.visualDetails || 'Caimento ajustado, cor fiel às fotos e tecido de alta densidade'
    const baseScript = input.originalPrompt || ''

    const sanitizedBase = baseScript
      .replace(/^[ \t]*[-•*]?[ \t]*Texto[^:\n\r]*:[^\n\r]*\r?\n?/gim, '')
      .replace(/^[ \t]*[-•*]?[ \t]*Legenda[^:\n\r]*:[^\n\r]*\r?\n?/gim, '')

    const fallbackAdapted = [
      `[ROTEIRO ADAPTADO COM AS SUAS FOTOS - MÁXIMO 10 SEGUNDOS]`,
      `📌 DIRETRIZES ESSENCIAIS:`,
      `- Idioma da narração: Português Brasileiro (PT-BR)`,
      `- Duração máxima: 10 segundos`,
      `- Vídeo totalmente liso: SEM legendas, SEM textos na tela, SEM palavras no vídeo.`,
      `🎯 PEÇA DAS FOTOS: ${prod}`,
      `✨ DETALHES VISUAIS FIÉIS: ${visual}`,
      ``,
      sanitizedBase
        ? `--- ESTRUTURA BASE ADAPTADA (10s) ---\n${sanitizedBase}\n--- DETALHES INCORPORADOS DAS SUAS FOTOS ---\n• Peça física: ${prod}\n• Acabamento & Caimento: ${visual}`
        : `🎬 CENA 1 (0-3s): Mostre a peça das fotos com iluminação frontal. Vídeo liso sem texto. Narração: "Olha o caimento desse(a) ${prod} na prática!"\n🎬 CENA 2 (3-7s): Mostre os detalhes reais: ${visual}.\n🎬 CENA 3 (7-10s): CTA apontando para a sacolinha ou carrinho com desconto!`,
    ].join('\n\n')

    return {
      success: true,
      adapted_prompt: fallbackAdapted,
      product_name: prod,
      visual_details: visual,
    }
  }
}
/**
 * Gerador Específico para Vídeos Virais a partir de fotos criadas.
 * Devolve:
 * 1. Ideia de Cena (conceito curto e direto)
 * 2. Roteiro Opcional (~60 segundos dividido em 6 cenas de 10s)
 * Opcionalmente persiste o registro no histórico de gerações.
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(typeof reader.result === 'string' ? reader.result : '')
    }
    reader.onerror = (err) => reject(err)
    reader.readAsDataURL(file)
  })
}

export async function generateViralSceneWithImages(
  input: GenerateViralSceneInput,
): Promise<GenerateViralSceneResult> {
  const imagesCount = input.referenceImages?.length || input.imagesCount || 0
  const seed = input.seed || Math.floor(Math.random() * 1000000)
  const userIdea = (input.userIdea || '').trim()
  const theme = (input.themeName || userIdea || input.characterName || 'Roteiro Viral').trim()

  // Converter fotos para base64 para envio multimodal ao modelo
  let base64Images: string[] = []
  if (input.referenceImages && input.referenceImages.length > 0) {
    try {
      base64Images = await Promise.all(
        input.referenceImages.slice(0, 3).map((f) => fileToBase64(f)),
      )
    } catch (b64Err) {
      console.warn('Erro ao converter imagem em base64:', b64Err)
    }
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_POCKETBASE_URL}/backend/v1/generate-viral-scene`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(pb.authStore.token ? { Authorization: pb.authStore.token } : {}),
        },
        body: JSON.stringify({
          user_idea: userIdea,
          script_idea: userIdea,
          theme_name: theme,
          character_name: input.characterName,
          niche: input.niche,
          visual_details: input.visualDetails,
          images_count: imagesCount,
          images: base64Images,
          seed,
        }),
      },
    )

    let backendResult: GenerateViralSceneResult | null = null
    if (response.ok) {
      backendResult = (await response.json()) as GenerateViralSceneResult
    }

    const nicheLabel = NICHE_LABELS[input.niche] || 'Vídeos Virais'
    const effectiveIdea = userIdea || theme
    const photoDetails = input.visualDetails
      ? `🔍 Detalhes da sua imagem: ${input.visualDetails}`
      : imagesCount > 0
        ? '🔍 Visual anclado na(s) imagem(ns) enviada(s).'
        : '🔍 Roteiro direcionado pela sua ideia.'

    const sceneConcept =
      backendResult?.scene_concept ||
      `💡 IDEIA DE CENA VIRAL:\n"${effectiveIdea}" no universo de ${nicheLabel}, com enquadramento frontal dinâmico e retenção alta nos primeiros 3 segundos.\n${photoDetails}`

    const optionalScript =
      backendResult?.optional_script ||
      `[ROTEIRO OPCIONAL SUGERIDO - ~60 SEGUNDOS EM 6 CENAS DE 10S]
⏱️ DURAÇÃO ALVO: ~60 Segundos (6 Cenas de até 10s cada)
🏷️ NICHO: ${nicheLabel}
💡 IDEIA DO ROTEIRO: ${effectiveIdea}
${input.characterName ? `🎯 PERSONAGEM: ${input.characterName}\n` : ''}📌 DIRETRIZES: Narração PT-BR contínua em áudio, vídeo 100% limpo sem texto ou legendas gravadas na tela.

🎬 CENA 1 (0-10s) - GANCHO HIPNÓTICO (HOOK):
- Visual: Enquadramento direto iniciando a situação: "${effectiveIdea}". Vídeo 100% limpo sem texto na tela.
- Narração (PT-BR): "Se você acha que já viu de tudo na internet, para tudo e olha o que acabou de acontecer aqui!"

🎬 CENA 2 (10-20s) - DESENVOLVIMENTO DO CONTEXTO:
- Visual: A câmera se move em plano médio revelando detalhes de "${effectiveIdea}" (${input.visualDetails || 'ambientação viva da foto'}).
- Narração (PT-BR): "Ninguém esperava que exatamente hoje esse detalhe fosse descoberto por todo mundo..."

🎬 CENA 3 (20-30s) - REVIRAVOLTA / TENSÃO:
- Visual: Close expressivo diante da reviravolta de "${effectiveIdea}".
- Narração (PT-BR): "E foi aí que o segredo começou a vir à tona diante de quem estava assistindo!"

🎬 CENA 4 (30-40s) - O CLÍMAX DA CENA:
- Visual: Câmera lenta suave capturando o ápice da ação de "${effectiveIdea}".
- Narração (PT-BR): "Olha a expressão, olha cada detalhe acontecendo em tempo real!"

🎬 CENA 5 (40-50s) - A RESOLUÇÃO DA HISTÓRIA:
- Visual: O desfecho da situação com harmonia estética.
- Narração (PT-BR): "No final das contas, ficou provado que essa cena merecia ficar gravada pra sempre!"

🎬 CENA 6 (50-60s) - FECHAMENTO E ENGAGEMENT (CTA):
- Visual: O personagem se despede com carisma e a imagem se fecha com suavidade. Fade-out limpo.
- Narração (PT-BR): "O que você faria no lugar dele? Comente aqui embaixo e siga para o próximo episódio!"`

    // Persiste no banco de dados se houver userId logado
    let createdRecordId: string | undefined = undefined
    if (input.userId) {
      try {
        const fullGeneratedText = `${sceneConcept}\n\n${optionalScript}`
        const recordName = userIdea ? userIdea.slice(0, 60) : theme

        if (input.referenceImages && input.referenceImages.length > 0) {
          const formData = new FormData()
          formData.append('user', input.userId)
          formData.append('product_name', recordName)
          formData.append('niche', input.niche)
          formData.append('style', 'pov')
          formData.append('platform', 'ambos')
          formData.append('target_audience', 'Criadores de Conteúdo para TikTok, Shorts e Reels')
          formData.append('generated_prompt', fullGeneratedText)
          if (input.visualDetails) {
            formData.append('image_prompt_description', input.visualDetails)
          }
          input.referenceImages.slice(0, 3).forEach((file) => {
            formData.append('reference_images', file)
          })

          const rec = await pb.collection('generations').create<GenerationRecord>(formData)
          createdRecordId = rec.id
        } else {
          const rec = await pb.collection('generations').create<GenerationRecord>({
            user: input.userId,
            product_name: recordName,
            niche: input.niche,
            style: 'pov',
            platform: 'ambos',
            target_audience: 'Criadores de Conteúdo para TikTok, Shorts e Reels',
            generated_prompt: fullGeneratedText,
            image_prompt_description: input.visualDetails || '',
          })
          createdRecordId = rec.id
        }
      } catch (saveErr) {
        console.warn('Erro ao salvar geração viral no banco:', saveErr)
      }
    }

    return {
      success: true,
      theme_name: theme,
      user_idea: userIdea || undefined,
      character_name: input.characterName,
      niche: input.niche,
      niche_label: nicheLabel,
      scene_concept: sceneConcept,
      optional_script: optionalScript,
      image_count: imagesCount,
      record_id: createdRecordId,
    }
  } catch (err: any) {
    console.warn('Erro ao gerar cena viral:', err)
    return {
      success: false,
      theme_name: theme,
      user_idea: userIdea || undefined,
      character_name: input.characterName,
      niche: input.niche,
      niche_label: NICHE_LABELS[input.niche] || 'Vídeos Virais',
      scene_concept: '',
      optional_script: '',
      image_count: imagesCount,
      error: err.message || 'Erro desconhecido ao gerar cena viral.',
    }
  }
}

export async function getUserGenerations(userId: string): Promise<GenerationRecord[]> {
  try {
    return await pb.collection('generations').getFullList<GenerationRecord>({
      filter: `user = '${userId}'`,
      sort: '-created',
    })
  } catch (err) {
    console.warn('Erro ao carregar histórico de gerações:', err)
    return []
  }
}
