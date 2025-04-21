/**
 * Funções para enviar dados do formulário de seguro auto para o Google Sheets
 */
const linkGoogleSheets = 'https://script.google.com/macros/s/AKfycbz8Xxsq3LGdQRRVhDUAPaj1Nnb31szGwn-kVdFz1erajni60m6GHVVte5_EwYitVUo/exec';
// URL do Web App do Google Apps Script que processa os dados
const GOOGLE_SHEETS_URL = linkGoogleSheets;
/**
 * Função principal para enviar dados para o Google Sheets usando um método alternativo
 * que contorna as restrições de CORS
 * @param {Object} dados - Objeto com os dados do formulário
 * @returns {Promise} - Promise com o resultado da operação
 */
function enviarParaGoogleSheets(dados) {
    console.log('Enviando dados para Google Sheets:', dados);
    
    // Formatar os dados para envio
    const dadosFormatados = formatarDadosParaEnvio(dados);
    
    // Retornar uma Promise para permitir tratamento assíncrono
    return new Promise((resolve, reject) => {
        try {
            // Criar um formulário temporário para enviar os dados
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = GOOGLE_SHEETS_URL;
            form.target = '_blank'; // Pode ser alterado para 'hidden-iframe' se você criar um iframe oculto
            form.style.display = 'none';
            
            // Adicionar cada campo como um input separado em vez de um único campo JSON
            for (const key in dadosFormatados) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = dadosFormatados[key];
                form.appendChild(input);
            }
            
            // Adicionar o formulário ao documento
            document.body.appendChild(form);
            
            // Criar um iframe oculto para receber a resposta
            const iframe = document.createElement('iframe');
            iframe.name = 'hidden-iframe';
            iframe.id = 'hidden-iframe';
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            
            // Definir form.target para o iframe
            form.target = 'hidden-iframe';
            
            // Enviar o formulário
            form.submit();
            
            // Como não podemos capturar facilmente a resposta com este método,
            // vamos considerar o envio bem-sucedido após um tempo
            setTimeout(() => {
                // Limpar os elementos criados
                document.body.removeChild(form);
                if (document.getElementById('hidden-iframe')) {
                    document.body.removeChild(iframe);
                }
                
                resolve({
                    success: true,
                    message: 'Dados enviados para processamento'
                });
            }, 2000);
        } catch (erro) {
            console.error('Erro ao enviar para Google Sheets:', erro);
            reject(new Error('Falha ao enviar dados para a planilha'));
        }
    });
}

/**
 * Formata os dados do formulário para o formato esperado pelo Google Sheets
 * @param {Object} dados - Dados coletados do formulário
 * @returns {Object} - Dados formatados para envio
 */
function formatarDadosParaEnvio(dados) {
    console.log("Formatando dados para envio:", dados);
    
    // Criar um objeto com os dados formatados
    // Importante: Manter os nomes das propriedades consistentes com as colunas da planilha
    const dadosFormatados = {
        timestamp: new Date().toISOString(),
        // Dados do condutor
        nome: dados.nomeCondutor || '',
        telefone: dados.telefone || '',
        cep: dados.cep || '',
        tipoResidencia: dados.tipoResidencia || '',
        garagemResidencia: dados.garagemResidencia || '',
        tipoPortao: dados.tipoPortao || '',
        garagemEstudos: dados.garagemEstudos || '',
        garagemTrabalho: dados.garagemTrabalho || '',
        distancia: dados.distancia || '',
        condutorJovem: dados.condutorJovem || '',
        idadeCondutorJovem: dados.idadeCondutorJovem || '',
        sexoCondutorJovem: dados.sexoCondutorJovem || '',
        estadoCivil: dados.estadoCivil || '',
        profissao: dados.profissao || '',
        temFilhos: dados.temFilhos || '',
        idadeFilhos: dados.idadeFilhos || '',
        
        // Dados do veículo
        usoVeiculo: dados.usoVeiculo || '',
        marcaVeiculo: dados.marcaVeiculo || '',
        modeloVeiculo: dados.modeloVeiculo || '',
        anoVeiculo: dados.anoVeiculo || '',
        combustivel: dados.combustivel || '',
        placaVeiculo: dados.placaVeiculo || '',
        possuiBlindagem: dados.possuiBlindagem || '',
        possuiKitGas: dados.possuiKitGas || '',
        
        // Dados do seguro
        tipoSeguro: dados.tipoSeguro || '',
        bonusAtual: dados.bonusAtual || '',
        seguradoraAtual: dados.seguradoraAtual || '',
        vigenciaAtual: dados.vigenciaAtual || '',
        teveSinistro: dados.teveSinistro || ''
    };
    
    console.log("Dados formatados para envio:", dadosFormatados);
    return dadosFormatados;
}

