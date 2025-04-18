export default {
    async fetch(request) {
      return new Response('Funcionando! 🚀', {
        headers: { 'content-type': 'text/plain' },
      });
    },
  };
  