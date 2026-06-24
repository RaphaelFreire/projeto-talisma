/* =====================================================================
   Talismã Seguros — "Seja um Sócio" — Interações v2
   Cursor · parallax · split-text · magnético · reveal · counters · FAQ
   header scroll · sticky CTA · WhatsApp form
   ===================================================================== */
(function () {
  "use strict";

  var WA = "5517992242020";
  var WA_MSG = encodeURIComponent("Olá! Tenho interesse em ser sócio Talismã. Poderia me informar sobre a disponibilidade na minha região?");
  function waUrl(msg) { return "https://wa.me/" + WA + "?text=" + (msg || WA_MSG); }

  /* ------------------------------------------------------------------ */
  /* Custom cursor (desktop only)                                         */
  /* ------------------------------------------------------------------ */
  var dot  = document.querySelector(".cursor-dot");
  var ring = document.querySelector(".cursor-ring");
  if (dot && ring && window.matchMedia("(pointer: fine)").matches) {
    var cx = -200, cy = -200, rx = -200, ry = -200;
    document.addEventListener("mousemove", function (e) {
      cx = e.clientX; cy = e.clientY;
      dot.style.transform = "translate(" + (cx - 4) + "px," + (cy - 4) + "px)";
    });
    (function loop() {
      rx += (cx - rx) * 0.1;
      ry += (cy - ry) * 0.1;
      ring.style.transform = "translate(" + (rx - 20) + "px," + (ry - 20) + "px)";
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll("a,button,[data-magnetic]").forEach(function (el) {
      el.addEventListener("mouseenter", function () { ring.classList.add("cursor--hover"); });
      el.addEventListener("mouseleave", function () { ring.classList.remove("cursor--hover"); });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Lenis smooth scroll (optional CDN)                                   */
  /* ------------------------------------------------------------------ */
  if (typeof Lenis !== "undefined") {
    var lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
  }

  /* ------------------------------------------------------------------ */
  /* Init after DOM ready                                                 */
  /* ------------------------------------------------------------------ */
  function init() {

    /* ---- Hero parallax -------------------------------------------- */
    var heroBg = document.querySelector(".hero-bg");
    if (heroBg) {
      window.addEventListener("scroll", function () {
        heroBg.style.transform = "translateY(" + ((window.scrollY || window.pageYOffset) * 0.32) + "px)";
      }, { passive: true });
    }

    /* ---- Hero title split-text -------------------------------------- */
    var h1 = document.querySelector("[data-hero-h1]");
    if (h1) {
      var raw = h1.innerHTML;
      /* split preserving HTML tags (e.g. <span class="text-accent">…</span>) */
      var parts = [];
      var re = /(<[^>]+>|[^<\s]+|\s+)/g;
      var m;
      while ((m = re.exec(raw)) !== null) parts.push(m[0]);

      var wordIdx = 0;
      h1.innerHTML = parts.map(function (p) {
        if (/^</.test(p) || /^\s+$/.test(p)) return p;
        var delay = wordIdx++ * 60;
        return '<span class="sw" style="overflow:hidden;display:inline-block;vertical-align:bottom">' +
               '<span class="si" style="display:inline-block;transform:translateY(110%);transition:transform .95s cubic-bezier(.16,1,.3,1);transition-delay:' + delay + 'ms">' + p + '</span></span>';
      }).join("");

      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          h1.querySelectorAll(".si").forEach(function (s) { s.style.transform = "translateY(0)"; });
        });
      });
    }

    /* ---- Magnetic CTA buttons -------------------------------------- */
    document.querySelectorAll("[data-magnetic]").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2);
        var dy = e.clientY - (r.top + r.height / 2);
        btn.style.transform = "translate(" + dx * 0.3 + "px," + dy * 0.3 + "px)";
      });
      btn.addEventListener("mouseleave", function () {
        btn.style.transition = "transform .5s cubic-bezier(.23,1,.32,1)";
        btn.style.transform = "";
        setTimeout(function () { btn.style.transition = ""; }, 500);
      });
    });

    /* ---- Scroll reveal --------------------------------------------- */
    var reveals = [].slice.call(document.querySelectorAll("[data-reveal]"));
    reveals.forEach(function (el) {
      var d = el.getAttribute("data-reveal") || "up";
      el.style.opacity = "0";
      el.style.willChange = "opacity,transform";
      el.style.transform = d === "left" ? "translateX(-42px)"
        : d === "right" ? "translateX(42px)"
        : d === "scale" ? "scale(.93)"
        : "translateY(42px)";
      el.style.transition = "opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1)";
      var dl = el.getAttribute("data-delay");
      if (dl) el.style.transitionDelay = dl + "ms";
    });
    function show(el) { el.style.opacity = "1"; el.style.transform = "none"; }
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (ents) {
        ents.forEach(function (e) { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
      }, { threshold: 0.08, rootMargin: "0px 0px -4% 0px" });
      reveals.forEach(function (el) { io.observe(el); });
    } else { reveals.forEach(show); }
    setTimeout(function () { reveals.forEach(function (el) { if (el.style.opacity === "0") show(el); }); }, 4000);

    /* ---- Counters -------------------------------------------------- */
    var counters = [].slice.call(document.querySelectorAll("[data-count]"));
    function runCount(el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var suffix = el.getAttribute("data-suffix") || "";
      var dur = 1800, t0 = performance.now();
      (function tick(now) {
        var p = Math.min(1, (now - t0) / dur);
        el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    }
    if ("IntersectionObserver" in window) {
      var cio = new IntersectionObserver(function (ents) {
        ents.forEach(function (e) { if (e.isIntersecting) { runCount(e.target); cio.unobserve(e.target); } });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { cio.observe(el); });
    } else { counters.forEach(runCount); }

    /* ---- FAQ accordion --------------------------------------------- */
    [].slice.call(document.querySelectorAll("[data-faq-item]")).forEach(function (item) {
      var btn  = item.querySelector("[data-faq-q]");
      var ans  = item.querySelector("[data-faq-a]");
      var icon = item.querySelector("[data-faq-icon]");
      if (!btn) return;
      btn.addEventListener("click", function () {
        var open = item.getAttribute("data-open") === "1";
        ans.style.maxHeight  = open ? "0px" : ans.scrollHeight + "px";
        ans.style.opacity    = open ? "0"   : "1";
        item.setAttribute("data-open", open ? "0" : "1");
        if (icon) icon.style.transform = open ? "rotate(0deg)" : "rotate(45deg)";
      });
    });

    /* ---- Header + sticky bar on scroll ----------------------------- */
    var header = document.querySelector("[data-header]");
    var sticky = document.querySelector("[data-sticky-cta]");
    function onScroll() {
      var y = window.scrollY || window.pageYOffset;
      if (header) {
        if (y > 24) {
          header.style.background = "rgba(11,20,34,.95)";
          header.style.backdropFilter = "blur(16px)";
          header.style.webkitBackdropFilter = "blur(16px)";
          header.style.boxShadow = "0 1px 0 rgba(255,255,255,.07)";
          header.style.paddingTop = "10px";
          header.style.paddingBottom = "10px";
        } else {
          header.style.background = "transparent";
          header.style.backdropFilter = "none";
          header.style.webkitBackdropFilter = "none";
          header.style.boxShadow = "none";
          header.style.paddingTop = "20px";
          header.style.paddingBottom = "20px";
        }
      }
      if (sticky) {
        sticky.style.transform = y > window.innerHeight * 0.85 ? "translateY(0)" : "translateY(140%)";
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ---- Form → WhatsApp ------------------------------------------ */
    [].slice.call(document.querySelectorAll("[data-wa-form]")).forEach(function (f) {
      f.addEventListener("submit", function (e) {
        e.preventDefault();
        var g = function (id) { var el = f.querySelector("#" + id); return el ? el.value.trim() : ""; };
        var lines = ["Olá! Tenho interesse em ser sócio Talismã."];
        var nome    = g("f-nome");
        var fone    = g("f-fone");
        var email   = g("f-email");
        var cidade  = g("f-cidade");
        var capital = g("f-capital");
        if (nome)    lines.push("Nome: " + nome);
        if (fone)    lines.push("WhatsApp: " + fone);
        if (email)   lines.push("E-mail: " + email);
        if (cidade)  lines.push("Cidade: " + cidade);
        if (capital) lines.push("Capital disponível: " + capital);
        window.open(waUrl(encodeURIComponent(lines.join("\n"))), "_blank");
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
