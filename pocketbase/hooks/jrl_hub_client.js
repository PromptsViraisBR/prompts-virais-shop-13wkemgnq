/**
 * Cliente do hub de IA JRL (jrl-ai-hub) — fonte prioritária de IA de TEXTO do PV.
 * Config 100% via segredos: JRL_AI_HUB_BASE_URL e JRL_AI_HUB_API_KEY (ler via readJrlSecret).
 * Se os segredos não existirem ou o hub falhar, o chamador cai no caminho $ai.chat (Skip AI) atual.
 *
 * IMPORTANTE: o pool JSVM do PocketBase executa cada rota isoladamente — copie as funções
 * necessárias para dentro do hook que for usar (não há import entre arquivos de hook).
 */

/**
 * Lê um segredo do hub: tenta $os.getenv e depois $secrets.get.
 */
function readJrlSecret(name) {
  let v = ''
  try {
    v = $os.getenv(name) || ''
  } catch (_) {}
  if (!v) {
    try {
      if ($secrets.has(name)) v = $secrets.get(name) || ''
    } catch (_) {}
  }
  return v
}

/**
 * Tenta uma chamada de TEXTO ao hub (formato OpenAI /chat/completions).
 * Retorna { ok, text, model, error, status } — NUNCA lança.
 */
function jrlHubChatText(systemPrompt, userPrompt, opts) {
  const result = { ok: false, text: '', model: '', error: '', status: 0 }
  try {
    const base = (readJrlSecret('JRL_AI_HUB_BASE_URL') || '').replace(/\/+$/, '')
    const key = readJrlSecret('JRL_AI_HUB_API_KEY') || ''
    if (!base || !key) {
      result.error = 'hub-não-configurado'
      return result
    }

    const messages = []
    if (systemPrompt) messages.push({ role: 'system', content: systemPrompt })
    messages.push({ role: 'user', content: userPrompt })

    const body = { messages: messages }
    if (opts && opts.model) body.model = opts.model
    if (opts && opts.maxTokens) body.max_tokens = opts.maxTokens

    const res = $http.send({
      method: 'POST',
      url: base + '/chat/completions',
      headers: {
        Authorization: 'Bearer ' + key,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      timeout: (opts && opts.timeout) || 90,
    })
    result.status = res.statusCode

    if (res.statusCode < 200 || res.statusCode >= 300) {
      result.error = 'hub-http-' + res.statusCode
      return result
    }

    const json = res.json || {}
    if (json.choices && json.choices[0] && json.choices[0].message) {
      const content = String(json.choices[0].message.content || '')
      if (content.trim()) {
        result.ok = true
        result.text = content
        result.model = json.model || (opts && opts.model) || ''
      } else {
        result.error = 'hub-resposta-vazia'
      }
    } else {
      result.error = 'hub-formato-inesperado'
    }
  } catch (err) {
    result.error = 'hub-exceção: ' + (err.message || String(err))
  }
  return result
}

/**
 * Lista os modelos expostos pelo hub. Retorna { ok, models, error }.
 */
function jrlHubListModels() {
  const result = { ok: false, models: [], error: '' }
  try {
    const base = (readJrlSecret('JRL_AI_HUB_BASE_URL') || '').replace(/\/+$/, '')
    const key = readJrlSecret('JRL_AI_HUB_API_KEY') || ''
    if (!base || !key) {
      result.error = 'hub-não-configurado'
      return result
    }
    const res = $http.send({
      method: 'GET',
      url: base + '/models',
      headers: { Authorization: 'Bearer ' + key },
      timeout: 20,
    })
    if (res.statusCode < 200 || res.statusCode >= 300) {
      result.error = 'hub-http-' + res.statusCode
      return result
    }
    const json = res.json || {}
    const arr = json.data || json.models || []
    result.models = arr.map(function (m) {
      return m.id || m.name || String(m)
    })
    result.ok = true
  } catch (err) {
    result.error = 'hub-exceção: ' + (err.message || String(err))
  }
  return result
}

/**
 * Escolhe o melhor modelo do hub para TEXTO: prefere modelos de raciocínio forte;
 * evita embedding/áudio/tts/imagem. Recebe a lista de ids; devolve um id ou ''.
 */
function jrlHubPickTextModel(models) {
  if (!models || models.length === 0) return ''
  const bad = /embed|whisper|tts|audio|dall-e|image|moderation|rerank/i
  const preferred = [
    /gpt-4o(?!.*mini)/i,
    /gpt-4\.?1(?!.*mini)/i,
    /claude.*sonnet/i,
    /gemini.*pro/i,
    /gpt-4o-mini/i,
    /gpt-4\.?1-mini/i,
    /flash/i,
    /claude.*haiku/i,
  ]
  for (let p = 0; p < preferred.length; p++) {
    for (let i = 0; i < models.length; i++) {
      if (!bad.test(models[i]) && preferred[p].test(models[i])) return models[i]
    }
  }
  for (let i = 0; i < models.length; i++) {
    if (!bad.test(models[i])) return models[i]
  }
  return ''
}
