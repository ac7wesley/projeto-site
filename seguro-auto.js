// Função para avançar para a segunda etapa
function seguroAutoEtapa1() {
    // Validar campos da primeira etapa
    if (validarEtapa1()) {
        // Transição suave entre etapas
        document.getElementById('seguroAutoEtapa1').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('seguroAutoEtapa1').style.display = 'none';
            document.getElementById('seguroAutoEtapa2').style.display = 'block';
            setTimeout(() => {
                document.getElementById('seguroAutoEtapa2').style.opacity = '1';
                // Atualizar a barra de progresso
                document.getElementById('step1').classList.remove('active');
                document.getElementById('step1').classList.add('completed');
                document.getElementById('step2').classList.add('active');
                // Rolar para o topo da página
                window.scrollTo(0, 0);
            }, 50);
        }, 300);
    }
}

// Função para validar a primeira etapa
function validarEtapa1() {
    let isValid = true;
    let primeiroErro = null;
    
    // Validar nome do condutor
    const nomeCondutor = document.getElementById('nomeCondutor');
    if (nomeCondutor) {
        if (!nomeCondutor.value.trim()) {
            mostrarErro('nomeCondutorError', 'Por favor, informe o nome completo');
            if (!primeiroErro) primeiroErro = nomeCondutor;
            isValid = false;
        } else {
            ocultarErro('nomeCondutorError');
        }
    }
    
    // Validar telefone
    const telefone = document.getElementById('telefoneCondutor');
    if (telefone) {
        if (!telefone.value.trim()) {
            mostrarErro('telefoneCondutorError', 'Por favor, informe o telefone');
            if (!primeiroErro) primeiroErro = telefone;
            isValid = false;
        } else {
            ocultarErro('telefoneCondutorError');
        }
    }
    
    // Validar CEP
    const cep = document.getElementById('cep');
    if (cep) {
        if (!cep.value.trim()) {
            mostrarErro('cepError', 'Por favor, informe o CEP');
            if (!primeiroErro) primeiroErro = cep;
            isValid = false;
        } else {
            ocultarErro('cepError');
        }
    }
    
    // Validar tipo de residência (casa ou apartamento)
    const tipoResidencia = document.querySelector('input[name="tipoResidencia"]:checked');
    if (document.querySelector('input[name="tipoResidencia"]') && !tipoResidencia) {
        mostrarErro('tipoResidenciaError', 'Por favor, selecione o tipo de residência');
        if (!primeiroErro) primeiroErro = document.querySelector('input[name="tipoResidencia"]');
        isValid = false;
    } else {
        ocultarErro('tipoResidenciaError');
    }
    
    // Validar garagem na residência
    const garagemResidencia = document.querySelector('input[name="garagemResidencia"]:checked');
    if (document.querySelector('input[name="garagemResidencia"]') && !garagemResidencia) {
        mostrarErro('garagemResidenciaError', 'Por favor, informe se o veículo fica em garagem fechada na residência');
        if (!primeiroErro) primeiroErro = document.querySelector('input[name="garagemResidencia"]');
        isValid = false;
    } else {
        ocultarErro('garagemResidenciaError');
        
        // Validar tipo de portão se garagem na residência for "Sim"
        if (garagemResidencia && garagemResidencia.value === 'Sim') {
            const tipoPortao = document.querySelector('input[name="tipoPortao"]:checked');
            if (!tipoPortao) {
                mostrarErro('tipoPortaoError', 'Por favor, selecione o tipo de portão');
                if (!primeiroErro) primeiroErro = document.querySelector('input[name="tipoPortao"]');
                isValid = false;
            } else {
                ocultarErro('tipoPortaoError');
            }
        }
    }
    
    // Validar garagem no local de estudos
    const garagemEstudos = document.querySelector('input[name="garagemEstudos"]:checked');
    if (document.querySelector('input[name="garagemEstudos"]') && !garagemEstudos) {
        mostrarErro('garagemEstudosError', 'Por favor, informe se o veículo fica em garagem fechada no local de estudos');
        if (!primeiroErro) primeiroErro = document.querySelector('input[name="garagemEstudos"]');
        isValid = false;
    } else {
        ocultarErro('garagemEstudosError');
    }
    
    // Validar garagem no local de trabalho
    const garagemTrabalho = document.querySelector('input[name="garagemTrabalho"]:checked');
    if (document.querySelector('input[name="garagemTrabalho"]') && !garagemTrabalho) {
        mostrarErro('garagemTrabalhoError', 'Por favor, informe se o veículo fica em garagem fechada no local de trabalho');
        if (!primeiroErro) primeiroErro = document.querySelector('input[name="garagemTrabalho"]');
        isValid = false;
    } else {
        ocultarErro('garagemTrabalhoError');
    }
    
    // Validar distância
    const distancia = document.getElementById('distanciaTrabalho');
    if (distancia) {
        if (!distancia.value) {
            mostrarErro('distanciaTrabalhoError', 'Por favor, selecione a distância percorrida');
            if (!primeiroErro) primeiroErro = distancia;
            isValid = false;
        } else {
            ocultarErro('distanciaTrabalhoError');
        }
    }
    
    // Validar condutor jovem
    const condutorJovem = document.querySelector('input[name="condutorJovem"]:checked');
    if (document.querySelector('input[name="condutorJovem"]') && !condutorJovem) {
        mostrarErro('condutorJovemError', 'Por favor, informe se reside com condutores jovens');
        if (!primeiroErro) primeiroErro = document.querySelector('input[name="condutorJovem"]');
        isValid = false;
    } else {
        ocultarErro('condutorJovemError');
        
        // Validar informações do condutor jovem se houver
        if (condutorJovem && condutorJovem.value === 'Sim') {
            const idadeCondutorJovem = document.getElementById('idadeCondutorJovem');
            if (idadeCondutorJovem) {
                if (!idadeCondutorJovem.value || idadeCondutorJovem.value < 18 || idadeCondutorJovem.value > 25) {
                    mostrarErro('idadeCondutorJovemError', 'Por favor, informe uma idade entre 18 e 25 anos');
                    if (!primeiroErro) primeiroErro = idadeCondutorJovem;
                    isValid = false;
                } else {
                    ocultarErro('idadeCondutorJovemError');
                }
            }
            
            const sexoCondutorJovem = document.querySelector('input[name="sexoCondutorJovem"]:checked');
            if (document.querySelector('input[name="sexoCondutorJovem"]') && !sexoCondutorJovem) {
                mostrarErro('sexoCondutorJovemError', 'Por favor, informe o sexo do condutor jovem');
                if (!primeiroErro) primeiroErro = document.querySelector('input[name="sexoCondutorJovem"]');
                isValid = false;
            } else {
                ocultarErro('sexoCondutorJovemError');
            }
        }
    }
    
    // Validar estado civil
    const estadoCivil = document.getElementById('estadoCivil');
    if (estadoCivil) {
        if (!estadoCivil.value) {
            mostrarErro('estadoCivilError', 'Por favor, selecione o estado civil');
            if (!primeiroErro) primeiroErro = estadoCivil;
            isValid = false;
        } else {
            ocultarErro('estadoCivilError');
        }
    }
    
    // Validar profissão
    const profissao = document.getElementById('profissao');
    if (profissao) {
        if (!profissao.value.trim()) {
            mostrarErro('profissaoError', 'Por favor, informe a profissão');
            if (!primeiroErro) primeiroErro = profissao;
            isValid = false;
        } else {
            ocultarErro('profissaoError');
        }
    }
    
    // Validar tem filhos
    const temFilhos = document.querySelector('input[name="temFilhos"]:checked');
    if (document.querySelector('input[name="temFilhos"]') && !temFilhos) {
        mostrarErro('temFilhosError', 'Por favor, informe se tem filhos');
        if (!primeiroErro) primeiroErro = document.querySelector('input[name="temFilhos"]');
        isValid = false;
    } else {
        ocultarErro('temFilhosError');
        
        // Validar informações dos filhos se houver
        if (temFilhos && temFilhos.value === 'Sim') {
            const idadeFilhos = document.getElementById('idadeFilhos');
            if (idadeFilhos && !idadeFilhos.value.trim()) {
                mostrarErro('idadeFilhosError', 'Por favor, informe a idade dos filhos');
                if (!primeiroErro) primeiroErro = idadeFilhos;
                isValid = false;
            } else if (idadeFilhos) {
                ocultarErro('idadeFilhosError');
            }
        }
    }
    
    // Se houver erro, focar no primeiro campo com erro
    if (!isValid && primeiroErro) {
        primeiroErro.focus();
        primeiroErro.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Exibir mensagem de alerta
        exibirAlerta('Por favor, preencha todos os campos obrigatórios destacados em vermelho.');
    }
    
    return isValid;
}

