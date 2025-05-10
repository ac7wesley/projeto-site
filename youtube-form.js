document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('youtubeForm');
    const linkInput = document.getElementById('linkInput');
    const textInput = document.getElementById('textInput');
    const contentUrl = document.getElementById('contentUrl');
    const contentText = document.getElementById('contentText');
    
    // Configurações do webhook
    const WEBHOOK_CONFIG = {
        url: "https://n8n.logoscorretoradeseguros.com.br/webhook/youtube-transcript"
    };
    
    // Função para atualizar placeholders
    function updatePlaceholder() {
        const platform = document.querySelector('input[name="platform"]:checked').value;
        
        if (platform === 'youtube') {
            contentUrl.placeholder = 'https://www.youtube.com/watch?v=...';
            contentText.placeholder = 'Digite o roteiro do vídeo do YouTube aqui...';
        } else {
            contentUrl.placeholder = 'https://www.youtube.com/shorts/...';
            contentText.placeholder = 'Digite o roteiro do Shorts aqui...';
        }
    }

    // Gerenciar mudança de plataforma
    document.querySelectorAll('input[name="platform"]').forEach(radio => {
        radio.addEventListener('change', updatePlaceholder);
    });

    // Gerenciar mudança de tipo de conteúdo
    document.querySelectorAll('input[name="contentType"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const isText = this.value === 'text';
            linkInput.style.display = isText ? 'none' : 'block';
            textInput.style.display = isText ? 'block' : 'none';
            
            // Remove required de ambos os campos
            contentUrl.required = false;
            contentText.required = false;
            
            // Adiciona required apenas no campo visível
            if (isText) {
                contentText.required = true;
                contentUrl.value = '';
            } else {
                contentUrl.required = true;
                contentText.value = '';
            }
        });
    });

    // Função para validar URL do YouTube
    function validateYoutubeUrl(url) {
        return /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}/.test(url);
    }

    // Função para validar URL do Shorts
    function validateShortsUrl(url) {
        return /^(https?:\/\/)?(www\.)?youtube\.com\/shorts\/[a-zA-Z0-9_-]+/.test(url);
    }

    // Função para mostrar erro
    function showError(element, message) {
        element.classList.add('input-error');
        const errorDiv = element.parentElement.querySelector('.error-message');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        element.addEventListener('input', function() {
            element.classList.remove('input-error');
            errorDiv.style.display = 'none';
        }, { once: true });
    }

    // Evento de envio do formulário
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const platform = document.querySelector('input[name="platform"]:checked').value;
        const contentType = document.querySelector('input[name="contentType"]:checked').value;
        let conteudoParaEnviar = '';
        
        try {
            // Validação e preparação do conteúdo
            if (contentType === 'link') {
                const url = contentUrl.value.trim();
                if (platform === 'youtube' && !validateYoutubeUrl(url)) {
                    showError(contentUrl, 'Por favor, insira um link válido do YouTube');
                    return false;
                } else if (platform === 'shorts' && !validateShortsUrl(url)) {
                    showError(contentUrl, 'Por favor, insira um link válido do Shorts');
                    return false;
                }
                conteudoParaEnviar = url;
            } else {
                const texto = contentText.value.trim();
                if (!texto) {
                    showError(contentText, 'O texto não pode estar vazio');
                    return false;
                }
                conteudoParaEnviar = texto;
            }

            // Preparar dados para envio
            const dados = {
                plataforma: platform,
                tipo_conteudo: contentType,
                conteudo: conteudoParaEnviar,
                timestamp: new Date().toISOString(),
                origem_sistema: "criador-roteiro",
                tipo_lead: "roteiro"
            };

            // Mostrar indicador de carregamento
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';

            // Enviar para o webhook
            const response = await fetch(WEBHOOK_CONFIG.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(dados)
            });

            if (!response.ok) {
                throw new Error(`Erro no envio: ${response.status}`);
            }

            // Limpar formulário e resetar estado
            form.reset();
            contentUrl.value = '';
            contentText.value = '';
            contentUrl.classList.remove('input-error');
            contentText.classList.remove('input-error');
            document.querySelectorAll('.error-message').forEach(msg => {
                msg.style.display = 'none';
            });
            
            // Atualizar placeholders e visibilidade dos campos
            updatePlaceholder();
            const isText = document.querySelector('input[name="contentType"]:checked').value === 'text';
            linkInput.style.display = isText ? 'none' : 'block';
            textInput.style.display = isText ? 'block' : 'none';

            alert('Conteúdo enviado com sucesso!');
            
        } catch (error) {
            console.error('Erro ao enviar dados:', error);
            alert('Erro ao enviar o conteúdo. Por favor, tente novamente.');
        } finally {
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar Conteúdo';
        }
    });
});