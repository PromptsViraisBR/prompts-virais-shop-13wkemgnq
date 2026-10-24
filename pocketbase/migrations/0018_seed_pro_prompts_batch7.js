/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const promptsCol = app.findCollectionByNameOrId('prompts')

    const proPromptsPart7 = [
      // 71. Streetwear & Casual - PRO
      {
        title:
          'Bermuda Jeans Streetwear Baggy com Barra Desfiada e Costura Contrastante - POV Rolê Skate',
        description:
          'POV andando de skate e descendo da rampa com bermuda jeans baggy ampla abaixo do joelho com pespontos brancos.',
        niche: 'streetwear_casual',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'POV: A bermuda jeans baggy estilo gringo que tem o caimento largo perfeito!',
        call_to_action:
          'Jeans pesado 100% algodão com costura dupla reforçada. Link no carrinho amarelo!',
        tags: 'bermuda baggy jeans, skate streetwear, anos 2000 y2k, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=baggy+denim+jorts+man+skatepark+streetwear&color=blue',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - O MOVIMENTO DA BERMUDA NO ROLÊ (HOOK):
- POV em cima do skate em alta velocidade filmando a bermuda baggy jeans azul claro cobrindo o joelho com tênis clássico de skate.
- Texto na tela: "A BERMUDA MAIS COBICEADA DO TIKTOK 🛹👖"
- Narração autêntica: "POV: O dia em que você cansou de bermuda apertada e achou o jorts baggy clássico que todo mundo tá usando na gringa!"

🎬 CENA 2 (3-8s) - A LARGURA ANATÔMICA NA PERNA:
- Puxando o tecido lateral: corte bem amplo com boca larga que não prende a flexão dos joelhos em manobras.
- Narração: "Corte baggy com boca de 32cm: dá liberdade total pro movimento sem ficar parecendo saia, caimento pesado perfeito."

🎬 CENA 3 (8-13s) - DETALHE DA COSTURA CONTRASTANTE BRANCA:
- Close nos pespontos com linha branca de alta espessura e bolsos traseiros grandes tradicionais.
- Narração: "Costuras reforçadas em pesponto duplo branco que não arrebentam com atrito no asfalto."

🎬 CENA 4 (13-17s) - BARRA COM DESFIADO CONTROLADO:
- Mostrando a costura de travamento 1cm acima do desfiado para impedir que a barra continue desmanchando.
- Narração: "Tem trava na barra pro desfiado não continuar subindo após as lavagens."

🎬 CENA 5 (17-22s) - CTA:
- Apontando para o carrinho amarelo:
- Narração: "Grade de tamanhos do 38 ao 48 no carrinho amarelo aqui embaixo com frete promocional. Garante a sua antes que zere o estoque!"`,
      },
      // 72. Streetwear & Casual - PRO
      {
        title: 'Shoulder Bag Streetwear Tática com Cordão Elástico Frontal - Unboxing Vitrine',
        description:
          'Abertura de pacote com shoulder bag tática impermeável com mosquetão metálico, múltiplos compartimentos e alça transversal ajustável.',
        niche: 'streetwear_casual',
        style: 'unboxing_vitrine',
        platform: 'shopee',
        is_free: false,
        hook: 'A shoulder bag mais completa da internet: CABE TUDO E É 100% IMPERMEÁVEL!',
        call_to_action:
          'Nylon Cordura resistente com zíperes selados e mosquetão tático. Link na sacolinha!',
        tags: 'shoulder bag tatica, bolsa transversal, streetwear acessorio, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=tactical+shoulder+bag+crossbody+streetwear+unboxing&color=black',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 21 SEGUNDOS]

🎬 CENA 1 (0-3s) - A PRATICIDADE NO DIA A DIA (HOOK):
- Tirando a shoulder bag da embalagem plástica e colocando no peito com a alça transversal ajustada com um 'click' na fivela.
- Texto na tela: "A SHOULDER BAG DEFINITIVA POR R$ 29 🎒⚡"
- Narração ágil: "Acessório indispensável pra carregar suas coisas no rolê sem ficar com os bolsos da calça estufados!"

🎬 CENA 2 (3-8s) - O TESTE DA CAPACIDADE:
- Colocando dentro: smartphone grande, carteira, carregador portátil, fone bluetooth e óculos de sol.
- Narração: "São 4 divisórias independentes com zíper tratorado e bolso frontal com elástico tático pra prender garrafinha ou casaco leve."

🎬 CENA 3 (8-13s) - NYLON CORDURA RESISTENTE A ÁGUA:
- Borrifando água na frente da bolsa: o líquido desliza sem penetrar no tecido.
- Narração: "Tecido impermeável com forro acolchoado que protege seus eletrônicos da chuva forte."

🎬 CENA 4 (13-17s) - MOSQUETÃO E ALÇA REFORÇADA:
- Mostrando os ganchos metálicos removíveis e regulador de comprimento da fita de 3cm.
- Narração: "Alça larga que não machuca o pescoço e mosquetões de metal zamac."

🎬 CENA 5 (17-21s) - CTA:
- Apontando para o link da sacolinha:
- Narração: "Mais de 20 mil unidades vendidas com nota máxima na Shopee. Deixei o link na sacolinha aqui do vídeo com frete grátis!"`,
      },
      // 73. Infantil & Kids - PRO
      {
        title:
          'Kit Body Bebê Algodão Egípcio Manga Longa com Luva Reversível - POV Maternidade Recém-Nascido',
        description:
          'POV mãe vestindo o recém-nascido com body com luvas vira-mão que impedem o bebê de arranhar o rostinho, feito em algodão ultra puro.',
        niche: 'infantil_kids',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'POV: O body de bebê com luvinha embutida que impede seu filho de arranhar o rostinho!',
        call_to_action:
          '100% algodão egípcio suedine antialérgico com punho vira-mão. Link no carrinho amarelo!',
        tags: 'body bebe luvinha, recem nascido enxoval, maternidade, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=baby+onesie+mitten+cuffs+cotton+newborn&color=white',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 23 SEGUNDOS]

🎬 CENA 1 (0-3s) - O PROBLEMA DO ARRANHÃO NO ROSTINHO (HOOK):
- POV com o bebê dormindo tranquilo no berço e a mãe ajeitando a luvinha vira-mão no punho.
- Texto na tela: "SALVAÇÃO DAS MAMÃES! 👶🍼"
- Narração doce e acolhedora: "POV: O dia em que você descobriu o body com punho inteligente e nunca mais teve que se preocupar com luvinha solta que cai do bebê toda hora!"

🎬 CENA 2 (3-9s) - O SISTEMA VIRA-MÃO INTELIGENTE:
- Mãe mostrando como a dobra do punho vira uma luvinha macia que cobre as mãozinhas e unhas do recém-nascido.
- Narração: "Você dobra o punho e ele vira luvinha na hora de dormir: protege contra arranhões no rostinho e mantém as mãozinhas sempre aquecidas."

🎬 CENA 3 (9-14s) - TOQUE DO ALGODÃO SUEDINE EGÍPCIO:
- Acariciando o tecido com o polegar: malha ultra aveludada sem costuras ásperas internas e etiquetas estampadas à base d'água.
- Narração: "Zero etiquetas duras que pinicam a pele sensível: as instruções vêm estampadas com tinta antialérgica."

🎬 CENA 4 (14-18s) - GOLA AMERICANA QUE DESCE PELAS PERNINHAS:
- Mostrando que em caso de vazamento de fralda, o body pode ser tirado por baixo sem passar pela cabeça do bebê.
- Narração: "A gola americana permite tirar a peça por baixo se a fralda vazar sem sujar o cabelinho!"

🎬 CENA 5 (18-23s) - CTA:
- Apontando com carinho para o carrinho amarelo:
- Narração: "Kit com 3 unidades em tons pastéis delicados no carrinho amarelo do TikTok Shop. O frete é grátis hoje mamães!"`,
      },
      // 74. Infantil & Kids - PRO
      {
        title:
          'Conjunto Menino Camisa Social em Linho com Bermuda e Suspensório - Modelo Menino Pajem',
        description:
          'Menininho fofo arrumado com camisa gola padre em linho, bermuda com ajuste interno de elástico e suspensório com gravata borboleta.',
        niche: 'infantil_kids',
        style: 'modelo',
        platform: 'shopee',
        is_free: false,
        hook: 'O conjunto social infantil que transforma seu pequeno no pajem mais elegante da festa!',
        call_to_action:
          'Camisa linho misto respirável com bermuda em sarja e suspensório incluso. Link na sacolinha!',
        tags: 'roupa pajem menino, conjunto social infantil, suspensorio gravata, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=toddler+boy+linen+shirt+suspenders+bow+tie&color=orange',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - O IMPACTO DO MINI CAVALHEIRO (HOOK):
- Menininho sorrindo e ajustando a gravata borboleta bege/azul bebê com camisa de linho e suspensório.
- Texto na tela: "O MINI CAVALHEIRO MAIS LINDO 🎩🎈"
- Narração alegre: "Mães que têm casamento, batizado ou aniversário de 1 ano do filho esse ano: não paguem caro em aluguel de roupa!"

🎬 CENA 2 (3-9s) - O CONFORTO DO LINHO COM VISCOSE:
- Mãe mostrando a gola padre macia que não aperta o pescocinho e tecido que respira.
- Narração: "Linho misto leve que não deixa a criança suando ou incomodada durante a cerimônia, com botões de madeira ecológicos."

🎬 CENA 3 (9-14s) - BERMUDA COM ELÁSTICO INTERNO REGULÁVEL:
- Mostrando o elástico com botões por dentro do cós da bermuda sarja: ajusta no corpinho magrinho ou gordinho.
- Narração: "O cós da bermuda tem regulagem interna pra você apertar se a criança for magrinha sem precisar de cinto duro."

🎬 CENA 4 (14-18s) - ACOMPANHA SUSPENSÓRIO E GRAVATA BORBOLETA:
- Mostrando as presilhas de pressão macias do suspensório que não estragam o tecido da bermuda.
- Narração: "O kit completo vem com a camisa, bermuda, gravata borboleta e suspensório elástico ajustável."

🎬 CENA 5 (18-22s) - CTA:
- Menininho dando tchau com a mão e mãe apontando para a sacolinha:
- Narração: "Sai por menos de R$ 60 o conjunto completo na sacolinha aqui da Shopee com entrega super rápida!"`,
      },
      // 75. Lingerie & Pijamas - PRO
      {
        title:
          'Sutiã Redutor de Renda com Alças Largas Acolchoadas - POV Sustentação Seios Grandes',
        description:
          'POV no provador mostrando a sustentação de sutiã para seios pesados, com laterais largas que disfarçam gordurinhas e alça macia que não machuca.',
        niche: 'lingerie_pijamas',
        style: 'pov',
        platform: 'shopee',
        is_free: false,
        hook: 'POV: O sutiã redutor que sustenta seios pesados SEM afundar as alças no seu ombro!',
        call_to_action:
          'Alças acolchoadas com laterais redutoras duplas e aro flexível. Link na sacolinha!',
        tags: 'sutia redutor, seios grandes sustentacao, alca larga acolchoada, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=plus+size+lace+bra+wide+straps+woman+fitting+room&color=pink',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 23 SEGUNDOS]

