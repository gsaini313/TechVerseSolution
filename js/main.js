// TechVerse Solution — shared site behavior

document.addEventListener("DOMContentLoaded", function () {
  initNavToggle();
  setFooterYear();
  initScrollReveal();
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
    ".pricing-table-wrap", ".cta-banner"
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

/* Keep copyright year current */
function setFooterYear() {
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
