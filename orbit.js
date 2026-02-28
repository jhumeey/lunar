// ── STARS ──
const starsEl = document.getElementById("stars");

for (let i = 0; i < 220; i++) {
  const s = document.createElement("div");
  s.className = "star";
  let size;
  if (Math.random() > 0.92) {
    size = Math.random() * 3 + 2; // rare larger stars
  } else {
    size = Math.random() * 2 + 0.5;
  }
  s.style.cssText = `
    width:${size}px; height:${size}px;
    top:${Math.random() * 100}%;
    left:${Math.random() * 100}%;
    --d:${(Math.random() * 5 + 3).toFixed(1)}s;
    --delay:${(Math.random() * 6).toFixed(1)}s;
    --op:${(Math.random() * 0.7 + 0.2).toFixed(2)};
  `;
  starsEl.appendChild(s);
}

// ── PARALLAX MOUSE TRACKING ──
// ── PARALLAX (Mouse + Scroll Combined) ──
const hero = document.querySelector(".hero");
const moon = document.querySelector(".moon-texture");
const heroContent = document.querySelector(".hero-content");
const heroBg = document.querySelector(".hero-bg");

let mouseX = 0,
  mouseY = 0;
let currentX = 0,
  currentY = 0;

let scrollTarget = 0;
let currentScroll = 0;

let rafId = null;

function lerp(a, b, t) {
  return a + (b - a) * t;
}

// Detect touch
const isTouchDevice = () => window.matchMedia("(hover: none)").matches;

// ── Mouse movement (desktop only)
if (!isTouchDevice()) {
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
}

// ── Scroll depth (all devices)
window.addEventListener("scroll", () => {
  scrollTarget = window.scrollY;
  if (!rafId) rafId = requestAnimationFrame(animateParallax);
});

function animateParallax() {
  rafId = null;

  // Smooth mouse
  currentX = lerp(currentX, mouseX, 0.06);
  currentY = lerp(currentY, mouseY, 0.06);

  // Smooth scroll
  currentScroll = lerp(currentScroll, scrollTarget, 0.08);

  // Combine scroll + mouse movement
  const scrollDepthMoon = currentScroll * 0.18;
  const scrollDepthStars = currentScroll * 0.12;
  const scrollDepthBg = currentScroll * 0.06;
  const scrollDepthContent = currentScroll * 0.08;

//   moon.style.transform = `
//   translate(${currentX * -45}px, ${currentY * -30 + scrollDepthMoon}px)
// `;

  starsEl.style.transform = `
  translate(${currentX * -22}px, ${currentY * -16 + scrollDepthStars}px)
`;

  heroBg.style.transform = `
  translate(${currentX * -10}px, ${currentY * -6 + scrollDepthBg}px)
`;

  heroContent.style.transform = `
  translate(${currentX * 12}px, ${currentY * 8 + scrollDepthContent}px)
`;

  if (
    Math.abs(currentX - mouseX) > 0.001 ||
    Math.abs(currentY - mouseY) > 0.001 ||
    Math.abs(currentScroll - scrollTarget) > 0.5
  ) {
    rafId = requestAnimationFrame(animateParallax);
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
  { threshold: 0.12 },
);
reveals.forEach((r) => observer.observe(r));
