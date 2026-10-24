/// <reference path="../pb_data/types.d.ts" />

/**
 * Hook desativado conforme especificação:
 * O sistema agora é focado exclusivamente em geração e adaptação de roteiros/prompts de texto fiéis às fotos.
 * Geração de vídeo via IA foi desativada.
 */
routerAdd('GET', '/backend/v1/video-credits', (e) => {
  return e.json(200, {
    success: true,
    message:
      'Geração de vídeo desativada. O foco agora é geração e personalização de roteiros de alta conversão.',
    engines: {},
  })
})

routerAdd('POST', '/backend/v1/generate-video', (e) => {
  return e.json(410, {
    success: false,
    error:
      'A geração de vídeo foi desativada. O sistema agora personaliza e gera roteiros de texto ultra fiéis às fotos da sua peça.',
  })
})
