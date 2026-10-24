/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const promptsCol = app.findCollectionByNameOrId('prompts')

    const proPromptsPart4 = [
      // 41. Moda Feminina - PRO
      {
        title: 'Trench Coat Clássico com Cinto e Fivela Resina - Modelo Cidade Cosmopolita',
        description:
          'Modelo caminhando sob garoa fina com casaco trench coat impermeável cáqui, gola estruturada e cinto largo marcando a silhueta.',
        niche: 'moda_feminina',
        style: 'modelo',
        platform: 'ambos',
        is_free: false,
        hook: 'O trench coat que te transforma na protagonista de um filme de outono em Nova York!',
        call_to_action:
          'Tecido gabardine impermeável com forro acetinado. Link com envio rápido na vitrine!',
        tags: 'trench coat, casaco outono, gabardine elegante, executiva chic, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=classic+khaki+trench+coat+woman+rain+city&color=orange',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP / SHOPEE - 23 SEGUNDOS]

🎬 CENA 1 (0-3s) - O GANCHO CINEMATOGRÁFICO DE INVERNO (HOOK):
- Passada firme da modelo com o trench coat cáqui esvoaçando com o vento, óculos de sol pretos e guarda-chuva fechado na mão.
- Texto na tela: "ELEGÂNCIA MÁXIMA EM QUALQUER CLIMA 🍂🌂"
- Narração refinada: "Se tem uma peça clássica que toda mulher elegante precisa ter no armário pro resto da vida, é o trench coat perfeito!"

🎬 CENA 2 (3-9s) - O TESTE DA REPELÊNCIA À CHUVA:
- Gotas de garoa batem no tecido de gabardine encorpado e escorrem sem molhar o tecido.
- Narração: "Feito em gabardine resinada que repele chuva e barra o vento. O forro interno acetinado desliza sobre vestidos ou blusas de frio."

🎬 CENA 3 (9-14s) - DETALHES DE ALTA ALFAIATARIA:
- Mostrando a pala de chuva nas costas, os punhos com fivelas reguláveis e o cinto com fivela de resina tartaruga.
- Narração: "A cintura fica ultrafina com a amarração transpassada e a lapela dupla dá aquele ar nobre de capital europeia."

🎬 CENA 4 (14-18s) - VERSATILIDADE COM TÊNIS OU SALTO:
- Modelo usando aberto com calça jeans e mocassim, e fechado com scarpin e meia-calça preta.
- Narração: "Combina tanto com look de escritório formal quanto com jeans despretensioso pro final de semana."

🎬 CENA 5 (18-23s) - CTA:
- Modelo apontando para a vitrine com um sorriso:
- Narração: "Peça importada premium com envio nacional e garantia total de troca. Clica na vitrine aqui embaixo e garante o seu antes do frio!"`,
      },
      // 42. Moda Feminina - PRO
      {
        title: 'Vestido Canelado com Fenda Traseira e Decote V - Unboxing Vitrine Festa',
        description:
          'Abertura de pacote com vestido canelado azul petróleo/terracota com toque de cashmere, costura modeladora nas costas e decote que alonga o colo.',
        niche: 'moda_feminina',
        style: 'unboxing_vitrine',
        platform: 'shopee',
        is_free: false,
        hook: 'O vestido canelado de R$ 42 da Shopee que te deixa com corpo de modelo em 2 minutos!',
        call_to_action:
          'Malha canelada encorpada anti-transparência. Link seguro na sacolinha da Shopee!',
        tags: 'vestido canelado fenda, decote v, unboxing shopee, moda feminina festa',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=ribbed+midi+dress+back+slit+woman+unboxing&color=cyan',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 21 SEGUNDOS]

🎬 CENA 1 (0-3s) - O UNBOXING DOS SONHOS (HOOK):
- Tirando o vestido da embalagem com etiqueta de confecção e acabamento impecável.
- Texto na tela: "COMPREI POR R$ 42 E CHOQUEI 😱👗"
- Narração animada: "Eu paguei menos de 45 reais nesse vestido canelado achando que seria fino e quando abri a caixa fiquei sem palavras!"

🎬 CENA 2 (3-8s) - A DENSIDADE DO CANELADO:
- Mão esticando o tecido contra a luz: trama fechada, sem nenhuma transparência e elasticidade com retorno firme.
- Narração: "Tecido canelado premium de alta densidade que abraça a cintura e disfarça celulites sem marcar roupa íntima."

🎬 CENA 3 (8-13s) - A FENDA TRASEIRA E DECOTE V:
- Mostrando a fenda na parte de trás que dá elegância e mobilidade para subir escadas e andar.
- Narração: "A fenda nas costas dá aquele charme sensual discreto e o decote em V valoriza o colo de forma feminina e delicada."

🎬 CENA 4 (13-17s) - PROVA NO CORPO:
- Transição mostrando a peça vestida no corpo com sandália de salto bloco e colar dourado.
- Narração: "Veste como luva do 36 ao 44 sem precisar de nenhum ajuste."

🎬 CENA 5 (17-21s) - CTA:
- Apontando para a sacolinha:
- Narração: "Cores terracota, preto e verde militar disponíveis com frete grátis da Shopee hoje. Clica e aproveite o cupom!"`,
      },
      // 43. Moda Masculina - PRO
      {
        title: 'Calça Cargo Streetwear Baggy com 8 Bolsos e Fitas Táticas - POV Urbano Noturno',
        description:
          'POV andando com a calça cargo ampla com fitas táticas balançando, bolsos volumosos e barra ajustável sobre tênis chunky.',
        niche: 'moda_masculina',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'POV: A calça cargo tática que todo mundo no evento vai perguntar de qual marca gringa você importou!',
        call_to_action:
          'Tecido ripstop militar resistente a rasgos com 8 bolsos funcionais. Link no carrinho amarelo!',
        tags: 'calca cargo tatica, fitas streetwear, baggy masculina, techwear, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=tactical+cargo+pants+straps+man+streetwear+night&color=black',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 23 SEGUNDOS]

