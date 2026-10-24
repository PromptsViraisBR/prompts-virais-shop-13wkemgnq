/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const promptsCol = app.findCollectionByNameOrId('prompts')

    const proPromptsPart1 = [
      // 1. Moda Feminina - PRO
      {
        title: 'Vestido Slip Dress de Cetim com Fenda Lateral - POV Date Noturno',
        description:
          'Roteiro premium em primeira pessoa se arrumando para jantar elegante com cortes rítmicos, teste de luz e chamada irresistível.',
        niche: 'moda_feminina',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'POV: O vestido de R$ 59 da Shopee que te faz parecer herdeira em qualquer restaurante!',
        call_to_action:
          'Cetim com elastano premium e caimento viés. O link com desconto VIP tá no carrinho amarelo!',
        tags: 'slip dress, cetim, date night, vestido festa, elegancia, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=satin+slip+dress+slit+woman+evening+glam&color=black',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP / SHOPEE - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - O GANCHO VISUAL & DOR REAL (HOOK):
- POV em frente ao espelho com iluminação suave de camarim. Você segura o slip dress dourado/champanhe contra o corpo com olhar de admiração.
- Texto na tela grande com sombra: "VESTIDO DE MILIONÁRIA POR R$ 59? 🍸✨"
- Áudio / Narração hipnótica: "POV: você tinha 15 minutos pra se arrumar pro date mais importante do mês e escolheu a peça que para qualquer ambiente..."

🎬 CENA 2 (3-8s) - TRANSIÇÃO RÍTMICA & CAIMENTO NO CORPO:
- Transição com giro suave de câmera ao som de batida envolvente.
- Vestindo o vestido: caimento fluido em viés desenhando as curvas sem marcar abdômen nem roupas íntimas.
- Close na fenda lateral elegante e no decote degagê (draped cowl neck) iluminado.
- Narração: "O corte é em viés verdadeiro, então ele abraça o corpo naturalmente. As alças têm reguladores de metal dourado que não soltam."

🎬 CENA 3 (8-14s) - PROVA DE BENEFÍCIO & QUEBRA DE OBJEÇÃO:
- Borrifando perfume no pescoço, colocando sandália de tiras finas e joias douradas.
- Teste sob luz direta: o cetim tem brilho sofisticado toque de seda, sem aquele aspecto plastificado de tecido sintético barato.
- Narração: "Não esquenta, não é transparente e tem peso suficiente pra não voar no vento. Todo mundo pergunta onde comprei!"

🎬 CENA 4 (14-18s) - PROVA SOCIAL & URGÊNCIA:
- Mostrando a tela do pedido com centenas de avaliações 5 estrelas e fotos reais de clientes.
- Narração: "Foi o item mais avaliado com nota máxima essa semana na plataforma e os tamanhos M e G esgotam hoje."

🎬 CENA 5 (18-22s) - CALL TO ACTION DIRETO (CTA):
- Apontando o dedo com precisão para o canto inferior esquerdo da tela:
- Narração: "Ele tá no link exclusivo do carrinho amarelo com envio expresso e devolução sem custo se não amar. Clica aqui antes que termine a cota do cupom!"
- Texto final na tela: "Garanta o seu no carrinho amarelo 👇🛒"

💡 DICAS PRO DE PRODUÇÃO:
- Iluminação: Ring light quente a 45 graus e luz de fundo azulada/âmbar para destacar o brilho do tecido.
- Enquadramento: Câmera traseira em 4K 60fps vertical 9:16.
- Áudio sugerido: Som suave de violino moderno ou pop instrumental em alta no TikTok Shop.`,
      },
      // 2. Moda Feminina - PRO
      {
        title: 'Calça Alfaiataria Pantalona com Pregas Duplas - Modelo Executiva Chic',
        description:
          'Modelo caminhando em lobby corporativo de vidro, mostrando movimento fluido, bolso faca e caimento que alonga a silhueta.',
        niche: 'moda_feminina',
        style: 'modelo',
        platform: 'ambos',
        is_free: false,
        hook: 'O truque de alfaiataria que alonga até 12cm das pernas sem parecer formal demais!',
        call_to_action: 'Tecido encorpado que não amassa fácil. Link com envio rápido na vitrine!',
        tags: 'calca pantalona, alfaiataria chic, pregas duplas, executiva, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=tailored+wide+leg+trousers+woman+office+chic&color=white',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP / SHOPEE - 24 SEGUNDOS]

🎬 CENA 1 (0-3s) - GANCHO DE AUTORIDADE & IMPACTO (HOOK):
- Passada firme da modelo saindo de uma porta de vidro espelhada em câmera lenta.
- Texto na tela em caixa alta: "COMO PARECER MAIS ALTA E ELEGANTE EM SEGUNDOS 👠🏢"
- Narração segura: "Se você tem menos de 1,70m e sonha com aquela silhueta longa de passarela, essa pantalona é seu maior segredo de moda!"

🎬 CENA 2 (3-9s) - DETALHAMENTO TÉCNICO DE CORTE:
- Close nas pregas frontais duplas simétricas que caem em linha reta vertical até a barra.
- Modelo colocando as mãos nos bolsos faca fundos: a peça não repuxa no quadril.
- Narração: "A cintura é ultra alta com cós anatômico reforçado. O tecido é crepe de alfaiataria pesado de 280g com caimento que não arma e não marca calcinha."

🎬 CENA 3 (9-15s) - VERSATILIDADE REAL (LOOK 1 E LOOK 2):
- Corte rápido 1: Combinada com camisa branca de botões e salto scarpin para reunião executiva.
- Corte rápido 2: Despojada com tênis branco retrô, camiseta cropped e óculos de sol para almoço de domingo.
- Narração: "Funciona tanto na reunião com diretoria quanto no café descontraído do final de semana."

🎬 CENA 4 (15-19s) - TESTE ANTI-AMASSADO (PROVA REAL):
- Modelo amassa o tecido da barra na mão com força por 3 segundos e solta: o tecido volta liso imediatamente!
- Narração: "Pode passar o dia todo sentada no escritório ou no carro: ela não amarrota e você continua impecável."

🎬 CENA 5 (19-24s) - CTA COM GATILHO DE ESCASSEZ:
- Modelo sorri confiante e sinaliza para a sacolinha/carrinho:
- Narração: "Tem grade completa do 36 ao 46 em 6 tons neutros impecáveis. O vendedor tá liberando cupom relâmpago na sacolinha aqui embaixo!"
- Texto na tela: "Toque na sacolinha e pegue seu cupom 🏷️👇"

💡 DICAS PRO DE PRODUÇÃO:
- Ângulo de câmera: Câmera baixa (low angle) na altura do joelho apontando levemente para cima para maximizar a ilusão de altura.
- Movimento: Caminhada contínua em direção à lente com estabilizador ativado.`,
      },
      // 3. Moda Feminina - PRO
      {
        title: 'Tricô Modal Canelado com Decote Coração - Unboxing Vitrine de Grife',
        description:
          'Abertura sensorial ASMR de pacote fino, teste de elasticidade que não deforma e acabamento premium no decote.',
        niche: 'moda_feminina',
        style: 'unboxing_vitrine',
        platform: 'shopee',
        is_free: false,
        hook: 'Comprei o tricô modal viral da gringa por 1/4 do preço da Zara: CHOCADA COM A QUALIDADE!',
        call_to_action:
          'Fio modal macio que não dá bolinha. Garanta o seu na sacolinha antes da reposição!',
        tags: 'trico modal, decote coracao, unboxing luxo, achado shopee, moda feminina',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=ribbed+knit+sweetheart+neckline+top+woman&color=pink',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 21 SEGUNDOS]

🎬 CENA 1 (0-3s) - HOOK SENSORIAL ASMR & COMPARATIVO DE PREÇO:
- Corte da fita da embalagem personalizada com som nítido de tesoura e papel de seda crocante.
- Texto na tela: "ZARA R$ 259 vs SHOPEE R$ 42? 🧶👀"
- Narração intrigante: "Eu me recusei a pagar mais de 250 reais naquela blusa de tricô da loja famosa e resolvi arriscar na Shopee..."

🎬 CENA 2 (3-8s) - O TOQUE DO FIO MODAL:
- Mão deslizando suavemente pelas tramas do tricô sob iluminação natural quente.
- Esticando o tecido com as duas mãos: elasticidade impressionante que retorna à forma inicial sem ceder.
- Narração: "Olha a densidade desse fio modal! Tem toque aveludado de cashmere, não pinica absolutamente nada e a trama é fechada."

🎬 CENA 3 (8-13s) - O RECORTE DO DECOTE CORAÇÃO:
- Mostrando a modelagem estruturada do busto que levanta e valoriza o colo sem precisar de aro de metal.
- Narração: "O decote coração é duplamente estruturado para sustentar o busto sem sutiã e o punho da manga é longo e canelado fino."

🎬 CENA 4 (13-17s) - PROVA NO MANEQUIM / CORPO:
- Transição com estalar de dedos: a peça vestida no corpo com calça jeans clara.
- Narração: "Modela a cintura feito corset, mas com o conforto de uma segunda pele aconchegante."

🎬 CENA 5 (17-21s) - CTA DE VALOR & FRETE GRÁTIS:
- Segurando a embalagem com etiqueta de envio nacional direto:
- Narração: "O vendedor posta em menos de 12 horas úteis no Brasil. Clica no link da sacolinha aqui do vídeo antes que vire tendência e aumente o preço!"

💡 DICAS PRO DE PRODUÇÃO:
- Foco em macro: Close de 5cm na textura dos pontos de tricô para provar riqueza de detalhes.
- Áudio: Som ambiente abafado para valorizar o ASMR de toque e desdobrar do pacote.`,
      },
      // 4. Moda Feminina - PRO
      {
        title: 'Kimono Longo em Viscose Estonada com Franjas - POV Festival & Praia',
        description:
          'Terceira peça estilosa esvoaçante que transforma look básico em produção de festival boêmio ou pós-praia de luxo.',
        niche: 'moda_feminina',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'POV: A terceira peça mágica que transforma short jeans e regata branca em look de R$ 800!',
        call_to_action: 'Viscose estonada pré-lavada que não encolhe. Link no carrinho amarelo!',
        tags: 'kimono longo, terceira peca, look festival, boho chic, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=boho+long+kimono+fringes+woman+festival&color=orange',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 20 SEGUNDOS]

🎬 CENA 1 (0-3s) - O GANCHO ANTES & DEPOIS (HOOK):
- POV no espelho vestindo uma regata branca bem simples e um shortinho jeans sem graça.
- Texto na tela: "DE BÁSICA A ÍCONE DE ESTILO EM 3s ✨👒"
- Narração entusiasmada: "POV: Você descobriu que não precisa comprar roupas caras, só precisava da terceira peça certa..."

🎬 CENA 2 (3-8s) - A ENTRADA TRIUNFAL DA PEÇA:
- Colocando o Kimono Longo com estampa boho geométrica e franjas de algodão na barra.
- Movimento suave de giro com os braços abertos mostrando a fluidez do tecido ao vento.
- Narração: "Esse kimono tem comprimento maxi, fendas laterais profundas que dão movimento cinematográfico ao andar e franjas feitas à mão."

🎬 CENA 3 (8-14s) - VERSATILIDADE: 3 CENÁRIOS EM CORTES RÁPIDOS:
- Take 1: Look urbano com bota e chapéu para festival de música.
- Take 2: Sobre biquíni preto na saída da praia tomando água de coco.
- Take 3: Fechado com cinto de couro fino virando um vestido transpassado.
- Narração: "Serve de saída de praia chic, peça principal pra festival e sobreposição pro jantar à beira-mar."

🎬 CENA 4 (14-20s) - CTA DIRETO DE CONVERSÃO:
- Apontando alegremente para o carrinho amarelo:
- Narração: "Tecido 100% viscose estonada que não encolhe na lavagem. Deixei o link no carrinho amarelo com cupom de primeira compra!"

💡 DICAS PRO DE PRODUÇÃO:
- Use um ventilador leve ou brisa natural de janela para fazer o kimono esvoaçar suavemente.`,
      },
      // 5. Moda Feminina - PRO
      {
        title: 'Jaqueta Cropped Jeans Lavagem Clara com Strass - Modelo Balada Chic',
        description:
          'Modelo caminhando à noite sob iluminação de letreiros neon, exibindo o brilho dos bordados em strass nas costas e caimento boxy.',
        niche: 'moda_feminina',
        style: 'modelo',
        platform: 'ambos',
        is_free: false,
        hook: 'A jaqueta jeans que brilha tanto no escuro que você não passa despercebida em lugar nenhum!',
        call_to_action:
          'Strass termocolante que não solta na máquina. Link exclusivo na sacolinha!',
        tags: 'jaqueta jeans, strass, look balada, customizada, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=cropped+denim+jacket+rhinestones+night+glam&color=blue',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE / TIKTOK - 23 SEGUNDOS]

🎬 CENA 1 (0-3s) - IMPACTO VISUAL NOTURNO (HOOK):
- Modelo de costas em calçada iluminada por neons noturnos, vira os ombros e o strass reflete feixes brilhantes na câmera.
- Texto na tela: "A PEÇA MAIS ELOGIADA DA NOITE 💎✨"
- Narração sedutora: "Se você ama ser o centro das atenções com bom gosto, acabou de achar a jaqueta dos seus sonhos!"

🎬 CENA 2 (3-9s) - DETALHAMENTO DO STRASS & JEANS:
- Close nos ombros e franjas de strass que dançam com o movimento do corpo.
- Puxando o jeans: algodão premium de 11oz com lavagem clara estonada e corte cropped desfiado na barra.
- Narração: "O strass é prensado a quente industrial com reforço de costura, não solta na primeira balada e o jeans é macio e encorpado."

🎬 CENA 3 (9-15s) - COMBINAÇÃO MATADORA DE LOOK:
- Modelo desfilando com vestido tubinho preto de alcinha por baixo e bota de cano médio.
- Narração: "Qualquer vestido básico de 30 reais vira look de camarote VIP quando você joga essa jaqueta por cima."

🎬 CENA 4 (15-19s) - TESTE DE SEGURANÇA:
- Esfregando os dedos firmemente sobre o strass para provar fixação absoluta sem queda.
- Narração: "Não machuca a pele nas axilas e a modelagem é pensada pra dar liberdade de dançar."

🎬 CENA 5 (19-23s) - CTA COM VALOR PROMOCIONAL:
- Modelo sorrindo com a mão na gola apontando para a vitrine:
- Narração: "Peças similares em boutiques cobram mais de R$ 380. Na sacolinha oficial tá com frete grátis e desconto direto de fábrica!"`,
      },
      // 6. Moda Feminina - PRO
      {
        title: 'Conjunto Alfaiataria Risca de Giz Colete Alongado - Modelo Old Money',
        description:
          'Visual elegante estética old money com calça pantalona e colete longo risca de giz com forro acetinado.',
        niche: 'moda_feminina',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'O conjunto risca de giz que te transforma na herdeira da família em 10 segundos!',
        call_to_action: 'Caimento estruturado com forro duplo. Link no carrinho amarelo!',
        tags: 'risca de giz, old money, alfaiataria chic, colete feminino, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=pinstripe+vest+trousers+set+woman+old+money&color=gray',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - HOOK ESTÉTICA OLD MONEY:
- Modelo segurando copo de café térmico e pasta de couro, óculos tartaruga e caminhada imponente.
- Texto na tela: "ESTÉTICA HERDEIRA POR MENOS DE R$ 90 💼☕"
- Narração elegante: "A tendência risca de giz dominou o feed das mulheres mais elegantes do mundo e eu achei a melhor versão da internet!"

🎬 CENA 2 (3-9s) - O COLETE ALONGADO & DETALHES:
- Close nos botões rajados em efeito madrepérola e no corte acinturado traseiro com fivela de ajuste.
- Narração: "O colete tem forro duplo de toque sedoso, não fica transparente e alonga o tronco de um jeito que afina a cintura instantaneamente."

🎬 CENA 3 (9-14s) - A PANTALONA RISCA DE GIZ:
- Passos amplos mostrando que as riscas verticais alinham perfeitamente entre o colete e a calça.
- Narração: "A calça tem caimento amplo fluido com barra generosa pra usar tanto de scarpin quanto de mocassim."

🎬 CENA 4 (14-18s) - PROVA DE AUTORIDADE:
- Corte mostrando fotos de passarela internacional comparadas com o produto real: caimento idêntico.
- Narração: "Qualidade de loja de grife internacional com preço direto de confecção brasileira."

🎬 CENA 5 (18-22s) - CTA:
- Apontando para o botão amarelo da vitrine:
- Narração: "Grade de numeração limitada do P ao GG. Clica no carrinho amarelo do vídeo antes que acabe o estoque!"`,
      },
      // 7. Moda Feminina - PRO
      {
        title: 'Body Modelador Cavado com Fecho Duplo - POV Provador Anti-Marcação',
        description:
          'POV no provador mostrando o antes e depois da compressão na cintura sem esmagar o busto, ideal para usar com calça branca.',
        niche: 'moda_feminina',
        style: 'pov',
        platform: 'shopee',
        is_free: false,
        hook: 'POV: O body cavado que reduz até 4cm de cintura sem te deixar sem respirar!',
        call_to_action:
          'Fecho duplo reforçado no fundo com forro de algodão. Link seguro na sacolinha!',
        tags: 'body modelador, afina cintura, tecido duplo, provador, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=bodysuit+slimming+woman+fitting+room+mirror&color=black',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 21 SEGUNDOS]

