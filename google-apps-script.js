/**
 * Script para criação automatizada do Google Form de Anamnese Neurocognitiva.
 * 
 * Como usar:
 * 1. Acesse o Google Drive (drive.google.com) ou Google Forms (forms.google.com).
 * 2. Crie um novo script em script.google.com (ou abra uma planilha e vá em Extensões > Apps Script).
 * 3. Substitua todo o código do editor por este script.
 * 4. Salve o projeto (Ctrl + S) e clique em "Executar" na função `createNeurocognitiveAnamnesisForm`.
 * 5. Conceda as permissões necessárias para o script criar o arquivo no seu Drive.
 * 6. Visualize o link gerado no "Registro de Execução" (Execution Log).
 */

function createNeurocognitiveAnamnesisForm() {
  // Cria o formulário com o título especificado
  var form = FormApp.create('Anamnese Neurocognitiva para Adultos – Triagem TEA, TDAH e Altas Habilidades');
  
  // Define a descrição geral
  form.setDescription('Este formulário tem como objetivo coletar informações sobre seu funcionamento cognitivo, emocional e comportamental. As respostas são confidenciais e ajudarão no planejamento do seu acompanhamento terapêutico.');
  
  // Habilita a coleta de respostas mas sem exigir login obrigatoriamente (pode ser ajustado)
  form.setAllowResponseEdits(false);
  form.setAcceptingResponses(true);
  
  // ==========================================
  // SEÇÃO 1: Dados Pessoais
  // ==========================================
  form.addSectionHeaderItem()
      .setTitle('SEÇÃO 1: Dados Pessoais')
      .setHelpText('Por favor, preencha suas informações de identificação.');
  
  form.addTextItem()
      .setTitle('Nome completo')
      .setRequired(true);
      
  form.addTextItem()
      .setTitle('Idade')
      .setRequired(true);
      
  form.addMultipleChoiceItem()
      .setTitle('Gênero')
      .setChoiceValues(['Masculino', 'Feminino', 'Não binário', 'Outro / Prefiro não informar'])
      .setRequired(true);
      
  form.addTextItem()
      .setTitle('Profissão / Ocupação atual')
      .setRequired(true);
      
  form.addTextItem()
      .setTitle('Estado civil')
      .setRequired(true);
      
  // ==========================================
  // SEÇÃO 2: Histórico Desenvolvimental
  // ==========================================
  form.addPageBreakItem()
      .setTitle('SEÇÃO 2: Histórico Desenvolvimental')
      .setHelpText('Informações sobre sua infância e histórico familiar.');
      
  form.addCheckboxItem()
      .setTitle('Você se lembra ou foi relatado que teve alguma das seguintes características na infância?')
      .setChoiceValues([
        'Fala ou leitura muito precoce',
        'Atraso na fala',
        'Interesses intensos e restritos',
        'Dificuldade em brincadeiras sociais ou imaginativas',
        'Sensibilidade extrema a sons/luzes/texturas',
        'Memória excelente para fatos',
        'Outro'
      ])
      .setRequired(true);
      
  form.addCheckboxItem()
      .setTitle('Histórico familiar')
      .setChoiceValues([
        'TEA/Autismo',
        'TDAH',
        'Altas Habilidades/Superdotação',
        'Ansiedade ou Depressão',
        'Outro'
      ])
      .setRequired(true);
      
  // ==========================================
  // SEÇÃO 3: Triagem TDAH
  // ==========================================
  form.addPageBreakItem()
      .setTitle('SEÇÃO 3: Triagem TDAH')
      .setHelpText('Instrução: Responda as perguntas a seguir usando a escala de 0 a 4 (0 = Nunca | 1 = Raramente | 2 = Às vezes | 3 = Frequentemente | 4 = Muito Frequentemente).');
      
  var tdahQuestions = [
    'Dificuldade em manter foco em tarefas rotineiras ou longas',
    'Facilmente distraído por estímulos externos ou pensamentos aleatórios',
    'Esquece compromissos, objetos pessoais ou tarefas diárias',
    'Dificuldade em organizar tarefas, prazos e gerenciamento de tempo',
    'Evita ou procrastina atividades que exigem esforço mental sustentado',
    'Sensação interna de inquietude ou “motor ligado”',
    'Interrompe os outros ou fala excessivamente em situações sociais',
    'Age por impulso (compras, decisões, palavras) sem pensar nas consequências'
  ];
  
  for (var i = 0; i < tdahQuestions.length; i++) {
    form.addScaleItem()
        .setTitle(tdahQuestions[i])
        .setBounds(0, 4)
        .setLabels('Nunca', 'Muito Frequentemente')
        .setRequired(true);
  }
  
  // ==========================================
  // SEÇÃO 4: Triagem TEA
  // ==========================================
  form.addPageBreakItem()
      .setTitle('SEÇÃO 4: Triagem TEA')
      .setHelpText('Instrução: Responda as perguntas a seguir usando a escala de 0 a 4 (0 = Nunca | 1 = Raramente | 2 = Às vezes | 3 = Frequentemente | 4 = Muito Frequentemente).');
      
  var teaQuestions = [
    'Dificuldade em manter conversas com troca natural e recíproca',
    'Dificuldade em entender ironia, piadas ou linguagem não literal',
    'Dificuldade em interpretar expressões faciais, tom de voz ou gestos',
    'Preferência significativa por atividades solitárias',
    'Interesses muito intensos e restritos em temas específicos',
    'Dificuldade ou grande desconforto com mudanças na rotina',
    'Sensibilidade extrema (or busca) por estímulos sensoriais (som, toque, cheiro, luz)',
    'Movimentos repetitivos ou comportamentos estereotipados (mesmo discretos)'
  ];
  
  for (var i = 0; i < teaQuestions.length; i++) {
    form.addScaleItem()
        .setTitle(teaQuestions[i])
        .setBounds(0, 4)
        .setLabels('Nunca', 'Muito Frequentemente')
        .setRequired(true);
  }
  
  // ==========================================
  // SEÇÃO 5: Altas Habilidades / Superdotação
  // ==========================================
  form.addPageBreakItem()
      .setTitle('SEÇÃO 5: Altas Habilidades / Superdotação')
      .setHelpText('Instrução: Responda as perguntas a seguir usando a escala de 0 a 4 (0 = Nunca | 1 = Raramente | 2 = Às vezes | 3 = Frequentemente | 4 = Muito Frequentemente).');
      
  var ahQuestions = [
    'Aprendo novas habilidades ou conceitos com extrema rapidez',
    'Curiosidade intensa e questionamentos profundos ou filosóficos'
  ];
  
  for (var i = 0; i < ahQuestions.length; i++) {
    form.addScaleItem()
        .setTitle(ahQuestions[i])
        .setBounds(0, 4)
        .setLabels('Nunca', 'Muito Frequentemente')
        .setRequired(true);
  }
  
  // Exibe as URLs geradas no console de logs
  console.log('=== FORMULÁRIO CRIADO COM SUCESSO! ===');
  console.log('URL de Edição (para você alterar o layout/ver respostas):');
  console.log(form.getEditUrl());
  console.log('URL de Visualização/Resposta (para enviar aos pacientes):');
  console.log(form.getPublishedUrl());
}
