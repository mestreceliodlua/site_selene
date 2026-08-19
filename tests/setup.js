/**
 * @fileoverview Configuração dos testes Jest
 * @description Setup do ambiente de teste com mocks e helpers
 */

// Mock do localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: jest.fn(key => store[key] || null),
        setItem: jest.fn((key, value) => {
            store[key] = value.toString();
        }),
        removeItem: jest.fn(key => {
            delete store[key];
        }),
        clear: jest.fn(() => {
            store = {};
        })
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

// Mock do Chart.js
global.Chart = jest.fn().mockImplementation(() => ({
    destroy: jest.fn(),
    update: jest.fn(),
    ctx: {
        canvas: {
            width: 400,
            height: 400
        }
    }
}));

// Mock de window.alert e window.confirm
window.alert = jest.fn();
window.confirm = jest.fn(() => true);

// Mock de URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'blob:http://localhost/test');
global.URL.revokeObjectURL = jest.fn();

// Mock de window.print
window.print = jest.fn();

// Desabilitar avisos de console para testes
const originalError = console.error;
beforeAll(() => {
    console.error = (...args) => {
        if (
            typeof args[0] === 'string' &&
            args[0].includes('Not implemented: HTMLFormElement.prototype.submit')
        ) {
            return;
        }
        originalError.call(console, ...args);
    };
});

