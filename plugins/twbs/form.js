
$.fn.formViewOnly = function (config) {
	config ??= {}
	config.disables ??= []
	config.enables ??= []
	config.hides ??= []
	config.shows ??= []
	config.handle ??= $.noop

	this
		.find("[data-viewonly-hide]")
		.each(function () {
			$(this).prop("hidden", true);
		});
	this
		.find("[data-viewonly-show]")
		.each(function () {
			$(this).prop("hidden", false);
		});

	this
		.find(`
			input:not([type="hidden"]),
			input:not([data-viewonly-skip]),
			textarea:not([data-viewonly-skip]),
			select:not([data-viewonly-skip]),
			button:not([data-viewonly-skip])
		`)
		.each(function () {
			$(this).prop("disabled", true);
		});

	config.disables.forEach(function (query) {
		$(query).prop('disabled', true)
	})
	config.enables.forEach(function (query) {
		$(query).prop('disabled', false)
	})

	config.hides.forEach(function (query) {
		$(query).prop('hidden', true)
	})
	config.shows.forEach(function (query) {
		$(query).prop('hidden', false)
	})

	config.handle(this, config)

	return this
};

$.fn.checkboxToggle = function () {
	this.each(function () {
		this.checked = !this.checked;
		$(this).trigger("change");
	});

	return this
};

$.fn.selectOptionClear = function (config) {
	config.withEmptyValue ??= false

	this.each(function () {
		$(this)
			.children()
			.filter(function () {
				if (config.withEmptyValue) return true;
				return this.value !== "";
			})
			.remove();

		$(this).trigger("change");
	});

	return this;
};
