// ── CYCLE SUMMARY CARD ──
// Call generateSummaryCard() after cycle completion to show and download the card

function generateSummaryCard() {
  const date = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });

  // Pull answers from localStorage
  const saved = JSON.parse(localStorage.getItem("orbyt_cycle_answers") || "{}");

  const phases = [
    {
      number: "01",
      label: "INTENTION",
      color: "#9FB3C8",
      entries: [
        { q: "Committed to", a: saved.intention_commit || "—" },
        { q: "Why it matters", a: saved.intention_why || "—" },
      ]
    },
    {
      number: "02",
      label: "FOCUS",
      color: "#8A9EC0",
      entries: [
        { q: "Priority", a: saved.focus_priority || "—" },
        { q: "When", a: saved.focus_when || "—" },
        { q: "Frequency", a: saved.focus_frequency || "—" },
      ]
    },
    {
      number: "03",
      label: "COMPLETION",
      color: "#7B9BB8",
      entries: [
        { q: "Next step", a: saved.complete_step || "—" },
        { q: "Deadline", a: saved.complete_when || "—" },
      ]
    },
    {
      number: "04",
      label: "RELEASE",
      color: "#E6C47A",
      entries: [
        { q: "Released", a: saved.release_what || "—" },
        { q: "Learned", a: saved.release_learn || "—" },
      ]
    },
  ];

  // Build modal overlay
  const overlay = document.createElement("div");
  overlay.id = "summary-overlay";
  overlay.innerHTML = `
    <div class="sc-backdrop"></div>
    <div class="sc-modal">
      <div class="sc-actions">
        <button class="sc-close" onclick="closeSummaryCard()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <button class="sc-download" onclick="downloadCard()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Save as image
        </button>
      </div>

      <!-- THE CARD — this is what gets captured -->
      <div class="sc-card" id="summary-card">

        <!-- Star field -->
        <div class="sc-stars" id="sc-stars"></div>

        <!-- Header -->
        <div class="sc-header">
          <div class="sc-header-left">
            <p class="sc-eyebrow">Cycle Complete</p>
            <h2 class="sc-headline">${saved.intention_commit || "A cycle completed."}</h2>
          </div>
          <div class="sc-header-right">
            <div class="sc-orbit-icon">
              <svg width="52" height="52" viewBox="0 0 67 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M60 30C60 22.5345 57.2164 15.3371 52.1932 9.81434C47.17 4.29153 40.268 0.840069 32.8359 0.134343C25.4038 -0.571383 17.9756 1.51934 12.0027 5.99799C6.02975 10.4766 1.9413 17.0214 0.536168 24.3535C-0.868962 31.6856 0.510195 39.2782 4.40417 45.6478C8.29814 52.0173 14.4271 56.7062 21.5936 58.7981C28.76 60.8901 36.449 60.2348 43.1581 56.9604C49.8672 53.686 55.1145 48.0277 57.8745 41.0911L53.9721 39.5384C51.5984 45.5038 47.0858 50.37 41.316 53.186C35.5461 56.002 28.9336 56.5655 22.7705 54.7664C16.6073 52.9673 11.3364 48.9349 7.98758 43.4571C4.63877 37.9793 3.45269 31.4496 4.6611 25.144C5.86952 18.8384 9.38559 13.2099 14.5223 9.35827C19.659 5.50663 26.0473 3.70861 32.4389 4.31553C38.8305 4.92246 44.7662 7.89071 49.0862 12.6403C53.4061 17.3899 55.8 23.5796 55.8 30H60Z" fill="#9FB3C8" opacity="0.7"/>
                <path d="M30 0C33.9397 4.69799e-08 37.8407 0.775973 41.4805 2.28361C45.1203 3.79126 48.4274 6.00104 51.2132 8.7868C53.999 11.5726 56.2087 14.8797 57.7164 18.5195C59.224 22.1593 60 26.0603 60 30L55.8 30C55.8 26.6119 55.1327 23.257 53.8361 20.1268C52.5395 16.9966 50.6391 14.1524 48.2434 11.7566C45.8476 9.36089 43.0034 7.46048 39.8732 6.16391C36.743 4.86734 33.3881 4.2 30 4.2V0Z" fill="rgba(255,255,255,0.9)"/>
                <path d="M61.1626 28.177C61.1135 28.1115 61.0844 28.0332 61.0789 27.9515C61.0734 27.8699 61.0917 27.7884 61.1316 27.7169C61.1714 27.6454 61.2312 27.5871 61.3036 27.5489C61.376 27.5107 61.4579 27.4943 61.5394 27.5017C64.5934 27.7804 66.2981 30.1823 66.4831 32.6379C66.6682 35.0979 65.3341 37.7006 62.2801 38.3725C59.0726 39.0776 55.8087 36.7721 55.5019 33.4953C55.4942 33.4142 55.5102 33.3325 55.5478 33.2603C55.5854 33.188 55.6431 33.1281 55.714 33.0878C55.7848 33.0476 55.8658 33.0286 55.9471 33.0332C56.0285 33.0379 56.1068 33.0659 56.1726 33.1139C57.7729 34.2811 59.6023 33.8563 60.7621 32.7055C61.9207 31.5553 62.3415 29.7502 61.1626 28.177Z" fill="rgba(255,255,255,0.9)"/>
              </svg>
            </div>
            <p class="sc-date">${date}</p>
          </div>
        </div>

        <!-- Divider -->
        <div class="sc-divider"></div>

        <!-- Phases grid -->
        <div class="sc-phases">
          ${phases.map(p => `
            <div class="sc-phase">
              <div class="sc-phase-header">
                <span class="sc-phase-num" style="color:${p.color}">${p.number}</span>
                <span class="sc-phase-label" style="color:${p.color}">${p.label}</span>
              </div>
              <div class="sc-phase-entries">
                ${p.entries.map(e => `
                  <div class="sc-entry">
                    <p class="sc-entry-q">${e.q}</p>
                    <p class="sc-entry-a">${e.a}</p>
                  </div>
                `).join("")}
              </div>
            </div>
          `).join("")}
        </div>

        <!-- Footer -->
        <div class="sc-footer">
          <div class="sc-footer-brand">
            <span class="sc-logo-text">Orbyt</span>
            <span class="sc-tagline">One cycle at a time, one goal at a time.</span>
          </div>
          <div class="sc-footer-check">
            <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="20" stroke="rgba(159,179,200,0.4)" stroke-width="1.5"/>
              <path d="M14 24 L21 31 L34 17" stroke="rgba(159,179,200,0.9)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="sc-footer-label">Cycle complete</span>
          </div>
        </div>

      </div>
      <!-- end .sc-card -->
    </div>
  `;

  document.body.appendChild(overlay);

  // Generate stars
  const starsEl = document.getElementById("sc-stars");
  for (let i = 0; i < 60; i++) {
    const s = document.createElement("div");
    s.className = "sc-star";
    const size = Math.random() < 0.7 ? Math.random() * 1.5 + 0.5 : Math.random() * 2 + 1.5;
    s.style.cssText = `
      width:${size}px; height:${size}px;
      top:${Math.random() * 100}%;
      left:${Math.random() * 100}%;
      opacity:${Math.random() * 0.5 + 0.2};
      animation-duration:${Math.random() * 3 + 2}s;
      animation-delay:${Math.random() * 5}s;
    `;
    starsEl.appendChild(s);
  }

  // Animate in
  requestAnimationFrame(() => {
    overlay.classList.add("sc-visible");
  });
}

function closeSummaryCard() {
  const overlay = document.getElementById("summary-overlay");
  if (overlay) {
    overlay.classList.remove("sc-visible");
    setTimeout(() => overlay.remove(), 300);
  }
}

async function downloadCard() {
  const card = document.getElementById("summary-card");
  if (!card) return;

  const btn = document.querySelector(".sc-download");
  btn.textContent = "Generating…";
  btn.disabled = true;

  try {
    // Use html2canvas loaded from CDN
    if (typeof html2canvas === "undefined") {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
      document.head.appendChild(script);
      await new Promise((res, rej) => { script.onload = res; script.onerror = rej; });
    }

    const canvas = await html2canvas(card, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
      logging: false,
    });

    const link = document.createElement("a");
    link.download = `orbyt-cycle-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch (err) {
    console.error("Download failed:", err);
  } finally {
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Save as image`;
    btn.disabled = false;
  }
}