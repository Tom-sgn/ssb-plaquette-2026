/* Navigation de la plaquette : clavier, compteur, lien profond, impression.
   Sans dependance ; le deck reste entierement lisible si le script echoue. */
(function () {
  "use strict";

  var deck = document.getElementById("deck");
  var slides = Array.prototype.slice.call(document.querySelectorAll(".slide"));
  if (!deck || !slides.length) return;

  var counter = document.querySelector('[data-nav="counter"]');
  var prevBtn = document.querySelector('[data-nav="prev"]');
  var nextBtn = document.querySelector('[data-nav="next"]');
  var printBtn = document.querySelector('[data-nav="print"]');
  var current = 0;

  function render() {
    if (counter) counter.textContent = current + 1 + " / " + slides.length;
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current === slides.length - 1;
  }

  function go(index) {
    var i = Math.max(0, Math.min(slides.length - 1, index));
    slides[i].scrollIntoView({ block: "center", behavior: prefersReducedMotion() ? "auto" : "smooth" });
    if (history.replaceState) history.replaceState(null, "", "#" + slides[i].id);
  }

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  // Le slide le plus proche du centre du conteneur fait foi.
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var index = slides.indexOf(entry.target);
        if (index !== -1 && index !== current) {
          current = index;
          render();
          if (history.replaceState) history.replaceState(null, "", "#" + entry.target.id);
        }
      });
    },
    { root: deck, threshold: 0.55 }
  );
  slides.forEach(function (slide) {
    observer.observe(slide);
  });

  document.addEventListener("keydown", function (event) {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    var target = event.target;
    if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;

    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
      case "PageDown":
      case " ":
      case "Spacebar":
        event.preventDefault();
        go(current + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
      case "PageUp":
        event.preventDefault();
        go(current - 1);
        break;
      case "Home":
        event.preventDefault();
        go(0);
        break;
      case "End":
        event.preventDefault();
        go(slides.length - 1);
        break;
    }
  });

  if (prevBtn) prevBtn.addEventListener("click", function () { go(current - 1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { go(current + 1); });
  if (printBtn) printBtn.addEventListener("click", function () { window.print(); });

  // Ouverture directe sur une page : #slide-4
  var hash = window.location.hash.replace("#", "");
  if (hash) {
    var target = document.getElementById(hash);
    if (target && slides.indexOf(target) !== -1) {
      current = slides.indexOf(target);
      requestAnimationFrame(function () {
        target.scrollIntoView({ block: "center", behavior: "auto" });
      });
    }
  }

  render();
})();
