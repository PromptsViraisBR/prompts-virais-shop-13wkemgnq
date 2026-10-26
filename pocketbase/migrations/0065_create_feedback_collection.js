/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration 0065:
 * Criação da coleção `feedback` para recebimento de ideias, dúvidas e relatos de bugs
 * Regras:
 * - createRule: "" (qualquer um pode enviar, logado ou não)
 * - listRule: "@request.auth.id != '' && @request.auth.is_admin = true" (apenas admin lista)
 * - viewRule: "@request.auth.id != '' && @request.auth.is_admin = true" (apenas admin vê)
 * - updateRule: "@request.auth.id != '' && @request.auth.is_admin = true"
 * - deleteRule: "@request.auth.id != '' && @request.auth.is_admin = true"
 */
migrate(
  (app) => {
    let col
    try {
      col = app.findCollectionByNameOrId('feedback')
    } catch (_) {
      col = null
    }

    if (!col) {
      const newFeedback = new Collection({
        name: 'feedback',
        type: 'base',
        listRule: "@request.auth.id != '' && @request.auth.is_admin = true",
        viewRule: "@request.auth.id != '' && @request.auth.is_admin = true",
        createRule: '', // Aberto para envio de visitantes ou usuários logados
        updateRule: "@request.auth.id != '' && @request.auth.is_admin = true",
        deleteRule: "@request.auth.id != '' && @request.auth.is_admin = true",
        fields: [
          {
            name: 'user',
            type: 'relation',
            collectionId: '_pb_users_auth_',
            required: false,
            maxSelect: 1,
            cascadeDelete: false,
          },
          {
            name: 'name',
            type: 'text',
            required: false,
          },
          {
            name: 'email',
            type: 'email',
            required: false,
          },
          {
            name: 'message',
            type: 'text',
            required: true,
          },
          {
            name: 'category',
            type: 'select',
            required: false,
            values: ['bug', 'idea', 'compliment', 'other'],
            maxSelect: 1,
          },
          {
            name: 'status',
            type: 'select',
            required: false,
            values: ['unread', 'read', 'archived'],
            maxSelect: 1,
          },
          {
            name: 'created',
            type: 'autodate',
            onCreate: true,
            onUpdate: false,
          },
          {
            name: 'updated',
            type: 'autodate',
            onCreate: true,
            onUpdate: true,
          },
        ],
        indexes: [
          'CREATE INDEX idx_feedback_created ON feedback (created DESC)',
          'CREATE INDEX idx_feedback_status ON feedback (status)',
          'CREATE INDEX idx_feedback_user ON feedback (user)',
        ],
      })
      app.save(newFeedback)
    }
  },
  (app) => {
    try {
      const col = app.findCollectionByNameOrId('feedback')
      app.delete(col)
    } catch (_) {}
  },
)
