/**
 * @author anovsiradj
 * @origin app2022_alfon1_web
 * @version 20251002,20230207
 */

$.fn.inputAutozConfig = {
	select2Config: {},
	select2AjaxConfig: {},
	juiConfig: {
		minLength: 1,
		autoFocus: true,
	},
	ajaxDelay: 399,
	formPreventSubmit: true,
	resetOnFocus: true,
	searchOnFocus: true,
	autoSelectFirst: true,
	autoSelectCount: 1,
}

$.fn.inputAutoz = function (newConfig) {
	newConfig ??= {}
	newConfig.ajaxReqParams ??= {}
	let oldConfig = $.fn.inputAutozConfig
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

	if (config.formPreventSubmit) {
		$(formElem).on('submit', (event) => {
			event.preventDefault()
		})
	}

	let ajaxResResultCount = (count) => {
		config.ajaxResResultCount = count
	};

	if (termElem.tagName === 'INPUT') {
		config.juiConfig ??= {}
		config.juiConfig.delay ??= config.ajaxDelay

		$(termElem).autocomplete({
			...config.juiConfig,
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
						ajaxResResultCount(result.length)

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

				if (config.resetOnFocus) {
					setTimeout(() => {
						$(termElem).val('')
						$(termElem).autocomplete('search', '')
					}, 0);
				}
			},
			focus: function (_event, ui) {
				let $autocomplete = $(this).autocomplete('instance');
				let model = ui.item;

				if (!config.autoSelectFirst) {
					return
				}
				if (
					config.autoSelectCount > 0 &&
					config.autoSelectCount !== config.ajaxResResultCount
				) {
					return
				}

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
		config.select2Config ??= {}
		config.select2AjaxConfig ??= {}
		config.select2AjaxConfig.delay ??= config.ajaxDelay

		$(termElem)
			.select2({
				...config.select2Config,
				ajax: {
					...config.select2AjaxConfig,
					url: ajaxReqHref,
					data: function (params) {
						if (isTypeOf(config.ajaxReqParams, 'function')) {
							let output = config.ajaxReqParams(params.term)
							return output
						}
						return params
					},
					processResults: function (result) {
						if (isTypeOf(config.ajaxResConvert, 'function')) {
							result = config.ajaxResConvert(result)
							if (Array.isArray(result)) {
								result = { results: result }
							}
						}
						ajaxResResultCount(result.results.length)

						return result
					},
				}
			})
			.on('select2:select', function (event) {
				let model = event.params.data

				if (config.select) {
					config.select(model, event)
				} else {
					console.info('select() kosong!')
				}
			})
	}

	// ...
};
