/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const promptsCol = app.findCollectionByNameOrId('prompts')

    const proPromptsPart2 = [
      // 21. Moda Praia - PRO
      {
        title: 'Biquíni Asa Delta Texturizado com Aro de Sustentação - Modelo na Beira da Piscina',
        description:
          'Modelo em cenário ensolarado com biquíni estruturado de aro contínuo, tecido com relevo canelado cintilante e calcinha asa delta anatômica.',
        niche: 'moda_praia',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'O biquíni com aro que empina o busto sem apertar e alonga a perna em 5cm!',
        call_to_action:
          'Tecido texturizado com proteção UV50+ e bojo com sustentação em aro. Link no carrinho amarelo!',
        tags: 'biquini asa delta, aro sustentacao, moda praia chic, verao, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=underwire+textured+bikini+swimsuit+woman+pool&color=pink',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 23 SEGUNDOS]

🎬 CENA 1 (0-3s) - O GANCHO DO RELEVO & LUZ SOLAR (HOOK):
- Modelo saindo suavemente da piscina ou espreguiçadeira com sol refletindo a textura nobre do biquíni.
- Texto na tela em destaque: "O BIQUÍNI QUE MAIS VALORIZA O CORPO ☀️👙"
- Narração magnética: "Se você quer um biquíni que dê sustentação real de sutiã de luxo e desenhe a silhueta da perna, olha esse achado!"

🎬 CENA 2 (3-9s) - O ARO CONTÍNUO & DETALHE DO BUSTO:
- Close no top de aro contínuo em V: ele modela e aproxima os seios de forma natural sem machucar as costelas.
- Narração: "O aro contínuo dá sustentação firme pra se movimentar, mergulhar e jogar bola na praia sem medo de pagar peitinho."

🎬 CENA 3 (9-14s) - O CORTE ASA DELTA ANATÔMICO:
- Modelo caminhando de lado e de costas mostrando a calcinha que não corta o culote.
- Narração: "A calcinha asa delta é dupla com costura embutida: não aperta a lateral do quadril e cria um efeito visual que alonga as pernas."

🎬 CENA 4 (14-18s) - TECIDO ATOALHADO / CANELADO DE LUXO:
- Mão tocando a textura com água escorrendo: tecido de secagem ultrarrápida que não fica transparente ao molhar.
- Narração: "Poliamida com elastano de alta gramatura com proteção solar UV50+. As cores não desbotam com o cloro nem água salgada."

🎬 CENA 5 (18-23s) - CTA:
- Modelo sorrindo com água de coco na mão e apontando pro carrinho amarelo:
- Narração: "Tá no precinho de lançamento no carrinho amarelo aqui embaixo antes da alta temporada. Clica e garante o seu tamanho!"`,
      },
      // 22. Moda Praia - PRO
      {
        title: 'Maiô Body com Amarração nas Costas e Argola Central - POV Resort de Praia',
        description:
          'POV entrando na varanda de bangalô à beira-mar com maiô de argola dourada antioxidante que vira body para jantar com calça pantalona.',
        niche: 'moda_praia',
        style: 'pov',
        platform: 'shopee',
        is_free: false,
        hook: 'POV: O maiô de R$ 49 que parece de grife de resort internacional de R$ 600!',
        call_to_action:
          'Argola banhada antioxidante com tecido de poliamida toque de seda. Link na sacolinha!',
        tags: 'maio body, argola central, resort wear, moda praia chic, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=one+piece+swimsuit+gold+ring+resort+balcony&color=white',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - ATMOSFERA DE FÉRIAS DOS SONHOS (HOOK):
- POV caminhando em direção à varanda ensolarada com vista para o mar azul turquesa.
- Texto na tela: "COMPREI NA SHOPEE E PARECE DE R$ 600 🌊🌴"
- Narração sofisticada: "POV: Você só queria um maiô elegante pras fotos da viagem e comprou a peça mais elogiada de todo o hotel..."

🎬 CENA 2 (3-9s) - A ARGOLA DOURADA & DECOTE:
- Mão tocando a argola central com brilho nobre: não enferruja com água do mar nem perde a cor dourada.
- Narração: "A argola central tem banho antioxidante especial que não descasca na maresia. O decote valoriza sem ser vulgar e as costas são cavadas com amarração ajustável."

🎬 CENA 3 (9-14s) - TRANSFORMAÇÃO EM LOOK NOTURNO (BODY):
- Transição com giro suave: agora vestindo uma calça pantalona de linho e brincos de madrepérola por cima.
- Narração: "Você sai da piscina, coloca uma calça de linho por cima e tá pronta pro melhor restaurante da cidade sem precisar trocar de roupa!"

🎬 CENA 4 (14-18s) - FORRO DUPLO TOTAL:
- Mostrando o forro interno bege 100% poliamida que impede qualquer transparência mesmo na cor branca.
- Narração: "Totalmente forrado na frente e nas costas com toque aveludado que abraça a silhueta."

🎬 CENA 5 (18-22s) - CTA:
- Apontando delicadamente para o link da sacolinha:
- Narração: "O vendedor enviou em menos de 24 horas pro meu endereço. Clica na sacolinha aqui do vídeo e garanta o seu antes do próximo feriado!"`,
      },
      // 23. Moda Praia - PRO
      {
        title: 'Chemise Saída de Praia em Algodão com Botões de Madrepérola - Unboxing Vitrine',
        description:
          'Abertura delicada de pacote mostrando a textura respirável do algodão laise/gaze com caimento fluido perfeito para caminhar na areia.',
        niche: 'moda_praia',
        style: 'unboxing_vitrine',
        platform: 'ambos',
        is_free: false,
        hook: 'A chemise de praia mais chique da internet: O LOOK DE MILHÕES POR R$ 62!',
        call_to_action: '100% algodão gaze respirável com mangas ajustáveis. Link na vitrine!',
        tags: 'chemise praia, saida camisa, algodao gaze, moda praia chic, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=white+cotton+beach+shirt+coverup+unboxing&color=white',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP / SHOPEE - 21 SEGUNDOS]

