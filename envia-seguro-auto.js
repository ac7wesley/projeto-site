// Função para validar e enviar o formulário
// Aguardar o carregamento do DOM
document.addEventListener('DOMContentLoaded', function() {
    // Obter o formulário
    const formulario = document.getElementById('seguroAutoForm');
    
    // Adicionar um listener para o evento de envio do formulário
    if (formulario) {
        formulario.addEventListener('submit', function(event) {
            // Impedir o envio padrão do formulário
            event.preventDefault();
            
            // Verificar se todos os campos obrigatórios estão preenchidos
            if (validarFormularioEnvio()) {
                // Coletar todos os dados do formulário
                const dadosFormulario = coletarDadosFormulario();
                
                // Enviar para o Google Sheets
                enviarParaGoogleSheets(dadosFormulario);
                
                // Preparar mensagem para WhatsApp
                enviarParaWhatsApp(dadosFormulario);
            }
        });
    }
});

// Função para validar o formulário antes do envio
function validarFormularioEnvio() {
    // Verificar campos obrigatórios básicos
    const camposObrigatorios = [
        'cep', 
        'marcaVeiculo', 
        'modeloVeiculo', 
        'anoVeiculo', 
        'placaVeiculo'
    ];
    
    let valido = true;
    let primeiroElementoInvalido = null;
    
    camposObrigatorios.forEach(campo => {
        const elemento = document.getElementById(campo);
        if (elemento && !elemento.value.trim()) {
            valido = false;
            // Armazenar o primeiro elemento inválido encontrado
            if (!primeiroElementoInvalido) {
                primeiroElementoInvalido = elemento;
            }
        }
    });
    
    // Se houver campos inválidos, rolar até o primeiro
    if (!valido && primeiroElementoInvalido) {
        setTimeout(() => {
            primeiroElementoInvalido.scrollIntoView({ behavior: 'smooth', block: 'center' });
            primeiroElementoInvalido.focus();
        }, 100);
    }
    
    return valido;
}

// Função para coletar todos os dados do formulário
function coletarDadosFormulario() {
    const dados = {};
    
    // Coletar campos de texto, select e date
    const camposTexto = document.querySelectorAll('input[type="text"], input[type="number"], input[type="date"], select');
    camposTexto.forEach(campo => {
        if (campo.id) {
            dados[campo.id] = campo.value.trim();
        }
    });
    
    // Coletar campos de rádio
    const camposRadio = document.querySelectorAll('input[type="radio"]:checked');
    camposRadio.forEach(campo => {
        if (campo.name) {
            dados[campo.name] = campo.value;
        }
    });
    
    return dados;
}

// Função para enviar dados para o Google Sheets
function enviarParaGoogleSheets(dados) {
    // URL do seu Web App do Google Apps Script - substitua pelo seu URL real
    const scriptURL = 'https://script.google.com/macros/s/AKfycbwMZ7_YKAPQE-2VRAPZFvPqQooqwrsL7Z04oelG7jpjxmwCTVafAVweCu98Mu3Tp7tQ/exec';
    
    // Criar um objeto FormData para enviar os dados
    const formData = new FormData();
    
    // Adicionar cada campo ao FormData
    Object.keys(dados).forEach(chave => {
        formData.append(chave, dados[chave]);
    });
    
    // Mostrar mensagem de carregamento
    mostrarMensagemCarregamento('Enviando dados...');
    
    // Enviar os dados via fetch API
    fetch(scriptURL, { 
        method: 'POST', 
        body: formData,
        mode: 'no-cors' // Adicionar esta linha para evitar problemas de CORS
    })
    .then(response => {
        console.log('Dados enviados com sucesso para o Google Sheets');
        // Mostrar mensagem de sucesso para o usuário
        mostrarMensagemSucesso('Seus dados foram enviados com sucesso!');
        
        // Enviar para WhatsApp após sucesso no Google Sheets
        // Removido o setTimeout para evitar problemas de duplo envio
        enviarParaWhatsApp(dados);
    })
    .catch(error => {
        console.error('Erro:', error);
        mostrarMensagemErro('Ocorreu um erro ao enviar seus dados. Por favor, tente novamente.');
    });
}

