/// <reference path="../pb_data/types.d.ts" />

/**
 * Hook para adaptar prompt com base em fotos reais do produto OU
 * regenerar 3 variações com ângulos diferentes (Emocional, Urgência/Escassez, Prova Social).
 *
 * Rotas:
 * - POST /backend/v1/adapt-prompt
 * - POST /backend/v1/regenerate-variations
 */

routerAdd('POST', '/backend/v1/adapt-prompt', (e) => {
  try {
    const data = e.requestInfo().body || {}
    const basePrompt = (data.original_prompt || data.base_prompt || '').trim()
    const promptTitle = (data.prompt_title || '').trim()
    const productName = (data.product_name || promptTitle || 'peça anunciada').trim()
    const visualDetails = (data.visual_details || '').trim()
    const imageCount = parseInt(data.images_count || data.image_count || '0', 10)

    let photoNotes = ''
    if (imageCount > 0) {
      photoNotes = `\n📸 ADAPTAÇÃO BASEADA NAS ${imageCount} FOTO(S) ANEXADAS DA SUA PEÇA:`
      if (visualDetails) {
        photoNotes += `\n- Detalhes visuais observados: ${visualDetails}`
      } else {
        photoNotes += `\n- Destaque específico para texturas, costuras e detalhes reais captados nas fotos enviadas.`
      }
    }

    let adaptedPrompt = ''
    if (basePrompt && basePrompt.length > 50) {
      let replaced = basePrompt
      if (productName && productName !== 'peça anunciada') {
        replaced = replaced.replace(/Vestido Midi Canelado/gi, productName)
        replaced = replaced.replace(/Camiseta Streetwear/gi, productName)
        replaced = replaced.replace(/Conjunto Fitness/gi, productName)
        replaced = replaced.replace(/Biquíni Cortininha/gi, productName)
        replaced = replaced.replace(/Calça Alfaiataria/gi, productName)
        replaced = replaced.replace(/Camisa Linho/gi, productName)
        replaced = replaced.replace(/Tênis Chunky/gi, productName)
        replaced = replaced.replace(/Bolsa Baguete/gi, productName)
      }

      if (visualDetails) {
        replaced += `\n\n📌 NOTAS ESPECÍFICAS PARA GRAVAÇÃO DA SUA PEÇA:`
        replaced += `\n- Foco nos detalhes visuais: ${visualDetails}`
        replaced += `\n- Close-up nos primeiros 4 segundos destacando o acabamento real mostrado nas fotos anexadas.`
      }

      if (photoNotes) {
        replaced = photoNotes + '\n\n' + replaced
      }
      adaptedPrompt = replaced
    } else {
      adaptedPrompt = `[ROTEIRO VIRAL ADAPTADO TIKTOK SHOP / SHOPEE - 20 SEGUNDOS]
${photoNotes}

🎬 CENA 1 (0-3s) - O GANCHO (HOOK):
- Enquadramento vertical 9:16: modelo ou POV segurando o ${productName}.
- Texto na tela: "POV: O caimento da foto vs no corpo real 🔥"
- Narração empolgada: "Se você viu a foto e ficou na dúvida, olha o caimento desse ${productName} na prática!"

🎬 CENA 2 (3-9s) - DETALHES REAIS DA PEÇA:
- Close nos detalhes mostrados nas fotos: ${visualDetails || 'costura impecável e acabamento resistente'}.
- Narração: "Material de alta qualidade que veste super bem e tem fidelidade total às fotos da vitrine."

🎬 CENA 3 (9-15s) - CHAMADA DIRETA PARA COMPRA:
- Apontando para o carrinho ou sacolinha:
- Narração: "Garante o seu agora mesmo com desconto antes que acabe a promoção!"
- Texto na tela: "🛒 COMPRE NO CARRINHO ABAIXO 👇"`
    }

    return e.json(200, {
      success: true,
      adapted_prompt: adaptedPrompt,
      product_name: productName,
      visual_details: visualDetails,
      image_count: imageCount,
    })
  } catch (err) {
    return e.json(500, {
      success: false,
      message: 'Erro ao adaptar roteiro: ' + (err.message || String(err)),
    })
  }
})

