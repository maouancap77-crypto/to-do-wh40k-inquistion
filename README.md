# to-do-wh40k-inquistion
# 🪖 ORDO MALLEUS: MISSION LOG 🪖
### *Sistema de Gestão de Contratos para Caçadores de Recompensas da Inquisição*

```
☠️ "PURGE THE UNCLEAN" ☠️
```

> **Aviso Inquisitorial**: Este aplicativo é uma ferramenta de produtividade temática inspirada no universo de **Warhammer 40,000**. Não possui afiliação oficial com a Games Workshop. Use com fé e discrição.

---

## 📜 Índice

1. [Visão Geral](#-visão-geral)
2. [Funcionalidades](#-funcionalidades)
3. [Pré-requisitos](#-pré-requisitos)
4. [Instalação e Uso](#-instalação-e-uso)
5. [Estrutura de Arquivos](#-estrutura-de-arquivos)
6. [Personalização](#-personalização)
7. [Glossário Temático](#-glossário-temático)
8. [Solução de Problemas](#-solução-de-problemas)
9. [Créditos e Licença](#-créditos-e-licença)
10. [Juramento do Inquisidor](#-juramento-do-inquisidor)

---

## 👁️ Visão Geral

O **Ordo Malleus: Mission Log** é um aplicativo de lista de tarefas (to-do list) reimaginado como um terminal de caçador de recompensas da Inquisição Imperial.

Perfeito para:
- 🎲 Mestres de RPG que rodam campanhas de Warhammer 40K
- ⚔️ Fãs do universo grimdark que querem organizar suas atividades
- 💻 Desenvolvedores que buscam um projeto front-end temático para estudar
- 🎨 Designers que desejam referências de UI/UX com estética retro-futurista

**Tecnologias Utilizadas**:
- HTML5 semântico
- CSS3 com variáveis, animações e gradientes
- JavaScript puro (Vanilla JS)
- localStorage para persistência de dados
- Fontes Google: `Orbitron` + `Cinzel`
- Ícones: Font Awesome 6.4

---

## ⚙️ Funcionalidades

### ✅ Núcleo
| Funcionalidade | Descrição |
|---------------|-----------|
| 📋 Registrar Contrato | Adicione novas missões com título, descrição e recompensa em Thrones |
| ⏱️ Chrono-Tracker | Cronômetro integrado para medir tempo de missão com animação de ponteiros |
| ✅ Purgar Alvo | Marque contratos como concluídos com efeito visual dramático |
| ✏️ Editar Contrato | Modifique missões registradas antes da execução |
| 🗄️ Arquivar Contrato | Remova permanentemente contratos do registro |
| 📊 Estatísticas em Tempo Real | Total, purgados e pendentes atualizados dinamicamente |
| 💾 Persistência Local | Dados salvos automaticamente no localStorage do navegador |

### 🎨 Estética & Imersão
| Recurso | Descrição |
|---------|-----------|
| 🎭 Tema Grimdark | Paleta de cores inspirada no Imperium: preto do vácuo, vermelho sangue, dourado aquila |
| ✨ Efeitos Visuais | Glow, scanlines, animações de pulso, glitch sutil e partículas de fundo |
| 🔊 Feedback Sonoro | Efeitos de "vox-caster" opcionais para ações importantes |
| 📱 Responsivo | Funciona em desktop, tablet e mobile para missões em campo |
| ♿ Acessível | Foco visível, contrastes adequados e navegação por teclado |

### 🎮 Experiência do Usuário
- Mensagens contextuais no estilo "transmissão de vox"
- Confirmações dramáticas para ações irreversíveis
- Animações de entrada para novos contratos
- Expansão/recolhimento de detalhes da missão com clique
- Indicador visual de status do cronômetro (luz de operação)

---

## 🛠️ Pré-requisitos

Nenhum! O aplicativo roda diretamente no navegador.

**Recomendado**:
- Navegador moderno (Chrome 90+, Firefox 88+, Edge 90+, Safari 14+)
- Conexão com internet para carregar fontes e ícones (CDN)
- JavaScript habilitado

> 💡 **Modo Offline**: Após o primeiro carregamento, você pode usar offline. Para uso 100% offline, baixe as fontes e ícones localmente e ajuste os links no `<head>`.

---

## 🚀 Instalação e Uso

### Método Rápido (Recomendado)
1. **Clone ou baixe** os arquivos:
   ```
   📁 ordo-malleus-mission-log/
   ├── 📄 index.html
   ├── 🎨 style.css
   └── ⚙️ script.js
   ```

2. **Abra o arquivo** `index.html` diretamente no seu navegador:
   - Clique duplo no arquivo, OU
   - Arraste para uma aba do navegador, OU
   - Use `file:///caminho/para/index.html`

3. **Comece a caçar**:
   - Preencha o formulário "Registrar Novo Contrato"
   - Clique em **REGISTRAR CONTRATO**
   - Use o Chrono-Tracker para cronometrar suas missões
   - Marque como **PURGADO** ao concluir

### Método Desenvolvedor
```bash
# Clone o repositório (se hospedado)
git clone https://github.com/seu-usuario/ordo-malleus.git
cd ordo-malleus

# Abra com servidor local (opcional, para evitar restrições de CORS)
# Usando Python:
python -m http.server 8000
# Usando Node.js com live-server:
npx live-server

# Acesse em: http://localhost:8000
```

---

## 📁 Estrutura de Arquivos

```
ordo-malleus-mission-log/
│
├── 📄 index.html          # Estrutura principal e markup semântico
├── 🎨 style.css           # Estilos temáticos, animações e responsividade
├── ⚙️ script.js           # Lógica de aplicação, timer e persistência
│
├── 📁 assets/ (opcional)  # Para recursos locais se usar offline
│   ├── 🎵 sounds/         # Efeitos sonoros personalizados
│   └── 🖼️ images/         # Texturas e ícones customizados
│
├── 📄 README.md           # Este arquivo
└── 📄 LICENSE             # Licença de uso (MIT recomendado)
```

---

## 🎨 Personalização

### Alterar Cores do Tema
Edite as variáveis CSS em `:root` no arquivo `style.css`:

```css
:root {
    --void-black: #0a0a0f;        /* Fundo principal */
    --blood-red: #8a0303;          /* Destaque de ação/perigo */
    --aqua-gold: #c9a227;          /* Destaque imperial/dourado */
    --purity-white: #e8e4d4;       /* Texto principal */
    /* ... outras variáveis */
}
```

### Alterar Fontes
No `<head>` do `index.html`, substitua os links do Google Fonts:

```html
<!-- Exemplo: Fonte mais gótica -->
<link href="https://fonts.googleapis.com/css2?family=MedievalSharp&family=Share+Tech+Mono&display=swap" rel="stylesheet">
```

E atualize no CSS:
```css
body {
    font-family: 'MedievalSharp', serif; /* Para texto */
}
.inquisition-header h1 {
    font-family: 'Share Tech Mono', monospace; /* Para títulos */
}
```

### Alterar Ícones
Todos os ícones usam **Font Awesome 6.4**. Para trocar:
1. Consulte a galeria: https://fontawesome.com/icons
2. Substitua as classes `fa-*` nos elementos HTML
3. Exemplo: `<i class="fas fa-skull"></i>` → `<i class="fas fa-dragon"></i>`

### Adicionar Novos Efeitos Sonoros
1. Baixe um arquivo `.mp3` ou `.wav` compatível
2. Coloque na pasta `assets/sounds/`
3. Atualize a tag `<audio>` no `index.html`:
   ```html
   <audio id="vox-audio" preload="auto">
       <source src="assets/sounds/meu-efeito.mp3" type="audio/mpeg">
   </audio>
   ```

### Traduzir para Outro Idioma
O projeto está em **português do Brasil**. Para traduzir:
1. Localize todas as strings de texto no `index.html` e `script.js`
2. Substitua pelos textos no idioma desejado
3. Atualize o atributo `lang` no `<html>`: `<html lang="en">`

> 💡 **Dica Pro**: Para uma solução escalável, considere extrair os textos para um arquivo `i18n.js` com objetos de tradução.

---

## 📖 Glossário Temático

| Termo do App | Significado no Lore 40K | Uso Prático |
|-------------|------------------------|-------------|
| **Contrato** | Missão de caça concedida pela Inquisição | Tarefa a ser executada |
| **Alvo** | Herege, xenos ou traidor a ser eliminado | Item da to-do list |
| **Purgado** | Alvo eliminado; missão concluída com sucesso | Tarefa marcada como feita |
| **Thrones** | Moeda do Imperium (Throne Gelt) | Valor/recompensa da tarefa |
| **Chrono-Tracker** | Dispositivo de medição temporal imperial | Cronômetro da tarefa |
| **Vox** | Sistema de comunicação por áudio | Mensagens de feedback |
| **Cogitador** | Computador/terminal de dados | localStorage do navegador |
| **Inquisidor** | Agente de elite com autoridade absoluta | Você, o usuário |

---

## 🔧 Solução de Problemas

| Problema | Possível Causa | Solução |
|----------|---------------|---------|
| 🎨 Estilos não carregam | CDN do Font Awesome/Google Fonts bloqueada | Verifique conexão; use versão offline dos recursos |
| ⏱️ Timer não funciona | JavaScript desabilitado no navegador | Ative JavaScript nas configurações |
| 💾 Dados não salvam | localStorage cheio ou bloqueado | Limpe dados do site ou use modo anônimo para teste |
| 🔊 Sem som | Autoplay bloqueado pelo navegador | Interaja com a página primeiro; verifique volume |
| 📱 Layout quebrado | Navegador muito antigo | Atualize para versão recente do Chrome/Firefox |
| ⌨️ Teclado não navega | Foco CSS removido acidentalmente | Não remova os estilos `:focus` do CSS |

### Console de Depuração
Pressione `F12` → Aba **Console** para ver mensagens de erro. Procure por:
- `404` = Arquivo não encontrado
- `CORS` = Problema de carregamento de recursos externos
- `Uncaught TypeError` = Erro de JavaScript

---

## ⚖️ Créditos e Licença

### Agradecimentos
- 🎨 **Games Workshop** – Por criar o universo épico de Warhammer 40,000
- 🌐 **Google Fonts** – Pelas fontes `Orbitron` e `Cinzel`
- 🔷 **Font Awesome** – Pelos ícones vetoriais
- 🔊 **Mixkit** – Pelos efeitos sonoros livres de royalties
- 💙 **Comunidade Dev** – Por inspiração e feedback

### Licença
Este projeto é distribuído sob a licença **MIT**.

```
MIT License

Copyright (c) 2026 Ordo Malleus Project

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### Aviso de Marca Registrada
> Warhammer 40,000, Ordo Malleus, Imperium of Man e todos os termos relacionados são marcas registradas da **Games Workshop Ltd**. Este é um projeto de fã sem fins lucrativos, criado para fins educacionais e de entretenimento. Não há afiliação oficial. Apoie os criadores adquirindo produtos oficiais em [warhammer-community.com](https://www.warhammer-community.com).

---

## 🩸 Juramento do Inquisidor

```
☩ Pelo Sangue do Imperador e a Luz Eterna do Trono Dourado, eu juro: ☩

• Manter meus contratos em ordem, pois a desorganização é o primeiro passo para a heresia.
• Usar o Chrono-Tracker com sabedoria, pois o tempo é um recurso que não pode ser ressuscitado.
• Purgar apenas alvos designados, pois a justiça sem disciplina é caos.
• Compartilhar esta ferramenta apenas com aqueles de coração puro e lealdade inabalável.

Que o Deus-Imperador proteja sua eficiência.
Que seus dados nunca sejam corrompidos pelo Caos.
Que sua lista esteja sempre atualizada.

🪖 PURGE THE UNCLEAN. 🪖
```

---
> ** https://maouancap77-crypto.github.io/to-do-wh40k-inquistion/**
> **Última Atualização**: Fevereiro de 2026  
> **Versão**: 1.0.0 "First Purge"  
> **Contato**: github.com/maouancap77-crypto

*Este documento foi gerado no Cogitador da Inquisição. Qualquer semelhança com manuais de produtividade convencionais é mera coincidência herética.* ☠️
