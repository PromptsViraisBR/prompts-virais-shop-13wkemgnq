/// <reference path="../pb_data/types.d.ts" />

/**
 * Hook de Inicialização e Sincronização Resiliente do Provedor SMTP (Brevo / Relay).
 * Prompts Virais Shop
 *
 * Padrão idêntico ao oauth_google.js:
 * 1. onBootstrap: executa na inicialização do backend (após e.next()).
 * 2. routerUse: intercepta rotas relevantes (rotas de e-mail, admin, auth) e garante sincronização
 *    lazy no primeiro uso caso o backend não tenha sido reiniciado após a criação dos segredos.
 * 3. Endpoint utilitário seguro GET /backend/v1/admin/smtp-status para diagnóstico.
 *
 * Segredos lidos via $os.getenv:
 * - SMTP_HOST: ex: smtp-relay.brevo.com
 * - SMTP_PORT: ex: 587
 * - SMTP_USERNAME: login SMTP (e-mail da conta Brevo ou API user)
 * - SMTP_PASSWORD: senha / chave SMTP Brevo
 * - SMTP_SENDER_EMAIL: e-mail de remetente (ex: contato@promptsviraisbr.com)
 * - SMTP_SENDER_NAME: nome do remetente (ex: Prompts Virais Shop)
 *
 * Regras de Segurança e Resiliência:
 * - NUNCA faz log de senhas ou credenciais completas. Apenas comprimentos e hosts técnicos.
 * - Idempotente: só executa $app.save(settings) se houver divergência real de configuração.
 * - Totalmente inofensivo quando os segredos ainda não existem (não gera erros nem quebra nada).
 * - Todas as funções auxiliares residem inline dentro dos handlers dos callbacks devido ao pool
 *   de VMs isoladas do PocketBase JSVM (goja) para evitar ReferenceError de escopo global.
 */

// 1. Execução no Boot
onBootstrap((e) => {
  e.next()

  try {
    const host = ($os.getenv('SMTP_HOST') || '').trim()
    const username = ($os.getenv('SMTP_USERNAME') || '').trim()
    const password = ($os.getenv('SMTP_PASSWORD') || '').trim()
    const rawPort = ($os.getenv('SMTP_PORT') || '').trim()
    const senderEmail = ($os.getenv('SMTP_SENDER_EMAIL') || '').trim()
    const senderName = ($os.getenv('SMTP_SENDER_NAME') || '').trim()

    // Se os segredos essenciais não estiverem configurados, não faz nada
    if (!host || !username || !password) {
      return
    }

    let port = 587
    if (rawPort) {
      const parsed = parseInt(rawPort, 10)
      if (!isNaN(parsed) && parsed > 0) {
        port = parsed
      }
    }

    const settings = $app.settings()
    if (!settings) return

    if (!settings.smtp) {
      settings.smtp = {
        enabled: false,
        host: '',
        port: 587,
        username: '',
        password: '',
        authMethod: 'PLAIN',
        tls: false,
        localName: '',
      }
    }

    if (!settings.meta) {
      settings.meta = {
        appName: 'Prompts Virais Shop',
        appURL: 'https://promptsviraisbr.goskip.app',
        senderAddress: 'noreply@prompts-virais.com',
        senderName: 'Prompts Virais Shop',
        hideControls: false,
        accentColor: '',
      }
    }

    const currentSmtp = settings.smtp || {}
    const currentMeta = settings.meta || {}

    const isSmtpSynced =
      currentSmtp.enabled === true &&
      currentSmtp.host === host &&
      currentSmtp.port === port &&
      currentSmtp.username === username &&
      currentSmtp.password === password

    const isSenderEmailSynced = !senderEmail || currentMeta.senderAddress === senderEmail
    const isSenderNameSynced = !senderName || currentMeta.senderName === senderName

    if (isSmtpSynced && isSenderEmailSynced && isSenderNameSynced) {
      return
    }

    // Aplicar novas configurações
    settings.smtp.enabled = true
    settings.smtp.host = host
    settings.smtp.port = port
    settings.smtp.username = username
    settings.smtp.password = password
    // Se porta 465, geralmente TLS direto; se 587 ou 25, STARTTLS (tls=false no PocketBase envia STARTTLS)
    if (port === 465) {
      settings.smtp.tls = true
    }

    if (senderEmail) {
      settings.meta.senderAddress = senderEmail
    }
    if (senderName) {
      settings.meta.senderName = senderName
    }

    $app.save(settings)
    console.log(
      `[smtp-brevo] Configuração SMTP aplicada no bootstrap com sucesso (host=${host}, port=${port}, user_len=${username.length}, pass_len=${password.length}).`,
    )
  } catch (err) {
    console.error(
      '[smtp-brevo] Erro ao sincronizar SMTP no bootstrap:',
      err?.message || String(err),
    )
  }
})

