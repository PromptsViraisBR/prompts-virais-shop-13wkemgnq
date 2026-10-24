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
  generatedImageUrl?: string
  generatedVideoUrl?: string
  referenceImages?: File[]
  referenceImageUrls?: string[]
  imagePromptDescription?: string
}

export interface GenerateImageInput {
  productName: string
  niche?: NicheType
  style?: StyleType
  details?: string
  imageDescription?: string
  prompt?: string
  generationId?: string
  referenceImageUrls?: string[]
}

export interface GenerateImageResult {
  success: boolean
  image_url: string
  prompt: string
  model: string
  product_name: string
  image_description?: string
}

export interface GenerateVideoInput {
  productName: string
  niche?: NicheType
  style?: StyleType
  details?: string
  script?: string
  prompt?: string
  generationId?: string
  referenceImageUrls?: string[]
}

export interface GenerateVideoResult {
  success: boolean
  video_url?: string
  duration?: string
  model?: string
  prompt?: string
  product_name?: string
  fallback?: boolean
  message?: string
  recommended_action?: string
  error?: string
  code?: string
}

export function buildPromptScript(input: Omit<GeneratePromptInput, 'userId'>): string {
  const nicheLabel = NICHE_LABELS[input.niche]
  const styleLabel = STYLE_LABELS[input.style]
  const platformLabel = PLATFORM_LABELS[input.platform || 'ambos']
  const audience =
    input.targetAudience?.trim() ||
    'Compradores que buscam custo-benefício e estilo no TikTok Shop/Shopee'
  const imageCount = input.referenceImages?.length || input.referenceImageUrls?.length || 0
  const imageVisualNote =
    imageCount > 0
      ? `Baseado nas ${imageCount} foto(s) reais da peça enviada(s) (cor, modelo, caimento e detalhes visuais da galeria)`
      : ''
  const details =
    input.details?.trim() ||
    (imageVisualNote
      ? `Visual fiel às fotos de referência da galeria: acabamento real, cores e modelagem idênticas à peça física`
      : 'Tecido encorpado, acabamento reforçado, caimento perfeito')

  if (input.style === 'pov') {
    return `[ROTEIRO VIRAL GERADO - ESTILO POV / ESPELHO]
🎯 PRODUTO: ${input.productName}
🏷️ NICHO: ${nicheLabel}
📱 CANAL DE VENDA: ${platformLabel}
👥 PÚBLICO-ALVO: ${audience}
✨ DETALHES DESTACADOS: ${details}

⏱️ DURAÇÃO IDEAL: 15 a 20 segundos

🎬 CENA 1 (0-3s) - O GANCHO HIPNÓTICO (HOOK):
- Câmera em primeira pessoa (POV): Você segurando o celular em frente ao espelho do quarto com look básico/desanimado.
- Texto grande e chamativo na tela: "POV: Você só queria uma peça coringa e achou ISSO 👀👇"
- Narração com tom espontâneo: "POV: Você finalmente achou o(a) ${input.productName} que disfarça qualquer imperfeição e veste como se fosse feito sob medida!"

🎬 CENA 2 (3-8s) - A REVELAÇÃO & TESTE DE QUALIDADE:
- Transição dinâmica (estalar de dedos ou tapa suave na lente): você agora vestindo o(a) ${input.productName}.
- Movimento em câmera lenta dando meio giro, mostrando a lateral e as costas.
- Close na mão tocando o tecido: "${details}."
- Narração: "Gente, o caimento é bizarro de tão perfeito. Não marca, não fica transparente e o tecido tem aquele peso de peça de shopping de luxo."

🎬 CENA 3 (8-14s) - VERSATILIDADE NO DIA A DIA:
- Dois takes rápidos se arrumando: borrifando perfume, ajeitando um acessório ou calçado.
- Narração: "Dá pra usar tanto de dia com tênis quanto à noite com salto/jaqueta. Parece que custou R$ 300, mas paguei preço de fábrica."

🎬 CENA 4 (14-18s) - CHAMADA DE AÇÃO (CTA DE ALTA CONVERSÃO):
- Apontando diretamente para o botão do carrinho na tela com um sorriso confiante.
- Narração: "Deixei o link oficial no carrinho aqui embaixo com frete grátis e cupom de primeira compra ativo hoje. Garanta antes que esgote o seu tamanho!"
- Texto na tela: "🛒 CLIQUE NO CARRINHO / SACOLINHA 👇"`
  } else if (input.style === 'modelo') {
    return `[ROTEIRO VIRAL GERADO - COM MODELO VESTINDO A PEÇA]
🎯 PRODUTO: ${input.productName}
🏷️ NICHO: ${nicheLabel}
📱 CANAL DE VENDA: ${platformLabel}
👥 PÚBLICO-ALVO: ${audience}
✨ DETALHES DESTACADOS: ${details}

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
- Modelo mostrando o forro ou flexibilidade da peça (agachamento leve ou toque na costura).
- Narração: "Não amassa fácil, não desbota na máquina e aguenta a rotina inteira sem perder a estrutura."

🎬 CENA 4 (15-20s) - CTA DIRETO PARA COMPRA:
- Modelo apontando para a vitrine virtual / sacolinha do vídeo com sorriso expressivo.
- Narração: "Tem do tamanho P até o GG disponível. Corre no link da sacolinha aqui embaixo porque essa cor é a primeira a acabar no estoque!"
- Texto na tela: "🛍️ DISPONÍVEL NO LINK DA VITRINE 👇"`
  } else {
    return `[ROTEIRO VIRAL GERADO - UNBOXING & VITRINE ASMR]
🎯 PRODUTO: ${input.productName}
🏷️ NICHO: ${nicheLabel}
📱 CANAL DE VENDA: ${platformLabel}
👥 PÚBLICO-ALVO: ${audience}
✨ DETALHES DESTACADOS: ${details}

⏱️ DURAÇÃO IDEAL: 18 a 22 segundos

🎬 CENA 1 (0-3s) - O SOM SATISFATÓRIO DO UNBOXING (HOOK ASMR):
- Câmera superior (flat lay) ou ângulo frontal abrindo o pacote com tesoura e retirando a embalagem transparente.
- Áudio ambiente nítido: som do plástico e do papel de seda.
- Texto na tela: "COMPREI O MAIS VIRAL DA SHOPEE / TIKTOK 📦✨"
- Narração: "Será que esse(a) ${input.productName} vale todo o hype que tá rolando na internet? Vamos conferir agora!"

🎬 CENA 2 (3-8s) - INSPEÇÃO MINUCIOSA DE ACABAMENTO:
- Abrindo a peça sobre a mesa ou cabide de veludo.
- Close macro nas costuras, etiquetas e detalhes: "${details}."
- Narração: "Logo de cara dá pra ver que a costura é reforçada, zero fios soltos e o cheirinho de roupa nova é uma delícia."

🎬 CENA 3 (8-14s) - PROVA RÁPIDA NO CORPO OU VITRINE:
- Transição com o produto pendurado em manequim ou vestido de forma elegante.
- Narração: "Veste como uma luva e o material é super resistente. O melhor custo-benefício que já encontrei esse ano."

🎬 CENA 4 (14-19s) - CTA COM SENSO DE URGÊNCIA:
- Apontando para o carrinho amarelo:
- Narração: "O vendedor despacha no mesmo dia e tá com cupom de desconto rolando hoje. Clica no carrinho amarelo aqui embaixo pra garantir o seu!"
- Texto na tela: "📦 PEÇA O SEU NO CARRINHO 👇"`
  }
}

