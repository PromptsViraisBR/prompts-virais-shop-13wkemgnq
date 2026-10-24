/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const promptsCol = app.findCollectionByNameOrId('prompts')

    const proPromptsPart9 = [
      // 91. Moda Feminina - PRO
      {
        title:
          'Calça Jeans Flare Cintura Alta com Pala Traseira Empina Glúteo - Modelo Provador Luz Natural',
        description:
          'Modelo caminhando no provador com calça jeans flare boca de sino que alonga as pernas, com pala traseira modeladora em formato de coração.',
        niche: 'moda_feminina',
        style: 'modelo',
        platform: 'shopee',
        is_free: false,
        hook: 'O jeans flare que alonga suas pernas em 10cm e empina o bumbum sem precisar de cirurgia!',
        call_to_action:
          'Jeans com 3% elastano com pala coração e barra flare ampla. Link seguro na sacolinha!',
        tags: 'calca flare jeans, alonga as pernas, empina gluteo, shopee achados',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=high+waisted+flare+jeans+woman+heels+fitting+room&color=blue',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - O EFEITO VISUAL DE PERNAS LONGAS (HOOK):
- Passada firme da modelo com salto alto e a barra da flare cobrindo o sapato: efeito de silhueta ultra longilínea instantânea.
- Texto na tela: "ALONGA AS PERNAS EM 10CM! 👖👠"
- Narração de impacto: "Se você quer parecer mais alta e magra com uma única peça de roupa, o molde dessa flare foi desenhado pra você!"

🎬 CENA 2 (3-8s) - A PALA TRASEIRA EM CORAÇÃO QUE LEVANTA O BUMBUM:
- Close na costura traseira curva que contorna os glúteos e projeta o formato para cima.
- Narração: "A costura da pala em formato de coração cria o efeito empina bumbum imediato sem apertar os quadris."

🎬 CENA 3 (8-13s) - O JEANS COM 3% DE ELASTANO PREMIUM:
- Agachando e levantando: a calça estica confortavelmente sem travar os joelhos nem descer na cintura.
- Narração: "Tem 3% de elastano de alta recuperação: você senta o dia todo no escritório e ela continua no lugar sem lacear."

🎬 CENA 4 (13-17s) - A BOCA FLARE EQUILIBRADA:
- Mostrando a abertura da barra a partir do joelho que equilibra visualmente a proporção do quadril.
- Narração: "A abertura flare equilibra a largura dos quadris e cria aquela harmonia de corpo de violão."

🎬 CENA 5 (17-22s) - CTA:
- Apontando para a sacolinha da Shopee:
- Narração: "Grade de tamanhos do 36 ao 46 na sacolinha oficial da Shopee com frete grátis hoje. Clica e aproveite o cupom!"`,
      },
      // 92. Moda Feminina - PRO
      {
        title:
          'Blusa em Tricot Modal Canelado com Mangas Princesa e Gola Redonda - POV Trabalho Escritório',
        description:
          'POV entrando no escritório com blusa de tricot modal canelado em tom bege areia com mangas bufantes delicadas e toque macio.',
        niche: 'moda_feminina',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'POV: A blusa de tricot modal que te deixa arrumada pro trabalho em 1 minuto sem precisar passar a ferro!',
        call_to_action: 'Fio modal toque de cashmere que não amassa. Link no carrinho amarelo!',
        tags: 'blusa tricot modal, manga princesa, look trabalho elegante, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=ribbed+knit+puff+sleeve+top+woman+office+chic&color=orange',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - A PRATICIDADE DE NÃO PASSAR A FERRO (HOOK):
- POV tirando a blusa de tricot da gaveta e vestindo direto no corpo: perfeitamente lisa, sem nenhum amassado.
- Texto na tela: "ZERO FERRO DE PASSAR! 🧶✨"
- Narração cúmplice: "POV: O dia em que você acordou atrasada pro trabalho e descobriu a blusa de tricot modal que sai da gaveta impecável!"

🎬 CENA 2 (3-8s) - O TOQUE AVELUDADO DO FIO MODAL:
- Mão acariciando o peito da blusa sob a luz da janela: toque sedoso comparável a cashmere nobre.
- Narração: "Fio modal de alta qualidade com elasticidade confortável que se molda ao corpo sem marcar dobrinhas."

🎬 CENA 3 (8-13s) - AS MANGAS BUFANTES ELASTICIZADAS:
- Close nos punhos canelados longos que mantêm o volume da manga princesa armado de forma delicada.
- Narração: "As mangas bufantes dão elegância imediata e os punhos justos não sobem quando você digita no computador."

🎬 CENA 4 (13-17s) - COMBINAÇÃO COM CALÇA ALFAIATARIA OU JEANS:
- Look completo com calça de pregas e cinto fino dourado: visual executivo sofisticado.
- Narração: "Combina perfeitamente com calça de alfaiataria ou saia lápis."

🎬 CENA 5 (17-22s) - CTA:
- Apontando para o carrinho amarelo:
- Narração: "Cores neutras e pastéis no carrinho amarelo do TikTok Shop com frete grátis nacional. Garanta a sua!"`,
      },
      // 93. Moda Masculina - PRO
      {
        title:
          'Camisa Social Masculina Não Amassa (Non-Iron) em Algodão Pima - POV Reunião Executiva',
        description:
          'POV descendo do carro e tirando o cinto de segurança: a camisa social branca continua 100% lisa e esticada sem nenhum vinco.',
        niche: 'moda_masculina',
        style: 'pov',
        platform: 'shopee',
        is_free: false,
        hook: 'POV: A camisa social que NÃO AMASSA mesmo depois de 2 horas dirigindo no trânsito!',
        call_to_action:
          'Tecnologia Non-Iron com 100% algodão de fibra longa e gola com barbatana. Link na sacolinha!',
        tags: 'camisa non iron, nao amassa, social executiva masculina, shopee achados',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=wrinkle+free+white+dress+shirt+man+office+car&color=white',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 23 SEGUNDOS]

🎬 CENA 1 (0-3s) - O TESTE REAL DO CINTO DE SEGURANÇA (HOOK):
- POV tirando o cinto do carro antes de entrar na reunião: o peito da camisa social branca continua impecavelmente esticado e sem rugas!
- Texto na tela: "NÃO AMASSA DEPOIS DE DIRIGIR! 👔🚗"
- Narração impressionada: "POV: O dia em que você descobriu a camisa social que não amassa e nunca mais precisou passar vergonha com camisa amarrotada no trabalho!"

🎬 CENA 2 (3-9s) - A TECNOLOGIA NON-IRON MOLECULAR:
- Amassando o tecido da manga com força na mão fechada por 5 segundos e soltando: o tecido desamassa sozinho com o calor do corpo!
- Narração: "Tratamento de fibras moleculares non-iron: o próprio calor do seu corpo desfaz qualquer vinco superficial."

🎬 CENA 3 (9-14s) - BARBATANAS REMOVÍVEIS NA GOLA:
- Mostrando a firmeza do colarinho que não dobra sob o paletó graças às barbatanas embutidas.
- Narração: "O colarinho tem barbatanas internas que mantêm a gola firme mesmo sem gravata e os botões têm costura cruzada reforçada."

🎬 CENA 4 (14-18s) - TECIDO RESPIRÁVEL ANTI-SUOR:
- Algodão nobre com toque fresco que não esquenta nos dias quentes de escritório.
- Narração: "Algodão puro respirável que não fica abafado com o ar-condicionado."

🎬 CENA 5 (18-23s) - CTA:
- Apontando para o link da sacolinha da Shopee:
- Narração: "Peça essencial para qualquer profissional na sacolinha oficial aqui da Shopee com cupom de desconto hoje!"`,
      },
      // 94. Moda Masculina - PRO
      {
        title:
          'Bermuda Sarja Masculina com Ajuste por Cordão Embutido e Bolsos Faca - Modelo Praia / Almoço',
        description:
          'Modelo caminhando no calçadão à beira-mar com bermuda sarja bege clara com elástico discreto na cintura e cordão interno.',
        niche: 'moda_masculina',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'A bermuda de sarja que tem a elegância de uma chino com o conforto de um moletom!',
        call_to_action:
          'Sarja leve com 3% elastano e cós com cordão embutido. Link no carrinho amarelo!',
        tags: 'bermuda sarja elastano, casual chic masculino, verao confortavel, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=casual+chino+shorts+drawstring+man+beach+walk&color=orange',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - O HÍBRIDO PERFEITO DO CONFORTO COM ESTILO (HOOK):
- Passada do modelo com a bermuda sarja areia e camisa de linho aberta, tênis branco e postura descontraída de verão.
- Texto na tela: "ELEGÂNCIA SEM APERTAR A BARRIGA 🩳🌴"
- Narração com estilo: "A bermuda que resolve o problema de quem quer andar alinhado no almoço de domingo sem ter um botão de metal machucando a cintura!"

🎬 CENA 2 (3-8s) - O CÓS ELÁSTICO COM CORDÃO INTERNO:
- Mão puxando a lateral da cintura: elástico anatômico embutido com cordão que pode ser amarrado por dentro ou por fora.
- Narração: "O cós tem elástico suave e cordão interno: você come à vontade no churrasco sem precisar abrir o botão da bermuda."

🎬 CENA 3 (8-13s) - SARJA PELETIZADA LEVE COM ELASTANO:
- Puxando a barra da perna: elasticidade que permite sentar e cruzar as pernas sem repuxar na virilha.
- Narração: "Sarja com toque macio e 3% de elastano que não esquenta no sol do meio-dia."

🎬 CENA 4 (13-17s) - BOLSOS FACA PROFUNDOS E BOLSO TRASEIRO COM BOTÃO:
- Guardando a carteira e o celular com segurança.
- Narração: "Bolsos funcionais com profundidade real pra não derrubar suas coisas no banco do carro."

🎬 CENA 5 (17-22s) - CTA:
- Modelo apontando para o carrinho amarelo:
- Narração: "Cores areia, azul marinho, cáqui e preto no carrinho amarelo do TikTok Shop com frete grátis hoje!"`,
      },
      // 95. Fitness & Academia - PRO
      {
        title:
          'Camiseta de Compressão Masculina Manga Curta Efeito Armadura - Modelo Treino Pesado',
        description:
          'Modelo atlético executando supino na academia com camiseta de compressão que desenha o peitoral, bíceps e melhora a postura dos ombros.',
        niche: 'fitness_academia',
        style: 'modelo',
        platform: 'shopee',
        is_free: false,
        hook: 'A camiseta de compressão que te deixa com visual de super-herói na academia!',
        call_to_action:
          'Tecido compressivo de alta densidade com costura flatlock anti-atrito. Link na sacolinha!',
        tags: 'camiseta compressao masculina, efeito armadura, treino pesado, gymtok, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=compression+shirt+man+gym+muscular+workout&color=black',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - O GANCHO DO FÍSICO ESCULPIDO (HOOK):
- Modelo terminando a série de supino e levantando com a camiseta preta de compressão desenhando cada linha muscular do peito e ombros.
- Texto na tela: "EFEITO ARMADURA NO TREINO 💪🔥"
- Narração enérgica: "Se você quer uma camiseta de treino que aperte o abdômen, valorize o peitoral e te dê sensação de armadura nos treinos pesados, olha essa peça!"

🎬 CENA 2 (3-8s) - A COMPRESSÃO MUSCULAR E CORREÇÃO POSTURAL:
- Close no painel dorsal em formato de X que puxa os ombros levemente para trás ajudando na postura durante os levantamentos.
- Narração: "A compressão direcionada melhora o fluxo sanguíneo nos músculos e puxa os ombros para trás corrigindo a postura durante as séries."

🎬 CENA 3 (8-13s) - COSTURAS PLANAS FLATLOCK ANTI-ASSADURA:
- Close nas costuras: sem relevos internos para evitar qualquer atrito na pele sob suor intenso.
- Narração: "Costura flatlock plana que não assa as axilas e tecido de secagem ultrarrápida que evapora o suor."

🎬 CENA 4 (13-17s) - BARRA COM SILICONE ANTIDERRAPANTE:
- Levantando os braços no alto: a barra da camiseta fica travada na cintura sem subir na barriga.
- Narração: "Tem fita interna de silicone na barra pra não ficar subindo quando você faz puxadas ou barras."

🎬 CENA 5 (17-22s) - CTA:
- Modelo apontando para a sacolinha da Shopee:
- Narração: "Preço direto de fábrica por menos de R$ 38 na sacolinha oficial aqui da Shopee com envio imediato!"`,
      },
      // 96. Moda Praia - PRO
      {
        title:
          'Biquíni Manga Longa Cropped com Zíper Frontal e Proteção Solar UV50+ - Modelo Surf & Mergulho',
        description:
          'Modelo saindo do mar com prancha de surf e biquíni cropped de manga longa com zíper frontal que protege os ombros do sol forte.',
        niche: 'moda_praia',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'O biquíni manga longa com proteção UV50+ que protege seus ombros de queimadura de sol!',
        call_to_action:
          'Tecido tecnológico com barreira UV50+ permanente e zíper com trava. Link no carrinho amarelo!',
        tags: 'biquini manga longa, protecao uv50, surf feminino, moda praia esporte, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=long+sleeve+surf+bikini+rashguard+woman+beach&color=blue',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 23 SEGUNDOS]

🎬 CENA 1 (0-3s) - O PROBLEMA DO OMBRO VERMELHO DE SOL (HOOK):
- Modelo com prancha de surf saindo da água com cropped de manga longa estampado e pele dos ombros totalmente intacta e protegida.
- Texto na tela: "ZERO QUEIMADURA DE SOL! ☀️🏄‍♀️"
- Narração envolvente: "Você ama passar o dia todo na praia mas odeia voltar pra casa com os ombros em carne viva de queimadura de sol? Olha esse biquíni!"

🎬 CENA 2 (3-9s) - A BARREIRA SOLAR UV50+ NO PRÓPRIO FIO:
- Mostrando a etiqueta de certificação do tecido tecnológico com bloqueio de 98% dos raios UVA e UVB.
- Narração: "A proteção UV50+ é injetada no próprio fio do tecido: não sai nas lavagens e protege sua pele sem precisar reaplicar protetor a cada 30 minutos."

🎬 CENA 3 (9-14s) - O ZÍPER FRONTAL COM TRAVA ANTIDERRAPANTE:
- Mão fechando o zíper frontal: permite usar mais aberto com decote ou fechado até a gola para mergulhar em ondas fortes sem sair do corpo.
- Narração: "O zíper frontal tem trava segura pra não abrir com a força das ondas e forro anatômico no busto."

🎬 CENA 4 (14-18s) - CALCINHA ASA DELTA COM FORRO DUPLO:
- Mostrando a calcinha combinando que valoriza a silhueta da perna com conforto total.
- Narração: "Calcinha com forro duplo que não junta areia e seca super rápido no vento."

🎬 CENA 5 (18-23s) - CTA:
- Modelo sorrindo e apontando para o carrinho amarelo:
- Narração: "O queridinho das surfistas e praticantes de beach tennis no carrinho amarelo do TikTok Shop com frete grátis hoje!"`,
      },
      // 97. Calçados & Acessórios - PRO
      {
        title: 'Tênis Slip On Feminino em Knit Respirável sem Cadarço - POV Caminhada Dia a Dia',
        description:
          'POV calçando o tênis slip on em 2 segundos sem precisar abaixar para amarrar, com palmilha de memória e solado com amortecimento.',
        niche: 'acessorios_calcados',
        style: 'pov',
        platform: 'shopee',
        is_free: false,
        hook: 'POV: O tênis slip on que você calça em 2 segundos sem cadarço e parece que tá descalça na nuvem!',
        call_to_action:
          'Tecido knit elástico com palmilha de espuma de memória. Link seguro na sacolinha!',
        tags: 'tenis slip on, sem cadarco, conforto dia a dia, palmilha memoria, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=slip+on+knit+sneakers+woman+walking+comfort&color=pink',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - A FACILIDADE DE CALÇAR EM PÉ (HOOK):
- POV em pé na porta de casa: desliza o pé dentro do tênis slip on sem usar as mãos e sem precisar amarrar nenhum cadarço!
- Texto na tela: "CALÇA EM 2 SEGUNDOS SEM CADARÇO! 👟☁️"
- Narração empolgada: "POV: O dia em que você aposentou os tênis duros com cadarço e comprou o modelo de knit mais confortável da sua vida!"

🎬 CENA 2 (3-8s) - O TECIDO KNIT MEIA ELÁSTICO:
- Esticando o colarinho com os dedos: abraça o tornozelo com suavidade de uma meia grossa sem apertar o peito do pé.
- Narração: "O cabedal em malha knit respira o dia todo, não dá chulé e se molda a joanetes ou pés mais gordinhos sem apertar."

🎬 CENA 3 (8-13s) - A PALMILHA MEMORY FOAM ULTRA MACIA:
- Polegar afundando na palmilha de 1cm com espuma de memória que absorve todo o impacto dos passos.
- Narração: "A palmilha memoriza o formato do seu pé e amortece o impacto de quem passa o dia todo trabalhando em pé."

🎬 CENA 4 (13-17s) - PESO PENA DE MENOS DE 180 GRAMAS:
- Segurando o calçado na ponta de um dedo: ultraleve e flexível a ponto de dobrar ao meio.
- Narração: "Pesa menos que um celular! Ideal pra caminhadas, viagens e plantões de trabalho."

🎬 CENA 5 (17-22s) - CTA:
- Apontando delicadamente para a sacolinha da Shopee:
- Narração: "Mais de 30 mil pares vendidos com nota 4.9 na sacolinha oficial aqui da Shopee com frete grátis hoje!"`,
      },
      // 98. Streetwear & Casual - PRO
      {
        title:
          'Calça Cargo Feminina com Correntes Removíveis e Cintura Dupla - POV Show / Festival',
        description:
          'POV se arrumando para festival de música com calça cargo preta com correntes prateadas na cintura, tecido ripstop e bolsos táticos.',
        niche: 'streetwear_casual',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'POV: A calça cargo com correntes que vai fazer seu look de festival ser o mais fotografado do dia!',
        call_to_action:
          'Correntes de aço niquelado removíveis com tecido ripstop de alta durabilidade. Link no carrinho amarelo!',
        tags: 'calca cargo correntes, look festival, rave streetwear, cintura dupla, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=cargo+pants+chains+woman+festival+streetwear&color=black',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 23 SEGUNDOS]

🎬 CENA 1 (0-3s) - O SOM DAS CORRENTES NO ROLÊ (HOOK):
- POV em frente ao espelho dando um giro com a calça cargo preta: as correntes prateadas laterais tilintam com atitude rocker e visual impactante.
- Texto na tela: "LOOK DE FESTIVAL MAIS ELOGIADO ⛓️🖤"
- Narração empoderada: "POV: Você precisava de uma calça marcante pra ir no festival de música e achou a peça que dominou as fotos do rolê!"

🎬 CENA 2 (3-9s) - AS CORRENTES REMOVÍVEIS POR MOSQUETÃO:
- Mão tirando e colocando os mosquetões prateados na presilha: facilidade total para lavar a calça na máquina sem estragar as correntes.
- Narração: "As correntes são presas por mosquetões resistentes: na hora de lavar a calça você tira em 5 segundos sem dor de cabeça."

🎬 CENA 3 (9-14s) - CINTURA DUPLA COM ELÁSTICO E PASSADORES:
- Mostrando a modelagem de cintura alta que segura o abdômen e permite usar com cropped curto ou body cavado.
- Narração: "A cintura tem detalhe duplo que valoriza a linha do abdômen e os bolsos fole têm espaço de sobra pra levar powerbank e celular."

🎬 CENA 4 (14-18s) - BARRA COM AJUSTE DE PUNHO:
- Regulando o tornozelo sobre coturno tratorado preto.
- Narração: "Fica impecável com coturno pesado ou tênis plataforma."

🎬 CENA 5 (18-23s) - CTA:
- Apontando para o carrinho amarelo:
- Narração: "Mais de 10 mil vídeos no TikTok usando esse modelo. Clica no carrinho amarelo aqui embaixo e garanta o seu tamanho antes do próximo evento!"`,
      },
      // 99. Infantil & Kids - PRO
      {
        title:
          'Casaco Infantil Corta-Vento com Forro Polar e Estampa Divertida - POV Parquinho Frio',
        description:
          'POV mãe vestindo a criança com casaco corta-vento quentinho com forro polar interno, capuz ajustável e estampa alegre de dinossauro/arco-íris.',
        niche: 'infantil_kids',
        style: 'pov',
        platform: 'shopee',
        is_free: false,
        hook: 'POV: O casaco infantil que protege seu filho do vento gelado e não deixa ele passar frio no parquinho!',
        call_to_action:
          'Tecido corta-vento impermeável com forro interno de microfleece polar. Link na sacolinha!',
        tags: 'casaco infantil corta vento, forro polar, crianca parquinho, shopee achados',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=kids+windbreaker+fleece+lined+jacket+park+colorful&color=yellow',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - A PROTEÇÃO DA CRIANÇA NO PARQUINHO (HOOK):
- POV com a criança correndo alegre no parquinho com ventinho gelado de outono, vestindo o casaco com capuz quentinho.
- Texto na tela: "PROTEGIDO DO VENTO GELADO! 🍂🧸"
- Narração amorosa de mãe: "POV: O dia em que você comprou um casaco corta-vento com forro polar e nunca mais teve medo do seu pequeno gripar brincando na rua!"

🎬 CENA 2 (3-8s) - O FORRO POLAR SUPER QUENTINHO:
- Mãe abrindo o casaco para a câmera: interior totalmente revestido com tecido polar aveludado térmico.
- Narração: "Por fora ele corta o vento e repele a garoa, e por dentro tem forro polar super fofinho que mantém o peitinho aquecido."

🎬 CENA 3 (8-13s) - CAPUZ ANATÔMICO QUE NÃO CAI COM O VENTO:
- Ajustando o capuz na cabecinha da criança com elástico suave na borda.
- Narração: "O capuz tem elástico que não deixa o vento soprar a touca pra trás enquanto ele corre."

🎬 CENA 4 (13-17s) - ZÍPER COM PUXADOR INFANTIL GRANDE:
- A criança puxando o zíper sozinha graças ao chaveiro emborrachado grande.
- Narração: "O puxador é emborrachado pra mãozinha da criança conseguir abrir e fechar sozinha na escolinha."

🎬 CENA 5 (17-22s) - CTA:
- Mãe e filho mandando tchauzinho e apontando para a sacolinha:
- Narração: "Tamanhos do 2 ao 10 anos na sacolinha oficial aqui da Shopee com frete grátis hoje. Escolha a estampa do seu pequeno!"`,
      },
      // 100. Lingerie & Pijamas - PRO
      {
        title:
          'Roupão Kimono Longo de Cetim com Detalhes em Renda Francesa - Modelo Noiva / Dia de Noiva',
        description:
          'Modelo em quarto de hotel luxuoso vestindo robe de cetim com mangas amplas bordadas com renda delicada, faixa de amarração e caimento nobre.',
        niche: 'lingerie_pijamas',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'O robe de cetim com renda francesa que te faz parecer uma rainha no seu dia de noiva ou em casa!',
        call_to_action:
          'Cetim gloss toque de seda com renda chantilly aplicada à mão. Link no carrinho amarelo!',
        tags: 'robe cetim noiva, dia de noiva, kimono cetim renda, loungewear luxo, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=satin+bridal+robe+lace+sleeves+woman+hotel+luxury&color=white',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 23 SEGUNDOS]

🎬 CENA 1 (0-3s) - A ELEGÂNCIA DO DIA DE NOIVA (HOOK):
- Modelo com taça de espumante em varanda de hotel com o robe longo branco perolado, a manga de renda bordada balançando com a brisa.
- Texto na tela: "LOOK DE NOIVA POR R$ 48 👰🥂"
- Narração refinada: "Se você é noiva, madrinha ou simplesmente ama começar o dia se sentindo a mulher mais elegante do planeta, olha esse robe!"

🎬 CENA 2 (3-9s) - O TOQUE DO CETIM COM CAIMENTO FLUIDO:
- Deslizando a mão pelo cetim: brilho sutil sofisticado sem aquele efeito plastificado artificial.
- Narração: "Cetim encorpado de alta densidade que tem toque sedoso, peso que não voa no corpo e caimento fluido impecável pras fotos."

🎬 CENA 3 (9-14s) - AS MANGAS SINO COM RENDA CHANTILLY:
- Close nas mangas amplas bordadas com renda floral transparente de alta delicadeza.
- Narração: "As mangas têm acabamento em renda chantilly super macia que não repuxa fios e a faixa na cintura é larga pra um laço perfeito."

🎬 CENA 4 (14-18s) - CORDÃO INTERNO ANTI-ABERTURA:
- Mostrando a fitinha interna que mantém o roupão fechado com segurança mesmo se a faixa externa afrouxar.
- Narração: "Tem amarração interna de segurança pra não abrir acidentalmente enquanto você se maquia."

🎬 CENA 5 (18-23s) - CTA:
- Modelo sorrindo e sinalizando para o carrinho amarelo:
- Narração: "Cores branco noiva, rosé, champagne e preto no carrinho amarelo do TikTok Shop com frete grátis nacional. Garanta o seu!"`,
      },
      // 101. Moda Feminina - PRO
      {
        title:
          'Colete Feminino Acolchoado em Matelassê com Bolsos e Zíper Dourado - POV Caminhada Outono',
        description:
          'POV caminhando no parque arborizado com colete em matelassê geométrico, gola alta confortável e bolsos térmicos.',
        niche: 'moda_feminina',
        style: 'pov',
        platform: 'shopee',
        is_free: false,
        hook: 'POV: O colete matelassê de R$ 49 que te deixa chique e quentinha nos dias frios!',
        call_to_action:
          'Matelassê com enchimento térmico leve e zíper dourado que não trava. Link na sacolinha!',
        tags: 'colete matelasse, outono inverno, look parque chic, shopee achados',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=quilted+vest+woman+autumn+park+walking&color=orange',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - O CHARME DAS CAMADAS DE OUTONO (HOOK):
- POV caminhando por uma alameda de folhas de outono com colete matelassê bege sobre tricot branco e xícara de café na mão.
- Texto na tela: "A TERCEIRA PEÇA DO OUTONO 🍂☕"
- Narração aconchegante: "POV: O dia em que você descobriu a terceira peça perfeita que esquenta o tronco sem tirar a liberdade dos seus braços!"

🎬 CENA 2 (3-8s) - A COSTURA GEOMÉTRICA DO MATELASSÊ:
- Close nos losangos do matelassê com pespontos precisos e acabamento acetinado elegante.
- Narração: "Costura de matelassê com pesponto duplo e enchimento térmico levinho que não te deixa parecendo inflada."

🎬 CENA 3 (8-13s) - OS BOLSOS TÉRMICOS E ZÍPER METÁLICO DOURADO:
- Mãos dentro dos bolsos forrados com flanelinha macia para aquecer os dedos no frio.
- Narração: "Os bolsos laterais têm forro quentinho pra esquentar as mãos e o zíper dourado corre suavemente."

🎬 CENA 4 (13-17s) - GOLA ALTA QUE PROTEGE A GARGANTA:
- Fechando até o topo: gola anatômica acolchoada que bloqueia o vento gelado no pescoço.
- Narração: "A gola alta acolchoada dispensa o uso de cachecol nos dias de vento."

🎬 CENA 5 (17-22s) - CTA:
- Apontando delicadamente para a sacolinha da Shopee:
- Narração: "Disponível em tons neutros maravilhosos na sacolinha oficial aqui da Shopee com frete grátis no app hoje!"`,
      },
      // 102. Moda Masculina - PRO
      {
        title:
          'Camiseta Longline Masculina com Barra Curva em Algodão Penteado - Modelo Urbano Street',
        description:
          'Modelo caminhando com camiseta longline com comprimento alongado e barra curva, ideal para sobreposição sob casacos e jaquetas.',
        niche: 'moda_masculina',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'A camiseta longline com caimento perfeito que alonga o tronco e não fica parecendo vestido!',
        call_to_action:
          '100% algodão penteado com barra arredondada costurada em pesponto duplo. Link no carrinho amarelo!',
        tags: 'camiseta longline, barra curva, moda masculina streetwear, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=longline+curved+hem+tshirt+man+urban+street&color=black',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - O PROBLEMA DO LONGLINE EXAGERADO (HOOK):
- Passada do modelo com a camiseta longline preta com caimento impecável cobrindo o cinto da calça sem passar do meio do quadril.
- Texto na tela: "O LONGLINE NA MEDIDA CERTA! 👕🔥"
- Narração direta: "Se você curte o estilo longline mas odeia quando a camiseta parece um vestido de tão comprida, veja a proporção dessa peça!"

🎬 CENA 2 (3-8s) - A BARRA CURVA ANATÔMICA:
- Close na curvatura da barra frontal e traseira que alonga visualmente a silhueta sem afunilar as pernas.
- Narração: "A barra curva alonga o tronco de forma sutil e fica perfeita pra fazer aquela sobreposição estilosa aparecendo por baixo de casacos."

🎬 CENA 3 (8-13s) - ALGODÃO PENTADO 30.1 QUE NÃO ENCOLHE:
- Mão puxando a malha: elasticidade natural da fibra do algodão que não deforma na máquina de lavar.
- Narração: "Algodão 30.1 penteado pré-encolhido: pode lavar na máquina que ela não vira um quadrado no comprimento."

🎬 CENA 4 (13-17s) - GOLA COM REFORÇO OMBRO A OMBRO:
- Mostrando a costura interna da gola reforçada com fita de algodão.
- Narração: "Gola firme que não afrouxa e caimento justo no braço com caimento solto no abdômen."

🎬 CENA 5 (17-22s) - CTA:
- Modelo apontando para o carrinho amarelo:
- Narração: "Kit com 3 camisetas no carrinho amarelo do TikTok Shop com envio expresso. Aproveite o preço de lançamento!"`,
      },
      // 103. Fitness & Academia - PRO
      {
        title:
          'Calça Legging com Saia Embutida e Bolso Lateral - POV Caminhada Terceira Idade / Modesta',
        description:
          'POV praticando caminhada ao ar livre com legging confortável com saia sobreposta integrada que garante discrição e bolso para celular.',
        niche: 'fitness_academia',
        style: 'pov',
        platform: 'shopee',
        is_free: false,
        hook: 'POV: A legging com saia embutida que não marca nada e te dá total segurança pra caminhar!',
        call_to_action:
          'Tecido suplex grosso com saia cobrindo o quadril e bolso lateral. Link na sacolinha da Shopee!',
        tags: 'legging com saia, moda fitness modesta, caminhada ao ar livre, shopee achados',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=skirted+leggings+woman+walking+park+modest+fitness&color=black',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - A TRANQUILIDADE DA DISCREÇÃO NO EXERCÍCIO (HOOK):
- POV caminhando pelo parque arborizado com a legging preta com saia integrada cobrindo suavemente a região do quadril.
- Texto na tela: "TOTAL SEGURANÇA PRA CAMINHAR 🚶‍♀️🌸"
- Narração acolhedora: "POV: O dia em que você encontrou a legging com saia que cobre o quadril com total discrição e conforto pra sua caminhada diária!"

🎬 CENA 2 (3-8s) - A SAIA INTEGRADA QUE NÃO SOBE:
- Mão demonstrando que a sainha é costurada diretamente no cós com tecido leve que não pesa nas pernas.
- Narração: "A sainha sobreposta é costurada no cós: não fica subindo com o vento e cobre bumbum e quadril com total elegância."

🎬 CENA 3 (8-13s) - BOLSO LATERAL PARA CELULAR E CHAVES:
- Colocando o celular no bolso embutido da perna sob a saia:
- Narração: "Tem bolso lateral prático na perna pra guardar celular e chaves com segurança total durante o exercício."

🎬 CENA 4 (13-17s) - CÓS ALTO LARGO QUE NÃO APERTA:
- Mostrando a faixa de cintura alta com elasticidade suave que não aperta a barriga nem desce ao andar.
- Narração: "Cós alto anatômico que segura o abdômen sem prender a respiração."

🎬 CENA 5 (17-22s) - CTA:
- Apontando delicadamente para a sacolinha da Shopee:
- Narração: "Tamanhos do M até o Plus Size na sacolinha oficial aqui da Shopee com cupom de frete grátis hoje!"`,
      },
      // 104. Moda Praia - PRO
      {
        title:
          'Maiô Modelador Frente Única com Drapeado Frontal Disfarça Barriga - Modelo Piscina Resort',
        description:
          'Modelo caminhando na piscina com maiô azul marinho com drapeado frontal transpassado que cria efeito óptico que afina o tronco.',
        niche: 'moda_praia',
        style: 'modelo',
        platform: 'shopee',
        is_free: false,
        hook: 'O maiô drapeado que disfarça qualquer barriguinha e te deixa com silhueta de sereia!',
        call_to_action:
          'Tecido duplo power de compressão com drapeado frontal e bojo anatômico. Link na sacolinha!',
        tags: 'maio drapeado, disfarca barriga, modelador resort, moda praia chic, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=shirred+tummy+control+swimsuit+woman+resort+pool&color=blue',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - O EFEITO DO DRAPEADO MÁGICO (HOOK):
- Passada da modelo saindo da espreguiçadeira com o maiô azul marinho/preto com drapeado frontal impecável e óculos escuros.
- Texto na tela: "DISFARÇA A BARRIGUINHA NA HORA ⏳👙"
- Narração confiante: "Se você tem vergonha de colocar roupa de banho por causa de dobrinhas no abdômen, olha o milagre visual desse maiô!"

🎬 CENA 2 (3-8s) - O DRAPEADO FRONTAL COM EFEITO ÓPTICO:
- Close nas preguinhas diagonais do drapeado que camuflam qualquer volume no abdômen.
- Narração: "O drapeado frontal transpassado cria linhas diagonais que afinam a silhueta e disfarçam a barriguinha de forma imediata."

🎬 CENA 3 (8-13s) - FORRO DUPLO POWER DE COMPRESSÃO:
- Mão tocando a estrutura interna: tecido de sustentação que recolhe e modela sem sufocar o corpo na piscina.
- Narração: "Forro interno de compressão moderada que segura o abdômen e bojo estruturado que dá suporte no busto."

🎬 CENA 4 (13-17s) - CAVA CLÁSSICA QUE NÃO FICA CAVADA DEMAIS:
- Giro mostrando a cobertura elegante do bumbum e pernas com acabamento confortável.
- Narração: "Cava clássica na medida certa pra quem valoriza elegância e discrição no clube ou na praia."

🎬 CENA 5 (17-22s) - CTA:
- Modelo sorrindo e sinalizando para a sacolinha da Shopee:
- Narração: "Mais de 12 mil unidades vendidas com nota máxima na sacolinha oficial da Shopee com frete grátis hoje!"`,
      },
      // 105. Calçados & Acessórios - PRO
      {
        title:
          'Óculos de Sol Polarizado com Armação em Acetato Italiano e Proteção UV400 - POV Direção no Sol',
        description:
          'POV dirigindo contra o sol forte da tarde: ao colocar os óculos com lentes polarizadas, o reflexo ofuscante do asfalto some na hora.',
        niche: 'acessorios_calcados',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'POV: O teste da lente polarizada que ELIMINA todo o reflexo do sol no asfalto e protege seus olhos!',
        call_to_action:
          'Lentes polarizadas TAC UV400 com armação em acetato premium e dobradiça de metal. Link no carrinho amarelo!',
        tags: 'oculos polarizado, protecao uv400, direcao segura, acetato italiano, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=polarized+sunglasses+man+driving+car+sunset&color=black',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 23 SEGUNDOS]

🎬 CENA 1 (0-3s) - O TESTE VISUAL DO REFLEXO SUMINDO (HOOK):
- POV pelo para-brisa do carro com o sol refletindo forte e ofuscante no capô e asfalto. A câmera passa por trás da lente do óculos: o reflexo desaparece instantaneamente e a visão fica ultra nítida e confortável!
- Texto na tela: "O REFLEXO SOME NA HORA! 🕶️🚗"
- Narração com autoridade: "POV: O dia em que você descobriu a diferença entre um óculos escuro de plástico barato e uma verdadeira lente polarizada!"

🎬 CENA 2 (3-9s) - O TESTE DO CARTÃO POLARIZADO INCLUSO:
- Olhando para o cartãozinho de teste que acompanha o óculos: o desenho oculto de peixe/carro aparece magicamente através da lente polarizada.
- Narração: "Acompanha o teste de polarização pra você comprovar na hora que a proteção UV400 e antirreflexo é 100% real."

🎬 CENA 3 (9-14s) - ARMAÇÃO EM ACETATO MACIÇO COM DOBRADIÇA DE METAL:
- Dobrando as hastes: dobradiça tripla de metal inoxidável que não afrouxa nem racha como plástico injetado.
- Narração: "Armação em acetato premium de alta densidade com hastes reforçadas por alma de metal interna."

🎬 CENA 4 (14-18s) - ACOMPANHA ESTOJO RÍGIDO E FLANELA DE MICROFIBRA:
- Mostrando a caixa de luxo com estojo de couro sintético rígido e flanela mágica de limpeza.
- Narração: "Já vem completo com estojo rígido de proteção e flanela para você guardar no carro."

🎬 CENA 5 (18-23s) - CTA:
- Apontando para o carrinho amarelo:
- Narração: "Qualidade de marca de R$ 700 por menos de R$ 59 no carrinho amarelo do TikTok Shop com frete grátis hoje. Garante o seu!"`,
      },
    ]

    for (let i = 0; i < proPromptsPart9.length; i++) {
      const p = proPromptsPart9[i]
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
