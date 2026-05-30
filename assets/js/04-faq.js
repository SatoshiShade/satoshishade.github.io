/*
	File: assets/js/04-faq.js
	Description: Accessible single-open FAQ accordion behavior.
	Last modified: 2026-05-30
	Copyright: (c) 2026 mytag.sol Community. All rights reserved.
*/

(function () {
	"use strict";

	var questions = Array.prototype.slice.call(document.querySelectorAll(".faq-q"));

	function closeItem(question) {
		var item = question.closest(".faq-item");
		var answer = item ? item.querySelector(".faq-a") : null;

		question.setAttribute("aria-expanded", "false");

		if (answer) {
			answer.hidden = true;
		}
	}

	function openItem(question) {
		var item = question.closest(".faq-item");
		var answer = item ? item.querySelector(".faq-a") : null;

		question.setAttribute("aria-expanded", "true");

		if (answer) {
			answer.hidden = false;
		}
	}

	questions.forEach(closeItem);

	if (questions[0]) {
		openItem(questions[0]);
	}

	questions.forEach(function (question) {
		question.addEventListener("click", function () {
			var isOpen = question.getAttribute("aria-expanded") === "true";

			questions.forEach(closeItem);

			if (!isOpen) {
				openItem(question);
			}
		});
	});
}());
