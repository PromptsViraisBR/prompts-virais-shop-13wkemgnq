/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const promptsCol = app.findCollectionByNameOrId('prompts')

    const newPrompts = [
      // 1. Moda Feminina - POV
      {
        title: 'Calça Jeans Wide Leg Cintura Perfeita - POV Provador',
        description:
          'POV provando jeans que não abre atrás na lombar, valoriza o quadril e tem elastano que não aperta.',
        niche: 'moda_feminina',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'POV: Você finalmente achou a calça jeans da Shopee que NÃO fica aquele vão gigante nas costas!',
        call_to_action:
          'Tem elastano que abraça o corpo. Pegue o link no carrinho amarelo antes do frete grátis acabar!',
        tags: 'jeans wide leg, sem vão na cintura, moda feminina, provador, tiktok shop',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 18 SEGUNDOS]

🎬 CENA 1 (0-3s) - GANCHO DE DOR REAL (HOOK):
- POV em frente ao espelho do provador: puxando o cós de uma calça velha com aquele espaço gigante na lombar com cara de desânimo.
- Narração espontânea: "POV: Toda mulher que tem quadril largo e cintura fina já passou pelo trauma da calça que sobra atrás..."
- Texto na tela: "Adeus vão na cintura! 👖✨"

🎬 CENA 2 (3-8s) - A SOLUÇÃO:
- Transição com giro suave mostrando a CALÇA JEANS WIDE LEG perfeitamente ajustada na cintura.
- Mão passando nas costas mostrando zero sobra e bolso traseiro empina bumbum.
- Narração: "Essa modelagem tem pence dupla traseira e 3% de elastano. Ela abraça a cintura sem sufocar e não precisa de cinto!"

🎬 CENA 3 (8-13s) - MOVIMENTO & CONFORTO:
- Dando 3 passos e agachando levemente: o jeans não trava o joelho.
- Narração: "Dá pra sentar no escritório o dia todo sem aquela barra apertando a barriga."

🎬 CENA 4 (13-18s) - CTA:
- Apontando pro carrinho amarelo:
- Narração: "Pedi meu número exato e vestiu perfeitamente. Link com envio rápido tá no carrinho amarelo aqui embaixo!"`,
      },
      // 2. Moda Feminina - Modelo
      {
        title: 'Blazer Alfaiataria Estruturado com Ombreira - Modelo Executiva Moderna',
        description:
          'Modelo caminhando em avenida movimentada, demonstrando corte impecável, forro acetinado e presença imponente.',
        niche: 'moda_feminina',
        style: 'modelo',
        platform: 'ambos',
        is_free: false,
        hook: 'O blazer de R$ 79 que transforma qualquer camiseta básica em look de R$ 1.000!',
        call_to_action:
          'Forro acetinado completo e ombreiras estruturadas. Link direto na vitrine!',
        tags: 'blazer alfaiataria, look trabalho, executiva, chic, shopee',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP / SHOPEE - 20 SEGUNDOS]

🎬 CENA 1 (0-3s) - GANCHO VISUAL (HOOK):
- Modelo de costas em cenário urbano iluminado, vira o rosto com óculos de sol e olhar de mulher de negócios.
- Texto na tela: "COMO PARECER A CHEFE EM 3 SEGUNDOS 💼🔥"
- Narração: "Se você precisa de uma terceira peça que mude a sua postura e presença em qualquer ambiente, assista isso!"

🎬 CENA 2 (3-8s) - REVELAÇÃO DO PRODUTO:
- Modelo caminhando em câmera lenta com o Blazer Alfaiataria fechado, depois abrindo as mãos nos bolsos embutidos.
- Close na ombreira suave estruturada e no caimento reto que alonga o tronco.
- Narração: "A alfaiataria tem estrutura encorpada, ombreiras na medida certa pra alinhar a postura e não amassa fácil na bolsa."

🎬 CENA 3 (8-14s) - VERSATILIDADE:
- Corte rápido 1: Sobre vestido tubinho preto com scarpin.
- Corte rápido 2: Aberto com regata branca básica, jeans e tênis.
- Narração: "Vai do escritório à reunião com clientes e até o barzinho no sábado à noite."

🎬 CENA 4 (14-20s) - CTA:
- Modelo sorrindo e apontando para a sacolinha:
- Narração: "Tem em 5 tons atemporais (off-white, preto, cáqui, terracota e azul-marinho). O link tá na vitrine aqui embaixo!"`,
      },
      // 3. Moda Masculina - Modelo
      {
        title: 'Calça Cargo Tática com Bolsos Funcionais - Modelo Streetwear',
        description:
          'Modelo com postura atlética mostrando o tecido ripstop resistente a rasgos e caimento jogger ajustável.',
        niche: 'moda_masculina',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: true,
        hook: 'A calça cargo masculina mais vendida da internet por um motivo: ELA NÃO RASGA!',
        call_to_action:
          'Tecido militar ripstop com elástico ajustável no tornozelo. Link no carrinho!',
        tags: 'calça cargo, moda masculina, streetwear, ripstop, tiktok shop',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 19 SEGUNDOS]

