document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    
    function enviarParaWebhook(dados) {
        const webhookUrl = YOUTUBE_CONFIG.webhookUrlYoutube;
        const submitButton = youtubeForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Atualizar botão para estado de envio
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitButton.style.backgroundColor = '#6c757d';
        
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
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            // Atualizar botão para estado de sucesso
            submitButton.style.backgroundColor = '#28a745';
            submitButton.innerHTML = '<i class="fas fa-check"></i> Enviando...';
            
            // Mostrar texto "Enviando..." por 1 segundo antes de mudar para "Vídeo enviado com sucesso!"
            setTimeout(() => {
                submitButton.innerHTML = '<i class="fas fa-check"></i> Vídeo enviado com sucesso!';
                
                // Aguardar mais 2 segundos antes de resetar o formulário
                setTimeout(() => {
                    youtubeForm.reset();
                    youtubePreview.style.display = 'none';
                    submitButton.disabled = false;
                    submitButton.style.backgroundColor = '#007bff';
                    submitButton.textContent = originalText;
                }, 2000);
            }, 1000);
        })
        .catch(error => {
            console.error("Erro ao enviar dados:", error);
            usarProxyCORS(webhookUrl, dados, submitButton, originalText);
        });
    }
    
    function usarProxyCORS(url, dados, button, originalText) {
        const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(url);
        
        button.innerHTML = '<i class="fas fa-sync fa-spin"></i> Tentando alternativa...';
        button.style.backgroundColor = '#ffc107';
        
        fetch(proxyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(dados)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro no proxy ${response.status}: ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            // Atualizar botão para estado de sucesso
            button.style.backgroundColor = '#28a745';
            button.innerHTML = '<i class="fas fa-check"></i> Enviando...';
            
            // Mostrar texto "Enviando..." por 1 segundo antes de mudar para "Vídeo enviado com sucesso!"
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-check"></i> Vídeo enviado com sucesso!';
                
                // Aguardar mais 2 segundos antes de resetar o formulário
                setTimeout(() => {
                    youtubeForm.reset();
                    youtubePreview.style.display = 'none';
                    button.disabled = false;
                    button.style.backgroundColor = '#007bff';
                    button.textContent = originalText;
                }, 2000);
            }, 1000);
        })
        .catch(error => {
            console.error("Erro ao enviar via proxy:", error);
            button.style.backgroundColor = '#dc3545';
            button.innerHTML = '<i class="fas fa-times"></i> Erro ao enviar';
            
            setTimeout(() => {
                button.disabled = false;
                button.style.backgroundColor = '#007bff';
                button.textContent = originalText;
            }, 3000);
        });
    }
    
    // ... existing code ...
});