// Função para enviar dados para o WhatsApp
function enviarParaWhatsApp(dados) {
    // Número de telefone para onde enviar (com código do país)
    const telefone = '5511999999999'; // Substitua pelo número correto
    
    // Construir a mensagem para o WhatsApp
    let mensagem = '*Nova Cotação de Seguro Auto*\n\n';
    
    // Adicionar informações do condutor
    mensagem += '*Informações do Condutor:*\n';
    mensagem += `CEP: ${dados.cep || 'Não informado'}\n`;
    mensagem += `Tipo de Residência: ${dados.tipoResidencia || 'Não informado'}\n`;
    mensagem += `Garagem na Residência: ${dados.garagemResidencia || 'Não informado'}\n`;
    
    if (dados.garagemResidencia === 'Sim') {
        mensagem += `Tipo de Portão: ${dados.tipoPortao || 'Não informado'}\n`;
    }
    
    mensagem += `Garagem no Local de Estudos: ${dados.garagemEstudos || 'Não informado'}\n`;
    mensagem += `Garagem no Local de Trabalho: ${dados.garagemTrabalho || 'Não informado'}\n`;
    mensagem += `Distância ao Trabalho: ${dados.distanciaTrabalho || 'Não informado'}\n`;
    mensagem += `Condutor Jovem: ${dados.condutorJovem || 'Não informado'}\n`;
    
    // Adicionar informações do veículo
    mensagem += '\n*Informações do Veículo:*\n';
    mensagem += `Marca: ${dados.marcaVeiculo || 'Não informado'}\n`;
    mensagem += `Modelo: ${dados.modeloVeiculo || 'Não informado'}\n`;
    mensagem += `Ano: ${dados.anoVeiculo || 'Não informado'}\n`;
    mensagem += `Placa: ${dados.placaVeiculo || 'Não informado'}\n`;
    mensagem += `Combustível: ${dados.combustivel || 'Não informado'}\n`;
    mensagem += `Blindagem: ${dados.possuiBlindagem || 'Não informado'}\n`;
    mensagem += `Kit Gás: ${dados.possuiKitGas || 'Não informado'}\n`;
    
    // Adicionar informações do seguro
    mensagem += '\n*Informações do Seguro:*\n';
    mensagem += `Tipo de Seguro: ${dados.tipoSeguro || 'Não informado'}\n`;
    
    if (dados.tipoSeguro === 'Renovação') {
        mensagem += `Bônus Atual: ${dados.bonusAtual || 'Não informado'}\n`;
        mensagem += `Seguradora Atual: ${dados.seguradoraAtual || 'Não informado'}\n`;
        mensagem += `Vigência Atual: ${dados.vigenciaAtual || 'Não informado'}\n`;
        mensagem += `Teve Sinistro: ${dados.teveSinistro || 'Não informado'}\n`;
    }
    
    // Codificar a mensagem para URL
    const mensagemCodificada = encodeURIComponent(mensagem);
    
    // Criar o link do WhatsApp
    const linkWhatsApp = `https://wa.me/${telefone}?text=${mensagemCodificada}`;
    
    // Abrir o WhatsApp em uma nova guia - método mais confiável
    window.open(linkWhatsApp, '_blank');
}

// Função para mostrar mensagem de carregamento
function mostrarMensagemCarregamento(mensagem) {
    // Verificar se já existe um elemento de mensagem
    let mensagemElement = document.getElementById('mensagem-carregamento');
    
    if (!mensagemElement) {
        // Criar um novo elemento se não existir
        mensagemElement = document.createElement('div');
        mensagemElement.id = 'mensagem-carregamento';
        mensagemElement.className = 'mensagem-carregamento';
        document.querySelector('.form-container').appendChild(mensagemElement);
    }
    
    // Definir a mensagem e mostrar
    mensagemElement.textContent = mensagem;
    mensagemElement.style.display = 'block';
    
    // Rolar até a mensagem
    mensagemElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Função para mostrar mensagem de sucesso
function mostrarMensagemSucesso(mensagem) {
    // Ocultar mensagem de carregamento
    const mensagemCarregamento = document.getElementById('mensagem-carregamento');
    if (mensagemCarregamento) {
        mensagemCarregamento.style.display = 'none';
    }
    
    // Verificar se já existe um elemento de mensagem
    let mensagemElement = document.getElementById('mensagem-sucesso');
    
    if (!mensagemElement) {
        // Criar um novo elemento se não existir
        mensagemElement = document.createElement('div');
        mensagemElement.id = 'mensagem-sucesso';
        mensagemElement.className = 'mensagem-sucesso';
        document.querySelector('.form-container').appendChild(mensagemElement);
    }
    
    // Definir a mensagem e mostrar
    mensagemElement.textContent = mensagem;
    mensagemElement.style.display = 'block';
    
    // Rolar até a mensagem
    mensagemElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Função para mostrar mensagem de erro
function mostrarMensagemErro(mensagem) {
    // Ocultar mensagem de carregamento
    const mensagemCarregamento = document.getElementById('mensagem-carregamento');
    if (mensagemCarregamento) {
        mensagemCarregamento.style.display = 'none';
    }
    
    // Verificar se já existe um elemento de mensagem
    let mensagemElement = document.getElementById('mensagem-erro');
    
    if (!mensagemElement) {
        // Criar um novo elemento se não existir
        mensagemElement = document.createElement('div');
        mensagemElement.id = 'mensagem-erro';
        mensagemElement.className = 'mensagem-erro';
        document.querySelector('.form-container').appendChild(mensagemElement);
    }
    
    // Definir a mensagem e mostrar
    mensagemElement.textContent = mensagem;
    mensagemElement.style.display = 'block';
    
    // Rolar até a mensagem
    mensagemElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
}