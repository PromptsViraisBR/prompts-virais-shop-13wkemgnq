/// <reference path="../pb_data/types.d.ts" />

/**
 * Migração 0025:
 * 1. Expandir os valores permitidos no campo 'niche' da coleção 'generations' para incluir os nichos virais:
 *    - historinhas_frutas, infantil_historinhas, terror_suspense, comedia_engracado, face_swap, asmr_sensorial, animais_falantes
 * 2. Atualizar todos os prompts virais existentes (category = 'virais') para roteiros completos de ~60 segundos
 *    divididos em 6 cenas de até 10 segundos cada (Cena 1 0-10s ... Cena 6 50-60s),
 *    mantendo o vídeo 100% limpo SEM legendas/textos desenhados na tela e narração em PT-BR.
 */

migrate(
  (app) => {
    // 1. Expandir niche em generations
    const generationsCol = app.findCollectionByNameOrId('generations')
    const genNicheField = generationsCol.fields.getByName('niche')
    const expandedNiches = [
      'moda_feminina',
      'moda_masculina',
      'fitness_academia',
      'moda_praia',
      'acessorios_calcados',
      'streetwear_casual',
      'infantil_kids',
      'lingerie_pijamas',
      'espelhos_decoracao',
      'produtos_eletronicos',
      'capinhas_acessorios_celular',
      'moda_fitness_plus_size',
      'pet_acessorios',
      'cozinha_utilidades',
      'relogios_bijus',
      // Nichos Virais
      'historinhas_frutas',
      'infantil_historinhas',
      'terror_suspense',
      'comedia_engracado',
      'face_swap',
      'asmr_sensorial',
      'animais_falantes',
    ]

    if (genNicheField) {
      genNicheField.values = expandedNiches
      genNicheField.maxSelect = 1
      app.save(generationsCol)
    }

    // 2. Roteiros Virais Atualizados para ~60s em cenas de 10s
    const viral60sPrompts = [
      // 1. HISTORINHAS DE FRUTAS HUMANOIDES
      {
        title: '🍓 Moranguinho Fofoqueira Descobre o Segredo do Abacaxi',
        description:
          'Roteiro completo de 60 segundos com 6 cenas de 10s: morango fofoqueiro espionando a geladeira e desmascarando a peruca do abacaxi.',
        niche: 'historinhas_frutas',
        style: 'pov',
        platform: 'ambos',
        is_free: true,
        category: 'virais',
        hook: 'POV: O morango fofoqueiro da geladeira flagrou o maior escândalo da fruteira!',
        call_to_action:
          'Para mais fofocas da geladeira, comente qual fruta você quer ver no próximo episódio!',
        tags: 'frutas humanoides, morango falante, historinha 3d, roteiro 60s, cenas 10s, animacao viral',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=cute+anthropomorphic+strawberry+talking+kitchen+3d&color=red',
        prompt_text: `[ROTEIRO VIRAL CRIADORES - 60 SEGUNDOS EM CENAS DE 10S (PT-BR | VÍDEO 100% LIMPO)]
⏱️ DURAÇÃO ALVO: ~60 Segundos (6 Cenas de até 10 segundos cada)
📌 DIRETRIZES ESSENCIAIS:
- Idioma da narração: Português Brasileiro (PT-BR) com voz fina, cômica e fofoqueira
- Visual: Vídeo 100% limpo, SEM legendas gravadas na tela, SEM palavras ou textos renderizados (evitar distorções de IAs de vídeo)
- Narração em áudio contínua e expressiva

🎬 CENA 1 (0-10s) - O FLAGRA NO ESCURO DA GELADEIRA (HOOK):
- Visual: A porta da geladeira se abre na penumbra. Um morango 3D hiper-realista com olhinhos expressivos e bracinhos curtos espia por trás de uma jarra de suco.
- Câmera: Ângulo holandês com zoom lento se aproximando do rosto em choque do morango.
- Narração (PT-BR): "Gente, para tudo e me escuta! São três horas da manhã e eu juro pela minha coroa de folhinhas que acabei de presenciar o maior escândalo da história desta geladeira!"

🎬 CENA 2 (10-20s) - APROXIMAÇÃO SUSPEITA NA SEGUNDA PRATELEIRA:
- Visual: O morango desce escorregando por uma caixa de leite e caminha na pontinha dos pés entre potes de iogurte, desviando de poças de água gelada.
- Câmera: Traveling lateral rente à prateleira acompanhando os passinhos apressados.
- Narração (PT-BR): "Eu percebi uma movimentação estranha lá na gaveta das verduras nobres. Fui andando de mansinho, fingindo que era só uma sobremesa esquecida..."

🎬 CENA 3 (20-30s) - A REVELAÇÃO CHOCANTE DO ABACAXI:
- Visual: Em close dramático, o senhor Abacaxi sentado num pratinho de sobremesa retira a sua coroa de folhas pontudas para coçar a cabeça perfeitamente careca e amarela.
- Câmera: Zoom in veloz no rosto chocado do morango tapando a boca para não rir.
- Narração (PT-BR): "Olha aquilo ali! O todo-poderoso senhor Abacaxi, que se acha o rei da fruteira inteira... a coroa dele é de mentira, uma peruca colada com fita adesiva!"

🎬 CENA 4 (30-40s) - O TESTEMUNHO DA DONA MAÇÃ:
- Visual: Uma maçã gala com cara de deboche se aproxima rolando devagar e acena com as folhinhas confirmando a fofoca com sorriso irônico.
- Câmera: Contra-plano pegando o morango e a maçã cochichando no reflexo da garrafa de água.
- Narração (PT-BR): "A dona Maçã do lado olhou pra mim e disse: 'Eu avisei! Faz duas semanas que essa peruca dele tá descolando no calor da bancada!'"

🎬 CENA 5 (40-50s) - O SUSTO E A FUGA DESENGONÇADA:
- Visual: O abacaxi escuta o barulho das risadinhas, vira bruscamente os olhinhos zangados e dá um rugido cômico de fruta brava. O morango tropeça numa uva roxa e sai correndo desajeitado.
- Câmera: Câmera trêmula acompanhando a perseguição cômica pela prateleira.
- Narração (PT-BR): "Ele ouviu! Socorro, corre todo mundo antes que o falso rei descubra quem vazou o segredo e transforme todo mundo em ponche de frutas!"

🎬 CENA 6 (50-60s) - FECHAMENTO E CHAMADA DE ENGAJAMENTO (CTA):
- Visual: O morango ofegante se esconde dentro da caixa de ovos vazia, pisca com um olhinho cúmplice para a câmera e faz sinal de silêncio com o dedinho.
- Câmera: Close fechado iluminado pela lâmpada amarelada da geladeira.
- Narração (PT-BR): "Escapei por pouco! Comenta aqui embaixo qual fruta você quer que eu espione no próximo episódio e segue o perfil pra não perder a vingança do abacaxi!"`,
      },
      {
        title: '🍌 Banana Revoltada com Roupa Amarela no Provador da Fruteira',
        description:
          'Roteiro completo de 60 segundos com 6 cenas de 10s: a banana modelo fashionista recusando o bolo de caneca e desfilando na bancada da pia.',
        niche: 'historinhas_frutas',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: false,
        category: 'virais',
        hook: 'A banana estilosa se recusando a sair na salada de frutas sem um look de grife!',
        call_to_action: 'Você comeria essa banana estilosa ou deixava ela desfilar? Comente aqui!',
        tags: 'frutas humanoides, banana 3d, roteiro 60s, cenas 10s, animacao piada, shorts virais',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=stylish+anthropomorphic+banana+character+fashion+3d&color=yellow',
        prompt_text: `[ROTEIRO VIRAL CRIADORES - 60 SEGUNDOS EM CENAS DE 10S (PT-BR | VÍDEO 100% LIMPO)]
⏱️ DURAÇÃO ALVO: ~60 Segundos (6 Cenas de até 10 segundos cada)
📌 DIRETRIZES ESSENCIAIS:
- Idioma da narração: Português Brasileiro (PT-BR) estilo influenciadora de moda debochada
- Visual: Vídeo 100% limpo, SEM legendas na tela, SEM textos impressos no vídeo
- Narração em áudio com ritmo afiado e tom irônico

🎬 CENA 1 (0-10s) - O DRAMA DA CASCA MANCHADA NO ESPELHO (HOOK):
- Visual: Banana humanoide com pernas longas e óculos escuros minúsculos encarando o próprio reflexo em uma colher de prata e fazendo beicinho de decepção.
- Câmera: Close dramático no rosto expressivo da banana ajustando a gola.
- Narração (PT-BR): "Duas pintinhas marrons na minha casca dourada e o humano já olha pra mim pensando em bolo de caneca fit? Me poupe, querido, meu valor de mercado acabou de triplicar!"

🎬 CENA 2 (10-20s) - O CLOSET IMPROVISADO NA BANCADA:
- Visual: A banana escolhe acessórios numa caixinha de fósforos: um mini cachecol de guardanapo xadrez e uma jaquetinha preta de couro sintético.
- Câmera: Tomada em plongée mostrando o closet luxuoso montado ao lado do saleiro.
- Narração (PT-BR): "Uma fruta de alta costura não entra em tigela comum. Eu não sou carboidrato pré-treino, eu sou um evento botânico contemporâneo!"

🎬 CENA 3 (20-30s) - O DESFILE DE PASSARELA SOBRE O MÁRMORE:
- Visual: A banana desfila com pose de supermodelo sobre a bancada polida de mármore branco, empurrando com o quadril uma maçã verde invejosa.
- Câmera: Câmera baixa em tracking frontal gravando o passo ritmado de passarela de Paris.
- Narração (PT-BR): "Olha esse caimento natural, essa postura encurvada com elegância! As outras frutas do cesto morrem de inveja porque não sustentam esse amarelo neon!"

🎬 CENA 4 (30-40s) - O ENCONTRO TENSO COM O LIQUIDIFICADOR:
- Visual: A banana para bruscamente de desfilar ao ver o copo de vidro gigante do liquidificador reluzindo no fundo com lâminas afiadas. Ela treme o queixo dramaticamente.
- Câmera: Contra-plano com ângulo contra-plongée assustador do liquidificador monstro.
- Narração (PT-BR): "Aí eu olho pro canto da pia e vejo aquele monstro triturador de sonhos ligado na tomada. Eles querem vitamina? Vão ter que bater gelo com água!"

🎬 CENA 5 (40-50s) - O SUSTO DA MÃO HUMANA E A FAKE ESTÁTUA:
- Visual: Uma mão humana entra no enquadramento segurando uma faca de inox. A banana congela instantaneamente, arregala os olhinhos e faz pose de estátua de museu.
- Câmera: Zoom veloz nos olhinhos da banana suando frio sem piscar.
- Narração (PT-BR): "Finge demência! Respira fundo e vira peça de decoração nórdica! Se ele perceber que eu tenho alma, viro panqueca de aveia em dois minutos!"

🎬 CENA 6 (50-60s) - A FUGA GLAMOUROSA E FECHAMENTO (CTA):
- Visual: A mão humana pega uma laranja e se afasta. A banana solta um suspiro aliviado, ajeita os óculos escuros e manda um beijo de estrela de cinema para a lente.
- Câmera: Câmera se afasta em travelling vertical enquanto ela acena com pose triunfante.
- Narração (PT-BR): "Salva pelo meu bom gosto! E você, teria coragem de comer essa obra de arte ou deixava desfilando na sua cozinha? Comenta aqui e deixa seu like!"`,
      },

      // 2. CONTEÚDO INFANTIL
      {
        title: '🎈 O Balãozinho Mágico que Queria Tocar as Nuvens de Algodão',
        description:
          'Roteiro completo de 60 segundos com 6 cenas de 10s: fábula infantil lúdica e acolhedora de um balãozinho vermelho subindo além das montanhas.',
        niche: 'infantil_historinhas',
        style: 'pov',
        platform: 'ambos',
        is_free: true,
        category: 'virais',
        hook: 'O segredo mais lindo que o balãozinho encontrou lá no alto do céu azul!',
        call_to_action: 'Mostre para os pequenos na hora do soninho e deixe um coraçãozinho!',
        tags: 'historinha infantil, roteiro 60s, cenas 10s, animacao fofa, historias de ninar, reels infantil',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=cute+little+balloon+smiling+fluffy+clouds+child+3d&color=red',
        prompt_text: `[ROTEIRO VIRAL CRIADORES - 60 SEGUNDOS EM CENAS DE 10S (PT-BR | VÍDEO 100% LIMPO)]
⏱️ DURAÇÃO ALVO: ~60 Segundos (6 Cenas de até 10 segundos cada)
📌 DIRETRIZES ESSENCIAIS:
- Idioma da narração: Português Brasileiro (PT-BR) com voz suave, doce, acolhedora de conto de fadas
- Visual: Vídeo 100% limpo, SEM legendas gravadas na imagem, SEM palavras na tela
- Narração em áudio ritmada para prender atenção dos pais e crianças

🎬 CENA 1 (0-10s) - O SONHO NO QUINTAL COLORIDO (HOOK):
- Visual: Um balãozinho vermelho redondinho com olhinhos curiosos e bochechas coradas flutua amarrado num galho florido de cerejeira, olhando para o céu límpido.
- Câmera: Tomada suave subindo do chão do jardim em direção ao céu ensolarado.
- Narração (PT-BR): "Era uma vez, no alto de uma colina florida, um balãozinho pequenininho chamado Pompom, que tinha o maior sonho do mundo: dar um abraço numa nuvem bem fofinha de algodão!"

🎬 CENA 2 (10-20s) - A SOLTURA DO FIO DOURADO:
- Visual: O vento sopra com brisa brilhante cheia de pétalas cor-de-rosa. O lacinho do balão se desamarra suavemente e ele começa a subir girando de alegria.
- Câmera: Traveling ascendente acompanhando a subida rodopiante do balãozinho sorridente.
- Narração (PT-BR): "O vento amigo deu um sopro levinho de coragem... e soltou seu lacinho dourado! Pompom subiu bem alto, passando pelas árvores e pelos telhados das casinhas."

🎬 CENA 3 (20-30s) - O ENCONTRO COM OS PASSARINHOS CANTORES:
- Visual: Dois passarinhos azuis luminosos voam em círculo ao redor do balãozinho, cantando e fazendo cócegas na cordinha dele com as pontas das asas.
- Câmera: Giro panorâmico de 360 graus no ar com céu azul límpido e raios de sol dourados.
- Narração (PT-BR): "Pelo caminho, os passarinhos cantores vieram dar as boas-vindas com uma canção de ninar mágica, mostrando a estrada de arco-íris que levava até as nuvens mais altas."

🎬 CENA 4 (30-40s) - O TOQUE NAS NUVENS DE ALGODÃO DOCE:
- Visual: Pompom mergulha de ponta na barriguinha de uma nuvem branca e macia como algodão-doce. Pequenas estrelinhas brilhantes se soltam no ar como faíscas mágicas de ouro.
- Câmera: Câmera lenta suave aproximando no rosto extasiado e sorridente do balãozinho.
- Narração (PT-BR): "E quando ele finalmente encostou na nuvem... ploft! Gotinhas de estrelas douradas começaram a chover suavemente pelo céu, espalhando pó de paz para todas as crianças da Terra."

🎬 CENA 5 (40-50s) - A LUZ DA LUA E DAS ESTRELINHAS:
- Visual: O céu transiciona suavemente do crepúsculo dourado para uma noite azul estrelada. A lua sorridente aparece de mansinho e acaricia o topo do balãozinho.
- Câmera: Plano aberto contemplativo com iluminação mágica noturna e vaga-lumes cósmicos.
- Narração (PT-BR): "A lua cheia abriu um sorriso brilhante e abraçou o pequeno Pompom com seu cobertor de luar quentinho, dizendo que todo sonho é possível quando temos coração puro."

🎬 CENA 6 (50-60s) - O SONINHO TRANQUILO E DESPEDIDA (CTA):
- Visual: Pompom fecha os olhinhos deitado na nuvem macia como um travesseiro fofinho, bocejando docemente enquanto as estrelinhas piscam ao redor.
- Câmera: Fade suave com foco no rostinho sereno do balãozinho adormecido.
- Narração (PT-BR): "Agora é a sua vez de fechar os olhinhos e sonhar com castelos de nuvens. Durma bem, pequeno viajante. Compartilhe com quem você ama para um sono cheio de luz!"`,
      },
      {
        title: '🦕 O Mini Dinossauro que Tinha Medo de Formiga',
        description:
          'Roteiro completo de 60 segundos com 6 cenas de 10s: aventura pré-histórica fofa e divertida do filhote de T-Rex aprendendo sobre coragem e amizade.',
        niche: 'infantil_historinhas',
        style: 'modelo',
        platform: 'shopee',
        is_free: false,
        category: 'virais',
        hook: 'O maior rugido do mundo que saiu num espirro fofo do mini dinossauro!',
        call_to_action: 'Qual o bicho favorito do seu pequeno? Comenta aqui embaixo!',
        tags: 'dinossauro fofo, historinha infantil, roteiro 60s, cenas 10s, desenho 3d, t-rex bebe',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=cute+baby+t-rex+dinosaur+smiling+forest+3d&color=green',
        prompt_text: `[ROTEIRO VIRAL CRIADORES - 60 SEGUNDOS EM CENAS DE 10S (PT-BR | VÍDEO 100% LIMPO)]
⏱️ DURAÇÃO ALVO: ~60 Segundos (6 Cenas de até 10 segundos cada)
📌 DIRETRIZES ESSENCIAIS:
- Idioma da narração: Português Brasileiro (PT-BR) com entonação infantil animada e cheia de efeitos vocais cômicos
- Visual: Vídeo 100% limpo, SEM legendas ou palavras na tela
- Narração contínua estimulante para o imaginário infantil

🎬 CENA 1 (0-10s) - O RUGIDO MAIS ENGRAÇADO DA FLORESTA (HOOK):
- Visual: Um filhote de T-Rex gordinho de 20cm infla a barriguinha verde, apoia as patinhas curtas na cintura e abre a boca para dar o rugido mais feroz da pré-história... e sai só um espirro fofo!
- Câmera: Enquadramento frontal em close no rostinho dengoso do mini dinossauro.
- Narração (PT-BR): "Dino Rex achava que era o predador mais temido de todo o vale jurássico! Ele respirava fundo, abria o bocão com dois dentinhos de leite e... atchim! Espalhava folhinhas pelo chão!"

🎬 CENA 2 (10-20s) - O PASSEIO NA MATA DAS SAMAMBAIAS:
- Visual: O filhotinho caminha pisando duro com suas patinhas pesadas, fingindo que é um gigante e assustando borboletas coloridas que pousam na ponta do nariz dele.
- Câmera: Traveling lateral acompanhando os passos desajeitados do tiranossauro bebê.
- Narração (PT-BR): "Ele marchava dizendo: 'Todo mundo treme diante dos meus passos gigantescos!' Mas as borboletas achavam ele tão fofo que usavam o rabinho dele de escorregador!"

🎬 CENA 3 (20-30s) - O ENCONTRO COM O 'MONSTRO VERMELHO':
- Visual: O Dino Rex para estatelado no chão de musgo. No meio de uma trilha de pedrinhas, uma minúscula formiguinha vermelha carrega uma folha de árvore dez vezes maior que ela.
- Câmera: Close macro na formiguinha com sombra gigantesca e contra-plano no Dino de olhos esbugalhados.
- Narração (PT-BR): "Foi aí que a terra tremeu de verdade! Pelo menos na cabecinha do Dino! Uma formiguinha vermelha carregando uma folha verde deu um 'boa tarde' com anteninhas afiadas!"

🎬 CENA 4 (30-40s) - O PULO DE SUSTO E O TOMBO NO MUSGO:
- Visual: Dino Rex dá três pulos desajeitados para trás assustado, tropeça na própria cauda redonda e senta de bumbum num montinho de musgo fofo, tapando os olhos com as patinhas curtas.
- Câmera: Ângulo cômico mostrando o susto exagerado do pequeno réptil.
- Narração (PT-BR): "Socorro, mamãe! Um monstro com chifrinhos de folhas quer me pegar! O maior dinossauro do mundo quase desmaiou de medo de um insetinho de dois milímetros!"

🎬 CENA 5 (40-50s) - O GESTO DE PAZ DA FORMIGUINHA:
- Visual: A formiguinha se aproxima marchando calmamente, corta um pedacinho da folha em formato de coração e oferece para o Dino Rex, que enxuga uma lagriminha e dá uma risadinha gostosa.
- Câmera: Plano detalhe iluminado pelo sol mostrando o dino e a formiguinha tocando o dedinho.
- Narração (PT-BR): "A formiguinha deu uma gargalhada simpática e ofereceu um pedacinho da folha de presente. Dino percebeu que até os seres pequenininhos podem ter a coragem de um leão!"

🎬 CENA 6 (50-60s) - A DANÇA DA AMIZADE E DESPEDIDA (CTA):
- Visual: O mini T-Rex coloca a formiguinha sentada no topo de sua cabeça e os dois saem marchando juntos cantarolando pela floresta jurássica florida.
- Câmera: Câmera se afastando em plongée mostrando o vale colorido e o sol nascendo.
- Narração (PT-BR): "E assim nasceu a dupla mais improvável e corajosa da floresta! Qual é o dinossauro ou bichinho favorito do seu pequeno? Comenta aqui embaixo e curte para ver o próximo episódio!"`,
      },

      // 3. CONTEÚDO DE TERROR / SUSPENSE
      {
        title: '🕯️ A Janela do Quarto no Meio da Madrugada Chuvosa',
        description:
          'Roteiro completo de 60 segundos com 6 cenas de 10s: terror psicológico claustrofóbico às 3:17 da manhã com maçaneta girando e passos no piso.',
        niche: 'terror_suspense',
        style: 'pov',
        platform: 'ambos',
        is_free: true,
        category: 'virais',
        hook: 'POV: São 3:17 da manhã e você acabou de ouvir passos pesados no corredor da sua casa vazia!',
        call_to_action:
          'Você teria coragem de abrir os olhos nessa hora? Conta nos comentários se tiver coragem!',
        tags: 'terror, suspense, lenda urbana, roteiro 60s, cenas 10s, 3am, medo, reels terror, creepypasta',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=dark+bedroom+creepy+door+handle+turning+horror+atmosphere&color=black',
        prompt_text: `[ROTEIRO VIRAL CRIADORES - 60 SEGUNDOS EM CENAS DE 10S (PT-BR | VÍDEO 100% LIMPO)]
⏱️ DURAÇÃO ALVO: ~60 Segundos (6 Cenas de até 10 segundos cada)
📌 DIRETRIZES ESSENCIAIS:
- Idioma da narração: Português Brasileiro (PT-BR) sussurrado, sinistro, com pausas dramáticas de pura tensão
- Visual: Vídeo 100% limpo, SEM legendas na tela, SEM textos impressos
- Efeitos sonoros sugeridos: rangido de tábuas, respiração ofegante, chuva na janela

🎬 CENA 1 (0-10s) - O SOM NA PENUMBRA DO QUARTO (HOOK):
- Visual: POV deitado na cama sob cobertor escuro. O quarto é iluminado apenas pela luz azul fria dos relâmpagos na janela de vidro com gotas de chuva escorrendo.
- Câmera: Ângulo subjetivo trêmulo encarando a porta fechada no fim do corredor.
- Narração (PT-BR): "São exatamente três horas e dezessete minutos da madrugada. Eu moro completamente sozinho no décimo andar... então quem é que tá arrastando os pés descalços do outro lado da minha porta?"

🎬 CENA 2 (10-20s) - A SOMBRA DEBAIXO DA FRESTA:
- Visual: Por baixo da fresta da porta de madeira, a luz fraca do corredor é repentinamente bloqueada por uma silhueta alta e imóvel. Dois pés cinzentos e magros param ali.
- Câmera: Zoom lento e gradual focando no chão e na madeira velha rangendo.
- Narração (PT-BR): "O som de passos pesados parou rente à madeira. Eu vi a sombra de dois pés finos e compridos bloqueando o vão da luz. Minha respiração congelou na garganta."

🎬 CENA 3 (20-30s) - A MAÇANETA GIRANDO MILÍMETRO POR MILÍMETRO:
- Visual: A maçaneta de metal prateada começa a se mover para baixo devagarzinho, com um estalo metálico cortando o silêncio da madrugada chuvosa.
- Câmera: Close macro na maçaneta girando em câmera lenta sem ninguém tocar no lado visível.
- Narração (PT-BR): "A maçaneta começou a descer... milímetro por milímetro. Foi aí que lembrei: a chave estava pendurada no meu chaveiro, bem no chão aos pés da cama!"

🎬 CENA 4 (30-40s) - A PORTA SE ENTREABRE NO VÁCUO:
- Visual: A porta range abrindo uma fresta de cinco centímetros de pura escuridão. Um sopro de ar congelante move as cortinas da janela e apaga uma vela na cômoda.
- Câmera: Câmera oscilando sutilmente simulando o coração disparado da pessoa na cama.
- Narração (PT-BR): "A porta se abriu num estalo seco. O ar dentro do quarto ficou tão gelado que deu pra ver a fumaça saindo da minha boca a cada batida do meu peito."

🎬 CENA 5 (40-50s) - A SILHUETA BRANCA NO CANTO DO GUARDA-ROUPA:
- Visual: Um relâmpago azul claríssimo corta a tempestade pela janela. Por um décimo de segundo, uma criatura pálida com olhos negros sem pupilas aparece agachada no topo do armário.
- Câmera: Clarão rápido seguido de penumbra total com silhueta estática.
- Narração (PT-BR): "O relâmpago iluminou a parede por um segundo... e não estava na porta. Estava agachado bem acima da minha cabeça, me encarando sem piscar."

🎬 CENA 6 (50-60s) - O SUSSURRO FINAL E O ALERTA (CTA):
- Visual: A mão da pessoa puxa o cobertor até o nariz enquanto um sussurro áspero ecoa bem no ouvido direito. A tela apaga em corte seco com batida seca de porta.
- Câmera: Escuridão repentina com som de respiração próxima ao microfone.
- Narração (PT-BR): "Se você sentiu um calafrio nas costas agora, não olhe para trás do seu celular. Compartilhe este aviso antes da meia-noite e tranque todas as portas da sua casa!"`,
      },
      {
        title: '🪞 O Reflexo no Espelho que Piscou Meio Segundo Depois',
        description:
          'Roteiro completo de 60 segundos com 6 cenas de 10s: terror psicológico na frente da pia do banheiro com atraso temporal assustador no reflexo.',
        niche: 'terror_suspense',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: false,
        category: 'virais',
        hook: 'O erro bizarro no reflexo do espelho que fez a internet inteira perder o sono!',
        call_to_action:
          'Olhe para o seu reflexo agora e veja se ele tá parado. Se assustou, siga o canal!',
        tags: 'espelho macabro, lendas urbanas, roteiro 60s, cenas 10s, analog horror, susto, tiktok terror',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=bathroom+mirror+reflection+creepy+shadow+horror&color=black',
        prompt_text: `[ROTEIRO VIRAL CRIADORES - 60 SEGUNDOS EM CENAS DE 10S (PT-BR | VÍDEO 100% LIMPO)]
⏱️ DURAÇÃO ALVO: ~60 Segundos (6 Cenas de até 10 segundos cada)
📌 DIRETRIZES ESSENCIAIS:
- Idioma da narração: Português Brasileiro (PT-BR) estilo relato real de caso sobrenatural documentado
- Visual: Vídeo 100% limpo, SEM legendas desenhadas na tela, SEM palavras na imagem
- Iluminação fria fluorescente de banheiro antigo

🎬 CENA 1 (0-10s) - O VAPOR NA PIA E O PRIMEIRO ESTRANHAMENTO (HOOK):
- Visual: POV em frente ao espelho do banheiro embaçado pelo vapor do chuveiro. A pessoa passa a mão direita para limpar um círculo no vidro e lavar o rosto com água fria.
- Câmera: Enquadramento fixo olhando direto nos olhos do reflexo no espelho limpo.
- Narração (PT-BR): "Repare com muita atenção no reflexo dos meus olhos neste vídeo. O que aconteceu na pia do meu banheiro ontem à noite me fez tapar todos os espelhos do meu apartamento."

🎬 CENA 2 (10-20s) - O ATRASO TEMPORAL NO VIDRO:
- Visual: A pessoa fecha os olhos para lavar a testa com sabonete, mas a imagem dentro do espelho continua de olhos abertos por meio segundo a mais, encarando a lente.
- Câmera: Câmera lenta de precisão mostrando a dissincronia bizarra de movimentos.
- Narração (PT-BR): "Quando eu fechei as pálpebras pra enxaguar o rosto, o meu reflexo demorou quase um segundo inteiro pra obedecer. Ele ficou parado, me olhando com a cabeça torta."

🎬 CENA 3 (20-30s) - O TESTE DOS DEDOS NO VIDRO:
- Visual: Com as mãos molhadas e trêmulas, a pessoa estica o dedo indicador em direção ao vidro. A água da torneira pinga ritmicamente no fundo como um relógio antigo.
- Câmera: Close lateral nas pontas dos dedos quase tocando a superfície fria do espelho.
- Narração (PT-BR): "Eu achei que era cansaço ou ilusão de ótica. Levantei o dedo devagar pra tocar a superfície e ter certeza de que estava sozinho naquela casa."

🎬 CENA 4 (30-40s) - O SORRISO QUE NÃO PERTENCE AO CORPO:
- Visual: A mão da pessoa se afasta, mas o reflexo do outro lado apoia as duas palmas cinzentas na superfície de dentro e abre um sorriso fino de orelha a orelha.
- Câmera: Zoom veloz no sorriso aterrorizante do reflexo que não replica a expressão assustada da pessoa.
- Narração (PT-BR): "O meu rosto real estava paralisado de pavor... mas o reflexo dentro do vidro abriu um sorriso medonho que ia de ponta a ponta da mandíbula dele!"

🎬 CENA 5 (40-50s) - O ESTALO NO CRISTAL DO ESPELHO:
- Visual: Um estalo seco ecoa e o espelho trinca exatamente entre as duas mãos no vidro. Pequenas gotas escuras começam a escorrer de trás da rachadura.
- Câmera: Tomada trêmula enquanto a luz fluorescente do teto pisca e chia como fita VHS antiga.
- Narração (PT-BR): "O vidro estalou com uma rachadura no meio. Foi o instante em que percebi que o espelho não estava mostrando o meu reflexo... era uma janela de outra dimensão!"

🎬 CENA 6 (50-60s) - O AVISO PARA QUEM ESTÁ ASSISTINDO (CTA):
- Visual: A luz do banheiro apaga por completo, sobrando apenas o reflexo fosforescente dos olhos no escuro. Corte rápido para preto.
- Câmera: Fade-out rápido com som de respiração gelada.
- Narração (PT-BR): "Nunca encare um espelho no escuro por mais de dez segundos seguidos. Olhe para a tela do seu celular agora: quem está no reflexo é mesmo você? Comente e me siga se tiver coragem!"`,
      },

      // 4. CONTEÚDO ENGRAÇADO / COMÉDIA
      {
        title: '😂 A Tentativa de Fingir Maturidade na Reunião Online',
        description:
          'Roteiro completo de 60 segundos com 6 cenas de 10s: o perrengue clássico do home office com camisa social impecável por cima e samba-canção rasgada por baixo.',
        niche: 'comedia_engracado',
        style: 'pov',
        platform: 'ambos',
        is_free: true,
        category: 'virais',
        hook: 'POV: O momento exato em que a sua mãe entra no seu quarto berrando bem no meio da reunião do chefe!',
        call_to_action: 'Marca aquele amigo do home office que vive passando por isso!',
        tags: 'humor, comedia, home office, roteiro 60s, cenas 10s, perrengue chique, reels comedia, shorts humor',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=funny+home+office+suit+boxer+shorts+comedy+room&color=blue',
        prompt_text: `[ROTEIRO VIRAL CRIADORES - 60 SEGUNDOS EM CENAS DE 10S (PT-BR | VÍDEO 100% LIMPO)]
⏱️ DURAÇÃO ALVO: ~60 Segundos (6 Cenas de até 10 segundos cada)
📌 DIRETRIZES ESSENCIAIS:
- Idioma da narração: Português Brasileiro (PT-BR) com ritmo rápido, cômico e desespero controlado
- Visual: Vídeo 100% limpo, SEM legendas ou textos renderizados na imagem
- Atuação expressiva com transição de executivo corporativo para puro pânico

🎬 CENA 1 (0-10s) - A POSE DO EXECUTIVO BILIONÁRIO (HOOK):
- Visual: Enquadramento formal da webcam: homem de camisa social engomada, gravata alinhada, fone corporativo e postura impecável concordando com a cabeça com extrema seriedade.
- Câmera: Plano médio frontal imitando tela de chamada de vídeo executiva.
- Narração (PT-BR): "Sim, diretoria executiva, concordo plenamente com a reestruturação sinérgica dos indicadores trimestrais. A nossa métrica de entrega está cem por cento sob controle..."

🎬 CENA 2 (10-20s) - O PRIMEIRO BARULHO NO FUNDO:
- Visual: Enquanto o sujeito faz cara de sábio, a porta do quarto atrás dele se abre num chute e surge um cabo de vassoura varrendo o tapete freneticamente.
- Câmera: Enquadramento com foco no rosto dele começando a suar frio e o olho direito tremendo.
- Narração (PT-BR): "Até que no fundo da chamada surge dona Sandra com a vassoura de palha cantando pagode dos anos noventa com toda a força dos pulmões!"

🎬 CENA 3 (20-30s) - O GRITO MATERNO PELO NOME INTEIRO:
- Visual: A mãe dele entra segurando um frango congelado na mão e grita batendo a panela na beirada da porta: 'Ô Roberto Carlos, tira a linguiça da geladeira que eu mandei!'
- Câmera: Close na reação de choque do sujeito tentando achar o botão de mudo com o mouse tremendo.
- Narração (PT-BR): "Ela não fala baixo, ela grita seu nome completo de batismo pro CEO da multinacional e pro diretor financeiro ouvirem com som surround cinco ponto um!"

🎬 CENA 4 (30-40s) - O DESASTRE DO CELULAR QUE TOMBA:
- Visual: No desespero de fechar a porta com o pé, ele bate o joelho na mesinha. O suporte do celular escorrega e a câmera cai para trás mostrando a realidade completa.
- Câmera: Câmera caindo e filmando de baixo para cima num ângulo desastroso.
- Narração (PT-BR): "O celular tomba e revela pro comitê executivo inteiro que eu tô sentado num balde de tinta virado vestindo samba-canção de bolinha rasgada e meia de dinossauro!"

🎬 CENA 5 (40-50s) - A TENTATIVA DE SALVAR A DIGNIDADE:
- Visual: Ele levanta os dois polegares para a câmera com sorriso amarelo congelado, ajeita a gravata e fala fingindo que nada aconteceu: 'Apenas problemas de conexão no wifi'.
- Câmera: Plano aberto dele no chão tentando recolher os papéis com pose de estátua grega.
- Narração (PT-BR): "Tentei disfarçar dizendo que era um fundo virtual com inteligência artificial hiper-realista, mas o cachorro entrou latindo e roubou o frango da mão da minha mãe!"

🎬 CENA 6 (50-60s) - O PEDIDO DE DEMISSÃO E O ENGAGEMENT (CTA):
- Visual: Ele deita a cabeça na mesa derrotado, aperta o botão de desligar a chamada e esconde o rosto com as duas mãos balançando a cabeça.
- Câmera: Câmera fechando nele com suspiro engraçado e piscadela de conformidade.
- Narração (PT-BR): "Caiu a internet, chefe! Amanhã levo a minha carteira de trabalho pra homologar! Marca aquele amigo do home office que já passou por um perrengue desse nível e deixa seu like!"`,
      },
      {
        title: '😂 Quando Você Decide Fazer Dieta e Abre a Geladeira às 23h',
        description:
          'Roteiro completo de 60 segundos com 6 cenas de 10s: duelo psicológico de novela entre a pessoa em jejum intermitente e o pote de sorvete com feijão congelado.',
        niche: 'comedia_engracado',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: false,
        category: 'virais',
        hook: 'A conversa mental de 4 segundos entre você e o pote de sorvete que na verdade tinha feijão congelado!',
        call_to_action: 'Quem nunca foi tapeado pelo pote de sorvete deixa o like agora!',
        tags: 'dieta, comedia, pizza na madrugada, roteiro 60s, cenas 10s, meme brasil, tiktok humor',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=funny+sneaking+midnight+snack+fridge+light+comedy&color=yellow',
        prompt_text: `[ROTEIRO VIRAL CRIADORES - 60 SEGUNDOS EM CENAS DE 10S (PT-BR | VÍDEO 100% LIMPO)]
⏱️ DURAÇÃO ALVO: ~60 Segundos (6 Cenas de até 10 segundos cada)
📌 DIRETRIZES ESSENCIAIS:
- Idioma da narração: Português Brasileiro (PT-BR) com drama exagerado de novela mexicana
- Visual: Vídeo 100% limpo, SEM legendas gravadas na imagem, SEM textos
- Atuação cômica de suspense e decepção culinária

🎬 CENA 1 (0-10s) - A OPERAÇÃO NINJA NA COZINHA ESCURA (HOOK):
- Visual: Pessoa descalça andando na pontinha dos pés no piso frio da cozinha na penumbra. Abre a porta da geladeira sem fazer o menor barulho de dobradiça.
- Câmera: Traveling rente ao chão acompanhando os pés e depois subindo para o rosto iluminado pela luz amarela da geladeira.
- Narração (PT-BR): "Vinte e três horas e quarenta e sete minutos da segunda-feira. Minha nutricionista dorme o sono dos justos... e eu aqui, iniciando uma operação tática de resgate de carboidratos!"

🎬 CENA 2 (10-20s) - O DUELO COM A GAVETA DE VERDURAS:
- Visual: A pessoa olha com nojo para um maço de alface murcho e uma cenoura esquecida, empurrando as verduras com a pontinha de dois dedos.
- Câmera: Close nas expressões de desprezo gastronômico profundo.
- Narração (PT-BR): "A alface me olha com cara de julgamento: 'Você prometeu foco!'. Eu respondo: 'Amor, foco é pra quem já tem tanquinho, eu só quero ser feliz por cinco minutos!'"

🎬 CENA 3 (20-30s) - A DESCOBERTA DO SANTO GRAAL:
- Visual: Na prateleira do congelador, surge no meio do vapor um pote gigante de sorvete napolitano importado reluzindo com cores convidativas.
- Câmera: Zoom in triunfal com música imaginária de coro celestial de anjos.
- Narração (PT-BR): "E lá estava ele! No fundo do congelador, o pote sagrado de sorvete de chocolate com flocos! O universo sorriu pra mim e disse: 'Você merece essa recompensa!'"

🎬 CENA 4 (30-40s) - O GOLPE DO FEIJÃO CONGELADO:
- Visual: A pessoa pega o pote com reverência, senta na bancada e abre a tampa na maior expectativa... revelando feijão congelado cinzento com uma folha de louro ressecada.
- Câmera: Transição dramática de êxtase para desolação existencial com câmera trêmula.
- Narração (PT-BR): "Abri a tampa esperando baunilha e chocolate e encontro um bloco de feijão preto congelado com folha de louro! O brasileiro não tem um dia de paz na própria cozinha!"

🎬 CENA 5 (40-50s) - A DÚVIDA CRUEL COM A COLHER DE SOPA:
- Visual: A pessoa encara o feijão congelado por cinco segundos, pega uma colher de sopa, dá de ombros e tenta raspar uma lasquinha com esforço sobre-humano.
- Câmera: Close na ponta da colher entortando no bloco de feijão duro.
- Narração (PT-BR): "Parei pra pensar: feijão é proteína, tem ferro, fibras... Se eu mastigar rápido com os olhos fechados fingindo que é cookie crocante, o cérebro nem percebe!"

🎬 CENA 6 (50-60s) - A CONFORMAÇÃO E O APELO FINAL (CTA):
- Visual: Ela come a lasquinha congelada fazendo careta cômica de sofrimento, abraça o pote com resignação e pisca pra câmera.
- Câmera: Câmera recuando enquanto ela volta para o quarto na pontinha dos pés.
- Narração (PT-BR): "Dieta seguida com sucesso absoluto! Quem nunca caiu no golpe do pote de sorvete com feijão congelado deixa o like agora e compartilha com quem tá na mesma luta que eu!"`,
      },

      // 5. TROCA DE ROSTO (FACE SWAP)
      {
        title: '🎭 Troca de Rosto (Face Swap): De Pessoa Comum a Estrela de Cinema Clássico',
        description:
          'Roteiro completo de 60 segundos com 6 cenas de 10s: guia prático cinematográfico para trocar de rosto em IAs de vídeo mantendo poros, iluminação volumétrica e fidelidade.',
        niche: 'face_swap',
        style: 'pov',
        platform: 'ambos',
        is_free: true,
        category: 'virais',
        hook: 'Como transformar qualquer foto sua num vídeo de cinema com troca de rosto hiper-realista!',
        call_to_action:
          'Salve este prompt para usar no seu próximo vídeo de transformação de rosto!',
        tags: 'face swap, troca de rosto, roteiro 60s, cenas 10s, ia video, deepfake criativo, transformacao, tutorial viral',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=face+swap+portrait+transformation+cinematic+lighting&color=purple',
        prompt_text: `[ROTEIRO VIRAL CRIADORES - 60 SEGUNDOS EM CENAS DE 10S (PT-BR | VÍDEO 100% LIMPO)]
⏱️ DURAÇÃO ALVO: ~60 Segundos (6 Cenas de até 10 segundos cada)
📌 DIRETRIZES ESSENCIAIS:
- Idioma da narração: Português Brasileiro (PT-BR) com tom tutorial magnético, claro e profissional
- Visual: Vídeo 100% limpo, SEM textos na tela, SEM legendas gravadas no vídeo
- Transições limpas e cinematográficas com visualização direta da troca de rosto

🎬 CENA 1 (0-10s) - O ANTES E O ESTALO DA TRANSFORMAÇÃO (HOOK):
- Visual: Uma selfie comum de celular com iluminação ambiente. A pessoa estala os dedos na frente da lente: a luz muda para iluminação volumétrica de Hollywood e o rosto transiciona de forma fluida para a nova face de estrela clássica.
- Câmera: Close frontal no alinhamento milimétrico de olhos, nariz e mandíbula.
- Narração (PT-BR): "Quer aprender como trocar o rosto de qualquer pessoa em um vídeo com realismo de cinema sem parecer filtro tosco de aplicativo? Olha a perfeição dessa transição em um estalo!"

🎬 CENA 2 (10-20s) - O TESTE DE ILUMINAÇÃO VOLUMÉTRICA E SOMBRAS:
- Visual: A pessoa vira o rosto 45 graus para a esquerda e para a direita em câmera lenta. A luz de três pontos projeta sombras anatômicas perfeitas no queixo e maçãs do rosto sem borrar.
- Câmera: Tomada em semi-perfil com foco nítido na textura de pele realista.
- Narração (PT-BR): "O segredo para a IA não falhar está na preservação volumétrica das sombras. Repare como o nariz e a boca acompanham o reflexo da lâmpada quente sem nenhuma distorção!"

🎬 CENA 3 (20-30s) - A PROVA DE MICRO-EXPRESSÕES NATURAIS:
- Visual: O novo rosto pisca naturalmente, dá um sorriso sutil e franze levemente a testa. Os poros da pele e linhas de expressão se contraem em harmonia anatômica.
- Câmera: Macro-close nos olhos demonstrando dilatação de pupila e reflexo de estúdio.
- Narração (PT-BR): "Nada daquele olhar morto de robô! As micro-expressões do sorriso e o piscar dos olhos continuam cem por cento orgânicos porque a máscara facial respeita a musculatura base."

🎬 CENA 4 (30-40s) - A CONSISTÊNCIA DE CABELO E COURO CABELUDO:
- Visual: A mão da pessoa passa suavemente perto do contorno da orelha e dos fios de cabelo. Não há manchas pretas, borrões ou bordas transparentes na fusão.
- Câmera: Ângulo lateral destacando a linha da mandíbula perfeitamente fundida com o pescoço.
- Narração (PT-BR): "A maior falha de vídeos de face swap amadores é a emenda do queixo e da raiz do cabelo. Com este prompt, a fusão é perfeita mesmo com cortes de luz dinâmicos!"

🎬 CENA 5 (40-50s) - O PASSO A PASSO NA PLATAFORMA DE IA:
- Visual: Demonstração da tela limpa de renderização: o vídeo base de corpo e pose recebe a foto nítida de referência do novo rosto, processando com resolução 4k e 60fps.
- Câmera: Tomada limpa sobre o ombro mostrando a renderização finalizada sem falhas.
- Narração (PT-BR): "Para executar agora: suba a imagem nítida do seu rosto de referência junto do vídeo de ação na sua ferramenta favorita de IA e cole exatamente este prompt no campo de comando!"

🎬 CENA 6 (50-60s) - RESULTADO FINAL E CHAMADA (CTA):
- Visual: A nova estrela de cinema dá um olhar confiante para a câmera, ajeita o terno/vestido elegante e sai caminhando com luz de estúdio refletindo no piso.
- Câmera: Traveling recuando com tom triunfante e sofisticado.
- Narração (PT-BR): "Pronto! Seu vídeo viral com cara de produção milionária em minutos. Salve este prompt nos favoritos, clique no botão 'Como Usar' para ver o guia e me siga para mais tutoriais de IA!"`,
      },
      {
        title: '🎭 Troca de Rosto (Face Swap): Colocando Seu Rosto em Personagem de Época Medieval',
        description:
          'Roteiro completo de 60 segundos com 6 cenas de 10s: swap facial épico de guerreiro viking com armadura de ferro, faíscas de fogo e chuva torrencial.',
        niche: 'face_swap',
        style: 'modelo',
        platform: 'shopee',
        is_free: false,
        category: 'virais',
        hook: 'O resultado chocante de colocar o rosto do meu amigo na armadura de um guerreiro viking!',
        call_to_action: 'Qual personagem histórico você seria? Escreva nos comentários!',
        tags: 'face swap viking, troca de rosto guerreiro, roteiro 60s, cenas 10s, ia cinematica, efeitos especiais, shorts virais',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=medieval+warrior+armor+cinematic+face+swap+portrait&color=gray',
        prompt_text: `[ROTEIRO VIRAL CRIADORES - 60 SEGUNDOS EM CENAS DE 10S (PT-BR | VÍDEO 100% LIMPO)]
⏱️ DURAÇÃO ALVO: ~60 Segundos (6 Cenas de até 10 segundos cada)
📌 DIRETRIZES ESSENCIAIS:
- Idioma da narração: Português Brasileiro (PT-BR) com voz grave, cinematográfica e épica
- Visual: Vídeo 100% limpo, SEM legendas impressas na tela, SEM palavras escritas
- Estética viking escura com fumaça, brasa, gotas de chuva e metal polido

🎬 CENA 1 (0-10s) - O IMPACTO VISUAL ÉPICO NO CAMPO DE BATALHA (HOOK):
- Visual: Guerreiro com armadura de aço batido e pele de lobo nos ombros caminha entre cinzas e fumaça de tochas. O elmo aberto revela o rosto da pessoa inserido com fidelidade milimétrica.
- Câmera: Tomada em slow-motion aproximando em close épico com faíscas voando no ar.
- Narração (PT-BR): "Eu peguei uma foto comum tirada na sala de casa... e transformei meu amigo no comandante mais temido de um exército medieval inteiro em menos de um minuto!"

🎬 CENA 2 (10-20s) - O REFLEXO DO FOGO NAS PUPILAS:
- Visual: Close-up extremo nos olhos: as chamas das tochas da fogueira refletem com profundidade de campo nas pupilas escuras. Gotas de chuva escorrem pela bochecha sem borrar os poros.
- Câmera: Macro-lente cinematográfica 8k focada nas expressões ferozes de batalha.
- Narração (PT-BR): "Olhem a precisão dos reflexos de fogo dançando dentro dos olhos! A textura áspera de poeira e suor na testa parece que foi filmada numa superprodução de cinema!"

🎬 CENA 3 (20-30s) - O MOVIMENTO DA MANDÍBULA AO RUGIR:
- Visual: O guerreiro abre a boca soltando um grito de guerra em silêncio. A mandíbula de ferro e os músculos do pescoço acompanham perfeitamente o movimento da couraça de aço.
- Câmera: Ângulo lateral dinâmico capturando o movimento sem quebras de borda ou borrões.
- Narração (PT-BR): "Zero distorção de borda! Quando a boca se mexe e o personagem fala, a barba e a cota de malha continuam perfeitamente integradas à estrutura do elmo!"

🎬 CENA 4 (30-40s) - A TRANSIÇÃO DA SELFIE ORIGINAL PARA O VIKING:
- Visual: Em um corte seco de relâmpago, a tela mostra por dois segundos a selfie simples do celular com camiseta básica e, no trovão seguinte, a transição perfeita para a armadura.
- Câmera: Comparativo dinâmico de antes e depois sem texto, apenas com corte fluido de iluminação.
- Narração (PT-BR): "Olha a diferença da foto original no quarto para a versão final com cota de malha de ferro e capa esvoaçante! Qualquer pessoa vira lenda histórica com essa técnica!"

🎬 CENA 5 (40-50s) - O EMPUNHAR DA ESPADA DE AÇO DAMASCO:
- Visual: O guerreiro ergue uma espada pesada de aço damasco diante do peito, saudando seus soldados em câmera lenta com faíscas caindo da lâmina sob chuva torrencial.
- Câmera: Tomada de baixo para cima (contra-plongée) com amplitude épica de horizonte.
- Narração (PT-BR): "O segredo tá na foto frontal nítida e neste prompt calibrado para renderizar metal realista e iluminação dramática sem artefatos plásticos!"

🎬 CENA 6 (50-60s) - O FECHAMENTO HEROICO E CONVITE (CTA):
- Visual: O comandante viking crava a espada na terra úmida, olha fixamente para a lente com postura imponente e o sol desponta entre as nuvens de tempestade.
- Câmera: Plano geral recuando suavemente com fumaça mística no chão.
- Narração (PT-BR): "Qual guerreiro ou época histórica você gostaria de viver? Escreva nos comentários, clique no botão 'Como Usar' do card para copiar o passo a passo e faça o seu agora!"`,
      },

      // 6. ASMR SENSORIAL
      {
        title: '🫧 ASMR Sons Crocantes: Cortando Areia Cinética e Esferas de Sabão Gel',
        description:
          'Roteiro completo de 60 segundos com 6 cenas de 10s: experiência ultra relaxante com microfone binaural cortando texturas aveludadas e estourando bolhas de gel.',
        niche: 'asmr_sensorial',
        style: 'unboxing_vitrine',
        platform: 'ambos',
        is_free: true,
        category: 'virais',
        hook: 'Coloque fones de ouvido imediatamente: o som mais satisfatório que você vai ouvir hoje!',
        call_to_action: 'Se sentiu o formigamento bom na cabeça, deixe seu like e durma bem!',
        tags: 'asmr, satisfatorio, areia cinetica, roteiro 60s, cenas 10s, sons crocantes, relaxante, sono profundo',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=kinetic+sand+satisfying+cutting+asmr+macro&color=purple',
        prompt_text: `[ROTEIRO VIRAL CRIADORES - 60 SEGUNDOS EM CENAS DE 10S (PT-BR | VÍDEO 100% LIMPO)]
⏱️ DURAÇÃO ALVO: ~60 Segundos (6 Cenas de até 10 segundos cada)
📌 DIRETRIZES ESSENCIAIS:
- Idioma da narração: Português Brasileiro (PT-BR) em sussurro doce e pausado (estilo binaural ASMR)
- Visual: Vídeo 100% limpo, SEM textos na tela, SEM legendas gravadas
- Foco em sons táteis crocantes, estalos suaves e texturas visuais hipnóticas

🎬 CENA 1 (0-10s) - O PRIMEIRO CORTE HIPNÓTICO NO BLOCO MACRO (HOOK):
- Visual: Lente macro 4K focada em um bloco perfeito de areia cinética roxa e aveludada. Uma espátula fina prateada corta a primeira camada com fatia milimétrica desmoronando suave.
- Câmera: Macro-plano superior com profundidade de campo rasa e foco cristalino.
- Narração (PT-BR sussurrado): "Coloque seus fones de ouvido agora mesmo... e sinta toda a pressa do dia derreter suavemente a cada corte..."

🎬 CENA 2 (10-20s) - AS FATIAS CRUNCHY EM CÂMERA LENTA:
- Visual: A lâmina desce em fatias ritmadas e geométricas. A areia se solta como açúcar aveludado com som crocante, limpo e espacial em estéreo.
- Câmera: Ângulo lateral de 45 graus captando o desmoronamento macio da textura.
- Narração (PT-BR sussurrado): "Ouça o som crocante da textura se desfazendo... Cada pedacinho caindo traz uma onda de calma pro seu peito..."

🎬 CENA 3 (20-30s) - A EXPLOSÃO DAS ESFERAS DE GEL TRANSLÚCIDAS:
- Visual: Pequenas esferas de gel brilhantes e translúcidas em tons de azul e lilás são pressionadas por uma base de acrílico, estourando com estalinhos sonoros hiper-relaxantes.
- Câmera: Super-close no brilho das gotículas de água espirrando em câmera hiper-lenta.
- Narração (PT-BR sussurrado): "Pequenas bolhinhas estalando devagar... liberando o cansaço acumulado nas suas têmporas..."

🎬 CENA 4 (30-40s) - A RASPAGEM DA NUVEM DE ESPUMA COLORIDA:
- Visual: Uma camada fofa de espuma aerada e colorida em degradê pastel é raspada com suavidade por um pente de cerdas macias, formando ondas sinuosas.
- Câmera: Tomada contínua acompanhando o traço relaxante do pente na superfície.
- Narração (PT-BR sussurrado): "Deixe os seus pensamentos desacelerarem no ritmo dessa onda suave de espuma macia..."

🎬 CENA 5 (40-50s) - O TOQUE FINAL COM AS PONTAS DOS DEDOS:
- Visual: Mãos com unhas bem cuidadas tocam levemente a superfície restante com batidinhas rítmicas (tapping suave), espalhando um pó brilhante que brilha na luz quente.
- Câmera: Foco manual alternando suavemente entre os dedos e a textura brilhante.
- Narração (PT-BR sussurrado): "Respire fundo... Solte o ar devagarzinho... Seus olhos já estão pesados e o corpo relaxado..."

🎬 CENA 6 (50-60s) - O FECHAMENTO PARA SONO PROFUNDO (CTA):
- Visual: A iluminação diminui suavemente até uma penumbra dourada relaxante, com a textura imóvel e acolhedora no centro do quadro.
- Câmera: Fade-out suave com iluminação aconchegante de quarto de dormir.
- Narração (PT-BR sussurrado): "Durma em paz e renove suas energias. Se você sentiu o arrepio bom na cabeça, salve este vídeo para ouvir toda noite antes de dormir. Boa noite..."`,
      },

      // 7. ANIMAIS FALANTES / PETS CÔMICOS
      {
        title: '🐶 Cachorro Carente Cobrando a Caminhada Atrasada de Domingo',
        description:
          'Roteiro completo de 60 segundos com 6 cenas de 10s: Golden retriever ultra dramático cobrando o tutor pelo passeio do parque que atrasou vinte minutos.',
        niche: 'animais_falantes',
        style: 'pov',
        platform: 'ambos',
        is_free: false,
        category: 'virais',
        hook: 'POV: Seu cachorro descobrindo que você colocou tênis de corrida mas foi sentar no sofá!',
        call_to_action: 'Se o seu pet também é dramático assim, compartilhe com outro pai de pet!',
        tags: 'animais falantes, pet comico, roteiro 60s, cenas 10s, golden retriever, cachorro falante, meme pet, humor',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=funny+golden+retriever+dog+talking+couch+humor&color=yellow',
        prompt_text: `[ROTEIRO VIRAL CRIADORES - 60 SEGUNDOS EM CENAS DE 10S (PT-BR | VÍDEO 100% LIMPO)]
⏱️ DURAÇÃO ALVO: ~60 Segundos (6 Cenas de até 10 segundos cada)
📌 DIRETRIZES ESSENCIAIS:
- Idioma da narração: Português Brasileiro (PT-BR) com voz canina dramática, mimada e indignada
- Visual: Vídeo 100% limpo, SEM legendas gravadas na tela, SEM textos impressos
- Sincronia labial cômica de pet com olhosPidões e poses teatrais

🎬 CENA 1 (0-10s) - O OLHAR DE JULGAMENTO NO SOFÁ (HOOK):
- Visual: POV sentado no sofá. Um Golden Retriever gordinho apoia o queixo pesado na perna do tutor com os olhinhos semicerrados em julgamento puro, batendo a pata direita no chão de madeira.
- Câmera: Plano médio frontal fechado no olhar de pura indignação canina.
- Narração (PT-BR): "Márcio... são exatamente dez horas e vinte minutos da manhã de domingo. Por que a minha coleira azul ainda tá pendurada na maçaneta da porta da sala?"

🎬 CENA 2 (10-20s) - O FLAGRA DO TÊNIS VERSUS O CELULAR:
- Visual: O cachorro vira o focinho em direção aos pés do tutor, apontando com a orelhinha pro tênis de corrida calçado, e depois pro celular aberto em rede social.
- Câmera: Movimento de chicote rápido (whip pan) do tênis para o focinho dele fazendo bico.
- Narração (PT-BR): "Você calçou o tênis de corrida, botou a bermuda de treino... e sentou no sofá pra assistir vídeo de receita de lasanha? É esse o compromisso que você assumiu no abrigo?"

🎬 CENA 3 (20-30s) - A SÍNDROME DO ABANDONO TEATRAL:
- Visual: O cachorro joga o corpo no tapete em câmera lenta com suspiro audível, esticando as quatro patinhas pro ar como se estivesse definhando de fome e solidão.
- Câmera: Enquadramento dramático superior mostrando o drama canino digno de novela das nove.
- Narração (PT-BR): "Minhas patinhas já esqueceram o que é a sensação da grama fresca! As árvores do parque estão sentindo a minha falta e você aqui, curtindo foto de gato na internet!"

🎬 CENA 4 (30-40s) - A TENTATIVA DE SUBORNO COM PETISCO:
- Visual: A mão do tutor oferece um biscoitinho canino em forma de osso. O cachorro vira a cara pro lado esquerdo com esnobismo supremo, mas o rabo abana sozinho no tapete.
- Câmera: Close no rabinho traidor abanando enquanto a cara se mantém de brava.
- Narração (PT-BR): "Não tente me comprar com petisco de galinha! O meu amor próprio não tem preço... Quer dizer, o rabo abanou sem minha autorização, mas o meu bico continua firme!"

🎬 CENA 5 (40-50s) - A CHANTAJEM EXPLÍCITA DO CHINELO NOVO:
- Visual: O cachorro se levanta calmamente, caminha até a entrada e coloca a boca suavemente em cima do chinelo de borracha novinho do tutor, olhando de rabo de olho.
- Câmera: Close tenso no chinelo entre os dentes do Golden sorrindo com os olhos.
- Narração (PT-BR): "Veja bem: se em cinco segundos a chave do carro não fizer barulho, esse chinelo aqui vai virar quebra-cabeça de quinhentas peças mastigadas. Você escolhe, paizinho!"

🎬 CENA 6 (50-60s) - A VITÓRIA DA CAMINHADA E DESPEDIDA (CTA):
- Visual: O som da chave faz o cachorro pular de alegria dando piruetas e latindo feliz com a coleira na boca enquanto corre para a porta da rua.
- Câmera: Câmera acompanhando o pulo de euforia em direção à rua ensolarada.
- Narração (PT-BR): "Vencemos mais uma negociação! Se o seu cachorro também é um dramático profissional desse nível, marca outro pai de pet nos comentários e deixa seu like!"`,
      },
    ]

    // 3. Atualizar ou criar os registros na coleção prompts
    for (let i = 0; i < viral60sPrompts.length; i++) {
      const p = viral60sPrompts[i]
      const escapedTitle = p.title.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
      const existing = app.findRecordsByFilter('prompts', `title = '${escapedTitle}'`, '', 1, 0)

      if (existing && existing.length > 0) {
        const record = existing[0]
        record.set('description', p.description)
        record.set('niche', p.niche)
        record.set('style', p.style)
        record.set('platform', p.platform)
        record.set('is_free', p.is_free)
        record.set('category', 'virais')
        record.set('hook', p.hook)
        record.set('call_to_action', p.call_to_action)
        record.set('tags', p.tags)
        record.set('reference_image_url', p.reference_image_url)
        record.set('prompt_text', p.prompt_text)
        app.save(record)
      } else {
        const rec = new Record(app.findCollectionByNameOrId('prompts'))
        rec.set('title', p.title)
        rec.set('description', p.description)
        rec.set('niche', p.niche)
        rec.set('style', p.style)
        rec.set('platform', p.platform)
        rec.set('is_free', p.is_free)
        rec.set('category', 'virais')
        rec.set('hook', p.hook)
        rec.set('call_to_action', p.call_to_action)
        rec.set('tags', p.tags)
        rec.set('reference_image_url', p.reference_image_url)
        rec.set('reference_video_url', '')
        rec.set('prompt_text', p.prompt_text)
        app.save(rec)
      }
    }
  },
  (app) => {
    // down migration
  },
)
