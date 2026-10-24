/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const promptsCol = app.findCollectionByNameOrId('prompts')

    const proPromptsPart6 = [
      // 61. Moda Feminina - PRO
      {
        title: 'Calça Jeans Mom Fit 100% Algodão Vintage - Modelo Provador Luz Natural',
        description:
          'Modelo em provador com iluminação natural mostrando o corte mom jeans clássico, bumbum empinado e cintura alta confortável.',
        niche: 'moda_feminina',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'O mom jeans que empina o bumbum de verdade e não sobra aquele vão chato na cintura!',
        call_to_action:
          'Jeans vintage 100% algodão sem elastano que não laceia. Link no carrinho amarelo!',
        tags: 'mom jeans, cintura alta, empina bumbum, vintage anos 90, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=mom+jeans+woman+fitting+room+natural+light&color=blue',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 23 SEGUNDOS]

🎬 CENA 1 (0-3s) - O GANCHO DA CINTURA SEM VÃO (HOOK):
- Modelo vira de costas no provador com as mãos nos bolsos traseiros do mom jeans: cintura perfeitamente colada na lombar.
- Texto na tela: "ZERO VÃO NA CINTURA! 👖🔥"
- Narração empolgada: "Se você tem cintura fina e quadril largo e sofre com aquele vão enorme nas costas da calça jeans, olha esse molde!"

🎬 CENA 2 (3-9s) - O CORTE MOM ANATÔMICO:
- Close na pala traseira em formato de coração que levanta visualmente o bumbum sem precisar de enchimento.
- Narração: "A pala traseira em formato de coração cria o efeito empina bumbum perfeito, e a cintura alta fecha na medida exata."

🎬 CENA 3 (9-14s) - JEANS GROSSO 100% ALGODÃO:
- Batendo no tecido: trama grossa vintage clássica que segura e modela o abdômen sem marcar celulite.
- Narração: "É jeans grosso de verdade que não laceia no joelho depois de 2 horas de uso. Aquela qualidade de jeans que dura décadas."

🎬 CENA 4 (14-18s) - A BARRA DOBRADA COM TÊNIS OU SALTO:
- Dobrando a barra uma vez: caimento perfeito com tênis casual ou bota de bico fino.
- Narração: "Fica impecável com regatinha básica e tênis retrô."

🎬 CENA 5 (18-23s) - CTA:
- Modelo apontando para o carrinho amarelo:
- Narração: "A tabela de medidas é exata por centímetro de cintura. Clica no carrinho amarelo aqui embaixo e garanta o seu antes da reposição!"`,
      },
      // 62. Moda Feminina - PRO
      {
        title: 'Blusa em Renda Guipir Manga Bufante Princesa - Unboxing Vitrine Delicada',
        description:
          'Abertura de pacote com blusa em renda guipir encorpada, mangas princesa bufantes com elástico no punho e botões de pérola.',
        niche: 'moda_feminina',
        style: 'unboxing_vitrine',
        platform: 'shopee',
        is_free: false,
        hook: 'A blusa de renda guipir mais romântica e bem acabada da Shopee por menos de R$ 49!',
        call_to_action:
          'Renda de algodão guipir com forro no busto incluso. Link seguro na sacolinha!',
        tags: 'blusa guipir, manga bufante, romantica chic, unboxing shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=lace+guipure+blouse+puff+sleeves+woman+unboxing&color=white',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 21 SEGUNDOS]

🎬 CENA 1 (0-3s) - O ENCANTO DOS DETALHES FLORAL GUIPIR (HOOK):
- Tirando a blusa branca de renda guipir do papel de seda: os desenhos florais em relevo se destacam sob a luz.
- Texto na tela: "PARECE FEITA SOB MEDIDA EM PARIS 🌸👗"
- Narração admirada: "A blusa mais delicada e feminina que você vai ver hoje: parece peça exclusiva de ateliê de alta costura!"

🎬 CENA 2 (3-8s) - O RELEVO DA RENDA GUIPIR:
- Close nas flores de renda com relevo encorpado que não desfiam nem repuxam fios.
- Narração: "Renda guipir pesadinha de algodão: o desenho floral é bem definido e não deforma após lavar na mão."

🎬 CENA 3 (8-13s) - A MANGA PRINCESA BUFANTE:
- Mostrando a estrutura armada nos ombros que dá aquele ar romântico e os botões de pérola na gola.
- Narração: "As mangas bufantes têm volume perfeito e já acompanha uma regatinha segunda pele por baixo pra não ter transparência."

🎬 CENA 4 (13-17s) - COMBINAÇÃO COM SAIA OU JEANS:
- Mostrando sobreposição com saia midi plissada para casamento civil ou com jeans para almoço de domingo.
- Narração: "Perfeita pro batizado, noivado, culto ou almoço especial em família."

🎬 CENA 5 (17-21s) - CTA:
- Apontando delicadamente para a sacolinha:
- Narração: "O vendedor tem mais de 98% de avaliações positivas na Shopee. Clica na sacolinha aqui do vídeo e garanta a sua com cupom!"`,
      },
      // 63. Moda Feminina - PRO
      {
        title: 'Calça Legging Cirrê com Efeito Couro Fake e Cintura Alta - POV Balada Urbana',
        description:
          'POV no espelho combinando calça cirrê com brilho acetinado estilo couro, blazer preto e salto alto para noite badalada.',
        niche: 'moda_feminina',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'POV: A legging de couro fake que NÃO racha no frio e te deixa com pernas de violão!',
        call_to_action:
          'Tecido cirrê power com forro flanelado interno que não racha. Link no carrinho amarelo!',
        tags: 'legging cirre, couro fake, calca balada, outono inverno, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=leather+look+leggings+woman+night+out+mirror&color=black',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - O BRILHO NOBRE DO CIRRÊ (HOOK):
- POV em frente ao espelho com iluminação noturna vestindo a legging cirrê preta com brilho acetinado nobre (não aquele plástico brilhante barato).
- Texto na tela: "LOOK DE BALADA POR R$ 39 🖤🔥"
- Narração instigante: "POV: O dia em que você trocou o couro legítimo que esquenta e racha por essa legging de cirrê perfeita!"

🎬 CENA 2 (3-8s) - O FORRO INTERNO FLANELADO MACIO:
- Virando o cós da calça: forro interno térmico macio que não deixa a pele grudar ou transpirar no tecido sintético.
- Narração: "O segredo tá no forro interno flaneladinho: não gruda nas pernas ao vestir, é super aconchegante e não racha nem descasca."

🎬 CENA 3 (8-13s) - CÓS ALTO MODELADOR DUPLO:
- Puxando a cintura: o cós alto segura a barriguinha e afina a linha da cintura sem enrolar ao sentar.
- Narração: "Cós duplo de 10cm que não dobra quando você senta no restaurante ou no carro."

🎬 CENA 4 (13-17s) - COMBINAÇÃO INFALÍVEL:
- Jogando um blazer oversized preto e bota de salto: visual de milhões pronto em 1 minuto.
- Narração: "Fica impecável com tricot oversized ou blazer preto pra sair à noite."

🎬 CENA 5 (17-22s) - CTA:
- Apontando para o carrinho amarelo:
- Narração: "Grade do P ao GG disponível com envio em 24 horas no carrinho amarelo do TikTok Shop. Aproveite!"`,
      },
      // 64. Moda Masculina - PRO
      {
        title: 'Blusão Moletom Gola Careca em Algodão Penteado Minimalista - Modelo Minimal Casual',
        description:
          'Modelo masculino com moletom gola redonda sem estampas em tom bege areia, costura pespontada e caimento alinhado.',
        niche: 'moda_masculina',
        style: 'modelo',
        platform: 'shopee',
        is_free: false,
        hook: 'O moletom minimalista sem estampas que todo homem elegante deveria usar no inverno!',
        call_to_action:
          'Algodão 100% penteado com felpa macia anti-bolinhas. Link seguro na sacolinha!',
        tags: 'moletom careca, minimalista masculino, old money inverno, shopee achados',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=crewneck+sweatshirt+man+minimal+clean+street&color=orange',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - A ELEGÂNCIA DO MENOS É MAIS (HOOK):
- Passada do modelo com moletom gola careca areia impecável, calça chino escura e tênis casual.
- Texto na tela: "O MOLETOM QUE FICA CHIQUE 🍂☕"
- Narração envolvente: "Se você quer usar moletom no dia a dia sem parecer que acabou de sair da cama, essa modelagem minimalista é a chave!"

🎬 CENA 2 (3-8s) - A GOLA DE RIBANA PESADA:
- Close na gola careca com reforço de gola tripla e costura em meia-lua nas costas.
- Narração: "A gola canelada com elastano fica perfeitamente assentada no pescoço e a costura pespontada dá acabamento limpo."

🎬 CENA 3 (8-13s) - O TOQUE DO ALGODÃO FLANELADO:
- Mão tocando a felpa interna macia que aquece o corpo na medida certa.
- Narração: "Felpa macia que não solta pelinhos na camiseta que você usar por baixo e não esquenta em excesso."

🎬 CENA 4 (13-17s) - VERSATILIDADE COM CAMISA POR BAIXO:
- Mostrando a pontinha de uma gola de camisa branca aparecendo por baixo da gola do moletom: visual sofisticado.
- Narração: "Dá pra usar sozinho ou com camisa social por baixo pra trabalhar em dias frios."

🎬 CENA 5 (17-22s) - CTA:
- Modelo apontando para a sacolinha da Shopee:
- Narração: "Cores areia, cinza mescla, preto e verde militar disponíveis na sacolinha oficial com frete grátis nacional!"`,
      },
      // 65. Moda Masculina - PRO
      {
        title: 'Calça Moletom Masculina Slim com Bolso Selado - POV Casa & Treino',
        description:
          'POV descendo do carro e entrando na academia com calça moletom slim que não fica com joelho ensacado e tem bolso para fone e chave.',
        niche: 'moda_masculina',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'POV: A calça moletom slim que NÃO fica frouxa no joelho parecendo saco de batata!',
        call_to_action:
          'Moletom 2 cabos com 4% elastano anti-deformação. Link no carrinho amarelo!',
        tags: 'calca moletom slim, nao ensaca o joelho, conforto dia a dia, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=slim+fit+sweatpants+man+car+street+casual&color=gray',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - O PROBLEMA DO JOELHO FOLGADO (HOOK):
- POV descendo do carro e olhando a calça moletom cinza no corpo: pernas alinhadas, sem nenhuma sobra ensacada no joelho.
- Texto na tela: "NÃO ENSACA NO JOELHO! 👖💪"
- Narração identificadora: "POV: O dia em que você descobriu que nem toda calça de moletom fica deformada e larga no joelho depois de meia hora sentado no carro!"

🎬 CENA 2 (3-8s) - A TECNOLOGIA COM ELASTANO QUE MEMORIZA O FORMATO:
- Modelo agacha fundo e levanta: a calça volta ao formato slim reto imediatamente.
- Narração: "O tecido tem 4% de elastano com memória elástica: você agacha, senta e ela volta pra forma original sem deformar."

🎬 CENA 3 (8-13s) - BOLSO COM ZÍPER TÉRMICO E CORDÃO COM PONTEIRA DE METAL:
- Mão guardando o celular e fones no bolso com zíper fosco e puxando o cordão da cintura com ponteiras metálicas pesadas.
- Narração: "Os bolsos com zíper emborrachado impedem o celular de cair no chão do treino ou do carro."

🎬 CENA 4 (13-17s) - BARRA ANATÔMICA NO TORNOZELO:
- Mostrando que o punho no tornozelo não aperta a circulação e não fica subindo.
- Narração: "Barra justa que valoriza o calçado sem estrangular a canela."

🎬 CENA 5 (17-22s) - CTA:
- Apontando para o carrinho amarelo:
- Narração: "Menos de R$ 49 no carrinho amarelo do TikTok Shop com cupom exclusivo de hoje. Garanta a sua!"`,
      },
      // 66. Fitness & Academia - PRO
      {
        title:
          'Calça Legging Scrunch Butt com Efeito Empina Bumbum 3D - Modelo Agachamento Academia',
        description:
          'Modelo fazendo agachamento sumô na academia demonstrando o efeito franzido scrunch butt que desenha e empina o glúteo.',
        niche: 'fitness_academia',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'A legging scrunch butt que empina o bumbum instantaneamente sem precisar de silicone!',
        call_to_action:
          'Franzido anatômico reforçado que não rasga no agachamento. Link no carrinho amarelo!',
        tags: 'legging scrunch butt, empina bumbum, fitness feminino, academia, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=scrunch+butt+leggings+woman+gym+squat&color=purple',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 23 SEGUNDOS]

🎬 CENA 1 (0-3s) - O EFEITO VISUAL IMEDIATO NO ESPELHO (HOOK):
- Modelo de costas no espelho da academia dando um passo lateral: o franzido anatômico scrunch butt separa e valoriza os glúteos de forma harmoniosa.
- Texto na tela: "O BUMBUM DOS SONHOS NO TREINO 🍑🔥"
- Narração empolgada: "Se você treina pesado e quer que seu esforço apareça no espelho da academia, essa legging é a sua maior aliada!"

🎬 CENA 2 (3-9s) - O ELÁSTICO INTERNO REFORÇADO ANTI-RASGO:
- Puxando a costura central franzida com as mãos: reforço elástico de alta tenacidade que não arrebenta sob pressão extrema.
- Narração: "O franzido tem costura dupla com fio de alta tenacidade: não arrebenta no agachamento pesado e não machuca a pele."

🎬 CENA 3 (9-14s) - CÓS COMPRESSIVO DE 14CM QUE AFINA A CINTURA:
- Close na cintura alta abraçando o abdômen sem enrolar.
- Narração: "Cós super alto com compressão em V que afina a cintura e cria aquele contraste maravilhoso com o quadril."

🎬 CENA 4 (14-18s) - TESTE TOTAL DE ZERO TRANSPARÊNCIA:
- Modelo fazendo agachamento completo sob a luz branca potente da academia: zero transparência.
- Narração: "Tecido de 340 gramas 100% à prova de agachamento profundo."

🎬 CENA 5 (18-23s) - CTA:
- Modelo sorrindo e apontando para o carrinho amarelo:
- Narração: "Cores vibrantes e neutras disponíveis no carrinho amarelo aqui embaixo com frete grátis hoje!"`,
      },
      // 67. Fitness & Academia - PRO
      {
        title: 'Macaquinho Fitness Curto com Costas Cavadas e Bojo - Unboxing Vitrine Gym',
        description:
          'Tirando da embalagem o macaquinho fitness em tecido canelado acetinado, com alças cruzadas nas costas e zero transparência.',
        niche: 'fitness_academia',
        style: 'unboxing_vitrine',
        platform: 'shopee',
        is_free: false,
        hook: 'O macaquinho fitness de R$ 38 que resolve seu look de treino com 1 peça só!',
        call_to_action:
          'Suplex canelado encorpado com bojo anatômico incluso. Link seguro na sacolinha!',
        tags: 'macaquinho fitness, costas abertas, treino feminino, unboxing shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=fitness+romper+onesie+workout+unboxing&color=cyan',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 21 SEGUNDOS]

