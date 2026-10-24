/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const promptsCol = app.findCollectionByNameOrId('prompts')

    const proPromptsPart5 = [
      // 51. Moda Feminina - PRO
      {
        title:
          'Blazer Oversized Estruturado com Ombreiras e Botões Dourados - Modelo Estilo Passarela',
        description:
          'Modelo caminhando com blazer de alfaiataria premium cinza chumbo com forro acetinado, ombreiras geométricas e bolso com lapela.',
        niche: 'moda_feminina',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'O blazer estruturado que te dá postura imponente de passarela internacional!',
        call_to_action:
          'Alfaiataria crepe premium com forro duplo e botões em metal nobre. Link no carrinho amarelo!',
        tags: 'blazer oversized, alfaiataria feminina, ombreiras estruturadas, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=oversized+blazer+woman+runway+streetstyle+chic&color=gray',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 23 SEGUNDOS]

🎬 CENA 1 (0-3s) - O IMPACTO DA POSTURA (HOOK):
- Passada imponente da modelo em direção à câmera, ajeitando a lapela do blazer estruturado cinza chumbo.
- Texto na tela: "POSTURA DE MULHER PODEROSA 🏛️✨"
- Narração de impacto: "Se você quer uma peça que mude a sua presença assim que você entra em qualquer sala, olha o caimento desse blazer!"

🎬 CENA 2 (3-9s) - AS OMBREIRAS E FORRO DUPLO:
- Close nas ombreiras de corte reto e no forro acetinado com estampa sutil que desliza suavemente sobre qualquer tecido.
- Narração: "As ombreiras são firmes na medida certa: valorizam a postura sem ficar exageradas. O forro acetinado não pinica e não prende o movimento dos braços."

🎬 CENA 3 (9-14s) - BOLSOS EMBUTIDOS COM LAPELA E BOTOAMENTO DUPLO:
- Mãos nos bolsos profundos e close nos botões dourados com relevo que não descascam com a lavagem a seco.
- Narração: "Abotoamento duplo com botões de liga metálica que não descascam e bolsos funcionais com lapela forrada."

🎬 CENA 4 (14-18s) - LOOK DE TRABALHO VS LOOK BALADA:
- Look 1: Fechado com calça reta e scarpin. Look 2: Aberto com cropped de renda e minissaia preta.
- Narração: "Vai da reunião mais importante do ano ao restaurante chique à noite com elegância absoluta."

🎬 CENA 5 (18-23s) - CTA:
- Modelo apontando para o carrinho amarelo:
- Narração: "Peça de grife com preço de confecção nacional no carrinho amarelo do TikTok Shop. Aproveite o envio expresso hoje!"`,
      },
      // 52. Moda Feminina - PRO
      {
        title:
          'Calça Cargo Feminina Cintura Alta com Cinto Fivela Metálica - POV Provador Militar Chic',
        description:
          'POV no espelho com calça cargo bege areia com bolsos laterais simétricos, cós anatômico e cinto militar com fivela de engate rápido.',
        niche: 'moda_feminina',
        style: 'pov',
        platform: 'shopee',
        is_free: false,
        hook: 'POV: A calça cargo que afina a cintura e não te deixa com quadril largo demais!',
        call_to_action:
          'Sarja peletizada com 3% elastano e cinto tático incluso. Link na sacolinha!',
        tags: 'calca cargo feminina, cintura alta, bolsos laterais, shopee achados',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=women+cargo+pants+high+waist+belt+mirror&color=orange',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - A QUEBRA DA OBJEÇÃO DO QUADRIL (HOOK):
- POV em frente ao espelho ajustando o cinto tático da calça cargo bege. O caimento fica esguio e elegante.
- Texto na tela: "A CARGO QUE NÃO ENGORDA! 👖✨"
- Narração comemorativa: "POV: O dia em que você achou a calça cargo com bolsos anatômicos que não adicionam volume indesejado no quadril!"

🎬 CENA 2 (3-8s) - OS BOLSOS ANATÔMICOS PLANOS:
- Mão mostrando que os bolsos laterais são costurados rentes à perna, abrindo apenas quando você coloca algo dentro.
- Narração: "Os bolsos cargo são desenhados de forma plana: não armam pra fora e mantêm a silhueta longilínea."

🎬 CENA 3 (8-13s) - O CINTO TÁTICO INCLUSO:
- Travando a fivela metálica de encaixe rápido:
- Narração: "Já vem com esse cinto tático de fivela metálica de ajuste milimétrico pra cintura ficar bem fininha."

🎬 CENA 4 (13-17s) - SARJA PELETIZADA COM ELASTANO:
- Agachando e levantando: a calça estica confortavelmente no joelho e bumbum sem repuxar.
- Narração: "Sarja com toque aveludado e 3% de elastano que acompanha cada passo com total conforto."

🎬 CENA 5 (17-22s) - CTA:
- Apontando pro link da sacolinha da Shopee:
- Narração: "Disponível nas cores areia, preto e verde oliva na sacolinha aqui da Shopee com frete grátis hoje!"`,
      },
      // 53. Moda Feminina - PRO
      {
        title:
          'Colete Feminino em Alfaiataria Risca de Giz sem Manga - Unboxing Vitrine Minimalista',
        description:
          'Abertura de pacote com colete de alfaiataria com botões forrados, decote V elegante e faixa de ajuste com fivela nas costas.',
        niche: 'moda_feminina',
        style: 'unboxing_vitrine',
        platform: 'ambos',
        is_free: false,
        hook: 'O colete de alfaiataria mais elegante da internet que você usa sozinho ou com blazer!',
        call_to_action: 'Tecido encorpado que não amassa com ajuste nas costas. Link na vitrine!',
        tags: 'colete alfaiataria, colete feminino, old money chic, shopee unboxing',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=tailored+vest+waistcoat+woman+unboxing+chic&color=gray',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP / SHOPEE - 21 SEGUNDOS]

🎬 CENA 1 (0-3s) - O CHARME DO COLETE DE ALFAIATARIA (HOOK):
- Tirando o colete de alfaiataria cinza chumbo da embalagem de papel manteiga.
- Texto na tela: "A TENDÊNCIA MAIS ELEGANTE DO ANO ☕💼"
- Narração cativante: "A tendência do colete usado como blusa única dominou as capitais da moda e eu achei a peça mais perfeita por R$ 38!"

🎬 CENA 2 (3-8s) - REGULAGEM TRASEIRA COM FIVELA:
- Mostrando a fitinha de ajuste traseiro com fivela de metal nas costas que acintura o corpo sob medida.
- Narração: "Tem fivela nas costas pra você apertar a cintura na medida que quiser sem precisar levar na costureira."

🎬 CENA 3 (8-13s) - BOTÕES FORRADOS NO MESMO TECIDO:
- Close nos 4 botões frontais impecavelmente encapados com o mesmo tecido de alfaiataria nobre.
- Narração: "Botões forrados à mão e forro interno completo que permite usar sem sutiã com zero transparência."

🎬 CENA 4 (13-17s) - COMBINAÇÃO MULTIUSO:
- Sozinho com calça jeans clara, aberto sobre t-shirt branca e como conjunto formal com calça de pregas.
- Narração: "Uma peça curinga que multiplica seus looks tanto no calor quanto no frio."

🎬 CENA 5 (17-21s) - CTA:
- Apontando para o botão da vitrine:
- Narração: "Cores cinza, preto e bege na vitrine aqui embaixo. Clica e aproveita antes que aumente o lote!"`,
      },
      // 54. Moda Masculina - PRO
      {
        title: 'Calça Chino Slim Masculina em Sarja Peletizada - Modelo Dia a Dia Alinhado',
        description:
          'Modelo masculino caminhando com calça chino cáqui, tênis casual e polo, demonstrando elegância sem rigidez social.',
        niche: 'moda_masculina',
        style: 'modelo',
        platform: 'shopee',
        is_free: false,
        hook: 'A calça chino que substitui a calça jeans dura com 3x mais conforto e elegância!',
        call_to_action:
          'Sarja peletizada 97% algodão e 3% elastano com bolso faca. Link seguro na sacolinha!',
        tags: 'calca chino slim, sarja peletizada, moda masculina casual, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=chino+pants+man+smart+casual+walking+street&color=orange',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - O GANCHO DA APARÊNCIA ALINHADA (HOOK):
- Passos do modelo com a calça chino cáqui com barra dobrada no tornozelo e tênis branco casual de couro.
- Texto na tela: "ELEGÂNCIA SEM RIGIDEZ POR R$ 58 👞👖"
- Narração direta: "A calça que todo homem deveria ter pra sair aos finais de semana quando não quer ir de terno nem de bermuda!"

🎬 CENA 2 (3-9s) - O TOQUE PELETIZADO AVELUDADO:
- Mão passando no tecido: toque aveludado suave de pêssego que não pinica nem faz barulho de atrito ao caminhar.
- Narração: "Sarja tratada com processo peletizado que deixa o toque suave como veludo e tem 3% de elastano pra dar liberdade de movimento."

🎬 CENA 3 (9-14s) - BOLSOS EMBUTIDOS TRASEIROS COM BOTÕES TARTARUGA:
- Mostrando a costura limpa dos bolsos traseiros embutidos que não deformam a silhueta.
- Narração: "Acabamento de alfaiataria com zíper de metal YKK reforçado que não emperra e travamento seguro."

🎬 CENA 4 (14-18s) - NÃO DESBOTA APÓS LAVAR:
- Mostrando a cor viva e uniforme do tingimento reativo que não solta tinta na máquina.
- Narração: "Tingimento reativo que mantém a cor viva após dezenas de lavagens na máquina."

🎬 CENA 5 (18-22s) - CTA:
- Modelo apontando para a sacolinha da Shopee:
- Narração: "Tamanhos do 38 ao 48 na sacolinha oficial aqui da Shopee com cupom de desconto exclusivo. Garanta a sua cor!"`,
      },
      // 55. Moda Masculina - PRO
      {
        title:
          'Camisa Polo Masculina em Piquet Penteado com Gola Canelada Estruturada - POV Encontro Casual',
        description:
          'POV se arrumando para almoço em restaurante com polo azul marinho que não amassa, com gola que não enrola nas pontas.',
        niche: 'moda_masculina',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'POV: A camisa polo que NÃO fica com a gola enrolada parecendo velha após a primeira lavagem!',
        call_to_action:
          'Malha piquet penteada com entretela interna na gola. Link no carrinho amarelo!',
        tags: 'camisa polo piquet, gola estruturada, casual elegante, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=navy+piquet+polo+shirt+man+mirror+casual&color=blue',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - O PROBLEMA DA GOLA ENROLADA (HOOK):
- POV em frente ao espelho ajeitando o colarinho impecavelmente plano e firme da polo marinho.
- Texto na tela: "GOLA QUE NUNCA ENROLA! 👔🔥"
- Narração sincera: "POV: Você finalmente encontrou a polo que não fica com aquela gola murcha enrolada que parece que tem 10 anos de uso!"

🎬 CENA 2 (3-9s) - O SEGREDO DA GOLA COM ESTRUTURA:
- Puxando a ponta da gola: entretela flexível interna que mantém as pontas esticadas mesmo sem passar a ferro.
- Narração: "A gola canelada tem reforço interno que não desaba e os botões têm costura em cruz reforçada."

🎬 CENA 3 (9-14s) - MALHA PIQUET 100% ALGODÃO RESPIRÁVEL:
- Mostrando a textura colmeia da malha piquet que permite circulação contínua de ar fresco.
- Narração: "A malha em favo de mel permite o corpo respirar no calor sem ficar empapado de suor e não pinica nos braços."

🎬 CENA 4 (14-18s) - O AJUSTE NA MANGA:
- Punho canelado justo no bíceps sem apertar a circulação, destacando o contorno dos braços.
- Narração: "O punho na manga desenha o braço e dá aquele visual atlético natural."

🎬 CENA 5 (18-22s) - CTA:
- Apontando pro carrinho amarelo:
- Narração: "Kit com 2 polos por menos de R$ 69 no carrinho amarelo do TikTok Shop. Pega o cupom de frete grátis agora!"`,
      },
      // 56. Fitness & Academia - PRO
      {
        title:
          'Calça Jogger Masculina com Reforço no Gancho e Bolso Zíper - Modelo Treino ao Ar Livre',
        description:
          'Modelo fazendo barras e pulos na calistenia ao ar livre com calça jogger de tecido tech flexível e bolsos vedados.',
        niche: 'fitness_academia',
        style: 'modelo',
        platform: 'ambos',
        is_free: false,
        hook: 'A calça jogger de treino que NÃO rasga no cavalo quando você agacha pesado!',
        call_to_action: 'Gavião anatômico reforçado e tecido tactel com elastano. Link na vitrine!',
        tags: 'calca jogger treino, calistenia, bolso ziper, elastano masculino, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=man+workout+joggers+street+calisthenics&color=black',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP / SHOPEE - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - O GANCHO DO TESTE DE RESISTÊNCIA (HOOK):
- Modelo fazendo agachamento profundo e depois salto explosivo na caixa: a calça acompanha o movimento perfeitamente.
- Texto na tela: "AGUENTA O TREINO MAIS PESADO 💪🧱"
- Narração com energia: "Quantas calças de treino você já perdeu porque rasgaram no meio das pernas no primeiro treino de perna pesado? Essa daqui é indestrutível!"

🎬 CENA 2 (3-9s) - O REFORÇO NO GAVIÃO ANATÔMICO:
- Close na costura entrepernas com recorte losango em elastano que dissipa toda a tensão mecânica do movimento.
- Narração: "Recorte anatômico no gancho com costura tripla em travete: não repuxa no agachamento nem na corrida."

🎬 CENA 3 (9-14s) - BOLSOS COM ZÍPER INVISÍVEL ANTIFURTO:
- Colocando chave e celular nos bolsos com zíper emborrachado selado.
- Narração: "Os zíperes são vedados e não deixam suas coisas caírem no chão durante o treino deitado no colchonete."

🎬 CENA 4 (14-18s) - PUNHO NO TORNOZELO QUE NÃO APERTA:
- Barra elástica canelada que fica firme sem prender a panturrilha.
- Narração: "Tecido dry fit com 8% de elastano que seca na hora e barra que não sobe."

🎬 CENA 5 (18-22s) - CTA:
- Modelo apontando para a vitrine com sorriso confiante:
- Narração: "Preço de confecção direto na vitrine aqui embaixo com entrega rápida. Garante a sua cor!"`,
      },
      // 57. Moda Praia - PRO
      {
        title: 'Vestido Saída de Praia em Trico Crochet Artesanal Vazado - Modelo Praia Tropical',
        description:
          'Modelo caminhando na areia dourada ao pôr do sol com vestido em ponto crochet trabalhado, transparência elegante e franjas na barra.',
        niche: 'moda_praia',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'O vestido de crochet que parece feito à mão em praia do Caribe por R$ 56!',
        call_to_action:
          'Trama em fio macio de algodão que não deforma na água. Link no carrinho amarelo!',
        tags: 'vestido crochet praia, saida artesanal, verao chic, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=crochet+beach+dress+tassels+woman+sunset+sand&color=white',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 23 SEGUNDOS]

