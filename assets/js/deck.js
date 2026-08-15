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

  // On pilote le defilement du conteneur plutot que scrollIntoView : dans un
  // conteneur a scroll-snap obligatoire, le navigateur annule le defilement
  // programme au profit du point d'ancrage le plus proche.
  function offsetOf(slide) {
    return deck.scrollTop + slide.getBoundingClientRect().top -
      deck.getBoundingClientRect().top - (deck.clientHeight - slide.offsetHeight) / 2;
  }

  function go(index, instant) {
    var i = Math.max(0, Math.min(slides.length - 1, index));
    deck.scrollTo({
      top: offsetOf(slides[i]),
      behavior: instant || prefersReducedMotion() ? "auto" : "smooth",
    });
    // L'etat suit l'action immediatement ; le defilement ne fait que confirmer.
    current = i;
    render();
    if (history.replaceState) history.replaceState(null, "", "#" + slides[i].id);
  }

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  // La page courante est celle dont le centre est le plus proche du centre du
  // conteneur. Un IntersectionObserver serait ambigu : selon la hauteur de la
  // fenetre, deux diapositives peuvent franchir le seuil en meme temps.
  function nearest() {
    var deckRect = deck.getBoundingClientRect();
    var middle = deckRect.top + deckRect.height / 2;
    var best = 0;
    var bestDistance = Infinity;
    for (var i = 0; i < slides.length; i++) {
      var rect = slides[i].getBoundingClientRect();
      var distance = Math.abs(rect.top + rect.height / 2 - middle);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = i;
      }
    }
    return best;
  }

  var pending = false;
  deck.addEventListener("scroll", function () {
    if (pending) return;
    pending = true;
    requestAnimationFrame(function () {
      pending = false;
      var index = nearest();
      if (index === current) return;
      current = index;
      render();
      if (history.replaceState) history.replaceState(null, "", "#" + slides[index].id);
    });
  }, { passive: true });

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
  var target = document.getElementById(window.location.hash.replace("#", ""));
  if (target && slides.indexOf(target) !== -1) {
    var index = slides.indexOf(target);
    requestAnimationFrame(function () {
      go(index, true);
    });
  }

  render();
})();