🎬 CENA 1 (0-3s) - A PRATICIDADE DO LOOK ÚNICO DE TREINO (HOOK):
- Tirando o macaquinho fitness da embalagem e esticando contra a luz.
- Texto na tela: "LOOK COMPLETO POR R$ 38 💪✨"
- Narração dinâmica: "A praticidade de colocar uma peça única pra treinar sem precisar ficar combinando top com legging!"

🎬 CENA 2 (3-8s) - AS COSTAS CAVADAS COM TIRAS DUPLAS:
- Mostrando o recorte nas costas com tiras finas cruzadas que valorizam a musculatura dorsal.
- Narração: "As costas cavadas dão ventilação e liberdade de movimento, e as alças duplas dão sustentação perfeita."

🎬 CENA 3 (8-13s) - COMPRIMENTO MEIA-COXA QUE NÃO SOBE:
- Mostrando a barra da perna com costura rebatida que não aperta nem enrola na virilha.
- Narração: "O shorts tem comprimento ideal que não fica subindo e não assa a parte interna da coxa."

🎬 CENA 4 (13-17s) - BOJO REMOVÍVEL E FORRO NO BUSTO:
- Mostrando a facilidade de retirar o bojo pela abertura lateral para lavar na máquina.
- Narração: "Já vem com bojo moldado anatômico e tecido duplo em todo o busto."