// Função para validar a segunda etapa
function validarEtapa2() {
    let isValid = true;
    let primeiroErro = null;
    
    // Validar uso do veículo
    const usoVeiculo = document.querySelector('input[name="usoVeiculo"]:checked');
    if (document.querySelector('input[name="usoVeiculo"]') && !usoVeiculo) {
        mostrarErro('usoVeiculoError', 'Por favor, selecione o uso do veículo');
        if (!primeiroErro) primeiroErro = document.querySelector('input[name="usoVeiculo"]');
        isValid = false;
    } else {
        ocultarErro('usoVeiculoError');
    }
    
    // Validar marca do veículo
    const marcaVeiculo = document.getElementById('marcaVeiculo');
    if (marcaVeiculo) {
        if (!marcaVeiculo.value.trim()) {
            mostrarErro('marcaVeiculoError', 'Por favor, informe a marca do veículo');
            if (!primeiroErro) primeiroErro = marcaVeiculo;
            isValid = false;
        } else {
            ocultarErro('marcaVeiculoError');
        }
    }
    
    // Validar modelo do veículo
    const modeloVeiculo = document.getElementById('modeloVeiculo');
    if (modeloVeiculo) {
        if (!modeloVeiculo.value.trim()) {
            mostrarErro('modeloVeiculoError', 'Por favor, informe o modelo do veículo');
            if (!primeiroErro) primeiroErro = modeloVeiculo;
            isValid = false;
        } else {
            ocultarErro('modeloVeiculoError');
        }
    }
    
    // Validar ano do veículo
    const anoVeiculo = document.getElementById('anoVeiculo');
    if (anoVeiculo) {
        if (!anoVeiculo.value) {
            mostrarErro('anoVeiculoError', 'Por favor, informe o ano do veículo');
            if (!primeiroErro) primeiroErro = anoVeiculo;
            isValid = false;
        } else {
            ocultarErro('anoVeiculoError');
        }
    }
    
    // Validar combustível
    const combustivel = document.querySelector('input[name="combustivel"]:checked');
    if (document.querySelector('input[name="combustivel"]') && !combustivel) {
        mostrarErro('combustivelError', 'Por favor, selecione o tipo de combustível');
        if (!primeiroErro) primeiroErro = document.querySelector('input[name="combustivel"]');
        isValid = false;
    } else {
        ocultarErro('combustivelError');
    }
    
    // Validar placa
    const placaVeiculo = document.getElementById('placaVeiculo');
    if (placaVeiculo) {
        if (!placaVeiculo.value.trim()) {
            mostrarErro('placaVeiculoError', 'Por favor, informe a placa do veículo');
            if (!primeiroErro) primeiroErro = placaVeiculo;
            isValid = false;
        } else {
            ocultarErro('placaVeiculoError');
        }
    }
    
    // Validar blindagem
    const possuiBlindagem = document.querySelector('input[name="possuiBlindagem"]:checked');
    if (document.querySelector('input[name="possuiBlindagem"]') && !possuiBlindagem) {
        mostrarErro('possuiBlindagemError', 'Por favor, informe se o veículo possui blindagem');
        if (!primeiroErro) primeiroErro = document.querySelector('input[name="possuiBlindagem"]');
        isValid = false;
    } else {
        ocultarErro('possuiBlindagemError');
    }
    
    // Validar kit gás
    const possuiKitGas = document.querySelector('input[name="possuiKitGas"]:checked');
    if (document.querySelector('input[name="possuiKitGas"]') && !possuiKitGas) {
        mostrarErro('possuiKitGasError', 'Por favor, informe se o veículo possui kit gás');
        if (!primeiroErro) primeiroErro = document.querySelector('input[name="possuiKitGas"]');
        isValid = false;
    } else {
        ocultarErro('possuiKitGasError');
    }
    
    // Validar tipo de seguro
    const tipoSeguro = document.querySelector('input[name="tipoSeguro"]:checked');
    if (document.querySelector('input[name="tipoSeguro"]') && !tipoSeguro) {
        mostrarErro('tipoSeguroError', 'Por favor, selecione o tipo de seguro');
        if (!primeiroErro) primeiroErro = document.querySelector('input[name="tipoSeguro"]');
        isValid = false;
    } else {
        ocultarErro('tipoSeguroError');
        
        // Validar informações de renovação se for renovação
        if (tipoSeguro && tipoSeguro.value === 'Renovação') {
            // Validar bônus atual
            const bonusAtual = document.getElementById('bonusAtual');
            if (bonusAtual && !bonusAtual.value) {
                mostrarErro('bonusAtualError', 'Por favor, selecione o bônus atual');
                if (!primeiroErro) primeiroErro = bonusAtual;
                isValid = false;
            } else if (bonusAtual) {
                ocultarErro('bonusAtualError');
            }
            
            // Validar seguradora atual
            const seguradoraAtual = document.getElementById('seguradoraAtual');
            if (seguradoraAtual && !seguradoraAtual.value.trim()) {
                mostrarErro('seguradoraAtualError', 'Por favor, informe a seguradora atual');
                if (!primeiroErro) primeiroErro = seguradoraAtual;
                isValid = false;
            } else if (seguradoraAtual) {
                ocultarErro('seguradoraAtualError');
            }
            
            // Validar vigência atual
            const vigenciaAtual = document.getElementById('vigenciaAtual');
            if (vigenciaAtual && !vigenciaAtual.value) {
                mostrarErro('vigenciaAtualError', 'Por favor, informe a data de vigência');
                if (!primeiroErro) primeiroErro = vigenciaAtual;
                isValid = false;
            } else if (vigenciaAtual) {
                ocultarErro('vigenciaAtualError');
            }
            
            // Validar teve sinistro
            const teveSinistro = document.querySelector('input[name="teveSinistro"]:checked');
            if (document.querySelector('input[name="teveSinistro"]') && !teveSinistro) {
                mostrarErro('teveSinistroError', 'Por favor, informe se teve sinistro');
                if (!primeiroErro) primeiroErro = document.querySelector('input[name="teveSinistro"]');
                isValid = false;
            } else {
                ocultarErro('teveSinistroError');
            }
        }
    }
    
    // Se houver erro, focar no primeiro campo com erro
    if (!isValid && primeiroErro) {
        primeiroErro.focus();
        primeiroErro.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Exibir mensagem de alerta
        exibirAlerta('Por favor, preencha todos os campos obrigatórios destacados em vermelho.');
    }
    
    return isValid;
}
//---------------------------------------------------------------------------
// Função para enviar o formulário
function seguroAutoEtapa2() {
    // Verificar se já está processando
    if (window.processandoEnvio) {
        console.log("Já está processando o envio, ignorando clique duplicado");
        return false;
    }
    
    // Marcar como processando
    window.processandoEnvio = true;
    
    if (validarEtapa2()) {
        try {
            // Forçar rolagem para o topo da página
            rolarParaTopo();
            
            // Pequeno atraso para garantir que a rolagem ocorra antes do processamento
            setTimeout(() => {
                // Coletar todos os dados do formulário
                const dados = coletarDadosFormulario();
                
                // Log para debug
                console.log("Dados coletados para envio:", dados);
                
                // Enviar dados para webhook e continuar com o fluxo
                try {
                    // Enviar para webhook primeiro
                    enviarSeguroParaWebhook(dados);
                    
                    // Continuar com o processamento normal
                    processarEnvioFormulario(dados)
                        .then(sucesso => {
                            console.log('Resposta do processamento:', sucesso);
                            if (sucesso) {
                                // Enviar dados para o WhatsApp
                                enviarParaWhatsApp(dados);
                                
                                // Exibir mensagem de sucesso
                                exibirAlerta('Sua cotação foi enviada com sucesso! Você será redirecionado para o WhatsApp.', 'success');
                            }
                            
                            // Liberar o processamento
                            window.processandoEnvio = false;
                        })
                        .catch(erro => {
                            console.error("Erro ao processar envio:", erro);
                            exibirAlerta('Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.', 'error');
                            window.processandoEnvio = false;
                        });
                } catch (error) {
                    console.error("Erro ao enviar para webhook:", error);
                    // Continuar mesmo com erro no webhook
                    processarEnvioFormulario(dados)
                        .then(sucesso => {
                            if (sucesso) {
                                enviarParaWhatsApp(dados);
                                exibirAlerta('Sua cotação foi enviada com sucesso! Você será redirecionado para o WhatsApp.', 'success');
                            }
                            window.processandoEnvio = false;
                        })
                        .catch(erro => {
                            console.error("Erro ao processar envio:", erro);
                            exibirAlerta('Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.', 'error');
                            window.processandoEnvio = false;
                        });
                }
            }, 500);
        } catch (error) {
            console.error("Erro ao processar envio:", error);
            exibirAlerta('Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.', 'error');
            window.processandoEnvio = false;
        }
    } else {
        window.processandoEnvio = false;
    }
    
    return false;
}