// 2. Middleware routerUse: detecta requisições de e-mail e admin para sincronização lazy
routerUse((e) => {
  try {
    const path = (e.request && e.request.url && e.request.url.path) || ''
    if (
      path.indexOf('/backend/v1/admin/') !== -1 ||
      path.indexOf('/api/collections/users/request-verification') !== -1 ||
      path.indexOf('/api/collections/users/confirm-verification') !== -1 ||
      path.indexOf('/api/collections/users/request-password-reset') !== -1 ||
      path.indexOf('/api/collections/users/confirm-password-reset') !== -1 ||
      path.indexOf('/api/collections/users/request-email-change') !== -1 ||
      path.indexOf('/api/collections/users/confirm-email-change') !== -1
    ) {
      const host = ($os.getenv('SMTP_HOST') || '').trim()
      const username = ($os.getenv('SMTP_USERNAME') || '').trim()
      const password = ($os.getenv('SMTP_PASSWORD') || '').trim()
      const rawPort = ($os.getenv('SMTP_PORT') || '').trim()
      const senderEmail = ($os.getenv('SMTP_SENDER_EMAIL') || '').trim()
      const senderName = ($os.getenv('SMTP_SENDER_NAME') || '').trim()

      if (host && username && password) {
        let port = 587
        if (rawPort) {
          const parsed = parseInt(rawPort, 10)
          if (!isNaN(parsed) && parsed > 0) {
            port = parsed
          }
        }

        const settings = $app.settings()
        if (settings) {
          if (!settings.smtp) {
            settings.smtp = {
              enabled: false,
              host: '',
              port: 587,
              username: '',
              password: '',
              authMethod: 'PLAIN',
              tls: false,
              localName: '',
            }
          }
          if (!settings.meta) {
            settings.meta = {
              appName: 'Prompts Virais Shop',
              appURL: 'https://promptsviraisbr.goskip.app',
              senderAddress: 'noreply@prompts-virais.com',
              senderName: 'Prompts Virais Shop',
              hideControls: false,
              accentColor: '',
            }
          }

          const currentSmtp = settings.smtp || {}
          const currentMeta = settings.meta || {}

          const isSmtpSynced =
            currentSmtp.enabled === true &&
            currentSmtp.host === host &&
            currentSmtp.port === port &&
            currentSmtp.username === username &&
            currentSmtp.password === password

          const isSenderEmailSynced = !senderEmail || currentMeta.senderAddress === senderEmail
          const isSenderNameSynced = !senderName || currentMeta.senderName === senderName

          if (!isSmtpSynced || !isSenderEmailSynced || !isSenderNameSynced) {
            settings.smtp.enabled = true
            settings.smtp.host = host
            settings.smtp.port = port
            settings.smtp.username = username
            settings.smtp.password = password
            if (port === 465) {
              settings.smtp.tls = true
            }

            if (senderEmail) {
              settings.meta.senderAddress = senderEmail
            }
            if (senderName) {
              settings.meta.senderName = senderName
            }

            $app.save(settings)
            console.log(
              `[smtp-brevo] Configuração SMTP sincronizada via routerUse lazy (host=${host}, port=${port}).`,
            )
          }
        }
      }
    }
  } catch (err) {
    // Falha silenciosa para nunca quebrar a requisição do usuário
    console.warn('[smtp-brevo] Erro na verificação lazy do routerUse:', err?.message || String(err))
  }

  return e.next()
})

