// TechVerse Solution — shared site behavior

document.addEventListener("DOMContentLoaded", function () {
  initNavToggle();
  setFooterYear();
  initScrollReveal();
  initCardTilt();
});

/* Fade/slide in key content blocks as they enter the viewport.
   Stagger delay is scoped per group (not a global counter) so unrelated
   sections never inherit each other's timing. */
function initScrollReveal() {
  var groupSelectors = [
    ".card-grid", ".tier-grid", ".apart-grid", ".why-list"
  ];
  var soloSelectors = [
    ".hero-copy", ".hero-visual", ".section-head", ".intro p",
    ".service-row", ".why-block .panel", ".story-block",
    ".pricing-table-wrap", ".cta-banner", ".biz-card"
  ];

  var allTargets = [];

  groupSelectors.forEach(function (groupSel) {
    document.querySelectorAll(groupSel).forEach(function (group) {
      Array.prototype.forEach.call(group.children, function (child, i) {
        child.classList.add("reveal");
        child.style.transitionDelay = (i % 4) * 90 + "ms";
        allTargets.push(child);
      });
    });
  });

  soloSelectors.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el) {
      el.classList.add("reveal");
      allTargets.push(el);
    });
  });

  if (!allTargets.length) return;

  if (!("IntersectionObserver" in window)) {
    allTargets.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }

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

  allTargets.forEach(function (el) { observer.observe(el); });
}

/* Mobile navigation toggle */
function initNavToggle() {
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("siteNav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", function () {
    var isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 760) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

/* Subtle pointer-driven tilt on the /card business card (fine pointers only) */
function initCardTilt() {
  var card = document.querySelector(".biz-card");
  var wrap = document.querySelector(".biz-card-wrap");
  if (!card || !wrap) return;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  wrap.style.perspective = "900px";

  wrap.addEventListener("mousemove", function (e) {
    var rect = card.getBoundingClientRect();
    var x = (e.clientX - rect.left) / rect.width - 0.5;
    var y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transition = "transform 0.06s linear";
    card.style.transform =
      "rotateY(" + (x * 8).toFixed(2) + "deg) rotateX(" + (-y * 8).toFixed(2) + "deg) scale(1.015)";
  });

  wrap.addEventListener("mouseleave", function () {
    card.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
    card.style.transform = "rotateY(0deg) rotateX(0deg) scale(1)";
  });
}

/* Keep copyright year current */
function setFooterYear() {
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
