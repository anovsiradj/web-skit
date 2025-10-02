globalThis.inputAutozConfig = {
	select2Options: {},
	select2AjaxOptions: {
		delay: 300,
	},
	juiOptions: {
		minLength: 0,
		autoFocus: true,
	},
	searchOnFocus: true,
	selectOnFirst: false,
	selectOnCount: 0,
};

$.fn.inputAutoz = function (newConfig) {
	newConfig ??= {}
	newConfig.ajaxReqParams ??= {}
	let oldConfig = inputAutozConfig
	let config = { ...oldConfig, ...newConfig }
	// dump(config)

	let formElem = this.prop('form')
	let termElem = this.get(0)
	// dump(termElem, formElem)

	if (!formElem || !termElem) {
		console.error('formElem atau termElem kosong!')
		return;
	}

	let ajaxReqHref = termElem.dataset.ajaxReqHref ?? formElem.ajaxReqHref;
	if (empty(ajaxReqHref)) {
		console.error('ajaxReqHref kosong!')
		return
	}

	if (termElem.tagName === 'INPUT') {
		$(termElem).autocomplete({
			...config.juiOptions,
			source: function (request, response) {
				$(termElem).val(request.term)

				let ajaxReqParams = config.ajaxReqParams
				if ($.isFunction(config.ajaxReqParams)) {
					ajaxReqParams = config.ajaxReqParams(request.term)
				}

				$.getJSON(
					ajaxReqHref,
					ajaxReqParams,
					function (result, status, xhr) {
						// dump(result)
						if (config.ajaxResConvert) {
							result = config.ajaxResConvert(result, status, xhr)
						}
						response(result)
					}
				);
			},
			select: function (event, ui) {
				let model = ui.item;
				// dump(model);

				if (config.select) {
					config.select(model, event, ui)
				} else {
					console.info('select() kosong!')
				}

				setTimeout(() => {
					$(termElem).val('')
				}, 0);
			},
			focus: function (event, ui) {
				let $autocomplete = $(this).autocomplete('instance');
				let model = ui.item;
				if (model && this.value === model.value) {
					setTimeout(() => {
						$autocomplete._trigger('select', 'autocompleteselect', {
							item: model,
						});
					}, 0);
				}
			},
		})

		if (config.searchOnFocus) {
			$(termElem).on('focus', function () {
				setTimeout(() => {
					$(this).autocomplete('search', '');
				}, 0);
			})
		}
	}

	if (termElem.tagName === 'SELECT') {
		config.select2Options ??= {}
		config.select2AjaxOptions ??= {}

		$(termElem)
			.select2({
				...config.select2Options,
				ajax: {
					...config.select2AjaxOptions,
					url: ajaxReqHref,
					data: function (params) {
						if ($.isFunction(config.ajaxReqParams)) {
							let output = config.ajaxReqParams(params.term)
							return output
						}
						return params
					},
					processResults: function (params) {
						if ($.isFunction(config.ajaxResConvert)) {
							let output = config.ajaxResConvert(params)
							if (Array.isArray(output)) {
								return { results: output }
							}
							return output
						}
						return params
					},
				}
			})
			.on('select2:select', function (event) {
				let model = event.params.data

				if (config.select) {
					config.select(model, event)
				}
			})
	}
	// ...
};
