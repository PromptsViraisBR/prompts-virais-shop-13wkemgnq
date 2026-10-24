/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const promptsCol = app.findCollectionByNameOrId('prompts')

    const proPromptsPart8 = [
      // 81. Moda Feminina - PRO
      {
        title:
          'Vestido Midi Tubinho em Bengaline com Fenda e Bojo Estruturado - Modelo Evento Corporativo',
        description:
          'Modelo caminhando em auditório com vestido midi bengaline encorpado, fenda elegante e bojo que modela o decote com sobriedade.',
        niche: 'moda_feminina',
        style: 'modelo',
        platform: 'shopee',
        is_free: false,
        hook: 'O vestido tubinho em bengaline que modela como cinta e não marca nadinha!',
        call_to_action:
          'Tecido bengaline encorpado com alta compressão e elastano. Link seguro na sacolinha!',
        tags: 'vestido bengaline, tubinho midi, executiva elegante, shopee achados',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=midi+sheath+dress+bengaline+woman+elegant+corporate&color=black',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - O PODER DA ALTA COMPRESSÃO DO BENGALINE (HOOK):
- Passada firme da modelo com o vestido tubinho midi preto/azul marinho, postura ereta e curvas perfeitamente delineadas.
- Texto na tela: "MODELA COMO CINTA SEM APERTAR ⏳👗"
- Narração de impacto: "Se você precisa de um vestido formal que modele sua cintura e te deixe impecável para formaturas, cultos ou reuniões, olha essa peça!"

🎬 CENA 2 (3-9s) - O TOQUE DO BENGALINE PESADO:
- Mão puxando a lateral do vestido: compressão firme que volta no lugar e não evidencia marcas de celulite ou roupas íntimas.
- Narração: "O bengaline de alta gramatura tem efeito modelador instantâneo: ele segura o abdômen e não marca calcinha."

🎬 CENA 3 (9-14s) - BOJO ESTRUTURADO COM COBERTURA TOTAL:
- Mostrando a sustentação no decote com bojo moldado que dispensa sutiã com segurança.
- Narração: "O busto já vem com bojo anatômico reforçado e o zíper traseiro de metal desliza suavemente."

🎬 CENA 4 (14-18s) - A FENDA TRASEIRA QUE DÁ MOBILIDADE:
- Caminhando e subindo degraus sem a barra travar o passo.
- Narração: "A fenda traseira dá conforto para caminhar sem perder a postura executiva."

🎬 CENA 5 (18-22s) - CTA:
- Modelo apontando para a sacolinha da Shopee:
- Narração: "Grade de tamanhos do P ao GG na sacolinha oficial aqui da Shopee com frete grátis hoje. Garanta o seu!"`,
      },
      // 82. Moda Feminina - PRO
      {
        title: 'Chemise Vestido em Viscolinho com Bolsos e Cinto Faixa - POV Passeio Fim de Tarde',
        description:
          'POV descendo do carro para almoço no jardim com vestido chemise de botões, bolsos frontais utilitários e tecido respirável.',
        niche: 'moda_feminina',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'POV: O vestido chemise que te deixa com cara de rica sem nenhum esforço!',
        call_to_action:
          'Viscolinho pré-encolhido que não amassa fácil com cinto faixa incluso. Link no carrinho amarelo!',
        tags: 'vestido chemise, viscolinho, estilo resort, casual chic, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=linen+shirt+dress+belt+woman+garden+casual&color=white',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - O CHARME DESPRETENSIOSO DA CHEMISE (HOOK):
- POV em frente ao espelho com iluminação suave de fim de tarde amarrando o cinto de viscolinho na cintura.
- Texto na tela: "ELEGÂNCIA FÁCIL POR R$ 54 🌿☕"
- Narração agradável: "POV: O dia em que você vestiu uma peça única de viscolinho e recebeu elogios até de quem você nem conhecia!"

🎬 CENA 2 (3-8s) - A TEXTURA DO VISCOLINHO COM TOQUE MACIO:
- Mão alisando o tecido encorpado cor areia com botões de madeira ecológicos.
- Narração: "O viscolinho une a nobreza visual do linho com o caimento suave da viscose: não pinica na pele e não arma no corpo."

🎬 CENA 3 (8-13s) - OS BOLSOS FUNCIONAIS E GOLA CLÁSSICA:
- Mão entrando nos bolsos laterais fundos:
- Narração: "Tem bolsos reais para colocar a mão com estilo e a gola camisa dá aquele ar alinhado imediato."

🎬 CENA 4 (13-17s) - CINTO FAIXA COM AMARRAÇÃO DUPLA:
- Mostrando como dá pra usar bem acinturado ou mais soltinho como saída de praia chique.
- Narração: "Dá pra usar com cinto marcando a cintura ou solto estilo maxi camisa despojada."

🎬 CENA 5 (17-22s) - CTA:
- Apontando pro carrinho amarelo:
- Narração: "Tons terrosos e clássicos no carrinho amarelo do TikTok Shop com envio expresso. Aproveite agora!"`,
      },
      // 83. Moda Masculina - PRO
      {
        title: 'Calça Jeans Masculina Selvedge Reta Clássica 13oz - Modelo Estúdio Vintage',
        description:
          'Modelo masculino com calça jeans selvedge pura com barra virada revelando a fita de ourela vermelha e lavagem raw sem desbotamento.',
        niche: 'moda_masculina',
        style: 'modelo',
        platform: 'shopee',
        is_free: false,
        hook: 'O verdadeiro jeans selvedge de 13oz que os amantes de denim pagam R$ 600 por R$ 98!',
        call_to_action:
          'Jeans raw selvedge com borda de ourela e rebites de cobre. Link seguro na sacolinha!',
        tags: 'jeans selvedge, raw denim 13oz, moda masculina vintage, shopee achados',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=selvedge+denim+jeans+man+boots+vintage+studio&color=blue',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 23 SEGUNDOS]

🎬 CENA 1 (0-3s) - O GANCHO DO DENIM RAIZ (HOOK):
- Modelo com bota de couro marrom vira a barra da calça jeans crua revelando a clássica listra vermelha da costura selvedge original.
- Texto na tela: "JEANS SELVEDGE POR MENOS DE R$ 100? 👖🔨"
- Narração com autoridade: "Se você é daqueles homens que valorizam qualidade bruta e odeiam jeans mole com cara de plástico, você precisa conhecer o selvedge!"

🎬 CENA 2 (3-9s) - A DENSIDADE DO JEANS 13OZ:
- Batendo na coxa mostrando o som pesado do tecido estruturado: algodão de fibra longa sem elastano que ganha a sua marca de uso com o tempo.
- Narração: "13 onças de algodão puro sem elastano: um jeans estruturado que molda no seu corpo com o uso e dura mais de 10 anos fácil."

🎬 CENA 3 (9-14s) - REBITES DE COBRE E BOTÕES DE FERRO MACIÇO:
- Close nos rebites e botões oxidados com gravação clássica e costura com linha amarela ocre grossa.
- Narração: "Rebites de cobre maciço reforçados e botão de ferro clássico que nunca quebra."

🎬 CENA 4 (14-18s) - O CORTE RETO ATEMPORAL:
- Modelo caminhando mostrando o caimento perfeito que cobre o cano da bota ou tênis sem afunilar.
- Narração: "Corte reto autêntico que nunca sai de moda e valoriza a postura masculina."

🎬 CENA 5 (18-23s) - CTA:
- Apontando para a sacolinha da Shopee:
- Narração: "Edição especial com tiragem limitada na sacolinha oficial aqui da Shopee com frete grátis nacional. Garanta seu tamanho!"`,
      },
      // 84. Fitness & Academia - PRO
      {
        title: 'Top Fitness com Fecho em Zíper Frontal Reforçado - POV Corrida / Treino de Impacto',
        description:
          'POV se preparando para correr no parque, fechando o zíper frontal do top com trava de segurança para segurar o busto em corrida de alto impacto.',
        niche: 'fitness_academia',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'POV: O top com zíper frontal que não te deixa sofrer na hora de tirar depois de suar no treino!',
        call_to_action:
          'Zíper com trava anti-abertura e forro interno protetor. Link no carrinho amarelo!',
        tags: 'top ziper frontal, corrida alto impacto, facil de tirar, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=front+zip+sports+bra+woman+running+park&color=black',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - O ALÍVIO DE TIRAR O TOP SEM SOFRER (HOOK):
- POV em frente ao espelho puxando o zíper frontal para baixo em 1 segundo com sorriso de alívio.
- Texto na tela: "CHEGA DE SOFRER PRA TIRAR O TOP! 🏃‍♀️⚡"
- Narração bem-humorada: "POV: O dia em que você aposentou aqueles tops que quase deslocam seu ombro quando você tenta tirar o tecido molhado de suor após o treino!"

🎬 CENA 2 (3-8s) - A TRAVA AUTOMÁTICA DO ZÍPER FRONTAL:
- Fechando o zíper e abaixando o puxador: o cursor trava e não abre sozinho mesmo puxando com as mãos.
- Narração: "O zíper tem trava mecânica inteligente: você abaixa o puxador e ele não abre de jeito nenhum durante o exercício."

🎬 CENA 3 (8-13s) - PROTEÇÃO INTERNA QUE NÃO BELISCA:
- Mostrando a carcela de tecido almofadado por trás dos dentes do zíper: zero contato do metal com a pele.
- Narração: "Por dentro tem uma aba protetora acolchoada que impede o zíper de beliscar a pele ou causar atrito."

🎬 CENA 4 (13-17s) - SUSTENTAÇÃO NÍVEL ALTO IMPACTO:
- Correndo e pulando corda: estabilização quase total do busto sem machucar os ombros.
- Narração: "Ideal pra quem corre, pula corda ou faz crossfit e precisa de sustentação firme de verdade."

🎬 CENA 5 (17-22s) - CTA:
- Apontando para o carrinho amarelo:
- Narração: "Tamanhos do P ao GG no carrinho amarelo aqui embaixo com frete grátis hoje. Escolha a sua cor!"`,
      },
      // 85. Moda Praia - PRO
      {
        title:
          'Biquíni Top Triângulo com Bojo Removível e Calcinha Levanta Glúteo - POV Banho de Sol',
        description:
          'POV deitada na toalha de praia tomando sol com biquíni em tom rosa chiclete cintilante com costura ondulada ripple levanta bumbum.',
        niche: 'moda_praia',
        style: 'pov',
        platform: 'shopee',
        is_free: false,
        hook: 'POV: O biquíni ripple que faz a marquinha de sol mais perfeita da sua vida!',
        call_to_action: 'Costura ondulada ripple com forro duplo toque de seda. Link na sacolinha!',
        tags: 'biquini ripple, levanta bumbum, marquinha perfeita, banho de sol, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=ripple+bikini+tanning+sunbathing+woman+beach&color=pink',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 21 SEGUNDOS]

🎬 CENA 1 (0-3s) - A MARQUINHA DE SOL DOS SONHOS (HOOK):
- POV com óculos de sol na espreguiçadeira com sol dourado e o biquíni com costura ripple franzidinha.
- Texto na tela: "A MARQUINHA MAIS PERFEITA ☀️👙"
- Narração inspiradora: "POV: O biquíni que garante aquela marquinha de fita fininha e perfeita pras suas fotos de verão!"

🎬 CENA 2 (3-8s) - A COSTURA ONDULADA RIPPLE QUE EMPINA O BUMBUM:
- Close no elástico franzido da calcinha em formato de coração: cria uma curva natural que empina visualmente o bumbum.
- Narração: "A costura ripple ondulada nas bordas cria aquele efeito empina bumbum que todas as influenciadoras amam."

🎬 CENA 3 (8-13s) - CORDÕES LONGOS PARA AMARRAÇÕES CRIATIVAS:
- Mostrando como as cordinhas compridas permitem cruzar na cintura ou amarrar nas costas com facilidade.
- Narração: "Cordinhas longas pra cruzar na barriga e criar looks diferentes na praia."

🎬 CENA 4 (13-17s) - FORRO INTERNO TOTALMENTE EMBUTIDO:
- Não tem costuras expostas que machucam na virilha e a poliamida seca em minutos após o mergulho.
- Narração: "Totalmente embutido sem costuras que machucam a pele e com proteção solar UV50+."

🎬 CENA 5 (17-21s) - CTA:
- Apontando pro link da sacolinha:
- Narração: "Menos de R$ 35 na sacolinha oficial aqui da Shopee com frete grátis hoje. Clica e aproveite o cupom!"`,
      },
      // 86. Calçados & Acessórios - PRO
      {
        title:
          'Carteira Masculina Minimalista Slim em Couro Genuíno com Ejetor de Cartões - POV Pagamento Rápido',
        description:
          'POV apertando a alavanca ejetora da carteira de alumínio e couro e os cartões saltando em cascata perfeita em 1 segundo.',
        niche: 'acessorios_calcados',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'POV: A carteira slim que ejeta seus cartões em cascata com 1 clique e não faz volume no bolso!',
        call_to_action:
          'Bloqueio RFID contra clonagem e estojo de alumínio aeroespacial. Link no carrinho amarelo!',
        tags: 'carteira slim ejetor, rfid antifurto, carteira minimalista, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=minimalist+cardholder+wallet+pop+up+leather&color=black',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - O SOM SATISFATÓRIO DO EJETOR (HOOK):
- POV na hora de pagar no caixa: aperta a pequena alavanca inferior com o polegar e 6 cartões saltam em cascata organizada instantaneamente!
- Texto na tela: "A CARTEIRA MAIS SATISFATÓRIA DO MUNDO 💳⚡"
- Narração empolgada: "POV: O dia em que você aposentou aquela carteira gorda de couro velha que parecia um tijolo no bolso da calça!"

🎬 CENA 2 (3-8s) - A PROTEÇÃO RFID BLINDADA:
- Mostrando a carcaça de alumínio interna que bloqueia tentativas de aproximação por maquininhas criminosas.
- Narração: "Blindagem RFID contra clonagem por aproximação: ninguém consegue roubar seus dados no transporte público."

🎬 CENA 3 (8-13s) - ESPAÇO PARA CÉDULAS E CNH:
- Abrindo a aba de couro legítimo: compartimento especial com elástico para notas de dinheiro e documento CNH.
- Narração: "Tem compartimento pras notas e CNH sem perder a espessura fina de menos de 1 centímetro."

🎬 CENA 4 (13-17s) - O TESTE NO BOLSO DA CALÇA:
- Colocando no bolso da frente da calça jeans: zero volume ou incômodo ao sentar.
- Narração: "Cabe no bolso frontal de qualquer calça sem incomodar quando você senta ou dirige."

🎬 CENA 5 (17-22s) - CTA:
- Apontando para o carrinho amarelo:
- Narração: "Cores preto carbono, marrom café e azul marinho no carrinho amarelo do TikTok Shop com frete grátis hoje!"`,
      },
      // 87. Streetwear & Casual - PRO
      {
        title:
          'Jaqueta Corta-Vento Bicolor Streetwear com Gola Alta e Punho Ajustável - Modelo Pista Skate',
        description:
          'Modelo caminhando no pôr do sol com jaqueta corta-vento bicolor com zíper frontal duplo, forro em tela e visual streetwear autêntico.',
        niche: 'streetwear_casual',
        style: 'modelo',
        platform: 'shopee',
        is_free: false,
        hook: 'O corta-vento bicolor que todo mundo no rolê vai achar que você pagou R$ 300!',
        call_to_action:
          'Tecido microfibra resinado que repele água com forro em tela respirável. Link na sacolinha!',
        tags: 'corta vento bicolor, streetwear anos 90, skate style, shopee achados',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=colorblock+windbreaker+jacket+streetwear+skatepark&color=blue',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - O CONTRASTE RETRÔ DAS CORES (HOOK):
- Passada do modelo com a corta-vento bicolor (preto com bege / azul com cinza) e gola alta estruturada.
- Texto na tela: "VISUAL RETRÔ POR R$ 56 🛹🔥"
- Narração com estilo: "Se você curte aquela estética esportiva anos 90 e tá procurando uma peça estilosa pro dia a dia, olha esse corta-vento!"

🎬 CENA 2 (3-8s) - O CORTE EM BLOCOS DE CORES:
- Close nas emendas de tecido com costura rebatida reforçada que não desfia.
- Narração: "Recortes geométricos com costura dupla reforçada e acabamento fosco elegante que não faz aquele barulho de plástico ao andar."

🎬 CENA 3 (8-13s) - O FORRO INTERNO RESPIRÁVEL:
- Abrindo a jaqueta: tecido perfurado interno que permite a circulação de ar durante caminhadas ou skate.
- Narração: "Tem forro em tela respirável pra você não suar por dentro e capuz com elástico anatômico que não cai no vento."

🎬 CENA 4 (13-17s) - BOLSOS LATERAIS FUNDOS COM VELCRO:
- Mãos nos bolsos com fechamento seguro para não perder o celular no rolê.
- Narração: "Bolsos fundos com fechamento seguro pra carregar seus pertences com tranquilidade."

🎬 CENA 5 (17-22s) - CTA:
- Modelo apontando para a sacolinha da Shopee:
- Narração: "Disponível em 4 combinações de cores na sacolinha oficial aqui da Shopee com cupom de desconto hoje!"`,
      },
      // 88. Infantil & Kids - PRO
      {
        title:
          'Pijama Infantil Brilha no Escuro em Algodão com Estampa Espacial - POV Hora de Dormir',
        description:
          'POV apagando a luz do quarto da criança e o pijama inteiro acendendo com desenhos fluorescentes mágicos de planetas e estrelas.',
        niche: 'infantil_kids',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'POV: O pijama infantil que brilha no escuro e faz a criança ir pra cama sem reclamar!',
        call_to_action:
          '100% algodão suedine com estampa fotoluminescente atóxica. Link no carrinho amarelo!',
        tags: 'pijama brilha no escuro, infantil espaco, hora de dormir, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=kids+pajamas+glow+in+the+dark+space+stars&color=blue',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - A MÁGICA AO APAGAR A LUZ (HOOK):
- POV com a criança deitada na cama sorrindo: a mãe apaga a luz do abajur e os foguetes e estrelas do pijama brilham em verde fluorescente mágico!
- Texto na tela: "A CRIANÇA FICA ENCANTADA! 🚀✨"
- Narração divertida e calorosa: "POV: O segredo que toda mãe precisava pra acabar com o choro na hora de ir dormir à noite!"

🎬 CENA 2 (3-8s) - A TINTA FOTOLUMINESCENTE SEGURA:
- Mãe mostrando a estampa sob a luz: textura lisa que não fica rígida ou áspera sobre o peitinho da criança.
- Narração: "A estampa luminosa é atóxica à base d'água: não é plastificada, não racha e brilha por horas após recarregar na luz do quarto."

🎬 CENA 3 (8-13s) - O TOQUE DO ALGODÃO SUEDINE RESPIRÁVEL:
- Mostrando a elasticidade suave da calça com punhos que não deixam a barra subir durante a noite.
- Narração: "100% algodão suedine super macio que não esquenta e não deixa a criança transpirar durante o sono."

🎬 CENA 4 (13-17s) - ELÁSTICO SUAVE QUE NÃO MARCA A BARRIGUINHA:
- Esticando o cós da calça infantil para demonstrar a maciez da costura elástica.
- Narração: "O elástico da cintura é anatômico e não aperta a barriguinha da criança."

🎬 CENA 5 (17-22s) - CTA:
- Apontando para o carrinho amarelo:
- Narração: "Tamanhos do 2 ao 12 anos no carrinho amarelo do TikTok Shop com envio imediato. Garanta o do seu filho!"`,
      },
      // 89. Lingerie & Pijamas - PRO
      {
        title:
          'Calcinha Modeladora de Cintura Alta com Barbatanas de Aço Flexível - POV Provador Vestido Justo',
        description:
          'POV no espelho provando a calcinha cinta de alta compressão sob um vestido tubinho claro: abdômen liso sem enrolar na cintura.',
        niche: 'lingerie_pijamas',
        style: 'pov',
        platform: 'shopee',
        is_free: false,
        hook: 'POV: A calcinha cinta com barbatanas de aço que NUNCA enrola na barriga!',
        call_to_action:
          '4 barbatanas de aço flexível com forro 100% algodão e compressão tripla. Link na sacolinha!',
        tags: 'calcinha cinta, nao enrola, barbatanas de aco, afina cintura, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=high+waist+shaper+panty+steel+bones+woman+fitting+room&color=black',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - O FIM DO CÓS QUE ROLA PRA BAIXO (HOOK):
- POV sentando e levantando rapidamente no provador: o cós alto da calcinha cinta permanece imóvel na altura das costelas sem dobrar nem 1 milímetro!
- Texto na tela: "FINALMENTE UMA CINTA QUE NÃO ENROLA! ⏳🔥"
- Narração confiante: "Se você já comprou cinta que enrolou e virou um pneu na sua cintura quando você sentou, assista a esse vídeo até o final!"

🎬 CENA 2 (3-8s) - AS 4 BARBATANAS DE AÇO FLEXÍVEIS:
- Dobrando a peça com as mãos: as barbatanas se curvam com a sua postura e voltam imediatamente eretas sem machucar o estômago.
- Narração: "Ela tem 4 barbatanas de aço inoxidável em espiral: flexionam junto com seu corpo mas impedem o tecido de enrolar."

🎬 CENA 3 (8-13s) - COMPRESSÃO ABDOMINAL TRIPLA:
- Mostrando a camada reforçada no abdômen que reduz instantaneamente de 3 a 5 centímetros de medidas sob a roupa.
- Narração: "Painel frontal com reforço triplo de poliamida que recolhe a barriguinha e apoia a lombar aliviando dores nas costas."

🎬 CENA 4 (13-17s) - FUNDO COM FORRO 100% ALGODÃO RESPIRÁVEL:
- Mostrando a parte íntima com forro de algodão puro para uso diário higiênico e confortável.
- Narração: "Forro 100% algodão respirável e corte a laser nas pernas pra não marcar na roupa justa."

🎬 CENA 5 (17-22s) - CTA:
- Apontando delicadamente para a sacolinha da Shopee:
- Narração: "Tamanhos do P ao Plus Size na sacolinha oficial aqui da Shopee com frete grátis hoje. Clica e aproveite o cupom!"`,
      },
      // 90. Moda Feminina - PRO
      {
        title:
          'Vestido Longo Frente Única com Amarração no Pescoço e Costas Nuas - Modelo Resort Pôr do Sol',
        description:
          'Modelo caminhando no pôr do sol à beira-mar com vestido longo esvoaçante em crepe de seda com costas nuas e fenda lateral.',
        niche: 'moda_feminina',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'O vestido longo frente única que te transforma numa deusa grega no pôr do sol!',
        call_to_action:
          'Crepe fluido com forro duplo até os pés e amarração ajustável no pescoço. Link no carrinho amarelo!',
        tags: 'vestido longo costas nuas, frente unica, look resort chic, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=halter+backless+maxi+dress+woman+sunset+beach+resort&color=orange',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 23 SEGUNDOS]

🎬 CENA 1 (0-3s) - O IMPACTO VISUAL DAS COSTAS DESCOBERTAS (HOOK):
- Modelo caminhando de costas em direção à luz dourada do pôr do sol, o vestido terracota/verde oliva esvoaçando com a brisa do mar.
- Texto na tela: "DEUSA GREGA POR R$ 68 🌅✨"
- Narração hipnótica: "O vestido que faz você parecer uma celebridade internacional caminhando na praia de Santorini!"

🎬 CENA 2 (3-9s) - O DECOTE FRENTE ÚNICA COM AMARRAÇÃO REGULÁVEL:
- Close na gola com laço comprido nas costas que permite regular a altura do decote e a firmeza no busto.
- Narração: "A amarração no pescoço é totalmente ajustável e o busto tem tecido duplo com elástico de sustentação pra não abrir nas laterais."

🎬 CENA 3 (9-14s) - O CREPE FLUIDO COM MOVIMENTO CINEMATOGRÁFICO:
- Modelo rodando suavemente: o tecido abre em círculo com leveza espetacular e a fenda lateral alonga a silhueta da perna.
- Narração: "O tecido é um crepe toque de seda que não amarrota na mala e tem peso perfeito pra não ficar colando no corpo com o calor."

🎬 CENA 4 (14-18s) - FORRO INTERNO COMPLETO:
- Mostrando que o vestido tem forro embutido até o meio da coxa, garantindo zero transparência sob luz solar direta.
- Narração: "Pode ficar tranquila contra a luz do sol: o forro interno impede qualquer transparência."

🎬 CENA 5 (18-23s) - CTA:
- Modelo sorrindo e sinalizando para o carrinho amarelo:
- Narração: "Mais de 3 mil avaliações 5 estrelas no carrinho amarelo do TikTok Shop. Aproveite o frete grátis antes que esgote o lote de verão!"`,
      },
    ]

    for (let i = 0; i < proPromptsPart8.length; i++) {
      const p = proPromptsPart8[i]
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
