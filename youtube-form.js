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
        const contentType = document.querySelector('input[name="contentType"]:checked').value;
        
        if (contentType === 'newContext') {
            contentText.placeholder = 'Digite o novo contexto aqui...';
            return;
        }
        
        if (platform === 'youtube') {
            contentUrl.placeholder = 'https://www.youtube.com/watch?v=...';
            contentText.placeholder = 'Digite o roteiro do vídeo do YouTube aqui...';
        } else {
            contentUrl.placeholder = 'https://www.youtube.com/shorts/...';
            contentText.placeholder = 'Digite o roteiro do Shorts aqui...';
        }
    }

    // Função para alternar a visibilidade dos campos de entrada
    function toggleInputFields() {
        const contentType = document.querySelector('input[name="contentType"]:checked').value;
        
        if (contentType === 'link') {
            linkInput.style.display = 'block';
            textInput.style.display = 'none';
            contentUrl.required = true;
            contentText.required = false;
        } else {
            // Tanto para 'text' quanto para 'newContext', mostramos o campo de texto
            linkInput.style.display = 'none';
            textInput.style.display = 'block';
            contentUrl.required = false;
            contentText.required = true;
        }
        
        updatePlaceholder();
    }

    // Gerenciar mudança de plataforma
    document.querySelectorAll('input[name="platform"]').forEach(radio => {
        radio.addEventListener('change', updatePlaceholder);
    });

    // Gerenciar mudança de tipo de conteúdo
    document.querySelectorAll('input[name="contentType"]').forEach(radio => {
        radio.addEventListener('change', toggleInputFields);
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

    // Variável para controlar se um envio está em andamento
    let isSubmitting = false;

    // Evento de envio do formulário - REMOVIDO LISTENER DUPLICADO
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Evitar envios múltiplos
        if (isSubmitting) {
            console.log('Envio já em andamento, ignorando...');
            return false;
        }
        
        isSubmitting = true;
        
        const platform = document.querySelector('input[name="platform"]:checked').value;
        const contentType = document.querySelector('input[name="contentType"]:checked').value;
        let conteudoParaEnviar = '';
        
        try {
            // Validação e preparação do conteúdo
            if (contentType === 'link') {
                const url = contentUrl.value.trim();
                if (platform === 'youtube' && !validateYoutubeUrl(url)) {
                    showError(contentUrl, 'Por favor, insira um link válido do YouTube');
                    isSubmitting = false;
                    return false;
                } else if (platform === 'shorts' && !validateShortsUrl(url)) {
                    showError(contentUrl, 'Por favor, insira um link válido do Shorts');
                    isSubmitting = false;
                    return false;
                }
                conteudoParaEnviar = url;
            } else {
                const texto = contentText.value.trim();
                if (!texto) {
                    showError(contentText, 'O texto não pode estar vazio');
                    isSubmitting = false;
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

            console.log('Enviando dados para o webhook:', dados);

            // Enviar para o webhook
            const response = await fetch(WEBHOOK_CONFIG.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(dados),
                // Evitar cache
                cache: 'no-store'
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
            toggleInputFields();

            alert('Conteúdo enviado com sucesso!');
            
        } catch (error) {
            console.error('Erro ao enviar dados:', error);
            alert('Erro ao enviar o conteúdo. Por favor, tente novamente.');
        } finally {
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar Conteúdo';
            isSubmitting = false;
        }
    });
    
    // Inicializar os campos corretamente
    toggleInputFields();
});

// Função para lidar com o envio do formulário via atributo onsubmit
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Acionar o evento de submit do formulário para reutilizar a lógica
    // Usando um evento personalizado para evitar loops
    const customEvent = new CustomEvent('submit', { cancelable: true });
    const handled = document.getElementById('youtubeForm').dispatchEvent(customEvent);
    
    return false;
}