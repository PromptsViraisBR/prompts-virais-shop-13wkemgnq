/// <reference path="../pb_data/types.d.ts" />

/**
 * Migração 0030:
 * 10 novos prompts para:
 * - streetwear_casual (10 prompts)
 * - infantil_kids (10 prompts)
 * - lingerie_pijamas (10 prompts)
 * Total: 30 prompts
 */

migrate(
  (app) => {
    const promptsCol = app.findCollectionByNameOrId('prompts')

    const prompts = [
      // ==========================================
      // STREETWEAR & CASUAL (10 prompts)
      // ==========================================
      {
        title: '🔥 Camiseta Oversized Streetwear com Estampa Silk Alta Definição',
        description:
          'POV no espelho com corte oversized autêntico caindo reto nos ombros sem deformar a silhueta.',
        niche: 'streetwear_casual',
        style: 'pov',
        platform: 'ambos',
        is_free: false,
        category: 'ecommerce',
        hook: 'POV: A camiseta oversized de R$ 39 que tem a gola gorda e pesada das marcas de R$ 250!',
        call_to_action: 'Algodão pesado 220g com estampa em silk HD. Link na sacolinha!',
        tags: 'oversized streetwear, gola gorda ribana, camiseta street masculina, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=oversized+streetwear+tshirt+heavyweight+mirror&color=black',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O CAIMENTO PESADO DO STREETWEAR (HOOK):
- POV em frente ao espelho com calça baggy: a camiseta cai estruturada nos ombros com a manga rente ao cotovelo.
- Narração: "Cansado de comprar oversized fina que parece pijama velho do seu irmão?"

🎬 CENA 2 (3-7s) - GOLA DE 3CM COM RIBANA GROSSA:
- Puxando a gola canelada grossa de três centímetros que não deforma e mostrando a estampa fosca no peito.
- Narração: "Malha encorpada de duzentas e vinte gramas, estampa em silk que não racha e gola estruturada."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Ajeitando o boné e apontando com as duas mãos para a sacolinha amarela no rodapé.
- Narração: "Preço de lançamento na sacolinha do vídeo com frete grátis. Aproveita!"`,
      },
      {
        title: '🔥 Calça Cargo Streetwear com 6 Bolsos e Barra Regulável',
        description:
          'Modelo caminhando no asfalto com tênis clássico e ajustando o elástico da barra cargo.',
        niche: 'streetwear_casual',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: false,
        category: 'ecommerce',
        hook: 'A calça cargo que você usa reta ou jogger com um clique no regulador da barra!',
        call_to_action: 'Ripstop reforçado anti-rasgo com 6 bolsos funcionais. Link no carrinho!',
        tags: 'calca cargo streetwear, ripstop 6 bolsos, barra ajustavel, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=streetwear+cargo+pants+pockets+sneakers&color=black',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O AJUSTE DA BARRA NO TÊNIS (HOOK):
- Puxando o elástico com tanca na barra: a calça passa de caimento reto baggy para jogger em um segundo.
- Narração: "A melhor calça cargo que você vai encontrar na internet por menos de cinquenta reais!"

🎬 CENA 2 (3-7s) - ESPAÇO DOS BOLSOS LATERAIS:
- Abrindo a tampa com velcro do bolso lateral cabendo carteira, fone e chave com sobra de espaço.
- Narração: "Tecido ripstop resistente que não rasga, bolsos fundos e cós com elástico confortável."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Modelo dá um passo de breakdance leve e aponta para o carrinho amarelo no vídeo.
- Narração: "Disponível nas cores preta, bege e verde militar no carrinho amarelo. Pede a sua!"`,
      },
      {
        title: '🔥 Moletom Canguru Flanelado com Capuz Forrado Duplo',
        description:
          'POV colocando o capuz pesado do moletom que fica armado e ereto sem desmilinguir.',
        niche: 'streetwear_casual',
        style: 'pov',
        platform: 'shopee',
        is_free: true,
        category: 'ecommerce',
        hook: 'POV: O capuz desse moletom que fica armado e cobre o rosto inteiro no vento frio!',
        call_to_action: 'Flanelado 3 cabos pesado com capuz duplo. Link na Shopee!',
        tags: 'moletom canguru flanelado, capuz estruturado, inverno streetwear, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=hoodie+heavyweight+double+hood+mirror+pov&color=gray',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O CAPUZ ESTRUTURADO NO TOPO (HOOK):
- POV puxando o capuz: o forro duplo mantém a estrutura firme em volta do rosto sem tombar.
- Narração: "Se você tem ódio de moletom com capuz fino que parece touca de banho, olha esse aqui!"

🎬 CENA 2 (3-7s) - FORRO INTERNO QUENTINHO:
- Virando o punho para mostrar a pelúcia felpuda interna macia e a ribana elástica pesada.
- Narração: "Algodão três cabos flanelado grosso que segura o frio pesado sem encolher na máquina."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Cruzando os braços com postura street e apontando para a sacolinha da Shopee.
- Narração: "Preço direto da confecção no link da sacolinha. Pega o cupom de frete grátis!"`,
      },
      {
        title: '🔥 Bermuda Jeans Baggy Desgastada Estilo Anos 90',
        description:
          'Unboxing e demonstração da bermuda jeans larga abaixo do joelho com lavagem vintage impecável.',
        niche: 'streetwear_casual',
        style: 'unboxing_vitrine',
        platform: 'tiktok_shop',
        is_free: false,
        category: 'ecommerce',
        hook: 'A bermuda jeans baggy anos 90 que as marcas de skate cobram R$ 300 por R$ 54 no TikTok Shop!',
        call_to_action: 'Jeans 100% algodão 12oz com costuras reforçadas. Link no carrinho!',
        tags: 'bermuda jeans baggy, skatewear anos 90, bermuda longa jeans, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=baggy+denim+jorts+skateboarding+vintage&color=blue',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O CAIMENTO SKATEWEAR (HOOK):
- Tirando da embalagem com etiqueta vintage e vestindo: caimento solto e autêntico abaixo do joelho.
- Narração: "O autêntico jorts dos anos noventa que a galera do skate ama tá na promoção!"

🎬 CENA 2 (3-7s) - JEANS PESADO COM COSTURAS DUPLAS:
- Puxando a costura do entrepernas e mostrando o botão metálico envelhecido com bordado no bolso.
- Narração: "Jeans pesado cem por cento algodão com lavagem stonewash que não desbota na primeira lavagem."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Mão aberta apontando para o carrinho amarelo no canto da tela.
- Narração: "Tamanhos do 36 ao 48 na sacolinha do vídeo com envio imediato!"`,
      },
      {
        title: '🔥 Boné Trucker Vintage com Fecho Snapback e Tela Respirável',
        description:
          'Modelo ajeitando a aba curvada do boné trucker com estampa bordada em alto relevo.',
        niche: 'streetwear_casual',
        style: 'modelo',
        platform: 'ambos',
        is_free: false,
        category: 'ecommerce',
        hook: 'O boné trucker que tem o encaixe perfeito na cabeça e não fica com as orelhas abertas!',
        call_to_action: 'Copa alta estruturada com bordado 3D frontal. Link na sacolinha!',
        tags: 'bone trucker vintage, aba curva bordado 3d, acessorios street, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=vintage+trucker+hat+mesh+cap+man+street&color=black',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O ENCAIXE ANATÔMICO (HOOK):
- Modelo colocando o boné de frente pro espelho: copa alta que encaixa na cabeça sem forçar as orelhas.
- Narração: "Achar boné que fique bonito no formato do seu rosto é difícil, mas esse aqui encaixa em todo mundo!"

🎬 CENA 2 (3-7s) - BORDADO EM RELEVO E TELA FRESCA:
- Close no bordado em alta definição e na tela traseira que permite ventilação no calor.
- Narração: "Bordado tridimensional de altíssima definição e fecho snapback com sete regulagens."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Modelo pisca pra câmera, vira a aba pra trás e aponta para a sacolinha amarela.
- Narração: "Mais de quinze modelos exclusivos na sacolinha com frete grátis!"`,
      },
      {
        title: '🔥 Jaqueta Bomber Streetwear Impermeável Corta-Vento',
        description:
          'POV fechando o zíper tratorado da bomber com forro laranja clássico de aviação.',
        niche: 'streetwear_casual',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: false,
        category: 'ecommerce',
        hook: 'POV: A bomber jacket com forro laranja de piloto que você monta qualquer outfit estiloso no frio!',
        call_to_action: 'Nylon aeronáutico repelente a água com bolso no braço. Link no carrinho!',
        tags: 'jaqueta bomber streetwear, forro laranja piloto, corta vento, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=bomber+jacket+streetwear+orange+lining+pov&color=black',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O CLÁSSICO FORRO LARANJA (HOOK):
- POV abrindo a jaqueta preta revelando o forro laranja brilhante clássico das jaquetas MA-1.
- Narração: "Essa é simplesmente a peça mais foda do meu guarda-roupa de rua nesse ano!"

🎬 CENA 2 (3-7s) - ZÍPER METÁLICO E BOLSO UTILITÁRIO:
- Mostrando a fita vermelha 'Remove Before Flight' no zíper da manga e o fechamento à prova de vento.
- Narração: "Nylon corta-vento encorpado, ribana nos punhos que não alarga e bolsos com botão de pressão."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Ajeitando a gola e apontando com atitude para o carrinho amarelo no rodapé.
- Narração: "Preço promocional direto do importador no carrinho amarelo. Garanta o seu!"`,
      },
      {
        title: '🔥 Calça Parachute Unissex em Nylon Leve com Cordões Elásticos',
        description:
          'Modelo caminhando com a calça parachute volumosa em piso molhado urbano refletindo as luzes neon.',
        niche: 'streetwear_casual',
        style: 'modelo',
        platform: 'shopee',
        is_free: false,
        category: 'ecommerce',
        hook: 'A calça parachute viral que entrega o estilo gringo do Pinterest por R$ 42 na Shopee!',
        call_to_action: 'Nylon tecnológico super leve com regulagem no joelho. Link na Shopee!',
        tags: 'calca parachute nylon, pinterest outfit, street style, shopee achados',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=parachute+pants+streetwear+woman+neon+night&color=gray',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O VOLUME MODERNO DO PARACHUTE (HOOK):
- Passada marcante da modelo com a calça parachute fluida e volumosa em meio ao cenário urbano noturno.
- Narração: "Quer o outfit dos sonhos do Pinterest sem gastar o salário do mês inteiro?"

🎬 CENA 2 (3-7s) - REGULAGEM NOS JOELHOS E BARRA:
- Mão puxando as tancas elásticas nos joelhos para criar pregas futuristas customizadas.
- Narração: "Nylon ultrafino com toque aveludado que não faz barulho de saco plástico ao andar."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Modelo sorrindo com as mãos nos bolsos e apontando para a sacolinha da Shopee.
- Narração: "Unissex do tamanho P ao GG no link aqui embaixo. Aproveite o frete grátis!"`,
      },
      {
        title: '🔥 Colete Tático Utilitário Multibolsos com Fivelas Ajustáveis',
        description:
          'Unboxing vestindo o colete tático sobre camiseta branca básica transformando o visual na hora.',
        niche: 'streetwear_casual',
        style: 'unboxing_vitrine',
        platform: 'ambos',
        is_free: false,
        category: 'ecommerce',
        hook: 'O colete tático de R$ 38 que transforma qualquer camiseta básica branca num look de clipe de rap!',
        call_to_action: 'Fivelas engate rápido com 4 bolsos frontais. Link na sacolinha!',
        tags: 'colete tatico streetwear, utilitario trap clipe, shopee, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=tactical+vest+streetwear+chest+rig+unboxing&color=black',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O CLICK DAS FIVELAS TÁTICAS (HOOK):
- Encaixando as duas fivelas plásticas frontais com estalo nítido por cima da t-shirt oversized.
- Narração: "O acessório que os trappers usam nos clipes pra dar peso no visual pagando mixaria!"

🎬 CENA 2 (3-7s) - BOLSOS FUNCIONAIS E FIT AJUSTÁVEL:
- Ajustando as fitas laterais de nylon: o colete se molda ao corpo perfeitamente sem ficar solto.
- Narração: "Lona reforçada que não desbota, bolsos com zíper e argolas de metal pra pendurar chaves."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Dedo apontando com firmeza para a sacolinha amarela no vídeo.
- Narração: "Estoque super limitado na sacolinha com entrega rápida na sua casa!"`,
      },
      {
        title: '🔥 Camisa Manga Curta Viscose Estampada Street Floral Dark',
        description:
          'POV no espelho com camisa de viscose estampada aberta com regata canelada por baixo.',
        niche: 'streetwear_casual',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: false,
        category: 'ecommerce',
        hook: 'POV: A camisa floral dark que não parece camisa de praia e te deixa estiloso na balada!',
        call_to_action: 'Viscose premium super macia com caimento solto. Link no carrinho amarelo!',
        tags: 'camisa viscose floral dark, balada festival, street chic, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=dark+floral+short+sleeve+shirt+man+mirror&color=black',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O CAIMENTO FLUIDO DA VISCOSE (HOOK):
- POV ajeitando a camisa aberta com estampa floral escura estilizada e correntes prateadas no peito.
- Narração: "O segredo pra ir pra balada estiloso sem passar calor tá nessa camisa aqui!"

🎬 CENA 2 (3-7s) - TOQUE GELADO QUE NÃO ESQUENTA:
- Movimento balançando a manga solta: tecido com toque frio e caimento pesado que não arma.
- Narração: "Viscose de gramatura alta com botões pretos foscos e gola cubana que valoriza o peitoral."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Sorriso satisfeito no espelho e dedo no carrinho amarelo no rodapé.
- Narração: "Combina com qualquer calça preta ou bermuda na sacolinha amarela. Pega a sua!"`,
      },
      {
        title: '🔥 Meia Cano Alto Streetwear com Listras Esportivas Retrô',
        description:
          'Demonstração de elasticidade esticando a meia cano alto sobre o tornozelo com tênis clássico.',
        niche: 'streetwear_casual',
        style: 'unboxing_vitrine',
        platform: 'shopee',
        is_free: true,
        category: 'ecommerce',
        hook: 'O kit com 5 pares de meias cano alto grossas que não descem na canela durante o rolê!',
        call_to_action: 'Algodão atoalhado grosso com elástico canelado reforçado. Link na Shopee!',
        tags: 'meia cano alto streetwear, listras retro, algodao grosso, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=streetwear+crew+socks+stripes+sneakers&color=white',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - A PRESSÃO NA CANELA SEM DESCER (HOOK):
- Puxando a meia cano alto até o meio da panturrilha e dando pulos: a meia não escorrega nada.
- Narração: "Chega de meia cano alto que em dez minutos de caminhada já tá embolada no seu calcanhar!"

🎬 CENA 2 (3-7s) - SOLADO ATOALHADO CONFORTÁVEL:
- Mostrando o forro atoalhado grosso no calcanhar e bico que amortece o impacto com qualquer tênis.
- Narração: "Algodão grosso de verdade que não rasga nos dedos e canelado firme que abraça a perna."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Kit completo com 5 pares na embalagem apontando para a sacolinha da Shopee.
- Narração: "Kit com 5 pares por menos de vinte reais na sacolinha da Shopee com frete grátis!"`,
      },

      // ==========================================
      // INFANTIL & KIDS (10 prompts)
      // ==========================================
      {
        title: '🧸 Conjunto Infantil Algodão com Estampa Divertida Interativa',
        description:
          'POV mãe vestindo a criança com conjunto macio sem etiqueta arranhando o pescoço.',
        niche: 'infantil_kids',
        style: 'pov',
        platform: 'ambos',
        is_free: false,
        category: 'ecommerce',
        hook: 'POV: O conjuntinho infantil de R$ 22 que não tem nenhuma etiqueta arranhando o pescoço do bebê!',
        call_to_action: '100% algodão suedine hipoalergênico. Link na sacolinha!',
        tags: 'conjunto infantil algodao, sem etiqueta que pinica, moda bebe, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=toddler+cotton+outfit+soft+baby+clothes&color=yellow',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - A AUSÊNCIA DE ETIQUETAS IRRITANTES (HOOK):
- POV mostrando a gola estampada por dentro sem nenhuma etiqueta física de costura: alívio pra criança.
- Narração: "Seu filho também chora toda vez que uma etiqueta pinica no pescocinho dele?"

🎬 CENA 2 (3-7s) - TOQUE MACIO SUEDINE:
- Esticando o tecido macio que volta à forma original sem apertar as perninhas ou a barriga do bebê.
- Narração: "Algodão suedine puro antialérgico, elástico macio na cintura e botões de pressão reforçados."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Criança sorrindo brincando com o conjuntinho e dedo apontando para a sacolinha amarela.
- Narração: "Mais de vinte estampas fofas na sacolinha do vídeo com frete grátis. Aproveita!"`,
      },
      {
        title: '🧸 Tênis Infantil com Luz de LED no Solado e Velcro Fácil',
        description:
          'Criança pisando no chão e as luzes de LED multicoloridas acendendo a cada passo.',
        niche: 'infantil_kids',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: false,
        category: 'ecommerce',
        hook: 'O tênis de LED que fez a criança calçar o sapato sozinha e sair correndo feliz pela casa!',
        call_to_action:
          'Luzes de LED ativadas por impacto e fecho duplo em velcro. Link no carrinho!',
        tags: 'tenis infantil led, luz no solado, calce facil velcro, tiktok shop kids',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=kids+led+light+shoes+sneakers+glow+feet&color=blue',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O PISAR COM LUZES MULTICOLORIDAS (HOOK):
- Passos da criança no chão escuro: o solado acende em tons de vermelho, azul e verde a cada impacto.
- Narração: "O segredo pra nunca mais ter briga na hora de colocar sapato no seu filho!"

🎬 CENA 2 (3-7s) - CALCE FÁCIL COM VELCRO DUPLO:
- Criança de três anos puxando o velcro largo e colocando o pezinho com facilidade sem ajuda de adulto.
- Narração: "Solado anatômico com bateria lacrada de longa duração e fecho fácil que estimula a autonomia."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Criança sorrindo mostrando o tênis com a mão apontando para o carrinho amarelo no vídeo.
- Narração: "Numeração do 20 ao 32 no carrinho amarelo com entrega rápida. Pega o do seu filho!"`,
      },
      {
        title: '🧸 Mochila Escolar Infantil Bichinho 3D com Alça Antitranspirante',
        description:
          'POV abrindo a mochila em formato de dinossauro ou unicórnio 3D com amplo espaço para lancheira.',
        niche: 'infantil_kids',
        style: 'pov',
        platform: 'shopee',
        is_free: true,
        category: 'ecommerce',
        hook: 'POV: A mochila de bichinho 3D de R$ 29 que fez meu filho querer ir pra escola sem reclamar!',
        call_to_action: 'Material em neoprene leve e lavável na máquina. Link na Shopee!',
        tags: 'mochila infantil bichinho 3d, volta as aulas, material escolar creche, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=cute+3d+animal+kids+backpack+toddler&color=green',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O DESIGN FOFO EM RELEVO 3D (HOOK):
- POV tirando a mochila da caixa: detalhes em alto relevo com orelhinhas fofas que encantam qualquer criança.
- Narração: "Paguei menos de trinta reais nessa mochilinha e a qualidade me surpreendeu demais!"

🎬 CENA 2 (3-7s) - ESPAÇO E ALÇAS ACOLCHOADAS:
- Abrindo o compartimento: cabe caderninho, potinho de lanche, garrafinha e muda de roupa com folga.
- Narração: "Material em neoprene leve e impermeável com alças acolchoadas que não machucam os ombrinhos."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Criança colocando nas costas animada com dedo na sacolinha da Shopee.
- Narração: "Modelos de dinossauro, leãozinho e unicórnio na sacolinha da Shopee. Cupom ativo!"`,
      },
      {
        title: '🧸 Vestido Infantil Rodado Festa Temática com Laço Grande',
        description:
          'Menina rodopiando com vestido rodado com saia de tule brilhante e forro de algodão macio.',
        niche: 'infantil_kids',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: false,
        category: 'ecommerce',
        hook: 'O vestidinho de princesa rodado que tem forro de algodão puro pra não pinicar a pele da criança!',
        call_to_action: 'Saia de tule triplo com forro 100% algodão. Link no carrinho amarelo!',
        tags: 'vestido festa infantil, princesa rodado aniversario, tiktok shop kids',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=little+girl+party+dress+tulle+spin+princess&color=pink',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O GIRO DA PRINCESA (HOOK):
- Menininha girando com sorriso radiante: o tule da saia abre com volume perfeito como vestido de conto de fadas.
- Narração: "Procurando vestido de aniversário lindo que sua filha não passe o dia querendo tirar?"

🎬 CENA 2 (3-7s) - FORRO DE ALGODÃO POR DENTRO:
- Levantando a barra do tule para mostrar o forro macio de algodão que protege a pele do atrito.
- Narração: "Três camadas de tule brilhante e forro interno cem por cento algodão sem nada que pinique."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Menininha acena dando tchauzinho e aponta para o carrinho amarelo no canto.
- Narração: "Várias cores e temas de aniversário na sacolinha amarela. Pede antes da festa!"`,
      },
      {
        title: '🧸 Babador Bandana Impermeável Kit com 6 Peças Algodão',
        description:
          'Demonstração derramando suco no babador: a camada interna impermeável não molha a roupinha.',
        niche: 'infantil_kids',
        style: 'unboxing_vitrine',
        platform: 'ambos',
        is_free: false,
        category: 'ecommerce',
        hook: 'O teste do suco: o babador bandana que não deixa o peito da criança molhado de baba nem comia!',
        call_to_action: 'Camada impermeável interna com botões duplos ajustáveis. Link na sacola!',
        tags: 'babador bandana impermeavel, kit babadores bebe, introducao alimentar, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=bandana+drool+bibs+baby+waterproof+juice&color=orange',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O TESTE DO LÍQUIDO DERRAMADO (HOOK):
- Jogando água com corante no babador: o líquido é absorvido pela frente mas o verso continua seco.
- Narração: "Chega de trocar a camiseta do bebê cinco vezes por dia por causa da baba dos dentinhos nascendo!"

🎬 CENA 2 (3-7s) - ESTILO BANDANA E BOTÃO DUPLO:
- Colocando no bebê: parece um lencinho estiloso com regulagem de tamanho para não apertar o pescoço.
- Narração: "Frente em algodão estampado macio e verso com membrana impermeável respirável."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Kit completo com as 6 estampas expostas e dedo na sacolinha amarela.
- Narração: "Kit com 6 babadores saindo por menos de três reais cada na sacolinha. Pega o seu!"`,
      },
      {
        title: '🧸 Sandália Infantil Babuche Macia com Enfeites Divertidos',
        description:
          'POV dobrando o babuche infantil com uma mão mostrando flexibilidade total e conforto.',
        niche: 'infantil_kids',
        style: 'pov',
        platform: 'shopee',
        is_free: false,
        category: 'ecommerce',
        hook: 'POV: O babuche infantil super macio que não dá chulé e a criança não quer tirar do pé!',
        call_to_action: 'Microexpandido antibacteriano com furinhos de ventilação. Link na Shopee!',
        tags: 'babuche infantil, sandalia macia antiderrapante, shopee achados kids',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=kids+clogs+slippers+charms+flexible+soft&color=blue',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O TESTE DA FLEXIBILIDADE TOTAL (HOOK):
- Dobrando a ponta do babuche até encostar no calcanhar com dois dedos: material super maleável.
- Narração: "Se você tem medo de calçado duro que machuca os pezinhos em formação, olha isso!"

🎬 CENA 2 (3-7s) - ENFEITES DIVERTIDOS E SOLADO SEGURO:
- Mostrando os pins coloridos removíveis e a tira traseira que mantém o pezinho firme no lugar.
- Narração: "Material microexpandido leve, antiderrapante pra molhado e super fácil de lavar na pia."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Criança andando no parquinho com dedo na sacolinha da Shopee.
- Narração: "Mais de dez cores com bichinhos fofos na sacolinha da Shopee com frete grátis!"`,
      },
      {
        title: '🧸 Pijama Infantil Térmico Quentinho Macacão com Zíper Duplo',
        description:
          'Mãe trocando a fralda da criança abrindo apenas o zíper inferior sem despir o peito do bebê no frio.',
        niche: 'infantil_kids',
        style: 'unboxing_vitrine',
        platform: 'tiktok_shop',
        is_free: false,
        category: 'ecommerce',
        hook: 'O macacão térmico com zíper duplo que você troca a fralda de madrugada sem gelar o bebê!',
        call_to_action: 'Zíper bidirecional com proteção anti-beliscão. Link no carrinho amarelo!',
        tags: 'pijama termico infantil, ziper duplo troca fralda, macacao frio bebe, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=baby+fleece+onesie+zipper+sleepwear+soft&color=pink',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - A PRATICIDADE DO ZÍPER INVERTIDO (HOOK):
- Puxando o zíper de baixo para cima: abre apenas a área da fralda, mantendo o peito e braços quentinhos.
- Narração: "A maior invenção pra mães que odeiam despir o bebê inteiro no frio da madrugada!"

🎬 CENA 2 (3-7s) - SOFT FLEECE AVELUDADO:
- Close no tecido fleece macio que imita pele de carneirinho e na aba de tecido que protege o queixo do zíper.
- Narração: "Flanela térmica que não pinica, não solta fiapos e mantém a temperatura do corpinho a noite toda."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Bebê dormindo tranquilo com dedo apontado para o carrinho amarelo no vídeo.
- Narração: "O salvador das noites de frio tá no carrinho amarelo com entrega rápida. Pega o seu!"`,
      },
      {
        title: '🧸 Chapéu Infantil Praia com Proteção de Pescoço Leg Guard UV50+',
        description:
          'Criança brincando na areia da praia com o chapéu com aba e pala traseira cobrindo o pescoço.',
        niche: 'infantil_kids',
        style: 'modelo',
        platform: 'shopee',
        is_free: false,
        category: 'ecommerce',
        hook: 'O chapéu de praia infantil que protege o pescoço e as orelhas do sol forte sem cair da cabeça!',
        call_to_action:
          'Tecido com proteção UV50+ e cordão com trava de segurança. Link na Shopee!',
        tags: 'chapeu infantil protecao solar, uv50 pescoco, praia crianca, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=kids+sun+hat+neck+flap+beach+sand+play&color=cyan',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - A COBERTURA TOTAL DO PESCOÇO (HOOK):
- Criança brincando com baldinho na praia: a pala traseira do chapéu protege completamente a nuca do sol.
- Narração: "Chega de ver seu filho com o pescoço e as orelhas vermelhas e ardendo depois da praia!"

🎬 CENA 2 (3-7s) - PROTEÇÃO UV50+ QUE SECA RÁPIDO:
- Jogando água no tecido: repele a água e seca ao vento em poucos minutos com cordão elástico ajustável.
- Narração: "Proteção solar UV cinquenta mais certificada, tecido levinho que não esquenta e cordão de queixo seguro."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Criança sorri com o baldinho e a mãe aponta para a sacolinha da Shopee.
- Narração: "Custa menos de vinte reais na sacolinha da Shopee. Proteja seu filho no verão!"`,
      },
      {
        title: '🧸 Faixas de Cabelo para Bebê em Meia de Seda Super Macias',
        description:
          'POV esticando a faixinha de meia de seda até a largura da mão sem deixar marca de aperto.',
        niche: 'infantil_kids',
        style: 'pov',
        platform: 'ambos',
        is_free: false,
        category: 'ecommerce',
        hook: 'POV: A faixinha de cabelo que não aperta a cabecinha do recém-nascido nem deixa marcas vermelhas!',
        call_to_action: 'Meia de seda pura ultra elástica kit com 10 laços. Link na sacolinha!',
        tags: 'faixinha bebe meia de seda, laço recem nascido sem apertar, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=baby+nylon+headbands+soft+bows+pack&color=pink',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O TESTE DA ELASTICIDADE EXTREMA (HOOK):
- POV esticando a faixinha com as duas mãos: expande com suavidade absoluta e volta sem deformar.
- Narração: "Cansada de comprar laço que quando você tira da cabeça do bebê tá aquela marca funda vermelha?"

🎬 CENA 2 (3-7s) - MEIA DE SEDA QUE CRESCE COM A CRIANÇA:
- Colocando delicadamente na cabeça do bebê: o lacinho fica nobre sem exercer nenhuma pressão.
- Narração: "Meia de seda macia que se adapta desde o primeiro dia de vida até os dois aninhos de idade."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Mostrando a cartela com 10 laços em tons pastéis e dedo na sacolinha amarela.
- Narração: "Kit com 10 laços saindo por preço de um só na sacolinha. Garanta o seu!"`,
      },
      {
        title: '🧸 Meia Soquete Infantil com Antiderrapante e Bichinho 3D',
        description:
          'Criança correndo no chão encerado e o solado com grip de silicone impedindo qualquer queda.',
        niche: 'infantil_kids',
        style: 'unboxing_vitrine',
        platform: 'shopee',
        is_free: true,
        category: 'ecommerce',
        hook: 'O teste do piso de taco: a meia com solado emborrachado que evita tombos nos primeiros passos!',
        call_to_action:
          'Pontos de borracha antiderrapante e aplique de pelúcia 3D. Link na Shopee!',
        tags: 'meia infantil antiderrapante, primeiros passos bebe, shopee achados',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=baby+anti+slip+grip+socks+wooden+floor&color=yellow',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - A CORRIDA SEM ESCORREGAR (HOOK):
- Criança dando passinhos rápidos no piso de madeira lisa: o solado com relevo de borracha trava com firmeza.
- Narração: "Coração de mãe não aguenta ver o filho escorregando e batendo a cabeça no piso liso!"

🎬 CENA 2 (3-7s) - ENCAIXE MACIO QUE NÃO APERTA O TORNOZELO:
- Close no bichinho de pelúcia fofo na ponta e no elástico canelado que não sufoca a circulação da perna.
- Narração: "Grip emborrachado total no solado e algodão respirável que mantém os pezinhos aquecidos."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Mostrando o kit com 3 pares divertidos com dedo na sacolinha da Shopee.
- Narração: "Menos de quinze reais o kit na sacolinha da Shopee com frete grátis. Aproveite!"`,
      },

      // ==========================================
      // LINGERIE & PIJAMAS (10 prompts)
      // ==========================================
      {
        title: '✨ Calcinha Corte a Laser Sem Costura Invisível na Legging',
        description:
          'POV vestindo legging branca justa e a calcinha corte a laser ficando 100% imperceptível.',
        niche: 'lingerie_pijamas',
        style: 'pov',
        platform: 'ambos',
        is_free: false,
        category: 'ecommerce',
        hook: 'POV: O teste da calça branca! Essa calcinha sem costura simplesmente DESAPARECE no corpo!',
        call_to_action: 'Corte a laser com forro 100% algodão. Link na sacolinha!',
        tags: 'calcinha corte a laser, invisivel legging branca, sem costura, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=seamless+laser+cut+panties+white+leggings&color=pink',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O TESTE DA LEGGING BRANCA (HOOK):
- POV em frente ao espelho com legging branca de treino: zero marcas de elástico ou costura na lateral e glúteo.
- Narração: "Diga adeus a pagar calcinha marcada na academia ou com vestido fino!"

🎬 CENA 2 (3-7s) - CORTE A LASER COM TOQUE DE SEGUNDA PELE:
- Mão demonstrando a borda ultrafina termocolada e o forrinho respirável em algodão puro.
- Narração: "Poliamida com toque gelado que adere ao corpo sem enrolar e não marca absolutamente nada."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Voltinha rápida no espelho com sorriso confiante e apontando para a sacolinha amarela.
- Narração: "Kit com 5 peças em cores neutras na sacolinha com frete grátis. Pega o seu!"`,
      },
      {
        title: '✨ Pijama Americano em Cetim de Seda com Botões Vivos',
        description:
          'Modelo caminhando no quarto com o conjunto de pijama americano acetinado com vivos contrastantes.',
        niche: 'lingerie_pijamas',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: false,
        category: 'ecommerce',
        hook: 'O pijama americano de cetim que faz você acordar parecendo capa de filme de romance rica!',
        call_to_action: 'Cetim com toque de seda e vivos contrastantes. Link no carrinho amarelo!',
        tags: 'pijama americano cetim, homewear elegante, acordar rica, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=satin+silk+pajamas+set+piping+luxury+woman&color=pink',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O BRILHO NOBRE DO CETIM (HOOK):
- Modelo acordando na cama com luz natural e espreguiçando com o pijama acetinado impecável.
- Narração: "Você nunca mais vai querer dormir com camisa velha de vereador depois de usar esse pijama!"

🎬 CENA 2 (3-7s) - DETALHES DE COSTURA E BOTÕES:
- Close na gola clássica e nos botões forrados com caimento fluido que desliza na pele.
- Narração: "Cetim premium com toque de seda que não pinica, não esquenta e não amassa na cama."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Modelo desce da cama com xícara de café e aponta para o carrinho amarelo no rodapé.
- Narração: "A peça mais elegante da sua noite tá na sacolinha por um preço surreal. Aproveita!"`,
      },
      {
        title: '✨ Sutiã Tomara que Caia com Silicone Antideslizante',
        description:
          'POV pulando com vestido tomara que caia para comprovar que o sutiã não escorrega 1 milímetro.',
        niche: 'lingerie_pijamas',
        style: 'pov',
        platform: 'shopee',
        is_free: false,
        category: 'ecommerce',
        hook: 'POV: O teste do pulo! O único sutiã tomara que caia que não desce pro umbigo na festa!',
        call_to_action:
          'Faixas duplas de silicone antiderrapante com aro anatômico. Link na Shopee!',
        tags: 'sutia tomara que caia, nao cai silicone, sustentacao seios, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=strapless+bra+jumping+test+stay+up+mirror&color=black',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O TESTE DO PULO SEM SAIR DO LUGAR (HOOK):
- POV no espelho dando pulinhos com top sem alça: o sutiã permanece colado na altura certa sem escorregar.
- Narração: "Cansada de ir pra festa e passar a noite inteira puxando o sutiã pra cima discretamente?"

🎬 CENA 2 (3-7s) - BORDAS INTERNAS DE SILICONE:
- Virando a lateral para mostrar as três faixas contínuas de silicone medicinal que aderem suavemente à pele.
- Narração: "Silicone que gruda com segurança sem irritar e laterais largas que escondem a gordurinha das costas."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Coloca um vestido decotado perfeito e aponta para a sacolinha da Shopee.
- Narração: "O sutiã definitivo pra decotes na sacolinha da Shopee com frete grátis. Pede o seu!"`,
      },
      {
        title: '✨ Robe Longo Acetinado com Mangas em Renda Chantilly',
        description:
          'Modelo caminhando no corredor com o robe esvoaçante amarrado na cintura com faixa larga.',
        niche: 'lingerie_pijamas',
        style: 'modelo',
        platform: 'ambos',
        is_free: true,
        category: 'ecommerce',
        hook: 'O robe de cetim com renda que parece peça de grife de noiva por R$ 38 na Shopee!',
        call_to_action: 'Mangas flare em renda chantilly e cetim com elastano. Link na sacolinha!',
        tags: 'robe cetim renda, dia da noiva, homewear luxo, shopee, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=lace+satin+kimono+robe+woman+luxury+morning&color=white',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - A FLUIDEZ DAS MANGAS DE RENDA (HOOK):
- Modelo levantando os braços suavemente: as mangas em renda chantilly criam um caimento espetacular.
- Narração: "Aquele robe que quando você veste em casa, sua autoestima vai pro topo instantaneamente!"

🎬 CENA 2 (3-7s) - FAIXA MODELADORA E COMPRIMENTO LONGO:
- Ajustando a faixa de cetim na cintura com caimento fluido até os tornozelos.
- Narração: "Cetim encorpado que não fica transparente e renda antialérgica super macia nos punhos."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Modelo sorri com atitude no espelho e aponta para a sacolinha amarela.
- Narração: "Ideal pro dia da noiva ou pra se sentir poderosa em casa. Link na sacolinha!"`,
      },
      {
        title: '✨ Body Renda Sensual com Aro Estruturado e Alças Cruzadas',
        description:
          'Unboxing e demonstração no manequim com renda guipure delicada e aro push-up.',
        niche: 'lingerie_pijamas',
        style: 'unboxing_vitrine',
        platform: 'tiktok_shop',
        is_free: false,
        category: 'ecommerce',
        hook: 'O body de renda com aro que segura os seios e vira look balada com calça jeans!',
        call_to_action: 'Renda antialérgica com fecho entrepernas de pressão. Link no carrinho!',
        tags: 'body renda sensual, lingerie balada, aro sustentacao, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=lace+bodysuit+lingerie+underwire+party+outfit&color=black',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O DESENHO DA RENDA NO MANEQUIM (HOOK):
- Tirando o body da embalagem acetinada: a renda floral trabalhada tem acabamento impecável.
- Narração: "Quem disse que lingerie sensual precisa ficar escondida debaixo da roupa?"

🎬 CENA 2 (3-7s) - FORRO E FECHO PRÁTICO:
- Mostrando o forro no busto que não deixa o bico do peito aparecer e o fecho inferior com botões de pressão.
- Narração: "Aro que valoriza o decote com firmeza e fecho embaixo que facilita na hora de ir ao banheiro."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Dedo indicador apontado com firmeza para o carrinho amarelo no vídeo.
- Narração: "Cores preta, vermelha e branca na sacolinha amarela com desconto exclusivo!"`,
      },
      {
        title: '✨ Camisola de Liganete com Toque Geladinho e Busto em Renda',
        description:
          'POV tocando o tecido geladinho da camisola no verão quente com alças reguláveis.',
        niche: 'lingerie_pijamas',
        style: 'pov',
        platform: 'shopee',
        is_free: false,
        category: 'ecommerce',
        hook: 'POV: A camisola de toque geladinho que não te deixa suar nem nas noites mais quentes do verão!',
        call_to_action: 'Liganete pura de poliamida com renda macia no decote. Link na Shopee!',
        tags: 'camisola liganete geladinha, pijama fresco verao, shopee lingerie',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=nightdress+cool+touch+fabric+woman+bedroom&color=blue',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - A SENSAÇÃO DE TOQUE GELADO (HOOK):
- POV passando a mão no tecido de liganete fluida: elasticidade macia e sensação refrescante imediata.
- Narração: "Se você acorda de madrugada no calor toda suada e colando na cama, troca de camisola agora!"

🎬 CENA 2 (3-7s) - DETALHE DA RENDA CONFORTÁVEL:
- Câmera aproxima na renda do decote que não aperta nem pinica e nas alcinhas com regulagem de altura.
- Narração: "Liganete de poliamida com caimento solto que desliza no lençol e seca o suor na hora."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Segura a camisola na frente do corpo com dedo na sacolinha da Shopee.
- Narração: "Menos de vinte e cinco reais na sacolinha da Shopee. Pega o cupom de frete grátis!"`,
      },
      {
        title: '✨ Cinta Calcinha Alta Modeladora com 4 Barbatanas Anti-Enrolamento',
        description:
          'Modelo colocando a cinta calcinha e o vestido tubinho colado: a silhueta fica reta sem dobrinhas.',
        niche: 'lingerie_pijamas',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: false,
        category: 'ecommerce',
        hook: 'O teste do vestido justo: a cinta que não enrola no estômago e reduz 2 medidas de cintura!',
        call_to_action: '4 barbatanas de aço flexível com compressão médica. Link no carrinho!',
        tags: 'cinta calcinha alta, nao enrola no estomago, modeladora vestido, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=high+waist+shaping+briefs+woman+fitted+dress&color=orange',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O ANTES E DEPOIS DO VESTIDO JUSTO (HOOK):
- Modelo com vestido justo: antes com marquinha de barriga e depois com silhueta reta e modelada.
- Narração: "Sabe aquela pochetezinha que marca em qualquer vestido fino? Olha o que aconteceu aqui!"

🎬 CENA 2 (3-7s) - HASTES QUE IMPEDEM ENROLAR:
- Mostrando as quatro barbatanas de aço flexível nas laterais e costas que mantém o cós ereto sob o busto.
- Narração: "Você pode sentar, levantar e agachar que o cós não enrola no estômago e não falta o ar."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Modelo sorri alisando a cintura e aponta para o carrinho amarelo no rodapé.
- Narração: "Do P ao extra grande na sacolinha do vídeo com frete grátis. Aproveita!"`,
      },
      {
        title: '✨ Sutiã Invisível Adesivo de Silicone Reutilizável com Fecho Frontal',
        description:
          'Demonstração colando os bojos de silicone independentes e juntando o fecho frontal de encaixe.',
        niche: 'lingerie_pijamas',
        style: 'unboxing_vitrine',
        platform: 'ambos',
        is_free: false,
        category: 'ecommerce',
        hook: 'O sutiã de silicone que junta o busto e segura o decote profundo nas costas sem descolar!',
        call_to_action: 'Silicone hipoalergênico reutilizável mais de 50 vezes. Link na sacolinha!',
        tags: 'sutia adesivo silicone, decote costas nuas, fecha frontal, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=adhesive+silicone+bra+backless+dress+unboxing&color=pink',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O ENCAIXE DO FECHO FRONTAL (HOOK):
- Posicionando os dois bojos adesivos e travando o clipe central: o busto junta com decote volumoso.
- Narração: "Quer usar aquele vestido costa nua maravilhoso sem ficar com o busto esparramado?"

🎬 CENA 2 (3-7s) - TESTE DE ADERÊNCIA AO SUOR:
- Puxando a borda para mostrar a cola biológica que não solta com o calor do corpo e lava com água morna.
- Narração: "Silicone cirúrgico que não irrita a pele, segura o dia inteiro e dura mais de cinquenta usos."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Mostrando o estojo de proteção com dedo na sacolinha amarela.
- Narração: "Acompanha protetor de mamilo no link da sacolinha. Pega o cupom agora!"`,
      },
      {
        title: '✨ Conjunto Lingerie Sem Bojo em Renda com Calcinha Asa Delta',
        description:
          'POV no espelho com conjunto de renda sem bojo que valoriza a forma natural do corpo.',
        niche: 'lingerie_pijamas',
        style: 'pov',
        platform: 'shopee',
        is_free: false,
        category: 'ecommerce',
        hook: 'POV: O conjunto sem bojo de R$ 26 que te deixa confortável e maravilhosa ao mesmo tempo!',
        call_to_action: 'Renda macia com elastano e forro de algodão puro. Link na Shopee!',
        tags: 'lingerie sem bojo, calcinha asa delta, renda macia dia a dia, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=unpadded+lace+lingerie+set+woman+mirror&color=green',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - A LEVEZA DO SEM BOJO (HOOK):
- POV ajustando as alças delicadas no espelho: a renda forrada acomoda o busto de forma anatômica.
- Narração: "Depois que você descobre a liberdade de um conjunto sem bojo estruturado, você nunca mais volta!"

🎬 CENA 2 (3-7s) - CALCINHA ASA DELTA QUE NÃO APERTA:
- Giro lateral rápido mostrando a calcinha que abraça o quadril sem machucar a pele.
- Narração: "Renda antialérgica com muita elasticidade que não pinica e calcinha asa delta anatômica."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Sorriso satisfeito no espelho com dedo apontando para a sacolinha da Shopee.
- Narração: "Mais de oito cores lindas disponíveis na sacolinha da Shopee com frete grátis!"`,
      },
      {
        title: '✨ Meia-Calça Térmica Translúcida Efeito Perna Nua Forrada de Lã',
        description:
          'Puxando o forro interno de pelúcia grossa e mostrando por fora a ilusão de perna nua transparente.',
        niche: 'lingerie_pijamas',
        style: 'unboxing_vitrine',
        platform: 'tiktok_shop',
        is_free: true,
        category: 'ecommerce',
        hook: 'A meia-calça térmica que parece transparente na pele mas é forrada de lã quentinha por dentro!',
        call_to_action:
          'Forro fleece térmico que suporta até 0°C com efeito perna nua. Link no carrinho!',
        tags: 'meia calca termica translucida, efeito perna nua, frio inverno, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=thermal+sheer+tights+fleece+lined+woman+winter&color=black',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O TRUQUE DO FORRO DE LÃ (HOOK):
- Puxando a meia no tornozelo e mostrando o forro grosso de pelúcia por dentro e a ilusão perfeita por fora.
- Narração: "O maior segredo das gringas pra usar saia no inverno congelante sem passar frio!"

🎬 CENA 2 (3-7s) - COMPRESSÃO E RESISTÊNCIA A RASGOS:
- Passando as unhas compridas com força no tecido: não desfia e comprime as pernas e barriga.
- Narração: "Parece uma meia fina transparente comum mas segura até zero graus com compressão que afina."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Dedo firme apontado para o carrinho amarelo no canto da tela.
- Narração: "O estoque dessa meia voa todo inverno! Clica no carrinho amarelo e garante a sua."`,
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