/**
 * Envia os dados do formulário de seguro auto para o webhook
 * @param {Object} dados - Dados do formulário
 */
function enviarSeguroParaWebhook(dados) {
    // URL do webhook para seguro auto
    const webhookUrl = "https://instwesley-n8n.r1negz.easypanel.host/webhook/lead-auto";
    
    console.log("Iniciando envio para webhook de seguro auto:", webhookUrl);
    
    // Criar cópia dos dados para não interferir com o objeto original
    const dadosWebhook = { ...dados };
    
    // Adicionar timestamp e origem
    dadosWebhook.timestamp = new Date().toISOString();
    dadosWebhook.origem_sistema = "site-seguro-auto";
    dadosWebhook.tipo_lead = "seguro-auto";
    
    console.log("Dados a serem enviados para webhook:", dadosWebhook);
    
    // Enviar dados para o webhook sem esperar resposta
    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(dadosWebhook)
    })
    .then(response => {
        console.log("Resposta recebida do webhook - Status:", response.status);
        if (!response.ok) {
            console.error("Erro no envio para webhook:", response.status, response.statusText);
        } else {
            console.log("Dados enviados com sucesso para o webhook");
        }
        return response.text();
    })
    .then(data => {
        console.log("Resposta completa do webhook:", data);
    })
    .catch(error => {
        console.error("Erro ao enviar para webhook:", error);
    });
}

