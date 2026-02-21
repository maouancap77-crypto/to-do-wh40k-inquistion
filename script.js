// script.js - ORDO MALLEUS Mission Log
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const taskForm = document.getElementById('task-form');
    const taskTitle = document.getElementById('task-title');
    const taskDesc = document.getElementById('task-desc');
    const taskBounty = document.getElementById('task-bounty');
    const codexContainer = document.getElementById('codex-container');
    const totalTasksElement = document.getElementById('total-tasks');
    const completedTasksElement = document.getElementById('completed-tasks');
    const pendingTasksElement = document.getElementById('pending-tasks');
    const currentTaskElement = document.getElementById('current-task');
    const timerDisplay = document.getElementById('timer-display');
    const pauseTimerBtn = document.getElementById('pause-timer');
    const resetTimerBtn = document.getElementById('reset-timer');
    const chronoStatus = document.getElementById('chrono-status');
    const statusText = document.querySelector('.status-text');
    const secondHand = document.querySelector('.hand.second');
    const minuteHand = document.querySelector('.hand.minute');
    const hourHand = document.querySelector('.hand.hour');
    const voxAudio = document.getElementById('vox-audio');
    // Elementos de áudio
    const tickSound = document.getElementById('tick-sound');
    const bgMusic = document.getElementById('bg-music');
    const toggleMusicBtn = document.getElementById('toggle-music');
    const musicVolumeSlider = document.getElementById('music-volume');

    // Estado do áudio
    let tickEnabled = true;
    let musicEnabled = false;
    let lastTickTime = 0;
    
    // Variáveis do timer
    let timerInterval = null;
    let timerSeconds = 0;
    let timerRunning = false;
    let currentTaskId = null;
    
    // Carregar contratos do localStorage
    let tasks = JSON.parse(localStorage.getItem('malleusContracts')) || [];
    
    // Inicializar
    updateStats();
    renderTasks();
    updateCurrentYear();
    updateClockHands();
    
    // Atualizar ano no rodapé
    function updateCurrentYear() {
        document.getElementById('current-year').textContent = new Date().getFullYear();
    }
    
    // Atualizar ponteiros do relógio em tempo real
    function updateClockHands() {
        const now = new Date();
        const seconds = now.getSeconds();
        const minutes = now.getMinutes();
        const hours = now.getHours() % 12;
        
        // Calcular ângulos
        const secDeg = ((seconds / 60) * 360);
        const minDeg = ((minutes / 60) * 360) + ((seconds/60)*6);
        const hrDeg = ((hours / 12) * 360) + ((minutes/60)*30);
        
        // Aplicar rotação
        secondHand.style.transform = `translateX(-50%) rotate(${secDeg}deg)`;
        minuteHand.style.transform = `translateX(-50%) rotate(${minDeg}deg)`;
        hourHand.style.transform = `translateX(-50%) rotate(${hrDeg}deg)`;
        
        // Continuar atualizando
        requestAnimationFrame(updateClockHands);
    }
    
    // Formatar tempo (segundos para HH:MM:SS)
    function formatTime(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Formatar recompensa
    function formatBounty(amount) {
        if (!amount) return '';
        return `${parseInt(amount).toLocaleString('pt-BR')} ⚙️`;
    }
    
    // Atualizar estatísticas
    function updateStats() {
        const total = tasks.length;
        const completed = tasks.filter(task => task.completed).length;
        const pending = total - completed;
        
        totalTasksElement.innerHTML = `<i class="fas fa-hashtag"></i> Total: ${total}`;
        completedTasksElement.innerHTML = `<i class="fas fa-check"></i> Purgados: ${completed}`;
        pendingTasksElement.innerHTML = `<i class="fas fa-hourglass-half"></i> Pendentes: ${pending}`;
    }
    
    // Salvar contratos no localStorage
    function saveTasks() {
        localStorage.setItem('malleusContracts', JSON.stringify(tasks));
        updateStats();
    }
    
    // Renderizar todos os contratos
    function renderTasks() {
        // Limpar container (exceto o estado vazio se não houver contratos)
        if (tasks.length === 0) {
            codexContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-skull"></i>
                    <p>Silêncio no vox... Registre seu primeiro contrato para iniciar a caçada.</p>
                    <p class="empty-subtitle">"A galáxia é vasta, e a justiça, implacável."</p>
                </div>
            `;
            return;
        }
        
        codexContainer.innerHTML = '';
        
        // Adicionar cada contrato
        tasks.forEach(task => {
            const contractElement = createContractElement(task);
            codexContainer.appendChild(contractElement);
        });
    }
    
    // Criar elemento HTML para um contrato
    function createContractElement(task) {
        const contract = document.createElement('div');
        contract.className = `contract ${task.completed ? 'completed' : ''} ${task.expanded ? 'expanded' : ''}`;
        contract.dataset.id = task.id;
        
        // Tempo formatado para esta missão
        const timeSpent = formatTime(task.timeSpent || 0);
        const bounty = formatBounty(task.bounty);
        
        contract.innerHTML = `
            ${task.completed ? '<div class="completed-badge"><i class="fas fa-seal"></i></div>' : ''}
            <div class="contract-header-row">
                <h3 class="contract-title">${escapeHtml(task.title)}</h3>
                <span class="contract-status ${task.completed ? 'status-completed' : 'status-pending'}">
                    ${task.completed ? 'PURGADO' : 'ATIVO'}
                </span>
            </div>
            ${bounty ? `<div class="contract-bounty"><i class="fas fa-coins"></i> Recompensa: ${bounty}</div>` : ''}
            <p class="contract-desc">${escapeHtml(task.description || 'Sem briefing disponível...')}</p>
            <div class="contract-meta">
                <div class="contract-time">
                    <i class="fas fa-stopwatch"></i> Tempo de Missão: ${timeSpent}
                </div>
                <div class="contract-controls">
                    ${!task.completed ? `
                    <button class="btn-contract btn-start" title="Iniciar cronômetro da missão">
                        <i class="fas fa-play"></i>
                    </button>
                    <button class="btn-contract btn-complete" title="Marcar alvo como purgado">
                        <i class="fas fa-skull-crossbones"></i>
                    </button>
                    ` : ''}
                    <button class="btn-contract btn-edit" title="Editar contrato">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-contract btn-delete" title="Arquivar contrato">
                        <i class="fas fa-archive"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Adicionar event listeners
        const startBtn = contract.querySelector('.btn-start');
        const completeBtn = contract.querySelector('.btn-complete');
        const editBtn = contract.querySelector('.btn-edit');
        const deleteBtn = contract.querySelector('.btn-delete');
        const contractTitle = contract.querySelector('.contract-title');
        
        // Expandir/recolher ao clicar no título
        contractTitle.addEventListener('click', function(e) {
            if (!e.target.closest('button')) {
                toggleContractExpansion(task.id);
            }
        });
        
        // Iniciar timer para esta missão
        if (startBtn) {
            startBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                startTimerForTask(task.id);
            });
        }
        
        // Marcar como purgado
        if (completeBtn) {
            completeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleTaskCompletion(task.id);
            });
        }
        
        // Editar contrato
        editBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            editTask(task.id);
        });
        
        // Arquivar contrato
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            deleteTask(task.id);
        });
        
        return contract;
    }
    
    // Alternar expansão do contrato
    function toggleContractExpansion(taskId) {
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) return;
        
        tasks[taskIndex].expanded = !tasks[taskIndex].expanded;
        saveTasks();
        renderTasks();
    }
    
    // Adicionar novo contrato
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = taskTitle.value.trim();
        const description = taskDesc.value.trim();
        const bounty = taskBounty.value.trim();
        
        if (!title) {
            showVoxMessage("ALERTA: Designação do alvo obrigatória!");
            return;
        }
        
        const newTask = {
            id: Date.now().toString(),
            title: title,
            description: description,
            bounty: bounty,
            completed: false,
            expanded: true,
            timeSpent: 0,
            createdAt: new Date().toISOString()
        };
        
        tasks.unshift(newTask);
        saveTasks();
        renderTasks();
        
        // Limpar formulário
        taskForm.reset();
        taskTitle.focus();
        
        // Feedback visual e sonoro
        const registerBtn = document.querySelector('.btn-register');
        const originalText = registerBtn.innerHTML;
        registerBtn.innerHTML = '<i class="fas fa-check"></i> CONTRATO REGISTRADO';
        registerBtn.style.background = 'linear-gradient(to bottom, #2a7a3a, #1e5a2a)';
        
        if (voxAudio) {
            voxAudio.currentTime = 0;
            voxAudio.play().catch(e => console.log("Vox offline: ", e));
        }
        
        setTimeout(() => {
            registerBtn.innerHTML = originalText;
            registerBtn.style.background = '';
        }, 2500);
        
        showVoxMessage("CONTRATO REGISTRADO • BOA CAÇA, INQUISIDOR");
    });
    
    // Mostrar mensagem no estilo vox-caster
    function showVoxMessage(message) {
        currentTaskElement.textContent = message;
        currentTaskElement.style.color = 'var(--aqua-gold)';
        currentTaskElement.style.textShadow = '0 0 10px var(--glow-gold)';
        
        setTimeout(() => {
            if (!timerRunning || !currentTaskId) {
                currentTaskElement.textContent = 'Nenhuma missão ativa';
                currentTaskElement.style.color = '';
                currentTaskElement.style.textShadow = '';
            }
        }, 4000);
    }
    
    // Iniciar timer para uma missão específica
    function startTimerForTask(taskId) {
        // Se já estiver rodando para esta missão, pausar
        if (timerRunning && currentTaskId === taskId) {
            pauseTimer();
            return;
        }
        
        // Se estiver rodando para outra missão, pausar primeiro
        if (timerRunning) {
            pauseTimer();
        }
        
        // Encontrar a missão
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;
        
        // Definir missão atual
        currentTaskId = taskId;
        currentTaskElement.textContent = `MISSÃO ATIVA: ${task.title}`;
        currentTaskElement.style.color = 'var(--blood-red)';
        currentTaskElement.style.textShadow = '0 0 10px var(--glow-red)';
        
        // Ativar status do chrono
        chronoStatus.classList.add('active');
        statusText.textContent = "EM OPERAÇÃO";
        statusText.style.color = 'var(--blood-red)';
        
        // Iniciar timer
        timerRunning = true;
        timerSeconds = task.timeSpent || 0;
        
        // Atualizar display
        timerDisplay.textContent = formatTime(timerSeconds);
        
        // Ativar controles do timer
        pauseTimerBtn.disabled = false;
        resetTimerBtn.disabled = false;
        pauseTimerBtn.innerHTML = '<i class="fas fa-pause"></i> SUSPENDER';
        
        // Iniciar animação do ponteiro de segundos
        animateSecondHand();
        
        // Iniciar áudio do vox (opcional)
        if (voxAudio) {
            voxAudio.currentTime = 0;
            voxAudio.volume = 0.3;
            voxAudio.play().catch(e => console.log("Vox offline: ", e));
        }
        
        // Iniciar intervalo do timer
        timerInterval = setInterval(() => {
            timerSeconds++;
            timerDisplay.textContent = formatTime(timerSeconds);
            
            // Atualizar tempo gasto na missão
            const taskIndex = tasks.findIndex(t => t.id === taskId);
            if (taskIndex !== -1) {
                tasks[taskIndex].timeSpent = timerSeconds;
                saveTasks();
                
                // Atualizar display do tempo na missão
                const timeElement = document.querySelector(`.contract[data-id="${taskId}"] .contract-time`);
                if (timeElement) {
                    timeElement.innerHTML = `<i class="fas fa-stopwatch"></i> Tempo de Missão: ${formatTime(timerSeconds)}`;
                }
            }
        }, 1000);
    }
    
    // Animar ponteiro de segundos durante missão ativa
    function animateSecondHand() {
        if (!timerRunning) return;
        
        let angle = 0;
        const animate = () => {
            if (!timerRunning) return;
            angle = (angle + 6) % 360; // 6 graus por segundo
            secondHand.style.transform = `translateX(-50%) rotate(${angle}deg)`;
            requestAnimationFrame(animate);
        };
        animate();
    }
    
    // Pausar timer
    function pauseTimer() {
        if (!timerRunning) return;
        
        timerRunning = false;
        clearInterval(timerInterval);
        
        // Desativar status do chrono
        chronoStatus.classList.remove('active');
        statusText.textContent = "SUSPENSO";
        statusText.style.color = 'var(--parchment)';
        
        // Atualizar botão
        pauseTimerBtn.innerHTML = '<i class="fas fa-play"></i> RETOMAR';
        
        // Restaurar animação do relógio para tempo real
        updateClockHands();
    }
    
    // Retomar timer
    function resumeTimer() {
        if (timerRunning || !currentTaskId) return;
        
        timerRunning = true;
        
        // Reativar status do chrono
        chronoStatus.classList.add('active');
        statusText.textContent = "EM OPERAÇÃO";
        statusText.style.color = 'var(--blood-red)';
        
        // Reiniciar intervalo
        timerInterval = setInterval(() => {
            timerSeconds++;
            timerDisplay.textContent = formatTime(timerSeconds);
            
            // Atualizar tempo gasto na missão
            const taskIndex = tasks.findIndex(t => t.id === currentTaskId);
            if (taskIndex !== -1) {
                tasks[taskIndex].timeSpent = timerSeconds;
                saveTasks();
                
                // Atualizar display do tempo na missão
                const timeElement = document.querySelector(`.contract[data-id="${currentTaskId}"] .contract-time`);
                if (timeElement) {
                    timeElement.innerHTML = `<i class="fas fa-stopwatch"></i> Tempo de Missão: ${formatTime(timerSeconds)}`;
                }
            }
        }, 1000);
        
        // Reiniciar animação do ponteiro de segundos
        animateSecondHand();
        
        // Atualizar botão
        pauseTimerBtn.innerHTML = '<i class="fas fa-pause"></i> SUSPENDER';
    }
    
    // Resetar timer
    function resetTimer() {
        // Parar timer
        if (timerRunning) {
            clearInterval(timerInterval);
            timerRunning = false;
        }
        
        // Resetar variáveis
        timerSeconds = 0;
        timerDisplay.textContent = formatTime(0);
        
        // Desativar status do chrono
        chronoStatus.classList.remove('active');
        statusText.textContent = "AGUARDANDO ORDEM";
        statusText.style.color = 'var(--parchment)';
        
        // Restaurar animação do relógio para tempo real
        updateClockHands();
        
        // Resetar missão atual
        if (currentTaskId) {
            const taskIndex = tasks.findIndex(t => t.id === currentTaskId);
            if (taskIndex !== -1) {
                tasks[taskIndex].timeSpent = 0;
                saveTasks();
                
                // Atualizar display do tempo na missão
                const timeElement = document.querySelector(`.contract[data-id="${currentTaskId}"] .contract-time`);
                if (timeElement) {
                    timeElement.innerHTML = `<i class="fas fa-stopwatch"></i> Tempo de Missão: 00:00:00`;
                }
            }
            
            currentTaskElement.textContent = 'Nenhuma missão ativa';
            currentTaskElement.style.color = '';
            currentTaskElement.style.textShadow = '';
            currentTaskId = null;
        }
        
        // Desativar controles
        pauseTimerBtn.disabled = true;
        resetTimerBtn.disabled = true;
        pauseTimerBtn.innerHTML = '<i class="fas fa-pause"></i> SUSPENDER';
    }
    
    // Alternar conclusão da missão
    function toggleTaskCompletion(taskId) {
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) return;
        
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        
        // Se estiver completando e o timer estiver rodando para esta missão, parar o timer
        if (tasks[taskIndex].completed && timerRunning && currentTaskId === taskId) {
            resetTimer();
            showVoxMessage("ALVO PURGADO • CONTRATO CONCLUÍDO");
        } else if (tasks[taskIndex].completed) {
            showVoxMessage("ALVO PURGADO • RECOMPENSA DISPONÍVEL");
        }
        
        saveTasks();
        renderTasks();
    }
    
    // Editar contrato
    function editTask(taskId) {
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) return;
        
        const task = tasks[taskIndex];
        
        // Preencher formulário com dados do contrato
        taskTitle.value = task.title;
        taskDesc.value = task.description || '';
        taskBounty.value = task.bounty || '';
        
        // Focar no título
        taskTitle.focus();
        
        // Remover contrato da lista (será readicionado ao submeter)
        tasks.splice(taskIndex, 1);
        saveTasks();
        renderTasks();
        
        // Atualizar texto do botão
        const registerBtn = document.querySelector('.btn-register');
        registerBtn.innerHTML = '<i class="fas fa-edit"></i> ATUALIZAR CONTRATO';
        registerBtn.style.background = 'linear-gradient(to bottom, var(--aqua-gold), var(--aqua-dim))';
        registerBtn.style.color = 'var(--void-dark)';
        
        // Restaurar botão após submit
        const restoreButton = function() {
            registerBtn.innerHTML = '<i class="fas fa-plus-square"></i> REGISTRAR CONTRATO';
            registerBtn.style.background = '';
            registerBtn.style.color = '';
            taskForm.removeEventListener('submit', restoreButton);
        };
        
        taskForm.addEventListener('submit', restoreButton, { once: true });
        
        showVoxMessage("EDITANDO CONTRATO • CONFIRME ALTERAÇÕES");
    }
    
    // Arquivar contrato
    function deleteTask(taskId) {
        if (!confirm('CONFIRMAÇÃO INQUISITORIAL: Deseja arquivar permanentemente este contrato? Esta ação é irreversível.')) {
            return;
        }
        
        // Se o timer estiver rodando para esta missão, parar
        if (timerRunning && currentTaskId === taskId) {
            resetTimer();
        }
        
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) return;
        
        tasks.splice(taskIndex, 1);
        saveTasks();
        renderTasks();
        
        showVoxMessage("CONTRATO ARQUIVADO • DADOS PURGADOS");
    }
    
    // Utilitário para escapar HTML (prevenir XSS)
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Event listeners para controles do timer
    pauseTimerBtn.addEventListener('click', function() {
        if (!timerRunning) {
            resumeTimer();
        } else {
            pauseTimer();
        }
    });
    
    resetTimerBtn.addEventListener('click', resetTimer);
    
    // Inicializar controles do timer
    pauseTimerBtn.disabled = true;
    resetTimerBtn.disabled = true;
    
    // Adicionar marca d'água da Inquisição
    const watermark = document.createElement('div');
    watermark.className = 'watermark';
    watermark.textContent = 'ORDO MALLEUS • AUTHORIZED PERSONNEL ONLY';
    document.body.appendChild(watermark);
});