🎬 CENA 1 (0-3s) - O ALÍVIO DAS DORES NOS OMBROS (HOOK):
- POV em frente ao espelho mostrando o ombro livre de marcas vermelhas ou sulcos fundos de alça apertada.
- Texto na tela: "FIM DAS DORES NOS OMBROS! 👙✨"
- Narração sincera e acolhedora: "POV: O dia em que quem tem busto grande finalmente achou um sutiã bonito de renda que dá sustentação real sem te machucar o dia todo!"

🎬 CENA 2 (3-9s) - ALÇAS LARGAS ULTRA ACOLCHOADAS:
- Close na alça de 3cm de largura com espuma interna macia que distribui uniformemente o peso dos seios.
- Narração: "As alças têm 3cm de largura com camada interna acolchoada: elas não cavam nem marcam seus ombros mesmo após 12 horas de uso."

🎬 CENA 3 (9-14s) - LATERAIS LARGAS COM BARBATANAS SILICONADAS:
- Mostrando as laterais com tecido duplo de alta compressão que abraçam e disfarçam as gordurinhas das costas e axilas.
- Narração: "Laterais largas com tecido duplo que suavizam as costas sem criar aquelas dobrinhas embaixo do braço."

🎬 CENA 4 (14-18s) - ARO FLEXÍVEL E COBERTURA COMPLETA:
- Movimento no provador: os seios ficam firmes, centralizados e com desenho bonito sob blusas justas.
- Narração: "Taças inteiras que cobrem e acomodam o busto com aro flexível que não fura nem pinica a pele."