🎬 CENA 1 (0-3s) - TESTE DE IMPACTO (HOOK):
- Modelo puxando o tecido da coxa com força para demonstrar resistência extrema sem esgarçar.
- Texto na tela: "A CARGO MAIS RESISTENTE DA TIKTOK SHOP 💥"
- Narração: "Se você cansa de calça fina que descostura no cavalo ou rasga no primeiro esbarrão, olha essa estrutura!"

🎬 CENA 2 (3-9s) - DETALHES TÁTICOS:
- Close nos 6 bolsos funcionais com fechamento em velcro reforçado.
- Modelo guardando carteira e smartphone grande nos bolsos laterais sem pesar.
- Narração: "São 6 bolsos fundos, costura tripla e tecido ripstop com repelência a respingos de água."

🎬 CENA 3 (9-14s) - BARRA AJUSTÁVEL:
- Mostrando o cordão com regulador de metal no tornozelo: opção reta ou jogger.
- Narração: "O punho tem regulagem: dá pra usar solta estilo baggy ou presa estilo jogger com o tênis em destaque."

🎬 CENA 4 (14-19s) - CTA:
- Modelo caminhando e sinalizando pro carrinho:
- Narração: "Tá no menor preço do mês com frete grátis do TikTok Shop. Clica no carrinho amarelo e garante a sua cor!"`,
      },
      // 4. Moda Masculina - POV
      {
        title: 'Kit Polos Piquet Slim Fit - POV Escolhendo Roupa pra Reunião',
        description:
          'POV abrindo o guarda-roupa, escolhendo a polo piquet com gola estruturada que não enrola.',
        niche: 'moda_masculina',
        style: 'pov',
        platform: 'shopee',
        is_free: false,
        hook: 'POV: Você cansou da gola de polo que fica toda torta parecendo orelha de cachorro!',
        call_to_action: 'Kit com 3 polos de piquet premium. O vendedor despacha em 24h na Shopee!',
        tags: 'polo piquet, kit polos, moda masculina, gola firme, shopee',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 17 SEGUNDOS]

🎬 CENA 1 (0-3s) - COMPARATIVO REAL (HOOK):
- POV: Segurando uma polo antiga com gola mole amassada e jogando de lado.
- Narração: "POV: O dia em que você jogou fora todas as polos velhas com gola mole e comprou o kit certo na Shopee..."
- Texto na tela: "Gola que fica firme o dia todo! 👔"

🎬 CENA 2 (3-8s) - PROVA DO PIQUET:
- Vestindo a polo azul marinho no espelho: a gola fica armada impecável.
- Close no tecido encorpado de algodão piquet com bordado sutil no peito.
- Narração: "Gola canelada dupla estruturada que não deforma na máquina de lavar, manga com acabamento slim no bíceps."

🎬 CENA 3 (8-13s) - RESULTADO NO CORPO:
- Ajustando o relógio, caimento ajustado no peitoral e solto na cintura.
- Narração: "Dá aquele aspecto alinhado pro trabalho sem parecer que você tá sufocado."

🎬 CENA 4 (13-17s) - CTA:
- Mostrando a caixa com as 3 polos do kit:
- Narração: "Sai menos de R$ 35 cada peça no kit da Shopee com frete grátis. Clica no link da sacolinha!"`,
      },
      // 5. Fitness & Academia - POV
      {
        title: 'Shorts Duplo com Bolso Térmico pra Celular - POV Corrida / Treino',
        description:
          'POV correndo com o celular no bolso de compressão interno sem balançar ou cair no chão.',
        niche: 'fitness_academia',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'POV: O shorts que salvou meu celular de cair na esteira durante o treino pesado!',
        call_to_action:
          'Bolso interno de alta compressão e tecido dry fit respirável. Link no carrinho!',
        tags: 'shorts corrida, bolso celular, academia, fitness, tiktok shop',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 16 SEGUNDOS]

🎬 CENA 1 (0-3s) - PROBLEMA RESOLVIDO (HOOK):
- POV na esteira ou ar livre: correndo, celular firme na coxa sem pular.
- Texto na tela: "O SHORTS DEFINITIVO PRA TREINAR 🏃‍♂️📱"
- Narração: "POV: você nunca mais teve que segurar o celular na mão ou arriscar derrubar na esteira da academia..."