//----------------------------------------------------------------------------
// Função auxiliar para garantir rolagem ao topo
function rolarParaTopo() {
    // Combinação de métodos para garantir compatibilidade com diferentes navegadores
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    window.scrollTo(0, 0);
    
    // Método alternativo
    try {
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'auto'
        });
    } catch (e) {
        // Fallback para navegadores que não suportam o método scroll com opções
        window.scrollTo(0, 0);
    }
    
    // Verificação adicional para garantir que a rolagem ocorreu
    if (window.pageYOffset > 0) {
        console.log("Tentativa adicional de rolagem");
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 50);
    }
}


//-----------------------------------------------------------------------------


// Função para coletar todos os dados do formulário
function coletarDadosFormulario() {
    const dados = {};
    
    // Dados do condutor
    dados.nomeCondutor = document.getElementById('nomeCondutor')?.value || '';
    dados.telefone = document.getElementById('telefoneCondutor')?.value || '';
    dados.cep = document.getElementById('cep')?.value || '';
    dados.tipoResidencia = document.querySelector('input[name="tipoResidencia"]:checked')?.value || '';
    dados.garagemResidencia = document.querySelector('input[name="garagemResidencia"]:checked')?.value || '';
    
    // Adicionar tipo de portão se garagem na residência for "Sim"
    if (dados.garagemResidencia === 'Sim') {
        dados.tipoPortao = document.querySelector('input[name="tipoPortao"]:checked')?.value || '';
    }
    
    dados.garagemEstudos = document.querySelector('input[name="garagemEstudos"]:checked')?.value || '';
    dados.garagemTrabalho = document.querySelector('input[name="garagemTrabalho"]:checked')?.value || '';
    dados.distancia = document.getElementById('distanciaTrabalho')?.value || '';
    dados.condutorJovem = document.querySelector('input[name="condutorJovem"]:checked')?.value || '';
    
    if (dados.condutorJovem === 'Sim') {
        dados.idadeCondutorJovem = document.getElementById('idadeCondutorJovem')?.value || '';
        dados.sexoCondutorJovem = document.querySelector('input[name="sexoCondutorJovem"]:checked')?.value || '';
    }
    
    dados.estadoCivil = document.getElementById('estadoCivil')?.value || '';
    dados.profissao = document.getElementById('profissao')?.value || '';
    dados.temFilhos = document.querySelector('input[name="temFilhos"]:checked')?.value || '';
    
    if (dados.temFilhos === 'Sim') {
        dados.idadeFilhos = document.getElementById('idadeFilhos')?.value || '';
    }
    
    // Dados do veículo
    dados.usoVeiculo = document.querySelector('input[name="usoVeiculo"]:checked')?.value || '';
    dados.marcaVeiculo = document.getElementById('marcaVeiculo')?.value || '';
    dados.modeloVeiculo = document.getElementById('modeloVeiculo')?.value || '';
    dados.anoVeiculo = document.getElementById('anoVeiculo')?.value || '';
    dados.combustivel = document.querySelector('input[name="combustivel"]:checked')?.value || '';
    dados.placaVeiculo = document.getElementById('placaVeiculo')?.value || '';
    dados.possuiBlindagem = document.querySelector('input[name="possuiBlindagem"]:checked')?.value || '';
    dados.possuiKitGas = document.querySelector('input[name="possuiKitGas"]:checked')?.value || '';
    
    // Dados do seguro
    dados.tipoSeguro = document.querySelector('input[name="tipoSeguro"]:checked')?.value || '';
    
    if (dados.tipoSeguro === 'Renovação') {
        dados.bonusAtual = document.getElementById('bonusAtual')?.value || '';
        dados.seguradoraAtual = document.getElementById('seguradoraAtual')?.value || '';
        dados.vigenciaAtual = document.getElementById('vigenciaAtual')?.value || '';
        dados.teveSinistro = document.querySelector('input[name="teveSinistro"]:checked')?.value || '';
    }
    
    return dados;
}
/* DESATIVA WHATSAPP NO FORM  DE VALIDACOES */