🎬 CENA 5 (18-23s) - CTA:
- Apontando delicadamente para a sacolinha da Shopee:
- Narração: "Grade de tamanhos do 42 até o 54 com suporte especial. Deixei o link na sacolinha aqui do vídeo com cupom exclusivo!"`,
      },
      // 76. Lingerie & Pijamas - PRO
      {
        title: 'Short Doll em Cetim Gloss com Renda Bicolor no Decote - Modelo Quarto Elegante',
        description:
          'Modelo em quarto aconchegante com conjunto short doll de cetim macio toque de seda com brilho gloss e renda delicada.',
        niche: 'lingerie_pijamas',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'O short doll de cetim que te faz ir dormir se sentindo milionária por R$ 28!',
        call_to_action:
          'Cetim com elastano toque de seda que não pinica nem esquenta. Link no carrinho amarelo!',
        tags: 'short doll cetim, pijama sensual chic, loungewear noite, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=satin+lace+camisole+shorts+pajama+set+woman+bed&color=pink',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - A TRANSFORMAÇÃO DO DORMIR COM ESTILO (HOOK):
- Modelo sentada na beira da cama arrumando o cabelo com o conjunto de cetim rosé/champanhe iluminado por abajur quente.
- Texto na tela: "SE SENTINDO RICA PRA DORMIR 🌙✨"
- Narração suave e sedutora: "Aquele conjunto de pijama que você coloca pra dormir e acorda se sentindo linda em frente ao espelho!"

🎬 CENA 2 (3-8s) - O TOQUE DO CETIM COM ELASTANO:
- Deslizando os dedos pelo tecido brilhoso: o cetim tem caimento fluido que desliza na pele e tem elasticidade que acompanha o sono.
- Narração: "Cetim gloss com elastano: não prende os movimentos quando você vira de lado na cama e tem toque geladinho que não dá calor."

🎬 CENA 3 (8-13s) - DETALHE DA RENDA FRANCESA NO DECOTE E BARRA:
- Close na renda bicolor macia aplicada no decote em V e na barra do shortinho com elástico suave.
- Narração: "Renda antialérgica super macia que não coça e elástico do short com tensão suave que não marca a cintura."

🎬 CENA 4 (13-17s) - ALÇAS REGULÁVEIS COM METAL DOURADO:
- Mostrando os reguladores metálicos dourados nas alças traseiras:
- Narração: "Você regula a altura do decote como preferir com os ajustadores metálicos."

🎬 CENA 5 (17-22s) - CTA:
- Modelo sorrindo e sinalizando para o carrinho amarelo:
- Narração: "Cores rosé, vinho, preto e verde esmeralda no carrinho amarelo do TikTok Shop com frete grátis hoje. Escolha a sua!"`,
      },
      // 77. Moda Feminina - PRO
      {
        title: 'Calça Jeans Skinny Cintura Alta Modeladora com 5% Lycra - POV Provador Real',
        description:
          'POV no provador mostrando o ajuste perfeito da calça skinny que desenha a coxa e bumbum sem apertar a circulação, com tecnologia Lycra beauty.',
        niche: 'moda_feminina',
        style: 'pov',
        platform: 'shopee',
        is_free: false,
        hook: 'POV: A calça skinny com 5% de lycra que abraça suas curvas sem sufocar a cintura!',
        call_to_action:
          'Jeans com tecnologia Lycra Beauty que não laceia o dia todo. Link seguro na sacolinha!',
        tags: 'calca skinny jeans, 5 por cento lycra, modeladora, provador real, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=high+waist+skinny+jeans+woman+stretch+fitting+room&color=blue',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - O TESTE DO AGACHAR COM CALÇA JUSTA (HOOK):
- POV em frente ao espelho agachando e levantando rapidamente: a calça skinny azul escura estica feito legging sem travar os joelhos.
- Texto na tela: "A SKINNY MAIS CONFORTÁVEL DA VIDA 👖🔥"
- Narração entusiasmada: "POV: O dia em que você provou uma calça skinny jeans e percebeu que ela tem o conforto de uma calça de academia!"

🎬 CENA 2 (3-8s) - A TECNOLOGIA COM 5% DE LYCRA DUPONT:
- Mão puxando a coxa da calça: elasticidade impressionante com retorno instantâneo.
- Narração: "O tecido tem 5% de lycra verdadeira: você pode passar o dia todo sentada no trabalho que ela não deforma e não laceia no joelho."

🎬 CENA 3 (8-13s) - CÓS ALTO COM DUPLO FECHO MODELADOR:
- Mostrando o cós anatômico de 3 botões que cobre e segura o abdômen sem esmagar o estômago.
- Narração: "Cintura super alta que firma o abdômen e modela a cintura sem sufocar sua respiração."

🎬 CENA 4 (13-17s) - LAVAGEM ESCURA ELEGANTE QUE COMBINA COM TUDO:
- Mostrando a cor azul marinho escuro uniforme sem manchas exageradas: visual refinado que pode ser usado no escritório com salto.
- Narração: "Lavagem escura clássica que afina a silhueta e combina com scarpin, bota ou tênis."

🎬 CENA 5 (17-22s) - CTA:
- Apontando pro link da sacolinha da Shopee:
- Narração: "Grade do 36 ao 48 na sacolinha oficial aqui da Shopee com cupom de desconto exclusivo. Garanta a sua!"`,
      },
      // 78. Moda Masculina - PRO
      {
        title:
          'Jaqueta Corta-Vento Tática Masculina com Capuz Retrátil e Zíper Tratorado - Modelo Noturno Urbano',
        description:
          'Modelo caminhando no asfalto molhado com jaqueta corta-vento tática preta fosca com capuz embutido na gola e bolso no braço.',
        niche: 'moda_masculina',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'A jaqueta corta-vento tática masculina que corta qualquer tempestade de vento e sereno!',
        call_to_action:
          'Tecido ripstop resinado com capuz retrátil na gola e zíper vedado. Link no carrinho amarelo!',
        tags: 'corta vento masculino, jaqueta tatica, capuz retratil, streetwear masculino, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=tactical+black+windbreaker+jacket+man+night+city&color=black',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 23 SEGUNDOS]

🎬 CENA 1 (0-3s) - O GANCHO DA RESISTÊNCIA AO CLIMA (HOOK):
- Modelo caminhando contra o vento forte na calçada à noite com a jaqueta preta tática alinhada e capuz puxado.
- Texto na tela: "CORTA O VENTO E A CHUVA NA HORA 💨⚡"
- Narração com atitude: "Se você anda de moto, faz corrida ou quer uma jaqueta tática estilosa pro dia a dia sem gastar R$ 400, olha isso!"

🎬 CENA 2 (3-9s) - O CAPUZ RETRÁTIL EMBUTIDO NA GOLA:
- Abrindo o zíper da gola alta: o capuz ajustável sai pronto para uso ou fica guardado transformando a jaqueta em modelo gola padre.
- Narração: "O capuz fica escondido dentro da gola estruturada: quando o tempo fecha, você puxa em 3 segundos."

🎬 CENA 3 (9-14s) - BOLSOS TÁTICOS NO PEITORAL E ANTEBRAÇO:
- Mostrando o bolso utilitário no braço esquerdo para cartão de metrô e chaves com zíper vedado impermeável.
- Narração: "Bolsos estratégicos com zíperes vedados por fita térmica que impedem a água da chuva de molhar seus documentos."

🎬 CENA 4 (14-18s) - FORRO RESPIRÁVEL E VEDAÇÃO NOS PUNHOS:
- Mostrando os velcros de ajuste nos punhos para vedar a entrada de ar frio ao pilotar moto.
- Narração: "Ajuste em velcro no punho e elástico na barra pra vedar o vento completamente."

🎬 CENA 5 (18-23s) - CTA:
- Modelo apontando para o carrinho amarelo:
- Narração: "Menos de R$ 69 direto do fabricante no carrinho amarelo do TikTok Shop. Aproveite o envio prioritário hoje!"`,
      },
      // 79. Fitness & Academia - PRO
      {
        title:
          'Conjunto Moletinho Fitness Feminino Cropped e Shorts com Friso - POV Treino em Casa',
        description:
          'POV fazendo mobilidade e alongamento em casa com conjunto de moletinho levinho com frisos esportivos contrastantes.',
        niche: 'fitness_academia',
        style: 'pov',
        platform: 'shopee',
        is_free: false,
        hook: 'POV: O conjunto de moletinho mais estiloso da internet que custou menos de R$ 39!',
        call_to_action:
          'Moletinho macio de viscose com elástico reforçado no cós. Link na sacolinha da Shopee!',
        tags: 'conjunto moletinho, shorts cropped esportivo, treino em casa, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=lounge+fitness+cropped+shorts+set+woman+home+stretch&color=gray',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 21 SEGUNDOS]