🎬 CENA 1 (0-3s) - O PROBLEMA DO CÓS APERTADO (HOOK):
- POV em frente ao espelho puxando o tecido da barriga com cara desanimada antes de colocar a peça.
- Texto na tela: "REDUZ A BARRIGUINHA SEM APERTAR ⏳🔥"
- Narração sincera: "POV: Você achou o body que modela a cintura como cinta pós-parto, mas é confortável como pijama..."

🎬 CENA 2 (3-8s) - A TRANSFORMAÇÃO IMEDIATA:
- Giro rápido vestindo o BODY MODELADOR preto sob uma calça de cintura alta branca impecável.
- Narração: "Olha essa linha de cintura! Ele tem tecido duplo de poliamida com elastano de alta gramatura que segura tudo no lugar sem enrolar."

🎬 CENA 3 (8-13s) - DETALHES FUNCIONAIS ESSENCIAIS:
- Mostrando a facilidade do fecho triplo de pressão entrepernas e alças macias que não cravam no ombro.
- Narração: "Super prático pra usar no banheiro com fecho duplo reforçado e a cava não machuca a virilha."

🎬 CENA 4 (13-17s) - O TESTE DA TRANSPARÊNCIA:
- Calça branca por cima: ZERO marcas de costura e o preto do body não aparece por baixo.
- Narração: "Combina com qualquer calça clara ou saia justa sem marcar nada nas costas."