🎬 CENA 1 (0-3s) - O CHARME DA CAMISA OVERSIZED DE PRAIA (HOOK):
- Tirando a chemise branca impecável da embalagem e desdobrando contra a luz suave do sol.
- Texto na tela: "LOOK DE RICA NA PRAIA POR R$ 62 👒✨"
- Narração encantadora: "A chemise de algodão que as influenciadoras mais elegantes usam nos beach clubs mais exclusivos!"

🎬 CENA 2 (3-8s) - O TOQUE DO ALGODÃO GAZE:
- Mão amassando e soltando o tecido: aquela textura naturalmente amassadinha charmosa que não precisa passar a ferro.
- Narração: "Feita em algodão gaze respirável: você não passa calor, não esquenta na pele e seca super rápido no sol."

🎬 CENA 3 (8-13s) - BOTÕES E REGULAGEM DAS MANGAS:
- Mostrando os botões perolados e a presilha interna para prender a manga dobrada no cotovelo.
- Narração: "As mangas têm martingale pra dobrar com estilo e a fenda lateral dá liberdade pra caminhar sem travar o passo."

🎬 CENA 4 (13-17s) - FORMAS DE USAR:
- 1) Totalmente aberta esvoaçante como quimono. 2) Semiaberta com nó na cintura. 3) Fechada como vestidinho com cinto de corda.
- Narração: "Três jeitos lindos de usar que multiplicam suas fotos de viagem."

