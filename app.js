// app.js — main application logic

(function() {
  // --- State ---
  let currentAlgo = 'greedy';
  let currentProblemIdx = 0;
  let currentLang = 'javascript';

  // --- Elements ---
  const tabs = document.querySelectorAll('.tab-btn');
  const editor = document.getElementById('codeEditor');
  const lineNumbers = document.getElementById('lineNumbers');
  const runBtn = document.getElementById('runBtn');
  const resetBtn = document.getElementById('resetBtn');
  const solutionBtn = document.getElementById('solutionBtn');
  const outputConsole = document.getElementById('outputConsole');
  const statusDot = document.getElementById('statusDot');
  const langSelect = document.getElementById('langSelect');
  const prevBtn = document.getElementById('prevProblem');
  const nextBtn = document.getElementById('nextProblem');
  const hintBtn = document.getElementById('hintBtn');
  const hintText = document.getElementById('hintText');
  const vizArea = document.getElementById('visualizerArea');
  const themeToggle = document.getElementById('themeToggle');

  // --- Load Problem ---
  function loadProblem() {
    const problems = PROBLEMS[currentAlgo];
    if (!problems || problems.length === 0) return;
    const p = problems[currentProblemIdx];

    document.getElementById('problemTitle').textContent = p.title;
    document.getElementById('problemDesc').textContent = p.description;
    document.getElementById('sampleInput').textContent = p.sampleInput;
    document.getElementById('sampleOutput').textContent = p.sampleOutput;

    const badge = document.getElementById('diffBadge');
    badge.textContent = p.difficulty;
    badge.className = 'difficulty-badge ' + p.difficulty;

    hintText.textContent = p.hint;
    hintText.classList.add('hidden');
    hintBtn.textContent = 'Show hint';

    document.getElementById('problemCounter').textContent =
      `${currentProblemIdx + 1} / ${problems.length}`;

    editor.value = currentLang === 'javascript' ? p.starterJS : p.starterPY;
    updateLineNumbers();
    clearOutput();

    if (p.visualizer) {
      Visualizer.render(p.visualizer, vizArea);
    } else {
      vizArea.innerHTML = '<p style="color:var(--text3);font-size:12px;padding:8px">Run your code to see the visualization.</p>';
    }
  }

  // --- Line Numbers ---
  function updateLineNumbers() {
    const lines = editor.value.split('\n').length;
    lineNumbers.innerHTML = Array.from({length: lines}, (_, i) =>
      `<div>${i + 1}</div>`
    ).join('');
  }

  editor.addEventListener('input', updateLineNumbers);
  editor.addEventListener('scroll', () => {
    lineNumbers.scrollTop = editor.scrollTop;
  });

  // Tab key inserts spaces
  editor.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      editor.value = editor.value.substring(0, start) + '  ' + editor.value.substring(end);
      editor.selectionStart = editor.selectionEnd = start + 2;
      updateLineNumbers();
    }
  });

  // --- Clear Output ---
  function clearOutput() {
    outputConsole.innerHTML = '<span class="console-placeholder">Run your code to see output...</span>';
    statusDot.className = 'status-dot';
  }

  function addOutput(text, type = 'info') {
    const line = document.createElement('div');
    line.className = `console-line ${type}`;
    line.textContent = text;
    outputConsole.appendChild(line);
    outputConsole.scrollTop = outputConsole.scrollHeight;
  }

  // --- Run Code ---
  runBtn.addEventListener('click', () => {
    if (currentLang === 'python') {
      outputConsole.innerHTML = '';
      addOutput('Python execution requires a backend server.', 'info');
      addOutput('To run Python: copy your code into https://replit.com or run locally.', 'info');
      addOutput('Tip: paste into python3 in your terminal!', 'info');
      statusDot.className = 'status-dot';
      return;
    }

    // JS execution
    outputConsole.innerHTML = '';
    statusDot.className = 'status-dot run';

    const logs = [];
    const origConsole = {
      log: console.log.bind(console),
      error: console.error.bind(console)
    };

    // Capture console.log
    console.log = (...args) => {
      logs.push({ text: args.map(a => typeof a === 'object' ? JSON.stringify(a,null,2) : String(a)).join(' '), type: 'info' });
      origConsole.log(...args);
    };
    console.error = (...args) => {
      logs.push({ text: args.join(' '), type: 'error' });
      origConsole.error(...args);
    };

    try {
      const fn = new Function(editor.value);
      fn();
      setTimeout(() => {
        console.log = origConsole.log;
        console.error = origConsole.error;
        if (logs.length === 0) {
          addOutput('Code ran successfully (no output).', 'success');
        } else {
          logs.forEach(l => addOutput(l.text, l.type));
          addOutput('\n✓ Done', 'success');
        }
        statusDot.className = 'status-dot pass';
      }, 50);
    } catch (err) {
      console.log = origConsole.log;
      console.error = origConsole.error;
      logs.forEach(l => addOutput(l.text, l.type));
      addOutput(`Error: ${err.message}`, 'error');
      statusDot.className = 'status-dot fail';
    }
  });

  // --- Reset ---
  resetBtn.addEventListener('click', () => {
    const p = PROBLEMS[currentAlgo][currentProblemIdx];
    editor.value = currentLang === 'javascript' ? p.starterJS : p.starterPY;
    updateLineNumbers();
    clearOutput();
  });

  // --- Solution ---
  solutionBtn.addEventListener('click', () => {
    const p = PROBLEMS[currentAlgo][currentProblemIdx];
    if (currentLang === 'javascript') {
      editor.value = p.solutionJS || p.starterJS;
    } else {
      editor.value = p.starterPY;
    }
    updateLineNumbers();
    outputConsole.innerHTML = '';
    addOutput('Solution loaded — study it, then try to rewrite it yourself!', 'info');
    statusDot.className = 'status-dot';
  });

  // --- Language Switch ---
  langSelect.addEventListener('change', (e) => {
    currentLang = e.target.value;
    const p = PROBLEMS[currentAlgo][currentProblemIdx];
    editor.value = currentLang === 'javascript' ? p.starterJS : p.starterPY;
    updateLineNumbers();
    clearOutput();
  });

  // --- Hint ---
  hintBtn.addEventListener('click', () => {
    const hidden = hintText.classList.toggle('hidden');
    hintBtn.textContent = hidden ? 'Show hint' : 'Hide hint';
  });

  // --- Navigation ---
  prevBtn.addEventListener('click', () => {
    const problems = PROBLEMS[currentAlgo];
    currentProblemIdx = (currentProblemIdx - 1 + problems.length) % problems.length;
    loadProblem();
  });

  nextBtn.addEventListener('click', () => {
    const problems = PROBLEMS[currentAlgo];
    currentProblemIdx = (currentProblemIdx + 1) % problems.length;
    loadProblem();
  });

  // --- Tab Switch ---
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentAlgo = tab.dataset.algo;
      currentProblemIdx = 0;
      loadProblem();
    });
  });

  // --- Theme Toggle ---
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
  });

  // --- Init ---
  loadProblem();
})();
