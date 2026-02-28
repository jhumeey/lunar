// ── CYCLE PROMPT WIDGET ──

const STORAGE_KEY = "orbyt_cycle_answers";

let answers = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
const saveAnswers = () =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));

const widgets = [
  {
    id: "intro",
    type: "intro",
    content: {
      title: "This Starts With You",
      body: "Each phase will ask you to pause and respond with intention. What you write here becomes the foundation for your progress.",
      button: "Proceed Mindfully",
    },
  },
  {
    id: "intention-q",
    type: "questions",
    phase: "Phase 1 · INTENTION",
    fields: [
      {
        key: "intention_commit",
        label: "What are you committing to?",
        placeholder: "Finish my portfolio case study",
      },
      {
        key: "intention_why",
        label: "Why does this matter right now?",
        placeholder: "Because I’ve been avoiding it and it’s holding me back.",
      },
    ],
  },
  {
    id: "intention-ack",
    type: "acknowledgement",
    phase: "Phase 1 · INTENTION",
    content: {
      title: "Intention set. Direction chosen.",
      button: "Commit Fully",
    },
  },
  {
    id: "focus-q",
    type: "questions",
    phase: "Phase 2 · FOCUS",
    fields: [
      {
        key: "focus_priority",
        label: "What is the one thing you will prioritize?",
        placeholder: "Complete the problem and research section first",
      },
    ],
    extras: {
      key: "focus_frequency",
      label: "When will you work on this?",
      options: ["Daily", "3× a week", "Once a week"],
    },
  },
  {
    id: "focus-ack",
    type: "acknowledgement",
    phase: "Phase 2 · FOCUS",
    content: {
      title: "Focus locked. Protect your energy.",
      button: "Build Momentum",
    },
  },
  {
    id: "complete-q",
    type: "questions",
    phase: "Phase 3 · COMPLETION",
    fields: [
      {
        key: "complete_step",
        label: "What is the next concrete step?",
        placeholder: "Complete the problem and research section first",
      },
      {
        key: "complete_when",
        label: "When will you complete this step?",
        placeholder: "By Thursday evening",
      },
    ],
  },
  {
    id: "complete-ack",
    type: "acknowledgement",
    phase: "Phase 3 · COMPLETION",
    content: {
      title: "Step defined. Momentum started.",
      button: "Finish Strong",
    },
  },
  {
    id: "release-q",
    type: "questions",
    phase: "Phase 4 · RELEASE",
    fields: [
      {
        key: "release_what",
        label: "What are you ready to release about this?",
        placeholder: "The need for it to be perfect",
      },
      {
        key: "release_learn",
        label: "What did you learn during this cycle?",
        placeholder: "I work better when I define smaller steps",
      },
    ],
  },
  {
    id: "release-ack",
    type: "acknowledgement",
    phase: "Phase 4 · RELEASE",
    content: {
      title: "Cycle complete. Space created.",
      button: "Close Cycle",
    },
  },
  {
    id: "done",
    type: "completion",
    content: {
      title: "You Kept Your Word",
      body: "You followed through on your commitment and completed the cycle. That kind of consistency builds real confidence.",
      button: "Begin Again",
    },
  },
];

// ── DOM refs ──
let current = 0;
const inner = document.getElementById("cycle-inner");

// ── SVGs ──
const arrowLeft = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20 8.73737V11.2626H4.84848L11.7929 18.2071L10 20L0 10L10 0L11.7929 1.79293L4.84848 8.73737H20Z" fill="#F5F7FA"/>
</svg>`;

const arrowRight = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 8.73737V11.2626H15.1515L8.20707 18.2071L10 20L20 10L10 0L8.20707 1.79293L15.1515 8.73737H0Z" fill="#F5F7FA"/>
</svg>`;