export async function saveGeneratedPrompt(input: GeneratePromptInput): Promise<GenerationRecord> {
  const generatedText = buildPromptScript(input)

  // Suporte a FormData quando arquivos de imagem forem enviados
  if (input.referenceImages && input.referenceImages.length > 0) {
    const formData = new FormData()
    formData.append('user', input.userId)
    formData.append('product_name', input.productName)
    formData.append('niche', input.niche)
    formData.append('style', input.style)
    formData.append('platform', input.platform || 'ambos')
    formData.append('target_audience', input.targetAudience || '')
    formData.append('generated_prompt', generatedText)
    formData.append('generated_image_url', input.generatedImageUrl || '')
    formData.append('generated_video_url', input.generatedVideoUrl || '')
    if (input.imagePromptDescription) {
      formData.append('image_prompt_description', input.imagePromptDescription)
    }
    if (input.referenceImageUrls && input.referenceImageUrls.length > 0) {
      formData.append('reference_image_urls', JSON.stringify(input.referenceImageUrls))
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
    generated_image_url: input.generatedImageUrl || '',
    generated_video_url: input.generatedVideoUrl || '',
    image_prompt_description: input.imagePromptDescription || '',
    reference_image_urls: input.referenceImageUrls || [],
  })
}

export async function generateProductImage(
  input: GenerateImageInput,
): Promise<GenerateImageResult> {
  const response = await fetch(`${import.meta.env.VITE_POCKETBASE_URL}/backend/v1/generate-image`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(pb.authStore.token ? { Authorization: pb.authStore.token } : {}),
    },
    body: JSON.stringify({
      product_name: input.productName,
      niche: input.niche,
      style: input.style,
      details: input.details,
      image_description: input.imageDescription,
      prompt: input.prompt,
      generation_id: input.generationId,
      reference_image_urls: input.referenceImageUrls || [],
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `Erro ${response.status} ao gerar imagem.`)
  }

  return (await response.json()) as GenerateImageResult
}

export async function updateGenerationImage(
  generationId: string,
  imageUrl: string,
): Promise<GenerationRecord> {
  return await pb.collection('generations').update<GenerationRecord>(generationId, {
    generated_image_url: imageUrl,
  })
}

export async function generateProductVideo(
  input: GenerateVideoInput,
): Promise<GenerateVideoResult> {
  const response = await fetch(`${import.meta.env.VITE_POCKETBASE_URL}/backend/v1/generate-video`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(pb.authStore.token ? { Authorization: pb.authStore.token } : {}),
    },
    body: JSON.stringify({
      product_name: input.productName,
      niche: input.niche,
      style: input.style,
      details: input.details,
      script: input.script,
      prompt: input.prompt,
      generation_id: input.generationId,
      reference_image_urls: input.referenceImageUrls || [],
    }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const errorMsg = data.error || `Erro ${response.status} ao gerar vídeo.`
    const err = new Error(errorMsg) as Error & { code?: string }
    if (data.code) err.code = data.code
    throw err
  }

  return data as GenerateVideoResult
}

export async function updateGenerationVideo(
  generationId: string,
  videoUrl: string,
): Promise<GenerationRecord> {
  return await pb.collection('generations').update<GenerationRecord>(generationId, {
    generated_video_url: videoUrl,
  })
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
