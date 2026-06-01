/*
	File: assets/js/01-hero.js
	Description: Interactive hero name preview for external SNS registrar links.
	Last modified: 2026-06-01
	Copyright: (c) 2026 mytag.sol Community. All rights reserved.
*/

(function () {
	"use strict";

	var input = document.getElementById("hero-name-input");
	var inputRow = input ? input.closest(".hero-name-input-row") : null;
	var nameShell = input ? input.closest(".hero-name-shell") : null;
	var nameTool = input ? input.closest(".hero-name-tool") : null;
	var namePreview = document.getElementById("hero-name-preview");
	var suffixLabel = document.getElementById("hero-name-suffix");
	var statusLabel = document.getElementById("hero-name-status");
	var feedbackLabel = document.getElementById("hero-name-feedback");
	var clearButton = document.getElementById("hero-name-clear");
	var registerLink = document.getElementById("hero-register-link");
	var optionRail = document.querySelector(".hero-name-options");
	var optionButtons = Array.prototype.slice.call(document.querySelectorAll(".hero-name-option"));
	var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	var mobileQuery = window.matchMedia ? window.matchMedia("(max-width: 519px)") : null;
	var maxNameLength = mobileQuery && mobileQuery.matches ? 12 : 16;
	var minimumControlWidth = 338;
	var maximumControlWidth = 560;
	var controlChromeWidth = 76;
	var suffixPixelWidth = 0;
	var suffixTimer = 0;
	var currentSuffix = suffixLabel ? suffixLabel.textContent.trim() : "";
	var exampleRound = 0;
	var lastExampleNames = {};
	var personalNames = ["alex", "maya", "sam", "luna", "nova", "kai", "zoe", "aria", "max", "mila", "leo", "nina", "thomas", "ella", "noah", "ava", "tess", "jay", "mina", "zara"];
	var genZNames = ["nova", "kai", "zoe", "aria", "mila", "rio", "zara", "neo", "jax", "kira", "niko", "skye", "luca", "mika", "raya", "mira"];
	var web3Names = ["gm", "wagmi", "og", "hodler", "monke", "degen", "diamond", "ape", "vibe", "legend", "first", "based"];
	var infraNames = ["myvault", "ledger", "myassets", "mybag", "folio"];
	var registrarExamples = [
		{ names: personalNames.concat(["handle", "profile"]), suffix: "mytag.sol", url: "https://v1.sns.id/sub-registrar/mytag" },
		{ names: web3Names, suffix: "gbonk.sol", url: "https://v1.sns.id/sub-registrar/gbonk" },
		{ names: personalNames.concat(["payme", "sendme", "tips"]), suffix: "walletlink.sol", url: "https://v1.sns.id/sub-registrar/walletlink" },
		{ names: personalNames.concat(["myjournal", "diary", "notes"]), suffix: "mystory.sol", url: "https://v1.sns.id/sub-registrar/mystory" },
		{ names: personalNames.concat(["artist", "lilbubble", "legend"]), suffix: "fames.sol", url: "https://v1.sns.id/sub-registrar/fames" },
		{ names: personalNames.concat(["alpha", "builder", "wallet", "solana", "wagmi"]), suffix: "snsclub.sol", url: "https://v1.sns.id/sub-registrar/snsclub" },
		{ names: ["first", "hodler", "diamond", "alpha", "legend", "wagmi", "degen"], suffix: "bonkog.sol", url: "https://v1.sns.id/sub-registrar/bonkog" },
		{ names: web3Names.concat(["moon"]), suffix: "bonktag.sol", url: "https://v1.sns.id/sub-registrar/bonktag" },
		{ names: ["vault", "hodler", "cold", "myledger", "reserve"], suffix: "ogwallet.sol", url: "https://v1.sns.id/sub-registrar/ogwallet" },
		{ names: genZNames.concat(["vibe"]), suffix: "gen-z.sol", url: "https://v1.sns.id/sub-registrar/gen-z" },
		{ names: personalNames.concat(["pro", "first", "gg"]), suffix: "gametag.sol", url: "https://v1.sns.id/sub-registrar/gametag" },
		{ names: personalNames.concat(["pro"]), suffix: "playverse.sol", url: "https://v1.sns.id/sub-registrar/playverse" },
		{ names: personalNames.concat(["artist", "mystudio", "mygallery", "creator"]), suffix: "artistlink.sol", url: "https://v1.sns.id/sub-registrar/artistlink" },
		{ names: ["agent", "myart", "builder", "bot"], suffix: "aicreator.sol", url: "https://v1.sns.id/sub-registrar/aicreator" },
		{ names: personalNames.concat(["myart", "studio", "mycontent"]), suffix: "creatorhub.sol", url: "https://v1.sns.id/sub-registrar/creatorhub" },
		{ names: infraNames, suffix: "assetlink.sol", url: "https://v1.sns.id/sub-registrar/assetlink" },
		{ names: ["mybrand", "mystudio", "founder", "monkebiz", "hq"], suffix: "businesslink.sol", url: "https://v1.sns.id/sub-registrar/businesslink" },
		{ names: ["launch", "founder", "demo", "beta"], suffix: "startuphub.sol", url: "https://v1.sns.id/sub-registrar/startuphub" },
		{ names: ["vote", "newproject", "council", "forum", "proposal"], suffix: "daolink.sol", url: "https://v1.sns.id/sub-registrar/daolink" },
		{ names: ["monke", "ape", "degen", "og", "wenmoon", "wagmi", "diamond", "alpha", "pump", "vibes", "based"], suffix: "memecoinape.sol", url: "https://v1.sns.id/sub-registrar/memecoinape" },
		{ names: ["first", "alpha", "vip", "legend", "monke", "based"], suffix: "ogclub.sol", url: "https://v1.sns.id/sub-registrar/ogclub" }
	];
	var defaultExamples = buildDefaultExamples(exampleRound);
	var examples = defaultExamples.slice();
	var exampleIndex = 0;
	var characterIndex = 0;
	var deleting = false;
	var userTouched = false;
	var userEditedName = false;
	var typingTimer = 0;
	var feedbackTimer = 0;
	var selectTimer = 0;
	var collisionFrame = 0;
	var collisionTimer = 0;
	var pickerMoveTimer = 0;
	var pickerMoving = false;
	var optionTouchStartX = 0;
	var optionTouchStartY = 0;
	var optionTouchTracking = false;
	var optionTouchMoved = false;
	var customName = "";
	var silentInputCleanup = false;
	var suppressNextBlurResume = false;
	var suffixSwitchDelayMs = 220;
	var resumeSlowStart = false;

	if (!input || !suffixLabel || !registerLink || !namePreview) {
		return;
	}

	input.removeAttribute("readonly");
	input.removeAttribute("tabindex");
	input.maxLength = maxNameLength;
	input.setAttribute("aria-invalid", "false");
	syncNamePreview();

	function demoLimitMessage() {
		return "Demo preview limit: " + maxNameLength + " characters here. SNS shows final .sol subdomain rules.";
	}

	function previewRulesMessage() {
		return "Demo preview: use up to " + maxNameLength + " lowercase letters, numbers, and single hyphens. SNS checkout shows the final .sol subdomain length limit and registrar rules.";
	}

	function syncDemoLimit() {
		var nextMaxNameLength = mobileQuery && mobileQuery.matches ? 12 : 16;

		if (nextMaxNameLength === maxNameLength) {
			return;
		}

		maxNameLength = nextMaxNameLength;
		input.maxLength = maxNameLength;

		if (!customName) {
			refreshDefaultExamples();
			syncExampleToCurrentSuffix();
			characterIndex = Math.min(characterIndex, examples[exampleIndex] ? examples[exampleIndex].name.length : maxNameLength);
			setExample(examples[exampleIndex]);
			syncNameState("keep");
			return;
		}

		if (input.value.length > maxNameLength) {
			input.value = sanitizeName(input.value, false);
			syncNameState("limit");
		} else {
			syncNameState("keep");
		}
	}

	function syncNamePreview() {
		namePreview.textContent = input.value || "";
	}

	function syncLiveNameState() {
		if (!nameShell) {
			return;
		}

		nameShell.classList.toggle("has-live-name", Boolean(input.value) && (document.activeElement === input || userEditedName));
	}

	function syncConfirmedNameState() {
		if (!nameShell) {
			return;
		}

		nameShell.classList.toggle("has-custom-name", Boolean(customName));
		nameShell.classList.toggle("is-confirmed-name", Boolean(customName) && document.activeElement !== input);
		syncLiveNameState();
	}

	function lockConfirmedNameState() {
		if (!nameShell || !customName) {
			return;
		}

		nameShell.classList.add("has-custom-name", "is-confirmed-name");
		syncLiveNameState();
	}

	function buildDefaultExamples(round) {
		return registrarExamples.map(function (example, index) {
			var chosenName = chooseExampleName(example, round, index);

			return {
				name: chosenName,
				suffix: example.suffix,
				url: example.url
			};
		});
	}

	function chooseExampleName(example, round, index) {
		var names = example.names.filter(function (name) {
			return name.length <= maxNameLength && cleanName(name) === name;
		});
		var previous = lastExampleNames[example.suffix];
		var randomIndex;
		var selected;

		if (!names.length) {
			return "alex";
		}

		randomIndex = Math.floor(Math.random() * names.length);
		randomIndex = (randomIndex + round + index) % names.length;
		selected = names[randomIndex];

		if (names.length > 1 && selected === previous) {
			selected = names[(randomIndex + 1 + round) % names.length];
		}

		lastExampleNames[example.suffix] = selected;

		return selected;
	}

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
		var availableWidth;
		var baseFontSize;
		var fittedFontSize;
		var nameWidth;
		var scale;
		var targetWidth;

		if (!nameTool) {
			return;
		}

		nameTool.style.removeProperty("--hero-name-font-size");
		nameWidth = measureNameWidth(input.value || "alex");
		targetWidth = Math.ceil(nameWidth + suffixPixelWidth + controlChromeWidth);
		availableWidth = Math.min(maximumControlWidth, Math.floor(nameTool.getBoundingClientRect().width));

		if (targetWidth > availableWidth && input) {
			baseFontSize = parseFloat(window.getComputedStyle(input).fontSize) || 18;
			scale = Math.max(0.84, (availableWidth - controlChromeWidth) / Math.max(1, nameWidth + suffixPixelWidth));
			fittedFontSize = Math.max(14, Math.floor(baseFontSize * scale * 100) / 100);
			nameTool.style.setProperty("--hero-name-font-size", fittedFontSize + "px");
			suffixLabel.style.setProperty("--suffix-width", Math.ceil(suffixPixelWidth * scale) + "px");
			nameTool.style.setProperty("--hero-row-width", availableWidth + "px");
			return;
		}

		targetWidth = Math.max(minimumControlWidth, Math.min(availableWidth, targetWidth));
		suffixLabel.style.setProperty("--suffix-width", suffixPixelWidth + "px");
		nameTool.style.setProperty("--hero-row-width", targetWidth + "px");
	}

	function setFeedback(type, message) {
		var autoHideTypes = ["adjusted", "limit"];

		window.clearTimeout(feedbackTimer);

		if (nameShell) {
			nameShell.classList.toggle("is-adjusted", type === "adjusted" || type === "limit");
			nameShell.classList.toggle("is-invalid", type === "invalid");
		}

		if (feedbackLabel) {
			feedbackLabel.textContent = message || "";
			feedbackLabel.setAttribute("aria-hidden", type ? "false" : "true");
		}

		if (autoHideTypes.indexOf(type) > -1) {
			feedbackTimer = window.setTimeout(function () {
				if (input.getAttribute("aria-invalid") !== "true") {
					setFeedback("", "");
				}
			}, 3400);
		}
	}

	function syncNameState(feedbackMode) {
		var valid = input.value === "" || isValidName(input.value);
		var invalidMessage = input.value.slice(-1) === "-" ?
			"End with a letter or number. SNS checkout shows final registrar rules." :
			"Use lowercase letters, numbers, and single hyphens. This preview is capped at " + maxNameLength + " characters.";

		syncNamePreview();
		syncLiveNameState();
		input.setAttribute("aria-invalid", valid ? "false" : "true");
		input.setAttribute("title", previewRulesMessage());

		if (inputRow) {
			inputRow.classList.toggle("is-invalid", !valid);
		}

		if (statusLabel) {
			statusLabel.textContent = valid ?
				previewRulesMessage() :
				"Name must use lowercase letters, numbers, and single hyphens. This preview is capped at " + maxNameLength + " characters. It cannot start or end with a hyphen.";
		}

		if (!valid) {
			setFeedback("invalid", invalidMessage);
		} else if (feedbackMode === "limit") {
			setFeedback("limit", demoLimitMessage());
		} else if (feedbackMode === "adjusted") {
			setFeedback("adjusted", "Only lowercase letters, numbers, and single hyphens work in this preview.");
		} else if (feedbackMode !== "keep") {
			setFeedback("", "");
		}

		syncControlWidth();
	}

	function setSuffixWidth(suffix) {
		var measure = document.createElement("span");
		var width;

		if (nameTool) {
			nameTool.style.removeProperty("--hero-name-font-size");
		}

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
			button.dataset.rawPosition = String(position);
			button.setAttribute("aria-pressed", isActive ? "true" : "false");
		});

		queuePickerCollisionCheck();
	}

	function restorePickerPositions() {
		optionButtons.forEach(function (button) {
			var rawPosition = Number(button.dataset.rawPosition || button.dataset.position || 0);

			button.dataset.position = String(Math.max(-3, Math.min(3, rawPosition)));
			button.removeAttribute("tabindex");
			button.removeAttribute("aria-hidden");
		});
	}

	function measurePickerLabel(button) {
		var clone;
		var width;

		if (!optionRail || !button) {
			return 0;
		}

		clone = button.cloneNode(true);
		clone.removeAttribute("style");
		clone.style.position = "absolute";
		clone.style.left = "-9999px";
		clone.style.width = "auto";
		clone.style.maxWidth = "none";
		clone.style.visibility = "hidden";
		clone.style.transform = "none";
		optionRail.appendChild(clone);
		width = clone.getBoundingClientRect().width;
		clone.remove();

		return Math.ceil(width);
	}

	function layoutPickerOptions() {
		var activeButton;
		var activeWidth;
		var availableSideWidth;
		var containerWidth;
		var gap;
		var sidePadding;

		if (!optionRail || !optionButtons.length) {
			return;
		}

		activeButton = optionButtons.find(function (button) {
			return Number(button.dataset.position || 0) === 0;
		});

		if (!activeButton) {
			return;
		}

		containerWidth = optionRail.getBoundingClientRect().width;
		gap = Math.max(4, Math.min(6, containerWidth * 0.016));
		sidePadding = 18;
		activeWidth = Math.min(Math.max(measurePickerLabel(activeButton) + 18, 58), Math.max(68, containerWidth * 0.42));
		availableSideWidth = Math.max(28, (containerWidth - activeWidth) / 2 - gap - sidePadding);

		optionButtons.forEach(function (button) {
			var offset = 0;
			var position = Number(button.dataset.position || 0);
			var width = activeWidth;

			if (position === -1) {
				width = availableSideWidth;
				offset = -((activeWidth / 2) + gap + (width / 2));
			} else if (position === 1) {
				width = availableSideWidth;
				offset = (activeWidth / 2) + gap + (width / 2);
			}

			button.style.setProperty("--picker-item-width", width + "px");
			button.style.setProperty("--picker-offset", offset + "px");
		});
	}

	function hidePickerOption(button) {
		var rawPosition = Number(button.dataset.rawPosition || button.dataset.position || 0);

		if (Math.abs(rawPosition) <= 1) {
			return;
		}

		button.dataset.position = rawPosition < 0 ? "-3" : "3";
		button.setAttribute("tabindex", "-1");
		button.setAttribute("aria-hidden", "true");
	}

	function visiblePickerOptions() {
		return optionButtons.filter(function (button) {
			var position = Number(button.dataset.position || 0);

			return Math.abs(position) <= 2;
		}).map(function (button) {
			return {
				button: button,
				position: Number(button.dataset.position || 0),
				rect: button.getBoundingClientRect()
			};
		}).sort(function (a, b) {
			return a.rect.left - b.rect.left;
		});
	}

	function findPickerCollision() {
		var visible = visiblePickerOptions();
		var index;
		var previous;
		var current;
		var minimumGap = 4;

		for (index = 1; index < visible.length; index += 1) {
			previous = visible[index - 1];
			current = visible[index];

			if (previous.rect.right + minimumGap > current.rect.left) {
				return [previous, current];
			}
		}

		return null;
	}

	function pickCollisionHideTarget(collision) {
		var first = collision[0];
		var second = collision[1];
		var firstIsOuter = Math.abs(first.position) > 1;
		var secondIsOuter = Math.abs(second.position) > 1;

		if (!firstIsOuter && !secondIsOuter) {
			return null;
		}

		if (firstIsOuter && !secondIsOuter) {
			return first.button;
		}

		if (secondIsOuter && !firstIsOuter) {
			return second.button;
		}

		if (Math.abs(first.position) > Math.abs(second.position)) {
			return first.button;
		}

		if (Math.abs(second.position) > Math.abs(first.position)) {
			return second.button;
		}

		if (first.position !== 0 && second.position === 0) {
			return first.button;
		}

		if (second.position !== 0 && first.position === 0) {
			return second.button;
		}

		return Math.abs(first.position) >= Math.abs(second.position) ? first.button : second.button;
	}

	function resolvePickerCollisions() {
		restorePickerPositions();
		layoutPickerOptions();
	}

	function queuePickerCollisionCheck() {
		window.cancelAnimationFrame(collisionFrame);
		window.clearTimeout(collisionTimer);
		collisionFrame = window.requestAnimationFrame(resolvePickerCollisions);
	}

	function setExample(example) {
		setRegistrar(example.suffix, example.url);
		input.value = example.name.slice(0, characterIndex);
		syncNameState();
	}

	function setExampleSource(name) {
		customName = cleanName(name);

		syncConfirmedNameState();

		examples = customName ? defaultExamples.map(function (example) {
			return {
				name: customName,
				suffix: example.suffix,
				url: example.url
			};
		}) : defaultExamples.slice();
	}

	function refreshDefaultExamples() {
		var activeSuffix = examples[exampleIndex] ? examples[exampleIndex].suffix : currentSuffix;

		exampleRound += 1;
		defaultExamples = buildDefaultExamples(exampleRound);

		if (!customName) {
			examples = defaultExamples.slice();
			exampleIndex = examples.findIndex(function (example) {
				return example.suffix === activeSuffix;
			});
			exampleIndex = exampleIndex > -1 ? exampleIndex : 0;
		}
	}

	function queueTyping(callback, delay) {
		window.clearTimeout(typingTimer);
		typingTimer = window.setTimeout(callback, delay);
	}

	function clearNamePreview() {
		if (document.activeElement === input) {
			suppressNextBlurResume = true;
			input.blur();
		} else {
			suppressNextBlurResume = false;
		}

		window.clearTimeout(typingTimer);
		input.value = "";
		customName = "";
		userEditedName = false;
		userTouched = false;
		deleting = false;

		if (nameShell) {
			nameShell.classList.remove("has-custom-name", "has-live-name", "is-confirmed-name", "is-invalid", "is-adjusted");
		}

		setExampleSource("");
		syncExampleToCurrentSuffix();
		characterIndex = 0;
		setFeedback("", "");
		syncNameState("keep");
		clearButton.blur();
		queueTyping(tick, 420);
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

	function scrollNameToolIntoView() {
		var rect;
		var target;

		if (!nameTool || window.innerWidth > 720) {
			return;
		}

		function alignTool() {
			rect = nameTool.getBoundingClientRect();
			target = Math.max(0, rect.top + window.scrollY - 18);
			window.scrollTo({
				top: target,
				behavior: reducedMotion ? "auto" : "smooth"
			});
		}

		window.setTimeout(alignTool, 90);
		window.setTimeout(alignTool, 360);
	}

	function scrollTargetIntoView(targetElement) {
		var rect;
		var offset;
		var target;

		if (!targetElement) {
			return;
		}

		rect = targetElement.getBoundingClientRect();
		offset = targetElement.id === "registrar-browser" ? 0 : 18;
		target = Math.max(0, rect.top + window.scrollY - offset);
		window.scrollTo({
			top: target,
			behavior: reducedMotion ? "auto" : "smooth"
		});
	}

	function syncExampleToCurrentSuffix() {
		var activeIndex = examples.findIndex(function (example) {
			return example.suffix === currentSuffix;
		});

		if (activeIndex > -1) {
			exampleIndex = activeIndex;
		}
	}

	function activeOptionIndex() {
		var index = optionButtons.findIndex(function (button) {
			return button.dataset.suffix === currentSuffix;
		});

		return index > -1 ? index : 0;
	}

	function moveRegistrar(direction) {
		var nextIndex = (activeOptionIndex() + direction + optionButtons.length) % optionButtons.length;
		var nextButton = optionButtons[nextIndex];

		if (!nextButton || pickerMoving) {
			return;
		}

		if (document.activeElement === input) {
			input.blur();
		}

		pickerMoving = true;
		window.clearTimeout(pickerMoveTimer);
		pickerMoveTimer = window.setTimeout(function () {
			pickerMoving = false;
		}, 560);
		userTouched = true;
		window.clearTimeout(typingTimer);
		setRegistrar(nextButton.dataset.suffix, nextButton.dataset.url);
		lockConfirmedNameState();
		schedulePreviewResume();
	}

	function schedulePreviewResume(delay) {
		if (document.activeElement === input || reducedMotion) {
			return;
		}

		syncExampleToCurrentSuffix();

		if (customName && nameShell) {
			nameShell.classList.add("is-confirmed-name");
		}

		queueTyping(function () {
			if (document.activeElement === input) {
				return;
			}

			userTouched = false;
			resumeSlowStart = true;

			if (customName) {
				characterIndex = customName.length;
				tick();
				return;
			}

			deleting = true;
			characterIndex = examples[exampleIndex] ? examples[exampleIndex].name.length : 0;
			tick();
		}, delay || 1700);
	}

	function resumeTyping(useCustomInput) {
		setExampleSource(useCustomInput ? input.value : "");
		syncExampleToCurrentSuffix();
		userTouched = false;
		deleting = false;
		characterIndex = customName ? customName.length : 0;

		if (customName) {
			setExample(examples[exampleIndex]);
			userTouched = true;
			schedulePreviewResume(3600);
			return;
		}

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
			syncConfirmedNameState();
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
					if (exampleIndex === 0) {
						refreshDefaultExamples();
					}
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

			speed = resumeSlowStart ? 520 : characterIndex < 4 ? 260 : 116;
			resumeSlowStart = false;
		}

		queueTyping(tick, speed + Math.random() * 30 - 8);
	}

	optionButtons.forEach(function (button) {
		button.addEventListener("click", function () {
			if (pickerMoving && button.dataset.suffix !== currentSuffix) {
				return;
			}

			if (document.activeElement === input) {
				input.blur();
			}

			pickerMoving = true;
			window.clearTimeout(pickerMoveTimer);
			pickerMoveTimer = window.setTimeout(function () {
				pickerMoving = false;
			}, 560);
			userTouched = true;
			window.clearTimeout(typingTimer);
			setRegistrar(button.dataset.suffix, button.dataset.url);
			lockConfirmedNameState();
			schedulePreviewResume();
		});
	});

	if (optionRail) {
		["prev", "next"].forEach(function (direction) {
			var hitButton = document.createElement("button");
			var move = direction === "next" ? 1 : -1;

			hitButton.className = "hero-name-options-hit hero-name-options-hit--" + direction;
			hitButton.type = "button";
			hitButton.setAttribute("aria-label", direction === "next" ? "Show next namespace" : "Show previous namespace");
			hitButton.addEventListener("click", function () {
				moveRegistrar(move);
			});
			optionRail.appendChild(hitButton);
		});

		optionRail.addEventListener("pointerdown", function (event) {
			if (event.pointerType !== "touch") {
				return;
			}

			optionTouchStartX = event.clientX;
			optionTouchStartY = event.clientY;
			optionTouchTracking = true;
			optionTouchMoved = false;
			optionRail.classList.add("is-dragging");
		}, { passive: true });

		optionRail.addEventListener("pointermove", function (event) {
			var deltaX;
			var deltaY;
			var dragX;

			if (!optionTouchTracking || event.pointerType !== "touch") {
				return;
			}

			deltaX = event.clientX - optionTouchStartX;
			deltaY = event.clientY - optionTouchStartY;

			if (Math.abs(deltaY) > Math.abs(deltaX) * 1.25) {
				return;
			}

			optionTouchMoved = Math.abs(deltaX) > 8;
			dragX = Math.max(-34, Math.min(34, deltaX * 0.28));
			optionRail.style.setProperty("--picker-drag-x", dragX + "px");
		}, { passive: true });

		optionRail.addEventListener("pointerup", function (event) {
			var deltaX;
			var deltaY;

			if (!optionTouchTracking || event.pointerType !== "touch") {
				return;
			}

			optionTouchTracking = false;
			optionRail.classList.remove("is-dragging");
			optionRail.style.setProperty("--picker-drag-x", "0px");
			deltaX = event.clientX - optionTouchStartX;
			deltaY = event.clientY - optionTouchStartY;

			if (optionTouchMoved && Math.abs(deltaX) > 30 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
				moveRegistrar(deltaX < 0 ? 1 : -1);
			}
		}, { passive: true });

		optionRail.addEventListener("pointercancel", function () {
			optionTouchTracking = false;
			optionTouchMoved = false;
			optionRail.classList.remove("is-dragging");
			optionRail.style.setProperty("--picker-drag-x", "0px");
		}, { passive: true });
	}

	Array.prototype.slice.call(document.querySelectorAll('a[href^="#"]')).forEach(function (link) {
		link.addEventListener("click", function (event) {
			var hash = link.getAttribute("href");
			var target;

			if (!hash || hash === "#") {
				return;
			}

			try {
				target = document.querySelector(hash);
			} catch {
				return;
			}

			if (!target) {
				return;
			}

			event.preventDefault();
			scrollTargetIntoView(target);
		});
	});

	input.addEventListener("keydown", function (event) {
		if (event.key === "Enter") {
			event.preventDefault();
			input.blur();
		} else if (event.key === "Escape") {
			event.preventDefault();
			input.blur();
		}
	});

	if (inputRow) {
		inputRow.addEventListener("pointerdown", function (event) {
			if (clearButton && clearButton.contains(event.target)) {
				return;
			}

			if (document.activeElement !== input) {
				event.preventDefault();
				input.focus();
				queueInputSelection();
			}
		});
	}

	window.addEventListener("resize", queuePickerCollisionCheck);
	window.addEventListener("resize", syncDemoLimit);

	if (mobileQuery && mobileQuery.addEventListener) {
		mobileQuery.addEventListener("change", syncDemoLimit);
	} else if (mobileQuery && mobileQuery.addListener) {
		mobileQuery.addListener(syncDemoLimit);
	}

	if (document.fonts && document.fonts.ready) {
		document.fonts.ready.then(queuePickerCollisionCheck).catch(function () {});
	}

	input.addEventListener("focus", function () {
		window.clearTimeout(typingTimer);
		userTouched = true;
		userEditedName = false;
		if (nameShell) {
			nameShell.classList.remove("is-confirmed-name");
		}
		syncNameState("keep");
		scrollNameToolIntoView();
		queueInputSelection();
		syncLiveNameState();
	});

	input.addEventListener("beforeinput", function (event) {
		var selectedLength = Math.max(0, input.selectionEnd - input.selectionStart);
		var incoming = event.data || "";
		var nextLength = input.value.length - selectedLength + incoming.length;

		silentInputCleanup = event.inputType === "insertReplacementText" ||
			event.inputType === "insertFromPaste" ||
			event.inputType === "insertFromDrop" ||
			event.inputType === "insertCompositionText" ||
			(event.inputType === "insertText" && incoming.length > 1);

		if (incoming && nextLength > maxNameLength) {
			if (!silentInputCleanup) {
				setFeedback("limit", demoLimitMessage());
			}
		}
	});

	input.addEventListener("input", function () {
		var rawValue = input.value;
		var clean = sanitizeName(rawValue, false);
		var cleanBeforeLimit = rawValue.toLowerCase()
			.replace(/[^a-z0-9-]/gu, "")
			.replace(/-+/gu, "-")
			.replace(/^-+/u, "");
		var hitDemoLimit = cleanBeforeLimit.length > maxNameLength || input.value.length >= maxNameLength;
		var wasAdjusted = rawValue !== clean;
		var wasCaseOnlyAdjustment = rawValue.toLowerCase() === clean;

		userTouched = true;
		userEditedName = true;
		window.clearTimeout(typingTimer);

		if (wasAdjusted) {
			input.value = clean;
		}

		syncNameState(hitDemoLimit && !silentInputCleanup ? "limit" : wasAdjusted && !silentInputCleanup && !wasCaseOnlyAdjustment ? "adjusted" : "");
		silentInputCleanup = false;
	});

	if (clearButton) {
		clearButton.addEventListener("pointerdown", function (event) {
			event.preventDefault();
			clearNamePreview();
		});

		clearButton.addEventListener("click", function (event) {
			event.preventDefault();
			clearNamePreview();
		});
	}

	input.addEventListener("blur", function () {
		if (suppressNextBlurResume) {
			suppressNextBlurResume = false;
			userEditedName = false;
			syncLiveNameState();
			return;
		}

		input.value = cleanName(input.value);
		syncNameState();
		resumeTyping(input.value !== "" && (customName !== "" || userEditedName));
		if (nameShell) {
			nameShell.classList.toggle("is-confirmed-name", Boolean(customName));
		}
		userEditedName = false;
		syncLiveNameState();
	});

	if (reducedMotion) {
		characterIndex = examples[0].name.length;
		setExample(examples[0]);
		return;
	}

	tick();
}());
