/**
 * v5-dark-mode-toggle.js — Color mode toggler for Bootstrap docs
 * Copyright 2011-2025 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 *
 * @link https://getbootstrap.com/docs/5.3/assets/js/color-modes.js
 */

(function () {
	'use strict'

	const getStoredTheme = () => localStorage.getItem('theme')
	const setStoredTheme = theme => localStorage.setItem('theme', theme)

	const defaultTheme = (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

	const getPreferredTheme = () => {
		const storedTheme = getStoredTheme()
		if (storedTheme) {
			return storedTheme
		}

		return defaultTheme
	}

	const setTheme = theme => {
		if (theme === 'auto') {
			document.documentElement.setAttribute('data-bs-theme', defaultTheme)
		} else {
			document.documentElement.setAttribute('data-bs-theme', theme)
		}
	}

	setTheme(getPreferredTheme())

	const showActiveTheme = (theme, focus = false) => {
		const themeSwitcher = document.querySelector('#bd-theme')
		const themeSwitcherText = document.querySelector('#bd-theme-text')
		const activeThemeIcon = document.querySelector('.theme-icon-active')
		const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`)

		const iconEl = btnToActive.querySelector('i')
		const iconClass = Array.from(iconEl.classList).find(c => c !== 'bi' && c.startsWith('bi-'))

		document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
			element.classList.remove('active')
			element.setAttribute('aria-pressed', 'false')
		})

		btnToActive.classList.add('active')
		btnToActive.setAttribute('aria-pressed', 'true')
		activeThemeIcon.className = `bi ${iconClass} d-inline-block align-middle fs-5 lh-1 theme-icon-active`
		const themeSwitcherLabel = `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})`
		themeSwitcher.setAttribute('aria-label', themeSwitcherLabel)

		if (focus) themeSwitcher.focus()
	}

	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
		const storedTheme = getStoredTheme()
		if (storedTheme !== 'light' && storedTheme !== 'dark') {
			setTheme(getPreferredTheme())
		}
	})

	window.addEventListener('DOMContentLoaded', () => {
		showActiveTheme(getPreferredTheme())

		document.querySelectorAll('[data-bs-theme-value]').forEach(toggle => {
			toggle.addEventListener('click', () => {
				const theme = toggle.getAttribute('data-bs-theme-value')
				setStoredTheme(theme)
				setTheme(theme)
				showActiveTheme(theme, true)
			})
		})
	})
})()