🎬 CENA 2 (3-8s) - MECANISMO DO BOLSO:
- Mostrando a camada dupla: o forro interno com bolso justo elástico que engole o iPhone Pro Max.
- Narração: "Ele tem bermuda interna de compressão com bolso anatômico: o celular não balança, não incomoda e não cai nem no tiro de corrida."

🎬 CENA 3 (8-12s) - TECIDO DRY FIT:
- Mostrando o tecido externo levinho com fenda lateral e secagem rápida anti-suor.
- Narração: "Tecido repelente a odor e suor, super leve e com passador traseiro pra toalha de treino."

🎬 CENA 4 (12-16s) - CTA:
- Apontando pro carrinho amarelo:
- Narração: "Melhor investimento pra quem treina sério. Tá no carrinho amarelo com cupom ativo hoje!"`,
      },
      // 6. Fitness & Academia - Modelo
      {
        title: 'Macacão Fitness Efeito Empina Bumbum - Modelo em Ação',
        description:
          'Modelo com macacão modelador anatômico com franzido nas costas e compressão abdominal.',
        niche: 'fitness_academia',
        style: 'modelo',
        platform: 'ambos',
        is_free: false,
        hook: 'O macacão que substitui cinta modeladora e te deixa desenhada na academia!',
        call_to_action:
          'Tecido suplex power sem transparência com bojo removível. Link na sacolinha!',
        tags: 'macacão fitness, empina bumbum, suplex power, academia, shopee',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP / SHOPEE - 18 SEGUNDOS]

🎬 CENA 1 (0-3s) - EFEITO WOW (HOOK):
- Modelo caminhando de costas em estúdio com iluminação neon fitness, transição de giro revelando a silhueta modelada.
- Texto na tela: "DESENHA O CORPO IGUAL CINTA 🍑⚡"
- Narração: "Se você quer se olhar no espelho da academia e se sentir a mulher mais linda do mundo, você precisa desse macacão!"

🎬 CENA 2 (3-9s) - EFEITO EMPINA BUMBUM:
- Close no franzido sutil traseiro (scrunch butt) que valoriza as formas de modo natural.
- Modelo fazendo agachamento leve para provar sustentação e forro duplo sem transparência.
- Narração: "O franzido anatômico dá um volume absurdo pro bumbum e o tecido suplex de 320g não deixa ver nada mesmo sob luz forte."

🎬 CENA 3 (9-14s) - COMPRESSÃO ABDOMINAL:
- Mão da modelo mostrando a faixa reforçada na barriga que esconde pochete e segura a lombar.
- Narração: "O decote das costas é valorizado e o bojo embutido dá sustentação total pro treino de perna e corrida."

🎬 CENA 4 (14-18s) - CTA:
- Modelo apontando para o botão da vitrine:
- Narração: "Chega rápido na sua casa e veste do P ao GG. Clica no link do carrinho aqui embaixo pra escolher a sua cor!"`,
      },
      // 7. Moda Praia - Modelo
      {
        title: 'Saída de Praia em Tule com Fenda Longa - Modelo ao Pôr do Sol',
        description:
          'Vídeo estético ao vento de praia dourada, modelo desfilando a leveza do tule e transparência chique.',
        niche: 'moda_praia',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'A saída de praia que faz qualquer biquíni simples parecer look de resort nas Maldivas!',
        call_to_action:
          'Secagem ultrarrápida e tecido que não amassa na mala. Compre direto na vitrine!',
        tags: 'saída de praia, tule longo, resort wear, verão chic, tiktok shop',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 17 SEGUNDOS]

🎬 CENA 1 (0-3s) - ESTÉTICA RESORT (HOOK):
- Modelo caminhando na areia da praia na hora de ouro, o tule da saída voando suavemente com a brisa do mar.
- Áudio chill tropical em alta.
- Texto na tela: "Look de hotel 5 estrelas por R$ 49 🌊✨"
- Narração: "A peça que vai garantir as fotos mais perfeitas da sua viagem de verão!"

🎬 CENA 2 (3-8s) - DETALHES DE ESTILO:
- Close na fenda lateral longa e no cordão de ajuste que amarra na cintura.
- O tecido tem leve transparência elegante que valoriza o biquíni por baixo sem ser vulgar.
- Narração: "O caimento é fluido, o tecido de tule com elastano seca em 5 minutos no sol e não ocupa espaço nenhum na mala."

🎬 CENA 3 (8-13s) - DO BEACH CLUB AO RESTAURANTE:
- Modelo colocando um chapéu de palha e bolsa de praia:
- Narração: "Dá pra sair da água e ir direto pro restaurante da praia super arrumada e elegante."

