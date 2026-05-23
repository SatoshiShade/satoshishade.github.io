/*
	File: assets/js/01-hero.js
	Description: Typewriter animation for example SNS subdomain tags.
	Last modified: 2026-05-23
	Copyright: © 2026 mytag.sol Community. All rights reserved.
*/

(function () {
	"use strict";

	var line = document.getElementById("typing-line");

	if (!line) {
		return;
	}

	var cursor = document.createElement("span");
	var examples = [
		"alex.mytag.sol",
		"agent.aitag.sol",
		"sarah.mystory.sol",
		"luna.fames.sol",
		"nova.artistlink.sol",
		"pro.gametag.sol",
		"vip.ogclub.sol",
		"jake.ogwallet.sol",
		"tim.bonktag.sol",
		"ai.aicreator.sol",
		"launch.startuphub.sol",
		"project.daolink.sol"
	];
	var exampleIndex = 0;
	var characterIndex = 0;
	var deleting = false;

	cursor.className = "cursor";
	cursor.setAttribute("aria-hidden", "true");
	line.parentNode.appendChild(cursor);

	function renderTag(value) {
		var dotIndex;

		if (!value) {
			line.innerHTML = "&nbsp;";
			return;
		}

		dotIndex = value.indexOf(".");

		if (dotIndex < 0) {
			line.textContent = value;
			return;
		}

		line.innerHTML = value.slice(0, dotIndex + 1) + "<span class=\"highlight-sol\">" + value.slice(dotIndex + 1) + "</span>";
	}

	function tick() {
		var current = examples[exampleIndex];
		var speed;

		if (deleting) {
			characterIndex -= 1;

			if (characterIndex <= 0) {
				characterIndex = 0;
				deleting = false;
				exampleIndex = (exampleIndex + 1) % examples.length;
				renderTag("");
				window.setTimeout(tick, 780);
				return;
			}

			renderTag(current.slice(0, characterIndex));
			speed = 38;
		} else {
			renderTag(current.slice(0, characterIndex + 1));
			characterIndex += 1;

			if (characterIndex === current.length) {
				window.setTimeout(function () {
					deleting = true;
					tick();
				}, 2100);
				return;
			}

			speed = characterIndex < 4 ? 220 : 92;
		}

		window.setTimeout(tick, speed + Math.random() * 26 - 8);
	}

	tick();
}());