🎬 CENA 1 (0-3s) - O VISUAL DESLUMBRANTE DO PÔR DO SOL (HOOK):
- Modelo caminhando na beira d'água com vestido de crochet areia/branco, o sol refletindo entre as tramas vazadas com efeito dourado.
- Texto na tela: "LOOK DOS SONHOS NA PRAIA 🌴✨"
- Narração suave: "Se você quer fotos impecáveis nas suas férias na praia, essa saída em ponto crochet é a peça mais mágica que você vai encontrar!"

🎬 CENA 2 (3-9s) - A TRAMA ARTESANAL MACIA:
- Close nos detalhes das tramas vazadas com pontos geométricos florais e franjas de algodão na barra que balançam com o vento.
- Narração: "A trama é feita em fio de algodão macio: não pinica na pele, não esquenta no sol forte e tem peso que deixa a peça assentada no corpo."

🎬 CENA 3 (9-14s) - O DECOTE NAS COSTAS COM AMARRAÇÃO:
- Giro mostrando o decote cavado nas costas com cordão de amarração delicado com ponteiras de madeira.
- Narração: "As costas abertas valorizam a marquinha do biquíni e o decote frontal é elegante sem exagero."

🎬 CENA 4 (14-18s) - SECAGEM RÁPIDA & NÃO DEFORMA:
- A peça molhada na barra pela marola não deforma nem estica exageradamente.
- Narração: "Pode molhar na beira da água sem medo: seca em poucos minutos com o calor da brisa."

