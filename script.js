// script.js - ORDO MALLEUS Mission Log
document.addEventListener('DOMContentLoaded', function() {
  // ==========================================
  // ELEMENTOS DO DOM
  // ==========================================
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
  
  // 🔊 ELEMENTOS DE ÁUDIO (NOVOS)
  const bgMusic = document.getElementById('bg-music');
  const tickSound = document.getElementById('tick-sound');
  const toggleMusicBtn = document.getElementById('toggle-music');
  const musicVolumeSlider = document.getElementById('music-volume');

  // ==========================================
  // VARIÁVEIS DE ESTADO
  // ==========================================
  let timerInterval = null;
  let timerSeconds = 0;
  let timerRunning = false;
  let currentTaskId = null;
  
  // 🔊 ESTADO DO ÁUDIO (NOVAS)
  let musicEnabled = false;
  let tickEnabled = true;
  let lastTickTime = 0;

  // Carregar contratos do localStorage
  let tasks = JSON.parse(localStorage.getItem('malleusContracts')) || [];

  // ==========================================
  // INICIALIZAÇÃO
  // ==========================================
  updateStats();
  renderTasks();
  updateCurrentYear();
  updateClockHands();
  
  // 🔊 CARREGAR PREFERÊNCIAS DE ÁUDIO
  loadAudioPrefs();
  
  // 🔊 PREVENÇÃO DE BLOQUEIO DE ÁUDIO
  prepareAudio();

  // ==========================================
  // FUNÇÕES AUXILIARES
  // ==========================================
  
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
    
    const secDeg = ((seconds / 60) * 360);
    const minDeg = ((minutes / 60) * 360) + ((seconds/60)*6);
    const hrDeg = ((hours / 12) * 360) + ((minutes/60)*30);
    
    secondHand.style.transform = `translateX(-50%) rotate(${secDeg}deg)`;
    minuteHand.style.transform = `translateX(-50%) rotate(${minDeg}deg)`;
    hourHand.style.transform = `translateX(-50%) rotate(${hrDeg}deg)`;
    
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

  // 🔊 SALVAR PREFERÊNCIAS DE ÁUDIO
  function saveAudioPrefs() {
    localStorage.setItem('malleus_audio', JSON.stringify({
      musicEnabled,
      volume: bgMusic?.volume || 0.3
    }));
  }

  // 🔊 CARREGAR PREFERÊNCIAS DE ÁUDIO
  function loadAudioPrefs() {
    const prefs = JSON.parse(localStorage.getItem('malleus_audio') || '{}');
    if (prefs.volume && musicVolumeSlider) {
      musicVolumeSlider.value = prefs.volume;
    }
    if (bgMusic) {
      bgMusic.volume = prefs.volume || 0.3;
    }
    if (prefs.musicEnabled && toggleMusicBtn) {
      musicEnabled = false;
    }
  }

  // 🔊 PREVENÇÃO DE BLOQUEIO DE ÁUDIO
  // Solução: Tocar e pausar automaticamente para contornar autoplay policy
  function prepareAudio() {
    // Preparar música de fundo
    if (bgMusic) {
      bgMusic.volume = 0.01; // Volume mínimo para teste
      
      const playPromise = bgMusic.play();
      
      if (playPromise !== undefined) {
        playPromise.then(_ => {
          // Áudio carregado com sucesso - pausa imediatamente
          bgMusic.pause();
          bgMusic.currentTime = 0;
          bgMusic.volume = 0.3; // Restaura volume normal
          console.log("🎵 Áudio da Inquisição preparado e pronto!");
        })
        .catch(error => {
          // Navegador bloqueou - isso é esperado
          console.log("⚠ Áudio será ativado na primeira interação do usuário");
          bgMusic.volume = 0.3;
        });
      }
    }
    
    // Preparar som de tic-tac
    if (tickSound) {
      tickSound.volume = 0.01;
      const tickPromise = tickSound.play();
      
      if (tickPromise !== undefined) {
        tickPromise.then(_ => {
          tickSound.pause();
          tickSound.currentTime = 0;
          tickSound.volume = 0.1;
        })
        .catch(error => {
          console.log("⚠ Tic-tac será ativado no timer");
          tickSound.volume = 0.1;
        });
      }
    }
  }

  // Renderizar todos os contratos
  function renderTasks() {
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

    // Event listeners do contrato
    const startBtn = contract.querySelector('.btn-start');
    const completeBtn = contract.querySelector('.btn-complete');
    const editBtn = contract.querySelector('.btn-edit');
    const deleteBtn = contract.querySelector('.btn-delete');
    const contractTitle = contract.querySelector('.contract-title');

    contractTitle.addEventListener('click', function(e) {
      if (!e.target.closest('button')) {
        toggleContractExpansion(task.id);
      }
    });

    if (startBtn) {
      startBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        startTimerForTask(task.id);
      });
    }

    if (completeBtn) {
      completeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleTaskCompletion(task.id);
      });
    }

    editBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      editTask(task.id);
    });

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

  // Utilitário para escapar HTML
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

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

  // ==========================================
  // 🔊 FUNÇÕES DE ÁUDIO
  // ==========================================
  
  // Som de tic-tac sincronizado com o timer
  function playTickSound() {
    if (!tickEnabled || !timerRunning || !tickSound) return;
    
    const now = Date.now();
    if (now - lastTickTime > 900) { // Evita sobreposição
      tickSound.currentTime = 0;
      tickSound.volume = 0.1; // Volume baixo para não incomodar
      tickSound.play().catch(e => console.log("Tick offline:", e));
      lastTickTime = now;
    }
  }

  // ==========================================
  // SISTEMA DE TIMER
  // ==========================================
  
  // Iniciar timer para uma missão específica
  function startTimerForTask(taskId) {
    if (timerRunning && currentTaskId === taskId) {
      pauseTimer();
      return;
    }
    
    if (timerRunning) {
      pauseTimer();
    }
    
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    currentTaskId = taskId;
    currentTaskElement.textContent = `MISSÃO ATIVA: ${task.title}`;
    currentTaskElement.style.color = 'var(--blood-red)';
    currentTaskElement.style.textShadow = '0 0 10px var(--glow-red)';
    
    chronoStatus.classList.add('active');
    statusText.textContent = "EM OPERAÇÃO";
    statusText.style.color = 'var(--blood-red)';
    
    timerRunning = true;
    timerSeconds = task.timeSpent || 0;
    timerDisplay.textContent = formatTime(timerSeconds);
    
    pauseTimerBtn.disabled = false;
    resetTimerBtn.disabled = false;
    pauseTimerBtn.innerHTML = '<i class="fas fa-pause"></i> SUSPENDER';
    
    animateSecondHand();
    
    if (voxAudio) {
      voxAudio.currentTime = 0;
      voxAudio.volume = 0.3;
      voxAudio.play().catch(e => console.log("Vox offline: ", e));
    }
    
    timerInterval = setInterval(() => {
      timerSeconds++;
      timerDisplay.textContent = formatTime(timerSeconds);
      
      // 🔊 TOCAR TIC-TAC
      playTickSound();
      
      const taskIndex = tasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        tasks[taskIndex].timeSpent = timerSeconds;
        saveTasks();
        
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
      angle = (angle + 6) % 360;
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
    
    chronoStatus.classList.remove('active');
    statusText.textContent = "SUSPENSO";
    statusText.style.color = 'var(--parchment)';
    
    pauseTimerBtn.innerHTML = '<i class="fas fa-play"></i> RETOMAR';
    updateClockHands();
    
    // 🔊 PAUSAR TIC-TAC
    if (tickSound) {
      tickSound.pause();
      tickSound.currentTime = 0;
    }
  }

  // Retomar timer
  function resumeTimer() {
    if (timerRunning || !currentTaskId) return;
    timerRunning = true;
    
    chronoStatus.classList.add('active');
    statusText.textContent = "EM OPERAÇÃO";
    statusText.style.color = 'var(--blood-red)';
    
    timerInterval = setInterval(() => {
      timerSeconds++;
      timerDisplay.textContent = formatTime(timerSeconds);
      
      // 🔊 TOCAR TIC-TAC
      playTickSound();
      
      const taskIndex = tasks.findIndex(t => t.id === currentTaskId);
      if (taskIndex !== -1) {
        tasks[taskIndex].timeSpent = timerSeconds;
        saveTasks();
        
        const timeElement = document.querySelector(`.contract[data-id="${currentTaskId}"] .contract-time`);
        if (timeElement) {
          timeElement.innerHTML = `<i class="fas fa-stopwatch"></i> Tempo de Missão: ${formatTime(timerSeconds)}`;
        }
      }
    }, 1000);
    
    animateSecondHand();
    pauseTimerBtn.innerHTML = '<i class="fas fa-pause"></i> SUSPENDER';
  }

  // Resetar timer
  function resetTimer() {
    if (timerRunning) {
      clearInterval(timerInterval);
      timerRunning = false;
    }
    
    timerSeconds = 0;
    timerDisplay.textContent = formatTime(0);
    
    chronoStatus.classList.remove('active');
    statusText.textContent = "AGUARDANDO ORDEM";
    statusText.style.color = 'var(--parchment)';
    
    updateClockHands();
    
    if (currentTaskId) {
      const taskIndex = tasks.findIndex(t => t.id === currentTaskId);
      if (taskIndex !== -1) {
        tasks[taskIndex].timeSpent = 0;
        saveTasks();
        
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
    
    pauseTimerBtn.disabled = true;
    resetTimerBtn.disabled = true;
    pauseTimerBtn.innerHTML = '<i class="fas fa-pause"></i> SUSPENDER';
    
    // 🔊 RESETAR TIC-TAC
    if (tickSound) {
      tickSound.pause();
      tickSound.currentTime = 0;
    }
  }

  // ==========================================
  // GERENCIAMENTO DE CONTRATOS
  // ==========================================
  
  // Alternar conclusão da missão
  function toggleTaskCompletion(taskId) {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) return;
    
    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    
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
    
    taskTitle.value = task.title;
    taskDesc.value = task.description || '';
    taskBounty.value = task.bounty || '';
    taskTitle.focus();
    
    tasks.splice(taskIndex, 1);
    saveTasks();
    renderTasks();
    
    const registerBtn = document.querySelector('.btn-register');
    registerBtn.innerHTML = '<i class="fas fa-edit"></i> ATUALIZAR CONTRATO';
    registerBtn.style.background = 'linear-gradient(to bottom, var(--aqua-gold), var(--aqua-dim))';
    registerBtn.style.color = 'var(--void-dark)';
    
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

  // ==========================================
  // EVENT LISTENERS PRINCIPAIS
  // ==========================================
  
  // Submit do formulário
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
    
    taskForm.reset();
    taskTitle.focus();
    
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

  // Controles do timer
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

  // ==========================================
  // 🔊 EVENT LISTENERS DE ÁUDIO
  // ==========================================
  
  // Toggle música de fundo
  if (toggleMusicBtn) {
    toggleMusicBtn.addEventListener('click', function() {
      musicEnabled = !musicEnabled;
      
      if (musicEnabled) {
        if (bgMusic) {
          bgMusic.volume = parseFloat(musicVolumeSlider?.value || 0.3);
          bgMusic.play().catch(e => {
            console.log("Música bloqueada pelo navegador:", e);
            musicEnabled = false;
            showVoxMessage("⚠ Interação necessária para áudio");
          });
        }
        toggleMusicBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        toggleMusicBtn.style.borderColor = 'var(--aqua-gold)';
        toggleMusicBtn.style.boxShadow = '0 0 10px var(--glow-gold)';
        showVoxMessage("🎵 HINOS DA INQUISIÇÃO: ATIVADOS");
      } else {
        if (bgMusic) bgMusic.pause();
        toggleMusicBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        toggleMusicBtn.style.borderColor = '';
        toggleMusicBtn.style.boxShadow = '';
        showVoxMessage("🔇 SILÊNCIO TÁTICO: ATIVADO");
      }
      saveAudioPrefs();
    });
  }

  // Controle de volume
  if (musicVolumeSlider) {
    musicVolumeSlider.addEventListener('input', function() {
      if (bgMusic) {
        bgMusic.volume = parseFloat(this.value);
      }
    });
    musicVolumeSlider.addEventListener('change', saveAudioPrefs);
  }

  // Inicializar volume da música
  if (bgMusic) {
    bgMusic.volume = 0.3;
  }

  // ==========================================
  // FINALIZAÇÃO
  // ==========================================
  
  // Adicionar marca d'água da Inquisição
  const watermark = document.createElement('div');
  watermark.className = 'watermark';
  watermark.textContent = 'ORDO MALLEUS • AUTHORIZED PERSONNEL ONLY';
  document.body.appendChild(watermark);
  
}); // ← FIM DO DOMContentLoaded