🎬 CENA 5 (17-21s) - CTA:
- Apontando pro link da sacolinha:
- Narração: "Mais de 10 mil unidades vendidas com nota 4.9. Clica na sacolinha aqui da Shopee e aproveite o frete grátis hoje!"`,
      },
      // 8. Moda Feminina - PRO
      {
        title: 'Saia Plissada Metalizada Cintura Alta - Unboxing Vitrine Festa',
        description:
          'Efeito visual hipnotizante das pregas plissadas com brilho champanhe, unboxing cuidadoso com caimento espetacular para eventos.',
        niche: 'moda_feminina',
        style: 'unboxing_vitrine',
        platform: 'ambos',
        is_free: false,
        hook: 'A saia plissada mais perfeita que você vai ver na internet hoje: BRILHA DEMAIS!',
        call_to_action: 'Plissado permanente que não desfaz ao lavar. Link no carrinho!',
        tags: 'saia plissada, metalizada, look festa, elegante, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=metallic+pleated+midi+skirt+woman+party&color=yellow',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP / SHOPEE - 20 SEGUNDOS]

🎬 CENA 1 (0-3s) - O BRILHO HIPNOTIZANTE (HOOK):
- Tirando a saia da embalagem: o brilho metalizado champanhe reflete ondas de luz em movimento.
- Texto na tela: "PARECE DE GRIFE DE R$ 600 ✨👗"
- Narração admirada: "Se você tem um casamento, formatura ou festa especial esse mês, não compre nada antes de ver essa saia!"

🎬 CENA 2 (3-8s) - O TESTE DO PLISSADO:
- Mão abrindo o leque de pregas fininhas uniformes e soltando: o plissado volta com precisão milimétrica.
- Narração: "As pregas são prensadas a laser com tecnologia térmica permanente. Pode sentar, dobrar e lavar que ela não perde o formato."

🎬 CENA 3 (8-14s) - ELASTICIDADE DO CÓS:
- Mostrando o cós elástico com fios de lurex confortável que não aperta nem dobra na barriga.
- Narração: "Tem forro embutido até o joelho pra não ter nenhuma transparência e o comprimento midi é super chique."

🎬 CENA 4 (14-20s) - CTA:
- Modelo rodando suavemente com a saia aberta e apontando pro link:
- Narração: "Veste do 36 ao 44 com perfeição absoluta. O link com desconto tá disponível na vitrine aqui embaixo!"`,
      },
      // 9. Moda Feminina - PRO
      {
        title: 'Macacão Pantacourt Linho com Faixa e Fivela Tartaruga - Modelo Verão Urbano',
        description:
          'Modelo caminhando em rua arborizada no fim de tarde, mostrando a leveza do linho misto, bolso funcional e fivela sofisticada.',
        niche: 'moda_feminina',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'O macacão de linho que resolve seu look inteiro em 1 peça por menos de R$ 75!',
        call_to_action: 'Linho com viscose fresquinho que não pinica. Garanta no carrinho amarelo!',
        tags: 'macacao linho, pantacourt, look verao, sofisticado, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=linen+jumpsuit+belt+woman+summer+street&color=orange',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 21 SEGUNDOS]

