/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const promptsCol = app.findCollectionByNameOrId('prompts')

    const freePrompts = [
      // 1. Moda Feminina - Gratuito
      {
        title: 'Cropped Canelado Básico Gola Alta - Vídeo Provador Rápido',
        description:
          'Demonstração simples em frente ao espelho com cropped canelado que combina com qualquer calça.',
        niche: 'moda_feminina',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: true,
        hook: 'Aquele cropped básico de R$ 19 que vai salvar seus looks da semana inteira!',
        call_to_action:
          'Tecido canelado macio com elastano. Clica no carrinho amarelo aqui embaixo!',
        tags: 'cropped canelado, moda feminina, basico, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=ribbed+crop+top+woman+mirror+casual&color=black',
        prompt_text: `[ROTEIRO SIMPLES TIKTOK SHOP - 15 SEGUNDOS]

🎬 CENA 1 (0-3s) - O GANCHO RÁPIDO:
- Segurando o cropped em frente ao espelho.
- Narração: "Se você precisa de um cropped básico que não fica transparente, olha essa peça de R$ 19!"
- Texto na tela: "Básico que veste bem demais ✨"

🎬 CENA 2 (3-9s) - PROVA NO CORPO:
- Transição rápida vestindo a peça com um jeans simples.
- Mão esticando a manga e a cintura para mostrar que tem boa elasticidade e não aperta.
- Narração: "O tecido canelado estica super bem, tem gola alta confortável e não marca nada."

🎬 CENA 3 (9-15s) - CHAMADA SIMPLES:
- Apontando para o carrinho:
- Narração: "Tem em 6 cores neutras e tá com frete grátis. Clica no carrinho amarelo aqui embaixo e garante o seu!"`,
      },
      // 2. Moda Feminina - Gratuito
      {
        title: 'Regata Alcinha Básica em Ribana - Provador Sem Complicação',
        description: 'Roteiro direto mostrando como a regata se ajusta no corpo sem alça cair.',
        niche: 'moda_feminina',
        style: 'pov',
        platform: 'shopee',
        is_free: true,
        hook: 'Pare de gastar caro em regata básica: essa custa menos de R$ 15 na Shopee!',
        call_to_action: 'Alcinha firme que não machuca. Link na sacolinha com frete grátis!',
        tags: 'regata basica, ribana, shopee achados, moda feminina',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=ribbed+tank+top+woman+mirror+casual&color=white',
        prompt_text: `[ROTEIRO SIMPLES SHOPEE - 14 SEGUNDOS]

🎬 CENA 1 (0-3s) - GANCHO DIRETO:
- Mostrando a regata dobrada na mão.
- Narração: "Achei a melhor regata básica da Shopee por menos de 15 reais!"
- Texto na tela: "Achadinho de R$ 15 na Shopee 🛍️"

🎬 CENA 2 (3-8s) - VESTINDO A PEÇA:
- Vestindo com shorts jeans no quarto.
- Mostrando que a alça fica no lugar e o decote não fica caindo.
- Narração: "Algodão com ribana macia, não aperta o ombro e veste do 36 ao 42."

🎬 CENA 3 (8-14s) - CTA:
- Apontando para o link:
- Narração: "Envio super rápido do vendedor. Clica no link da sacola aqui do vídeo!"`,
      },
      // 3. Moda Feminina - Gratuito
      {
        title: 'Shorts Jeans Básico Cintura Alta - Modelo Caminhando',
        description: 'Modelo com look simples do dia a dia mostrando caimento soltinho na coxa.',
        niche: 'moda_feminina',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: true,
        hook: 'O shorts jeans que não aperta a coxa e veste super bem!',
        call_to_action: '100% algodão e barra desfiada moderna. Link no carrinho!',
        tags: 'shorts jeans, cintura alta, dia a dia, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=high+waist+denim+shorts+woman+walking&color=blue',
        prompt_text: `[ROTEIRO SIMPLES TIKTOK SHOP - 15 SEGUNDOS]

🎬 CENA 1 (0-3s) - GANCHO:
- Modelo caminhando de costas e virando de frente com um sorriso.
- Narração: "O shorts jeans mais confortável que você vai comprar pro seu dia a dia!"
- Texto na tela: "Não aperta a coxa! 👖✨"

🎬 CENA 2 (3-9s) - DETALHE DA CINTURA:
- Modelo passa a mão no cós alto e dá um passo lateral.
- Narração: "Cintura alta que segura a barriga sem sufocar e barra soltinha na coxa."

🎬 CENA 3 (9-15s) - CTA:
- Modelo aponta para o carrinho:
- Narração: "Aproveita que tá na promoção de lançamento. Clica no carrinho amarelo aqui embaixo!"`,
      },
      // 4. Moda Masculina - Gratuito
      {
        title: 'Camiseta Básica Algodão 100% Penteado - Modelo Direto',
        description: 'Modelo masculino vestindo camiseta preta básica de algodão que não encolhe.',
        niche: 'moda_masculina',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: true,
        hook: 'A camiseta preta básica que todo homem precisa no guarda-roupa!',
        call_to_action: 'Algodão macio que não desbota. Clica no carrinho amarelo!',
        tags: 'camiseta basica, algodao, moda masculina, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=black+basic+tshirt+man+studio+minimal&color=black',
        prompt_text: `[ROTEIRO SIMPLES TIKTOK SHOP - 14 SEGUNDOS]

🎬 CENA 1 (0-3s) - GANCHO:
- Modelo vestindo camiseta preta alinhada.
- Narração: "Se você quer uma camiseta preta básica que não parece velha após a primeira lavagem, olha isso!"
- Texto na tela: "Básica essencial masculina 👕"

🎬 CENA 2 (3-8s) - TOQUE DO TECIDO:
- Close na costura da gola e na manga rente ao bíceps.
- Narração: "Algodão 100% penteado, gola firme e caimento perfeito no peito e ombros."

🎬 CENA 3 (8-14s) - CTA:
- Modelo aponta pro carrinho:
- Narração: "Kit com 3 peças no precinho no carrinho amarelo aqui embaixo. Garante o seu!"`,
      },
      // 5. Moda Masculina - Gratuito
      {
        title: 'Bermuda Moletom Básica com Cordão - POV Casa e Treino',
        description: 'POV descendo do sofá com bermuda moletom cinza confortável para o dia a dia.',
        niche: 'moda_masculina',
        style: 'pov',
        platform: 'shopee',
        is_free: true,
        hook: 'A bermuda mais confortável que você vai colocar no corpo hoje!',
        call_to_action: 'Bolsos fundos e cordão com ajuste. Link na sacolinha!',
        tags: 'bermuda moletom, conforto, masculino, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=grey+sweatpant+shorts+man+casual&color=gray',
        prompt_text: `[ROTEIRO SIMPLES SHOPEE - 15 SEGUNDOS]

🎬 CENA 1 (0-3s) - GANCHO:
- POV: Câmera mostrando a bermuda no corpo e tênis casual.
- Narração: "POV: Você achou aquela bermuda de moletom perfeita pra ficar em casa ou treinar..."
- Texto na tela: "Conforto puro por R$ 25 🩳"

🎬 CENA 2 (3-9s) - DETALHES:
- Mão colocando o celular dentro do bolso lateral fundo e puxando o cordão.
- Narração: "Bolso fundo que cabe o celular sem cair e tecido macio que não esquenta."

🎬 CENA 3 (9-15s) - CTA:
- Apontando pro link:
- Narração: "Tá custando menos de R$ 30 na Shopee. Clica na sacolinha aqui do vídeo!"`,
      },
      // 6. Moda Masculina - Gratuito
      {
        title: 'Calça Jogger Sarja com Elástico - Unboxing Rápido',
        description: 'Abertura rápida de pacote com calça jogger preta estilosa.',
        niche: 'moda_masculina',
        style: 'unboxing_vitrine',
        platform: 'ambos',
        is_free: true,
        hook: 'Abri o pacote da calça jogger mais barata que encontrei na internet!',
        call_to_action: 'Sarja com elastano e punho reforçado. Link na vitrine!',
        tags: 'calça jogger, sarja preta, unboxing masculino, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=black+jogger+pants+man+streetwear&color=black',
        prompt_text: `[ROTEIRO SIMPLES SHOPEE / TIKTOK - 16 SEGUNDOS]

🎬 CENA 1 (0-3s) - ABERTURA RÁPIDA:
- Rasgando o envelope plástico e tirando a calça preta.
- Narração: "Será que compensa comprar calça jogger por menos de R$ 40?"
- Texto na tela: "Unboxing de R$ 39 📦👖"

🎬 CENA 2 (3-10s) - MOSTRANDO O TECIDO:
- Mão esticando o elástico da cintura e o tornozelo.
- Narração: "O tecido é sarja com elastano, tem boa costura e não é fininha transparente."

🎬 CENA 3 (10-16s) - CTA:
- Apontando para o botão de compra:
- Narração: "Veste super bem no corpo com tênis. Link tá aqui embaixo na vitrine!"`,
      },
      // 7. Fitness & Academia - Gratuito
      {
        title: 'Top Fitness Nadador com Bojo Removível - Provador Simples',
        description: 'Provando o top nadador básico de academia com boa sustentação.',
        niche: 'fitness_academia',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: true,
        hook: 'O top de academia de R$ 16 que segura tudo no treino!',
        call_to_action: 'Bojo removível e costas nadador confortáveis. Link no carrinho!',
        tags: 'top fitness, academia basico, sustentacao, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=sports+bra+crop+top+gym+woman&color=blue',
        prompt_text: `[ROTEIRO SIMPLES TIKTOK SHOP - 14 SEGUNDOS]

🎬 CENA 1 (0-3s) - GANCHO:
- POV em frente ao espelho com o top esportivo nadador.
- Narração: "Se você faz academia ou caminhada, precisa ver esse top de 16 reais!"
- Texto na tela: "Top básico que segura tudo 🏃‍♀️"

🎬 CENA 2 (3-8s) - MOVIMENTO:
- Dois pulinhos leves mostrando que o busto fica firme e seguro.
- Narração: "Costas nadador que deixam os ombros livres e bojo macio que dá pra tirar pra lavar."

🎬 CENA 3 (8-14s) - CTA:
- Apontando para o carrinho:
- Narração: "Tem várias cores lindas no carrinho amarelo aqui embaixo. Escolha a sua!"`,
      },
      // 8. Fitness & Academia - Gratuito
      {
        title: 'Legging Básica Suplex Cintura Alta - Modelo Agachando',
        description:
          'Modelo fazendo agachamento simples para mostrar que a legging básica não desce.',
        niche: 'fitness_academia',
        style: 'modelo',
        platform: 'shopee',
        is_free: true,
        hook: 'Aquela legging básica preta que não fica caindo da cintura!',
        call_to_action: 'Cós alto largo anatômico. Link na sacolinha da Shopee!',
        tags: 'legging preta, suplex basico, treino dia a dia, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=black+gym+leggings+woman+workout&color=black',
        prompt_text: `[ROTEIRO SIMPLES SHOPEE - 15 SEGUNDOS]

🎬 CENA 1 (0-3s) - GANCHO:
- Modelo fazendo um agachamento simples e sorrindo.
- Narração: "Cansada de legging que você precisa ficar puxando a cada 2 minutos?"
- Texto na tela: "Cintura alta que NÃO escorrega 🧘‍♀️"

🎬 CENA 2 (3-9s) - O CÓS ALTO:
- Modelo passando a mão na cintura mostrando o cós duplo largo.
- Narração: "O cós alto aperta na medida certa sem enrolar na barriga durante o treino."

🎬 CENA 3 (9-15s) - CTA:
- Apontando pro link:
- Narração: "Preço super acessível na Shopee com cupom de frete. Clica na sacolinha!"`,
      },
      // 9. Fitness & Academia - Gratuito
      {
        title: 'Camiseta Dry Fit Feminina Leve - Unboxing Vitrine',
        description: 'Tirando a camiseta dry fit leve da embalagem e mostrando secagem rápida.',
        niche: 'fitness_academia',
        style: 'unboxing_vitrine',
        platform: 'ambos',
        is_free: true,
        hook: 'Essa camiseta de treino custou R$ 18 e é mais fresca que as de shopping!',
        call_to_action: 'Tecido furadinho respirável. Link disponível na vitrine!',
        tags: 'dry fit, camiseta academia, feminina, fresca, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=dry+fit+running+tshirt+woman+gym&color=pink',
        prompt_text: `[ROTEIRO SIMPLES TIKTOK SHOP / SHOPEE - 14 SEGUNDOS]

🎬 CENA 1 (0-3s) - GANCHO:
- Segurando a camiseta contra a luz da janela.
- Narração: "A camiseta de treino mais levinha e fresca que eu já usei!"
- Texto na tela: "Fresca e levinha por R$ 18 💨"

🎬 CENA 2 (3-8s) - DETALHE DA MALHA:
- Close nos furinhos respiráveis do tecido dry fit.
- Narração: "Não esquenta, seca em 10 minutos após lavar e não amassa na bolsa de treino."

🎬 CENA 3 (8-14s) - CTA:
- Apontando pro link da vitrine:
- Narração: "Cores neon e neutras disponíveis. Clica no link aqui embaixo!"`,
      },
      // 10. Moda Praia - Gratuito
      {
        title: 'Biquíni Básico Cortininha Liso - POV Mala de Praia',
        description: 'Colocando o biquíni básico cortininha na mala rápida de fim de semana.',
        niche: 'moda_praia',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: true,
        hook: 'O biquíni clássico que nunca sai de moda e custou R$ 29!',
        call_to_action: 'Forro duplo com bojo removível. Link no carrinho amarelo!',
        tags: 'biquini cortininha, basico praia, verao, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=simple+triangle+bikini+beach+flatlay&color=red',
        prompt_text: `[ROTEIRO SIMPLES TIKTOK SHOP - 14 SEGUNDOS]

🎬 CENA 1 (0-3s) - GANCHO:
- POV dobrando o biquíni na mala de praia com óculos de sol.
- Narração: "Aquele biquíni cortininha clássico pra garantir a marquinha perfeita!"
- Texto na tela: "Marquinha perfeita por R$ 29 ☀️"

🎬 CENA 2 (3-8s) - DETALHE DAS AMARRAÇÕES:
- Mostrando as cordinhas longas fáceis de amarrar e o tecido forrado.
- Narração: "O tecido é forrado, não fica transparente e as alças são compridas pra ajustar certinho."

🎬 CENA 3 (8-14s) - CTA:
- Apontando pro carrinho:
- Narração: "Chega rápido pro seu final de semana. Clica no carrinho amarelo aqui embaixo!"`,
      },
      // 11. Moda Praia - Gratuito
      {
        title: 'Canga Saída de Praia Estampada - Modelo Desfilando',
        description: 'Modelo amarrando a canga na cintura na beira da piscina.',
        niche: 'moda_praia',
        style: 'modelo',
        platform: 'shopee',
        is_free: true,
        hook: '3 jeitos fáceis de amarrar essa canga que custou R$ 19!',
        call_to_action: 'Tecido de viscose macio que seca rápido. Link na sacola!',
        tags: 'canga praia, saida de praia, estampada, shopee achados',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=beach+sarong+wrap+woman+poolside&color=cyan',
        prompt_text: `[ROTEIRO SIMPLES SHOPEE - 15 SEGUNDOS]

🎬 CENA 1 (0-3s) - GANCHO:
- Modelo abrindo a canga colorida em frente à piscina.
- Narração: "O acessório mais versátil da sua mala de praia por menos de 20 reais!"
- Texto na tela: "Canga linda por R$ 19 🏖️"

🎬 CENA 2 (3-9s) - AMARRAÇÃO RÁPIDA:
- Amarrando na cintura como saia transpassada e depois como vestido frente única.
- Narração: "Dá pra usar como saia, vestido ou estender na areia pra tomar sol."

🎬 CENA 3 (9-15s) - CTA:
- Modelo sorrindo e apontando pro link:
- Narração: "Várias estampas tropicais lindas. Clica no link da sacolinha da Shopee!"`,
      },
      // 12. Calçados & Acessórios - Gratuito
      {
        title: 'Chinelo Slide Nuvem Macio - Unboxing Simples',
        description: 'Tirando o slide nuvem da caixa e apertando o solado com o polegar.',
        niche: 'acessorios_calcados',
        style: 'unboxing_vitrine',
        platform: 'tiktok_shop',
        is_free: true,
        hook: 'Parece que você tá pisando num travesseiro de tão macio!',
        call_to_action: 'Solado ortopédico de EVA macio. Link no carrinho amarelo!',
        tags: 'chinelo nuvem, slide macio, conforto, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=pillow+cloud+slides+sandals+soft&color=yellow',
        prompt_text: `[ROTEIRO SIMPLES TIKTOK SHOP - 14 SEGUNDOS]

🎬 CENA 1 (0-3s) - GANCHO:
- Dedo afundando no solado ultra macio do chinelo nuvem.
- Narração: "O chinelo mais gostoso e macio que eu já comprei na vida!"
- Texto na tela: "Pisa fofo de verdade ☁️🩴"

🎬 CENA 2 (3-8s) - TESTE DO PÉ:
- Calçando no quarto e dando passos leves.
- Narração: "Solado de 4cm que alivia o cansaço dos pés e não escorrega no chão molhado."

🎬 CENA 3 (8-14s) - CTA:
- Apontando pro carrinho:
- Narração: "Tá na promoção hoje no carrinho amarelo aqui embaixo. Pega o seu tamanho!"`,
      },
      // 13. Calçados & Acessórios - Gratuito
      {
        title: 'Óculos de Sol Retrô Vintage - POV Provador Diário',
        description: 'POV colocando os óculos retrô em frente ao espelho do carro.',
        niche: 'acessorios_calcados',
        style: 'pov',
        platform: 'shopee',
        is_free: true,
        hook: 'O óculos de R$ 12 da Shopee que deixa qualquer foto com cara de Pinterest!',
        call_to_action: 'Proteção UV400 com armação leve. Link seguro na sacolinha!',
        tags: 'oculos escuros, retro, vintage, shopee achados',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=vintage+sunglasses+retro+aesthetic+car&color=black',
        prompt_text: `[ROTEIRO SIMPLES SHOPEE - 14 SEGUNDOS]

🎬 CENA 1 (0-3s) - GANCHO:
- POV colocando o óculos escuro estiloso em frente ao retrovisor.
- Narração: "Paguei só 12 reais nesse óculos na Shopee e ele parece daqueles caros!"
- Texto na tela: "Achadinho de R$ 12 🕶️✨"

🎬 CENA 2 (3-8s) - DETALHE DA ARMAÇÃO:
- Mostrando a armação quadrada clássica e lente escura com boa visão.
- Narração: "Armação resistente, lente com proteção e combina com qualquer roupa básica."

🎬 CENA 3 (8-14s) - CTA:
- Apontando pro link:
- Narração: "Vem bem embalado com saquinho. Clica na sacolinha aqui do vídeo!"`,
      },
      // 14. Calçados & Acessórios - Gratuito
      {
        title: 'Boné Básico Aba Curva Unissex - Modelo no Espelho',
        description: 'Modelo ajustando o fecho traseiro do boné aba curva preto.',
        niche: 'acessorios_calcados',
        style: 'modelo',
        platform: 'ambos',
        is_free: true,
        hook: 'O boné básico perfeito que não fica desajeitado na cabeça!',
        call_to_action: 'Fecho com regulagem de metal e 100% algodão. Link na vitrine!',
        tags: 'bone aba curva, basico unissex, casual, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=black+baseball+cap+man+mirror+casual&color=black',
        prompt_text: `[ROTEIRO SIMPLES SHOPEE / TIKTOK - 15 SEGUNDOS]

🎬 CENA 1 (0-3s) - GANCHO:
- Modelo colocando o boné preto e ajeitando a aba com estilo.
- Narração: "Se você tem dificuldade de achar boné que fica certinho na cabeça, veja esse!"
- Texto na tela: "Encaixe perfeito na cabeça 🧢"

🎬 CENA 2 (3-9s) - O FECHO DE REGULAGEM:
- Virando de costas mostrando a fivela de metal ajustável.
- Narração: "100% algodão, copa estruturada e fecho de metal que ajusta em qualquer tamanho."

🎬 CENA 3 (9-15s) - CTA:
- Modelo aponta pro link:
- Narração: "Tem em preto, bege e chumbo na vitrine aqui embaixo. Aproveita!"`,
      },
      // 15. Streetwear & Casual - Gratuito
      {
        title: 'Camiseta Boxy Streetwear Lisa - Modelo Casual',
        description: 'Modelo com corte quadrado boxy e manga mais comprida.',
        niche: 'streetwear_casual',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: true,
        hook: 'O caimento boxy que tá todo mundo usando no TikTok!',
        call_to_action: 'Corte reto que não aperta. Garanta no carrinho amarelo!',
        tags: 'camiseta boxy, streetwear basico, casual, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=boxy+fit+tshirt+man+urban+streetwear&color=white',
        prompt_text: `[ROTEIRO SIMPLES TIKTOK SHOP - 15 SEGUNDOS]

🎬 CENA 1 (0-3s) - GANCHO:
- Modelo de frente em fundo neutro com camiseta boxy branca.
- Narração: "O caimento boxy quadrado que valoriza os ombros e deixa o look moderno!"
- Texto na tela: "Caimento Boxy Perfeito 🔥"

🎬 CENA 2 (3-9s) - CAIMENTO:
- Modelo abre os braços de leve e vira de perfil.
- Narração: "Manga no cotovelo, comprimento na linha da cintura e malha encorpada."

🎬 CENA 3 (9-15s) - CTA:
- Apontando pro carrinho:
- Narração: "Peça essencial pro guarda-roupa. Clica no carrinho amarelo aqui embaixo!"`,
      },
      // 16. Streetwear & Casual - Gratuito
      {
        title: 'Gorro Beanie Básico Unissex - POV Se Arrumando',
        description: 'POV colocando o gorro preto canelado antes de sair no frio.',
        niche: 'streetwear_casual',
        style: 'pov',
        platform: 'shopee',
        is_free: true,
        hook: 'O gorro de R$ 10 que dá um up em qualquer look de inverno!',
        call_to_action: 'Tricô elástico que não pinica a cabeça. Link na sacolinha!',
        tags: 'gorro beanie, inverno, streetwear, shopee achados',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=black+knit+beanie+hat+streetwear&color=black',
        prompt_text: `[ROTEIRO SIMPLES SHOPEE - 14 SEGUNDOS]

🎬 CENA 1 (0-3s) - GANCHO:
- POV colocando o gorro no espelho e dobrando a barra.
- Narração: "Paguei 10 reais nesse beanie na Shopee e uso com tudo no frio!"
- Texto na tela: "Beanie básico por R$ 10 ❄️"

🎬 CENA 2 (3-8s) - O TOQUE DO TRICÔ:
- Mostrando a elasticidade do tecido que estica sem deformar.
- Narração: "Não pinica a testa, esquenta na medida e tem dobra ajustável."

🎬 CENA 3 (8-14s) - CTA:
- Apontando pro link:
- Narração: "Mais de 10 cores disponíveis na sacolinha da Shopee. Clica aqui!"`,
      },
      // 17. Streetwear & Casual - Gratuito
      {
        title: 'Meia Cano Alto Streetwear Algodão - Unboxing Vitrine',
        description: 'Abrindo o kit com 3 pares de meia cano médio/alto brancas.',
        niche: 'streetwear_casual',
        style: 'unboxing_vitrine',
        platform: 'ambos',
        is_free: true,
        hook: 'O kit de meias cano alto que não fica caindo na canela!',
        call_to_action: 'Elástico canelado firme e algodão macio. Link na vitrine!',
        tags: 'meia cano alto, kit meias, streetwear, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=white+crew+socks+sneakers+streetwear&color=white',
        prompt_text: `[ROTEIRO SIMPLES SHOPEE / TIKTOK - 15 SEGUNDOS]

🎬 CENA 1 (0-3s) - GANCHO:
- Tirando o par de meias da embalagem.
- Narração: "Aquelas meias cano alto estilo gringo que todo mundo procura!"
- Texto na tela: "Kit de meias que NÃO desce 🧦"

🎬 CENA 2 (3-9s) - TESTE DO ELÁSTICO:
- Esticando o cano canelado com as mãos e calçando com tênis.
- Narração: "O cano fica firme na canela o dia inteiro e a sola é atoalhada macia."

🎬 CENA 3 (9-15s) - CTA:
- Apontando pro link:
- Narração: "Sai baratinho o kit com 3 pares. Clica no link aqui embaixo!"`,
      },
      // 18. Infantil & Kids - Gratuito
      {
        title: 'Body Bebê Básico Canelado - POV Mãe Vestindo',
        description: 'POV mãe vestindo o bebê com body básico de botões de pressão.',
        niche: 'infantil_kids',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: true,
        hook: 'Mães: o body básico mais macio e fácil de vestir que achei!',
        call_to_action: '100% algodão e fecho triplo reforçado. Link no carrinho amarelo!',
        tags: 'body bebe, enxoval, maternidade, algodao, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=baby+cotton+onesie+infant+clothes&color=white',
        prompt_text: `[ROTEIRO SIMPLES TIKTOK SHOP - 15 SEGUNDOS]

🎬 CENA 1 (0-3s) - GANCHO:
- POV abotoando o body no bebê sobre o trocador.
- Narração: "Mãe, para de pagar caro em body que perde o formato em duas semanas!"
- Texto na tela: "Algodão macio pro bebê 👶🤍"

🎬 CENA 2 (3-9s) - A GOLA AMERICANA:
- Mostrando como a gola abre fácil sem apertar a cabeça do bebê.
- Narração: "Gola transpassada que passa suave pela cabecinha e botões resistentes embaixo."

🎬 CENA 3 (9-15s) - CTA:
- Apontando pro carrinho:
- Narração: "Kit econômico disponível no carrinho amarelo aqui embaixo. Aproveita!"`,
      },
      // 19. Infantil & Kids - Gratuito
      {
        title: 'Camiseta Infantil Básica Colorida - Modelo Criança',
        description: 'Criança correndo feliz no parque com camiseta amarela confortável.',
        niche: 'infantil_kids',
        style: 'modelo',
        platform: 'shopee',
        is_free: true,
        hook: 'Roupinha confortável de R$ 14 pra criança brincar à vontade!',
        call_to_action: 'Tecido levinho que não esquenta. Link na sacolinha da Shopee!',
        tags: 'camiseta infantil, crianca brincando, dia a dia, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=toddler+boy+yellow+tshirt+playing&color=yellow',
        prompt_text: `[ROTEIRO SIMPLES SHOPEE - 14 SEGUNDOS]

🎬 CENA 1 (0-3s) - GANCHO:
- Criança dando tchauzinho sorrindo com a camiseta colorida.
- Narração: "Roupa boa, bonita e barata pra criança gastar energia todo dia!"
- Texto na tela: "Pra brincar à vontade por R$ 14 🎈"

🎬 CENA 2 (3-8s) - DETALHE DO TECIDO:
- Mãe mostrando a gola sem etiqueta dura que pinica.
- Narração: "Algodão puro gostoso, fácil de lavar e não desbota fácil na máquina."

🎬 CENA 3 (8-14s) - CTA:
- Apontando pro link:
- Narração: "Tamanhos do 1 ao 10 na sacolinha da Shopee com frete grátis!"`,
      },
      // 20. Infantil & Kids - Gratuito
      {
        title: 'Shorts Infantil Moletom com Elástico - Unboxing Vitrine',
        description: 'Tirando da embalagem o kit de 3 shortinhos confortáveis para brincar.',
        niche: 'infantil_kids',
        style: 'unboxing_vitrine',
        platform: 'ambos',
        is_free: true,
        hook: 'O kit de shortinhos que toda mãe precisa ter na gaveta!',
        call_to_action: 'Elástico largo que não aperta a barriguinha. Link na vitrine!',
        tags: 'shorts infantil, kit roupa infantil, maternidade, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=kids+shorts+cotton+colorful+flatlay&color=blue',
        prompt_text: `[ROTEIRO SIMPLES SHOPEE / TIKTOK - 15 SEGUNDOS]

🎬 CENA 1 (0-3s) - GANCHO:
- Abrindo o pacote com 3 shortinhos infantis coloridos.
- Narração: "Kit com 3 bermudinhas confortáveis por menos de R$ 35!"
- Texto na tela: "Kit 3 Shorts por R$ 35 🧸"

🎬 CENA 2 (3-9s) - O ELÁSTICO:
- Esticando o cós de elástico suave com os dedos.
- Narração: "O elástico é super macio, não marca a barriguinha e tem cordão decorativo fofo."

🎬 CENA 3 (9-15s) - CTA:
- Apontando pro link da vitrine:
- Narração: "Ideal pra escolinha e parquinho. Link seguro aqui embaixo na vitrine!"`,
      },
      // 21. Lingerie & Pijamas - Gratuito
      {
        title: 'Calcinha Básico Algodão Sem Costura - Provador Rápido',
        description: 'Mostrando a lateral cortada a laser que não marca sob a calça legging.',
        niche: 'lingerie_pijamas',
        style: 'pov',
        platform: 'tiktok_shop',
        is_free: true,
        hook: 'A calcinha que NÃO marca nadinha na roupa justa!',
        call_to_action: 'Forro 100% algodão e corte a laser. Link no carrinho amarelo!',
        tags: 'calcinha sem costura, corte laser, nao marca, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=seamless+underwear+laser+cut+lingerie&color=pink',
        prompt_text: `[ROTEIRO SIMPLES TIKTOK SHOP - 14 SEGUNDOS]

🎬 CENA 1 (0-3s) - GANCHO:
- POV: Olhando a lateral da calça legging no espelho: zero marcação de calcinha.
- Narração: "A calcinha que salvou todos os meus looks com roupa justa!"
- Texto na tela: "ZERO MARCAÇÃO na roupa 🌸"

🎬 CENA 2 (3-8s) - A PEÇA NA MÃO:
- Mostrando a borda cortada a laser fininha e o fundo 100% algodão.
- Narração: "Corte a laser sem costura grossa, tecido levinho e forro respirável."

🎬 CENA 3 (8-14s) - CTA:
- Apontando pro carrinho:
- Narração: "Kit com 5 peças no precinho promocional. Clica no carrinho amarelo!"`,
      },
      // 22. Lingerie & Pijamas - Gratuito
      {
        title: 'Camisola Alcinha em Malha Conforto - Modelo Manhã',
        description: 'Modelo levantando da cama com camisola básica soltinha e confortável.',
        niche: 'lingerie_pijamas',
        style: 'modelo',
        platform: 'shopee',
        is_free: true,
        hook: 'A camisola mais levinha e fresca pra dormir nos dias quentes!',
        call_to_action: 'Malha fria que não esquenta. Link na sacolinha da Shopee!',
        tags: 'camisola alcinha, pijama fresco, loungewear, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=simple+slip+nightgown+woman+morning&color=white',
        prompt_text: `[ROTEIRO SIMPLES SHOPEE - 15 SEGUNDOS]

🎬 CENA 1 (0-3s) - GANCHO:
- Modelo espreguiçando na cama com luz suave da manhã.
- Narração: "Pra quem odeia dormir passando calor, essa camisola é a salvação!"
- Texto na tela: "Leve e fresca pra dormir 🌙"

🎬 CENA 2 (3-9s) - O TOQUE DO TECIDO:
- Modelo passa a mão no tecido fluido soltinho que cai suave no corpo.
- Narração: "Malha com toque geladinho, alcinhas reguláveis e não prende os movimentos."

🎬 CENA 3 (9-15s) - CTA:
- Modelo aponta pro link:
- Narração: "Custa menos de R$ 25 na Shopee. Clica na sacolinha aqui do vídeo!"`,
      },
      // 23. Lingerie & Pijamas - Gratuito
      {
        title: 'Top Faixa Sem Alça em Renda - Unboxing Vitrine',
        description: 'Tirando o top faixa em renda com forro no busto da embalagem.',
        niche: 'lingerie_pijamas',
        style: 'unboxing_vitrine',
        platform: 'ambos',
        is_free: true,
        hook: 'O top faixa de R$ 15 perfeito pra usar com blusinhas abertas!',
        call_to_action: 'Renda macia com elástico de silicone que não desce. Link na vitrine!',
        tags: 'top faixa, tomara que caia, renda, lingerie, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=lace+bandeau+tube+top+bra+lingerie&color=black',
        prompt_text: `[ROTEIRO SIMPLES SHOPEE / TIKTOK - 14 SEGUNDOS]

🎬 CENA 1 (0-3s) - GANCHO:
- Segurando o top faixa de renda preta contra o fundo branco.
- Narração: "O top tomara que caia mais lindo e barato da internet!"
- Texto na tela: "Top Faixa Renda por R$ 15 🖤"

🎬 CENA 2 (3-8s) - A SILICONE INTERNA:
- Mostrando a fitinha de silicone interna na borda que cola no corpo.
- Narração: "Tem fita de silicone pra não ficar caindo e bojo removível discreto."

🎬 CENA 3 (8-14s) - CTA:
- Apontando pro link:
- Narração: "Combina com camisa aberta e vestidos. Clica na vitrine aqui embaixo!"`,
      },
      // 24. Moda Feminina - Gratuito
      {
        title: 'Saia Canelada Midi com Fenda Simples - Modelo Andando',
        description: 'Modelo andando com saia canelada preta midi e tênis branco.',
        niche: 'moda_feminina',
        style: 'modelo',
        platform: 'tiktok_shop',
        is_free: true,
        hook: 'A saia midi que te deixa arrumada em 2 minutos!',
        call_to_action: 'Elástico na cintura que não enrola. Link no carrinho amarelo!',
        tags: 'saia midi, canelada, fenda, moda feminina, tiktok shop',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=midi+ribbed+skirt+woman+sneakers+walking&color=black',
        prompt_text: `[ROTEIRO SIMPLES TIKTOK SHOP - 15 SEGUNDOS]

🎬 CENA 1 (0-3s) - GANCHO:
- Modelo caminhando confiante com a saia midi e fenda sutil.
- Narração: "A saia canelada que combina tanto com tênis quanto com salto!"
- Texto na tela: "Arrumada em 2 minutos ✨"

🎬 CENA 2 (3-9s) - FENDA & MOVIMENTO:
- Mostrando a fenda lateral que dá liberdade para andar sem travar o passo.
- Narração: "Tecido canelado encorpado que disfarça marcas e elástico confortável na cintura."

🎬 CENA 3 (9-15s) - CTA:
- Apontando pro carrinho:
- Narração: "Preço de fábrica no carrinho amarelo aqui embaixo. Garante a sua cor!"`,
      },
      // 25. Moda Masculina - Gratuito
      {
        title: 'Regata Machão Masculina Algodão - POV Academia',
        description: 'POV no espelho com regata machão preta com ombro largo.',
        niche: 'moda_masculina',
        style: 'pov',
        platform: 'shopee',
        is_free: true,
        hook: 'A regata machão que valoriza o peitoral e não fica cavada demais!',
        call_to_action: 'Corte ombro a ombro e algodão macio. Link na sacolinha da Shopee!',
        tags: 'regata machao, regata masculina, treino, casual, shopee',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=muscle+tank+top+man+gym+mirror&color=black',
        prompt_text: `[ROTEIRO SIMPLES SHOPEE - 14 SEGUNDOS]

🎬 CENA 1 (0-3s) - GANCHO:
- POV no espelho da academia ou quarto.
- Narração: "A regata machão perfeita pra quem não gosta de regata cavada fininha!"
- Texto na tela: "Valoriza os ombros por R$ 22 💪"

🎬 CENA 2 (3-8s) - CORTE DO OMBRO:
- Mostrando o corte largo nos ombros e caimento reto no tronco.
- Narração: "Ombro largo bem desenhado, 100% algodão que respira e não esquenta."

🎬 CENA 3 (8-14s) - CTA:
- Apontando pro link:
- Narração: "Envio rápido em menos de 24h na Shopee. Clica na sacolinha aqui!"`,
      },
    ]

    for (let i = 0; i < freePrompts.length; i++) {
      const p = freePrompts[i]
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
