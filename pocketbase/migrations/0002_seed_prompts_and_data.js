migrate(
  (app) => {
    // 1. Seed user (idempotent)
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    let adminUserId = ''
    try {
      const existing = app.findAuthRecordByEmail(
        '_pb_users_auth_',
        'juniorrodriguesjr123.jr@gmail.com',
      )
      adminUserId = existing.id
    } catch (_) {
      const record = new Record(users)
      record.setEmail('juniorrodriguesjr123.jr@gmail.com')
      record.setPassword('Skip@Pass')
      record.setVerified(true)
      record.set('name', 'Junior Rodrigues')
      app.save(record)
      adminUserId = record.id
    }

    // 2. Assinatura ativa mensal demonstrativa para o usuário inicial (se não tiver)
    const subsCol = app.findCollectionByNameOrId('subscriptions')
    const existingSubs = app.findRecordsByFilter(
      'subscriptions',
      `user = '${adminUserId}'`,
      '-created',
      1,
      0,
    )
    if (existingSubs.length === 0) {
      const subRecord = new Record(subsCol)
      subRecord.set('user', adminUserId)
      subRecord.set('plan', 'monthly')
      subRecord.set('status', 'active')
      subRecord.set('start_date', '2025-01-01 00:00:00.000Z')
      subRecord.set('end_date', '2026-12-31 23:59:59.000Z')
      subRecord.set('card_last4', '4242')
      subRecord.set('card_brand', 'Mastercard')
      app.save(subRecord)
    }

    // 3. Seed curated prompts para biblioteca
    const promptsCol = app.findCollectionByNameOrId('prompts')
    const count = app.countRecords('prompts')
    if (count > 0) {
      return // Já populado
    }

    const samplePrompts = [
      {
        title: 'Vestido Midi Canelado Elegante - Estilo POV Espelho',
        description:
          'Vídeo dinâmico em 1ª pessoa se arrumando para um date/jantar com corte rápido e link do carrinho da vitrine.',
        niche: 'moda_feminina',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: true,
        hook: 'POV: Você finalmente achou o vestido que disfarça qualquer insegurança e parece de loja de R$ 500!',
        call_to_action:
          'O tecido é duplo e não marca nada! Deixei no carrinho amarelo aqui embaixo antes que esgote o tamanho.',
        tags: 'vestido midi, date night, elegância, looks elegantes, tiktok shop',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP / SHOPEE - 15 a 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - O GANCHO VISUAL (HOOK):
- Câmera em primeira pessoa (POV): Você segurando o celular em frente ao espelho com uma roupa básica sem graça, cara pensativa.
- Áudio / Narração: "POV: você tinha 10 minutos pra se arrumar pro date e lembrou do vestido que acabou de chegar da Shopee..."
- Texto na tela: "Aquele vestido que veste igual luva 👗✨"

🎬 CENA 2 (3-9s) - TRANSIÇÃO & DETALHES DE TECIDO:
- Transição com tapa na lente ou giro de câmera: agora você usando o VESTIDO MIDI CANELADO.
- Movimento em câmera lenta dando 1 giro sutil mostrando a cintura modelada e o caimento das costas.
- Close no tecido com a mão esticando: demonstrar elasticidade e que o forro não fica transparente.
- Narração: "Gente, ele tem tecido canelado grosso, não marca NADA na barriga e esse decote quadrado valoriza o colo de um jeito absurdo!"

🎬 CENA 3 (9-14s) - PROVA DE BENEFÍCIO:
- Passando batom, calçando um salto nude e colocando um relógio dourado.
- Narração: "Parece roupa de grife de shopping que custa 400 reais, mas paguei preço de atacado."

🎬 CENA 4 (14-18s) - CALL TO ACTION (CTA):
- Apontando o dedo para o canto inferior esquerdo da tela.
- Narração: "Ele tá no link do carrinho amarelo com frete grátis e cupom de primeira compra! Corre porque essa cor esgota rápido!"
- Texto na tela: "Clica no carrinho amarelo aqui embaixo 🛒👇"`,
      },
      {
        title: 'Camiseta Streetwear Oversized Pesada - Modelo Urbano',
        description:
          'Vídeo com modelo caminhando na rua, mostrando a gola canelada grossa e caimento dropped shoulders.',
        niche: 'streetwear_casual',
        style: 'modelo',
        platform: 'ambos',
        is_free: true,
        hook: 'Pare de comprar camiseta fina que vira pano de chão na primeira lavagem!',
        call_to_action: 'Gola de 3cm que não laceia e algodão 260g. Link na sacolinha!',
        tags: 'oversized, streetwear, gola grossa, camiseta masculina, moda urbana',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP / SHOPEE - 20 SEGUNDOS]

🎬 CENA 1 (0-3s) - GANCHO DE DOR (HOOK):
- Modelo segurando uma camiseta comum toda amassada e com gola esgarçada, com cara de desaprovação.
- Narração enérgica: "Se você ainda compra camiseta fina que perde o formato em duas semanas, você tá jogando dinheiro fora!"
- Texto na tela: "A MELHOR OVERSIZED DA SHOPEE? 👀🔥"

🎬 CENA 2 (3-8s) - A APRESENTAÇÃO DO PRODUTO (REVEAL):
- Corte rápido para o modelo vestindo a Camiseta Oversized cor Chumbo / Off-White.
- Modelo parado em postura confiante, caminhada em câmera lenta num fundo urbano de concreto.
- Close na gola canelada grossa de ribana (esticando com a mão para mostrar resistência).
- Narração: "Essa é a famosa malha pesada fio 26.1 de 220g. A gola de 3 centímetros fica armada o dia inteiro sem lacear."

🎬 CENA 3 (8-14s) - VERSATILIDADE & CAIMENTO:
- Transição com 3 cortes rápidos mostrando combinações: 1) com calça cargo e tênis retrô; 2) com bermuda jeans; 3) com corrente e boné.
- Narração: "O corte com ombro caído dá presença sem parecer que você pegou a roupa do seu irmão mais velho."

🎬 CENA 4 (14-20s) - CTA DIRETO DE CONVERSÃO:
- Modelo apontando para a sacolinha/carrinho com sorriso e polegar positivo.
- Narração: "Tem da P até a GG em 8 cores diferentes. Tá com cupom ativo hoje no carrinho, clica antes que acabe o estoque!"
- Texto na tela: "Garanta a sua na sacolinha 📦🏷️"`,
      },
      {
        title: 'Conjunto Fitness Sem Costura (Zero Transparência) - Modelo Fazendo Agachamento',
        description:
          'Teste definitivo de agachamento profundo para provar zero transparência e cintura que não enrola.',
        niche: 'fitness_academia',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: true,
        hook: 'O teste que toda mulher faz antes de comprar legging na internet: O AGACHAMENTO!',
        call_to_action:
          'Cintura alta compressora que não escorrega. O link tá na vitrine aqui embaixo!',
        tags: 'conjunto fitness, legging sem costura, squat proof, academia, gymtok',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP / SHOPEE - 18 SEGUNDOS]

🎬 CENA 1 (0-3s) - O TESTE INFALÍVEL (HOOK):
- Modelo de costas para a câmera na academia ou estúdio bem iluminado.
- Texto grande na tela: "TESTE DO AGACHAMENTO: É TRANSPARENTE? 🍑👀"
- Narração: "Pedi o conjunto fitness mais viral do TikTok Shop e vamos fazer o teste mais temido de todos ao vivo!"

🎬 CENA 2 (3-9s) - PROVA REAL:
- Modelo executa um agachamento profundo até o chão, com luz direta.
- Zoom suave no tecido: ZERO transparência, sem marcar calcinha.
- Modelo sorri aliviada e mostra o cós duplo de compressão.
- Narração: "Meninas, passou no teste com louvor! Zero transparência mesmo no agachamento mais fundo, e olha como a cintura alta aperta a barriguinha sem enrolar."

🎬 CENA 3 (9-14s) - TOP & SUPORTE:
- Modelo dá 2 pulinhos rápidos mostrando a sustentação do top com bojo removível e costas cruzadas.
- Narração: "O top segura tudo sem machucar o ombro. O tecido canelado sem costura absorve o suor e não esquenta."

🎬 CENA 4 (14-18s) - CTA:
- Apontando para o botão da vitrine:
- Narração: "Pelo valor de uma peça de shopping você leva o conjunto completo. Clica no carrinho amarelo aqui embaixo pra garantir a sua cor favorita!"`,
      },
      {
        title: 'Biquíni Cortininha com Tecido Texturizado - POV Férias na Praia / Piscina',
        description:
          'Roteiro sensorial com áudio relaxante e takes de sol refletindo o tecido texturizado cintilante.',
        niche: 'moda_praia',
        style: 'pov',
        platform: 'shopee',
        is_free: false,
        hook: 'POV: O biquíni que você comprou despretensiosa na Shopee virou a peça mais elogiada da viagem!',
        call_to_action:
          'Marquinha perfeita com bojo removível. Link tá na sacola com envio imediato!',
        tags: 'biquíni, moda praia, verão, shopee achadinhos, marquinha',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP / SHOPEE - 16 SEGUNDOS]

🎬 CENA 1 (0-3s) - ESTÉTICA VERÃO (HOOK):
- POV: Câmera olhando pra baixo em direção aos pés na areia ou borda da piscina, água cristalina ao fundo.
- Áudio em alta / música de verão com batida gostosa.
- Narração: "POV: Você só queria um biquíni básico e comprou o que todo mundo na praia perguntou de onde era..."
- Texto na tela: "Aquele achadinho de R$ 39 que parece de R$ 200 ☀️👙"

🎬 CENA 2 (3-8s) - TEXTURA & AJUSTE:
- Transição suave: imagem em frente ao espelho de sol mostrando o biquíni cortininha no corpo.
- Detalhe das amarrações com ponteiras douradas que não oxidam.
- Close na textura atoalhada/canelada sob a luz natural do sol.
- Narração: "O tecido é duplo, não fica transparente quando molha e as alças são compridas pra fazer mil amarrações diferentes."

🎬 CENA 3 (8-12s) - CAIMENTO PERFEITO:
- Take de costas mostrando a marquinha semi-fio confortável.
- Narração: "A calcinha é anatômica, empina o bumbum sem ficar apertando a lateral."

🎬 CENA 4 (12-16s) - CTA:
- Mostrando a embalagem fofa que chegou e apontando pro link:
- Narração: "O vendedor enviou em menos de 24 horas! Clica aqui no link da Shopee pra garantir o seu antes do final de semana!"`,
      },
      {
        title: "Calça Alfaiataria Feminina Wide Leg - Modelo 'Do Trabalho ao Happy Hour'",
        description:
          'Vídeo de styling mostrando como transformar o mesmo look de escritório em saída casual chique.',
        niche: 'moda_feminina',
        style: 'modelo',
        platform: 'ambos',
        is_free: false,
        hook: '3 jeitos de usar a calça de alfaiataria que alonga 10cm da sua perna!',
        call_to_action: 'Tem elástico embutido atrás pra não sobrar na cintura. Clica no link!',
        tags: 'alfaiataria, wide leg, look trabalho, moda executiva, shopee',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP / SHOPEE - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - PROMESSA DE VALOR (HOOK):
- Modelo alta e confiante caminhando em direção à câmera vestindo a calça Wide Leg Alfaiataria.
- Texto na tela: "COMO PARECER 10CM MAIS ALTA E RICA 💼👠"
- Narração: "A calça de alfaiataria perfeita existe e eu posso provar em 20 segundos!"

🎬 CENA 2 (3-9s) - LOOK 1: TRABALHO FORMAL:
- Modelo com camisa social branca por dentro da calça e scarpin.
- Close no caimento das pregas frontais e no bolso faca.
- Narração: "Look 1: Reunião de trabalho impecável. O tecido não amarrota fácil e tem um caimento fluido pesado."

🎬 CENA 3 (9-15s) - LOOK 2: CASUAL CHIQUE:
- Transição com estalar de dedos: Modelo com cropped preto, jaqueta jeans aberta e tênis branco.
- Close na cintura mostrando o elástico traseiro inteligente:
- Narração: "Look 2: Fim de tarde despojado. E o segredo tá aqui: elástico discreto atrás pra não ficar aquele vão na lombar!"

🎬 CENA 4 (15-22s) - CTA:
- Modelo girando com a bolsa e apontando para a sacolinha:
- Narração: "Eu tenho 1,65m e o comprimento ficou perfeito sem precisar fazer barra. Clica na sacolinha aqui do vídeo, tá no precinho de lançamento!"`,
      },
      {
        title: "Camisa Linho Masculina Manga Longa - POV 'Arrumando as Malas pra Praia'",
        description:
          'Vídeo dinâmico de mala com dobradura rápida e o resultado vestido no corpo à beira-mar.',
        niche: 'moda_masculina',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'POV: O homem que descobriu que camisa de linho atrai 10x mais elogios que regata!',
        call_to_action: 'Fresca, elegante e veste qualquer ocasião. Compre direto na vitrine!',
        tags: 'camisa linho, moda masculina, estilo praia, old money, tiktok shop',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP / SHOPEE - 18 SEGUNDOS]

🎬 CENA 1 (0-3s) - HOOK CÔMICO/REALISTA:
- POV: Câmera vendo várias regatas velhas na cama sendo empurradas de lado com a mão.
- Narração: "POV: Você aposentou as camisetas genéricas e adotou o estilo que toda mulher repara..."
- Texto na tela: "A camisa masculina mais elogiada do TikTok 🌊👕"

🎬 CENA 2 (3-8s) - A PEÇA:
- Segurando a Camisa de Linho Misto na cor Areia / Azul Claro contra a luz natural da janela.
- Narração: "Essa camisa de linho com algodão é leve, respirável e não esquenta nem no sol do meio-dia."

🎬 CENA 3 (8-13s) - NO CORPO (RESULTADO):
- Corte para espelho com a camisa semiaberta com regata branca por baixo, manga dobrada até o antebraço e bermuda de alfaiataria.
- Narração: "O caimento slim confortável deixa os ombros largos e o punho dobrado dá aquele ar despretensioso elegante."

🎬 CENA 4 (13-18s) - CTA:
- Apontando para o carrinho amarelo:
- Narração: "Não precisa pagar 300 reais em shopping. Tem cupom rolando agora no carrinho do TikTok Shop com devolução grátis se não gostar. Clica aqui!"`,
      },
      {
        title: 'Tênis Chunky Retrô Urbano - Unboxing Vitrine + No Pé',
        description:
          'Abertura da caixa, cheiro de novo, palmilha macia apertada com os dedos e caminhada estilosa.',
        niche: 'acessorios_calcados',
        style: 'unboxing_vitrine',
        platform: 'shopee',
        is_free: false,
        hook: 'Comprei o tênis mais hypado do Pinterest por 1/3 do valor da marca famosa!',
        call_to_action: 'Solado de 4cm macio que não cansa o pé. Link seguro na sacolinha!',
        tags: 'tênis retrô, unboxing, achadinho shopee, calçados, chunky sneakers',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP / SHOPEE - 20 SEGUNDOS]

🎬 CENA 1 (0-3s) - UNBOXING SATISFATÓRIO (HOOK):
- Corte do plástico bolha e abertura rápida da caixa com som ASMR.
- Texto na tela: "SERÁ QUE VALE A PENA ESSE TÊNIS DA SHOPEE? 👟📦"
- Narração: "Chegou o tênis estilo retrô que eu namorei no Pinterest por meses e custava 700 reais lá fora..."

🎬 CENA 2 (3-8s) - ACABAMENTO & DETALHES:
- Câmera na mão girando o tênis: mostrando costura dupla reforçada, camurça sintética e cadarço bicolor.
- Dedo pressionando a palmilha de EVA macia para mostrar o conforto.
- Narração: "Olha o acabamento das costuras, sem nenhuma marca de cola aparente. A palmilha é super macia e anatômica."

🎬 CENA 3 (8-14s) - PROVA NO PÉ:
- Corte de salto: calçando o tênis com meia cano médio branca e calça jeans cargo.
- Dando passos, pequenos saltos e giro de 360 graus.
- Narração: "Ele adiciona uns 4cm de altura de forma super discreta e é leve feito uma pluma pra andar o dia todo."

🎬 CENA 4 (14-20s) - CTA:
- Segurando o tênis ao lado da caixa com o selo de envio rápido:
- Narração: "Vem com cupom de frete grátis na Shopee hoje. Recomendo pegar o seu número exato porque a forma é padrão! Clica no link e aproveita!"`,
      },
      {
        title: "Vestido Romântico Floral com Amarração - Modelo Estilo 'Cottagecore'",
        description:
          'Vídeo delicado em parque ou luz dourada de fim de tarde, mostrando o rodado da saia e mangas bufantes.',
        niche: 'moda_feminina',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'O vestido que faz você se sentir a protagonista de um filme romântico!',
        call_to_action: 'Estampa exclusiva que não desbota na lavagem. Disponível no carrinho!',
        tags: 'vestido floral, cottagecore, romântico, vestido rodado, tiktok shop',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP / SHOPEE - 17 SEGUNDOS]

🎬 CENA 1 (0-3s) - ESTÉTICA ENCANTADORA (HOOK):
- Modelo girando em câmera lenta sob a luz dourada do sol, a saia do vestido floral abrindo como leque.
- Música suave/sonhadora.
- Texto na tela: "O vestido de protagonista existe 🌸✨"
- Narração: "Se você ama estilo romântico delicado, acabou de achar seu novo vestido favorito da vida!"

🎬 CENA 2 (3-8s) - DETALHES DE MODELAGEM:
- Close nas costas: amarração ajustável estilo espartilho que modela qualquer corpo.
- Manga com elástico que pode ser usada princesa ou ombro a ombro.
- Narração: "As costas têm amarração que você aperta exatamente no seu corpo, e a manga dá pra usar tanto bufante quanto ciganinha."

🎬 CENA 3 (8-13s) - CAIMENTO & FORRO:
- Modelo caminhando e dando risada natural, passando a mão na saia.
- Narração: "Vem com forro por baixo pra não ter transparência e o tecido não pinica na pele."

🎬 CENA 4 (13-17s) - CTA:
- Apontando delicadamente para o carrinho amarelo:
- Narração: "Veste do 36 ao 44 com perfeição. Garanta o seu no carrinho amarelo antes da próxima reposição!"`,
      },
      {
        title: "Conjunto Moletom Flanelado Premium - POV 'Dia de Preguiça com Estilo'",
        description:
          'Aconchego máximo em dias frios, capuz estruturado e bolso canguru para conforto extremo.',
        niche: 'streetwear_casual',
        style: 'pov',
        platform: 'ambos',
        is_free: false,
        hook: 'POV: O único conjunto de moletom que te deixa arrumada até pra ir na padaria no domingo!',
        call_to_action:
          'Moletom 3 cabos 100% flanelado por dentro. Link na sacolinha com desconto!',
        tags: 'moletom, conjunto inverno, loungewear, conforto, shopee',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP / SHOPEE - 18 SEGUNDOS]

🎬 CENA 1 (0-3s) - GANCHO SENSORIAL (HOOK):
- POV: Câmera mostrando a xícara de café quente na mão enquanto você desce a escada ou caminha na sala de moletom.
- Texto na tela: "Moletom quente de verdade sem parecer pijama desleixado ☕🍂"
- Narração: "POV: você finalmente achou um conjunto quentinho que é tão estiloso que dá pra sair sem passar vergonha..."

🎬 CENA 2 (3-8s) - TESTE DO FORRO FLANELADO:
- Close abrindo o zíper ou virando a manga mostrando a pelúcia grossa e macia por dentro.
- Narração: "Olha a grossura dessa flanela por dentro! É moletom 3 cabos pesado, esquenta de verdade e não solta pelinhos na pele."

🎬 CENA 3 (8-13s) - CAPUZ & MODELAGEM:
- Colocando o capuz na cabeça (mostrando que ele fica armado e volumoso, não caído fino).
- A calça jogger tem punho largo que não aperta a canela.
- Narração: "O capuz fica estruturado e a calça tem caimento jogger sem ficar saco de batata."

🎬 CENA 4 (13-18s) - CTA:
- Mostrando as cores disponíveis no celular e apontando pro link:
- Narração: "Tem em 6 tons neutros chiques. Tá com frete grátis na sacolinha agora, clica e garante o seu!"`,
      },
      {
        title: 'Pijama Americano Cetim com Friso - Vitrine Elegância Noturna',
        description:
          'Estilo blogueira rica, botões perolados, cetim toque de seda e bolso no peito.',
        niche: 'lingerie_pijamas',
        style: 'unboxing_vitrine',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'Se arrumar para dormir bem é o maior ato de amor próprio!',
        call_to_action: 'Cetim com elastano que não esquenta. Link no carrinho amarelo!',
        tags: 'pijama americano, cetim, loungewear, autocuidado, tiktok shop',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP / SHOPEE - 18 SEGUNDOS]

🎬 CENA 1 (0-3s) - GANCHO AUTOCUIDADO (HOOK):
- Luz suave de abajur, borrifando água de lençol na cama e segurando o pijama de cetim com brilho sofisticado.
- Texto na tela: "Durma como uma milionária gastando R$ 45 🌙✨"
- Narração: "Depois que eu troquei a camiseta de propaganda velha por esse pijama americano de cetim, minha rotina noturna virou outra!"

🎬 CENA 2 (3-8s) - TOQUE DO TECIDO & BOTÕES:
- Mão deslizando suavemente sobre o tecido fluido e brilhoso.
- Close na gola com friso contrastante e botões perolados resistentes.
- Narração: "Ele tem toque de seda com elastano, então não prende os movimentos quando você vira na cama e não amassa fácil."

🎬 CENA 3 (8-13s) - NO CORPO:
- Diante da penteadeira fazendo skincare, o pijama cai soltinho e elegante no corpo.
- Narração: "O shorts tem elástico macio que não machuca a cintura. Fica lindo nas fotos de bom dia!"

🎬 CENA 4 (13-18s) - CTA:
- Apontando para o carrinho amarelo:
- Narração: "Presente perfeito pra você mesma ou pra amiga! Tem várias cores lindas, corre no carrinho amarelo antes que acabe o cupom!"`,
      },
      {
        title: 'Bolsa Baguete Minimalista Alça Dupla - Modelo Look Dia a Dia',
        description:
          'Teste do que cabe na bolsa: celular grande, carteira, gloss, chaves e óculos de sol sem deformar.',
        niche: 'acessorios_calcados',
        style: 'modelo',
        platform: 'ambos',
        is_free: false,
        hook: 'O que cabe na bolsa de R$ 35 mais vendida da Shopee?',
        call_to_action:
          'Ferragens douradas que não escurecem e alça tiracolo extra. Link na sacola!',
        tags: 'bolsa baguete, o que cabe na bolsa, acessórios, shopee achados',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP / SHOPEE - 19 SEGUNDOS]