🎬 CENA 4 (13-17s) - CTA:
- Apontando pro carrinho com sorriso:
- Narração: "As cores neutras como branco e areia acabam primeiro. Clica no carrinho amarelo do vídeo antes da sua viagem!"`,
      },
      // 8. Moda Praia - POV
      {
        title: 'Maiô Engana Mamãe com Recortes Estratégicos - POV Espelho de Hotel',
        description:
          'POV provando o maiô com recortes que afinam a cintura e se transforma em body para sair à noite.',
        niche: 'moda_praia',
        style: 'pov',
        platform: 'shopee',
        is_free: true,
        hook: 'POV: O maiô da Shopee que afina 5cm de cintura e ainda vira body pra sair à noite!',
        call_to_action: 'Peça 2 em 1 com forro reforçado. Link na sacolinha com frete grátis!',
        tags: 'maiô engana mamãe, body praia, afina cintura, shopee achados',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 18 SEGUNDOS]

🎬 CENA 1 (0-3s) - O TRUQUE DE ESTILO (HOOK):
- POV em frente ao espelho do quarto de hotel: vestindo o maiô com recortes nas laterais da costela.
- Texto na tela: "Efeito cintura de pilão instantâneo! ⏳👙"
- Narração: "POV: você comprou um maiô despretensioso na Shopee e descobriu a peça mais coringa de toda a sua mala..."

🎬 CENA 2 (3-9s) - O RECORTE MÁGICO:
- Girando de lado e de frente: a ilusão de ótica dos recortes laterais estreita a silhueta.
- Close no tecido suplex praia com proteção UV50+ e bojo sustentação.
- Narração: "O recorte estratégico dá a sensação visual de cintura fininha, as costas têm decote lindo e não fica frouxo na água."

🎬 CENA 3 (9-14s) - TRANSFORMAÇÃO EM LOOK NOITE:
- Transição: agora vestindo uma calça pantalona de linho ou shorts jeans por cima.
- Narração: "E o melhor: você coloca uma calça por cima e ele vira um body chiquérrimo pra jantar ou sair à noite!"

🎬 CENA 4 (14-18s) - CTA:
- Apontando pra sacolinha:
- Narração: "Duas peças em uma por preço de uma só. Clica na sacolinha aqui do vídeo antes de fechar a sua mala!"`,
      },
      // 9. Calçados & Acessórios - Unboxing
      {
        title: 'Sandália Papete de Strass Brilho Intenso - Unboxing ASMR + No Pé',
        description:
          'Abertura de caixa com papel de seda, brilho refletindo a luz e teste da palmilha anatômica acolchoada.',
        niche: 'acessorios_calcados',
        style: 'unboxing_vitrine',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'A papete de strass que não machuca o calcanhar e brilha até no escuro!',
        call_to_action:
          'Palmilha anatômica estilo nuvem com strass prensado a quente. Link no carrinho!',
        tags: 'papete strass, sandália brilho, conforto nuvem, calçados femininos, tiktok shop',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 18 SEGUNDOS]

🎬 CENA 1 (0-3s) - EXPLOSÃO DE BRILHO (HOOK):
- Tirando a papete da caixa: luz direta fazendo o strass refletir centenas de pontos de brilho como joia.
- Áudio de ASMR da fita adesiva abrindo.
- Texto na tela: "BRILHA MAIS QUE DIAMANTE 💎✨"
- Narração: "Chegou a papete mais comentada do TikTok e o brilho dela pessoalmente é inacreditável!"

🎬 CENA 2 (3-8s) - TESTE DO MACIO (CONFORTO):
- Pressionando o polegar na palmilha anatômica com sola de 3cm para mostrar o efeito acolchoado.
- Passando os dedos nas tiras de strass: não solta pedras e o verso tem forro macio.
- Narração: "O strass é prensado com calor, não solta na mão e a parte de dentro tem forro sedoso pra não ralar o peito do pé."

🎬 CENA 3 (8-13s) - NO PÉ CAMINHANDO:
- Calçando com facilidade (fecho em velcro rápido): passos firmes e leves.
- Narração: "Você anda o dia todo no shopping ou evento sem sentir nenhuma dor nos pés."