🎬 CENA 5 (17-21s) - CTA:
- Apontando para o link da sacolinha da Shopee:
- Narração: "Disponível nas cores preto, azul marinho, verde militar e marsala. Clica na sacolinha aqui do vídeo e garanta o seu!"`,
      },
      // 68. Moda Praia - PRO
      {
        title: 'Biquíni Hot Pants com Cós Alto Modelador e Top Meia-Taça - POV Dia de Lancha',
        description:
          'POV entrando na lancha em alto mar com biquíni hot pants elegante retrô, top estruturado com aro e óculos escuros de grife.',
        niche: 'moda_praia',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'POV: O biquíni hot pants retrô que esconde a pochete e te deixa com visual de cinema europeu!',
        call_to_action:
          'Calcinha cós alto duplo compressivo com tecido canelado premium. Link no carrinho amarelo!',
        tags: 'biquini hot pants, retro chic, maio lancha, disfarca barriga, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=high+waisted+retro+bikini+woman+boat+yacht&color=cyan',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 23 SEGUNDOS]

🎬 CENA 1 (0-3s) - A SOFISTICAÇÃO RETRÔ EM ALTO MAR (HOOK):
- POV na proa da lancha com mar cristalino ao fundo, segurando chapéu de palha com biquíni hot pants azul marinho / branco.
- Texto na tela: "O BIQUÍNI MAIS CHIQUE DO VERÃO 🚤🌊"
- Narração envolvente: "POV: Você queria um biquíni que disfarçasse a barriguinha sem perder a sensualidade e comprou o modelo mais elogiado do passeio de barco!"

🎬 CENA 2 (3-9s) - O CÓS ALTO MODELADOR QUE SEGURA TUDO:
- Mão passando pela cintura da calcinha hot pants: tecido duplo compressivo que modela o abdômen sem marcar dobrinhas.
- Narração: "A calcinha hot pants tem forro duplo de compressão moderada: segura a pochete, modela a cintura e a cava traseira não fica fraldão."

🎬 CENA 3 (9-14s) - O TOP MEIA-TAÇA COM ARO RETRÔ:
- Close no top meia-taça estruturado com aro reforçado e alças largas que não machucam o pescoço.
- Narração: "O top meia-taça levanta o busto de forma natural e as alças são reguláveis como sutiã de luxo."

🎬 CENA 4 (14-18s) - TECIDO ATOALHADO CINTILANTE COM PROTEÇÃO UV:
- Mostrando a textura encorpada que não fica transparente nem ensaca quando você mergulha no mar.
- Narração: "Não fica pesado ao sair da água e seca super rápido com o vento."

🎬 CENA 5 (18-23s) - CTA:
- Apontando para o carrinho amarelo:
- Narração: "Mais de 5 mil clientes avaliaram com 5 estrelas. Deixei o link no carrinho amarelo do TikTok Shop com cupom relâmpago hoje!"`,
      },
      // 69. Calçados & Acessórios - PRO
      {
        title: 'Bolsa Baguete Tiracolo com Corrente Prata e Couro Croco - Modelo Noite Balada',
        description:
          'Modelo caminhando à noite com bolsa baguete de ombro com textura croco brilhante, fecho magnético e alça com elos de corrente.',
        niche: 'acessorios_calcados',
        style: 'modelo',
        platform: 'shopee',
        is_free: false,
        hook: 'A bolsa baguete de R$ 32 que parece ter custado R$ 500 em boutique de shopping!',
        call_to_action:
          'Couro sintético textura croco brilhante com corrente de metal que não descasca. Link na sacolinha!',
        tags: 'bolsa baguete, textura croco, corrente prata, look balada, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=baguette+shoulder+bag+croco+chain+woman+night&color=black',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 21 SEGUNDOS]

