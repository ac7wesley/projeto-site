export default {
  async fetch(request, env) {
    // Tratamento para requisições OPTIONS (CORS preflight)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400"
        }
      });
    }

    const body = await request.json();
    
    // Obtém as credenciais do SendPulse das variáveis de ambiente
    // Acessar variáveis do ambiente CORRETAMENTE
    const clientId = env.CLIENT_ID;
    const clientSecret = env.CLIENT_SECRET;

    try {
      // Faz uma solicitação POST para obter o token de acesso do SendPulse
      const tokenRes = await fetch("https://api.sendpulse.com/oauth/access_token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`
      });
      
      // Extrai os dados do token da resposta
      const tokenData = await tokenRes.json();
      const accessToken = tokenData.access_token;

      // Desestrutura os dados do e-mail do corpo da solicitação
      const { to, name, subject, message } = body;

      // Verifica se todos os campos necessários estão presentes
      if (!to || !name || !subject || !message) {
        // Retorna uma resposta de erro se os dados estiverem incompletos
        return new Response(JSON.stringify({ error: "Dados de entrada inválidos" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      // Faz uma solicitação POST para enviar o e-mail usando a API do SendPulse
      const emailRes = await fetch("https://api.sendpulse.com/smtp/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: {
            to: [{ email: to, name: name }],
            subject: subject,
            text: message,
            from: { email: "logos@logoscor.com.br", name: "Email contato site logoscor" }
          }
        })
      });

      // Obtém o resultado da resposta do SendPulse
      const result = await emailRes.json();

      // Retorna uma resposta JSON com o resultado e os cabeçalhos apropriados
      return new Response(JSON.stringify(result), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    } catch (error) {
      // Captura qualquer erro que ocorra durante o processo
      console.error("Erro ao enviar o e-mail:", error);
      
      // Retorna uma resposta de erro com o status 500 (Erro Interno do Servidor)
      return new Response(JSON.stringify({ error: "Erro ao enviar o e-mail" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
};
