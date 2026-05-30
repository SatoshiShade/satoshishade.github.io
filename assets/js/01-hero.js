/*
	File: assets/js/01-hero.js
	Description: Interactive hero name preview for external SNS registrar links.
	Last modified: 2026-05-30
	Copyright: (c) 2026 mytag.sol Community. All rights reserved.
*/

(function () {
	"use strict";

	var input = document.getElementById("hero-name-input");
	var inputRow = input ? input.closest(".hero-name-input-row") : null;
	var nameShell = input ? input.closest(".hero-name-shell") : null;
	var nameTool = input ? input.closest(".hero-name-tool") : null;
	var suffixLabel = document.getElementById("hero-name-suffix");
	var statusLabel = document.getElementById("hero-name-status");
	var feedbackLabel = document.getElementById("hero-name-feedback");
	var registerLink = document.getElementById("hero-register-link");
	var optionButtons = Array.prototype.slice.call(document.querySelectorAll(".hero-name-option"));
	var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	var maxNameLength = 18;
	var minimumControlWidth = 338;
	var maximumControlWidth = 460;
	var controlChromeWidth = 92;
	var suffixPixelWidth = 0;
	var suffixTimer = 0;
	var currentSuffix = suffixLabel ? suffixLabel.textContent.trim() : "";
	var defaultExamples = [
		{ name: "alex", suffix: "mytag.sol", url: "https://v1.sns.id/sub-registrar/mytag" },
		{ name: "gm", suffix: "gbonk.sol", url: "https://v1.sns.id/sub-registrar/gbonk" },
		{ name: "sam", suffix: "walletlink.sol", url: "https://v1.sns.id/sub-registrar/walletlink" },
		{ name: "maya", suffix: "mystory.sol", url: "https://v1.sns.id/sub-registrar/mystory" },
		{ name: "creator", suffix: "fames.sol", url: "https://v1.sns.id/sub-registrar/fames" },
		{ name: "member", suffix: "snsclub.sol", url: "https://v1.sns.id/sub-registrar/snsclub" },
		{ name: "og", suffix: "bonkog.sol", url: "https://v1.sns.id/sub-registrar/bonkog" },
		{ name: "bonk", suffix: "bonktag.sol", url: "https://v1.sns.id/sub-registrar/bonktag" },
		{ name: "holder", suffix: "ogwallet.sol", url: "https://v1.sns.id/sub-registrar/ogwallet" },
		{ name: "zara", suffix: "gen-z.sol", url: "https://v1.sns.id/sub-registrar/gen-z" },
		{ name: "player", suffix: "gametag.sol", url: "https://v1.sns.id/sub-registrar/gametag" },
		{ name: "quest", suffix: "playverse.sol", url: "https://v1.sns.id/sub-registrar/playverse" },
		{ name: "luna", suffix: "artistlink.sol", url: "https://v1.sns.id/sub-registrar/artistlink" },
		{ name: "ai", suffix: "aicreator.sol", url: "https://v1.sns.id/sub-registrar/aicreator" },
		{ name: "studio", suffix: "creatorhub.sol", url: "https://v1.sns.id/sub-registrar/creatorhub" },
		{ name: "vault", suffix: "assetlink.sol", url: "https://v1.sns.id/sub-registrar/assetlink" },
		{ name: "founder", suffix: "businesslink.sol", url: "https://v1.sns.id/sub-registrar/businesslink" },
		{ name: "launch", suffix: "startuphub.sol", url: "https://v1.sns.id/sub-registrar/startuphub" },
		{ name: "vote", suffix: "daolink.sol", url: "https://v1.sns.id/sub-registrar/daolink" },
		{ name: "ape", suffix: "memecoinape.sol", url: "https://v1.sns.id/sub-registrar/memecoinape" },
		{ name: "early", suffix: "ogclub.sol", url: "https://v1.sns.id/sub-registrar/ogclub" }
	];
	var examples = defaultExamples.slice();
	var exampleIndex = 0;
	var characterIndex = 0;
	var deleting = false;
	var userTouched = false;
	var userEditedName = false;
	var typingTimer = 0;
	var feedbackTimer = 0;
	var selectTimer = 0;
	var customName = "";
	var suffixSwitchDelayMs = 220;

	if (!input || !suffixLabel || !registerLink) {
		return;
	}

	input.removeAttribute("readonly");
	input.removeAttribute("tabindex");
	input.maxLength = maxNameLength;
	input.setAttribute("aria-invalid", "false");

	function sanitizeName(value, finalize) {
		var clean = value.toLowerCase()
			.replace(/[^a-z0-9-]/gu, "")
			.replace(/-+/gu, "-")
			.replace(/^-+/u, "")
			.slice(0, maxNameLength);

		if (finalize) {
			clean = clean.replace(/-+$/u, "");
		}

		return clean;
	}

	function cleanName(value) {
		return sanitizeName(value, true);
	}

	function isValidName(value) {
		return value.length > 0 &&
			value.length <= maxNameLength &&
			/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/u.test(value) &&
			!/--/u.test(value);
	}

	function measureNameWidth(value) {
		var measure = document.createElement("span");
		var width;

		measure.className = "name-measure";
		measure.textContent = value || "alex";
		(nameTool || inputRow).appendChild(measure);
		width = measure.getBoundingClientRect().width;
		measure.remove();

		return width;
	}

	function syncControlWidth() {
		var nameWidth;
		var targetWidth;

		if (!nameTool) {
			return;
		}

		nameWidth = measureNameWidth(input.value || "alex");
		targetWidth = Math.ceil(nameWidth + suffixPixelWidth + controlChromeWidth);
		targetWidth = Math.max(minimumControlWidth, Math.min(maximumControlWidth, targetWidth));
		nameTool.style.setProperty("--hero-row-width", targetWidth + "px");
	}

	function setFeedback(type, message) {
		window.clearTimeout(feedbackTimer);

		if (nameShell) {
			nameShell.classList.toggle("is-adjusted", type === "adjusted");
			nameShell.classList.toggle("is-invalid", type === "invalid");
		}

		if (feedbackLabel) {
			feedbackLabel.textContent = message || "";
			feedbackLabel.setAttribute("aria-hidden", type ? "false" : "true");
		}

		if (type === "adjusted") {
			feedbackTimer = window.setTimeout(function () {
				if (input.getAttribute("aria-invalid") !== "true") {
					setFeedback("", "");
				}
			}, 1700);
		}
	}

	function syncNameState(feedbackMode) {
		var valid = input.value === "" || isValidName(input.value);
		var invalidMessage = input.value.slice(-1) === "-" ?
			"End with a letter or number." :
			"Use lowercase letters, numbers, and single hyphens.";

		input.setAttribute("aria-invalid", valid ? "false" : "true");

		if (inputRow) {
			inputRow.classList.toggle("is-invalid", !valid);
		}

		if (statusLabel) {
			statusLabel.textContent = valid ?
				"Use lowercase letters, numbers, and single hyphens. 1 to 18 characters." :
				"Name must use lowercase letters, numbers, and single hyphens. It cannot start or end with a hyphen.";
		}

		if (!valid) {
			setFeedback("invalid", invalidMessage);
		} else if (feedbackMode === "adjusted") {
			setFeedback("adjusted", "Adjusted to lowercase letters, numbers, and hyphens.");
		} else if (feedbackMode !== "keep") {
			setFeedback("", "");
		}

		syncControlWidth();
	}

	function setSuffixWidth(suffix) {
		var measure = document.createElement("span");
		var width;

		measure.className = "suffix-measure";
		measure.textContent = suffix;
		suffixLabel.appendChild(measure);
		width = measure.getBoundingClientRect().width;
		measure.remove();

		suffixPixelWidth = Math.ceil(width + 2);
		suffixLabel.style.setProperty("--suffix-width", suffixPixelWidth + "px");
		syncControlWidth();
	}

	function renderSuffix(suffix) {
		var incoming;
		var outgoing;

		setSuffixWidth(suffix);

		if (suffix === currentSuffix) {
			return;
		}

		currentSuffix = suffix;
		window.clearTimeout(suffixTimer);

		if (reducedMotion) {
			incoming = document.createElement("span");
			incoming.className = "suffix-card is-current";
			incoming.textContent = suffix;
			suffixLabel.textContent = "";
			suffixLabel.appendChild(incoming);
			return;
		}

		outgoing = suffixLabel.lastElementChild;
		incoming = document.createElement("span");
		incoming.className = "suffix-card is-entering";
		incoming.textContent = suffix;

		Array.prototype.slice.call(suffixLabel.children).forEach(function (card) {
			if (card !== outgoing) {
				card.remove();
			}
		});

		if (outgoing) {
			outgoing.className = "suffix-card is-exiting";
		} else {
			suffixLabel.textContent = "";
		}

		suffixLabel.appendChild(incoming);

		suffixTimer = window.setTimeout(function () {
			suffixLabel.textContent = "";
			incoming.className = "suffix-card is-current";
			suffixLabel.appendChild(incoming);
		}, 340);
	}

	function setRegistrar(suffix, url) {
		var activeIndex = optionButtons.findIndex(function (button) {
			return button.dataset.suffix === suffix;
		});

		renderSuffix(suffix);
		registerLink.href = url;
		registerLink.setAttribute("aria-label", "Open " + suffix + " registrar on SNS");

		optionButtons.forEach(function (button) {
			var position;
			var buttonIndex = optionButtons.indexOf(button);
			var isActive = button.dataset.suffix === suffix;

			position = buttonIndex - activeIndex;

			if (position > optionButtons.length / 2) {
				position -= optionButtons.length;
			}

			if (position < optionButtons.length / -2) {
				position += optionButtons.length;
			}

			button.classList.toggle("active", isActive);
			button.dataset.position = String(Math.max(-3, Math.min(3, position)));
			button.setAttribute("aria-pressed", isActive ? "true" : "false");
		});
	}

	function setExample(example) {
		setRegistrar(example.suffix, example.url);
		input.value = example.name.slice(0, characterIndex);
		syncNameState();
	}

	function setExampleSource(name) {
		customName = cleanName(name);

		if (nameShell) {
			nameShell.classList.toggle("has-custom-name", Boolean(customName));
		}

		examples = customName ? defaultExamples.map(function (example) {
			return {
				name: customName,
				suffix: example.suffix,
				url: example.url
			};
		}) : defaultExamples.slice();
	}

	function queueTyping(callback, delay) {
		window.clearTimeout(typingTimer);
		typingTimer = window.setTimeout(callback, delay);
	}

	function queueInputSelection() {
		window.clearTimeout(selectTimer);
		selectTimer = window.setTimeout(function () {
			if (document.activeElement === input && input.value) {
				try {
					input.setSelectionRange(0, input.value.length);
				} catch {
					input.select();
				}
			}
		}, 0);
	}

	function syncExampleToCurrentSuffix() {
		var activeIndex = examples.findIndex(function (example) {
			return example.suffix === currentSuffix;
		});

		if (activeIndex > -1) {
			exampleIndex = activeIndex;
		}
	}

	function resumeTyping(useCustomInput) {
		setExampleSource(useCustomInput ? input.value : "");
		syncExampleToCurrentSuffix();
		userTouched = false;
		deleting = false;
		characterIndex = customName ? customName.length : 0;

		if (reducedMotion) {
			characterIndex = examples[exampleIndex].name.length;
			setExample(examples[exampleIndex]);
			return;
		}

		queueTyping(tick, 260);
	}

	function tick() {
		var current;
		var speed;

		if (userTouched) {
			return;
		}

		current = examples[exampleIndex];

		if (customName) {
			characterIndex = customName.length;
			setExample(current);
			exampleIndex = (exampleIndex + 1) % examples.length;
			queueTyping(tick, 2600);
			return;
		}

		if (deleting) {
			characterIndex -= 1;

			if (characterIndex <= 0) {
				characterIndex = 0;
				deleting = false;
				setExample(current);
				queueTyping(function () {
					exampleIndex = (exampleIndex + 1) % examples.length;
					setExample(examples[exampleIndex]);
					queueTyping(tick, 880);
				}, suffixSwitchDelayMs);
				return;
			}

			setExample(current);
			speed = 52;
		} else {
			characterIndex += 1;
			setExample(current);

			if (characterIndex === current.name.length) {
				queueTyping(function () {
					deleting = true;
					tick();
				}, 3200);
				return;
			}

			speed = characterIndex < 4 ? 260 : 116;
		}

		queueTyping(tick, speed + Math.random() * 30 - 8);
	}

	optionButtons.forEach(function (button) {
		button.addEventListener("click", function () {
			userTouched = true;
			window.clearTimeout(typingTimer);
			setRegistrar(button.dataset.suffix, button.dataset.url);
			input.focus();
			queueInputSelection();
		});
	});

	if (inputRow) {
		inputRow.addEventListener("pointerdown", function (event) {
			if (document.activeElement !== input) {
				event.preventDefault();
				input.focus();
				queueInputSelection();
			}
		});
	}

	input.addEventListener("focus", function () {
		window.clearTimeout(typingTimer);
		userTouched = true;
		userEditedName = false;
		syncNameState("keep");
		queueInputSelection();
	});

	input.addEventListener("input", function () {
		var clean = sanitizeName(input.value, false);
		var wasAdjusted = input.value !== clean;

		userTouched = true;
		userEditedName = true;
		window.clearTimeout(typingTimer);

		if (wasAdjusted) {
			input.value = clean;
		}

		syncNameState(wasAdjusted ? "adjusted" : "");
	});

	input.addEventListener("blur", function () {
		input.value = cleanName(input.value);
		syncNameState();
		resumeTyping(input.value !== "" && (customName !== "" || userEditedName));
		userEditedName = false;
	});

	if (reducedMotion) {
		characterIndex = examples[0].name.length;
		setExample(examples[0]);
		return;
	}

	tick();
}());
