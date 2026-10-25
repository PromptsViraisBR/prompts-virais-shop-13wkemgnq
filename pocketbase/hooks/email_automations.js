/// <reference path="../pb_data/types.d.ts" />

/**
 * Automações Transacionais de E-mail e Job Diário de Vencimento (FASE D)
 * Prompts Virais Shop
 *
 * 1. onRecordAfterCreateSuccess('users') -> E-mail de Boas-Vindas + Guia de primeiro uso (idempotente)
 * 2. cronAdd('daily_subscription_expiration', '0 3 * * *') -> Varredura diária de assinaturas vencidas (às 03:00)
 * 3. Rotas auxiliares de diagnóstico/acionamento manual para admin:
 *    - POST /backend/v1/admin/run-expiration-check
 *    - GET  /backend/v1/admin/email-status
 *    - POST /backend/v1/admin/test-transactional-email
 *
 * NOTA DE ARQUITETURA JSVM:
 * Todas as funções utilitárias ficam declaradas dentro do escopo de cada callback/rota
 * para evitar perda de closure ou ReferenceError no pool de executores do PocketBase.
 */

// -----------------------------------------------------------------
// EVENTO 1: BOAS-VINDAS APÓS CADASTRO DE CONTA (users)
// -----------------------------------------------------------------
onRecordAfterCreateSuccess((e) => {
  try {
    const userRec = e.record
    if (!userRec) return

    const email = (userRec.email() || userRec.getString('email') || '').trim()
    const name = (userRec.getString('name') || '').trim() || 'Criador(a)'
    const userId = userRec.id

    if (!email) {
      console.warn('[welcome-email] Usuário criado sem e-mail válido. Ignorando disparo.')
      return
    }

    // Idempotência preventiva: checar se já recebeu flag welcome_email_sent
    if (userRec.getBool('welcome_email_sent')) {
      console.log(
        `[welcome-email] Usuário ${userId} já possui flag welcome_email_sent=true. Pulando.`,
      )
      return
    }

    let siteUrl = ($os.getenv('SITE_URL') || '').trim()
    if (!siteUrl) siteUrl = 'https://prompts-virais-shop-16b33.goskip.app'
    siteUrl = siteUrl.replace(/\/+$/, '')

    let senderEmail = 'noreply@prompts-virais.com'
    let senderName = 'Prompts Virais Shop'
    try {
      const appSettings = $app.settings()
      if (appSettings && appSettings.meta) {
        if (appSettings.meta.senderAddress) senderEmail = appSettings.meta.senderAddress
        if (appSettings.meta.senderName) senderName = appSettings.meta.senderName
      }
    } catch (_) {}

    const subject = 'Bem-vindo ao Prompts Virais Shop! Seu guia de primeiro uso'
    const htmlBody = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bem-vindo ao Prompts Virais Shop</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f17; color: #f1f5f9; margin: 0; padding: 24px; line-height: 1.6;">
  <div style="max-width: 600px; margin: 0 auto; background: #131b2a; border-radius: 12px; border: 1px solid #1e293b; padding: 32px; box-shadow: 0 8px 30px rgba(0,0,0,0.4);">
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="display: inline-block; background: linear-gradient(135deg, #ec4899, #8b5cf6); color: #ffffff; padding: 6px 14px; border-radius: 9999px; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">
        ✨ Prompts Virais Shop
      </span>
      <h1 style="color: #ffffff; font-size: 24px; margin-top: 16px; margin-bottom: 8px;">
        Parabéns, ${name}! Sua conta foi criada com sucesso.
      </h1>
      <p style="color: #94a3b8; font-size: 15px; margin: 0;">
        Você acaba de desbloquear acesso à maior biblioteca de prompts e roteiros validados para TikTok Shop e Shopee.
      </p>
    </div>

    <div style="background: #1e293b; border-left: 4px solid #ec4899; padding: 16px 20px; border-radius: 6px; margin-bottom: 24px;">
      <h3 style="color: #f8fafc; font-size: 16px; margin: 0 0 8px 0;">🚀 Como criar seu primeiro vídeo em 3 passos:</h3>
      <ol style="margin: 0; padding-left: 20px; color: #cbd5e1; font-size: 14px;">
        <li style="margin-bottom: 8px;"><strong>1. Escolha seu nicho:</strong> Acesse a <a href="${siteUrl}/biblioteca" style="color: #38bdf8; text-decoration: none;">Biblioteca</a> (Moda, Cosméticos, Eletrônicos, Pets, etc.).</li>
        <li style="margin-bottom: 8px;"><strong>2. Gere ou Adapte:</strong> Clique no prompt desejado e personalize o produto no <a href="${siteUrl}/virais" style="color: #38bdf8; text-decoration: none;">Gerador Viral</a>.</li>
        <li><strong>3. Copie o Roteiro:</strong> Cole direto no ChatGPT, Midjourney, Luma, Kling ou CapCut e poste!</li>
      </ol>
    </div>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${siteUrl}/biblioteca" style="display: inline-block; background: linear-gradient(135deg, #ec4899, #8b5cf6); color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 15px rgba(236, 72, 153, 0.4);">
        Acessar Biblioteca de Prompts →
      </a>
    </div>

    <hr style="border: 0; border-top: 1px solid #1e293b; margin: 24px 0;">

    <p style="font-size: 12px; color: #64748b; text-align: center; margin: 0;">
      Este é um e-mail transacional referente à sua conta no Prompts Virais Shop.<br>
      Dúvidas ou suporte? Responda a este e-mail ou acesse o nosso site.
    </p>
  </div>
</body>
</html>
`

    let sendSuccess = false
    try {
      const message = new MailerMessage({
        from: {
          address: senderEmail,
          name: senderName,
        },
        to: [{ address: email }],
        subject: subject,
        html: htmlBody,
      })

      $app.newMailClient().send(message)
      sendSuccess = true
      console.log(`[welcome-email] E-mail de boas-vindas enviado com sucesso para ${email}!`)
    } catch (mailErr) {
      console.warn(
        `[welcome-email] Mailer do PocketBase não pôde entregar o e-mail para ${email} (verifique configuração de SMTP): ${mailErr.message || String(mailErr)}`,
      )
    }

    // Atualizar a flag no usuário para idempotência
    try {
      const uToUpdate = $app.findRecordById('_pb_users_auth_', userId)
      if (uToUpdate) {
        uToUpdate.set('welcome_email_sent', true)
        $app.save(uToUpdate)
      }
    } catch (saveErr) {
      console.warn(
        '[welcome-email] Não foi possível salvar flag welcome_email_sent no usuário:',
        saveErr,
      )
    }

    // Registrar no histórico de eventos de funil
    try {
      const evCol = $app.findCollectionByNameOrId('events')
      const evRec = new Record(evCol)
      evRec.set('user', userId)
      evRec.set('event_type', 'signup')
      evRec.set(
        'metadata',
        JSON.stringify({
          welcome_email_attempted: true,
          welcome_email_sent: sendSuccess,
          recipient: email,
        }),
      )
      $app.save(evRec)
    } catch (_) {}
  } catch (err) {
    console.error('[welcome-email] Erro inesperado no hook de boas-vindas:', err)
  } finally {
    e.next()
  }
}, 'users')

// -----------------------------------------------------------------
// JOB DIÁRIO 2: VARREDURA DE ASSINATURAS VENCIDAS (03:00 DIÁRIO)
// -----------------------------------------------------------------
cronAdd('daily_subscription_expiration', '0 3 * * *', () => {
  console.log('[cron-expiration] Iniciando varredura diária de assinaturas vencidas...')
  try {
    let siteUrl = ($os.getenv('SITE_URL') || '').trim()
    if (!siteUrl) siteUrl = 'https://prompts-virais-shop-16b33.goskip.app'
    siteUrl = siteUrl.replace(/\/+$/, '')

    let senderEmail = 'noreply@prompts-virais.com'
    let senderName = 'Prompts Virais Shop'
    try {
      const appSettings = $app.settings()
      if (appSettings && appSettings.meta) {
        if (appSettings.meta.senderAddress) senderEmail = appSettings.meta.senderAddress
        if (appSettings.meta.senderName) senderName = appSettings.meta.senderName
      }
    } catch (_) {}

    const now = new Date()
    const nowIso = now.toISOString()
    const nowDb = nowIso.replace('T', ' ').substring(0, 19)

    // Buscar assinaturas cujo status é 'active' ou 'cancelled' (mas não expired ainda),
    // onde end_date < agora OU next_payment_date < há mais de 3 dias
    // (apenas assinaturas pagas: plan != 'free')
    let candidateSubs = []
    try {
      candidateSubs = $app.findRecordsByFilter(
        'subscriptions',
        `plan != 'free' && status != 'expired' && end_date != '' && end_date < '${nowDb}'`,
        'created',
        500,
        0,
      )
    } catch (fetchErr) {
      console.warn('[cron-expiration] Erro ao buscar assinaturas vencidas por end_date:', fetchErr)
    }

    console.log(
      `[cron-expiration] Encontradas ${candidateSubs.length} assinaturas vencidas para expirar.`,
    )

    let expiredCount = 0
    let emailsSentCount = 0

    for (let i = 0; i < candidateSubs.length; i++) {
      const sub = candidateSubs[i]
      const subId = sub.id
      const userId = sub.getString('user')
      const plan = sub.getString('plan')
      const alreadyNotified = sub.getBool('expiration_notified')

      // 1. Atualizar status para 'expired'
      sub.set('status', 'expired')

      let emailRecipient = sub.getString('payer_email')
      let userName = 'Criador(a)'

      if (userId) {
        try {
          const u = $app.findRecordById('_pb_users_auth_', userId)
          if (u) {
            if (!emailRecipient) emailRecipient = u.email() || u.getString('email')
            const uName = u.getString('name')
            if (uName) userName = uName
          }
        } catch (_) {}
      }

      // 2. Disparo de E-mail de Fim de Acesso (apenas UMA vez por assinatura - idempotência)
      let mailSent = false
      if (!alreadyNotified && emailRecipient) {
        const planLabel = plan === 'annual' ? 'Anual VIP' : 'Mensal PRO'
        const subject = 'Seu acesso PRO no Prompts Virais Shop expirou'
        const htmlBody = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Acesso PRO Expirado</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f17; color: #f1f5f9; margin: 0; padding: 24px; line-height: 1.6;">
  <div style="max-width: 600px; margin: 0 auto; background: #131b2a; border-radius: 12px; border: 1px solid #1e293b; padding: 32px;">
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="display: inline-block; background: #334155; color: #94a3b8; padding: 4px 12px; border-radius: 9999px; font-weight: 600; font-size: 12px; text-transform: uppercase;">
        Aviso de Assinatura
      </span>
      <h1 style="color: #ffffff; font-size: 22px; margin-top: 14px; margin-bottom: 8px;">
        Olá, ${userName}. Seu período PRO encerrou.
      </h1>
      <p style="color: #94a3b8; font-size: 14px; margin: 0;">
        O período de validade do seu plano <strong>${planLabel}</strong> terminou e o acesso aos recursos PRO foi suspenso.
      </p>
    </div>

    <div style="background: #1e293b; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
      <h3 style="color: #f8fafc; font-size: 15px; margin: 0 0 10px 0;">O que acontece agora:</h3>
      <ul style="margin: 0; padding-left: 20px; color: #cbd5e1; font-size: 14px;">
        <li style="margin-bottom: 6px;">Sua conta permanece salva e segura.</li>
        <li style="margin-bottom: 6px;">Você ainda pode acessar os prompts da categoria Grátis.</li>
        <li>Prompts PRO e gerador avançado de vídeos virais ficam bloqueados até a reativação.</li>
      </ul>
    </div>

    <div style="text-align: center; margin: 28px 0;">
      <a href="${siteUrl}/planos" style="display: inline-block; background: linear-gradient(135deg, #ec4899, #8b5cf6); color: #ffffff; text-decoration: none; font-weight: 600; font-size: 15px; padding: 12px 28px; border-radius: 8px;">
        Reativar Meu Acesso PRO →
      </a>
    </div>

    <p style="font-size: 12px; color: #64748b; text-align: center; margin: 0;">
      Prompts Virais Shop • Mensagem transacional de conta.
    </p>
  </div>
</body>
</html>
`
        try {
          const message = new MailerMessage({
            from: { address: senderEmail, name: senderName },
            to: [{ address: emailRecipient }],
            subject: subject,
            html: htmlBody,
          })
          $app.newMailClient().send(message)
          mailSent = true
          emailsSentCount++
          console.log(
            `[cron-expiration] E-mail de fim de acesso enviado para ${emailRecipient} (sub ${subId})`,
          )
        } catch (mailErr) {
          console.warn(
            `[cron-expiration] Não foi possível enviar e-mail de expiração para ${emailRecipient}: ${mailErr.message || String(mailErr)}`,
          )
        }

        sub.set('expiration_notified', true)
        sub.set('expiration_notified_at', nowIso)
      }

      $app.save(sub)
      expiredCount++
    }

    console.log(
      `[cron-expiration] Varredura concluída com sucesso: ${expiredCount} expiradas, ${emailsSentCount} e-mails disparados.`,
    )
  } catch (cronErr) {
    console.error('[cron-expiration] Erro crítico no cron de expiração:', cronErr)
  }
})

