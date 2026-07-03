(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------
     LOADER
  --------------------------------------------------------- */
  var loader = document.getElementById("loader");
  var loaderBar = document.getElementById("loaderBar");
  var loaderCount = document.getElementById("loaderCount");

  function runLoader() {
    if (!loader) return;
    var progress = 0;
    var duration = reduceMotion ? 1 : 1400;
    var start = null;

    function step(ts) {
      if (start === null) start = ts;
      var elapsed = ts - start;
      progress = Math.min(100, Math.round((elapsed / duration) * 100));
      if (loaderBar) loaderBar.style.width = progress + "%";
      if (loaderCount) loaderCount.textContent = String(progress).padStart(2, "0");
      if (progress < 100) {
        requestAnimationFrame(step);
      } else {
        setTimeout(function () {
          loader.classList.add("is-done");
          document.body.style.overflow = "";
        }, 200);
      }
    }
    document.body.style.overflow = "hidden";
    requestAnimationFrame(step);
  }
  runLoader();

  /* ---------------------------------------------------------
     HEADER SCROLL STATE
  --------------------------------------------------------- */
  var header = document.getElementById("siteHeader");
  function onScrollHeader() {
    if (!header) return;
    if (window.scrollY > 12) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  }
  document.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------------------------------------------------------
     HUD FRAME COUNTER — ties a "frame number" to scroll depth
  --------------------------------------------------------- */
  var hudFrame = document.getElementById("hudFrame");
  var TOTAL_FRAMES = 240;
  function onScrollHud() {
    if (!hudFrame) return;
    var doc = document.documentElement;
    var scrollable = doc.scrollHeight - doc.clientHeight;
    var pct = scrollable > 0 ? window.scrollY / scrollable : 0;
    var frame = Math.max(1, Math.round(pct * TOTAL_FRAMES));
    hudFrame.textContent = String(frame).padStart(4, "0");
  }
  document.addEventListener("scroll", onScrollHud, { passive: true });
  onScrollHud();

  /* ---------------------------------------------------------
     CUSTOM CURSOR (desktop / hover-capable only)
  --------------------------------------------------------- */
  var cursor = document.getElementById("cursor");
  var canHover = window.matchMedia("(hover: hover)").matches;

  if (cursor && canHover && !reduceMotion) {
    var cx = 0, cy = 0, rendered = false;

    document.addEventListener("mousemove", function (e) {
      cx = e.clientX;
      cy = e.clientY;
      if (!rendered) {
        rendered = true;
        cursor.style.opacity = "1";
      }
      cursor.style.transform = "translate(" + cx + "px," + cy + "px)";
    });

    var interactive = document.querySelectorAll("a, button, .work");
    interactive.forEach(function (el) {
      el.addEventListener("mouseenter", function () {
        cursor.classList.add("is-active");
      });
      el.addEventListener("mouseleave", function () {
        cursor.classList.remove("is-active");
      });
    });
  } else if (cursor) {
    cursor.style.display = "none";
  }

  /* ---------------------------------------------------------
     SCROLL REVEALS
  --------------------------------------------------------- */
  var revealTargets = document.querySelectorAll(
    ".about__figure, .about__content > *, .skills-list, .works__heading, .work, .contact__heading, .contact__email, .contact__grid > div"
  );

  revealTargets.forEach(function (el) {
    el.setAttribute("data-reveal", "");
  });

  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealTargets.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealTargets.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------------------------------------------------------
     SMOOTH ANCHOR SCROLL (accounts for fixed header height)
  --------------------------------------------------------- */
  var headerHeight = 84;
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top: top, behavior: reduceMotion ? "auto" : "smooth" });
    });
  });
})();