🎬 CENA 1 (0-3s) - O GANCHO DO VISUAL IMPACTANTE (HOOK):
- POV olhando para baixo no espelho com a calça cargo preta cheia de bolsos funcionais, fitas táticas e tênis chunky volumoso.
- Texto na tela: "A CARGO MAIS RESPEITADA DA CENA 🔥🛹"
- Narração envolvente: "POV: Você demorou meses pra achar a cargo tática perfeita com estilo techwear e encontrou na TikTok Shop por uma pechincha!"

🎬 CENA 2 (3-9s) - OS 8 BOLSOS FUNCIONAIS & FITAS:
- Mão demonstrando os bolsos com zíperes vedados, fecho em velcro reforçado e fitas ajustáveis com fivelas de engate rápido.
- Narração: "São 8 bolsos reais profundos que acomodam celular, fone e carteira sem estufar a perna, e as fitas táticas dão aquele visual futurista pesado."

🎬 CENA 3 (9-14s) - O TECIDO RIPSTOP MILITAR:
- Arrastando a unha ou chave no tecido: zero fios puxados!
- Narração: "Tecido ripstop antirasgo com trama entrelaçada militar. Aguenta atrito no asfalto, skate e não desbota na máquina."

🎬 CENA 4 (14-18s) - A BARRA DUPLA (BAGGY OU JOGGER):
- Ajustando o cordão elástico no tornozelo: opção reta ampla sobre o tênis ou presa tipo jogger.
- Narração: "Dá pra usar solta cobrindo o tênis ou presa no tornozelo destacando seu calçado."

