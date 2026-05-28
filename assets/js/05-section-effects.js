/*
	File: assets/js/05-section-effects.js
	Description: Touch-friendly scroll-linked section reveal states.
	Last modified: 2026-05-28
	Copyright: (c) 2026 mytag.sol Community. All rights reserved.
*/

(function () {
	"use strict";

	var sections = Array.prototype.slice.call(document.querySelectorAll(".reveal-section"));
	var observer;
	var ticking = false;

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

	updateVisibleSections();
}());