/**
 * Método alternativo usando fetch com modo 'no-cors'
 * @param {Object} dados - Dados do formulário
 * @returns {Promise} - Promise com o resultado
 */
function enviarParaGoogleSheetsFetch(dados) {
    const dadosFormatados = formatarDadosParaEnvio(dados);
    
    // Converter para formato de URL encoded para melhor compatibilidade
    const formData = new URLSearchParams();
    
    // Adicionar cada campo ao formData
    for (const key in dadosFormatados) {
        formData.append(key, dadosFormatados[key]);
    }
    
    console.log("Enviando dados via fetch:", formData.toString());
    
    return fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors', // Importante para evitar erros de CORS
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
    })
    .then(response => {
        console.log("Resposta recebida do servidor");
        // Como estamos usando 'no-cors', não podemos ler a resposta
        // Vamos assumir que foi bem-sucedido
        return {
            success: true,
            message: 'Solicitação enviada com sucesso'
        };
    })
    .catch(error => {
        console.error('Erro ao enviar dados:', error);
        throw new Error('Erro ao enviar dados para a planilha');
    });
}



/**
 * Função para integrar com o seguro-auto.js
 * Deve ser chamada após a validação dos dados
 * @param {Object} dados - Dados do formulário validados
 * @returns {Promise} - Promise com o resultado do envio
 */
/**
 * Processa o envio do formulário para o Google Sheets
 * @param {Object} dados - Dados do formulário
 * @returns {Promise} - Promise com o resultado do envio
 */


