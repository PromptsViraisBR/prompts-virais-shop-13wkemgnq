/// <reference path="../pb_data/types.d.ts" />

/**
 * Migração 0066:
 * 1. Adicionar o 8º nicho viral 'curiosidades_fatos' à lista de valores permitidos no campo 'niche' em prompts e generations
 * 2. Seed de prompts virais de alta retenção no formato de cenas de 10s para 'curiosidades_fatos' (1 gratuito + 1 PRO)
 */

migrate(
  (app) => {
    const promptsCol = app.findCollectionByNameOrId('prompts')
    const promptNicheField = promptsCol.fields.getByName('niche')

    if (promptNicheField) {
      const existingValues = promptNicheField.values || []
      if (!existingValues.includes('curiosidades_fatos')) {
        promptNicheField.values = [...existingValues, 'curiosidades_fatos']
        app.save(promptsCol)
      }
    }

    try {
      const genCol = app.findCollectionByNameOrId('generations')
      const genNicheField = genCol.fields.getByName('niche')
      if (genNicheField) {
        const existingGenValues = genNicheField.values || []
        if (!existingGenValues.includes('curiosidades_fatos')) {
          genNicheField.values = [...existingGenValues, 'curiosidades_fatos']
          app.save(genCol)
        }
      }
    } catch (_) {}

    // Seed de prompts para o nicho de Curiosidades & Fatos Misteriosos
    const curiosidadesPrompts = [
      {
        title: '🧠 O Mistério do Fundo do Oceano que Ninguém Consegue Explicar',
        description:
          'Roteiro viral de 60 segundos com 6 cenas de 10s: revelação científica chocante sobre o som misterioso gravado na Fossa das Marianas.',
        niche: 'curiosidades_fatos',
        style: 'pov',
        platform: 'ambos',
        is_free: true,
        category: 'virais',
        hook: 'POV: Você descobriu o que os cientistas gravaram no ponto mais fundo da Terra e por que esconderam!',
        call_to_action:
          'Você teria coragem de descer até lá? Comente se acredita em vida oculta no oceano!',
        tags: 'curiosidades, fatos chocantes, fossa das marianas, misterio oceanico, ciencia viral, shorts',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=deep+ocean+abyss+mariana+trench+mysterious+creature&color=blue',
        prompt_text: `[ROTEIRO VIRAL CRIADORES - 60 SEGUNDOS EM CENAS DE 10S (PT-BR | VÍDEO 100% LIMPO)]
⏱️ DURAÇÃO ALVO: ~60 Segundos (6 Cenas de até 10 segundos cada)
📌 DIRETRIZES ESSENCIAIS:
- Idioma da narração: Português Brasileiro (PT-BR) com voz grave, imersiva e tom documental de investigação
- Visual: Vídeo 100% limpo, SEM legendas gravadas na tela, SEM textos impressos no vídeo

🎬 CENA 1 (0-10s) - O SOM CHOCANTE NAS PROFUNDEZAS (HOOK):
- Visual: Câmera submersa mergulhando na escuridão azul profunda do oceano. Apenas o feixe de luz de um submarino ilumina partículas flutuantes.
- Narração (PT-BR): "Menos de cinco por cento de todo o oceano foi explorado pelo ser humano. Mas o que um submarino gravou a onze mil metros de profundidade vai te fazer repensar tudo o que sabe sobre a Terra!"

🎬 CENA 2 (10-20s) - O GRÁFICO DO ECO E A ANOMALIA:
- Visual: O feixe de luz atinge uma fenda rochosa monumental no fundo do abismo. Um sensor luminoso pisca com ondas sonoras gigantescas.
- Narração (PT-BR): "Sensores ultrassônicos captaram uma frequência biológica contínua. Não era uma baleia, não era um tremor de placas tectônicas. Era algo vivo e cinco vezes maior que qualquer criatura catalogada."

🎬 CENA 3 (20-30s) - O RELATO DO PILOTO DO SUBMARINO:
- Visual: Close dentro da cabine pressurizada: o visor de vidro espesso começa a vibrar levemente com a passagem de uma sombra colossal na escuridão.
- Narração (PT-BR): "O piloto registrou nos diários de bordo: 'A temperatura da água subiu dez graus em segundos e uma silhueta imensa passou deslizando sob o casco do submarino'."

🎬 CENA 4 (30-40s) - A REVELAÇÃO DA PRESSÃO IMPOSSÍVEL:
- Visual: Macro nos medidores de pressão indicando mais de mil atmosferas. Criaturas bioluminescentes translúcidas piscam em padrões hipnóticos.
- Narração (PT-BR): "Naquela profundidade, a pressão esmagaria um tanque blindado como lata de refrigerante. Como algo desse tamanho consegue nadar livremente?"

🎬 CENA 5 (40-50s) - O CORTE DA TRANSMISSÃO:
- Visual: Um tremor violento agita a câmera do robô submarino, uma barbatana escura de proporções míticas se move suavemente e o feixe de luz se perde no breu total.
- Narração (PT-BR): "O áudio oficial foi classificado como ultrassecreto pela marinha internacional durante trinta anos antes de vir a público."

🎬 CENA 6 (50-60s) - CHAMADA FINAL DE ENGAJAMENTO (CTA):
- Visual: O submarino retorna lentamente à superfície enquanto a luz solar volta a surgir no topo da água.
- Narração (PT-BR): "Você teria coragem de mergulhar nessa escuridão? Comenta aqui embaixo a sua teoria e segue o perfil para o próximo fato inacreditável!"`,
      },
      {
        title: '🧠 3 Coisas que o Seu Cérebro Faz Enquanto Você Dorme e Ninguém te Contou',
        description:
          'Roteiro viral educativo e hipnótico sobre neurologia, paralisia do sono e limpeza cerebral durante a fase REM.',
        niche: 'curiosidades_fatos',
        style: 'pov',
        platform: 'ambos',
        is_free: false,
        category: 'virais',
        hook: 'POV: O que o seu cérebro faz exatamente às 4 da manhã para te manter vivo!',
        call_to_action:
          'Você já teve a sensação de cair no vazio ao dormir? Conta nos comentários!',
        tags: 'cerebro humano, curiosidades sono, neurociencia viral, fatos incriveis, reels curiosidades',
        reference_image_url:
          'https://img.usecurling.com/p/720/1280?q=human+brain+glowing+synapses+night+dreaming+3d&color=purple',
        prompt_text: `[ROTEIRO VIRAL CRIADORES - 60 SEGUNDOS EM CENAS DE 10S (PT-BR | VÍDEO 100% LIMPO)]
⏱️ DURAÇÃO ALVO: ~60 Segundos (6 Cenas de até 10 segundos cada)
📌 DIRETRIZES ESSENCIAIS:
- Idioma da narração: Português Brasileiro (PT-BR) dinâmico, intrigante e acelerado
- Visual: Animação 3D hiper-realista das conexões neurais brilhando no escuro da noite

🎬 CENA 1 (0-10s) - O GANCHO DO DESLIGAMENTO (HOOK):
- Visual: Close nos olhos de uma pessoa se fechando na cama; corte fluido para dentro do crânio com neurônios brilhando em tons de azul e roxo elétrico.
- Narração (PT-BR): "Você acha que quando dorme o seu corpo simplesmente desliga? Prepare-se para descobrir as três coisas mais bizarras que o seu cérebro faz escondido de você todas as noites!"

🎬 CENA 2 (10-20s) - O SISTEMA DE LIMPEZA GLINFÁTICO:
- Visual: Um líquido cristalino azulado flui suavemente entre os neurônios, lavando resíduos tóxicos e sinapses cansadas.
- Narração (PT-BR): "Primeiro: o banho químico noturno! O cérebro abre canais especiais e bombeia líquido para lavar toxinas acumuladas durante o dia. Sem isso, você perderia a sanidade em setenta e duas horas!"

🎬 CENA 3 (20-30s) - A PARALISIA DE SEGURANÇA:
- Visual: Fibras elétricas desligando temporariamente os sinais para os músculos dos braços e pernas enquanto o cérebro projeta sonhos vívidos em alta velocidade.
- Narração (PT-BR): "Segundo: ele desliga os cabos do seu corpo! O cérebro paralisa seus músculos para impedir que você saia correndo na vida real enquanto sonha que está fugindo de um perigo."

🎬 CENA 4 (30-40s) - O ESPASMO HÍPNICO (A QUEDA NO VAZIO):
- Visual: O cérebro manda uma descarga elétrica rápida de reflexo e a pessoa dá um sobressalto na cama acordando com o coração acelerado.
- Narração (PT-BR): "E sabe aquela sensação de cair no vazio bem na hora em que está pegando no sono? É o seu cérebro achando que seu coração parou e dando um choque elétrico de emergência pra te ressuscitar!"

🎬 CENA 5 (40-50s) - A SELEÇÃO DAS SUAS MEMÓRIAS:
- Visual: Gavetas luminosas se abrindo: algumas memórias são deletadas virando pó dourado e outras são gravadas permanentemente em cristais brilhantes.
- Narração (PT-BR): "Terceiro: ele decide o que você vai esquecer para sempre e o que vai lembrar até o fim da sua vida, apagando detalhes inúteis enquanto você sonha."

🎬 CENA 6 (50-60s) - FECHAMENTO E CHAMADA DE ENGAJAMENTO (CTA):
- Visual: O cérebro reluz em dourado com o sol nascendo na janela do quarto e a pessoa abrindo os olhos revigorada.
- Narração (PT-BR): "Quantas vezes você já deu esse pulo na cama caindo no abismo? Deixa seu comentário e compartilha com quem nunca sabia disso!"`,
      },
    ]

    for (let i = 0; i < curiosidadesPrompts.length; i++) {
      const p = curiosidadesPrompts[i]
      const existing = app.findRecordsByFilter('prompts', 'title = {:title}', '', 1, 0, {
        title: p.title,
      })
      if (!existing || existing.length === 0) {
        const record = new Record(promptsCol)
        record.set('title', p.title)
        record.set('description', p.description)
        record.set('niche', p.niche)
        record.set('style', p.style)
        record.set('platform', p.platform)
        record.set('is_free', p.is_free)
        record.set('category', p.category)
        record.set('hook', p.hook)
        record.set('call_to_action', p.call_to_action)
        record.set('tags', p.tags)
        record.set('reference_image_url', p.reference_image_url)
        record.set('prompt_text', p.prompt_text)
        app.save(record)
      }
    }
  },
  (app) => {
    // Reversão
  },
)