🎬 CENA 1 (0-3s) - A PRATICIDADE DO LOOK ÚNICO (HOOK):
- Modelo pronta e radiante em frente a um café charmosa, ajustando a faixa na cintura.
- Texto na tela: "LOOK COMPLETO EM 30 SEGUNDOS ☀️🌿"
- Narração envolvente: "Aquela peça única que você veste quando tá sem criatividade e sai de casa parecendo capa de revista de moda!"

🎬 CENA 2 (3-8s) - A TEXTURA NOBRE DO LINHO:
- Close no tecido encorpado de linho com viscose na cor Cru / Areia.
- Close na fivela de resina tartaruga que eleva o valor percebido da peça.
- Narração: "Mistura nobre de linho com viscose: tem a elegância do linho natural sem pinicar e com a maciez da viscose."

🎬 CENA 3 (8-13s) - CAIMENTO PANTACOURT:
- Modelo caminhando mostrando o comprimento pantacourt que deixa o tornozelo à mostra com sandália anabela.
- Narração: "O corte pantacourt é fresco, os bolsos laterais são reais e o decote V valoriza o colo de forma discreta."

🎬 CENA 4 (13-17s) - BOTÕES FORRADOS & COSTAS:
- Mostrando o detalhe dos botões no peitoral e o lastex suave nas costas para ajuste perfeito ao busto.
- Narração: "O lastex traseiro faz a peça se moldar ao seu corpo mesmo se você ganhar ou perder alguns quilos."

