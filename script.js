/**
 * @fileoverview NeuroEval - Sistema de Mapeamento de Perfil
 * @version 2.1.0 (Correção de Navegação e Viés de Resposta)
 */

class NeuroEval {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 6;
        this.formData = {};
        this.chart = null;
        this.theme = localStorage.getItem('theme') || 'light';
        
        this.init();
    }

    init() {
        this.applyTheme();
        this.setupEventListeners();
        this.calculateAge();
        this.setMaxDate();
        this.loadSavedData();
        this.updateFormDisplay();
        this.updateStepper();
    }

    setupEventListeners() {
        // Navegação robusta com preventDefault
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        const form = document.getElementById('evaluationForm');

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNext();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handlePrev();
            });
        }

        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        document.getElementById('dataNascimento')?.addEventListener('change', () => this.calculateAge());
        document.getElementById('themeToggle')?.addEventListener('click', () => this.toggleTheme());
        document.getElementById('exportJsonBtn')?.addEventListener('click', () => this.exportToJSON());
        document.getElementById('printBtn')?.addEventListener('click', () => window.print());
        document.getElementById('newEvaluationBtn')?.addEventListener('click', () => this.resetForm());

        this.setupRealTimeValidation();
    }

    setupRealTimeValidation() {
        const requiredFields = document.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => {
                if (field.classList.contains('invalid')) {
                    this.validateField(field);
                }
            });
        });
    }

    validateField(field) {
        const isValid = field.checkValidity();
        if (!isValid && field.value.trim() === '') {
            field.classList.add('invalid');
            field.setAttribute('aria-invalid', 'true');
        } else {
            field.classList.remove('invalid');
            field.removeAttribute('aria-invalid');
        }
        return isValid;
    }

    // CORREÇÃO PRINCIPAL: Validação explícita da etapa atual
    validateCurrentStep() {
        const currentStepElement = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
        if (!currentStepElement) return true;

        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;
        let firstInvalidField = null;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
                if (!firstInvalidField) firstInvalidField = field;
            }
        });

        if (!isValid && firstInvalidField) {
            firstInvalidField.focus();
            this.showToast('Por favor, preencha todos os campos obrigatórios (*).', 'warning');
        }

        return isValid;
    }

    handleNext() {
        if (this.validateCurrentStep()) {
            if (this.currentStep < this.totalSteps) {
                this.currentStep++;
                this.updateFormDisplay();
                this.updateStepper();
                this.saveCurrentStep();
                
                if (this.currentStep === 6) {
                    this.generateChart();
                }
            }
        }
    }

    handlePrev() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateFormDisplay();
            this.updateStepper();
        }
    }

    updateFormDisplay() {
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });

        const currentStepElement = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }

        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');

        if (prevBtn) prevBtn.style.display = this.currentStep === 1 ? 'none' : 'inline-flex';
        
        if (nextBtn && submitBtn) {
            if (this.currentStep === this.totalSteps) {
                nextBtn.style.display = 'none';
                submitBtn.style.display = 'inline-flex';
            } else {
                nextBtn.style.display = 'inline-flex';
                submitBtn.style.display = 'none';
            }
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    updateStepper() {
        const steps = document.querySelectorAll('.step');
        const progressFill = document.querySelector('.progress-fill');
        const progressBar = document.querySelector('.progress-bar');

        steps.forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('active', 'completed');

            if (stepNumber < this.currentStep) {
                step.classList.add('completed');
            } else if (stepNumber === this.currentStep) {
                step.classList.add('active');
            }
        });

        if (progressFill && progressBar) {
            const progress = (this.currentStep / this.totalSteps) * 100;
            progressFill.style.width = `${progress}%`;
            progressBar.setAttribute('aria-valuenow', Math.round(progress));
        }
    }

    calculateAge() {
        const birthDateInput = document.getElementById('dataNascimento');
        const idadeInput = document.getElementById('idade');
        if (birthDateInput && idadeInput && birthDateInput.value) {
            const today = new Date();
            const birth = new Date(birthDateInput.value);
            let age = today.getFullYear() - birth.getFullYear();
            const monthDiff = today.getMonth() - birth.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                age--;
            }
            idadeInput.value = age;
        }
    }

    setMaxDate() {
        const today = new Date().toISOString().split('T')[0];
        const birthDateInput = document.getElementById('dataNascimento');
        if (birthDateInput) {
            birthDateInput.setAttribute('max', today);
        }
    }

    saveCurrentStep() {
        const currentStepElement = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
        if (!currentStepElement) return;

        const inputs = currentStepElement.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                if (!this.formData[input.name]) this.formData[input.name] = [];
                if (input.checked) {
                    if (!this.formData[input.name].includes(input.value)) {
                        this.formData[input.name].push(input.value);
                    }
                } else {
                    this.formData[input.name] = this.formData[input.name].filter(v => v !== input.value);
                }
            } else {
                this.formData[input.id || input.name] = input.value;
            }
        });

        localStorage.setItem('neuroeval_data', JSON.stringify(this.formData));
    }

    loadSavedData() {
        const savedData = localStorage.getItem('neuroeval_data');
        if (savedData) {
            try {
                this.formData = JSON.parse(savedData);
                Object.keys(this.formData).forEach(key => {
                    const element = document.getElementById(key) || document.querySelector(`[name="${key}"]`);
                    if (element) {
                        if (element.type === 'checkbox') {
                            const checkboxes = document.querySelectorAll(`input[name="${key}"]`);
                            checkboxes.forEach(cb => {
                                cb.checked = this.formData[key].includes(cb.value);
                            });
                        } else {
                            element.value = this.formData[key];
                        }
                    }
                });
                this.calculateAge();
            } catch (e) {
                console.error('Erro ao carregar dados salvos:', e);
            }
        }
    }

    generateChart() {
        const ctx = document.getElementById('cognitiveChart');
        if (!ctx) return;
        
        if (this.chart) {
            this.chart.destroy();
        }

        const scores = {
            'Atenção': parseInt(document.getElementById('atencao_score')?.value) || 50,
            'Funções Exec.': parseInt(document.getElementById('funcoes_executivas_score')?.value) || 50,
            'Linguagem': parseInt(document.getElementById('linguagem_score')?.value) || 50,
            'Reg. Emocional': parseInt(document.getElementById('emocional_score')?.value) || 50,
            'Memória': parseInt(document.getElementById('memoria_score')?.value) || 50,
            'Vel. Process.': parseInt(document.getElementById('velocidade_processamento_score')?.value) || 50
        };

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const textColor = isDark ? '#f9fafb' : '#111827';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

        this.chart = new Chart(ctx.getContext('2d'), {
            type: 'radar',
            data: {
                labels: Object.keys(scores),
                datasets: [{
                    label: 'Percentil',
                    data: Object.values(scores),
                    backgroundColor: 'rgba(99, 102, 241, 0.2)',
                    borderColor: 'rgba(99, 102, 241, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(99, 102, 241, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(99, 102, 241, 1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: textColor, font: { size: 14, weight: '600' } }
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { stepSize: 20, color: textColor, backdropColor: 'transparent' },
                        grid: { color: gridColor },
                        angleLines: { color: gridColor },
                        pointLabels: { color: textColor, font: { size: 12, weight: '500' } }
                    }
                }
            }
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.validateCurrentStep()) {
            this.saveCurrentStep();
            this.formData.submittedAt = new Date().toISOString();
            this.formData.id = Date.now();
            
            const evaluations = JSON.parse(localStorage.getItem('neuroeval_evaluations') || '[]');
            evaluations.push(this.formData);
            localStorage.setItem('neuroeval_evaluations', JSON.stringify(evaluations));
            
            document.getElementById('evaluationForm').style.display = 'none';
            document.querySelector('.stepper').style.display = 'none';
            document.getElementById('postSubmitActions').style.display = 'block';
            
            this.showToast('Mapeamento salvo com sucesso!', 'success');
        }
    }

    exportToJSON() {
        const dataStr = JSON.stringify(this.formData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `neuroeval_${this.formData.nomeCompleto || 'mapeamento'}_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        this.showToast('Arquivo JSON exportado com sucesso!', 'success');
    }

    resetForm() {
        if (confirm('Tem certeza que deseja iniciar um novo mapeamento? Os dados atuais não salvos serão perdidos.')) {
            localStorage.removeItem('neuroeval_data');
            this.formData = {};
            this.currentStep = 1;
            
            document.getElementById('evaluationForm').reset();
            document.getElementById('evaluationForm').style.display = 'block';
            document.querySelector('.stepper').style.display = 'block';
            document.getElementById('postSubmitActions').style.display = 'none';
            
            this.updateFormDisplay();
            this.updateStepper();
            this.showToast('Formulário resetado. Pronto para novo mapeamento!', 'success');
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        if (this.currentStep === 6 && this.chart) {
            this.generateChart();
        }
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = this.theme === 'light' ? '🌙' : '☀️';
        }
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        if (!toast) return;
        
        toast.textContent = message;
        toast.className = `toast show ${type}`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.neuroEval = new NeuroEval();
});