/**
 * Hook do PocketBase / Skip Cloud: Transcrição e Tradução de Vídeos/Áudios
 * Endpoint: POST /backend/v1/viral-tools/transcribe
 *
 * Recebe:
 *  - audio_base64 / media_base64: arquivo em base64 (vídeo ou áudio: mp4, mp3, wav, m4a, ogg, webm)
 *  - mime_type: ex. "audio/mp3", "video/mp4", "audio/wav", "audio/m4a"
 *  - source_lang: "auto" ou código/nome ("pt", "en", "es", "de", "fr", "it", "ja", "zh")
 *  - target_lang: "pt-BR" (padrão) ou outro idioma escolhido
 *  - media_name (opcional): nome do arquivo
 *
 * Utiliza o Google Gemini (chave GEMINI_API_KEY / GOOGLE_AI_API_KEY do backend PV)
 * via generateContent com inlineData (áudio ou vídeo).
 * Retorna JSON com:
 *  - detected_language: idioma original identificado
 *  - original_transcription: texto completo da fala na ordem exata
 *  - translated_transcription: tradução natural pronta para nova narração
 *  - model_used: modelo Gemini utilizado
 */

routerAdd('POST', '/backend/v1/viral-tools/transcribe', (c) => {
  try {
    const authRecord = c.auth
    if (!authRecord) {
      return c.json(401, {
        error: 'É necessário estar autenticado para utilizar o Transcritor.',
        code: 'unauthorized',
      })
    }

    // Leitura do payload JSON via requestInfo() do PocketBase v0.23+
    let body = {}
    try {
      const reqInfo = c.requestInfo()
      body = (reqInfo && reqInfo.body) || {}
    } catch (e) {
      body = {}
    }

    const mediaBase64 = (body.media_base64 || body.audio_base64 || '').toString().trim()
    let mimeType = (body.mime_type || '').toString().trim()
    const sourceLang = (body.source_lang || 'auto').toString().trim()
    const targetLang = (body.target_lang || 'Português Brasileiro (pt-BR)').toString().trim()
    const mediaName = (body.media_name || 'arquivo_midia').toString().trim()

    if (!mediaBase64) {
      return c.json(400, {
        error: 'Nenhum arquivo de áudio ou vídeo enviado. Envie media_base64 ou audio_base64.',
        code: 'missing_media',
      })
    }

    // Limpeza de prefixo data:...;base64, se houver
    let cleanBase64 = mediaBase64
    if (cleanBase64.indexOf(',') > -1) {
      const parts = cleanBase64.split(',')
      const header = parts[0]
      cleanBase64 = parts[1]
      if (!mimeType) {
        const match = header.match(/data:([^;]+);base64/)
        if (match && match[1]) {
          mimeType = match[1]
        }
      }
    }

    if (!mimeType) {
      mimeType = 'audio/mp3'
    }

    // Validação de tamanho: limite honesto de ~20MB base64 (~15MB binário)
    if (cleanBase64.length > 28_000_000) {
      return c.json(413, {
        error:
          'O arquivo enviado excede o limite recomendado de 20MB para processamento inline. Para arquivos mais longos, extraia apenas a faixa de áudio em MP3 ou envie um trecho menor.',
        code: 'file_too_large',
      })
    }

    // Obtenção da chave Gemini do sistema
    let apiKey = ''
    try {
      apiKey = $os.getenv('GEMINI_API_KEY') || ''
    } catch (e) {}
    if (!apiKey) {
      try {
        apiKey = $os.getenv('GOOGLE_AI_API_KEY') || ''
      } catch (e) {}
    }
    if (!apiKey) {
      apiKey = authRecord.get('google_ai_api_key') || ''
    }

    if (!apiKey) {
      return c.json(503, {
        error:
          'Serviço de IA temporariamente indisponível (chave Gemini não configurada no backend). Contate o administrador.',
        code: 'missing_api_key',
      })
    }

    const systemInstructions =
      'Você é um especialista em transcrição fonética e tradução de alta fidelidade para criadores de conteúdo viral de vídeo. ' +
      'Sua tarefa é ouvir com extrema atenção o áudio/vídeo fornecido e extrair TODA a fala ou narração, sem omitir palavras, gírias ou termos técnicos. ' +
      'Não resuma. Não sintetize. Não invente falas que não existam no áudio. Se não houver fala clara ou apenas música instrumental, declare isso honestamente. ' +
      'Regra da tradução: faça uma tradução coloquial, fluida e natural, pronta para ser usada como roteiro para uma NOVA narração pelo criador, preservando o tom (humor, empolgação, tensão, persuasão) sem construções literais engessadas. ' +
      'Retorne ESTRITAMENTE um objeto JSON válido, sem blocos markdown ```json ou texto adicional fora do JSON.'

    const promptText = `Analise a mídia em anexo (arquivo: "${mediaName}", tipo: "${mimeType}").

Parâmetros solicitados:
- Idioma original informado: ${sourceLang === 'auto' ? 'Automático (detectar no áudio)' : sourceLang}
- Idioma de destino da tradução: ${targetLang}

Estrutura JSON que você DEVE retornar obrigatoriamente:
{
  "detected_language": "Nome do idioma original falado no vídeo (ex: Inglês, Espanhol, Alemão, Português)",
  "language_code": "código ISO (ex: en, es, de, pt-BR)",
  "original_transcription": "Texto integral da fala transcrita na ordem cronológica exata, com pontuação correta para leitura e sem omissões.",
  "translated_transcription": "Tradução completa e fluida para ${targetLang}, adequada para uma nova narração profissional sem traduções literais estranhas.",
  "duration_estimation": "estimativa da duração das falas ou trecho (ex: '45 segundos')",
  "notes": "observações relevantes de pronúncia, tom ou clareza do áudio (opcional)"
}`

    const candidateModels = ['gemini-2.5-flash', 'gemini-1.5-flash']
    let lastError = null
    let responseText = ''
    let chosenModel = ''

    for (let i = 0; i < candidateModels.length; i++) {
      const model = candidateModels[i]
      try {
        const payload = {
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: promptText,
                },
                {
                  inlineData: {
                    mimeType: mimeType,
                    data: cleanBase64,
                  },
                },
              ],
            },
          ],
          systemInstruction: {
            parts: [{ text: systemInstructions }],
          },
          generationConfig: {
            temperature: 0.2,
            responseMimeType: 'application/json',
          },
        }

        const res = $http.send({
          url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          timeout: 120,
        })

        if (res.statusCode >= 200 && res.statusCode < 300) {
          const resData = res.json || {}
          if (
            resData.candidates &&
            resData.candidates[0] &&
            resData.candidates[0].content &&
            resData.candidates[0].content.parts &&
            resData.candidates[0].content.parts[0]
          ) {
            responseText = resData.candidates[0].content.parts[0].text || ''
            chosenModel = model
            break
          } else {
            lastError = `Modelo ${model} retornou resposta vazia: ${JSON.stringify(resData)}`
          }
        } else {
          lastError = `Erro HTTP ${res.statusCode} com modelo ${model}: ${res.raw || ''}`
        }
      } catch (err) {
        lastError = `Exceção ao chamar ${model}: ${err && err.message ? err.message : String(err)}`
      }
    }

    if (!responseText) {
      return c.json(502, {
        error:
          'Não foi possível concluir a transcrição no momento via IA. Verifique se o áudio está audível e tente novamente em alguns instantes.',
        details: lastError || 'Nenhum conteúdo retornado pelo provedor.',
        code: 'transcription_failed',
      })
    }

    let cleanJson = responseText.trim()
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson
        .replace(/^```json\s*/i, '')
        .replace(/```\s*$/, '')
        .trim()
    } else if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson
        .replace(/^```\s*/, '')
        .replace(/```\s*$/, '')
        .trim()
    }

    let parsedResult = null
    try {
      parsedResult = JSON.parse(cleanJson)
    } catch (e) {
      parsedResult = {
        detected_language: 'Identificado no áudio',
        language_code: 'auto',
        original_transcription: responseText,
        translated_transcription: responseText,
        notes: 'Formato retornado em texto corrido pela IA.',
      }
    }

    try {
      console.log(
        `[Transcritor Viral] Usuário ${authRecord.id} transcreveu com sucesso usando ${chosenModel}. Idioma: ${parsedResult.detected_language}`,
      )
    } catch (e) {}

    return c.json(200, {
      success: true,
      model_used: chosenModel,
      detected_language: parsedResult.detected_language || 'Desconhecido',
      language_code: parsedResult.language_code || 'auto',
      original_transcription: (parsedResult.original_transcription || '').trim(),
      translated_transcription: (parsedResult.translated_transcription || '').trim(),
      duration_estimation: parsedResult.duration_estimation || '',
      notes: parsedResult.notes || '',
      target_lang: targetLang,
      media_name: mediaName,
    })
  } catch (err) {
    return c.json(500, {
      error:
        'Erro interno ao processar a transcrição: ' +
        (err && err.message ? err.message : String(err)),
      code: 'internal_error',
    })
  }
})