🎬 CENA 5 (17-21s) - CTA:
- Apontando pro carrinho amarelo com simpatia:
- Narração: "A cor areia tá esgotando rápido no TikTok Shop. Clica no carrinho amarelo aqui embaixo e garanta o frete grátis!"`,
      },
      // 10. Moda Feminina - PRO
      {
        title: 'T-Shirt Gola Alta Algodão Egípcio - POV Combinações Infalíveis',
        description:
          'POV criando 4 looks instantâneos com uma camiseta preta gola alta de algodão egípcio que não deforma nem cria bolinhas.',
        niche: 'moda_feminina',
        style: 'pov',
        platform: 'shopee',
        is_free: false,
        hook: 'POV: 4 looks chiques usando a mesma camiseta básica de R$ 28 da Shopee!',
        call_to_action: 'Gola alta canelada que não deforma na máquina. Link na sacola!',
        tags: 'tshirt gola alta, algodao egipcio, looks elegantes, basico chic, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=mock+neck+black+tshirt+woman+capsule+wardrobe&color=black',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - O GANCHO DO ARMÁRIO CÁPSULA (HOOK):
- POV: Câmera mostrando o cabideiro minimalista com a camiseta preta gola alta em destaque.
- Texto na tela: "4 LOOKS COM 1 PEÇA DE R$ 28 🖤✨"
- Narração dinâmica: "POV: O dia em que você comprou a t-shirt básica certa e multiplicou seu armário por quatro!"

🎬 CENA 2 (3-8s) - LOOK 1 (ALFAIATARIA) & LOOK 2 (JEANS):
- Transição com estalar de dedos 1: Com blazer oversized e calça alfaiataria cinza (executiva chique).
- Transição 2: Com calça jeans reta e cinto de fivela dourada (casual estiloso).
- Narração: "Olha a gola alta estruturada de 4cm: ela fica alinhada o dia todo sem sufocar o pescoço."

🎬 CENA 3 (8-14s) - LOOK 3 (SAIA COURO) & LOOK 4 (SHORT ALFAIATARIA):
- Transição 3: Com minissaia de couro e bota (jantar à noite).
- Transição 4: Com short alfaiataria bege e mocassim (almoço casual).
- Narração: "O algodão é com toque de seda egípcio, não desbota no preto após 20 lavagens e tem zero transparência."

🎬 CENA 4 (14-18s) - O TESTE DO NÃO ENROLAR:
- Mostrando a barra dobrada por dentro da calça: não fica embolando na cintura nem marcando relevo.
- Narração: "Comprimento perfeito que fica firme dentro da calça sem ficar escapando a cada passo."

🎬 CENA 5 (18-22s) - CTA:
- Apontando para o link da sacolinha:
- Narração: "Kit com cores neutras (preto, off-white e marrom) com preço de fábrica na sacola aqui da Shopee!"`,
      },
      // 11. Moda Masculina - PRO
      {
        title: 'Camiseta Malha Heavyweight 260g Oversized - Modelo Estúdio Streetwear',
        description:
          'Modelo em fundo industrial de concreto mostrando a rigidez nobre da malha pesada 260g, gola de ribana 3,5cm e caimento reto.',
        niche: 'moda_masculina',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'O fim das camisetas finas que marcam o corpo: ESSA MALHA TEM 260G!',
        call_to_action:
          'Malha pesada fio 20.1 penteado com costura ombro a ombro. Link no carrinho amarelo!',
        tags: 'heavyweight, oversized masculina, malha pesada, streetwear, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=heavyweight+oversized+tshirt+man+concrete+studio&color=gray',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 23 SEGUNDOS]

🎬 CENA 1 (0-3s) - GANCHO DE IMPACTO TÁTIL (HOOK):
- Modelo segura a camiseta no ar e sacode: o tecido cai com peso sólido, sem esvoaçar como tecido barato fino.
- Texto na tela em fonte industrial: "MALHA PESADA 260G DE VERDADE ⚖️🔥"
- Narração com voz firme: "Se você tem vergonha daquelas camisetas finas que colam no corpo e marcam tudo, conheça o peso pesado do streetwear!"

🎬 CENA 2 (3-9s) - DETALHAMENTO DA GOLA & COSTURA:
- Puxando a gola de ribana canelada grossa com força: zero deformação.
- Close na costura reforçada com pesponto duplo e fita de reforço ombro a ombro.
- Narração: "Gola de 3,5cm com elastano na ribana que não vira 'orelha de abano'. Pesponto duplo e reforço ombro a ombro que dura anos."

🎬 CENA 3 (9-15s) - O FIT DROPPED SHOULDER NO CORPO:
- Modelo caminhando em câmera lenta: os ombros caídos alargam a silhueta masculina instantaneamente.
- Narração: "O corte dropped shoulder dá aquela postura em V com ombro largo mesmo pra quem é mais magro ou tá fora de forma."

🎬 CENA 4 (15-19s) - O TESTE DA LUZ:
- Colocando uma lanterna potente por trás do tecido branco: ZERO transparência!
- Narração: "Pode usar sem medo de transparência mesmo na cor branca sob o sol forte."

🎬 CENA 5 (19-23s) - CTA:
- Modelo aponta para o carrinho amarelo:
- Narração: "Marca de shopping cobra R$ 190 numa peça dessa. No TikTok Shop direto da fábrica sai por menos de R$ 49. Garante a sua cor!"`,
      },
      // 12. Moda Masculina - PRO
      {
        title: 'Calça Alfaiataria Masculina com Ajuste Elástico Oculto - POV Trabalho & Viagem',
        description:
          'POV entrando no avião ou reunião com calça social com visual impecável de terno, mas com cós expansível confortável de moletom.',
        niche: 'moda_masculina',
        style: 'pov',
        platform: 'shopee',
        is_free: false,
        hook: 'POV: A calça social que parece feita por alfaiate italiano mas estica feito moletom!',
        call_to_action:
          'Cós com elástico interno invisível e tecido com 4% elastano. Link na sacolinha!',
        tags: 'calca alfaiataria masculina, elastico oculto, social confortavel, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=tailored+trousers+man+stretch+comfort+office&color=black',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - GANCHO DA QUEBRA DE EXPECTATIVA (HOOK):
- POV sentado na cadeira de escritório ou poltrona com as pernas esticadas, demonstrando conforto total.
- Texto na tela: "CALÇA SOCIAL COM CONFORTO DE MOLETOM? 👖✈️"
- Narração cúmplice: "POV: O dia em que você aposentou todas as calças sociais duras que apertam a virilha no trabalho..."

🎬 CENA 2 (3-9s) - O MECANISMO DO CÓS OCULTO:
- Mão puxando a lateral da cintura: o cós estica até 5cm sem perder o desenho reto da alfaiataria.
- Narração: "O segredo tá na tecnologia do cós oculto: elástico embutido por dentro que ninguém vê por fora. Parece terno sob medida!"

🎬 CENA 3 (9-14s) - TECIDO SMART STRETCH:
- Modelo agacha e levanta rapidamente sem a calça repuxar no joelho nem no cavalo.
- Narração: "Tecido techno-stretch com 4% de elastano. Não amassa na mala de viagem, tem bolso antifurto com zíper e respirabilidade."

🎬 CENA 4 (14-18s) - ELEGÂNCIA COM QUALQUER SAPATO:
- Corte 1: Com sapato social marrom.
- Corte 2: Com tênis branco de couro casual.
- Narração: "Fica impecável do casamento no sábado à reunião de negócios na segunda."

🎬 CENA 5 (18-22s) - CTA:
- Apontando pro link seguro da sacola:
- Narração: "Mais de 15 mil homens já aprovaram na Shopee. Deixei o link na sacolinha aqui embaixo com frete grátis nacional!"`,
      },
      // 13. Moda Masculina - PRO
      {
        title: 'Jaqueta Bomber Suede Masculina Forrada - Modelo Urbana Noturna',
        description:
          'Modelo em cenário urbano noturno vestindo jaqueta bomber em camurça suede com zíper metálico tratorado e bolso interno.',
        niche: 'moda_masculina',
        style: 'modelo',
        platform: 'ambos',
        is_free: false,
        hook: 'O casaco masculino que custa R$ 89 e transforma qualquer homem comum em galã de cinema!',
        call_to_action: 'Suede aveludado resistente com forro em tafetá. Link na vitrine!',
        tags: 'jaqueta bomber, suede camurca, moda masculina, outono inverno, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=suede+bomber+jacket+man+city+night&color=orange',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP / SHOPEE - 24 SEGUNDOS]

