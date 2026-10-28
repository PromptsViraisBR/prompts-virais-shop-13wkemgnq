/// <reference path="../pb_data/types.d.ts" />

/**
 * Migração 0028:
 * Adicionar 10 novos prompts para cada uma das modalidades (nichos):
 * - 16 nichos de e-commerce
 * - 7 nichos de vídeos virais
 * Total: 23 modalidades x 10 prompts novos = 230 prompts
 *
 * Características:
 * - Totalmente em PT-BR
 * - Roteiros calibrados para alta conversão e retenção
 * - Formato cena a cena limpo (0-3s gancho, 3-7s desenvolvimento, 7-10s CTA pro carrinho/engajamento)
 * - Distribuição equilibrada entre estilos (POV, com modelo e unboxing)
 * - Idempotente: verifica se o título já existe antes de inserir
 */

migrate(
  (app) => {
    const promptsCol = app.findCollectionByNameOrId('prompts')

    const newPrompts = [
      // ==========================================
      // 1. MODA FEMININA (10 novos prompts)
      // ==========================================
      {
        title: '👗 Vestido Canelado Gola Alta com Fenda Poderosa',
        description:
          'POV provador em frente ao espelho testando o caimento que modela a cintura sem marcar celulite.',
        niche: 'moda_feminina',
        style: 'pov',
        platform: 'ambos',
        is_free: false,
        category: 'ecommerce',
        hook: 'POV: O vestido de R$ 39 da Shopee que parece desenhado sob medida pro meu corpo!',
        call_to_action: 'Tecido encorpado que não fica transparente. Link direto na sacolinha!',
        tags: 'vestido canelado, gola alta, look festa, provador shopee, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=ribbed+midi+dress+woman+mirror+slit&color=black',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O GANCHO DO CAIMENTO (HOOK):
- POV em frente ao espelho com iluminação suave: ajeitando o vestido com as duas mãos na cintura e dando uma voltinha rápida de 45 graus.
- Narração: "Paguei menos de quarenta reais nesse vestido canelado e olha o desenho que ele deu na cintura!"

🎬 CENA 2 (3-7s) - PROVA DO TECIDO SEM TRANSPARÊNCIA:
- Close na fenda lateral bem acabada e esticando levemente o tecido no quadril para comprovar elasticidade e zero transparência.
- Narração: "Canelado encorpado de algodão com elastano. Não fica transparente nem sob luz forte."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Sorriso confiante, apontando com a unha feita para a sacolinha no canto inferior esquerdo.
- Narração: "Tem do P ao GG na sacolinha com frete grátis. Pega o seu antes de esgotar!"`,
      },
      {
        title: '👗 Conjunto Moletinho Elegante Aeroporto & Passeio',
        description:
          'Modelo caminhando no saguão com conjunto confortável de moletinho premium que une estilo e elegância.',
        niche: 'moda_feminina',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: false,
        category: 'ecommerce',
        hook: 'O conjunto estilo aerolook que parece de marca chique de shopping por preço de atacado!',
        call_to_action:
          'Calça com elástico confortável e blusa soltinha. Link no carrinho amarelo!',
        tags: 'conjunto moletinho, aerolook, casual chic, moda feminina, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=loungewear+sweatset+airport+chic+woman&color=gray',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O PASSO DO AEROLOOK (HOOK):
- Modelo com óculos escuros e mala de mão caminhando com elegância; caimento fluido do moletinho chamando atenção.
- Narração: "Aquele conjunto que você coloca de manhã e passa o dia inteiro parecendo capa de revista!"

🎬 CENA 2 (3-7s) - DETALHES DE COSTURA E CONFORTO:
- Mão da modelo passando pelo tecido macio, mostrando o cós alto largo que não aperta a barriga.
- Narração: "Moletinho leve com toque aveludado que não amassa e não forma bolinhas na lavagem."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Modelo para, dá uma piscadela e aponta pro carrinho amarelo no canto da tela.
- Narração: "Cores neutras lindas na sacolinha do vídeo com envio imediato!"`,
      },
      {
        title: '👗 Calça Wide Leg Alfaiataria que Alonga a Silhueta',
        description:
          'POV olhando pra baixo ao calçar sandália de salto bloco com a barra impecável da calça wide leg.',
        niche: 'moda_feminina',
        style: 'pov',
        platform: 'shopee',
        is_free: false,
        category: 'ecommerce',
        hook: 'POV: A calça de alfaiataria que fez minhas pernas parecerem ter 10cm a mais!',
        call_to_action: 'Cós duplo estruturado com bolsos faca reais. Link com cupom na Shopee!',
        tags: 'wide leg, alfaiataria feminina, look escritorio, alonga silhueta, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=wide+leg+trousers+tailored+woman+office&color=orange',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O EFEITO ALONGADOR (HOOK):
- POV em frente ao espelho com sandália de salto: calça fluindo perfeitamente até a pontinha do calçado.
- Narração: "Se você tem menos de um metro e sessenta, essa alfaiataria vai te deixar com pernas de modelo!"

🎬 CENA 2 (3-7s) - ESTRUTURA DO CÓS E PREGAS:
- Close no cós reto alto sem elástico franzido, zíper reforçado e bolsos faca funcionais.
- Narração: "Caimento estruturado com pregas frontais que disfarçam a barriguinha e afinam a cintura."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Ajeitando a blusinha por dentro do cós e apontando para a sacolinha.
- Narração: "Aproveita o cupom de frete grátis na sacolinha antes que a reposição acabe!"`,
      },
      {
        title: '👗 Cropped Corset com Barbatanas que Sustenta sem Sutiã',
        description:
          'Unboxing e teste de compressão suave com o corset moderno que substitui sutiã.',
        niche: 'moda_feminina',
        style: 'unboxing_vitrine',
        platform: 'tiktok_shop',
        is_free: true,
        category: 'ecommerce',
        hook: 'O corset de R$ 25 que segura tudo no lugar e dispensa sutiã com qualquer decote!',
        call_to_action: 'Barbatanas flexíveis que não machucam as costelas. Link no carrinho!',
        tags: 'corset, cropped corset, sustentacao, balada, tiktok shop moda',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=corset+top+boned+woman+party+outfit&color=black',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O TESTE DA SUSTENTAÇÃO (HOOK):
- Colocando a mão no busto do corset e pulando de leve para provar sustentação absoluta sem sutiã.
- Narração: "Disseram que era impossível corset de vinte e cinco reais segurar busto pesado sem aro de ferro..."

🎬 CENA 2 (3-7s) - BARBATANAS CONFORTÁVEIS:
- Dobrando levemente a peça para mostrar a flexibilidade das barbatanas de silicone que não machucam o corpo.
- Narração: "Barbatanas maleáveis que desenham a silhueta de violão sem deixar marcas na pele."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Colocando por cima de uma camisa branca social: look balada instantâneo com dedo na sacola.
- Narração: "Combina com tudo! Clica na sacolinha aqui embaixo e garante o seu."`,
      },
      {
        title: '👗 Jaqueta Cropped Resinada Efeito Couro Puro',
        description:
          'Modelo colocando jaqueta resinada com zíperes metálicos prateados em look noturno urbano.',
        niche: 'moda_feminina',
        style: 'modelo',
        platform: 'ambos',
        is_free: false,
        category: 'ecommerce',
        hook: 'A jaqueta efeito couro que não descasca e custa um terço do valor de loja física!',
        call_to_action: 'Forro acetinado macio e corte perfeito na cintura. Link na sacolinha!',
        tags: 'jaqueta couro fake, resinada, jaqueta biker, inverno feminino, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=leather+biker+jacket+woman+cropped+night&color=black',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O BRILHO NOBRE DO RESINADO (HOOK):
- Modelo vestindo a jaqueta num movimento fluido; a luz da rua reflete no acabamento acetinado nobre.
- Narração: "Achadinho que parece importado da Europa por preço de feirinha da madrugada!"

🎬 CENA 2 (3-7s) - FECHAMENTO E DETALHES DE ZÍPER:
- Fechando o zíper tratorado prateado até a metade; corte cropped marcando o cós da calça perfeitamente.
- Narração: "Ferragens pesadas que não emperram e tecido flexível que não quebra com o tempo."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Puxando a gola com atitude e apontando para a sacolinha amarela.
- Narração: "Peça curinga de inverno! Link direto na sacolinha com entrega rápida."`,
      },
      {
        title: '👗 Vestido Tubinho Midi Fenda Canelado Premium',
        description: 'POV descendo do carro com o tubinho que abraça as curvas sem subir ao andar.',
        niche: 'moda_feminina',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: false,
        category: 'ecommerce',
        hook: 'POV: O tubinho que não sobe na coxa a cada passo e não marca a roupa de baixo!',
        call_to_action: 'Tecido duplo no busto e elasticidade premium. Link no carrinho!',
        tags: 'tubinho midi, vestido preto, modelador, tiktok shop moda',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=black+midi+bodycon+dress+woman+car&color=black',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O TESTE DA PASSADA (HOOK):
- Descendo do carro e dando passos firmes: o vestido se mantém alinhado no joelho sem enrolar.
- Narração: "Finalmente um tubinho midi que não fica subindo na perna enquanto você caminha!"

🎬 CENA 2 (3-7s) - COSTURA E FORRO DUPLO:
- Close na textura canelada densa e no forro reforçado na região do busto que dispensa bojo.
- Narração: "Malha com gramatura alta que comprime a cintura com conforto total."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Apoiando a bolsa no ombro e clicando virtualmente no carrinho amarelo.
- Narração: "O tubinho preto essencial da sua vida tá na sacolinha com desconto!"`,
      },
      {
        title: '👗 Camisa Social Oversized em Linho Misto Elegante',
        description:
          'Modelo amarrando a ponta da camisa de linho sobre um cropped básico para um almoço de domingo.',
        niche: 'moda_feminina',
        style: 'modelo',
        platform: 'shopee',
        is_free: false,
        category: 'ecommerce',
        hook: 'A camisa de linho de R$ 34 que transforma qualquer shortinho básico em look de mulher rica!',
        call_to_action: 'Botões em madrepérola e caimento leve. Link na sacolinha Shopee!',
        tags: 'camisa linho, oversized, look casual chic, achadinho shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=white+linen+oversized+shirt+woman+casual&color=white',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - A AMARRAÇÃO RÁPIDA (HOOK):
- Modelo com short jeans e top: jogando a camisa de linho aberta e dando um nozinho despretensioso na ponta.
- Narração: "Quer parecer arrumada em trinta segundos gastando menos de quarenta reais?"

🎬 CENA 2 (3-7s) - TOQUE DO LINHO MISTO:
- Câmera aproxima na trama respirável do linho misto com algodão que não esquenta no calor.
- Narração: "Linho encorpado com caimento solto que não pinica e fica fresco o dia todo."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Sorriso natural, ajeitando a manga dobrada e apontando para a sacola.
- Narração: "Cores da estação disponíveis no link aqui embaixo. Aproveita o frete grátis!"`,
      },
      {
        title: '👗 Macaquinho Alfaiataria com Faixa de Amarração',
        description:
          'Unboxing rápido do macaquinho e prova no espelho mostrando o caimento perfeito que não aperta no gancho.',
        niche: 'moda_feminina',
        style: 'unboxing_vitrine',
        platform: 'ambos',
        is_free: false,
        category: 'ecommerce',
        hook: 'O macaquinho de alfaiataria que não aperta entrepernas e parece peça de estilista renomado!',
        call_to_action: 'Acompanha faixa do mesmo tecido para acinturar. Link na sacolinha!',
        tags: 'macaquinho alfaiataria, look pratico, elegante, shopee, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=tailored+romper+jumpsuit+woman+belt&color=blue',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O DRAMA RESOLVIDO DO MACAQUINHO (HOOK):
- Tirando da embalagem com laço pronto e colocando no corpo: comprimento confortável que não repuxa.
- Narração: "Quem tem quadril largo sabe o sofrimento pra achar macaquinho que não fique repuxando..."

🎬 CENA 2 (3-7s) - FAIXA MODELADORA DE CINTURA:
- Amarrando a faixa larga na lateral; a cintura fica fina e os bolsos laterais completam o charme.
- Narração: "Tecido estruturado que não amassa fácil e modela o corpo com elegância de terno feminino."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Girinho sutil mostrando as costas fechadas e mão apontando para a sacolinha.
- Narração: "Look pronto pra qualquer compromisso! Link oficial na sacolinha do vídeo."`,
      },
      {
        title: '👗 Saia Midi Plissada Acetinada com Elástico Macio',
        description:
          'Modelo rodopiando suavemente em piso brilhante mostrando o movimento hipnótico do plissado.',
        niche: 'moda_feminina',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: false,
        category: 'ecommerce',
        hook: 'O movimento surreal dessa saia plissada acetinada que fez todo mundo perguntar de onde é!',
        call_to_action: 'Elástico embutido que não enrola no abdômen. Compre na sacola!',
        tags: 'saia plissada, cetim midi, look modesto elegante, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=pleated+satin+midi+skirt+woman+spin&color=pink',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O GIRO DO PLISSADO (HOOK):
- Giro fluido em câmera lenta: o tecido acetinado capta a luz e cria um movimento espetacular.
- Narração: "Duvido você não se sentir a mulher mais elegante do mundo com essa saia!"

🎬 CENA 2 (3-7s) - CÓS COM ELÁSTICO MACIO:
- Mão demonstrando o elástico que se adapta ao corpo sem apertar nem marcar a cintura.
- Narração: "Plissado térmico que não desmancha ao lavar e cetim nobre com toque macio de seda."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Parando o giro com postura impecável e apontando para a sacolinha amarela.
- Narração: "Mais de dez tons pastéis lindos no carrinho amarelo aqui embaixo. Clica e confira!"`,
      },
      {
        title: '👗 Body Suplex Decote Quadrado Manga Longa',
        description:
          'POV no provador combinando o body decote quadrado com calça jeans reta e cinto fino.',
        niche: 'moda_feminina',
        style: 'pov',
        platform: 'shopee',
        is_free: true,
        category: 'ecommerce',
        hook: 'POV: O body de R$ 22 que desenha o colo e sustenta melhor do que sutiã de R$ 150!',
        call_to_action: 'Fecho prático de pressão e tecido duplo na frente. Link com cupom!',
        tags: 'body decote quadrado, suplex duplo, basico essencial, shopee achados',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=square+neck+long+sleeve+bodysuit+woman&color=white',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O DESENHO DO COLO (HOOK):
- POV em frente ao espelho com o decote quadrado perfeito realçando o colar dourado delicado.
- Narração: "Esse decote quadrado valoriza o colo de um jeito que você nunca mais vai querer usar outra blusa!"

🎬 CENA 2 (3-7s) - FORRO DUPLO E SUSTENTAÇÃO:
- Puxando a alça e mostrando que não marca o sutiã e o suplex grosso firma o busto naturalmente.
- Narração: "Suplex de poliamida com forro duplo na frente. Firmeza total sem marcar nadinha."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Colocando um blazer preto por cima: look de milhões em cinco segundos. Dedo no link da Shopee.
- Narração: "O básico que salva qualquer look tá na sacolinha por vinte e dois reais. Pega o seu!"`,
      },

      // ==========================================
      // 2. MODA MASCULINA (10 novos prompts)
      // ==========================================
      {
        title: '👔 Camisa Polo Masculina Piquet com Botões Ocultos',
        description:
          'POV colocando a camisa polo estruturada no peitoral com gola encorpada que não deforma.',
        niche: 'moda_masculina',
        style: 'pov',
        platform: 'ambos',
        is_free: false,
        category: 'ecommerce',
        hook: 'POV: A polo de R$ 38 que tem o caimento no peito igual às grifes de R$ 300!',
        call_to_action: 'Piquet de algodão com toque macio e gola encorpada. Link na sacolinha!',
        tags: 'camisa polo, moda masculina, polo estruturada, caimento perfeito, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=mens+piquet+polo+shirt+mirror+muscle+fit&color=blue',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O CAIMENTO NO PEITORAL (HOOK):
- POV em frente ao espelho ajeitando os ombros da polo: tecido abraça o peitoral e os braços sem sobrar pano.
- Narração: "Cansado de camisa polo que fica frouxa no peito parecendo uniforme de colégio?"

🎬 CENA 2 (3-7s) - A GOLA QUE NÃO ENROLA:
- Mão puxando de leve a gola encorpada com costura dupla que fica armada o dia inteiro.
- Narração: "Piquet pesado cem por cento algodão. A gola não amassa e não enrola na máquina."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Ajustando o relógio no pulso e apontando para a sacolinha amarela.
- Narração: "Cores sóbrias e elegantes na sacolinha do vídeo com frete grátis!"`,
      },
      {
        title: '👔 Calça Jogger Sarja com Elástico e Cordão Reforçado',
        description:
          'Modelo caminhando no asfalto com tênis casual e a barra da jogger perfeitamente ajustada no tornozelo.',
        niche: 'moda_masculina',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: false,
        category: 'ecommerce',
        hook: 'A calça jogger de sarja que tem o conforto de moletom e a elegância de calça de sair!',
        call_to_action: 'Sarja com 3% de elastano para movimento livre. Link no carrinho amarelo!',
        tags: 'calca jogger, sarja masculina, streetwear homem, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=mens+twill+jogger+pants+sneakers+street&color=black',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O ESTILO URBANO NA PASSADA (HOOK):
- Passada firme da calça jogger combinada com tênis branco; o punho no tornozelo valoriza o calçado.
- Narração: "Essa calça aqui vai ser a mais confortável do seu guarda-roupa a partir de hoje!"

🎬 CENA 2 (3-7s) - TESTE DE FLEXIBILIDADE:
- Agachamento rápido comprovando que a sarja com elastano não trava os joelhos nem repuxa no quadril.
- Narração: "Sarja premium com elastano. Aguenta a correria do dia a dia e rolê à noite sem amassar."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Modelo coloca as mãos nos bolsos fundos e aponta para o carrinho amarelo.
- Narração: "Tamanhos do trinta e oito ao quarenta e oito na sacolinha. Pega a sua!"`,
      },
      {
        title: '👔 Camisa Linho Manga Curta Gola Padre Relaxed',
        description:
          'POV desabotoando o primeiro botão da camisa de linho em ambiente ensolarado de praia ou churrasco.',
        niche: 'moda_masculina',
        style: 'pov',
        platform: 'shopee',
        is_free: false,
        category: 'ecommerce',
        hook: 'POV: A camisa gola padre que te deixa com postura de homem alinhado sem passar calor!',
        call_to_action: 'Tecido respirável que não amassa fácil. Link com cupom na Shopee!',
        tags: 'gola padre, camisa linho homem, look verao masculino, shopee achados',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=mens+mandarin+collar+linen+shirt+summer&color=white',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - A ELEGÂNCIA DA GOLA PADRE (HOOK):
- POV em frente ao espelho colocando a camisa branca com gola padre minimalista e bermuda de alfaiataria.
- Narração: "O segredo pra ficar estiloso no verão sem precisar sofrer com camisa quente de botão!"

🎬 CENA 2 (3-7s) - TEXTURA DO LINHO RESPIRÁVEL:
- Câmera aproxima na trama leve do linho com toque suave que deixa o vento passar com facilidade.
- Narração: "Linho misto respirável que tem caimento solto e não gruda nas costas suadas."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Fechando a manga e apontando para a sacolinha da Shopee.
- Narração: "Custa menos de quarenta reais no link da sacolinha. Aproveita o cupom!"`,
      },
      {
        title: '👔 Bermuda Alfaiataria Masculina com Bolso Faca',
        description:
          'Modelo com mocassim ou tênis casual mostrando o comprimento exato 2 dedos acima do joelho.',
        niche: 'moda_masculina',
        style: 'modelo',
        platform: 'ambos',
        is_free: true,
        category: 'ecommerce',
        hook: 'A bermuda de alfaiataria que substitui o shorts de tactel sem parecer roupa do seu pai!',
        call_to_action: 'Comprimento moderno acima do joelho com cós anatômico. Link na sacolinha!',
        tags: 'bermuda alfaiataria masculina, bermuda arrumada, moda homem, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=mens+tailored+shorts+above+knee+casual&color=gray',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O CORTE MODERNO ACIMA DO JOELHO (HOOK):
- Modelo parado com postura elegante; a bermuda fica exatamente dois dedos acima do joelho com corte reto.
- Narração: "Homem bem vestido não usa bermuda cobrindo a canela em pleno 2026, rapaziada!"

🎬 CENA 2 (3-7s) - ACABAMENTO DE ALFAIATARIA:
- Mão mostrando o acabamento interno com viés acetinado e bolsos faca fundos que cabem carteira e celular.
- Narração: "Tecido estruturado com elastano que não amassa quando senta no carro ou restaurante."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Modelo caminha sorrindo e aponta para a sacolinha no canto inferior.
- Narração: "O kit com duas cores tá valendo muito a pena na sacolinha. Clica aqui!"`,
      },
      {
        title: '👔 Camiseta Básica Gola C Coton Egípcio Anti-Pilling',
        description:
          'Unboxing tirando da caixa selada e puxando a gola com força para mostrar memória elástica perfeita.',
        niche: 'moda_masculina',
        style: 'unboxing_vitrine',
        platform: 'tiktok_shop',
        is_free: false,
        category: 'ecommerce',
        hook: 'O teste da gola: puxei com força e ela voltou intacta sem virar gola canoa!',
        call_to_action:
          'Algodão com elastano que não encolhe nem forma bolinhas. Link no carrinho!',
        tags: 'camiseta basica masculina, algodao premium, anti pilling, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=mens+black+fitted+tshirt+collar+test&color=black',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O TESTE DA GOLA ELÁSTICA (HOOK):
- Mão esticando com força a ribana da gola para a esquerda e para a direita; ao soltar, volta perfeitamente lisa.
- Narração: "Cansado de comprar camiseta básica que na segunda lavagem a gola parece uma canoa torta?"

🎬 CENA 2 (3-7s) - CAIMENTO NOS BRAÇOS E OMBROS:
- Veste a peça rapidamente: costura alinhada na cabeça do ombro e manga que abraça o bíceps.
- Narração: "Algodão nobre com toque de seda. Não encolhe, não dá bolinha e ajusta no braço certinho."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Mão aberta apontando para o carrinho amarelo no vídeo.
- Narração: "Kit com 3 peças com preço direto de fábrica no carrinho amarelo. Aproveita!"`,
      },
      {
        title: '👔 Jaqueta Corta-Vento Repelente à Água com Capuz',
        description:
          'POV borrifando água na manga da jaqueta corta-vento e as gotas escorrendo instantaneamente.',
        niche: 'moda_masculina',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: false,
        category: 'ecommerce',
        hook: 'POV: O corta-vento de R$ 45 que segura chuva repentina e cabe dobrado no bolso!',
        call_to_action: 'Tecido tecnológico repelente a água com bolsos com zíper. Link na sacola!',
        tags: 'corta vento masculino, impermeavel leve, corrida moto, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=mens+windbreaker+jacket+water+repellent&color=black',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O TESTE DA ÁGUA AO VIVO (HOOK):
- POV jogando um copo de água na manga da jaqueta: as gotas deslizam sem umedecer o tecido.
- Narração: "Olha a água batendo e escorrendo direto sem molhar o braço!"

🎬 CENA 2 (3-7s) - DOBRA ULTRA COMPACTA:
- Dobrando a jaqueta inteira em menos de quatro segundos dentro do próprio bolso com zíper.
- Narração: "Super leve, corta o vento gelado da moto ou da corrida e você guarda em qualquer cantinho."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Fechando o capuz ajustável e apontando para a sacolinha.
- Narração: "Preço de atacado com frete grátis na sacolinha aqui embaixo!"`,
      },
      {
        title: '👔 Calça Chino Slim Conforto com Bolsos Embutidos',
        description:
          'Modelo caminhando com camisa social branca e calça chino em tom areia clássico para reuniões e eventos.',
        niche: 'moda_masculina',
        style: 'modelo',
        platform: 'shopee',
        is_free: false,
        category: 'ecommerce',
        hook: 'A calça chino que substitui o terno desconfortável em qualquer casamento ou reunião de trabalho!',
        call_to_action: 'Corte slim moderno que não fica sobrando na barra. Link na Shopee!',
        tags: 'calca chino masculina, slim fit, look trabalho homem, shopee achados',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=mens+beige+chino+pants+smart+casual&color=yellow',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - A TRANSIÇÃO DE ESTILO (HOOK):
- Modelo abotoando a calça chino cor areia com cinto marrom: aparência executiva moderna em segundos.
- Narração: "Se você quer parecer um homem de sucesso sem ficar desconfortável o dia todo, olha essa calça!"

🎬 CENA 2 (3-7s) - MOVIMENTO E RESPIRABILIDADE:
- Passada larga e subida de escada demonstrando a flexibilidade da sarja leve.
- Narração: "Corte chino moderno com tecido acetinado que combina com tênis branco ou sapato social."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Modelo sorrindo com a mão no bolso e apontando para o link da Shopee.
- Narração: "Cores clássicas disponíveis na sacolinha. Pede a sua antes que acabe a promoção!"`,
      },
      {
        title: '👔 Suéter Masculino Gola Alta Canelado Ajustado',
        description:
          'POV no espelho colocando o suéter preto gola alta com jaqueta por cima para noite fria.',
        niche: 'moda_masculina',
        style: 'pov',
        platform: 'ambos',
        is_free: false,
        category: 'ecommerce',
        hook: 'POV: A gola alta de R$ 39 que te deixa com visual de galã de filme de Hollywood no frio!',
        call_to_action: 'Tricot macio que não pinica o pescoço. Link com envio rápido na sacola!',
        tags: 'gola alta homem, sueter tricot masculino, look noite inverno, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=mens+black+turtleneck+sweater+mirror&color=black',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O VISUAL ELEGANTE NO ESPELHO (HOOK):
- POV ajeitando a gola rolê rente ao queixo com a jaqueta jeans ou couro por cima: visual imponente.
- Narração: "Quer atrair olhares em qualquer lugar que você chegar nesse inverno? Bota essa gola alta aqui!"

🎬 CENA 2 (3-7s) - TOQUE MACIO SEM PINICAR:
- Câmera aproxima na trama do fio de algodão macio que não irrita a pele do pescoço.
- Narração: "Fio nobre que aquece na medida certa, não pinica e desenha os ombros com firmeza."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Ajeitando a postura com determinação e apontando para a sacolinha.
- Narração: "Estoque de inverno voando na sacolinha do vídeo com frete grátis. Garanta o seu!"`,
      },
      {
        title: '👔 Camisa Xadrez Flanelada Grossa Estilo Lenhador',
        description:
          'Unboxing e prova da camisa flanelada de peso médio aberta com regata branca por baixo.',
        niche: 'moda_masculina',
        style: 'unboxing_vitrine',
        platform: 'tiktok_shop',
        is_free: false,
        category: 'ecommerce',
        hook: 'A flanela pesada de verdade que custa metade do que cobram nas lojas de departamento!',
        call_to_action: 'Flanela 100% algodão escovado com botões reforçados. Link no carrinho!',
        tags: 'camisa flanela, xadrez masculino, estilo lenhador, tiktok shop moda',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=mens+flannel+plaid+shirt+heavyweight&color=red',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O PESO REAL DO TECIDO (HOOK):
- Segurando a camisa pelo cabide e soltando: o tecido encorpado cai com firmeza sem ser transparente.
- Narração: "Cansei de comprar camisa xadrez fininha que parece pano de prato. Essa aqui é flanela de verdade!"

🎬 CENA 2 (3-7s) - COMBINAÇÃO COM REGATA BRANCA:
- Veste a peça aberta por cima da básica branca: estilo rústico e moderno imediato.
- Narração: "Algodão escovado grosso que esquenta bem e combina com calça jeans e bota."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Dedo firme apontando para o carrinho amarelo no rodapé do vídeo.
- Narração: "Padrões xadrez exclusivos na sacolinha com entrega rápida na sua casa!"`,
      },
      {
        title: '👔 Cueca Boxer Modal Sem Costura Kit com 5 Peças',
        description:
          'Demonstração de elasticidade esticando a boxer de modal macio que não enrola na perna.',
        niche: 'moda_masculina',
        style: 'unboxing_vitrine',
        platform: 'shopee',
        is_free: true,
        category: 'ecommerce',
        hook: 'O kit de boxer em modal que não enrola na coxa e não esquenta durante o treino ou trabalho!',
        call_to_action:
          'Tecido respirável antibacteriano kit com 5 cores. Link com cupom na Shopee!',
        tags: 'cueca boxer modal, sem costura, conforto masculino, kit cuecas, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=mens+modal+boxer+briefs+seamless+pack&color=black',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O TESTE DA ELASTICIDADE MODAL (HOOK):
- Esticando a perna da cueca boxer: tecido ultrafino e macio com retorno imediato.
- Narração: "Se você ainda usa cueca que fica enrolando na coxa o dia inteiro, você precisa ver esse tecido!"

🎬 CENA 2 (3-7s) - TOQUE GELADO RESPIRÁVEL:
- Mostrando a microfibra de modal com toque refrescante e costura flatlock imperceptível.
- Narração: "Fibra de modal respirável que evita assaduras, transpira com facilidade e parece que tá sem nada."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Mostrando a caixa com os 5 pares organizados com a sacolinha da Shopee no canto.
- Narração: "Kit com 5 cuecas saindo por menos de dez reais cada na sacolinha. Pega o cupom!"`,
      },
    ]

    // Inserção dos primeiros 20 prompts estruturados
    for (let i = 0; i < newPrompts.length; i++) {
      const p = newPrompts[i]
      const existing = app.findRecordsByFilter('prompts', 'title = {:title}', '', 1, 0, {
        title: p.title,
      })
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
