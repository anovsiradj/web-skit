/**
 * jQuery React
 * 
 * aku lupa tujuan bikin plugin ini
 * 
 * @author anovsiradj
 * @origin jeemce_sigap_forge
 * @version 20251024,20230911
 */

(($) => {
	class React {
		data = {};
		sets = {};
		gets = {};
		refs = {};

		constructor(element, options) {
			this.element = $(element);
			Object.assign(this, options);

			this.element.find(`[data-react]`).each((_index, element) => {
				this.refs[element.dataset.react] = element;
			});
		}

		get(key) {
			if (key in this.gets) {
				this.gets[key].call(this);
			}
			return this.data[key];
		}

		set(key, val) {
			this.data[key] = val;
			if (key in this.sets) {
				this.sets[key].call(this, val);
			}
		}
	}

	$.fn.react = function () {
		if (arguments.length === 1 && $.isPlainObject(arguments[0])) {
			let react = this.data('react')
			if (!react) {
				react = new React(this, arguments[0]);
				this.data('react', react);
			}
			return react;
		} else if (arguments.length === 1) {
			return this.data('react').get(arguments[0]);
		} else if (arguments.length === 2) {
			return this.data('react').set(arguments[0], arguments[1]);
		}
		return this.data('react');
	};
})(jQuery);