🎬 CENA 5 (17-21s) - CTA:
- Apontando para o botão da vitrine:
- Narração: "O frete é grátis hoje na vitrine oficial aqui embaixo. Clica e aproveita antes que esgote o lote de verão!"`,
      },
      // 24. Moda Praia - PRO
      {
        title: 'Shorts de Praia Masculino Secagem Rápida 4-Way Stretch - Modelo Salto na Água',
        description:
          'Modelo dando mergulho e saindo da água mostrando que o shorts não gruda, não pesa e seca quase que instantaneamente.',
        niche: 'moda_praia',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'O shorts de praia masculino definitivo: ELE NÃO PESA E SECA EM 3 MINUTOS!',
        call_to_action:
          'Tecido 4-way stretch com cueca interna macia anti-areia. Link no carrinho amarelo!',
        tags: 'shorts praia masculino, secagem rapida, 4 way stretch, moda praia masculina, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=man+swim+shorts+beach+water+stretch&color=blue',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 23 SEGUNDOS]

🎬 CENA 1 (0-3s) - O TESTE DA ÁGUA AO VIVO (HOOK):
- Modelo dando um mergulho na piscina ou mar, sai da água caminhando firme com o shorts escorrendo água sem pesar.
- Texto na tela: "SECA EM 3 MINUTOS NO SOL 🌊⚡"
- Narração animada: "O teste definitivo pro shorts de praia que promete secagem relâmpago: será que funciona de verdade?"

🎬 CENA 2 (3-9s) - O TECIDO 4-WAY STRETCH:
- Modelo agacha e estica a perna na borda da piscina: elasticidade em 4 direções que não prende os movimentos.
- Narração: "Tecido techno-stretch com elastano: você agacha, corre, pula na água e ele estica sem risco de rasgar no cavalo."

🎬 CENA 3 (9-14s) - O FORRO INTERNO SEM REDINHA QUE PINICA:
- Virando o cós para mostrar a cueca interna de tecido microfibra suave em vez daquela redinha tradicional que machuca a pele.
- Narração: "Esqueça aquela redinha antiga que assa a pele! O forro interno é de microfibra sedosa que protege contra atrito e areia."

🎬 CENA 4 (14-18s) - BOLSOS COM DRENAGEM DE ÁGUA E ZÍPER:
- Mostrando o bolso traseiro com ilhós de escoamento e zíper vedado para guardar chave e cartão com segurança.
- Narração: "A água não fica acumulada nos bolsos e a chave do carro não cai durante o mergulho."

🎬 CENA 5 (18-23s) - CTA:
- Modelo apontando para o carrinho amarelo:
- Narração: "Estampas tropicais exclusivas e lisas sofisticadas no carrinho amarelo do TikTok Shop. Aproveite o cupom de frete grátis!"`,
      },
      // 25. Calçados & Acessórios - PRO
      {
        title: 'Mocassim Loafer Tratorado com Fivela Dourada - Modelo Look Escritório Moderno',
        description:
          'Modelo caminhando no asfalto com calça alfaiataria cropped e mocassim de sola tratorada leve que adiciona 4cm de altura sem dor.',
        niche: 'acessorios_calcados',
        style: 'modelo',
        platform: 'ambos',
        is_free: false,
        hook: 'O mocassim tratorado de R$ 69 que substitui o salto alto no trabalho com 10x mais estilo!',
        call_to_action:
          'Palmilha anatômica acolchoada e acabamento em verniz fosco nobre. Link na vitrine!',
        tags: 'mocassim tratorado, loafer feminino, look trabalho moderno, sapatos femininos, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=chunky+loafer+shoes+woman+office+street&color=black',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP / SHOPEE - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - O GANCHO DA POSTURA & CONFORTO (HOOK):
- Passos decididos da modelo com o mocassim preto impecável e fivela metálica dourada brilhante.
- Texto na tela: "ADICIONA 4CM E NÃO CANSA NADA 👞🏢"
- Narração envolvente: "Como parecer sofisticada no escritório o dia todo sem precisar sofrer em cima de um salto fino!"

🎬 CENA 2 (3-8s) - A LEVEZA INESPERADA DA SOLA TRATORADA:
- Modelo segura o sapato com 2 dedos e gira: a sola tratorada é feita em micro-expandido ultraleve, pesando menos que uma sapatilha.
- Narração: "O solado tratorado parece pesado, mas é feito em EVA expandido: pesa menos de 250 gramas por pé e absorve todo o impacto."

🎬 CENA 3 (8-14s) - PALMILHA MACIA & CALCANHAR PROTEGIDO:
- Apertando a palmilha com espuma de memória de 8mm e mostrando a almofadinha traseira anti-calos no calcanhar.
- Narração: "Tem protetor de calcanhar embutido pra não cortar a pele no primeiro dia de uso e palmilha macia como travesseiro."

🎬 CENA 4 (14-18s) - COMBINAÇÃO MULTI-LOOKS:
- Com calça alfaiataria, com meia branca aparente e saia plissada estilo preppy, e com jeans reto.
- Narração: "Combina com qualquer look de faculdade, escritório ou passeio de fim de semana."

🎬 CENA 5 (18-22s) - CTA:
- Modelo sorrindo e sinalizando para o link:
- Narração: "A forma é padrão exato. Deixei o link na vitrine oficial aqui embaixo com desconto exclusivo de lançamento!"`,
      },
      // 26. Calçados & Acessórios - PRO
      {
        title:
          'Bolsa Tote Grande Estruturada com Divisória para Notebook - POV Dia a Dia Executiva',
        description:
          'POV colocando notebook de 15 polegadas, garrafa térmica, necessaire e cadernos dentro da bolsa estruturada que não perde a forma.',
        niche: 'acessorios_calcados',
        style: 'pov',
        platform: 'shopee',
        is_free: false,
        hook: 'POV: O que cabe na bolsa de R$ 55 que aguenta notebook, garrafa e não perde o formato!',
        call_to_action:
          'Couro ecológico encorpado com forro reforçado e zíper antifurto. Link na sacolinha!',
        tags: 'bolsa tote executiva, cabe notebook, bolsa faculdade, organizacao, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=tote+bag+laptop+leather+woman+organized&color=black',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 24 SEGUNDOS]

🎬 CENA 1 (0-3s) - O TESTE DO 'O QUE CABE' DEFINITIVO (HOOK):
- POV em cima da mesa com a bolsa tote em pé perfeitamente armada ao lado de uma pilha de objetos.
- Texto na tela: "CABE A VIDA TODA DENTRO DELA! 💼💻"
- Narração curiosa: "POV: Você achou a bolsa que finalmente aguenta sua rotina de faculdade e trabalho sem estourar a alça..."

🎬 CENA 2 (3-10s) - COLOCANDO OS ITENS EM CORTES RÁPIDOS SATISFATÓRIOS:
- Entram em ordem: 1) Notebook de 15 polegadas com capa protetora. 2) Caderno universitário. 3) Garrafa térmica de 500ml no bolso interno. 4) Carteira, maquiagem e chaves.
- Narração: "Tem compartimento acolchoado para notebook, divisória central com zíper e bolsinho lateral com elástico pra garrafa não tombar."

🎬 CENA 3 (10-15s) - A ESTRUTURA QUE NÃO DESABA:
- Soltando a bolsa na cadeira: as laterais continuam em pé rígidas e o fundo tem 4 pezinhos de metal dourado para não sujar o couro no chão.
- Narração: "A base tem pinos metálicos pra proteger do chão e a estrutura não desaba como sacola de mercado."

🎬 CENA 4 (15-19s) - CONFORTO NO OMBRO:
- Colocando no ombro: as alças duplas são largas e acolchoadas, não cavam na pele mesmo carregando peso.
- Narração: "A costura das alças é em X reforçada com rebite de metal, testada pra aguentar até 8 quilos com tranquilidade."

🎬 CENA 5 (19-24s) - CTA:
- Apontando pro link da sacolinha da Shopee:
- Narração: "Disponível nas cores preto, caramelo e café. Clica na sacolinha aqui do vídeo e garanta a sua com cupom de primeira compra!"`,
      },
      // 27. Calçados & Acessórios - PRO
      {
        title: 'Tênis Cano Alto Estilo Basquete Vintage Couro Ecológico - Unboxing ASMR + No Pé',
        description:
          'Abertura de caixa com papel de seda, cheiro de calçado novo, flexão do solado costurado 360 graus e teste no pé com meia cano alto.',
        niche: 'acessorios_calcados',
        style: 'unboxing_vitrine',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'O tênis cano alto mais hypado do Pinterest por menos de 1/3 do valor da marca famosa!',
        call_to_action:
          'Solado 100% costurado blaqueado que não descola. Link no carrinho amarelo!',
        tags: 'tenis cano alto, vintage basquete, streetwear tenis, unboxing asmr, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=high+top+vintage+basketball+sneakers+unboxing&color=white',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 23 SEGUNDOS]