🎬 CENA 1 (0-3s) - APRESENTAÇÃO CINEMATOGRÁFICA (HOOK):
- Modelo caminhando em direção à câmera ajustando os punhos canelados da bomber marrom conhaque / preta.
- Texto na tela: "A JAQUETA MAIS ELOGIADA DO ANO 🧥🎬"
- Narração confiante: "Se você quer uma jaqueta versátil que sirva pro encontro romântico, balada e barzinho com amigos, olha esse acabamento!"

🎬 CENA 2 (3-9s) - O TOQUE DO SUEDE PREMIUM:
- Close da mão deslizando no tecido aveludado sob a luz dourada do poste.
- Mostrando o zíper tratorado de metal fosco reforçado que corre suavemente.
- Narração: "Suede macio de alta densidade com toque de camurça nobre. Não racha no frio, não descasca como courino barato e corta o vento."

🎬 CENA 3 (9-15s) - FORRO TÉRMICO E BOLSOS FUNCIONAIS:
- Abrindo a jaqueta: forro interno de tafetá acetinado com bolso secreto para carteira e celular.
- Narração: "Forro interno térmico levinho que esquenta sem fazer volume. O bolso interno acomoda seu celular com segurança total."

🎬 CENA 4 (15-19s) - O FIT MASCULINO:
- Punhos e barra em ribana elástica que se ajustam na cintura sem ficar folgado.
- Narração: "Desenha os ombros e disfarça a barriga com o corte bomber clássico atemporal."

🎬 CENA 5 (19-24s) - CTA:
- Modelo sorrindo e sinalizando para o link:
- Narração: "Tá com envio em 24h na vitrine oficial aqui embaixo. Clica e garante o seu tamanho antes do início do inverno!"`,
      },
      // 14. Moda Masculina - PRO
      {
        title: 'Bermuda Chino Sarja com Elastano - Unboxing Vitrine Elegância Casual',
        description:
          'Abertura de caixa com bermuda chino em tom cáqui/areia, mostrando bolsos embutidos, costuras duplas e visual arrumado.',
        niche: 'moda_masculina',
        style: 'unboxing_vitrine',
        platform: 'shopee',
        is_free: false,
        hook: 'Aposente as bermudas de surf velhas: a bermuda chino de R$ 45 que te deixa alinhado!',
        call_to_action: 'Sarja 98% algodão com 2% elastano. Link seguro na sacolinha da Shopee!',
        tags: 'bermuda chino, sarja masculina, old money casual, unboxing shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=chino+shorts+man+flatlay+casual+summer&color=white',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 20 SEGUNDOS]

🎬 CENA 1 (0-3s) - O CONFRONTO DE ESTILO (HOOK):
- Comparativo rápido: de um lado uma bermuda de praia estampada velha jogada de lado; do outro, a bermuda chino cáqui impecável.
- Texto na tela: "UPGRADE NO ESTILO POR R$ 45 🩳👞"
- Narração direta: "Homens: parem de usar bermuda de praia pra sair à noite! Olha a diferença de presença dessa peça..."

🎬 CENA 2 (3-8s) - ACABAMENTO DE ALFAIATARIA CASUAL:
- Detalhe dos bolsos embutidos traseiros com botões tartaruga e bolso faca frontal.
- Narração: "Costura de alfaiataria em sarja peletizada macia. Não amassa com facilidade e tem 2% de elastano pra dar conforto na coxa."

🎬 CENA 3 (8-14s) - O COMPRIMENTO IDEAL:
- Mostrando a peça dobrada na altura exata de 2 dedos acima do joelho (o padrão ouro da moda masculina).
- Narração: "Comprimento no ponto certo: nem comprida demais estilo anos 90, nem curta demais. Fica perfeita com polo ou camisa de linho."

🎬 CENA 4 (14-20s) - CTA:
- Apontando pro link da sacolinha:
- Narração: "Tem em cáqui, preto, marinho e verde militar. Clica na sacolinha aqui do vídeo e aproveita o cupom de frete grátis da Shopee!"`,
      },
      // 15. Moda Masculina - PRO
      {
        title: 'Camisa Manga Curta Viscose Estonada Floral Sutil - POV Férias & Barzinho',
        description:
          'POV escolhendo a camisa estampada com caimento fluido para encontro de verão ou pôr do sol na praia.',
        niche: 'moda_masculina',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'POV: A camisa que faz sua namorada dizer que você tá lindo antes mesmo de sair de casa!',
        call_to_action:
          'Viscose premium super fresca com caimento fluido. Link no carrinho amarelo!',
        tags: 'camisa estampada masculina, viscose, verao, resort wear, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=floral+viscose+short+sleeve+shirt+man+sunset&color=cyan',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 21 SEGUNDOS]

🎬 CENA 1 (0-3s) - O GANCHO DO ELOGIO REAL (HOOK):
- POV em frente ao espelho com camisa de botão aberta semiaberta com regata branca por baixo.
- Texto na tela: "A CAMISA MAIS ELOGIADA DO VERÃO 🌴✨"
- Narração bem-humorada: "POV: O dia em que você comprou uma camisa estampada sem exagero e recebeu mais elogios em 1 hora do que no ano inteiro!"

🎬 CENA 2 (3-9s) - A LEVEZA DA VISCOSE:
- Sacudindo o tecido suavemente contra a luz da janela: tecido fluido que não pesa no corpo.
- Narração: "Viscose de gramatura premium: ela tem movimento, não esquenta nem no sol de 35 graus e a gola camp cubana dá aquele ar despojado."

🎬 CENA 3 (9-14s) - ESTAMPA ELEGANTE:
- Close nos botões ecológicos de coco e na estampa botânica minimalista em tons terrosos suaves.
- Narração: "Estampa de bom gosto sem parecer fantasia de carnaval. Os botões são reforçados e o tecido já vem pré-encolhido."