🎬 CENA 1 (0-3s) - O BRILHO DA TEXTURA CROCO (HOOK):
- Modelo com a bolsa baguete preta sob o braço, o acabamento croco brilhante refletindo a luz dos postes da cidade.
- Texto na tela: "PARECE DE R$ 500 POR R$ 32 👜🖤"
- Narração sedutora: "A bolsa curinga que toda mulher estilosa precisa pra sair à noite e não carregar tralha pesada!"

🎬 CENA 2 (3-8s) - O PESO DA CORRENTE DE METAL:
- ASMR da corrente de elos metálicos tilintando com brilho prateado reluzente.
- Narração: "A corrente não é de plástico pintado: é metal pesado com banho antioxidante que não escurece."

🎬 CENA 3 (8-13s) - CABE CELULAR GRANDE, CHAVE E GLOSS:
- Abrindo o fecho magnético e tirando o smartphone Pro Max, chaveiro e batom com facilidade.
- Narração: "Tem o tamanho perfeito: cabe seu smartphone grande, cartão, chave e gloss sem ficar deformada ou estufada."

🎬 CENA 4 (13-17s) - DUAS OPÇÕES DE ALÇA:
- Dá pra usar no ombro com a alça curta estilo anos 2000 ou transversal com a alça longa ajustável inclusa.
- Narração: "Vem com duas opções de alça pra você usar no ombro ou na transversal."

