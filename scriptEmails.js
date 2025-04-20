// Constantes
const WHATSAPP_NUMBER = '556230153001';
const EMAIL_RECIPIENT = 'logos@logoscor.com.br';
const CLOUDFLARE_WORKER_URL = 'https://email-site-logos.ac7wesley.workers.dev';
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbzcqmUPHrhliUaHF1MjH5DpURJPgvIgzvW7z2T1KrIpr_axmg613cwldCEgwjf-uGxsCg/exec';
const DEBUG = true;

// Função de depuração unificada
function log(mensagem, tipo = 'info', dados = null) {
  if (!DEBUG) return;
  const estilos = {
    info: 'color: #0066ff; font-weight: bold;',
    sucesso: 'color: #00aa00; font-weight: bold;',
    aviso: 'color: #ff9900; font-weight: bold;',
    erro: 'color: #ff0000; font-weight: bold;'
  };
  console.log(`%c[LogosCor] ${mensagem}`, estilos[tipo]);
  if (dados) console.log('Dados:', dados);
}

// Funções de manipulação de UI
function toggleElementVisibility(elementId, show) {
  const element = document.getElementById(elementId);
  if (element) {
    element.classList[show ? 'remove' : 'add']('hidden');
  }
}

function toggleError(elementId, show) {
  const errorElement = document.getElementById(`${elementId}Error`);
  const inputElement = document.getElementById(elementId);
  if (errorElement && inputElement) {
    errorElement.style.display = show ? 'block' : 'none';
    inputElement.classList[show ? 'add' : 'remove']('border-error');
  }
}

// Formatadores
const formatters = {
  moeda: new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }),
  
  telefone: (value) => {
    value = value.replace(/\D/g, '');
    if (value.length > 2) value = `(${value.substring(0,2)}) ${value.substring(2)}`;
    if (value.length > 10) value = `${value.substring(0,10)}-${value.substring(10,15)}`;
    return value;
  }
};

// Validadores
const validators = {
  email: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  telefone: (telefone) => /^\(\d{2}\) \d{5}-\d{4}$/.test(telefone),
  required: (value) => value && value.trim().length > 0
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  // Configurar máscara do telefone
  const telefoneInput = document.getElementById('telefone');
  if (telefoneInput) {
    telefoneInput.addEventListener('input', (e) => {
      e.target.value = formatters.telefone(e.target.value);
    });
  }

  // Validar email em tempo real
  const emailInput = document.getElementById('email');
  if (emailInput) {
    emailInput.addEventListener('blur', () => {
      const isValid = validators.email(emailInput.value);
      toggleError('email', !isValid);
    });
  }

  // Validar idade em tempo real
  const idadeInput = document.getElementById('idade');
  if (idadeInput) {
    idadeInput.addEventListener('input', () => {
      const idade = Number(idadeInput.value);
      const isValid = idade >= 18 && idade <= 63;
      toggleError('idade', !isValid);
    });
  }
});

// Função de validação da Etapa 1
function validarEtapa1() {
  let isValid = true;
  const campos = ['nome', 'email', 'telefone', 'idade', 'cidade', 'estado'];
  
  campos.forEach(campo => {
    const elemento = document.getElementById(campo);
    const valor = elemento.value;
    let valido = validators.required(valor);

    // Validações específicas
    if (campo === 'email') valido = validators.email(valor);
    if (campo === 'telefone') valido = validators.telefone(valor);
    if (campo === 'idade') {
      const idade = Number(valor);
      valido = idade >= 18 && idade <= 70;
    }

    toggleError(campo, !valido);
    if (!valido) isValid = false;
  });

  if (isValid) {
    toggleElementVisibility('formEtapa1', false);
    toggleElementVisibility('formEtapa2', true);
    document.getElementById('progressBar').style.width = '100%';
  }
}

// Configurações dos sliders
document.addEventListener('DOMContentLoaded', () => {
  // Configurar slider de crédito
  const creditoSlider = document.getElementById('credito');
  const creditoValor = document.getElementById('creditoValor');
  
  function updateSliderFill(slider) {
    const percent = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.background = `linear-gradient(to right, #2563eb 0%, #2563eb ${percent}%, #e5e7eb ${percent}%, #e5e7eb 100%)`;
  }

  creditoSlider.addEventListener('input', () => {
    creditoValor.textContent = formatters.moeda.format(creditoSlider.value);
    updateSliderFill(creditoSlider);
  });

  // Configurar slider de parcela
  const parcelaSlider = document.getElementById('parcela');
  const parcelaValor = document.getElementById('parcelaValor');
  
  parcelaSlider.addEventListener('input', () => {
    parcelaValor.textContent = formatters.moeda.format(parcelaSlider.value);
    updateSliderFill(parcelaSlider);
  });

  // Inicializar o preenchimento dos sliders
  updateSliderFill(creditoSlider);
  updateSliderFill(parcelaSlider);
});

  // Configurar campo origem
  const origemSelect = document.getElementById('origem');
  const outroOrigemContainer = document.getElementById('outroOrigemContainer');
  
  if (origemSelect && outroOrigemContainer) {
    origemSelect.addEventListener('change', () => {
      outroOrigemContainer.style.display = origemSelect.value === 'Outro' ? 'block' : 'none';
    });
  }