🎬 CENA 4 (14-17s) - COMBINAÇÃO COM BERMUDA OU JEANS:
- Dando um giro rápido mostrando como fica bem tanto fechada quanto aberta com camiseta neutra.
- Narração: "Dá pra usar no almoço de praia ou no jantar com bermuda alfaiataria."

🎬 CENA 5 (17-21s) - CTA:
- Apontando pro carrinho amarelo:
- Narração: "Preço promocional de lançamento no carrinho amarelo aqui embaixo. Garanta a sua estampa favorita antes de esgotar!"`,
      },
      // 16. Moda Masculina - PRO
      {
        title: 'Suéter Tricô Gola Redonda Fio Leve - Modelo Inverno Clean',
        description:
          'Modelo masculino com suéter em tricot macio cor areia/cinza, demonstrando textura canelada sutil e corte slim confortável.',
        niche: 'moda_masculina',
        style: 'modelo',
        platform: 'ambos',
        is_free: false,
        hook: 'O suéter de tricô que deixa qualquer homem com aparência de milionário no inverno!',
        call_to_action: 'Fio de algodão com acrílico que não deforma nem pinica. Link na vitrine!',
        tags: 'sueter trico, moda masculina inverno, old money masculino, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=knit+crewneck+sweater+man+clean+minimal&color=gray',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP / SHOPEE - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - HOOK IMPACTO VISUAL ELEGANTE:
- Modelo ajustando o relógio com o suéter de tricô areia por cima de uma gola de camisa branca alinhada.
- Texto na tela: "ESTILO DE MILIONÁRIO POR R$ 59 🍂☕"
- Narração inspiradora: "O segredo dos homens mais bem vestidos nos dias frios é dominar a sobreposição com esse tricô!"

🎬 CENA 2 (3-9s) - O TOQUE DO FIO NÃO-PINICA:
- Close nas tramas macias do tricô com a mão passando suavemente sobre o peito.
- Narração: "Trama em ponto pérola super macia: não pinica no pescoço, não solta fiapos na camisa e tem elasticidade que acompanha seus movimentos."

🎬 CENA 3 (9-14s) - AJUSTE NOS PUNHOS E CINTURA:
- Modelo mostrando o punho canelado justo no antebraço e barra que fica no lugar certo sem parecer frouxa.
- Narração: "A barra tem elasticidade inteligente pra não ficar abrindo tipo sino na cintura."

🎬 CENA 4 (14-18s) - VERSATILIDADE TÉRMICA:
- Mostrando que é térmico sem ser pesado ou sufocante para o clima brasileiro.
- Narração: "Ideal pro outono e inverno brasileiro: esquenta na medida sem fazer você transpirar em ambientes fechados."

🎬 CENA 5 (18-22s) - CTA:
- Modelo apontando para a vitrine com um sorriso tranquilo:
- Narração: "Disponível nas cores areia, preto, chumbo e verde musgo. Clica no link aqui embaixo pra garantir o seu com cupom!"`,
      },
      // 17. Fitness & Academia - PRO
      {
        title: 'Conjunto Seamless Canelado Degradê com Efeito Modelador - POV Treino Pesado',
        description:
          'POV no espelho da academia fazendo treino de pernas com conjunto sem costura degradê que valoriza a silhueta e não marca celulite.',
        niche: 'fitness_academia',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'POV: O conjunto fitness que esconde qualquer celulite e desenha a cintura no treino!',
        call_to_action:
          'Tecido sem costura 320g com cós duplo compressivo. Link no carrinho amarelo!',
        tags: 'conjunto fitness, sem costura, degrade, modelador, gymtok, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=ombre+seamless+gym+set+leggings+woman+workout&color=purple',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 23 SEGUNDOS]

🎬 CENA 1 (0-3s) - O TESTE DA AUTOESTIMA NO ESPELHO (HOOK):
- POV em frente ao espelho iluminado da academia, vestindo o conjunto degradê roxo/chumbo.
- Texto na tela em destaque: "ZERO CELULITE E CINTURA DESENHADA 🍑💪"
- Narração empolgada: "POV: Você colocou um conjunto na academia e passou o treino inteiro se admirando no espelho..."

🎬 CENA 2 (3-8s) - TECNOLOGIA SEAMLESS DE ALTA COMPRESSÃO:
- Mão demonstrando a textura canelada encorpada e o cós de 12cm que abraça o abdômen sem enrolar.
- Narração: "Tecnologia seamless sem costura nas laterais: zero atrito na pele, o tecido de 320g disfarça qualquer textura da pele e a cintura não dobra no agachamento."

🎬 CENA 3 (8-14s) - O TESTE DO AGACHAMENTO PROFUNDO (SQUAT PROOF):
- Gravando o agachamento de costas sob a luz branca da academia: NENHUMA transparência de calcinha.
- Narração: "Totalmente à prova de agachamento! Não fica branco, não laceia e tem forro anatômico reforçado no fundilho."

🎬 CENA 4 (14-19s) - SUPORTE DO TOP COM COSTAS CRUZADAS:
- Giro mostrando as costas com tiras reforçadas e sustentação perfeita pro treino de cardio e pulos.
- Narração: "O top tem bojo removível e costas cruzadas que dividem o peso sem machucar o trapézio."