// 3. Endpoint seguro para status do SMTP (sem expor credenciais)
routerAdd('GET', '/backend/v1/admin/smtp-status', (e) => {
  try {
    const authUser = e.auth
    if (!authUser) {
      return e.json(401, { success: false, error: 'Requer autenticação.' })
    }

    const isAdmin =
      authUser.getBool('is_admin') ||
      authUser.getString('email') === 'juniorrodriguesjr123.jr@gmail.com'
    if (!isAdmin) {
      return e.json(403, { success: false, error: 'Acesso restrito ao administrador.' })
    }

    const host = ($os.getenv('SMTP_HOST') || '').trim()
    const username = ($os.getenv('SMTP_USERNAME') || '').trim()
    const password = ($os.getenv('SMTP_PASSWORD') || '').trim()
    const rawPort = ($os.getenv('SMTP_PORT') || '').trim()
    const senderEmail = ($os.getenv('SMTP_SENDER_EMAIL') || '').trim()
    const senderName = ($os.getenv('SMTP_SENDER_NAME') || '').trim()

    let syncPerformed = false
    if (host && username && password) {
      let port = 587
      if (rawPort) {
        const parsed = parseInt(rawPort, 10)
        if (!isNaN(parsed) && parsed > 0) {
          port = parsed
        }
      }

      const settings = $app.settings()
      if (settings) {
        if (!settings.smtp) {
          settings.smtp = {
            enabled: false,
            host: '',
            port: 587,
            username: '',
            password: '',
            authMethod: 'PLAIN',
            tls: false,
            localName: '',
          }
        }
        if (!settings.meta) {
          settings.meta = {
            appName: 'Prompts Virais Shop',
            appURL: 'https://promptsviraisbr.goskip.app',
            senderAddress: 'noreply@prompts-virais.com',
            senderName: 'Prompts Virais Shop',
            hideControls: false,
            accentColor: '',
          }
        }

        const currentSmtp = settings.smtp || {}
        const currentMeta = settings.meta || {}

        const isSmtpSynced =
          currentSmtp.enabled === true &&
          currentSmtp.host === host &&
          currentSmtp.port === port &&
          currentSmtp.username === username &&
          currentSmtp.password === password

        const isSenderEmailSynced = !senderEmail || currentMeta.senderAddress === senderEmail
        const isSenderNameSynced = !senderName || currentMeta.senderName === senderName

        if (!isSmtpSynced || !isSenderEmailSynced || !isSenderNameSynced) {
          settings.smtp.enabled = true
          settings.smtp.host = host
          settings.smtp.port = port
          settings.smtp.username = username
          settings.smtp.password = password
          if (port === 465) {
            settings.smtp.tls = true
          }

          if (senderEmail) {
            settings.meta.senderAddress = senderEmail
          }
          if (senderName) {
            settings.meta.senderName = senderName
          }

          $app.save(settings)
          syncPerformed = true
        }
      }
    }

    const reloadedSettings = $app.settings()
    const smtp = reloadedSettings ? reloadedSettings.smtp : null
    const meta = reloadedSettings ? reloadedSettings.meta : null

    return e.json(200, {
      success: true,
      smtp_enabled: Boolean(smtp && smtp.enabled),
      smtp_host: (smtp && smtp.host) || '',
      smtp_port: (smtp && smtp.port) || 587,
      smtp_username_present: Boolean(smtp && smtp.username),
      smtp_password_present: Boolean(smtp && smtp.password),
      sender_address: (meta && meta.senderAddress) || '',
      sender_name: (meta && meta.senderName) || '',
      secrets_present: {
        host: Boolean(host),
        port: Boolean(rawPort),
        username: Boolean(username),
        password: Boolean(password),
        sender_email: Boolean(senderEmail),
        sender_name: Boolean(senderName),
      },
      synced_just_now: syncPerformed,
    })
  } catch (err) {
    return e.json(500, {
      success: false,
      error: err?.message || String(err),
    })
  }
})
