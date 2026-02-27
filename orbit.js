// ── STARS ──
const starsEl = document.getElementById("stars");
for (let i = 0; i < 120; i++) {
  const s = document.createElement("div");
  s.className = "star";
  const size = Math.random() * 2.5 + 0.5;
  s.style.cssText = `
    width:${size}px; height:${size}px;
    top:${Math.random() * 100}%;
    left:${Math.random() * 100}%;
    --d:${(Math.random() * 5 + 3).toFixed(1)}s;
    --delay:${(Math.random() * 6).toFixed(1)}s;
    --op:${(Math.random() * 0.5 + 0.3).toFixed(2)};
  `;
  starsEl.appendChild(s);
}

// ── PARALLAX MOUSE TRACKING ──
// Only runs on non-touch devices
const isTouchDevice = () => window.matchMedia("(hover: none)").matches;

if (!isTouchDevice()) {
  const hero = document.querySelector(".hero");
  const moon = document.querySelector(".moon-texture");
  const heroContent = document.querySelector(".hero-content");
  const heroBg = document.querySelector(".hero-bg");

  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;
  let rafId = null;

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    if (!rafId) rafId = requestAnimationFrame(animateParallax);
  });

  hero.addEventListener("mouseleave", () => {
    mouseX = 0;
    mouseY = 0;
  });

  function animateParallax() {
    rafId = null;

    currentX = lerp(currentX, mouseX, 0.06);
    currentY = lerp(currentY, mouseY, 0.06);

    moon.style.transform         = `translate(${currentX * -28}px, ${currentY * -18}px)`;
    starsEl.style.transform      = `translate(${currentX * -14}px, ${currentY * -10}px)`;
    heroBg.style.transform       = `translate(${currentX * -6}px,  ${currentY * -4}px)`;
    heroContent.style.transform  = `translate(${currentX * 6}px,   ${currentY * 4}px)`;

    if (
      Math.abs(currentX - mouseX) > 0.001 ||
      Math.abs(currentY - mouseY) > 0.001
    ) {
      rafId = requestAnimationFrame(animateParallax);
    }
  }
}

// ── SCROLL REVEAL ──
const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 }
);
reveals.forEach((r) => observer.observe(r));