🎬 CENA 5 (19-23s) - CTA:
- Apontando pro carrinho amarelo com o haltere na outra mão:
- Narração: "Conjunto completo importado por menos de R$ 79 no carrinho amarelo do TikTok Shop. Pega sua cor antes que termine o lote!"`,
      },
      // 18. Fitness & Academia - PRO
      {
        title: 'Bermuda Ciclista Meia Coxa com Bolsos Profundos - Modelo Corrida na Rua',
        description:
          'Modelo correndo ao ar livre com bermuda ciclista que não sobe na coxa durante os passos e guarda celular sem balanço.',
        niche: 'fitness_academia',
        style: 'modelo',
        platform: 'shopee',
        is_free: false,
        hook: 'A bermuda ciclista que NÃO enrola na coxa quando você corre ou caminha!',
        call_to_action:
          'Tecido suplex power anti-assadura com 2 bolsos laterais. Link na sacolinha!',
        tags: 'bermuda ciclista, corrida feminina, bolso celular, nao sobe na coxa, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=biker+shorts+woman+running+outdoor+pocket&color=black',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - A MAIOR DOR DE QUEM FAZ EXERCÍCIO (HOOK):
- Modelo correndo na calçada, para e aponta pras pernas com sorriso de alívio.
- Texto na tela: "FINALMENTE UMA BERMUDA QUE NÃO SOBE! 🏃‍♀️🔥"
- Narração sincera: "Se você também não aguenta mais dar 10 passos e ter que puxar a bermuda que fica subindo na virilha, assiste isso!"

🎬 CENA 2 (3-9s) - O COMPRIMENTO ANTI-ATRITO:
- Close na barra com costura plana reforçada e comprimento exato no meio da coxa.
- Narração: "O comprimento meia-coxa protege contra o atrito entre as pernas, o tecido suplex power não deixa assar e tem compressão moderada."

🎬 CENA 3 (9-14s) - O TESTE DO CELULAR NO BOLSO:
- Modelo guarda um celular grande no bolso lateral fundo e dá 4 saltos seguidos: o celular fica imóvel!
- Narração: "Os bolsos laterais são profundos: cabe smartphone, chave de casa e barrinha de cereal sem balançar e sem perigo de cair."

🎬 CENA 4 (14-18s) - CÓS ALTO MODELADOR:
- Modelo mostra a cintura alta que segura o abdômen sem prender a respiração durante a corrida.
- Narração: "Cós duplo de compressão que dá segurança total em qualquer movimento."

🎬 CENA 5 (18-22s) - CTA:
- Modelo apontando para a sacolinha:
- Narração: "Preço de fábrica na Shopee com devolução gratuita caso você queira trocar de tamanho. Clica no link da sacola agora!"`,
      },
      // 19. Fitness & Academia - PRO
      {
        title: 'Corta-Vento Fitness Ultraleve com Capuz e Bolso Embutido - Unboxing Vitrine',
        description:
          'Abertura rápida demonstrando a tecnologia dobrável da jaqueta corta-vento que vira uma bolsinha de mão e repele vento frio.',
        niche: 'fitness_academia',
        style: 'unboxing_vitrine',
        platform: 'ambos',
        is_free: false,
        hook: 'A jaqueta corta-vento que cabe na palma da sua mão e salva seu treino no frio!',
        call_to_action:
          'Tecido impermeável ultraleve dobrável com capuz. Link disponível na vitrine!',
        tags: 'corta vento corrida, impermeavel leve, academia, corrida rua, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=packable+windbreaker+jacket+fitness+unboxing&color=pink',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP / SHOPEE - 21 SEGUNDOS]

🎬 CENA 1 (0-3s) - O EFEITO MÁGICO DE BOLSO (HOOK):
- Segurando uma bolsinha minúscula na mão, abre o zíper e puxa a jaqueta corta-vento inteira de dentro!
- Texto na tela: "CABE NA PALMA DA MÃO! 💨🧥"
- Narração surpresa: "Essa jaqueta é a coisa mais genial que eu já comprei pra treinar ao ar livre e correr pela manhã!"

🎬 CENA 2 (3-8s) - ABERTURA & PESO PENA:
- Sacudindo a corta-vento: ela pesa menos de 100 gramas e o tecido de poliamida resinada se desdobra impecável.
- Narração: "Pesa menos que uma maçã! O tecido corta o vento gelado imediatamente sem fazer barulho de saco plástico ao correr."

🎬 CENA 3 (8-13s) - TESTE DE REPELÊNCIA À ÁGUA:
- Borrifando água com spray: as gotas escorrem imediatamente sem encharcar o tecido.
- Narração: "Repele chuva fina e sereno da manhã, e a parte das costas tem abertura com telinha respirável pra não suar por dentro."

🎬 CENA 4 (13-17s) - CAPUZ COM AJUSTE ANATÔMICO:
- Colocando o capuz e ajustando o elástico: não voa com o vento da corrida.
- Narração: "O capuz tem regulador que fixa firme na cabeça mesmo correndo contra o vento."

🎬 CENA 5 (17-21s) - CTA:
- Apontando para o botão da vitrine:
- Narração: "Cores neon com refletivo de segurança noturna na vitrine aqui embaixo. Aproveite o frete grátis antes que esfrie mais!"`,
      },
      // 20. Fitness & Academia - PRO
      {
        title: 'Regata Cavada Masculina Dry Fit com Caimento Arredondado - Modelo Treino Pesado',
        description:
          'Modelo atlético executando elevação lateral na academia, demonstrando liberdade total dos ombros e tecido dry furadinho que seca suor.',
        niche: 'fitness_academia',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'A regata de treino que valoriza as costas e ombros sem ficar parecendo vulgar!',
        call_to_action: 'Tecido furadinho antibacteriano anti-odor. Link no carrinho amarelo!',
        tags: 'regata cavada treino, dry fit masculino, gymtok, musculacao, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=muscle+dry+fit+stringer+tank+gym+workout&color=black',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - O GANCHO DO FÍSICO VALORIZADO (HOOK):
- Modelo de costas na polia ou puxador da academia fazendo movimento dorsal: o desenho das costas fica em evidência natural.
- Texto na tela: "A REGATA QUE MAIS VALORIZA O SHAPE 💪🔥"
- Narração enérgica: "Se você treina pesado e quer uma regata que mostre o resultado do seu esforço sem ficar caindo do corpo, olha esse corte!"

🎬 CENA 2 (3-9s) - A MODELAGEM SWAGGER COM BARRA CURVA:
- Close na barra arredondada mais longa que não sobe quando levanta os braços no desenvolvimento.
- Narração: "A barra é alongada em curva pra cobrir a lombar em qualquer exercício e a cava lateral não deixa o mamilo à mostra."

🎬 CENA 3 (9-14s) - TECNOLOGIA ANTI-ODOR & SECAGEM RÁPIDA:
- Mostrando a micro-perfuração do tecido contra a luz: ventilação contínua.
- Narração: "Tecido dry fit com tratamento antibacteriano que não acumula aquele cheiro ruim de suor antigo e seca em minutos."

🎬 CENA 4 (14-18s) - RESISTÊNCIA DE COSTURA:
- Puxando as alças com força: costura reforçada com travete nos pontos de tensão.
- Narração: "Aguenta máquina de lavar e atrito de barra pesada sem desfiar."

🎬 CENA 5 (18-22s) - CTA:
- Modelo apontando pro carrinho amarelo:
- Narração: "Kit com 3 peças por preço de 1 de marca famosa no carrinho amarelo do TikTok Shop. Pega sua grade hoje!"`,
      },
    ]

    for (let i = 0; i < proPromptsPart1.length; i++) {
      const p = proPromptsPart1[i]
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
