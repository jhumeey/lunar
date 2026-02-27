// ── CYCLE PROMPT WIDGET ──

const STORAGE_KEY = 'orbyt_cycle_answers';

// Load saved answers from localStorage
let answers = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

const saveAnswers = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));

// Widget definitions
const widgets = [
  // 1 — Intro
  {
    id: 'intro',
    type: 'intro',
    content: {
      title: 'This Starts With You',
      body: 'Each phase will ask you to pause and respond with intention. What you write here becomes the foundation for your progress.',
      button: 'Proceed Mindfully',
    }
  },
  // 2 — Phase 1: Questions
  {
    id: 'intention-q',
    type: 'questions',
    phase: 'Phase 1 · INTENTION',
    fields: [
      { key: 'intention_commit', label: 'What are you committing to?' },
      { key: 'intention_why',    label: 'Why does this matter right now?' },
    ]
  },
  // 3 — Phase 1: Acknowledgement
  {
    id: 'intention-ack',
    type: 'acknowledgement',
    phase: 'Phase 1 · INTENTION',
    content: {
      title: 'Intention set. Direction chosen.',
      button: 'Commit Fully',
    }
  },
  // 4 — Phase 2: Questions
  {
    id: 'focus-q',
    type: 'questions',
    phase: 'Phase 2 · FOCUS',
    fields: [
      { key: 'focus_priority', label: 'What is the one thing you will prioritize?' },
      { key: 'focus_when',     label: 'When will you work on this?' },
    ],
    extras: {
      key: 'focus_frequency',
      label: 'How often?',
      options: ['Daily', '3× a week', 'Once a week'],
    }
  },
  // 5 — Phase 2: Acknowledgement
  {
    id: 'focus-ack',
    type: 'acknowledgement',
    phase: 'Phase 2 · FOCUS',
    content: {
      title: 'Focus locked. Protect your energy.',
      button: 'Build Momentum',
    }
  },
  // 6 — Phase 3: Questions
  {
    id: 'complete-q',
    type: 'questions',
    phase: 'Phase 3 · COMPLETION',
    fields: [
      { key: 'complete_step', label: 'What is the next concrete step?' },
      { key: 'complete_when', label: 'When will you complete this step?' },
    ]
  },
  // 7 — Phase 3: Acknowledgement
  {
    id: 'complete-ack',
    type: 'acknowledgement',
    phase: 'Phase 3 · COMPLETION',
    content: {
      title: 'Step defined. Momentum started.',
      button: 'Finish Strong',
    }
  },
  // 8 — Phase 4: Questions
  {
    id: 'release-q',
    type: 'questions',
    phase: 'Phase 4 · RELEASE',
    fields: [
      { key: 'release_what',   label: 'What are you ready to release about this?' },
      { key: 'release_learn',  label: 'What did you learn during this cycle?' },
    ]
  },
  // 9 — Phase 4: Acknowledgement
  {
    id: 'release-ack',
    type: 'acknowledgement',
    phase: 'Phase 4 · RELEASE',
    content: {
      title: 'Cycle complete. Space created.',
      button: 'Close Cycle',
    }
  },
  // 10 — Completion
  {
    id: 'done',
    type: 'completion',
    content: {
      title: 'You Kept Your Word',
      body: 'You followed through on your commitment and completed the cycle. That kind of consistency builds real confidence.',
      button: 'Begin Again',
    }
  },
];

// ── RENDER ──
let current = 0;

const widget   = document.getElementById('cycle-widget');
const inner    = document.getElementById('cycle-inner');
const progress = document.getElementById('cycle-progress');

const phaseColors = {
  'Phase 1 · INTENTION': '#7b9cbf',
  'Phase 2 · FOCUS':     '#8faacc',
  'Phase 3 · COMPLETION':'#7ab8a0',
  'Phase 4 · RELEASE':   '#9aa8c8',
};

function arrowBtn(dir, action) {
  return `<button class="cw-arrow cw-arrow--${dir}" onclick="${action}" aria-label="${dir === 'prev' ? 'Previous' : 'Next'}">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      ${dir === 'prev'
        ? '<polyline points="15 18 9 12 15 6"/>'
        : '<polyline points="9 6 15 12 9 18"/>'}
    </svg>
  </button>`;
}

function validateStep() {
  const w = widgets[current];
  if (w.type !== 'questions') return true;
  let valid = true;
  w.fields.forEach(f => {
    const el = document.getElementById(`field-${f.key}`);
    if (el && !el.value.trim()) {
      el.classList.add('cw-input--error');
      valid = false;
    }
  });
  if (w.extras) {
    const checked = document.querySelector(`input[name="${w.extras.key}"]:checked`);
    const errorEl = document.getElementById(`extra-error-${w.extras.key}`);
    if (!checked) {
      if (errorEl) errorEl.style.opacity = '1';
      valid = false;
    }
  }
  return valid;
}