🎬 CENA 1 (0-3s) - TESTE 'O QUE CABE' (HOOK):
- Bolsa em cima da mesa fechada com design clean minimalista.
- Texto na tela: "O QUE CABE NESSA BOLSA DE R$ 35? 👜👀"
- Narração: "Será que cabe a vida toda dentro da bolsa baguete mais viral da Shopee? Vamos testar agora!"

🎬 CENA 2 (3-9s) - COLOCANDO OS ITENS:
- Em cortes rápidos com áudio satisfatório de zíper:
- Entram: iPhone Pro Max, carteira pequena, óculos de sol com case, gloss labial, carregador portátil e chaveiro.
- Fecha o zíper macio de primeira sem forçar.
- Narração: "Coube celular grande, carteira, maquiagem e até powerbank sem ficar estufada ou deformada!"

🎬 CENA 3 (9-14s) - DESIGN & FERRAGENS:
- Modelo colocando a bolsa no ombro, depois trocando para a alça longa transversal.
- Close no couro sintético encorpado e fecho dourado brilhoso.
- Narração: "O material é PU resistente a arranhões, tem forro reforçado por dentro e vem com duas alças inclusas."

🎬 CENA 4 (14-19s) - CTA:
- Modelo caminhando com a bolsa e sorrindo:
- Narração: "Combina com qualquer look de trabalho ou balada. Clica no link da sacolinha porque esse preço é promocional!"`,
      },
      {
        title: 'Conjunto Infantil Kids Roupa Conforto - Modelo Criança Brincando',
        description:
          'Algodão antialérgico, cores divertidas e liberdade de movimento para mães e pais no TikTok Shop.',
        niche: 'infantil_kids',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'Mães, parem de gastar R$ 150 em roupa de criança que encolhe na máquina!',
        call_to_action: 'Algodão puro macio que não desbota. Link no carrinho com kit econômico!',
        tags: 'roupa infantil, moda kids, dia das crianças, tiktok shop mães',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP / SHOPEE - 18 SEGUNDOS]

🎬 CENA 1 (0-3s) - GANCHO PARA MÃES/PAIS (HOOK):
- Criança pulando no sofá ou correndo no tapete toda sorridente com o conjunto fofo e colorido.
- Texto na tela: "ROUPA INFANTIL BOA E BARATA NA SHOPEE? 🧸👶"
- Narração: "Mãe, se você não aguenta mais pagar caro em roupa infantil que fica curta ou solta tinta na primeira lavagem, olha esse achado!"

🎬 CENA 2 (3-8s) - TECIDO & TOQUE:
- Mão da mãe esticando a gola elástica fácil de vestir e mostrando a costura suave sem etiquetas que pinicam o pescoço.
- Narração: "É 100% algodão suedine macio, não tem etiqueta arranhando o pescoço da criança e a gola passa na cabeça sem aperto."

🎬 CENA 3 (8-13s) - TESTE DE RESISTÊNCIA:
- Criança agachando, brincando com brinquedos e rastejando no chão com conforto.
- Narração: "A bermudinha tem cós de elástico largo que não aperta a barriguinha. Já lavei 4 vezes e não fez bolinha nem encolheu."

🎬 CENA 4 (13-18s) - CTA:
- Mostrando a sacola com 3 conjuntos do kit e apontando pro carrinho amarelo:
- Narração: "Tem kits de 3 conjuntos que saem por preço de banana no carrinho do TikTok Shop. Clica aqui embaixo antes que acabe a numeração do seu pequeno!"`,
      },
    ]

    for (let i = 0; i < samplePrompts.length; i++) {
      const p = samplePrompts[i]
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
      rec.set('prompt_text', p.prompt_text)
      app.save(rec)
    }
  },
  (app) => {
    // rollback opcional
  },
)