// Função para enviar dados para o WhatsApp
function enviarParaWhatsApp(dados) {
    // Formatar a mensagem para WhatsApp
    let mensagem = `*Nova Cotação de Seguro Auto*\n\n`;
    mensagem += `*Dados do Condutor:*\n`;
    mensagem += `Nome: ${dados.nomeCondutor}\n`;
    mensagem += `Telefone: ${dados.telefone}\n`;
    mensagem += `CEP: ${dados.cep}\n`;
    mensagem += `Tipo de Residência: ${dados.tipoResidencia}\n`;
    mensagem += `Garagem na Residência: ${dados.garagemResidencia}\n`;
    
    // Adicionar tipo de portão se garagem na residência for "Sim"
    if (dados.garagemResidencia === 'Sim') {
        mensagem += `Tipo de Portão: ${dados.tipoPortao}\n`;
    }
    
    mensagem += `Garagem no Local de Estudos: ${dados.garagemEstudos}\n`;
    mensagem += `Garagem no Local de Trabalho: ${dados.garagemTrabalho}\n`;
    mensagem += `Distância Percorrida: ${dados.distancia}\n`;
    mensagem += `Condutor Jovem: ${dados.condutorJovem}\n`;
    
    if (dados.condutorJovem === 'Sim') {
        mensagem += `Idade do Condutor Jovem: ${dados.idadeCondutorJovem}\n`;
        mensagem += `Sexo do Condutor Jovem: ${dados.sexoCondutorJovem}\n`;
    }
    
    mensagem += `Estado Civil: ${dados.estadoCivil}\n`;
    mensagem += `Profissão: ${dados.profissao}\n`;
    mensagem += `Tem Filhos: ${dados.temFilhos}\n`;
    
    if (dados.temFilhos === 'Sim') {
        mensagem += `Idade dos Filhos: ${dados.idadeFilhos}\n`;
    }
    
    mensagem += `\n*Dados do Veículo:*\n`;
    mensagem += `Uso: ${dados.usoVeiculo}\n`;
    mensagem += `Marca: ${dados.marcaVeiculo}\n`;
    mensagem += `Modelo: ${dados.modeloVeiculo}\n`;
    mensagem += `Ano: ${dados.anoVeiculo}\n`;
    mensagem += `Combustível: ${dados.combustivel}\n`;
    mensagem += `Placa: ${dados.placaVeiculo}\n`;
    mensagem += `Blindagem: ${dados.possuiBlindagem}\n`;
    mensagem += `Kit Gás: ${dados.possuiKitGas}\n`;
    
    mensagem += `\n*Dados do Seguro:*\n`;
    mensagem += `Tipo: ${dados.tipoSeguro}\n`;
    
    if (dados.tipoSeguro === 'Renovação') {
        mensagem += `Bônus Atual: ${dados.bonusAtual}\n`;
        mensagem += `Seguradora Atual: ${dados.seguradoraAtual}\n`;
        mensagem += `Vigência Atual: ${dados.vigenciaAtual}\n`;
        mensagem += `Teve Sinistro: ${dados.teveSinistro}\n`;
    }
    
    // Codificar a mensagem para URL
    const mensagemCodificada = encodeURIComponent(mensagem);
    
    // Número de telefone para enviar (substitua pelo número correto)
    const numeroWhatsApp = '556230153001';
    
    // Criar o link do WhatsApp
    const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;
    
    // Abrir o link em uma nova janela
    //window.open(linkWhatsApp, '_blank');
    window.location.href = linkWhatsApp;
    
}
    //FIM DESATIVA WHATSAPP NO FORM DE VALIDACOES
    // Enviar dados para o WhatsApp
/* */
//-------------------------------------------------------------------
// Remover todos os event listeners existentes do botão Enviar
document.addEventListener('DOMContentLoaded', function() {
    // ... código existente ...
    
    // Remover todos os event listeners existentes do botão Enviar
    const btnEnviar = document.querySelector('#seguroAutoEtapa2 .btn-primary:not(.btn-voltar)');
    if (btnEnviar) {
        // Clonar o botão para remover todos os event listeners
        const novoBtn = btnEnviar.cloneNode(true);
        btnEnviar.parentNode.replaceChild(novoBtn, btnEnviar);
        
        // Adicionar um único event listener
        novoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log("Botão Enviar clicado (novo listener)");
            return seguroAutoEtapa2();
        });
    }
    
    // Inicializar flags globais
    window.processandoEnvio = false;
    window.whatsappEnviado = false;
    window.whatsappAberto = false;
});