const phaseIconSvg = `<svg class="cw-phase-icon" width="67" height="60" viewBox="0 0 67 60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M60 30C60 22.5345 57.2164 15.3371 52.1932 9.81434C47.17 4.29153 40.268 0.840069 32.8359 0.134343C25.4038 -0.571383 17.9756 1.51934 12.0027 5.99799C6.02975 10.4766 1.9413 17.0214 0.536168 24.3535C-0.868962 31.6856 0.510195 39.2782 4.40417 45.6478C8.29814 52.0173 14.4271 56.7062 21.5936 58.7981C28.76 60.8901 36.449 60.2348 43.1581 56.9604C49.8672 53.686 55.1145 48.0277 57.8745 41.0911L53.9721 39.5384C51.5984 45.5038 47.0858 50.37 41.316 53.186C35.5461 56.002 28.9336 56.5655 22.7705 54.7664C16.6073 52.9673 11.3364 48.9349 7.98758 43.4571C4.63877 37.9793 3.45269 31.4496 4.6611 25.144C5.86952 18.8384 9.38559 13.2099 14.5223 9.35827C19.659 5.50663 26.0473 3.70861 32.4389 4.31553C38.8305 4.92246 44.7662 7.89071 49.0862 12.6403C53.4061 17.3899 55.8 23.5796 55.8 30H60Z" fill="#9FB3C8"/>
  <path d="M30 0C33.9397 4.69799e-08 37.8407 0.775973 41.4805 2.28361C45.1203 3.79126 48.4274 6.00104 51.2132 8.7868C53.999 11.5726 56.2087 14.8797 57.7164 18.5195C59.224 22.1593 60 26.0603 60 30L55.8 30C55.8 26.6119 55.1327 23.257 53.8361 20.1268C52.5395 16.9966 50.6391 14.1524 48.2434 11.7566C45.8476 9.36089 43.0034 7.46048 39.8732 6.16391C36.743 4.86734 33.3881 4.2 30 4.2V0Z" fill="#F5F7FA"/>
  <path d="M61.1626 28.177C61.1135 28.1115 61.0844 28.0332 61.0789 27.9515C61.0734 27.8699 61.0917 27.7884 61.1316 27.7169C61.1714 27.6454 61.2312 27.5871 61.3036 27.5489C61.376 27.5107 61.4579 27.4943 61.5394 27.5017C64.5934 27.7804 66.2981 30.1823 66.4831 32.6379C66.6682 35.0979 65.3341 37.7006 62.2801 38.3725C59.0726 39.0776 55.8087 36.7721 55.5019 33.4953C55.4942 33.4142 55.5102 33.3325 55.5478 33.2603C55.5854 33.188 55.6431 33.1281 55.714 33.0878C55.7848 33.0476 55.8658 33.0286 55.9471 33.0332C56.0285 33.0379 56.1068 33.0659 56.1726 33.1139C57.7729 34.2811 59.6023 33.8563 60.7621 32.7055C61.9207 31.5553 62.3415 29.7502 61.1626 28.177Z" fill="#F5F7FA"/>
</svg>`;

// ── HELPERS ──
function arrowBtn(dir, action) {
  return `<button class="cw-arrow cw-arrow--${dir}" onclick="${action}" aria-label="${dir === "prev" ? "Previous" : "Next"}">${dir === "prev" ? arrowLeft : arrowRight}</button>`;
}

function validateStep() {
  const w = widgets[current];
  if (w.type !== "questions") return true;
  let valid = true;
  w.fields.forEach((f) => {
    const el = document.getElementById(`field-${f.key}`);
    if (el && !el.value.trim()) {
      el.classList.add("cw-input--error");
      valid = false;
    }
  });
  if (w.extras) {
    const checked = document.querySelector(
      `input[name="${w.extras.key}"]:checked`,
    );
    const errorEl = document.getElementById(`extra-error-${w.extras.key}`);
    if (!checked) {
      if (errorEl) errorEl.style.opacity = "1";
      valid = false;
    }
  }
  return valid;
}

function saveStep() {
  const w = widgets[current];
  if (w.type !== "questions") return;
  w.fields.forEach((f) => {
    const el = document.getElementById(`field-${f.key}`);
    if (el) answers[f.key] = el.value.trim();
  });
  if (w.extras) {
    const checked = document.querySelector(
      `input[name="${w.extras.key}"]:checked`,
    );
    if (checked) answers[w.extras.key] = checked.value;
  }
  saveAnswers();
}

function goTo(index, dir = "next") {
  inner.classList.add(
    dir === "next" ? "cw-slide-out-left" : "cw-slide-out-right",
  );
  setTimeout(() => {
    current = index;
    render();
    inner.classList.remove("cw-slide-out-left", "cw-slide-out-right");
    inner.classList.add(
      dir === "next" ? "cw-slide-in-right" : "cw-slide-in-left",
    );
    setTimeout(
      () => inner.classList.remove("cw-slide-in-right", "cw-slide-in-left"),
      400,
    );
  }, 250);
}

function next() {
  if (!validateStep()) return;
  saveStep();
  if (current < widgets.length - 1) goTo(current + 1, "next");
}

function prev() {
  if (current > 0) goTo(current - 1, "prev");
}

function beginAgain() {
  answers = {};
  saveAnswers();
  goTo(0, "next");
}

function clearError(key) {
  const el = document.getElementById(`field-${key}`);
  if (el) el.classList.remove("cw-input--error");
}