// Validação da Etapa 2
function validarEtapa2() {
  let isValid = true;
  const campos = ['objetivo', 'credito', 'parcela', 'profissao', 'origem'];
  
  campos.forEach(campo => {
    const elemento = document.getElementById(campo);
    const valor = elemento.value;
    let valido = validators.required(valor);
    
    // Validações específicas
    if (campo === 'credito' && valor <= 0) valido = false;
    if (campo === 'parcela' && valor <= 0) valido = false;
    if (campo === 'origem' && valor === 'Outro') {
      valido = validators.required(document.getElementById('outroOrigem').value);
    }
    
    toggleError(campo, !valido);
    if (!valido) isValid = false;
  });

  if (isValid) {
    enviarFormulario();
  }
}

// Função para voltar à Etapa 1
function voltarEtapa1() {
  toggleElementVisibility('formEtapa2', false);
  toggleElementVisibility('formEtapa1', true);
  document.getElementById('progressBar').style.width = '50%';
}

// Função para enviar para WhatsApp
function enviarWhatsApp(dadosPessoais, dadosSimulacao) {
  try {
    const mensagem = encodeURIComponent(`
Olá! Fiz uma simulação de consórcio no site.

*DADOS PESSOAIS:*
Nome: ${dadosPessoais.nome}
Email: ${dadosPessoais.email}
Telefone: ${dadosPessoais.telefone}
Idade: ${dadosPessoais.idade}
Cidade/UF: ${dadosPessoais.cidade}-${dadosPessoais.estado}

*DETALHES DA SIMULAÇÃO:*
Objetivo: ${dadosSimulacao.objetivo}
Crédito Desejado: ${formatters.moeda.format(dadosSimulacao.credito)}
Valor da Parcela: ${formatters.moeda.format(dadosSimulacao.parcela)}
Profissão: ${dadosSimulacao.profissao}
Como nos conheceu: ${dadosSimulacao.origem}`);

    window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${mensagem}`;
  } catch (error) {
    log("Erro ao abrir WhatsApp", 'erro', error);
    alert("Não foi possível abrir o WhatsApp automaticamente. Por favor, entre em contato pelo número: " + WHATSAPP_NUMBER);
  }
}

// Função principal de envio do formulário
async function enviarFormulario() {
  const botaoEnviar = document.querySelector('button[onclick="validarEtapa2()"]');
  const textoOriginal = botaoEnviar.innerHTML;
  botaoEnviar.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Enviando...';
  botaoEnviar.disabled = true;

  try {
    // Coletar dados do formulário
    const dadosPessoais = {
      nome: document.getElementById('nome').value,
      email: document.getElementById('email').value,
      telefone: document.getElementById('telefone').value,
      idade: document.getElementById('idade').value,
      cidade: document.getElementById('cidade').value,
      estado: document.getElementById('estado').value
    };

    const dadosSimulacao = {
      objetivo: document.getElementById('objetivo').value,
      credito: Number(document.getElementById('credito').value),
      parcela: Number(document.getElementById('parcela').value),
      profissao: document.getElementById('profissao').value,
      origem: document.getElementById('origem').value === 'Outro' 
        ? document.getElementById('outroOrigem').value 
        : document.getElementById('origem').value
    };

    // Enviar email
    await enviarEmailViaSendPulse(dadosPessoais, dadosSimulacao);
    log("Email enviado com sucesso!", 'sucesso');

    // Mostrar confirmação
    toggleElementVisibility('formEtapa2', false);
    toggleElementVisibility('confirmacaoEnvio', true);

    // Limpar dados da sessão
    sessionStorage.removeItem('dadosSimulacao');

    // Abrir WhatsApp
    enviarWhatsApp(dadosPessoais, dadosSimulacao);

  } catch (error) {
    log("Erro no envio do formulário", 'erro', error);
    alert("Houve um erro ao enviar os dados, mas você será redirecionado para o WhatsApp.");
    enviarWhatsApp(dadosPessoais, dadosSimulacao);
  } finally {
    botaoEnviar.innerHTML = textoOriginal;
    botaoEnviar.disabled = false;
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
          