//------------------------------------------------------------------
// Funções auxiliares
function mostrarErro(id, mensagem) {
    const elemento = document.getElementById(id);
    if (!elemento) {
        // Criar elemento de erro se não existir
        const campo = document.getElementById(id.replace('Error', ''));
        let container;
        
        if (campo) {
            container = campo.closest('.form-group');
        } else {
            // Para radio buttons
            const radioName = id.replace('Error', '');
            const radioInput = document.querySelector(`input[name="${radioName}"]`);
            if (radioInput) {
                container = radioInput.closest('.form-group, .radio-group');
            }
        }
        
        if (container) {
            const errorElement = document.createElement('div');
            errorElement.id = id;
            errorElement.className = 'error-message';
            container.appendChild(errorElement);
            
            // Chamar a função novamente agora que o elemento existe
            mostrarErro(id, mensagem);
            return;
        }
    } else {
        elemento.textContent = mensagem;
        elemento.style.display = 'block';
        elemento.style.color = '#e74c3c';
        elemento.style.fontWeight = 'bold';
        elemento.style.marginTop = '5px';
        
        // Adiciona ícone de erro
        if (!elemento.querySelector('.error-icon')) {
            const icon = document.createElement('i');
            icon.className = 'fas fa-exclamation-circle error-icon';
            icon.style.marginRight = '5px';
            elemento.prepend(icon);
        }
        
        // Adiciona classe de animação para destacar o erro
        elemento.classList.add('erro-animado');
        setTimeout(() => {
            elemento.classList.remove('erro-animado');
        }, 500);
        
        // Adiciona borda vermelha ao campo relacionado
        const campo = document.getElementById(id.replace('Error', ''));
        if (campo) {
            campo.style.border = '2px solid #e74c3c';
        } else {
            // Para radio buttons, destacar o container
            const radioName = id.replace('Error', '');
            const radioContainer = document.querySelector(`input[name="${radioName}"]`)?.closest('.form-group, .radio-group');
            if (radioContainer) {
                radioContainer.classList.add('radio-error');
            }
        }
    }
}

function ocultarErro(id) {
    const elemento = document.getElementById(id);
    if (elemento) {
        elemento.style.display = 'none';
        
        // Remove borda vermelha do campo relacionado
        const campo = document.getElementById(id.replace('Error', ''));
        if (campo) {
            campo.style.border = '';
        } else {
            // Para radio buttons, remover destaque do container
            const radioName = id.replace('Error', '');
            const radioContainer = document.querySelector(`input[name="${radioName}"]`)?.closest('.form-group, .radio-group');
            if (radioContainer) {
                radioContainer.classList.remove('radio-error');
            }
        }
    }
}

function exibirAlerta(mensagem, tipo = 'error') {
    // Criar elemento de alerta
    const alerta = document.createElement('div');
    alerta.className = `alerta alerta-${tipo}`;
    alerta.innerHTML = `
        <div class="alerta-conteudo">
            <i class="fas ${tipo === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${mensagem}</span>
        </div>
        <button class="alerta-fechar">&times;</button>
    `;
    
    // Adicionar estilos
    alerta.style.position = 'fixed';
    alerta.style.top = '20px';
    alerta.style.left = '50%';
    alerta.style.transform = 'translateX(-50%)';
    alerta.style.backgroundColor = tipo === 'success' ? '#28a745' : '#e74c3c';
    alerta.style.color = 'white';
    alerta.style.padding = '15px 20px';
    alerta.style.borderRadius = '5px';
    alerta.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    alerta.style.zIndex = '9999';
    alerta.style.display = 'flex';
    alerta.style.alignItems = 'center';
    alerta.style.justifyContent = 'space-between';
    alerta.style.minWidth = '300px';
    alerta.style.maxWidth = '80%';
    
    // Adicionar ao corpo do documento
    document.body.appendChild(alerta);
    
    // Adicionar evento de clique para fechar o alerta
    const botaoFechar = alerta.querySelector('.alerta-fechar');
    if (botaoFechar) {
        botaoFechar.addEventListener('click', function() {
            document.body.removeChild(alerta);
        });
    }
    
    // Remover automaticamente após 5 segundos
    setTimeout(() => {
        if (document.body.contains(alerta)) {
            document.body.removeChild(alerta);
        }
    }, 5000);
}

function validarEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
}

function toggleRenovacaoInfo() {
    const tipoSeguro = document.querySelector('input[name="tipoSeguro"]:checked');
    const renovacaoInfoContainer = document.getElementById('renovacaoInfoContainer');
    
    if (renovacaoInfoContainer) {
        if (tipoSeguro && tipoSeguro.value === 'Renovação') {
            renovacaoInfoContainer.style.display = 'block';
        } else {
            renovacaoInfoContainer.style.display = 'none';
        }
    }
}

function toggleFilhosInfo() {
    const temFilhos = document.querySelector('input[name="temFilhos"]:checked');
    const filhosInfoContainer = document.getElementById('filhosInfoContainer');
    
    if (filhosInfoContainer) {
        if (temFilhos && temFilhos.value === 'Sim') {
            filhosInfoContainer.style.display = 'block';
        } else {
            filhosInfoContainer.style.display = 'none';
        }
    }
}

function toggleCondutorJovemInfo() {
    const condutorJovem = document.querySelector('input[name="condutorJovem"]:checked');
    const condutorJovemInfoContainer = document.getElementById('condutorJovemInfoContainer');
    
    if (condutorJovemInfoContainer) {
        if (condutorJovem && condutorJovem.value === 'Sim') {
            condutorJovemInfoContainer.style.display = 'block';
        } else {
            condutorJovemInfoContainer.style.display = 'none';
        }
    }
}

