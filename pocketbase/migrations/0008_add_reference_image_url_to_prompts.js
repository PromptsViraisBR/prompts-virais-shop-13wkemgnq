/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('prompts')
    if (!col.fields.getByName('reference_image_url')) {
      col.fields.add(
        new TextField({
          name: 'reference_image_url',
          required: false,
        }),
      )
      app.save(col)
    }

    // Mapa temático cuidadoso com imagens verticais de alta conversão para cada nicho/estilo
    // Usando CDN usecurling com termos fotográficos realistas em inglês
    const promptVisuals = [
      {
        match: 'Vestido Midi Canelado Elegante',
        url: 'https://img.usecurling.com/p/720/1280?q=ribbed+midi+dress+woman+mirror+pov&color=pink',
      },
      {
        match: 'Camiseta Streetwear Oversized Pesada',
        url: 'https://img.usecurling.com/p/720/1280?q=streetwear+oversized+tshirt+man+urban&color=gray',
      },
      {
        match: 'Conjunto Fitness Sem Costura (Zero Transparência)',
        url: 'https://img.usecurling.com/p/720/1280?q=fitness+leggings+crop+top+gym+woman&color=purple',
      },
      {
        match: 'Biquíni Cortininha com Tecido Texturizado',
        url: 'https://img.usecurling.com/p/720/1280?q=textured+bikini+swimwear+beach+pool&color=cyan',
      },
      {
        match: 'Calça Alfaiataria Feminina Wide Leg',
        url: 'https://img.usecurling.com/p/720/1280?q=tailored+wide+leg+trousers+woman+fashion&color=black',
      },
      {
        match: 'Camisa Linho Masculina Manga Longa',
        url: 'https://img.usecurling.com/p/720/1280?q=linen+shirt+men+summer+coastal&color=white',
      },
      {
        match: 'Tênis Chunky Retrô Urbano',
        url: 'https://img.usecurling.com/p/720/1280?q=retro+chunky+sneakers+unboxing+streetwear&color=white',
      },
      {
        match: 'Vestido Romântico Floral com Amarração',
        url: 'https://img.usecurling.com/p/720/1280?q=floral+cottagecore+dress+romantic+sunlight&color=pink',
      },
      {
        match: 'Conjunto Moletom Flanelado Premium',
        url: 'https://img.usecurling.com/p/720/1280?q=cozy+hoodie+sweatpants+fleece+loungewear&color=gray',
      },
      {
        match: 'Pijama Americano Cetim com Friso',
        url: 'https://img.usecurling.com/p/720/1280?q=satin+silk+pajamas+piping+elegant&color=pink',
      },
      {
        match: 'Bolsa Baguete Minimalista Alça Dupla',
        url: 'https://img.usecurling.com/p/720/1280?q=minimalist+baguette+shoulder+bag+leather&color=black',
      },
      {
        match: 'Conjunto Infantil Kids Roupa Conforto',
        url: 'https://img.usecurling.com/p/720/1280?q=happy+toddler+cotton+clothes+colorful&color=yellow',
      },
      {
        match: 'Calça Jeans Wide Leg Cintura Perfeita',
        url: 'https://img.usecurling.com/p/720/1280?q=wide+leg+jeans+denim+fitting+room&color=blue',
      },
      {
        match: 'Blazer Alfaiataria Estruturado com Ombreira',
        url: 'https://img.usecurling.com/p/720/1280?q=structured+tailored+blazer+business+woman&color=black',
      },
      {
        match: 'Calça Cargo Tática com Bolsos Funcionais',
        url: 'https://img.usecurling.com/p/720/1280?q=tactical+cargo+pants+ripstop+streetwear&color=green',
      },
      {
        match: 'Kit Polos Piquet Slim Fit',
        url: 'https://img.usecurling.com/p/720/1280?q=piquet+polo+shirt+men+slim+fit&color=blue',
      },
      {
        match: 'Shorts Duplo com Bolso Térmico pra Celular',
        url: 'https://img.usecurling.com/p/720/1280?q=running+shorts+phone+pocket+compression&color=black',
      },
      {
        match: 'Macacão Fitness Efeito Empina Bumbum',
        url: 'https://img.usecurling.com/p/720/1280?q=scrunch+butt+fitness+jumpsuit+gym+woman&color=pink',
      },
      {
        match: 'Saída de Praia em Tule com Fenda Longa',
        url: 'https://img.usecurling.com/p/720/1280?q=tulle+beach+cover+up+maxi+dress+sunset&color=orange',
      },
      {
        match: 'Maiô Engana Mamãe com Recortes Estratégicos',
        url: 'https://img.usecurling.com/p/720/1280?q=cutout+one+piece+swimsuit+monokini+mirror&color=black',
      },
      {
        match: 'Sandália Papete de Strass Brilho Intenso',
        url: 'https://img.usecurling.com/p/720/1280?q=rhinestone+sparkle+slides+sandals+luxury&color=white',
      },
      {
        match: 'Bota Coturno Tratorada Couro Sintético',
        url: 'https://img.usecurling.com/p/720/1280?q=combat+lug+sole+boots+leather+punk&color=black',
      },
      {
        match: 'Bermuda Cargo Jeans Baggy Vintage',
        url: 'https://img.usecurling.com/p/720/1280?q=baggy+denim+jorts+cargo+skater+streetwear&color=blue',
      },
      {
        match: 'Jaqueta Corta-Vento Streetwear Impermeável',
        url: 'https://img.usecurling.com/p/720/1280?q=waterproof+windbreaker+jacket+reflective+streetwear&color=black',
      },
      {
        match: 'Pijama Infantil Brilha no Escuro',
        url: 'https://img.usecurling.com/p/720/1280?q=glow+in+the+dark+dinosaur+kids+pajamas&color=green',
      },
      {
        match: 'Vestidinho Infantil Rodado Festa Aniversário',
        url: 'https://img.usecurling.com/p/720/1280?q=little+girl+princess+party+dress+twirling&color=pink',
      },
      {
        match: 'Sutiã Sem Costura Invisível Efeito Lift',
        url: 'https://img.usecurling.com/p/720/1280?q=seamless+wireless+bra+invisible+under+shirt&color=pink',
      },
      {
        match: 'Robe de Noiva / Madrinha em Cetim com Renda Chantilly',
        url: 'https://img.usecurling.com/p/720/1280?q=bridal+satin+robe+lace+sleeves+wedding&color=white',
      },
      {
        match: 'Conjunto Alfaiataria Colete e Shorts',
        url: 'https://img.usecurling.com/p/720/1280?q=tailored+vest+waistcoat+shorts+set+fashion&color=white',
      },
      {
        match: 'Kit 3 Biquínis Canelados Sortidos',
        url: 'https://img.usecurling.com/p/720/1280?q=ribbed+bikini+set+flatlay+colorful+summer&color=cyan',
      },
    ]

    const records = app.findRecordsByFilter('prompts', '', 'created', 100, 0)
    for (let i = 0; i < records.length; i++) {
      const rec = records[i]
      const currentUrl = rec.getString('reference_image_url')
      if (currentUrl && currentUrl.trim()) {
        continue // Idempotente: se já tem imagem, pula
      }

      const title = rec.getString('title')
      const niche = rec.getString('niche')
      const style = rec.getString('style')

      let matchedUrl = ''
      for (let j = 0; j < promptVisuals.length; j++) {
        if (
          title.indexOf(promptVisuals[j].match) !== -1 ||
          promptVisuals[j].match.indexOf(title) !== -1
        ) {
          matchedUrl = promptVisuals[j].url
          break
        }
      }

      if (!matchedUrl) {
        const searchWord = (niche + ' ' + style).replace(/[^a-zA-Z0-9 ]/g, ' ')
        matchedUrl =
          'https://img.usecurling.com/p/720/1280?q=' +
          encodeURIComponent(searchWord) +
          '&color=pink'
      }

      rec.set('reference_image_url', matchedUrl)
      app.save(rec)
    }
  },
  (app) => {
    try {
      const col = app.findCollectionByNameOrId('prompts')
      const field = col.fields.getByName('reference_image_url')
      if (field) {
        col.fields.remove(field)
        app.save(col)
      }
    } catch (_) {}
  },
)