routerAdd('POST', '/backend/v1/regenerate-variations', (e) => {
  try {
    const data = e.requestInfo().body || {}
    const basePrompt = (data.original_prompt || data.base_prompt || '').trim()
    const promptTitle = (data.prompt_title || '').trim()
    const productName = (data.product_name || promptTitle || 'peça anunciada').trim()
    const visualDetails = (data.visual_details || '').trim()
    const imageCount = parseInt(data.images_count || data.image_count || '0', 10)

    let photoNotes = ''
    if (imageCount > 0) {
      photoNotes = `\n📸 ADAPTAÇÃO BASEADA NAS ${imageCount} FOTO(S) ANEXADAS DA SUA PEÇA:`
      if (visualDetails) {
        photoNotes += `\n- Detalhes visuais observados: ${visualDetails}`
      } else {
        photoNotes += `\n- Destaque específico para texturas, costuras e detalhes reais captados nas fotos enviadas.`
      }
    }

    // Helper inline para montar uma variação
    const makeVariation = (variationType) => {
      let hookLine = ''
      let hookNarration = ''
      let ctaNarration = ''

      if (variationType === 'emocional') {
        hookLine = `POV: O momento exato em que você veste o ${productName} e sente sua autoestima ir a 1000%! 💖`
        hookNarration = `"POV: O dia em que eu cansei de peças sem graça e experimentei esse ${productName}! O caimento no corpo é simplesmente surreal."`
        ctaNarration = `"Você merece se sentir maravilhosa todos os dias! O link com envio imediato tá no carrinho amarelo aqui embaixo 👇"`
      } else if (variationType === 'urgencia') {
        hookLine = `ÚLTIMAS UNIDADES: O ${productName} mais viral do TikTok entrou em queima de estoque! ⚡🔥`
        hookNarration = `"SE VOCÊ TÁ VENDO ESSE VÍDEO, CORRE! O lote desse ${productName} tá zerando com cupom de desconto hoje!"`
        ctaNarration = `"Clica agora no carrinho amarelo ou na sacolinha antes que a promoção encerre e volte ao preço normal! 🛒"`
      } else {
        hookLine = `O produto nota 5 estrelas com mais de 3.000 avaliações positivas na Shopee: ${productName}! ⭐⭐⭐⭐⭐`
        hookNarration = `"Eu comprei esse ${productName} pra ver se todas aquelas avaliações 5 estrelas eram verdade... E olhem esse acabamento!"`
        ctaNarration = `"Mais de 3.000 pessoas já compraram e aprovaram. Veja as avaliações no link da sacolinha aqui embaixo!"`
      }

      if (basePrompt && basePrompt.length > 50) {
        let replaced = basePrompt

        if (variationType === 'emocional') {
          replaced = `[VARIAÇÃO 1 - ÂNGULO EMOCIONAL & DESEJO ✨]\n` + replaced
        } else if (variationType === 'urgencia') {
          replaced = `[VARIAÇÃO 2 - ÂNGULO URGÊNCIA & ESCASSEZ ⚡]\n` + replaced
        } else {
          replaced = `[VARIAÇÃO 3 - ÂNGULO PROVA SOCIAL & CONFIANÇA ⭐]\n` + replaced
        }

        if (productName && productName !== 'peça anunciada') {
          replaced = replaced.replace(/Vestido Midi Canelado/gi, productName)
          replaced = replaced.replace(/Camiseta Streetwear/gi, productName)
          replaced = replaced.replace(/Conjunto Fitness/gi, productName)
          replaced = replaced.replace(/Biquíni Cortininha/gi, productName)
          replaced = replaced.replace(/Calça Alfaiataria/gi, productName)
          replaced = replaced.replace(/Camisa Linho/gi, productName)
          replaced = replaced.replace(/Tênis Chunky/gi, productName)
          replaced = replaced.replace(/Bolsa Baguete/gi, productName)
        }

        if (visualDetails) {
          replaced += `\n\n📌 NOTAS ESPECÍFICAS PARA GRAVAÇÃO DA SUA PEÇA:`
          replaced += `\n- Foco nos detalhes visuais: ${visualDetails}`
          replaced += `\n- Close-up nos primeiros 4 segundos destacando o acabamento real mostrado nas fotos anexadas.`
        }

        if (photoNotes) {
          replaced = photoNotes + '\n\n' + replaced
        }

        return replaced
      }

      return `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 22 SEGUNDOS]
${variationType === 'emocional' ? '✨ ÂNGULO: EMOCIONAL & AUTOESTIMA' : variationType === 'urgencia' ? '⚡ ÂNGULO: URGÊNCIA & ESCASSEZ MÁXIMA' : '⭐ ÂNGULO: PROVA SOCIAL & AVALIAÇÕES REAIS'}
${photoNotes}

🎬 CENA 1 (0-3s) - O GANCHO PODEROSO (HOOK):
- Enquadramento vertical 9:16: modelo ou POV segurando o ${productName}.
- Texto grande e chamativo na tela: "${hookLine}"
- Narração empolgada: ${hookNarration}

🎬 CENA 2 (3-9s) - O TESTE VISUAL E DETALHES REAIS DA PEÇA:
- Close-up nos acabamentos: costuras, textura do material e firmeza da peça.
${visualDetails ? `- Destaque especial para: ${visualDetails}` : '- Toque suave com os dedos mostrando a alta qualidade e caimento sem dobras.'}
- Narração: "Presta atenção na qualidade desse acabamento! Não tem nada a ver com aquelas peças frágeis da concorrência."

🎬 CENA 3 (9-16s) - RESOLUÇÃO DE DÚVIDAS & PROVA REAL:
- Demonstração do produto em uso contínuo (vestido no corpo ou demonstrado em ação rápida).
- Narração: "Veste perfeitamente no corpo, não aperta e tem exatamente as cores e medidas reais mostradas no vídeo."

🎬 CENA 4 (16-22s) - CHAMADA PARA AÇÃO (CTA DIRETO AO CARRINHO):
- Apontando diretamente para o carrinho amarelo no canto inferior esquerdo:
- Narração: ${ctaNarration}
- Texto na tela: "🛒 COMPRE AGORA NO CARRINHO ABAIXO 👇"`
    }

    const variation1 = makeVariation('emocional')
    const variation2 = makeVariation('urgencia')
    const variation3 = makeVariation('prova_social')

    return e.json(200, {
      success: true,
      product_name: productName,
      variations: [
        {
          id: 'v1_emocional',
          angle: 'Emocional & Autoestima',
          badge: '💖 Ângulo Emocional',
          description: 'Focado em sensação, transformação pessoal, elogios e desejo imediato.',
          prompt_text: variation1,
        },
        {
          id: 'v2_urgencia',
          angle: 'Urgência & Escassez',
          badge: '⚡ Ângulo Urgência',
          description:
            'Focado em promoção relâmpago, estoque acabando e chamada direta pro carrinho.',
          prompt_text: variation2,
        },
        {
          id: 'v3_prova_social',
          angle: 'Prova Social & Quebra de Objeções',
          badge: '⭐ Ângulo Prova Social',
          description:
            'Focado em avaliações 5 estrelas, durabilidade, caimento real e comparativo.',
          prompt_text: variation3,
        },
      ],
    })
  } catch (err) {
    return e.json(500, {
      success: false,
      message: 'Erro ao gerar variações do roteiro: ' + (err.message || String(err)),
    })
  }
})
