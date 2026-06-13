/* Ventara — black concept interactions */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- nav scroll state ---------- */
  var nav = document.getElementById("nav");
  function onScroll() {
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  var toggle = document.getElementById("navToggle");
  var mobile = document.getElementById("navMobile");
  toggle.addEventListener("click", function () {
    var open = mobile.classList.toggle("is-open");
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  mobile.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      mobile.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- marquee: duplicate track for seamless loop ---------- */
  var track = document.getElementById("marqueeTrack");
  if (track) track.innerHTML += track.innerHTML;

  /* ---------- reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- card cursor glow ---------- */
  document.querySelectorAll(".card").forEach(function (card) {
    card.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
      card.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });

  /* ---------- hero particle field ---------- */
  var canvas = document.getElementById("heroCanvas");
  if (!canvas || reduceMotion) return;

  var ctx = canvas.getContext("2d");
  var particles = [];
  var W, H, raf;
  var LINK_DIST = 130;

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var count = Math.min(90, Math.floor((W * H) / 22000));
    particles = [];
    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.4 + 0.4
      });
    }
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(160, 200, 255, 0.35)";
      ctx.fill();

      for (var j = i + 1; j < particles.length; j++) {
        var q = particles[j];
        var dx = p.x - q.x, dy = p.y - q.y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < LINK_DIST) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = "rgba(110, 160, 240, " + (0.12 * (1 - d / LINK_DIST)) + ")";
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    raf = requestAnimationFrame(tick);
  }

  /* pause when hero is off-screen */
  var hero = document.querySelector(".hero");
  var heroVisible = true;
  new IntersectionObserver(function (entries) {
    heroVisible = entries[0].isIntersecting;
    if (heroVisible && !raf) raf = requestAnimationFrame(tick);
    if (!heroVisible && raf) { cancelAnimationFrame(raf); raf = null; }
  }).observe(hero);

  window.addEventListener("resize", resize);
  resize();
  raf = requestAnimationFrame(tick);
})();
