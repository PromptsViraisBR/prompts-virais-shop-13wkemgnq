/// <reference path="../pb_data/types.d.ts" />

/**
 * Hook para adaptar prompt com base em fotos reais OU
 * gerar roteiro viral completo a partir de fotos criadas (Ideia de cena + Roteiro Opcional em ~60s/cenas de 10s) OU
 * regenerar variações com ângulos diferentes.
 *
 * REQUISITOS OBRIGATÓRIOS:
 * - Idioma: Português Brasileiro (PT-BR)
 * - E-commerce: Duração máxima de 10 segundos
 * - Vídeos Virais (/virais): Roteiro de ~60 segundos organizado em até 6 cenas de 10 segundos cada
 * - Vídeo totalmente limpo: SEM legendas gravadas na tela, SEM texto na tela, SEM palavras no vídeo
 *
 * Rotas:
 * - POST /backend/v1/adapt-prompt
 * - POST /backend/v1/generate-viral-scene
 * - POST /backend/v1/regenerate-variations
 */

routerAdd('POST', '/backend/v1/adapt-prompt', (e) => {
  try {
    const data = e.requestInfo().body || {}
    const basePrompt = (data.original_prompt || data.base_prompt || '').trim()
    const promptTitle = (data.prompt_title || '').trim()
    const productName = (data.product_name || promptTitle || 'elemento da cena').trim()
    const visualDetails = (data.visual_details || '').trim()
    const imageCount = parseInt(data.images_count || data.image_count || '0', 10)
    const category = (data.category || '').trim()

    let photoNotes = ''
    if (imageCount > 0) {
      photoNotes = `\n📸 ADAPTAÇÃO BASEADA NAS ${imageCount} FOTO(S) ANEXADAS:`
      if (visualDetails) {
        photoNotes += `\n- Detalhes visuais observados: ${visualDetails}`
      } else {
        photoNotes += `\n- Destaque específico para texturas, formas, iluminação e detalhes reais captados nas fotos enviadas.`
      }
    }

    let adaptedPrompt = ''
    const isViral =
      category === 'virais' || basePrompt.includes('60 SEGUNDOS') || basePrompt.includes('CENA 6')

    if (basePrompt && basePrompt.length > 50) {
      let replaced = basePrompt

      // Remover textos na tela e garantir vídeo limpo
      replaced = replaced.replace(/^[ \t]*[-•*]?[ \t]*Texto[^:\n\r]*:[^\n\r]*\r?\n?/gim, '')
      replaced = replaced.replace(/^[ \t]*[-•*]?[ \t]*Legenda[^:\n\r]*:[^\n\r]*\r?\n?/gim, '')

      if (visualDetails) {
        replaced += `\n\n📌 NOTAS ESPECÍFICAS INCORPORADAS DA SUA IMAGEM:`
        replaced += `\n- Foco nos detalhes visuais: ${visualDetails}`
        replaced += `\n- Preservar consistência visual, proporção e iluminação das fotos anexadas.`
      }

      if (photoNotes) {
        replaced = photoNotes + '\n\n' + replaced
      }

      adaptedPrompt = replaced
    } else if (isViral) {
      adaptedPrompt = `[ROTEIRO VIRAL CRIADORES - 60 SEGUNDOS EM CENAS DE 10S (PT-BR | VÍDEO 100% LIMPO)]
⏱️ DURAÇÃO ALVO: ~60 Segundos (6 Cenas de até 10s)
📌 DIRETRIZES ESSENCIAIS:
- Idioma da narração: Português Brasileiro (PT-BR)
- Vídeo totalmente limpo: SEM legendas, SEM texto na tela, SEM palavras escritas
${photoNotes}

🎬 CENA 1 (0-10s) - GANCHO INICIAL (HOOK):
- Visual: Enquadramento direto baseado na imagem: ${productName}. Iluminação e foco nítido na cena.
- Narração (PT-BR): "Você nunca imaginou ver algo assim acontecer bem na sua frente!"

🎬 CENA 2 (10-20s) - DESENVOLVIMENTO & DETALHES:
- Visual: Câmera em movimento lento destacando os detalhes reais: ${visualDetails || 'texturas expressivas e ambientação viva'}.
- Narração (PT-BR): "Olhe com atenção cada detalhe e como tudo se conecta perfeitamente."

🎬 CENA 3 (20-30s) - REVIRAVOLTA / CLÍMAX PARTE 1:
- Visual: Movimento dinâmico de câmera com revelação inesperada.
- Narração (PT-BR): "E foi exatamente nesse instante que tudo mudou na história!"

🎬 CENA 4 (30-40s) - CONTINUIDADE DO CLÍMAX:
- Visual: Ângulo dramático e expressivo acompanhando a reação central.
- Narração (PT-BR): "Quem estava por perto não acreditou no desfecho dessa cena."

🎬 CENA 5 (40-50s) - DESENLACE DA HISTÓRIA:
- Visual: A ação atinge seu ponto alto e caminha para a resolução estética.
- Narração (PT-BR): "A lição ficou clara para todo mundo que assistiu até aqui."

🎬 CENA 6 (50-60s) - FECHAMENTO E ENGAGEMENT (CTA):
- Visual: Plano final harmonioso com foco de destaque e convite ao público.
- Narração (PT-BR): "Comente o que você achou dessa história e siga para não perder a continuação!"`
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

/**
 * Nova rota: POST /backend/v1/generate-viral-scene
 * Gera especificamente para a aba Vídeos Virais:
 * 1. Ideia de Cena (conceito curto e direto do vídeo viral)
 * 2. Roteiro Opcional completo de ~60 segundos organizado em até 6 cenas de 10s
 */
routerAdd('POST', '/backend/v1/generate-viral-scene', (e) => {
  try {
    const data = e.requestInfo().body || {}
    const themeName = (data.theme_name || data.character_name || 'personagem central').trim()
    const niche = (data.niche || 'historinhas_frutas').trim()
    const visualDetails = (data.visual_details || '').trim()
    const imageCount = parseInt(data.images_count || '1', 10)

    // Dicionário de títulos de nichos
    const nicheNames = {
      historinhas_frutas: 'Historinhas de Frutas Humanoides',
      infantil_historinhas: 'Conteúdo Infantil & Fábulas',
      terror_suspense: 'Terror & Suspense 3AM',
      comedia_engracado: 'Comédia & Situações Engraçadas',
      face_swap: 'Troca de Rosto (Face Swap)',
      asmr_sensorial: 'ASMR Sons & Visual Sensorial',
      animais_falantes: 'Animais Falantes & Pets Cômicos',
    }
    const nicheLabel = nicheNames[niche] || 'Vídeos Virais'

    // 1. Ideia de Cena (Conceito Curto)
    let sceneConcept = ''
    if (niche === 'historinhas_frutas') {
      sceneConcept = `💡 IDEIA DE CENA VIRAL:\nUm(a) ${themeName} falante em 3D hiper-realista vivendo um drama cômico e inesperado na bancada da cozinha antes que os humanos acordem para o café da manhã. Expressões exageradas, bracinhos curtos gesticulando e uma fofoca hilária sobre as outras frutas da geladeira.`
    } else if (niche === 'infantil_historinhas') {
      sceneConcept = `💡 IDEIA DE CENA VIRAL:\nUma jornada mágica e acolhedora de ${themeName} superando um medo bobo com a ajuda de amigos da floresta/jardim encantado, com cores vivas, estrelinhas cintilantes e uma mensagem doce de coragem e amizade para as crianças.`
    } else if (niche === 'terror_suspense') {
      sceneConcept = `💡 IDEIA DE CENA VIRAL:\nAtmosfera claustrofóbica às 3:17 da manhã em que ${themeName} percebe uma presença sobrenatural imóvel na penumbra. O som de passos descalços, a maçaneta girando milímetro por milímetro e uma revelação visual que arrepia a espinha.`
    } else if (niche === 'comedia_engracado') {
      sceneConcept = `💡 IDEIA DE CENA VIRAL:\nUm perrengue tragicômico e identificável com ${themeName} tentando manter a compostura diante de um desastre total do cotidiano. Humor rápido com quebra de expectativa no final.`
    } else if (niche === 'face_swap') {
      sceneConcept = `💡 IDEIA DE CENA VIRAL:\nTransformação cinematográfica hiper-realista aplicando o rosto da foto de referência sobre ${themeName} em cena épica com iluminação de estúdio volumétrica, poros perfeitos e transição em 1 clique.`
    } else if (niche === 'asmr_sensorial') {
      sceneConcept = `💡 IDEIA DE CENA VIRAL:\nExperiência hipnótica macro 4K com ${themeName} sendo fatiado, quebrado ou tocado com estalos relaxantes estéreo e texturas táteis satisfatórias para induzir sono e alívio do estresse.`
    } else if (niche === 'animais_falantes') {
      sceneConcept = `💡 IDEIA DE CENA VIRAL:\nUm pet expressivo (${themeName}) com sincronia labial impecável fazendo drama e cobrando o tutor por passeios, petiscos ou atenção com o bico mais mimado da internet.`
    } else {
      sceneConcept = `💡 IDEIA DE CENA VIRAL:\nCena de alto impacto com ${themeName} retendo a atenção nos primeiros 3 segundos e conduzindo o espectador por uma história envolvente e estética.`
    }

    if (visualDetails) {
      sceneConcept += `\n🔍 Baseado na sua imagem: ${visualDetails}`
    }

    // 2. Roteiro Opcional Completo (~60s em 6 cenas de 10s)
    const optionalScript = `[ROTEIRO OPCIONAL SUGERIDO - ~60 SEGUNDOS EM 6 CENAS DE 10S]
⏱️ DURAÇÃO ALVO: ~60 Segundos (6 Cenas de até 10s cada)
🏷️ NICHO: ${nicheLabel}
🎯 PERSONAGEM/ELEMENTO DA SUA FOTO: ${themeName}
📌 DIRETRIZES ESSENCIAIS:
- Idioma da narração: Português Brasileiro (PT-BR)
- Vídeo totalmente limpo: SEM legendas gravadas na tela, SEM textos impressos no vídeo (as legendas devem ser adicionadas pelo editor do TikTok/CapCut)
- Roteiro opcional: você pode seguir este roteiro integralmente ou adaptá-lo livremente à sua cena!

🎬 CENA 1 (0-10s) - GANCHO HIPNÓTICO (HOOK):
- Visual: Enquadramento direto baseado na sua imagem de ${themeName}. Iluminação dramática destacando a expressão e texturas reais mostradas na foto anexada.
- Câmera: Traveling lento aproximando nos olhos/rosto da figura central.
- Narração (PT-BR): "Se você acha que já viu de tudo na internet, para tudo e olha o que acabou de acontecer aqui!"

🎬 CENA 2 (10-20s) - DESENVOLVIMENTO DO CONTEXTO:
- Visual: A câmera revela o cenário ao redor (${visualDetails || 'ambiente rico em detalhes e iluminação cinematográfica'}). O personagem se move ou reage ao ambiente.
- Câmera: Plano médio com movimento fluido lateral.
- Narração (PT-BR): "Ninguém esperava que exatamente hoje esse detalhe fosse descoberto por todo mundo..."

🎬 CENA 3 (20-30s) - A TENSÃO / REVIRAVOLTA PARTE 1:
- Visual: O elemento central toma uma atitude inesperada, mudando o rumo da história. Reação visual intensa sem texto na tela.
- Câmera: Corte rápido para semi-perfil com foco nítido nas reações.
- Narração (PT-BR): "E foi aí que o segredo começou a vir à tona diante de todo mundo que estava assistindo!"

🎬 CENA 4 (30-40s) - O CLÍMAX DA CENA:
- Visual: Momento de maior intensidade visual e sonora. O personagem atinge o ápice da sua ação ou drama cômico/suspense.
- Câmera: Câmera lenta suave capturando cada detalhe da sua imagem de referência.
- Narração (PT-BR): "Olha a expressão, olha cada detalhe acontecendo em tempo real sem nenhum truque barato!"

🎬 CENA 5 (40-50s) - A RESOLUÇÃO DA HISTÓRIA:
- Visual: A poeira baixa e a consequência da cena é revelada com estética refinada.
- Câmera: Tomada de amplitude média enquadrando o desfecho satisfatório.
- Narração (PT-BR): "No final das contas, ficou provado que essa cena merecia mesmo ficar gravada pra sempre!"

🎬 CENA 6 (50-60s) - FECHAMENTO E CHAMADA DE ENGAJAMENTO (CTA):
- Visual: O personagem olha diretamente para a lente com carisma ou mistério e faz uma despedida marcante.
- Câmera: Fade-out suave com iluminação aconchegante.
- Narração (PT-BR): "O que você faria se estivesse no lugar dele? Comente a sua opinião sincera aqui embaixo e siga o perfil para ver o próximo vídeo!"`

    return e.json(200, {
      success: true,
      theme_name: themeName,
      niche,
      niche_label: nicheLabel,
      scene_concept: sceneConcept.trim(),
      optional_script: optionalScript.trim(),
      image_count: imageCount,
    })
  } catch (err) {
    return e.json(500, {
      success: false,
      message: 'Erro ao gerar ideia de cena viral: ' + (err.message || String(err)),
    })
  }
})

routerAdd('POST', '/backend/v1/regenerate-variations', (e) => {
  try {
    const data = e.requestInfo().body || {}
    const basePrompt = (data.original_prompt || data.base_prompt || '').trim()
    const promptTitle = (data.prompt_title || '').trim()
    const productName = (data.product_name || promptTitle || 'elemento da cena').trim()
    const visualDetails = (data.visual_details || '').trim()
    const imageCount = parseInt(data.images_count || data.image_count || '0', 10)
    const category = (data.category || '').trim()
    const isViral =
      category === 'virais' || basePrompt.includes('60 SEGUNDOS') || basePrompt.includes('CENA 6')

    let photoNotes = ''
    if (imageCount > 0) {
      photoNotes = `\n📸 ADAPTAÇÃO BASEADA NAS ${imageCount} FOTO(S) ANEXADAS:`
      if (visualDetails) {
        photoNotes += `\n- Detalhes visuais observados: ${visualDetails}`
      } else {
        photoNotes += `\n- Destaque específico para texturas e detalhes reais captados nas fotos enviadas.`
      }
    }

    if (isViral) {
      // 3 Variações para Vídeos Virais (~60s em cenas de 10s)
      const vViral1 = `[ROTEIRO VIRAL CRIADORES - 60 SEGUNDOS EM CENAS DE 10S]
✨ ÂNGULO 1: NARRATIVA CÔMICA & HUMOR
⏱️ DURAÇÃO ALVO: ~60s (6 Cenas de até 10s)
📌 DIRETRIZES: Narração PT-BR cômica, vídeo 100% limpo sem texto na tela.
${photoNotes}

🎬 CENA 1 (0-10s) - O FLAGRA INESPERADO (HOOK):
- Visual: Close cômico em ${productName} aprontando uma confusão engraçada.
- Narração (PT-BR): "Eu jurei que ninguém tava olhando, até que o pior aconteceu na minha frente!"

🎬 CENA 2 (10-20s) - A TENTATIVA DE DISFARÇAR:
- Visual: Movimento desajeitado tentando esconder a bagunça (${visualDetails || 'expressão divertida'}).
- Narração (PT-BR): "Tentei disfarçar, mas a cara de culpa entregou tudo em dois segundos!"

🎬 CENA 3 (20-30s) - A REAÇÃO DOS OUTROS:
- Visual: Outros personagens ou elementos encarando chocados a cena.
- Narração (PT-BR): "Quem tava por perto parou tudo pra rir da minha desgraça!"

🎬 CENA 4 (30-40s) - O CLÍMAX DA TRAPALHADA:
- Visual: O desfecho mais atrapalhado e caótico da situação.
- Narração (PT-BR): "Quando achei que ia dar certo, o desastre foi completo!"

🎬 CENA 5 (40-50s) - A CONFORMAÇÃO COM O PERRENGUE:
- Visual: O personagem aceitando a derrota com sorriso amarelo.
- Narração (PT-BR): "Rir da própria vergonha é a única saída digna nesse momento!"

🎬 CENA 6 (50-60s) - CTA DE COMENTÁRIOS:
- Visual: Piscadela para a câmera e pose cúmplice.
- Narração (PT-BR): "Marca aquele amigo que vive passando por isso e deixa seu like!"`

      const vViral2 = `[ROTEIRO VIRAL CRIADORES - 60 SEGUNDOS EM CENAS DE 10S]
⚡ ÂNGULO 2: SUSPENSE & CURIOSIDADE MÁXIMA
⏱️ DURAÇÃO ALVO: ~60s (6 Cenas de até 10s)
📌 DIRETRIZES: Narração PT-BR misteriosa e envolvente, vídeo 100% limpo sem texto na tela.
${photoNotes}

🎬 CENA 1 (0-10s) - O DETALHE QUE NINGUÉM NOTOU (HOOK):
- Visual: Enquadramento escuro e cinematográfico com foco em ${productName}.
- Narração (PT-BR): "Olhe com muita atenção para este detalhe antes que o vídeo acabe..."

🎬 CENA 2 (10-20s) - A PISTA ESCONDIDA:
- Visual: Câmera revelando lentamente as sombras e texturas (${visualDetails || 'iluminação tensa'}).
- Narração (PT-BR): "Quase todo mundo passa reto, mas quem repara nos olhos percebe o mistério."

🎬 CENA 3 (20-30s) - APROXIMAÇÃO GRADUAL:
- Visual: Traveling contínuo de aproximação com som ambiente de suspense.
- Narração (PT-BR): "Quanto mais você olha, mais a história ganha um sentido bizarro..."

🎬 CENA 4 (30-40s) - O PONTO DE VIRADA:
- Visual: Um corte de luz revela o elemento chave escondido na cena.
- Narração (PT-BR): "Foi exatamente aqui que a gravação registrou algo inexplicável."

🎬 CENA 5 (40-50s) - A DESCOBERTA FINAL:
- Visual: O clímax do suspense revelado em detalhes nítidos 4k.
- Narração (PT-BR): "Agora me diz: você percebeu o que estava acontecendo desde o início?"

🎬 CENA 6 (50-60s) - CTA DE RETENÇÃO E ALERTA:
- Visual: Enquadramento final estático e misterioso.
- Narração (PT-BR): "Compartilhe este vídeo com quem é curioso e comente sua teoria aqui embaixo!"`

      const vViral3 = `[ROTEIRO VIRAL CRIADORES - 60 SEGUNDOS EM CENAS DE 10S]
💖 ÂNGULO 3: EMOÇÃO, FOFURA & TRANSFORMAÇÃO
⏱️ DURAÇÃO ALVO: ~60s (6 Cenas de até 10s)
📌 DIRETRIZES: Narração PT-BR calorosa e cativante, vídeo 100% limpo sem texto na tela.
${photoNotes}

🎬 CENA 1 (0-10s) - O INÍCIO DE UMA JORNADA DOCE (HOOK):
- Visual: Luz dourada e acolhedora envolvendo ${productName} em primeiro plano.
- Narração (PT-BR): "Essa é a história mais fofa e inspiradora que vai passar no seu feed hoje!"

🎬 CENA 2 (10-20s) - O DESAFIO INICIAL:
- Visual: O personagem encarando um pequeno desafio com olhos brilhantes e curiosos.
- Narração (PT-BR): "Parecia um obstáculo gigante para alguém tão pequenininho..."

🎬 CENA 3 (20-30s) - A AJUDA INESPERADA:
- Visual: Um gesto de carinho e afeto com a cena ganhando cores mais vibrantes.
- Narração (PT-BR): "Mas quando a coragem vem do coração, nenhum sonho é grande demais."

🎬 CENA 4 (30-40s) - A CONQUISTA BRILHANTE:
- Visual: O momento triunfante com estrelinhas e luz suave iluminando o sorriso.
- Narração (PT-BR): "E com paciência e persistência, a mágica finalmente aconteceu!"

🎬 CENA 5 (40-50s) - O ABRAÇO DE GRATIDÃO:
- Visual: Expressão de alívio e pura felicidade com ${visualDetails || 'harmonia de cores'}.
- Narração (PT-BR): "Momentos assim mostram que a beleza da vida está nos pequenos gestos."

🎬 CENA 6 (50-60s) - CTA DE AFETO E COMPARTILHAMENTO:
- Visual: O personagem agradece com sorriso doce e aceno de carinho.
- Narração (PT-BR): "Mande esse vídeo para iluminar o dia de alguém especial e deixe um coraçãozinho!"`

      return e.json(200, {
        success: true,
        product_name: productName,
        variations: [
          {
            id: 'v_humor_60s',
            angle: 'Humor & Situações Cômicas',
            badge: '😂 Ângulo Humor (60s)',
            description:
              'Roteiro de 60s em 6 cenas de 10s focado em perrengue divertido e quebra de expectativa.',
            prompt_text: vViral1,
          },
          {
            id: 'v_suspense_60s',
            angle: 'Suspense & Curiosidade',
            badge: '🕯️ Ângulo Suspense (60s)',
            description:
              'Roteiro de 60s em 6 cenas de 10s focado em retenção alta, mistério e pistas.',
            prompt_text: vViral2,
          },
          {
            id: 'v_emocao_60s',
            angle: 'Emoção & Fofura',
            badge: '💖 Ângulo Emoção (60s)',
            description:
              'Roteiro de 60s em 6 cenas de 10s focado em história acolhedora, afeto e conexão.',
            prompt_text: vViral3,
          },
        ],
      })
    }

    // Caso padrão: E-commerce (10s)
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