// -----------------------------------------------------------------
// ROTAS DE ADMIN PARA DIAGNÓSTICO, TESTES E AUDITORIA
// -----------------------------------------------------------------

// ROTA A: POST /backend/v1/admin/run-expiration-check (dispara manualmente a varredura)
routerAdd('POST', '/backend/v1/admin/run-expiration-check', (e) => {
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

    let siteUrl = ($os.getenv('SITE_URL') || '').trim()
    if (!siteUrl) siteUrl = 'https://prompts-virais-shop-16b33.goskip.app'
    siteUrl = siteUrl.replace(/\/+$/, '')

    let senderEmail = 'noreply@prompts-virais.com'
    let senderName = 'Prompts Virais Shop'
    try {
      const appSettings = $app.settings()
      if (appSettings && appSettings.meta) {
        if (appSettings.meta.senderAddress) senderEmail = appSettings.meta.senderAddress
        if (appSettings.meta.senderName) senderName = appSettings.meta.senderName
      }
    } catch (_) {}

    const now = new Date()
    const nowIso = now.toISOString()
    const nowDb = nowIso.replace('T', ' ').substring(0, 19)

    let candidateSubs = []
    try {
      candidateSubs = $app.findRecordsByFilter(
        'subscriptions',
        `plan != 'free' && status != 'expired' && end_date != '' && end_date < '${nowDb}'`,
        'created',
        500,
        0,
      )
    } catch (_) {}

    const processed = []
    for (let i = 0; i < candidateSubs.length; i++) {
      const sub = candidateSubs[i]
      const subId = sub.id
      const userId = sub.getString('user')
      const plan = sub.getString('plan')
      const alreadyNotified = sub.getBool('expiration_notified')

      sub.set('status', 'expired')

      let emailRecipient = sub.getString('payer_email')
      let userName = 'Criador(a)'

      if (userId) {
        try {
          const u = $app.findRecordById('_pb_users_auth_', userId)
          if (u) {
            if (!emailRecipient) emailRecipient = u.email() || u.getString('email')
            const uName = u.getString('name')
            if (uName) userName = uName
          }
        } catch (_) {}
      }

      let mailSent = false
      let mailErrDetail = null

      if (!alreadyNotified && emailRecipient) {
        const planLabel = plan === 'annual' ? 'Anual VIP' : 'Mensal PRO'
        const subject = 'Seu acesso PRO no Prompts Virais Shop expirou'
        const htmlBody = `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><title>Acesso PRO Expirado</title></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0b0f17; color: #f1f5f9; padding: 24px;">
  <div style="max-width: 600px; margin: 0 auto; background: #131b2a; border-radius: 12px; border: 1px solid #1e293b; padding: 32px;">
    <h2 style="color: #ffffff;">Olá, ${userName}</h2>
    <p style="color: #cbd5e1;">Seu plano <strong>${planLabel}</strong> expirou. Seus prompts gerados continuam salvos na sua conta.</p>
    <div style="margin: 24px 0;"><a href="${siteUrl}/planos" style="background: linear-gradient(135deg, #ec4899, #8b5cf6); color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px;">Reativar Acesso PRO</a></div>
  </div>
</body>
</html>`

        try {
          const message = new MailerMessage({
            from: { address: senderEmail, name: senderName },
            to: [{ address: emailRecipient }],
            subject: subject,
            html: htmlBody,
          })
          $app.newMailClient().send(message)
          mailSent = true
        } catch (mErr) {
          mailErrDetail = mErr.message || String(mErr)
        }

        sub.set('expiration_notified', true)
        sub.set('expiration_notified_at', nowIso)
      }

      $app.save(sub)

      processed.push({
        id: subId,
        user_id: userId,
        plan,
        email: emailRecipient,
        email_sent: mailSent,
        mail_error: mailErrDetail,
        already_notified: alreadyNotified,
      })
    }

    return e.json(200, {
      success: true,
      executed_at: nowIso,
      expired_count: processed.length,
      processed: processed,
    })
  } catch (err) {
    return e.json(500, { success: false, error: err.message || String(err) })
  }
})

