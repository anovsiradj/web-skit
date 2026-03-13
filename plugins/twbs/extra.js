
$(function () {
	/*
		otomatis tooltip
		setiap element hanya-dan-akan-hanya dipanggil sekali,
		setiap eksekusi per-element it will turn off by itself.
		(rename jadi autotip, sebagai canonical).
	*/

	let reversePlacements = {
		bottom: 'top',
		top: 'bottom',
		left: 'right',
		right: 'left',
		auto: 'auto',
	}

	let handle = function () {
		let placements = this.dataset.skitTooltip.split(',').filter(placement => !empty(placement))
		if (empty(placements)) {
			placements.push('auto')
		}
		let placement = placements.shift()

		$(this)
			.removeAttr('data-skit-tooltip') // hapus dari global-event selector
			.off(handle) // disable dari global-event handler

		if (empty(this.title)) {
			return
		}

		let fallbackPlacements;
		fallbackPlacements = (this.dataset.autotipFallbackPlacements || reversePlacements[placement]).split(',')
		fallbackPlacements.push(placement)

		$(this)
			.tooltip({
				placement: placement,
			})
			.tooltip('show')
	};

	$(document.body).on('mouseover', '[data-skit-tooltip]', handle)
})
