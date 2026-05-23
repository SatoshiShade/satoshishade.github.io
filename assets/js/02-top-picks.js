/*
	File: assets/js/02-top-picks.js
	Description: Auto-focus carousel behavior for featured subdomain registrar cards.
	Last modified: 2026-05-23
	Copyright: © 2026 mytag.sol Community. All rights reserved.
*/

(function () {
	"use strict";

	var carousel = document.querySelector(".top-picks-carousel");
	var cards = carousel ? Array.prototype.slice.call(carousel.querySelectorAll(".domain-card")) : [];
	var dots = Array.prototype.slice.call(document.querySelectorAll(".top-pick-dot"));
	var currentIndex = 1;
	var intervalId;
	var intervalMs = 4200;

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

		cards.forEach(function (card, cardIndex) {
			card.classList.toggle("active", cardIndex === currentIndex);
			card.dataset.position = String(getPosition(cardIndex));
		});

		dots.forEach(function (dot, dotIndex) {
			dot.classList.toggle("active", dotIndex === currentIndex);
		});
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

	setActive(currentIndex);
	start();
}());