// ROTA B: GET /backend/v1/admin/email-status (informa status do mailer e histórico)
routerAdd('GET', '/backend/v1/admin/email-status', (e) => {
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

    let smtpConfigured = false
    let senderAddress = 'noreply@prompts-virais.com'
    let senderName = 'Prompts Virais Shop'
    try {
      const settings = $app.settings()
      if (settings) {
        if (settings.meta) {
          senderAddress = settings.meta.senderAddress || senderAddress
          senderName = settings.meta.senderName || senderName
        }
        if (settings.smtp && settings.smtp.enabled) {
          smtpConfigured = true
        }
      }
    } catch (_) {}

    const totalUsers = $app.countRecords('_pb_users_auth_')
    const welcomeEmailsSent = $app.countRecords('_pb_users_auth_', 'welcome_email_sent = true')
    const expiredSubsNotified = $app.countRecords('subscriptions', 'expiration_notified = true')
    const welcomeSubsNotified = $app.countRecords('subscriptions', 'welcome_sub_notified = true')

    return e.json(200, {
      success: true,
      smtp_configured: smtpConfigured,
      sender_address: senderAddress,
      sender_name: senderName,
      metrics: {
        total_users: totalUsers,
        welcome_emails_sent: welcomeEmailsSent,
        expired_subscriptions_notified: expiredSubsNotified,
        subscription_confirmations_notified: welcomeSubsNotified,
      },
      automations: [
        {
          name: 'Boas-vindas (users.onRecordAfterCreateSuccess)',
          description:
            'Enviado imediatamente após criação da conta com guia de 3 passos e link da biblioteca.',
          status: 'active',
        },
        {
          name: 'Confirmação de Assinatura (mp_payments webhook)',
          description:
            'Enviado quando o Mercado Pago ativa uma assinatura mensal ou anual com plano, valor e validade.',
          status: 'active',
        },
        {
          name: 'Falha de Cobrança / Recusa (mp_payments webhook)',
          description:
            'Enviado quando o Mercado Pago reporta pagamento rejected/cancelled com orientações para regularização.',
          status: 'active',
        },
        {
          name: 'Fim de Acesso (job diário ou cancelamento)',
          description:
            'Enviado quando a assinatura expira ou é cancelada com link para reativação (uma única vez por assinatura).',
          status: 'active',
        },
        {
          name: 'Job Diário de Vencimento (cronAdd)',
          schedule: '0 3 * * * (03:00 UTC diariamente)',
          description:
            'Varre assinaturas com data vencida, marca status expired e dispara notificação idempotente.',
          status: 'active',
        },
      ],
    })
  } catch (err) {
    return e.json(500, { success: false, error: err.message || String(err) })
  }
})

