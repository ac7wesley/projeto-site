// Constantes
const WHATSAPP_NUMBER = '556230153001';
const EMAIL_RECIPIENT = 'logos@logoscor.com.br';
const CLOUDFLARE_WORKER_URL = 'https://email-site-logos.ac7wesley.workers.dev'; // Substitua pela URL do seu Worker
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbzcqmUPHrhliUaHF1MjH5DpURJPgvIgzvW7z2T1KrIpr_axmg613cwldCEgwjf-uGxsCg/exec'; // Substitua pela URL do seu Web App do Google Apps Script
// Configurações do SendPulse SMTP
const SENDPULSE_SMTP = {
  user: '21b3d17673984abf86ad76aaba6cc371',
  pass: '528c8261e0755be29840f9bc06070fa6'
};
// Manter EmailJS como fallback
const EMAIL_SERVICE_ID = "service_e5q4p1c";
const EMAIL_TEMPLATE_ID = "template_p4qs2s9";
const EMAIL_USER_ID = "3V_t4CeqYZ1q-BVVJ";
const DEBUG = true; // Ativar ou desativar logs de depuração

// Função de depuração
function log(mensagem, tipo = 'info', dados = null) {
  if (!DEBUG) return;
  
  const estilos = {
    info: 'color: #0066ff; font-weight: bold;',
    sucesso: 'color: #00aa00; font-weight: bold;',
    aviso: 'color: #ff9900; font-weight: bold;',
    erro: 'color: #ff0000; font-weight: bold;'
  };
  
  console.log(`%c[LogosCor] ${mensagem}`, estilos[tipo]);
  
  if (dados) {
    console.log('Dados:', dados);
  }
}

// Elementos do DOM
const formEtapa1 = document.getElementById('formEtapa1');
const formEtapa2 = document.getElementById('formEtapa2');
const progressBar = document.getElementById('progressBar');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
  // Limpar cache do navegador para garantir que o formulário comece do início
  localStorage.removeItem('etapa1Preenchida');
  localStorage.removeItem('dadosSimulacao');
  
  // Garantir que o formulário sempre comece na primeira etapa
  formEtapa1.classList.remove('hidden');
  formEtapa2.classList.add('hidden');
  progressBar.style.width = '50%';
  
  // Limpar todos os campos do formulário
  document.querySelectorAll('input, select').forEach(element => {
    if (element.type === 'range') {
      element.value = 0;
    } else if (element.type !== 'button') {
      element.value = '';
    }
  });
  
  // Atualizar os valores dos sliders
  atualizarSlider('credito');
  atualizarSlider('parcela');
  
  // Configurar máscara de telefone
  const telefoneInput = document.getElementById('telefone');
  telefoneInput.addEventListener('input', formatarTelefone);

  // Configurar sliders
  configurarSlider('credito');
  configurarSlider('parcela');

  // Configurar campo de origem
  document.getElementById('origem').addEventListener('change', toggleCampoOutro);
});

// Função para validar a Etapa 1
function validarEtapa1() {
  let isValid = true;
  
  // Validação do Nome
  const nome = document.getElementById('nome');
  const nomeError = document.getElementById('nomeError');
  if (!nome.value.trim()) {
    nome.classList.add('border-error');
    nomeError.style.display = 'block';
    isValid = false;
  } else {
    nome.classList.remove('border-error');
    nomeError.style.display = 'none';
  }

  // Validação do Email
  const email = document.getElementById('email');
  const emailError = document.getElementById('emailError');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value.trim())) {
    email.classList.add('border-error');
    emailError.style.display = 'block';
    isValid = false;
  } else {
    email.classList.remove('border-error');
    emailError.style.display = 'none';
  }

  // Validação do Telefone
  const telefone = document.getElementById('telefone');
  const telefoneError = document.getElementById('telefoneError');
  const telefoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
  if (!telefoneRegex.test(telefone.value.trim())) {
    telefone.classList.add('border-error');
    telefoneError.style.display = 'block';
    isValid = false;
  } else {
    telefone.classList.remove('border-error');
    telefoneError.style.display = 'none';
  }

  // Validação da Idade
  const idade = document.getElementById('idade');
  const idadeError = document.getElementById('idadeError');
  const idadeValue = parseInt(idade.value);
  if (!idadeValue || idadeValue < 18 || idadeValue > 70) {
    idade.classList.add('border-error');
    idadeError.style.display = 'block';
    isValid = false;
  } else {
    idade.classList.remove('border-error');
    idadeError.style.display = 'none';
  }

  // Validação da Cidade
  const cidade = document.getElementById('cidade');
  const cidadeError = document.getElementById('cidadeError');
  if (!cidade.value.trim()) {
    cidade.classList.add('border-error');
    cidadeError.style.display = 'block';
    isValid = false;
  } else {
    cidade.classList.remove('border-error');
    cidadeError.style.display = 'none';
  }

  // Validação do Estado
  const estado = document.getElementById('estado');
  const estadoError = document.getElementById('estadoError');
  if (!estado.value) {
    estado.classList.add('border-error');
    estadoError.style.display = 'block';
    isValid = false;
    } else {
    estado.classList.remove('border-error');
    estadoError.style.display = 'none';
  }

  // Se todas as validações passarem, avança para a próxima etapa
  if (isValid) {
    document.getElementById('formEtapa1').classList.add('hidden');
    document.getElementById('formEtapa2').classList.remove('hidden');
    document.getElementById('progressBar').style.width = '100%';
  }
}

