/*
	File: assets/js/05-section-effects.js
	Description: Touch-friendly scroll-linked section reveal states.
	Last modified: 2026-06-06
	Copyright: (c) 2026 mytag.sol Community. All rights reserved.
*/

(function () {
	"use strict";

	var sections = Array.prototype.slice.call(document.querySelectorAll(".reveal-section"));
	var firstHeroTarget = document.querySelector(".hero-scroll-cue--intro");
	var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	var observer;
	var ticking = false;
	var snapEligible = Boolean(firstHeroTarget && !reducedMotion && !window.location.hash);
	var snapActive = false;
	var snapStartedAt = 0;
	var snapAbortTimer;

	if (sections.length === 0) {
		return;
	}

	function clamp(value, min, max) {
		return Math.max(min, Math.min(max, value));
	}

	function setSectionMotion(section, rect, viewportHeight) {
		var viewportCenter = viewportHeight * 0.5;
		var sectionCenter = rect.top + rect.height * 0.5;
		var visibleTop = clamp(rect.top, 0, viewportHeight);
		var visibleBottom = clamp(rect.bottom, 0, viewportHeight);
		var visibleHeight = Math.max(0, visibleBottom - visibleTop);
		var visibleRatio = clamp(visibleHeight / Math.min(rect.height, viewportHeight), 0, 1);
		var distance = Math.abs(sectionCenter - viewportCenter);
		var centerProgress = 1 - clamp(distance / (viewportHeight * 0.72), 0, 1);
		var progress = Math.max(centerProgress, visibleRatio);
		var direction = rect.top < viewportCenter ? -1 : 1;
		var revealY = clamp((1 - progress) * 20 * direction, -8, 20);
		var revealBrightness = 0.56 + progress * 0.44;
		var revealScale = 0.988 + progress * 0.012;

		if (section.classList.contains("hero-section")) {
			return;
		}

		section.style.setProperty("--reveal-y", revealY.toFixed(2) + "px");
		section.style.setProperty("--reveal-brightness", revealBrightness.toFixed(3));
		section.style.setProperty("--reveal-scale", revealScale.toFixed(3));
	}

	function updateVisibleSections() {
		var viewportHeight = window.innerHeight || document.documentElement.clientHeight;

		sections.forEach(function (section) {
			var rect = section.getBoundingClientRect();
			var isVisible = rect.top < viewportHeight * 0.88 && rect.bottom > viewportHeight * 0.08;

			setSectionMotion(section, rect, viewportHeight);
			section.classList.toggle("is-visible", isVisible);
		});

		ticking = false;
	}

	function requestUpdate() {
		if (ticking) {
			return;
		}

		ticking = true;
		window.requestAnimationFrame(updateVisibleSections);
	}

	function cancelHeroSnap() {
		if (!snapActive) {
			return;
		}

		snapActive = false;
		document.documentElement.classList.remove("is-hero-snapping");

		if (snapAbortTimer) {
			window.clearTimeout(snapAbortTimer);
			snapAbortTimer = null;
		}
	}

	function finishHeroSnap() {
		snapActive = false;
		snapEligible = false;
		document.documentElement.classList.remove("is-hero-snapping");
	}

	function getFirstHeroTargetTop() {
		var hash = firstHeroTarget ? firstHeroTarget.getAttribute("href") : "";
		var target = hash && hash.charAt(0) === "#" ? document.querySelector(hash) : null;

		if (!target) {
			return null;
		}

		return target.getBoundingClientRect().top + window.pageYOffset;
	}

	function maybeSnapPastHero(deltaY) {
		var scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
		var targetTop;

		if (!snapEligible || snapActive || deltaY <= 0 || scrollY > 92) {
			return;
		}

		targetTop = getFirstHeroTargetTop();

		if (targetTop === null || targetTop < 160) {
			snapEligible = false;
			return;
		}

		snapActive = true;
		snapStartedAt = Date.now();
		document.documentElement.classList.add("is-hero-snapping");

		window.scrollTo({
			top: Math.max(0, targetTop - 18),
			behavior: "smooth"
		});

		snapAbortTimer = window.setTimeout(finishHeroSnap, 920);
	}

	function handleWheel(event) {
		if (snapActive) {
			handleManualScrollIntent();
			return;
		}

		maybeSnapPastHero(event.deltaY || 0);
	}

	function handleTouchStart(event) {
		if (!event.touches || event.touches.length !== 1) {
			return;
		}

		handleTouchStart.y = event.touches[0].clientY;
	}

	function handleTouchMove(event) {
		var startY = handleTouchStart.y;
		var currentY;

		if (typeof startY !== "number" || !event.touches || event.touches.length !== 1) {
			return;
		}

		if (snapActive) {
			handleManualScrollIntent();
			handleTouchStart.y = null;
			return;
		}

		currentY = event.touches[0].clientY;

		if (startY - currentY > 14) {
			maybeSnapPastHero(startY - currentY);
			handleTouchStart.y = null;
		}
	}

	function handleManualScrollIntent() {
		if (!snapActive || Date.now() - snapStartedAt < 180) {
			return;
		}

		cancelHeroSnap();
	}

	if ("IntersectionObserver" in window) {
		observer = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				entry.target.classList.toggle("is-visible", entry.intersectionRatio > 0.08);
			});
		}, {
			root: null,
			rootMargin: "-6% 0px -24% 0px",
			threshold: [0.08, 0.16, 0.32, 0.54]
		});

		sections.forEach(function (section) {
			observer.observe(section);
		});
	}

	window.addEventListener("scroll", requestUpdate, { passive: true });
	window.addEventListener("resize", requestUpdate);

	if (snapEligible) {
		window.addEventListener("wheel", handleWheel, { passive: true });
		window.addEventListener("touchstart", handleTouchStart, { passive: true });
		window.addEventListener("touchmove", handleTouchMove, { passive: true });
		window.addEventListener("keydown", handleManualScrollIntent);
	}

	updateVisibleSections();
}());
