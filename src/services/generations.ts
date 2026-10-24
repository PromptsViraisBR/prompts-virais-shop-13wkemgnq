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
}

export interface AdaptPromptInput {
  originalPrompt?: string
  promptTitle?: string
  productName?: string
  visualDetails?: string
  style?: StyleType
  platform?: PlatformType
  referenceImages?: File[]
  imagesCount?: number
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
  visualDetails?: string
  niche?: string
  imagesCount?: number
}

export interface RegenerateVariationsResult {
  success: boolean
  product_name: string
  variations: PromptVariation[]
}

export interface AdaptPromptResult {
  success: boolean
  adapted_prompt: string
  product_name?: string
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
          visual_details: input.visualDetails,
          niche: input.niche || 'moda_feminina',
          images_count: imagesCount,
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
  const imagesCount = input.referenceImages?.length || input.imagesCount || 1

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
        visual_details: input.visualDetails,
        style: input.style || 'pov',
        platform: input.platform || 'ambos',
        images_count: imagesCount,
      }),
    })

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      throw new Error(errData.error || `Erro ${response.status} ao adaptar prompt com fotos.`)
    }

    return (await response.json()) as AdaptPromptResult
  } catch (err: any) {
    console.warn('Erro na rota de adaptação, usando fallback local inteligente:', err)
    const prod = input.productName || input.promptTitle || 'Peça em destaque'
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
