document.addEventListener('DOMContentLoaded', () => {
    // ===== ELEMENTOS DE ÁUDIO =====
    const tickSound = document.getElementById('tick-sound');
    const bgMusic = document.getElementById('bg-music');
    const toggleMusicBtn = document.getElementById('toggle-music');
    const musicVolume = document.getElementById('music-volume');
    
    // ===== ELEMENTOS DO TIMER =====
    const timerDisplay = document.getElementById('timer-display');
    const pauseTimerBtn = document.getElementById('pause-timer');
    const resetTimerBtn = document.getElementById('reset-timer');
    const currentTaskDisplay = document.getElementById('current-task');
    const chronoStatus = document.getElementById('chrono-status');
    
    // ===== VARIÁVEIS DO TIMER =====
    let timerInterval = null;
    let timerSeconds = 0;
    let isRunning = false;
    let currentTask = null;
    
    // ===== CONFIGURAÇÃO DE ÁUDIO =====
    // Garante que o tic-tac toca em loop sem interrupções
    tickSound.loop = true;
    tickSound.volume = 0.1;
    bgMusic.volume = parseFloat(musicVolume.value);
    
    // ===== INICIAR MÚSICA DE FUNDO =====
    function startBackgroundMusic() {
        if (bgMusic.paused) {
            bgMusic.play().catch(err => {
                console.log('Música não pôde ser iniciada (pode estar faltando arquivo):', err);
            });
        }
    }
    
    // ===== CONTROLE DE MÚSICA =====
    toggleMusicBtn.addEventListener('click', () => {
        if (bgMusic.paused) {
            startBackgroundMusic();
            toggleMusicBtn.style.color = 'var(--aqua-gold)';
        } else {
            bgMusic.pause();
            toggleMusicBtn.style.color = 'inherit';
        }
    });
    
    // ===== CONTROLE DE VOLUME =====
    musicVolume.addEventListener('input', (e) => {
        bgMusic.volume = parseFloat(e.target.value);
    });
    
    // ===== INICIAR TIC-TAC =====
    function startTickSound() {
        if (tickSound.paused) {
            tickSound.play().catch(err => {
                console.log('Som de tic-tac não pôde ser iniciado:', err);
            });
        }
    }
    
    // ===== ATUALIZAR TIMER =====
    function updateTimerDisplay() {
        const hours = Math.floor(timerSeconds / 3600);
        const minutes = Math.floor((timerSeconds % 3600) / 60);
        const seconds = timerSeconds % 60;
        
        const pad = (num) => String(num).padStart(2, '0');
        timerDisplay.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
        
        // Rotacionar ponteiros do relógio
        const secondHand = document.querySelector('.hand.second');
        const minuteHand = document.querySelector('.hand.minute');
        const hourHand = document.querySelector('.hand.hour');
        
        if (secondHand) secondHand.style.transform = `rotate(${(seconds / 60) * 360}deg)`;
        if (minuteHand) minuteHand.style.transform = `rotate(${((minutes + seconds / 60) / 60) * 360}deg)`;
        if (hourHand) hourHand.style.transform = `rotate(${((hours + minutes / 60) / 12) * 360}deg)`;
    }
    
    // ===== INICIAR/PARAR TIMER =====
    function startTimer(taskName = 'Missão em Progresso') {
        if (!isRunning) {
            isRunning = true;
            currentTask = taskName;
            currentTaskDisplay.textContent = currentTask;
            chronoStatus.style.backgroundColor = '#00FF41';
            pauseTimerBtn.disabled = false;
            resetTimerBtn.disabled = false;
            
            startTickSound();
            startBackgroundMusic();
            
            timerInterval = setInterval(() => {
                timerSeconds++;
                updateTimerDisplay();
            }, 1000);
        }
    }
    
    function pauseTimer() {
        if (isRunning) {
            isRunning = false;
            clearInterval(timerInterval);
            chronoStatus.style.backgroundColor = '#FF6B00';
            tickSound.pause();
        }
    }
    
    function resetTimer() {
        clearInterval(timerInterval);
        isRunning = false;
        timerSeconds = 0;
        currentTask = null;
        currentTaskDisplay.textContent = 'Nenhuma missão ativa';
        chronoStatus.style.backgroundColor = '#555';
        pauseTimerBtn.disabled = true;
        resetTimerBtn.disabled = true;
        updateTimerDisplay();
        tickSound.pause();
        tickSound.currentTime = 0;
    }
    
    // ===== EVENT LISTENERS DO TIMER =====
    pauseTimerBtn.addEventListener('click', pauseTimer);
    resetTimerBtn.addEventListener('click', resetTimer);
    
    // ===== FORMULÁRIO DE TAREFAS =====
    const taskForm = document.getElementById('task-form');
    const taskTitle = document.getElementById('task-title');
    const codexContainer = document.getElementById('codex-container');
    const totalTasksSpan = document.getElementById('total-tasks');
    const completedTasksSpan = document.getElementById('completed-tasks');
    const pendingTasksSpan = document.getElementById('pending-tasks');
    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    function renderTasks() {
        codexContainer.innerHTML = '';
        
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
        
        tasks.forEach((task, index) => {
            const taskEl = document.createElement('div');
            taskEl.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskEl.innerHTML = `
                <div class="task-header">
                    <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${index})">
                    <h3>${task.title}</h3>
                    <button class="btn-delete" onclick="deleteTask(${index})"><i class="fas fa-trash"></i></button>
                </div>
                <p class="task-desc">${task.description || ''}</p>
                <div class="task-footer">
                    <span class="bounty"><i class="fas fa-coins"></i> ${task.bounty || 0} Thrones</span>
                    <button class="btn-start" onclick="startTaskTimer('${task.title.replace(/'/g, "\\'")}')" ${isRunning ? 'disabled' : ''}>
                        <i class="fas fa-play"></i> Iniciar
                    </button>
                </div>
            `;
            codexContainer.appendChild(taskEl);
        });
        
        updateStats();
    }
    
    function updateStats() {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const pending = total - completed;
        
        totalTasksSpan.innerHTML = `<i class="fas fa-hashtag"></i> Total: ${total}`;
        completedTasksSpan.innerHTML = `<i class="fas fa-check"></i> Purgados: ${completed}`;
        pendingTasksSpan.innerHTML = `<i class="fas fa-hourglass-half"></i> Pendentes: ${pending}`;
    }
    
    window.toggleTask = (index) => {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    };
    
    window.deleteTask = (index) => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    };
    
    window.startTaskTimer = (taskName) => {
        startTimer(taskName);
    };
    
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newTask = {
            title: taskTitle.value,
            description: document.getElementById('task-desc').value,
            bounty: parseFloat(document.getElementById('task-bounty').value) || 0,
            completed: false
        };
        
        tasks.push(newTask);
        saveTasks();
        renderTasks();
        taskForm.reset();
    });
    
    // ===== ATUALIZAR ANO NO FOOTER =====
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // ===== INICIALIZAR =====
    renderTasks();
    updateTimerDisplay();
    startBackgroundMusic();
});