🎬 CENA 5 (18-23s) - CTA:
- Modelo sorrindo e sinalizando para o carrinho amarelo:
- Narração: "Peça de edição limitada de verão no carrinho amarelo do TikTok Shop. Aproveite o frete grátis antes que esgote o lote de confecção!"`,
      },
      // 58. Calçados & Acessórios - PRO
      {
        title: 'Mochila Antifurto Impermeável com Trava TSA e Saída USB - Unboxing Vitrine Viagem',
        description:
          'Abertura e teste dos compartimentos secretos da mochila com trava por senha numérica TSA, tecido à prova de corte e saída USB externa.',
        niche: 'acessorios_calcados',
        style: 'unboxing_vitrine',
        platform: 'shopee',
        is_free: false,
        hook: 'A mochila antifurto que NINGUÉM consegue abrir nas suas costas no metrô ou aeroporto!',
        call_to_action:
          'Trava TSA com zíperes ocultos e saída USB para carregador. Link seguro na sacolinha!',
        tags: 'mochila antifurto, trava tsa, notebook viagem, shopee achados',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=anti+theft+backpack+tsa+lock+laptop+unboxing&color=black',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 23 SEGUNDOS]

🎬 CENA 1 (0-3s) - O TESTE DA SEGURANÇA NO TRANSPORTE (HOOK):
- Colocando a senha numérica na trava TSA de metal e travando os puxadores de zíper com som de 'click' firme.
- Texto na tela: "SEGURANÇA TOTAL NO METRÔ E ÔNIBUS 🔒🚇"
- Narração confiante: "Você anda com medo de abrirem sua mochila no metrô lotado ou na rua? Veja essa tecnologia antifurto por menos de R$ 65!"

🎬 CENA 2 (3-9s) - O SISTEMA DE ZÍPERES OCULTOS:
- Mostrando que não existe nenhum zíper visível na frente da mochila: todos os acessos ficam voltados contra as costas de quem usa.
- Narração: "Todos os zíperes principais ficam embutidos nas suas costas: ninguém consegue enfiar a mão enquanto você tá caminhando."

🎬 CENA 3 (9-14s) - TECIDO BLINDADO ANTI-CORTE E IMPERMEÁVEL:
- Passando uma lâmina ou chave com força na superfície: zero rasgos. Jogando água: as gotas escorrem.
- Narração: "Tecido Oxford de 5 camadas resistente a cortes e totalmente impermeável à chuva pesada."

🎬 CENA 4 (14-18s) - PORTA USB EXTERNA E ESPAÇO PARA NOTEBOOK:
- Conectando o cabo do celular na lateral da mochila enquanto o powerbank fica seguro dentro.
- Compartimento acolchoado para notebook de até 15.6 polegadas.
- Narração: "Carrega seu celular na rua sem abrir a bolsa e protege seu computador contra impactos."

🎬 CENA 5 (18-23s) - CTA:
- Apontando pro link da sacolinha:
- Narração: "O melhor investimento pra faculdade e viagens. Clica na sacolinha aqui da Shopee e garanta a sua com cupom de desconto!"`,
      },
      // 59. Streetwear & Casual - PRO
      {
        title: 'Jaqueta Corta-Vento Refletiva Neon Streetwear - Modelo Noturno Urbano',
        description:
          'Modelo caminhando no asfalto molhado à noite quando o flash da câmera bate e a jaqueta inteira brilha com efeito refletivo brilhante.',
        niche: 'streetwear_casual',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: false,
        hook: 'O flash bateu e a jaqueta inteira ACENDEU: o corta-vento mais viral da cena streetwear!',
        call_to_action:
          'Tecido 100% refletivo 3M com forro interno respirável. Link no carrinho amarelo!',
        tags: 'corta vento refletivo, streetwear noite, glow in dark, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=reflective+windbreaker+jacket+night+flash+urban&color=gray',
        prompt_text: `[ESTRUTURA DE VÍDEO TIKTOK SHOP - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - O EFEITO DO FLASH QUE HIPNOTIZA (HOOK):
- Modelo no escuro da rua: no momento que o flash do celular liga, a jaqueta inteira brilha em prata incandescente cegante!
- Texto na tela: "BRILHA NO ESCURO COM O FLASH ⚡📸"
- Narração animada: "O visual que tá quebrando o feed das redes sociais no mundo todo e custa menos de R$ 70!"

🎬 CENA 2 (3-9s) - COMO FUNCIONA A TECNOLOGIA REFLETIVA 3M:
- Close no tecido com partículas de microesferas de vidro refletivo que devolvem qualquer feixe de luz à noite.
- Narração: "Microprismas refletivos que acendem com qualquer farol de carro ou flash de câmera: segurança noturna e estilo futurista incomparável."

🎬 CENA 3 (9-14s) - FORRO INTERNO EM TELINHA MESH:
- Abrindo o zíper: forro interno de malha perfurada que impede o tecido externo de grudar nos braços com o suor.
- Narração: "Não fica pegajosa na pele por dentro graças ao forro de mesh respirável, e o capuz tem cordão de ajuste anatômico."

🎬 CENA 4 (14-18s) - CORTA O VENTO E A CHUVA FINA:
- Mostrando a vedação dos punhos elásticos e da barra na cintura.
- Narração: "Protege do vento frio na moto, no rolê de skate ou na caminhada noturna."

🎬 CENA 5 (18-22s) - CTA:
- Modelo apontando pro carrinho amarelo:
- Narração: "Item exclusivo para quem curte se destacar de verdade. Clica no carrinho amarelo aqui embaixo e garanta o frete grátis!"`,
      },
      // 60. Lingerie & Pijamas - PRO
      {
        title:
          'Sutiã Invisível Adesivo de Silicone com Fecho Frontal - POV Provador Decote Profundo',
        description:
          'POV colocando o sutiã de silicone adesivo com fecho frontal que une os seios e permite usar vestidos com decote profundo nas costas.',
        niche: 'lingerie_pijamas',
        style: 'pov',
        platform: 'shopee',
        is_free: false,
        hook: 'POV: O sutiã adesivo que NUNCA cai mesmo se você suar muito na festa!',
        call_to_action:
          'Cola de silicone biológico medicinal lavável e reutilizável até 50 vezes. Link na sacola!',
        tags: 'sutien adesivo, invisivel silicone, decote costas, levanta seio, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=invisible+sticky+bra+silicone+backless+dress&color=pink',
        prompt_text: `[ESTRUTURA DE VÍDEO SHOPEE - 22 SEGUNDOS]

🎬 CENA 1 (0-3s) - O DILEMA DO VESTIDO DE COSTAS ABERTAS (HOOK):
- POV em frente ao espelho com um vestido maravilhoso de festa com as costas inteiras abertas até a cintura.
- Texto na tela: "O SEGREDO DO DECOTE PERFEITO 👗✨"
- Narração confiante: "POV: O dia em que você aprendeu a colocar o sutiã de silicone certo e nunca mais deixou de usar roupa decotada por medo de cair!"

🎬 CENA 2 (3-9s) - O FECHO FRONTAL 'PUSH-UP':
- Colocando uma aba de cada lado e travando o clipe de encaixe central: os seios se aproximam e empinam instantaneamente.
- Narração: "Você aplica uma taça em cada lado, junta o clipe frontal e ele cria aquele decote lindo e volumoso sem nenhuma alça aparente."

🎬 CENA 3 (9-14s) - O TESTE DO SUOR & ADERÊNCIA:
- Puxando a borda com os dedos: a cola biológica medicinal fixa com firmeza na pele sem dor ao retirar.
- Narração: "A cola de silicone medicinal é hipoalergênica, não solta com suor e dura mais de 50 usos se lavar com sabão neutro."

🎬 CENA 4 (14-18s) - COSTAS 100% LIVRES:
- Virando de costas no espelho: zero faixas, zero ganchos, costas limpas para qualquer vestido de festa.
- Narração: "Invisível em qualquer vestido de festa, cropped aberto ou macacão decotado."

🎬 CENA 5 (18-22s) - CTA:
- Apontando delicadamente para a sacolinha da Shopee:
- Narração: "Vem com capa protetora de armazenamento. Deixei o link na sacolinha aqui da Shopee com frete grátis hoje!"`,
      },
    ]

    for (let i = 0; i < proPromptsPart5.length; i++) {
      const p = proPromptsPart5[i]
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