🎬 CENA 1 (0-3s) - O SOM SATISFATÓRIO DA CAIXA (HOOK):
- Corte da fita com estilete e abertura da tampa com som crocante do papel de seda desdobrando.
- Texto na tela: "QUALIDADE DE R$ 800 POR R$ 119? 👟📦"
- Narração instigante: "Será que esse tênis cano alto retrô da TikTok Shop realmente entrega o acabamento dos modelos de colecionador?"

🎬 CENA 2 (3-9s) - DETALHAMENTO DE COSTURA & COURO:
- Close giratório mostrando a biqueira perfurada para respiração, o colarinho acolchoado e o solado blaqueado (costurado toda a volta).
- Narração: "Olha a costura 360 graus na sola inteira: não tem risco de descolar com a chuva. O couro sintético é denso e não racha na dobra dos dedos."

🎬 CENA 3 (9-14s) - O TESTE DA PALMILHA DE GEL:
- Tirando a palmilha de EVA com amortecimento em gel no calcanhar e apertando com força.
- Narração: "Vem com palmilha de amortecimento em gel que amortece cada passo e cano alto com acolchoamento que firma o tornozelo."

🎬 CENA 4 (14-19s) - PROVA NO PÉ COM LOOK STREETWEAR:
- Calçando com calça jeans baggy larga e meia branca: visual anos 90 impecável com giros de 360 graus.
- Narração: "O caimento no pé fica absurdo de estiloso com calça cargo ou bermuda jeans."