🎬 CENA 4 (13-18s) - CTA:
- Apontando pro carrinho amarelo:
- Narração: "Vem na caixa oficial com saquinho protetor. Pega seu tamanho no carrinho amarelo enquanto tem estoque!"`,
      },
      // 10. Calçados & Acessórios - Modelo
      {
        title: 'Bota Coturno Tratorada Couro Sintético - Modelo Look Inverno / Festival',
        description:
          'Modelo com vestido floral + jaqueta de couro e coturno tratorado, caminhando com firmeza no asfalto.',
        niche: 'acessorios_calcados',
        style: 'modelo',
        platform: 'ambos',
        is_free: false,
        hook: 'O coturno tratorado leve como tênis que aguenta chuva, festival e horas em pé!',
        call_to_action:
          'Solado tratorado antiderrapante com zíper lateral prático. Link na sacola!',
        tags: 'coturno tratorado, bota feminina, look festival, outono inverno, shopee',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE / TIKTOK - 19 SEGUNDOS]

🎬 CENA 1 (0-3s) - ESTILO PODEROSO (HOOK):
- Passada firme da modelo com o coturno pisando no chão molhado ou calçada com atitude rock/chic.
- Texto na tela: "A BOTA MAIS CONFORTÁVEL DA VIDA 👢🖤"
- Narração: "Se você acha que coturno é pesado e cansa a perna, você ainda não testou essa bota!"

🎬 CENA 2 (3-9s) - O SEGREDO DO PESO:
- Modelo segurando o coturno com uma mão só e jogando pro alto levemente para provar leveza.
- Close no zíper lateral: você não precisa desamarrar o cadarço toda vez pra calçar.
- Narração: "O solado tratorado é de EVA expandido ultraleve, pesa menos que um tênis esportivo e tem zíper lateral pra calçar em 2 segundos."

🎬 CENA 3 (9-14s) - VERSATILIDADE DE LOOKS:
- Look 1: Com minissaia e meia-calça.
- Look 2: Com calça jeans wide leg dobrada.
- Narração: "Aguenta chuva, show de música, faculdade e combina com qualquer peça do seu armário."

🎬 CENA 4 (14-19s) - CTA:
- Modelo apontando para a sacolinha:
- Narração: "Forma normal e acabamento impermeável. Tá na sacolinha da Shopee com cupom de desconto hoje!"`,
      },
      // 11. Streetwear & Casual - POV
      {
        title: 'Bermuda Cargo Jeans Baggy Vintage - POV Provando com Tênis Retrô',
        description:
          'POV combinando bermuda baggy jeans com meia alta, camiseta oversized e tênis clássico dos anos 90.',
        niche: 'streetwear_casual',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'POV: Você finalmente achou a bermuda jeans baggy com caimento anos 2000 perfeito!',
        call_to_action:
          'Jeans pesado 100% algodão sem elastano com lavagem vintage. Link no carrinho!',
        tags: 'bermuda baggy, jorts, streetwear, vintage 2000s, tiktok shop',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 18 SEGUNDOS]

🎬 CENA 1 (0-3s) - RESGATE NOSTÁLGICO (HOOK):
- POV: Olhando pra baixo no espelho com a bermuda cargo baggy jeans passando da linha do joelho e tênis retrô.
- Narração: "POV: Você demorou meses pra achar a jorts perfeita com caimento skatista dos anos 2000..."
- Texto na tela: "A BERMUDA BAGGY DEFINITIVA 🔥🛹"

🎬 CENA 2 (3-8s) - A ESTRUTURA DO JEANS:
- Batendo a mão na coxa: o som do jeans encorpado e pesado de 12oz.
- Mostrando a lavagem estonada vintage com desgastes sutis de fábrica.
- Narração: "É jeans grosso de verdade, 100% algodão. Os bolsos laterais são profundos e o corte reto não afunila na perna."

🎬 CENA 3 (8-13s) - O FIT COM MEIA ALTA:
- Dando um giro no quarto: combinada com camiseta oversized solta.
- Narração: "O comprimento cai exatamente abaixo do joelho do jeito certo que o streetwear pede."

