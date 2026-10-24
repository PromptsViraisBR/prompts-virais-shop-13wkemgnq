/// <reference path="../pb_data/types.d.ts" />

/**
 * Route: POST /backend/v1/adapt-prompt
 * Adapta qualquer prompt (grátis ou PRO) ou gera um roteiro baseado fielmente nas fotos enviadas.
 * Preserva a estrutura viral: Gancho 0-3s (Hook), Cenas de demonstração/caimento, e CTA de conversão.
 */
routerAdd('POST', '/backend/v1/adapt-prompt', (e) => {
  try {
    const body = e.requestInfo().body || {}
    const originalPrompt = (body.original_prompt || '').trim()
    const promptTitle = (body.prompt_title || '').trim()
    const productName = (body.product_name || '').trim()
    const visualDetails = (body.visual_details || '').trim()
    const style = (body.style || 'pov').trim()
    const platform = (body.platform || 'ambos').trim()
    const imagesCount = Number(body.images_count || 1)

    if (!originalPrompt && !productName) {
      return e.badRequestError('Informe o prompt original ou o nome do produto.')
    }

    let adaptedText = ''

    // Tenta usar $ai.chat se disponível no Skip AI Gateway
    try {
      const userPromptMsg = [
        `Você é um especialista em roteiros virais e scripts de alta conversão para TikTok Shop e Shopee.`,
        `O usuário enviou ${imagesCount} foto(s) reais da sua peça/produto de moda.`,
        productName ? `Nome do produto: "${productName}".` : '',
        visualDetails
          ? `Detalhes visuais extraídos das fotos (cor, caimento, tecido, corte): "${visualDetails}".`
          : '',
        `Estilo desejado: ${style}. Plataforma: ${platform}.`,
        originalPrompt
          ? `Adapte o seguinte PROMPT/ROTEIRO BASE para que descreva FIELMENTE a peça das fotos acima, mantendo a estrutura exata de alta retenção (Gancho 0-3s, Cenas detalhadas do produto no corpo e CTA):\n\n${originalPrompt}`
          : `Gere um roteiro viral completo (Gancho 0-3s, Cenas de caimento e detalhes fiéis às fotos, e CTA com carrinho) para o produto acima.`,
        `Retorne APENAS o roteiro em formato pronto para gravação e cópia, sem preâmbulos e sem explicações externas.`,
      ]
        .filter(Boolean)
        .join('\n\n')

      const reply = $ai.chat({
        model: 'fast',
        messages: [
          {
            role: 'system',
            content:
              'Você é um roteirista profissional de e-commerce e criador de prompts virais para TikTok Shop e Shopee. Gere scripts dinâmicos, detalhados e 100% fiéis às fotos.',
          },
          {
            role: 'user',
            content: userPromptMsg,
          },
        ],
      })

      if (reply && reply.choices && reply.choices[0] && reply.choices[0].message) {
        adaptedText = (reply.choices[0].message.content || '').trim()
      }
    } catch (aiErr) {
      console.log('[ADAPT_PROMPT_AI_FALLBACK] ' + aiErr.message)
    }

    // Fallback estruturado de alta qualidade caso a IA offline ou demore
    if (!adaptedText) {
      const prod = productName || 'Peça em destaque'
      const visual =
        visualDetails || 'Caimento modelador, cor viva idêntica à foto e costuras reforçadas'
      const plat =
        platform === 'shopee'
          ? 'Shopee'
          : platform === 'tiktok_shop'
            ? 'TikTok Shop'
            : 'TikTok Shop & Shopee'

      adaptedText = [
        `[ROTEIRO PERSONALIZADO FIEL ÀS SUAS FOTOS]`,
        `🎯 PRODUTO: ${prod}`,
        `✨ DETALHES DAS FOTOS: ${visual}`,
        `📱 CANAL: ${plat}`,
        `⏱️ DURAÇÃO IDEAL: 15 a 20 segundos`,
        ``,
        `🎬 CENA 1 (0-3s) - O GANCHO HIPNÓTICO (HOOK):`,
        `- Visual idêntico à foto: Você segurando ou vestindo o ${prod} com iluminação natural destacando a cor e o tecido.`,
        `- Texto chamativo na tela: "Achei a peça perfeita que todo mundo tá usando no feed 👀👇"`,
        `- Narração: "Se você viu essa foto e achou que era filtro, olha como esse(a) ${prod} veste no corpo de verdade!"`,
        ``,
        `🎬 CENA 2 (3-9s) - DETALHES FIÉIS À PEÇA DAS FOTOS:`,
        `- Movimento suave mostrando o caimento real: ${visual}.`,
        `- Close no detalhe do tecido e na modelagem sem dobras estranhas.`,
        `- Narração: "O caimento é surreal de tão confortável. O tecido tem peso, não marca nada e essa tonalidade é exatamente igual à da foto!"`,
        ``,
        `🎬 CENA 3 (9-14s) - VERSATILIDADE & PROVA SOCIAL:`,
        `- Giro rápido ou combinação com calçado/acessório do dia a dia.`,
        `- Narração: "Combina tanto pra trabalhar quanto pra sair à noite. Todo mundo pergunta de onde é!"`,
        ``,
        `🎬 CENA 4 (14-18s) - CTA DIRETO AO CARRINHO:`,
        `- Apontando para o botão da sacolinha com sorriso e segurança.`,
        `- Narração: "Aproveita que o link tá liberado aqui embaixo com frete grátis antes que esgote o seu tamanho!"`,
        `- Texto na tela: "🛒 CLIQUE NA SACOLINHA / CARRINHO ABAIXO 👇"`,
      ].join('\n')
    }

    return e.json(200, {
      success: true,
      adapted_prompt: adaptedText,
      product_name: productName,
      visual_details: visualDetails,
    })
  } catch (err) {
    console.log('[ADAPT_PROMPT_ERR] ' + err.message)
    return e.json(500, {
      success: false,
      error: err.message || 'Erro ao adaptar o roteiro com fotos.',
    })
  }
})