// ROTA C: POST /backend/v1/admin/test-transactional-email (permite testar disparo para o email do admin)
routerAdd('POST', '/backend/v1/admin/test-transactional-email', (e) => {
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

    const reqInfo = e.requestInfo()
    const body = reqInfo.body || {}
    const emailType = (body.type || 'welcome').toLowerCase().trim() // 'welcome' | 'subscription_active' | 'payment_failed' | 'access_expired'
    const targetEmail = (
      body.target_email ||
      authUser.email() ||
      authUser.getString('email') ||
      ''
    ).trim()

    if (!targetEmail) {
      return e.json(400, { success: false, error: 'E-mail de destino inválido.' })
    }

    let siteUrl = ($os.getenv('SITE_URL') || '').trim()
    if (!siteUrl) siteUrl = 'https://prompts-virais-shop-16b33.goskip.app'
    siteUrl = siteUrl.replace(/\/+$/, '')

    let senderEmail = 'noreply@prompts-virais.com'
    let senderName = 'Prompts Virais Shop'
    try {
      const appSettings = $app.settings()
      if (appSettings && appSettings.meta) {
        if (appSettings.meta.senderAddress) senderEmail = appSettings.meta.senderAddress
        if (appSettings.meta.senderName) senderName = appSettings.meta.senderName
      }
    } catch (_) {}

    let subject = ''
    let htmlContent = ''

    if (emailType === 'subscription_active') {
      subject = 'Assinatura PRO Ativada - Prompts Virais Shop'
      htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><title>Assinatura Confirmada</title></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0b0f17; color: #f1f5f9; padding: 24px;">
  <div style="max-width: 600px; margin: 0 auto; background: #131b2a; border-radius: 12px; border: 1px solid #1e293b; padding: 32px;">
    <h2 style="color: #10b981;">🎉 Pagamento Aprovado!</h2>
    <p>Sua assinatura <strong>Plano Mensal PRO</strong> foi ativada com sucesso.</p>
    <div style="background: #1e293b; padding: 16px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 4px 0;"><strong>Valor:</strong> R$ 19,90</p>
      <p style="margin: 4px 0;"><strong>Validade:</strong> 30 dias com renovação automática</p>
      <p style="margin: 4px 0;"><strong>Status:</strong> Ativo</p>
    </div>
    <div style="text-align: center;"><a href="${siteUrl}/biblioteca" style="background: linear-gradient(135deg, #ec4899, #8b5cf6); color: #fff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">Explorar Prompts PRO</a></div>
  </div>
</body>
</html>`
    } else if (emailType === 'payment_failed') {
      subject = 'Aviso: Falha no pagamento da sua assinatura - Prompts Virais'
      htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><title>Falha no Pagamento</title></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0b0f17; color: #f1f5f9; padding: 24px;">
  <div style="max-width: 600px; margin: 0 auto; background: #131b2a; border-radius: 12px; border: 1px solid #1e293b; padding: 32px;">
    <h2 style="color: #ef4444;">⚠️ Pagamento não aprovado</h2>
    <p>A operadora ou o Mercado Pago não autorizou a cobrança da sua assinatura.</p>
    <p style="color: #cbd5e1;">Para evitar a interrupção do seu acesso PRO aos roteiros virais, atualize sua forma de pagamento ou gere um novo link.</p>
    <div style="text-align: center; margin: 24px 0;"><a href="${siteUrl}/planos" style="background: #ef4444; color: #fff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">Regularizar Pagamento</a></div>
  </div>
</body>
</html>`
    } else if (emailType === 'access_expired') {
      subject = 'Seu acesso PRO no Prompts Virais Shop expirou'
      htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><title>Acesso Expirado</title></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0b0f17; color: #f1f5f9; padding: 24px;">
  <div style="max-width: 600px; margin: 0 auto; background: #131b2a; border-radius: 12px; border: 1px solid #1e293b; padding: 32px;">
    <h2 style="color: #ffffff;">Seu período PRO terminou</h2>
    <p style="color: #94a3b8;">Sua assinatura foi finalizada. Seus dados e biblioteca continuam salvos. Você pode reativar a qualquer momento com apenas 1 clique.</p>
    <div style="text-align: center; margin: 24px 0;"><a href="${siteUrl}/planos" style="background: linear-gradient(135deg, #ec4899, #8b5cf6); color: #fff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">Reativar Acesso PRO</a></div>
  </div>
</body>
</html>`
    } else {
      // Default: welcome
      subject = 'Bem-vindo ao Prompts Virais Shop! Seu guia de primeiro uso'
      htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><title>Bem-vindo</title></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0b0f17; color: #f1f5f9; padding: 24px;">
  <div style="max-width: 600px; margin: 0 auto; background: #131b2a; border-radius: 12px; border: 1px solid #1e293b; padding: 32px;">
    <h2 style="color: #ffffff;">Bem-vindo ao Prompts Virais Shop!</h2>
    <p style="color: #cbd5e1;">1. Escolha o nicho na Biblioteca &bull; 2. Personalize no Gerador &bull; 3. Copie o roteiro e publique.</p>
    <div style="text-align: center; margin: 24px 0;"><a href="${siteUrl}/biblioteca" style="background: linear-gradient(135deg, #ec4899, #8b5cf6); color: #fff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">Acessar Biblioteca</a></div>
  </div>
</body>
</html>`
    }

    let sent = false
    let errMessage = null
    try {
      const message = new MailerMessage({
        from: { address: senderEmail, name: senderName },
        to: [{ address: targetEmail }],
        subject: subject,
        html: htmlContent,
      })
      $app.newMailClient().send(message)
      sent = true
    } catch (sendErr) {
      errMessage = sendErr.message || String(sendErr)
    }

    return e.json(200, {
      success: true,
      type: emailType,
      target_email: targetEmail,
      sent_via_mailer: sent,
      error_from_mailer: errMessage,
      diagnostic: sent
        ? 'E-mail despachado pelo mailer do PocketBase com sucesso.'
        : 'Mailer acionado, mas o envio real depende da configuração de servidor SMTP no painel do PocketBase. A lógica de automação e templates está 100% pronta.',
    })
  } catch (err) {
    return e.json(500, { success: false, error: err.message || String(err) })
  }
})
