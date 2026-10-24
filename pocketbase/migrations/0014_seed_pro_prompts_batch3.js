/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const promptsCol = app.findCollectionByNameOrId('prompts')

    const proPromptsPart3 = [
      // 31. Streetwear & Casual - PRO
      {
        title: 'Colete Puffer Streetwear Cropped sem Manga - Unboxing Vitrine Inverno',
        description:
          'Tirando da embalagem o colete puffer inflado com gola alta acolchoada, zíper tratorado e forro térmico para sobreposições estilosas.',
        niche: 'streetwear_casual',
        style: 'unboxing_vitrine',
        platform: 'ambos',
        is_free: false,
        hook: 'O colete puffer cropped que transforma qualquer moletom básico em look de gringa!',
        call_to_action: 'Enchimento térmico fofinho que não deforma na máquina. Link na vitrine!',
        tags: 'colete puffer, cropped puffer, look inverno gringa, streetwear, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=cropped+puffer+vest+woman+streetwear+winter&color=black',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP / SHOPEE - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - O EFEITO PUFF VOLUME SATISFATÓRIO (HOOK):
- Tirando o colete da caixa compactada: ao soltar no ar, ele infla suavemente com enchimento macio e volumoso.
- Texto na tela: "LOOK DE GRINGA POR R$ 65 ❄️✨"
- Narração empolgada: "O colete puffer cropped mais procurado do Pinterest por um terço do valor de loja de departamento!"

🎬 CENA 2 (3-9s) - O TESTE DO ENCHIMENTO & GOLA ALTA:
- Apertando o acolchoamento térmico com as duas mãos: volta à forma na hora.
- Gola alta estruturada que fecha até o queixo protegendo do vento.
- Narração: "Enchimento de manta siliconada térmica de alta memória: esquenta o peito e as costas sem pesar nada e a gola fica armada."

🎬 CENA 3 (9-14s) - REGULAGEM NA CINTURA:
- Mostrando os elásticos internos laterais que você puxa para deixar o cropped mais justinho ou mais soltinho.
- Narração: "Tem regulador elástico na barra pra ajustar o comprimento cropped na altura exata da sua cintura."

🎬 CENA 4 (14-18s) - SOBREPOSIÇÃO NO MANEQUIM / CORPO:
- Vestido sobre moletom cinza e com touca beanie preta.
- Narração: "Combina com moletom, camiseta de manga longa e calça jogger nos dias de frio."

🎬 CENA 5 (18-22s) - CTA:
- Apontando para o link da vitrine:
- Narração: "Cores preto, bege e marrom chocolate disponíveis com frete grátis na vitrine aqui embaixo!"`,
      },
      // 32. Streetwear & Casual - PRO
      {
        title: 'Camisa Flanelada Xadrez Lenhador Forrada - Modelo Urbano Vintage',
        description:
          'Modelo caminhando com camisa flanelada pesada aberta com regata branca por baixo, corte relaxed e toque macio.',
        niche: 'streetwear_casual',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'A camisa de flanela xadrez grossa de verdade que dura a vida inteira!',
        call_to_action:
          'Flanela 100% algodão escovado com botões reforçados. Link no carrinho amarelo!',
        tags: 'camisa flanelada, xadrez masculino, vintage grunge, outono inverno, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=plaid+flannel+shirt+man+streetwear+urban&color=red',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 21 SEGUNDOS]

🎬 CENA 1 (0-3s) - O GANCHO DO TECIDO ENCORPADO (HOOK):
- Modelo sacode a camisa flanelada aberta contra o vento: tecido com peso de jaqueta leve, sem aquela flanela rala e transparente.
- Texto na tela: "FLANELA GROSSA DE VERDADE 🌲🔥"
- Narração nostálgica: "Se você curte estilo vintage lenhador e tá cansado de camisa xadrez fina que parece pano de prato, assista isso!"

🎬 CENA 2 (3-8s) - O ALGODÃO ESCOVADO PELUDINHO:
- Close nos detalhes das fibras de algodão escovado térmico dos dois lados da peça.
- Narração: "Flanela escovada dupla: tem toque aveludado super macio que não pinica na pele e isola o frio com eficiência."

🎬 CENA 3 (8-13s) - O CAIMENTO RELAXED:
- Modelo caminhando com as mãos nos bolsos: corte reto com caimento amplo que permite usar moletom com capuz por baixo.
- Narração: "Modelagem pensada pra usar tanto fechada quanto como jaqueta aberta sobre outras peças."

🎬 CENA 4 (13-17s) - BOTÕES E BOLSOS DUPLOS NO PEITO:
- Mostrando os bolsos frontais com lapela e botão de fechamento seguro.
- Narração: "Costura com pesponto triplo nos ombros e botões reforçados com linha grossa."

🎬 CENA 5 (17-21s) - CTA:
- Modelo apontando pro carrinho amarelo:
- Narração: "Padrões de xadrez vermelho, verde e marrom disponíveis no carrinho amarelo aqui embaixo. Garante a sua cor!"`,
      },
      // 33. Infantil & Kids - PRO
      {
        title: 'Conjunto Moletom Infantil com Capuz de Orelhinha 3D - POV Pais e Bebê',
        description:
          'POV dos pais vestindo o bebê com agasalho quentinho com orelhinhas fofas no capuz e zíper com proteção no queixo para não beliscar.',
        niche: 'infantil_kids',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'POV: O agasalho que protege seu filho do vento frio e deixa ele parecendo um ursinho!',
        call_to_action:
          'Zíper com trava protetora no queixo e algodão felpado antialérgico. Link no carrinho amarelo!',
        tags: 'roupa bebe inverno, capuz orelhinha, moletom infantil, maternidade, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=baby+bear+ears+hoodie+sweatshirt+cute&color=gray',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - EXPLOSÃO DE FOFURA (HOOK):
- POV: Câmera mostrando o bebê com o capuz de orelhinhas de urso sorrindo e batendo palminhas.
- Texto na tela: "A COISA MAIS FOFA DO MUNDO 🧸🤍"
- Narração com voz maternal calorosa: "POV: Você comprou um conjunto de frio na internet e não consegue parar de tirar fotos do seu pequeno..."

🎬 CENA 2 (3-8s) - A SEGURANÇA DO ZÍPER COM PROTEÇÃO NO QUEIXO:
- Mãe mostrando a lapela de tecido que cobre a ponta do zíper: zero risco de beliscar a pele sensível do queixo da criança.
- Narração: "O zíper tem protetor de queixo acolchoado pra não machucar a pele, e abre até embaixo pra trocar a fralda em segundos."

🎬 CENA 3 (8-13s) - O TOQUE DO ALGODÃO FLANELADO INTERNO:
- Virando o punho: tecido felpudo antialérgico que não solta pelinhos nem faz a criança coçar.
- Narração: "100% algodão suedine flanelado macio, não solta fiapos na boquinha do bebê e mantém a temperatura certinha."

🎬 CENA 4 (13-17s) - PUNHOS QUE DOBRAM E ACOMPANHAM O CRESCIMENTO:
- Mostrando como os punhos das pernas e braços dobram sem apertar: serve por mais meses.
- Narração: "Os punhos dobráveis fazem o conjunto durar o dobro do tempo conforme ele vai crescendo."

🎬 CENA 5 (17-22s) - CTA:
- Apontando pro carrinho amarelo:
- Narração: "Presente perfeito de aniversário ou chá de bebê! Clica no carrinho amarelo aqui embaixo antes que esgote o tamanho do seu pequeno!"`,
      },
      // 34. Infantil & Kids - PRO
      {
        title:
          'Vestido Infantil de Princesa com Tule Brilhante e Asas Removíveis - Modelo Menina Aniversário',
        description:
          'Menininha com vestido de festa encantado, detalhes cintilantes na saia rodada e forro 100% algodão anti-alergia.',
        niche: 'infantil_kids',
        style: 'modelo',
        platform: 'shopee',
        is_free: false,
        hook: 'Mães: o vestido de aniversário que faz qualquer menina se sentir no próprio conto de fadas!',
        call_to_action:
          'Forro duplo macio que não pinica a criança com asas destacáveis. Link na sacolinha da Shopee!',
        tags: 'vestido infantil princesa, festa aniversario, roupa menina, shopee achados',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=little+princess+dress+tulle+fairy+wings+girl&color=pink',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - O BRILHO DOS OLHOS DA CRIANÇA (HOOK):
- Menina olhando para o espelho toda encantada com vestido rodado lilás/rosa com estrelinhas brilhantes e asas de fada.
- Texto na tela: "REALIZANDO O SONHO DE PRINCESA 👑🧚‍♀️"
- Narração emocionante: "Mães, se a sua filha sonha com um dia de princesa no aniversário dela, olha esse vestido por menos de R$ 50!"

🎬 CENA 2 (3-9s) - O TESTE DO FORRO ANTI-PINICA:
- A mãe virando o vestido para a câmera mostrando que o forro de algodão puro isola completamente todas as costuras e o tule da pele.
- Narração: "O maior medo de toda mãe é comprar roupa de festa que a criança chora pra tirar porque pinica. Esse tem forro 100% algodão macio da gola até a barra!"

🎬 CENA 3 (9-14s) - AS ASAS REMOVÍVEIS POR VELCRO:
- Mostrando a facilidade de tirar e colocar as asinhas com velcro seguro:
- Narração: "As asinhas de fada são presas com velcro: na hora de brincar ou comer é só destacar em 1 segundo sem estragar o vestido."

🎬 CENA 4 (14-18s) - A SAIA RODADA DE 4 CAMADAS:
- Menina girando feliz no estúdio: a saia abre com volume natural sem precisar de anágua de arame pesada.
- Narração: "Tem 4 camadas de tule levinho que dão volume perfeito pras fotos de aniversário."

🎬 CENA 5 (18-22s) - CTA:
- Menina mandando beijo com varinha mágica na mão:
- Narração: "Tamanhos do 2 ao 10 anos na sacolinha aqui da Shopee com envio imediato. Peça antes da data da festinha!"`,
      },
      // 35. Infantil & Kids - PRO
      {
        title: 'Tênis Infantil com Luz LED Recarregável e Fecho em Velcro - Unboxing Vitrine',
        description:
          'Abertura de caixa com tênis infantil com solado luminoso que acende ao pisar, cabedal respirável e velcro prático para calçar sozinho.',
        niche: 'infantil_kids',
        style: 'unboxing_vitrine',
        platform: 'ambos',
        is_free: false,
        hook: 'O tênis com luz de LED que faz a criança querer calçar o sapato sozinha sem birra!',
        call_to_action:
          'LED acionado por impacto resistente a poças com velcro duplo. Link na vitrine!',
        tags: 'tenis infantil led, luz pisca, crianca calcar sozinha, shopee achados',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=kids+sneakers+led+light+up+velcro+unboxing&color=blue',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP / SHOPEE - 21 SEGUNDOS]

🎬 CENA 1 (0-3s) - A FESTA DAS LUZES AO PISAR (HOOK):
- Dando uma batidinha leve na sola do tênis na mesa: as luzes de LED coloridas piscam em sequência mágica!
- Texto na tela: "A CRIANÇA NÃO TIRA MAIS DO PÉ 🚨✨"
- Narração divertida: "O segredo pra acabar com aquela batalha matinal de calçar o sapato pra ir pra escola!"

🎬 CENA 2 (3-8s) - FECHO EM VELCRO DUPLO INDEPENDENTE:
- Mostrando a abertura ampla do tênis com duas tiras de velcro: a criança coloca o pezinho sozinha sem aperto.
- Narração: "Abertura larga com velcro duplo: seu filho ganha autonomia pra calçar e tirar sozinho em 5 segundos."

🎬 CENA 3 (8-13s) - TESTE DO IMPACTO & RESISTÊNCIA À ÁGUA:
- Pressionando o solado de borracha antiderrapante com amortecimento macio.
- Narração: "O circuito de LED é selado à prova de respingos de chuva e poça d'água, e a sola de borracha não escorrega em piso liso."

🎬 CENA 4 (13-17s) - PALMILHA ANATÔMICA RESPIRÁVEL:
- Tirando a palmilha com perfurações para circulação de ar que evita chulé.
- Narração: "Cabedal em tecido mesh que deixa o pezinho respirar o dia todo na escola."

🎬 CENA 5 (17-21s) - CTA:
- Apontando para o botão da vitrine:
- Narração: "Numeração do 22 ao 34 disponível com tabela de medidas em centímetros na vitrine aqui embaixo. Clica e aproveita!"`,
      },
      // 36. Lingerie & Pijamas - PRO
      {
        title: 'Conjunto Lingerie Renda com Cinta-Liga e Aro Sustentação - Modelo Camarim Glam',
        description:
          'Modelo em camarim com luz suave demonstrando a sofisticação da renda guipir, aro de sustentação sem machucar e cinta-liga removível.',
        niche: 'lingerie_pijamas',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'A lingerie que eleva sua autoestima ao nível máximo por menos de R$ 45!',
        call_to_action:
          'Renda antialérgica com aro de sustentação e calcinha semi-fio regulável. Link no carrinho amarelo!',
        tags: 'lingerie renda, cinta liga, sensual chic, autoestima feminina, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=lace+lingerie+set+garter+belt+boudoir+glam&color=red',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 23 SEGUNDOS]

🎬 CENA 1 (0-3s) - PODER E AUTOESTIMA NO ESPELHO (HOOK):
- Modelo elegante se olhando no espelho com roupão de cetim semiaberto revelando os detalhes da renda vermelha bordô / preta.
- Texto na tela: "AUTOESTIMA NAS ALTURAS POR R$ 45 🌹💄"
- Narração confidencial: "Quando você coloca uma lingerie dessa, você sente uma segurança e um poder que muda o seu dia inteiro!"

🎬 CENA 2 (3-9s) - O ARO DE SUSTENTAÇÃO ANATÔMICO:
- Close no sutiã com aro flexível que modela e junta os seios sem arame duro machucando a costela.
- Narração: "O aro é revestido com canaleta dupla aveludada, dá aquela sustentação bonita e o bojo em tule transparente é super delicado."

🎬 CENA 3 (9-14s) - REGULAGEM TOTAL NA CINTURA E PERNAS:
- Mostrando as alças duplas com reguladores dourados na calcinha e nas presilhas da cinta-liga.
- Narração: "As laterais da calcinha têm reguladores que você ajusta milimetricamente no seu quadril pra não apertar nenhuma gordurinha."

🎬 CENA 4 (14-18s) - A RENDA QUE NÃO PINICA:
- Mão da modelo acariciando a renda contra a pele:
- Narração: "Renda de poliamida com toque macio antialérgico, não repuxa os fios e não coça no corpo."

🎬 CENA 5 (18-23s) - CTA COM EMBALAGEM DISCRETA:
- Modelo fechando o roupão com olhar confiante e apontando pro carrinho amarelo:
- Narração: "O envio é 100% discreto em embalagem preta sem nenhuma identificação do conteúdo. Clica no carrinho amarelo aqui embaixo e garanta o seu!"`,
      },
      // 37. Lingerie & Pijamas - PRO
      {
        title: 'Pijama Modal de Manga Longa e Calça com Vivos Contrastantes - POV Noite Fria',
        description:
          'POV deitada na cama com cobertor fofo e xícara de chá, mostrando a sensação macia do tecido modal toque de pluma.',
        niche: 'lingerie_pijamas',
        style: 'pov',
        platform: 'shopee',
        is_free: false,
        hook: 'POV: O pijama de modal que parece um abraço quentinho nos dias mais frios!',
        call_to_action:
          'Tecido modal respirável com caimento fluido. Link seguro na sacolinha da Shopee!',
        tags: 'pijama modal, loungewear elegante, pijama americano calca, conforto noite, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=modal+knit+pajamas+piping+woman+bed+cozy&color=pink',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - O GANCHO DO CONFORTO NOTURNO (HOOK):
- POV deitada na cama com lençóis brancos macios, segurando uma caneca quente com as duas mãos no pijama modal cinza mescla / rosé.
- Texto na tela: "O PIJAMA MAIS GOSTOSO DO MUNDO ☕🌙"
- Narração relaxante: "POV: Você trocou a roupa de frio pesada que pinica por esse conjunto de modal e nunca mais dormiu do mesmo jeito..."

🎬 CENA 2 (3-8s) - A MACIEZ DO FIO MODAL:
- Mão deslizando suavemente pela manga comprida com detalhes em friso contrastante branco.
- Narração: "O tecido modal é conhecido como a seda vegetal: é ultra macio, respirável e regula a temperatura do corpo a noite toda."

🎬 CENA 3 (8-13s) - CÓS COM ELÁSTICO LARGO AVELUDADO:
- Mostrando a cintura da calça: elástico de 4cm forrado que não marca a barriga durante o sono.
- Narração: "O elástico da calça não aperta a cintura mesmo quando você deita de lado, e as pernas não ficam subindo na canela."

🎬 CENA 4 (13-17s) - BOTÕES PEROLADOS RESISTENTES:
- Detalhe da vista frontal com botões costurados com reforço que não abrem sozinhos.
- Narração: "Os botões são resistentes e o corte americano clássico te deixa arrumada até pro café da manhã com visita em casa."

🎬 CENA 5 (17-22s) - CTA:
- Apontando delicadamente para a sacolinha da Shopee:
- Narração: "Chegou em 3 dias com cupom de desconto. Deixei o link na sacolinha aqui do vídeo, corre antes que acabe a sua cor favorita!"`,
      },
      // 38. Lingerie & Pijamas - PRO
      {
        title: 'Camisola de Tule com Renda e Calcinha Fio Regulável - Unboxing Vitrine Romântica',
        description:
          'Abertura de caixinha perfumada com papel de seda, exibindo a transparência delicada do tule e taças estruturadas com renda floral.',
        niche: 'lingerie_pijamas',
        style: 'unboxing_vitrine',
        platform: 'ambos',
        is_free: false,
        hook: 'A camisola romântica mais delicada da Shopee por um valor que não dá pra acreditar!',
        call_to_action: 'Tule com toque de seda que não repuxa. Link disponível na vitrine!',
        tags: 'camisola tule, lingerie romantica, unboxing delicado, noite especial, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=sheer+tulle+lace+nightgown+romantic+unboxing&color=white',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP / SHOPEE - 20 SEGUNDOS]

🎬 CENA 1 (0-3s) - O ENCANTO DO UNBOXING SENSORIAL (HOOK):
- Abrindo a tampa da caixinha com laço de fita e cheirinho de essência suave no ar.
- Texto na tela: "ENCANTADORA POR MENOS DE R$ 39 🌸✨"
- Narração suave: "Se você tem uma lua de mel, viagem a dois ou quer surpreender quem você ama, essa peça foi feita pra você!"

🎬 CENA 2 (3-8s) - A TRANSPARÊNCIA SOFISTICADA DO TULE:
- Levantando a camisola: tule com toque de seda fluido e transparência sutil que cai como névoa no corpo.
- Narração: "O tule é sedoso e elástico, não fica áspero na pele e tem fenda frontal delicada que dá movimento ao caminhar."

🎬 CENA 3 (8-13s) - AS TAÇAS EM RENDA BORDADA:
- Close nas taças com renda floral desenhada à mão e forro sutil no busto.
- Narração: "O busto tem acabamento em renda macia com lacinho de cetim e alças ajustáveis com reguladores de metal."

🎬 CENA 4 (13-16s) - ACOMPANHA CALCINHA REGULÁVEL:
- Mostrando a calcinha combinando do mesmo tule com laterais duplas que se ajustam a qualquer quadril.
- Narração: "Já acompanha a calcinha semi-fio regulável combinando no mesmo tom."

🎬 CENA 5 (16-20s) - CTA:
- Apontando para o botão da vitrine:
- Narração: "Embalagem totalmente discreta com envio prioritário. Clica no link aqui embaixo da vitrine pra garantir a sua!"`,
      },
      // 39. Moda Feminina - PRO
      {
        title: 'Vestido Canelado Manga Longa com Decote Quadrado - POV Jantar de Inverno',
        description:
          'POV se arrumando em frente ao espelho com vestido canelado encorpado que valoriza o colo com decote quadrado e não marca.',
        niche: 'moda_feminina',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'POV: O vestido de manga longa que te deixa quentinha, elegante e com corpo de violão!',
        call_to_action: 'Tecido canelado power 330g com elastano. Link no carrinho amarelo!',
        tags: 'vestido manga longa, decote quadrado, look inverno elegante, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=square+neck+long+sleeve+knit+dress+woman+mirror&color=black',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - O GANCHO DA MODELAGEM NO ESPELHO (HOOK):
- POV em frente ao espelho iluminado calçando bota de salto fino com o vestido canelado preto/vinho já no corpo.
- Texto na tela: "O VESTIDO QUE MODELA TUDO 🍷✨"
- Narração sedutora: "POV: O dia em que você não sabia o que vestir no frio e escolheu a peça que fez todo mundo no restaurante virar o pescoço..."

🎬 CENA 2 (3-9s) - O PODER DO DECOTE QUADRADO:
- Close no decote quadrado simétrico que alonga o pescoço e valoriza as saboneteiras com colar fino.
- Narração: "O decote quadrado dá aquele visual de princesa moderna que desenha o colo de forma impecável sem ser cavado demais."

🎬 CENA 3 (9-14s) - TECIDO CANELADO PESADO 330G:
- Puxando o tecido na lateral: malha canelada pesada que estica sem ficar translúcida e comprime a linha da cintura.
- Narração: "Essa gramatura pesada de 330g é o segredo: ela disfarça celulite, segura a barriguinha e dispensa uso de cinta."

🎬 CENA 4 (14-18s) - MANGA LONGA COM DETALHE NO PUNHO:
- Mostrando as mangas justas com punho longo que protegem do vento frio.
- Narração: "Fica perfeito com trench coat por cima ou jaqueta de couro estilosa."

🎬 CENA 5 (18-22s) - CTA:
- Apontando pro carrinho amarelo:
- Narração: "Veste do 36 ao 44 com caimento perfeito. Deixei o link no carrinho amarelo com cupom exclusivo hoje!"`,
      },
      // 40. Moda Masculina - PRO
      {
        title: 'Jaqueta Jeans Masculina com Forro de Carneirinho / Sherpa - Modelo Inverno Rústico',
        description:
          'Modelo caminhando no frio com jaqueta jeans clássica forrada com pelo sherpa macio no colarinho e peitoral.',
        niche: 'moda_masculina',
        style: 'modelo',
        platform: 'shopee',
        is_free: false,
        hook: 'A jaqueta jeans forrada com carneirinho que aguenta o frio de verdade por menos de R$ 130!',
        call_to_action:
          'Jeans 100% algodão com forro térmico sherpa felpudo. Link seguro na sacolinha!',
        tags: 'jaqueta jeans carneirinho, sherpa masculina, jaqueta inverno, moda masculina, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=sherpa+fleece+lined+denim+jacket+man+winter&color=blue',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 23 SEGUNDOS]

🎬 CENA 1 (0-3s) - O CONTRASTE DO CLIMA & PROTEÇÃO (HOOK):
- Modelo com o colarinho felpudo levantado contra a brisa fria, respirando ar com fumaça e postura imponente.
- Texto na tela: "A JAQUETA MAIS FORTE DO INVERNO ❄️🧥"
- Narração com autoridade: "Se você quer uma jaqueta com estilo rústico atemporal que realmente esquenta no frio de verdade, olha essa peça!"

🎬 CENA 2 (3-9s) - O FORRO DE CARNEIRINHO MACIO:
- Abrindo a jaqueta: forro interno de pelo sherpa térmico e mangas com forro acolchoado deslizante para não prender a camisa.
- Narração: "O colarinho e o peitoral têm forro de carneirinho macio e as mangas são forradas em matelassê pra vestir fácil sem prender os braços."

🎬 CENA 3 (9-14s) - JEANS PESADO DE VERDADE COM BOLSOS EMBUTIDOS:
- Batendo no jeans: tecido de 13oz encorpado com botões metálicos de pressão reforçados.
- Narração: "O jeans é pesado, corta o vento gelado e tem 4 bolsos externos mais um bolso interno profundo."

🎬 CENA 4 (14-18s) - O FIT MASCULINO CLÁSSICO:
- Modelo caminhando com bota e calça jeans preta: visual rústico moderno.
- Narração: "Combina com qualquer bota e camiseta básica. Peça que dura mais de 10 invernos sem perder a qualidade."

🎬 CENA 5 (18-23s) - CTA:
- Apontando para o link da sacolinha da Shopee:
- Narração: "Marca famosa de shopping cobra mais de R$ 500 numa dessas. Na sacolinha oficial da Shopee tá com preço direto de importação com frete grátis!"`,
      },
    ]

    for (let i = 0; i < proPromptsPart3.length; i++) {
      const p = proPromptsPart3[i]
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