function saveStep() {
  const w = widgets[current];
  if (w.type !== 'questions') return;
  w.fields.forEach(f => {
    const el = document.getElementById(`field-${f.key}`);
    if (el) answers[f.key] = el.value.trim();
  });
  if (w.extras) {
    const checked = document.querySelector(`input[name="${w.extras.key}"]:checked`);
    if (checked) answers[w.extras.key] = checked.value;
  }
  saveAnswers();
}

function goTo(index, dir = 'next') {
  inner.classList.add(dir === 'next' ? 'cw-slide-out-left' : 'cw-slide-out-right');
  setTimeout(() => {
    current = index;
    render();
    inner.classList.remove('cw-slide-out-left', 'cw-slide-out-right');
    inner.classList.add(dir === 'next' ? 'cw-slide-in-right' : 'cw-slide-in-left');
    setTimeout(() => inner.classList.remove('cw-slide-in-right', 'cw-slide-in-left'), 400);
  }, 250);
}

function next() {
  if (!validateStep()) return;
  saveStep();
  if (current < widgets.length - 1) goTo(current + 1, 'next');
}

function prev() {
  if (current > 0) goTo(current - 1, 'prev');
}

function beginAgain() {
  answers = {};
  saveAnswers();
  goTo(0, 'next');
}

function clearError(key) {
  const el = document.getElementById(`field-${key}`);
  if (el) el.classList.remove('cw-input--error');
}

function render() {
  const w = widgets[current];
  const total = widgets.length;
  const pct = ((current) / (total - 1)) * 100;

  // Progress bar
  progress.style.width = pct + '%';

  // Phase accent color
  const color = w.phase ? phaseColors[w.phase] : 'rgba(255,255,255,0.4)';

  let html = '';

  if (w.type === 'intro') {
    html = `
      <div class="cw-intro">
        <div class="cw-moon-icon">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <path d="M16 3a13 13 0 1 0 10.5 20.6A9 9 0 0 1 16 3z" fill="rgba(200,220,255,0.85)"/>
          </svg>
        </div>
        <h3 class="cw-title">${w.content.title}</h3>
        <p class="cw-body">${w.content.body}</p>
        <button class="btn cw-main-btn" onclick="next()">${w.content.button}</button>
      </div>`;
  }

  else if (w.type === 'questions') {
    const fieldItems = w.fields.map((f, i) => {
      const saved = answers[f.key] || '';
      return `
        <div class="cw-field" style="--delay:${i * 0.08}s">
          <label class="cw-label" for="field-${f.key}">${f.label}</label>
          <textarea
            id="field-${f.key}"
            class="cw-input"
            rows="2"
            placeholder="Write here…"
            oninput="clearError('${f.key}')"
          >${saved}</textarea>
        </div>`;
    }).join('');

    let extrasHtml = '';
    if (w.extras) {
      const optionItems = w.extras.options.map(opt => {
        const checked = answers[w.extras.key] === opt ? 'checked' : '';
        return `
          <label class="cw-chip ${checked ? 'cw-chip--checked' : ''}">
            <input type="radio" name="${w.extras.key}" value="${opt}" ${checked}
              onchange="this.closest('.cw-chips').querySelectorAll('.cw-chip').forEach(c=>c.classList.remove('cw-chip--checked')); this.closest('.cw-chip').classList.add('cw-chip--checked'); document.getElementById('extra-error-${w.extras.key}').style.opacity='0'"/>
            ${opt}
          </label>`;
      }).join('');
      extrasHtml = `
        <div class="cw-field" style="--delay:${w.fields.length * 0.08}s">
          <label class="cw-label">${w.extras.label}</label>
          <div class="cw-chips">${optionItems}</div>
          <span id="extra-error-${w.extras.key}" class="cw-extra-error">Please select an option</span>
        </div>`;
    }

    const hasPrev = current > 0;
    html = `
      <div class="cw-questions">
        <p class="cw-phase-label" style="color:${color}">${w.phase}</p>
        ${fieldItems}
        ${extrasHtml}
        <div class="cw-nav">
          ${hasPrev ? arrowBtn('prev', 'prev()') : '<span></span>'}
          ${arrowBtn('next', 'next()')}
        </div>
      </div>`;
  }

  else if (w.type === 'acknowledgement') {
    html = `
      <div class="cw-ack">
        <p class="cw-phase-label" style="color:${color}">${w.phase}</p>
        <h3 class="cw-ack-title">${w.content.title}</h3>
        <button class="btn cw-main-btn" onclick="next()">${w.content.button}</button>
      </div>`;
  }

  else if (w.type === 'completion') {
    html = `
      <div class="cw-completion">
        <div class="cw-completion-icon">
          <svg viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="20" stroke="rgba(140,200,160,0.5)" stroke-width="1.5"/>
            <path d="M14 24 L21 31 L34 17" stroke="rgba(160,220,180,0.9)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h3 class="cw-title">${w.content.title}</h3>
        <p class="cw-body">${w.content.body}</p>
        <button class="btn cw-main-btn" onclick="beginAgain()">${w.content.button}</button>
      </div>`;
  }

  inner.innerHTML = html;
}

// Init
render();