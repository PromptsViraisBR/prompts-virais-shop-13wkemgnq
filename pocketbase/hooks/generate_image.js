/// <reference path="../pb_data/types.d.ts" />

/**
 * Hook desativado conforme especificação:
 * O sistema agora é focado exclusivamente em geração e adaptação de roteiros/prompts de texto fiéis às fotos.
 * Geração de imagem via IA foi desativada.
 */
routerAdd('POST', '/backend/v1/generate-image', (e) => {
  return e.json(410, {
    success: false,
    error:
      'A geração de imagens foi desativada. O sistema agora gera roteiros de texto ultra fiéis às fotos da sua peça.',
  })
})