🎬 CENA 4 (13-18s) - CTA:
- Apontando pro carrinho amarelo:
- Narração: "Peça de marca gringa custa R$ 350, essa saiu por preço de fábrica no TikTok Shop. Clica aqui antes que acabe a grade!"`,
      },
      // 12. Streetwear & Casual - Modelo
      {
        title: 'Jaqueta Corta-Vento Streetwear Impermeável - Modelo Sob Chuva Leve',
        description:
          'Modelo com capuz ajustado, gotas de água escorrendo no tecido sem molhar e detalhes refletivos à noite.',
        niche: 'streetwear_casual',
        style: 'modelo',
        platform: 'ambos',
        is_free: true,
        hook: 'Jogamos água na jaqueta pra provar que ELA É 100% IMPERMEÁVEL!',
        call_to_action:
          'Tecido de nylon resinado com detalhes refletivos e forro interno. Link na sacola!',
        tags: 'corta vento, jaqueta impermeável, refletivo, streetwear, shopee',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE / TIKTOK - 20 SEGUNDOS]

🎬 CENA 1 (0-3s) - TESTE VISUAL FORTE (HOOK):
- Modelo vestindo a corta-vento: alguém joga um copo de água direto no peito dele!
- A água bate e escorre em bolinhas sem molhar o tecido.
- Texto na tela: "TESTE DA ÁGUA: MOLHA OU NÃO? 💦👀"
- Narração: "O teste que ninguém tem coragem de fazer: essa corta-vento é impermeável de verdade ou é conversa fiada?"

🎬 CENA 2 (3-8s) - RESULTADO AO VIVO:
- Modelo passa a mão no peito: o tecido tá completamente seco por dentro!
- Close no zíper tratorado vedado contra vento e frio.
- Narração: "Passou no teste com folga! O nylon resinado repele água na hora e barra o vento gelado de moto ou caminhada."

🎬 CENA 3 (8-14s) - DETALHES REFLETIVOS NOTURNOS:
- Apaga a luz ou acende o flash da câmera: os detalhes no peito e costas brilham intensamente no escuro.
- Narração: "Os detalhes refletivos garantem segurança na rua à noite e dão aquele visual futurista pesado."

🎬 CENA 4 (14-20s) - CTA:
- Modelo apontando para a sacolinha/carrinho:
- Narração: "Vem com capuz forrado ajustável e bolso canguru. Clica no link aqui embaixo pra garantir a sua no menor preço!"`,
      },
      // 13. Infantil & Kids - POV
      {
        title: 'Pijama Infantil Brilha no Escuro - POV Apagando a Luz do Quarto',
        description:
          'POV da mãe/pai colocando a criança na cama e apagando a luz: o pijama brilha com desenhos do espaço/dinossauros.',
        niche: 'infantil_kids',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'POV: O pijama que fez meu filho pedir pra ir dormir cedo pela primeira vez na vida!',
        call_to_action:
          'Algodão macio antialérgico que brilha no escuro. Link no carrinho amarelo!',
        tags: 'pijama brilha no escuro, infantil, maternidade, sono infantil, tiktok shop',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 18 SEGUNDOS]

🎬 CENA 1 (0-3s) - A MÁGICA DA LUZ APAGADA (HOOK):
- POV: Câmera mostrando a criança na cama com o pijama de dinossauro/planetas, a mãe apaga a luz do abajur.
- No escuro, a estampa brilha em tom verde neon suave como céu estrelado! A criança dá uma risadinha encantada.
- Texto na tela: "A HORA DE DORMIR NUNCA MAIS FOI A MESMA 🌙🦕"
- Narração: "POV: Você achou o pijama mágico que fez seu filho querer ir pra cama sem chorar nem dar trabalho..."

🎬 CENA 2 (3-8s) - A QUALIDADE DO ALGODÃO:
- Acende a luz: mão da mãe mostrando o toque suave do tecido 100% algodão penteado.
- Narração: "O tecido é macio, não tem costuras grossas que incomodam a pele e o brilho recarrega com a luz comum do quarto."

🎬 CENA 3 (8-13s) - RESISTÊNCIA À LAVAGEM:
- Mostrando a estampa após lavagens:
- Narração: "A estampa não racha e não descola na máquina. Já lavei várias vezes e continua brilhando igual no primeiro dia."

🎬 CENA 4 (13-18s) - CTA:
- Mostrando as variações (espaço, dinossauro, unicórnio, fadas):
- Narração: "Tem tamanhos do 2 ao 12. Deixei o link no carrinho amarelo com cupom pra pais e mães. Corre antes de esgotar!"`,
      },
      // 14. Infantil & Kids - Modelo
      {
        title: 'Vestidinho Infantil Rodado Festa Aniversário - Modelo Menina Rodando',
        description:
          'Menininha fofa girando com vestido rodado com laço nas costas, forro 100% algodão que não pinica.',
        niche: 'infantil_kids',
        style: 'modelo',
        platform: 'shopee',
        is_free: false,
        hook: 'Mães de menina: o vestido de princesa por R$ 39 que parece de loja cara de shopping!',
        call_to_action:
          'Forro 100% algodão antialérgico que não pinica a criança. Link na sacolinha!',
        tags: 'vestido festa infantil, roupa menina, aniversário, princesa, shopee achados',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 18 SEGUNDOS]

🎬 CENA 1 (0-3s) - O CHARME DA PRINCESA (HOOK):
- Menininha dando um giro todo feliz no estúdio ou sala bem iluminada, a saia de tule abrindo com leveza.
- Texto na tela: "VESTIDO DE PRINCESA POR MENOS DE R$ 40? 👑👧"
- Narração: "Mãe, para de pagar 200 reais em vestido de festa de shopping que a sua filha só vai usar uma ou duas vezes!"

🎬 CENA 2 (3-8s) - O TESTE DO 'NÃO PINICA':
- A mãe virando o vestido do avesso para a câmera: mostrando o forro macio de algodão que isola todo o tule da pele.
- Narração: "O segredo tá no forro: ele é 100% algodão macio por dentro, então a criança não fica se coçando nem pedindo pra tirar."

🎬 CENA 3 (8-13s) - DETALHES DE FESTA:
- Close no laço estruturado nas costas e detalhes perolados no peitilho.
- Narração: "Vem com o laço já pronto e fita ajustável na cintura pra ficar perfeito no corpinho dela."

🎬 CENA 4 (13-18s) - CTA:
- Menina mandando beijo para a câmera:
- Narração: "Ideal pra aniversário, fotos e festas de família. Clica na sacolinha aqui da Shopee e garante o tamanho dela!"`,
      },
      // 15. Lingerie & Pijamas - POV
      {
        title: 'Sutiã Sem Costura Invisível Efeito Lift - POV Blusa Justa',
        description:
          'POV colocando uma blusa branca justa por cima do sutiã: zero marcas de costura e sustentação impecável.',
        niche: 'lingerie_pijamas',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'POV: O único sutiã que não marca nada na blusa branca e não te aperta como uma tortura!',
        call_to_action: 'Tecido cortado a laser sem aros de metal. O link tá no carrinho amarelo!',
        tags: 'sutiã invisível, sem costura, sutiã sem aro, lingerie, tiktok shop',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 17 SEGUNDOS]

