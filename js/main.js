(function () {
  "use strict";

  /** 18 шілде 2026, 16:00 — Қазақстан (UTC+5) */
  var EVENT_MS = Date.UTC(2026, 6, 18, 11, 0, 0);

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  var eventMs = EVENT_MS;

  function updateCountdown() {
    var now = Date.now();
    var elD = document.getElementById("cd-days");
    var elH = document.getElementById("cd-hours");
    var elM = document.getElementById("cd-minutes");
    var elS = document.getElementById("cd-seconds");
    if (!elD || !elH || !elM || !elS) return;

    var diff = eventMs - now;
    if (diff <= 0) {
      elD.textContent = "00";
      elH.textContent = "00";
      elM.textContent = "00";
      elS.textContent = "00";
      return;
    }

    var s = Math.floor(diff / 1000);
    var days = Math.floor(s / 86400);
    s -= days * 86400;
    var hours = Math.floor(s / 3600);
    s -= hours * 3600;
    var minutes = Math.floor(s / 60);
    var seconds = s - minutes * 60;

    elD.textContent = pad(days);
    elH.textContent = pad(hours);
    elM.textContent = pad(minutes);
    elS.textContent = pad(seconds);
  }

  function initCountdown() {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  function initReveal() {
    var nodes = document.querySelectorAll("[data-reveal]");
    if (!nodes.length || !("IntersectionObserver" in window)) {
      nodes.forEach(function (n) {
        n.classList.add("is-visible");
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    nodes.forEach(function (n) {
      io.observe(n);
    });
  }

  function initScrollButtons() {
    document.querySelectorAll("[data-scroll-to]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var sel = btn.getAttribute("data-scroll-to");
        var t = sel && document.querySelector(sel);
        if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function initHeroParallax() {
    var hero = document.querySelector(".hero");
    var img = document.querySelector(".hero__img");
    if (!hero || !img) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var rect = hero.getBoundingClientRect();
        var vh = window.innerHeight || 1;
        var p = Math.min(1, Math.max(0, 1 - rect.bottom / (vh + rect.height)));
        var y = p * 18;
        var s = 1.04 + p * 0.02;
        img.style.transform = "translate3d(0," + y + "px,0) scale(" + s + ")";
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /** Фондық әуен: интерфейсте басқару жоқ; браузер ережесі бойынша алғашқы әрекеттен кейін ойнайды */
  function initAutoplayAudio() {
    var audio = document.getElementById("bgAudio");
    if (!audio) return;

    var source = audio.querySelector("source");
    var src = source && source.getAttribute("src");
    if (!src || !src.trim()) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    audio.volume = 0.45;

    function tryPlay() {
      return audio.play().catch(function () {});
    }

    function removeUnlock() {
      document.removeEventListener("pointerdown", onInteract, true);
      document.removeEventListener("touchstart", onInteract, true);
      document.removeEventListener("click", onInteract, true);
    }

    function onInteract() {
      tryPlay();
    }

    audio.addEventListener(
      "playing",
      function onPlaying() {
        audio.removeEventListener("playing", onPlaying);
        removeUnlock();
      },
      { once: true }
    );

    document.addEventListener("pointerdown", onInteract, true);
    document.addEventListener("touchstart", onInteract, true);
    document.addEventListener("click", onInteract, true);

    tryPlay();
  }

  function initGalleryImages() {
    document.querySelectorAll(".gallery__img").forEach(function (img) {
      var ph = img.closest(".gallery__item") && img.closest(".gallery__item").querySelector("[data-placeholder]");
      function done() {
        img.classList.add("is-loaded");
        if (ph) ph.classList.add("is-hidden");
      }
      if (img.complete && img.naturalWidth) {
        done();
      } else {
        img.addEventListener("load", done);
        img.addEventListener("error", function () {
          img.removeAttribute("src");
          img.alt = "";
          if (ph) {
            ph.classList.remove("is-hidden");
            ph.setAttribute("data-error", "true");
          }
        });
      }
    });
  }

  initCountdown();
  initReveal();
  initScrollButtons();
  initHeroParallax();
  initAutoplayAudio();
  initGalleryImages();
})();
