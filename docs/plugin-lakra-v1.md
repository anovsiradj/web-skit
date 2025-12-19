# Lakra.js v1 Summary

## Overview
This document summarizes the v1 enhancements to `plugins/lakra.js` focusing on standard Web APIs integration and ergonomics. The main goals were supporting Shadow DOM, automatic directive compilation for dynamically added elements, and avoiding duplicate work.

## Changes Implemented

### 1) Shadow DOM Support
- Compiles directives inside `shadowRoot` when present, enabling encapsulated components to use Lakra bindings.
- Controlled via the `compileShadowRoot` option (default `true`).
- Code: `plugins/lakra.js:223`

### 2) Automatic DOM Observation
- Uses `MutationObserver` to auto-compile:
  - Newly added nodes under the root
  - Attribute changes for Lakra directive attributes
- Controlled via the `observeDom` option (default `true`).
- Attribute filter includes `data-$each`, `data-$iden`, `data-$text`, `data-$html`, `data-$bind`, `data-$attach`, `data-$handle`.
- Code: `plugins/lakra.js:268`

### 3) Duplicate-Compilation Guard
- Prevents repeated compilation with `_lakra_compiled` flag on elements.
- Ensures observer-driven recompilation is idempotent and efficient.
- Code: `plugins/lakra.js:106`

### 4) Configurable Constructor Options
- New signature: `new Lakra(selector, initialState = {}, options = {})`.
- Defaults:
  - `observeDom: true`
  - `compileShadowRoot: true`
- Code: `plugins/lakra.js:24`

### 5) Existing Reactivity Remains
- Proxy-based state reactivity continues to drive updates:
  - Object/array mutations trigger effects
  - Array method interception: `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`
- Code: `plugins/lakra.js:49`
- Effect scheduling: `plugins/lakra.js:80`

## Verification
- Test page: `http://localhost:5080/anoop/web-skit/tests/plugin-lakra.php`
- Dynamic binding check:
  - Programmatically appended `<p data-$text="form.username">` updates immediately after typing.
  - Existing list operations still render correctly and respond to edits/deletions.

## Usage
- Default behavior with observation and Shadow DOM compilation:
  ```js
  new Lakra('#widget', initialState)
  ```
- Disable DOM observation if you prefer manual control:
  ```js
  new Lakra('#widget', initialState, { observeDom: false })
  ```
- Disable Shadow DOM compilation if not needed:
  ```js
  new Lakra('#widget', initialState, { compileShadowRoot: false })
  ```

## Notes
- Observers complement Proxy reactivity:
  - Proxy handles data changes -> UI updates
  - MutationObserver handles dynamic DOM -> directive bootstrapping
- Shadow DOM compilation makes Lakra suitable for web components and encapsulated widgets without breaking scope resolution.