// Função para validar a Etapa 2
function validarEtapa2() {
  // Obter valores dos campos
  const objetivo = document.getElementById('objetivo').value;
  const credito = document.getElementById('credito').value;
  const parcela = document.getElementById('parcela').value;
  const profissao = document.getElementById('profissao').value;
  const origem = document.getElementById('origem').value;
  const outroOrigem = document.getElementById('outroOrigem').value;

  // Validar campos
  let isValid = true;
  
  if (!objetivo) {
    mostrarErro('objetivoError');
    isValid = false;
  } else {
    ocultarErro('objetivoError');
  }

  if (!credito || credito === "0") {
    mostrarErro('creditoError');
    isValid = false;
  } else {
    ocultarErro('creditoError');
  }

  if (!parcela || parcela === "0") {
    mostrarErro('parcelaError');
    isValid = false;
  } else {
    ocultarErro('parcelaError');
  }

  if (!profissao) {
    mostrarErro('profissaoError');
    isValid = false;
    } else {
    ocultarErro('profissaoError');
  }

  if (!origem) {
    mostrarErro('origemError');
    isValid = false;
    } else {
    ocultarErro('origemError');
  }

  if (origem === 'Outro' && !outroOrigem) {
    mostrarErro('outroOrigemError');
    isValid = false;
  } else {
    ocultarErro('outroOrigemError');
  }

  if (isValid) {
    // Obter valores da etapa 1
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const idade = document.getElementById('idade').value;
    const cidade = document.getElementById('cidade').value;
    const estado = document.getElementById('estado').value;

    // Formatar valores monetários
    const creditoFormatado = formatarMoeda(credito);
    const parcelaFormatada = formatarMoeda(parcela);

    // Montar mensagem
    const mensagem = `Olá, tenho interesse em um consórcio!

*Dados Pessoais*
Nome: ${nome}
Email: ${email}
Telefone: ${telefone}
Idade: ${idade}
Cidade/UF: ${cidade}-${estado}

*Detalhes do Consórcio*
Objetivo: ${objetivo}
Crédito desejado: ${creditoFormatado}
Valor ideal de Parcela: ${parcelaFormatada}
Profissão: ${profissao}
Como nos conheceu: ${origem === 'Outro' ? outroOrigem : origem}`;

    // Enviar email
    enviarEmailAutomatico({ nome, email, telefone, idade, cidade, estado }, { objetivo, credito, parcela, profissao, origem, outroOrigem });

    // Mostrar confirmação
    document.getElementById('formEtapa2').classList.add('hidden');
    document.getElementById('confirmacaoEnvio').classList.remove('hidden');
  }
}

function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

// Funções auxiliares
function mostrarErro(id, mensagem) {
  const campo = document.getElementById(id);
  const erro = document.getElementById(`${id}Error`);
  
  if (id === 'credito' || id === 'parcela') {
    campo.classList.add('border-error');
    if (!erro) {
      const errorElement = document.createElement('p');
      errorElement.id = `${id}Error`;
      errorElement.className = 'text-red-500 text-sm mt-1';
      errorElement.innerHTML = `<i class="fas fa-exclamation-circle mr-1"></i>${mensagem}`;
      campo.parentNode.appendChild(errorElement);
    } else {
      erro.innerHTML = `<i class="fas fa-exclamation-circle mr-1"></i>${mensagem}`;
      erro.classList.add('show');
    }
    return;
  }
  
  campo.classList.add('border-error');
  erro.textContent = mensagem;
  erro.classList.remove('hidden');
}