🎬 CENA 5 (19-23s) - CTA:
- Segurando o par emparelhado e apontando para o carrinho amarelo:
- Narração: "Tamanhos do 36 ao 43 no carrinho amarelo aqui embaixo com devolução sem burocracia se não servir!"`,
      },
      // 28. Calçados & Acessórios - PRO
      {
        title: 'Cinto de Couro Genuíno Fivela Dourada Minimalista - POV Provador Transformação',
        description:
          'POV colocando o cinto clássico de fivela geométrica dourada sobre vestidos largos e calças para marcar a cintura instantaneamente.',
        niche: 'acessorios_calcados',
        style: 'pov',
        platform: 'shopee',
        is_free: false,
        hook: 'POV: O acessório de R$ 18 que transforma qualquer vestido largo num look acinturado de passarela!',
        call_to_action:
          'Fivela de metal zamac antioxidante com furos extras inclusos. Link na sacola!',
        tags: 'cinto couro, fivela dourada, truque de estilo, afina cintura, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=leather+belt+gold+buckle+woman+styling&color=orange',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 20 SEGUNDOS]

🎬 CENA 1 (0-3s) - O TRUQUE DE ESTILO AO VIVO (HOOK):
- POV em frente ao espelho com vestido reto sem forma. Você passa o cinto na cintura e puxa a fivela dourada.
- O vestido ganha silhueta violão instantaneamente!
- Texto na tela: "TRANSFORMAÇÃO EM 5 SEGUNDOS ⏳👗"
- Narração impressionada: "POV: Você descobriu que um cinto de 18 reais tem o poder de mudar absolutamente todos os vestidos do seu armário!"

🎬 CENA 2 (3-8s) - A FIVELA DE METAL NOBRE:
- Close na fivela retangular geométrica dourada com acabamento escovado que não parece bijuteria amarelada barata.
- Narração: "A fivela é em liga de metal pesado que não descasca e o material do cinto não quebra ao dobrar."

🎬 CENA 3 (8-13s) - USANDO COM JEANS E ALFAIATARIA:
- Mostrando a peça na presilha da calça jeans e sobre blazer fechado.
- Narração: "A largura de 2,8cm é a medida perfeita que cabe em qualquer presilha de calça do mercado."

🎬 CENA 4 (13-16s) - VEM COM FURADOR EXTRA:
- Mostrando que o vendedor envia a ferramenta furadora junto na caixinha para você ajustar ao seu tamanho exato.
- Narração: "Vem com ferramenta pra fazer furos extras em casa se você emagrecer!"

🎬 CENA 5 (16-20s) - CTA:
- Apontando para a sacolinha:
- Narração: "Tem nas cores preto, caramelo e café na sacolinha aqui da Shopee com frete grátis hoje!"`,
      },
      // 29. Streetwear & Casual - PRO
      {
        title: 'Moletom Canguru 3 Cabos 380g Felpado com Capuz Duplo - Modelo Streetwear Noturno',
        description:
          'Modelo caminhando no frio com moletom pesado 3 cabos, capuz estruturado que não cai e punho elástico de 8cm que bloqueia o vento.',
        niche: 'streetwear_casual',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'O único moletom que tem capuz estruturado de verdade e não fica parecendo pano mole!',
        call_to_action: 'Moletom 3 cabos 380g felpado 100% algodão. Link no carrinho amarelo!',
        tags: 'moletom 3 cabos, capuz estruturado, heavyweight hoodie, streetwear, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=heavyweight+hoodie+man+urban+night+fleece&color=gray',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 23 SEGUNDOS]