// ── RENDER ──
function render() {
  const w = widgets[current];
  let html = "";

  // ── INTRO ──
  if (w.type === "intro") {
    html = `
      <div class="cw-content-wrapper">
        <div class="cw-frosted-layer">
          <div class="cw-gradient-inner">
            <div class="cw-fields-bg">
              <div class="cw-intro">
                <h3 class="cw-title">${w.content.title}</h3>
                <p class="cw-body">${w.content.body}</p>
              </div>
            </div>
          </div>
          <button class="btn cw-main-btn" onclick="next()">${w.content.button}</button>
        </div>
      </div>`;
  }

  // ── QUESTIONS ──
  else if (w.type === "questions") {
    const fieldInputs = w.fields
      .map((f, i) => {
        const saved = answers[f.key] || "";
        return `
        <textarea
          id="field-${f.key}"
          class="cw-input"
          rows="2"
          placeholder="${f.placeholder || "Write here…"}"
          oninput="clearError('${f.key}')"
        >${saved}</textarea>`;
      })
      .join("");

    const fieldLabels = w.fields
      .map((f, i) => {
        return `
        <div class="cw-field" style="--delay:${i * 0.08}s">
          <label class="cw-label" for="field-${f.key}">${f.label}</label>
        </div>`;
      })
      .join("");

    const fieldItems = w.fields
      .map((f, i) => {
        const saved = answers[f.key] || "";
        return `
        <div class="cw-field" style="--delay:${i * 0.08}s">
          <label class="cw-label" for="field-${f.key}">${f.label}</label>
          <div class="cw-gradient-inner">
            <div class="cw-fields-bg">
              <textarea
                id="field-${f.key}"
                class="cw-input"
                rows="2"
                placeholder="Write here…"
                oninput="clearError('${f.key}')"
              >${saved}</textarea>
            </div>
          </div>
        </div>`;
      })
      .join("");

    let extrasHtml = "";
    if (w.extras) {
      const optionItems = w.extras.options
        .map((opt) => {
          const isChecked = answers[w.extras.key] === opt;
          return `
          <label class="cw-chip ${isChecked ? "cw-chip--checked" : ""}">
            <input type="radio" name="${w.extras.key}" value="${opt}" ${isChecked ? "checked" : ""}
              onchange="
                this.closest('.cw-chips').querySelectorAll('.cw-chip').forEach(c => c.classList.remove('cw-chip--checked'));
                this.closest('.cw-chip').classList.add('cw-chip--checked');
                document.getElementById('extra-error-${w.extras.key}').style.opacity = '0';
              "/>
            ${opt}
          </label>`;
        })
        .join("");

      extrasHtml = `
        <div class="cw-field" style="--delay:${w.fields.length * 0.08}s">
          <label class="cw-label">${w.extras.label}</label>
          <div class="cw-chips">${optionItems}</div>
          <span id="extra-error-${w.extras.key}" class="cw-extra-error">Please select an option</span>
        </div>`;
    }

    html = `
      <div class="cw-content-wrapper">
        <div class="cw-phase-row">
          <p class="cw-phase-label">${w.phase}</p>
          ${phaseIconSvg}
        </div>
        <div class="cw-frosted-layer">
          <div class="cw-fields-list">
            ${fieldItems}
            ${extrasHtml}
          </div>
          <div class="cw-nav">
            ${current > 1 ? arrowBtn("prev", "prev()") : ""}
            ${arrowBtn("next", "next()")}
          </div>
        </div>
      </div>`;
  }

  // ── ACKNOWLEDGEMENT ──
  else if (w.type === "acknowledgement") {
    html = `
      <div class="cw-content-wrapper">
        <div class="cw-phase-row">
          <p class="cw-phase-label">${w.phase}</p>
          ${phaseIconSvg}
        </div>
        <div class="cw-frosted-layer">
          <div class="cw-gradient-inner">
            <div class="cw-fields-bg">
              <h3 class="cw-ack-title">${w.content.title}</h3>
            </div>
          </div>
          <button class="btn cw-main-btn" onclick="next()">${w.content.button}</button>
        </div>
      </div>`;
  }

  // ── COMPLETION ──
  else if (w.type === "completion") {
    html = `
      <div class="cw-content-wrapper">
        <div class="cw-frosted-layer">
          <div class="cw-completion-icon">
            <svg viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="20" stroke="rgba(140,200,160,0.5)" stroke-width="1.5"/>
              <path d="M14 24 L21 31 L34 17" stroke="rgba(160,220,180,0.9)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="cw-gradient-inner">
            <div class="cw-fields-bg">
              <h3 class="cw-ack-title">${w.content.title}</h3>
              <p class="cw-body" style="margin-bottom:0">${w.content.body}</p>
            </div>
          </div>
          <button class="btn cw-main-btn" onclick="beginAgain()">${w.content.button}</button>
        </div>
      </div>`;
  }

  inner.innerHTML = html;
}

// ── INIT ──
render();
