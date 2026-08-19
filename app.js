document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. Configurações e Elementos de Interface
  // ==========================================================================
  const form = document.getElementById('anamnese-form');
  const sections = document.querySelectorAll('.form-section');
  const stepperItems = document.querySelectorAll('.step-item');
  const progressBarFill = document.getElementById('progress-bar-fill');
  const formIntro = document.getElementById('form-intro');
  const navActions = document.getElementById('nav-actions');
  
  const btnPrev = document.getElementById('btn-prev');
  const btnSaveContinue = document.getElementById('btn-save-continue');
  const btnNext = document.getElementById('btn-next');
  
  const themeToggle = document.getElementById('theme-toggle');
  
  let currentStep = 1;
  const totalSteps = 6;
  let myChart = null; // Variável para guardar o objeto Chart.js

  // Carregar dados salvos, se existirem
  const saved = localStorage.getItem('anamneseData');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.step) currentStep = parsed.step;
      if (parsed.fields) {
        for (const [key, value] of Object.entries(parsed.fields)) {
          const field = document.querySelector(`[name="${key}"]`);
          if (field) {
            if (field.type === 'radio' || field.type === 'checkbox') {
              const option = document.querySelector(`[name="${key}"][value="${value}"]`);
              if (option) option.checked = true;
            } else {
              field.value = value;
            }
          }
        }
      }
    } catch (e) {}
  }

  // ==========================================================================
  // 2. Renderização Dinâmica de Opções de Escala (0 a 4)
  // ==========================================================================
  const scaleContainers = document.querySelectorAll('.scale-options');

  // Function to save current form state and step to localStorage
  function saveData() {
    const data = {
      step: currentStep,
      fields: {}
    };
    // Gather all input, select, textarea values
    const elements = form.querySelectorAll('input, select, textarea');
    elements.forEach(el => {
      if (el.type === 'checkbox' || el.type === 'radio') {
        if (el.checked) data.fields[el.name] = el.value;
      } else {
        data.fields[el.name] = el.value;
      }
    });
    localStorage.setItem('anamneseData', JSON.stringify(data));
  }

  // Save on any change within the form
  form.addEventListener('change', saveData);
  form.addEventListener('input', saveData);

  // Also save before unloading the page
  window.addEventListener('beforeunload', saveData);

  // ==========================================================================
  // 2. Renderização Dinâmica de Opções de Escala (0 a 4)
  // ==========================================================================
  const scaleContainers = document.querySelectorAll('.scale-options');
  scaleContainers.forEach(container => {
    const groupName = container.getAttribute('data-group');
    let optionsHtml = '';
    for (let val = 0; val <= 4; val++) {
      const isRequired = val === 0 ? 'required' : '';
      optionsHtml += `
        <div class="scale-option">
          <input type="radio" id="${groupName}_${val}" name="${groupName}" value="${val}" ${isRequired}>
          <label for="${groupName}_${val}">${val}</label>
        </div>
      `;
    }
    container.innerHTML = optionsHtml;
  });

  // ==========================================================================
  // 3. Gerenciamento do Tema Escuro/Claro
  // ==========================================================================
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });

  // ==========================================================================
  // 4. Lógica de Inputs Condicionais (Opção "Outro")
  // ==========================================================================
  const checkboxInfanciaOutro = document.querySelector('input[name="infancia"][value="Outro"]');
  const containerInfanciaOutro = document.getElementById('infancia-outro-container');
  const inputInfanciaOutro = document.getElementById('infancia-outro');

  const checkboxFamiliarOutro = document.querySelector('input[name="familiar"][value="Outro"]');
  const containerFamiliarOutro = document.getElementById('familiar-outro-container');
  const inputFamiliarOutro = document.getElementById('familiar-outro');

  checkboxInfanciaOutro.addEventListener('change', () => {
    if (checkboxInfanciaOutro.checked) {
      containerInfanciaOutro.classList.add('active');
      inputInfanciaOutro.setAttribute('required', 'true');
    } else {
      containerInfanciaOutro.classList.remove('active');
      inputInfanciaOutro.removeAttribute('required');
      inputInfanciaOutro.value = '';
    }
  });

  checkboxFamiliarOutro.addEventListener('change', () => {
    if (checkboxFamiliarOutro.checked) {
      containerFamiliarOutro.classList.add('active');
      inputFamiliarOutro.setAttribute('required', 'true');
    } else {
      containerFamiliarOutro.classList.remove('active');
      inputFamiliarOutro.removeAttribute('required');
      inputFamiliarOutro.value = '';
    }
  });

  // Limpeza de erros ao clicar em opções de escala
  document.querySelectorAll('.scale-options').forEach(group => {
    group.addEventListener('change', () => {
      const questionItem = group.closest('.scale-question-item');
      if (questionItem) {
        questionItem.classList.remove('invalid');
      }
    });
  });

  // ==========================================================================
  // 5. Validação por Etapa
  // ==========================================================================
  function validateStep(step) {
    let isValid = true;

    if (step === 1) {
      const requiredInputs = sections[0].querySelectorAll('input[required], select[required]');
      requiredInputs.forEach(input => {
        const formGroup = input.closest('.form-group');
        if (!input.value.trim()) {
          formGroup.classList.add('invalid');
          isValid = false;
        } else {
          formGroup.classList.remove('invalid');
        }
      });
      
      // Validação específica para idade
      const idadeInput = document.getElementById('idade');
      if (idadeInput.value) {
        const val = parseInt(idadeInput.value, 10);
        if (isNaN(val) || val < 18 || val > 120) {
          idadeInput.closest('.form-group').classList.add('invalid');
          isValid = false;
        }
      }
    } 
    else if (step === 2) {
      // Valida checkboxes do Histórico Infantil
      const infanciaCheckboxes = sections[1].querySelectorAll('input[name="infancia"]');
      const infanciaGroup = infanciaCheckboxes[0].closest('.form-group');
      const anyInfanciaChecked = Array.from(infanciaCheckboxes).some(cb => cb.checked);
      
      if (!anyInfanciaChecked) {
        infanciaGroup.classList.add('invalid');
        isValid = false;
      } else {
        infanciaGroup.classList.remove('invalid');
        
        // Se "Outro" está ativo, valida o campo de texto descritivo
        if (checkboxInfanciaOutro.checked && !inputInfanciaOutro.value.trim()) {
          inputInfanciaOutro.closest('.form-group').classList.add('invalid');
          isValid = false;
        } else {
          inputInfanciaOutro.closest('.form-group').classList.remove('invalid');
        }
      }

      // Valida checkboxes do Histórico Familiar
      const familiarCheckboxes = sections[1].querySelectorAll('input[name="familiar"]');
      const familiarGroup = familiarCheckboxes[0].closest('.form-group');
      const anyFamiliarChecked = Array.from(familiarCheckboxes).some(cb => cb.checked);
      
      if (!anyFamiliarChecked) {
        familiarGroup.classList.add('invalid');
        isValid = false;
      } else {
        familiarGroup.classList.remove('invalid');

        // Se "Outro" está ativo, valida o campo de texto descritivo
        if (checkboxFamiliarOutro.checked && !inputFamiliarOutro.value.trim()) {
          inputFamiliarOutro.closest('.form-group').classList.add('invalid');
          isValid = false;
        } else {
          inputFamiliarOutro.closest('.form-group').classList.remove('invalid');
        }
      }
    } 
    else if (step >= 3 && step <= 5) {
      // Valida escalas lineares da seção atual
      const activeSection = sections[step - 1];
      const scaleGroups = activeSection.querySelectorAll('.scale-options');
      let firstInvalidItem = null;

      scaleGroups.forEach(group => {
        const groupName = group.getAttribute('data-group');
        const selected = activeSection.querySelector(`input[name="${groupName}"]:checked`);
        const questionItem = group.closest('.scale-question-item');
        
        if (!selected) {
          questionItem.classList.add('invalid');
          isValid = false;
          if (!firstInvalidItem) {
            firstInvalidItem = questionItem;
          }
        } else {
          questionItem.classList.remove('invalid');
        }
      });

      // Se houver algum item inválido, rola suavemente até ele
      if (firstInvalidItem) {
        firstInvalidItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    return isValid;
  }

  // ==========================================================================
  // 6. Controle de Navegação Multi-etapas
  // ==========================================================================
  function showStep(step) {
  // 1. Atualizar visibilidade das seções
  sections.forEach((sec, idx) => {
    if (idx === step - 1) {
      sec.classList.add('active');
    } else {
      sec.classList.remove('active');
    }
  });

  // 2. Atualizar estado visual do stepper
  stepperItems.forEach((item, idx) => {
    const stepNum = idx + 1;
    item.classList.remove('active', 'completed');
    if (stepNum === step) {
      item.classList.add('active');
    } else if (stepNum < step) {
      item.classList.add('completed');
    }
  });

  // 3. Atualizar barra de progresso (stepper)
  const progressPercent = ((step - 1) / (totalSteps - 1)) * 100;
  progressBarFill.style.width = `${progressPercent}%`;

  // 4. Atualizar barra de progresso superior (exibe % concluído dos passos de perguntas)
  const topProgressPercent = ((step - 1) / (totalSteps - 2)) * 100; // totalSteps includes results step
  const topBarFill = document.getElementById('progress-bar-top-fill');
  if (topBarFill) {
    topBarFill.style.width = `${topProgressPercent}%`;
  }

  // 5. Mostrar/Ocultar descrição geral da anamnese
  if (step === totalSteps) {
    formIntro.classList.add('hidden');
    navActions.classList.add('hidden');
  } else {
    formIntro.classList.remove('hidden');
    navActions.classList.remove('hidden');
    // Controlar exibição do botão Voltar
    if (step === 1) {
      btnPrev.classList.add('hidden');
    } else {
      btnPrev.classList.remove('hidden');
    }
    // Alterar texto do botão de avanço no último passo de perguntas
    if (step === totalSteps - 1) {
      btnNext.innerHTML = `
        Enviar Respostas
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:16px;height:16px;">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      `;
    } else {
      btnNext.innerHTML = `
        Avançar
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="nav-arrow">
          <line x1="5" y1="12" x2="19" y2="12"/>
          <polyline points="12 5 19 12 12 19"/>
        </svg>
      `;
    }
  }

  // Rola de volta para o topo do formulário
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
    // 1. Atualizar visibilidade das seções
    sections.forEach((sec, idx) => {
      if (idx === step - 1) {
        sec.classList.add('active');
      } else {
        sec.classList.remove('active');
      }
    });

    // 2. Atualizar estado visual do stepper
    stepperItems.forEach((item, idx) => {
      const stepNum = idx + 1;
      item.classList.remove('active', 'completed');
      if (stepNum === step) {
        item.classList.add('active');
      } else if (stepNum < step) {
        item.classList.add('completed');
      }
    });

    // 3. Atualizar barra de progresso (0% a 100%)
    const progressPercent = ((step - 1) / (totalSteps - 1)) * 100;
    progressBarFill.style.width = `${progressPercent}%`;

    // 4. Mostrar/Ocultar descrição geral da anamnese
    if (step === totalSteps) {
      formIntro.classList.add('hidden');
      navActions.classList.add('hidden');
    } else {
      formIntro.classList.remove('hidden');
      navActions.classList.remove('hidden');
      
      // Controlar exibição do botão Voltar
      if (step === 1) {
        btnPrev.classList.add('hidden');
      } else {
        btnPrev.classList.remove('hidden');
      }

      // Alterar texto do botão de avanço no último passo de perguntas
      if (step === totalSteps - 1) {
        btnNext.innerHTML = `
          Enviar Respostas
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:16px;height:16px;">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        `;
      } else {
        btnNext.innerHTML = `
          Avançar
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="nav-arrow">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        `;
      }
    }

    // Rola de volta para o topo do formulário
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  btnNext.addEventListener('click', () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps - 1) {
        currentStep++;
        showStep(currentStep);
      } else {
        // Envio do formulário -> Ir para seção de resultados
        currentStep++;
        calculateAndShowResults();
      }
    }
  });

  btnPrev.addEventListener('click', () => {
    if (currentStep > 1) {
      currentStep--;
      showStep(currentStep);
    }
  });

  // ==========================================================================
  // 7. Cálculos, Relatórios e Visualização Gráfica
  // ==========================================================================
  function calculateAndShowResults() {
    // 1. Extração dos Dados Pessoais
    const nome = document.getElementById('nome').value;
    const idade = document.getElementById('idade').value;
    const genero = document.getElementById('genero').value;
    const profissao = document.getElementById('profissao').value;
    const estadoCivil = document.getElementById('estado-civil').value;

    document.getElementById('res-nome').innerText = nome;
    document.getElementById('res-idade').innerText = idade;
    document.getElementById('res-genero').innerText = genero;
    document.getElementById('res-profissao').innerText = profissao;
    document.getElementById('res-estado-civil').innerText = estadoCivil;

    // 2. Extração de Histórico
    const infanciaSelected = Array.from(document.querySelectorAll('input[name="infancia"]:checked'))
      .map(cb => {
        if (cb.value === 'Outro') {
          return `Outro: ${inputInfanciaOutro.value}`;
        }
        return cb.value;
      });
    
    const familiarSelected = Array.from(document.querySelectorAll('input[name="familiar"]:checked'))
      .map(cb => {
        if (cb.value === 'Outro') {
          return `Outro: ${inputFamiliarOutro.value}`;
        }
        return cb.value;
      });

    const listInfancia = document.getElementById('res-infancia-list');
    listInfancia.innerHTML = infanciaSelected.map(val => `<li>${val}</li>`).join('');

    const listFamiliar = document.getElementById('res-familiar-list');
    listFamiliar.innerHTML = familiarSelected.map(val => `<li>${val}</li>`).join('');

    // 3. Cálculo de Pontuações
    // TDAH: 8 perguntas (máx 32)
    let scoreTdah = 0;
    for (let i = 1; i <= 8; i++) {
      const radio = document.querySelector(`input[name="tdah_${i}"]:checked`);
      scoreTdah += radio ? parseInt(radio.value, 10) : 0;
    }

    // TEA: 8 perguntas (máx 32)
    let scoreTea = 0;
    for (let i = 1; i <= 8; i++) {
      const radio = document.querySelector(`input[name="tea_${i}"]:checked`);
      scoreTea += radio ? parseInt(radio.value, 10) : 0;
    }

    // Altas Habilidades: 8 perguntas (máx 8)
    let scoreAh = 0;
    for (let i = 1; i <= 8; i++) {
      const radio = document.querySelector(`input[name="ah_${i}"]:checked`);
      scoreAh += radio ? parseInt(radio.value, 10) : 0;
    }

    // Atualização dos badges de pontuação
    document.getElementById('badge-tdah').innerText = `${scoreTdah} / 32`;
    document.getElementById('badge-tea').innerText = `${scoreTea} / 32`;
    document.getElementById('badge-ah').innerText = `${scoreAh} / 8`;

    // Atualização visual das barras de progresso pequenas
    const percentTdah = (scoreTdah / 32) * 100;
    const percentTea = (scoreTea / 32) * 100;
    const percentAh = (scoreAh / 8) * 100;

    document.getElementById('bar-tdah').style.width = `${percentTdah}%`;
    document.getElementById('bar-tea').style.width = `${percentTea}%`;
    document.getElementById('bar-ah').style.width = `${percentAh}%`;

    // 4. Análise Descritiva Qualitativa
    let descTdah = "";
    if (scoreTdah >= 20) {
      descTdah = "<strong>Indicativo Alto:</strong> Há traços clínicos de desatenção e hiperatividade muito marcantes. Recomenda-se encaminhamento para investigação clínica neuropsicológica completa.";
    } else if (scoreTdah >= 12) {
      descTdah = "<strong>Indicativo Moderado:</strong> Presença de alguns comportamentos de desatenção ou agitação interna que podem gerar impacto moderado na rotina diária.";
    } else {
      descTdah = "<strong>Indicativo Baixo:</strong> Comportamentos de atenção e controle inibitório dentro da média adaptativa normotípica.";
    }
    document.getElementById('analysis-tdah').innerHTML = descTdah;

    let descTea = "";
    if (scoreTea >= 20) {
      descTea = "<strong>Indicativo Alto:</strong> Dificuldades substanciais na comunicação recíproca, interpretação literal e rigidez cognitiva/sensorial. Indicado acompanhamento especializado.";
    } else if (scoreTea >= 12) {
      descTea = "<strong>Indicativo Moderado:</strong> Apresenta características sociais, de comunicação ou interesses focados de intensidade média. Pode indicar Fenótipo Ampliado do Autismo (BAP).";
    } else {
      descTea = "<strong>Indicativo Baixo:</strong> Funcionamento social e integração sensorial adaptativos dentro dos padrões típicos.";
    }
    document.getElementById('analysis-tea').innerHTML = descTea;

    let descAh = "";
    if (scoreAh >= 6) {
      descAh = "<strong>Indicativo Alto:</strong> Rápido ritmo de processamento e aquisição cognitiva de novos conceitos, aliado a forte curiosidade existencial/intelectual. Traços de AH/SD.";
    } else if (scoreAh >= 4) {
      descAh = "<strong>Indicativo Moderado:</strong> Curiosidade e facilidade intelectual elevadas. Pode ser benéfico investigar potencial de enriquecimento curricular.";
    } else {
      descAh = "<strong>Indicativo Baixo:</strong> Curiosidade e ritmo de aprendizado comuns aos padrões adaptativos de desenvolvimento.";
    }
    document.getElementById('analysis-ah').innerHTML = descAh;

    // Mostrar seção de resultados
    showStep(totalSteps);

    // 5. Renderização do Gráfico Radar (com Chart.js)
    renderChart(percentTdah, percentTea, percentAh);
  }

  function renderChart(pctTdah, pctTea, pctAh) {
    const ctx = document.getElementById('profileChart').getContext('2d');
    
    // Destrói gráfico antigo se existir para evitar sobreposições
    if (myChart) {
      myChart.destroy();
    }

    // Estilo adaptativo do tema
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#f3f4f6' : '#0f172a';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.1)';
    const angleColor = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(15, 23, 42, 0.2)';

    myChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Triagem TDAH (%)', 'Triagem TEA (%)', 'Altas Habilidades (%)'],
        datasets: [{
          label: 'Perfil de Triagem Neurocognitiva',
          data: [pctTdah, pctTea, pctAh],
          backgroundColor: isDark ? 'rgba(139, 92, 246, 0.25)' : 'rgba(124, 58, 237, 0.2)',
          borderColor: '#8b5cf6',
          borderWidth: 3,
          pointBackgroundColor: '#06b6d4',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.label}: ${context.raw.toFixed(1)}%`;
              }
            }
          }
        },
        scales: {
          r: {
            angleLines: {
              color: angleColor
            },
            grid: {
              color: gridColor
            },
            pointLabels: {
              color: textColor,
              font: {
                family: "'Plus Jakarta Sans', sans-serif",
                size: 12,
                weight: '700'
              }
            },
            ticks: {
              backdropColor: 'transparent',
              color: isDark ? '#9ca3af' : '#64748b',
              stepSize: 20,
              font: {
                size: 9
              }
            },
            suggestedMin: 0,
            suggestedMax: 100
          }
        }
      }
    });
  }

  // ==========================================================================
  // 8. Botões de Ação do Painel Final
  // ==========================================================================
  
  // Impressão / Salvar como PDF
  document.getElementById('btn-print').addEventListener('click', () => {
    window.print();
  });

  // Exportação das respostas em JSON
  document.getElementById('btn-export-json').addEventListener('click', () => {
    // Coleta todas as respostas do formulário
    const formData = new FormData(form);
    const responses = {};

    // Dados pessoais
    responses.dadosPessoais = {
      nome: formData.get('nome'),
      idade: formData.get('idade'),
      genero: formData.get('genero'),
      profissao: formData.get('profissao'),
      estadoCivil: formData.get('estado-civil'),
    };

    // Histórico de infância e família
    responses.historicoInfancia = formData.getAll('infancia');
    if (responses.historicoInfancia.includes('Outro')) {
      responses.historicoInfanciaOutro = formData.get('infancia_outro');
    }
    
    responses.historicoFamiliar = formData.getAll('familiar');
    if (responses.historicoFamiliar.includes('Outro')) {
      responses.historicoFamiliarOutro = formData.get('familiar_outro');
    }

    // Escalas de triagem TDAH
    responses.triagemTdah = {};
    let sumTdah = 0;
    for (let i = 1; i <= 8; i++) {
      const val = parseInt(formData.get(`tdah_${i}`), 10);
      responses.triagemTdah[`pergunta_${i}`] = val;
      sumTdah += val;
    }
    responses.scoreTdah = `${sumTdah} / 32`;

    // Escalas de triagem TEA
    responses.triagemTea = {};
    let sumTea = 0;
    for (let i = 1; i <= 8; i++) {
      const val = parseInt(formData.get(`tea_${i}`), 10);
      responses.triagemTea[`pergunta_${i}`] = val;
      sumTea += val;
    }
    responses.scoreTea = `${sumTea} / 32`;

    // Escalas de triagem Altas Habilidades
    responses.triagemAltasHabilidades = {};
    let sumAh = 0;
    for (let i = 1; i <= 8; i++) {
      const val = parseInt(formData.get(`ah_${i}`), 10);
      responses.triagemAltasHabilidades[`pergunta_${i}`] = val;
      sumAh += val;
    }
    responses.scoreAltasHabilidades = `${sumAh} / 8`;

    // Metadados
    responses.dataAvaliacao = new Date().toISOString();
    responses.instrumento = "Anamnese Neurocognitiva para Adultos – Triagem TEA, TDAH e Altas Habilidades";

    // Geração do arquivo JSON para download
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(responses, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    
    // Nome do arquivo com nome do paciente
    const safeName = responses.dadosPessoais.nome.trim().replace(/[^a-zA-Z0-9]/g, "_");
    downloadAnchor.setAttribute("download", `Anamnese_Neurocognitiva_${safeName}.json`);
    
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  });

  // Reiniciar formulário
  document.getElementById('btn-reset').addEventListener('click', () => {
    if (confirm('Tem certeza de que deseja limpar todas as respostas e reiniciar o formulário?')) {
      form.reset();
      
      // Ocultar inputs condicionalizados
      containerInfanciaOutro.classList.remove('active');
      containerFamiliarOutro.classList.remove('active');
      inputInfanciaOutro.removeAttribute('required');
      inputFamiliarOutro.removeAttribute('required');

      // Limpar marcações de invalidez
      document.querySelectorAll('.form-group, .scale-question-item').forEach(el => {
        el.classList.remove('invalid');
      });

      // Reiniciar passo
      currentStep = 1;
      showStep(currentStep);
    }
  });

});