🎬 CENA 1 (0-3s) - A PRATICIDADE DO MOLETINHO MACIO (HOOK):
- POV em cima do tapete de ioga em casa com o conjunto cropped e shorts cinza mescla com vivos brancos.
- Texto na tela: "CONFORTO MÁXIMO POR R$ 39 🧘‍♀️✨"
- Narração descontraída: "POV: O dia em que você achou a roupa perfeita pra ficar em casa confortável e ainda atender o entregador sem vergonha nenhuma!"

🎬 CENA 2 (3-8s) - A LEVEZA DO MOLETINHO DE VISCOSE:
- Mão tocando a maciez da malha de moletinho que não esquenta como o moletom pesado de inverno.
- Narração: "Moletinho com viscose fresquinha: é macio como abraço, respira no calor e não fica amassado se você deitar no sofá."

🎬 CENA 3 (8-13s) - DETALHE DOS VIVOS CONTRASTANTES:
- Close nas laterais arredondadas do shortinho com friso branco estilo corrida retrô anos 80.
- Narração: "O recorte arredondado do shorts alonga as pernas e o cós de elástico largo não aperta a barriga."

🎬 CENA 4 (13-17s) - CROPPED COM COMPRIMENTO CERTO:
- Mostrando que o cropped não fica subindo no peito ao levantar os braços no alongamento.
- Narração: "Comprimento perfeito que encontra o cós do shorts sem mostrar a barriga toda."