🎬 CENA 1 (0-3s) - GANCHO DO CAPUZ ARMADO (HOOK):
- Modelo coloca o capuz na cabeça: o capuz fica ereto, com volume e contorno perfeito, sem cair mole na testa.
- Texto na tela em fonte street: "O CAPUZ MAIS ARMADO DA CENA 🔥🧱"
- Narração com convicção: "Se você ama moletom, já passou pela raiva de comprar peça com capuz fino que parece touca cirúrgica. Olha essa estrutura!"

🎬 CENA 2 (3-9s) - DENSIDADE DO TECIDO 3 CABOS 380G:
- Abrindo a peça pelo lado de dentro mostrando a pelúcia espessa e macia de 380 gramas.
- Narração: "Tecido 3 cabos pesado de verdade com felpa grossa que isola o frio do inverno. 100% algodão penteado que não faz bolinha após a lavagem."

🎬 CENA 3 (9-14s) - BOLSO CANGURU REFORÇADO & PUNHOS LARGOS:
- Mãos dentro do bolso canguru puxando para baixo para provar que a costura é travada com pesponto duplo.
- Os punhos têm 8cm de ribana canelada que vedam o vento no pulso.
- Narração: "O bolso canguru não descola nem com peso de carteira e celular, e os punhos de 8cm barram o vento frio."

🎬 CENA 4 (14-18s) - O FIT OVERSIZED QUADRADO:
- Modelo caminhando de costas e de frente com calça cargo larga e tênis.
- Narração: "Corte boxy importado que dá presença e combina com qualquer calça baggy."

🎬 CENA 5 (18-23s) - CTA:
- Modelo apontando pro carrinho amarelo:
- Narração: "Peça de marca de skate custa R$ 450. Esse direto da confecção no carrinho do TikTok Shop tá pela metade do preço com frete grátis!"`,
      },
      // 30. Streetwear & Casual - PRO
      {
        title: 'Calça Parachute Pant Streetwear Impermeável com Reguladores - POV Provador Dança',
        description:
          'POV testando a mobilidade extrema da parachute pant com barulho de nylon aerodinâmico, cordões elásticos ajustáveis e visual futurista.',
        niche: 'streetwear_casual',
        style: 'pov',
        platform: 'shopee',
        is_free: false,
        hook: 'POV: A calça parachute mais viral do TikTok que te deixa com visual de clipe musical!',
        call_to_action:
          'Nylon tactel repelente a água com elásticos ajustáveis na cintura e tornozelo. Link na sacolinha!',
        tags: 'parachute pant, calca parachute, streetwear y2k, gringa, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=parachute+pants+y2k+streetwear+woman+fitting+room&color=green',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - O SOM SATISFATÓRIO DO NYLON & MOVIMENTO (HOOK):
- POV em frente ao espelho dando um passo largo e girando com a calça parachute verde militar / preta.
- O som gostoso do nylon tactel e os cordões elásticos balançando com atitude Y2K.
- Texto na tela: "A CALÇA DA GRINGA POR R$ 52 🛹🛸"
- Narração empolgada: "POV: Você finalmente achou a parachute pant que as gringas usam e não custou uma fortuna de taxa de importação!"

🎬 CENA 2 (3-8s) - OS REGULADORES NA CINTURA E TORNOZELO:
- Mão puxando o stopper metálico na cintura (cintura baixa ou alta) e depois no tornozelo (reta ampla ou jogger presa).
- Narração: "Os reguladores têm travas firmes: dá pra usar cintura baixa estilo anos 2000 ou cintura alta, e a barra vira jogger ou flare ampla em 1 segundo."

🎬 CENA 3 (8-14s) - TECIDO LEVE REPELENTE A RESPINGOS:
- Jogando água com os dedos na perna da calça: a água escorre em gotas sem absorver.
- Narração: "Nylon tactel com acabamento repelente a água: é ultra leve, seca na hora e não esquenta mesmo no calor."

🎬 CENA 4 (14-18s) - BOLSOS CARGO VOLUMOSOS:
- Mostrando os bolsos fole com velcro que dão volume estético sem pesar no visual.
- Narração: "Combina tanto com cropped justinho quanto com camiseta oversized."

🎬 CENA 5 (18-22s) - CTA:
- Apontando pro link da sacolinha da Shopee:
- Narração: "Grade de cores completa (verde militar, cinza, bege e preto). Clica na sacolinha aqui da Shopee e garanta a sua com cupom!"`,
      },
    ]

    for (let i = 0; i < proPromptsPart2.length; i++) {
      const p = proPromptsPart2[i]
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
