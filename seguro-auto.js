// Função para formatar o CEP
function formatarCEP(cep) {
    cep = cep.replace(/\D/g, '');
    if (cep.length > 5) {
        cep = cep.substring(0, 5) + '-' + cep.substring(5, 8);
    }
    return cep;
}

// Formatar placa do veículo
function formatarPlaca(placa) {
    placa = placa.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (placa.length > 3) {
        // Formato antigo (ABC-1234) ou novo (ABC1D23)
        if (placa.length <= 7) {
            return placa.substring(0, 3) + '-' + placa.substring(3);
        } else {
            return placa.substring(0, 3) + placa.substring(3, 4) + 
                   placa.substring(4, 5) + placa.substring(5, 7);
        }
    }
    return placa;
}

// Mostrar/ocultar campos condicionais
function toggleGaragemTipo() {
    const garagemSim = document.getElementById('garagemResidenciaSim').checked;
    document.getElementById('tipoPortaoContainer').style.display = garagemSim ? 'block' : 'none';
}

function toggleCondutorJovemInfo() {
    const condutorJovemSim = document.getElementById('condutorJovemSim').checked;
    document.getElementById('condutorJovemInfoContainer').style.display = condutorJovemSim ? 'block' : 'none';
}

function toggleFilhosInfo() {
    const filhosSim = document.getElementById('filhosSim').checked;
    document.getElementById('filhosInfoContainer').style.display = filhosSim ? 'block' : 'none';
}

function toggleRenovacaoInfo() {
    const renovacao = document.getElementById('seguroRenovacao').checked;
    document.getElementById('renovacaoInfoContainer').style.display = renovacao ? 'block' : 'none';
}

// Validar CEP
function validarCEP(cep) {
    return /^\d{5}-\d{3}$/.test(cep);
}

// Mostrar erro
function mostrarErro(campo, mostrar) {
    const elementoErro = document.getElementById(campo + 'Error');
    
    if (elementoErro) {
        elementoErro.style.display = mostrar ? 'block' : 'none';
        
        // Para campos de rádio, precisamos tratar de forma diferente
        const elementoCampo = document.getElementById(campo);
        if (elementoCampo) {
            // Para campos normais (input, select)
            if (mostrar) {
                elementoCampo.classList.add('border-error');
            } else {
                elementoCampo.classList.remove('border-error');
            }
        } else {
            // Para campos de rádio, aplicamos a classe ao container
            const radioGroup = document.querySelector(`input[name="${campo}"]`).closest('.radio-group');
            if (radioGroup) {
                if (mostrar) {
                    radioGroup.classList.add('radio-error');
                } else {
                    radioGroup.classList.remove('radio-error');
                }
            }
        }
    }
}