🎬 CENA 5 (17-21s) - CTA:
- Apontando delicadamente para a sacolinha:
- Narração: "Mais de 10 cores lindas na sacolinha oficial aqui da Shopee com frete grátis no aplicativo. Garanta o seu!"`,
      },
      // 80. Moda Praia - PRO
      {
        title:
          'Calça Pantalona Saída de Praia em Tule Ilusão Estampada - Modelo Pôr do Sol Beach Club',
        description:
          'Modelo caminhando no deck de madeira com calça pantalona transparente em tule com fendas laterais profundas sobre biquíni preto.',
        niche: 'moda_praia',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'A pantalona em tule de praia que transforma qualquer biquíni simples em look de beach club internacional!',
        call_to_action:
          'Tule elástico com toque sedoso e elástico em lurex no cós. Link no carrinho amarelo!',
        tags: 'pantalona tule praia, saida de praia chic, beach club look, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=sheer+tulle+wide+leg+beach+pants+woman+sunset+deck&color=cyan',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 23 SEGUNDOS]

🎬 CENA 1 (0-3s) - O MOVIMENTO CINEMATOGRÁFICO NO DECK (HOOK):
- Passos da modelo no deck de madeira à beira-mar com o tule estampado fluido voando com a brisa do mar ao pôr do sol.
- Texto na tela: "LOOK DE BEACH CLUB EM MYKONOS 🌴🥂"
- Narração deslumbrada: "Se você vai viajar pra praia e quer uma saída elegante que não ocupe espaço na mala, olha essa pantalona de tule!"

🎬 CENA 2 (3-9s) - O CAIMENTO FLUIDO COM FENDAS LATERAIS:
- Giro suave mostrando que as pernas amplas têm fendas que abrem ao caminhar revelando o biquíni com sensualidade e classe.
- Narração: "As fendas laterais dão aquele movimento cinematográfico ao andar e o tecido de microtule tem toque macio que não pinica na pele."

🎬 CENA 3 (9-14s) - CÓS COM ELÁSTICO METÁLICO DOURADO:
- Close na cintura com faixa elástica com fios de lurex que não aperta nem dobra na barriga.
- Narração: "O cós com fios metálicos dá acabamento de jóia e segura firme na cintura ou no quadril."

🎬 CENA 4 (14-18s) - NÃO AMASSA NADA NA MALA:
- Enrolando a calça numa bolinha minúscula na mão: desdobra sem nenhum vinco ou amassado.
- Narração: "Pode enrolar na mala de praia que não amassa nada e seca em 2 minutos se molhar na água do mar."

🎬 CENA 5 (18-23s) - CTA:
- Modelo sorrindo com taça na mão e sinalizando para o carrinho amarelo:
- Narração: "Estampas tropicais exclusivas no carrinho amarelo do TikTok Shop com cupom exclusivo de frete. Aproveita agora!"`,
      },
    ]

    for (let i = 0; i < proPromptsPart7.length; i++) {
      const p = proPromptsPart7[i]
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
