/*
	File: assets/js/03-browser-section.js
	Description: Registrar search, category filters, and show-more controls.
	Last modified: 2026-05-23
	Copyright: (c) 2026 mytag.sol Community. All rights reserved.
*/

(function () {
	"use strict";

	var controls = document.getElementById("browser-controls");
	var grid = document.getElementById("browser-grid");
	var cards;
	var searchInput;
	var clearButton;
	var emptyMessage;
	var countMessage;
	var filterButtons;
	var moreWrap;
	var moreButton;
	var lessButton;
	var activeFilter = "all";
	var searchValue = "";
	var initialLimit = 8;
	var showAll = false;
	var searchTimer;
	var searchDelayMs = 180;
	var scrollBackDelayMs = 40;
	var featuredRanks = {
		gbonk: 10,
		mytag: 9,
		ogclub: 8,
		bonkog: 7,
		mystory: 6,
		bonktag: 5
	};

	if (controls) {
		controls.style.display = "flex";
	}

	if (!grid) {
		return;
	}

	cards = Array.prototype.slice.call(grid.querySelectorAll(".bc"));
	cards.sort(function (a, b) {
		var rankA = featuredRanks[a.dataset.name] || 0;
		var rankB = featuredRanks[b.dataset.name] || 0;

		if (rankA !== rankB) {
			return rankB - rankA;
		}

		return a.dataset.name.localeCompare(b.dataset.name);
	});

	cards.forEach(function (card) {
		if (featuredRanks[card.dataset.name]) {
			card.classList.add("bc-featured");
		}

		grid.appendChild(card);
	});

	searchInput = document.getElementById("domain-search");
	clearButton = document.getElementById("search-clear");
	emptyMessage = document.getElementById("browser-empty");
	countMessage = document.getElementById("browser-count");
	filterButtons = Array.prototype.slice.call(document.querySelectorAll(".filter-pill"));
	moreWrap = document.getElementById("browser-more-wrap");
	moreButton = document.getElementById("browser-more-btn");
	lessButton = document.getElementById("browser-less-btn");

	function normalize(value) {
		return value.toLowerCase().trim().replace(/\.sol$/u, "");
	}

	function matchesCard(card) {
		var query = normalize(searchValue);
		var categoryMatches = activeFilter === "all" || card.dataset.cat === activeFilter;
		var nameMatches = !query || card.dataset.name.indexOf(query) > -1 || card.dataset.cat.indexOf(query) > -1;

		return categoryMatches && nameMatches;
	}

	function cardMatchesSearch(card, query) {
		return !query || card.dataset.name.indexOf(query) > -1 || card.dataset.cat.indexOf(query) > -1;
	}

	function setActiveFilter(nextFilter) {
		var targetButton;

		activeFilter = nextFilter;
		targetButton = filterButtons.find(function (button) {
			return button.dataset.filter === nextFilter;
		});

		filterButtons.forEach(function (button) {
			button.classList.toggle("active", button === targetButton);
		});
	}

	function maybeSwitchFilterForSearch() {
		var query = normalize(searchValue);
		var allMatches;
		var firstCategory;
		var singleCategory;

		if (!query) {
			return;
		}

		allMatches = cards.filter(function (card) {
			return cardMatchesSearch(card, query);
		});

		if (allMatches.length === 0) {
			return;
		}

		firstCategory = allMatches[0].dataset.cat;
		singleCategory = allMatches.every(function (card) {
			return card.dataset.cat === firstCategory;
		});

		setActiveFilter(singleCategory ? firstCategory : "all");
	}

	function updateMoreControls(matchedCount, limited) {
		var needsButtons = matchedCount > initialLimit;

		if (!moreWrap) {
			return;
		}

		moreWrap.style.display = needsButtons ? "flex" : "none";

		if (moreButton) {
			moreButton.style.display = limited ? "inline-flex" : "none";
			moreButton.textContent = "Show " + (matchedCount - initialLimit) + " More";
		}

		if (lessButton) {
			lessButton.style.display = !limited && needsButtons ? "inline-flex" : "none";
		}
	}

	function updateCount(matchedCount, visibleCount) {
		var label;

		if (!countMessage) {
			return;
		}

		label = cards.length === 1 ? "registrar" : "registrars";

		if (matchedCount === cards.length) {
			countMessage.textContent = "Showing " + visibleCount + " of " + cards.length + " " + label + ".";
			return;
		}

		countMessage.textContent = "Showing " + visibleCount + " matches from " + cards.length + " " + label + ".";
	}

	function update() {
		var matched = cards.filter(matchesCard);
		var limited = !showAll && matched.length > initialLimit;
		var visible = limited ? matched.slice(0, initialLimit) : matched;

		cards.forEach(function (card) {
			card.classList.add("bc-filtering");
		});

		cards.forEach(function (card) {
			card.classList.add("bc-hidden");
		});

		visible.forEach(function (card) {
			card.classList.remove("bc-hidden");
		});

		window.setTimeout(function () {
			window.requestAnimationFrame(function () {
				visible.forEach(function (card) {
					card.classList.remove("bc-filtering");
				});
			});
		}, 24);

		updateMoreControls(matched.length, limited);
		updateCount(matched.length, visible.length);

		if (emptyMessage) {
			emptyMessage.hidden = matched.length > 0;
		}
	}

	function scrollToFinder() {
		var section = grid.closest(".browser-section");

		if (!section) {
			return;
		}

		window.setTimeout(function () {
			section.scrollIntoView({
				behavior: "smooth",
				block: "start"
			});
		}, scrollBackDelayMs);
	}

	filterButtons.forEach(function (button) {
		button.addEventListener("click", function () {
			setActiveFilter(button.dataset.filter);
			showAll = false;
			update();
		});
	});

	if (searchInput) {
		searchInput.addEventListener("input", function () {
			searchValue = searchInput.value;

			if (clearButton) {
				clearButton.hidden = !searchValue;
			}

			window.clearTimeout(searchTimer);
			searchTimer = window.setTimeout(function () {
				showAll = false;
				maybeSwitchFilterForSearch();
				update();
			}, searchDelayMs);
		});
	}

	if (clearButton) {
		clearButton.addEventListener("click", function () {
			searchValue = "";

			if (searchInput) {
				searchInput.value = "";
				searchInput.focus();
			}

			window.clearTimeout(searchTimer);
			clearButton.hidden = true;
			showAll = false;
			update();
		});
	}

	if (moreButton) {
		moreButton.addEventListener("click", function () {
			showAll = true;
			update();
		});
	}

	if (lessButton) {
		lessButton.addEventListener("click", function () {
			showAll = false;
			update();
			scrollToFinder();
		});
	}

	update();
}());
