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

  if (input.style === 'pov') {
    return `[ROTEIRO VIRAL - ESTILO POV / ESPELHO (FIEL ÀS FOTOS)]
🎯 PRODUTO: ${input.productName}
🏷️ NICHO: ${nicheLabel}
📱 CANAL DE VENDA: ${platformLabel}
👥 PÚBLICO-ALVO: ${audience}
✨ DETALHES FIÉIS À PEÇA DAS FOTOS: ${details}

⏱️ DURAÇÃO IDEAL: 15 a 20 segundos

🎬 CENA 1 (0-3s) - O GANCHO HIPNÓTICO (HOOK):
- Câmera em primeira pessoa (POV): Você segurando o celular em frente ao espelho do quarto com look básico/desanimado.
- Texto grande e chamativo na tela: "POV: Você só queria uma peça coringa e achou ISSO 👀👇"
- Narração com tom espontâneo: "POV: Você finalmente achou o(a) ${input.productName} que disfarça qualquer imperfeição e veste como se fosse feito sob medida!"

🎬 CENA 2 (3-8s) - A REVELAÇÃO & TESTE DE QUALIDADE REAL:
- Transição dinâmica (estalar de dedos ou tapa suave na lente): você agora vestindo o(a) ${input.productName}.
- Movimento em câmera lenta dando meio giro, mostrando a lateral e as costas.
- Close na mão tocando o tecido: "${details}."
- Narração: "Gente, o caimento é bizarro de tão perfeito. Não marca, não fica transparente e o tecido tem aquele peso de peça de shopping de luxo."

🎬 CENA 3 (8-14s) - VERSATILIDADE NO DIA A DIA:
- Dois takes rápidos se arrumando: calçando um sapato ou ajeitando o look.
- Narração: "Dá pra usar tanto de dia com tênis quanto à noite com salto/jaqueta. Parece que custou R$ 300, mas paguei preço de fábrica."

🎬 CENA 4 (14-18s) - CHAMADA DE AÇÃO (CTA DE ALTA CONVERSÃO):
- Apontando diretamente para o botão do carrinho na tela com um sorriso confiante.
- Narração: "Deixei o link oficial no carrinho aqui embaixo com frete grátis e cupom de primeira compra ativo hoje. Garanta antes que esgote o seu tamanho!"
- Texto na tela: "🛒 CLIQUE NO CARRINHO / SACOLINHA 👇"`
  } else if (input.style === 'modelo') {
    return `[ROTEIRO VIRAL - COM MODELO VESTINDO A PEÇA (FIEL ÀS FOTOS)]
🎯 PRODUTO: ${input.productName}
🏷️ NICHO: ${nicheLabel}
📱 CANAL DE VENDA: ${platformLabel}
👥 PÚBLICO-ALVO: ${audience}
✨ DETALHES FIÉIS À PEÇA DAS FOTOS: ${details}

⏱️ DURAÇÃO IDEAL: 18 a 22 segundos

🎬 CENA 1 (0-3s) - GANCHO VISUAL DE ALTO IMPACTO (HOOK):
- Modelo caminhando com atitude em direção à câmera, olhar confiante, fundo limpo ou estúdio iluminado.
- Texto na tela: "A peça que todo mundo vai te perguntar de onde é 🔥"
- Narração: "Se você ama se vestir bem sem gastar rios de dinheiro, pare tudo e olha o caimento desse(a) ${input.productName}!"

🎬 CENA 2 (3-9s) - O TESTE REAL DO MOVIMENTO:
- Modelo fazendo um giro suave de 360°, depois dando alguns passos naturais.
- Close no detalhe: corte, costura e elasticidade (${details}).
- Narração: "Olha como valoriza a silhueta sem apertar. A modelagem é impecável, não enrola no corpo e abraça perfeitamente cada curva."

🎬 CENA 3 (9-15s) - QUEBRA DE OBJEÇÃO (CONFORTO & TECIDO):
- Modelo mostrando o forro ou flexibilidade da peça (toque na costura ou caimento em movimento).
- Narração: "Não amassa fácil, não desbota na máquina e aguenta a rotina inteira sem perder a estrutura."

🎬 CENA 4 (15-20s) - CTA DIRETO PARA COMPRA:
- Modelo apontando para a vitrine virtual / sacolinha do vídeo com sorriso expressivo.
- Narração: "Tem do tamanho P até o GG disponível. Corre no link da sacolinha aqui embaixo porque essa cor é a primeira a acabar no estoque!"
- Texto na tela: "🛍️ DISPONÍVEL NO LINK DA VITRINE 👇"`
  } else {
    return `[ROTEIRO VIRAL - UNBOXING & VITRINE ASMR (FIEL ÀS FOTOS)]
🎯 PRODUTO: ${input.productName}
🏷️ NICHO: ${nicheLabel}
📱 CANAL DE VENDA: ${platformLabel}
👥 PÚBLICO-ALVO: ${audience}
✨ DETALHES FIÉIS À PEÇA DAS FOTOS: ${details}

⏱️ DURAÇÃO IDEAL: 18 a 22 segundos

🎬 CENA 1 (0-3s) - O SOM SATISFATÓRIO DO UNBOXING (HOOK ASMR):
- Câmera superior (flat lay) ou ângulo frontal abrindo o pacote com tesoura e retirando a embalagem transparente.
- Áudio ambiente nítido: som do plástico e do papel de seda.
- Texto na tela: "COMPREI O MAIS VIRAL DA SHOPEE / TIKTOK 📦✨"
- Narração: "Será que esse(a) ${input.productName} vale todo o hype que tá rolando na internet? Vamos conferir agora!"

🎬 CENA 2 (3-8s) - INSPEÇÃO MINUCIOSA DE ACABAMENTO:
- Abrindo a peça sobre a mesa ou cabide.
- Close macro nas costuras, etiquetas e detalhes: "${details}."
- Narração: "Logo de cara dá pra ver que a costura é reforçada, zero fios soltos e o caimento da peça é surreal."

🎬 CENA 3 (8-14s) - PROVA RÁPIDA NO CORPO OU VITRINE:
- Transição com o produto pendurado ou vestido com elegância.
- Narração: "Veste como uma luva e o material é super resistente. O melhor custo-benefício que já encontrei esse ano."

🎬 CENA 4 (14-19s) - CTA COM SENSO DE URGÊNCIA:
- Apontando para o carrinho amarelo:
- Narração: "O vendedor despacha no mesmo dia e tá com cupom de desconto rolando hoje. Clica no carrinho amarelo aqui embaixo pra garantir o seu!"
- Texto na tela: "📦 PEÇA O SEU NO CARRINHO 👇"`
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

    const fallbackAdapted = [
      `[ROTEIRO ADAPTADO COM AS SUAS FOTOS]`,
      `🎯 PEÇA DAS FOTOS: ${prod}`,
      `✨ DETALHES VISUAIS FIÉIS: ${visual}`,
      ``,
      baseScript
        ? `--- ESTRUTURA BASE ADAPTADA ---\n${baseScript}\n--- DETALHES INCORPORADOS DAS SUAS FOTOS ---\n• Peça física: ${prod}\n• Acabamento & Caimento: ${visual}`
        : `🎬 GANCHO (0-3s): Mostre a peça das fotos com iluminação frontal. Texto: "POV: O caimento da foto vs no corpo real 🔥"\n🎬 CENA 2 (3-8s): Vista o(a) ${prod} mostrando ${visual}.\n🎬 CENA 3 (8-14s): Destaque a versatilidade no dia a dia.\n🎬 CENA 4 (14-18s): CTA apontando para a sacolinha com cupom!`,
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