function toggleGaragemTipo() {
    const garagemResidencia = document.querySelector('input[name="garagemResidencia"]:checked');
    const tipoPortaoContainer = document.getElementById('tipoPortaoContainer');
    
    if (tipoPortaoContainer) {
        if (garagemResidencia && garagemResidencia.value === 'Sim') {
            tipoPortaoContainer.style.display = 'block';
        } else {
            tipoPortaoContainer.style.display = 'none';
            // Limpar seleção quando escondido
            const tipoPortaoRadios = document.querySelectorAll('input[name="tipoPortao"]');
            tipoPortaoRadios.forEach(radio => {
                radio.checked = false;
            });
            ocultarErro('tipoPortaoError');
        }
    }
}
//---------------------------------------------------------------------------
// Função para avançar para a segunda etapa

function seguroAutoEtapa1() {
    // Validar campos da primeira etapa
    if (validarEtapa1()) {
        // Forçar rolagem para o topo antes da transição
        forcarRolagemTopo();
        
        // Transição suave entre etapas
        document.getElementById('seguroAutoEtapa1').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('seguroAutoEtapa1').style.display = 'none';
            document.getElementById('seguroAutoEtapa2').style.display = 'block';
            
            // Forçar rolagem novamente após a mudança de display
            forcarRolagemTopo();
            
            setTimeout(() => {
                document.getElementById('seguroAutoEtapa2').style.opacity = '1';
                // Atualizar a barra de progresso
                document.getElementById('step1').classList.remove('active');
                document.getElementById('step1').classList.add('completed');
                document.getElementById('step2').classList.add('active');
                
                // Forçar rolagem uma terceira vez após a animação
                forcarRolagemTopo();
            }, 50);
        }, 300);
    }
}

// Nova função para forçar a rolagem para o topo de forma mais agressiva
function forcarRolagemTopo() {
    // Usar todos os métodos conhecidos para rolar para o topo
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    
    // Usar requestAnimationFrame para garantir que a rolagem ocorra no próximo frame de renderização
    requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    });
    
    // Adicionar um elemento temporário no topo e focar nele
    const tempElement = document.createElement('div');
    tempElement.style.position = 'absolute';
    tempElement.style.top = '0';
    tempElement.style.left = '0';
    tempElement.style.width = '1px';
    tempElement.style.height = '1px';
    tempElement.style.opacity = '0';
    tempElement.tabIndex = -1; // Para poder receber foco
    
    document.body.prepend(tempElement);
    tempElement.focus();
    
    // Remover o elemento após um curto período
    setTimeout(() => {
        if (document.body.contains(tempElement)) {
            document.body.removeChild(tempElement);
        }
    }, 100);
    
    console.log("Rolagem forçada executada");
}

// Adicionar ao final do evento DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // ... código existente ...
    
    // Garantir que a página comece no topo
    forcarRolagemTopo();
    
    // Adicionar evento de hash change para garantir rolagem ao topo quando mudar de etapa via URL
    window.addEventListener('hashchange', function() {
        forcarRolagemTopo();
    });
});
//------------------------------------------------------------------------
// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar CSS para transições suaves
    const style = document.createElement('style');
    style.textContent = `
        #seguroAutoEtapa1, #seguroAutoEtapa2 {
            transition: opacity 0.3s ease;
        }
        #seguroAutoEtapa2 {
            opacity: 0;
            display: none;
        }
        .erro-animado {
            animation: shake 0.5s;
        }
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .progress-bar {
            display: flex;
            margin-bottom: 20px;
            justify-content: space-between;
            position: relative;
        }
        .progress-bar::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 2px;
            background-color: #ddd;
            transform: translateY(-50%);
            z-index: 1;
        }
        .progress-step {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-color: #ddd;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            z-index: 2;
        }
        .progress-step.active {
            background-color: #007bff;
            color: white;
        }
        .progress-step.completed {
            background-color: #28a745;
            color: white;
        }
        .btn-voltar {
            margin-right: 10px;
            background-color: #6c757d;
        }
        .error-message {
            color: #e74c3c;
            font-weight: bold;
            margin-top: 5px;
            display: none;
        }
        .radio-error {
            border: 2px solid #e74c3c;
            padding: 5px;
            border-radius: 5px;
        }
        .alerta {
            animation: fadeIn 0.3s;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translate(-50%, -20px); }
            to { opacity: 1; transform: translate(-50%, 0); }
        }
        .alerta-conteudo {
            display: flex;
            align-items: center;
        }
        .alerta-conteudo i {
            margin-right: 10px;
            font-size: 1.2em;
        }
        .alerta-fechar {
            background: none;
            border: none;
            color: white;
            font-size: 1.5em;
            cursor: pointer;
            margin-left: 15px;
        }
    `;
    document.head.appendChild(style);
    
    // Adicionar barra de progresso
    const form = document.getElementById('seguroAutoForm');
    if (form) {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.innerHTML = `
            <div class="progress-step active" id="step1">1</div>
            <div class="progress-step" id="step2">2</div>
        `;
        form.insertBefore(progressBar, form.firstChild);
    }
    
    // Adicionar botão voltar na segunda etapa
    const btnContainer = document.querySelector('#seguroAutoEtapa2 .text-center');
    if (btnContainer) {
        const voltarBtn = document.createElement('button');
        voltarBtn.type = 'button';
        voltarBtn.className = 'btn-primary btn-voltar';
        voltarBtn.innerHTML = '<i class="fas fa-arrow-left"></i> Voltar';
        voltarBtn.onclick = voltarParaEtapa1;
        btnContainer.insertBefore(voltarBtn, btnContainer.firstChild);
    }
    
    // Inicializar campos condicionais
    toggleRenovacaoInfo();
    toggleFilhosInfo();
    toggleCondutorJovemInfo();
    toggleGaragemTipo();
    // Inicializar campo de tipo de portão
    
    // Adicionar listeners para os radio buttons
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            // Limpar mensagem de erro quando uma opção é selecionada
            const errorId = this.name + 'Error';
            ocultarErro(errorId);
            
            // Atualizar campos condicionais
            if (this.name === 'temFilhos') {
                toggleFilhosInfo();
            } else if (this.name === 'tipoSeguro') {
                toggleRenovacaoInfo();
            } else if (this.name === 'condutorJovem') {
                toggleCondutorJovemInfo();
            } else if (this.name === 'garagemResidencia') {
                toggleGaragemTipo();
            }
        });
    });
    
    // Adicionar evento de clique ao botão Avançar
    const btnAvancar = document.querySelector('#seguroAutoEtapa1 button');
    if (btnAvancar) {
        btnAvancar.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("Botão Avançar clicado");
            seguroAutoEtapa1();
        });
    } else {
        console.error('Botão Avançar não encontrado');
    }
