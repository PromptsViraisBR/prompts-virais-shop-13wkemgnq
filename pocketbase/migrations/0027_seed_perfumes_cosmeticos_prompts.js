/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    // 1. Garantir que o enum 'niche' contenha perfumes_cosmeticos em prompts e generations
    const promptsCol = app.findCollectionByNameOrId('prompts')
    const generationsCol = app.findCollectionByNameOrId('generations')

    const expandedNiches = [
      'moda_feminina',
      'moda_masculina',
      'fitness_academia',
      'moda_praia',
      'acessorios_calcados',
      'streetwear_casual',
      'infantil_kids',
      'lingerie_pijamas',
      'espelhos_decoracao',
      'produtos_eletronicos',
      'capinhas_acessorios_celular',
      'moda_fitness_plus_size',
      'pet_acessorios',
      'cozinha_utilidades',
      'relogios_bijus',
      // Nicho Perfumes & Cosméticos
      'perfumes_cosmeticos',
      // Nichos Virais
      'historinhas_frutas',
      'infantil_historinhas',
      'terror_suspense',
      'comedia_engracado',
      'face_swap',
      'asmr_sensorial',
      'animais_falantes',
    ]

    const promptNicheField = promptsCol.fields.getByName('niche')
    if (promptNicheField) {
      promptNicheField.values = expandedNiches
      promptNicheField.maxSelect = 1
      app.save(promptsCol)
    }

    const genNicheField = generationsCol.fields.getByName('niche')
    if (genNicheField) {
      genNicheField.values = expandedNiches
      genNicheField.maxSelect = 1
      app.save(generationsCol)
    }

    // 2. Seed idempotente de prompts de Perfumes & Cosméticos (Gratuitos e PRO)
    const perfumesPrompts = [
      // PROMPT 1 (GRÁTIS) - POV Perfume Marcante
      {
        title: '✨ Perfume Árabe Marcante com Fixação de 24 Horas',
        description:
          'Roteiro dinâmico de 10s: POV aplicando nas zonas de pulso e teste na gola do casaco com apelo de projeção marcante.',
        niche: 'perfumes_cosmeticos',
        style: 'pov',
        platform: 'ambos',
        is_free: true,
        category: 'ecommerce',
        hook: 'POV: O perfume árabe que fez três pessoas perguntarem o meu cheiro no elevador!',
        call_to_action:
          'Garanta o frasco original com desconto na sacolinha do vídeo antes de zerar o estoque!',
        tags: 'perfume arabe, perfumaria importada, fixacao 24h, tiktok shop, shopee, rotina de cheiro',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=luxury+perfume+bottle+gold+amber+mist+spray&color=orange',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
⏱️ DURAÇÃO ALVO: 10 Segundos
🎯 DIRETRIZES DE RETENÇÃO E VENDAS:
- Vídeo 100% limpo, SEM texto gravado na imagem, narração fluida em PT-BR
- Iluminação quente e elegante destacando as partículas douradas do frasco de vidro

🎬 CENA 1 (0-3s) - O GANCHO HIPNÓTICO (POV / PROJEÇÃO):
- Visual: POV em primeira pessoa borrifando a névoa dourada do perfume rente ao pulso e no pescoço em câmera lenta. Partículas finas brilham sob a luz suave.
- Narração (PT-BR): "Três pessoas me pararam no elevador hoje só pra perguntar qual era esse perfume!"

🎬 CENA 2 (3-7s) - DETALHES DE FIXAÇÃO E FRASCO LUXUOSO:
- Visual: Close macro no frasco de vidro pesado, tampa dourada magnética com estalo firme e borrifada ampla sem pingar.
- Narração (PT-BR): "Notas florais com âmbar e fixação absurda de mais de vinte e quatro horas na pele e na roupa."

🎬 CENA 3 (7-10s) - CHAMADA DIRETA AO CARRINHO:
- Visual: A mão segura a caixa lacrada ao lado do frasco e aponta para o canto inferior esquerdo mostrando a sacolinha amarela.
- Narração (PT-BR): "Lote original com frete grátis na sacolinha aqui embaixo. Clica e aproveita antes que esgote!"`,
      },

      // PROMPT 2 (GRÁTIS) - Hidratante Corporal Iluminador
      {
        title: '🧴 Hidratante Corporal Glow com Textura Acetinada',
        description:
          'Roteiro de 10s focado no teste sensorial na pele: textura aveludada, brilho dourado e absorção instantânea sem ficar grudento.',
        niche: 'perfumes_cosmeticos',
        style: 'pov',
        platform: 'shopee',
        is_free: true,
        category: 'ecommerce',
        hook: 'O segredo da pele iluminada de passarela sem parecer oleosa!',
        call_to_action: 'Frete grátis e cupom de primeira compra no carrinho da Shopee!',
        tags: 'hidratante iluminador, glow corporal, skincare, pele radiante, shopee achadinhos',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=body+lotion+cream+texture+glow+skin+hands&color=white',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
⏱️ DURAÇÃO ALVO: 10 Segundos
🎯 DIRETRIZES DE RETENÇÃO E VENDAS:
- Vídeo 100% limpo, sem texto visual na tela, áudio limpo em PT-BR
- Luz natural rente à janela para evidenciar a textura e o brilho acetinado na pele

🎬 CENA 1 (0-3s) - O GANCHO HIPNÓTICO (TEXTURA / SENSORIAL):
- Visual: Close nas costas da mão onde uma gota generosa de loção dourada é espalhada, refletindo um brilho acetinado imediato.
- Narração (PT-BR): "Aquele efeito de pele dourada de rica que não gruda na roupa nem derrete no calor!"

🎬 CENA 2 (3-7s) - DETALHES DA ABSORÇÃO E PERFUME:
- Visual: Teste rápido passando um lencinho seco sobre a pele recém-hidratada para mostrar zero resíduo gorduroso e toque aveludado.
- Narração (PT-BR): "Absorve em menos de dez segundos e deixa um cheirinho de baunilha importada o dia inteiro."

🎬 CENA 3 (7-10s) - CHAMADA DIRETA AO CARRINHO:
- Visual: Modelo sorrindo segurando a bisnaga com o selo holográfico e apontando para o botão de compra no rodapé.
- Narração (PT-BR): "Tá com cupom de desconto exclusivo no link aqui da Shopee. Pega o seu agora!"`,
      },

      // PROMPT 3 (PRO) - Sérum Facial Anti-Idade com Ácido Hialurônico
      {
        title: '💎 Sérum Facial Lifting com Efeito Glow Imediato',
        description:
          'Roteiro PRO de 10s: aplicação com conta-gotas em close macro, toque sedoso e resultado visível na textura dos poros.',
        niche: 'perfumes_cosmeticos',
        style: 'modelo',
        platform: 'ambos',
        is_free: false,
        category: 'ecommerce',
        hook: 'POV: A textura que fechou meus poros e deixou a pele lisinha antes da maquiagem!',
        call_to_action:
          'Garanta o sérum com preço de fábrica na sacolinha do TikTok Shop ou Shopee!',
        tags: 'serum facial, skincare coreano, acido hialuronico, poros fechados, cosméticos pro',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=facial+serum+dropper+cosmetics+skin+care&color=cyan',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
⏱️ DURAÇÃO ALVO: 10 Segundos
🎯 DIRETRIZES DE RETENÇÃO E VENDAS:
- Vídeo 100% limpo, SEM texto impresso no vídeo, áudio cristalino
- Iluminação softbox neutra 5500K para fidelidade máxima de cor e textura

🎬 CENA 1 (0-3s) - O GANCHO HIPNÓTICO (CONTA-GOTAS MACRO):
- Visual: Close macro ultra nítido no conta-gotas de vidro soltando uma lágrima cristalina e viscosa na maçã do rosto da modelo.
- Narração (PT-BR): "Essa gotinha aqui substituiu três passos da minha rotina matinal inteira!"

🎬 CENA 2 (3-7s) - DETALHES DE ABSORÇÃO E EFEITO LIFTING:
- Visual: Espalhando com movimentos suaves ascendentes; a pele ganha imediatamente um viço saudável e textura de seda.
- Narração (PT-BR): "Ácido hialurônico puro com niacinamida que fecha os poros e não craquela a maquiagem."

🎬 CENA 3 (7-10s) - CHAMADA DIRETA AO CARRINHO:
- Visual: Frasco sobre pedestal espelhado com a sacolinha piscando no canto da tela; mão acena convidando ao clique.
- Narração (PT-BR): "Clica na sacolinha aqui embaixo e garante o seu com desconto de lançamento!"`,
      },

      // PROMPT 4 (PRO) - Batom Matte de Longa Duração (Sem Transferência)
      {
        title: '💄 Batom Matte Aveludado que Não Transfere no Copo',
        description:
          'Roteiro PRO de 10s: teste de atrito com copo de vidro branco para provar zero transferência e cor pigmentada na primeira passada.',
        niche: 'perfumes_cosmeticos',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: false,
        category: 'ecommerce',
        hook: 'O teste do copo branco que provou que esse batom não sai nem por reza brava!',
        call_to_action:
          'Escolha sua cor favorita no carrinho e aproveite o frete grátis na sacolinha!',
        tags: 'batom matte, maquiagem a prova d agua, nao transfere, tiktok shop cosmetics, beleza',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=red+lipstick+matte+luxury+cosmetics+lips&color=red',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
⏱️ DURAÇÃO ALVO: 10 Segundos
🎯 DIRETRIZES DE RETENÇÃO E VENDAS:
- Vídeo 100% limpo, sem textos na tela, voz animada e confiante em PT-BR
- Luz anelar (ring light) frontal direta para realçar o tom vermelho vivo

🎬 CENA 1 (0-3s) - O GANCHO HIPNÓTICO (TESTE DO COPO):
- Visual: Mulher aplicando o batom vermelho aveludado nos lábios com traço cirúrgico e na sequência beijando com firmeza um copo de vidro transparente.
- Narração (PT-BR): "Disseram que era impossível um batom vermelho matte não manchar o copo..."

🎬 CENA 2 (3-7s) - DETALHES DE ACABAMENTO E ZERO TRANSFERÊNCIA:
- Visual: A modelo vira o copo para a câmera: vidro cem por cento cristalino e limpo, sem resquício de cor, com lábios perfeitamente aveludados e confortáveis.
- Narração (PT-BR): "Olha esse copo! Zero borrão, doze horas de duração e não craquela no meio do lábio."

🎬 CENA 3 (7-10s) - CHAMADA DIRETA AO CARRINHO:
- Visual: Apresentação rápida de três tonalidades abertas e dedo apontando para a sacolinha amarela.
- Narração (PT-BR): "São oito tons exclusivos na sacolinha aqui do vídeo. Escolhe o seu antes do estoque zerar!"`,
      },

      // PROMPT 5 (PRO) - Perfume Floral Fresco para o Dia a Dia
      {
        title: '🌸 Perfume Floral Fresco para Assinatura Olfativa Diária',
        description:
          'Roteiro PRO de 10s: atmosfera leve de primavera, frasco elegante com laço de fita e borrifada refrescante em ambiente ensolarado.',
        niche: 'perfumes_cosmeticos',
        style: 'unboxing_vitrine',
        platform: 'ambos',
        is_free: false,
        category: 'ecommerce',
        hook: 'O cheirinho de banho tomado e elegância que dura o expediente inteiro!',
        call_to_action:
          'Clique na sacolinha agora e receba com embalagem para presente e amostra grátis!',
        tags: 'perfume floral, assinatura olfativa, cheiro de rica, perfumaria feminina, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=elegant+pink+perfume+bottle+fresh+flowers+daylight&color=pink',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
⏱️ DURAÇÃO ALVO: 10 Segundos
🎯 DIRETRIZES DE RETENÇÃO E VENDAS:
- Vídeo 100% limpo, SEM texto visual gravado na imagem, narração suave e agradável em PT-BR
- Cenário clean com flores frescas e luz solar dourada entrando pela janela

🎬 CENA 1 (0-3s) - O GANCHO HIPNÓTICO (APELO SENSORIAL):
- Visual: Borrifada no ar em câmera lenta com pétalas de jasmim no fundo desfocado, seguida de respiração profunda de satisfação.
- Narração (PT-BR): "Se você quer ter aquele cheirinho inesquecível de mulher cheirosa e arrumada, presta atenção nesse frasco!"

🎬 CENA 2 (3-7s) - DETALHES DA PIRÂMIDE OLFATIVA:
- Visual: Unboxing suave retirando a tampa imantada com clique sonoro satisfatório e close no bocal de atomização ultrafina.
- Narração (PT-BR): "Combina notas de peônia, lichia e cedro suave. É leve pro calor, mas gruda na pele o dia inteiro."

🎬 CENA 3 (7-10s) - CHAMADA DIRETA AO CARRINHO:
- Visual: Frasco pousado sobre tecido de seda branca com mão apontando para a sacolinha de compras.
- Narração (PT-BR): "Tá com valor promocional e frete grátis na sacolinha aqui embaixo. Garante o seu!"`,
      },

      // PROMPT 6 (PRO) - Máscara Facial Noturna Reparadora
      {
        title: '🌙 Máscara Facial Noturna de Colágeno Efeito Cinderela',
        description:
          'Roteiro PRO de 10s: rotina noturna aplicando camada fina luminosa e mostrando o despertar com pele renovada e hidratada.',
        niche: 'perfumes_cosmeticos',
        style: 'pov',
        platform: 'shopee',
        is_free: false,
        category: 'ecommerce',
        hook: 'POV: A máscara coreana que devolve o colágeno da pele enquanto você dorme!',
        call_to_action:
          'Compre pelo link da Shopee com cupom de frete grátis antes que a remessa esgote!',
        tags: 'mascara noturna, colageno, skincare coreana, antes e depois, shopee cosméticos',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=night+sleeping+face+mask+cream+glass+jar+cosmetic&color=blue',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
⏱️ DURAÇÃO ALVO: 10 Segundos
🎯 DIRETRIZES DE RETENÇÃO E VENDAS:
- Vídeo 100% limpo, sem texto sobreposto no vídeo, narração relaxante e acolhedora em PT-BR
- Iluminação intimista de cabeceira com abajur quente 2700K

🎬 CENA 1 (0-3s) - O GANCHO HIPNÓTICO (APLICAÇÃO NOTURNA):
- Visual: Pote de vidro âmbar sendo aberto com colherzinha acrílica pegando uma textura gelatinosa transparente e aplicando na testa e bochecha.
- Narração (PT-BR): "Você dorme cansada e acorda parecendo que fez dez sessões de botox na clínica!"

🎬 CENA 2 (3-7s) - DETALHES DA FÓRMULA BIOATIVA:
- Visual: A textura derrete em contato com a pele, criando uma película invisível de brilho que não transfere para a fronha.
- Narração (PT-BR): "Bio-colágeno puro que penetra fundo à noite e devolve o viço da pele madura."

🎬 CENA 3 (7-10s) - CHAMADA DIRETA AO CARRINHO:
- Visual: Caixa com selo de autenticidade exibida ao lado do botão de compra no rodapé do aplicativo.
- Narração (PT-BR): "Aproveita o cupom de frete grátis na sacolinha da Shopee antes que o estoque zere!"`,
      },
    ]

    for (let i = 0; i < perfumesPrompts.length; i++) {
      const p = perfumesPrompts[i]
      const existing = app.findRecordsByFilter(
        'prompts',
        'niche = "perfumes_cosmeticos" && title = {:title}',
        '',
        1,
        0,
        { title: p.title },
      )
      if (!existing || existing.length === 0) {
        const record = new Record(promptsCol)
        record.set('title', p.title)
        record.set('description', p.description)
        record.set('niche', p.niche)
        record.set('style', p.style)
        record.set('platform', p.platform)
        record.set('is_free', p.is_free)
        record.set('category', p.category)
        record.set('hook', p.hook)
        record.set('call_to_action', p.call_to_action)
        record.set('tags', p.tags)
        record.set('reference_image_url', p.reference_image_url)
        record.set('prompt_text', p.prompt_text)
        app.save(record)
      }
    }
  },
  (app) => {
    // Reversão
  },
)