// Validar formulário
// Função para validar o formulário
function validarFormulario() {
    let valido = true;
    let primeiroErro = null;
    
    // Resetar todos os erros anteriores
    const mensagensErro = document.querySelectorAll('.error-message');
    mensagensErro.forEach(msg => {
        msg.style.display = 'none';
    });
    
    // Validar campos obrigatórios
    const camposComErro = document.querySelectorAll('.border-error, .radio-error, .highlight-error');
    camposComErro.forEach(campo => {
        campo.classList.remove('border-error', 'radio-error', 'highlight-error');
    });
    
    // Validar CEP
    const cep = document.getElementById('cep').value;
    if (!validarCEP(cep)) {
        mostrarErro('cep', true);
        valido = false;
        if (!primeiroErro) primeiroErro = document.getElementById('cep');
    } else {
        mostrarErro('cep', false);
    }
    
    // Validar campos de seleção única
    const camposRadio = [
        'tipoResidencia', 'garagemResidencia', 'garagemEstudos', 
        'garagemTrabalho', 'condutorJovem', 'temFilhos', 
        'usoVeiculo', 'tipoSeguro'
    ];
    
    camposRadio.forEach(campo => {
        const selecionado = document.querySelector(`input[name="${campo}"]:checked`);
        const temErro = !selecionado;
        mostrarErro(campo, temErro);
        
        if (temErro) {
            valido = false;
            if (!primeiroErro) {
                primeiroErro = document.querySelector(`input[name="${campo}"]`);
            }
        }
    });
    
    // Validar campos de texto
    const camposTexto = ['profissao'];
    camposTexto.forEach(campo => {
        const valor = document.getElementById(campo).value.trim();
        const temErro = valor === '';
        mostrarErro(campo, temErro);
        
        if (temErro) {
            valido = false;
            if (!primeiroErro) {
                primeiroErro = document.getElementById(campo);
            }
        }
    });
    
    // Validar campos de seleção
    const camposSelect = ['distanciaTrabalho', 'estadoCivil', 'bonusAtual'];
    camposSelect.forEach(campo => {
        const valor = document.getElementById(campo).value;
        const temErro = valor === '';
        mostrarErro(campo, temErro);
        
        if (temErro) {
            valido = false;
            if (!primeiroErro) {
                primeiroErro = document.getElementById(campo);
            }
        }
    });
    
    // Validar campos do veículo
    const camposVeiculo = ['marcaVeiculo', 'modeloVeiculo', 'anoVeiculo', 'placaVeiculo'];
    camposVeiculo.forEach(campo => {
        const valor = document.getElementById(campo).value.trim();
        let erro = valor === '';
        
        // Validações específicas
        if (campo === 'anoVeiculo' && valor !== '') {
            const ano = parseInt(valor);
            erro = ano < 1990 || ano > new Date().getFullYear();
        }
        else if (campo === 'placaVeiculo' && valor !== '') {
            // Validação básica de placa (formato ABC-1234 ou ABC1D23)
            erro = !/^[A-Z]{3}[-]?\d{1}[A-Z0-9]{1}\d{2}$/.test(valor.toUpperCase());
        }
        
        mostrarErro(campo, erro);
        if (erro && !primeiroErro) {
            primeiroErro = document.getElementById(campo);
            valido = false;
        }
    });
    
    // Validar opções de combustível e blindagem
    const camposRadioVeiculo = ['combustivel', 'possuiBlindagem', 'possuiKitGas'];
    camposRadioVeiculo.forEach(campo => {
        const selecionado = document.querySelector(`input[name="${campo}"]:checked`);
        const temErro = !selecionado;
        mostrarErro(campo, temErro);
        
        if (temErro) {
            valido = false;
            if (!primeiroErro) {
                primeiroErro = document.querySelector(`input[name="${campo}"]`);
            }
        }
    });
    
    // Validar campos condicionais
    if (document.getElementById('garagemResidenciaSim').checked) {
        const tipoPortao = document.querySelector('input[name="tipoPortao"]:checked');
        mostrarErro('tipoPortao', !tipoPortao);
        if (!tipoPortao) valido = false;
    }
    
    if (document.getElementById('condutorJovemSim').checked) {
        const idade = document.getElementById('idadeCondutorJovem').value;
        const sexo = document.querySelector('input[name="sexoCondutorJovem"]:checked');
        
        mostrarErro('idadeCondutorJovem', idade === '' || idade < 18 || idade > 25);
        mostrarErro('sexoCondutorJovem', !sexo);
        
        if (idade === '' || idade < 18 || idade > 25 || !sexo) valido = false;
    }
    
    if (document.getElementById('filhosSim').checked) {
        const idadeFilhos = document.getElementById('idadeFilhos').value.trim();
        mostrarErro('idadeFilhos', idadeFilhos === '');
        if (idadeFilhos === '') valido = false;
    }
    
    if (document.getElementById('seguroRenovacao').checked) {
        const camposRenovacao = ['bonusAtual', 'seguradoraAtual', 'vigenciaAtual'];
        camposRenovacao.forEach(campo => {
            const valor = document.getElementById(campo).value;
            mostrarErro(campo, valor === '');
            if (valor === '') valido = false;
        });
        
        const teveSinistro = document.querySelector('input[name="teveSinistro"]:checked');
        mostrarErro('teveSinistro', !teveSinistro);
        if (!teveSinistro) valido = false;
    }
    
    if (valido) {
        // Definir a variável global para indicar que o formulário é válido
        window.formValido = true;
        
        // Não mostrar o alerta, deixar o envia-seguro-auto.js lidar com isso
        // alert('Formulário enviado com sucesso! Em breve entraremos em contato.');
    } else if (primeiroErro) {
        // Encontrar o elemento pai para melhor visualização
        let elementoAlvo = primeiroErro;
        
        // Se for um campo de rádio, encontrar o grupo de rádio pai
        if (primeiroErro.type === 'radio') {
            const radioGroup = primeiroErro.closest('.radio-group');
            if (radioGroup) {
                elementoAlvo = radioGroup;
                radioGroup.classList.add('radio-error');
            }
        }
        
        // Encontrar o form-group pai para melhor contexto visual
        const formGroup = primeiroErro.closest('.form-group');
        if (formGroup) {
            elementoAlvo = formGroup;
        }
        
        // Rolar até o elemento com margem superior
        elementoAlvo.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Adicionar classe para destacar o elemento com erro
        setTimeout(() => {
            // Para campos de rádio, destacar o grupo inteiro
            if (primeiroErro.type === 'radio') {
                const radioGroup = primeiroErro.closest('.radio-group');
                if (radioGroup) {
                    radioGroup.classList.add('highlight-error');
                    // Remover a classe após a animação
                    setTimeout(() => radioGroup.classList.remove('highlight-error'), 1500);
                }
            } else {
                // Para outros campos
                primeiroErro.classList.add('highlight-error');
                // Remover a classe após a animação
                setTimeout(() => primeiroErro.classList.remove('highlight-error'), 1500);
            }
            
            // Focar no primeiro campo com erro
            primeiroErro.focus();
        }, 600);
    }
    
    // Retornar false para impedir o envio padrão do formulário
    // O envia-seguro-auto.js irá lidar com o envio real
    return false;
}

