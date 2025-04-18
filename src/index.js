export default {
  async fetch(request) {
    return new Response('Funcionando com Wrangler + Cloudflare Workers! 🚀', {
      headers: { 'content-type': 'text/plain' },
    });
  },
};