//------------------------------------------------------------------------

// Função para avançar para a segunda etapa
function seguroAutoEtapa1() {
    // Validar campos da primeira etapa
    if (validarEtapa1()) {
        // Transição suave entre etapas
        document.getElementById('seguroAutoEtapa1').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('seguroAutoEtapa1').style.display = 'none';
            document.getElementById('seguroAutoEtapa2').style.display = 'block';
            setTimeout(() => {
                document.getElementById('seguroAutoEtapa2').style.opacity = '1';
                // Atualizar a barra de progresso
                document.getElementById('step1').classList.remove('active');
                document.getElementById('step1').classList.add('completed');
                document.getElementById('step2').classList.add('active');
                // Rolar para o topo da página
                window.scrollTo(0, 0);
            }, 50);
        }, 300);
    }
}
//----------------------------------------------------------------------
    // Adicionar evento de clique ao botão Enviar
    const btnEnviar = document.querySelector('#seguroAutoEtapa2 .btn-primary:not(.btn-voltar)');
    if (btnEnviar) {
        btnEnviar.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("Botão Enviar clicado");
            seguroAutoEtapa2();
        });
    } else {
        console.error('Botão Enviar não encontrado');
    }
    
    // Criar elementos de erro para os campos obrigatórios
    criarElementosErro();
    
    // Adicionar validação em tempo real para os campos de texto
    const camposTexto = document.querySelectorAll('input[type="text"], input[type="number"], input[type="email"], select, textarea');
    camposTexto.forEach(campo => {
        campo.addEventListener('blur', function() {
            validarCampo(this);
        });
        
        campo.addEventListener('input', function() {
            // Remover mensagem de erro quando o usuário começa a digitar
            const errorId = this.id + 'Error';
            ocultarErro(errorId);
        });
    });
});

// Função para criar elementos de erro para todos os campos obrigatórios
function criarElementosErro() {
    // Lista de IDs de campos obrigatórios
    const camposObrigatorios = [
        'nomeCondutor', 'telefoneCondutor', 'cep', 'distanciaTrabalho', 'estadoCivil', 'profissao',
        'marcaVeiculo', 'modeloVeiculo', 'anoVeiculo', 'placaVeiculo'
    ];
    
    // Lista de nomes de grupos de radio buttons obrigatórios
    const radioGroups = [
        'tipoResidencia', 'garagemResidencia', 'tipoPortao', 'garagemEstudos', 'garagemTrabalho',
        'condutorJovem', 'sexoCondutorJovem', 'temFilhos', 'usoVeiculo',
        'combustivel', 'possuiBlindagem', 'possuiKitGas', 'tipoSeguro', 'teveSinistro'
    ];
    
    // Criar elementos de erro para campos de texto
    camposObrigatorios.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) {
            const errorId = id + 'Error';
            if (!document.getElementById(errorId)) {
                const container = campo.closest('.form-group');
                if (container) {
                    const errorElement = document.createElement('div');
                    errorElement.id = errorId;
                    errorElement.className = 'error-message';
                    container.appendChild(errorElement);
                }
            }
        }
    });
    
    // Criar elementos de erro para radio buttons
    radioGroups.forEach(name => {
        const errorId = name + 'Error';
        if (!document.getElementById(errorId)) {
            const radioInput = document.querySelector(`input[name="${name}"]`);
            if (radioInput) {
                const container = radioInput.closest('.form-group, .radio-group');
                if (container) {
                    const errorElement = document.createElement('div');
                    errorElement.id = errorId;
                    errorElement.className = 'error-message';
                    container.appendChild(errorElement);
                }
            }
        }
    });
}

// Função para validar um campo específico
function validarCampo(campo) {
    const id = campo.id;
    const errorId = id + 'Error';
    
    // Validar com base no tipo de campo
    if (campo.type === 'text' || campo.type === 'email' || campo.tagName.toLowerCase() === 'textarea') {
        if (!campo.value.trim()) {
            mostrarErro(errorId, 'Este campo é obrigatório');
            return false;
        } else if (campo.type === 'email' && !validarEmail(campo.value)) {
            mostrarErro(errorId, 'Por favor, informe um e-mail válido');
            return false;
        }
    } else if (campo.type === 'number') {
        if (!campo.value) {
            mostrarErro(errorId, 'Este campo é obrigatório');
            return false;
        } else if (id === 'idadeCondutorJovem' && (campo.value < 18 || campo.value > 25)) {
            mostrarErro(errorId, 'A idade deve ser entre 18 e 25 anos');
            return false;
        }
    } else if (campo.tagName.toLowerCase() === 'select') {
        if (!campo.value) {
            mostrarErro(errorId, 'Por favor, selecione uma opção');
            return false;
        }
    }
    
    ocultarErro(errorId);
    return true;
}
