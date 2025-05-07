document.addEventListener('DOMContentLoaded', function() {
    const youtubeForm = document.getElementById('youtubeForm');
    const youtubeUrlInput = document.getElementById('youtubeUrl');
    const youtubePreview = document.getElementById('youtubePreview');
    const previewFrame = document.getElementById('previewFrame');
    
    // Configurações específicas para o formulário do YouTube
    const YOUTUBE_CONFIG = {
        webhookUrlYoutube: "https://n8n.logoscorretoradeseguros.com.br/webhook/youtube-transcript"
    };
    
    // Função para extrair o ID do vídeo do YouTube a partir da URL
    function extractYoutubeId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }
    
    // Função para mostrar pré-visualização do vídeo
    function showPreview(url) {
        const videoId = extractYoutubeId(url);
        
        if (videoId) {
            previewFrame.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            youtubePreview.style.display = 'block';
            return true;
        } else {
            previewFrame.innerHTML = '';
            youtubePreview.style.display = 'none';
            return false;
        }
    }
    
    // Evento para mostrar pré-visualização quando o usuário digita a URL
    youtubeUrlInput.addEventListener('blur', function() {
        showPreview(this.value);
    });
    
    // Evento de envio do formulário
    youtubeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const youtubeUrl = youtubeUrlInput.value;
        const descricao = document.getElementById('descricao').value;
        
        // Validar URL do YouTube
        if (!showPreview(youtubeUrl)) {
            alert('Por favor, insira uma URL válida do YouTube.');
            return;
        }
        
        // Preparar dados para envio
        const dados = {
            youtubeUrl: youtubeUrl,
            videoId: extractYoutubeId(youtubeUrl),
            descricao: descricao,
            timestamp: new Date().toISOString(),
            origem: 'formulario-youtube'
        };
        
        // Enviar para webhook
        enviarParaWebhook(dados);
    });
    
    /**
     * Envia os dados do formulário para o webhook
     * @param {Object} dados - Dados do formulário
     */
    function enviarParaWebhook(dados) {
        // URL do webhook para processamento de vídeos do YouTube
        const webhookUrl = YOUTUBE_CONFIG.webhookUrlYoutube;
        
        console.log("Iniciando envio para webhook:", webhookUrl);
        console.log("Dados a serem enviados:", dados);
        
        // Mostrar indicador de carregamento
        const submitButton = youtubeForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        
        // Enviar dados para o webhook com configurações CORS
        fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Origin': window.location.origin
            },
            mode: 'cors',
            credentials: 'omit',
            body: JSON.stringify(dados)
        })
        .then(response => {
            console.log("Resposta recebida - Status:", response.status);
            
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }
            
            return response.text();
        })
        .then(data => {
            console.log("Resposta completa:", data);
            
            // Mostrar mensagem de sucesso
            alert('Vídeo enviado com sucesso! Obrigado pelo envio.');
            
            // Limpar formulário
            youtubeForm.reset();
            youtubePreview.style.display = 'none';
        })
        .catch(error => {
            console.error("Erro ao enviar dados:", error);
            
            // Tentar alternativa com proxy CORS
            usarProxyCORS(webhookUrl, dados, submitButton, originalText);
        })
        .finally(() => {
            // Restaurar botão (caso não tenha sido redirecionado para o proxy)
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        });
    }
    
    /**
     * Tenta enviar os dados usando um proxy CORS como alternativa
     * @param {string} url - URL original do webhook
     * @param {Object} dados - Dados a serem enviados
     * @param {HTMLElement} button - Botão de submit
     * @param {string} originalText - Texto original do botão
     */
    function usarProxyCORS(url, dados, button, originalText) {
        console.log("Tentando envio alternativo via proxy CORS...");
        
        // Usar um serviço de proxy CORS público
        const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(url);
        
        fetch(proxyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(dados)
        })
        .then(response => {
            console.log("Resposta do proxy recebida - Status:", response.status);
            
            if (!response.ok) {
                throw new Error(`Erro no proxy ${response.status}: ${response.statusText}`);
            }
            
            return response.text();
        })
        .then(data => {
            console.log("Resposta completa do proxy:", data);
            
            // Mostrar mensagem de sucesso
            alert('Vídeo enviado com sucesso! Obrigado pelo envio.');
            
            // Limpar formulário
            youtubeForm.reset();
            youtubePreview.style.display = 'none';
        })
        .catch(error => {
            console.error("Erro ao enviar via proxy:", error);
            alert(`Não foi possível enviar o vídeo. Por favor, tente novamente mais tarde ou entre em contato com o suporte.`);
        })
        .finally(() => {
            // Restaurar botão
            button.disabled = false;
            button.textContent = originalText;
        });
    }
});