function processarEnvioFormulario(dados) {
    // Mostrar indicador de carregamento
    mostrarCarregamento();
    
    console.log("Formatando dados para envio:", dados);
    
    // Formatar dados para envio - simplificando os nomes das colunas
    const dadosFormatados = {
        timestamp: new Date().toISOString(),
        nome: dados.nomeCondutor || '',
        telefone: dados.telefone || '',
        cep: dados.cep || '',
        tipoResidencia: dados.tipoResidencia || '',
        garagemResidencia: dados.garagemResidencia || '',
        tipoPortao: dados.tipoPortao || '',
        garagemEstudos: dados.garagemEstudos || '',
        garagemTrabalho: dados.garagemTrabalho || '',
        distancia: dados.distancia || '',
        condutorJovem: dados.condutorJovem || '',
        idadeCondutorJovem: dados.idadeCondutorJovem || '',
        sexoCondutorJovem: dados.sexoCondutorJovem || '',
        estadoCivil: dados.estadoCivil || '',
        profissao: dados.profissao || '',
        temFilhos: dados.temFilhos || '',
        idadeFilhos: dados.idadeFilhos || '',
        usoVeiculo: dados.usoVeiculo || '',
        marcaVeiculo: dados.marcaVeiculo || '',
        modeloVeiculo: dados.modeloVeiculo || '',
        anoVeiculo: dados.anoVeiculo || '',
        combustivel: dados.combustivel || '',
        placaVeiculo: dados.placaVeiculo || '',
        possuiBlindagem: dados.possuiBlindagem || '',
        possuiKitGas: dados.possuiKitGas || '',
        tipoSeguro: dados.tipoSeguro || '',
        bonusAtual: dados.bonusAtual || '',
        seguradoraAtual: dados.seguradoraAtual || '',
        vigenciaAtual: dados.vigenciaAtual || '',
        teveSinistro: dados.teveSinistro || ''
    };
    
    console.log("Dados formatados para envio:", dadosFormatados);
    
    // URL do seu Web App do Google Apps Script
    const url = linkGoogleSheets;
    
    // Usar uma abordagem com iframe oculto em vez de _blank
    return new Promise((resolve, reject) => {
        try {
            // Criar um iframe oculto para receber a resposta
            const iframe = document.createElement('iframe');
            iframe.name = 'hidden-iframe';
            iframe.id = 'hidden-iframe';
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            
            // Criar um formulário temporário para enviar os dados
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = url;
            form.target = 'hidden-iframe'; // Usar o iframe em vez de _blank
            form.style.display = 'none';
            
            // Adicionar cada campo como um input separado
            for (const key in dadosFormatados) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = dadosFormatados[key];
                form.appendChild(input);
            }
            
            // Adicionar o formulário ao documento
            document.body.appendChild(form);
            
            // Enviar o formulário
            form.submit();
            
            // Considerar o envio bem-sucedido após um tempo
            setTimeout(() => {
                // Ocultar indicador de carregamento
                ocultarCarregamento();
                
                // Limpar os elementos criados
                document.body.removeChild(form);
                if (document.getElementById('hidden-iframe')) {
                    document.body.removeChild(iframe);
                }
                
                console.log("Dados enviados com sucesso para a planilha");
                resolve(true);
            }, 2000);
        } catch (erro) {
            // Ocultar indicador de carregamento em caso de erro
            ocultarCarregamento();
            console.error("Erro ao enviar dados:", erro);
            reject(erro);
        }
    });
}



/**
 * Exibe um indicador de carregamento na página
 */
function mostrarCarregamento() {
    // Verificar se já existe um loader
    if (document.getElementById('sheets-loader')) {
        document.getElementById('sheets-loader').style.display = 'flex';
        return;
    }
    
    // Criar elemento de loader
    const loader = document.createElement('div');
    loader.id = 'sheets-loader';
    loader.style.position = 'fixed';
    loader.style.top = '0';
    loader.style.left = '0';
    loader.style.width = '100%';
    loader.style.height = '100%';
    loader.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    loader.style.display = 'flex';
    loader.style.justifyContent = 'center';
    loader.style.alignItems = 'center';
    loader.style.zIndex = '9999';
    
    loader.innerHTML = `
        <div style="background-color: white; padding: 20px; border-radius: 5px; text-align: center;">
            <div style="border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 30px; height: 30px; margin: 0 auto; animation: spin 2s linear infinite;"></div>
            <p style="margin-top: 10px;">Enviando dados para a planilha...</p>
        </div>
    `;
    
    // Adicionar estilos de animação
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    // Adicionar ao corpo do documento
    document.body.appendChild(loader);
}

/**
 * Oculta o indicador de carregamento
 */
function ocultarCarregamento() {
    const loader = document.getElementById('sheets-loader');
    if (loader) {
        loader.style.display = 'none';
    }
}

/**
 * Função para ser chamada no seguro-auto.js
 * Integra o envio para WhatsApp e para o Google Sheets
 * @param {Object} dados - Dados do formulário
 */
function enviarDadosCompletos(dados) {
    // Primeiro enviar para a planilha
    return processarEnvioFormulario(dados)
        .then(() => {
            // Depois enviar para o WhatsApp (se necessário)
            // Esta função deve ser chamada no lugar da função enviarParaWhatsApp no seguro-auto.js
            return true;
        })
        .catch(erro => {
            // Exibir mensagem de erro
            alert('Ocorreu um erro ao salvar os dados: ' + erro.message);
            return false;
        });
}

// Exportar as funções para uso global
window.enviarDadosCompletos = enviarDadosCompletos;