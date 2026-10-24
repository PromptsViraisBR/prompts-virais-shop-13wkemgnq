/// <reference path="../pb_data/types.d.ts" />

/**
 * Migração 0024:
 * 1. Adicionar campo 'category' (SelectField: ['ecommerce', 'virais']) na coleção 'prompts'
 * 2. Atualizar registros existentes para category = 'ecommerce'
 * 3. Expandir os valores de 'niche' em prompts para incluir os nichos virais de criadores de conteúdo:
 *    - historinhas_frutas (historinhas de frutas humanoides)
 *    - infantil_historinhas (conteúdo infantil)
 *    - terror_suspense (conteúdo de terror)
 *    - comedia_engracado (conteúdo engraçado)
 *    - face_swap (troca de rosto / mudar o rosto de uma pessoa em um vídeo)
 *    - asmr_sensorial (ASMR sensorial e relaxante)
 *    - animais_falantes (animais falantes / pets cômicos)
 * 4. Fazer seed dos prompts no formato virais (category = 'virais'):
 *    - Todos em PT-BR
 *    - Duração máxima de 10 segundos
 *    - Vídeo 100% limpo SEM legendas/textos gravados na tela
 *    - Amostras gratuitas + Roteiros PRO detalhados
 */

migrate(
  (app) => {
    const promptsCol = app.findCollectionByNameOrId('prompts')

    // 1. Adicionar campo 'category' caso ainda não exista
    if (!promptsCol.fields.getByName('category')) {
      promptsCol.fields.add(
        new SelectField({
          name: 'category',
          required: false,
          values: ['ecommerce', 'virais'],
          maxSelect: 1,
        }),
      )
    }

    // 2. Expandir a lista de valores de 'niche' para incluir nichos de e-commerce + virais
    const currentNicheField = promptsCol.fields.getByName('niche')
    const expandedNiches = [
      // E-commerce existentes
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
      // Novos nichos para criadores de conteúdo (Vídeos Virais)
      'historinhas_frutas',
      'infantil_historinhas',
      'terror_suspense',
      'comedia_engracado',
      'face_swap',
      'asmr_sensorial',
      'animais_falantes',
    ]

    if (currentNicheField) {
      currentNicheField.values = expandedNiches
      currentNicheField.maxSelect = 1
    }

    app.save(promptsCol)

    // 3. Atualizar prompts existentes sem category definida para 'ecommerce'
    app
      .db()
      .newQuery("UPDATE prompts SET category = 'ecommerce' WHERE category IS NULL OR category = ''")
      .execute()

    // 4. Seed de Prompts Virais para Criadores de Conteúdo (category = 'virais')
    // Regras obrigatórias: PT-BR, até 10s de duração, vídeo 100% liso sem texto/legenda gravada na tela.
    const viralPrompts = [
      // ==========================================
      // 1. HISTORINHAS DE FRUTAS HUMANOIDES
      // ==========================================
      {
        title: '🍓 Moranguinho Fofoqueira Descobre o Segredo do Abacaxi',
        description:
          'Animação hiper-realista em 3D de um morango com bracinhos e olhinhos expressivos descobrindo que o abacaxi usa coroa de mentira.',
        niche: 'historinhas_frutas',
        style: 'pov',
        platform: 'ambos',
        is_free: true,
        category: 'virais',
        hook: 'POV: O morango fofoqueiro da geladeira flagrou o maior escândalo da fruteira!',
        call_to_action:
          'Para mais fofocas da geladeira, comente qual fruta você quer ver no próximo vídeo!',
        tags: 'frutas humanoides, morango falante, historinha 3d, animacao viral, tiktok humor',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=cute+anthropomorphic+strawberry+talking+kitchen+3d&color=red',
        prompt_text: `[ROTEIRO VIRAL CRIADORES - 10 SEGUNDOS (PT-BR | VÍDEO TOTALMENTE LISO SEM TEXTO NA TELA)]

📌 DIRETRIZES ESSENCIAIS:
- Idioma da narração: Português Brasileiro (PT-BR) com tom cômico e expressivo
- Duração máxima: 10 segundos
- Visual: Vídeo 100% liso, SEM legendas, SEM textos, SEM caracteres ou palavras renderizadas na tela (para evitar erros visuais das IAs).

🎬 CENA 1 (0-3s) - O FLAGRA NO ESCURO DA GELADEIRA (HOOK):
- Câmera em ângulo fechado: A porta da geladeira se abre na penumbra. Um morango hiper-realista com olhinhos brilhantes, bracinhos curtos e expressão de choque espia por trás da jarra de suco.
- Efeito sonoro: suspense cômico com batida suave.
- Narração (voz fina e fofoqueira): "Gente, eu não acredito no que meus olhinhos de morango acabaram de ver na gaveta de baixo!"

🎬 CENA 2 (3-7s) - A REVELAÇÃO DO ABACAXI:
- Câmera rápida em zoom in: Um abacaxi ranzinza sentado num potinho tirando a sua coroa de folhas para coçar a cabeça careca.
- O morango põe as duas mãozinhas na boca abafando uma gargalhada escandalosa.
- Narração: "O senhor Abacaxi fingindo que é rei da fruteira, mas a coroa dele é peruca de plástico colada!"

🎬 CENA 3 (7-10s) - REAÇÃO FINAL E FECHAMENTO RÁPIDO:
- O abacaxi se vira bravo na direção da câmera e o morango sai correndo em passinhos rápidos e desajeitados tropeçando numa uva.
- Narração: "Ele me viu! Corre antes que vire geleia! Comenta qual fruta você quer no próximo episódio!"`,
      },
      {
        title: '🍌 Banana Revoltada com Roupa Amarela no Provador da Fruteira',
        description:
          'Banana com pernas e mãos estilizadas reclamando que todo mundo só a julga pela casca amarela com manchinhas marrons.',
        niche: 'historinhas_frutas',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: false,
        category: 'virais',
        hook: 'A banana estilosa se recusando a sair na salada de frutas sem um look de grife!',
        call_to_action: 'Você comeria essa banana estilosa ou deixava ela desfilar? Comente aqui!',
        tags: 'frutas humanoides, banana 3d, animacao piada, criadores reels, shorts virais',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=stylish+anthropomorphic+banana+character+fashion+3d&color=yellow',
        prompt_text: `[ROTEIRO VIRAL CRIADORES - 10 SEGUNDOS (PT-BR | VÍDEO TOTALMENTE LISO SEM TEXTO NA TELA)]

📌 DIRETRIZES ESSENCIAIS:
- Idioma da narração: Português Brasileiro (PT-BR) no estilo influenciador debochado
- Duração máxima: 10 segundos
- Visual: Vídeo 100% liso, SEM legendas, SEM textos, SEM caracteres gravados na tela.

🎬 CENA 1 (0-3s) - O DRAMA DA CASCA MANCHADA (HOOK):
- Close dramático em uma banana humanoide elegante usando óculos escuros minúsculos, olhando no espelho de uma colher de prata e fazendo beicinho.
- Narração debochada: "Duas pintinhas marrons na minha pele e o humano já acha que eu tô pronta pro bolo de caneca? Me respeita!"

🎬 CENA 2 (3-7s) - O DESFILE DE PASSARELA NA BANCADA:
- A banana veste uma mini jaqueta de couro e desfila pela bancada da pia de mármore como uma supermodelo, empurrando uma maçã invejosa com o quadril.
- Narração: "Eu não sou fruta de vitamina, meu amor. Eu sou patrimônio estético da bancada da cozinha!"

🎬 CENA 3 (7-10s) - O SUSTO DA FACA DE CORTE:
- Uma mão humana aparece no fundo segurando uma faca e a banana congela, arregala os olhinhos e faz pose de estátua sem piscar.
- Narração: "Finge demência, não se mexe e curte o vídeo antes que eu vire sobremesa!"`,
      },

      // ==========================================
      // 2. CONTEÚDO INFANTIL
      // ==========================================
      {
        title: '🎈 O Balãozinho Mágico que Queria Tocar as Nuvens de Algodão',
        description:
          'Animação infantil fofa e colorida de um balãozinho vermelho com rostinho sorridente subindo pelo céu e encontrando passarinhos cantores.',
        niche: 'infantil_historinhas',
        style: 'pov',
        platform: 'ambos',
        is_free: true,
        category: 'virais',
        hook: 'O segredo mais lindo que o balãozinho encontrou lá no alto do céu azul!',
        call_to_action: 'Mostre para os pequenos na hora do soninho e deixe um coraçãozinho!',
        tags: 'historinha infantil, criancas, animacao fofa, historias de ninar, reels infantil',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=cute+little+balloon+smiling+fluffy+clouds+child+3d&color=red',
        prompt_text: `[ROTEIRO VIRAL CRIADORES - 10 SEGUNDOS (PT-BR | VÍDEO TOTALMENTE LISO SEM TEXTO NA TELA)]

📌 DIRETRIZES ESSENCIAIS:
- Idioma da narração: Português Brasileiro (PT-BR) com voz doce, acolhedora e ritmo calmo
- Duração máxima: 10 segundos
- Visual: Vídeo 100% liso, SEM legendas, SEM textos, SEM caracteres na tela.

🎬 CENA 1 (0-3s) - O VOO DO BALÃOZINHO CORAJOSO (HOOK):
- Um balãozinho vermelho redondinho com olhos grandes expressivos e bochechas rosadas sobe suavemente entre nuvens macias brilhando com raios de sol dourado.
- Narração suave e calorosa: "Era uma vez um balãozinho pequenininho que tinha um sonho gigante: dar um abraço numa nuvem bem fofinha!"

🎬 CENA 2 (3-7s) - O TOQUE NAS NUVENS DE ALGODÃO DOCE:
- O balãozinho encosta de mansinho na nuvem. Pequenas estrelinhas douradas mágicas se soltam no ar com brilho suave e dois passarinhos azuis dão rodopios ao redor dele.
- Narração: "Quando ele tocou a nuvem, choveu gotinhas de estrelas mágicas que iluminaram o céu inteiro!"

🎬 CENA 3 (7-10s) - SORRISO DE BOA NOITE:
- O balãozinho boceja fofo, fecha os olhinhos sorrindo e se aninha na nuvem como se fosse um travesseiro macio.
- Narração: "Durma bem, pequeno sonhador. Até a próxima aventura mágica!"`,
      },
      {
        title: '🦕 O Mini Dinossauro que Tinha Medo de Formiga',
        description:
          'Um filhotinho de tiranossauro rex de 20cm todo verde e fofinho dando pulinhos de susto com uma formiguinha trabalhadora.',
        niche: 'infantil_historinhas',
        style: 'modelo',
        platform: 'shopee',
        is_free: false,
        category: 'virais',
        hook: 'O maior rugido do mundo que saiu num espirro fofo do mini dinossauro!',
        call_to_action: 'Qual o bicho favorito do seu pequeno? Comenta aqui embaixo!',
        tags: 'dinossauro fofo, historinha infantil, desenho 3d, t-rex bebe, kids tiktok',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=cute+baby+t-rex+dinosaur+smiling+forest+3d&color=green',
        prompt_text: `[ROTEIRO VIRAL CRIADORES - 10 SEGUNDOS (PT-BR | VÍDEO TOTALMENTE LISO SEM TEXTO NA TELA)]

📌 DIRETRIZES ESSENCIAIS:
- Idioma da narração: Português Brasileiro (PT-BR) infantil animado e divertido
- Duração máxima: 10 segundos
- Visual: Vídeo 100% liso, SEM legendas, SEM textos na tela.

🎬 CENA 1 (0-3s) - O RUGIDO MAIS ENGRAÇADO DA FLORESTA (HOOK):
- Um filhotinho gordinho de T-Rex infla a barriguinha verde, abre a boca com dois dentinhos de leite para dar um rugido feroz e sai apenas um espirro fofo espalhando folhinhas coloridas.
- Narração divertida: "Dino Rex achava que era o monstro mais temido da floresta jurássica..."

🎬 CENA 2 (3-7s) - O ENCONTRO COM A FORMIGUINHA:
- Uma formiguinha vermelha com uma folha duas vezes maior que ela passa marchando. O Dino Rex dá três pulos para trás assustado, tropeça na própria cauda e senta no musgo macio.
- Narração: "Até que uma formiguinha deu boa tarde e ele quase desmaiou de susto com tanta coragem!"

🎬 CENA 3 (7-10s) - A AMIZADE IMPROVÁVEL:
- A formiguinha oferece um pedacinho da folha, o mini dino dá uma risadinha gostosa e eles batem as mãozinhas em comemoração.
- Narração: "Porque amigos de verdade não ligam para o tamanho! Curta para ver a parte 2!"`,
      },

      // ==========================================
      // 3. CONTEÚDO DE TERROR / SUSPENSE
      // ==========================================
      {
        title: '🕯️ A Janela do Quarto no Meio da Madrugada Chuvosa',
        description:
          'Atmosfera densa de suspense e terror psicológico filmada na penumbra: a maçaneta da porta gira devagarzinho enquanto a pessoa finge estar dormindo.',
        niche: 'terror_suspense',
        style: 'pov',
        platform: 'ambos',
        is_free: true,
        category: 'virais',
        hook: 'POV: São 3:17 da manhã e você acabou de ouvir passos pesados no corredor da sua casa vazia!',
        call_to_action:
          'Você teria coragem de abrir os olhos nessa hora? Conta nos comentários se tiver coragem!',
        tags: 'terror, suspense, lenda urbana, 3am, medo, reels terror, creepypasta',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=dark+bedroom+creepy+door+handle+turning+horror+atmosphere&color=black',
        prompt_text: `[ROTEIRO VIRAL CRIADORES - 10 SEGUNDOS (PT-BR | VÍDEO TOTALMENTE LISO SEM TEXTO NA TELA)]

📌 DIRETRIZES ESSENCIAIS:
- Idioma da narração: Português Brasileiro (PT-BR) sussurrado, sinistro e tenso
- Duração máxima: 10 segundos
- Visual: Vídeo 100% liso, SEM legendas, SEM textos gravados na tela.

🎬 CENA 1 (0-3s) - O SOM NA PENUMBRA DO QUARTO (HOOK):
- POV sob o cobertor na penumbra de um quarto iluminado apenas pelo azul frio da lua na janela. O som de passos arrastados no piso de madeira ecoa do lado de fora da porta.
- Narração (sussurro tenso): "Eu moro sozinho no décimo andar... então quem é que tá descalço do outro lado da minha porta agora?"

🎬 CENA 2 (3-7s) - A MAÇANETA GIRANDO LENTAMENTE:
- A maçaneta de metal prateada começa a descer milímetro por milímetro, com o rangido mecânico estalando no silêncio da noite.
- Uma sombra alta e distorcida aparece por baixo da fresta da porta bloqueando a luz do corredor.
- Narração: "A maçaneta começou a girar... e eu percebi que a chave estava caída aos meus pés."

🎬 CENA 3 (7-10s) - A RESPIRAÇÃO NO PÉ DA CAMA:
- Um clarão rápido de relâmpago revela por um quarto de segundo uma silhueta pálida parada imóvel no canto da escuridão. A porta dá um estalo seco se abrindo.
- Narração: "Não olhe para trás. Se você teve calafrio, compartilhe antes da meia-noite!"`,
      },
      {
        title: '🪞 O Reflexo no Espelho que Piscou Meio Segundo Depois',
        description:
          'Tensão pura na frente do espelho do banheiro: o reflexo da pessoa mantém contato visual mesmo quando ela já virou o rosto para sair.',
        niche: 'terror_suspense',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: false,
        category: 'virais',
        hook: 'O erro bizarro no reflexo do espelho que fez a internet inteira perder o sono!',
        call_to_action:
          'Olhe para o seu reflexo agora e veja se ele tá parado. Se assustou, siga o canal!',
        tags: 'espelho macabro, lendas urbanas, analog horror, susto, tiktok terror',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=bathroom+mirror+reflection+creepy+shadow+horror&color=black',
        prompt_text: `[ROTEIRO VIRAL CRIADORES - 10 SEGUNDOS (PT-BR | VÍDEO TOTALMENTE LISO SEM TEXTO NA TELA)]

📌 DIRETRIZES ESSENCIAIS:
- Idioma da narração: Português Brasileiro (PT-BR) com tom misterioso de investigação
- Duração máxima: 10 segundos
- Visual: Vídeo 100% liso, SEM legendas, SEM textos, SEM caracteres na tela.

🎬 CENA 1 (0-3s) - O MOVIMENTO DESENCONTRADO NO VIDRO (HOOK):
- POV em frente ao espelho embaçado do banheiro. A pessoa esfrega a mão para limpar o vidro e lava o rosto na pia com água gelada.
- Narração fria e calculada: "Repare com muita atenção no reflexo dos meus olhos quando eu abaixo a cabeça..."

🎬 CENA 2 (3-7s) - O REFLEXO QUE NÃO SE MOVE:
- A pessoa baixa a cabeça para enxaguar o rosto, mas o reflexo no vidro continua de pé, olhando fixamente para a lente da câmera com um sorriso milimétrico e perturbador.
- Som: chiado sutil de fita VHS antiga com batimento cardíaco acelerado.
- Narração: "O meu corpo se abaixou... mas o reflexo continuou me encarando sem piscar."

🎬 CENA 3 (7-10s) - O TOQUE DO OUTRO LADO DO VIDRO:
- A mão da pessoa volta a subir e, do lado de dentro do vidro, uma mão cinzenta toca exatamente no mesmo ponto fazendo o vidro estalar.
- Narração: "Nunca encare um espelho no escuro por mais de dez segundos. Você foi avisado."`,
      },

      // ==========================================
      // 4. CONTEÚDO ENGRAÇADO / COMÉDIA
      // ==========================================
      {
        title: '😂 A Tentativa de Fingir Maturidade na Reunião Online',
        description:
          'Situação tragicômica clássica de trabalho remoto: a pessoa com camisa social perfeita por cima e bermuda do Bob Esponja por baixo.',
        niche: 'comedia_engracado',
        style: 'pov',
        platform: 'ambos',
        is_free: true,
        category: 'virais',
        hook: 'POV: O momento exato em que a sua mãe entra no seu quarto berrando bem no meio da reunião do chefe!',
        call_to_action: 'Marca aquele amigo do home office que vive passando por isso!',
        tags: 'humor, comedia, home office, perrengue chique, reels comedia, shorts humor',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=funny+home+office+suit+boxer+shorts+comedy+room&color=blue',
        prompt_text: `[ROTEIRO VIRAL CRIADORES - 10 SEGUNDOS (PT-BR | VÍDEO TOTALMENTE LISO SEM TEXTO NA TELA)]

📌 DIRETRIZES ESSENCIAIS:
- Idioma da narração: Português Brasileiro (PT-BR) com ritmo rápido, cômico e desespero controlado
- Duração máxima: 10 segundos
- Visual: Vídeo 100% liso, SEM legendas, SEM textos na tela.

🎬 CENA 1 (0-3s) - A POSE DO EXECUTIVO MILIONÁRIO (HOOK):
- Enquadramento frontal da webcam: pessoa de camisa social engomada, fone corporativo e postura executiva impecável assentindo com a cabeça com extrema seriedade.
- Narração executiva empostada: "Sim, diretoria, concordo plenamente com a reestruturação sinérgica dos indicadores trimestrais..."

🎬 CENA 2 (3-7s) - A CÂMERA CAI E MOSTRA A REALIDADE:
- O celular escorrega do suporte e tomba para trás mostrando o ângulo completo: a pessoa está sentada num balde virado de cabeça para baixo vestindo samba-canção furada e meia de bichinho.
- Uma voz estridente no fundo grita batendo panela: "Ô Roberto, tira a linguiça do congelador agora que eu mandei!"
- A cara do sujeito vai se desmanchando em puro terror.

🎬 CENA 3 (7-10s) - A SAÍDA DE FININHO:
- Ele dá um sorriso amarelo paralisado, aperta o botão de desligar a chamada e se joga no chão em câmera lenta.
- Narração desesperada: "Caiu minha internet chefe, amanhã eu mando meu pedido de demissão! Quem nunca passou por isso?"`,
      },
      {
        title: '😂 Quando Você Decide Fazer Dieta e Abre a Geladeira às 23h',
        description:
          'Batalha épica entre a consciência saudável e o último pedaço de pizza fria que sobrou de sábado à noite.',
        niche: 'comedia_engracado',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: false,
        category: 'virais',
        hook: 'A conversa mental de 4 segundos entre você e o pote de sorvete que na verdade tinha feijão congelado!',
        call_to_action: 'Quem nunca foi tapeado pelo pote de sorvete deixa o like agora!',
        tags: 'dieta, comedia, pizza na madrugada, meme brasil, tiktok humor',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=funny+sneaking+midnight+snack+fridge+light+comedy&color=yellow',
        prompt_text: `[ROTEIRO VIRAL CRIADORES - 10 SEGUNDOS (PT-BR | VÍDEO TOTALMENTE LISO SEM TEXTO NA TELA)]

📌 DIRETRIZES ESSENCIAIS:
- Idioma da narração: Português Brasileiro (PT-BR) humorístico com drama exagerado de novela
- Duração máxima: 10 segundos
- Visual: Vídeo 100% liso, SEM legendas, SEM textos, SEM caracteres gravados na tela.

🎬 CENA 1 (0-3s) - O RASTREAMENTO SILENCIOSO NA COZINHA (HOOK):
- Pessoa descalça andando na pontinha dos pés no escuro da cozinha, abrindo a porta da geladeira sem fazer o menor barulho. A luz amarela ilumina seu rosto em êxtase.
- Narração dramática: "Segunda-feira à noite. Minha nutricionista dormindo o sono dos justos e eu aqui, travando um duelo com a minha alma."

🎬 CENA 2 (3-7s) - A TENTAÇÃO DO POTE DA DECEPÇÃO:
- As mãos trêmulas pegam com reverência o pote de sorvete napolitano importado. Ao abrir a tampa na maior expectativa, o interior revela feijão congelado com uma folha de louro ressecada.
- O rosto transiciona de felicidade pura para desolação existencial absoluta.
- Narração: "Olha o golpe! Não tem sorvete, é feijão temperado de três semanas atrás!"

🎬 CENA 3 (7-10s) - A DECISÃO CONFORMADA:
- A pessoa dá de ombros, pega uma colher de sopa e come o feijão congelado duro mesmo com cara de satisfação irônica.
- Narração: "Proteína pura! Compartilha com quem tá na mesma dieta milagrosa que eu!"`,
      },

      // ==========================================
      // 5. TROCA DE ROSTO (FACE SWAP)
      // ==========================================
      {
        title: '🎭 Troca de Rosto (Face Swap): De Pessoa Comum a Estrela de Cinema Clássico',
        description:
          'Prompt estruturado para ferramentas de IA de vídeo (Kling, Hailuo, FaceFusion, Roop) que substitui com fidelidade milimétrica o rosto original pelo rosto de referência mantendo iluminação, poros e expressões.',
        niche: 'face_swap',
        style: 'pov',
        platform: 'ambos',
        is_free: true,
        category: 'virais',
        hook: 'Como transformar qualquer foto sua num vídeo de cinema com troca de rosto hiper-realista!',
        call_to_action:
          'Salve este prompt para usar no seu próximo vídeo de transformação de rosto!',
        tags: 'face swap, troca de rosto, ia video, deepfake criativo, transformacao, tutorial viral',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=face+swap+portrait+transformation+cinematic+lighting&color=purple',
        prompt_text: `[ROTEIRO VIRAL CRIADORES - 10 SEGUNDOS (PT-BR | VÍDEO TOTALMENTE LISO SEM TEXTO NA TELA)]

📌 DIRETRIZES ESSENCIAIS:
- Idioma da narração: Português Brasileiro (PT-BR) com clareza tutorial e impacto visual
- Duração máxima: 10 segundos
- Visual: Vídeo 100% liso, SEM legendas, SEM textos, SEM caracteres na tela.

🎬 CENA 1 (0-3s) - O ANTES E A TRANSIÇÃO INSTANTÂNEA (HOOK):
- Rosto original em primeiro plano olhando para a câmera com iluminação natural suave. A pessoa estala os dedos em frente à lente: em um corte fluido de luz de estúdio, a face transiciona instantaneamente para a nova face de referência com alinhamento perfeito de sobrancelhas, olhos e boca.
- Narração firme: "Quer trocar o rosto de qualquer pessoa em um vídeo com realismo de Hollywood sem parecer filtro barato?"

🎬 CENA 2 (3-7s) - O TESTE DE MOVIMENTO E ÂNGULOS RÁPIDOS:
- A pessoa vira o rosto 45 graus para a direita e para a esquerda, sorri e pisca naturalmente. As sombras do nariz e os reflexos nos lábios se adaptam perfeitamente à nova estrutura facial sem artefatos ou borrões.
- Narração: "Olha a adaptação da textura da pele, sombras do queixo e iluminação volumétrica sem perder o movimento natural dos olhos."

🎬 CENA 3 (7-10s) - FECHAMENTO E INSTRUÇÃO RÁPIDA:
- Olhar confiante da nova face para a câmera com sorriso sutil e aceno de cabeça.
- Narração: "Suba a foto do novo rosto junto do vídeo na plataforma de IA e deixe a mágica acontecer! Clique no botão de informação para ver o passo a passo!"`,
      },
      {
        title: '🎭 Troca de Rosto (Face Swap): Colocando Seu Rosto em Personagem de Época Medieval',
        description:
          'Roteiro de alta precisão para swap facial em cenas de guerreiro com armadura de ferro polido, fogo e chuva dramática sem distorção na mandíbula.',
        niche: 'face_swap',
        style: 'modelo',
        platform: 'shopee',
        is_free: false,
        category: 'virais',
        hook: 'O resultado chocante de colocar o rosto do meu amigo na armadura de um guerreiro viking!',
        call_to_action: 'Qual personagem histórico você seria? Escreva nos comentários!',
        tags: 'face swap viking, troca de rosto guerreiro, ia cinemática, efeitos especiais, shorts virais',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=medieval+warrior+armor+cinematic+face+swap+portrait&color=gray',
        prompt_text: `[ROTEIRO VIRAL CRIADORES - 10 SEGUNDOS (PT-BR | VÍDEO TOTALMENTE LISO SEM TEXTO NA TELA)]

📌 DIRETRIZES ESSENCIAIS:
- Idioma da narração: Português Brasileiro (PT-BR) cinematográfico e épico
- Duração máxima: 10 segundos
- Visual: Vídeo 100% liso, SEM legendas, SEM textos, SEM palavras gravadas na tela.

🎬 CENA 1 (0-3s) - O IMPACTO VISUAL ÉPICO (HOOK):
- Guerreiro medieval com cota de malha de aço e capa esvoaçante caminhando em meio à fumaça e faíscas. A câmera aproxima em close no elmo aberto: o rosto inserido pela IA tem expressividade feroz, suor na testa e marcas de poeira perfeitamente integradas.
- Narração épica e grave: "Peguei uma selfie comum do celular e transformei no comandante de um exército medieval inteiro em 5 segundos!"

🎬 CENA 2 (3-7s) - PROVA DE DETALHES HIPER-REALISTAS:
- Close nos olhos: o reflexo das tochas de fogo dança nas pupilas com profundidade de campo cinematográfica em 8k. A mandíbula se mexe com naturalidade enquanto o personagem fala.
- Narração: "Zero distorção de borda, orelhas e couro cabeludo perfeitamente fundidos com o capacete de ferro."

🎬 CENA 3 (7-10s) - CHAMADA FINAL:
- O guerreiro levanta a espada saudando a câmera em câmera lenta com faíscas caindo ao fundo.
- Narração: "O segredo tá na foto nítida e no prompt certo! Veja os passos no ícone de informação do card e faça o seu!"`,
      },

      // ==========================================
      // 6. ASMR SENSORIAL
      // ==========================================
      {
        title: '🫧 ASMR Sons Crocantes: Cortando Areia Cinética e Esferas de Sabão Gel',
        description:
          'Gravação hipnótica e ultra relaxante com microfone binaural de alta fidelidade cortando texturas coloridas que desmancham suavemente.',
        niche: 'asmr_sensorial',
        style: 'unboxing_vitrine',
        platform: 'ambos',
        is_free: true,
        category: 'virais',
        hook: 'Coloque fones de ouvido imediatamente: o som mais satisfatório que você vai ouvir hoje!',
        call_to_action: 'Se sentiu o formigamento bom na cabeça, deixe seu like e durma bem!',
        tags: 'asmr, satisfatorio, areia cinetica, sons crocantes, relaxante, sono profundo',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=kinetic+sand+satisfying+cutting+asmr+macro&color=purple',
        prompt_text: `[ROTEIRO VIRAL CRIADORES - 10 SEGUNDOS (PT-BR | VÍDEO TOTALMENTE LISO SEM TEXTO NA TELA)]

📌 DIRETRIZES ESSENCIAIS:
- Idioma da narração: Português Brasileiro (PT-BR) em sussurro suave ASMR (binaural)
- Duração máxima: 10 segundos
- Visual: Vídeo 100% liso, SEM legendas, SEM textos na tela.

🎬 CENA 1 (0-3s) - O PRIMEIRO CORTE HIPNÓTICO (HOOK):
- Macro lente 4K focada em um bloco perfeito de areia cinética roxa aveludada. Uma lâmina fina corta o topo em fatias milimétricas com som crocante, limpo e cristalino em estéreo.
- Narração (sussurro doce e pausado): "Coloque seus fones de ouvido... e sinta toda a tensão do dia derreter agora..."

🎬 CENA 2 (3-7s) - A EXPLOSÃO DE BOLINHAS DE GEL:
- A lâmina pressiona suavemente esferas translúcidas de gel que se rompem uma a uma espalhando gotículas brilhantes com estalinhos sonoros hiper-relaxantes.
- Narração: "Ouça cada camada se soltando com suavidade e calma absoluta..."

🎬 CENA 3 (7-10s) - O TOQUE FINAL COM AS PONTAS DOS DEDOS:
- Dedos tocando levemente na superfície restante com batidinhas ritmadas e acolhedoras.
- Narração: "Respire fundo. Salve este vídeo para quando precisar desacelerar a mente."`,
      },

      // ==========================================
      // 7. ANIMAIS FALANTES / PETS CÔMICOS
      // ==========================================
      {
        title: '🐶 Cachorro Carente Cobrando a Caminhada Atrasada de Domingo',
        description:
          'Golden retriever com olhos suplicantes e boca sincronizada com perfeição exigindo explicações sobre por que o passeio do parque ainda não começou.',
        niche: 'animais_falantes',
        style: 'pov',
        platform: 'ambos',
        is_free: false,
        category: 'virais',
        hook: 'POV: Seu cachorro descobrindo que você colocou tênis de corrida mas foi sentar no sofá!',
        call_to_action: 'Se o seu pet também é dramático assim, compartilhe com outro pai de pet!',
        tags: 'animais falantes, pet comico, golden retriever, cachorro falante, meme pet, humor',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=funny+golden+retriever+dog+talking+couch+humor&color=yellow',
        prompt_text: `[ROTEIRO VIRAL CRIADORES - 10 SEGUNDOS (PT-BR | VÍDEO TOTALMENTE LISO SEM TEXTO NA TELA)]

📌 DIRETRIZES ESSENCIAIS:
- Idioma da narração: Português Brasileiro (PT-BR) com voz dramática e fofa de pet mimado
- Duração máxima: 10 segundos
- Visual: Vídeo 100% liso, SEM legendas, SEM textos, SEM caracteres na tela.

🎬 CENA 1 (0-3s) - O OLHAR DE JULGAMENTO SEVERO (HOOK):
- POV: Câmera no sofá. Um Golden Retriever gordinho apoia o queixo na perna do tutor com os olhinhos semicerrados em julgamento puro, batendo a pata no chão de madeira.
- Narração (voz canina indignada): "Márcio... são dez horas da manhã. Por que a minha coleira ainda tá pendurada na porta da sala?"

🎬 CENA 2 (3-7s) - A SÍNDROME DO ABANDONO IMAGINÁRIO:
- O cachorro levanta as orelhas, tomba a cabeça pro lado e faz biquinho de indignação, enquanto a boca se mexe em sincronia labial perfeita com a fala.
- Narração: "Você colocou bermuda, calçou o tênis... e deitou no sofá pra ver vídeo de receita? É esse o amor que você me prometeu quando me adotou?"

🎬 CENA 3 (7-10s) - O CHANTAJISTA PROFISSIONAL:
- Ele deita no tapete de barriga pra cima com as quatro patinhas recolhidas fazendo cara de coitado máximo.
- Narração: "Minhas patinhas já esqueceram o que é grama verde! Levanta agora e me leva ou eu vou roer seu chinelo!"`,
      },
    ]

    for (let i = 0; i < viralPrompts.length; i++) {
      const p = viralPrompts[i]
      const escapedTitle = p.title.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
      const existing = app.findRecordsByFilter('prompts', `title = '${escapedTitle}'`, '', 1, 0)
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
      rec.set('category', p.category)
      rec.set('hook', p.hook)
      rec.set('call_to_action', p.call_to_action)
      rec.set('tags', p.tags)
      rec.set('reference_image_url', p.reference_image_url)
      rec.set('reference_video_url', '')
      rec.set('prompt_text', p.prompt_text)
      app.save(rec)
    }
  },
  (app) => {
    // down migration
  },
)
