/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    // 1. Atualizar valores permitidos do SelectField 'niche' em prompts e generations
    const newNicheValues = [
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
    ]

    const promptsCol = app.findCollectionByNameOrId('prompts')
    const promptNicheField = promptsCol.fields.getByName('niche')
    if (promptNicheField) {
      promptNicheField.values = newNicheValues
      promptNicheField.maxSelect = 1
    }
    app.save(promptsCol)

    const genCol = app.findCollectionByNameOrId('generations')
    const genNicheField = genCol.fields.getByName('niche')
    if (genNicheField) {
      genNicheField.values = newNicheValues
      genNicheField.maxSelect = 1
    }
    app.save(genCol)

    // 2. Criar coleção para saldo de regenerações extras pagas e histórico de compras demonstrativas
    try {
      app.findCollectionByNameOrId('regeneration_credits')
    } catch (_) {
      const regCreditsCol = new Collection({
        name: 'regeneration_credits',
        type: 'base',
        listRule: "@request.auth.id != '' && user = @request.auth.id",
        viewRule: "@request.auth.id != '' && user = @request.auth.id",
        createRule: "@request.auth.id != '' && user = @request.auth.id",
        updateRule: "@request.auth.id != '' && user = @request.auth.id",
        deleteRule: null,
        fields: [
          {
            name: 'user',
            type: 'relation',
            required: true,
            collectionId: '_pb_users_auth_',
            cascadeDelete: true,
            maxSelect: 1,
          },
          {
            name: 'extra_prompts_balance',
            type: 'number',
            min: 0,
            onlyInt: true,
          },
          {
            name: 'total_purchased',
            type: 'number',
            min: 0,
            onlyInt: true,
          },
          {
            name: 'total_used',
            type: 'number',
            min: 0,
            onlyInt: true,
          },
          {
            name: 'last_purchase_card_last4',
            type: 'text',
          },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: [
          'CREATE UNIQUE INDEX idx_regeneration_credits_user ON regeneration_credits (user)',
        ],
      })
      app.save(regCreditsCol)
    }

    // 3. Seed dos novos nichos na tabela prompts (Gratuitos simples + PRO cena a cena)
    const newPrompts = [
      // ==========================================
      // 1. ESPELHOS & DECORAÇÃO (espelhos_decoracao)
      // ==========================================
      {
        title: '🪞 Espelho Orgânico com Moldura LED - POV Provador no Quarto',
        description:
          'POV ligando a iluminação touch do espelho orgânico no quarto e vendo o reflexo nítido de corpo inteiro sem distorção.',
        niche: 'espelhos_decoracao',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: true,
        hook: 'POV: O espelho orgânico de LED que transformou meu quarto comum em quarto de Pinterest!',
        call_to_action:
          'Espelho de vidro cristal sem distorção com fita LED embutida. Clica no carrinho amarelo aqui embaixo!',
        tags: 'espelho organico, espelho led, decoracao quarto, pinterest aesthetic, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=organic+mirror+led+bedroom+aesthetic+pov&color=white',
        prompt_text: `[ROTEIRO SIMPLES TIKTOK SHOP - 15 SEGUNDOS]

🎬 CENA 1 (0-3s) - O GANCHO VISUAL (HOOK):
- POV: Câmera em primeira pessoa se aproximando do espelho orgânico na parede do quarto na penumbra. Dedo dá um toque no botão touch: a luz LED suave acende ao redor da moldura ondulada!
- Texto na tela: "O ESPELHO MAIS VIRAL DO PINTEREST 🪞✨"
- Narração empolgada: "POV: Você só queria um espelho pro quarto e achou essa perfeição com LED da Shopee!"

🎬 CENA 2 (3-9s) - O TESTE DO REFLEXO SEM DISTORÇÃO:
- Dando passos para trás e para frente: o reflexo do corpo inteiro é 100% fiel, sem achatar ou esticar a imagem.
- Toque suave com os dedos na borda lapidada e no acabamento anti-corte.
- Narração: "Vidro cristal de verdade de 4 milímetros, zero distorção na imagem e botão touch pra trocar a intensidade da luz."

🎬 CENA 3 (9-15s) - CTA DIRETO AO CARRINHO:
- Apontando para o carrinho amarelo no canto inferior:
- Narração: "Chegou super bem embalado em caixa reforçada com madeira! Clica no carrinho amarelo aqui embaixo antes que acabe a promoção!"
- Texto na tela: "🛒 LINK DIRETO NO CARRINHO ABAIXO 👇"`,
      },
      {
        title: '🪞 Espelho de Corpo Inteiro com Apoio no Chão - Modelo Provando Looks do Dia',
        description:
          'Modelo montando 3 looks em frente ao espelho de corpo inteiro com moldura preta em alumínio fino, mostrando o ângulo amplo para vídeos.',
        niche: 'espelhos_decoracao',
        style: 'modelo',
        platform: 'shopee',
        is_free: false,
        hook: 'O espelho de corpo inteiro que todas as blogueiras usam pra gravar vídeos de look do dia!',
        call_to_action:
          'Vidro temperado anti-estilhaço com pé retrátil e suporte para pendurar. Link na sacolinha com frete grátis!',
        tags: 'espelho corpo inteiro, get ready with me, look do dia, moldura aluminio, shopee achados',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=full+length+mirror+standing+woman+outfit+check&color=black',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE PRO - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - O GANCHO DO ÂNGULO PERFEITO (HOOK):
- Modelo com look casual dando um giro completo de 360° em frente ao espelho de 1,60m x 50cm, mostrando que o corpo inteiro cabe perfeitamente no enquadramento.
- Texto grande na tela: "O SEGREDO DOS VÍDEOS DE LOOK DO DIA 👗🪞"
- Narração confiante: "Se você ama postar look do dia mas o seu espelho corta sua cabeça ou seus pés, você precisa desse espelho agora!"

🎬 CENA 2 (3-8s) - A ESTRUTURA E A MOLDURA SLIM REFORÇADA:
- Close na moldura ultrafina em liga de alumínio fosco preta e nos cantos arredondados com acabamento premium.
- Narração: "Moldura de alumínio resistente à ferrugem, design minimalista que combina com qualquer cantinho da casa."

🎬 CENA 3 (8-13s) - O TESTE DE SEGURANÇA E VERSATILIDADE:
- Mostrando a facilidade: pé de apoio retrátil com travas antiderrapantes no chão de madeira, ou suporte traseiro para fixar direto na parede.
- Batidinhas firmes na superfície com a mão para demonstrar firmeza.
- Narração: "Tem película protetora anti-estilhaço: se bater ou cair, o vidro não voa na sala. Segurança total pra quem tem pet ou criança em casa."

🎬 CENA 4 (13-17s) - QUEBRA DE OBJEÇÃO DE TRANSPORTE:
- Take rápido mostrando a embalagem em isopor de alta densidade com cantoneiras de madeira.
- Narração: "Chega 100% intacto porque a transportadora tem seguro total na entrega da Shopee."

🎬 CENA 5 (17-22s) - CTA COM SENSO DE ESCASSEZ:
- Modelo sorrindo com a mão na moldura e apontando para a sacolinha:
- Narração: "Ele tá com cupom de R$ 30 liberado na sacolinha da Shopee hoje. Clica aqui e garanta o seu antes da virada do mês!"
- Texto na tela: "🛍️ APROVEITE O CUPOM NA SACOLINHA 👇"`,
      },

      // ==========================================
      // 2. PRODUTOS ELETRÔNICOS (produtos_eletronicos)
      // ==========================================
      {
        title:
          '📱 Fone Bluetooth com Cancelamento de Ruído e Display Digital - Unboxing Vitrine ASMR',
        description:
          'Tirando da caixinha com som ASMR satisfatório, display de LED com porcentagem de bateria e teste sonoro de graves.',
        niche: 'produtos_eletronicos',
        style: 'unboxing_vitrine',
        platform: 'tiktok_shop',
        is_free: true,
        hook: 'O fone bluetooth de R$ 39 que humilha fones de R$ 400 em qualidade de áudio!',
        call_to_action:
          'Bateria para 36 horas com estojo powerbank e display digital. Clica no carrinho amarelo aqui embaixo!',
        tags: 'fone bluetooth, fone sem fio, cancelamento de ruido, unboxing asmr, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=wireless+earbuds+charging+case+led+display+gadget&color=black',
        prompt_text: `[ROTEIRO SIMPLES TIKTOK SHOP - 15 SEGUNDOS]

🎬 CENA 1 (0-3s) - O SOM SATISFATÓRIO DA CAIXA (HOOK):
- Abrindo a tampa magnética do estojo do fone com som ASMR nítido de clique. O visor de LED acende mostrando 100% de bateria restante.
- Texto na tela: "FONE DE R$ 39 QUE BATE OS DE R$ 400? 🎧🔥"
- Narração impactante: "Se você quer um fone bluetooth com grave pesado que não cai da orelha na corrida, olha esse achado!"

🎬 CENA 2 (3-9s) - O TESTE NO OUVIDO E LATÊNCIA ZERO:
- Colocando na orelha e dando 3 pulos rápidos sem o fone se mover nem 1 milímetro.
- Mostrando no celular um vídeo com sincronia labial perfeita sem atraso no som.
- Narração: "Bluetooth 5.3 com latência zero para jogos e vídeos, graves profundos e isolamento acústico excelente."

🎬 CENA 3 (9-15s) - CTA DIRETO AO CARRINHO:
- Apontando para o carrinho amarelo:
- Narração: "Acompanha cabo USB-C e borrachinhas extras. Tá na promoção com frete grátis no carrinho amarelo aqui embaixo!"
- Texto na tela: "🛒 CLIQUE NO CARRINHO AMARELO 👇"`,
      },
      {
        title:
          "📱 Mini Caixa de Som Bluetooth à Prova D'Água com LED RGB - Modelo Festa na Piscina",
        description:
          'Modelo mergulhando a caixa de som em balde de água tocando música com graves potentes e luzes RGB ritmadas.',
        niche: 'produtos_eletronicos',
        style: 'modelo',
        platform: 'shopee',
        is_free: false,
        hook: "O teste do balde d'água: essa caixinha de som de R$ 45 sobrevive se cair na piscina?",
        call_to_action:
          "Certificação IPX7 à prova d'água com 12h de reprodução contínua. Link na sacolinha da Shopee!",
        tags: 'caixa de som bluetooth, a prova dagua, festa piscina, luzes rgb, shopee achados',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=waterproof+bluetooth+speaker+rgb+poolside+party&color=cyan',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE PRO - 23 SEGUNDOS]

🎬 CENA 1 (0-3s) - O TESTE EXTREMO DA ÁGUA (HOOK):
- Modelo ao lado da piscina jogando a caixinha de som ligada dentro d'água: a música continua tocando sem falhar e as luzes RGB continuam piscando debaixo da água!
- Texto na tela: "CAIU NA PISCINA E CONTINUA TOCANDO! 🌊🔊"
- Narração enérgica: "O teste que ninguém tem coragem de fazer com caixinha barata da internet! Ela é à prova d'água de verdade ou é conversa fiada?"

🎬 CENA 2 (3-8s) - A POTÊNCIA DOS GRAVES COM VIBRAÇÃO:
- Tirando da água: as gotinhas de água pulando em cima do radiador de graves no ritmo da batida da música.
- Narração: "Olha o radiador passivo de graves! O som é encorpado, sem chiar no volume máximo e a potência enche a sala inteira."

🎬 CENA 3 (8-13s) - O DESIGN COMPACTO E A BATERIA GIGANTE:
- Modelo pendurando a caixa na mochila pelo mosquetão emborrachado incluso.
- Narração: "Bateria de longa duração que aguenta até 12 horas de música sem parar no churrasco ou na praia."

🎬 CENA 4 (13-18s) - CONEXÃO TWS ESTÉREO DUPLA:
- Mostrando no celular que é possível parear duas caixas ao mesmo tempo para som estéreo de cinema.
- Narração: "Se você comprar duas, elas se conectam automaticamente criando som estéreo 360 graus."

🎬 CENA 5 (18-23s) - CTA:
- Modelo sorrindo com a caixinha na mão e apontando para a sacolinha da Shopee:
- Narração: "Envio nacional do vendedor oficial da Shopee com cupom ativo hoje. Clica na sacolinha aqui do vídeo e garanta a sua!"
- Texto na tela: "🛍️ GARANTA NA SACOLINHA DA SHOPEE 👇"`,
      },

      // ==========================================
      // 3. CAPINHAS & ACESSÓRIOS DE CELULAR (capinhas_acessorios_celular)
      // ==========================================
      {
        title: '🔌 Capinha Magnética Transparente Anti-Amarelamento - POV Teste de Queda',
        description:
          'POV soltando o celular com a capinha magnética no chão e mostrando cantos com bolsas de ar antichoque e anel MagSafe forte.',
        niche: 'capinhas_acessorios_celular',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: true,
        hook: 'POV: A única capinha transparente que NÃO AMARELA e segurou a queda da escada!',
        call_to_action:
          'Tecnologia alemã anti-UV com ímãs N52 ultra fortes. Clica no carrinho amarelo aqui embaixo!',
        tags: 'capinha celular, anti amarelamento, magsafe, teste de queda, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=clear+magsafe+phone+case+shockproof+minimal&color=white',
        prompt_text: `[ROTEIRO SIMPLES TIKTOK SHOP - 14 SEGUNDOS]

🎬 CENA 1 (0-3s) - O GANCHO DO DESAFIO (HOOK):
- POV: Câmera mostrando uma capinha velha horrorosa e amarelada na mão esquerda, e a capinha nova 100% cristalina na mão direita.
- Texto na tela: "CHEGA DE CAPINHA AMARELA! 📱✨"
- Narração direta: "POV: O dia em que você descobriu a capinha transparente que tem proteção anti-UV e não fica amarela em 1 mês!"

🎬 CENA 2 (3-8s) - O TESTE DO ÍMÃ MAGSAFE POTENTE:
- Encostando o carregador magnético ou suporte veicular: atrai com um estalo forte e não solta mesmo balançando no ar.
- Close nos 4 cantos com airbags embutidos que absorvem quedas de até 2 metros.
- Narração: "Ímã MagSafe super forte que não solta no carro e cantos com airbag anti-impacto que protegem a tela e as câmeras."

🎬 CENA 3 (8-14s) - CTA:
- Apontando para o carrinho amarelo:
- Narração: "Tem pra todos os modelos de iPhone, Samsung e Xiaomi no carrinho amarelo aqui embaixo. Garante a sua!"
- Texto na tela: "🛒 SELECIONE SEU MODELO NO CARRINHO 👇"`,
      },
      {
        title: '🔌 Suporte de Celular Articulado 360° para Mesa e Cama - Unboxing Vitrine ASMR',
        description:
          'Montando o suporte articulado na cabeceira da cama e mesa de trabalho em 10 segundos, firmeza total para gravar vídeos e assistir séries.',
        niche: 'capinhas_acessorios_celular',
        style: 'unboxing_vitrine',
        platform: 'shopee',
        is_free: false,
        hook: 'O acessório de R$ 25 que vai salvar seu pescoço de dores assistindo séries na cama!',
        call_to_action:
          'Braço duplo em liga metálica com garra emborrachada que não risca móveis. Link na sacolinha!',
        tags: 'suporte celular mesa, braco articulado, suporte cama, ergonomia, shopee achados',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=adjustable+phone+stand+holder+desk+bedside&color=black',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE PRO - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - O PROBLEMA DO CELULAR CAINDO NA CARA (HOOK):
- Pessoa deitada na cama segurando o celular no alto, o celular escorrega da mão e quase bate no rosto. Corte imediato para o suporte segurando o aparelho com estabilidade de estúdio.
- Texto na tela: "NUNCA MAIS DERRUBE O CELULAR NA CARA! 📱🛌"
- Narração cúmplice: "Quem nunca tava deitado assistindo série e tomou aquela pancada do celular caindo no nariz? Olha a solução perfeita!"

🎬 CENA 2 (3-8s) - A FIXAÇÃO EM 10 SEGUNDOS SEM FERRAMENTAS:
- Mão rosqueando a presilha emborrachada na borda da mesa ou cabeceira da cama com total firmeza.
- Narração: "A garra tem base de silicone espessa que prende em qualquer espessura sem arranhar a pintura do seu móvel."

🎬 CENA 3 (8-13s) - O BRAÇO DE METAL COM ROTAÇÃO 360°:
- Ajustando o braço flexível e girando o celular na vertical e na horizontal sem o braço descer ou tremer.
- Narração: "Estrutura reforçada de metal que não fica mole com o peso do celular. Gira 360 graus para você gravar tutoriais ou assistir deitada."

🎬 CENA 4 (13-17s) - QUEBRA DE OBJEÇÃO DE TAMANHO:
- Encaixando um tablet ou celular grande com capinha grossa para mostrar que a mola aceita aparelhos largos.
- Narração: "Cabe desde celular pequeno até tablet de 10 polegadas."

🎬 CENA 5 (17-22s) - CTA:
- Apontando para o botão da sacolinha da Shopee:
- Narração: "Custa menos de 30 reais e o envio é imediato na Shopee. Clica no link da sacola aqui do vídeo antes que acabe o estoque!"
- Texto na tela: "🛍️ CLIQUE NA SACOLINHA DA SHOPEE 👇"`,
      },

      // ==========================================
      // 4. MODA FITNESS PLUS SIZE (moda_fitness_plus_size)
      // ==========================================
      {
        title: '🏋️ Conjunto Fitness Plus Size Canelado Cós Alto Duplo - POV Treino na Academia',
        description:
          'POV no provador e na academia com conjunto plus size canelado: cós largo que segura o abdômen sem enrolar e zero transparência.',
        niche: 'moda_fitness_plus_size',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: true,
        hook: 'POV: Achar uma legging plus size que NÃO ENROLA na barriga e NÃO FICA transparente no agachamento!',
        call_to_action:
          'Tecido suplex power duplo de alta gramatura do 46 ao 56. Clica no carrinho amarelo aqui embaixo!',
        tags: 'fitness plus size, legging plus size, nao enrola, zero transparencia, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=plus+size+gym+workout+leggings+woman+curvy&color=purple',
        prompt_text: `[ROTEIRO SIMPLES TIKTOK SHOP - 15 SEGUNDOS]

🎬 CENA 1 (0-3s) - O GANCHO DA DOR REAL DE QUEM TREINA (HOOK):
- POV em frente ao espelho com a legging preta canelada: mão passando pelo cós alto que abraça a cintura de forma anatômica.
- Texto na tela: "O CÓS NÃO ENROLA NADA! 🏋️‍♀️✨"
- Narração identificável: "POV: O dia em que você finalmente achou uma legging fitness plus size que não enrola na barriga quando você senta ou agacha!"

🎬 CENA 2 (3-9s) - O TESTE DO AGACHAMENTO PROFUNDO:
- Agachamento profundo até o chão com luz direta nas costas da legging: tecido grosso, zero transparência e forro duplo.
- Narração: "Gramatura pesada que não fica transparente, comprime sem sufocar e o top dá sustentação de verdade pro busto."

🎬 CENA 3 (9-15s) - CTA DIRETO AO CARRINHO:
- Apontando para o carrinho amarelo:
- Narração: "Veste do 46 ao 56 com caimento impecável. Clica no carrinho amarelo aqui embaixo e garanta sua cor favorita!"
- Texto na tela: "🛒 TAMANHOS DO 46 AO 56 NO CARRINHO 👇"`,
      },
      {
        title:
          '🏋️ Macaquinho Fitness Modelador Plus Size com Efeito Empina Bumbum - Modelo em Ação',
        description:
          'Modelo curvy executando agachamento com halteres e caminhada na esteira vestindo macaquinho modelador sem costura que não marca celulite.',
        niche: 'moda_fitness_plus_size',
        style: 'modelo',
        platform: 'shopee',
        is_free: false,
        hook: 'O macaquinho fitness plus size que desenha o corpo de violão e não marca nenhuma imperfeição!',
        call_to_action:
          'Tecido canelado modelador 3D com forro duplo no peito e costura empina bumbum. Link seguro na sacolinha da Shopee!',
        tags: 'macaquinho fitness plus size, modelador curvy, empina bumbum, treino sem marca, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=curvy+woman+fitness+jumpsuit+plus+size+workout+gym&color=blue',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE PRO - 23 SEGUNDOS]

🎬 CENA 1 (0-3s) - O VISUAL ESCULTÓRICO IMEDIATO (HOOK):
- Passada firme da modelo curvy entrando na sala de pesos com o macaquinho fitness em tom vinho escuro: postura ereta, curvas destacadas e caimento perfeito.
- Texto grande na tela: "VALORIZA SUAS CURVAS SEM MARCAR! ⏳💪"
- Narração empoderada: "Mulheres curvilíneas que amam treinar com estilo: esse macaquinho foi desenhado exatamente para o nosso formato de corpo!"

🎬 CENA 2 (3-8s) - A COMPRESSÃO ANATÔMICA NA CINTURA:
- Close na faixa abdominal com compressão canelada 3D que recolhe o abdômen sem prender a respiração.
- Narração: "A faixa da cintura tem dupla camada que segura o abdômen com conforto absoluto sem cortar a respiração durante o cardio."

🎬 CENA 3 (8-13s) - A COSTURA FRONTAL SEM DIVISÕES E COSTURA TRAS EFEITO BUMBUM:
- Modelo virando de costas e agachando: a costura anatômica em formato de coração valoriza o formato natural dos glúteos.
- Narração: "Costura frontal sem corte que não machuca e pala traseira curva que projeta o bumbum sem marcar nada de celulite."

🎬 CENA 4 (13-17s) - TOP INTEGRADO COM ALÇAS LARGAS:
- Mostrando as alças acolchoadas largas que não afundam nos ombros e bojo removível de alta densidade.
- Narração: "As alças largas não machucam o ombro e o bojo anatômico dá sustentação pra pular corda ou correr sem desconforto."

🎬 CENA 5 (17-23s) - CTA:
- Modelo sorrindo e apontando para a sacolinha da Shopee:
- Narração: "Disponível do G1 ao G4 na sacolinha oficial da Shopee com cupom de frete grátis liberado hoje. Clica e aproveite!"
- Texto na tela: "🛍️ CLIQUE NA SACOLINHA DA SHOPEE 👇"`,
      },

      // ==========================================
      // 5. PET & ACESSÓRIOS (pet_acessorios)
      // ==========================================
      {
        title: '🧸 Escova Removedora de Pelos a Vapor com Água para Pets - POV Cachorro Relaxando',
        description:
          'POV passando a escova a vapor no pet: o vapor suave hidrata os pelos e remove tufos inteiros de pelos soltos sem puxar a pele.',
        niche: 'pet_acessorios',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: true,
        hook: 'POV: A escova a vapor que tirou UM GATO INTEIRO de pelos soltos do meu sofá!',
        call_to_action:
          'Vapor ultrassônico suave que hidrata e remove pelos mortos com 1 clique de limpeza. Link no carrinho amarelo!',
        tags: 'escova pet vapor, removedor de pelos, cachorro relaxando, gatos, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=steamy+pet+brush+grooming+cat+dog+clean&color=yellow',
        prompt_text: `[ROTEIRO SIMPLES TIKTOK SHOP - 15 SEGUNDOS]

🎬 CENA 1 (0-3s) - O RESULTADO CHOCANTE DE PELOS (HOOK):
- POV: Câmera mostrando a escova retirando uma camada inteira de pelos mortos do cachorro que tá deitado ronronando/relaxando.
- Texto na tela: "TIROU UM CACHORRO INTEIRO DE PELOS! 🐶💨"
- Narração surpresa: "POV: O dia em que você descobriu a escova a vapor para pets e nunca mais encontrou pelo grudado no sofá ou na roupa!"

🎬 CENA 2 (3-9s) - O VAPOR SUAVE E A LIMPEZA AUTOMÁTICA:
- Mostrando o vaporzinho suave saindo no centro da escova com água morna e apertando o botão que solta toda a camada de pelo em formato de bolinha.
- Narração: "O vapor hidrata o pelo enquanto desembaraça e as cerdas de silicone macias não machucam a pele do animal."

🎬 CENA 3 (9-15s) - CTA:
- Apontando para o carrinho amarelo:
- Narração: "Bateria recarregável por USB. Tá no carrinho amarelo aqui embaixo com frete grátis pro Brasil todo!"
- Texto na tela: "🛒 PEÇA O SEU NO CARRINHO AMARELO 👇"`,
      },
      {
        title:
          '🧸 Bebedouro Fonte Automático com Filtro de Carvão e Sensor - Modelo Gato Bebendo Água',
        description:
          'Gatinho se aproximando da fonte transparente: a água em cascata silenciosa ativa por sensor e estimula o pet a beber o triplo de água.',
        niche: 'pet_acessorios',
        style: 'modelo',
        platform: 'shopee',
        is_free: false,
        hook: 'Como fazer seu pet beber 3x mais água e evitar doenças renais sem gastar uma fortuna!',
        call_to_action:
          'Motor ultra silencioso com triplo filtro de carvão ativado e capacidade de 2,5 litros. Link na sacolinha!',
        tags: 'fonte bebedouro pet, gato bebendo agua, saude pet, bebedouro automatico, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=cat+water+fountain+drinking+pet+clean+water&color=cyan',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE PRO - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - O PROBLEMA DO PET QUE NÃO BEBE ÁGUA PARADA (HOOK):
- Gato cheirando a tigelinha de água suja e saindo sem beber. Corte para a fonte de cascata cristalina: o gato vai correndo e começa a lamber a água fresca com gosto!
- Texto na tela: "SEU PET ODEIA ÁGUA PARADA! 🐱💧"
- Narração com autoridade carinhosa: "Você sabia que a maior causa de doenças renais em cães e gatos é água parada na tigela? Olha essa fonte!"

🎬 CENA 2 (3-8s) - A FILTRAGEM TRIPLA COM CARVÃO ATIVADO:
- Mostrando a troca fácil do filtro com carvão ativado e resina que retira calcário, cloro, pelos e odores da água.
- Narração: "A água passa por 3 camadas de filtragem contínua: fica sempre geladinha, oxigenada e livre de pelos ou poeira."

🎬 CENA 3 (8-13s) - O MOTOR SILENCIOSO DE MENOS DE 20 DECIBÉIS:
- Câmera aproximando o microfone da fonte ligada: silêncio absoluto, só o barulhinho relaxante de cascata natural.
- Narração: "Motor com bomba magnética ultrassilenciosa: você nem percebe que tá ligada durante a noite."

🎬 CENA 4 (13-17s) - CAPACIDADE PARA 2,5 LITROS COM NÍVEL VISÍVEL:
- Mostrando o reservatório transparente de 2,5 litros com marcação de nível que dura a semana inteira.
- Narração: "Você pode viajar no fim de semana tranquilo que seu pet fica com água pura garantida."

🎬 CENA 5 (17-22s) - CTA:
- Segurando a embalagem com filtro extra e apontando para a sacolinha da Shopee:
- Narração: "Vem com 3 filtros extras de brinde na sacolinha da Shopee hoje. Clica e dê esse carinho pra saúde do seu filho de 4 patas!"
- Texto na tela: "🛍️ CLIQUE NA SACOLINHA DA SHOPEE 👇"`,
      },

      // ==========================================
      // 6. COZINHA & UTILIDADES (cozinha_utilidades)
      // ==========================================
      {
        title: '🏠 Mini Processador e Triturador Elétrico sem Fio por USB - POV Picando Alho em 5s',
        description:
          'POV colocando 10 dentes de alho na lâmina de inox, apertando 1 botão no topo e triturando tudo em 5 segundos sem cheiro nas mãos.',
        niche: 'cozinha_utilidades',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: true,
        hook: 'POV: O mini triturador de R$ 22 que acabou para sempre com cheiro de alho e cebola nas minhas mãos!',
        call_to_action:
          'Lâminas triplas de aço inox com carregamento USB e trava de segurança. Link no carrinho amarelo!',
        tags: 'mini processador alho, triturador usb, utilidades cozinha, prático, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=mini+electric+garlic+chopper+kitchen+gadget&color=green',
        prompt_text: `[ROTEIRO SIMPLES TIKTOK SHOP - 14 SEGUNDOS]

🎬 CENA 1 (0-3s) - O FIM DO CHEIRO DE ALHO NAS MÃOS (HOOK):
- POV: Colocando 10 dentes de alho dentro do copo, tampa colocada, 1 dedo pressiona o botão de cima. Em 4 segundos as lâminas trituram o alho perfeitamente!
- Texto na tela: "ALHO TRITURADO EM 5 SEGUNDOS! 🧄⚡"
- Narração impressionada: "POV: O dia em que você pagou 22 reais nesse mini triturador e nunca mais ficou com cheiro de alho nas unhas!"

🎬 CENA 2 (3-8s) - A POTÊNCIA DAS LÂMINAS TRIPLAS DE INOX:
- Abrindo a tampa e mostrando o alho picadinho por igual, sem pedaços grandes.
- Lavando a lâmina debaixo da torneira em 3 segundos.
- Narração: "Lâminas em aço inox cirúrgico que picam alho, cebola, nozes e pimentão em segundos sem fazer bagunça na pia."

🎬 CENA 3 (8-14s) - CTA:
- Apontando para o carrinho amarelo:
- Narração: "Recarrega no USB do celular e a bateria dura semanas! Clica no carrinho amarelo aqui embaixo e garanta o seu!"
- Texto na tela: "🛒 COMPRE NO CARRINHO AMARELO 👇"`,
      },
      {
        title:
          '🏠 Dispensador Automático de Detergente com Porta Esponja - Unboxing Vitrine Pia Organizada',
        description:
          'Pressionando a esponja com uma mão no dispensador: a quantidade exata de sabão sobe direto na esponja com pia 100% seca e organizada.',
        niche: 'cozinha_utilidades',
        style: 'unboxing_vitrine',
        platform: 'shopee',
        is_free: false,
        hook: 'O achadinho de R$ 15 que deixa sua pia de cozinha com cara de anúncio de revista!',
        call_to_action:
          'Base com sistema de drenagem e bomba de pressão econômica 2 em 1. Link na sacolinha da Shopee!',
        tags: 'dispenser detergente, pia limpa, organizador cozinha, achadinhos shopee, utilidades',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=soap+dispenser+sponge+holder+kitchen+sink+clean&color=gray',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE PRO - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - O GESTO SATISFATÓRIO COM UMA MÃO (HOOK):
- Mão com a esponja dando um aperto rápido em cima do dispensador: a dosagem exata de detergente sobe no centro da esponja e gera espuma densa imediata.
- Texto na tela: "A PIA MAIS ORGANIZADA DA SHOPEE 🧽✨"
- Narração satisfatória: "Se a sua pia da cozinha vive molhada e com garrafinha de detergente escorregando, olha essa invenção genial!"

🎬 CENA 2 (3-8s) - ECONOMIA DE DETERGENTE NA PRÁTICA:
- Mostrando que uma única pressionada libera a quantidade ideal sem desperdiçar metade do frasco como no método tradicional.
- Narração: "Faz o detergente render o dobro do tempo porque dosa a quantidade perfeita pra ensaboar pratos e panelas."

🎬 CENA 3 (8-13s) - A BANDEJA DE DRENAGEM QUE NÃO JUNTA ÁGUA:
- Levantando a grelha superior: água residual da esponja escorre para o compartimento inferior sem voltar pro sabão.
- Narração: "A esponja não fica encharcada de água suja e a bancada da sua pia permanece 100% seca e cheirosa."

🎬 CENA 4 (13-17s) - CAPACIDADE PARA 380ML E MATERIAL RESISTENTE:
- Mostrando a facilidade para reabastecer tirando a tampa.
- Narração: "Plástico ABS reforçado livre de BPA com base antiderrapante que não anda na pia molhada."

🎬 CENA 5 (17-22s) - CTA:
- Apontando para a sacolinha da Shopee:
- Narração: "Custa menos que um café da tarde na sacolinha oficial aqui da Shopee com cupom de frete grátis hoje. Clica e aproveite!"
- Texto na tela: "🛍️ CLIQUE NA SACOLINHA DA SHOPEE 👇"`,
      },

      // ==========================================
      // 7. RELÓGIOS & BIJUS (relogios_bijus)
      // ==========================================
      {
        title:
          '⌚ Kit Relógio Feminino Dourado com Pulseira Trevo da Sorte - Modelo Provador Luz Natural',
        description:
          'Modelo colocando o relógio dourado com mostrador perolado e pulseira trevo com acabamento em ouro italiano que não escurece.',
        niche: 'relogios_bijus',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: true,
        hook: 'O relógio com pulseira de trevo que parece de R$ 800 e custou menos de R$ 35!',
        call_to_action:
          'Banho de verniz cataforético que não escurece nem perde o brilho. Clica no carrinho amarelo aqui embaixo!',
        tags: 'relogio feminino dourado, pulseira trevo, acessorio elegante, old money, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=gold+women+watch+clover+bracelet+jewelry+elegant&color=yellow',
        prompt_text: `[ROTEIRO SIMPLES TIKTOK SHOP - 15 SEGUNDOS]

🎬 CENA 1 (0-3s) - O BRILHO DA JOIA NA LUZ NATURAL (HOOK):
- Modelo movimentando o punho sob a luz do sol: o relógio dourado fino e a pulseira de trevo verde esmeralda refletem um brilho luxuoso no braço.
- Texto na tela: "LOOK MILIONÁRIA POR R$ 35 ⌚✨"
- Narração encantadora: "Se você ama acessórios elegantes que deixam qualquer roupa básica parecendo look de milionária, olha esse kit!"

🎬 CENA 2 (3-9s) - O TESTE DO BANHO RESISTENTE À ÁGUA:
- Mão borrifando água no relógio e passando um pano seco: o brilho continua perfeito e sem nenhuma mancha.
- Narração: "Banho com dupla camada de verniz protetor que não fica verde nem escurece com suor e mostrador com vidro anti-risco."

🎬 CENA 3 (9-15s) - CTA DIRETO AO CARRINHO:
- Apontando delicadamente para o carrinho amarelo:
- Narração: "Já vem com a caixinha de veludo para presente no carrinho amarelo aqui embaixo com envio imediato!"
- Texto na tela: "🛒 GARANTA O SEU NO CARRINHO AMARELO 👇"`,
      },
      {
        title:
          '⌚ Relógio Masculino Cronógrafo em Aço Inox com Ponteiros Luminosos - POV Direção no Carro',
        description:
          'POV dirigindo com a mão no volante mostrando o relógio masculino pesado em aço inoxidável escovado, calendário e ponteiros fluorescentes.',
        niche: 'relogios_bijus',
        style: 'pov',
        platform: 'shopee',
        is_free: false,
        hook: 'POV: O relógio masculino de presença que todo mundo repara quando você coloca a mão no volante!',
        call_to_action:
          '100% aço inoxidável 316L com resistência a água 3ATM e fecho duplo de segurança. Link na sacolinha da Shopee!',
        tags: 'relogio masculino inox, cronografo executivo, presenca masculina, shopee achados',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=luxury+chronograph+men+watch+driving+steering+wheel&color=black',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE PRO - 23 SEGUNDOS]

🎬 CENA 1 (0-3s) - O IMPACTO NO VOLANTE DO CARRO (HOOK):
- POV: Mão esquerda no volante do carro com o relógio prateado em aço com mostrador preto e azul meia-noite refletindo a luz do entardecer.
- Texto na tela: "O RELÓGIO QUE IMPÕE RESPEITO ⌚🚗"
- Narração marcante: "POV: O dia em que você aposentou os relógios de plástico e comprou o modelo de aço que todo homem repara de longe!"

🎬 CENA 2 (3-9s) - O TESTE DO PESO E DO AÇO MACIÇO:
- Segurando o relógio na palma da mão e soltando sobre a mesa com som metálico encorpado (não oco de lata).
- Narração: "Aço inoxidável 316L pesado que não descasca, elos maciços e fecho duplo que não abre sozinho no pulso."

🎬 CENA 3 (9-14s) - OS PONTEIROS QUE BRILHAM NO ESCURO:
- Entrando na garagem escura: os ponteiros e marcadores de hora acendem com iluminação fosforescente verde nítida.
- Narração: "Ponteiros fosforescentes para ver as horas no escuro e vidro de cristal mineral resistente a riscos e batidas."

🎬 CENA 4 (14-18s) - RESISTÊNCIA À ÁGUA E FERRAMENTA DE AJUSTE INCLUSA:
- Mostrando a caixinha com ferramenta para diminuir ou aumentar os elos em casa em 2 minutos.
- Narração: "Resistente a respingos e chuva, e já acompanha a chavinha para ajustar a pulseira no seu tamanho exato."

🎬 CENA 5 (18-23s) - CTA:
- Apontando para o botão da sacolinha da Shopee:
- Narração: "Qualidade comparável a relógios de R$ 900 na sacolinha oficial aqui da Shopee com frete grátis hoje. Garanta o seu!"
- Texto na tela: "🛍️ CLIQUE NA SACOLINHA DA SHOPEE 👇"`,
      },
    ]

    for (let i = 0; i < newPrompts.length; i++) {
      const p = newPrompts[i]
      // Escapar apóstrofos com barra invertida para a sintaxe de filtro do PocketBase
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
