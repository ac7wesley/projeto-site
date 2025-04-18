// Defina a origem permitida
const allowedOrigin = 'https://logoscor.com.br';

// Defina os cabeçalhos CORS que serão adicionados a todas as respostas
// (tanto preflight quanto as respostas reais)
const corsHeaders = {
  "Content-Type": "application/json",
  'Access-Control-Allow-Origin': allowedOrigin,
  'Access-Control-Allow-Methods': 'POST, OPTIONS', // Adicione outros métodos se necessário (PUT, DELETE, etc.)
  'Access-Control-Allow-Headers': 'Content-Type', // Adicione outros cabeçalhos que seu frontend envia (ex: 'Authorization')
};

// Função para lidar com a requisição principal do seu worker
async function handleRequest(request) {
  // --- Lógica principal do seu worker aqui ---
  // Exemplo: verificar se é POST, pegar dados, enviar email, etc.
  // Suponha que sua lógica original retorne uma resposta (Response object)
  // const originalResponse = await suaFuncaoDeEnviarEmail(request);

  // Por enquanto, vamos simular uma resposta de sucesso como exemplo
  const responseData = { success: true, message: 'Email processado (simulado)' };
  const originalResponse = new Response(JSON.stringify(responseData), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
  // --- Fim da lógica principal ---


  // Crie uma nova resposta baseada na original, mas adicionando os cabeçalhos CORS
  // É importante criar uma nova Response porque os Headers são imutáveis
  let responseWithCors = new Response(originalResponse.body, originalResponse);
  Object.keys(corsHeaders).forEach(header => {
    responseWithCors.headers.set(header, corsHeaders[header]);
  });

  return responseWithCors;
}

// Função para lidar especificamente com requisições OPTIONS (preflight)
function handleOptions(request) {
  // Verifique se os cabeçalhos Access-Control-Request-Method/Headers estão presentes
  // O navegador envia estes cabeçalhos na requisição OPTIONS
  if (
    request.headers.get('Origin') !== null &&
    request.headers.get('Access-Control-Request-Method') !== null &&
    request.headers.get('Access-Control-Request-Headers') !== null
  ) {
    // Responda com os cabeçalhos CORS necessários para o preflight
    // Um status 204 No Content é apropriado para preflights
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  } else {
    // Se não for uma requisição preflight válida, retorne uma resposta simples
    // ou um erro, como preferir.
    return new Response(null, {
      headers: {
        Allow: 'GET, POST, OPTIONS', // Informa os métodos permitidos
      },
    });
  }
}

// Listener principal do Worker
addEventListener('fetch', event => {
  const request = event.request;

  // Verifique a origem da requisição
  const origin = request.headers.get('Origin');

  // Se a origem não for a permitida (ou não houver origem - mesma origem/ferramentas como curl),
  // você pode optar por prosseguir ou bloquear. Para CORS, focamos em origens diferentes.
  // Neste exemplo, só aplicamos CORS se a origem for a permitida.
  // Se a origem for diferente da permitida, o navegador bloqueará de qualquer forma
  // se os cabeçalhos CORS não estiverem presentes ou não corresponderem.

  if (origin === allowedOrigin) {
      // Lida com a requisição preflight OPTIONS
      if (request.method === 'OPTIONS') {
        event.respondWith(handleOptions(request));
      }
      // Lida com requisições GET, POST, etc.
      else if (request.method === 'POST' || request.method === 'GET') { // Adicione outros métodos se necessário
        event.respondWith(handleRequest(request));
      }
      else {
        // Método não permitido
        event.respondWith(new Response('Método não permitido', { status: 405 }));
      }
  } else {
      // Se a origem for diferente ou nula, processe a requisição sem adicionar
      // os cabeçalhos CORS específicos para allowedOrigin, ou bloqueie se preferir.
      // Se for uma requisição de mesma origem ou sem origem, geralmente não precisa de CORS.
      // Se for uma origem diferente NÃO permitida, a falta de cabeçalhos CORS fará o navegador bloquear.
      // Aqui, vamos apenas processar normalmente (sem cabeçalhos CORS adicionais).
      // Se for um POST/GET, poderia chamar handleRequest, mas sem adicionar os cabeçalhos depois.
      // Ou simplesmente retornar um erro se quiser ser mais restritivo.
      // Exemplo: Processa POST/GET normalmente, mas sem adicionar cabeçalhos CORS explicitamente
       if (request.method === 'POST' || request.method === 'GET') {
           // Neste caso simplificado, vamos chamar handleRequest que *sempre* adiciona
           // os cabeçalhos definidos globalmente. Uma implementação mais robusta
           // poderia ter uma versão de handleRequest que só adiciona se a origem for permitida.
           // Por simplicidade aqui, ele adicionará, mas o navegador só aceitará se a origem for allowedOrigin.
            event.respondWith(handleRequest(request));
       } else if (request.method === 'OPTIONS') {
            // Responde a OPTIONS de outras origens sem os headers de permissão
            event.respondWith(handleOptions(request)); // handleOptions já retorna só os headers corretos
       }
       else {
            event.respondWith(new Response('Método não permitido ou origem não suportada', { status: 405 }));
       }
  }

});
