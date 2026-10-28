/// <reference path="../pb_data/types.d.ts" />

/**
 * Migração 0031:
 * 10 novos prompts para:
 * - espelhos_decoracao (10 prompts)
 * - produtos_eletronicos (10 prompts)
 * - capinhas_acessorios_celular (10 prompts)
 * Total: 30 prompts
 */

migrate(
  (app) => {
    const promptsCol = app.findCollectionByNameOrId('prompts')

    const prompts = [
      // ==========================================
      // ESPELHOS & DECORAÇÃO (10 prompts)
      // ==========================================
      {
        title: '🪞 Espelho Orgânico com Moldura em Couro e LED Embutido',
        description:
          'POV ligando o touch do espelho orgânico na parede da sala revelando iluminação suave.',
        niche: 'espelhos_decoracao',
        style: 'pov',
        platform: 'ambos',
        is_free: false,
        category: 'ecommerce',
        hook: 'POV: O espelho orgânico com LED touch que transformou minha parede vazia em capa de revista de décor!',
        call_to_action:
          'Vidro cristal de 4mm sem distorção com fita de couro legítimo. Link na sacolinha!',
        tags: 'espelho organico led, decoracao sala quarto, touch screen, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=organic+mirror+led+backlit+wall+living+room&color=orange',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O TOQUE QUE ACENDE O LED (HOOK):
- POV tocando o botão touch no vidro: a retroiluminação de LED branco quente acende contornando o formato orgânico.
- Narração: "Paguei menos de oitenta reais nesse espelho e ele parece os de arquiteto de dois mil reais!"

🎬 CENA 2 (3-7s) - IMAGEM CRISTALINA SEM DEFORMAÇÃO:
- Dando passos para trás no reflexo: imagem 100% nítida e proporções perfeitas sem ondulações.
- Narração: "Vidro cristal de quatro milímetros que não deforma o reflexo e moldura em couro pesponto."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Sorriso admirando o ambiente novo com dedo apontando para a sacolinha amarela no canto.
- Narração: "Vem super bem embalado com proteção de madeira na sacolinha. Pega o cupom!"`,
      },
      {
        title: '🪞 Fita de LED Inteligente RGB com Controle e Sincronização Musical',
        description:
          'Demonstração colando a fita de LED atrás da TV e sincronizando com as batidas da música.',
        niche: 'espelhos_decoracao',
        style: 'unboxing_vitrine',
        platform: 'tiktok_shop',
        is_free: false,
        category: 'ecommerce',
        hook: 'A fita de LED de R$ 19 que cola em qualquer lugar e pisca no ritmo da música que você toca!',
        call_to_action:
          'Adesivo 3M reforçado com app no celular e controle remoto. Link no carrinho amarelo!',
        tags: 'fita led rgb inteligente, decoracao quarto gamer, sinc som, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=rgb+led+strip+lights+bedroom+tv+backlight&color=purple',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - A MUDANÇA DO CLIMA NO QUARTO (HOOK):
- Apagando a luz principal e ligando o LED no celular: o quarto ganha iluminação neon imersiva instantânea.
- Narração: "Quer deixar seu quarto com clima de cinema gastando menos de vinte reais?"

🎬 CENA 2 (3-7s) - SINCRONIZAÇÃO COM A MÚSICA:
- Colocando uma música no celular: as luzes piscam suavemente acompanhando os graves e agudos.
- Narração: "Mais de dezesseis milhões de cores no aplicativo, adesivo que não descola e microfone embutido."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Dedo indicador apontado com firmeza para o carrinho amarelo no rodapé.
- Narração: "Rolo de 5 metros com fonte inclusa na sacolinha do vídeo com frete grátis!"`,
      },
      {
        title: '🪞 Espelho de Mesa Giratório para Maquiagem com 3 Níveis de Luz',
        description:
          'Modelo usando o espelho com luz circular ao redor ajustando a intensidade no touch screen.',
        niche: 'espelhos_decoracao',
        style: 'modelo',
        platform: 'shopee',
        is_free: true,
        category: 'ecommerce',
        hook: 'O espelho de maquiagem que mostra cada poro do seu rosto pra nunca mais errar a cor da base!',
        call_to_action:
          '3 temperaturas de cor (quente, neutra e fria) recarregável USB. Link na Shopee!',
        tags: 'espelho mesa maquiagem led, ring light espelho, shopee decoracao',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=led+vanity+mirror+makeup+woman+touch&color=white',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O TOQUE QUE MUDA A TEMPERATURA (HOOK):
- Modelo tocando o sensor: a luz muda de amarela suave para branca de precisão iluminando o rosto por igual.
- Narração: "Se você se maquia na luz do quarto e quando sai na rua a base tá manchada, olha isso!"

🎬 CENA 2 (3-7s) - ZOOM DE DETALHE E BASE BANDEJA:
- Girando noventa graus e guardando os brincos e batons na bandeja da base do espelho.
- Narração: "Bateria recarregável que dura dias sem fio e base organizadora pra guardar suas bijuterias."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Modelo sorrindo com maquiagem perfeita e apontando para a sacolinha da Shopee.
- Narração: "O companheiro indispensável da penteadeira na sacolinha da Shopee com cupom!"`,
      },
      {
        title: '🪞 Relógio de Parede 3D Gigante Adesivo Minimalista Moderno',
        description:
          'POV colando os números em acrílico espelhado na parede da sala com régua gabarito inclusa.',
        niche: 'espelhos_decoracao',
        style: 'pov',
        platform: 'ambos',
        is_free: false,
        category: 'ecommerce',
        hook: 'POV: O relógio 3D adesivo de R$ 25 que qualquer pessoa monta em 5 minutos sem furar parede!',
        call_to_action:
          'Mecanismo silencioso sem tique-taque com gabarito de instalação. Link na sacolinha!',
        tags: 'relogio 3d parede adesivo, decoracao moderna sala, sem furar parede, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=modern+3d+wall+clock+diy+acrylic+living+room&color=black',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O EFEITO ESPELHADO DOS NÚMEROS (HOOK):
- POV tirando a película protetora do número 12: o acrílico espelhado reluz com sofisticação na parede.
- Narração: "O achadinho de decoração mais barato e elegante que você vai colocar na sua sala!"

🎬 CENA 2 (3-7s) - MONTAGEM COM O GABARITO CIRCULAR:
- Girando a reguinha do gabarito central marcando os números perfeitamente alinhados sem trena.
- Narração: "Vem com gabarito pra você não errar a distância, adesivo forte e maquinário cem por cento silencioso."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Afasta a câmera mostrando a parede completa transformada com dedo na sacolinha.
- Narração: "Mais de cinco mil casas transformadas com ele na sacolinha. Pega o seu!"`,
      },
      {
        title: '🪞 Luminária da Lua Cheia 3D com Suporte de Madeira e 16 Cores',
        description:
          'Unboxing ligando a esfera da lua com relevo realista das crateras e mudando de cor no controle.',
        niche: 'espelhos_decoracao',
        style: 'unboxing_vitrine',
        platform: 'tiktok_shop',
        is_free: false,
        category: 'ecommerce',
        hook: 'A luminária da lua cheia que parece flutuar na cabeceira da cama e acalma a ansiedade à noite!',
        call_to_action:
          'Impressão 3D de alta precisão com suporte de madeira nobre. Link no carrinho!',
        tags: 'luminaria lua cheia 3d, abajur cabeceira quarto, relaxamento, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=3d+moon+lamp+wooden+stand+nightstand+bedroom&color=yellow',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O BRILHO DA LUA NA ESCURIDÃO (HOOK):
- Tocando na superfície da lua: o relevo das crateras brilha com luz amarelada quente e aconchegante.
- Narração: "Ter a lua cheia iluminando o seu quarto todas as noites por menos de trinta reais!"

🎬 CENA 2 (3-7s) - SUPORTE DE MADEIRA E CORES:
- Montando os três suportes de madeira magnéticos e mudando as cores no controle remoto compacto.
- Narração: "Impressão tridimensional fiel à textura da lua, dezesseis cores e ajuste de intensidade de luz."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Dedo apontando com firmeza para o carrinho amarelo no vídeo.
- Narração: "O presente perfeito na sacolinha do vídeo com frete grátis. Aproveita!"`,
      },
      {
        title: '🪞 Kit Quadros Minimalistas Botânicos com Vidro e Moldura Filete',
        description:
          'POV pendurando o trio de quadros botânicos sobre o sofá com fita dupla-face sem furadeira.',
        niche: 'espelhos_decoracao',
        style: 'pov',
        platform: 'shopee',
        is_free: false,
        category: 'ecommerce',
        hook: 'POV: O kit com 3 quadros de vidro que cobriu minha parede sem precisar de furadeira nem sujeira!',
        call_to_action:
          'Moldura filete premium com vidro de proteção e fita já inclusa. Link na Shopee!',
        tags: 'quadros decorativos botanicos, moldura filete vidro, sem furos, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=botanical+wall+art+prints+frames+sofa&color=green',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - A INSTALAÇÃO EM 10 SEGUNDOS (HOOK):
- POV tirando a fita de proteção traseira e pressionando o quadro na parede com firmeza imediata.
- Narração: "Sem furadeira, sem poeira de tijolo e sem brigar com ninguém pra pendurar quadro!"

🎬 CENA 2 (3-7s) - ACABAMENTO COM VIDRO E MOLDURA FILETE:
- Close na moldura fininha preta e no vidro brilhante que protege as gravuras botânicas de poeira e sol.
- Narração: "Impressão fotográfica de altíssima resolução com proteção de vidro cristal e moldura moderna."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Sala inteira harmoniosa e dedo apontando para a sacolinha da Shopee.
- Narração: "Trio de quadros completos com valor imperdível na sacolinha da Shopee. Clica aqui!"`,
      },
      {
        title: '🪞 Prateleira Flutuante Invisível em U com Fixação Oculta',
        description:
          'Colocando livros pesados e vasinhos sobre a prateleira que parece flutuar na parede.',
        niche: 'espelhos_decoracao',
        style: 'unboxing_vitrine',
        platform: 'ambos',
        is_free: false,
        category: 'ecommerce',
        hook: 'O teste do peso: coloquei 10 livros pesados e essa prateleira invisível nem tremeu!',
        call_to_action: 'MDF de alta densidade 15mm com suporte invisível. Link na sacolinha!',
        tags: 'prateleira flutuante u, suporte oculto livros decoracao, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=floating+shelves+white+books+plants+wall&color=white',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O TESTE DO PESO COM LIVROS (HOOK):
- Colocando quatro livros grossos e um vasinho de planta: a prateleira fica 100% reta e estável.
- Narração: "Cansado de prateleira que fica empenada pra baixo com medo de colocar um livro?"

🎬 CENA 2 (3-7s) - SUPORTE EMBUTIDO SEM NENHUM PARAFUSO APARECENDO:
- Câmera mostra por baixo e pelas laterais: acabamento limpo sem cantoneiras de ferro feias visíveis.
- Narração: "MDF de quinze milímetros com bordas arredondadas e ferragem interna que suporta até dez quilos."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Dedo apontando com segurança para a sacolinha amarela no vídeo.
- Narração: "Kit com 3 unidades em tamanhos diferentes na sacolinha. Pede as suas!"`,
      },
      {
        title: '🪞 Vaso de Cerâmica Estilo Nó Nórdico Escultural',
        description:
          'Modelo colocando uma haste de eucalipto seco no vaso em formato de nó geométrico minimalista.',
        niche: 'espelhos_decoracao',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: false,
        category: 'ecommerce',
        hook: 'O vaso em nó escultural que parece obra de arte de galeria moderna por R$ 34 no TikTok Shop!',
        call_to_action: 'Cerâmica com textura fosca aveludada. Link no carrinho amarelo!',
        tags: 'vaso ceramica nordico no, decoracao pinterest, mesa de centro, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=nordic+donut+knot+ceramic+vase+minimalist&color=white',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O DESIGN ESCULTURAL MINIMALISTA (HOOK):
- Modelo posicionando o vaso de nó no centro da mesa de jantar: estética nórdica chique instantânea.
- Narração: "O objeto de décor que todo influenciador de arquitetura tem na mesa de centro!"

🎬 CENA 2 (3-7s) - TEXTURA FOSCA E ENCAIXE DAS FLORES:
- Inserindo um galho de flor seca no orifício: a forma geométrica chama atenção de qualquer ângulo.
- Narração: "Cerâmica fosca artesanal com toque acetinado que não risca móveis e dura a vida inteira."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Modelo sorri admirando a composição e aponta para o carrinho amarelo no rodapé.
- Narração: "Várias cores neutras disponíveis na sacolinha amarela com frete grátis!"`,
      },
      {
        title: '🪞 Espelho Redondo Adnet com Alça de Couro Ecológico e Suporte',
        description:
          'POV pendurando o espelho redondo Adnet no pino de madeira na parede do lavabo.',
        niche: 'espelhos_decoracao',
        style: 'pov',
        platform: 'shopee',
        is_free: false,
        category: 'ecommerce',
        hook: 'POV: O espelho Adnet de R$ 45 que transformou meu lavabo simples em banheiro de restaurante chique!',
        call_to_action:
          'Diâmetro 45cm com alça de couro sintético reforçada e pino incluso. Link na Shopee!',
        tags: 'espelho adnet couro redondo, decoracao lavabo, shopee achados',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=round+adnet+mirror+leather+strap+bathroom&color=black',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O ENCAIXE NO PINO DE MADEIRA (HOOK):
- POV encaixando a fivela de couro no pendurador de madeira na parede do lavabo: visual imponente.
- Narração: "Você não precisa gastar fortuna com reforma pra deixar seu banheiro super elegante!"

🎬 CENA 2 (3-7s) - VIDRO SEM MANCHAS E COSTURA REFORÇADA:
- Close na costura pespontada da correia e na borda metálica que não descasca com a umidade do chuveiro.
- Narração: "Tratamento anti-umidade que não enferruja no vapor do banho e vidro cristal de alta nitidez."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Espelho refletindo o lavabo impecável com dedo na sacolinha da Shopee.
- Narração: "Acompanha o pino de fixação no link da sacolinha. Garanta o seu com desconto!"`,
      },
      {
        title: '🪞 Cortina Voil com Forro Blackout em Tecido 100% Blecaute',
        description:
          'Fechando a cortina às 13h sob sol forte: o quarto vira breu total como se fosse meia-noite.',
        niche: 'espelhos_decoracao',
        style: 'unboxing_vitrine',
        platform: 'tiktok_shop',
        is_free: true,
        category: 'ecommerce',
        hook: 'O teste do sol do meio-dia: fechei a cortina e o quarto virou BREU TOTAL pra dormir até tarde!',
        call_to_action:
          'Tecido duplo (voil elegante + blackout grosso sem cheiro de plástico). Link no carrinho!',
        tags: 'cortina blackout voil, quarto escuro sol, sono profundo, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=blackout+curtains+bedroom+dark+sunlight+test&color=gray',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O QUARTO ESCURO NO MEIO-DIA (HOOK):
- Janela com claridade ofuscante de sol quente; puxa a cortina e a sala fica em escuridão completa instantânea.
- Narração: "Quem trabalha de noite ou odeia acordar com sol na cara às 6h da manhã precisa ver isso!"

🎬 CENA 2 (3-7s) - TECIDO ELEGANTE SEM CHEIRO DE PLÁSTICO:
- Mostrando a frente em voil sofisticado e o verso em tecido grosso térmico que bloqueia calor e som.
- Narração: "Cem por cento blecaute em tecido lavável, reduz o calor externo e não tem cheiro ruim de lona."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Ilhós cromados deslizando suaves no varão e dedo apontando para o carrinho amarelo.
- Narração: "Medidas para todos os tipos de janela no carrinho amarelo com entrega rápida!"`,
      },

      // ==========================================
      // PRODUTOS ELETRÔNICOS (10 prompts)
      // ==========================================
      {
        title: '⚡ Fone Bluetooth TWS com Cancelamento Ativo de Ruído ANC',
        description:
          'POV ligando o modo ANC no fone dentro do metrô lotado e o barulho em volta sumindo como mágica.',
        niche: 'produtos_eletronicos',
        style: 'pov',
        platform: 'ambos',
        is_free: false,
        category: 'ecommerce',
        hook: 'POV: O cancelamento de ruído de R$ 68 que calou o metrô lotado como se eu estivesse sozinho em casa!',
        call_to_action:
          'Cancelamento ativo ANC de 35dB com bateria de até 30 horas. Link na sacolinha!',
        tags: 'fone bluetooth anc cancelamento ruido, metrô silencio, graves potentes, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=anc+wireless+earbuds+subway+noise+cancelling&color=black',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O BOTÃO QUE CALA O MUNDO (HOOK):
- POV colocando o fone no ouvido no meio de rua barulhenta e tocando no sensor: o som ambiente silencia.
- Narração: "A sensação surreal de ligar o cancelamento de ruído e o barulho do mundo sumir na hora!"

🎬 CENA 2 (3-7s) - GRAVE ENCORPADO E VISOR DE CARGA:
- Abrindo a caixinha com visor digital mostrando noventa e oito por cento de carga restante nos fones.
- Narração: "Grave pesado que faz o cérebro vibrar, modo transparência e trinta horas de bateria no estojo."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Batendo o pé no ritmo da música com sorriso no rosto e apontando para a sacolinha amarela.
- Narração: "Custa um décimo do fone da maçã no link da sacolinha com frete grátis. Aproveita!"`,
      },
      {
        title: '⚡ Mini Caixa de Som Bluetooth À Prova D’Água para Chuveiro',
        description:
          'Modelo grudando a caixa com ventosa no azulejo do box e cantando debaixo da água do chuveiro.',
        niche: 'produtos_eletronicos',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: false,
        category: 'ecommerce',
        hook: 'A caixinha de som à prova d’água que você cola no azulejo do box e atende ligações no banho!',
        call_to_action: 'Proteção IPX7 submergível com graves potentes. Link no carrinho amarelo!',
        tags: 'caixa som chuveiro a prova dagua, ventosa box, bluetooth, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=waterproof+bluetooth+shower+speaker+suction+cup&color=blue',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - A MÚSICA DEBAIXO DO CHUVEIRO (HOOK):
- Água do chuveiro caindo direto sobre a caixinha colada na parede do box: o som continua alto e nítido.
- Narração: "Nunca mais arrisque queimar seu celular deixando ele na beira da pia pra ouvir música no banho!"

🎬 CENA 2 (3-7s) - VENTOSA DE PRESSÃO E BOTÕES GRANDES:
- Puxando a ventosa firme e trocando de faixa com as mãos molhadas com um toque no botão emborrachado.
- Narração: "Graves que não distorcem na água, microfone integrado pra atender chamadas e ventosa ultra forte."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Modelo sorrindo com a toalha no cabelo e apontando para o carrinho amarelo no rodapé.
- Narração: "Menos de quarenta reais no carrinho amarelo com entrega rápida. Pega a sua!"`,
      },
      {
        title: '⚡ Powerbank Por Indução Magnético MagSafe Ultrafino',
        description:
          'POV aproximando o powerbank da traseira do iPhone e o clique magnético ativando a carga rápida.',
        niche: 'produtos_eletronicos',
        style: 'pov',
        platform: 'shopee',
        is_free: true,
        category: 'ecommerce',
        hook: 'POV: O clique magnético que carrega o celular sem nenhum cabo pendurado no bolso!',
        call_to_action: 'Ímãs de neodímio N52 fortes com carga de 20W rápida. Link na Shopee!',
        tags: 'powerbank magsafe inducao, carregador portatil magnetico, shopee eletronicos',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=magnetic+wireless+powerbank+magsafe+phone&color=white',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O CLICK MAGNÉTICO INSTANTÂNEO (HOOK):
- Aproximando a bateria da traseira do celular: ela trava com força magnética e a animação de carga acende na tela.
- Narração: "Adeus andar na rua parecendo uma árvore de natal cheia de cabos enrolados na mão!"

🎬 CENA 2 (3-7s) - BALANÇANDO SEM CAIR:
- Chacoalhando o celular suspenso pela bateria: o magnetismo mantém tudo colado sem deslizar.
- Narração: "Ímã potente que não solta, corpo ultrafino que cabe no bolso e duas cargas completas de emergência."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Guardando o celular com a bateria no bolso com dedo apontando para a sacolinha da Shopee.
- Narração: "Compatível com iPhone e Android no link da sacolinha com frete grátis. Aproveita!"`,
      },
      {
        title: '⚡ Cabo de Carregamento Rápido 100W 3 em 1 com LED Indicador',
        description:
          'Unboxing demonstrando o cabo reforçado carregando simultaneamente iPhone, tablet e celular Android.',
        niche: 'produtos_eletronicos',
        style: 'unboxing_vitrine',
        platform: 'tiktok_shop',
        is_free: false,
        category: 'ecommerce',
        hook: 'O cabo 3 em 1 de 100W que carrega 3 aparelhos juntos e não quebra perto do conector!',
        call_to_action:
          'Malha trançada blindada com conectores Tipo C, Lightning e Micro USB. Link no carrinho!',
        tags: 'cabo 3 em 1 carga rapida 100w, cabo blindado nao quebra, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=3in1+fast+charging+cable+nylon+braided+led&color=orange',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - CARREGANDO TRÊS APARELHOS DE UMA VEZ (HOOK):
- Um único plugue na tomada ligando três pontas: carregando iPhone, celular Android e fone bluetooth ao mesmo tempo.
- Narração: "A guerra por carregador na sala da sua casa acabou com esse cabo aqui!"

🎬 CENA 2 (3-7s) - MALHA DE NYLON BLINDADA:
- Dobrando a ponta do conector com força para os dois lados: a proteção de silicone espesso não racha.
- Narração: "Cem watts de potência turbo, malha militar que aguenta mais de trinta mil dobras e não esquenta."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Dedo indicador apontando com firmeza para o carrinho amarelo no vídeo.
- Narração: "Precinho de fábrica na sacolinha amarela. Pede dois pra não ter briga em casa!"`,
      },
      {
        title: '⚡ Mini Projetor Portátil Smart com Android 11 e Wi-Fi 6',
        description:
          'POV apontando o mini projetor para o teto do quarto e assistindo filme deitado na cama em 130 polegadas.',
        niche: 'produtos_eletronicos',
        style: 'pov',
        platform: 'ambos',
        is_free: false,
        category: 'ecommerce',
        hook: 'POV: O projetor de R$ 190 que transformou o teto do meu quarto numa tela de cinema de 130 polegadas!',
        call_to_action:
          'Foco automático com rotação 180° e apps Netflix e YouTube instalados. Link na sacolinha!',
        tags: 'mini projetor portatil android, cinema no teto quarto, wifi 6, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=mini+smart+projector+bedroom+ceiling+movie&color=white',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O FILME NO TETO DO QUARTO (HOOK):
- POV deitado na cama comendo pipoca enquanto o filme roda com nitidez brilhante no teto do quarto.
- Narração: "Por que comprar TV de cinco mil reais se você pode ter cinema no teto por duzentos reais?"

🎬 CENA 2 (3-7s) - CABEÇA GIRATÓRIA 180 GRAUS:
- Girando a lente do projetor do teto para a parede: o foco e o enquadramento se ajustam sozinhos na hora.
- Narração: "Sistema Android com Netflix e YouTube direto na memória, autofoco e conexão Wi-Fi 6 rápida."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Segura o projetor na palma da mão com dedo na sacolinha amarela.
- Narração: "Envio nacional sem taxa de alfândega no link da sacolinha. Corre antes que acabe!"`,
      },
      {
        title: '⚡ Suporte Articulado de Celular para Mesa e Cama com Mola Forte',
        description:
          'Assistindo vídeo deitado na cama sem precisar segurar o celular pesado que cai no rosto.',
        niche: 'produtos_eletronicos',
        style: 'unboxing_vitrine',
        platform: 'shopee',
        is_free: false,
        category: 'ecommerce',
        hook: 'O suporte de celular que nunca mais vai deixar o aparelho cair na sua cara enquanto você mexe na cama!',
        call_to_action:
          'Braço articulado em aço maciço com trava de rosca de mesa. Link na Shopee!',
        tags: 'suporte celular cama mesa, braco articulado metal, shopee achados eletronicos',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=articulated+phone+holder+bed+desk+lazy+arm&color=black',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O TRAUMA DO CELULAR NA CARA (HOOK):
- Dramatização rápida do celular escapando da mão e o suporte de metal segurando o aparelho na altura perfeita.
- Narração: "Quem nunca levou uma tela de celular na testa deitado no escuro não sabe o que é dor!"

🎬 CENA 2 (3-7s) - ROTAÇÃO 360 GRAUS EM QUALQUER ÂNGULO:
- Movimentando o braço de aço para o lado e girando a cabeça esférica: fica rígido na posição sem ceder.
- Narração: "Molas de tração em aço carbono, rotação completa em trezentos e sessenta graus e trava universal."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Deitado confortável com as mãos livres e dedo na sacolinha da Shopee.
- Narração: "Menos de trinta reais na sacolinha da Shopee com frete grátis. Aproveita!"`,
      },
      {
        title: '⚡ Mini Aspirador de Pó Portátil Sem Fio 2 em 1 com Soprador',
        description:
          'POV sugando farelos do teclado do computador e limpando os trilhos da janela em segundos.',
        niche: 'produtos_eletronicos',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: false,
        category: 'ecommerce',
        hook: 'POV: O mini aspirador de R$ 39 que suga todo o farelo do teclado e ainda sopra a poeira do carro!',
        call_to_action:
          'Sucção turbo de 9000Pa com bico extensor e função soprador. Link no carrinho!',
        tags: 'mini aspirador sem fio, limpa teclado carro, aspirador portatil, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=mini+cordless+vacuum+cleaner+keyboard+car&color=black',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O ANTES E DEPOIS DO TECLADO SUJO (HOOK):
- Passando o mini bico do aspirador nas frestas do teclado: os farelos de biscoito e poeira somem no instante.
- Narração: "Olha a nojeira que tava dentro desse teclado sumindo em menos de três segundos!"

🎬 CENA 2 (3-7s) - FUNÇÃO SOPRADOR NO MOTOR TRASEIRO:
- Virando o aparelho e usando a saída de ar potente para espanar a saída de ar condicionado do carro.
- Narração: "Motor sem escovas com sucção de nove mil pascais e filtro HEPA lavável que não precisa trocar."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Dedo apontando com firmeza para o carrinho amarelo no rodapé do vídeo.
- Narração: "Bateria recarregável via USB-C na sacolinha do vídeo com envio imediato!"`,
      },
      {
        title: '⚡ Carregador Rápido GaN 65W com 3 Portas Simultâneas',
        description:
          'Substituindo 3 carregadores grandes por um único bloco compacto GaN na tomada da parede.',
        niche: 'produtos_eletronicos',
        style: 'unboxing_vitrine',
        platform: 'ambos',
        is_free: false,
        category: 'ecommerce',
        hook: 'O carregador GaN minúsculo que carrega seu notebook, celular e fone ao mesmo tempo na tomada!',
        call_to_action:
          'Tecnologia semicondutora GaN com proteção contra sobrecarga. Link na sacolinha!',
        tags: 'carregador gan 65w, carga rapida notebook celular, compacto, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=gan+charger+65w+compact+wall+plug+laptop&color=white',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O FIM DO TIJOLO DE NOTEBOOK (HOOK):
- Comparando a fonte pesada antiga do notebook com o cubinho compacto de nitreto de gálio na palma da mão.
- Narração: "Chega de carregar aquele tijolo de carregador na mochila pra faculdade ou trabalho!"

🎬 CENA 2 (3-7s) - CARGA ULTRA RÁPIDA EM 3 DISPOSITIVOS:
- Conectando notebook na porta principal e dois celulares nas secundárias: todos carregando em modo turbo.
- Narração: "Tecnologia GaN que não esquenta, sessenta e cinco watts reais e sistema inteligente anti-curto."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Segura na mão com dedo na sacolinha amarela no canto inferior.
- Narração: "O carregador definitivo pra sua viagem tá na sacolinha com frete grátis!"`,
      },
      {
        title: '⚡ Hub Adaptador USB-C 7 em 1 com Saída HDMI 4K e Leitor SD',
        description:
          'POV plugando o hub no notebook e expandindo com monitor externo, pendrive e cartão de memória.',
        niche: 'produtos_eletronicos',
        style: 'pov',
        platform: 'shopee',
        is_free: false,
        category: 'ecommerce',
        hook: 'POV: O acessório que deu todas as entradas do mundo pro meu notebook moderno sem portas!',
        call_to_action:
          'Alumínio de aviação com HDMI 4K a 60Hz e USB 3.0 ultra veloz. Link na Shopee!',
        tags: 'hub usb c 7 em 1, hdmi 4k notebook, adaptador macbook, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=usb+c+hub+multiport+adapter+laptop+hdmi&color=gray',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - A TELA DUPLA EM 4K (HOOK):
- Conectando o plugue USB-C: a segunda tela liga instantaneamente em alta definição no monitor grande.
- Narração: "Notebook moderno é lindo mas vem com duas entradinhas de nada... Olha a solução aqui!"

🎬 CENA 2 (3-7s) - CORPO EM ALUMÍNIO QUE DISSIPA CALOR:
- Mostrando as portas: HDMI quatro K, três USB de alta velocidade, leitor de cartão e entrada de energia.
- Narração: "Construção em alumínio que não superaquece e transfere arquivos pesados em poucos segundos."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Dedo apontando para a sacolinha da Shopee no canto da tela.
- Narração: "Compatível com celular, tablet e computador no link da Shopee com cupom de desconto!"`,
      },
      {
        title: '⚡ Kit Limpeza Eletrônicos 8 em 1 com Caneta para Fone e Spray',
        description:
          'Abrindo o kit compacto e limpando a cera de ouvido incrustada na grade do fone com a ponta de silicone.',
        niche: 'produtos_eletronicos',
        style: 'unboxing_vitrine',
        platform: 'shopee',
        is_free: true,
        category: 'ecommerce',
        hook: 'A caneta de limpeza que tirou toda a sujeira nojenta do meu fone e fez ele voltar a tocar alto!',
        call_to_action:
          'Ponta de silicone macia com escovinha de cerdas densas e spray de tela. Link na Shopee!',
        tags: 'kit limpeza fone eletronicos, limpa fone cera, tela celular, shopee achados',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=earbuds+cleaning+pen+kit+electronic+gadgets&color=white',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O FONE VOLTANDO A TOCAR COMO NOVO (HOOK):
- Passando a ponta de silicone na grade do fone: a sujeira acumulada se solta sem furar a membrana.
- Narração: "Seu fone tá tocando baixo num dos lados? Ele não tá estragado, só tá imundo por dentro!"

🎬 CENA 2 (3-7s) - SPRAY DE TELA E ESCOVA DE TECLADO:
- Borrifando o spray da lateral do estojo e passando a esponja de microfibra: a tela do celular fica sem digitais.
- Narração: "Kit multifunção oito em um com esponjinha pra dentro da caixinha, escovinha e limpador de tela."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Mostrando o estojo compacto do tamanho de um batom com dedo na sacolinha da Shopee.
- Narração: "Menos de doze reais na sacolinha da Shopee com frete grátis. Salva seus aparelhos!"`,
      },

      // ==========================================
      // CAPINHAS & ACESSÓRIOS CELULAR (10 prompts)
      // ==========================================
      {
        title: '📱 Capinha de Silicone Aveludada com Proteção de Lente Deslizante',
        description:
          'POV fechando a tampa deslizante que protege as câmeras contra riscos e poeira no bolso.',
        niche: 'capinhas_acessorios_celular',
        style: 'pov',
        platform: 'ambos',
        is_free: false,
        category: 'ecommerce',
        hook: 'POV: A capinha de R$ 16 que tem tampa deslizante na câmera pra nunca mais riscar a lente!',
        call_to_action:
          'Silicone líquido aveludado por dentro com tampa de câmera trava segura. Link na sacola!',
        tags: 'capinha tampa camera deslizante, silicone aveludado, protege lente, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=phone+case+sliding+camera+cover+lens+protection&color=black',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O CLICK DA TAMPA DA CÂMERA (HOOK):
- POV deslizando a tampinha sobre as lentes do celular: estalo suave e lentes 100% blindadas de arranhões.
- Narração: "Cansado de tirar o celular do bolso e a câmera tá cheia de marcas de dedo e risco de chave?"

🎬 CENA 2 (3-7s) - FORRO INTERNO DE MICROFIBRA:
- Mostrando a parte interna da capinha forrada de veludo macio que não risca a carcaça do aparelho.
- Narração: "Silicone líquido com toque suave que não escorrega da mão e bordas com amortecimento de queda."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Sorriso satisfeito no espelho e dedo apontando para a sacolinha amarela.
- Narração: "Disponível para todos os modelos de iPhone, Samsung e Xiaomi no link da sacolinha!"`,
      },
      {
        title: '📱 Película de Privacidade Cerâmica Inquebrável Sem Bordas',
        description:
          'Olhando o celular de frente com tela nítida e virando de lado: a tela fica 100% preta para fofoqueiros.',
        niche: 'capinhas_acessorios_celular',
        style: 'unboxing_vitrine',
        platform: 'tiktok_shop',
        is_free: false,
        category: 'ecommerce',
        hook: 'O teste do ângulo: a pessoa sentada do seu lado no ônibus não enxerga NADA na sua tela!',
        call_to_action:
          'Cerâmica flexível anti-estilhaço com filtro de privacidade 28 graus. Link no carrinho!',
        tags: 'pelicula privacidade ceramica, anti fuxico onibus, nao quebra borda, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=privacy+screen+protector+phone+angle+test&color=black',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O SUMIÇO DA TELA NA LATERAL (HOOK):
- Celular aceso de frente e inclinando levemente para o lado: a imagem escurece completamente como desligada.
- Narração: "O fim dos fofoqueiros olhando sua conversa do WhatsApp no metrô ou na fila do banco!"

🎬 CENA 2 (3-7s) - TESTE DA CERÂMICA QUE NÃO QUEBRA:
- Dobrando a película antes de aplicar: flexibilidade total que não trinca nos cantos como vidro comum.
- Narração: "Material de cerâmica japonesa que não lasca as bordas no bolso e não perde a sensibilidade do toque."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Dedo indicador apontado para o carrinho amarelo no canto da tela.
- Narração: "Acompanha kit completo de aplicação sem bolhas no carrinho amarelo. Pede a sua!"`,
      },
      {
        title: '📱 Suporte de Celular Magnético para Saída de Ar do Carro',
        description:
          'POV entrando no carro e encostando o celular no suporte magnético sem precisar apertar nenhuma garra.',
        niche: 'capinhas_acessorios_celular',
        style: 'pov',
        platform: 'shopee',
        is_free: false,
        category: 'ecommerce',
        hook: 'POV: O suporte de carro que você encosta o celular e ele fica preso mesmo em rua esburacada!',
        call_to_action:
          '6 ímãs de neodímio com garra de rosca firme na aleta de ar. Link na Shopee!',
        tags: 'suporte celular carro magnetico, saida de ar trava rosca, shopee achados',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=magnetic+car+phone+mount+air+vent+dashboard&color=black',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O ENCAIXE IMEDIATO COM UMA MÃO (HOOK):
- POV aproximando o celular com uma mão só: o aparelho atrai com clique firme e fica na posição horizontal do GPS.
- Narração: "Chega de brigar com aquele suporte de plástico que fica despencando no chão a cada quebra-mola!"

🎬 CENA 2 (3-7s) - TESTE DO IMPACTO NA RUA DE PEDRA:
- Carro passando por ondulações: o suporte se mantém firme na aleta sem tremer nem soltar o celular.
- Narração: "Garra traseira com trava de rosca de metal e seis ímãs blindados que não interferem no sinal do GPS."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Sorriso dirigindo tranquilo com dedo apontado para a sacolinha da Shopee.
- Narração: "Menos de vinte reais na sacolinha da Shopee com cupom de frete grátis. Aproveita!"`,
      },
      {
        title: '📱 Capinha Transparente Anti-Amarelamento com Airbags nos Cantos',
        description:
          'Deixando o celular cair de quina de propósito de 1 metro de altura sem nenhum arranhão.',
        niche: 'capinhas_acessorios_celular',
        style: 'unboxing_vitrine',
        platform: 'tiktok_shop',
        is_free: false,
        category: 'ecommerce',
        hook: 'O teste da queda de quina: a capinha transparente que NÃO amarela e tem bolsas de ar nos cantos!',
        call_to_action:
          'Policarbonato com proteção anti-UV alemã e amortecimento militar. Link no carrinho!',
        tags: 'capinha anti amarelamento, bolsas de ar cantos queda, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=clear+anti+yellowing+phone+case+corner+drop&color=white',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O TESTE DA QUEDA NO PISO (HOOK):
- Soltando o aparelho de quina no chão de piso cerâmico: quica de leve nas bordas acolchoadas intacto.
- Narração: "Coração gelou, né? Mas com essa capinha militar você pode ficar em paz!"

🎬 CENA 2 (3-7s) - CRISTALINA MESMO APÓS 6 MESES:
- Comparando com uma capinha amarela velha: a nova tem pureza de vidro óptico sem amarelar pelo sol.
- Narração: "Tratamento químico anti-amarelamento e bolsas de ar nos quatro cantos que absorvem o choque."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Dedo apontando com firmeza para o carrinho amarelo no vídeo.
- Narração: "Proteja seu celular novo gastando pouco no carrinho amarelo com entrega rápida!"`,
      },
      {
        title: '📱 Alça Cordão Salva-Celular de Pescoço Tiracolo Ajustável',
        description:
          'Modelo usando o celular pendurado a tiracolo como bolsinha estilosa em show ou carnaval.',
        niche: 'capinhas_acessorios_celular',
        style: 'modelo',
        platform: 'ambos',
        is_free: false,
        category: 'ecommerce',
        hook: 'O salva-celular tiracolo que impede roubo de furto na rua e você não esquece na mesa do bar!',
        call_to_action:
          'Cordão náutico com mosquetão metálico e cartão de ancoragem invisível. Link na sacola!',
        tags: 'cordao salva celular pescoco, anti furto carnaval bloco, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=phone+crossbody+lanyard+strap+woman+festival&color=pink',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O CELULAR SEMPRE À MÃO E SEGURO (HOOK):
- Modelo mexendo no celular e soltando: o aparelho fica pendurado seguro no quadril pelo cordão estiloso.
- Narração: "O melhor acessório pra curtir show, viagem e bloquinho de rua sem medo de ser furtado!"

🎬 CENA 2 (3-7s) - INSTALAÇÃO SEM COLAR NADA:
- Encaixando a plaquinha ultrafina dentro da capinha e passando a alça pelo furo do carregador.
- Narração: "Serve em qualquer celular e capinha, não atrapalha o carregador e tem cordão náutico resistente."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Modelo sorri com as mãos livres no bolso e aponta para a sacolinha amarela.
- Narração: "Mais de dez cores lindas na sacolinha do vídeo por menos de quinze reais. Pega o seu!"`,
      },
      {
        title: '📱 Ring Light Portátil de Clipe para Celular Recarregável',
        description:
          'POV ligando o mini ring light no topo do celular em quarto escuro: a selfie fica iluminada e sem sombras.',
        niche: 'capinhas_acessorios_celular',
        style: 'pov',
        platform: 'shopee',
        is_free: true,
        category: 'ecommerce',
        hook: 'POV: O clipe de luz de R$ 12 que faz a câmera frontal do seu celular gravar com qualidade de estúdio!',
        call_to_action: '36 LEDs com 3 níveis de intensidade de luz branca. Link na Shopee!',
        tags: 'ring light clipe celular, iluminacao selfie video, shopee achados',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=clip+on+selfie+ring+light+phone+camera&color=white',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O ANTES E DEPOIS DA LUZ NA SELFIE (HOOK):
- Câmera frontal no escuro com granulação; clica no botão do ring light e o rosto ganha contorno nítido e olhos brilhantes.
- Narração: "Sabe por que os vídeos dos influencers parecem tão mais bonitos que os seus? É isso aqui!"

🎬 CENA 2 (3-7s) - CLIPE UNIVERSAL EMBORRACHADO:
- Encaixando no topo do smartphone: almofadinha de borracha que não arranha a tela nem tampa a câmera.
- Narração: "Três níveis de brilho regulável, bateria recarregável USB e cabe no bolso pra levar em qualquer rolê."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Sorrindo para a câmera com iluminação radiante e dedo na sacolinha da Shopee.
- Narração: "Menos de doze reais na sacolinha da Shopee com cupom de frete grátis. Aproveita!"`,
      },
      {
        title: '📱 Protetor de Lente de Câmera em Vidro Safira com Aro Metálico',
        description:
          'Passando a ponta de uma chave com força sobre a lente protegida sem nenhum risco de arranhão.',
        niche: 'capinhas_acessorios_celular',
        style: 'unboxing_vitrine',
        platform: 'tiktok_shop',
        is_free: false,
        category: 'ecommerce',
        hook: 'O teste da chave na câmera: o protetor de safira que salva a lente de conserto de R$ 800!',
        call_to_action:
          'Vidro temperado 9H com aro de alumínio aeroespacial. Link no carrinho amarelo!',
        tags: 'protetor lente camera aro metalico, vidro temperado 9h, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=camera+lens+protector+sapphire+glass+key+scratch&color=black',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O TESTE DO RISCO DE CHAVE (HOOK):
- Esfregando uma chave de casa com força nas lentes da câmera do celular: o vidro permanece liso e sem risco.
- Narração: "Você tem coragem de fazer isso na câmera do seu celular novo? Eu só fiz porque tá protegido!"

🎬 CENA 2 (3-7s) - ZERO REFLEXO NO FLASH:
- Tirando uma foto com flash: o anel anti-reflexo não cria borrões nem perde a nitidez das fotos noturnas.
- Narração: "Aros individuais de metal que combinam com a cor do aparelho e não afetam em nada a qualidade da foto."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Dedo apontando com firmeza para o carrinho amarelo no vídeo.
- Narração: "Kit com as lentes completas no carrinho amarelo com entrega rápida. Pega o seu!"`,
      },
      {
        title: '📱 Suporte Grip de Dedo Pop Retrátil com Apoio de Mesa',
        description:
          'Segurando o celular grande com apenas um dedo com segurança e apoiando de lado para ver séries.',
        niche: 'capinhas_acessorios_celular',
        style: 'pov',
        platform: 'shopee',
        is_free: false,
        category: 'ecommerce',
        hook: 'POV: O acessório de R$ 8 que não deixa seu dedo mindinho torto de segurar o celular pesado!',
        call_to_action:
          'Adesivo 3M potente com apoio para mesa horizontal e vertical. Link na Shopee!',
        tags: 'pop grip celular dedo mindinho, apoio mesa celular series, shopee achados',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=pop+socket+phone+grip+stand+finger+table&color=pink',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O FIM DO DEDO MINDINHO TORTINHO (HOOK):
- Mostrando a mão apoiando o celular no mindinho com expressão de dor e puxando o pop grip confortável.
- Narração: "Olha o seu dedo mindinho agora: tá torto de aguentar o peso do celular o dia todo, né?"

🎬 CENA 2 (3-7s) - APOIO DE MESA PRA ASSISTIR SÉRIE:
- Puxando o suporte e apoiando o celular na mesa da cozinha na horizontal: fica perfeito sem tombar.
- Narração: "Pegada firme que impede quedas com uma mão só e vira pezinho de mesa pra ver vídeo enquanto come."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Sorriso satisfeito com o celular na mão e dedo na sacolinha da Shopee.
- Narração: "Várias estampas lindas saindo por menos de dez reais na sacolinha da Shopee!"`,
      },
      {
        title: '📱 Capinha Estilo Carteira Magnética Destacável em Couro',
        description:
          'Modelo retirando o porta-cartões magnético da capinha para pagar no caixa por aproximação.',
        niche: 'capinhas_acessorios_celular',
        style: 'modelo',
        platform: 'ambos',
        is_free: false,
        category: 'ecommerce',
        hook: 'A capinha carteira 2 em 1 que você destaca o porta-cartões na hora que quiser sair leve!',
        call_to_action:
          'Couro sintético premium com ímãs fortes e bloqueio RFID. Link na sacolinha!',
        tags: 'capinha carteira magnetica destacavel, porta cartao couro, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=magnetic+wallet+leather+phone+case+cards&color=orange',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O DESTAQUE DO PORTA-CARTÃO (HOOK):
- Puxando a carteirinha da traseira da capinha: ela solta suavemente e reconecta com clique magnético firme.
- Narração: "Quer sair de casa só com celular, CNH e cartão sem precisar levar bolsa volumosa?"

🎬 CENA 2 (3-7s) - COMPATÍVEL COM SUPORTES DE CARRO:
- Encostando o celular na base magnética do carro direto: o imã funciona com a capinha fina de couro.
- Narração: "Acabamento nobre em couro pespontado, proteção interna de veludo e blindagem contra clonagem."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Modelo sorri guardando no bolso com facilidade e aponta para a sacolinha amarela.
- Narração: "A capinha executiva mais completa da internet no link da sacolinha com frete grátis!"`,
      },
      {
        title: '📱 Mini Tripé Flexível Polvo para Celular com Controle Bluetooth',
        description:
          'Enrolando as pernas flexíveis do tripé no galho de uma árvore para gravar vídeo ao ar livre.',
        niche: 'capinhas_acessorios_celular',
        style: 'unboxing_vitrine',
        platform: 'tiktok_shop',
        is_free: true,
        category: 'ecommerce',
        hook: 'O tripé polvo que você enrola no guidão da bike, cerca ou maçaneta e grava vídeos perfeitos!',
        call_to_action:
          'Pernas emborrachadas flexíveis com controle remoto sem fio até 10m. Link no carrinho!',
        tags: 'tripe polvo flexivel celular, controle bluetooth, gravacao externa, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=flexible+octopus+tripod+phone+tree+branch&color=black',
        prompt_text: `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO 100% LIMPO)]
🎬 CENA 1 (0-3s) - O ENVOLVIMENTO DAS PERNAS NO GALHO (HOOK):
- Enrolando as pernas emborrachadas em volta de uma grade: o tripé trava firme em qualquer superfície.
- Narração: "O melhor tripé pra quem grava conteúdo sozinho na rua e não tem quem segure o celular!"

🎬 CENA 2 (3-7s) - DISPARO NO CONTROLE BLUETOOTH:
- Apertando o mini controle sem fio na mão: a gravação inicia a dez metros de distância sem precisar correr.
- Narração: "Pernas de alumínio reforçado com revestimento de borracha anti-escorregão e controle sem fio incluso."

🎬 CENA 3 (7-10s) - CHAMADA AO CARRINHO:
- Dedo apontando com firmeza para o carrinho amarelo no rodapé do vídeo.
- Narração: "Preço imperdível na sacolinha do vídeo com envio imediato. Pede o seu!"`,
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