🎬 CENA 5 (18-23s) - CTA:
- Apontando pro carrinho amarelo:
- Narração: "Sai pela metade do valor das marcas de streetwear nacional. Clica no carrinho amarelo aqui embaixo antes que termine a grade de numeração!"`,
      },
      // 44. Moda Masculina - PRO
      {
        title: 'Camiseta Básica em Algodão Peruano Fio 40.1 - Modelo Studio Minimalista',
        description:
          'Modelo masculino com camiseta slim fit toque de seda, demonstrando o caimento nos ombros, gola indeformável e maciez incomparável.',
        niche: 'moda_masculina',
        style: 'modelo',
        platform: 'shopee',
        is_free: false,
        hook: 'Depois que você vestir uma camiseta de algodão peruano, NUNCA MAIS vai querer outra peça!',
        call_to_action:
          '100% algodão pima peruano com fio 40.1 penteado. Link seguro na sacolinha da Shopee!',
        tags: 'algodao peruano, camiseta basica masculina, fio 40, toque de seda, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=pima+cotton+tshirt+man+studio+minimal+clean&color=white',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - A DIFERENÇA DO TOQUE DE SEDA (HOOK):
- Modelo fecha os olhos e passa a mão no peito da camiseta branca sentindo a maciez extraordinária.
- Texto na tela: "O ALGODÃO MAIS MACIO DO MUNDO ☁️👕"
- Narração sincera: "Se você pensa que camiseta básica é tudo igual, você nunca sentiu o toque do verdadeiro algodão peruano no corpo!"

🎬 CENA 2 (3-9s) - A FIBRA LONGA QUE NÃO FAZ BOLINHAS:
- Close na textura ultra lisa da malha sem pelos nem fiapos sob luz difusa de estúdio.
- Narração: "O fio 40.1 de fibra longa pima peruana não cria bolinhas, não esquenta no verão e tem caimento fluido que desenha os ombros sem apertar."

🎬 CENA 3 (9-14s) - GOLA CANELADA INDEFORMÁVEL:
- Esticando a gola com as mãos: a gola retorna ao formato perfeito sem ficar torta ou relaxada.
- Narração: "Costura tripla e reforço interno que não deforma mesmo após dezenas de lavagens na máquina."

🎬 CENA 4 (14-18s) - TESTE ANTI-TRANSPARÊNCIA:
- Mesmo na cor branca pura: sem marcas de mamilos ou transparência incômoda sob luz forte.
- Narração: "Branco puro com densidade perfeita pra usar no trabalho ou sob blazer."

🎬 CENA 5 (18-22s) - CTA:
- Modelo apontando para a sacolinha da Shopee:
- Narração: "Kit com 3 camisetas no precinho direto do fabricante na sacolinha oficial aqui do vídeo. Aproveite o frete grátis hoje!"`,
      },
      // 45. Fitness & Academia - PRO
      {
        title: 'Shorts Saia Fitness com Pregas Estilo Tennis Core - Modelo Quadra / Academia',
        description:
          'Modelo em quadra com saia plissada estilosa com shorts de compressão interno embutido e bolso invertido para bolinha ou celular.',
        niche: 'fitness_academia',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'O shorts saia plissado que domina a estética Tennis Core e não sobe no treino!',
        call_to_action:
          'Shorts interno anti-atrito com bolso invertido funcional. Link no carrinho amarelo!',
        tags: 'tennis core, shorts saia plissada, academia feminina, estilo gringa, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=pleated+tennis+skirt+woman+court+sporty&color=white',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - O CHARME DA TENDÊNCIA TENNIS CORE (HOOK):
- Modelo dando um giro na quadra ou academia: as preguinhas da saia abrem com leveza e o shorts interno garante discrição absoluta.
- Texto na tela: "A PEÇA MAIS VIRAL DO PINTEREST 🎾✨"
- Narração vibrante: "A estética tennis core virou febre no mundo inteiro e esse shorts saia é a melhor peça pra treinar e passear no final de semana!"

🎬 CENA 2 (3-8s) - O SHORTS DE COMPRESSÃO INTERNO:
- Levantando suavemente uma prega da saia: a bermudinha interna justa cobre toda a coxa sem subir nem marcar.
- Narração: "Por baixo das preguinhas tem um shorts de compressão confortável: você pode correr, pular e agachar sem medo nenhum."

🎬 CENA 3 (8-13s) - BOLSO INVERTIDO PARA BOLINHA OU CELULAR:
- Colocando o celular ou bolinha de tênis no bolso anatômico da coxa:
- Narração: "Tem bolso lateral inteligente que segura o celular ou a bolinha de tênis bem firme durante a partida."

🎬 CENA 4 (13-17s) - CINTURA ALTA QUE MODELA:
- Mostrando a faixa de cós largo que aperta a linha da cintura e disfarça o abdômen.
- Narração: "O cós alto modela a cintura e as pregas são térmicas e não desmancham ao lavar."

🎬 CENA 5 (17-22s) - CTA:
- Modelo sorrindo com a raquete na mão e apontando pro carrinho amarelo:
- Narração: "Disponível em branco, preto, rosa bebê e verde menta. Clica no carrinho amarelo aqui embaixo antes que esgote!"`,
      },
      // 46. Fitness & Academia - PRO
      {
        title: 'Top Fitness Cruzado com Amarração na Cintura - POV Provador Espelho',
        description:
          'POV no espelho amarrando as tiras transpassadas do top fitness que desenham a linha da cintura e dão suporte aos seios.',
        niche: 'fitness_academia',
        style: 'pov',
        platform: 'shopee',
        is_free: false,
        hook: 'POV: O top de academia que afina a cintura com as tiras transpassadas e custou R$ 24!',
        call_to_action:
          'Tecido suplex de alta sustentação com bojo removível. Link seguro na sacolinha da Shopee!',
        tags: 'top transpassado, academia feminina, afina cintura, amarracao, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=crossover+wrap+sports+bra+woman+mirror+gym&color=pink',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 21 SEGUNDOS]

🎬 CENA 1 (0-3s) - O TRUQUE DAS TIRAS NA CINTURA (HOOK):
- POV em frente ao espelho com as tiras longas do top cruzando na frente do abdômen e amarrando atrás.
- Texto na tela: "AFINA A CINTURA NA HORA ⏳⚡"
- Narração empolgada: "POV: O dia em que você comprou aquele top que as gringas usam e descobriu o poder das tiras transpassadas!"

🎬 CENA 2 (3-8s) - O DESENHO DA CINTURA DE PILÃO:
- Girando de lado: as tiras cruzadas criam uma ilusão de ótica que estreita a silhueta da cintura instantaneamente.
- Narração: "O recorte transpassado dá a sensação de cintura fininha e o decote em V sustenta o busto com elegância."

🎬 CENA 3 (8-13s) - SUSTENTAÇÃO NO TREINO DE CARDIO:
- Dando dois pulinhos no provador: os seios ficam firmes sem balançar ou escapar.
- Narração: "Tem bojo removível de alta densidade e tecido duplo de poliamida com elastano que não fica transparente sob luz forte."

🎬 CENA 4 (13-17s) - COMBINAÇÃO COM LEGGING OU JEANS:
- Mostrando como fica lindo também como cropped para sair à noite com calça jeans e jaqueta.
- Narração: "É tão lindo que dá pra usar tanto pra malhar quanto pra sair com calça jeans."

🎬 CENA 5 (17-21s) - CTA:
- Apontando para o link da sacolinha:
- Narração: "Menos de 25 reais na Shopee com frete grátis no app. Clica na sacolinha aqui do vídeo e garanta o seu!"`,
      },
      // 47. Moda Praia - PRO
      {
        title:
          'Biquíni Cortininha com Ponteiras Douradas e Tecido Canelado Brilhante - Unboxing ASMR Vitrine',
        description:
          'Abertura de saquinho impermeável com biquíni cortininha em tom terracota cintilante, com pingentes banhados e forro aveludado.',
        niche: 'moda_praia',
        style: 'unboxing_vitrine',
        platform: 'ambos',
        is_free: false,
        hook: 'O biquíni com tecido cintilante que brilha no sol e tem as ponteiras douradas mais perfeitas!',
        call_to_action:
          'Poliamida com fio brilhoso e forro duplo com toque de seda. Link na vitrine!',
        tags: 'biquini cintilante, ponteiras douradas, moda praia luxo, unboxing asmr, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=glimmer+shimmer+bikini+gold+tips+unboxing&color=orange',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP / SHOPEE - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - O BRILHO CINTILANTE SOB O SOL (HOOK):
- Tirando o biquíni do saquinho plástico holográfico: os fios cintilantes refletem o sol como ouro líquido.
- Texto na tela: "BRILHA IGUAL OURO NO SOL ☀️👙"
- Narração deslumbrada: "Se você quer o biquíni que vai garantir as fotos mais curtidas das suas férias, olha esse tecido!"

🎬 CENA 2 (3-9s) - AS PONTEIRAS DOURADAS PESADAS:
- Som ASMR tilintando as ponteiras metálicas nas pontas dos cordões de amarração.
- Narração: "As ponteiras são de metal zamac banhado a ouro que não enferrujam com sal nem cloro, e têm peso que deixa o caimento impecável."

🎬 CENA 3 (9-14s) - TECIDO DUPLO QUE NÃO TRANSPASS:
- Esticando o tecido com as duas mãos:
- Narração: "Tecido canelado com microbrilho acetinado, forro duplo bege interno super macio e bojo que pode ser tirado pra lavar."

🎬 CENA 4 (14-18s) - CALCINHA COM EMPINA BUMBUM SUTIL:
- Mostrando a costura anatômica central traseira que valoriza a curva do bumbum sem incomodar.
- Narração: "A modelagem semi-fio traseira deixa a marquinha dos sonhos sem machucar."

🎬 CENA 5 (18-22s) - CTA:
- Apontando para o link da vitrine:
- Narração: "O vendedor despacha no mesmo dia com frete promocional. Clica no link aqui embaixo da vitrine e garanta a sua cor!"`,
      },
      // 48. Calçados & Acessórios - PRO
      {
        title: 'Bota Over The Knee em Camurça Ajustável com Cordão - Modelo Noite Fria',
        description:
          'Modelo caminhando com bota acima do joelho ajustada na coxa que não escorrega ao andar, com salto bloco confortável de 6cm.',
        niche: 'acessorios_calcados',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'A bota over the knee que NÃO escorrega da coxa a cada passo!',
        call_to_action:
          'Camurça stretch ajustável com amarração traseira e salto bloco 6cm. Link no carrinho amarelo!',
        tags: 'bota over the knee, bota acima do joelho, nao escorrega, outono inverno, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=over+the+knee+boots+woman+night+city+heels&color=black',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 23 SEGUNDOS]

🎬 CENA 1 (0-3s) - O TESTE DO NÃO ESCORREGAR (HOOK):
- Passadas firmes da modelo subindo degraus com a bota preta acima do joelho perfeitamente firme na coxa.
- Texto na tela: "FINALMENTE UMA BOTA QUE NÃO CAI! 👢🖤"
- Narração decidida: "Quem tem bota over the knee sabe o desespero de ter que parar na rua a cada 5 minutos pra puxar o cano pra cima. Veja a solução!"

🎬 CENA 2 (3-9s) - O CORDÃO DE AMARRAÇÃO TRASEIRO ANATÔMICO:
- Close na parte de trás da coxa: o cordão elástico com trava permite ajustar na medida exata da sua perna (fina ou grossa).
- Narração: "Ela tem fita interna de silicone antiderrapante e cordão ajustável atrás: abraça a coxa e fica travada o dia inteiro!"

🎬 CENA 3 (9-14s) - SALTO BLOCO DE 6CM ULTRA CONFORTÁVEL:
- Modelo caminhando e dando um giro seguro no chão de calçada:
- Narração: "Salto bloco encorpado de 6 centímetros: adiciona altura e presença, mas dá pra dançar a noite toda na balada sem dor nos pés."

🎬 CENA 4 (14-18s) - O TOQUE DO SUEDE STRETCH:
- A camurça sintética estica suavemente acompanhando a curva da perna.
- Narração: "Suede com elastano que veste desde coxas finas até coxas mais grossas com total conforto."

🎬 CENA 5 (18-23s) - CTA:
- Modelo apontando para o carrinho amarelo:
- Narração: "Em lojas de sapato famosa custa mais de R$ 390. No carrinho amarelo do TikTok Shop tá pela metade do preço com frete grátis!"`,
      },
      // 49. Streetwear & Casual - PRO
      {
        title: 'Calça Jeans Wide Leg Estonada com Rasgos nos Joelhos - POV Provador Street',
        description:
          'POV no provador combinando calça jeans wide leg com destroyed feito a laser, tênis plataforma e cinto preto.',
        niche: 'streetwear_casual',
        style: 'pov',
        platform: 'shopee',
        is_free: false,
        hook: 'POV: Você achou o jeans rasgado no ponto certo que te deixa estilosa sem parecer desleixada!',
        call_to_action:
          '100% algodão 12oz com lavagem vintage estonada. Link na sacolinha da Shopee!',
        tags: 'jeans wide leg, calca rasgada, streetwear feminino, look anos 90, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=ripped+wide+leg+jeans+woman+fitting+room&color=blue',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - O GANCHO DO RASGO ELEGANTE (HOOK):
- POV em frente ao espelho com calça jeans clara wide leg com rasgos simétricos na altura dos joelhos.
- Texto na tela: "O JEANS MAIS PERFEITO DA SHOPEE 👖✨"
- Narração empolgada: "POV: O dia em que você comprou um jeans destroyed na internet e o rasgo caiu no lugar exato do joelho sem abrir demais!"

🎬 CENA 2 (3-9s) - A DENSIDADE DO JEANS 100% ALGODÃO:
- Batendo na coxa mostrando o som firme do jeans grosso tradicional de 12oz.
- Narração: "Jeans pesado de verdade 100% algodão que não deforma após lavar, com lavagem estonada vintage com tonalidade linda."

🎬 CENA 3 (9-14s) - CINTURA ALTA COM CÓS FIRME:
- Mão passando nas costas mostrando que a calça abraça a lombar sem deixar vão nas costas.
- Narração: "Cintura alta bem ajustada e barra ampla com caimento solto que fica perfeito cobrindo o calçado."

🎬 CENA 4 (14-18s) - RESISTÊNCIA DOS FIOS DO DESTROYED:
- Puxando os fios do rasgo com os dedos: reforço térmico por dentro que impede o rasgo de abrir no joelho.
- Narração: "Os rasgos têm acabamento que não vai rasgar mais quando você sentar ou dobrar a perna."

🎬 CENA 5 (18-22s) - CTA:
- Apontando pro link da sacolinha:
- Narração: "Tamanhos do 36 ao 44 com tabela de centímetros detalhada na sacolinha da Shopee. Clica aqui antes que acabe a reposição!"`,
      },
      // 50. Infantil & Kids - PRO
      {
        title:
          'Mochila Infantil Escolar com Rodinhas 3D e Lancheira Térmica - Unboxing Vitrine Volta às Aulas',
        description:
          'Abertura de caixa com kit escolar infantil com rodinhas de silicone que sobem escada, estampa 3D em relevo e lancheira combinando.',
        niche: 'infantil_kids',
        style: 'unboxing_vitrine',
        platform: 'ambos',
        is_free: false,
        hook: 'O kit escolar com rodinhas que SOBE ESCADA e não quebra com o peso dos cadernos!',
        call_to_action:
          'Rodinhas de silicone triplas para degraus e tecido impermeável. Link na vitrine!',
        tags: 'mochila escolar rodinhas, sobe escada, volta as aulas, kit infantil, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=kids+backpack+wheels+lunchbox+unboxing&color=blue',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP / SHOPEE - 23 SEGUNDOS]

🎬 CENA 1 (0-3s) - O TESTE DAS RODINHAS QUE SOBEM ESCADA (HOOK):
- Puxando a mochila pelos degraus da escada: as rodinhas triplas em estrela sobem os degraus suavemente sem travar nem bater!
- Texto na tela: "A MOCHILA QUE SOBE ESCADA! 🎒🚀"
- Narração entusiasmada: "Pais e mães: parem de comprar mochila de rodinha frágil que quebra na primeira semana de aula!"

🎬 CENA 2 (3-9s) - O RELEVO 3D IMPERMEÁVEL:
- Close na carcaça frontal em relevo 3D termoformado rígido que protege os materiais escolares de quedas e chuva.
- Narração: "Frente rígida em 3D resistente a impacto e 100% impermeável: se cair suco ou chuva, os cadernos continuam sequinhos dentro."

🎬 CENA 3 (9-14s) - ESPAÇO INTERNO & DIVISÓRIAS:
- Abrindo os zíperes reforçados: cabe caderno universitário de 10 matérias, estojo grande, casaco e bolsos laterais para garrafa.
- Narração: "Divisórias acolchoadas com zíperes tratorados fáceis de abrir pelas mãozinhas das crianças."

🎬 CENA 4 (14-18s) - ACOMPANHA LANCHEIRA TÉRMICA E ESTOJO:
- Mostrando a lancheira com forro térmico prateado que conserva o lanche frio ou quente por até 4 horas.
- Narração: "Já vem com a lancheira térmica combinando e o estojo duplo oficial do kit."

🎬 CENA 5 (18-23s) - CTA:
- Apontando para o botão da vitrine:
- Narração: "Kit completo de volta às aulas pelo preço de uma mochila simples de shopping. Clica no link aqui embaixo da vitrine!"`,
      },
    ]

    for (let i = 0; i < proPromptsPart4.length; i++) {
      const p = proPromptsPart4[i]
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
