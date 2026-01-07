
(($) => {
	let segmens = [
		'thead',
		'tbody',
		'tfoot',
	];

	function diagonStuck($table, aligns) {
		$table.find('tr').each(function () {
			let row = this
			let widths = {}

			$(row).children().each(function () {
				let box = this
				let index = box.dataset.stuckIndex ?? box.cellIndex

				let align = aligns[index]
				if (!align) {
					return
				}
				let width = widths[align] ??= 0

				$(this).css(align, `${width}px`)
				$(this).addClass(`stuck stuck-${align}`)

				widths[align] += Math.ceil($(this).outerWidth())
			})
		})
	}

	function segmenStuck($segmen, align) {
		$segmen.css(align, `0px`)
		$segmen.addClass(`stuck stuck-${align}`)
	}

	$.fn.tableStuck = function (config) {
		let $table = this

		segmens.forEach(segmen => {
			config[segmen] ??= {}

			if (config.cols) {
				config[segmen].cols ??= config.cols
			}
			if (config.rows) {
				config[segmen].rows ??= config.rows
			}

			if (config[segmen].cols) {
				diagonStuck($table.children(segmen), config[segmen].cols)
			}
			if (config[segmen].rows) {
				diagonStuck($table.children(segmen), config[segmen].rows)
			}

			// khusus untuk segmen thead/tfoot
			if (config[segmen].stuck) {
				segmenStuck($table.children(segmen), config[segmen].stuck)
			}
		})


		$table.addClass('stuck')

		/*
		$table.each(function () {
			let left = 0;
			$(this).children('.table-stuck').each(function () {
				$(this).css('left', `${left}px`)
				left += Math.ceil($(this).outerWidth())
			})
		})
		*/
	};
})(jQuery)
