/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration 0061: Sincronização idempotente de configuração SMTP via segredos de ambiente.
 *
 * Lê variáveis de ambiente via $os.getenv:
 * - SMTP_HOST
 * - SMTP_PORT
 * - SMTP_USERNAME
 * - SMTP_PASSWORD
 * - SMTP_SENDER_EMAIL
 * - SMTP_SENDER_NAME
 *
 * Se os segredos essenciais (host, username, password) estiverem presentes,
 * aplica a configuração de SMTP e remetente nas settings do PocketBase.
 * Caso contrário, opera como no-op silencioso e seguro sem gerar erro em bancos novos ou existentes.
 */
migrate(
  (app) => {
    try {
      const host = ($os.getenv('SMTP_HOST') || '').trim()
      const username = ($os.getenv('SMTP_USERNAME') || '').trim()
      const password = ($os.getenv('SMTP_PASSWORD') || '').trim()
      const rawPort = ($os.getenv('SMTP_PORT') || '').trim()
      const senderEmail = ($os.getenv('SMTP_SENDER_EMAIL') || '').trim()
      const senderName = ($os.getenv('SMTP_SENDER_NAME') || '').trim()

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

      const settings = app.settings()
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
        console.log('[migration 0061] SMTP já configurado e em sincronia.')
        return
      }

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

      app.save(settings)
      console.log(
        `[migration 0061] Configurações de SMTP sincronizadas com sucesso (host=${host}, port=${port}).`,
      )
    } catch (err) {
      console.warn(
        '[migration 0061] Aviso ao processar configurações de SMTP:',
        err?.message || String(err),
      )
    }
  },
  (app) => {
    // Reversão opcional: no-op para segurança
  },
)
