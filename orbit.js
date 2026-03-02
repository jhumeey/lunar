// if (!sessionStorage.getItem("lunarPlayed")) {
//   document.body.classList.add("loading");
// } else {
//   const loader = document.getElementById("lunarLoader");
//   if (loader) loader.remove();

//   const hero = document.querySelector(".hero");
//   hero.style.opacity = "1";
//   hero.style.transform = "translateY(0)";
// }

document.body.classList.add("loading");

const svg = document.getElementById("horseSVG");
const stage = document.querySelector(".loader-stage");
const svgRect = svg.getBoundingClientRect();

const paths = svg.querySelectorAll("path");
const dots = [];

paths.forEach((path) => {
  const bbox = path.getBBox();

  const centerX = bbox.x + bbox.width / 2;
  const centerY = bbox.y + bbox.height / 2;

  const dot = document.createElement("div");
  dot.className = "constellation-dot";

  // Save final position
  dot.dataset.rawX = centerX;
  dot.dataset.rawY = centerY;

  // Start scattered randomly
  dot.style.transform = `
    translate(
      ${Math.random() * 600 - 300}px,
      ${Math.random() * 400 - 200}px
    )
  `;

  stage.appendChild(dot);
  dots.push(dot);
});

const STAGGER = 6;
const TRANSITION_DURATION = 2200; // 2.2s
const START_DELAY = 300;

const totalFormationTime =
  START_DELAY + dots.length * STAGGER + TRANSITION_DURATION;

svg.style.opacity = "0";

function formHorse() {
  const scaleX = svgRect.width / 825;
  const scaleY = svgRect.height / 738;
  dots.forEach((dot, i) => {
    setTimeout(() => {
      const finalX = dot.dataset.rawX * scaleX;
      const finalY = dot.dataset.rawY * scaleY;

      dot.style.transform = `translate(${finalX}px, ${finalY}px)`;
    }, i * STAGGER);
  });
}

window.addEventListener("load", () => {
  setTimeout(formHorse, START_DELAY);

  // Glow pulse AFTER formation completes
  setTimeout(() => {
    dots.forEach((dot) => {
      dot.style.boxShadow = "0 0 12px rgba(230,196,122,0.9)";
    });
  }, totalFormationTime - 600);

  setTimeout(() => {
    dots.forEach((dot) => {
      dot.style.boxShadow = "0 0 4px rgba(230,196,122,0.3)";
    });
  }, totalFormationTime);

  // Hero fade in AFTER full settle
  setTimeout(() => {
    const hero = document.querySelector(".hero");
    hero.style.opacity = "1";
    hero.style.transform = "translateY(0)";
  }, totalFormationTime + 200);

  // Fade loader after hero begins
  setTimeout(() => {
    const loader = document.getElementById("lunarLoader");
    loader.style.transition = "opacity 0.5s ease-out";
    loader.style.opacity = "0";

    setTimeout(() => {
      sessionStorage.setItem("lunarPlayed", "true");
      loader.remove();
      document.body.classList.remove("loading");
    }, 500);
  }, totalFormationTime + 600);
});

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

  moon.style.transform = `
  translate(${currentX * -45}px, ${currentY * -30 + scrollDepthMoon}px)`;

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