// Helper para criar elementos DOM
global.createTestDOM = () => {
    document.body.innerHTML = `
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body>
            <header role="banner">
                <div class="header-container">
                    <div class="logo">
                        <span class="logo-icon" aria-hidden="true">🧠</span>
                        <h1>NeuroEval</h1>
                    </div>
                    <div class="theme-toggle">
                        <button id="themeToggle" aria-label="Alternar tema">
                            <span class="theme-icon">🌙</span>
                        </button>
                    </div>
                </div>
            </header>
            <main role="main">
                <div class="container">
                    <nav class="stepper" role="navigation" aria-label="Progresso">
                        <div class="stepper-container">
                            <div class="step active" data-step="1" role="listitem">
                                <div class="step-number" aria-current="step">1</div>
                                <div class="step-label">Dados Pessoais</div>
                            </div>
                            <div class="step" data-step="2" role="listitem">
                                <div class="step-number">2</div>
                                <div class="step-label">Queixa</div>
                            </div>
                            <div class="step" data-step="3" role="listitem">
                                <div class="step-number">3</div>
                                <div class="step-label">Histórico</div>
                            </div>
                            <div class="step" data-step="4" role="listitem">
                                <div class="step-number">4</div>
                                <div class="step-label">Avaliação</div>
                            </div>
                            <div class="step" data-step="5" role="listitem">
                                <div class="step-number">5</div>
                                <div class="step-label">Resultados</div>
                            </div>
                            <div class="step" data-step="6" role="listitem">
                                <div class="step-number">6</div>
                                <div class="step-label">Conclusão</div>
                            </div>
                        </div>
                        <div class="progress-bar" role="progressbar" aria-valuenow="16" aria-valuemin="0" aria-valuemax="100">
                            <div class="progress-fill"></div>
                        </div>
                    </nav>
                    
                    <form id="evaluationForm" novalidate>
                        <!-- Etapa 1 -->
                        <fieldset class="form-step active" data-step="1" id="step1">
                            <legend>Dados Pessoais</legend>
                            <div class="form-group">
                                <label for="nomeCompleto">Nome Completo <span class="required" aria-label="obrigatório">*</span></label>
                                <input type="text" id="nomeCompleto" name="nomeCompleto" required aria-required="true">
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="dataNascimento">Data de Nascimento <span class="required">*</span></label>
                                    <input type="date" id="dataNascimento" name="dataNascimento" required aria-required="true">
                                </div>
                                <div class="form-group">
                                    <label for="idade">Idade</label>
                                    <input type="number" id="idade" name="idade" readonly>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="genero">Gênero <span class="required">*</span></label>
                                    <select id="genero" name="genero" required aria-required="true">
                                        <option value="">Selecione...</option>
                                        <option value="masculino">Masculino</option>
                                        <option value="feminino">Feminino</option>
                                        <option value="outro">Outro</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="escolaridade">Escolaridade <span class="required">*</span></label>
                                    <select id="escolaridade" name="escolaridade" required aria-required="true">
                                        <option value="">Selecione...</option>
                                        <option value="fundamental">Fundamental</option>
                                        <option value="medio_completo">Médio Completo</option>
                                        <option value="superior_completo">Superior Completo</option>
                                    </select>
                                </div>
                            </div>
                        </fieldset>

                        <!-- Etapa 2 -->
                        <fieldset class="form-step" data-step="2" id="step2">
                            <legend>Queixa Principal</legend>
                            <div class="form-group">
                                <label for="queixaPrincipal">Queixa Principal <span class="required">*</span></label>
                                <textarea id="queixaPrincipal" name="queixaPrincipal" rows="4" required aria-required="true"></textarea>
                            </div>
                            <div class="form-group">
                                <label for="duracaoSintomas">Duração</label>
                                <select id="duracaoSintomas" name="duracaoSintomas">
                                    <option value="">Selecione...</option>
                                    <option value="menos_1_mes">Menos de 1 mês</option>
                                    <option value="1_3_meses">1-3 meses</option>
                                    <option value="6_12_meses">6-12 meses</option>
                                </select>
                            </div>
                        </fieldset>

                        <!-- Etapa 3 -->
                        <fieldset class="form-step" data-step="3" id="step3">
                            <legend>Histórico</legend>
                            <div class="form-group">
                                <label for="historicoFamiliar">Histórico Familiar</label>
                                <textarea id="historicoFamiliar" name="historicoFamiliar"></textarea>
                            </div>
                        </fieldset>

                        <!-- Etapa 4 -->
                        <fieldset class="form-step" data-step="4" id="step4">
                            <legend>Avaliação</legend>
                            <div class="form-group">
                                <label for="testesAplicados">Testes Aplicados</label>
                                <textarea id="testesAplicados" name="testesAplicados"></textarea>
                            </div>
                            <div class="test-results-grid">
                                <div class="test-result-item">
                                    <label for="atencao_score">Atenção (%)</label>
                                    <input type="number" id="atencao_score" name="atencao_score" min="0" max="100">
                                </div>
                                <div class="test-result-item">
                                    <label for="memoria_score">Memória (%)</label>
                                    <input type="number" id="memoria_score" name="memoria_score" min="0" max="100">
                                </div>
                            </div>
                        </fieldset>

                        <!-- Etapa 5 -->
                        <fieldset class="form-step" data-step="5" id="step5">
                            <legend>Resultados</legend>
                            <div class="chart-container">
                                <canvas id="cognitiveChart"></canvas>
                            </div>
                            <div class="form-group">
                                <label for="pontosFortes">Pontos Fortes</label>
                                <textarea id="pontosFortes" name="pontosFortes"></textarea>
                            </div>
                        </fieldset>

                        <!-- Etapa 6 -->
                        <fieldset class="form-step" data-step="6" id="step6">
                            <legend>Conclusão</legend>
                            <div class="form-group">
                                <label for="conclusao">Conclusão</label>
                                <textarea id="conclusao" name="conclusao"></textarea>
                            </div>
                        </fieldset>

                        <!-- Navegação -->
                        <div class="form-navigation">
                            <button type="button" id="prevBtn" class="btn btn-secondary" aria-label="Voltar">
                                ← Anterior
                            </button>
                            <button type="button" id="nextBtn" class="btn btn-primary" aria-label="Avançar">
                                Próximo →
                            </button>
                            <button type="submit" id="submitBtn" class="btn btn-success" style="display: none;" aria-label="Enviar">
                                ✓ Finalizar
                            </button>
                        </div>
                    </form>

                    <!-- Pós-submit -->
                    <div id="postSubmitActions" style="display: none;">
                        <div class="success-message" role="alert">
                            <span class="success-icon" aria-hidden="true">✓</span>
                            <h3>Sucesso!</h3>
                            <p>Avaliação concluída.</p>
                        </div>
                        <div class="action-buttons">
                            <button id="exportJsonBtn" class="btn btn-secondary" aria-label="Exportar JSON">
                                📄 Exportar
                            </button>
                            <button id="printBtn" class="btn btn-primary" aria-label="Imprimir">
                                🖨️ Imprimir
                            </button>
                            <button id="newEvaluationBtn" class="btn btn-success" aria-label="Nova avaliação">
                                ➕ Nova
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <div id="toast" class="toast" role="alert" aria-live="polite"></div>
        </body>
        </html>
    `;
};

// Limpar após testes
afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
    localStorage.clear();
});

afterAll(() => {
    console.error = originalError;
});
