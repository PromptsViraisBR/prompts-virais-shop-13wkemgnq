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
 * Utiliza o Google Gemini (chave GEMINI_API_KEY / GOOGLE_AI_API_KEY do backend PV ou admin)
 * com modelo ativo gemini-3.5-flash e fallback para gemini-3.5-flash-lite / gemini-3.1-pro-preview.
 *
 * Suporta três fluxos ordenados e resilientes:
 *  1. Google Gemini Files API (multipart resumable -> file_uri) + generateContent
 *  2. generateContent direto com inlineData
 *  3. Interactions API (v1beta/interactions com type: 'object' e schema)
 *
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

    // Leitura do payload JSON via requestInfo()
    let body = {}
    try {
      const reqInfo = c.requestInfo()
      body = (reqInfo && reqInfo.body) || {}
    } catch (e) {
      body = {}
    }

    const mediaBase64 = (body.media_base64 || body.audio_base64 || '').toString().trim()
    let mimeType = (body.mime_type || '').toString().trim().toLowerCase()
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
        const match = header.match(/data:([^;]+);base64/i)
        if (match && match[1]) {
          mimeType = match[1].toLowerCase()
        }
      }
    }

    // Remove quebras de linha e espaços no base64
    cleanBase64 = cleanBase64.replace(/[\r\n\s]/g, '')

    // Ajuste de padding Base64 se necessário
    const mod = cleanBase64.length % 4
    if (mod === 2) {
      cleanBase64 += '=='
    } else if (mod === 3) {
      cleanBase64 += '='
    }

    if (!mimeType) {
      mimeType = 'audio/mp3'
    } else if (mimeType === 'audio/mpeg') {
      mimeType = 'audio/mp3'
    }

    // Validação de tamanho: limite de ~25MB binário (~35MB base64)
    if (cleanBase64.length > 36_000_000) {
      return c.json(413, {
        error:
          'O arquivo enviado excede o limite recomendado de 25MB para transcrição. Extraia apenas a faixa de áudio em MP3 ou envie um trecho menor.',
        code: 'file_too_large',
      })
    }

    // Obtenção da chave Gemini
    let apiKey = ''
    try {
      apiKey = $os.getenv('GEMINI_API_KEY') || ''
    } catch (e) {}
    if (!apiKey) {
      try {
        apiKey = $os.getenv('GOOGLE_AI_API_KEY') || ''
      } catch (e) {}
    }
    if (!apiKey && authRecord) {
      try {
        apiKey = authRecord.getString('google_ai_api_key') || ''
      } catch (e) {}
    }
    if (!apiKey) {
      try {
        const adminUser = $app.findFirstRecordByData(
          'users',
          'email',
          'juniorrodriguesjr123.jr@gmail.com',
        )
        if (adminUser) {
          apiKey = adminUser.getString('google_ai_api_key') || ''
        }
      } catch (e) {}
    }

    if (!apiKey) {
      return c.json(503, {
        error:
          'Serviço de IA temporariamente indisponível (chave de API da IA não configurada no backend). Contate o administrador.',
        code: 'missing_api_key',
      })
    }

    const systemInstructions =
      'Você é um especialista em transcrição fonética e tradução de alta fidelidade para criadores de conteúdo viral de vídeo. ' +
      'Sua tarefa é ouvir com extrema atenção o áudio/vídeo fornecido e extrair TODA a fala ou narração, sem omitir palavras, gírias ou termos técnicos. ' +
      'Não resuma. Não sintetize. Não invente falas que não existam no áudio. Se não houver fala audível ou apenas silêncio/música instrumental, declare isso com naturalidade na transcrição. ' +
      'Regra da tradução: faça uma tradução coloquial, fluida e natural, pronta para ser usada como roteiro para uma NOVA narração pelo criador, preservando o tom (humor, empolgação, tensão, persuasão) sem construções literais engessadas. ' +
      'Retorne ESTRITAMENTE um objeto JSON válido, sem blocos markdown ```json ou texto adicional fora do JSON.'

    const promptText = `Analise a mídia em anexo (arquivo: "${mediaName}", tipo: "${mimeType}").

Parâmetros solicitados:
- Idioma original informado: ${sourceLang === 'auto' ? 'Automático (detectar no áudio)' : sourceLang}
- Idioma de destino da tradução: ${targetLang}

Estrutura JSON que você DEVE retornar obrigatoriamente:
{
  "detected_language": "Nome do idioma original falado no vídeo (ex: Português, Inglês, Espanhol, Alemão)",
  "language_code": "código ISO (ex: pt-BR, en, es, de)",
  "original_transcription": "Texto integral da fala transcrita na ordem cronológica exata, com pontuação correta para leitura e sem omissões.",
  "translated_transcription": "Tradução completa e fluida para ${targetLang}, adequada para uma nova narração profissional sem traduções literais estranhas.",
  "duration_estimation": "estimativa da duração das falas ou trecho (ex: '45 segundos')",
  "notes": "observações relevantes de pronúncia, tom ou clareza do áudio (opcional)"
}`

    // Tentativa 1: Google Gemini Files API + generateContent
    let uploadedFileUri = ''
    let uploadedFileMime = mimeType
    let filesApiError = ''

    try {
      const startRes = $http.send({
        url: `https://generativelanguage.googleapis.com/upload/v1beta/files?key=${apiKey}`,
        method: 'POST',
        headers: {
          'X-Goog-Upload-Protocol': 'resumable',
          'X-Goog-Upload-Command': 'start',
          'X-Goog-Upload-Header-Content-Type': mimeType,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file: {
            displayName: mediaName || 'transcription_media',
          },
        }),
        timeout: 30,
      })

      let uploadUrl = ''
      if (startRes.headers) {
        uploadUrl =
          startRes.headers['x-goog-upload-url'] ||
          startRes.headers['X-Goog-Upload-Url'] ||
          startRes.headers['Location'] ||
          startRes.headers['location'] ||
          ''
      }

      if (uploadUrl) {
        const uploadRes = $http.send({
          url: uploadUrl,
          method: 'POST',
          headers: {
            'Content-Type': mimeType,
            'X-Goog-Upload-Command': 'upload, finalize',
            'X-Goog-Upload-Offset': '0',
          },
          body: cleanBase64,
          timeout: 90,
        })

        if (uploadRes.statusCode >= 200 && uploadRes.statusCode < 300) {
          const fileData = uploadRes.json || {}
          if (fileData.file && fileData.file.uri) {
            uploadedFileUri = fileData.file.uri
            uploadedFileMime = fileData.file.mimeType || mimeType
          }
        } else {
          filesApiError = `Files upload HTTP ${uploadRes.statusCode}: ${uploadRes.raw || ''}`
        }
      } else {
        filesApiError = `Files start sem upload-url: HTTP ${startRes.statusCode} - ${startRes.raw || ''}`
      }
    } catch (fErr) {
      filesApiError = `Files API exception: ${fErr && fErr.message ? fErr.message : String(fErr)}`
    }

    // Modelos ativos validados na conta do usuário (gemini-3.5-flash primário)
    const candidateModels = ['gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.1-pro-preview']

    let responseText = ''
    let chosenModel = ''
    let lastError = null
    let lastStatusCode = 0

    // ESTRATÉGIA A: Se o upload na Files API deu certo, usar fileData com fileUri
    if (uploadedFileUri) {
      for (let i = 0; i < candidateModels.length; i++) {
        const model = candidateModels[i]
        try {
          const payload = {
            contents: [
              {
                role: 'user',
                parts: [
                  { text: promptText },
                  {
                    fileData: {
                      fileUri: uploadedFileUri,
                      mimeType: uploadedFileMime,
                    },
                  },
                ],
              },
            ],
            systemInstruction: {
              parts: [{ text: systemInstructions }],
            },
            generationConfig: {
              temperature: 0.1,
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
            timeout: 110,
          })

          lastStatusCode = res.statusCode
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
              lastError = `Modelo ${model} (Files API) retornou estrutura vazia: ${res.raw || ''}`
            }
          } else {
            lastError = `HTTP ${res.statusCode} (${model} Files API): ${res.raw || ''}`
          }
        } catch (err) {
          lastError = `Exceção (${model} Files API): ${err && err.message ? err.message : String(err)}`
        }
      }
    }

    // ESTRATÉGIA B: Se Files API não gerou resposta, tentar generateContent direto com inlineData
    if (!responseText) {
      for (let i = 0; i < candidateModels.length; i++) {
        const model = candidateModels[i]
        try {
          const payload = {
            contents: [
              {
                role: 'user',
                parts: [
                  { text: promptText },
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
              temperature: 0.1,
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
            timeout: 110,
          })

          lastStatusCode = res.statusCode
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
              lastError = `Modelo ${model} (inline) retornou estrutura vazia: ${res.raw || ''}`
            }
          } else {
            lastError = `HTTP ${res.statusCode} (${model} inline): ${res.raw || ''}`
          }
        } catch (err) {
          lastError = `Exceção (${model} inline): ${err && err.message ? err.message : String(err)}`
        }
      }
    }

    // ESTRATÉGIA C: Fallback via Interactions API (v1beta/interactions)
    // Conforme validações na conta: formato suportado de response_format é type: 'object' com properties
    if (!responseText) {
      try {
        const interactionPayload = {
          model: 'gemini-3.5-flash',
          input: [
            {
              type: 'text',
              text: systemInstructions + '\n\n' + promptText,
            },
            {
              type: 'audio',
              data: cleanBase64,
              mime_type: mimeType,
            },
          ],
          response_format: {
            type: 'object',
            properties: {
              detected_language: { type: 'string' },
              language_code: { type: 'string' },
              original_transcription: { type: 'string' },
              translated_transcription: { type: 'string' },
              duration_estimation: { type: 'string' },
              notes: { type: 'string' },
            },
            required: ['detected_language', 'original_transcription', 'translated_transcription'],
          },
        }

        const resInter = $http.send({
          url: 'https://generativelanguage.googleapis.com/v1beta/interactions',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
          },
          body: JSON.stringify(interactionPayload),
          timeout: 110,
        })

        lastStatusCode = resInter.statusCode
        if (resInter.statusCode >= 200 && resInter.statusCode < 300) {
          const interData = resInter.json || {}
          if (interData.output) {
            if (typeof interData.output === 'string') {
              responseText = interData.output
            } else if (interData.output.text) {
              responseText = interData.output.text
            } else {
              responseText = JSON.stringify(interData.output)
            }
            chosenModel = 'gemini-3.5-flash (interactions)'
          } else if (interData.outputs && interData.outputs[0]) {
            const out0 = interData.outputs[0]
            responseText = out0.text || out0.data || JSON.stringify(out0)
            chosenModel = 'gemini-3.5-flash (interactions)'
          } else if (interData.candidates && interData.candidates[0]) {
            const c0 = interData.candidates[0]
            responseText =
              (c0.content && c0.content.parts && c0.content.parts[0] && c0.content.parts[0].text) ||
              ''
            chosenModel = 'gemini-3.5-flash (interactions)'
          }
        } else {
          lastError = `HTTP ${resInter.statusCode} (Interactions API): ${resInter.raw || ''}`
        }
      } catch (iErr) {
        lastError = `Exceção (Interactions API): ${iErr && iErr.message ? iErr.message : String(iErr)}`
      }
    }

    // Tratamento de falhas com mensagens ESPECÍFICAS (nunca genéricas de 'verifique o áudio')
    if (!responseText) {
      let specificMessage =
        'Não foi possível concluir a transcrição no momento: o serviço de IA encontrou uma falha no processamento da mídia.'
      let errorCode = 'processing_failure'

      const errStr = (lastError || '').toLowerCase()
      if (
        lastStatusCode === 503 ||
        errStr.includes('503') ||
        errStr.includes('high demand') ||
        errStr.includes('overloaded') ||
        errStr.includes('unavailable')
      ) {
        specificMessage =
          'O serviço de IA do Google está temporariamente sobrecarregado por alta demanda. Aguarde cerca de 30 segundos e envie novamente.'
        errorCode = 'service_overloaded'
      } else if (
        lastStatusCode === 504 ||
        lastStatusCode === 408 ||
        errStr.includes('deadline exceeded') ||
        errStr.includes('timeout')
      ) {
        specificMessage =
          'O tempo limite para processamento da mídia foi esgotado. Tente enviar um arquivo mais curto ou com tamanho reduzido.'
        errorCode = 'timeout_exceeded'
      } else if (
        lastStatusCode === 429 ||
        errStr.includes('quota') ||
        errStr.includes('rate limit')
      ) {
        specificMessage =
          'O limite temporário de requisições por minuto da IA foi atingido. Aguarde 1 minuto para o próximo envio.'
        errorCode = 'rate_limit_exceeded'
      } else if (lastStatusCode === 413 || errStr.includes('too large')) {
        specificMessage =
          'O arquivo de mídia é muito grande para o processamento de áudio da IA. Extraia a faixa de áudio em MP3 compacto.'
        errorCode = 'payload_too_large'
      } else if (errStr.includes('invalid argument') || errStr.includes('decoding failed')) {
        specificMessage =
          'O formato de áudio/vídeo enviado não pôde ser decodificado pelo modelo. Certifique-se de que o arquivo é um MP3, WAV, M4A ou MP4 válido.'
        errorCode = 'codec_decode_failed'
      }

      return c.json(502, {
        error: specificMessage,
        details: lastError || filesApiError || 'Nenhum conteúdo retornado pelo provedor de IA.',
        code: errorCode,
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

    const userId = authRecord ? authRecord.id : 'unknown'
    try {
      console.log(
        `[Transcritor Viral] Usuário ${userId} transcreveu com sucesso usando ${chosenModel}. Idioma: ${parsedResult.detected_language}`,
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
        'Erro interno no servidor ao processar a transcrição: ' +
        (err && err.message ? err.message : String(err)),
      code: 'internal_error',
    })
  }
})
