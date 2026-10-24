/// <reference path="../pb_data/types.d.ts" />

/**
 * Hook para adaptar prompt com base em fotos reais do produto OU
 * regenerar 3 variações com ângulos diferentes (Emocional, Urgência/Escassez, Prova Social).
 *
 * REQUISITOS OBRIGATÓRIOS:
 * - Idioma: Português Brasileiro (PT-BR)
 * - Duração máxima: 10 segundos
 * - Vídeo totalmente liso: SEM legendas, SEM texto na tela, SEM palavras gravadas no vídeo
 *   (para evitar erros ortográficos/de renderização das IAs de vídeo).
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

      // Remover textos na tela e garantir cabeçalho de 10s
      replaced = replaced.replace(/^[ \t]*[-•*]?[ \t]*Texto[^:\n\r]*:[^\n\r]*\r?\n?/gim, '')
      replaced = replaced.replace(/^[ \t]*[-•*]?[ \t]*Legenda[^:\n\r]*:[^\n\r]*\r?\n?/gim, '')

      if (visualDetails) {
        replaced += `\n\n📌 NOTAS ESPECÍFICAS PARA GRAVAÇÃO DA SUA PEÇA:`
        replaced += `\n- Foco nos detalhes visuais: ${visualDetails}`
        replaced += `\n- Close-up nos primeiros 3 segundos destacando o acabamento real mostrado nas fotos anexadas.`
      }

      if (photoNotes) {
        replaced = photoNotes + '\n\n' + replaced
      }

      // Garantir diretiva de vídeo liso e 10s
      adaptedPrompt = `[ROTEIRO VIRAL ADAPTADO TIKTOK SHOP / SHOPEE - MÁXIMO 10 SEGUNDOS]
📌 DIRETRIZES ESSENCIAIS:
- Idioma da narração: Português Brasileiro (PT-BR)
- Duração máxima: 10 segundos
- Vídeo totalmente liso: SEM legendas, SEM textos, SEM caracteres ou palavras renderizadas na tela (as IAs de vídeo erram palavras visuais).

${replaced}`
    } else {
      adaptedPrompt = `[ROTEIRO VIRAL ADAPTADO TIKTOK SHOP / SHOPEE - 10 SEGUNDOS]
📌 DIRETRIZES ESSENCIAIS:
- Idioma da narração: Português Brasileiro (PT-BR)
- Duração máxima: 10 segundos
- Vídeo totalmente liso: SEM legendas, SEM texto na tela, SEM palavras escritas no vídeo.
${photoNotes}

🎬 CENA 1 (0-3s) - O GANCHO HIPNÓTICO (HOOK):
- Enquadramento vertical 9:16: modelo ou POV segurando o(a) ${productName}.
- Vídeo totalmente limpo e liso, sem nenhuma palavra na tela.
- Narração empolgada (PT-BR): "Se você viu a foto e ficou na dúvida, olha o caimento desse(a) ${productName} na prática!"

🎬 CENA 2 (3-7s) - DETALHES REAIS DA PEÇA:
- Close nos detalhes mostrados nas fotos: ${visualDetails || 'costura impecável e acabamento resistente'}.
- Narração (PT-BR): "Material de alta qualidade que veste super bem e tem fidelidade total às fotos da vitrine."

🎬 CENA 3 (7-10s) - CHAMADA DIRETA PARA COMPRA:
- Apontando para o carrinho amarelo ou sacolinha na tela:
- Narração (PT-BR): "Garante o seu agora mesmo com desconto antes que acabe a promoção!"`
    }

    return e.json(200, {
      success: true,
      adapted_prompt: adaptedPrompt.replace(/\n{3,}/g, '\n\n').trim(),
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

    // Helper inline para montar uma variação estritamente em até 10s e sem texto na tela
    const makeVariation = (variationType) => {
      let angleTitle = ''
      let hookNarration = ''
      let bodyNarration = ''
      let ctaNarration = ''

      if (variationType === 'emocional') {
        angleTitle = '✨ ÂNGULO 1: EMOCIONAL & AUTOESTIMA'
        hookNarration = `"POV: O dia em que eu cansei de peças sem graça e experimentei esse(a) ${productName}! O caimento no corpo é surreal."`
        bodyNarration = `"Material premium que valoriza a silhueta, abraça as curvas e dá conforto o dia todo."`
        ctaNarration = `"Você merece se sentir linda todos os dias! O link com envio imediato tá no carrinho aqui embaixo."`
      } else if (variationType === 'urgencia') {
        angleTitle = '⚡ ÂNGULO 2: URGÊNCIA & ESCASSEZ MÁXIMA'
        hookNarration = `"SE VOCÊ TÁ VENDO ESSE VÍDEO, CORRE! O lote desse(a) ${productName} tá zerando com cupom hoje!"`
        bodyNarration = `"Estoque nacional com envio em 24 horas e acabamento reforçado que esgota em minutos."`
        ctaNarration = `"Clica agora no carrinho amarelo antes que a promoção encerre e volte ao preço normal!"`
      } else {
        angleTitle = '⭐ ÂNGULO 3: PROVA SOCIAL & AVALIAÇÕES REAIS'
        hookNarration = `"Eu comprei esse(a) ${productName} pra ver se as avaliações 5 estrelas eram verdade... E olhem esse acabamento!"`
        bodyNarration = `"Costura firme, tecido de alta densidade e fidelidade absoluta às fotos da vitrine."`
        ctaNarration = `"Mais de 3.000 pessoas já compraram e aprovaram. Veja as avaliações no link da sacolinha!"`
      }

      if (basePrompt && basePrompt.length > 50) {
        let replaced = basePrompt
        // Remover texto na tela e legendas
        replaced = replaced.replace(/^[ \t]*[-•*]?[ \t]*Texto[^:\n\r]*:[^\n\r]*\r?\n?/gim, '')
        replaced = replaced.replace(/^[ \t]*[-•*]?[ \t]*Legenda[^:\n\r]*:[^\n\r]*\r?\n?/gim, '')

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
          replaced += `\n\n📌 NOTAS ESPECÍFICAS DA PEÇA: ${visualDetails}`
        }

        if (photoNotes) {
          replaced = photoNotes + '\n\n' + replaced
        }

        return `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS]
${angleTitle}
📌 DIRETRIZES ESSENCIAIS:
- Idioma da narração: Português Brasileiro (PT-BR)
- Duração máxima: 10 segundos
- Vídeo totalmente liso: SEM legendas, SEM textos, SEM palavras na tela (as IAs de vídeo erram texto).

${replaced}`
          .replace(/\n{3,}/g, '\n\n')
          .trim()
      }

      return `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS]
${angleTitle}
📌 DIRETRIZES ESSENCIAIS:
- Idioma da narração: Português Brasileiro (PT-BR)
- Duração máxima: 10 segundos
- Vídeo totalmente liso: SEM legendas, SEM texto na tela, SEM palavras na gravação.
${photoNotes}

🎬 CENA 1 (0-3s) - O GANCHO PODEROSO (HOOK):
- Enquadramento vertical 9:16: modelo ou POV segurando o(a) ${productName}.
- Vídeo 100% liso sem texto.
- Narração empolgada (PT-BR): ${hookNarration}

🎬 CENA 2 (3-7s) - DETALHES REAIS DA PEÇA:
- Close-up nos acabamentos: costuras, textura e firmeza (${visualDetails || 'alta densidade e toque macio'}).
- Narração (PT-BR): ${bodyNarration}

🎬 CENA 3 (7-10s) - CHAMADA DIRETA PARA COMPRA (CTA):
- Apontando diretamente para o carrinho amarelo no canto inferior:
- Narração (PT-BR): ${ctaNarration}`
        .replace(/\n{3,}/g, '\n\n')
        .trim()
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