// Função para mostrar/ocultar campos condicionais
function toggleGaragemTipo() {
    const garagemResidenciaSim = document.getElementById('garagemResidenciaSim');
    const tipoPortaoContainer = document.getElementById('tipoPortaoContainer');
    
    if (garagemResidenciaSim && tipoPortaoContainer) {
        tipoPortaoContainer.style.display = garagemResidenciaSim.checked ? 'block' : 'none';
    }
}

function toggleCondutorJovemInfo() {
    const condutorJovemSim = document.getElementById('condutorJovemSim');
    const condutorJovemInfoContainer = document.getElementById('condutorJovemInfoContainer');
    
    if (condutorJovemSim && condutorJovemInfoContainer) {
        condutorJovemInfoContainer.style.display = condutorJovemSim.checked ? 'block' : 'none';
    }
}

function toggleFilhosInfo() {
    const filhosSim = document.getElementById('filhosSim');
    const filhosInfoContainer = document.getElementById('filhosInfoContainer');
    
    if (filhosSim && filhosInfoContainer) {
        filhosInfoContainer.style.display = filhosSim.checked ? 'block' : 'none';
    }
}

function toggleRenovacaoInfo() {
    const seguroRenovacao = document.getElementById('seguroRenovacao');
    const renovacaoInfoContainer = document.getElementById('renovacaoInfoContainer');
    
    if (seguroRenovacao && renovacaoInfoContainer) {
        renovacaoInfoContainer.style.display = seguroRenovacao.checked ? 'block' : 'none';
    }
}

// Inicializar os campos condicionais quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    toggleGaragemTipo();
    toggleCondutorJovemInfo();
    toggleFilhosInfo();
    toggleRenovacaoInfo();
});
// Inicializar quando o documento estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se a logo está no lugar correto
    const logoWrapper = document.querySelector('.logo-wrapper');
    if (logoWrapper) {
        const logoImg = logoWrapper.querySelector('img');
        if (logoImg) {
            // Garantir que o caminho da logo esteja correto
            logoImg.src = 'Logo.png';
            logoImg.alt = 'LogosCor Consorcio e Seguros';
        }
    }
    
    // Resto do código de inicialização
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            e.target.value = formatarCEP(e.target.value);
        });
    }
    
    // Formatar placa do veículo
    const placaInput = document.getElementById('placaVeiculo');
    if (placaInput) {
        placaInput.addEventListener('input', function(e) {
            e.target.value = formatarPlaca(e.target.value);
        });
    }
    
    // Inicializar os campos condicionais
    toggleGaragemTipo();
    toggleCondutorJovemInfo();
    toggleFilhosInfo();
    toggleRenovacaoInfo();
    
    // Adicionar ícone ao botão de enviar
    const submitButton = document.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Cotação';
    }
});