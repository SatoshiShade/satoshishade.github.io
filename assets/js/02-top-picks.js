/*
	File: assets/js/02-top-picks.js
	Description: Auto-focus carousel behavior for featured subdomain registrar cards.
	Last modified: 2026-05-23
	Copyright: (c) 2026 mytag.sol Community. All rights reserved.
*/

(function () {
	"use strict";

	var carousel = document.querySelector(".top-picks-carousel");
	var cards = carousel ? Array.prototype.slice.call(carousel.querySelectorAll(".domain-card")) : [];
	var dots = Array.prototype.slice.call(document.querySelectorAll(".top-pick-dot"));
	var previousButton = document.querySelector(".top-picks-arrow--prev");
	var nextButton = document.querySelector(".top-picks-arrow--next");
	var currentIndex = 0;
	var intervalId;
	var intervalMs = 6500;
	var touchStartX = 0;
	var touchStartY = 0;
	var touchTracking = false;
	var suppressNextClick = false;
	var switchingTimer;

	if (!carousel || cards.length === 0) {
		return;
	}

	function getPosition(cardIndex) {
		var diff = cardIndex - currentIndex;

		if (diff > cards.length / 2) {
			diff -= cards.length;
		}

		if (diff < -cards.length / 2) {
			diff += cards.length;
		}

		return Math.max(-2, Math.min(2, diff));
	}

	function setActive(index) {
		currentIndex = (index + cards.length) % cards.length;

		window.clearTimeout(switchingTimer);
		carousel.classList.remove("is-switching");
		window.requestAnimationFrame(function () {
			carousel.classList.add("is-switching");
		});

		cards.forEach(function (card, cardIndex) {
			card.classList.toggle("active", cardIndex === currentIndex);
			card.dataset.position = String(getPosition(cardIndex));
		});

		dots.forEach(function (dot, dotIndex) {
			dot.classList.toggle("active", dotIndex === currentIndex);
		});

		switchingTimer = window.setTimeout(function () {
			carousel.classList.remove("is-switching");
		}, 680);
	}

	function start() {
		if (intervalId) {
			return;
		}

		intervalId = window.setInterval(function () {
			setActive(currentIndex + 1);
		}, intervalMs);
	}

	function stop() {
		if (!intervalId) {
			return;
		}

		window.clearInterval(intervalId);
		intervalId = null;
	}

	function moveBy(direction) {
		stop();
		setActive(currentIndex + direction);
		start();
	}

	carousel.addEventListener("mouseenter", stop);
	carousel.addEventListener("mouseleave", start);
	carousel.addEventListener("focusin", stop);
	carousel.addEventListener("focusout", function () {
		window.setTimeout(function () {
			if (!carousel.contains(document.activeElement)) {
				start();
			}
		}, 0);
	});

	dots.forEach(function (dot) {
		dot.addEventListener("click", function () {
			stop();
			setActive(Number(dot.dataset.pickIndex));
			start();
		});
	});

	if (previousButton) {
		previousButton.addEventListener("click", function () {
			moveBy(-1);
		});
	}

	if (nextButton) {
		nextButton.addEventListener("click", function () {
			moveBy(1);
		});
	}

	carousel.addEventListener("pointerdown", function (event) {
		if (event.pointerType !== "touch") {
			return;
		}

		touchStartX = event.clientX;
		touchStartY = event.clientY;
		touchTracking = true;
		stop();
	}, { passive: true });

	carousel.addEventListener("pointerup", function (event) {
		var deltaX;
		var deltaY;

		if (!touchTracking || event.pointerType !== "touch") {
			return;
		}

		touchTracking = false;
		deltaX = event.clientX - touchStartX;
		deltaY = event.clientY - touchStartY;

		if (Math.abs(deltaX) > 44 && Math.abs(deltaX) > Math.abs(deltaY) * 1.35) {
			suppressNextClick = true;
			setActive(currentIndex + (deltaX < 0 ? 1 : -1));

			window.setTimeout(function () {
				suppressNextClick = false;
			}, 220);
		}

		start();
	}, { passive: true });

	carousel.addEventListener("click", function (event) {
		if (!suppressNextClick) {
			return;
		}

		event.preventDefault();
		event.stopPropagation();
	}, true);

	carousel.addEventListener("pointercancel", function () {
		if (touchTracking) {
			touchTracking = false;
			start();
		}
	}, { passive: true });

	setActive(currentIndex);
	start();
}());
