/* Steve Quigley & Sons — shared behaviour: nav toggle, scroll-reveal, progress line. */
(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Mobile nav toggle */
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.querySelector(".nav__menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      menu.setAttribute("data-open", String(!open));
    });
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        menu.setAttribute("data-open", "false");
      });
    });
  }

  /* Scroll-reveal: data-reveal="up|fade|left|right|scale" + data-reveal-delay="1..4" */
  var revealEls = document.querySelectorAll("[data-reveal]");
  revealEls.forEach(function (el) {
    var delay = el.getAttribute("data-reveal-delay");
    if (delay) el.style.setProperty("--reveal-delay", delay);
  });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  }

  /* Scroll progress line (desktop cohesion device) */
  var progressFill = document.querySelector(".scroll-progress__fill");
  if (progressFill) {
    var ticking = false;
    var updateProgress = function () {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressFill.style.setProperty("--progress", pct + "%");
      ticking = false;
    };
    document.addEventListener("scroll", function () {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }, { passive: true });
    updateProgress();
  }

  /* Hero animation: "photo settle" reveal on the hero/intro image (scale + saturation
     easing to rest, plus a mustard rule draw-in). Purely CSS-driven via transitions/keyframes
     on the [data-hero-patina] element; this hook only adds the .is-active class once
     (or .is-static under reduced-motion) then gets out of the way. */
  var heroPatina = document.querySelector("[data-hero-patina]");
  if (heroPatina) {
    if (reduceMotion) {
      heroPatina.classList.add("is-active", "is-static");
    } else {
      requestAnimationFrame(function () {
        setTimeout(function () { heroPatina.classList.add("is-active"); }, 200);
      });
    }
  }
})();