function limparErro(id) {
  const campo = document.getElementById(id);
  const erro = document.getElementById(`${id}Error`);
  
  if (!erro) return;
  
  campo.classList.remove('border-error');
  
  if (id === 'credito' || id === 'parcela') {
    erro.remove();
    return;
  }
  
  erro.classList.add('hidden');
}

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarTelefone(telefone) {
  return /^\(\d{2}\) \d{5}-\d{4}$/.test(telefone);
}

function formatarTelefone(e) {
  let value = e.target.value.replace(/\D/g, '');
  if (value.length > 2) value = `(${value.substring(0,2)}) ${value.substring(2)}`;
  if (value.length > 10) value = `${value.substring(0,10)}-${value.substring(10,15)}`;
  e.target.value = value;
}

function mostrarEtapa2() {
  formEtapa1.classList.add('hidden');
  formEtapa2.classList.remove('hidden');
  progressBar.style.width = '100%';
}

function voltarEtapa1() {
  formEtapa2.classList.add('hidden');
  formEtapa1.classList.remove('hidden');
  progressBar.style.width = '50%';
}

function salvarDadosEtapa1() {
  const dados = {
    nome: document.getElementById('nome').value,
    email: document.getElementById('email').value,
    telefone: document.getElementById('telefone').value,
    idade: document.getElementById('idade').value,
    cidade: document.getElementById('cidade').value,
    estado: document.getElementById('estado').value
  };
  
  sessionStorage.setItem('dadosSimulacao', JSON.stringify(dados));
}

function toggleCampoOutro() {
  const origem = document.getElementById('origem').value;
  const outroContainer = document.getElementById('outroOrigemContainer');
  const outroCampo = document.getElementById('outroOrigem');
  
  if (origem === 'Outro') {
    outroContainer.style.display = 'block';
    outroCampo.required = true;
  } else {
    outroContainer.style.display = 'none';
    outroCampo.value = '';
    outroCampo.required = false;
    limparErro('outroOrigem');
  }
}

function configurarSlider(id) {
  const slider = document.getElementById(id);
  const valueElement = document.getElementById(`${id}Valor`);
  
  // Adicionar feedback tátil para dispositivos móveis
  slider.addEventListener('touchstart', function() {
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  });

  // Usar debounce para melhor performance
  let timeout;
  slider.addEventListener('input', function() {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => atualizarSlider(id), 10);
    
    // Feedback visual imediato
    const value = parseFloat(slider.value);
    const min = parseFloat(slider.min) || 0;
    const max = parseFloat(slider.max) || 100;
    
    // Validar valores
    if (value < min) slider.value = min;
    if (value > max) slider.value = max;
  });
  
  atualizarSlider(id);
}

function atualizarSlider(id) {
  const slider = document.getElementById(id);
  const valueElement = document.getElementById(`${id}Valor`);
  
  const value = parseFloat(slider.value);
  const min = parseFloat(slider.min) || 0;
  const max = parseFloat(slider.max) || 100;
  const progress = ((value - min) / (max - min)) * 100;
  
  // Aplicar animação suave
  slider.style.transition = 'all 0.2s ease-out';
  slider.style.setProperty('--range-progress', `${progress}%`);
  
  // Atualizar cor baseado no progresso
  const hue = Math.min(120, (progress / 100) * 120);
  slider.style.setProperty('--range-color', `hsl(${hue}, 70%, 45%)`);
  
  if (valueElement) {
    // Formatação monetária mais precisa
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    valueElement.textContent = formatter.format(value);
    
    // Adicionar classe para animação
    valueElement.classList.add('valor-atualizado');
    setTimeout(() => valueElement.classList.remove('valor-atualizado'), 300);
  }
}