🎬 CENA 1 (0-3s) - O TESTE DA BLUSA BRANCA (HOOK):
- POV: Em frente ao espelho com uma blusinha branca canelada super justa.
- A pele tá lisa, sem nenhuma dobra nas costas, sem marcas de alça ou fecho.
- Texto na tela: "INVISÍVEL ATÉ NA BLUSA BRANCA! 👀✨"
- Narração: "POV: Você aposentou todos os sutiãs com arame que machucam a costela e achou o modelo invisível perfeito..."

🎬 CENA 2 (3-8s) - A ESTRUTURA DO PRODUTO:
- Mostrando a peça na mão: dobrando o bojo macio como uma folha, zero arame.
- As laterais são largas e cortadas a laser sem costuras nem elásticos que apertam a gordurinha da axila.
- Narração: "Corte a laser com tecnologia sem aro. Ele sustenta com sustentação anatômica em gel em vez daquele ferro que fura a pele."

🎬 CENA 3 (8-12s) - CONFORTO ABSOLUTO:
- Dando pulinhos leves: tudo seguro e sustentado com naturalidade.
- Narração: "Você esquece completamente que tá usando sutiã durante o dia inteiro."

🎬 CENA 4 (12-17s) - CTA:
- Apontando pro carrinho amarelo:
- Narração: "Tem do P ao GG em tons cor da pele, preto e chocolate. Clica no carrinho amarelo do TikTok Shop antes que acabe a promoção de kit!"`,
      },
      // 16. Lingerie & Pijamas - Modelo
      {
        title: 'Robe de Noiva / Madrinha em Cetim com Renda Chantilly - Modelo Se Arrumando',
        description:
          'Modelo em cenário clean e delicado, deslizando as mãos nas mangas de renda e amarrando a faixa de cetim.',
        niche: 'lingerie_pijamas',
        style: 'modelo',
        platform: 'shopee',
        is_free: false,
        hook: 'O robe de cetim que transforma o seu dia da noiva ou fotos de pré-wedding num conto de fadas!',
        call_to_action:
          'Cetim toque de seda com renda bordada nas mangas. Garanta na sacola com frete grátis!',
        tags: 'robe cetim, dia da noiva, madrinhas, lingerie noiva, shopee',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 19 SEGUNDOS]

🎬 CENA 1 (0-3s) - ATMOSFERA DE CASAMENTO / LUXO (HOOK):
- Modelo elegante se olhando no espelho de camarim com luz suave, deslizando a faixa do robe de cetim branco pérola.
- Texto na tela: "ROBE DE NOIVA DOS SONHOS POR R$ 55 👰✨"
- Narração: "Noivas e madrinhas: o robe que vai deixar o making of do seu casamento com cara de capa de revista!"

🎬 CENA 2 (3-9s) - DETALHES DA RENDA:
- Close nas mangas com transparência e renda delicada estilo Chantilly.
- O cetim tem brilho acetinado nobre sem parecer plástico barato.
- Narração: "O tecido tem toque de seda fluido, a renda dos punhos é macia e não repuxa os fios do cabelo penteado."

🎬 CENA 3 (9-14s) - CAIMENTO FOTOGÊNICO:
- Modelo caminhando e segurando uma taça de champanhe ou buquê com sorriso sereno.
- Narração: "O comprimento é clássico e a faixa transpassada modela a cintura sem escorregar."

🎬 CENA 4 (14-19s) - CTA:
- Mostrando as cores disponíveis (branco, rosé, champanhe, terracota e azul serenity):
- Narração: "Perfeito pra fotos em grupo de madrinhas. Clica na sacolinha aqui da Shopee pra pedir com antecedência pro seu grande dia!"`,
      },
      // 17. Moda Feminina - Unboxing
      {
        title: 'Conjunto Alfaiataria Colete e Shorts - Unboxing Vitrine',
        description:
          'Abertura de pacote com cheiro de loja fina, botões encapados e teste de caimento da cintura alta.',
        niche: 'moda_feminina',
        style: 'unboxing_vitrine',
        platform: 'ambos',
        is_free: true,
        hook: 'O conjunto de colete e shorts de alfaiataria que parece de vitrine de grife por R$ 69!',
        call_to_action:
          'Botões forrados do mesmo tecido e forro interno. Link disponível na vitrine!',
        tags: 'conjunto colete, alfaiataria feminina, look verão chic, unboxing, tiktok shop',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP / SHOPEE - 18 SEGUNDOS]

