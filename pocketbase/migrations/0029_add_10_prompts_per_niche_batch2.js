/// <reference path="../pb_data/types.d.ts" />

/**
 * Migração 0029:
 * 10 novos prompts para mais 3 nichos de e-commerce:
 * - fitness_academia (10 prompts)
 * - moda_praia (10 prompts)
 * - acessorios_calcados (10 prompts)
 * Total: 30 prompts
 */

migrate(
  (app) => {
    const promptsCol = app.findCollectionByNameOrId('prompts')

    const prompts = [
      // ==========================================
      // FITNESS & ACADEMIA (10 prompts)
      // ==========================================
      {
        title: '💪 Legging Empina Bumbum com Efeito Scrunch Zero Transparência',
        description:
          'POV no espelho da academia fazendo agachamento profundo para provar zero transparência e efeito empina bumbum.',
        niche: 'fitness_academia',
        style: 'pov',
        platform: 'ambos',
        is_free: false,
        category: 'ecommerce',
        hook: 'POV: O agachamento de 100kg pra provar que essa legging da Shopee não fica transparente nem na luz branca!',
        call_to_action: 'Cós alto duplo compressivo que afina a cintura. Link no carrinho amarelo!',
        tags: 'legging empina bumbum, scrunch, treino perna, zero transparencia, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=woman+scrunch+leggings+gym+squat+mirror&color=purple',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O TESTE DO AGACHAMENTO (HOOK):
- POV em frente ao espelho da academia: descendo em agachamento completo com luz de teto direta na calça.
- Narração: "Paguei trinta e cinco reais nessa legging e agachei até o chão na luz branca pra testar!"

🎬 CENA 2 (3-7s) - DETALHES DO SCRUNCH E CÓS:
- Voltinha rápida mostrando o franzido anatômico que desenha o glúteo e o cós que não enrola no abdômen.
- Narração: "Zero transparência, costura reforçada e o cós duplo segura a barriguinha sem descer."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Dá uma batidinha confiante na coxa e aponta para a sacolinha amarela no rodapé.
- Narração: "Mais de dez cores no link aqui da sacolinha com frete grátis. Garante a sua!"`,
      },
      {
        title: '💪 Top Nadador com Bojo Removível e Alta Sustentação',
        description:
          'Modelo pulando corda na academia mostrando que o top nadador segura tudo com conforto.',
        niche: 'fitness_academia',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: false,
        category: 'ecommerce',
        hook: 'O teste do pulo da corda: o top fitness que não deixa nada pular durante o cardio pesado!',
        call_to_action: 'Alças largas e tecido tecnológico de poliamida. Link na sacolinha!',
        tags: 'top fitness, alta sustentacao, treino funcional, corrida, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=fitness+woman+sports+bra+jumping+rope+gym&color=pink',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O TESTE DO CARDIO (HOOK):
- Modelo pulando corda em ritmo acelerado: busto totalmente estabilizado sem nenhum desconforto.
- Narração: "Se você tem seio grande e sofre pra achar top que segure na corrida, olha esse teste!"

🎬 CENA 2 (3-7s) - ALÇAS LARGAS E COSTAS NADADOR:
- Close nas costas nadador anatômicas e na barra elástica reforçada que não sobe com os braços erguidos.
- Narração: "Alças largas acolchoadas que não machucam o ombro e poliamida que seca o suor na hora."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Modelo respira fundo sorrindo e aponta para o carrinho amarelo.
- Narração: "Qualidade de grife por preço de fábrica no carrinho amarelo. Pede o seu!"`,
      },
      {
        title: '💪 Bermuda Ciclista Fitness com Bolso para Celular',
        description:
          'POV colocando o celular grande no bolso lateral da bermuda ciclista e correndo na esteira.',
        niche: 'fitness_academia',
        style: 'pov',
        platform: 'shopee',
        is_free: true,
        category: 'ecommerce',
        hook: 'POV: A bermuda fitness com bolso que segura o celular de 200g sem cair nem puxar a calça pra baixo!',
        call_to_action: 'Tecido encorpado que não enrola na coxa. Link com cupom na Shopee!',
        tags: 'bermuda ciclista, bolso celular, treino corrida, shopee achadinhos',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=biker+shorts+side+phone+pocket+woman+gym&color=black',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O TESTE DO BOLSO NA ESTEIRA (HOOK):
- POV inserindo o smartphone grande no bolso lateral da coxa e acelerando a corrida sem oscilação.
- Narração: "Adeus segurar o celular na mão na academia ou na corrida de rua!"

🎬 CENA 2 (3-7s) - BARRA QUE NÃO ENROLA:
- Ajeitando a barra que abraça a coxa confortavelmente sem marcar gordurinha nem enrolar pra cima.
- Narração: "Comprimento perfeito de meia coxa, elástico firme e zero transparência no treino."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Apontando com a garrafa de água para a sacolinha da Shopee.
- Narração: "Custa menos de trinta reais na sacolinha do vídeo. Pega o cupom agora!"`,
      },
      {
        title: '💪 Conjunto Fitness Canelado Sem Costura Bicolor',
        description:
          'Unboxing abrindo o saquinho com o conjunto canelado sem costura e vestindo no espelho iluminado.',
        niche: 'fitness_academia',
        style: 'unboxing_vitrine',
        platform: 'tiktok_shop',
        is_free: false,
        category: 'ecommerce',
        hook: 'O conjunto sem costura que parece os gringos de R$ 400 mas custou R$ 49 no TikTok Shop!',
        call_to_action: 'Elasticidade 4D e compressão suave. Link no carrinho amarelo!',
        tags: 'conjunto fitness canelado, seamless, sem costura, look academia, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=seamless+ribbed+workout+set+gym+woman&color=green',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O UNBOXING DO CONJUNTO SEAMLESS (HOOK):
- Tirando o conjunto canelado do pacote: textura densa e estampa bicolor moderna e elegante.
- Narração: "Vocês me pediram o conjunto gringo sem costura mais barato da internet e eu achei!"

🎬 CENA 2 (3-7s) - PROVA NO CORPO:
- Veste o look completo: tecido abraça o corpo uniformemente sem apertar ou marcar calcinha.
- Narração: "Tecnologia seamless que comprime a cintura e desenha as curvas com toque macio."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Mão aberta com dedo apontado para o carrinho amarelo no rodapé.
- Narração: "Cores exclusivas no carrinho amarelo com entrega rápida. Garante antes de acabar!"`,
      },
      {
        title: '💪 Camiseta Dry Fit Masculina com Recortes Respiráveis',
        description:
          'Modelo fazendo supino na academia com camiseta dry fit que não empapa de suor nas axilas.',
        niche: 'fitness_academia',
        style: 'modelo',
        platform: 'ambos',
        is_free: false,
        category: 'ecommerce',
        hook: 'A camiseta dry fit que seca o suor do treino pesado em segundos e não fica com cheiro ruim!',
        call_to_action: 'Tecido antibacteriano com microfuros a laser. Link na sacolinha!',
        tags: 'dry fit masculino, treino musculacao, camiseta academia, shopee, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=mens+dryfit+gym+tshirt+workout+chest&color=black',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O TESTE DO TREINO PESADO (HOOK):
- Modelo completando a série pesada de supino: camiseta alinhada no peitoral sem marcas de suor escorrendo.
- Narração: "Treina pesado e sai da academia parecendo que mergulhou na piscina? Olha esse dry fit!"

🎬 CENA 2 (3-7s) - MICROFUROS A LASER:
- Câmera aproxima nos microfuros respiráveis nas costas e axilas que facilitam a ventilação do ar.
- Narração: "Tecido com tratamento antibacteriano que não acumula cheiro de suor e não precisa passar."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Modelo solta os halteres e aponta para a sacolinha no canto da tela.
- Narração: "Kit com três camisetas por um preço ridículo na sacolinha. Aproveita o frete grátis!"`,
      },
      {
        title: '💪 Shorts Duplo com Bolso Térmico Interno para Homem',
        description:
          'POV demonstrando o shorts 2 em 1 com forro de compressão interna e bolso para celular.',
        niche: 'fitness_academia',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: false,
        category: 'ecommerce',
        hook: 'POV: O shorts 2 em 1 que não deixa assadura na coxa e segura a toalha no cós traseiro!',
        call_to_action: 'Porta-toalha integrado e bolso para celular no forro. Link no carrinho!',
        tags: 'shorts corrida 2 em 1, shorts compressao homem, academia, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=mens+2in1+running+shorts+compression+pocket&color=gray',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - A ESTRUTURA DO SHORTS 2 EM 1 (HOOK):
- Levantando a barra externa leve para mostrar a bermuda de compressão interna que protege do atrito.
- Narração: "Quem corre ou treina perna sabe o pesadelo que é assadura na virilha!"

🎬 CENA 2 (3-7s) - PORTA TOALHA E BOLSO INTERNO:
- Encaixando a toalha de treino na alça do cós e guardando o celular no bolso elástico da coxa interna.
- Narração: "Forro que evita atrito, bolso antifurto que não balança e alça traseira pra toalhinha."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Dedo apontando com firmeza para o carrinho amarelo no vídeo.
- Narração: "O shorts fitness mais completo da internet tá na sacolinha. Pega o seu agora!"`,
      },
      {
        title: '💪 Macacão Fitness Costa Nua com Alças Cruzadas',
        description:
          'Modelo virando de costas para o espelho mostrando o decote cavado elegante que valoriza a musculatura dorsal.',
        niche: 'fitness_academia',
        style: 'modelo',
        platform: 'shopee',
        is_free: false,
        category: 'ecommerce',
        hook: 'O macacão fitness costa nua que valoriza os dorsais e modela o glúteo como nenhum outro!',
        call_to_action: 'Poliamida encorpada com costuras duplas. Link na sacolinha Shopee!',
        tags: 'macacao fitness, costa nua, treino superiores, shopee achados',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=cross+back+workout+jumpsuit+woman+gym&color=black',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - A REVELAÇÃO DAS COSTAS CRUZADAS (HOOK):
- Modelo de frente ajustando o cabelo e virando de costas: o desenho das alças cruzadas valoriza a musculatura.
- Narração: "Aquele macacão que quando você chega na academia, até a recepcionista olha!"

🎬 CENA 2 (3-7s) - MODELAGEM CORPORAL COMPLETA:
- Giro lateral rápido mostrando a compressão no abdômen e a sustentação no peitoral sem bojo pesado.
- Narração: "Poliamida de alta gramatura que abraça o corpo inteiro sem marcar nada indesejado."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Modelo sorrindo com a garrafa de shake e apontando para a sacolinha da Shopee.
- Narração: "Preço promocional de fábrica na sacolinha aqui embaixo. Corre antes de esgotar!"`,
      },
      {
        title: '💪 Cinta Modeladora de Treino com Velcro Duplo Reforçado',
        description:
          'POV colocando a cinta térmica ajustando os velcros duplos para suporte lombar e afinar a cintura.',
        niche: 'fitness_academia',
        style: 'pov',
        platform: 'ambos',
        is_free: false,
        category: 'ecommerce',
        hook: 'POV: A cinta de treino de R$ 29 que protege a lombar no terra e afina a cintura com velcro duplo!',
        call_to_action:
          'Neoprene respirável que retém o calor e apoia a coluna. Link na sacolinha!',
        tags: 'cinta treino, suporte lombar, afina cintura, academia, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=waist+trainer+belt+workout+woman+mirror&color=pink',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O AJUSTE DO VELCRO DUPLO (HOOK):
- POV em frente ao espelho puxando as duas faixas elásticas e travando os velcros com estalo sonoro firme.
- Narração: "Sentia dor na lombar no levantamento terra até começar a usar essa cinta com suporte duplo!"

🎬 CENA 2 (3-7s) - COMPRESSÃO E RETENÇÃO TÉRMICA:
- Mãos tocando as hastes flexíveis nas costas que impedem a postura de curvar durante a execução.
- Narração: "Estrutura com hastes que protegem a postura e neoprene que estimula a queima local."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Postura ereta e confiante com mão apontando para a sacolinha.
- Narração: "Tamanhos do P ao extra grande na sacolinha com frete grátis. Aproveita!"`,
      },
      {
        title: '💪 Regata Cavada Masculina Estilo Halterofilista',
        description:
          'Modelo fazendo rosca direta na frente do espelho mostrando a cava que valoriza o bíceps e o peitoral.',
        niche: 'fitness_academia',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: false,
        category: 'ecommerce',
        hook: 'A regata cavada que dá a impressão de 3cm a mais de braço pelo corte perfeito nos ombros!',
        call_to_action: '100% algodão penteado que não encolhe. Link no carrinho amarelo!',
        tags: 'regata cavada, musculacao masculina, look academia homem, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=mens+stringer+tanktop+gym+bodybuilder&color=gray',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O CORTE QUE VALORIZA O BRAÇO (HOOK):
- Modelo executando repetição com halteres: o desenho da cava destaca o bíceps e o deltóide.
- Narração: "Quer parecer maior na academia sem tomar nada? O segredo tá no corte da regata, parceiro!"

🎬 CENA 2 (3-7s) - TECIDO LEVE E FRESCO:
- Câmera mostra a barra arredondada que não sobe ao levantar os braços e o algodão respirável.
- Narração: "Algodão penteado macio que não gruda no suor e costura reforçada nas alças."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Dedo apontando pro carrinho amarelo no vídeo.
- Narração: "Kit com 3 regatas saindo por menos de vinte reais cada na sacolinha. Pega a sua!"`,
      },
      {
        title: '💪 Meia de Compressão Cano Alto Antiderrapante',
        description:
          'Unboxing e demonstração das travas de silicone no solado da meia de cano alto para treino e corrida.',
        niche: 'fitness_academia',
        style: 'unboxing_vitrine',
        platform: 'shopee',
        is_free: true,
        category: 'ecommerce',
        hook: 'O teste no piso liso: essa meia antiderrapante não deixa seu pé escorregar dentro do tênis!',
        call_to_action: 'Pontos de silicone no solado e compressão no arco do pé. Link na Shopee!',
        tags: 'meia antiderrapante, meia compressao cano alto, crossfit corrida, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=grip+socks+running+anti+slip+unboxing&color=white',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O TESTE NO PISO LISO (HOOK):
- Tentando deslizar o pé no piso de porcelanato: o solado com grip de silicone freia instantaneamente.
- Narração: "Pé escorregando dentro do tênis no leg press nunca mais com essa meia aqui!"

🎬 CENA 2 (3-7s) - COMPRESSÃO NO ARCO PLANTAR:
- Mostrando a faixa elástica que envolve o arco do pé e a malha atoalhada com amortecimento.
- Narração: "Compressão que ativa a circulação e tecido atoalhado que evita bolhas nas corridas longas."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Mostrando o kit com 3 pares com a sacolinha da Shopee no canto inferior.
- Narração: "Precinho de fábrica no link da Shopee. Aproveite o cupom de frete grátis!"`,
      },

      // ==========================================
      // MODA PRAIA (10 prompts)
      // ==========================================
      {
        title: '👙 Biquíni Meia Taça Estruturado com Aro e Bojo Removível',
        description:
          'POV no espelho com biquíni meia taça que junta e levanta o busto sem apertar as costas.',
        niche: 'moda_praia',
        style: 'pov',
        platform: 'ambos',
        is_free: false,
        category: 'ecommerce',
        hook: 'POV: O biquíni de R$ 39 que empinou meu busto como se eu tivesse acabado de colocar silicone!',
        call_to_action: 'Aro reforçado e tecido texturizado acetinado. Link na sacolinha!',
        tags: 'biquini meia taca, aro sustentacao, moda praia chic, verao, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=underwire+bikini+top+woman+beach+mirror&color=red',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O EFEITO PUSH-UP NA PRAIA (HOOK):
- POV em frente ao espelho com chapéu de palha e o biquíni meia taça estruturado que modela o decote.
- Narração: "Duvido você achar um biquíni que junte e levante o busto melhor que esse meia taça!"

🎬 CENA 2 (3-7s) - CALCINHA ASA DELTA ANATÔMICA:
- Voltinha rápida mostrando a calcinha asa delta com costura embutida que não marca o culote.
- Narração: "Aro contínuo que não aperta as costelas e calcinha asa delta que alonga as pernas."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Ajeitando a saída de praia com a mão e apontando para a sacolinha amarela.
- Narração: "Várias cores da estação na sacolinha do vídeo com frete grátis. Pega o seu!"`,
      },
      {
        title: '👙 Saída de Praia Chemise Longa em Seda de Algodão',
        description:
          'Modelo caminhando no deck da piscina ao pôr do sol com a chemise aberta esvoaçando com o vento.',
        niche: 'moda_praia',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: false,
        category: 'ecommerce',
        hook: 'A saída de praia que faz qualquer biquíni simples parecer look de resort cinco estrelas!',
        call_to_action: 'Tecido leve e fluido com botões em concha. Link no carrinho amarelo!',
        tags: 'chemise praia longa, saida de praia chic, resort wear, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=long+beach+coverup+shirt+woman+pool+sunset&color=white',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O VOO DO TECIDO AO VENTO (HOOK):
- Modelo caminhando com elegância na beira da piscina; a camisa longa esvoaça sob a luz dourada do pôr do sol.
- Narração: "Você não precisa gastar rios de dinheiro pra ter fotos com cara de resort de luxo!"

🎬 CENA 2 (3-7s) - TOQUE MACIO E TRANSPARÊNCIA ELEGANTE:
- Close nos botões naturais e na transparência sutil que valoriza o biquíni por baixo.
- Narração: "Tecido leve de secagem rápida que não amassa na mala de viagem e te deixa elegante."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Modelo sorri arrumando os óculos e aponta para o carrinho amarelo.
- Narração: "A peça mais elogiada da sua viagem tá na sacolinha por um preço inacreditável!"`,
      },
      {
        title: '👙 Maiô Cavado com Decote em V Profundo e Costas Abertas',
        description:
          'POV entrando na água cristalina com maiô estruturado que modela o abdômen e valoriza o colo.',
        niche: 'moda_praia',
        style: 'pov',
        platform: 'shopee',
        is_free: false,
        category: 'ecommerce',
        hook: 'POV: O maiô de R$ 42 da Shopee que segura o corpo inteiro e ainda vira body pra sair à noite!',
        call_to_action: 'Forro duplo e tecido com proteção UV50+. Link na sacolinha Shopee!',
        tags: 'maio cavado, decote v, body praia noite, shopee achados',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=plunging+one+piece+swimsuit+woman+beach&color=black',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - A ELEGÂNCIA DO MAIÔ BODY (HOOK):
- POV em frente ao espelho da pousada: o decote V profundo alonga a silhueta com extrema sofisticação.
- Narração: "Comprei achando que era só um maiô simples e recebi a peça mais chique do meu armário!"

🎬 CENA 2 (3-7s) - FORRO DUPLO QUE COMPRIME:
- Mão tocando o abdômen para demonstrar o forro duplo que dá firmeza total sem apertar o estômago.
- Narração: "Tecido com proteção UV que não marca celulite e vira body perfeito com calça pantalona."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Coloca um short jeans por cima: look noturno pronto com dedo na sacolinha da Shopee.
- Narração: "Link direto na sacolinha com cupom de desconto exclusivo. Garanta antes do lote acabar!"`,
      },
      {
        title: '👙 Biquíni Cortininha Canelado com Ponteiras Banhadas a Ouro',
        description:
          'Unboxing mostrando as ponteiras douradas que não enferrujam na água salgada e o tecido canelado macio.',
        niche: 'moda_praia',
        style: 'unboxing_vitrine',
        platform: 'tiktok_shop',
        is_free: true,
        category: 'ecommerce',
        hook: 'O detalhe das ponteiras douradas que não enferrujam no mar e deixam a marquinha mais perfeita!',
        call_to_action: 'Canelado premium com ponteiras antioxidantes. Link no carrinho!',
        tags: 'biquini cortininha, ponteiras ouro, marquinha perfeita, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=gold+tip+ribbed+bikini+flatlay+beach&color=orange',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O BRILHO DAS PONTEIRAS (HOOK):
- Tirando o biquíni do estojo plástico: ponteiras metálicas douradas reluzindo sob a luz do sol.
- Narração: "Sabe aquele biquíni que faz marquinha de fita fininha sem machucar o pescoço?"

🎬 CENA 2 (3-7s) - ELASTICIDADE DO CANELADO:
- Esticando o tecido canelado com toque macio e mostrando a cordinha fina de amarração dupla.
- Narração: "Ferragens com banho marítimo que não oxidam e tecido canelado que seca em minutos."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Mão apontando para o carrinho amarelo no canto inferior da tela.
- Narração: "A cor terracota e pink neon estão na sacolinha com frete grátis. Aproveita!"`,
      },
      {
        title: '👙 Shorts Praia Masculino Estampado com Secagem Turbo',
        description:
          'Modelo mergulhando na piscina e saindo da água mostrando que o shorts seca em menos de 3 minutos.',
        niche: 'moda_praia',
        style: 'modelo',
        platform: 'ambos',
        is_free: false,
        category: 'ecommerce',
        hook: 'O shorts de praia masculino que não fica pesado de água e seca antes de você sentar no quiosque!',
        call_to_action: 'Tecido 4-way stretch com sunga interna macia. Link na sacolinha!',
        tags: 'shorts praia masculino, secagem rapida, moda praia homem, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=mens+swim+trunks+water+drop+poolside&color=blue',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O TESTE DA ÁGUA AO VIVO (HOOK):
- Modelo saindo da água: o tecido repele a água e escorre rapidamente sem ficar colado nas pernas.
- Narração: "Chega de voltar da praia com aquele calção pesado e encharcado que demora horas pra secar!"

🎬 CENA 2 (3-7s) - FORRO INTERNO ANATÔMICO:
- Mão mostrando a cueca interna em microfibra macia que não machuca as coxas nem acumula areia.
- Narração: "Elastano em quatro direções com forro macio anti-areia e bolsos com dreno de água."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Modelo sorrindo com os óculos de sol na cabeça e apontando para a sacolinha.
- Narração: "Estampas exclusivas de verão saindo por preço de fábrica no link aqui embaixo!"`,
      },
      {
        title: '👙 Vestido de Crochê Artesanal Saída de Praia Vazado',
        description:
          'POV desfilando na areia da praia com vestido longo de crochê com transparência sofisticada.',
        niche: 'moda_praia',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: false,
        category: 'ecommerce',
        hook: 'POV: O vestido de crochê que parece feito à mão em Trancoso por R$ 59 no TikTok Shop!',
        call_to_action: 'Fio de algodão macio que não deforma na água. Link no carrinho amarelo!',
        tags: 'vestido croche praia, saida trancoso, look praia chic, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=crochet+beach+dress+woman+sand+beach&color=white',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - A TRAMA ARTESANAL NO CORPO (HOOK):
- POV caminhando na beira do mar: os pontos vazados do crochê criam sombras lindas sobre o biquíni.
- Narração: "Paguei menos de sessenta reais nesse vestido de crochê e pareço herdeira em Trancoso!"

🎬 CENA 2 (3-7s) - DETALHE DA BARRA COM FRANJAS:
- Câmera aproxima nas franjas leves na barra e no decote nas costas com amarração delicada.
- Narração: "Fio de algodão leve que não pesa quando molha e tem um caimento impecável no corpo."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Girinho rápido mostrando o pôr do sol e dedo apontando para o carrinho amarelo.
- Narração: "O estoque dessa peça acaba em horas! Clica no carrinho amarelo e garante o seu."`,
      },
      {
        title: '👙 Biquíni Retrô Cintura Alta Hot Pants com Cinto',
        description:
          'Modelo posando em espreguiçadeira com biquíni hot pants com cinto e fivela de tartaruga.',
        niche: 'moda_praia',
        style: 'modelo',
        platform: 'shopee',
        is_free: false,
        category: 'ecommerce',
        hook: 'O biquíni retrô cintura alta que segura a barriguinha e te deixa com elegância de diva de cinema!',
        call_to_action: 'Cós compressivo duplo com fivela em resina. Link na sacolinha Shopee!',
        tags: 'biquini hot pants, cintura alta, retro vintage praia, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=high+waist+retro+bikini+woman+sunbed&color=cyan',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O CHARME DA DIVA RETRÔ (HOOK):
- Modelo com chapéu grande e óculos gatinho na espreguiçadeira com o biquíni hot pants acinturado.
- Narração: "Quem disse que pra usar biquíni precisa ficar desconfortável com calcinha minúscula?"

🎬 CENA 2 (3-7s) - CÓS ALTO COM CINTO DE RESINA:
- Close no cinto com fivela de tartaruga que desenha a cintura e na compressão suave sobre o abdômen.
- Narração: "Cintura alta com compressão que disfarça a barriguinha e top com suporte reforçado."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Modelo ajeita a taça de suco e aponta para a sacolinha da Shopee.
- Narração: "Elegância pura com frete grátis na sacolinha da Shopee. Confere as cores!"`,
      },
      {
        title: '👙 Canga Saída de Praia Toalha 2 em 1 Aveludada',
        description:
          'Unboxing estendendo a canga na areia e demonstrando que a areia não gruda no tecido aveludado.',
        niche: 'moda_praia',
        style: 'unboxing_vitrine',
        platform: 'ambos',
        is_free: false,
        category: 'ecommerce',
        hook: 'O teste da areia: a canga toalha que você sacode e NENHUM grão de areia fica grudado!',
        call_to_action: 'Tecido aveludado anti-areia com secagem ultrarrápida. Link na sacola!',
        tags: 'canga toalha, anti areia, acessorios praia, shopee, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=sandfree+beach+towel+blanket+unboxing&color=yellow',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O TESTE DA AREIA AO VIVO (HOOK):
- Jogando um punhado de areia seca sobre a canga e sacudindo com uma mão: a areia cai totalmente limpa.
- Narração: "Olha isso! A areia simplesmente não gruda no tecido, você sacode e ela tá limpinha!"

🎬 CENA 2 (3-7s) - VERSATILIDADE COMO SAÍDA DE PRAIA:
- Amarrando a canga no pescoço em dois segundos como vestido tomara que caia elegante.
- Narração: "Super macia, absorve água como toalha e ainda vira vestido ou saia pra você almoçar."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Mostrando a bolsa de transporte compacta com o dedo apontando para a sacolinha.
- Narração: "Item obrigatório pra sua mala de praia! Clica na sacolinha aqui embaixo."`,
      },
      {
        title: '👙 Biquíni Cortininha Dupla Face 4 Cores em 1 Peça',
        description:
          'POV virando o biquíni do avesso para demonstrar que você tem 4 combinações com um único conjunto.',
        niche: 'moda_praia',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: false,
        category: 'ecommerce',
        hook: 'POV: O biquíni dupla face que te dá 4 looks diferentes na mala pagando o preço de um só!',
        call_to_action:
          'Costura embutida invisível sem etiqueta exposta. Link no carrinho amarelo!',
        tags: 'biquini dupla face, 4 em 1, mala inteligente praia, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=reversible+bikini+two+sided+beach+woman&color=pink',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O TRUQUE DO DUPLA FACE (HOOK):
- POV virando a peça na mão: de um lado é preto liso, do outro é estampado floral vibrante.
- Narração: "Como economizar espaço na mala de viagem e ter quatro biquínis pagando trinta reais?"

🎬 CENA 2 (3-7s) - AS QUATRO COMBINAÇÕES:
- Mostrando rapidamente no cabide: top estampado com calcinha preta, invertido, ou combinando tudo.
- Narração: "Costura embutida sem nenhuma etiqueta aparecendo e tecido de poliamida toque de seda."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Segura o conjunto no espelho e aponta para o carrinho amarelo no canto.
- Narração: "Mala inteligente de viagem tá no carrinho amarelo com entrega rápida. Pega o seu!"`,
      },
      {
        title: '👙 Chapéu de Palha Dobrável com Proteção UV para Mala',
        description:
          'Modelo amassando o chapéu de praia dentro da bolsa e desdobrando intacto sem nenhuma marca.',
        niche: 'moda_praia',
        style: 'unboxing_vitrine',
        platform: 'shopee',
        is_free: true,
        category: 'ecommerce',
        hook: 'O teste do chapéu dobrável: amassei dentro da mala e ele voltou perfeito sem quebrar a palha!',
        call_to_action: 'Palha flexível com proteção solar UV50+ e laço ajustável. Link na Shopee!',
        tags: 'chapeu praia dobravel, protecao solar, acessorio praia, shopee achados',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=foldable+straw+beach+hat+woman+suitcase&color=yellow',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O TESTE DA DOBRA NA MALA (HOOK):
- Enrolando o chapéu de palha como um canudinho e tirando de dentro da bolsa de praia: abre sem vinco.
- Narração: "Cansada de viajar segurando chapéu de praia na mão pra não quebrar na mala?"

🎬 CENA 2 (3-7s) - ABA LARGA E PROTEÇÃO UV:
- Coloca na cabeça: a aba de dez centímetros cobre o rosto e o colo perfeitamente do sol forte.
- Narração: "Palha sintética flexível com proteção solar cinquenta mais e regulagem interna de tamanho."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Modelo sorrindo com os óculos escuros e dedo na sacolinha da Shopee.
- Narração: "Custa menos de vinte reais na sacolinha da Shopee com frete grátis. Aproveita!"`,
      },

      // ==========================================
      // ACESSÓRIOS & CALÇADOS (10 prompts)
      // ==========================================
      {
        title: '👠 Papete Anatômica em Couro com Fivelas Metalizadas',
        description:
          'POV apertando a palmilha acolchoada estilo nuvem e caminhando no piso de madeira sem barulho.',
        niche: 'acessorios_calcados',
        style: 'pov',
        platform: 'ambos',
        is_free: false,
        category: 'ecommerce',
        hook: 'POV: A papete de fivela que parece de marca de luxo de shopping por R$ 49 na Shopee!',
        call_to_action: 'Palmilha anatômica acolchoada e fivelas ajustáveis. Link na sacolinha!',
        tags: 'papete anatomica, fivelas douradas, calcado confortavel, shopee, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=leather+buckle+slides+sandals+comfort+pov&color=black',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O TESTE DO CONFORTO NA PALMILHA (HOOK):
- POV polegar afundando na palmilha acolchoada super macia e mostrando as fivelas douradas reluzentes.
- Narração: "Se você tem esporão ou dor no calcanhar, essa papete vai ser o alívio dos seus pés!"

🎬 CENA 2 (3-7s) - CAMINHADA COM LOOK CASUAL:
- Passos no piso de madeira mostrando que o solado antiderrapante não faz barulho nem escorrega.
- Narração: "Palmilha anatômica que abraça o arco do pé e tiras ajustáveis em couro macio."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Ajeitando a calça jeans reta sobre o calçado e apontando para a sacolinha amarela.
- Narração: "Mais de dez mil avaliações cinco estrelas na sacolinha. Pega o seu tamanho!"`,
      },
      {
        title: '👠 Bolsa Baguete Croco com Alça de Corrente Dourada',
        description:
          'Modelo caminhando com a bolsa baguete croco no ombro e retirando batom e celular com facilidade.',
        niche: 'acessorios_calcados',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: false,
        category: 'ecommerce',
        hook: 'A bolsinha croco de R$ 32 que cabe o celular grande e deixa qualquer roupa básica com cara de milionária!',
        call_to_action: 'Textura croco envernizada e zíper antifurto. Link no carrinho amarelo!',
        tags: 'bolsa baguete, textura croco, corrente dourada, tiktok shop moda',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=croc+leather+baguette+bag+chain+woman&color=black',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O BRILHO DA TEXTURA CROCO (HOOK):
- Modelo com casaco preto caminhando; a corrente dourada e o couro croco reluzem sob as luzes da cidade.
- Narração: "Disseram que era impossível bolsa de trinta reais parecer de grife internacional!"

🎬 CENA 2 (3-7s) - O TESTE DO 'O QUE CABE':
- Abrindo a bolsa num clique: tirando o celular de tela grande, porta-cartão, batom e chave sem aperto.
- Narração: "Textura croco reforçada que não descasca e forro interno macio com bolsinho secreto."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Modelo sorri confiante no ombro e aponta para o carrinho amarelo no rodapé.
- Narração: "Frete grátis e envio rápido na sacolinha aqui embaixo. Corre antes de zerar o estoque!"`,
      },
      {
        title: '👠 Tênis Chunky Plataforma Leve com Amortecimento em Gel',
        description:
          'POV saltando com o tênis chunky mostrando que ele pesa menos de 250 gramas por pé.',
        niche: 'acessorios_calcados',
        style: 'pov',
        platform: 'shopee',
        is_free: false,
        category: 'ecommerce',
        hook: 'POV: O tênis plataforma que te dá 5cm a mais de altura e é mais leve que um chinelo de borracha!',
        call_to_action: 'Solado em EVA injetado ultra leve e palmilha em gel. Link na Shopee!',
        tags: 'tenis chunky plataforma, tenis leve academia, 5cm altura, shopee achados',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=white+chunky+platform+sneakers+woman+feet&color=white',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O TESTE DO PESO NA BALANÇA (HOOK):
- POV pesando o tênis numa balancinha de cozinha: marca menos de duzentos e cinquenta gramas.
- Narração: "Você olha esse tênis plataforma robusto e acha que vai pesar uma tonelada, né?"

🎬 CENA 2 (3-7s) - PULO NO PÉ E FLEXIBILIDADE:
- Dando pulinhos leves com o tênis no pé: o solado flexiona com suavidade absorvendo o impacto.
- Narração: "Solado de EVA injetado macio que dá cinco centímetros a mais sem cansar as pernas."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Ajeitando a meia cano médio estilosa e apontando para a sacolinha da Shopee.
- Narração: "Combina com tudo e custa menos da metade da marca famosa. Clica no link!"`,
      },
      {
        title: '👠 Cinto Feminino Fivela Dourada Minimalista em Couro Sintético',
        description:
          'Unboxing e demonstração no espelho acinturando um blazer oversized em menos de 5 segundos.',
        niche: 'acessorios_calcados',
        style: 'unboxing_vitrine',
        platform: 'tiktok_shop',
        is_free: true,
        category: 'ecommerce',
        hook: 'O truque de styling de R$ 15 que transforma qualquer camisa ou blazer largo num look acinturado!',
        call_to_action: 'Fivela dourada antioxidante com furos extras. Link no carrinho amarelo!',
        tags: 'cinto fivela dourada, truque styling, afina cintura blazer, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=gold+buckle+leather+belt+woman+blazer&color=orange',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - A TRANSFORMAÇÃO DO BLAZER (HOOK):
- Blazer preto reto sem graça no espelho; a mulher coloca o cinto com fivela dourada e acintura o look na hora.
- Narração: "O acessório de quinze reais que transforma roupa larga em look de mulher empoderada!"

🎬 CENA 2 (3-7s) - FIVELA MACIÇA ANTIOXIDANTE:
- Close na fivela geométrica de metal zamac que não descasca e nas bordas seladas do couro.
- Narração: "Fivela de metal pesado com acabamento escovado que não fica verde com o uso."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Mão aberta com dedo indicador no carrinho amarelo no vídeo.
- Narração: "Kit com duas cores saindo por preço de uma na sacolinha amarela. Pede agora!"`,
      },
      {
        title: '👠 Sandália de Salto Bloco Baixo com Tiras Finas e Amarração',
        description:
          'Modelo caminhando no piso de calçada portuguesa mostrando a estabilidade total do salto bloco de 4cm.',
        niche: 'acessorios_calcados',
        style: 'modelo',
        platform: 'ambos',
        is_free: false,
        category: 'ecommerce',
        hook: 'A sandália de salto bloco que você consegue usar em casamento no gramado ou trabalhar 8 horas em pé!',
        call_to_action: 'Salto bloco 4cm estável com palmilha acolchoada. Link na sacolinha!',
        tags: 'sandalia salto bloco, conforto casamento, tiras finas amarracao, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=block+heel+strappy+sandals+woman+feet+dress&color=pink',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O TESTE DA CALÇADA IRREGULAR (HOOK):
- Passada firme da modelo com o salto bloco de quatro centímetros pisando com segurança em pedras irregulares.
- Narração: "Chega de afundar salto na grama ou quebrar o tornozelo na calçada da rua!"

🎬 CENA 2 (3-7s) - TIRAS MACIAS QUE NÃO CORTAM A PELE:
- Close nas tiras finas com acabamento tubular aveludado que abraçam os dedos sem apertar.
- Narração: "Tiras tubulares macias que não dão bolhas e salto bloco anatômico super seguro."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Modelo sorrindo com vestido fluido e apontando para a sacolinha.
- Narração: "A sandália mais confortável do seu armário tá na sacolinha com cupom de desconto!"`,
      },
      {
        title: '👠 Óculos de Sol Retrô Unissex Proteção UV400 Tartaruga',
        description:
          'POV colocando os óculos de sol retrô dirigindo no carro contra a luz do sol forte.',
        niche: 'acessorios_calcados',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: false,
        category: 'ecommerce',
        hook: 'POV: O óculos de sol de R$ 18 que tira todo o reflexo do sol e te deixa com cara de rico no carro!',
        call_to_action: 'Lentes polarizadas com proteção UV400 certificada. Link no carrinho!',
        tags: 'oculos escuros retro, protecao uv400, tartaruga unissex, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=tortoise+retro+sunglasses+woman+car+sun&color=orange',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - A VISÃO CONTRA O SOL FORTE (HOOK):
- POV no retrovisor do carro contra o sol da tarde: colocando os óculos tartaruga e a visão fica nítida e sem reflexo.
- Narração: "Paguei menos de vinte reais nesse óculos e ele é melhor que o meu de quatrocentos da ótica!"

🎬 CENA 2 (3-7s) - DOBRADIÇA DE METAL REFORÇADA:
- Abrindo e fechando as hastes para comprovar a pressão firme da dobradiça de metal com acetato nobre.
- Narração: "Lentes com proteção UV quatrocentos de verdade e armação reforçada que não entorta."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Sorriso no retrovisor com a mão apontando para o carrinho amarelo no rodapé.
- Narração: "Acompanha case e lencinho de microfibra na sacolinha. Pega o seu antes de zerar!"`,
      },
      {
        title: '👠 Mochila Executiva Antifurto Impermeável com Porta USB',
        description:
          'Demonstração de todos os compartimentos organizados da mochila: notebook, garrafa e powerbank.',
        niche: 'acessorios_calcados',
        style: 'unboxing_vitrine',
        platform: 'shopee',
        is_free: false,
        category: 'ecommerce',
        hook: 'O que cabe na mochila antifurto que aguenta chuva torrencial e carrega o celular na rua!',
        call_to_action: 'Tecido Oxford impermeável com zíper traseiro secreto. Link na Shopee!',
        tags: 'mochila antifurto, cabe notebook, impermeavel faculdade, shopee achados',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=antitheft+backpack+laptop+waterproof+unboxing&color=gray',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O TESTE DO NOTEBOOK E ÁGUA (HOOK):
- Colocando o notebook de quinze polegadas na divisória acolchoada e jogando água por fora: repele tudo.
- Narração: "A mochila definitiva pra quem anda de ônibus, metrô ou moto com eletrônico na chuva!"

🎬 CENA 2 (3-7s) - PORTA USB E BOLSO ANTIFURTO:
- Conectando o cabo no plugue lateral USB externo e mostrando o bolso secreto encostado nas costas.
- Narração: "Carrega seu celular por fora, tem bolso antifurto nas costas e divisórias inteligentes."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Coloca a mochila nas costas com postura ereta e aponta para a sacolinha da Shopee.
- Narração: "O preço mais baixo da internet com frete grátis no link da Shopee. Aproveita!"`,
      },
      {
        title: '👠 Chinelo Slide Nuvem Unissex EVA Ortopédico Macio',
        description:
          'Polegar afundando no solado de 4cm do chinelo nuvem e caminhando após dia longo de trabalho.',
        niche: 'acessorios_calcados',
        style: 'pov',
        platform: 'ambos',
        is_free: true,
        category: 'ecommerce',
        hook: 'POV: Chegar em casa depois de 9h de salto e pisar nesse chinelo nuvem é a melhor sensação da vida!',
        call_to_action: 'EVA premium ortopédico com solado antiderrapante. Link na sacolinha!',
        tags: 'chinelo nuvem, conforto esporao, descanso pes, shopee, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=pillow+slides+slippers+soft+eva+feet&color=pink',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O AFUNDAR SATISFATÓRIO NO SOLADO (HOOK):
- POV tirando o sapato de trabalho e calçando o slide nuvem: o pé afunda no amortecimento macio.
- Narração: "Se você chega em casa com os pés latejando de dor, você precisa experimentar isso aqui!"

🎬 CENA 2 (3-7s) - SOLADO DE 4CM ANTIDERRAPANTE:
- Câmera mostra a espessura de quatro centímetros de EVA puro e o solado texturizado que não escorrega no box.
- Narração: "EVA ortopédico que reduz o impacto na coluna e alivia dores no calcanhar na hora."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Relaxando no sofá com os dois pés para cima e apontando para a sacolinha amarela.
- Narração: "Menos de vinte e cinco reais na sacolinha com frete grátis. Pede um pra cada da casa!"`,
      },
      {
        title: '👠 Bota Coturno Tratorada Cano Médio em Couro Vegano',
        description:
          'Modelo caminhando no asfalto com vestido floral e o coturno tratorado que une atitude e conforto.',
        niche: 'acessorios_calcados',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: false,
        category: 'ecommerce',
        hook: 'O coturno tratorado que não machuca o calcanhar e aguenta chuva, festival e horas em pé!',
        call_to_action: 'Zíper lateral prático que dispensa amarrar o cadarço. Link no carrinho!',
        tags: 'coturno tratorado, bota couro vegano, look festival inverno, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=chunky+combat+boots+woman+street+dress&color=black',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - A PASSADA PODEROSA NA RUA (HOOK):
- Passada firme da modelo com o coturno tratorado preto: atitude marcante que transforma o look simples.
- Narração: "Aquele coturno que você coloca e na mesma hora se sente pronta pra dominar o mundo!"

🎬 CENA 2 (3-7s) - ZÍPER LATERAL PRÁTICO:
- Abrindo o zíper lateral para demonstrar como é rápido calçar sem precisar desamarrar os cadarços.
- Narração: "Solado tratorado leve com costura blaqueada e zíper lateral que facilita na correria."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Modelo para em pose de revista e aponta com atitude para o carrinho amarelo.
- Narração: "Qualidade inacreditável pelo preço na sacolinha amarela. Garante o seu tamanho!"`,
      },
      {
        title: '👠 Carteira Slim Antifurto com Bloqueio RFID e Ejetor Pop-Up',
        description:
          'Unboxing apertando o botão lateral e todos os cartões saltando em cascata organizados.',
        niche: 'acessorios_calcados',
        style: 'unboxing_vitrine',
        platform: 'shopee',
        is_free: true,
        category: 'ecommerce',
        hook: 'O teste do ejetor pop-up: apertei o botão e todos os cartões saíram na ordem perfeita sem cair!',
        call_to_action:
          'Alumínio de aviação com bloqueador RFID contra golpes por aproximação. Link na Shopee!',
        tags: 'carteira slim pop up, bloqueio rfid antifurto, carteira homem, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=popup+cardholder+wallet+rfid+blocking&color=black',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O DISPARO DO EJETOR POP-UP (HOOK):
- Apertando o gatilho metálico na base da carteira: cinco cartões sobem em cascata perfeitamente alinhados.
- Narração: "Chega de carregar aquela carteira gorda de couro que deforma o bolso da sua calça!"

🎬 CENA 2 (3-7s) - PROTEÇÃO ANTIFURTO RFID:
- Mostrando a carcaça de alumínio que bloqueia maquininhas de golpe por aproximação na rua ou metrô.
- Narração: "Blindagem de alumínio contra clonagem de cartão e compartimento para cédulas dobradas."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Guardando no bolso da frente da calça com extrema discrição e apontando para a sacolinha da Shopee.
- Narração: "A carteira mais vendida da internet por menos de vinte reais no link aqui da Shopee!"`,
      },
    ]

    for (let i = 0; i < prompts.length; i++) {
      const p = prompts[i]
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