function enviarSimulacao() {
  const dadosPessoais = JSON.parse(sessionStorage.getItem('dadosSimulacao')) || {};
  const dadosSimulacao = {
    objetivo: document.getElementById('objetivo').value,
    credito: document.getElementById('credito').value,
    parcela: document.getElementById('parcela').value,
    profissao: document.getElementById('profissao').value,
    origem: document.getElementById('origem').value === 'Outro' 
      ? document.getElementById('outroOrigem').value 
      : document.getElementById('origem').value
  };

  log('Dados da simulação coletados', 'info', { dadosPessoais, dadosSimulacao });

  // Enviar e-mail de forma automática
  enviarEmailAutomatico(dadosPessoais, dadosSimulacao);
}

function enviarWhatsApp(dadosPessoais, dadosSimulacao) {
  log("Preparando abertura do WhatsApp...", 'info');
  
  try {
    // Preparar a mensagem com os dados do formulário
    const mensagem = `Olá, tenho interesse em um consórcio!%0A%0A` +
      `*Dados Pessoais*%0A` +
      `Nome: ${dadosPessoais.nome}%0A` +
      `Email: ${dadosPessoais.email}%0A` +
      `Telefone: ${dadosPessoais.telefone}%0A` +
      `Idade: ${dadosPessoais.idade}%0A` +
      `Cidade/UF: ${dadosPessoais.cidade}-${dadosPessoais.estado}%0A%0A` +
      `*Detalhes do Consórcio*%0A` +
      `Objetivo: ${dadosSimulacao.objetivo}%0A` +
      `Crédito desejado: ${Number(dadosSimulacao.credito).toLocaleString('pt-BR')}%0A` +
      `Valor ideal de Parcela: ${Number(dadosSimulacao.parcela).toLocaleString('pt-BR')}%0A` +
      `Profissão: ${dadosSimulacao.profissao}%0A` +
      `Como nos conheceu: ${dadosSimulacao.origem}`;

    // Construir a URL do WhatsApp com a mensagem
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${mensagem}`;
    log("URL do WhatsApp gerada", 'info');
    
    // Abrir o WhatsApp na mesma janela
    log("Tentando abrir WhatsApp na mesma janela...", 'info');
    window.location.href = whatsappUrl;
    
  } catch (e) {
    log("Erro ao tentar abrir WhatsApp", 'erro', e);
    alert("Não foi possível abrir o WhatsApp automaticamente. Por favor, entre em contato pelo número: " + WHATSAPP_NUMBER);
  }
}

async function enviarDadosParaPlanilha(dados) {
  try {
    log("Preparando dados para enviar ao Google Sheets...", 'info');
    
    // Criar FormData
    const formData = new FormData();
    
    // Adicionar os dados ao FormData
    Object.keys(dados).forEach(key => {
      formData.append(key, dados[key]);
    });

    // Enviar dados diretamente via fetch
    const response = await fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      body: formData,
      mode: 'no-cors' // Importante para evitar erros de CORS
    });

    log("Resposta do Google Sheets recebida", 'sucesso');
    return { result: 'success' };
  } catch (error) {
    log("Erro ao enviar dados para planilha", 'erro', error);
    throw error;
  }
}

async function enviarEmailAutomatico(dadosPessoais, dadosSimulacao) {
  // Mostrar indicador de carregamento
  const botaoEnviar = document.querySelector('button[onclick="validarEtapa2()"]');
  const textoOriginal = botaoEnviar.innerHTML;
  botaoEnviar.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Enviando...';
  botaoEnviar.disabled = true;

  try {
    log("Iniciando envio de dados...", 'info');
    
    // Preparar dados para envio
    const dadosPessoaisTexto = `
Nome: ${dadosPessoais.nome}
Email: ${dadosPessoais.email}
Telefone: ${dadosPessoais.telefone}
Idade: ${dadosPessoais.idade}
Cidade/UF: ${dadosPessoais.cidade}-${dadosPessoais.estado}`;
    
    const detalhesSimulacaoTexto = `
Objetivo: ${dadosSimulacao.objetivo}
Valor do Crédito: ${Number(dadosSimulacao.credito).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
Valor ideal de Parcela: ${Number(dadosSimulacao.parcela).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
Profissão: ${dadosSimulacao.profissao}
Como nos conheceu: ${dadosSimulacao.origem}`;

    // Enviar dados para o Google Sheets
    try {
      const dadosParaEnviar = {
        nome: dadosPessoais.nome,
        email: dadosPessoais.email,
        telefone: dadosPessoais.telefone,
        idade: dadosPessoais.idade,
        cidade: dadosPessoais.cidade,
        estado: dadosPessoais.estado,
        objetivo: dadosSimulacao.objetivo,
        credito: dadosSimulacao.credito,
        parcela: dadosSimulacao.parcela,
        profissao: dadosSimulacao.profissao,
        origem: dadosSimulacao.origem
      };

      log("Dados a serem enviados:", 'info', dadosParaEnviar);
      
      const resultado = await enviarDadosParaPlanilha(dadosParaEnviar);
      log("Dados salvos na planilha com sucesso!", 'sucesso', resultado);
    } catch (error) {
      log("Erro ao salvar na planilha", 'erro', {
        message: error.message,
        stack: error.stack
      });
      // Continuar mesmo com erro na planilha
    }

    // Enviar email via SendPulse
    enviarEmailViaSendPulse(dadosPessoais, dadosSimulacao, dadosPessoaisTexto, detalhesSimulacaoTexto)
      .then(() => {
        log("Email enviado com sucesso!", 'sucesso');
      })
      .catch((error) => {
        log("Erro ao enviar email", 'erro', error);
      })
      .finally(() => {
        // Sempre mostrar confirmação e abrir WhatsApp
        setTimeout(() => {
          // Ocultar formulário e mostrar confirmação
          document.getElementById('formEtapa2').classList.add('hidden');
          document.getElementById('confirmacaoEnvio').classList.remove('hidden');
          
          // Limpar dados da sessão
          sessionStorage.removeItem('dadosSimulacao');
          
          // Restaurar botão
          botaoEnviar.innerHTML = textoOriginal;
          botaoEnviar.disabled = false;
          //--------------------------------------------------------------------------------------------


          fetch("https://email-site-logos.ac7wesley.workers.dev", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              to: email,
              name: nome,
              subject: assunto,
              message: mensagem
            })
          })
          
          //--------------------------------------------------------------------------------------------
          
          // Abrir WhatsApp
          log("Abrindo WhatsApp...", 'info');
          enviarWhatsApp(dadosPessoais, dadosSimulacao);
        }, 10);
      });
    
  } catch (e) {
    log("Erro ao processar formulário", 'erro', {
      message: e.message,
      stack: e.stack
    });
    
    // Mesmo com erro, mostrar confirmação e abrir WhatsApp
    document.getElementById('formEtapa2').classList.add('hidden');
    document.getElementById('confirmacaoEnvio').classList.remove('hidden');
    
    // Restaurar botão
    botaoEnviar.innerHTML = textoOriginal;
    botaoEnviar.disabled = false;
    
    // Abrir WhatsApp
    enviarWhatsApp(dadosPessoais, dadosSimulacao);
  }
}

async function enviarEmailViaSendPulse(dadosPessoais, dadosSimulacao, dadosPessoaisTexto, detalhesSimulacaoTexto) {
  try {
    log("Iniciando envio via Cloudflare Worker...", 'info');

    const emailData = {
      to: EMAIL_RECIPIENT,
      name: "LogosCor",
      subject: "Nova Simulação de Consórcio - LogosCor",
      message: `
        Nova Simulação de Consórcio\n\n
        Dados Pessoais:\n
        ${dadosPessoaisTexto}\n\n
        Detalhes da Simulação:\n
        ${detalhesSimulacaoTexto}
      `
    };

    // Enviar usando Cloudflare Worker
    const response = await fetch(CLOUDFLARE_WORKER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Falha no envio: ${errorData}`);
    }

    const result = await response.json();
    log("Email enviado com sucesso via Cloudflare Worker", 'sucesso', result);
    return true;
  } catch (error) {
    log("Erro ao enviar email via Cloudflare Worker", 'erro', error);
    throw error;
  }
}

// Função para mostrar erro
function mostrarErro(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.style.display = 'block';
    const inputElement = document.getElementById(elementId.replace('Error', ''));
    if (inputElement) {
      inputElement.classList.add('border-error');
    }
  }
}

// Função para ocultar erro
function ocultarErro(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.style.display = 'none';
    const inputElement = document.getElementById(elementId.replace('Error', ''));
    if (inputElement) {
      inputElement.classList.remove('border-error');
    }
  }
}