🎬 CENA 1 (0-3s) - O UNBOXING DOS SONHOS (HOOK):
- Abertura da caixa, retirando o conjunto dobrado com papel de seda impecável.
- Texto na tela: "COMPREI NA SHOPEE E CHOQUEI 😱👗"
- Narração: "Eu paguei menos de 70 reais nesse conjunto de alfaiataria e quando abri a caixa achei que tinham me mandado por engano de uma loja de shopping!"

🎬 CENA 2 (3-8s) - ACABAMENTO INTERNO & BOTÕES:
- Close nos botões forrados do mesmo tecido do colete (sem plástico barato à mostra).
- Mostrando a costura interna embutida e forro duplo no busto.
- Narração: "Olha o nível dos botões forrados e o corte do shorts com bolso faca que não abre quando a gente senta."

🎬 CENA 3 (8-13s) - NO MANEQUIM OU NO CORPO:
- Transição rápida mostrando o conjunto completo vestido: cintura alta bem marcada e decote do colete na medida.
- Narração: "Fica impecável com rasteirinha pro dia ou salto fino pro jantar."

🎬 CENA 4 (13-18s) - CTA:
- Apontando pro carrinho/sacola:
- Narração: "Tem em 4 cores chiques. O link tá aqui embaixo no vídeo, aproveita o preço de lançamento!"`,
      },
      // 18. Moda Praia - Unboxing
      {
        title: 'Kit 3 Biquínis Canelados Sortidos - Unboxing Vitrine Comparativo',
        description:
          'Abrindo o pacote com 3 biquínis com cores da estação, esticando o elastano e mostrando costuras reforçadas.',
        niche: 'moda_praia',
        style: 'unboxing_vitrine',
        platform: 'shopee',
        is_free: false,
        hook: 'Comprei o kit de 3 biquínis mais barato da Shopee: VALE A PENA OU É FURADA?',
        call_to_action:
          'Kit com 3 conjuntos completos por menos de R$ 90. Link seguro na sacolinha!',
        tags: 'kit biquíni, moda praia, unboxing shopee, achadinhos, verão',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 20 SEGUNDOS]

🎬 CENA 1 (0-3s) - CURIOSIDADE DE PREÇO (HOOK):
- Segurando a embalagem com os 3 biquínis coloridos organizados.
- Texto na tela: "3 BIQUÍNIS POR MENOS DE R$ 90? 👙📦"
- Narração: "Será que esse kit com 3 biquínis da Shopee tem qualidade real ou é tecido fino que fica transparente?"

🎬 CENA 2 (3-9s) - O TESTE DA ELASTICIDADE:
- Abrindo o primeiro biquíni (verde oliva canelado): esticando o tecido com as duas mãos sob luz forte.
- Mostrando o forro duplo na calcinha e no top com bojo removível.
- Narração: "Gente, o tecido é suplex canelado grosso! O forro é 100% poliamida, não fica transparente quando molha e as costuras são embutidas."

🎬 CENA 3 (9-14s) - OS OUTROS DOIS MODELOS DO KIT:
- Mostrando o segundo (terracota asa delta) e o terceiro (off-white cortininha com ponteiras douradas).
- Narração: "Você ganha três opções de looks completamente diferentes pra viagem pelo preço de um biquíni de praia avulso."

🎬 CENA 4 (14-20s) - CTA:
- Segurando a embalagem pronta pra envio rápido:
- Narração: "O vendedor enviou no dia seguinte da compra. Clica na sacolinha aqui do vídeo antes que acabe a promoção do kit!"`,
      },
    ]

    for (let i = 0; i < newPrompts.length; i++) {
      const p = newPrompts[i]
      // Verificar se já existe por título para ser 100% idempotente
      const existing = app.findRecordsByFilter(
        'prompts',
        `title = '${p.title.replace(/'/g, "''")}'`,
        '',
        1,
        0,
      )
      if (existing && existing.length > 0) {
        continue // Já existe, pula
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
      rec.set('prompt_text', p.prompt_text)
      app.save(rec)
    }
  },
  (app) => {
    // rollback opcional
  },
)