🎬 CENA 5 (17-21s) - CTA:
- Modelo apontando para a sacolinha da Shopee:
- Narração: "Disponível nas cores preto, branco e prata holográfico na sacolinha aqui da Shopee com frete grátis hoje!"`,
      },
      // 70. Calçados & Acessórios - PRO
      {
        title: 'Sandália Papete com Tiras em Strass e Palmilha Ortopédica - Unboxing Vitrine Glam',
        description:
          'Tirando da caixa a papete anatômica com tiras repletas de cristais de strass reluzentes e palmilha em formato do pé.',
        niche: 'acessorios_calcados',
        style: 'unboxing_vitrine',
        platform: 'ambos',
        is_free: false,
        hook: 'A papete de strass mais confortável do Brasil: BRILHO DE FESTA COM CONFORTO DE TÊNIS!',
        call_to_action:
          'Palmilha anatômica em EVA macio e cristais de strass fixados a laser. Link na vitrine!',
        tags: 'papete strass, sandalia confortavel, brilho festa, calcados femininos, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=rhinestone+platform+sandals+sparkle+unboxing&color=white',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP / SHOPEE - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - O BRILHO DOS CRISTAIS (HOOK):
- Tirando a sandália da embalagem: os cristais de strass dispostos nas tiras explodem em brilho sob a luz do estúdio.
- Texto na tela: "BRILHO DE FESTA + CONFORTO DE TÊNIS ✨👡"
- Narração encantadora: "Quem disse que pra andar arrumada e brilhante você precisa sofrer em cima de um salto fino? Veja essa papete!"

🎬 CENA 2 (3-9s) - A PALMILHA ANATÔMICA ORTOPÉDICA:
- Dedo polegar afundando na palmilha conformada com apoio de arco plantar e calcanhar profundo.
- Narração: "A palmilha tem formato ortopédico com apoio pro arco do pé: distribui o peso do corpo e você pode andar o dia todo sem dores."

🎬 CENA 3 (9-14s) - CRISTAIS PRENSADOS A LASER:
- Passando os dedos com força sobre as tiras de strass: nenhum cristal solta ou arranha os dedos.
- Narração: "O strass é prensado em alta temperatura e a parte interna das tiras é acolchoada pra não machucar o peito do pé."

🎬 CENA 4 (14-18s) - SOLADO ANTIDERRAPANTE:
- Mostrando as ranhuras de borracha antiderrapante na sola de 3cm que dá estabilidade em qualquer piso.
- Narração: "Sola tratorada leve que não escorrega em piso molhado de festa ou shopping."

🎬 CENA 5 (18-22s) - CTA:
- Apontando para o botão da vitrine:
- Narração: "Forma normal do 34 ao 40 na vitrine aqui embaixo. Clica e aproveita a promoção com frete grátis antes que esgote o lote!"`,
      },
    ]

    for (let i = 0; i < proPromptsPart6.length; i++) {
      const p = proPromptsPart6[i]
      const existing = app.findRecordsByFilter(
        'prompts',
        `title = '${p.title.replace(/'/g, "''")}'`,
        '',
        1,
        0,
      )
      if (existing && existing.length > 0) {
        continue
      }

      const rec = new Record(promptsCol)
      rec.set('title', p.title)
      rec.set('description', p.description)
      rec.set('niche', p.niche)
      rec.set('style', p.style)
      rec.set('platform', p.platform)
      rec.set('is_free', p.is_free)
      rec.set('hook', p.hook)
      rec.set('call_to_action', p.call_to_action)
      rec.set('tags', p.tags)
      rec.set('reference_image_url', p.reference_image_url)
      rec.set('reference_video_url', '')
      rec.set('prompt_text', p.prompt_text)
      app.save(rec)
    }
  },
  (app) => {},
)
