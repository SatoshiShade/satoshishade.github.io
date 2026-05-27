/*
	File: assets/js/05-section-effects.js
	Description: Touch-friendly section movement and reveal states.
	Last modified: 2026-05-27
	Copyright: (c) 2026 mytag.sol Community. All rights reserved.
*/

(function () {
	"use strict";

	var sections = Array.prototype.slice.call(document.querySelectorAll(".reveal-section"));
	var observer;

	if (sections.length === 0) {
		return;
	}

	function updateVisibleSections() {
		var viewportHeight = window.innerHeight || document.documentElement.clientHeight;

		sections.forEach(function (section) {
			var rect = section.getBoundingClientRect();
			var isVisible = rect.top < viewportHeight * 0.88 && rect.bottom > viewportHeight * 0.08;

			section.classList.toggle("is-visible", isVisible);
		});
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

	window.addEventListener("scroll", updateVisibleSections, { passive: true });

	updateVisibleSections();
}());
