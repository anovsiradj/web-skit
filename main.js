/**
 * @author anovsiradj
 * @version 2025,2013
 */

globalThis.dumpType ??= 'debug'
globalThis.dump = function () {
	Array.from(arguments).forEach(i => console[dumpType](i))
};

globalThis.isEmptyConfig ??= {
	falseIsEmpty: true,
}
globalThis.isEmpty = function () {
	return Array.from(arguments).every(e => {
		if (Object.is(e, null)) {
			return true
		}
		if (Object.is(e, globalThis.undefined)) {
			return true
		}
		// ditaruh disini, karena instance dari element juga termasuk object.
		if (globalThis.Element && e instanceof globalThis.Element) {
			return false;
		}
		if (typeof e === 'boolean' && e == false && globalThis?.isEmptyConfig?.falseIsEmpty) {
			return true
		}
		if (typeof e === 'string' && e.length === 0) {
			return true
		}
		if (Array.isArray(e) && e.length === 0) {
			return true
		}
		if (typeof e === 'object') {
			if (Object.keys(e).length === 0) {
				return true
			}
		}
		return false
	})
};

globalThis.isValue = function () {
	return Array.from(arguments).every(e => {
		if (Object.is(e, null)) {
			return false
		}
		if (Object.is(e, undefined)) {
			return false
		}
		return true
	})
};

globalThis.isTypeOf = function (data, type) {
	return (typeof data === type)
};
