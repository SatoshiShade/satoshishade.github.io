/*
	File: assets/js/05-section-effects.js
	Description: Touch-friendly section movement and reveal states.
	Last modified: 2026-05-27
	Copyright: (c) 2026 mytag.sol Community. All rights reserved.
*/

(function () {
	"use strict";

	var sections = Array.prototype.slice.call(document.querySelectorAll(".page-snap-section"));
	var observer;
	var touchStartX = 0;
	var touchStartY = 0;
	var touchStartTime = 0;
	var isSnapping = false;

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

	function getCurrentIndex() {
		var anchor = window.scrollY + window.innerHeight * 0.38;
		var currentIndex = 0;

		sections.forEach(function (section, sectionIndex) {
			if (section.offsetTop <= anchor) {
				currentIndex = sectionIndex;
			}
		});

		return currentIndex;
	}

	function scrollToSection(sectionIndex) {
		var target = sections[Math.max(0, Math.min(sections.length - 1, sectionIndex))];

		if (!target || isSnapping) {
			return;
		}

		isSnapping = true;
		target.scrollIntoView({
			behavior: "smooth",
			block: "start"
		});

		window.setTimeout(function () {
			isSnapping = false;
		}, 720);
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

	window.addEventListener("touchstart", function (event) {
		if (window.matchMedia("(min-width: 760px)").matches || event.touches.length !== 1) {
			return;
		}

		touchStartX = event.touches[0].clientX;
		touchStartY = event.touches[0].clientY;
		touchStartTime = Date.now();
	}, { passive: true });

	window.addEventListener("touchend", function (event) {
		var changedTouch;
		var deltaX;
		var deltaY;
		var elapsed;
		var activeElement = document.activeElement;

		if (window.matchMedia("(min-width: 760px)").matches || event.changedTouches.length !== 1) {
			return;
		}

		if (activeElement && /^(INPUT|TEXTAREA|SELECT)$/u.test(activeElement.tagName)) {
			return;
		}

		changedTouch = event.changedTouches[0];
		deltaX = changedTouch.clientX - touchStartX;
		deltaY = changedTouch.clientY - touchStartY;
		elapsed = Date.now() - touchStartTime;

		if (elapsed > 900 || Math.abs(deltaY) < 72 || Math.abs(deltaY) < Math.abs(deltaX) * 1.4) {
			return;
		}

		scrollToSection(getCurrentIndex() + (deltaY < 0 ? 1 : -1));
	}, { passive: true });

	updateVisibleSections();
}());
