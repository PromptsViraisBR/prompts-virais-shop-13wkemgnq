/// <reference path="../pb_data/types.d.ts" />

/**
 * Migração 0023:
 * 1. Ajustar TODOS os prompts existentes na coleção 'prompts' para:
 *    - Duração MÁXIMA de 10 segundos (ex: "ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (MÁX 10s)")
 *    - Idioma: Português Brasileiro (PT-BR)
 *    - Vídeo totalmente liso: SEM legendas, SEM texto na tela, SEM palavras gravadas no vídeo (pois IAs erram palavras visuais).
 *    - A narração/áudio continua ativa.
 *    - Cenas compactadas para totalizar no máximo 10s (ex: Cena 1: 0-3s Gancho; Cena 2: 3-7s Detalhes/Prova; Cena 3: 7-10s CTA).
 * 2. Idempotente: pode ser reexecutada sem estragar os registros.
 */

migrate(
  (app) => {
    const promptsCol = app.findCollectionByNameOrId('prompts')
    const totalPrompts = app.countRecords('prompts')
    if (totalPrompts === 0) return

    // Buscar em lotes de 100
    const limit = 100
    let offset = 0

    while (offset < totalPrompts + 100) {
      const records = app.findRecordsByFilter('prompts', '', 'created', limit, offset)
      if (!records || records.length === 0) break

      for (let i = 0; i < records.length; i++) {
        const record = records[i]
        let text = record.getString('prompt_text') || ''

        // 1. Substituir cabeçalho de duração para máximo 10s
        // ex: [ESTRUTURA DE VÍDEO TIKTOK SHOP / SHOPEE - 20 SEGUNDOS] -> [ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - MÁXIMO 10 SEGUNDOS (PT-BR | VÍDEO LISO SEM TEXTO NA TELA)]
        text = text.replace(
          /\[[^\]]*(?:SEGUNDOS|ESTRUTURA|ROTEIRO)[^\]]*\]/i,
          '[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO TOTALMENTE LISO SEM TEXTO NA TELA)]',
        )

        // 2. Remover qualquer linha de "Texto na tela", "Texto grande", "Texto:", etc.
        // ex: - Texto na tela: "..." ou - Texto grande na tela: "..." ou Texto: "..."
        text = text.replace(/^[ \t]*[-•*]?[ \t]*Texto[^:\n\r]*:[^\n\r]*\r?\n?/gim, '')
        text = text.replace(/^[ \t]*[-•*]?[ \t]*Legenda[^:\n\r]*:[^\n\r]*\r?\n?/gim, '')

        // 3. Compactar a contagem de segundos das cenas para somar no máximo 10s:
        // CENA 1 (0-3s)
        // CENA 2 (3-7s)
        // CENA 3 (7-10s)
        // CENA 4 / CENA 5 consolidadas ou re-mapeadas
        text = text.replace(/CENA 1\s*\([^)]*\)/gi, 'CENA 1 (0-3s)')
        text = text.replace(/CENA 2\s*\([^)]*\)/gi, 'CENA 2 (3-7s)')
        text = text.replace(/CENA 3\s*\([^)]*\)/gi, 'CENA 3 (7-10s)')
        text = text.replace(/CENA 4\s*\([^)]*\)/gi, 'CENA 3 (7-10s)')
        text = text.replace(/CENA 5\s*\([^)]*\)/gi, 'CENA 3 (7-10s)')

        // 4. Inserir diretriz explícita de vídeo liso no início caso ainda não conste
        if (!text.includes('VÍDEO TOTALMENTE LISO')) {
          text =
            `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS (PT-BR | VÍDEO TOTALMENTE LISO SEM TEXTO NA TELA)]\n\n📌 DIRETRIZES ESSENCIAIS:\n- Idioma da narração: Português Brasileiro (PT-BR)\n- Duração máxima: 10 segundos\n- Visual: Vídeo 100% liso, SEM legendas, SEM textos, SEM caracteres ou palavras renderizadas na tela (para evitar erros visuais das IAs).\n\n` +
            text.replace(/\[ROTEIRO VIRAL[^\]]+\]\s*/i, '')
        }

        // Limpeza de quebras de linha múltiplas excessivas
        text = text.replace(/\n{3,}/g, '\n\n').trim()

        record.set('prompt_text', text)
        app.save(record)
      }

      offset += limit
    }
  },
  (app) => {
    // Reversão não é necessária pois os prompts continuam válidos
  },
)
