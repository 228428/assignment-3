/* ===== Scroll progress ===== */
const progress = document.getElementById("progress");
function updateProgress() {
  const h = document.documentElement;
  const ratio = h.scrollTop / (h.scrollHeight - h.clientHeight);
  progress.style.width = `${Math.max(0, Math.min(1, ratio)) * 100}%`;
}
document.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

/* ===== Reveal / slide-in animations ===== */
const animated = document.querySelectorAll(
  ".reveal, .slide-left, .slide-right, .slide-up"
);
const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("inview");
        io.unobserve(e.target);
      }
    }
  },
  { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
);
animated.forEach((el) => io.observe(el));

/* ===== Subtle parallax on hero ===== */
const parallaxEls = document.querySelectorAll("[data-parallax-speed]");
function onParallax() {
  const y = window.scrollY || window.pageYOffset;
  parallaxEls.forEach((el) => {
    const speed = parseFloat(el.dataset.parallaxSpeed || "0.2");
    el.style.transform = `translateY(${y * speed * -0.2}px)`;
  });
}
document.addEventListener("scroll", onParallax, { passive: true });

/* ===== PATH 1: Timeline dots ↔ panels ===== */
const tlDots = Array.from(document.querySelectorAll(".tl-rail .dot"));
const tlPanels = Array.from(document.querySelectorAll(".tl-panel"));
const panelIO = new IntersectionObserver(
  (entries) => {
    let best = null;
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const ratio = e.intersectionRatio;
        if (!best || ratio > best.ratio) best = { id: e.target.id, ratio };
      }
    });
    if (best) {
      tlDots.forEach((d) =>
        d.classList.toggle("active", d.dataset.target === best.id)
      );
    }
  },
  { threshold: [0.35, 0.6, 0.9], rootMargin: "-10% 0% -30% 0%" }
);
tlPanels.forEach((p) => panelIO.observe(p));

/* ===== PATH 2: Horizontal scrolly scrub (vertical scroll → X translate) ===== */
const hWrap = document.querySelector(".hscroll-wrap");
const hTrack = document.getElementById("hTrack");
if (hWrap && hTrack) {
  const panels = Array.from(hTrack.querySelectorAll(".hpanel"));
  function setTrackWidth() {
    const gap = parseFloat(getComputedStyle(hTrack).gap) || 0;
    const totalWidth =
      panels.reduce((acc, p) => acc + p.getBoundingClientRect().width, 0) +
      gap * (panels.length - 1) +
      12; /* padding fudge */
    hTrack.style.width = `${totalWidth}px`;
  }
  setTrackWidth();
  window.addEventListener("resize", setTrackWidth);

  function updateH() {
    const rect = hWrap.getBoundingClientRect();
    const start = rect.top;
    const end = rect.height - window.innerHeight;
    const scrolled = Math.min(Math.max(-start, 0), end);
    const progress = end > 0 ? scrolled / end : 0;
    const maxTranslate = Math.max(hTrack.scrollWidth - window.innerWidth, 0);
    hTrack.style.transform = `translateX(${-progress * maxTranslate}px)`;
  }
  document.addEventListener("scroll", updateH, { passive: true });
  window.addEventListener("resize", updateH);
  updateH();
}
